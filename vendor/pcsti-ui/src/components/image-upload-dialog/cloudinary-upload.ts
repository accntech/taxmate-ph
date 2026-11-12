import type { ImageUploadResult } from './types';

type Options = {
	blob: Blob;
	cloudName: string;
	uploadPreset: string;
	folder: string;
	onProgress: (percent: number) => void;
	signal?: AbortSignal;
};

export function uploadToCloudinary(opts: Options): Promise<ImageUploadResult> {
	const { blob, cloudName, uploadPreset, folder, onProgress, signal } = opts;

	return new Promise((resolve, reject) => {
		const formData = new FormData();
		formData.append('file', blob);
		formData.append('upload_preset', uploadPreset);
		formData.append('folder', folder);

		const xhr = new XMLHttpRequest();
		xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

		let abortHandler: (() => void) | null = null;
		const cleanup = () => {
			if (signal && abortHandler) {
				signal.removeEventListener('abort', abortHandler);
				abortHandler = null;
			}
		};

		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable && event.total > 0) {
				onProgress(Math.round((event.loaded / event.total) * 100));
			}
		};

		xhr.onload = () => {
			cleanup();
			if (xhr.status >= 200 && xhr.status < 300) {
				try {
					resolve(JSON.parse(xhr.responseText) as ImageUploadResult);
				} catch {
					reject(new Error('Failed to parse upload response'));
				}
				return;
			}
			try {
				const body = JSON.parse(xhr.responseText);
				reject(new Error(body?.error?.message ?? `Upload failed with status ${xhr.status}`));
			} catch {
				reject(new Error(`Upload failed with status ${xhr.status}`));
			}
		};

		xhr.onerror = () => {
			cleanup();
			reject(new Error('Network error during upload'));
		};

		if (signal) {
			abortHandler = () => {
				xhr.abort();
				cleanup();
				reject(new Error('Upload aborted'));
			};
			signal.addEventListener('abort', abortHandler);
		}

		xhr.send(formData);
	});
}
