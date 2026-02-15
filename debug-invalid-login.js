/**
 * Debug invalid login response using Playwright
 */

const { request } = require('@playwright/test');

async function debugInvalidLogin() {
  console.log('🔍 Testing Invalid Login Response with Playwright\n');

  const requestContext = await request.newContext({
    baseURL: 'https://api.uat.matrixmutual.uxqode.co/api/v1'
  });

  try {
    console.log('📡 Testing invalid BOID...');
    const response = await requestContext.post('/login', {
      data: {
        boid: 'invalid_boid',
        password: 'Pass@123'
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'axios/1.13.2'
      }
    });

    console.log('Status:', response.status());
    const responseBody = await response.json();
    console.log('Response:', responseBody);

    if (responseBody.message) {
      console.log('✅ Error message found:', responseBody.message);
    }
    if (responseBody.error) {
      console.log('✅ Error field found:', responseBody.error);
    }

    // Also test the exact same request as the test
    console.log('\n📡 Testing exact same as test...');
    const response2 = await requestContext.post('https://api.uat.matrixmutual.uxqode.co/api/v1/login', {
      data: {
        boid: 'invalid_boid',
        password: 'Pass@123'
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'axios/1.13.2'
      }
    });

    console.log('Status 2:', response2.status());
    const responseBody2 = await response2.json();
    console.log('Response 2:', responseBody2);

  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  await requestContext.dispose();
}

// Run if called directly
if (require.main === module) {
  debugInvalidLogin().catch(console.error);
}

module.exports = debugInvalidLogin;