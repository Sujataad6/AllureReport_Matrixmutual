require('dotenv').config();

const config = {
  // API Configuration
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',

  // Login Credentials
  loginCredentials: {
    boid: process.env.LOGIN_BOID || '1301630054368345',
    password: process.env.LOGIN_PASSWORD || 'Test@123'
  },

  // Change Password Credentials
  changePasswordCredentials: {
    currentPassword: process.env.CURRENT_PASSWORD || 'Pass@123',
    newPassword: process.env.CHANGE_PASSWORD || 'NewPass@123',
    confirmPassword: process.env.CONFIRM_PASSWORD || 'NewPass@123'
  },

  // Allure Configuration
  allure: {
    resultsDir: process.env.ALLURE_RESULTS_DIR || 'allure-results',
    reportDir: process.env.ALLURE_REPORT_DIR || 'allure-report'
  },

  // Test Configuration
  timeout: 30000,
  retries: 2
};

module.exports = config;