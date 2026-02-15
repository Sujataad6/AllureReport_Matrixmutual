import { test, expect } from "@playwright/test";
import axios from "axios";
import dotenv from "dotenv";
import { loginUser } from "../../../utils/login.js";
import logger from "../../../utils/logger.js";

dotenv.config({ path: "D:/officeProject/matrixAPIAllureReport/.env" });

test.describe("Khalti Payment Suite", () => {

  test("API-KHALTI-001: Initiate Khalti SIP Payment", async () => {
    const testInfo = test.info();

    // Allure metadata
    testInfo.annotations.push({ type: "epic", description: "Payments" });
    testInfo.annotations.push({ type: "feature", description: "Khalti Gateway" });
    testInfo.annotations.push({ type: "story", description: "SIP Payment Initiation" });
    testInfo.annotations.push({ type: "severity", description: "critical" });

    // Step 1: Login and get token
    let token;
    await test.step("Step 1: Login to API", async () => {
      token = await loginUser(testInfo);
      expect(token).toBeTruthy();
      logger.info(`Token ready for Khalti API: ${token}`);
    });

    // Step 2: Prepare Khalti payment request
    const requestBody = {
      amount: 1100,
      transactionType: "sip",
      scheme: "1",
      returnUrl: "https://uat.matrixmutual.uxqode.co/payment/success",
      sip: {
        intervalType: "monthly",
        mode: "unlimited",
        installmentNumber: 0,
        startDate: "2026-02-11"
      }
    };

    // Step 3: Initiate Khalti Payment
    await test.step("Step 2: Initiate Khalti SIP Payment", async () => {
      try {
        const response = await axios.post(
          `${process.env.BASE_URL}/payments/khalti/initiate`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`, // <-- now correct
              "Content-Type": "application/json"
            }
          }
        );

        logger.info(`Khalti API response: ${JSON.stringify(response.data, null, 2)}`);

        await testInfo.attach("Khalti Payment Response", {
          body: JSON.stringify(response.data, null, 2),
          contentType: "application/json"
        });

        // Step 4: Validate response
        expect(response.status).toBe(200);
        expect(response.data.pidx).toBeTruthy();
        expect(response.data.payment_url).toContain("http");
        expect(response.data.expires_at).toBeTruthy();
        expect(response.data.expires_in).toBeGreaterThan(0);

        logger.info("Khalti SIP Payment validated successfully");

      } catch (error) {
        if (error.response) {
          logger.error(`Khalti API failed: ${JSON.stringify(error.response.data, null, 2)}`);
          logger.error(`Status code: ${error.response.status}`);
          logger.error(`Headers: ${JSON.stringify(error.response.headers, null, 2)}`);
        } else if (error.request) {
          logger.error(`No response received: ${error.request}`);
        } else {
          logger.error(`Error: ${error.message}`);
        }
        throw error;
      }
    });

    logger.info("Khalti SIP Payment test completed successfully");
  });

});
