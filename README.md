# Matrix API Automation with Allure Reporting

This project provides API automation testing for the Matrix API with comprehensive Allure reporting.

## Features

- ✅ API Login automation with reusable auth helper
- ✅ Allure reporting with detailed test steps and attachments
- ✅ Configurable environment settings
- ✅ Comprehensive error handling
- ✅ Token management for authenticated requests

## Project Structure

```
matrixAPIAllureReport/
├── config/
│   ├── config.js          # Main configuration file
│   └── env.example        # Environment variables template
├── utils/
│   └── auth.js            # Authentication helper utility
├── tests/
│   └── auth.spec.js       # Login authentication tests
├── .mocharc.json          # Mocha configuration
├── package.json           # Project dependencies and scripts
└── README.md             # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the environment template and update with your actual values:

```bash
cp config/env.example .env
```

Edit the `.env` file with your actual configuration:

```env
# API Configuration
BASE_URL=https://your-api-domain.com

# Login Credentials (replace with actual values)
LOGIN_BOID=your_actual_boid
LOGIN_PASSWORD=your_actual_password

# Allure Configuration
ALLURE_RESULTS_DIR=allure-results
ALLURE_REPORT_DIR=allure-report
```

### 3. Install Allure CLI (Global)

```bash
npm install -g allure-commandline
```

## Running Tests

### Prerequisites

Before running tests, make sure:

1. **Update your `.env` file** with the correct API URL and credentials
2. **API Server is running** and accessible at the configured BASE_URL
3. **Credentials are valid** in the environment variables

### Run Tests with Allure Reporting

```bash
npm run test:with-allure
```

This will:
- Run all tests with allure reporting enabled
- Generate allure results in `allure-results/` directory
- Generate HTML report in `allure-report/` directory

### Open Allure Report in Browser

```bash
npm run allure:open
```

### Run Tests Without Allure (Simple Output)

```bash
npm run test:simple
```

### Run All Tests and View Report

```bash
npm run allure:report
```

This runs tests, generates report, and opens it in your browser.

### Development Mode

```bash
npm run test:watch
```

Runs tests in watch mode for development.

## Current Test Status

The framework is fully set up and ready to use. When you run the tests:

- **2 tests will pass**: These are the error handling tests (invalid credentials and network errors)
- **3 tests will fail**: These require a running API server with valid credentials

Once you:
1. Update the `BASE_URL` in `.env` to point to your actual API
2. Update the `LOGIN_BOID` and `LOGIN_PASSWORD` with valid credentials
3. Ensure your API server is running

All tests should pass and you'll get comprehensive Allure reports.

### Watch Mode (for development)

```bash
npm run test:watch
```

## Using the Authentication Helper

The `authHelper` utility provides methods for authentication and making authenticated requests:

```javascript
const authHelper = require('./utils/auth');

// Login
const loginResult = await authHelper.login();
if (loginResult.success) {
  console.log('Logged in successfully!');
}

// Make authenticated requests
const response = await authHelper.makeAuthenticatedRequest('GET', '/api/some-endpoint');

// Get auth headers for custom requests
const headers = authHelper.getAuthHeader();

// Check login status
if (authHelper.isLoggedIn()) {
  // User is logged in
}

// Logout
authHelper.logout();
```

## Test Structure

### Authentication Tests (`tests/auth.spec.js`)

The test suite includes comprehensive login testing:

1. **Successful Login**: Verifies login with valid credentials
2. **Failed Login**: Tests behavior with invalid credentials
3. **Network Error Handling**: Ensures graceful handling of connection issues
4. **Token Management**: Validates token storage and retrieval
5. **Logout Functionality**: Confirms proper token cleanup

### Allure Report Features

- **Epic**: Authentication
- **Features**: User Login, Token Management
- **Stories**: Successful Login, Failed Login, Network Error Handling, Token Persistence, Logout Functionality
- **Steps**: Detailed step-by-step test execution
- **Parameters**: Test parameters like BOID and Base URL
- **Descriptions**: HTML-formatted test descriptions

## Configuration Options

### Main Configuration (`config/config.js`)

- `baseUrl`: API base URL
- `loginCredentials`: BOID and password for login
- `allure`: Allure reporting directories
- `timeout`: Request timeout in milliseconds
- `retries`: Number of test retries

### Environment Variables

- `BASE_URL`: Override default API URL
- `LOGIN_BOID`: User BOID for authentication
- `LOGIN_PASSWORD`: User password for authentication
- `ALLURE_RESULTS_DIR`: Directory for Allure results
- `ALLURE_REPORT_DIR`: Directory for generated Allure reports

## API Endpoint Details

### Login Endpoint

- **Method**: POST
- **URL**: `{base_url}/login`
- **Body**:
  ```json
  {
    "boid": "string",
    "password": "string"
  }
  ```
- **Success Response**:
  ```json
  {
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
  ```

## Extending the Framework

### Adding New API Tests

1. Create new test files in the `tests/` directory
2. Use the `authHelper` for authentication
3. Follow the Allure reporting pattern with epic, feature, story, and steps

Example:

```javascript
const authHelper = require('../utils/auth');

describe('User Profile Tests', function() {
  before(async function() {
    // Login before running profile tests
    const loginResult = await authHelper.login();
    expect(loginResult.success).to.be.true;
  });

  it('should get user profile', async function() {
    allure.epic('User Management');
    allure.feature('Profile');
    allure.story('Get Profile');

    const response = await authHelper.makeAuthenticatedRequest('GET', '/api/profile');
    expect(response.success).to.be.true;
    // Add more assertions...
  });
});
```

### Adding New Utilities

Add utility functions to the `utils/` directory following the same pattern as `auth.js`.

## Troubleshooting

### Common Issues

1. **Tests failing with network errors**: Check your `BASE_URL` in `.env`
2. **Login failing**: Verify `LOGIN_BOID` and `LOGIN_PASSWORD` credentials
3. **Allure report not generating**: Ensure Allure CLI is installed globally
4. **Token errors**: Make sure to login before making authenticated requests

### Debug Mode

Run tests with detailed output:

```bash
DEBUG=* npm run test:simple
```

## Contributing

1. Follow the existing code structure
2. Add comprehensive Allure reporting to all tests
3. Update this README for any new features
4. Ensure all tests pass before committing

## License

ISC