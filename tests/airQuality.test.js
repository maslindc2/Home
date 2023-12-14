import * as airQuality from '../src/api/airQuality.server';
import { describe, test, expect } from 'vitest';

describe('Test calculate AQI function', () => {
	test.each([
		{ pm25: -0.1, expected: 'AQI data not available for this PM2.5 concentration' },
		{ pm25: 500.5, expected: 'AQI data not available for this PM2.5 concentration' },
		{ pm25: 0.0, expected: 0 },
		{ pm25: 12.0, expected: 50 },
		{ pm25: 12.1, expected: 51 },
		{ pm25: 35.4, expected: 100 },
		{ pm25: 35.5, expected: 101 },
		{ pm25: 55.4, expected: 150 },
		{ pm25: 55.5, expected: 151 },
		{ pm25: 150.4, expected: 200 },
		{ pm25: 150.5, expected: 201 },
		{ pm25: 250.4, expected: 300 },
		{ pm25: 250.5, expected: 301 },
		{ pm25: 350.4, expected: 400 },
		{ pm25: 350.5, expected: 401 },
		{ pm25: 500.4, expected: 500 }
	])('Calculate AQI pm2.5=$pm25 -> $expected', ({ pm25, expected }) => {
		expect(airQuality.calculateAQI(pm25)).toEqual(expected);
	});
});

describe('TTest interpret AQI function', () => {
	test.each([
		{ aqi: -0.1, expected: 'Error calculating AQI' },
		{ aqi: 601, expected: 'Error calculating AQI' },
		{ aqi: 0, expected: 'Good' },
		{ aqi: 50, expected: 'Good' },
		{ aqi: 51, expected: 'Moderate' },
		{ aqi: 100, expected: 'Moderate' },
		{ aqi: 101, expected: 'Unhealthy' },
		{ aqi: 200, expected: 'Unhealthy' },
		{ aqi: 201, expected: 'Very Unhealthy' },
		{ aqi: 300, expected: 'Very Unhealthy' }
	])('Interpret AQI Result AQI=$aqi -> Air Quality:$expected ', ({ aqi, expected }) => {
		expect(airQuality.interpretAQI(aqi)).toEqual(expected);
	});
});
