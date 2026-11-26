import { expect, test, type Page } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

const path = `/ebirforms/taxpayers/${taxpayerId}/forms/1702EX?new=true`;

async function setLayoutWidth(page: Page, width: number) {
	await page.setViewportSize({ width, height: 950 });
	if (width > 390) return;
	const sidebar = page.locator('aside.sidebar');
	if (await sidebar.getAttribute('data-mobile-open') === 'true') {
		await page.getByRole('button', { name: 'Toggle sidebar', exact: true }).click();
	}
	await page.keyboard.press('Escape');
	await expect(sidebar).not.toHaveAttribute('data-mobile-open', 'true');
	await expect.poll(async () => (await sidebar.boundingBox())!.x).toBeLessThan(-245);
}

test.beforeEach(async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
	await page.setViewportSize({ width: 1280, height: 950 });
	await page.goto(path);
	await expect(page.getByRole('heading', { level: 1, name: /Annual Income Tax Return/ })).toBeVisible({ timeout: 30000 });
});

test('June 2013 Form 1702EX page one shows every source item and pairs related filing controls', async ({ page }) => {
	const filing = page.getByRole('region', { name: 'Filing information', exact: true });
	const background = page.getByRole('region', { name: /Part I - Background Information/ });
	await expect(background.locator('[data-corporate-item] > .paper-item-number')).toHaveText(
		Array.from({ length: 14 }, (_, index) => String(index + 6))
	);
	await expect(background.locator('[data-corporate-item="15"]')).toContainText('Itemized deductions');
	await expect(background.locator('[data-corporate-item="15"] input')).toHaveCount(0);
	await expect(background.locator('[data-corporate-item="19"] [data-slot="date-input"]')).toHaveCount(2);
	await setLayoutWidth(page, 390);
	const period = filing.locator('[data-corporate-item="2"]');
	const calendar = filing.getByRole('radio', { name: 'Calendar', exact: true });
	const monthControl = period.getByRole('combobox', { name: 'Year-end month', exact: true });
	const yearControl = period.getByRole('textbox', { name: 'Year ended', exact: true });
	await expect(calendar).toBeChecked();
	await expect(monthControl).toBeHidden();
	await expect(yearControl).toBeVisible();
	await filing.getByRole('radio', { name: 'Fiscal', exact: true }).check();
	await expect(monthControl).toBeVisible();
	const month = (await monthControl.boundingBox())!;
	const year = (await yearControl.locator('..').boundingBox())!;
	expect(Math.abs(month.y - year.y)).toBeLessThanOrEqual(1);
	expect(month.x + month.width).toBeLessThan(year.x);
	await calendar.check();
	await expect(monthControl).toBeHidden();
});

test('June 2013 Form 1702EX shows one Item 20 reference and aligns the Item 21 penalty row', async ({ page }, info) => {
	const totals = page.getByRole('region', { name: /^Part II.*Total Tax Payable/ });
	const tax = totals.locator('[data-corporate-item="20"]');
	const penalty = totals.locator('[data-corporate-item="21"]');
	const reference = tax.getByRole('button', { name: 'From Part IV, Item 41', exact: true });
	await expect(reference).toHaveCount(1);
	expect((await tax.innerText()).match(/From Part IV,? Item 41/gi)).toHaveLength(1);
	const number = (await penalty.getByText('21', { exact: true }).boundingBox())!;
	const amount = (await penalty.getByText('Add: Penalty - Compromise', { exact: true }).first().boundingBox())!;
	const input = (await penalty.getByRole('textbox', { name: 'Add: Penalty - Compromise' }).boundingBox())!;
	expect(Math.abs(number.y + number.height / 2 - amount.y - amount.height / 2)).toBeLessThan(3);
	expect(Math.abs(number.y + number.height / 2 - input.y - input.height / 2)).toBeLessThan(3);
	await totals.screenshot({ path: info.outputPath('tax-summary-1280.png') });
	await reference.click();
	await expect(page.locator('[id="frm1702EX:txtPg2Pt4I41TotalIncome"]')).toBeFocused();
});

test('June 2013 Form 1702EX keeps Item 22 on the plain surface', async ({ page }) => {
	const transparent = 'rgba(0, 0, 0, 0)';
	const total = page.getByRole('region', { name: /^Part II.*Total Tax Payable/ }).locator('[data-corporate-item="22"]');
	await expect(total).toHaveCSS('background-color', transparent);
});

