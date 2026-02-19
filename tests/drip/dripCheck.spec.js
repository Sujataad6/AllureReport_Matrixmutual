import { test, expect, request } from '@playwright/test';
import { allure } from "allure-playwright";
import { clientLogin } from '../../utils/login.js';
import { logger } from '../../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

test.describe('DRIP Management API', () => {

    test('API-DRIP-001: Check DRIP Enrollment Status', async () => {
        allure.suite("DRIP Management");
        allure.subSuite("Status Check Tests");
        allure.severity("normal");
        allure.description("Checks whether a user is enrolled in the DRIP for a specific scheme using vault variables.");
        allure.tag("DRIP", "Status", "POST");

        const apiRequest = await request.newContext();
        let token;

        await test.step('Authentication', async () => {
            const loginData = await clientLogin(apiRequest);
            token = loginData.token;
            expect(token).toBeTruthy();
        });

        const requestBody = {
            scheme: parseInt(process.env.VAULT_SCHEME),
            user: parseInt(process.env.VAULT_USER)
        };

        await test.step('Execute DRIP Check API', async () => {
            const response = await apiRequest.post(`${process.env.BASE_URL}/drips/check`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: requestBody
            });

            const responseTime = response.headersArray().find(h => h.name.toLowerCase() === 'x-response-time')?.value;
            logger.info(`DRIP Check Response Time: ${responseTime || 'N/A'}`);

            
            expect(response.status()).toBe(200);

            const body = await response.json();
            
           
            logger.info(`DRIP Check Response Body: ${JSON.stringify(body, null, 2)}`);
            allure.attachment("DRIP Check Response", JSON.stringify(body, null, 2), "application/json");

            expect(body.isEnabled).toBeDefined();
            expect(body.drip.userId).toBe(parseInt(process.env.VAULT_USER));
        });
    });
});