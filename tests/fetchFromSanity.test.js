// @ts-nocheck
import { SANITY_PROJECT_ID, SANITY_DATA_SET } from "$env/static/private";
import * as fetchFromSanity from '../src/routes/modules/fetchFromSanity.server'
import {describe, it, expect, beforeAll, vi} from 'vitest';
import {createClient} from "@sanity/client"

let client;

beforeAll(()=>{
    client = createClient({
        projectId: SANITY_PROJECT_ID,
        dataset: SANITY_DATA_SET,
        apiVersion: "2023-09-09",
        useCdn: true
    }); 
});

describe('Test fetchBackground functionality', ()=>{
    it('Fetch a valid Background from sanity', async () =>{
        const fetchedBG = await fetchFromSanity.fetchBackground(client);
        const response = await fetch(fetchedBG);
        expect(response.ok).toBe(true);
        
        const contentType = response.headers.get('content-type');
        expect(contentType.startsWith('image/')).toBe(true);
    });
})

describe('Test fetchGIF functionality', () => {
    it('Fetch a valid GIF randomly from Sanity', async () => {
        const fetchedGIF = await fetchFromSanity.fetchGIF(client);
        const response = await fetch(fetchedGIF);
        expect(response.ok).toBe(true);

        // check if the response content type is an image
        const contentType = response.headers.get('content-type');
        expect(contentType.startsWith('image/')).toBe(true);
    });
}); 

describe('Test fetchBookMarkGroup functionality', () => {
    it('Fetch a valid set of Bookmarks for group 1', async () => {
        const bookmarkGroup1 = await fetchFromSanity.fetchBookmarkGroup(client, "bookmark1");
        for (let index = 0; index < bookmarkGroup1.length; index++) {
            const bookmark = bookmarkGroup1[index];
            expect(bookmark.Icon).toBeDefined();
            expect(bookmark.URL).toBeDefined();
        }
    })

    it('Fetch a valid set of Bookmarks for group 2', async () => {
        const bookmarkGroup2 = await fetchFromSanity.fetchBookmarkGroup(client, "bookmark2");
        for (let index = 0; index < bookmarkGroup2.length; index++) {
            const bookmark = bookmarkGroup2[index];
            expect(bookmark.Icon).toBeDefined();
            expect(bookmark.URL).toBeDefined();
        }
    })

    it('Fetch an undefined set of Bookmarks', async () => {
        await expect(fetchFromSanity.fetchBookmarkGroup(client, undefined)).rejects.toThrowError("Client/Bookmark Group is not defined please check configuration!");
    });
    
    it('Fetch an undefined set of Bookmarks and Undefined Client', async () => {
        await expect(fetchFromSanity.fetchBookmarkGroup(undefined, undefined)).rejects.toThrowError("Client/Bookmark Group is not defined please check configuration!");
    });
    
    it('Fetch a Bookmark Group 1 but use an Undefined Client', async () => {
        await expect(fetchFromSanity.fetchBookmarkGroup(undefined, "bookmark1")).rejects.toThrowError("Client/Bookmark Group is not defined please check configuration!");
    });

    it('Fetch a Bookmark group for one that does not exist', async () =>{
        await expect(fetchFromSanity.fetchBookmarkGroup(client, "bookmark3")).rejects.toThrowError(/Error fetching bookmark data for/);
    });
});

describe('Test fetchSearchProviders functionality', () => {
    it('Fetch search providers from Sanity', async() =>{
        const searchProviders = await fetchFromSanity.fetchSearchProviders(client);
        for (let index = 0; index < searchProviders.length; index++) {
            const searchProvider = searchProviders[index];
            expect(searchProvider.Access).toBeDefined();
            expect(searchProvider.Provider).toBeDefined();
            expect(searchProvider.URL).toBeDefined();
        }
    });
    it('fetch search providers from undefined client', async () =>{
        await expect(fetchFromSanity.fetchSearchProviders(undefined)).rejects.toThrowError("Sanity Client is undefined!");
    });
});