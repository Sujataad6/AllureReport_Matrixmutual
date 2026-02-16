import { logger } from './logger.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { BASE_URL, LOGIN_BOID, LOGIN_PASSWORD } = process.env;

/**
 * @param {import('@playwright/test').APIRequestContext} apiRequest
 */
export async function clientLogin(apiRequest) {
  if (!LOGIN_BOID || !LOGIN_PASSWORD) {
    throw new Error('Vault credentials missing in .env');
  }

  const response = await apiRequest.post(`${BASE_URL}/login`, {
    data: {
      boid: LOGIN_BOID,
      password: LOGIN_PASSWORD
    }
  });

  const body = await response.json();

  if (response.status() !== 200) {
    logger.error(`Login failed. Status: ${response.status()}, Response: ${JSON.stringify(body)}`);
    throw new Error(`Login failed with status: ${response.status()}`);
  }

  if (!body.token || !body.refreshToken) {
    logger.error(`Login response missing token/refreshToken: ${JSON.stringify(body)}`);
    throw new Error('Login response missing token or refreshToken');
  }

  process.env.ACCESS_TOKEN = body.token;
  process.env.REFRESH_TOKEN = body.refreshToken;

  logger.info(`Login successful: ${JSON.stringify(body)}`);

  return body;
}
