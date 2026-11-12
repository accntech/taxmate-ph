export type CropCanvasOptions = {
	width?: number;
	height?: number;
};

export type CropOutputOptions = {
	mime: string;
	quality?: number;
};

const CROP_WIDTH = 512;
const JPEG_QUALITY = 0.9;
const ALPHA_SAFE_MIME_TYPES = new Set(['image/png', 'image/webp']);

export function cropCanvasOptions(activeRatio: number): CropCanvasOptions {
	if (Number.isNaN(activeRatio)) return {};

	return {
		width: CROP_WIDTH,
		height: Math.round(CROP_WIDTH / activeRatio)
	};
}

export function cropOutputOptions(sourceType: string): CropOutputOptions {
	if (ALPHA_SAFE_MIME_TYPES.has(sourceType)) {
		return { mime: sourceType };
	}

	return { mime: 'image/jpeg', quality: JPEG_QUALITY };
}

export function confirmCropBlob(blob: Blob | null, onconfirm: (blob: Blob) => void): boolean {
	if (!blob) return false;

	onconfirm(blob);
	return true;
}
