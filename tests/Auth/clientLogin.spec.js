import { test, expect, request } from '@playwright/test';
import { clientLogin } from '../../utils/login.js';
import { allure } from 'allure-playwright';
import fs from 'fs';

test.describe('Client Login API', () => {

  test.beforeAll(() => {
    fs.writeFileSync('allure-results/environment.properties', 
      `Base URL=${process.env.BASE_URL}\nBOID=${process.env.LOGIN_BOID}`
    );
  });

  test('Login API should return tokens', async () => {
    const apiRequest = await request.newContext();

    const loginResponse = await clientLogin(apiRequest);

    await allure.step('Attach Login Response', () => {
      allure.attachment('Login Response', JSON.stringify(loginResponse, null, 2), 'application/json');
    });

    await allure.step('Verify Tokens', () => {
      expect(loginResponse.token).toBeDefined();
      expect(loginResponse.refreshToken).toBeDefined();
    });
  });

});