test('June 2013 Form 1702EX rules reach both sides of the form', async ({ page }, info) => {
	const totals = page.getByRole('region', { name: /^Part II.*Total Tax Payable/ });
	const penalty = totals.locator('[data-corporate-item="21"]');
	const total = totals.locator('[data-corporate-item="22"]');
	const identification = page.getByRole('region', { name: 'Filing identification', exact: true });
	for (const width of [1280, 390]) {
		await setLayoutWidth(page, width);
		const totalsBox = (await totals.boundingBox())!;
		const ruleBox = (await penalty.boundingBox())!;
		const totalBox = (await total.boundingBox())!;
		const identityBox = (await identification.boundingBox())!;
		const place = (await identification.locator('[data-corporate-item="25"]').boundingBox())!;
		const amount = (await identification.locator('[data-corporate-item="26"]').boundingBox())!;
		expect(Math.abs(ruleBox.x - totalsBox.x)).toBeLessThan(2);
		expect(Math.abs(ruleBox.x + ruleBox.width - totalsBox.x - totalsBox.width)).toBeLessThan(2);
		expect(totalBox.x).toBeCloseTo(ruleBox.x, 1);
		expect(totalBox.width).toBeCloseTo(ruleBox.width, 1);
		await expect(total).toHaveCSS('border-block-start-width', '1px');
		const ruleColor = await penalty.evaluate(row => getComputedStyle(row).borderBlockStartColor);
		await expect(total).toHaveCSS('border-block-start-color', ruleColor);
		expect(Math.abs(place.x - identityBox.x)).toBeLessThan(2);
		expect(Math.abs(amount.x + amount.width - identityBox.x - identityBox.width)).toBeLessThan(2);
		if (width === 1280) expect(Math.abs(place.x + place.width - amount.x)).toBeLessThan(1);
		await totals.screenshot({ path: info.outputPath(`tax-summary-single-rule-${width}.png`), animations: 'disabled' });
	}
});

test('June 2013 Form 1702EX goes directly from tax payable to filing identification', async ({ page }, info) => {
	const editor = page.locator('.corporate-editor');
	const totals = editor.getByRole('region', { name: /^Part II.*Total Tax Payable/ });
	const identification = editor.getByRole('region', { name: 'Filing identification', exact: true });
	for (const width of [1280, 390]) {
		await setLayoutWidth(page, width);
		await expect(editor.getByRole('region', { name: 'Signatories', exact: true })).toHaveCount(0);
		await expect(editor.getByText('Number of pages filed', { exact: true })).toHaveCount(0);
		await expect(totals.locator('xpath=following-sibling::section[1]')).toHaveAttribute('aria-label', 'Filing identification');
		await expect(identification).toBeVisible();
		await page.screenshot({ path: info.outputPath(`1702ex-page-1-${width}.png`), fullPage: true, animations: 'disabled' });
	}
});

test('June 2013 Form 1702EX orders the four numbered filing identification fields', async ({ page }, info) => {
	const identification = page.getByRole('region', { name: 'Filing identification', exact: true });
	await expect(identification.locator('[data-corporate-item] > .paper-item-number')).toHaveText(['23', '24', '25', '26']);
	const type = identification.getByRole('radiogroup', { name: 'Identification type' });
	await expect(type).toHaveAttribute('aria-required', 'true');
	await expect(identification.locator('[data-corporate-item="24"] label')).toHaveText(/^Date of issue\s*\*$/);
	await expect(identification.getByRole('textbox', { name: 'Place of issue', exact: true })).toHaveAttribute('required', '');
	await type.getByRole('radio', { name: 'Community tax certificate' }).check();
	const number = identification.getByRole('textbox', { name: 'CTC number', exact: true });
	const amount = identification.getByRole('textbox', { name: 'CTC amount', exact: true });
	await expect(number).toHaveAttribute('maxlength', '8');
	await expect(number).toHaveAttribute('inputmode', 'numeric');
	await expect(type.getByRole('radio', { name: 'Community tax certificate' })).toBeChecked();
	await type.getByRole('radio', { name: 'SEC registration' }).check();
	await expect(identification.getByRole('textbox', { name: 'SEC registration number', exact: true })).toHaveAttribute('maxlength', '10');
	await expect(amount).toBeDisabled();
	for (const width of [1280, 390]) {
		await setLayoutWidth(page, width);
		const [typeBox, dateBox, placeBox, amountBox] = await Promise.all(['23', '24', '25', '26'].map(item =>
			identification.locator(`[data-corporate-item="${item}"]`).boundingBox()));
		if (width === 1280) {
			expect(typeBox!.y).toBe(dateBox!.y);
			expect(placeBox!.y).toBe(amountBox!.y);
			expect(typeBox!.x).toBe(placeBox!.x);
			expect(dateBox!.x).toBe(amountBox!.x);
			const totals = page.getByRole('region', { name: /^Part II.*Total Tax Payable/ });
			const penalty = (await totals.locator('[data-corporate-item="21"] [data-slot="currency-input"]').boundingBox())!;
			const certificate = (await identification.locator('[data-corporate-item="26"] [data-slot="currency-input"]').boundingBox())!;
			expect(Math.abs(penalty.x - certificate.x)).toBeLessThan(2);
			expect(Math.abs(penalty.width - certificate.width)).toBeLessThan(2);
		} else {
			expect(typeBox!.y).toBeLessThan(dateBox!.y);
			expect(dateBox!.y).toBeLessThan(placeBox!.y);
			expect(placeBox!.y).toBeLessThan(amountBox!.y);
		}
		await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
		await identification.screenshot({ path: info.outputPath(`filing-identification-${width}.png`) });
	}
});

