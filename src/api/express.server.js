/**
 * This function fetches the required information from our express server.
 * Sends the current coordinates of the user (sourced by IP or Client's browser) to the express server.
 * Express server returns the JSON required for the Weather and WindAndAir widget
 * @returns 
 */
export async function fetchCurrentConditions() {
    // Currently hardcoding the coordinates and purple air sensor
    const data = {
        data: {
            coordinates: "47.5916864,-122.1381192",
            sensor: "55751"
        }
    }
    const response = await fetch('https://home-express.vercel.app/fetch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const jsonResponse = await response.json();
    
    return jsonResponse;
}