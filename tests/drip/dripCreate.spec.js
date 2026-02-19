import { test, expect, request } from '@playwright/test';
import { allure } from "allure-playwright";
import { clientLogin } from '../../utils/login.js';
import { logger } from '../../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

test.describe('DRIP Management API', () => {

    test('API-DRIP-002: Create DRIP Enrollment', async () => {
        allure.suite("DRIP Management");
        allure.subSuite("Enrollment Tests");
        allure.severity("critical");
        allure.description("Validates the creation of a new DRIP enrollment using environment variables.");
        allure.tag("DRIP", "Enrollment", "POST");

        const apiRequest = await request.newContext();
        let token;

        await test.step('Authentication', async () => {
            const loginData = await clientLogin(apiRequest);
            token = loginData.token;
            expect(token).toBeTruthy();
        });

        const requestBody = {
            scheme: parseInt(process.env.VAULT_SCHEME),
            user: parseInt(process.env.VAULT_USER),
            name: process.env.VAULT_NAME,
            mobileNumber: process.env.VAULT_MOBILE,
            depositoryParticipant: process.env.VAULT_DP,
            clientId: process.env.VAULT_CLIENT_ID,
            checked: true,
            boid: process.env.VAULT_BOID
        };

        await test.step('Execute Create DRIP API', async () => {
            const response = await apiRequest.post(`${process.env.BASE_URL}/drips`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: requestBody
            });

            const responseTime = response.headersArray().find(h => h.name.toLowerCase() === 'x-response-time')?.value;
            logger.info(`Create DRIP Response Time: ${responseTime || 'N/A'}`);

            expect(response.status()).toBe(201);

            const body = await response.json();
            
            logger.info(`Create DRIP Response Body: ${JSON.stringify(body, null, 2)}`);
            allure.attachment("Create DRIP Response", JSON.stringify(body, null, 2), "application/json");
        });
    });
});