import { test, expect } from '@playwright/test'

test('Landing page verification', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.waitForLoadState('domcontentloaded')

    // Check Hero Heading
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
    await expect(heading).toContainText('Every Story')

    // Check "Create. Share. Connect." text presence
    const shinyText = page.locator('text=Create. Share. Connect.')
    await expect(shinyText).toBeVisible()

    // Check if overlap is avoided (basic bounding box check - heuristic)
    const headerBox = await page.locator('header').boundingBox()
    const contentBox = await page.locator('h1').boundingBox()

    if (headerBox && contentBox) {
        console.log('Header bottom:', headerBox.y + headerBox.height)
        console.log('Content top:', contentBox.y)
        // Expect content to be below header
        expect(contentBox.y).toBeGreaterThan(headerBox.y + headerBox.height)
    }
})
