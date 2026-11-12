import { expect, test, type Page } from '@playwright/test';
import { seedWorkspace } from './fixtures';

test.use({ timezoneId: 'Asia/Manila' });

async function seedLog(page: Page, state: 'loaded' | 'empty' | 'error' | 'loading', theme = 'light') {
	await seedWorkspace(page, theme);
	await page.addInitScript(({ state }) => {
		Object.assign(window, { isTauri: true });
		const bridge = (window as unknown as { __TAURI_INTERNALS__: { invoke: (command: string, args?: unknown) => Promise<unknown> } }).__TAURI_INTERNALS__;
		const invoke = bridge.invoke;
		let reads = 0;
		bridge.invoke = async (command, args) => {
			if (command !== 'read_submission_log') return invoke(command, args);
			reads += 1;
			if (state === 'loading') return new Promise(() => {});
			if (state === 'error' && reads === 1) throw 'Permission denied';
			return {
				path: '/Application Support/TaxMate PH/logfile/submission.log',
				content: state === 'empty' ? '' : `ts=1794491040 native_sftp_complete\nts=1794491040 submission_complete status=submitted final_flag=1\n${reads > 1 ? 'ts=1794491050 refreshed_entry\n' : ''}`,
				truncated: reads > 1
			};
		};
	}, { state });
}

for (const [width, theme] of [[1440, 'light'], [390, 'dark']] as const) {
	test(`submission log can be viewed and refreshed at ${width}px`, async ({ page }, testInfo) => {
		await page.setViewportSize({ width, height: 960 });
		await seedLog(page, 'loaded', theme);
		await page.goto('/settings');
		const view = page.getByRole('button', { name: 'View submission log', exact: true });
		await view.focus();
		await page.keyboard.press('Enter');
		const log = page.getByRole('region', { name: 'Submission log', exact: true });
		await expect(log.getByRole('textbox', { name: 'Log entries' })).toHaveValue(/native_sftp_complete/);
		await expect(log.getByRole('textbox', { name: 'Log entries' })).toHaveValue(/^\[2026-11-12 21:44:00 GMT\+8\] native_sftp_complete/);
		await expect(log).toContainText('/Application Support/TaxMate PH/logfile/submission.log');
		await expect(log).toContainText('Upload success does not confirm BIR receipt or acceptance.');
		await log.getByRole('button', { name: 'Refresh log', exact: true }).click();
		await expect(log.getByRole('textbox', { name: 'Log entries' })).toHaveValue(/refreshed_entry/);
		await expect(log).toContainText('Showing the latest 128 KiB');
		await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
		await log.getByRole('button', { name: 'Copy log', exact: true }).click();
		await expect(log.getByRole('button', { name: 'Copy log', exact: true })).toHaveText('Copied');
		expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(await log.getByRole('textbox', { name: 'Log entries' }).inputValue());
		await log.scrollIntoViewIfNeeded();
		await page.screenshot({ path: testInfo.outputPath('submission-log.png'), fullPage: true });
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
		await page.getByRole('button', { name: 'Hide submission log', exact: true }).click();
		await expect(log).toHaveCount(0);
		await page.reload();
		await page.getByRole('button', { name: 'View submission log', exact: true }).click();
		await expect(log.getByRole('textbox', { name: 'Log entries' })).toHaveValue(/native_sftp_complete/);
	});
}

test('missing submission log shows an empty state', async ({ page }) => {
	await seedLog(page, 'empty');
	await page.goto('/settings');
	await page.getByRole('button', { name: 'View submission log', exact: true }).click();
	await expect(page.getByRole('region', { name: 'Submission log', exact: true })).toContainText('No submission log entries yet.');
});

test('clipboard failure leaves the log available to select and copy manually', async ({ page }) => {
	await seedLog(page, 'loaded');
	await page.addInitScript(() => {
		Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Clipboard blocked'); } } });
	});
	await page.goto('/settings');
	await page.getByRole('button', { name: 'View submission log', exact: true }).click();
	await page.getByRole('button', { name: 'Copy log', exact: true }).click();
	await expect(page.getByRole('alert')).toHaveText('Could not copy the log. Select the text and copy it manually.');
	await expect(page.getByRole('textbox', { name: 'Log entries' })).toHaveValue(/native_sftp_complete/);
});

test('submission log read failures can be retried', async ({ page }) => {
	await seedLog(page, 'error');
	await page.goto('/settings');
	await page.getByRole('button', { name: 'View submission log', exact: true }).click();
	await expect(page.getByRole('alert')).toContainText('Permission denied');
	await page.getByRole('button', { name: 'Refresh log', exact: true }).click();
	await expect(page.getByRole('alert')).toHaveCount(0);
	await expect(page.getByRole('textbox', { name: 'Log entries' })).toHaveValue(/native_sftp_complete/);
});

test('submission log announces loading and prevents overlapping reads', async ({ page }) => {
	await seedLog(page, 'loading');
	await page.goto('/settings');
	await page.getByRole('button', { name: 'View submission log', exact: true }).click();
	const log = page.getByRole('region', { name: 'Submission log', exact: true });
	await expect(log.getByRole('status')).toHaveText('Loading submission log…');
	await expect(log.getByRole('button', { name: 'Refresh log', exact: true })).toBeDisabled();
});
