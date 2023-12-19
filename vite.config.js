import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		coverage: {
			reporter: ['text', 'json', 'html'],
			include: ['src/**']
		},
		include: ['tests/Unit/*.{test,spec}.{js,ts}']
	}
});
