const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ApprovalWorkflow = sequelize.define('ApprovalWorkflow', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  conditions: {
    type: DataTypes.JSONB,
    // Stores conditions like amount range, category, etc.
    defaultValue: {},
  },
  rules: {
    type: DataTypes.JSONB,
    allowNull: false,
    // Stores approval rules: percentage, override, hybrid
    defaultValue: {
      type: 'percentage', // 'percentage', 'override', 'hybrid'
      percentage: 60, // for percentage rule
      overrideApprovers: [], // for override rule
      hybridCondition: 'OR', // 'OR', 'AND' for hybrid rule
    },
  },
  approvers: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
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
  tableName: 'approval_workflows',
  timestamps: true,
});

const ExpenseApproval = sequelize.define('ExpenseApproval', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  comments: {
    type: DataTypes.TEXT,
  },
  approvedAt: {
    type: DataTypes.DATE,
  },
  isOverride: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  expenseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'expenses',
      key: 'id',
    },
  },
  approverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  workflowId: {
    type: DataTypes.UUID,
    references: {
      model: 'approval_workflows',
      key: 'id',
    },
  },
}, {
  tableName: 'expense_approvals',
  timestamps: true,
  indexes: [
    {
      fields: ['expenseId'],
    },
    {
      fields: ['approverId'],
    },
    {
      fields: ['status'],
    },
  ],
});

module.exports = { ApprovalWorkflow, ExpenseApproval };