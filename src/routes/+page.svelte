<script>
	// @ts-nocheck
	export let data;
	import GifFrame from '../widgets/GifFrame.svelte';
	import Bookmark1 from '../widgets/Bookmark1.svelte';
	import Bookmark2 from '../widgets/Bookmark2.svelte';
	import Date from '../widgets/Date.svelte';
	import Weather from '../widgets/Weather.svelte';
	import Search from '../widgets/Search.svelte';
	import WindAndAir from '../widgets/WindAndAir.svelte';
	import { fetchCurrentConditions } from '../api/fetchFromExpress';
	import {onMount} from 'svelte';
	
	let currentConditions;

	onMount(async () => {
		try {
			// Attempt to get the user's location from the browser
			const position = await new Promise((resolve, reject) => {
        		navigator.geolocation.getCurrentPosition(resolve, reject);
    		});

			// Store the latitude and longitude to the variable coordinates
			// It must be a string as the express server is expecting it like this
			const coordinates = `${position.coords.latitude},${position.coords.longitude}`
			
			// Hardcoding the purple air sensor
			const sensor = "55751";

			// Fetch the current conditions using fetchFromExpress with the coordinates and the purple air sensor
			currentConditions = await fetchCurrentConditions(coordinates, sensor);

		} catch (error) {
			// If the user blocks location use a backup aka Honolulu for their location
			const coordinates = "21.3281736,-157.8814738";
			// Still hardcoding the sensor for purple air
			const sensor = "55751";
			// Fetch the current conditions for Honolulu
			currentConditions = await fetchCurrentConditions(coordinates, sensor);
		}
	});

</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
{#if currentConditions && currentConditions.weather}
	<div class="center" style="--image: url({data.background});">
		<div class="parent">
			<div class="date">
				<Date />
			</div>
			<div class="bongoGif">
				<GifFrame randomGif={data.gifs} />
			</div>
			<div class="bookmark1">
				<Bookmark1 bookmarks={data.bookmarkGroup1} />
			</div>
			<div class="bookmark2">
				<Bookmark2 bookmarks={data.bookmarkGroup2} />
			</div>
			<div class="weather">
				<Weather weather={currentConditions.weather} />
			</div>
			<div class="windAndAir">
				<WindAndAir weather={currentConditions.weather} aqi={currentConditions.airQualityData} />
			</div>
		</div>
		<div class="search">
			<Search searchProviders={data.searchProviders} />
		</div>
	</div>
{/if}

<style>
	.center {
		display: flex;
		justify-content: center;
		flex-flow: column wrap;
		align-items: center;
		min-height: 100%;
		border: 0px solid green;
		background-image: var(--image);
	}

	.parent {
		display: grid;
		/* removing grid here makes this basically mobile responsive lol */
		grid-template-columns: repeat(4, 209px);
		grid-template-rows: repeat(2, 177px);
		grid-column-gap: 50px;
		grid-row-gap: 50px;
	}

	.parent div {
		transition: background-color 0.3s;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.6rem;
		border-bottom: 2px solid rgba(10, 10, 10, 0.3);
		font-size: 1.2em;
		padding: 20px;
	}

	.parent > div {
		background-color: #242424;
		box-shadow:
			rgb(67, 67, 80) 0px 50px 100px -20px,
			rgba(194, 194, 194, 0.3) 0px 30px 60px -30px;
	}
	.bongoGif {
		grid-area: 2 / 1 / 2 / 1;
	}
	.date {
		grid-area: 1 / 1 / 2 / 2;
	}
	.bookmark1 {
		grid-area: 1 / 2 / 3 / 3;
	}
	.bookmark2 {
		grid-area: 1 / 3 / 3 / 4;
	}
	.weather {
		grid-area: 1 / 4 / 2 / 5;
	}
	.windAndAir {
		grid-area: 2 / 4 / 2 / 5;
	}
	.search {
		padding-top: 15px;
	}
</style>
