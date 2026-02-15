import { test, expect } from '@playwright/test';

test.describe('Marquee Component', () => {
    test('should display AI keywords without visual overlap', async ({ page }) => {
        // Navigate to the landing page
        await page.goto('/');

        // Wait for the marquee to be visible
        const marqueeSection = page.locator('section').filter({ hasText: 'GENERATIVE AUDIO' }).first();
        await expect(marqueeSection).toBeVisible();

        // Check if multiple AI keywords are present
        const keyword1 = marqueeSection.getByText('GENERATIVE AUDIO').first();
        const keyword2 = marqueeSection.getByText('NEURAL SYNTHESIS').first();

        await expect(keyword1).toBeVisible();
        await expect(keyword2).toBeVisible();

        // Basic bounding box check - checking if they are not on top of each other
        // Note: This is a snapshot-in-time check. Since they are moving, we check strictly if they exist separate.
        const box1 = await keyword1.boundingBox();
        const box2 = await keyword2.boundingBox();

        if (box1 && box2) {
            // Check that box2 is to the right of box1 (or vice versa depending on order, but generally they should be spaced)
            // We can check if their x-coordinates overlap seriously (e.g. box1.x < box2.x)
            console.log('Box 1 X:', box1.x, 'Box 2 X:', box2.x);
            expect(Math.abs(box1.x - box2.x)).toBeGreaterThan(50); // Arbitrary large gap check
        }
    });

    test('should have correct robust styling classes', async ({ page }) => {
        await page.goto('/');

        // Find the marquee inner container
        // We look for the div that has the animation class or style
        const ticker = page.locator('.animate-marquee').first();

        // Verify it has min-w-max (or equivalent styles we applied)
        await expect(ticker).toHaveClass(/min-w-max/);
        await expect(ticker).toHaveClass(/justify-start/);
    });
});
