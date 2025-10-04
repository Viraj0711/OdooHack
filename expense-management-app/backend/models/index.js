const { sequelize } = require('../config/database');
const User = require('./User');
const Company = require('./Company');
const Expense = require('./Expense');
const { ApprovalWorkflow, ExpenseApproval } = require('./Approval');
const AuditTrail = require('./AuditTrail');

// Define associations
// Company associations
Company.hasMany(User, { foreignKey: 'companyId', as: 'users' });
Company.hasMany(Expense, { foreignKey: 'companyId', as: 'expenses' });
Company.hasMany(ApprovalWorkflow, { foreignKey: 'companyId', as: 'workflows' });
Company.hasMany(AuditTrail, { foreignKey: 'companyId', as: 'auditTrails' });

// User associations
User.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
User.hasMany(Expense, { foreignKey: 'submittedById', as: 'expenses' });
User.hasMany(ExpenseApproval, { foreignKey: 'approverId', as: 'approvals' });
User.hasMany(AuditTrail, { foreignKey: 'userId', as: 'auditTrails' });

// Expense associations
Expense.belongsTo(User, { foreignKey: 'submittedById', as: 'submittedBy' });
Expense.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
Expense.hasMany(ExpenseApproval, { foreignKey: 'expenseId', as: 'approvals' });

// Approval associations
ApprovalWorkflow.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
ApprovalWorkflow.hasMany(ExpenseApproval, { foreignKey: 'workflowId', as: 'approvals' });

ExpenseApproval.belongsTo(Expense, { foreignKey: 'expenseId', as: 'expense' });
ExpenseApproval.belongsTo(User, { foreignKey: 'approverId', as: 'approver' });
ExpenseApproval.belongsTo(ApprovalWorkflow, { foreignKey: 'workflowId', as: 'workflow' });

// Audit Trail associations
AuditTrail.belongsTo(User, { foreignKey: 'userId', as: 'user' });
AuditTrail.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

module.exports = {
  sequelize,
  User,
  Company,
  Expense,
  ApprovalWorkflow,
  ExpenseApproval,
  AuditTrail,
};