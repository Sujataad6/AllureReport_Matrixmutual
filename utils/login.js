import { request, expect } from '@playwright/test';

export async function loginUser(testInfo) {

  if (!process.env.LOGIN_API_URL) {
    throw new Error('LOGIN_API_URL is missing in .env');
  }

  if (!process.env.LOGIN_BOID) {
    throw new Error('LOGIN_BOID is missing in .env');
  }

  if (!process.env.LOGIN_PASSWORD) {
    throw new Error('LOGIN_PASSWORD is missing in .env');
  }

  const apiContext = await request.newContext();

  const response = await apiContext.post(process.env.LOGIN_API_URL, {
    data: {
      boid: process.env.LOGIN_BOID,
      password: process.env.LOGIN_PASSWORD,
    },
  });

  expect(response.status(), 'Login API failed').toBe(200);

  const body = await response.json();

  const token = body?.accessToken;

  if (testInfo) {
    await testInfo.attach('Login API Response', {
      body: JSON.stringify(body, null, 2),
      contentType: 'application/json'
    });
  }

  if (!token) {
    throw new Error('Access token not found in response');
  }

  return token;
}
