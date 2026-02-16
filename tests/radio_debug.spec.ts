import { test, expect } from '@playwright/test';

test('analyze radio transition performance', async ({ page }) => {
    console.log('Starting Radio Performance Test...');

    // 1. Login first
    await page.goto('http://localhost:3000/login');
    // Use robust locators matching complete-workflow
    await page.locator('input[type="email"], input[name="email"]').first().fill('admin@ekko.app');
    await page.locator('input[type="password"], input[name="password"]').first().fill('Test@2026');
    await page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first().click();
    await page.waitForURL('**/home', { timeout: 30000 });

    // 2. Go to Home (ensure we are there)
    await page.goto('http://localhost:3000/home');
    await page.waitForLoadState('domcontentloaded');
    console.log('Page loaded.');

    // 2. Play a normal song first
    console.log('Playing normal song...');
    // Click the first track row to play a song
    // Wait for the song cards to actually be visible and interactive
    const trackRow = page.locator('.group.relative').first();
    await expect(trackRow).toBeVisible({ timeout: 10000 });
    await trackRow.click();

    // Wait for player to be active (Play/Pause button exists)
    await expect(page.locator('button[aria-label="Pause"]')).toBeVisible({ timeout: 10000 });
    console.log('Song playing (Pause button visible).');

    // Allow it to "play" for a bit
    await page.waitForTimeout(2000);

    // 3. Switch to Radio
    console.log('Switching to Live Radio...');
    const radioToggle = page.locator('button[aria-label="Toggle Live Radio"]');

    const startTime = Date.now();
    await radioToggle.click();

    // Wait for loading spinner or Pause state (meaning it started playing)
    // If it goes straight to playing, spinner might be too fast to catch
    // We wait for IS RADIO active state (red button) AND Pause button (playing)
    const playButton = page.locator('button[aria-label="Pause"]');
    const spinner = page.locator('.animate-spin');

    try {
        // If spinner appears, wait for it to go away
        if (await spinner.isVisible()) {
            console.log('Spinner detected.');
            await expect(spinner).not.toBeVisible({ timeout: 15000 });
        }
        // ensure we are playing
        await expect(playButton).toBeVisible({ timeout: 60000 });

        const loadTime = Date.now() - startTime;
        console.log(`Radio Load Time: ${loadTime}ms`);

        if (loadTime > 3000) {
            console.error(`PERFORMANCE WARNING: Radio took ${loadTime}ms to load.`);
        } else {
            console.log(`Performance acceptable: ${loadTime}ms.`);
        }

    } catch (e) {
        console.error('TIMEOUT: Radio failed to start playing within 15s.');
        throw e;
    }

    // 4. Switch Station (Next)
    console.log('Switching Station...');
    const nextBtn = page.locator('button[aria-label="Next Track"]');
    const stationSwitchStart = Date.now();
    await nextBtn.click();

    try {
        if (await spinner.isVisible()) {
            await expect(spinner).not.toBeVisible({ timeout: 15000 });
        }
        await expect(playButton).toBeVisible({ timeout: 15000 });
        const switchTime = Date.now() - stationSwitchStart;
        console.log(`Station Switch Time: ${switchTime}ms`);
    } catch (e) {
        console.error('TIMEOUT: Station switch stuck.');
        throw e;
    }
});
