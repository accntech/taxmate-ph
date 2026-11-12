export function displayedAvatarSrc(src: string | null | undefined, failedSrc: string | null) {
	const trimmed = src?.trim();
	if (!trimmed || trimmed === failedSrc) return null;
	return trimmed;
}

export type AvatarImageResources = {
	src: string;
	srcset?: string;
};

export const DEFAULT_AVATAR_IMAGE_SIZE = 96;
export const DEFAULT_AVATAR_SRCSET_WIDTHS = [48, 64, 96, 128, 160, 192, 256] as const;

const CLOUDINARY_UPLOAD_MARKER = '/image/upload/';

export function cloudinaryAvatarUrl(src: string, size: number): string {
	const markerIndex = src.indexOf(CLOUDINARY_UPLOAD_MARKER);
	if (markerIndex === -1) return src;

	const transform = `f_auto,q_auto,c_thumb,g_face,w_${size},h_${size}`;
	const insertAt = markerIndex + CLOUDINARY_UPLOAD_MARKER.length;
	return `${src.slice(0, insertAt)}${transform}/${src.slice(insertAt)}`;
}

export function avatarImageResources(
	src: string,
	size = DEFAULT_AVATAR_IMAGE_SIZE,
	widths: readonly number[] = DEFAULT_AVATAR_SRCSET_WIDTHS
): AvatarImageResources {
	const transformedSrc = cloudinaryAvatarUrl(src, size);
	if (transformedSrc === src) return { src, srcset: undefined };

	return {
		src: transformedSrc,
		srcset: widths.map((width) => `${cloudinaryAvatarUrl(src, width)} ${width}w`).join(', ')
	};
}
