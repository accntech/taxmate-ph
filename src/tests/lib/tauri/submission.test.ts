import { describe, expect, test } from 'vitest'

import {
	createSubmissionClient,
	createSubmissionLogClient,
	formatSubmissionLog,
	formatSubmissionError,
	type SubmissionRequest
} from '$lib/tauri/submission'

describe('formatSubmissionLog', () => {
	test('shows each legacy entry with a readable datetime and timezone', () => {
		expect(formatSubmissionLog('ts=1794491040 native_sftp_complete\nts=1794491050 done\n', 'Asia/Manila')).toBe(
			'[2026-11-12 21:44:00 GMT+8] native_sftp_complete\n[2026-11-12 21:44:10 GMT+8] done\n'
		)
	})

	test('preserves new datetime entries, untimestamped text, and invalid dates', () => {
		const content = '[2026-11-12T21:44:00+08:00] done\ncontinued details\nts=9999999999999999999999 invalid\n'
		expect(formatSubmissionLog(content, 'UTC')).toBe(content)
	})
})

describe('createSubmissionLogClient', () => {
	test('reads the fixed submission log through Tauri without a caller-supplied path', async () => {
		const calls: unknown[] = []
		const expected = {
			path: '/app/logfile/submission.log',
			content: 'ts=1 native_sftp_complete\n',
			truncated: false
		}
		const readLog = createSubmissionLogClient(async (...args) => {
			calls.push(args)
			return expected
		})
		expect(await readLog()).toEqual(expected)
		expect(calls).toEqual([['read_submission_log']])
	})
})

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
