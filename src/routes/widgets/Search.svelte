<script>
	// @ts-nocheck
	let query = '',
		provider = 'Search',
		url = 'https://www.google.com/search?q=';

	export let searchProviders;

	function handleKeyDown(event) {
		if (event.code == 'Enter') {
			if (query === '!help' || query === '!h') {
				var availableCMDs = [];
				for (const key in searchProviders) {
					availableCMDs.push(
						`${' ' + searchProviders[key].Access} : ${searchProviders[key].Provider}`
					);
				}
				alert(' Below are the available commands for the search function \n' + availableCMDs);
				query = '';
			} else if (query.startsWith('!') && (query.length == 2 || query.length == 3)) {
				// @ts-ignore
				var indexOfProvider = findProviderByAccess(query, searchProviders);
				if (indexOfProvider !== undefined) {
					provider = searchProviders[indexOfProvider].Provider;
					url = searchProviders[indexOfProvider].URL;
				}
				query = '';
			} else if (query !== '') {
				window.location.href = url + query;
			}
		}
	}
	function findProviderByAccess(query, providersArray) {
		const foundProvider = providersArray.find(
			(/** @type {{ Access: string; }} */ provider) => provider.Access === query
		);
		if (foundProvider) {
			return providersArray.indexOf(foundProvider);
		} else {
			console.error('Search provider not found');
		}
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="searchBox">
	<input bind:value={query} type="text" placeholder={provider} />
</div>

<style>
	input {
		font-size: 38px;
		font-family: Inter, Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-weight: 400;
		text-align: center;
		background: none;
		width: auto;
		outline: 0;
		color: rgba(255, 255, 255, 0.84);
		border: 0px;
		height: 50px;
	}
	input::placeholder {
		font-family: Inter, Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-weight: 400;
		text-align: center;
		background: none;
		color: rgba(255, 255, 255, 0.973);
	}
	.searchBox {
		background: #242424;
		border-radius: 0.6rem;
	}
</style>
