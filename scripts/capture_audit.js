import { chromium } from 'playwright-core';

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await chromium.launch();
        const page = await browser.newPage();

        // Desktop Viewport
        await page.setViewportSize({ width: 1440, height: 900 });

        // 1. Home Page Audit
        console.log('Navigating to Home...');
        await page.goto('http://localhost:3000/home');
        await page.waitForTimeout(3000); // Wait for animations
        await page.screenshot({ path: 'audit_home.png', fullPage: true });

        // 2. Search Page Audit
        console.log('Navigating to Search...');
        await page.goto('http://localhost:3000/search');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'audit_search_empty.png', fullPage: true });

        // 3. Perform Search
        console.log('Performing Search...');
        const input = page.getByPlaceholder('Ask the system...');
        await input.fill('cyberpunk');
        await page.waitForTimeout(2000); // Wait for debounce and results
        await page.screenshot({ path: 'audit_search_results.png', fullPage: true });

        // 4. Verify Now Playing / Visualizer
        console.log('Testing Player...');
        // Go back home to ensure clean state
        await page.goto('http://localhost:3000/home');
        await page.waitForTimeout(2000);

        // Click the first play button found on a card
        // We target the first song card's play button
        const playBtn = page.locator('.glass-card button').first();
        if (await playBtn.isVisible()) {
            await playBtn.click();
        } else {
            // Fallback: click the card itself
            await page.locator('.glass-card').first().click();
        }
        console.log('Song clicked, waiting for player...');
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'debug_player_ready.png', fullPage: true });

        // Click the player bar to expand using coordinates (Bottom Center)
        // Viewport is 1440x900. Bar is at bottom.
        // Click at x=720, y=880 (20px from bottom)
        console.log('Clicking bottom center to expand...');
        await page.mouse.click(720, 880);

        console.log('Waiting for expansion...');
        await page.waitForTimeout(3000); // Wait for transition

        await page.screenshot({ path: 'audit_now_playing.png', fullPage: true });

        await browser.close();
        console.log('Audit complete.');
    } catch (error) {
        console.error('Audit failed:', error);
        process.exit(1);
    }
})();
