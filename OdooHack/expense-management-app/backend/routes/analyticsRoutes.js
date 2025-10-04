const express = require('express');
const {
  getExpenseAnalytics,
  getApprovalAnalytics,
  getAuditAnalytics,
  getDashboardSummary,
} = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes
router.get('/expenses', authenticate, authorize('admin', 'manager'), getExpenseAnalytics);
router.get('/approvals', authenticate, authorize('admin', 'manager'), getApprovalAnalytics);
router.get('/audit', authenticate, authorize('admin'), getAuditAnalytics);
router.get('/dashboard', authenticate, getDashboardSummary);

module.exports = router;