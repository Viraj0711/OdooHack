// Test API endpoints
const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API health endpoint...');
    
    // Test health endpoint with timeout and more detailed error handling
    const healthResponse = await axios.get('http://localhost:5000/health', {
      timeout: 5000,
      validateStatus: () => true // Accept all status codes
    });
    console.log('✅ Health endpoint response:', healthResponse.status, healthResponse.data);
    
    // Test registration endpoint with sample data
    console.log('\nTesting registration endpoint...');
    const registrationData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Admin123!',
      companyName: 'Test Company',
      country: 'United States'
    };
    
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', registrationData);
    console.log('✅ Registration working:', registerResponse.data);
    
  } catch (error) {
    console.error('❌ API test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('Request made but no response received');
      console.error('Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testAPI();