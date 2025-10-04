const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AuditTrail = sequelize.define('AuditTrail', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false,
    // Actions: CREATE, UPDATE, DELETE, APPROVE, REJECT, SUBMIT, etc.
  },
  tableName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  recordId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  oldValues: {
    type: DataTypes.JSONB,
    // Stores previous state of the record
  },
  newValues: {
    type: DataTypes.JSONB,
    // Stores new state of the record
  },
  changes: {
    type: DataTypes.JSONB,
    // Stores only the changed fields
  },
  ipAddress: {
    type: DataTypes.STRING(45),
  },
  userAgent: {
    type: DataTypes.TEXT,
  },
  metadata: {
    type: DataTypes.JSONB,
    // Additional context data
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id',
    },
  },
}, {
  tableName: 'audit_trails',
  timestamps: true,
  updatedAt: false, // Audit records should never be updated
  indexes: [
    {
      fields: ['tableName'],
    },
    {
      fields: ['recordId'],
    },
    {
      fields: ['userId'],
    },
    {
      fields: ['action'],
    },
    {
      fields: ['createdAt'],
    },
  ],
});

module.exports = AuditTrail;