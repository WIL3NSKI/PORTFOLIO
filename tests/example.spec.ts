import { test, expect } from '@playwright/test'


test.describe('Karol Home page tests', () => {

	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:4200/')
	})

	test('has correct title', async ({ page }) => {
		await expect(page).toHaveTitle(/Front/)
	})

	test('navigate to about section', async ({ page }) => {
		await page.click('text=about')
	})

	test('click lorem ipsum button', async ({ page }) => {
		await page.click('text=LOREM IPSUM')
	})

	test('click lorem ipsum 2 button', async ({ page }) => {
		await page.click('text=LOREM IPSUM 2')
	})
})