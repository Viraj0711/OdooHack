const { Expense, User, ExpenseApproval, AuditTrail } = require('../models');
const { Op, sequelize } = require('sequelize');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get expense analytics
// @route   GET /api/analytics/expenses
// @access  Private (Admin/Manager)
const getExpenseAnalytics = asyncHandler(async (req, res) => {
  const {
    startDate,
    endDate,
    groupBy = 'month', // 'day', 'week', 'month', 'year'
    category,
    status,
    userId,
  } = req.query;

  const whereCondition = { companyId: req.user.companyId };

  // Date range filter
  if (startDate && endDate) {
    whereCondition.expenseDate = {
      [Op.between]: [startDate, endDate],
    };
  }

  // Additional filters
  if (category) whereCondition.category = category;
  if (status) whereCondition.status = status;
  if (userId) whereCondition.submittedById = userId;

  // Build group by clause based on the groupBy parameter
  let dateFormat;
  switch (groupBy) {
    case 'day':
      dateFormat = '%Y-%m-%d';
      break;
    case 'week':
      dateFormat = '%Y-%u';
      break;
    case 'month':
      dateFormat = '%Y-%m';
      break;
    case 'year':
      dateFormat = '%Y';
      break;
    default:
      dateFormat = '%Y-%m';
  }

  const expensesByPeriod = await Expense.findAll({
    where: whereCondition,
    attributes: [
      [sequelize.fn('DATE_FORMAT', sequelize.col('expenseDate'), dateFormat), 'period'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('SUM', sequelize.col('amountInBaseCurrency')), 'totalAmount'],
      [sequelize.fn('AVG', sequelize.col('amountInBaseCurrency')), 'averageAmount'],
    ],
    group: [sequelize.fn('DATE_FORMAT', sequelize.col('expenseDate'), dateFormat)],
    order: [['period', 'ASC']],
    raw: true,
  });

  // Expenses by category
  const expensesByCategory = await Expense.findAll({
    where: whereCondition,
    attributes: [
      'category',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('SUM', sequelize.col('amountInBaseCurrency')), 'totalAmount'],
    ],
    group: ['category'],
    raw: true,
  });

  // Expenses by status
  const expensesByStatus = await Expense.findAll({
    where: whereCondition,
    attributes: [
      'status',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('SUM', sequelize.col('amountInBaseCurrency')), 'totalAmount'],
    ],
    group: ['status'],
    raw: true,
  });

  // Top spenders
  const topSpenders = await Expense.findAll({
    where: whereCondition,
    attributes: [
      'submittedById',
      [sequelize.fn('COUNT', sequelize.col('Expense.id')), 'expenseCount'],
      [sequelize.fn('SUM', sequelize.col('amountInBaseCurrency')), 'totalAmount'],
    ],
    include: [
      {
        model: User,
        as: 'submittedBy',
        attributes: ['firstName', 'lastName', 'department'],
      },
    ],
    group: ['submittedById', 'submittedBy.id'],
    order: [[sequelize.fn('SUM', sequelize.col('amountInBaseCurrency')), 'DESC']],
    limit: 10,
  });

  // Summary statistics
  const summary = await Expense.findOne({
    where: whereCondition,
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalCount'],
      [sequelize.fn('SUM', sequelize.col('amountInBaseCurrency')), 'totalAmount'],
      [sequelize.fn('AVG', sequelize.col('amountInBaseCurrency')), 'averageAmount'],
      [sequelize.fn('MIN', sequelize.col('amountInBaseCurrency')), 'minAmount'],
      [sequelize.fn('MAX', sequelize.col('amountInBaseCurrency')), 'maxAmount'],
    ],
    raw: true,
  });

  res.json({
    success: true,
    data: {
      summary: {
        totalCount: parseInt(summary.totalCount) || 0,
        totalAmount: parseFloat(summary.totalAmount) || 0,
        averageAmount: parseFloat(summary.averageAmount) || 0,
        minAmount: parseFloat(summary.minAmount) || 0,
        maxAmount: parseFloat(summary.maxAmount) || 0,
      },
      expensesByPeriod: expensesByPeriod.map(item => ({
        period: item.period,
        count: parseInt(item.count),
        totalAmount: parseFloat(item.totalAmount),
        averageAmount: parseFloat(item.averageAmount),
      })),
      expensesByCategory: expensesByCategory.map(item => ({
        category: item.category,
        count: parseInt(item.count),
        totalAmount: parseFloat(item.totalAmount),
      })),
      expensesByStatus: expensesByStatus.map(item => ({
        status: item.status,
        count: parseInt(item.count),
        totalAmount: parseFloat(item.totalAmount),
      })),
      topSpenders: topSpenders.map(item => ({
        userId: item.submittedById,
        name: `${item.submittedBy.firstName} ${item.submittedBy.lastName}`,
        department: item.submittedBy.department,
        expenseCount: parseInt(item.dataValues.expenseCount),
        totalAmount: parseFloat(item.dataValues.totalAmount),
      })),
    },
  });
});

