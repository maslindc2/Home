// @ts-nocheck
import * as fetchFromSanity from '../api/fetchFromSanity.server';
import { fetchAirQuality } from '../api/airQuality.server.js';
import { fetchWeather } from '../api/weather.server.js';
import { SANITY_PROJECT_ID, SANITY_DATA_SET } from '$env/static/private';
import { createClient } from '@sanity/client';

const client = createClient({
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATA_SET,
	apiVersion: '2023-09-09',
	useCdn: true
});

export async function load() {
	// Fetch the GIFs for our GIF frame widget
	const gifs = await fetchFromSanity.fetchGIF(client);
	// Fetch the current weather
	const weather = await fetchWeather();
	// Fetch the current air quality from purple air
	const airQuality = await fetchAirQuality();
	// Fetch the bookmark information for bookmark1
	const bookmarkGroup1 = await fetchFromSanity.fetchBookmarkGroup(client, 'bookmark1');
	// Fetch the bookmark information for bookmark2
	const bookmarkGroup2 = await fetchFromSanity.fetchBookmarkGroup(client, 'bookmark2');
	// Fetch the search providers from Sanity
	const searchProviders = await fetchFromSanity.fetchSearchProviders(client);
	// Fetch the background from Sanity
	const background = await fetchFromSanity.fetchBackground(client);
	// Return all of the fetched assets from Sanity, Weather API, PurpleAir
	return {
		gifs,
		weather,
		airQuality,
		bookmarkGroup1,
		bookmarkGroup2,
		searchProviders,
		background
	};
}