test('June 2013 Form 1702EX saves the accreditation number and dates in their original fields', async ({ page, context }, info) => {
	await goToReturnPage(page, 2);
	const section = page.getByRole('region', { name: /Part VI - Information/ });
	const row = section.locator('[data-corporate-item="49"]');
	const number = row.getByRole('textbox', { name: 'BIR accreditation number', exact: true });
	const issueDate = section.locator('[data-corporate-item="50"]').getByRole('group', { name: 'Accreditation issue date', exact: true });
	const expiryDate = section.locator('[data-corporate-item="51"]').getByRole('group', { name: 'Accreditation expiry date', exact: true });
	await expect(number).toBeVisible({ timeout: 3000 });
	await expect(row.getByRole('textbox')).toHaveCount(1);
	await expect(number).toHaveValue('');
	await number.pressSequentially('010');
	await expect(number).toBeFocused();
	await expect(number).toHaveValue('01-0');
	await number.pressSequentially('002340070026');
	await expect(number).toHaveValue('01-000234-007-0026');
	await number.clear();
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	await page.evaluate(() => navigator.clipboard.writeText('010002340070026'));
	await number.selectText();
	await number.press('ControlOrMeta+v');
	await expect(number).toBeFocused();
	await expect(number).toHaveValue('01-000234-007-0026');
	await number.evaluate(input => (input as HTMLInputElement).setSelectionRange(3, 3));
	await number.press('Backspace');
	await expect(number).toHaveValue('01-000234-007-0026');
	expect(await number.evaluate(input => (input as HTMLInputElement).selectionStart)).toBe(2);
	await number.evaluate(input => (input as HTMLInputElement).setSelectionRange(3, 9));
	await number.press('Backspace');
	await expect(number).toHaveValue('01--007-0026');
	await number.blur();
	const dates = [
		{ control: issueDate, parts: ['01', '15', '2024'] },
		{ control: expiryDate, parts: ['01', '15', '2027'] }
	];
	for (const { control, parts: [month, day, year] } of dates) {
		await control.getByRole('spinbutton', { name: 'Year', exact: true }).fill(year);
		await control.getByRole('spinbutton', { name: 'Month', exact: true }).fill(month);
		const dayInput = control.getByRole('spinbutton', { name: 'Day', exact: true });
		await dayInput.fill(day);
		await dayInput.blur();
	}

	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	const edit = page.getByRole('link', { name: 'Edit', exact: true });
	await expect(edit).toBeVisible();
	const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns[0].values);
	await edit.click();
	await goToReturnPage(page, 2);
	const expected = ['01', '', '007', '0026'];
	await expect(number).toHaveValue('01--007-0026');
	for (const [index, value] of expected.entries()) {
		expect(saved[`frm1702EX:txtPg2Pt6I49BIRAccreditedNoC${index + 1}`] ?? '').toBe(value);
	}
	for (const { control, parts: [month, day, year] } of dates) {
		await expect(control.getByRole('spinbutton', { name: 'Month', exact: true })).toHaveValue(month);
		await expect(control.getByRole('spinbutton', { name: 'Day', exact: true })).toHaveValue(day);
		await expect(control.getByRole('spinbutton', { name: 'Year', exact: true })).toHaveValue(year);
	}

	const report = await page.evaluate(async (values) => {
		const forms = '/src/lib/forms/index.ts';
		const printing = '/src/lib/printing/return-report.ts';
		const { getFormDefinition } = await import(forms);
		const { buildReturnReport } = await import(printing);
		return buildReturnReport(getFormDefinition('1702EX'), values, 'Draft', 'a4');
	}, saved);
	const print = await context.newPage();
	await print.setContent(report);
	for (const [index, value] of [...expected, ...dates.flatMap(({ parts }) => parts)].entries()) {
		await expect(print.locator(`#Part6I${12 + index}`)).toHaveText(value);
	}
	await print.emulateMedia({ media: 'print' });
	await print.pdf({ path: info.outputPath('1702ex-accreditation.pdf'), preferCSSPageSize: true, printBackground: true });
});

test('June 2013 Form 1702EX shows the source captions for Schedule 8', async ({ page }, info) => {
	await goToReturnPage(page, 6);
	const stockholders = page.getByRole('checkbox', { name: 'Stockholders', exact: true });
	const partners = page.getByRole('checkbox', { name: 'Partners', exact: true });
	const members = page.getByRole('checkbox', { name: 'Members Information', exact: true });
	await expect(stockholders).toBeVisible({ timeout: 3000 });
	await expect(partners).toBeVisible();
	await expect(members).toBeVisible();
	await members.check();
	await expect(members).toBeChecked();
	await members.uncheck();
	await expect(members).not.toBeChecked();
	const row = page.locator('.corporate-row').filter({ has: stockholders });
	for (const width of [1280, 390]) {
		await setLayoutWidth(page, width);
		await row.screenshot({ path: info.outputPath(`1702ex-schedule-8-${width}.png`), animations: 'disabled' });
	}
});