// @desc    Get approval analytics
// @route   GET /api/analytics/approvals
// @access  Private (Admin/Manager)
const getApprovalAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const whereCondition = {};

  // Include expense condition to filter by company
  const includeCondition = {
    model: Expense,
    as: 'expense',
    where: { companyId: req.user.companyId },
    attributes: [],
  };

  if (startDate && endDate) {
    whereCondition.createdAt = {
      [Op.between]: [startDate, endDate],
    };
  }

  // Approval times (average time to approve)
  const approvalTimes = await ExpenseApproval.findAll({
    where: {
      ...whereCondition,
      status: 'approved',
      approvedAt: { [Op.not]: null },
    },
    attributes: [
      [sequelize.fn('AVG', 
        sequelize.literal('TIMESTAMPDIFF(HOUR, ExpenseApproval.createdAt, ExpenseApproval.approvedAt)')
      ), 'averageHours'],
      [sequelize.fn('MIN', 
        sequelize.literal('TIMESTAMPDIFF(HOUR, ExpenseApproval.createdAt, ExpenseApproval.approvedAt)')
      ), 'minHours'],
      [sequelize.fn('MAX', 
        sequelize.literal('TIMESTAMPDIFF(HOUR, ExpenseApproval.createdAt, ExpenseApproval.approvedAt)')
      ), 'maxHours'],
    ],
    include: [includeCondition],
    raw: true,
  });

  // Approvals by status
  const approvalsByStatus = await ExpenseApproval.findAll({
    where: whereCondition,
    attributes: [
      'status',
      [sequelize.fn('COUNT', sequelize.col('ExpenseApproval.id')), 'count'],
    ],
    include: [includeCondition],
    group: ['status'],
    raw: true,
  });

  // Top approvers
  const topApprovers = await ExpenseApproval.findAll({
    where: whereCondition,
    attributes: [
      'approverId',
      [sequelize.fn('COUNT', sequelize.col('ExpenseApproval.id')), 'approvalCount'],
    ],
    include: [
      includeCondition,
      {
        model: User,
        as: 'approver',
        attributes: ['firstName', 'lastName', 'role'],
      },
    ],
    group: ['approverId', 'approver.id'],
    order: [[sequelize.fn('COUNT', sequelize.col('ExpenseApproval.id')), 'DESC']],
    limit: 10,
  });

  // Approval efficiency (approved vs rejected ratio)
  const approvalEfficiency = await ExpenseApproval.findAll({
    where: whereCondition,
    attributes: [
      'approverId',
      'status',
      [sequelize.fn('COUNT', sequelize.col('ExpenseApproval.id')), 'count'],
    ],
    include: [
      includeCondition,
      {
        model: User,
        as: 'approver',
        attributes: ['firstName', 'lastName'],
      },
    ],
    group: ['approverId', 'status', 'approver.id'],
    raw: true,
  });

  res.json({
    success: true,
    data: {
      approvalTimes: {
        averageHours: parseFloat(approvalTimes[0]?.averageHours) || 0,
        minHours: parseFloat(approvalTimes[0]?.minHours) || 0,
        maxHours: parseFloat(approvalTimes[0]?.maxHours) || 0,
      },
      approvalsByStatus: approvalsByStatus.map(item => ({
        status: item.status,
        count: parseInt(item.count),
      })),
      topApprovers: topApprovers.map(item => ({
        userId: item.approverId,
        name: `${item.approver.firstName} ${item.approver.lastName}`,
        role: item.approver.role,
        approvalCount: parseInt(item.dataValues.approvalCount),
      })),
      approvalEfficiency: approvalEfficiency.reduce((acc, item) => {
        const userId = item.approverId;
        if (!acc[userId]) {
          acc[userId] = {
            name: `${item.approver.firstName} ${item.approver.lastName}`,
            approved: 0,
            rejected: 0,
            pending: 0,
          };
        }
        acc[userId][item.status] = parseInt(item.count);
        return acc;
      }, {}),
    },
  });
});

