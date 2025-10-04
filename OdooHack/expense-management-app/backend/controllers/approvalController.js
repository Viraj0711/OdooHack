const { ExpenseApproval, Expense, User, ApprovalWorkflow } = require('../models');
const { Op } = require('sequelize');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { createAuditTrail } = require('../services/auditService');

// @desc    Get pending approvals for current user
// @route   GET /api/approvals
// @access  Private (Manager/Admin)
const getPendingApprovals = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const { count, rows: approvals } = await ExpenseApproval.findAndCountAll({
    where: {
      approverId: req.user.id,
      status: 'pending',
    },
    include: [
      {
        model: Expense,
        as: 'expense',
        include: [
          {
            model: User,
            as: 'submittedBy',
            attributes: ['id', 'firstName', 'lastName', 'email', 'department'],
          },
        ],
      },
      {
        model: ApprovalWorkflow,
        as: 'workflow',
      },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'ASC']], // Oldest first
  });

  res.json({
    success: true,
    data: {
      approvals,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    },
  });
});

// @desc    Approve or reject expense
// @route   POST /api/approvals/:id/decision
// @access  Private (Manager/Admin)
const makeApprovalDecision = asyncHandler(async (req, res) => {
  const { decision, comments } = req.body; // decision: 'approved' or 'rejected'

  const approval = await ExpenseApproval.findOne({
    where: {
      id: req.params.id,
      approverId: req.user.id,
      status: 'pending',
    },
    include: [
      {
        model: Expense,
        as: 'expense',
        include: [
          {
            model: User,
            as: 'submittedBy',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        ],
      },
      {
        model: ApprovalWorkflow,
        as: 'workflow',
      },
    ],
  });

  if (!approval) {
    return res.status(404).json({
      success: false,
      message: 'Approval not found or already processed',
    });
  }

  const oldValues = {
    status: approval.status,
    comments: approval.comments,
  };

  // Update approval record
  await approval.update({
    status: decision,
    comments,
    approvedAt: new Date(),
  });

  // Create audit trail
  await createAuditTrail({
    action: `${decision.toUpperCase()}_EXPENSE`,
    tableName: 'expense_approvals',
    recordId: approval.id,
    oldValues,
    newValues: { status: decision, comments },
    userId: req.user.id,
    companyId: req.user.companyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
    metadata: {
      expenseId: approval.expense.id,
      expenseTitle: approval.expense.title,
      expenseAmount: approval.expense.amount,
    },
  });

  // Check if this decision affects the overall expense status
  await updateExpenseApprovalStatus(approval.expense, approval.workflow);

  // Notify the submitter via socket
  const io = req.app.get('io');
  io.to(`user_${approval.expense.submittedById}`).emit('expense_status_update', {
    expenseId: approval.expense.id,
    status: decision,
    approver: {
      id: req.user.id,
      name: req.user.getFullName(),
    },
    comments,
  });

  res.json({
    success: true,
    message: `Expense ${decision} successfully`,
    data: { approval },
  });
});

// Helper function to update expense status based on approval workflow
const updateExpenseApprovalStatus = async (expense, workflow) => {
  const allApprovals = await ExpenseApproval.findAll({
    where: { expenseId: expense.id },
  });

  const approvedCount = allApprovals.filter(a => a.status === 'approved').length;
  const rejectedCount = allApprovals.filter(a => a.status === 'rejected').length;
  const totalApprovers = allApprovals.length;

  let newStatus = expense.status;

  if (workflow && workflow.rules) {
    const { type, percentage, overrideApprovers, hybridCondition } = workflow.rules;

    switch (type) {
      case 'percentage':
        const requiredApprovals = Math.ceil((percentage / 100) * totalApprovers);
        if (approvedCount >= requiredApprovals) {
          newStatus = 'approved';
        } else if (rejectedCount > 0) {
          newStatus = 'rejected';
        }
        break;

      case 'override':
        // Check if any override approver has approved
        const overrideApproval = allApprovals.find(a => 
          overrideApprovers.includes(a.approverId) && a.status === 'approved'
        );
        if (overrideApproval) {
          newStatus = 'approved';
        } else if (rejectedCount > 0) {
          newStatus = 'rejected';
        }
        break;

      case 'hybrid':
        const requiredPercentage = Math.ceil((percentage / 100) * totalApprovers);
        const overrideApproved = allApprovals.some(a => 
          overrideApprovers.includes(a.approverId) && a.status === 'approved'
        );

        if (hybridCondition === 'OR') {
          if (approvedCount >= requiredPercentage || overrideApproved) {
            newStatus = 'approved';
          } else if (rejectedCount > 0) {
            newStatus = 'rejected';
          }
        } else if (hybridCondition === 'AND') {
          if (approvedCount >= requiredPercentage && overrideApproved) {
            newStatus = 'approved';
          } else if (rejectedCount > 0) {
            newStatus = 'rejected';
          }
        }
        break;

      default:
        // Default: all approvers must approve
        if (approvedCount === totalApprovers) {
          newStatus = 'approved';
        } else if (rejectedCount > 0) {
          newStatus = 'rejected';
        }
    }
  } else {
    // Default workflow: all approvers must approve
    if (approvedCount === totalApprovers) {
      newStatus = 'approved';
    } else if (rejectedCount > 0) {
      newStatus = 'rejected';
    }
  }

  // Update expense status if it changed
  if (newStatus !== expense.status) {
    await expense.update({
      status: newStatus,
      approvedAt: newStatus === 'approved' ? new Date() : null,
    });

    // Create audit trail for expense status change
    await createAuditTrail({
      action: 'UPDATE_EXPENSE_STATUS',
      tableName: 'expenses',
      recordId: expense.id,
      oldValues: { status: expense.status },
      newValues: { status: newStatus },
      companyId: expense.companyId,
      metadata: {
        reason: 'Approval workflow completion',
        approvedCount,
        rejectedCount,
        totalApprovers,
      },
    });
  }
};

// @desc    Get approval workflows
// @route   GET /api/approvals/workflows
// @access  Private (Admin)
const getApprovalWorkflows = asyncHandler(async (req, res) => {
  const workflows = await ApprovalWorkflow.findAll({
    where: { companyId: req.user.companyId },
    order: [['priority', 'ASC']],
  });

  res.json({
    success: true,
    data: { workflows },
  });
});

// @desc    Create approval workflow
// @route   POST /api/approvals/workflows
// @access  Private (Admin)
const createApprovalWorkflow = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    conditions,
    rules,
    approvers,
    priority,
  } = req.body;

  const workflow = await ApprovalWorkflow.create({
    name,
    description,
    conditions,
    rules,
    approvers,
    priority: priority || 1,
    companyId: req.user.companyId,
  });

  // Create audit trail
  await createAuditTrail({
    action: 'CREATE_WORKFLOW',
    tableName: 'approval_workflows',
    recordId: workflow.id,
    newValues: { name, description, conditions, rules, approvers, priority },
    userId: req.user.id,
    companyId: req.user.companyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(201).json({
    success: true,
    message: 'Approval workflow created successfully',
    data: { workflow },
  });
});

