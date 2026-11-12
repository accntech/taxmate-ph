export type ImageResponseDetails = {
	ok: boolean;
	status: number;
	contentType: string;
};

export function validateImageResponse(
	response: ImageResponseDetails,
	formats: string[]
): string | null {
	if (!response.ok) return `Failed to fetch image (${response.status})`;

	const format = imageFormat(response.contentType);
	if (!format) return 'URL does not point to an image';

	return isAllowedImageFormat(format, formats)
		? null
		: `Unsupported format. Allowed: ${formats.join(', ')}`;
}

function imageFormat(contentType: string): string | null {
	if (!contentType.startsWith('image/')) return null;

	return contentType.replace('image/', '').split(';')[0]!.trim();
}

function isAllowedImageFormat(format: string, formats: string[]): boolean {
	const normalized = format === 'jpeg' ? 'jpg' : format;
	return formats.includes(normalized) || formats.includes(format);
}
