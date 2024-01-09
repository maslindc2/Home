// @ts-nocheck
import * as fetchFromSanity from '../api/fetchFromSanity.server';
import { calculateAQI, interpretAQI } from '../api/airQuality.server.js';
import { fetchCurrentConditions } from '../api/express.server.js'
import { SANITY_PROJECT_ID, SANITY_DATA_SET, SENSOR_LOCATION } from '$env/static/private';
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

	// Fetch the current air, wind, and weather from our express server
	const expressJson = await fetchCurrentConditions();
	
	const weather = expressJson.weather;

	const pm25 = expressJson.airQuality.pm25
	
	// Fetch the current air quality from purple air
	const AQI = await calculateAQI(pm25);
	const aqiLabel = await interpretAQI(AQI);
	
	// build out the data to be used for the air quality section of the WindAndAir widget
	const airQualityData = {AQI, aqiLabel, Sensor: SENSOR_LOCATION};

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
		airQualityData,
		bookmarkGroup1,
		bookmarkGroup2,
		searchProviders,
		background
	};
}
