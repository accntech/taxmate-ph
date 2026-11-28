import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

const formsPath = `/ebirforms/taxpayers/${taxpayerId}/forms`;

test('finds a return using the form number printed on it', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(formsPath);
	await page.getByRole('button', { name: 'Create return', exact: true }).click();
	const search = page.getByRole('combobox', { name: 'Search BIR forms' });
	await search.fill('1601-EQ');
	await expect(page.getByRole('option', { name: /^BIR Form 1601EQ / })).toBeVisible();
	await search.press('Enter');
	await expect(page.getByRole('heading', { name: /^Quarterly Remittance Return/ })).toBeVisible();
});

test('a fresh return explains how to save and a saved return identifies new edits', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {}, []);
	await page.goto(`${formsPath}/1601EQ?new=true`);
	const editor = page.getByRole('region', { name: 'BIR Form 1601EQ workspace' });
	const save = editor.getByRole('button', { name: 'Save draft', exact: true });
	await expect(save).toBeVisible();
	await expect(editor.getByText('New draft', { exact: true })).toBeVisible();
	await expect(editor.getByText('Unsaved changes', { exact: true })).toHaveCount(0);
	await expect(editor.getByRole('status').filter({ hasText: 'Save draft to keep this return on this device.' })).toBeVisible();
	await save.click();
	await page.getByRole('link', { name: /^Edit BIR Form / }).click();
	await expect(editor.getByText('Draft', { exact: true })).toBeVisible();
	await editor.getByRole('textbox', { name: 'Year', exact: true }).fill('2024');
	await expect(editor.getByText('Unsaved changes', { exact: true })).toBeVisible();
});

test('the form revision is legible alongside the return number', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(`${formsPath}/1702MXv2018C?new=true`);
	const revision = page.locator('.paper-form-header').getByText('January 2018 · CREATE', { exact: true });
	await expect(revision).toBeVisible({ timeout: 15_000 });
	const size = await revision.evaluate(node => parseFloat(getComputedStyle(node).fontSize));
	expect(size).toBeGreaterThanOrEqual(13);
});

for (const { code, bank, reference, row } of [
	{ code: '1604C', bank: true, reference: true, row: 'January' },
	{ code: '1604CF', bank: true, reference: false, row: 'January' },
	{ code: '1604E', bank: true, reference: false, row: 'January' },
	{ code: '1604Ev2018', bank: true, reference: true, row: 'Quarter 1' },
	{ code: '1604F', bank: false, reference: true, row: 'Quarter 1' }
]) {
	test(`${code} shows required remittance details up front and keeps the line after reopen`, async ({ page }) => {
		await seedWorkspace(page, 'light', 'loaded', {}, []);
		await page.goto(`${formsPath}/${code}?new=true`);
		const editor = page.getByRole('region', { name: `BIR Form ${code} workspace` });
		const firstSchedule = editor.locator('.wh-schedule').first();
		await firstSchedule.locator('summary').click();
		await firstSchedule.getByRole('button', { name: /Add line item to Schedule 1/ }).click();
		const dialog = page.getByRole('dialog', { name: 'New line item', exact: true });
		await expect(dialog.getByRole('combobox', { name: 'Schedule row' })).toContainText(row);
		await expect(dialog.locator('label').filter({ hasText: 'Date remitted' })).toHaveText(/Date remitted\s*\*/);
		const bankInput = dialog.getByRole('textbox', { name: 'Bank / agency', exact: true });
		const referenceInput = dialog.getByRole('textbox', { name: 'TRA / receipt / reference', exact: true });
		const amount = dialog.getByRole('textbox', { name: 'Tax withheld', exact: true });
		if (bank) {
			await expect(bankInput).toHaveAttribute('required', '');
			await bankInput.fill('Example Bank');
		}
		if (reference) {
			await expect(referenceInput).toHaveAttribute('required', '');
			await referenceInput.fill('SYNTHETIC-001');
		}
		if (code === '1604Ev2018') await expect(amount).toHaveAttribute('required', '');
		await dialog.getByRole('spinbutton', { name: 'Year', exact: true }).fill('2025');
		await dialog.getByRole('spinbutton', { name: 'Month', exact: true }).fill('01');
		await dialog.getByRole('spinbutton', { name: 'Day', exact: true }).fill('15');
		await amount.fill('2300.25');
		await dialog.getByRole('button', { name: 'Add', exact: true }).click();
		await expect(dialog).toBeHidden();
		await firstSchedule.getByRole('button', { name: 'Edit line item 1', exact: true }).waitFor();
		await editor.getByRole('button', { name: 'Save draft', exact: true }).click();
		await page.getByRole('link', { name: /^Edit BIR Form / }).click();
		await expect(firstSchedule).toContainText('2,300.25');
	});
}
