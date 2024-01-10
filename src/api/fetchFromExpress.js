// @ts-nocheck
import { calculateAQI, interpretAQI } from '../api/airQuality';
/**
 * This function fetches the required information from our express server.
 * Sends the current coordinates of the user (sourced by IP or Client's browser) to the express server.
 * Express server returns the JSON required for the Weather and WindAndAir widget
 * @returns 
 */
export async function fetchCurrentConditions(coordinates, sensor) {
    // Assembly the data to send to the express server
    // Consists of the user's current coordinates and the hardcoded sensor
    const data = {
        data: {
            coordinates: coordinates,
            sensor: sensor
        }
    }

    // Make the request to the express server
    const response = await fetch('https://home-express.vercel.app/fetch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    // If the response was not successful throw an error
    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    // Turn the response into a JSON object
    const expressJSON = await response.json();
    
    // Store the weather information to a variable
    const weather = expressJSON.weather;
    // Store the fetched pm2.5 to a variable
	const pm25 = expressJSON.airQuality.pm25;

    // Calculate the AQI using the fetched PM25
	const AQI = await calculateAQI(pm25);
    // Calculate the AQI label for the calculated AQI
	const aqiLabel = await interpretAQI(AQI);

    // Assemble the data required for the air quality widget
	const airQualityData = {AQI, aqiLabel, Sensor: sensor}
	
    // Assemble the final object containing the weather data and the air quality data
    const currentConditions = {weather, airQualityData};
    
    return currentConditions;
}