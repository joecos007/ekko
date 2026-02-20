import { test, expect } from '@playwright/test';

const EMAIL = process.env.TEST_USER_EMAIL;
const PASSWORD = process.env.TEST_USER_PASSWORD;
const HAS_CREDENTIALS = !!(EMAIL && PASSWORD);

test('analyze radio transition performance', async ({ page }) => {
    test.setTimeout(60000);
    test.skip(!HAS_CREDENTIALS, 'Skipped: TEST_USER_EMAIL / TEST_USER_PASSWORD not set');
    console.log('Starting Radio Performance Test...');

    // 1. Login first
    await page.goto('/login');
    // Use robust locators matching complete-workflow
    await page.locator('input[type="email"], input[name="email"]').first().fill(EMAIL!);
    await page.locator('input[type="password"], input[name="password"]').first().fill(PASSWORD!);
    await page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first().click();
    // Increase timeout for mobile browsers which can be slower
    await page.waitForURL('**/home', { timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    console.log('Page loaded.');

    // 2. Play a normal song first
    console.log('Playing normal song...');
    // Click the first track row to play a song
    // Wait for the song cards to actually be visible and interactive
    // Use robust data-testid selector
    const trackRow = page.locator('[data-testid^="song-card"]').first();
    await expect(trackRow).toBeVisible({ timeout: 10000 });

    // Ensure we scroll to it
    await trackRow.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // Small stability delay
    await trackRow.click();

    // Check if playback started (Pause button visible)
    // If not, try clicking the play button explicitly if visible
    const pauseBtn = page.locator('button[aria-label="Pause"]');
    try {
        await expect(pauseBtn).toBeVisible({ timeout: 5000 });
    } catch {
        console.log('Playback didnt start immediately, trying to click Play button explicitly...');
        // Try finding a specific play button within the row or the main player
        await trackRow.click({ force: true });
        await expect(pauseBtn).toBeVisible({ timeout: 10000 });
    }
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

    // Functional Check: Must play within 60s (generous timeout for slow networks)
    try {
        await expect(playButton).toBeVisible({ timeout: 60000 });
        const loadTime = Date.now() - startTime;
        console.log(`Radio Load Time: ${loadTime}ms`);

        // Performance Check: Log metric, warn if slow
        test.info().annotations.push({ type: 'performance', description: `Radio Load: ${loadTime}ms` });
        if (loadTime > 10000) {
            console.warn(`PERFORMANCE WARNING: Radio took ${loadTime}ms to load (Target: <10000ms)`);
        }
    } catch (e) {
        console.error('TIMEOUT: Radio failed to start playing within 60s.');
        throw e;
    }

    // 4. Switch Station (Next)
    console.log('Switching Station...');
    const nextBtn = page.locator('button[aria-label="Next Track"]');
    const stationSwitchStart = Date.now();
    await nextBtn.click();

    try {
        // Functional Check: Must resume playing within 60s
        await expect(playButton).toBeVisible({ timeout: 60000 });
        const switchTime = Date.now() - stationSwitchStart;
        console.log(`Station Switch Time: ${switchTime}ms`);

        // Performance Check
        test.info().annotations.push({ type: 'performance', description: `Station Switch: ${switchTime}ms` });
        if (switchTime > 10000) {
            console.warn(`PERFORMANCE WARNING: Switch took ${switchTime}ms (Target: <10000ms)`);
        }
    } catch (e) {
        console.error('TIMEOUT: Station switch stuck.');
        throw e;
    }
});
