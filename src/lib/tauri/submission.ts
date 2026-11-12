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
	rdoXml?: string
	returnFilename: string
	formCode: string
	tin: string
	email: string
	mode: SubmissionMode
	dispatcher?: DispatcherSettings
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

export type SubmissionLog = {
	path: string
	content: string
	truncated: boolean
}

export function createSubmissionLogClient(
	call: typeof invoke<SubmissionLog> = invoke<SubmissionLog>
): () => Promise<SubmissionLog> {
	return () => call('read_submission_log')
}

export function formatSubmissionLog(content: string, timeZone?: string): string {
	const formatter = new Intl.DateTimeFormat('en-GB', {
		timeZone,
		year: 'numeric', month: '2-digit', day: '2-digit',
		hour: '2-digit', minute: '2-digit', second: '2-digit',
		hourCycle: 'h23', timeZoneName: 'shortOffset'
	})
	return content.replace(/^ts=(\d+)(?=\s|$)/gm, (timestamp, seconds: string) => {
		const date = new Date(Number(seconds) * 1000)
		if (!Number.isFinite(date.getTime())) return timestamp
		const parts = new Map(formatter.formatToParts(date).map(part => [part.type, part.value]))
		return `[${parts.get('year')}-${parts.get('month')}-${parts.get('day')} ${parts.get('hour')}:${parts.get('minute')}:${parts.get('second')} ${parts.get('timeZoneName')}]`
	})
}

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
