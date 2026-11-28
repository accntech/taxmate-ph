import { invoke } from '@tauri-apps/api/core';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import artworkPaths from '$lib/printing/legacy-print-artwork-paths.json';
import { loadLegacyPrintArtwork } from '$lib/printing/legacy-print-artwork';

vi.mock('@tauri-apps/api/core', () => ({ invoke: vi.fn() }));

const [legacyImage] = Object.keys(artworkPaths);
const image = 'data:image/png;base64,iVBORw0KGgo=';
const directory = '/installed/eBIRForms';
const fetch = vi.fn<typeof globalThis.fetch>();

beforeEach(() => {
	vi.mocked(invoke).mockReset();
	fetch.mockReset();
	vi.stubGlobal('fetch', fetch);
	vi.stubGlobal('FileReader', class {
		result = image;
		onload?: () => void;

		readAsDataURL() {
			this.onload?.();
		}
	});
});

afterEach(() => vi.unstubAllGlobals());

it('embeds each bundled image once without consulting an old installation path', async () => {
	fetch.mockResolvedValue(new Response(new Blob([], { type: 'image/png' })));

	const assets = await Reflect.apply(loadLegacyPrintArtwork, undefined, [[legacyImage, legacyImage, image], directory]);

	expect(fetch).toHaveBeenCalledExactlyOnceWith(legacyImage, { redirect: 'error' });
	expect(invoke).not.toHaveBeenCalled();
	expect(assets).toEqual({ [legacyImage]: image });
});

it('rejects unmapped image URLs before fetching artwork', async () => {
	await expect(loadLegacyPrintArtwork(['https://example.test/form.png'])).rejects.toThrow(
		'Unrecognized legacy print image'
	);
	expect(fetch).not.toHaveBeenCalled();
});

it('rejects a bundled URL serving a non-image response', async () => {
	fetch.mockResolvedValue(new Response('<html></html>', { headers: { 'Content-Type': 'text/html' } }));

	await expect(loadLegacyPrintArtwork([legacyImage])).rejects.toThrow(
		'Could not load the legacy print image'
	);
});
