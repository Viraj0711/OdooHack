const { Expense, User, ExpenseApproval, ApprovalWorkflow } = require('../models');
const { Op } = require('sequelize');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { createAuditTrail } = require('../services/auditService');
const { getCurrencyExchangeRate } = require('../services/currencyService');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/receipts/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, JPG, PNG) and PDF files are allowed'));
    }
  },
});

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status = '',
    category = '',
    startDate = '',
    endDate = '',
    minAmount = '',
    maxAmount = '',
    search = '',
  } = req.query;

  const offset = (page - 1) * limit;
  const whereCondition = { companyId: req.user.companyId };

  // Role-based filtering
  if (req.user.role === 'employee') {
    whereCondition.submittedById = req.user.id;
  }

  if (status) {
    whereCondition.status = status;
  }

  if (category) {
    whereCondition.category = category;
  }

  if (startDate && endDate) {
    whereCondition.expenseDate = {
      [Op.between]: [startDate, endDate],
    };
  }

  if (minAmount && maxAmount) {
    whereCondition.amount = {
      [Op.between]: [parseFloat(minAmount), parseFloat(maxAmount)],
    };
  }

  if (search) {
    whereCondition[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { vendorName: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { count, rows: expenses } = await Expense.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: User,
        as: 'submittedBy',
        attributes: ['id', 'firstName', 'lastName', 'email'],
      },
      {
        model: ExpenseApproval,
        as: 'approvals',
        include: [
          {
            model: User,
            as: 'approver',
            attributes: ['id', 'firstName', 'lastName'],
          },
        ],
      },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']],
  });

  res.json({
    success: true,
    data: {
      expenses,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    },
  });
});

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpense = asyncHandler(async (req, res) => {
  const whereCondition = {
    id: req.params.id,
    companyId: req.user.companyId,
  };

  // Employees can only view their own expenses
  if (req.user.role === 'employee') {
    whereCondition.submittedById = req.user.id;
  }

  const expense = await Expense.findOne({
    where: whereCondition,
    include: [
      {
        model: User,
        as: 'submittedBy',
        attributes: ['id', 'firstName', 'lastName', 'email', 'department'],
      },
      {
        model: ExpenseApproval,
        as: 'approvals',
        include: [
          {
            model: User,
            as: 'approver',
            attributes: ['id', 'firstName', 'lastName', 'role'],
          },
        ],
      },
    ],
  });

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: 'Expense not found',
    });
  }

  res.json({
    success: true,
    data: { expense },
  });
});

// @desc    Create expense
// @route   POST /api/expenses
// @access  Private
const createExpense = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    amount,
    currency,
    category,
    expenseDate,
    vendorName,
    projectId,
    clientName,
    billableToClient,
    paymentMethod,
    location,
    tags,
  } = req.body;

  // Get exchange rate if currency is different from company's base currency
  let exchangeRate = 1.0;
  let amountInBaseCurrency = amount;

  if (currency !== req.user.company.currency) {
    try {
      exchangeRate = await getCurrencyExchangeRate(currency, req.user.company.currency);
      amountInBaseCurrency = amount * exchangeRate;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to get exchange rate for currency conversion',
      });
    }
  }

  const expenseData = {
    title,
    description,
    amount,
    currency,
    exchangeRate,
    amountInBaseCurrency,
    category,
    expenseDate,
    vendorName,
    projectId,
    clientName,
    billableToClient: billableToClient || false,
    paymentMethod,
    location: location ? JSON.parse(location) : null,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    submittedById: req.user.id,
    companyId: req.user.companyId,
    status: 'draft',
  };

  // Handle file upload
  if (req.file) {
    expenseData.receiptUrl = `/uploads/receipts/${req.file.filename}`;
  }

  const expense = await Expense.create(expenseData);

  // Create audit trail
  await createAuditTrail({
    action: 'CREATE_EXPENSE',
    tableName: 'expenses',
    recordId: expense.id,
    newValues: expenseData,
    userId: req.user.id,
    companyId: req.user.companyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(201).json({
    success: true,
    message: 'Expense created successfully',
    data: { expense },
  });
});

