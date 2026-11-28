import artworkPaths from './legacy-print-artwork-paths.json';

async function readBundledArtwork(source: string): Promise<string> {
	const response = await fetch(source, { redirect: 'error' });
	if (!response.ok) throw new Error(`Could not load the legacy print image ${source}`);
	const blob = await response.blob();
	if (!/^image\/(?:png|jpeg|gif)$/.test(blob.type)) {
		throw new Error(`Could not load the legacy print image ${source}`);
	}
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(blob);
	});
}

export async function loadLegacyPrintArtwork(sources: Iterable<string>): Promise<Record<string, string>> {
	const sourcePaths = Array.from(new Set(sources)).filter(source => !source.startsWith('data:'));
	for (const source of sourcePaths) {
		if (!Object.hasOwn(artworkPaths, source)) throw new Error(`Unrecognized legacy print image ${source}`);
	}
	const entries = await Promise.all(sourcePaths.map(async source => [source, await readBundledArtwork(source)] as const));
	return Object.fromEntries(entries);
}
