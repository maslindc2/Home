// @ts-nocheck
import { WEATHER_API_KEY, OPENWEATHER_MAP_API_KEY, ZIP_CODE } from '$env/static/private';

/**
 * This function fetches the current weather from one of two API's.
 * Implemented a backup API as Weather API is not our own and sometimes goes down.  When it does the website becomes useless.
 * This approach uses Weather API as the main API, but if our fetch fails, we switch over to Open Weather Map's API
 * Relies on the ZIP_CODE, WEATHER_API_KEY, and OPENWEATHER_MAP_API_KEY environment variables
 * @returns - The current weather data (from either weather api or openweather map) or it will return an error that will appear in the weather widget
 */
export async function fetchWeather() {
	if ((!WEATHER_API_KEY && !ZIP_CODE) || !WEATHER_API_KEY || !ZIP_CODE) {
		var jsonString =
			'{"current":{"temp_f": 0,"feelslike_f":0, "condition":{"text":"Error with API Key"}}}';
		var jsonObject = JSON.parse(jsonString);
		return jsonObject;
	} else {
		const res = await fetch(
			`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}=${ZIP_CODE}&aqi=no`
		);
		const data = await res.json();
		// If we do not receive any weather info from Weather API then run the fetch current weather from OpenWeather Map
		if (!data || !data.current || Object.keys(data.current) === 0) {
			return fetchWeatherFromBackupAPI();
		}
		return data;
	}
}

/**
 * Here we are fetching the current data from openweather api. This function runs when Weather API fails to fetch the data.
 * @returns - Returns the current weather format in the same format as Weather API
 */
export async function fetchWeatherFromBackupAPI() {
	// First check if the OPENWEATHER_MAP_API_KEY is undefined, if it is then return the error message
	if (!OPENWEATHER_MAP_API_KEY) {
		// Here we build out the error message to display on the weather widget
		const jsonString =
			'{"current":{"temp_f": 0,"feelslike_f":0, "condition":{"text":"Error with API Key"}}}';
		const jsonObject = JSON.parse(jsonString);
		// Returning the JSON error message
		return jsonObject;
	} else {
		// Here we contact the OpenWeatherApi to convert our zip code into latitude and longitude
		const openWeatherLocation = await fetch(
			`http://api.openweathermap.org/geo/1.0/zip?zip=${ZIP_CODE},US&appid=${OPENWEATHER_MAP_API_KEY}`
		);

		// Here we take the response and convert it to json
		const openWeatherLatLon = await openWeatherLocation.json();

		// If OpenWeather Map doesn't return anything for the latitude and longitude then we can't run the service, so return the error message
		if (
			openWeatherLatLon === undefined ||
			openWeatherLatLon === null ||
			Object.keys(openWeatherLatLon).length === 0
		) {
			const jsonString =
				'{"current":{"temp_f": 0,"feelslike_f":0, "condition":{"text":"Error with Lat Lon Service"}}}';
			const jsonObject = JSON.parse(jsonString);
			return jsonObject;
		}

		// Now that we have our latitude and longitude we make the call to openweather api for the current conditions using imperial units
		const openWeatherRes = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${openWeatherLatLon.lat}&lon=${openWeatherLatLon.lon}&appid=${OPENWEATHER_MAP_API_KEY}&units=imperial`
		);

		// Convert that response to json format.
		const openWeatherJSON = await openWeatherRes.json();

		// Check if the OpenWeather API failed to fetch any of the required elements for
		if (!openWeatherJSON || !openWeatherJSON.main || Object.keys(openWeatherJSON.main) === 0) {
			const jsonString =
				'{"current":{"temp_f": 0,"feelslike_f":0, "condition":{"text":"Failed to fetch data from OWP"}}}';
			const jsonObject = JSON.parse(jsonString);
			return jsonObject;
		}

		// Here we use the same JSON format as Weather API so it does not impact any of the other widgets that rely on weather data.
		return {
			current: {
				condition: {
					icon: `openweathermap.org/img/wn/${openWeatherJSON.weather[0].icon}.png`,
					text: openWeatherJSON.weather[0].main
				},
				temp_f: openWeatherJSON.main.temp,
				feelslike_f: openWeatherJSON.main.feels_like,
				wind_degree: openWeatherJSON.wind.deg,
				wind_mph: openWeatherJSON.wind.speed
			}
		};
	}
}
