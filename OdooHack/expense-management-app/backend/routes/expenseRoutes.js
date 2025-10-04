const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  upload,
  getExpenses,
  getExpense,
  createExpense,
  submitExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
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

// Create expense validation
const createExpenseValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter code'),
  body('category')
    .isIn(['travel', 'meals', 'accommodation', 'transportation', 'office_supplies', 'software', 'training', 'marketing', 'entertainment', 'other'])
    .withMessage('Invalid category'),
  body('expenseDate')
    .isDate()
    .withMessage('Valid expense date is required'),
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'credit_card', 'debit_card', 'company_card', 'bank_transfer'])
    .withMessage('Invalid payment method'),
];

// Update expense validation
const updateExpenseValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .optional()
    .isIn(['travel', 'meals', 'accommodation', 'transportation', 'office_supplies', 'software', 'training', 'marketing', 'entertainment', 'other'])
    .withMessage('Invalid category'),
  body('expenseDate')
    .optional()
    .isDate()
    .withMessage('Valid expense date is required'),
];

// Routes
router.get('/', authenticate, getExpenses);
router.get('/:id', authenticate, getExpense);
router.post('/', authenticate, upload.single('receipt'), createExpenseValidation, handleValidationErrors, createExpense);
router.post('/:id/submit', authenticate, submitExpense);
router.put('/:id', authenticate, updateExpenseValidation, handleValidationErrors, updateExpense);
router.delete('/:id', authenticate, deleteExpense);

module.exports = router;