// @ts-nocheck
import { SANITY_PROJECT_ID, SANITY_DATA_SET } from "$env/static/private";

/**
 * Converts an Image from Sanity CMS into a url we can actually use
 *
 * @param {string} assetRef - The Sanity image reference.
 * @returns {string} - The URL a compatible url from our Sanity CMS.
 */
export function imageRefToSanityCompatibleURL(assetRef) {
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