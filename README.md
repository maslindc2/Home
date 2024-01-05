### Welcome Home
Home is a Sveltekit-based web app that transforms your browser's home page into a personalized hub. It features a versatile search provider, Bookmarks, live Weather/Wind updates, and Air Quality information. All content is seamlessly delivered through Sanity CMS. Unlike generic home pages like Google or Duck Duck Go, Home lets you add your favorite bookmarks, Gifs, Search Providers, and backgrounds for a truly customized browsing experience. Say goodbye to bland and hello to your unique internet Home!
#### What's a multi-function search provider?
Let's say you quickly want to see if Amazon has an item you are looking for. Instead of going to Amazon, waiting for all the suggested content and advertisements to load, you can instead use Home's search provider to skip the wait and go directly to your desired search results.
To get started, all you have to do is type a site command using the table below (or by clicking on the help icon next to the search bar on [Home](https://home-topaz-five.vercel.app/)) and press enter.  You are now ready to search the website you selected, type in your query, press enter, and you will see the search result for your query. 

| Site Command | Website Name |
| ------------ | ------------ |
| !am          | Amazon       |
| !dc          | Discogs      |
| !eb          | Ebay         |
| !g           | Google       |
| !hs          | HifiShark    |
| !r           | Reddit       |
| !yt          | YouTube      |

### What's the goal here?
This serves as an ongoing project for learning full-stack development. We have created Unit Tests using Vitest, UI tests using Playwright, and created branch protections to ensure quality and reliable releases, ensuring your home never disappears.
#### Development/Future Plans
Much like a real home it's always a work in progress, here's what we got in store for the future.
##### Milestone 3
- Implement location services. Currently relies on an env variable for the current location to fetch Weather/Wind and Air Quality.
- Create cookies for setting/remembering Light and Dark mode options.  Only dark mode is supported currently.
##### Milestone 4
- Moving from Sanity CMS to a database that allows for multiple users to create their own home.  Currently the only way to customize Home is through creating your own [Sanity Studio](https://www.sanity.io/studio), Open Weather Map, Purple Air, and Weather API keys. By moving to a centralized database the user can easily sign-in and can bring their own Home wherever they go.  The current plan is to use Firebase, allowing anyone to easily configure and set up their own Home. 
