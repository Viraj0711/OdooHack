const { User, Company } = require('../models');
const { generateToken } = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { getCountryInfo } = require('../services/countryService');
const { createAuditTrail } = require('../services/auditService');
const logger = require('../config/logger');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    companyName,
    country,
    role = 'admin', // First user becomes admin
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email',
    });
  }

  let companyData = { name: companyName, country };

  // Get country information and set default currency
  if (country) {
    try {
      const countryInfo = await getCountryInfo(country);
      if (countryInfo && countryInfo.currencies) {
        const currencies = Object.keys(countryInfo.currencies);
        companyData.currency = currencies[0] || 'INR';
      }
    } catch (error) {
      logger.warn('Failed to fetch country info:', error.message);
      companyData.currency = 'INR';
    }
  }

  // Create company first
  const company = await Company.create(companyData);

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
    country,
    companyId: company.id,
    isFirstLogin: true,
  });

  // Create audit trail
  await createAuditTrail({
    action: 'REGISTER',
    tableName: 'users',
    recordId: user.id,
    newValues: {
      firstName,
      lastName,
      email,
      role,
    },
    userId: user.id,
    companyId: company.id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isFirstLogin: user.isFirstLogin,
        company: {
          id: company.id,
          name: company.name,
          currency: company.currency,
        },
      },
      token,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists and include company data
  const user = await User.findOne({
    where: { email },
    include: [
      {
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'currency', 'settings'],
      },
    ],
  });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated',
    });
  }

  // Update last login
  await user.update({ lastLoginAt: new Date() });

  // Create audit trail
  await createAuditTrail({
    action: 'LOGIN',
    tableName: 'users',
    recordId: user.id,
    userId: user.id,
    companyId: user.companyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  const token = generateToken(user);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isFirstLogin: user.isFirstLogin,
        company: user.company,
      },
      token,
    },
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    include: [
      {
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'currency', 'settings'],
      },
    ],
    attributes: { exclude: ['password'] },
  });

  res.json({
    success: true,
    data: { user },
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    department,
    jobTitle,
    preferences,
  } = req.body;

  const oldValues = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    phoneNumber: req.user.phoneNumber,
    department: req.user.department,
    jobTitle: req.user.jobTitle,
    preferences: req.user.preferences,
  };

  const updatedUser = await req.user.update({
    firstName: firstName || req.user.firstName,
    lastName: lastName || req.user.lastName,
    phoneNumber,
    department,
    jobTitle,
    preferences: preferences ? { ...req.user.preferences, ...preferences } : req.user.preferences,
    isFirstLogin: false,
  });

  // Create audit trail
  await createAuditTrail({
    action: 'UPDATE_PROFILE',
    tableName: 'users',
    recordId: req.user.id,
    oldValues,
    newValues: {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      phoneNumber: updatedUser.phoneNumber,
      department: updatedUser.department,
      jobTitle: updatedUser.jobTitle,
      preferences: updatedUser.preferences,
    },
    userId: req.user.id,
    companyId: req.user.companyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        department: updatedUser.department,
        jobTitle: updatedUser.jobTitle,
        preferences: updatedUser.preferences,
      },
    },
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findByPk(req.user.id);

  if (!(await user.comparePassword(currentPassword))) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  await user.update({ password: newPassword });

  // Create audit trail
  await createAuditTrail({
    action: 'CHANGE_PASSWORD',
    tableName: 'users',
    recordId: user.id,
    userId: user.id,
    companyId: user.companyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

// @desc    Logout user (invalidate token on client side)
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  // Create audit trail
  await createAuditTrail({
    action: 'LOGOUT',
    tableName: 'users',
    recordId: req.user.id,
    userId: req.user.id,
    companyId: req.user.companyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  logoutUser,
};