// @ts-nocheck
import { imageRefToSanityCompatibleURL } from '../../src/api/sanityRefToURL.server.js';
import { SANITY_PROJECT_ID, SANITY_DATA_SET } from '$env/static/private';

import { describe, it, expect, beforeAll } from 'vitest';
import { createClient } from '@sanity/client';

let client;

// Before running tests create a Sanity Client object
beforeAll(() => {
	client = createClient({
		projectId: SANITY_PROJECT_ID,
		dataset: SANITY_DATA_SET,
		apiVersion: '2023-09-09',
		useCdn: true
	});
});

describe('Create a valid Sanity Client and ensure the client is defined with the expected values, object should have the values we defined above', () => {
	it('creates a Sanity client with the correct configuration when env variables are defined', () => {
		expect(client.config).toBeDefined();
		expect(typeof client.config).toBe('function');
		expect(client.config().apiVersion).toBe('2023-09-09');
		expect(client.config().useCdn).toBeTruthy();
	});
});

describe('Test imageRefToSanityCompatibleURL conversion function', () => {
	it('test sanity imageRefToSanityCompatibleURL to URL using an undefined assetRef, throws error with message Invalid asset reference', () => {
		expect(() => imageRefToSanityCompatibleURL(undefined)).toThrowError('Invalid asset reference');
	});
	it('test sanity imageRefToSanityCompatibleURL to URL using an assetRef with only 3 pieces of info, throws error with message saying 4 pieces of information are needed', () => {
		expect(() =>
			imageRefToSanityCompatibleURL('e34df65ad4b942a2b2aee73e4ab1ae11-406x233-gif')
		).toThrowError('Invalid response from Sanity, must return 4 indices from the CMS');
	});
	it('test sanity imageRefToSanityCompatibleURL to URL using an assetRef with invalid file type prefix, throws error with invalid assetReference', () => {
		expect(() =>
			imageRefToSanityCompatibleURL('video-e34df65ad4b942a2b2aee73e4ab1ae11-406x233-gif')
		).toThrowError(
			'Invalid asset reference, asset reference does not contain image prefix. Only images are supported'
		);
	});
	it('test sanity imageRefToSanityCompatibleURL to URL using an assetRef with invalid file extension postfix, throws error with invalid file extension error', () => {
		expect(() =>
			imageRefToSanityCompatibleURL('image-e34df65ad4b942a2b2aee73e4ab1ae11-406x233-mkv')
		).toThrowError(
			'Invalid asset reference, asset reference does not contain a file extension! Only GIF, PNG, JPG, and WEBP are supported'
		);
	});
	it('Test imageRefToSanityCompatibleURL converts a Sanity Reference to a usable URL, accurately converts sanity asset to expected URL', () => {
		const validReference = 'image-2f66e106618b77f6c10ee57df45f58b9c884a399-406x233-gif';
		const expectedURL = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATA_SET}/2f66e106618b77f6c10ee57df45f58b9c884a399-406x233.gif`;
		// Use toBe instead of toEqual, and directly compare the values
		expect(imageRefToSanityCompatibleURL(validReference)).toBe(expectedURL);
	});
});
