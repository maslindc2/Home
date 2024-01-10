// @ts-nocheck
/**
 * This function is used for calculating the AQI. This is used for the air quality widget.
 * @param {*} pm25 - The current PM2.5 from the purple air station.  This station is defined from the env SENSOR_LOCATION
 * @returns - Returns the current Air Quality index
 */
export function calculateAQI(pm25) {
	// Define the AQI breakpoints for PM2.5
	const breakpoints = [
		{ bpLow: 0.0, bpHigh: 12.0, iLow: 0, iHigh: 50 },
		{ bpLow: 12.1, bpHigh: 35.4, iLow: 51, iHigh: 100 },
		{ bpLow: 35.5, bpHigh: 55.4, iLow: 101, iHigh: 150 },
		{ bpLow: 55.5, bpHigh: 150.4, iLow: 151, iHigh: 200 },
		{ bpLow: 150.5, bpHigh: 250.4, iLow: 201, iHigh: 300 },
		{ bpLow: 250.5, bpHigh: 350.4, iLow: 301, iHigh: 400 },
		{ bpLow: 350.5, bpHigh: 500.4, iLow: 401, iHigh: 500 }
	];

	// Find the appropriate range of breakpoints for the current PM2.5
	const breakpoint = breakpoints.find((range) => pm25 >= range.bpLow && pm25 <= range.bpHigh);

	// If there is no breakpoint for the current AQI then return the error message.
	if (!breakpoint) {
		return 'AQI data not available for this PM2.5 concentration';
	}

	// Calculate AQI based on the selected range
	const aqi =
		((breakpoint.iHigh - breakpoint.iLow) / (breakpoint.bpHigh - breakpoint.bpLow)) *
			(pm25 - breakpoint.bpLow) +
		breakpoint.iLow;

	// Returning a rounded AQI which is the same process PurpleAir uses on their website.
	return Math.round(aqi);
}

/**
 * This function determines the appropriate air quality message from the current AQI calculated above.
 * @param {*} aqi - This is the AQI we calculated, we will now determine the appropriate air quality message.
 * @returns - Returns the appropriate air quality message.
 */
export function interpretAQI(aqi) {
	const aqiRanges = [
		{ range: [0, 50], label: 'Good' },
		{ range: [51, 100], label: 'Moderate' },
		{ range: [101, 200], label: 'Unhealthy' },
		{ range: [201, 300], label: 'Very Unhealthy' },
		{ range: [301, 600], label: 'Hazardous' }
	];

	for (const range of aqiRanges) {
		if (aqi >= range.range[0] && aqi <= range.range[1]) {
			return range.label;
		}
	}
	return 'Error calculating AQI';
}
