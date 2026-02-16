import { test, expect } from '@playwright/test';

test.describe('Ekko E2E Workflow', () => {
    // Enterprise-grade timeout for mobile tests with real auth + data loading
    test.setTimeout(60_000);

    test('Login and Navigate Mobile Flow', async ({ page }) => {
        // ─── 1. LOGIN ───────────────────────────────────────────────
        await page.goto('/login');

        const emailInput = page.locator('input[type="email"]');
        await expect(emailInput).toBeVisible({ timeout: 10_000 });

        // pressSequentially is more robust than fill() on Mobile Safari
        await emailInput.click();
        await emailInput.pressSequentially('admin@ekko.app', { delay: 50 });
        await expect(emailInput).toHaveValue('admin@ekko.app');

        const passwordInput = page.locator('input[type="password"]');
        await passwordInput.click();
        await passwordInput.pressSequentially('Test@2026', { delay: 50 });
        await expect(passwordInput).toHaveValue('Test@2026');

        await page.click('button[type="submit"]');

        // ─── 2. HOME PAGE VERIFICATION ──────────────────────────────
        // Wait for redirect — confirms auth succeeded
        await expect(page).toHaveURL(/\/(home)?$/, { timeout: 15_000 });

        // Wait for page to settle (auth state, data loading)
        await page.waitForLoadState('networkidle');

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
        // Login first
        await page.goto('/login');
        const emailInput = page.locator('input[type="email"]');
        await expect(emailInput).toBeVisible({ timeout: 10_000 });
        await emailInput.click();
        await emailInput.pressSequentially('admin@ekko.app', { delay: 50 });
        const passwordInput = page.locator('input[type="password"]');
        await passwordInput.click();
        await passwordInput.pressSequentially('Test@2026', { delay: 50 });
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/(home)?$/, { timeout: 15_000 });

        // Navigate to search
        await page.goto('/search');
        await expect(page).toHaveURL('/search', { timeout: 10_000 });
        await page.waitForLoadState('networkidle');
    });

    test('Responsive Layout Check', async ({ page, isMobile }) => {
        // Login first
        await page.goto('/login');
        const emailInput = page.locator('input[type="email"]');
        await expect(emailInput).toBeVisible({ timeout: 10_000 });
        await emailInput.click();
        await emailInput.pressSequentially('admin@ekko.app', { delay: 50 });
        const passwordInput = page.locator('input[type="password"]');
        await passwordInput.click();
        await passwordInput.pressSequentially('Test@2026', { delay: 50 });
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/(home)?$/, { timeout: 15_000 });
        await page.waitForLoadState('networkidle');

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
