// @ts-nocheck

import * as fetchWeather from '../src/api/weather.server';
import { describe, it, expect, vi } from 'vitest';
import { WEATHER_API_KEY, ZIP_CODE, OPENWEATHER_MAP_API_KEY } from '$env/static/private';

describe('Fetch Weather function', () => {
	it('Fetch weather with correct API call, returns correct JSON elements', async () => {
		const originalFetch = global.fetch;
		global.fetch = vi.fn().mockImplementation(originalFetch);

		const weather = await fetchWeather.fetchWeather();
		expect(weather).toBeDefined();
		expect(weather.current).toBeDefined();
		expect(weather.current.temp_f).toBeDefined();
		expect(weather.current.feelslike_f).toBeDefined();
		expect(weather.current.wind_degree).toBeDefined();
		expect(weather.current.wind_mph).toBeDefined();

		expect(weather.current.condition.icon).toBeDefined();
		expect(weather.current.condition.text).toBeDefined();

		expect(global.fetch).toBeCalledWith(
			`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}=${ZIP_CODE}&aqi=no`
		);
	});
});

describe('Fetch weather from Open Weather Map, backup API will turn on', () => {
	it('Fetch weather successfully using OpenWeather Map, all returned values defined', async () => {
		const originalFetch = global.fetch;
		global.fetch = vi.fn().mockImplementation(originalFetch);

		const weather = await fetchWeather.fetchWeatherFromBackupAPI();

		await expect(global.fetch).toBeCalledWith(
			`http://api.openweathermap.org/geo/1.0/zip?zip=${ZIP_CODE},US&appid=${OPENWEATHER_MAP_API_KEY}`
		);

		expect(weather).toBeDefined();
		expect(weather.current).toBeDefined();
		expect(weather.current.temp_f).toBeDefined();
		expect(weather.current.feelslike_f).toBeDefined();
		expect(weather.current.wind_degree).toBeDefined();
		expect(weather.current.wind_mph).toBeDefined();
		expect(weather.current.condition.icon).toBeDefined();
		expect(weather.current.condition.text).toBeDefined();
	});

	it('Fail to fetch latitude longitude from OpenWeather Map, results in error for Lat Lon service', async () => {
		const originalFetch = global.fetch;
		global.fetch = vi.fn().mockImplementation(() => ({
			ok: true,
			json: () => ({})
		}));

		const weather = await fetchWeather.fetchWeatherFromBackupAPI();
		await expect(weather).toEqual({
			current: {
				temp_f: 0,
				feelslike_f: 0,
				condition: {
					text: 'Error with Lat Lon Service'
				}
			}
		});
		global.fetch = originalFetch;
	});

	it('Fail to fetch weather after successfully getting', async () => {
		const originalFetch = global.fetch;

		global.fetch = vi.fn().mockImplementationOnce(() => ({
			ok: true,
			json: vi.fn().mockResolvedValue({
				latitude: 0,
				longitude: 0
			})
		}));

		global.fetch.mockImplementationOnce(() => ({
			ok: false, // Simulate an unsuccessful fetch
			json: vi.fn().mockResolvedValue({})
		}));

		const weather = await fetchWeather.fetchWeatherFromBackupAPI();
		await expect(weather).toEqual({
			current: {
				temp_f: 0,
				feelslike_f: 0,
				condition: {
					text: 'Failed to fetch data from OWP'
				}
			}
		});
		global.fetch = originalFetch;
	});
});
