export type ImageUploadResult = {
	secure_url: string;
	public_id: string;
	width: number;
	height: number;
	format: string;
	bytes: number;
	original_filename: string;
};

export type ImageUploadError = {
	message: string;
};

export type UploadSource = 'local' | 'url' | 'camera';
export type UploadStep = 'select' | 'crop' | 'uploading' | 'error';
