import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 720 } });

const EMAIL = process.env.TEST_USER_EMAIL;
const PASSWORD = process.env.TEST_USER_PASSWORD;

// This test requires authentication to access the dashboard
test.skip(!EMAIL || !PASSWORD, 'Skipped: TEST_USER_EMAIL and TEST_USER_PASSWORD are required');

test('carousel enhancement verification', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', EMAIL!);
    await page.fill('input[type="password"]', PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/home', { timeout: 15000 });

    // 2. Wait for Carousel — look for "Featured Artist" text in HeroBanner
    await expect(page.getByText('Featured Artist').first()).toBeVisible({ timeout: 10000 });

    // 3. Verify "Listen" button is GONE
    const listenButton = page.locator('button').filter({ hasText: 'Listen' });
    await expect(listenButton).toBeHidden();

    // 4. Verify "View Artist" button is PRESENT
    const viewArtistButton = page.getByRole('button', { name: 'View Artist' }).first();
    await expect(viewArtistButton).toBeVisible();

    // 5. Verify "Vibe Match" badge is PRESENT
    const vibeBadge = page.getByText(/% Match/);
    await expect(vibeBadge.first()).toBeVisible();
});
