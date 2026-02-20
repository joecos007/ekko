import { test, expect } from '@playwright/test';

// Force desktop viewport — sidebar is hidden on mobile (hidden md:flex)
test.use({ viewport: { width: 1280, height: 720 } });

const EMAIL = process.env.TEST_USER_EMAIL;
const PASSWORD = process.env.TEST_USER_PASSWORD;

// This test requires authentication and desktop viewport
test.skip(!EMAIL || !PASSWORD, 'Skipped: TEST_USER_EMAIL and TEST_USER_PASSWORD are required');

test('sidebar collapse functionality', async ({ page, browserName }, testInfo) => {
    // Skip on mobile projects — sidebar is intentionally hidden on mobile
    const projectName = testInfo.project.name;
    if (projectName.toLowerCase().includes('mobile')) {
        test.skip();
        return;
    }

    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', EMAIL!);
    await page.fill('input[type="password"]', PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/home', { timeout: 15000 });

    // 1. Initial State: Sidebar should be expanded
    const sidebar = page.locator('.glass-sidebar');
    await expect(sidebar).toBeVisible({ timeout: 10000 });

    // Check width is roughly 256px (expanded)
    const initialBox = await sidebar.boundingBox();
    expect(initialBox?.width).toBeGreaterThan(200);

    // Check text labels are visible
    const homeButton = page.getByRole('button', { name: 'Home' }).first();
    await expect(homeButton).toBeVisible();

    // 2. Click Collapse Toggle
    const toggleButton = page.locator('.glass-sidebar > button');
    await toggleButton.click();

    // 3. Wait for animation
    await page.waitForTimeout(1000);

    // 4. Collapsed State: Width should be roughly 80px
    const collapsedBox = await sidebar.boundingBox();
    expect(collapsedBox?.width).toBeLessThan(100);
    expect(collapsedBox?.width).toBeGreaterThan(50);

    // Check text labels are NOT visible
    await expect(page.getByText('Home', { exact: true })).toBeHidden();

    // 5. Expand again
    await toggleButton.click();
    await page.waitForTimeout(1000);

    // 6. Initial State Restored
    const finalBox = await sidebar.boundingBox();
    expect(finalBox?.width).toBeGreaterThan(200);
});
