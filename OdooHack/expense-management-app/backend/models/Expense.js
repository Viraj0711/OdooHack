const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'INR',
  },
  exchangeRate: {
    type: DataTypes.DECIMAL(10, 6),
    defaultValue: 1.0,
  },
  amountInBaseCurrency: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM(
      'travel',
      'meals',
      'accommodation',
      'transportation',
      'office_supplies',
      'software',
      'training',
      'marketing',
      'entertainment',
      'other'
    ),
    allowNull: false,
  },
  expenseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('draft', 'submitted', 'pending', 'approved', 'rejected', 'paid'),
    defaultValue: 'draft',
  },
  receiptUrl: {
    type: DataTypes.STRING(500),
  },
  receiptData: {
    type: DataTypes.JSONB,
    // Stores OCR extracted data
  },
  location: {
    type: DataTypes.JSONB,
    // Stores geo-location data: { latitude, longitude, address }
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  isReimbursable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'credit_card', 'debit_card', 'company_card', 'bank_transfer'),
  },
  vendorName: {
    type: DataTypes.STRING(255),
  },
  projectId: {
    type: DataTypes.STRING(100),
  },
  clientName: {
    type: DataTypes.STRING(255),
  },
  billableToClient: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  submittedAt: {
    type: DataTypes.DATE,
  },
  approvedAt: {
    type: DataTypes.DATE,
  },
  paidAt: {
    type: DataTypes.DATE,
  },
  submittedById: {
    type: DataTypes.UUID,
    allowNull: false,
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
  tableName: 'expenses',
  timestamps: true,
  indexes: [
    {
      fields: ['submittedById'],
    },
    {
      fields: ['companyId'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['expenseDate'],
    },
    {
      fields: ['category'],
    },
  ],
});

module.exports = Expense;