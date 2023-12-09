### What is this repository?
This is currently the rebuild of my startpage project. My original project works but needs a good rebuild.  Startpage was originally created as a project to learn Svelte and JS. Things have changed and it's time to tidy it up. The original project does not have any testing whatsoever so this here we are trying to fix that.  
### What are we going to test?
#### Unit Tests
- Develop unit tests for "+page.server.js" functions.
- [x] Sanity CMS Client Tests for client configuration and imageRefToSanityCompatibleURL function.  (Rename is in progress for that)
- [ ] Need Unit Tests for fetch weather from Weather API and the backup Open Weather Map
- [ ] Need Tests for Air Quality
- [x] Need Tests for fetch from Sanity functions (bookmark groups, search providers, GIFS, and Background Image)
#### End-End Tests
- Use PlayWright to handle UI tests, more to come later.
- Currently need to develop a Mock API for testing the backup API Weather API functions.