// @ts-nocheck
import { imageRefToSanityCompatibleURL } from './sanityRefToURL.server';
/**
 * Fetches the Background for the Homepage and converts it from a Sanity Reference to a URL we can use
 * @param {object} client - This is our Sanity client object
 * @returns {string} - A url for the background that we can use in Svelte
 */
export async function fetchBackground(client) {
	// Fetches the background for the home page from the Sanity entry background
	const backgroundRef = await client.fetch(`*[_type == "background"]`);

	//Convert the backgroundRef into a url we can use on Svelte
	return imageRefToSanityCompatibleURL(backgroundRef[0].background.asset._ref);
}

/**
 * This function is responsible for fetching a list of GIFs used for the GIF frame on the Homepage
 * Out of the returned list of Sanity References pick a random GIF from that list and convert the ref tag to a url
 * @param {object} client - This is our Sanity client object
 * @returns {string} - A url for the gif to use in our GIF frame
 */
export async function fetchGIF(client) {
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
export async function fetchBookmarkGroup(client, bookmarkGroupToFetch) {
	if ((!client && !bookmarkGroupToFetch) || !client || !bookmarkGroupToFetch) {
		throw new Error('Client/Bookmark Group is not defined please check configuration!');
	}

	// Fetch the bookmark1 dataset from Sanity
	const res = await client.fetch(`*[_type == "${bookmarkGroupToFetch}"]`);
	if (res.length === 0) {
		throw new Error(`Error fetching bookmark data for ${bookmarkGroupToFetch} from Sanity`);
	}
	// Build a bookmarkGroup array using the response from Sanity
	const bookmarkGroup = res.map((bookmark) => {
		// Store the icon reference for the current bookmark
		const iconRef = bookmark.icon.asset._ref;

		// Send the icon reference to our reference to url function and store the returned url to our icon
		const iconUrl = imageRefToSanityCompatibleURL(iconRef);

		// add the iconUrl and the bookmark url to the array
		return {
			Icon: iconUrl,
			URL: bookmark.url
		};
	});
	// return the bookmarkGroup array
	return bookmarkGroup;
}

/**
 * This function fetches the Search Providers from Sanity
 * @param {object} client - This our sanity client object
 * @returns {object} - An object with the list of search providers
 */
export async function fetchSearchProviders(client) {
	if (!client) {
		throw new Error('Sanity Client is undefined!');
	}
	// Fetch the bookmark1 dataset from Sanity
	const res = await client.fetch(`*[_type == "searchProviders"]`);
	if (res.length === 0) {
		throw new Error('Failed to fetch search providers from Sanity CMS!');
	}
	// Build a bookmarkGroup array using the response from Sanity
	const searchProviders = res.map(
		(/** @type {{ access: string; provider: string; url: string; }} */ searchProvider) => {
			// add the iconUrl and the bookmark url to the array
			return {
				Access: searchProvider.access,
				Provider: searchProvider.provider,
				URL: searchProvider.url
			};
		}
	);
	// return the bookmarkGroup array
	return searchProviders;
}
