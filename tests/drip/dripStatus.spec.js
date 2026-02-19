import { test, expect, request } from '@playwright/test';
import { allure } from "allure-playwright";
import { clientLogin } from '../../utils/login.js';
import { logger } from '../../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

test.describe('DRIP Status Module', () => {

    test('API-DRIP-001: Verify DRIP Enrollment Status', async () => {
        allure.suite("DRIP Management");
        allure.subSuite("Status Checks");
        allure.severity("critical");
        allure.description("Checks the Dividend Reinvestment Plan (DRIP) enrollment status for a specific user and scheme.");
        allure.tag("DRIP", "Status", "POST");

        const apiRequest = await request.newContext();
        let token;

        await test.step('Authentication', async () => {
            const loginData = await clientLogin(apiRequest);
            token = loginData.token;
            expect(token).toBeTruthy();
        });

        const requestBody = {
            user: parseInt(process.env.DRIP_USER_ID) || 3821,
            scheme: parseInt(process.env.DRIP_SCHEME_ID) || 1
        };

        await test.step('Execute DRIP Status Check', async () => {
            const response = await apiRequest.post(`${process.env.BASE_URL}/drips/check`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: requestBody
            });

            const responseTime = response.headersArray().find(h => h.name.toLowerCase() === 'x-response-time')?.value;
            logger.info(`DRIP Status Check Response Time: ${responseTime || 'N/A'}`);

            expect(response.status()).toBe(200);

            const body = await response.json();
            
            logger.info(`DRIP Status Response Body: ${JSON.stringify(body, null, 2)}`);
            allure.attachment("DRIP Status Response", JSON.stringify(body, null, 2), "application/json");
        });
    });
});