// @desc    Update approval workflow
// @route   PUT /api/approvals/workflows/:id
// @access  Private (Admin)
const updateApprovalWorkflow = asyncHandler(async (req, res) => {
  const workflow = await ApprovalWorkflow.findOne({
    where: {
      id: req.params.id,
      companyId: req.user.companyId,
    },
  });

  if (!workflow) {
    return res.status(404).json({
      success: false,
      message: 'Workflow not found',
    });
  }

  const oldValues = workflow.toJSON();
  const updatedWorkflow = await workflow.update(req.body);

  // Create audit trail
  await createAuditTrail({
    action: 'UPDATE_WORKFLOW',
    tableName: 'approval_workflows',
    recordId: workflow.id,
    oldValues,
    newValues: req.body,
    userId: req.user.id,
    companyId: req.user.companyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({
    success: true,
    message: 'Workflow updated successfully',
    data: { workflow: updatedWorkflow },
  });
});

// @desc    Delete approval workflow
// @route   DELETE /api/approvals/workflows/:id
// @access  Private (Admin)
const deleteApprovalWorkflow = asyncHandler(async (req, res) => {
  const workflow = await ApprovalWorkflow.findOne({
    where: {
      id: req.params.id,
      companyId: req.user.companyId,
    },
  });

  if (!workflow) {
    return res.status(404).json({
      success: false,
      message: 'Workflow not found',
    });
  }

  const oldValues = workflow.toJSON();
  await workflow.destroy();

  // Create audit trail
  await createAuditTrail({
    action: 'DELETE_WORKFLOW',
    tableName: 'approval_workflows',
    recordId: workflow.id,
    oldValues,
    userId: req.user.id,
    companyId: req.user.companyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({
    success: true,
    message: 'Workflow deleted successfully',
  });
});

module.exports = {
  getPendingApprovals,
  makeApprovalDecision,
  getApprovalWorkflows,
  createApprovalWorkflow,
  updateApprovalWorkflow,
  deleteApprovalWorkflow,
};