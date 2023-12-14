<script>
	/**
	 * @type {any}
	 */
	export let randomGif;
</script>

<div class="gifContainer">
	<img src={randomGif} alt="" width="100%" height="100%" />
</div>

<style>
	.gifContainer {
		background-color: rgba(10, 10, 10, 0.05);
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.6rem;
		border-bottom: 2px solid rgba(10, 10, 10, 0.3);
		width: 181px;
		height: 141px;
	}
	img {
		border-radius: 0.4rem;
	}
</style>
