// @ts-nocheck
import { SENSOR_LOCATION, PURPLE_AIR_API_KEY, SANITY_DATA_SET, SANITY_PROJECT_ID, WEATHER_API_KEY, OPENWEATHER_MAP_API_KEY, ZIP_CODE} from "$env/static/private"
import { createClient } from "@sanity/client" 

/**
 * This function creates our sanity client used for communicating with our CMS
 * @returns the sanity client object
 */
function createSanityClient(){
    // Check if the below env's are not defined
    if ((!SANITY_PROJECT_ID && !SANITY_DATA_SET) || !SANITY_PROJECT_ID || !SANITY_DATA_SET) {
        throw new Error("Sanity ENV variable(s) are undefined please check config!"); 
    }
    return createClient({
        projectId: SANITY_PROJECT_ID,
        dataset: SANITY_DATA_SET,
        apiVersion: "2023-09-09",
        useCdn: true
    });
}

/**
 * Converts an Image from Sanity CMS into a url we can actually use
 *
 * @param {string} assetRef - The Sanity image reference.
 * @returns {string} - The URL a compatible url from our Sanity CMS.
 */
function imageRefToSanityCompatibleURL(assetRef) {
    if(typeof assetRef !== 'string'){
        throw new Error('Invalid asset reference');
    }
    
    /*  
    Sanity outputs images as a reference from a JS array, we need to turn that into a url for our image tag to read    
    Example output from Sanity: image-9413d81fab714099f7978ed8cabcba9d3b5d6308-288x288-webp
    We need to only extract the middle string and the file extension at the end
    */
    const assetRefList = assetRef.split('-');
    const acceptedExtensions = /^(gif|jpeg|jpg|png|webp)$/i;
    
    // Check if the assetRef contains exactly 4 pieces of information (file type, asset name, resolution, extension)
    if(assetRefList.length !== 4){
        throw new Error('Invalid response from Sanity, must return 4 indices from the CMS');
    
    // If the assetRef does not equal image then throw an error as only images are supported
    }else if(!assetRefList[0] || assetRefList[0] !== 'image'){
        throw new Error('Invalid asset reference, asset reference does not contain image prefix. Only images are supported');

    // If the reference does not contain the extension gif, png, jpg, or webp
    }else if(!acceptedExtensions.test(assetRefList[3])){
        throw new Error('Invalid asset reference, asset reference does not contain a file extension! Only GIF, PNG, JPG, and WEBP are supported');
    }
    
    // Base URL for fetching images from our sanity instance
    const baseURL = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATA_SET}/`;

    // Use the file name we extracted and the file extension we extracted to build out the url we will use to fetch the gif
    const fileURL = `${baseURL}${assetRefList[1]}.${assetRefList[3]}`;
    return fileURL;
}

/**
 * Fetches the Background for the Homepage and converts it from a Sanity Reference to a URL we can use
 * @param {object} client - This is our Sanity client object
 * @returns {string} - A url for the background that we can use in Svelte
 */
async function fetchBackground(client) {
    // Fetches the background for the home page from the Sanity entry background
    const backgroundRef = await client.fetch(`*[_type == "background"]`)

    //Convert the backgroundRef into a url we can use on Svelte
    return imageRefToSanityCompatibleURL(backgroundRef[0].background.asset._ref)
}

/**
 * This function is responsible for fetching a list of GIFs used for the GIF frame on the Homepage
 * Out of the returned list of Sanity References pick a random GIF from that list and convert the ref tag to a url
 * @param {object} client - This is our Sanity client object
 * @returns {string} - A url for the gif to use in our GIF frame
 */
async function fetchGIF(client) {
    // Fetches gifs from Sanity CMS
    const gifsData = await client.fetch(`*[_type == "gifs"]`);
    
    // Get the length of the response array
    var numberOfGifs = gifsData.length;
    
    // Randomly pick an index, this is used for displaying a random gif from the response array
    const randomGifIndex = Math.floor(Math.random() * numberOfGifs);
    
    // Next get the reference tag for the randomly chosen gif
    const randomGifAssetRef = gifsData[randomGifIndex].gif.asset._ref;
    return imageRefToSanityCompatibleURL(randomGifAssetRef);
}

/**
 * 
 * @param {object} client - This is our Sanity client object
 * @param {string} bookmarkGroupToFetch - This is the bookmark group we will be fetching and returning later
 * @returns {object} - Returns an object of bookmarks for the bookmark group we specified in the params
 */
async function fetchBookmarkGroup(client, bookmarkGroupToFetch) {
    try {
        // Fetch the bookmark1 dataset from Sanity                
        const res = await client.fetch(`*[_type == "${bookmarkGroupToFetch}"]`)
        // Build a bookmarkGroup array using the response from Sanity
        const bookmarkGroup = res.map((bookmark) => {
            // Store the icon reference for the current bookmark
            const iconRef = bookmark.icon.asset._ref;

            // Send the icon reference to our reference to url function and store the returned url to our icon
            const iconUrl = imageRefToSanityCompatibleURL(iconRef);
            
            // add the iconUrl and the bookmark url to the array
            return {
                Icon: iconUrl,
                URL: bookmark.url,
            }; 
        })
        // return the bookmarkGroup array
        return bookmarkGroup
    } catch(error){
        console.error(`Error fetching bookmark data for ${bookmarkGroupToFetch} from Sanity:`, error);
        return [];
    }
}

/**
 * This function fetches the Search Providers from Sanity
 * @param {object} client - This our sanity client object
 * @returns {object} - An object with the list of search providers
 */
async function fetchSearchProviders(client) {
    try {
        // Fetch the bookmark1 dataset from Sanity
        const res = await client.fetch(`*[_type == "searchProviders"]`)
        // Build a bookmarkGroup array using the response from Sanity
        const searchProviders = res.map((/** @type {{ access: string; provider: string; url: string; }} */ searchProvider) => {
            // add the iconUrl and the bookmark url to the array
            return {
                "Access": searchProvider.access,
                "Provider": searchProvider.provider,
                "URL": searchProvider.url
            }; 
        })
        // return the bookmarkGroup array
        return searchProviders
    } catch(error){
        console.error("Error fetching search providers from Sanity:", error);
        return [];
    }
}

/**
 * This function fetches the current weather from one of two API's.
 * Implemented a backup API as Weather API is not our own and sometimes goes down.  When it does the website becomes useless.
 * This approach uses Weather API as the main API, but if our fetch fails, we switch over to Open Weather Map's API
 * Relies on the ZIP_CODE, WEATHER_API_KEY, and OPENWEATHER_MAP_API_KEY environment variables
 * @returns - The current weather data (from either weather api or openweather map) or it will return an error that will appear in the weather widget
 */

async function fetchWeather() {
    if (typeof WEATHER_API_KEY === 'undefined' || typeof ZIP_CODE === 'undefined'){
        var jsonString = '{"current":{"temp_f": 0,"feelslike_f":0, "condition":{"text":"Error with API Key"}}}';
        var jsonObject = JSON.parse(jsonString);
        return jsonObject;
    }else{
        const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}=${ZIP_CODE}&aqi=no`);
        const data = await res.json();
        // If we do not receive any weather info from Weather API then run the fetch current weather from OpenWeather Map
        if (!data || !data.current || Object.keys(data.current) === 0){
            return fetchWeatherFromBackupAPI();
        }
        return data;
    }
}

