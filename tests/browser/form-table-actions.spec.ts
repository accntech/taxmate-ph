import { expect, test, type Page } from '@playwright/test';
import { formPath, seedWorkspace, taxpayerId } from './fixtures';
const tablePath = `/ebirforms/taxpayers/${taxpayerId}/forms`;
async function menu(page: Page) {
	await page.getByRole('button', { name: /^More actions for BIR Form 1601EQ,/ }).click();
}

test('table owns all six actions and editor saves back to the table', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(tablePath);
	await expect(page.getByRole('link', { name: 'Edit', exact: true })).toBeVisible();
	await menu(page);
	for (const name of ['Archive', 'Delete…', 'Mark as final', 'Submit', 'Generate PDF']) {
		await expect(page.getByRole('menuitem', { name, exact: true })).toBeVisible();
	}
	await page.keyboard.press('Escape');
	await page.getByRole('link', { name: 'Edit', exact: true }).click();
	await expect(page).toHaveURL(formPath);
	for (const name of ['Mark as final', 'Submit to BIR', 'Print to PDF']) {
		await expect(page.getByRole('button', { name, exact: true })).toHaveCount(0);
	}
	await page.getByRole('textbox', { name: 'Year', exact: true }).fill('2025');
	await page.getByRole('button', { name: 'Save', exact: true }).click();
	await expect(page).toHaveURL(tablePath);
	await expect(page.getByRole('cell', { name: '2025Q2', exact: true })).toBeVisible();
	await page.getByRole('link', { name: 'Edit', exact: true }).click();
	await page.getByRole('textbox', { name: 'Year', exact: true }).fill('2024');
	await page.getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(page).toHaveURL(tablePath);
	await expect(page.getByRole('cell', { name: '2025Q2', exact: true })).toBeVisible();
	await page.getByRole('link', { name: 'Edit', exact: true }).click();
	await page.getByRole('textbox', { name: 'Year', exact: true }).fill('2023');
	await page.getByRole('link', { name: '← Back to forms', exact: true }).click();
	await page.getByRole('link', { name: 'Edit', exact: true }).click();
	await expect(page.getByRole('textbox', { name: 'Year', exact: true })).toHaveValue('2025');
});

test('archive is reversible and delete requires confirmation from the table', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(tablePath);
	await menu(page);
	await page.getByRole('menuitem', { name: 'Archive', exact: true }).click();
	await expect(page.getByRole('link', { name: 'Edit', exact: true })).toHaveCount(0);
	expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns[0].archived)).toBe(true);
	await page.getByRole('button', { name: 'Undo archive', exact: true }).click();
	await menu(page);
	await page.getByRole('menuitem', { name: 'Delete…', exact: true }).click();
	await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(page.getByRole('link', { name: 'Edit', exact: true })).toBeVisible();
	await menu(page);
	await page.getByRole('menuitem', { name: 'Delete…', exact: true }).click();
	await page.getByRole('dialog').getByRole('button', { name: 'Delete form', exact: true }).click();
	await expect(page.getByRole('link', { name: 'Edit', exact: true })).toHaveCount(0);
	expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns)).toEqual([]);
});

test('mark final and submit update the selected table row without entering the editor', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(tablePath);
	await page.evaluate(() => {
		const native = (window as any).__TAURI_INTERNALS__;
		const previous = native.invoke;
		native.invoke = async (command: string, args: any) => {
			if (command === 'submit_return') {
				(window as any).submittedRequest = args.request;
				return { status: 'submitted', finalFlag: '1', savePath: '', sendPath: '', message: 'Return submitted.' };
			}
			return previous(command, args);
		};
	});
	await menu(page);
	await page.getByRole('menuitem', { name: 'Mark as final', exact: true }).click();
	await expect(page.getByRole('cell', { name: 'Final', exact: true })).toBeVisible();
	await expect(page).toHaveURL(tablePath);
	await menu(page);
	await page.getByRole('menuitem', { name: 'Submit', exact: true }).click();
	await expect(page.getByRole('cell', { name: 'Submitted', exact: true })).toBeVisible();
	await expect(page).toHaveURL(tablePath);
	expect(await page.evaluate(() => (window as any).submittedRequest.mode)).toBe('legacy_sftp');
});

test('invalid finalization stays in table with a link to fix the selected form', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(formPath);
	// Existing/imported working copies can still contain incomplete fields.
	await page.evaluate(() => {
		const key = 'ebirforms-created-returns-v1';
		const stored = JSON.parse(localStorage.getItem(key)!);
		stored.returns[0].values['frm1601EQ:txtYear'] = '';
		localStorage.setItem(key, JSON.stringify(stored));
	});
	await page.getByRole('link', { name: '← Back to forms', exact: true }).click();
	await expect(page).toHaveURL(tablePath);
	await menu(page);
	await page.getByRole('menuitem', { name: 'Mark as final', exact: true }).click();
	await expect(page.getByRole('alert')).toContainText('Year');
	await expect(page.getByRole('link', { name: 'Edit return to fix errors', exact: true })).toBeVisible();
	await expect(page.getByRole('cell', { name: 'Draft', exact: true })).toBeVisible();
});

for (const theme of ['light', 'dark']) {
	for (const width of [1440, 390]) {
		test(`form row menu is usable at ${width}px in ${theme}`, async ({ page }, testInfo) => {
			await page.setViewportSize({ width, height: 960 });
			await seedWorkspace(page, theme);
			await page.goto(tablePath);
			const trigger = page.getByRole('button', { name: /^More actions for BIR Form/ });
			await trigger.focus();
			await trigger.press('ArrowDown');
			await expect(page.getByRole('menuitem', { name: 'Archive', exact: true })).toBeFocused();
			for (const name of ['Mark as final', 'Submit', 'Generate PDF', 'Delete…']) {
				await expect(page.getByRole('menuitem', { name, exact: true })).toBeInViewport();
			}
			await page.screenshot({ path: testInfo.outputPath(`form-menu-${theme}-${width}.png`), fullPage: true, animations: 'disabled' });
			expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
			await page.keyboard.press('Escape');
			await expect(trigger).toBeFocused();
		});
	}
}

test('row action targets the selected return rather than the previously edited one', async ({ page }) => {
	await seedWorkspace(page);
	await page.addInitScript(() => {
		const data = JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!);
		data.returns.push({ ...data.returns[0], id: 'second-return', returnPeriod: '2026Q3',
			values: { ...data.returns[0].values, 'frm1601EQ:optQuarter': 'Q3' } });
		localStorage.setItem('ebirforms-created-returns-v1', JSON.stringify(data));
	});
	await page.goto(formPath);
	await page.getByRole('link', { name: '← Back to forms', exact: true }).click();
	await page.getByRole('button', { name: 'More actions for BIR Form 1601EQ, 2026Q3', exact: true }).click();
	await page.getByRole('menuitem', { name: 'Mark as final', exact: true }).click();
	const returns = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns);
	expect(returns.find((record: any) => record.id === 'second-return').status).toBe('Final');
	expect(returns.find((record: any) => record.id === 'review-return').status).toBe('Draft');
});
