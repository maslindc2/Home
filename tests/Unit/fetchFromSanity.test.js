// @ts-nocheck
import { SANITY_PROJECT_ID, SANITY_DATA_SET } from '$env/static/private';
import * as fetchFromSanity from '../../src/api/fetchFromSanity.server';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { createClient } from '@sanity/client';

let client;
// Before All tests create a client object to communicate with Sanity
beforeAll(() => {
	client = createClient({
		projectId: SANITY_PROJECT_ID,
		dataset: SANITY_DATA_SET,
		apiVersion: '2023-09-09',
		useCdn: true
	});
});

describe('Test fetchBackground functionality', () => {
	it('Fetch a valid Background from sanity, returned background should be successfully fetched and an image', async () => {
		// Call fetchBackground function in fetchFromSanity using the client we defined, returns a URL to the background
		const fetchedBG = await fetchFromSanity.fetchBackground(client);
		// Fetch the background from the URL we got
		const response = await fetch(fetchedBG);
		// Check that we can successfully fetch it
		expect(response.ok).toBe(true);
		// Get the content type from the response headers
		const contentType = response.headers.get('content-type');
		// Check that the content type is an image
		expect(contentType.startsWith('image/')).toBe(true);
	});
});

describe('Test fetchGIF functionality', () => {
	it('Fetch a valid GIF randomly from Sanity, successfully fetches a random gif from sanity and should be an image', async () => {
		// Call fetchGIF function in fetchFromSanity using the client we defined, returns a URL to a random GIF
		const fetchedGIF = await fetchFromSanity.fetchGIF(client);
		// Fetch the GIF from the URL we got
		const response = await fetch(fetchedGIF);
		// Check that we can successfully fetch it
		expect(response.ok).toBe(true);
		// Get the content type from the response headers
		const contentType = response.headers.get('content-type');
		// check if the response content type is an image
		expect(contentType.startsWith('image/')).toBe(true);
	});
});

describe('Test fetchBookMarkGroup functionality', () => {
	it('Fetch a valid set of Bookmarks for group 1, fetches a valid set of bookmarks with the correct properties defined', async () => {
		// Call fetchBookmarkGroup function in fetchFromSanity using the client we defined and bookmark group 1,
		// returns an array of URLs and Icons for the bookmarks in the bookmark group 1 column
		const bookmarkGroup1 = await fetchFromSanity.fetchBookmarkGroup(client, 'bookmark1');
		// Go through each index of the array and ensure each value is defined
		for (let index = 0; index < bookmarkGroup1.length; index++) {
			const bookmark = bookmarkGroup1[index];
			expect(bookmark.Icon).toBeDefined();
			expect(bookmark.URL).toBeDefined();
		}
	});

	it('Fetch a valid set of Bookmarks for group 2, fetches a valid set of bookmarks with the correct properties defined', async () => {
		// Call fetchBookmarkGroup function in fetchFromSanity using the client we defined and bookmark group 2,
		// returns an array of URLs and Icons for the bookmarks in the bookmark group 2 column
		const bookmarkGroup2 = await fetchFromSanity.fetchBookmarkGroup(client, 'bookmark2');
		// Go through each index of the array and ensure each value is defined
		for (let index = 0; index < bookmarkGroup2.length; index++) {
			const bookmark = bookmarkGroup2[index];
			expect(bookmark.Icon).toBeDefined();
			expect(bookmark.URL).toBeDefined();
		}
	});

	it('Fetch an undefined set of Bookmarks from sanity, throws error with client or bookmark group is undefined', async () => {
		await expect(fetchFromSanity.fetchBookmarkGroup(client, undefined)).rejects.toThrowError(
			'Client/Bookmark Group is not defined please check configuration!'
		);
	});

	it('Fetch an undefined set of Bookmarks and Undefined Client, throws error with client or bookmark group is undefined', async () => {
		await expect(fetchFromSanity.fetchBookmarkGroup(undefined, undefined)).rejects.toThrowError(
			'Client/Bookmark Group is not defined please check configuration!'
		);
	});

	it('Fetch a Bookmark Group 1 but use an Undefined Client, throws error with client or bookmark group is undefined', async () => {
		await expect(fetchFromSanity.fetchBookmarkGroup(undefined, 'bookmark1')).rejects.toThrowError(
			'Client/Bookmark Group is not defined please check configuration!'
		);
	});

	it('Fetch a Bookmark group for one that does not exist, throws error with client or bookmark group is undefined', async () => {
		await expect(fetchFromSanity.fetchBookmarkGroup(client, 'bookmark3')).rejects.toThrowError(
			/Error fetching bookmark data for/
		);
	});
});

describe('Test fetchSearchProviders functionality', () => {
	it('Fetch search providers from Sanity, successfully fetches and all values are defined', async () => {
		// Call fetchSearchProviders function in fetchFromSanity using the client we defined,
		// returns an array of Access's, Providers, and URLs for each search provider
		const searchProviders = await fetchFromSanity.fetchSearchProviders(client);
		for (let index = 0; index < searchProviders.length; index++) {
			const searchProvider = searchProviders[index];
			expect(searchProvider.Access).toBeDefined();
			expect(searchProvider.Provider).toBeDefined();
			expect(searchProvider.URL).toBeDefined();
		}
	});

	it('fetch search providers from undefined client, throws error with message Sanity Client is undefined', async () => {
		await expect(fetchFromSanity.fetchSearchProviders(undefined)).rejects.toThrowError(
			'Sanity Client is undefined!'
		);
	});

	it('Fail to fetch search providers from Sanity, throws error with message Failed to fetch search providers from CMS', async () => {
		// Create a fake sanity client, (current implementation only uses fetch function)
		const fakeSanityObj = {
			// When fetch is called return an empty array
			fetch: vi.fn().mockResolvedValue([])
		};
		// Call fetchSearchProviders using our fake and it should reject the promise and throw the below error
		await expect(fetchFromSanity.fetchSearchProviders(fakeSanityObj)).rejects.toThrowError(
			'Failed to fetch search providers from Sanity CMS!'
		);
		// Verify that the fake was called with the Sanity the below Sanity access for the searchProviders group
		expect(fakeSanityObj.fetch).toHaveBeenCalledWith('*[_type == "searchProviders"]');
	});
});
