import { describe, expect, test } from 'vitest'

import { createSubmissionClient, formatSubmissionError, type SubmissionRequest } from './submission'

describe('createSubmissionClient', () => {
	test('invokes the Tauri submit_return command with a typed request envelope', async () => {
		const request: SubmissionRequest = {
			xml: '<div>txtFinalFlag=0txtFinalFlag=</div>',
			returnFilename: '1234567890000-1601EQ-2026Q1.xml',
			formCode: '1601EQ',
			tin: '123456789',
			email: 'payer@example.com',
			mode: 'dry_run',
			fetchDispatcher: false
		}
		const calls: unknown[] = []
		const submit = createSubmissionClient(async (...args) => {
			calls.push(args)

			return {
				status: 'drafted',
				finalFlag: '2',
				savePath: '/tmp/savefile/return.xml',
				sendPath: '/tmp/IAF_RDO_Copy/return#payer@example.com#.xml',
				message: 'ok'
			}
		})

		const receipt = await submit(request)

		expect(calls).toEqual([['submit_return', { request }]])
		expect(receipt.status).toBe('drafted')
		expect(receipt.finalFlag).toBe('2')
	})

	test('formats structured Tauri submission errors with the log path', () => {
		expect(
			formatSubmissionError({
				message: 'Legacy encryption helper could not be started.',
				logPath: '/tmp/ebirforms/logfile/submission.log'
			})
		).toBe(
			'Legacy encryption helper could not be started. Log: /tmp/ebirforms/logfile/submission.log'
		)
	})
})
