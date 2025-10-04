const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'INR',
  },
  timezone: {
    type: DataTypes.STRING(100),
    defaultValue: 'UTC',
  },
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {
      allowMultipleCurrencies: true,
      requireReceiptUpload: false,
      autoApprovalLimit: 0,
      workflowEnabled: true,
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'companies',
  timestamps: true,
});

module.exports = Company;