// @desc    Get audit trail analytics
// @route   GET /api/analytics/audit
// @access  Private (Admin)
const getAuditAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate, action, tableName } = req.query;

  const whereCondition = { companyId: req.user.companyId };

  if (startDate && endDate) {
    whereCondition.createdAt = {
      [Op.between]: [startDate, endDate],
    };
  }

  if (action) whereCondition.action = action;
  if (tableName) whereCondition.tableName = tableName;

  // Activity by action
  const activityByAction = await AuditTrail.findAll({
    where: whereCondition,
    attributes: [
      'action',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    group: ['action'],
    order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
    raw: true,
  });

  // Activity by table
  const activityByTable = await AuditTrail.findAll({
    where: whereCondition,
    attributes: [
      'tableName',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    group: ['tableName'],
    order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
    raw: true,
  });

  // Activity by user
  const activityByUser = await AuditTrail.findAll({
    where: whereCondition,
    attributes: [
      'userId',
      [sequelize.fn('COUNT', sequelize.col('AuditTrail.id')), 'count'],
    ],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'role'],
      },
    ],
    group: ['userId', 'user.id'],
    order: [[sequelize.fn('COUNT', sequelize.col('AuditTrail.id')), 'DESC']],
    limit: 10,
  });

  // Activity timeline (by day)
  const activityTimeline = await AuditTrail.findAll({
    where: whereCondition,
    attributes: [
      [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
    order: [['date', 'ASC']],
    raw: true,
  });

  res.json({
    success: true,
    data: {
      activityByAction: activityByAction.map(item => ({
        action: item.action,
        count: parseInt(item.count),
      })),
      activityByTable: activityByTable.map(item => ({
        table: item.tableName,
        count: parseInt(item.count),
      })),
      activityByUser: activityByUser.map(item => ({
        userId: item.userId,
        name: item.user ? `${item.user.firstName} ${item.user.lastName}` : 'Unknown',
        role: item.user?.role,
        count: parseInt(item.dataValues.count),
      })),
      activityTimeline: activityTimeline.map(item => ({
        date: item.date,
        count: parseInt(item.count),
      })),
    },
  });
});

// @desc    Get dashboard summary
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardSummary = asyncHandler(async (req, res) => {
  const whereCondition = { companyId: req.user.companyId };

  // Role-based filtering for employees
  if (req.user.role === 'employee') {
    whereCondition.submittedById = req.user.id;
  }

  // Recent expenses
  const recentExpenses = await Expense.findAll({
    where: whereCondition,
    include: [
      {
        model: User,
        as: 'submittedBy',
        attributes: ['firstName', 'lastName'],
      },
    ],
    order: [['createdAt', 'DESC']],
    limit: 5,
  });

  // Pending approvals (for managers and admins)
  let pendingApprovals = [];
  if (req.user.role === 'manager' || req.user.role === 'admin') {
    pendingApprovals = await ExpenseApproval.findAll({
      where: { approverId: req.user.id, status: 'pending' },
      include: [
        {
          model: Expense,
          as: 'expense',
          include: [
            {
              model: User,
              as: 'submittedBy',
              attributes: ['firstName', 'lastName'],
            },
          ],
        },
      ],
      order: [['createdAt', 'ASC']],
      limit: 5,
    });
  }

  // Monthly summary
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const monthlySummary = await Expense.findOne({
    where: {
      ...whereCondition,
      createdAt: { [Op.gte]: thisMonth },
    },
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('SUM', sequelize.col('amountInBaseCurrency')), 'totalAmount'],
    ],
    raw: true,
  });

  // Status breakdown
  const statusBreakdown = await Expense.findAll({
    where: whereCondition,
    attributes: [
      'status',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    group: ['status'],
    raw: true,
  });

  res.json({
    success: true,
    data: {
      recentExpenses,
      pendingApprovals,
      monthlySummary: {
        count: parseInt(monthlySummary?.count) || 0,
        totalAmount: parseFloat(monthlySummary?.totalAmount) || 0,
      },
      statusBreakdown: statusBreakdown.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
    },
  });
});

module.exports = {
  getExpenseAnalytics,
  getApprovalAnalytics,
  getAuditAnalytics,
  getDashboardSummary,
};