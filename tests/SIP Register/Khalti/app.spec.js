import { test, expect, request } from '@playwright/test';
import { allure } from "allure-playwright"; 
import { clientLogin } from '../../../utils/login.js';
import { logger } from '../../../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generates current date in YYYY-MM-DD format
 */
const getFormattedToday = () => new Date().toISOString().split('T')[0];

test.describe('Khalti Payment Suite - SIP Support', () => {

  test('KHALTI-SIP-001: Initiate Khalti Payment with SIP', async () => {
    allure.suite("Payment Gateway: Khalti");
    allure.subSuite("SIP Transactions");
    allure.severity("critical");
    allure.description("Validates Khalti SIP initiation.");

    const apiRequest = await request.newContext();
    let token;

    await test.step('Authentication and Token Retrieval', async () => {
      const loginData = await clientLogin(apiRequest);
      token = loginData.token;
      
      allure.attachment("Login Data", JSON.stringify(loginData, null, 2), "application/json");
      expect(token, 'Access token should be valid').toBeTruthy();
      logger.info('Access token obtained successfully');
    });

    // Parse payload from ENV and dynamically inject today's date
    const basePayload = JSON.parse(process.env.KHALTI_SIP_PAYLOAD);
    const requestBody = {
      ...basePayload,
      sip: {
        ...basePayload.sip,
        startDate: getFormattedToday() // Overwrites ENV date with today's date
      }
    };

    await test.step('Initiate Khalti SIP Payment API', async () => {
      allure.attachment("Request Body (Sent to API)", JSON.stringify(requestBody, null, 2), "application/json");

      const response = await apiRequest.post(
        `${process.env.BASE_URL}/payments/khalti/initiate`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: requestBody
        }
      );

      let body;
      try {
        body = await response.json();
        allure.attachment("Response Body (Received from API)", JSON.stringify(body, null, 2), "application/json");
      } catch {
        const text = await response.text();
        allure.attachment("Error Response Text", text, "text/plain");
        logger.error(`Response is not JSON: ${text}`);
        throw new Error(`Khalti API returned non-JSON response`);
      }

      logger.info(`Khalti API response: ${JSON.stringify(body, null, 2)}`);

      expect(response.status()).toBe(200);
      expect(body).toMatchObject({
        pidx: expect.any(String),
        payment_url: expect.stringContaining("http"),
        expires_at: expect.any(String)
      });
      expect(body.expires_in).toBeGreaterThan(0);

      logger.info("Khalti SIP Payment validated successfully with today's date");
    });
  });
});