<script>
	const month = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	let day = new Date();
	const nth = function (/** @type {number} */ d) {
		const dString = String(d);
		const last = +dString.slice(-2);
		if (last > 3 && last < 21) return 'th';
		switch (last % 10) {
			case 1:
				return 'st';
			case 2:
				return 'nd';
			case 3:
				return 'rd';
			default:
				return 'th';
		}
	};
</script>

<div class="date">
	<p>It's</p>
	<p>{weekday[day.getDay()]}</p>
	<p>{month[day.getMonth()]} {day.getDate()}{nth(day.getDate())}</p>
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
		padding: 5px;
	}
	.date {
		line-height: 2.7rem;
		text-align: center;
		flex-flow: column;
		height: 125px;
	}
	.date p {
		margin: 0;
		font-size: 1.3rem;
		text-align: center;
	}
	.date p:nth-child(1) {
		color: rgba(255, 255, 255, 0.5);
		font-weight: 400;
	}
	.date p:nth-child(2) {
		color: rgba(255, 255, 255, 0.75);
		font-weight: 400;
	}
	.date p:nth-child(3) {
		color: rgba(255, 255, 255, 1);
		font-weight: 600;
	}
</style>
