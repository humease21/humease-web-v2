import path from 'node:path';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: path.resolve(process.cwd(), 'tests/e2e'),
  testMatch: /.*\.spec\.ts/,
  workers: 4,
  retries: 0,
  outputDir: path.resolve(process.cwd(), 'docs/agent/redesign/e2e-shots'),
  reporter: [
    ['list'],
    ['json', { outputFile: path.resolve(process.cwd(), 'docs/agent/redesign/e2e-results.json') }],
  ],
  use: {
    baseURL: 'http://localhost:4310',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'pc',
      use: {
        browserName: 'chromium',
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'tablet',
      use: {
        browserName: 'chromium',
        viewport: { width: 834, height: 1112 },
      },
    },
    {
      name: 'mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
