const axios = require('axios');
const logger = require('../config/logger');

const REST_COUNTRIES_API = 'https://restcountries.com/v3.1';

// Get country information by name
const getCountryInfo = async (countryName) => {
  try {
    const response = await axios.get(`${REST_COUNTRIES_API}/name/${countryName}`, {
      timeout: 5000,
    });
    
    if (response.data && response.data.length > 0) {
      const country = response.data[0];
      return {
        name: country.name.common,
        code: country.cca2,
        currencies: country.currencies,
        timezones: country.timezones,
        region: country.region,
        subregion: country.subregion,
      };
    }
    
    return null;
  } catch (error) {
    logger.error('Error fetching country info:', error.message);
    throw new Error('Failed to fetch country information');
  }
};

// Get country information by code
const getCountryByCode = async (countryCode) => {
  try {
    const response = await axios.get(`${REST_COUNTRIES_API}/alpha/${countryCode}`, {
      timeout: 5000,
    });
    
    if (response.data && response.data.length > 0) {
      const country = response.data[0];
      return {
        name: country.name.common,
        code: country.cca2,
        currencies: country.currencies,
        timezones: country.timezones,
        region: country.region,
        subregion: country.subregion,
      };
    }
    
    return null;
  } catch (error) {
    logger.error('Error fetching country info by code:', error.message);
    throw new Error('Failed to fetch country information');
  }
};

// Get all countries
const getAllCountries = async () => {
  try {
    const response = await axios.get(`${REST_COUNTRIES_API}/all?fields=name,cca2,currencies,timezones,region`, {
      timeout: 10000,
    });
    
    return response.data.map(country => ({
      name: country.name.common,
      code: country.cca2,
      currencies: country.currencies,
      timezones: country.timezones,
      region: country.region,
    }));
  } catch (error) {
    logger.error('Error fetching all countries:', error.message);
    throw new Error('Failed to fetch countries list');
  }
};

// Detect country by IP (basic implementation)
const detectCountryByIP = async (ipAddress) => {
  try {
    // This is a simple implementation. In production, you might want to use
    // a more robust IP geolocation service like MaxMind, IPapi, etc.
    const response = await axios.get(`http://ip-api.com/json/${ipAddress}`, {
      timeout: 5000,
    });
    
    if (response.data && response.data.status === 'success') {
      return {
        country: response.data.country,
        countryCode: response.data.countryCode,
        currency: response.data.currency || 'INR',
        timezone: response.data.timezone,
      };
    }
    
    return null;
  } catch (error) {
    logger.error('Error detecting country by IP:', error.message);
    return null;
  }
};

module.exports = {
  getCountryInfo,
  getCountryByCode,
  getAllCountries,
  detectCountryByIP,
};