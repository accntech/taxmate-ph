import { describe, expect, test } from 'vitest'

import {
	createPdfExportClient,
	formatPdfExportError,
	type PdfExportRequest
} from './pdfExport'

describe('createPdfExportClient', () => {
	test('invokes export_form_pdf with a typed request envelope', async () => {
		const request: PdfExportRequest = {
			formCode: '1601EQ',
			paperSize: 'long',
			html: '<!doctype html><html><body>1601EQ</body></html>',
			suggestedFilename: '1601EQ-long.pdf',
			outputPath: '/Users/ogie/Desktop/1601EQ-long.pdf'
		}
		const calls: unknown[] = []
		const exportPdf = createPdfExportClient(async (...args) => {
			calls.push(args)

			return {
				status: 'exported',
				paperSize: 'long',
				path: '/tmp/1601EQ-long.pdf',
				message: 'PDF exported.'
			}
		})

		const receipt = await exportPdf(request)

		expect(calls).toEqual([['export_form_pdf', { request }]])
		expect(receipt.path).toBe('/tmp/1601EQ-long.pdf')
		expect(receipt.paperSize).toBe('long')
	})

	test('formats structured export errors with the log path', () => {
		expect(
			formatPdfExportError({
				message: 'PDF renderer exited with code 1.',
				logPath: '/tmp/ebirforms/pdf-export.log'
			})
		).toBe('PDF renderer exited with code 1. Log: /tmp/ebirforms/pdf-export.log')
	})
})
