const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getPendingApprovals,
  makeApprovalDecision,
  getApprovalWorkflows,
  createApprovalWorkflow,
  updateApprovalWorkflow,
  deleteApprovalWorkflow,
} = require('../controllers/approvalController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Approval decision validation
const approvalDecisionValidation = [
  body('decision')
    .isIn(['approved', 'rejected'])
    .withMessage('Decision must be either approved or rejected'),
  body('comments')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comments must not exceed 1000 characters'),
];

// Workflow validation
const workflowValidation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Name must be between 3 and 255 characters'),
  body('rules.type')
    .isIn(['percentage', 'override', 'hybrid'])
    .withMessage('Rule type must be percentage, override, or hybrid'),
  body('rules.percentage')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Percentage must be between 1 and 100'),
  body('approvers')
    .isArray({ min: 1 })
    .withMessage('At least one approver is required'),
  body('priority')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Priority must be a positive integer'),
];

// Routes
router.get('/', authenticate, authorize('manager', 'admin'), getPendingApprovals);
router.post('/:id/decision', authenticate, authorize('manager', 'admin'), approvalDecisionValidation, handleValidationErrors, makeApprovalDecision);

// Workflow management routes
router.get('/workflows', authenticate, authorize('admin'), getApprovalWorkflows);
router.post('/workflows', authenticate, authorize('admin'), workflowValidation, handleValidationErrors, createApprovalWorkflow);
router.put('/workflows/:id', authenticate, authorize('admin'), updateApprovalWorkflow);
router.delete('/workflows/:id', authenticate, authorize('admin'), deleteApprovalWorkflow);

module.exports = router;