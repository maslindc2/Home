// @ts-nocheck
import { load } from '../../src/routes/+page.server';
import * as fetchFromSanity from '../../src/api/fetchFromSanity.server';
import { describe, it, expect, vi } from 'vitest';

describe('load function', () => {
	it('should load data correctly', async () => {
		// Mock data for the function calls
		const mockGifs = 'testing.gif';
		const mockBackground = 'testing.webp';
		const mockSearchProviders = 'Testing Search Providers';
		const mockBookmarkGroup1 = 'Bookmark1 Data';

		const fetchGIFSpy = vi.spyOn(fetchFromSanity, 'fetchGIF');
		fetchGIFSpy.mockResolvedValue(mockGifs);

		const fetchBackgroundSpy = vi.spyOn(fetchFromSanity, 'fetchBackground');
		fetchBackgroundSpy.mockResolvedValue(mockBackground);

		const fetchSearchProvidersSpy = vi.spyOn(fetchFromSanity, 'fetchSearchProviders');
		fetchSearchProvidersSpy.mockResolvedValue(mockSearchProviders);

		const fetchBookMarkGroup1Spy = vi.spyOn(fetchFromSanity, 'fetchBookmarkGroup');
		fetchBookMarkGroup1Spy.mockReturnValue(mockBookmarkGroup1);

		// Call the load function
		const result = await load();

		// Assertions
		expect(result.gifs).toEqual(mockGifs);
		expect(result.bookmarkGroup1).toEqual(mockBookmarkGroup1);
		expect(result.searchProviders).toEqual(mockSearchProviders);
		expect(result.background).toEqual(mockBackground);
	});
});
