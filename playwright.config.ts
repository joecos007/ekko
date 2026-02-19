
import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv'; // Load env vars

// Load env specific to tests if needed, but usually dev server handles it
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// When SKIP_WS=1, assume a dev server is already running on port 3000
const skipWebServer = process.env.SKIP_WS === '1';
const baseURL = skipWebServer ? 'http://localhost:3000' : 'http://localhost:3001';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
    ],
    ...(skipWebServer ? {} : {
        webServer: {
            command: 'npm run dev -- -p 3001',
            url: 'http://localhost:3001',
            reuseExistingServer: !process.env.CI,
            timeout: 120 * 1000,
        },
    }),
});
