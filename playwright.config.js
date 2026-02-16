import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Ensure the reporter is defined exactly like this
  reporter: [
    ['list'], 
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  use: {
    // This helps Allure link traces and screenshots
    trace: 'on',
    screenshot: 'on',
  },
});