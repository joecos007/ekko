import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 720 } });

test('carousel enhancement verification', async ({ page }) => {
    // 1. Navigate to home (public or protected? It's dashboard, so protected)
    // We can assume we need login or if we reuse state.
    // Let's use the same pattern as sidebar test.

    // Quick login if needed
    const EMAIL = process.env.TEST_USER_EMAIL;
    const PASSWORD = process.env.TEST_USER_PASSWORD;

    if (EMAIL && PASSWORD) {
        await page.goto('/login');
        await page.fill('input[type="email"]', EMAIL);
        await page.fill('input[type="password"]', PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForURL('**/home', { timeout: 15000 });
    } else {
        await page.goto('/home');
    }

    // 2. Wait for Carousel
    // The carousel container is in HeroBanner
    // We can look for "Featured Artist" text
    await expect(page.getByText('Featured Artist').first()).toBeVisible({ timeout: 10000 });

    // 3. Verify "Listen" button is GONE
    // Use a specific locator for the old button content
    const listenButton = page.locator('button').filter({ hasText: 'Listen' });
    await expect(listenButton).toBeHidden();

    // 4. Verify "View Artist" button is PRESENT
    const viewArtistButton = page.getByRole('button', { name: 'View Artist' }).first();
    await expect(viewArtistButton).toBeVisible();

    // 5. Verify "Vibe Match" badge is PRESENT
    // It contains text matching "% Match"
    const vibeBadge = page.getByText(/% Match/);
    await expect(vibeBadge.first()).toBeVisible();
});