/**
 * Here we are fetching the current data from openweather api. This function runs when Weather API fails to fetch the data.
 * @returns - Returns the current weather format in the same format as Weather API
 */
async function fetchWeatherFromBackupAPI() {
    // First check if the OPENWEATHER_MAP_API_KEY or ZIP_CODE is undefined, if it is then return the error message
    if (typeof OPENWEATHER_MAP_API_KEY === 'undefined' || typeof ZIP_CODE === 'undefined'){
        // Here we build out the error message to display on the weather widget
        const jsonString = '{"current":{"temp_f": 0,"feelslike_f":0, "condition":{"text":"Error with API Key"}}}';
        const jsonObject = JSON.parse(jsonString);
        // Returning the JSON error message
        return jsonObject;

    }else{
        // Here we contact the OpenWeatherApi to convert our zip code into latitude and longitude
        const openWeatherLocation = await fetch(`http://api.openweathermap.org/geo/1.0/zip?zip=${ZIP_CODE},US&appid=${OPENWEATHER_MAP_API_KEY}`);
        
        // Here we take the response and convert it to json
        const openWeatherLatLon = await openWeatherLocation.json();
        
        // If OpenWeather Map doesn't return anything for the latitude and longitude then we can't run the service, so return the error message
        if (openWeatherLatLon === undefined || openWeatherLatLon === null || Object.keys(openWeatherLatLon).length === 0) {
            const jsonString = '{"current":{"temp_f": 0,"feelslike_f":0, "condition":{"text":"Error with Lat Lon Service"}}}';
            const jsonObject = JSON.parse(jsonString);
            return jsonObject;
        }

        // Now that we have our latitude and longitude we make the call to openweather api for the current conditions using imperial units
        const openWeatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${openWeatherLatLon.lat}&lon=${openWeatherLatLon.lon}&appid=${OPENWEATHER_MAP_API_KEY}&units=imperial`)
        
        // Convert that response to json format. 
        const openWeatherJSON = await openWeatherRes.json();
        
        // Check if the OpenWeather API failed to fetch any of the required elements for 
        if (!openWeatherJSON || !openWeatherJSON.main || Object.keys(openWeatherJSON.main) === 0){
            const jsonString = '{"current":{"temp_f": 0,"feelslike_f":0, "condition":{"text":"Failed to fetch data from OWP"}}}';
            const jsonObject = JSON.parse(jsonString);
            return jsonObject;
        }

        // Here we use the same JSON format as Weather API so it does not impact any of the other widgets that rely on weather data.
        return {
            "current":{
                "condition":{
                    "icon": `openweathermap.org/img/wn/${openWeatherJSON.weather[0].icon}.png`,
                    "text": openWeatherJSON.weather[0].main
                },
                "temp_f": openWeatherJSON.main.temp,
                "feelslike_f": openWeatherJSON.main.feels_like,
                "wind_degree": openWeatherJSON.wind.deg,
                "wind_mph": openWeatherJSON.wind.speed
            }
        }
    }
}


/**
 * This function is used for calculating the AQI. This is used for the air quality widget.
 * @param {*} pm25 - The current PM2.5 from the purple air station.  This station is defined from the env SENSOR_LOCATION
 * @returns - Returns the current Air Quality index
 */
function calculateAQI(pm25) {
    // Define the AQI breakpoints for PM2.5
    const breakpoints = [
        { bpLow: 0.0, bpHigh: 12.0, iLow: 0, iHigh: 50 },
        { bpLow: 12.1, bpHigh: 35.4, iLow: 51, iHigh: 100 },
        { bpLow: 35.5, bpHigh: 55.4, iLow: 101, iHigh: 150 },
        { bpLow: 55.5, bpHigh: 150.4, iLow: 151, iHigh: 200 },
        { bpLow: 150.5, bpHigh: 250.4, iLow: 201, iHigh: 300 },
        { bpLow: 250.5, bpHigh: 350.4, iLow: 301, iHigh: 400 },
        { bpLow: 350.5, bpHigh: 500.4, iLow: 401, iHigh: 500 },
    ];

    // Find the appropriate range of breakpoints for the current PM2.5
    const breakpoint = breakpoints.find((range) => pm25 >= range.bpLow && pm25 <= range.bpHigh);
    
    // If there is no breakpoint for the current AQI then return the error message.
    if (!breakpoint) {
        return "AQI data not available for this PM2.5 concentration";
    }

    // Calculate AQI based on the selected range
    const aqi = ((breakpoint.iHigh - breakpoint.iLow) / (breakpoint.bpHigh - breakpoint.bpLow)) * (pm25 - breakpoint.bpLow) + breakpoint.iLow;

    // Returning a rounded AQI which is the same process PurpleAir uses on their website. 
    return Math.round(aqi);
}

/**
 * This function determines the appropriate air quality message from the current AQI calculated above. 
 * @param {*} aqi - This is the AQI we calculated, we will now determine the appropriate air quality message.
 * @returns - Returns the appropriate air quality message.
 */
function interpretAQI(aqi) {
    const aqiRanges = [
        { range: [0, 50], label: "Good" },
        { range: [51, 100], label: "Moderate" },
        { range: [101, 200], label: "Unhealthy" },
        { range: [201, 300], label: "Very Unhealthy" },
        { range: [301, 600], label: "Hazardous" },
    ];

    for (const range of aqiRanges) {
        if (aqi >= range.range[0] && aqi <= range.range[1]) {
            return range.label;
        }
    }
    return "Error calculating AQI";
}

/**
 * This function fetches the current Air quality from purple air's API.
 * Relies on the env variables for getting the location of the sensor and the API key for purple air.
 * @returns - The current AQI and the Air quality message for the Wind and Air widget. 
 */
async function fetchAirQuality() {
    if(typeof PURPLE_AIR_API_KEY === 'undefined' || typeof SENSOR_LOCATION === 'undefined'){
        return "Error with API or Sensor ENV var"
    }
    try {
        const sensorURL = `https://api.purpleair.com/v1/sensors/${SENSOR_LOCATION}?fields=pm2.5_10minute_a`;
        const response = await fetch(sensorURL, {
            headers: {
                'X-API-KEY': PURPLE_AIR_API_KEY,
            },
        });

        // If we did not receive response ok headers then we know we failed to fetch data from the sensor
        // TODO: Replace this with alternate API for AQI
        if(!response.ok){
            throw new Error(`Failed to fetch data: ${response.status}`)
        }

        // Store the json data
        const data = await response.json();
        // Extract the pm2.5_10minute stats from the data
        const pm25 = data.sensor.stats_a['pm2.5_10minute'];
        // Calculate the AQI using the pm2.5 data
        const aqi = calculateAQI(pm25);
        // Call the Interpret AQI to find the correct air quality label
        // @ts-ignore
        const aqiLabel = interpretAQI(aqi);
        // Return the label and the air quality
        return aqiLabel + ` (${aqi})`;

    }catch(error){
        console.error("Error fetching air quality:", error);
    }
}
export {createSanityClient, imageRefToSanityCompatibleURL, fetchGIF, fetchWeather, fetchAirQuality, fetchBookmarkGroup, fetchSearchProviders, fetchBackground};
export async function load() {
    // Create our sanity client instance using the ENV variables
    const client = createSanityClient(SANITY_PROJECT_ID, SANITY_DATA_SET);
    // Fetch the GIFs for our GIF frame widget
    const gifs = await fetchGIF(client);
    // Fetch the current weather using WEATHER_API_KEY, ZIP_CODE or OPENWEATHER_MAP_API_KEY, ZIP_CODE if WeatherAPI fails to fetch
    const weather = await fetchWeather();
    // Fetch the current air quality from purple air
    const airQuality = await fetchAirQuality(PURPLE_AIR_API_KEY, SENSOR_LOCATION);
    // Fetch the bookmark information for bookmark1
    const bookmarkGroup1 = await fetchBookmarkGroup(client, "bookmark1");
    // Fetch the bookmark information for bookmark2
    const bookmarkGroup2 = await fetchBookmarkGroup(client, "bookmark2");
    // Fetch the search providers from Sanity
    const searchProviders = await fetchSearchProviders(client);
    // Fetch the background from Sanity
    const background = await fetchBackground(client);
    // Return all of the fetched assets from Sanity, Weather API, PurpleAir
    return {
        gifs,
        weather,
        airQuality,
        bookmarkGroup1,
        bookmarkGroup2,
        searchProviders,
        background,
    };
}
