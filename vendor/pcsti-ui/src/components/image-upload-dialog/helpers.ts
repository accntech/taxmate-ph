export function isUploadAbort(error: unknown): boolean {
	return error instanceof Error && error.message === 'Upload aborted';
}

export function uploadErrorMessage(error: unknown): string {
	return error instanceof Error ? error.message : 'Upload failed';
}
