import { invoke } from '@tauri-apps/api/core'

export type SubmissionMode = 'dry_run' | 'legacy_sftp'

export type DispatcherSettings = {
	mode: string
	server: string
	sslPort: string
	port: string
	username: string
	password: string
}

export type SubmissionRequest = {
	xml: string
	returnFilename: string
	formCode: string
	tin: string
	email: string
	mode: SubmissionMode
	dispatcher?: DispatcherSettings
	legacyToolsDir?: string
	fetchDispatcher: boolean
}

export type SubmissionReceipt = {
	status: 'drafted' | 'submitted' | 'failed'
	finalFlag: string
	savePath: string
	sendPath: string
	dispatcherUrl?: string
	exitCode?: number
	logPath?: string
	message: string
}

export type SubmissionError = {
	message: string
	logPath?: string
}

export type SubmitReturn = (request: SubmissionRequest) => Promise<SubmissionReceipt>

export function createSubmissionClient(
	call: typeof invoke<SubmissionReceipt> = invoke<SubmissionReceipt>
): SubmitReturn {
	return (request) => call('submit_return', { request })
}

export function formatSubmissionError(error: unknown): string {
	if (isSubmissionError(error)) {
		return error.logPath ? `${error.message} Log: ${error.logPath}` : error.message
	}

	if (error instanceof Error) {
		return error.message
	}

	return String(error)
}

function isSubmissionError(error: unknown): error is SubmissionError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'message' in error &&
		typeof (error as { message: unknown }).message === 'string'
	)
}
