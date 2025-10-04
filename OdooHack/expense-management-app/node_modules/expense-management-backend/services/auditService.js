const { AuditTrail } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const logger = require('../config/logger');

// Create audit trail record
const createAuditTrail = async ({
  action,
  tableName,
  recordId,
  oldValues = null,
  newValues = null,
  changes = null,
  userId,
  companyId,
  ipAddress = null,
  userAgent = null,
  metadata = null,
}) => {
  try {
    // Calculate changes if not provided
    if (!changes && oldValues && newValues) {
      changes = {};
      
      // Compare old and new values to identify changes
      for (const key in newValues) {
        if (oldValues[key] !== newValues[key]) {
          changes[key] = {
            from: oldValues[key],
            to: newValues[key],
          };
        }
      }
    }

    const auditRecord = await AuditTrail.create({
      action,
      tableName,
      recordId,
      oldValues,
      newValues,
      changes,
      userId,
      companyId,
      ipAddress,
      userAgent,
      metadata,
    });

    return auditRecord;
  } catch (error) {
    logger.error('Error creating audit trail:', error);
    // Don't throw error as audit trail failures shouldn't break main operations
    return null;
  }
};

// Get audit trail for a specific record
const getAuditTrail = async (recordId, tableName = null, options = {}) => {
  try {
    const whereCondition = { recordId };
    
    if (tableName) {
      whereCondition.tableName = tableName;
    }

    const auditTrail = await AuditTrail.findAll({
      where: whereCondition,
      include: [
        {
          association: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: options.limit || 50,
      offset: options.offset || 0,
    });

    return auditTrail;
  } catch (error) {
    logger.error('Error fetching audit trail:', error);
    throw new Error('Failed to fetch audit trail');
  }
};

// Get audit trail for a user
const getUserAuditTrail = async (userId, options = {}) => {
  try {
    const auditTrail = await AuditTrail.findAll({
      where: { userId },
      include: [
        {
          association: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: options.limit || 50,
      offset: options.offset || 0,
    });

    return auditTrail;
  } catch (error) {
    logger.error('Error fetching user audit trail:', error);
    throw new Error('Failed to fetch user audit trail');
  }
};

// Get audit trail for a company
const getCompanyAuditTrail = async (companyId, options = {}) => {
  try {
    const auditTrail = await AuditTrail.findAll({
      where: { companyId },
      include: [
        {
          association: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: options.limit || 100,
      offset: options.offset || 0,
    });

    return auditTrail;
  } catch (error) {
    logger.error('Error fetching company audit trail:', error);
    throw new Error('Failed to fetch company audit trail');
  }
};

// Get audit statistics
const getAuditStatistics = async (companyId, startDate = null, endDate = null) => {
  try {
    const whereCondition = { companyId };
    
    if (startDate && endDate) {
      whereCondition.createdAt = {
        [Op.between]: [startDate, endDate],
      };
    }

    const statistics = await AuditTrail.findAll({
      where: whereCondition,
      attributes: [
        'action',
        'tableName',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['action', 'tableName'],
      raw: true,
    });

    // Format statistics
    const formatted = statistics.reduce((acc, stat) => {
      if (!acc[stat.tableName]) {
        acc[stat.tableName] = {};
      }
      acc[stat.tableName][stat.action] = parseInt(stat.count);
      return acc;
    }, {});

    return formatted;
  } catch (error) {
    logger.error('Error fetching audit statistics:', error);
    throw new Error('Failed to fetch audit statistics');
  }
};

// Audit trail middleware for automatic logging
const auditMiddleware = (action, tableName) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Only log successful operations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const auditData = {
          action,
          tableName,
          recordId: req.params.id || req.body.id,
          userId: req.user?.id,
          companyId: req.user?.companyId,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          metadata: {
            method: req.method,
            url: req.originalUrl,
            params: req.params,
          },
        };

        // Add old and new values based on the action
        if (action === 'UPDATE' && req.oldValues) {
          auditData.oldValues = req.oldValues;
          auditData.newValues = req.body;
        } else if (action === 'CREATE') {
          auditData.newValues = req.body;
        } else if (action === 'DELETE' && req.oldValues) {
          auditData.oldValues = req.oldValues;
        }

        // Create audit trail asynchronously
        createAuditTrail(auditData);
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

module.exports = {
  createAuditTrail,
  getAuditTrail,
  getUserAuditTrail,
  getCompanyAuditTrail,
  getAuditStatistics,
  auditMiddleware,
};