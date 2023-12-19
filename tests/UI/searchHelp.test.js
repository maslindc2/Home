import { test, expect } from '@playwright/test';

test('Clicking on Search Help Icon, Help Dialog is now displayed to the user', async ({ page }) => {
	await page.goto('http://localhost:4173');
	await page.getByRole('img', { name: 'Search Help Button' }).click();
	await expect(page.locator('#help-dialog')).toBeVisible();
	await expect(page.getByRole('heading', {name: 'Search Help'})).toBeVisible();
	await expect(page.locator('#instructions')).toBeVisible();
	await expect(page.locator('#commands')).toBeVisible();
});

test('Clicking on Search Help Icon and the closing Dialog, Dialog box is not visible to user', async({page}) => {
	await page.goto('http://localhost:4173');
	await page.getByRole('img', { name: 'Search Help Button' }).click();
	await page.getByRole('button', { name: 'Close' }).click();
	await expect(page.locator('#help-dialog')).not.toBeVisible();
	await expect(page.getByRole('heading', {name: 'Search Help'})).not.toBeVisible();
	await expect(page.locator('#instructions')).not.toBeVisible();
	await expect(page.locator('#commands')).not.toBeVisible();
});

test.afterEach(async ({ page }, testInfo) => {
	if (testInfo.status !== 'passed') {
		// Capture a screenshot with a unique name based on the test title and timestamp
		const screenshotPath = `test-results/screenshots/${testInfo.title.replace(
			/\s+/g,
			'_'
		)}_${Date.now()}.png`;
		await page.locator('.date').screenshot({ path: screenshotPath });
		console.log(`Screenshot captured: ${screenshotPath}`);
	}
});
