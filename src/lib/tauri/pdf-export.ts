import { Channel, invoke } from '@tauri-apps/api/core'

import type { PrintPaperSize } from '$lib/printing/profiles'

export type PdfExportRequest = {
	jobId?: string
	formCode: string
	paperSize: PrintPaperSize
	html: string
	suggestedFilename: string
	outputPath?: string
}

export type PdfExportReceipt = {
	status: 'exported'
	paperSize: PrintPaperSize
	path: string
	message: string
}

export type PdfExportError = {
	message: string
	logPath?: string
}

export type PdfExportProgress = {
	completedSteps: number
	totalSteps: number
	stage: string
}

export type ExportPdf = (request: PdfExportRequest, onProgress?: (progress: PdfExportProgress) => void) => Promise<PdfExportReceipt>

export type PdfExportFilenameInput = {
	formCode: string
	year?: string
	quarter?: string
	period?: string
}

export function buildPdfExportFilename(input: PdfExportFilenameInput): string {
	return `${input.formCode}-${input.period ?? `${input.year}-${input.quarter}`}.pdf`
}

export function createPdfExportClient(
	call: typeof invoke<PdfExportReceipt> = invoke<PdfExportReceipt>
): ExportPdf {
	return (request, onProgress) => call('export_form_pdf', {
		request,
		...(onProgress ? { onProgress: new Channel<PdfExportProgress>(onProgress) } : {})
	})
}

export function formatPdfExportError(error: unknown): string {
	if (isPdfExportError(error)) {
		return error.logPath ? `${error.message} Log: ${error.logPath}` : error.message
	}

	if (error instanceof Error) {
		return error.message
	}

	return String(error)
}

function isPdfExportError(error: unknown): error is PdfExportError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'message' in error &&
		typeof (error as { message: unknown }).message === 'string'
	)
}

export function cancelPdfExport(jobId: string): Promise<boolean> {
	return invoke<boolean>('cancel_pdf_export', { jobId })
}
