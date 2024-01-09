<script>
	// @ts-nocheck
	export let weather;
	export let aqi;
	import Compass from '$lib/assets/compass.webp';
</script>

<div class="weatherContainer">
	<div class="w1">
		<h3 style="margin: 0; text-align: center;">
			<p id="feels">
				{weather.wind.wind_mph} mph
			</p>
		</h3>
		<img
			id="icon"
			src={Compass}
			alt="..."
			style="transform: rotate({weather.wind.wind_mph}deg);"
		/>
	</div>
	<div class="w2">
		<a id="sensorLink" href="https://map.purpleair.com/1/mAQI/a10/p604800/cC0?select={aqi.Sensor}">
			Air: {`${aqi.aqiLabel} (${aqi.AQI})`}
		</a>
	</div>
</div>

<style>
	div {
		background-color: rgba(10, 10, 10, 0.05);
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.6rem;
		border-bottom: 2px solid rgba(10, 10, 10, 0.3);
		font-size: 1.2em;
		padding: 20px;
	}
	#sensorLink {
		text-decoration: none;
		color: rgba(255, 255, 255, 0.9);
	}
	#feels {
		color: rgba(255, 255, 255, 0.973);
		font-size: 0.9rem;
		margin: 0;
		font-weight: 500;
		padding-right: 0.4rem;
		font-size: 1.4rem;
	}

	#icon {
		object-fit: contain;
		width: 50px;
		height: 50px;
		filter: invert();
	}

	.weatherContainer {
		display: flex;
		justify-content: space-around;
		flex-flow: column;
		padding: 6px;
		width: 100%;
		height: 90%;
	}

	.weatherContainer .w1,
	.weatherContainer .w2 {
		border-bottom: none;
		padding: unset;
		background-color: unset;
		text-align: center;
	}

	.weatherContainer .w1 {
		color: rgba(255, 255, 255, 0.897);
		justify-content: space-around;
		width: 100%;
	}

	.weatherContainer .w2 {
		color: rgba(255, 255, 255, 0.9);
		font-size: 1rem;
	}
</style>
