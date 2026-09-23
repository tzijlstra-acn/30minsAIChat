// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:8080',
    headless: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
    { name: '1280x720', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } } },
    { name: '1366x768', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } } },
    { name: '1440x900', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: '1920x1080', use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } } },
    { name: '1024x768', use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 } } },
    { name: '1280x720-zoom125', use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 576 }, deviceScaleFactor: 1.25 } },
    { name: '1280x720-zoom150', use: { ...devices['Desktop Chrome'], viewport: { width: 853, height: 480 }, deviceScaleFactor: 1.5 } },
  ],
  webServer: {
    command: 'python -m http.server 8080',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
    timeout: 10000,
  },
});
