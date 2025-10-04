const { User, Company } = require('../models');
const { Op } = require('sequelize');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { createAuditTrail } = require('../services/auditService');

// @desc    Get all users in company
// @route   GET /api/users
// @access  Private (Admin/Manager)
const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', role = '', status = '' } = req.query;
  const offset = (page - 1) * limit;

  const whereCondition = { companyId: req.user.companyId };

  if (search) {
    whereCondition[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (role) {
    whereCondition.role = role;
  }

  if (status === 'active') {
    whereCondition.isActive = true;
  } else if (status === 'inactive') {
    whereCondition.isActive = false;
  }

  const { count, rows: users } = await User.findAndCountAll({
    where: whereCondition,
    attributes: { exclude: ['password'] },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']],
  });

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    },
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin/Manager or own profile)
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
      companyId: req.user.companyId,
    },
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'currency'],
      },
    ],
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.json({
    success: true,
    data: { user },
  });
});

// @desc    Create user
// @route   POST /api/users
// @access  Private (Admin only)
const createUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    employeeId,
    department,
    jobTitle,
    phoneNumber,
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email',
    });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
    employeeId,
    department,
    jobTitle,
    phoneNumber,
    companyId: req.user.companyId,
  });

  // Create audit trail
  await createAuditTrail({
    action: 'CREATE_USER',
    tableName: 'users',
    recordId: user.id,
    newValues: {
      firstName,
      lastName,
      email,
      role,
      employeeId,
      department,
      jobTitle,
    },
    userId: req.user.id,
    companyId: req.user.companyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department,
        jobTitle: user.jobTitle,
      },
    },
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin or own profile)
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
      companyId: req.user.companyId,
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const {
    firstName,
    lastName,
    role,
    employeeId,
    department,
    jobTitle,
    phoneNumber,
    isActive,
  } = req.body;

  const oldValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    employeeId: user.employeeId,
    department: user.department,
    jobTitle: user.jobTitle,
    phoneNumber: user.phoneNumber,
    isActive: user.isActive,
  };

  const updatedUser = await user.update({
    firstName: firstName || user.firstName,
    lastName: lastName || user.lastName,
    role: role || user.role,
    employeeId,
    department,
    jobTitle,
    phoneNumber,
    isActive: isActive !== undefined ? isActive : user.isActive,
  });

  // Create audit trail
  await createAuditTrail({
    action: 'UPDATE_USER',
    tableName: 'users',
    recordId: user.id,
    oldValues,
    newValues: {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      employeeId: updatedUser.employeeId,
      department: updatedUser.department,
      jobTitle: updatedUser.jobTitle,
      phoneNumber: updatedUser.phoneNumber,
      isActive: updatedUser.isActive,
    },
    userId: req.user.id,
    companyId: req.user.companyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({
    success: true,
    message: 'User updated successfully',
    data: {
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        employeeId: updatedUser.employeeId,
        department: updatedUser.department,
        jobTitle: updatedUser.jobTitle,
        isActive: updatedUser.isActive,
      },
    },
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
      companyId: req.user.companyId,
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Don't allow deletion of own account
  if (user.id === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete your own account',
    });
  }

  const oldValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };

  await user.destroy();

  // Create audit trail
  await createAuditTrail({
    action: 'DELETE_USER',
    tableName: 'users',
    recordId: user.id,
    oldValues,
    userId: req.user.id,
    companyId: req.user.companyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};