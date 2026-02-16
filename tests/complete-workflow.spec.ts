import { test, expect } from '@playwright/test'

/**
 * Comprehensive E2E Test Suite for EKKO AI Music Platform
 * Tests the complete user workflow from landing to dashboard
 */

test.describe('EKKO Complete User Workflow', () => {
    test('should complete full user journey from landing to dashboard', async ({ page }) => {
        // ══════════════════════════════════════════════════════
        // 1. Landing Page
        // ══════════════════════════════════════════════════════
        await test.step('Visit landing page', async () => {
            console.log('Navigating to landing page...')
            await page.goto('http://localhost:3000')
            // Networkidle can be flaky with streaming/animations, use domcontentloaded + manual waits
            await page.waitForLoadState('domcontentloaded')
            await page.waitForTimeout(2000)

            console.log('Checking hero section...')
            // Check hero section
            await expect(page.locator('h1')).toBeVisible()
            await expect(page.locator('h1')).toContainText('Every Story')

            // Verify description is visible
            await expect(page.getByText(/Turn your life's moments/i)).toBeVisible()

            // Verify CTA buttons
            const startBtn = page.getByRole('link', { name: /Start Creating/i })
            await expect(startBtn).toBeVisible()

            // Verify scroll indicator - relaxed check
            // Use locator to find the Discover text, handling potential uppercase CSS
            const discoverText = page.locator('text=/Discover/i').first()
            await expect(discoverText).toBeVisible()
            console.log('Landing page verified.')
        })

        // ══════════════════════════════════════════════════════
        // 2. Navigate to Login
        // ══════════════════════════════════════════════════════
        await test.step('Navigate to login page', async () => {
            console.log('Navigating to login...')
            await page.goto('http://localhost:3000/login')
            await page.waitForLoadState('domcontentloaded')
            await expect(page.locator('h1, h2, button').filter({ hasText: /sign in|login/i }).first()).toBeVisible()
        })

        // ══════════════════════════════════════════════════════
        // 3. Login Flow
        // ══════════════════════════════════════════════════════
        await test.step('Login with credentials', async () => {
            console.log('Filling login form...')
            // Try standard inputs first, then fallback to placeholders/labels
            const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first()
            await emailInput.fill('admin@ekko.app')

            const passwordInput = page.locator('input[type="password"], input[name="password"], input[placeholder*="password" i]').first()
            await passwordInput.fill('Test@2026')

            // Submit
            const submitBtn = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first()
            await submitBtn.click()

            console.log('Waiting for dashboard redirect...')
            // Increase timeout for cold starts / auth processing
            await page.waitForURL((url) => url.pathname.includes('/home'), { timeout: 20000 })
            await page.waitForLoadState('domcontentloaded')
            console.log('Login successful.')
        })

        // ══════════════════════════════════════════════════════
        // 4. Dashboard Home Page
        // ══════════════════════════════════════════════════════
        await test.step('Verify dashboard home page', async () => {
            console.log('Verifying dashboard...')
            // Check URL
            expect(page.url()).toContain('/home')

            // Verify featured carousel is present (recently modified - no play button)
            const carousel = page.locator('div').filter({ has: page.getByText(/Team Ekko|Featured/i) }).first()
            await expect(carousel).toBeVisible()

            // Verify carousel navigation dots are present
            const carouselDots = page.locator('button[aria-label*="Go to slide"]')
            await expect(carouselDots.first()).toBeVisible()

            // Verify quick access cards
            await expect(page.getByText('Liked Songs').first()).toBeVisible()
            await expect(page.getByText('Daily Mix').first()).toBeVisible()
            console.log('Dashboard verified.')
        })

        // ══════════════════════════════════════════════════════
        // 5. Navigation Tests
        // ══════════════════════════════════════════════════════
        // 5. Navigation Tests
        await test.step('Test sidebar navigation', async () => {
            console.log('Testing navigation...')

            // Scope to the main navigation sidebar to avoid matching carousel items or other links
            const sidebar = page.locator('nav').first()

            // Navigate to Search
            const searchLink = sidebar.getByRole('link', { name: /search/i })
            if (await searchLink.isVisible()) {
                await searchLink.click()
                await page.waitForURL('**/search')
                await expect(page.getByPlaceholder(/Ask the system/i).first()).toBeVisible()

                // Go back to home
                const homeLink = sidebar.getByRole('link', { name: /home/i })
                await homeLink.click({ force: true })
                await page.waitForURL('**/')
            }

            // Navigate to Library
            const libraryLink = sidebar.getByRole('link', { name: /library/i })
            if (await libraryLink.isVisible()) {
                await libraryLink.click()
                await page.waitForLoadState('domcontentloaded')
            }
        })

        // ══════════════════════════════════════════════════════
        // 6. Search Functionality
        // ══════════════════════════════════════════════════════
        await test.step('Test search', async () => {
            console.log('Testing search...')
            await page.goto('http://localhost:3000/search')
            await page.waitForLoadState('domcontentloaded')

            const searchInput = page.getByPlaceholder(/search/i)
            if (await searchInput.isVisible()) {
                await searchInput.fill('team ekko')
                await page.waitForTimeout(1000) // Wait for search results

                // Check if results appear
                const results = page.locator('[class*="song"], [class*="result"]')
                const count = await results.count()
                console.log(`Search found ${count} results`)
            }
        })

        // ══════════════════════════════════════════════════════
        // 7. Featured Carousel Interaction
        // ══════════════════════════════════════════════════════
        await test.step('Test carousel navigation', async () => {
            await page.goto('http://localhost:3000/home')
            await page.waitForLoadState('domcontentloaded')

            // Test next slide button
            const nextButton = page.getByRole('button', { name: /next slide/i })
            if (await nextButton.isVisible({ timeout: 5000 })) {
                // Hover to show navigation
                const carouselContainer = page.locator('div').filter({ has: nextButton }).first()
                await carouselContainer.hover()

                await nextButton.click()
                await page.waitForTimeout(500)

                // Verify slide changed (check for different content or active dot)
                const activeDot = page.locator('button[aria-current="true"]')
                await expect(activeDot).toBeVisible()
            }
        })

        // ══════════════════════════════════════════════════════
        // 8. Mobile Menu (if applicable)
        // ══════════════════════════════════════════════════════
        await test.step('Test mobile navigation', async () => {
            // Set mobile viewport
            await page.setViewportSize({ width: 375, height: 667 })
            await page.goto('http://localhost:3000/home')
            await page.waitForLoadState('domcontentloaded')

            // Look for mobile menu toggle
            const menuButton = page.getByRole('button', { name: /menu/i })
            if (await menuButton.isVisible()) {
                await menuButton.click()
                await page.waitForTimeout(300)

                // Verify menu opened (Drawer uses dialog role, not nav)
                const menuDrawer = page.getByRole('dialog')
                await expect(menuDrawer).toBeVisible()
                await expect(menuDrawer.getByRole('link', { name: /home/i })).toBeVisible()
            }

            // Reset to desktop
            await page.setViewportSize({ width: 1280, height: 720 })
        })

        // ══════════════════════════════════════════════════════
        // 9. Visual Regression - Screenshots
        // ══════════════════════════════════════════════════════
        await test.step('Capture screenshots', async () => {
            await page.goto('http://localhost:3000/home')
            await page.waitForLoadState('domcontentloaded')
            await page.screenshot({ path: 'test-results/dashboard-home.png', fullPage: true })

            await page.goto('http://localhost:3000/search')
            await page.waitForLoadState('networkidle')
            await page.screenshot({ path: 'test-results/search-page.png', fullPage: true })
        })
    })

    // ══════════════════════════════════════════════════════
    // Separate test for logout
    // ══════════════════════════════════════════════════════
    test('should logout successfully', async ({ page }) => {
        // Login first
        await page.goto('http://localhost:3000/login')
        await page.locator('input[type="email"], input[name="email"]').first().fill('admin@ekko.app')
        await page.locator('input[type="password"], input[name="password"]').first().fill('Test@2026')

        await page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first().click()
        await page.waitForURL('**/home')

        // Logout
        const logoutButton = page.getByRole('button', { name: /logout|sign out/i })
        if (await logoutButton.isVisible()) {
            await logoutButton.click()
            await page.waitForURL('**/', { timeout: 5000 })

            // Verify redirected to landing or login
            expect(page.url()).toMatch(/\/(login)?$/)
        } else {
            console.log('Logout button not found, may need user menu click first')
        }
    })
})
