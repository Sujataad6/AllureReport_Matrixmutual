# Matrix API Automation with Allure Reporting

Comprehensive API automation testing framework for the Matrix API using Playwright with detailed Allure reporting and test visualization.

## Features

- ✅ **Playwright API Testing** - Modern API testing framework with powerful request capabilities
- ✅ **Allure Reporting** - Beautiful, detailed test reports with steps, attachments, and metrics
- ✅ **Authentication Testing** - Reusable login utilities with token management
- ✅ **SIP Registration Tests** - Khalti payment integration testing
- ✅ **Environment Configuration** - Flexible configuration for different environments
- ✅ **Comprehensive Logging** - Winston-based logging for debugging
- ✅ **Error Handling** - Robust error handling and recovery mechanisms
- ✅ **Screenshots & Traces** - Automatic capture of traces and screenshots for failed tests

## Project Structure

```
matrixAPIAllureReport/
├── config/
│   ├── config.js              # Main configuration file
│   └── env.example            # Environment variables template
├── tests/
│   ├── Auth/
│   │   └── clientLogin.spec.js    # Client authentication tests
│   └── SIP Register/
│       └── Khalti/
│           └── KhaltiInitiate.spec.js  # Khalti payment tests
├── utils/
│   ├── login.js               # Client login utility
│   └── logger.js              # Winston logger configuration
├── playwright.config.js       # Playwright configuration
├── package.json               # Dependencies and scripts
├── playwright-report/         # Generated Playwright HTML reports
├── allure-results/            # Allure test results (JSON)
├── allure-report/             # Generated Allure HTML reports
└── README.md                  # This file
```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

This installs all required dependencies:
- **@playwright/test** - API testing framework
- **allure-playwright** & **allure-commandline** - Report generation
- **dotenv** - Environment variable management
- **winston** - Logging framework
- **axios** - HTTP client

### 2. Install Playwright Browsers (Optional)

For browser-based testing:

```bash
npm run playwright:install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root based on the template:

```bash
cp config/env.example .env
```

Edit `.env` with your actual configuration:

```env
# API Configuration
BASE_URL=https://your-api-domain.com

# Login Credentials
LOGIN_BOID=your_boid_number
LOGIN_PASSWORD=your_password
```

## Available Commands

### Testing

```bash
# Run all tests
npm run test

# Run tests with browser visible (headed mode)
npm run test:headed

# Run tests in debug mode with Playwright Inspector
npm run test:debug

# Install Playwright browsers
npm run playwright:install
```

### Allure Reporting

```bash
# Generate Allure report from results
npm run allure:generate

# Open Allure report in browser
npm run allure:open

# Run tests AND generate and open Allure report
npm run allure:report
```

## Running Tests

### Quick Start

To run all tests and view the Allure report:

```bash
npm run allure:report
```

This command will:
1. Execute all tests in the `tests/` directory
2. Collect results in `allure-results/`
3. Generate an interactive HTML report in `allure-report/`
4. Open the report in your default browser

### View Test Results

After running tests, check results in two ways:

**Playwright Report:**
```bash
npx playwright show-report
```

**Allure Report:**
```bash
npm run allure:open
```

## Test Suites

### 1. Authentication Tests (`tests/Auth/clientLogin.spec.js`)

Tests client login functionality and token management:

- **Login API should return tokens** - Verifies successful login returns both access and refresh tokens
- Validates token structure and presence
- Includes login response attachment to Allure report
- Environment properties capture for API configuration

**Key Features:**
- Uses `clientLogin()` utility from `utils/login.js`
- Attaches login response JSON to test report
- Validates token acquisition through Allure steps
- Captures environment variables (BASE_URL, BOID)

### 2. SIP Registration Tests (`tests/SIP Register/Khalti/KhaltiInitiate.spec.js`)

Tests SIP registration with Khalti payment integration.

**Extend these tests with:**
- Payment initiation validation
- Transaction status verification
- Error handling scenarios
- Payment confirmation workflows

## Configuration

### Environment Variables (`.env`)

```env
BASE_URL=http://localhost:3000           # API base URL
LOGIN_BOID=1111111111                    # Client BOID for authentication
LOGIN_PASSWORD=password123               # Client password
```

### Playwright Configuration (`playwright.config.js`)

```javascript
{
  testDir: './tests',
  reporter: [
    ['list'],                    // Console output
    ['allure-playwright', {      // Allure reporting
      outputFolder: 'allure-results'
    }]
  ],
  use: {
    trace: 'on',                 // Record execution traces
    screenshot: 'on',            // Capture screenshots
  }
}
```

## Using the Login Utility

The `clientLogin()` function provides authenticated API access:

```javascript
import { test, expect, request } from '@playwright/test';
import { clientLogin } from '../../utils/login.js';

