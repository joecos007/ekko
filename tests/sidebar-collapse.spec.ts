import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 720 } }); // Force desktop viewport

const EMAIL = process.env.TEST_USER_EMAIL;
const PASSWORD = process.env.TEST_USER_PASSWORD;

test('sidebar collapse functionality', async ({ page }) => {
    // 0. Login first (since sidebar is on protected /home)
    if (EMAIL && PASSWORD) {
        await page.goto('/login');
        await page.fill('input[type="email"]', EMAIL);
        await page.fill('input[type="password"]', PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForURL('**/home', { timeout: 15000 });
    } else {
        // Fallback or assume already logged in if using a persistent context,
        // but explicit login is safer for isolated tests.
        // If no credentials, we might fail if redirected.
        // Try going to home directly just in case.
        await page.goto('/home');
    }

    // 1. Initial State: Sidebar should be expanded
    // The sidebar container has the class 'glass-sidebar'
    const sidebar = page.locator('.glass-sidebar');
    await expect(sidebar).toBeVisible({ timeout: 10000 });

    // Check width is roughly 256px (expanded)
    const initialBox = await sidebar.boundingBox();
    expect(initialBox?.width).toBeGreaterThan(200);

    // Check text labels are visible
    // We can look for the "Home" text span specifically
    // The button contains the icon and text. Text is in a span or direct text node.
    // In our implementation: {!isCollapsed && <span className="truncate">Home</span>}
    // We look for a button that contains the text "Home"
    const homeButton = page.getByRole('button', { name: 'Home' }).first();
    await expect(homeButton).toBeVisible();

    // 2. Click Collapse Toggle
    // The toggle button is the one with the ChevronDown icon
    // It's an absolute positioned button at the top right of the sidebar
    // We can identify it precisely by its class structure or hierarchy
    const toggleButton = page.locator('.glass-sidebar > button');
    await toggleButton.click();

    // 3. Wait for animation
    await page.waitForTimeout(1000); // Wait for transition

    // 4. Collapsed State: Width should be roughly 80px
    const collapsedBox = await sidebar.boundingBox();
    expect(collapsedBox?.width).toBeLessThan(100);
    expect(collapsedBox?.width).toBeGreaterThan(50); // Sanity check

    // Check text labels are NOT visible
    // The "Home" text should be gone.
    // However, the button might still have "Home" as title or aria-label if we added it?
    // In the code: title={isCollapsed ? "Home" : undefined}
    // But the visible text should be gone.
    await expect(page.getByText('Home', { exact: true })).toBeHidden();

    // 5. Expand again
    await toggleButton.click();
    await page.waitForTimeout(1000);

    // 6. Initial State Restored
    const finalBox = await sidebar.boundingBox();
    expect(finalBox?.width).toBeGreaterThan(200);
});
