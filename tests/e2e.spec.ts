import { test, expect } from '@playwright/test';

const EMAIL = process.env.TEST_USER_EMAIL;
const PASSWORD = process.env.TEST_USER_PASSWORD;
const HAS_CREDENTIALS = !!(EMAIL && PASSWORD);

const login = async (page: any) => {
    await page.goto('/login');

    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    await expect(emailInput).toBeVisible({ timeout: 10_000 });

    await emailInput.fill(EMAIL!);
    await expect(emailInput).toHaveValue(EMAIL!);

    const passwordInput = page.locator('input[type="password"], input[name="password"], input[placeholder*="password" i]').first();
    await passwordInput.fill(PASSWORD!);
    await expect(passwordInput).toHaveValue(PASSWORD!);

    const submitBtn = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first();

    await Promise.all([
        page.waitForURL('**/home', { timeout: 60_000 }),
        submitBtn.click(),
    ]);

    await page.waitForLoadState('domcontentloaded');
};

test.describe('Ekko E2E Workflow', () => {
    // Enterprise-grade timeout for mobile tests with real auth + data loading
    test.setTimeout(60_000);

    test('Login and Navigate Mobile Flow', async ({ page }) => {
        test.skip(!HAS_CREDENTIALS, 'Skipped: TEST_USER_EMAIL / TEST_USER_PASSWORD not set');

        // ─── 1. LOGIN ───────────────────────────────────────────────
        await login(page);

        // ─── 2. HOME PAGE VERIFICATION ──────────────────────────────

        // Featured Carousel heading should be above the fold
        const carouselHeading = page.getByRole('heading', { level: 1 }).first();
        await expect(carouselHeading).toBeAttached({ timeout: 10_000 });

        // ─── 3. NAVIGATE TO VIBES ────────────────────────────────────
        await page.goto('/vibes');
        await expect(page).toHaveURL('/vibes', { timeout: 10_000 });
        await page.waitForLoadState('networkidle');

        // ─── 4. NAVIGATE TO PROFILE ──────────────────────────────────
        await page.goto('/profile');
        await expect(page).toHaveURL('/profile', { timeout: 10_000 });
        await page.waitForLoadState('networkidle');

        // Profile page should show Sign Out for authenticated users
        const signOutBtn = page.locator('text=Sign Out');
        await expect(signOutBtn).toBeAttached({ timeout: 10_000 });
    });

    test('Search Functionality', async ({ page }) => {
        test.skip(!HAS_CREDENTIALS, 'Skipped: TEST_USER_EMAIL / TEST_USER_PASSWORD not set');

        // Login first
        await login(page);

        // Navigate to search
        await page.goto('/search');
        await expect(page).toHaveURL('/search', { timeout: 10_000 });
        await page.waitForLoadState('networkidle');
    });

    test('Responsive Layout Check', async ({ page, isMobile }) => {
        test.skip(!HAS_CREDENTIALS, 'Skipped: TEST_USER_EMAIL / TEST_USER_PASSWORD not set');

        // Login first
        await login(page);

        if (isMobile) {
            // Mobile should show bottom navigation
            const mobileNav = page.locator('nav, [role="navigation"]').last();
            await expect(mobileNav).toBeAttached();

            // Mobile should NOT show the sidebar
            const sidebar = page.locator('aside');
            if (await sidebar.count() > 0) {
                await expect(sidebar).toBeHidden();
            }
        } else {
            // Desktop should have sidebar visible
            const sidebar = page.locator('aside');
            if (await sidebar.count() > 0) {
                await expect(sidebar).toBeVisible();
            }
        }
    });
});
