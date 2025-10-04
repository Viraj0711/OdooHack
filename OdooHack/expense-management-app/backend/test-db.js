// Test script to verify database and API functionality
const { sequelize, User, Company } = require('./models');

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Test if tables exist
    const companies = await Company.findAll();
    console.log('✅ Company table exists, count:', companies.length);
    
    const users = await User.findAll();
    console.log('✅ User table exists, count:', users.length);
    
    console.log('🎉 Database is working correctly!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await sequelize.close();
  }
}

testDatabase();