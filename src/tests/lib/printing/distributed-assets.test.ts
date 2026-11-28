import { existsSync, realpathSync, statSync } from 'node:fs';
import { isAbsolute, relative } from 'node:path';
import { expect, it } from 'vitest';
import legacyArtworkPaths from '$lib/printing/legacy-print-artwork-paths.json';

it('ships every print image under its form family or the shared artwork directory', () => {
	const staticDirectory = new URL('../../../../static/', import.meta.url);
	expect(existsSync(new URL('legacy/', staticDirectory))).toBe(false);
	const formsDirectory = realpathSync(new URL('forms/', staticDirectory));
	const sources = Object.keys(legacyArtworkPaths);

	expect(sources.length).toBeGreaterThan(0);
	for (const source of sources) {
		expect(source).toMatch(/^\/forms\/(?:shared\/[^/]+|(?:corporate-income|individual-income|payment|withholding)\/[^/]+\/[^/]+)$/);
		const file = realpathSync(new URL(source.slice(1), staticDirectory));
		const relativePath = relative(formsDirectory, file);
		expect(relativePath).not.toMatch(/^\.\.(?:[/\\]|$)/);
		expect(isAbsolute(relativePath)).toBe(false);
		expect(statSync(file).isFile(), source).toBe(true);
	}
});
