import { test, expect } from '@playwright/test';

test('SearchFunction change default to Discogs, placeholder now shows Discogs', async ({
	page
}) => {
	await page.goto('http://localhost:4173/');
	await page.getByPlaceholder('Search').click();
	await page.getByPlaceholder('Search').fill('!dc');
	await page.getByPlaceholder('Search').press('Enter');
	await expect(page.getByPlaceholder('Discogs')).toBeVisible();
});

test('SearchFunction change default to Ebay, placeholder now shows Ebay', async ({ page }) => {
	await page.goto('http://localhost:4173/');
	await page.getByPlaceholder('Search').click();
	await page.getByPlaceholder('Search').fill('!eb');
	await page.getByPlaceholder('Search').press('Enter');
	await expect(page.getByPlaceholder('Ebay')).toBeVisible();
});

test('SearchFunction change default to YouTube, placeholder now shows YouTube', async ({
	page
}) => {
	await page.goto('http://localhost:4173/');
	await page.getByPlaceholder('Search').click();
	await page.getByPlaceholder('Search').fill('!yt');
	await page.getByPlaceholder('Search').press('Enter');
	await expect(page.getByPlaceholder('YouTube')).toBeVisible();
});

test('SearchFunction change default to Wikipedia, placeholder now shows Wikipedia', async ({
	page
}) => {
	await page.goto('http://localhost:4173/');
	await page.getByPlaceholder('Search').click();
	await page.getByPlaceholder('Search').fill('!wk');
	await page.getByPlaceholder('Search').press('Enter');
	await expect(page.getByPlaceholder('Wikipedia')).toBeVisible();
});

test('SearchFunction change default to HifiShark, placeholder now shows HifiShark', async ({
	page
}) => {
	await page.goto('http://localhost:4173/');
	await page.getByPlaceholder('Search').click();
	await page.getByPlaceholder('Search').fill('!hs');
	await page.getByPlaceholder('Search').press('Enter');
	await expect(page.getByPlaceholder('HifiShark')).toBeVisible();
});

test('SearchFunction change default to Amazon, placeholder now shows Amazon', async ({ page }) => {
	await page.goto('http://localhost:4173/');
	await page.getByPlaceholder('Search').click();
	await page.getByPlaceholder('Search').fill('!am');
	await page.getByPlaceholder('Search').press('Enter');
	await expect(page.getByPlaceholder('Amazon')).toBeVisible();
});

test('SearchFunction change default to Reddit, placeholder now shows Reddit', async ({ page }) => {
	await page.goto('http://localhost:4173/');
	await page.getByPlaceholder('Search').click();
	await page.getByPlaceholder('Search').fill('!r');
	await page.getByPlaceholder('Search').press('Enter');
	await expect(page.getByPlaceholder('Reddit')).toBeVisible();
});

test('SearchFunction change default to Google, placeholder now shows Google', async ({ page }) => {
	await page.goto('http://localhost:4173/');
	await page.getByPlaceholder('Search').click();
	await page.getByPlaceholder('Search').fill('!g');
	await page.getByPlaceholder('Search').press('Enter');
	await expect(page.getByPlaceholder('Google')).toBeVisible();
});

test.afterEach(async ({ page }, testInfo) => {
	if (testInfo.status !== 'passed') {
		// Capture a screenshot with a unique name based on the test title and timestamp
		const screenshotPath = `test-results/screenshots/${testInfo.title.replace(
			/\s+/g,
			'_'
		)}_${Date.now()}.png`;
		await page.locator('.search').screenshot({ path: screenshotPath });
		console.log(`Screenshot captured: ${screenshotPath}`);
	}
});
