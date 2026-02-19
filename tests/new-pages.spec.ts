import { test, expect } from '@playwright/test'

const EMAIL = process.env.TEST_USER_EMAIL!;
const PASSWORD = process.env.TEST_USER_PASSWORD!;

test.describe('Phase 18: New Pages & Link Fixes', () => {

    test('should navigate to public contact page', async ({ page }) => {
        await page.goto('/contact')
        await expect(page).toHaveURL(/.*contact/)
        await expect(page.getByRole('heading', { name: /Get in Touch/i })).toBeVisible()
        await expect(page.getByLabel('Name')).toBeVisible()
        await expect(page.getByLabel('Message')).toBeVisible()
    })

    test('should navigate to forgot password page from login', async ({ page }) => {
        await page.goto('/login')
        await page.getByRole('link', { name: /forgot password/i }).click()
        await expect(page).toHaveURL(/.*forgot-password/)
        await expect(page.getByRole('heading', { name: /Reset Password/i })).toBeVisible()
        await expect(page.getByLabel('Email')).toBeVisible()
    })

    test('should verify protected dashboard pages (require login)', async ({ page }) => {
        // Login first
        await page.goto('/login')
        await page.getByPlaceholder('you@domain.com').fill(EMAIL)
        await page.getByPlaceholder('••••••••').fill(PASSWORD)
        await page.getByRole('button', { name: /sign in/i }).click()
        await page.waitForURL('**/home')

        // 1. Categories Page
        await page.goto('/categories')
        await expect(page).toHaveURL(/.*categories/)
        await expect(page.getByText('Browse Categories')).toBeVisible()
        // Check for specific categories we added
        await expect(page.getByText('Pop')).toBeVisible()
        await expect(page.getByText('Hip-Hop')).toBeVisible()
        await expect(page.getByText('Lo-Fi')).toBeVisible()

        // 2. Artists Page
        await page.goto('/artists')
        await expect(page).toHaveURL(/.*artists/)
        await expect(page.getByText('Artists')).toBeVisible()
        await expect(page.getByText('Team Ekko')).toBeVisible()

        // 3. Verify Sidebar Links work
        // Note: Sidebar might be hidden on mobile, assuming desktop viewport for this test
        const sidebar = page.locator('aside')
        if (await sidebar.isVisible()) {
            await sidebar.getByRole('link', { name: /categories/i }).click()
            await expect(page).toHaveURL(/.*categories/)

            await sidebar.getByRole('link', { name: /artists/i }).click()
            await expect(page).toHaveURL(/.*artists/)
        }
    })

    test('should verify fixed legal links in signup', async ({ page }) => {
        await page.goto('/signup')

        // Check Terms link
        const termsLink = page.getByRole('link', { name: /terms of service/i })
        await expect(termsLink).toHaveAttribute('href', '/legal/terms')

        // Check Privacy link
        const privacyLink = page.getByRole('link', { name: /privacy policy/i })
        await expect(privacyLink).toHaveAttribute('href', '/legal/privacy')
    })
})
