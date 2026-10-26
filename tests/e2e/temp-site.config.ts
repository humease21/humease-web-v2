import path from 'node:path';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: path.resolve(process.cwd(), 'tests/e2e'),
  testMatch: 'temp-site.spec.ts',
  workers: 4,
  retries: 0,
  reporter: 'list',
  outputDir: path.resolve(process.cwd(), 'docs/agent/e2e/screenshots'),
  use: {
    baseURL: 'http://localhost:4310',
    screenshot: 'only-on-failure',
    trace: 'off',
  },
  projects: [
    {
      name: '320',
      use: {
        browserName: 'chromium',
        viewport: { width: 320, height: 900 },
      },
    },
    {
      name: '390',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 900 },
      },
    },
    {
      name: '430',
      use: {
        browserName: 'chromium',
        viewport: { width: 430, height: 900 },
      },
    },
    {
      name: '768',
      use: {
        browserName: 'chromium',
        viewport: { width: 768, height: 900 },
      },
    },
    {
      name: '1440',
      use: {
        browserName: 'chromium',
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: '1920',
      use: {
        browserName: 'chromium',
        viewport: { width: 1920, height: 900 },
      },
    },
  ],
});