test('API test with authentication', async () => {
  const apiRequest = await request.newContext();
  const loginResponse = await clientLogin(apiRequest);
  
  expect(loginResponse.token).toBeDefined();
  expect(loginResponse.refreshToken).toBeDefined();
  
  // Use token for further requests
  const authenticatedRequest = await apiRequest.get('/protected-endpoint', {
    headers: { Authorization: `Bearer ${loginResponse.token}` }
  });
});
```

## Allure Report Features

The Allure reports include:

- **Test Timeline** - Visual representation of test execution
- **Metrics** - Pass/fail statistics, duration, flakiness
- **Steps** - Detailed breakdown of test execution steps
- **Attachments** - JSON responses, logs, traces
- **Parameters** - Test parameters and environment configuration
- **History** - Track test results across test runs
- **Graphs** - Pass/fail trends, duration trends

### Adding Allure Steps

```javascript
import { allure } from 'allure-playwright';

test('example test', async () => {
  await allure.step('Step 1: Perform action', async () => {
    // Test code
  });

  await allure.step('Step 2: Verify result', async () => {
    // Assertion code
  });

  // Attach data to report
  allure.attachment('Response Data', JSON.stringify(data, null, 2), 'application/json');
});
```

## Logging

The project uses Winston logger for detailed logging. Configure in `utils/logger.js`:

```javascript
import { logger } from './logger.js';

logger.info('Test started');
logger.error('Test failed');
logger.debug('Debug info');
```

Logs are written to the `logs/` directory.

## Adding New Tests

1. Create a new test file in the appropriate `tests/` subdirectory:

```javascript
import { test, expect } from '@playwright/test';
import { clientLogin } from '../../utils/login.js';
import { allure } from 'allure-playwright';

test.describe('My Feature Tests', () => {
  
  test('Should do something', async () => {
    const apiRequest = await request.newContext();
    const loginResponse = await clientLogin(apiRequest);

    await allure.step('Perform action', async () => {
      const response = await apiRequest.get('/api/endpoint', {
        headers: { Authorization: `Bearer ${loginResponse.token}` }
      });
      
      allure.attachment('Response', JSON.stringify(response), 'application/json');
      expect(response.status()).toBe(200);
    });
  });
});
```

2. Run tests and view in Allure report:

```bash
npm run allure:report
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Tests fail with "Vault credentials missing"** | Check `.env` file exists and has `LOGIN_BOID` and `LOGIN_PASSWORD` |
| **"BASE_URL is not accessible"** | Verify API server is running and URL in `.env` is correct |
| **Allure report not generating** | Run `npm install -g allure-commandline` to install Allure CLI globally |
| **Port already in use** | Change port in configuration or kill existing process |
| **Login test fails** | Verify credentials are correct and API endpoint is `/login` |
| **Trace files not captured** | Ensure `trace: 'on'` in `playwright.config.js` |

## Development Workflow

1. **Create test file** in `tests/` with `.spec.js` extension
2. **Write test** with Playwright API and Allure reporting
3. **Run test** with `npm run test`
4. **Check report** with `npm run allure:open`
5. **Fix issues** and iterate

## Best Practices

- ✅ Use descriptive test names
- ✅ Add Allure steps for test visibility
- ✅ Attach responses and logs to reports
- ✅ Use `clientLogin()` for authenticated tests
- ✅ Handle errors gracefully
- ✅ Keep credentials in `.env`, never commit them
- ✅ Use environment variables for different environments
- ✅ Document complex test logic with comments

## Git Configuration

Add to `.gitignore` (if not already present):

```
node_modules/
.env
allure-results/
allure-report/
playwright-report/
test-results/
logs/
*.log
```

## Contributing

1. Create a new branch for your feature
2. Write tests with comprehensive Allure reporting
3. Ensure all tests pass: `npm run test`
4. Generate report: `npm run allure:report`
5. Commit and create a pull request

## Useful Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright API Testing](https://playwright.dev/docs/api-testing)
- [Allure Playwright](https://github.com/allure-framework/allure-playwright)
- [Allure Documentation](https://docs.qameta.io/allure/)
- [Winston Logger](https://github.com/winstonjs/winston)

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review test examples in `tests/` directory
3. Check Allure report for detailed failure information
4. Enable debug mode: `npm run test:debug`