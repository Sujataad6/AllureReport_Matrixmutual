import { test, expect } from '@playwright/test';
import { loginUser } from '../../utils/login.js';
import { allure } from 'allure-playwright';

test.describe('API Authentication', () => {

  test('API-LOGIN-001: Verify client can login successfully', async ({}, testInfo) => {

    // ================= ALLURE STRUCTURE =================

    await allure.parentSuite('API Automation');
    await allure.suite('Authentication Module');
    await allure.subSuite('Client Login');

    await allure.epic('User Management');
    await allure.feature('Authentication');
    await allure.story('Client Login with valid credentials');

    await allure.severity('critical');
    await allure.owner('Sujata Adhikari');
    await allure.tag('API');
    await allure.tag('Smoke');

    let token;

    // ================= TEST STEPS =================

    await test.step('Given valid credentials exist', async () => {
      expect(process.env.LOGIN_BOID, 'LOGIN_BOID is missing').toBeTruthy();
      expect(process.env.LOGIN_PASSWORD, 'LOGIN_PASSWORD is missing').toBeTruthy();
    });

    await test.step('When login API is called', async () => {
      token = await loginUser(testInfo);
    });

    await test.step('Then access token should be returned', async () => {
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');

      await testInfo.attach('Token Info', {
        body: `Token received successfully. Length: ${token.length}`,
        contentType: 'text/plain'
      });
    });

  });

});
