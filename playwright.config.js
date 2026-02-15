import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: "D:/officeProject/matrixAPIAllureReport/.env" });

export default defineConfig({
  testDir: "./tests",
  reporter: [
  ['list'], 
  ['allure-playwright', { outputFolder: 'allure-results' }]
],

  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      "Content-Type": "application/json"
    }
  }
});
