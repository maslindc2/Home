### Welcome Home
Home is a Sveltekit-based web app that transforms your browser's home page into a personalized hub. It features a versatile search provider, Bookmarks, live Weather/Wind updates, and Air Quality information. All content is seamlessly delivered through Sanity CMS. Unlike generic home pages like Google or Duck Duck Go, Home lets you add your favorite bookmarks, Gifs, Search Providers, and backgrounds for a truly customized browsing experience. Say goodbye to bland and hello to your unique internet Home!
#### What's a multi-function search provider?
Home has a basic but powerful search box that allows you to skip all of the suggested content and potential distractions with loading the websites homepage and then performing your search. Instead, you can land directly on the results page you need.

To get started you can click on the Question Mark on the right side of the search box to see a list of available search providers.  Alternatively, you can use the table below. The default search provider is Google.

| Site Command | Website Name |
| ------------ | ------------ |
| !am          | Amazon       |
| !dc          | Discogs      |
| !eb          | Ebay         |
| !g           | Google       |
| !hs          | HifiShark    |
| !r           | Reddit       |
| !yt          | YouTube             |

### What's the goal here?
This serves as an ongoing project for learning full-stack development. I have created Unit Tests using Vitest, UI tests using Playwright, and created branch protections to ensure quality and reliable releases. I also learned how to handle API outages and ensure that your internet Home never disappears. 
#### Development/Future Plans
Much like a real home it's always a work in progress, here's what we got in store for the future.

Milestone 3
- Implement location services. Currently relies on an env variable for the current location to fetch Weather/Wind and Air Quality.
- Create cookies for setting/remembering Light and Dark mode options.  Only dark mode is supported currently.

Milestone 4
- Moving from Sanity CMS to larger centralized database.  Currently the only way to customize Home is through creating your own [Sanity Studio](https://www.sanity.io/studio), Open Weather Map, Purple Air, and Weather API keys. By moving to a centralized database the user can easily sign-in and can bring their own Home wherever they go. 