// @desc    Submit expense for approval
// @route   POST /api/expenses/:id/submit
// @access  Private
const submitExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({
    where: {
      id: req.params.id,
      submittedById: req.user.id,
      companyId: req.user.companyId,
    },
  });

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: 'Expense not found',
    });
  }

  if (expense.status !== 'draft') {
    return res.status(400).json({
      success: false,
      message: 'Expense can only be submitted from draft status',
    });
  }

  const oldValues = { status: expense.status };
  
  await expense.update({
    status: 'submitted',
    submittedAt: new Date(),
  });

  // Create approval workflow entries based on company settings
  await createApprovalWorkflow(expense);

  // Create audit trail
  await createAuditTrail({
    action: 'SUBMIT_EXPENSE',
    tableName: 'expenses',
    recordId: expense.id,
    oldValues,
    newValues: { status: 'submitted' },
    userId: req.user.id,
    companyId: req.user.companyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Notify managers and admins via socket
  const io = req.app.get('io');
  io.to(`role_manager`).emit('new_expense', {
    expense: expense.toJSON(),
    submitter: {
      id: req.user.id,
      name: req.user.getFullName(),
    },
  });
  io.to(`role_admin`).emit('new_expense', {
    expense: expense.toJSON(),
    submitter: {
      id: req.user.id,
      name: req.user.getFullName(),
    },
  });

  res.json({
    success: true,
    message: 'Expense submitted for approval',
    data: { expense },
  });
});

// Helper function to create approval workflow
const createApprovalWorkflow = async (expense) => {
  // Find applicable workflow based on expense amount, category, etc.
  const workflow = await ApprovalWorkflow.findOne({
    where: {
      companyId: expense.companyId,
      isActive: true,
    },
    order: [['priority', 'ASC']],
  });

  if (workflow) {
    // Create approval entries for all approvers
    const approvalPromises = workflow.approvers.map(approverId =>
      ExpenseApproval.create({
        expenseId: expense.id,
        approverId,
        workflowId: workflow.id,
        status: 'pending',
      })
    );

    await Promise.all(approvalPromises);
    
    // Update expense status to pending
    await expense.update({ status: 'pending' });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({
    where: {
      id: req.params.id,
      submittedById: req.user.id,
      companyId: req.user.companyId,
    },
  });

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: 'Expense not found',
    });
  }

  if (expense.status !== 'draft') {
    return res.status(400).json({
      success: false,
      message: 'Only draft expenses can be updated',
    });
  }

  const oldValues = expense.toJSON();
  const updatedExpense = await expense.update(req.body);

  // Create audit trail
  await createAuditTrail({
    action: 'UPDATE_EXPENSE',
    tableName: 'expenses',
    recordId: expense.id,
    oldValues,
    newValues: req.body,
    userId: req.user.id,
    companyId: req.user.companyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({
    success: true,
    message: 'Expense updated successfully',
    data: { expense: updatedExpense },
  });
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({
    where: {
      id: req.params.id,
      submittedById: req.user.id,
      companyId: req.user.companyId,
    },
  });

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: 'Expense not found',
    });
  }

  if (expense.status !== 'draft') {
    return res.status(400).json({
      success: false,
      message: 'Only draft expenses can be deleted',
    });
  }

  const oldValues = expense.toJSON();
  await expense.destroy();

  // Create audit trail
  await createAuditTrail({
    action: 'DELETE_EXPENSE',
    tableName: 'expenses',
    recordId: expense.id,
    oldValues,
    userId: req.user.id,
    companyId: req.user.companyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({
    success: true,
    message: 'Expense deleted successfully',
  });
});

module.exports = {
  upload,
  getExpenses,
  getExpense,
  createExpense,
  submitExpense,
  updateExpense,
  deleteExpense,
};