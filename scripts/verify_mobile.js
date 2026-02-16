import { chromium, devices } from 'playwright-core';

(async () => {
    try {
        console.log('Launching browser for mobile verification...');
        const browser = await chromium.launch();
        const context = await browser.newContext({
            ...devices['iPhone 12'], // Simulate iPhone 12
        });
        const page = await context.newPage();

        // Check Home Page
        console.log('Navigating to Home (Mobile)...');
        await page.goto('http://localhost:3000/home');
        await page.waitForTimeout(2000); // Wait for load

        // Check for Horizontal Overflow
        const overflow = await page.evaluate(() => {
            return document.body.scrollWidth > window.innerWidth;
        });

        console.log(`Horizontal Overflow detected: ${overflow}`);
        if (overflow) {
            console.error('FAIL: Page content is wider than viewport!');
        } else {
            console.log('PASS: No horizontal overflow.');
        }

        // Take Screenshot
        await page.screenshot({ path: 'audit_mobile_home.png', fullPage: true });

        // Check Input Font Size (to prevent zoom)
        const inputFontSize = await page.evaluate(() => {
            const input = document.querySelector('input');
            if (input) {
                return window.getComputedStyle(input).fontSize;
            }
            return 'N/A';
        });
        console.log(`Input Font Size: ${inputFontSize}`);

        await browser.close();
        console.log('Mobile verification complete.');
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
})();
