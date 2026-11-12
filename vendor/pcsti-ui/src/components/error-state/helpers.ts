export const DEFAULT_ERROR_STATE_MESSAGE =
	'Something went wrong while fetching this section. The error has been reported — you can retry, or move on.';

export function errorStateMessage(description: string | undefined, error: unknown): string {
	if (description) return description;
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === 'string' && error) return error;
	return DEFAULT_ERROR_STATE_MESSAGE;
}
