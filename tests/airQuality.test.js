// @ts-nocheck
import { PURPLE_AIR_API_KEY, SENSOR_LOCATION } from '$env/static/private';
import * as airQuality from '../src/routes/modules/airQuality.server';
import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest';

describe('Test Fetch Air Quality Function', () => {
	// Before all tests make a mock object of the airQuality and stub the calculateAQI and interpretAQI functions
	beforeAll(() => {
		vi.mock('../src/routes/modules/airQuality.server', async () => {
			const actual = await vi.importActual('../src/routes/modules/airQuality.server');
			return {
				...actual,
				calculateAQI: vi.fn(),
				interpretAQI: vi.fn()
			};
		});
	});
	// Reset the mock after each test
	afterEach(() => {
		vi.resetAllMocks();
	});
	// Try a nominal value where if PurpleAir returned 5 for the pm2.5 value we would get 21 as the AQI and Good for the air quality message
	it('Returns Good(21) for PM2.5 5', async () => {
		// Set the fetch function to return the below mock result
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => ({ sensor: { stats_a: { 'pm2.5_10minute': 5 } } })
		});
		// Call fetchAirQuality using our mocked version of air quality
		const result = await airQuality.fetchAirQuality();
		//When we calculateAQI has a pm2.5 of 5 that results in an AQI of 21
		// So our returned result should be Good (21)
		expect(result).toBe('Good (21)');
		// Check that fetch has been called with the following parameters
		expect(global.fetch).toHaveBeenCalledWith(
			`https://api.purpleair.com/v1/sensors/${SENSOR_LOCATION}?fields=pm2.5_10minute_a`,
			{ headers: { 'X-API-KEY': PURPLE_AIR_API_KEY } }
		);
	});

	// Simulate a failed attempt to fetch information from purple air
	it('Fail to fetch from purple air', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 404
		});
		await expect(airQuality.fetchAirQuality()).rejects.toThrowError(/Failed to fetch data: 404/);
	});
});
