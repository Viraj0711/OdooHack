// Currency utility functions for the expense management app

/**
 * Format amount with Indian Rupee symbol
 * @param {number} amount - The amount to format
 * @param {string} locale - The locale for formatting (default: 'en-IN')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, locale = 'en-IN') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format amount with Rupee symbol and custom formatting
 * @param {number} amount - The amount to format
 * @param {boolean} showDecimals - Whether to show decimal places
 * @returns {string} Formatted currency string with ₹ symbol
 */
export const formatRupees = (amount, showDecimals = true) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }

  const formatted = showDecimals 
    ? amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  
  return `₹${formatted}`;
};

/**
 * Parse currency string to number
 * @param {string} currencyString - Currency string to parse
 * @returns {number} Parsed amount
 */
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;
  
  // Remove currency symbols and commas, then parse
  const cleanString = currencyString.replace(/[₹$,\s]/g, '');
  const parsed = parseFloat(cleanString);
  
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Convert amount between currencies (placeholder for future currency conversion)
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @param {number} exchangeRate - Exchange rate
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, fromCurrency, toCurrency, exchangeRate = 1) => {
  if (fromCurrency === toCurrency) return amount;
  return amount * exchangeRate;
};

/**
 * Get currency symbol for given currency code
 * @param {string} currencyCode - Currency code (e.g., 'INR', 'USD')
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currencyCode) => {
  const symbols = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
  };
  
  return symbols[currencyCode] || currencyCode;
};

/**
 * Validate currency amount
 * @param {string|number} amount - Amount to validate
 * @returns {boolean} Whether the amount is valid
 */
export const isValidAmount = (amount) => {
  if (typeof amount === 'string') {
    amount = parseCurrency(amount);
  }
  
  return typeof amount === 'number' && !isNaN(amount) && amount >= 0;
};

// Default currency configuration
export const DEFAULT_CURRENCY = 'INR';
export const DEFAULT_CURRENCY_SYMBOL = '₹';
export const DEFAULT_LOCALE = 'en-IN';
