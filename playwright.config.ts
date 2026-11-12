import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests/browser',
	use: { baseURL: 'http://127.0.0.1:1422', headless: true },
	webServer: {
		command: 'bun run dev --port 1422 --host 127.0.0.1',
		url: 'http://127.0.0.1:1422',
		reuseExistingServer: !process.env.CI
	}
});
