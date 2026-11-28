import type { Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';

const mapFile = new URL('../../../src/lib/printing/legacy-print-artwork-paths.json', import.meta.url);
const sources = new Map(Object.entries(JSON.parse(readFileSync(mapFile, 'utf8')) as Record<string, string>));
const mimeTypes = new Map([
	['.png', 'image/png'],
	['.gif', 'image/gif'],
	['.jpg', 'image/jpeg'],
	['.jpeg', 'image/jpeg']
]);
/** Override the bundled artwork only when a comparison fixture is supplied. */
export async function seedLegacyPrintArtwork(page: Page) {
	const root = process.env.EBIRFORMS_PRINT_ARTWORK_DIR;
	if (!root) return;
	await page.route(url => url.pathname.startsWith('/forms/'), async route => {
		const url = new URL(route.request().url());
		const asset = sources.get(url.pathname);
		if (!asset) {
			await route.fulfill({ status: 404 });
			return;
		}
		const file = join(root, basename(root).toLowerCase() === 'img' ? asset.slice('img/'.length) : asset);
		await route.fulfill({ contentType: mimeTypes.get(extname(file).toLowerCase()), body: await readFile(file) });
	});
}
