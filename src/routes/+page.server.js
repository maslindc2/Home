// @ts-ignore
import { SENSOR_LOCATION, PURPLE_AIR_API_KEY, SANITY_DATA_SET, SANITY_PROJECT_ID, WEATHER_API_KEY, ZIP_CODE} from "$env/static/private"
import { createClient } from "@sanity/client" 

const client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATA_SET,
    apiVersion: "2023-09-09",
    useCdn: true
});

export async function load(){
    /**
     * @param {string} assetRef
     */
    function imageRefToSanityCompatibleURL(assetRef) {
        if(typeof assetRef !== 'string'){
            throw new Error('Invalid asset reference');
        }
        
        const baseURL = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATA_SET}/`

        /*  Sanity outputs images as a reference from a JS array, we need to turn that into a url for our image tag to read
            Example output from Sanity: image-9413d81fab714099f7978ed8cabcba9d3b5d6308-288x288-webp
            We will use regex here to remove the leading part of the reference ("image-")
        */
        var removeImageLead = assetRef.replace(/^image-/,'');

        // Use regex again to extract the file extension, if it matches any of the accepted extensions
        var regex = /-(gif|jpeg|jpg|png|webp)$/;
        var match = removeImageLead.match(regex);
        var fileExtension = match ? match[1] : '';

        // Extract just the sanity file name
        var fileNameFromDB = removeImageLead.replace(regex, '');

        // Use the file name we extracted and the file extension we extracted to build out the url we will use to fetch the gif
        const fileURL = baseURL + fileNameFromDB+"."+fileExtension
        return fileURL
    }
    
    const fetchBackground = async() =>{
        const res = await client.fetch(`*[_type == "background"]`)
        return imageRefToSanityCompatibleURL(res[0].background.asset._ref)
    }

    const fetchGIF = async() =>{
        // Fetches gifs from Sanity CMS
        const gifsData = await client.fetch(`*[_type == "gifs"]`);
        
        // Get the length of the response array
        var numberOfGifs = gifsData.length
        // Randomly pick an index, this is used for displaying a random gif from the response array
        const randomGifIndex = Math.floor(Math.random() * numberOfGifs);
        // Next get the reference tag for the randomly chosen gif
        const randomGifAssetRef = gifsData[randomGifIndex].gif.asset._ref;

        return imageRefToSanityCompatibleURL(randomGifAssetRef);
    }

    const fetchBookmarkGroup1 = async() =>{
        try {
            // Fetch the bookmark1 dataset from Sanity
            const res = await client.fetch(`*[_type == "bookmark1"]`)
            // Build a bookmarkGroup array using the response from Sanity
            const bookmarkGroup = res.map((/** @type {{ icon: { asset: { _ref: string; }; }; url: string; }} */ bookmark) => {
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
            console.error("Error fetching data for group 1 from Sanity:", error);
            return [];
        }
    }

    const fetchBookmarkGroup2 = async() =>{
        try {
            // Fetch the bookmark1 dataset from Sanity
            const res = await client.fetch(`*[_type == "bookmark2"]`)
            // Build a bookmarkGroup array using the response from Sanity
            const bookmarkGroup = res.map((/** @type {{ icon: { asset: { _ref: string; }; }; url: string; }} */ bookmark) => {
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
            console.error("Error fetching bookmark data for group 2 from Sanity:", error);
            return [];
        }
    }

    const fetchSearchProviders = async() =>{
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

    const fetchWeather = async () =>{
        if (typeof WEATHER_API_KEY === 'undefined' || typeof ZIP_CODE === 'undefined'){
            var jsonString = '{"current":{"temp_f": 0,"feelslike_f":0, "condition":{"text":"Error with API Key"}}}';
            var jsonObject = JSON.parse(jsonString);
            return jsonObject;
        }else{
            const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}=${ZIP_CODE}&aqi=no`);
            const data = await res.json();
            return data;
        }
    }

    // Below are the air quality ranges
    const AQI_RANGES = [
        { range: [0, 50], label: "Good" },
        { range: [51, 100], label: "Moderate" },
        { range: [101, 200], label: "Unhealthy" },
        { range: [201, 300], label: "Very Unhealthy" },
        { range: [301, 600], label: "Hazardous" },
    ];


    /**
     * @param {number} pm25
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
      
        // Find the appropriate range of breakpoints
        const breakpoint = breakpoints.find((range) => pm25 >= range.bpLow && pm25 <= range.bpHigh);
      
        if (!breakpoint) {
            return "AQI data not available for this PM2.5 concentration";
        }
      
        // Calculate AQI based on the selected range
        const aqi = ((breakpoint.iHigh - breakpoint.iLow) / (breakpoint.bpHigh - breakpoint.bpLow)) * (pm25 - breakpoint.bpLow) + breakpoint.iLow;
      
        return Math.round(aqi);
    }

    /**
     * @param {number} aqi
     */
    function interpretAQI(aqi) {
        for (const range of AQI_RANGES) {
            if (aqi >= range.range[0] && aqi <= range.range[1]) {
                return range.label;
            }
        }
        return "Error calculating AQI";
    }

    const fetchAirQuality = async() =>{
        if(typeof SENSOR_LOCATION === 'undefined' || typeof PURPLE_AIR_API_KEY === 'undefined'){
            return "Error with API or Sensor ENV var"
        }
        try {
            const sensorURL = `https://api.purpleair.com/v1/sensors/${SENSOR_LOCATION}?fields=pm2.5_10minute_a`;
            const response = await fetch(sensorURL, {
                headers: {
                    'X-API-KEY': PURPLE_AIR_API_KEY,
                },
            });

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

    return {
        gifs: fetchGIF(),
        weather: fetchWeather(),
        airQuality: fetchAirQuality(),
        bookmarkGroup1: fetchBookmarkGroup1(),
        bookmarkGroup2: fetchBookmarkGroup2(),
        searchProviders: fetchSearchProviders(),
        background: fetchBackground()
    }
};