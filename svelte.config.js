import adapter from '@sveltejs/adapter-vercel';
const config = {
	kit: {
		adapter: adapter({
			runtime: 'edge',
		}),
	},
};
export default config;