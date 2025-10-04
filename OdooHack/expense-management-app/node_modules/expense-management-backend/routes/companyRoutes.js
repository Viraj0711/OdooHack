const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getCompanyProfile,
  updateCompanyProfile,
  getCompanySettings,
  updateCompanySettings,
  getCurrencies,
  getCompanyStatistics,
} = require('../controllers/companyController');
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

// Company profile validation
const companyProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('country')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters'),
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter code'),
  body('timezone')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Timezone must not exceed 100 characters'),
];

// Routes
router.get('/profile', authenticate, getCompanyProfile);
router.put('/profile', authenticate, authorize('admin'), companyProfileValidation, handleValidationErrors, updateCompanyProfile);
router.get('/settings', authenticate, authorize('admin'), getCompanySettings);
router.put('/settings', authenticate, authorize('admin'), updateCompanySettings);
router.get('/currencies', authenticate, getCurrencies);
router.get('/stats', authenticate, authorize('admin', 'manager'), getCompanyStatistics);

module.exports = router;