// @ts-nocheck
import {describe, it, expect} from 'vitest';
import {createSanityClient, imageRefToSanityCompatibleURL} from '../src/routes/+page.server';


describe('createSanityClient Test', () => {
    it('creates a Sanity client with the correct configuration when env variables are defined', () => {
        const sanityClient = createSanityClient();
        expect(sanityClient.config).toBeDefined();
        expect(typeof sanityClient.config).toBe('function');
        expect(sanityClient.config().apiVersion).toBe('2023-09-09');
        expect(sanityClient.config().useCdn).toBeTruthy();
    });
});

describe('imageRefToSanityCompatibleURL', () =>{
    it('test sanity assetRef to URL using an undefined assetRef', () =>{
        expect(()=> imageRefToSanityCompatibleURL(undefined)).toThrowError("Invalid asset reference");
    });
    it('test sanity assetRef to URL using an assetRef with only 3 pieces of info', () =>{
        expect(() => imageRefToSanityCompatibleURL("e34df65ad4b942a2b2aee73e4ab1ae11-406x233-gif")).toThrowError("Invalid response from Sanity, must return 4 indices from the CMS");
    });
    it('test sanity assetRef to URL using an assetRef with invalid file type prefix', () =>{
        expect(() => imageRefToSanityCompatibleURL("Invalid asset reference, asset reference does not contain image prefix. Only images are supported"));
    });
    it('test sanity assetRef to URL using an assetRef with invalid file extension postfix', () =>{
        expect(() => imageRefToSanityCompatibleURL("image-e34df65ad4b942a2b2aee73e4ab1ae11-406x233-mkv")).toThrowError("Invalid asset reference, asset reference does not contain a file extension! Only GIF, PNG, JPG, and WEBP are supported");
    });
    it('test sanity assetRef to URL creates a usable URL', () =>{
        const createdURL = imageRefToSanityCompatibleURL("image-fc1ba5cd7a65f5209bce74a674a19fbd84703bce-472x472-gif");
        const imageBlob = fetchImage(createdURL);
        expect(imageBlob instanceof Blob).toBe(true);
    });
});

async function fetchImage(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image. Status: ${response.status}`);
    }
  
    // Check if the Content-Type header indicates an image
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.startsWith('image/')) {
      return await response.blob();
    } else {
      throw new Error(`The fetched content is not an image. Content-Type: ${contentType}`);
    }
  }
