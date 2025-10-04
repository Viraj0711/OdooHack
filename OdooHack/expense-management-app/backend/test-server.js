// Simple test server
const express = require('express');
const app = express();
const PORT = 5001; // Use different port to avoid conflicts

app.get('/test', (req, res) => {
  res.json({ message: 'Test server working!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});

// Test the server
setTimeout(async () => {
  try {
    const axios = require('axios');
    const response = await axios.get(`http://localhost:${PORT}/test`);
    console.log('✅ Test successful:', response.data);
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}, 1000);