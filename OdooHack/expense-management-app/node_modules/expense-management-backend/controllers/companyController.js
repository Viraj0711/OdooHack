const { Company, User } = require('../models');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { createAuditTrail } = require('../services/auditService');
const { getSupportedCurrencies } = require('../services/currencyService');

// @desc    Get company information
// @route   GET /api/companies/profile
// @access  Private
const getCompanyProfile = asyncHandler(async (req, res) => {
  const company = await Company.findByPk(req.user.companyId, {
    include: [
      {
        model: User,
        as: 'users',
        attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'isActive'],
        where: { isActive: true },
        required: false,
      },
    ],
  });

  if (!company) {
    return res.status(404).json({
      success: false,
      message: 'Company not found',
    });
  }

  res.json({
    success: true,
    data: { company },
  });
});

// @desc    Update company profile
// @route   PUT /api/companies/profile
// @access  Private (Admin)
const updateCompanyProfile = asyncHandler(async (req, res) => {
  const company = await Company.findByPk(req.user.companyId);

  if (!company) {
    return res.status(404).json({
      success: false,
      message: 'Company not found',
    });
  }

  const {
    name,
    address,
    country,
    currency,
    timezone,
    settings,
  } = req.body;

  const oldValues = {
    name: company.name,
    address: company.address,
    country: company.country,
    currency: company.currency,
    timezone: company.timezone,
    settings: company.settings,
  };

  const updatedCompany = await company.update({
    name: name || company.name,
    address: address || company.address,
    country: country || company.country,
    currency: currency || company.currency,
    timezone: timezone || company.timezone,
    settings: settings ? { ...company.settings, ...settings } : company.settings,
  });

  // Create audit trail
  await createAuditTrail({
    action: 'UPDATE_COMPANY',
    tableName: 'companies',
    recordId: company.id,
    oldValues,
    newValues: {
      name: updatedCompany.name,
      address: updatedCompany.address,
      country: updatedCompany.country,
      currency: updatedCompany.currency,
      timezone: updatedCompany.timezone,
      settings: updatedCompany.settings,
    },
    userId: req.user.id,
    companyId: req.user.companyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({
    success: true,
    message: 'Company profile updated successfully',
    data: { company: updatedCompany },
  });
});

// @desc    Get company settings
// @route   GET /api/companies/settings
// @access  Private (Admin)
const getCompanySettings = asyncHandler(async (req, res) => {
  const company = await Company.findByPk(req.user.companyId, {
    attributes: ['id', 'name', 'currency', 'settings'],
  });

  if (!company) {
    return res.status(404).json({
      success: false,
      message: 'Company not found',
    });
  }

  res.json({
    success: true,
    data: {
      settings: company.settings,
      currency: company.currency,
    },
  });
});

// @desc    Update company settings
// @route   PUT /api/companies/settings
// @access  Private (Admin)
const updateCompanySettings = asyncHandler(async (req, res) => {
  const company = await Company.findByPk(req.user.companyId);

  if (!company) {
    return res.status(404).json({
      success: false,
      message: 'Company not found',
    });
  }

  const { settings } = req.body;

  const oldValues = { settings: company.settings };

  const updatedSettings = {
    ...company.settings,
    ...settings,
  };

  await company.update({ settings: updatedSettings });

  // Create audit trail
  await createAuditTrail({
    action: 'UPDATE_COMPANY_SETTINGS',
    tableName: 'companies',
    recordId: company.id,
    oldValues,
    newValues: { settings: updatedSettings },
    userId: req.user.id,
    companyId: req.user.companyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({
    success: true,
    message: 'Company settings updated successfully',
    data: { settings: updatedSettings },
  });
});

// @desc    Get supported currencies
// @route   GET /api/companies/currencies
// @access  Private
const getCurrencies = asyncHandler(async (req, res) => {
  try {
    const currencies = await getSupportedCurrencies();
    
    res.json({
      success: true,
      data: { currencies },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch currencies',
    });
  }
});

// @desc    Get company statistics
// @route   GET /api/companies/stats
// @access  Private (Admin/Manager)
const getCompanyStatistics = asyncHandler(async (req, res) => {
  const { User, Expense } = require('../models');
  const { Op } = require('sequelize');

  const totalUsers = await User.count({
    where: { companyId: req.user.companyId, isActive: true },
  });

  const usersByRole = await User.findAll({
    where: { companyId: req.user.companyId, isActive: true },
    attributes: [
      'role',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
    ],
    group: ['role'],
    raw: true,
  });

  const totalExpenses = await Expense.count({
    where: { companyId: req.user.companyId },
  });

  const expensesByStatus = await Expense.findAll({
    where: { companyId: req.user.companyId },
    attributes: [
      'status',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
      [require('sequelize').fn('SUM', require('sequelize').col('amountInBaseCurrency')), 'totalAmount'],
    ],
    group: ['status'],
    raw: true,
  });

  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const monthlyExpenses = await Expense.findAll({
    where: {
      companyId: req.user.companyId,
      createdAt: { [Op.gte]: thisMonth },
    },
    attributes: [
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
      [require('sequelize').fn('SUM', require('sequelize').col('amountInBaseCurrency')), 'totalAmount'],
    ],
    raw: true,
  });

  res.json({
    success: true,
    data: {
      totalUsers,
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item.role] = parseInt(item.count);
        return acc;
      }, {}),
      totalExpenses,
      expensesByStatus: expensesByStatus.reduce((acc, item) => {
        acc[item.status] = {
          count: parseInt(item.count),
          totalAmount: parseFloat(item.totalAmount) || 0,
        };
        return acc;
      }, {}),
      monthlyStats: {
        count: parseInt(monthlyExpenses[0]?.count) || 0,
        totalAmount: parseFloat(monthlyExpenses[0]?.totalAmount) || 0,
      },
    },
  });
});

module.exports = {
  getCompanyProfile,
  updateCompanyProfile,
  getCompanySettings,
  updateCompanySettings,
  getCurrencies,
  getCompanyStatistics,
};