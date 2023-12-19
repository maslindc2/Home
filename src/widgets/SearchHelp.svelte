<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import SearchHelpIcon from '$lib/assets/help.png';

	let dialog;
	onMount(() => {
		dialog = document.getElementById('help-dialog');
	});
	// Show the dialog when clicking help button
	const showDialogClick = () => {
		dialog.showModal();
	};
	const closeClick = () => {
		dialog.close();
	};
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<dialog id="help-dialog">
	<h1>Search Help</h1>
	<div id="instructions">
		<p>
			This powerful search box allows you to seamlessly explore multiple websites at once. In
			addition to searching on Google, you can directly query other specified websites.
		</p>
		<p>
			To initiate a search on a specific website, simply type the `!site code` and then press enter.
			The input box text will now display your selected site. You're now all set to search the
			chosen website.
		</p>
		<p>
			Enter your query, hit enter, and watch as you are swiftly redirected to the selected website,
			presenting you with the search results.
		</p>
		<p>Please note that by default, the search function is set to Google. Happy searching!</p>
	</div>
	<table id="commands">
		<tr>
			<th>Site Code</th>
			<th>Website Name</th>
		</tr>
		<tr>
			<th>!dc</th>
			<th>Discogs</th>
		</tr>
		<tr>
			<th>!eb</th>
			<th>Ebay</th>
		</tr>
		<tr>
			<th>!yt</th>
			<th>YouTube</th>
		</tr>
		<tr>
			<th>!wk</th>
			<th>Wikipedia</th>
		</tr>
		<tr>
			<th>!hs</th>
			<th>HifiShark</th>
		</tr>
		<tr>
			<th>!am</th>
			<th>Amazon</th>
		</tr>
		<tr>
			<th>!r</th>
			<th>Reddit</th>
		</tr>
		<tr>
			<th>!g</th>
			<th>Google</th>
		</tr>
	</table>

	<button on:click={closeClick}>Close</button>
</dialog>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<img
	src={SearchHelpIcon}
	class="help-button"
	on:click={() => showDialogClick()}
	alt="Search Help Button"
/>

<style>
	.help-button {
		width: 30px;
		height: 33px;
		position: relative;
		bottom: 2.7rem;
		left: 28rem;
		cursor: pointer;
		transition: filter 0.3s ease-in-out;
	}
	.help-button:hover {
		filter: invert(1);
	}

	#help-dialog {
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 20px;
		border-radius: 5px;
		border-width: 1px;
		color: rgba(255, 255, 255, 0.84);
		background: #242424;
		transition:
			background 2s,
			color 2s;
	}

	dialog {
		border-radius: 5px;
		border-width: 1px;
		color: rgba(255, 255, 255, 0.84);
		background: #242424;
		transition:
			background 2s,
			color 2s;
	}
	dialog::backdrop {
		background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7));
		animation: fade-in 1s;
	}
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	#instructions {
		max-width: 600px; /* Adjust the max-width as needed */
		margin-bottom: 20px;
	}

	#commands {
		width: 100%;
		max-width: 600px; /* Adjust the max-width as needed */
		margin-bottom: 20px;
	}

	button {
		cursor: pointer;
	}
</style>
