const axios = require('axios');
const logger = require('../config/logger');

const EXCHANGE_RATE_API_URL = process.env.EXCHANGE_RATE_API_URL || 'https://api.exchangerate-api.com/v4/latest';

// Cache for exchange rates (simple in-memory cache)
const exchangeRateCache = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Get exchange rate between currencies
const getCurrencyExchangeRate = async (fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) {
    return 1.0;
  }

  const cacheKey = `${fromCurrency}_${toCurrency}`;
  const cachedData = exchangeRateCache.get(cacheKey);

  // Check if we have cached data and it's not expired
  if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
    return cachedData.rate;
  }

  try {
    const response = await axios.get(`${EXCHANGE_RATE_API_URL}/${fromCurrency}`, {
      timeout: 5000,
    });

    if (response.data && response.data.rates && response.data.rates[toCurrency]) {
      const rate = response.data.rates[toCurrency];
      
      // Cache the result
      exchangeRateCache.set(cacheKey, {
        rate,
        timestamp: Date.now(),
      });

      return rate;
    }

    throw new Error(`Exchange rate not available for ${fromCurrency} to ${toCurrency}`);
  } catch (error) {
    logger.error('Error fetching exchange rate:', error.message);
    
    // If we have cached data (even if expired), use it as fallback
    if (cachedData) {
      logger.warn(`Using expired exchange rate for ${cacheKey}`);
      return cachedData.rate;
    }
    
    throw new Error('Failed to fetch currency exchange rate');
  }
};

// Get all supported currencies
const getSupportedCurrencies = async (baseCurrency = 'INR') => {
  try {
    const response = await axios.get(`${EXCHANGE_RATE_API_URL}/INR`, {
      timeout: 5000,
    });

    if (response.data && response.data.rates) {
      return Object.keys(response.data.rates);
    }

    return ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']; // Fallback currencies
  } catch (error) {
    logger.error('Error fetching supported currencies:', error.message);
    return ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']; // Fallback currencies
  }
};

// Convert amount between currencies
const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  const exchangeRate = await getCurrencyExchangeRate(fromCurrency, toCurrency);
  return amount * exchangeRate;
};

// Get multiple exchange rates for a base currency
const getMultipleExchangeRates = async (baseCurrency, targetCurrencies) => {
  try {
    const response = await axios.get(`${EXCHANGE_RATE_API_URL}/${baseCurrency}`, {
      timeout: 5000,
    });

    if (response.data && response.data.rates) {
      const rates = {};
      targetCurrencies.forEach(currency => {
        if (response.data.rates[currency]) {
          rates[currency] = response.data.rates[currency];
        }
      });
      return rates;
    }

    throw new Error('Failed to fetch exchange rates');
  } catch (error) {
    logger.error('Error fetching multiple exchange rates:', error.message);
    throw new Error('Failed to fetch exchange rates');
  }
};

// Clear exchange rate cache
const clearExchangeRateCache = () => {
  exchangeRateCache.clear();
  logger.info('Exchange rate cache cleared');
};

// Get cache statistics
const getCacheStatistics = () => {
  const stats = {
    size: exchangeRateCache.size,
    entries: [],
  };

  exchangeRateCache.forEach((value, key) => {
    stats.entries.push({
      currencies: key,
      rate: value.rate,
      timestamp: value.timestamp,
      age: Date.now() - value.timestamp,
    });
  });

  return stats;
};

module.exports = {
  getCurrencyExchangeRate,
  getSupportedCurrencies,
  convertCurrency,
  getMultipleExchangeRates,
  clearExchangeRateCache,
  getCacheStatistics,
};