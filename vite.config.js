import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { stylexPlugin } from './vendor/pcsti-ui/stylex.vite';

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
	plugins: [tailwindcss(), sveltekit(), stylexPlugin({ htmlInjection: false, testing: !!process.env.VITEST })],
	// Scan linked UI sources up front so their imports do not reload active forms.
	optimizeDeps: {
		entries: ['vendor/pcsti-ui/src/**/*.{svelte,ts}']
	},

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
	clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
	server: {
		fs: { allow: ['vendor/pcsti-ui'] },
		port: 1420,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: 'ws',
					host,
					port: 1421
				}
			: undefined,
		watch: {
			// 3. tell Vite to ignore watching `src-tauri`
			ignored: ['**/src-tauri/**']
		}
	},
	test: {
		include: ['src/tests/**/*.{test,spec}.ts']
	}
}));
