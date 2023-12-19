/** @type {import('@playwright/test').PlaywrightTestConfig} */

const config = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests/UI',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	fullyParallel: true
};

export default config;
