import { expect, test } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';
import { printSavedReturn } from './helpers/return-pdf';

const base = `/ebirforms/taxpayers/${taxpayerId}/forms`;
const id = (name: string) => `frm1702EX:${name}`;

test('1702EX Schedule 3 adds, edits and deletes income in a side drawer', async ({ page }, info) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await seedWorkspace(page, 'dark', 'loaded', { taxpayerClassification: 'N' }, []);
	await page.goto(`${base}/1702EX?new=true`);
	await goToReturnPage(page, 4);

	const income = page.getByRole('list', { name: 'Other taxable income line items' });
	const count = (value: number) => page.getByRole('heading', { name: `Other taxable income (${value}/3)`, exact: true });
	const add = page.getByRole('region', { name: 'Schedule 3 · Other taxable income' })
		.getByRole('button', { name: 'Add item', exact: true });
	const total = page.locator('[id="frm1702EX:txtPg4S3I4TotalTaxIncome"]');
	await expect(count(0)).toBeVisible();
	await expect(income.getByRole('listitem')).toHaveCount(0);
	await expect(page.getByText('No income items added')).toBeVisible();

	const drawer = page.getByRole('dialog');
	const description = drawer.getByRole('textbox', { name: 'Description', exact: true });
	const amount = drawer.getByRole('textbox', { name: 'Amount', exact: true });
	await add.click();
	await drawer.getByRole('button', { name: 'Add item', exact: true }).click();
	await expect(drawer.getByText('Enter a description.', { exact: true })).toBeVisible();
	await drawer.getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(drawer).toBeHidden();
	await expect(count(0)).toBeVisible();
	const rental = 'Rental income from commercial property';
	for (const [name, value] of [['Service income', '1200'], [rental, '400'], ['Other income', '0']]) {
		await add.click();
		await expect(drawer).toHaveAccessibleName('Add income item');
		await expect(description).toBeFocused();
		await description.fill(name);
		await amount.fill(value);
		await drawer.getByRole('button', { name: 'Add item', exact: true }).click();
		await expect(drawer).toBeHidden();
	}
	await expect(count(3)).toBeVisible();
	await expect(add).toBeDisabled();
	await expect(total).toHaveText('1,600');
	await expect(income.getByRole('listitem').filter({ hasText: 'Other income' })).toHaveText(/Other income\s*0/);

	const service = income.getByRole('button', { name: 'Service income', exact: true });
	await service.focus();
	await page.keyboard.press('Enter');
	await expect(drawer).toHaveAccessibleName('Edit income item');
	await expect(description).toHaveValue('Service income');
	await amount.fill('1500');
	await drawer.getByRole('button', { name: 'Update', exact: true }).click();
	await expect(service).toBeFocused();
	await expect(total).toHaveText('1,900');

	for (const [viewport, width] of [['desktop', 1280], ['mobile', 390]] as const) {
		await page.setViewportSize({ width, height: 900 });
		await income.scrollIntoViewIfNeeded();
		const totalRight = await total.evaluate(element => element.getBoundingClientRect().right);
		const amountRight = await income.getByText('1,500', { exact: true })
			.evaluate(element => element.getBoundingClientRect().right);
		expect(Math.abs(totalRight - amountRight)).toBeLessThanOrEqual(1);
		const rentalRow = income.getByRole('listitem').filter({ hasText: rental });
		expect(await rentalRow.evaluate(element => element.scrollWidth - element.clientWidth)).toBe(0);
		if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
			await page.screenshot({ path: info.outputPath(`schedule-3-${viewport}.png`), animations: 'disabled' });
		}
	}

	if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
		await service.click();
		await expect(description).toBeFocused();
		await expect(drawer).toHaveCSS('opacity', '1');
		await page.screenshot({ path: info.outputPath('schedule-3-mobile-drawer.png'), animations: 'disabled' });
		await drawer.getByRole('button', { name: 'Cancel', exact: true }).click();
	}

	await income.getByRole('button', { name: rental, exact: true }).click();
	await drawer.getByRole('button', { name: 'Delete item', exact: true }).click();
	await expect(drawer).toBeHidden();
	await expect(add).toBeFocused();
	await expect(count(2)).toBeVisible();
	await expect(income.getByText(rental)).toHaveCount(0);
	await expect(total).toHaveText('1,500');

	const amortization = page.getByRole('list', { name: 'Amortization line items' });
	await expect(amortization.getByRole('listitem')).toHaveCount(0);
	await page.locator('.line-list').filter({ has: page.getByRole('heading', { name: /^Amortization \(/ }) }).getByRole('button', { name: 'Add item', exact: true }).click();
	await expect(drawer).toHaveAccessibleName('Add item');
	await description.fill('Permit amortization');
	await amount.fill('50');
	await drawer.getByRole('button', { name: 'Add item', exact: true }).click();

	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(base);
	await page.getByRole('link', { name: /^Edit BIR Form / }).click();
	await goToReturnPage(page, 4);
	await expect(count(2)).toBeVisible();
	await expect(service).toBeVisible();
	await expect(amortization.getByText('Permit amortization')).toBeVisible();
	await expect(total).toHaveText('1,500');
});

test('1702EX retains saved continuation entries and calculated totals', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 900 });
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, [{
		id: 'old-exempt', taxpayerId, formCode: '1702EX', returnPeriod: '2025-12',
		status: 'Draft', updatedAt: 1794441600000, finalFlag: '0',
		values: {
			Pg4S3I3PopLength: '2',
			[id('txtPg4S3I3_1Col1')]: 'Existing rental',
			[id('txtPg4S3I3_1Col2')]: '600',
			[id('txtPg4S3I3_2Col1')]: 'Existing fee',
			[id('txtPg4S3I3_2Col2')]: '400',
		},
	}]);
	await page.goto(`${base}/1702EX?return=old-exempt`);
	await goToReturnPage(page, 4);
	const income = page.getByRole('list', { name: 'Other taxable income line items' });
	await expect(income.getByRole('listitem')).toHaveCount(2);
	await expect(income.getByText('Existing rental', { exact: true })).toBeVisible();
	await expect(page.locator('[id="frm1702EX:txtPg4S3I4TotalTaxIncome"]')).toHaveText('1,000');
	const edit = income.getByRole('button', { name: 'Existing fee', exact: true });
	await edit.click();
	const dialog = page.getByRole('dialog', { name: 'Edit income item' });
	await dialog.getByRole('textbox', { name: 'Amount', exact: true }).fill('450');
	await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(page.locator('[id="frm1702EX:txtPg4S3I4TotalTaxIncome"]')).toHaveText('1,000');
	await edit.click();
	await dialog.getByRole('textbox', { name: 'Amount', exact: true }).fill('450');
	await dialog.getByRole('button', { name: 'Update', exact: true }).click();
	await expect(page.locator('[id="frm1702EX:txtPg4S3I4TotalTaxIncome"]')).toHaveText('1,050');
	await expect(income.getByRole('listitem')).toHaveCount(2);
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(base);
	const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns[0].values);
	expect(saved).toMatchObject({
		Pg4S3I3PopLength: '2',
		[id('txtPg4S3I3_1Col2')]: '600',
		[id('txtPg4S3I3_2Col2')]: '450',
	});

	await page.getByRole('link', { name: /^Edit BIR Form / }).click();
	await goToReturnPage(page, 4);
	for (const name of ['Existing rental', 'Existing fee']) {
		await income.getByRole('button', { name, exact: true }).click();
		await dialog.getByRole('button', { name: 'Delete item', exact: true }).click();
		await expect(dialog).toBeHidden();
	}
	await expect(page.getByRole('heading', { name: 'Other taxable income (0/3)', exact: true })).toBeVisible();
	await expect(page.locator('[id="frm1702EX:txtPg4S3I4TotalTaxIncome"]')).toHaveText('0');
	const addItem = page.getByRole('region', { name: 'Schedule 3 · Other taxable income' })
		.getByRole('button', { name: 'Add item', exact: true });
	for (const name of ['New income one', 'New income two', 'New income three']) {
		await addItem.click();
		const add = page.getByRole('dialog', { name: 'Add income item' });
		await add.getByRole('textbox', { name: 'Description', exact: true }).fill(name);
		await add.getByRole('textbox', { name: 'Amount', exact: true }).fill('100');
		await add.getByRole('button', { name: 'Add item', exact: true }).click();
		await expect(add).toBeHidden();
	}
	await expect(income.getByRole('button', { name: 'New income three', exact: true })).toBeVisible();
	await expect(page.locator('[id="frm1702EX:txtPg4S3I4TotalTaxIncome"]')).toHaveText('300');
});

test('reopens the corporate schedule drawer after dismissing it with Close', async ({ page }) => {
	await page.setViewportSize({ width: 800, height: 700 });
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
	await page.goto(`${base}/1702EX?new=true`);
	await goToReturnPage(page, 4);

	const edit = page.getByRole('region', { name: 'Schedule 3 · Other taxable income' })
		.getByRole('button', { name: 'Add item', exact: true });
	const drawer = page.getByRole('dialog', { name: 'Add income item' });
	const description = drawer.getByRole('textbox', { name: 'Description', exact: true });
	await edit.click();
	await expect(description).toBeFocused();
	await description.fill('Unsaved description');
	await drawer.getByRole('button', { name: 'Close', exact: true }).click();
	await expect(drawer).toBeHidden();
	await expect(edit).toBeFocused();

	await edit.click();
	await expect(description).toBeFocused();
	await expect(description).toHaveValue('');
});

for (const code of ['1702EXv2018', '1702EXv2018C']) test(`${code} displays the item 17 deduction labels without repeated letters`, async ({ page }, info) => {
	await seedWorkspace(page, 'dark', 'loaded', { taxpayerClassification: 'N' }, []);
	await page.goto(`${base}/${code}?new=true`);
	await goToReturnPage(page, 3);

	for (const [viewport, width] of [['desktop', 1280], ['mobile', 390]] as const) {
		await page.setViewportSize({ width, height: 900 });
		for (const [item, label] of [
			['17A', 'Janitorial and Messengerial Services'],
			['17B', 'Professional Fees'],
			['17C', 'Security Services']
		]) {
			const row = page.locator(`[data-corporate-item="${item}"]`);
			await expect(row.locator('.paper-item-number')).toHaveText(item);
			await expect(row.locator('.amount-caption')).toHaveText(label);
			await expect(row.getByRole('textbox', { name: label, exact: true })).toBeVisible();
		}
		if (code === '1702EXv2018' && process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
			await page.locator('[data-corporate-item="17B"]').evaluate(element => element.scrollIntoView({ block: 'center' }));
			await page.screenshot({ path: info.outputPath(`deduction-labels-${viewport}.png`), animations: 'disabled' });
		}
	}
});

for (const code of ['1702EXv2018', '1702EXv2018C']) test(`${code} adds each custom item 17 deduction separately`, async ({ page }, info) => {
	await page.routeWebSocket('**/*', socket => socket.close());
	await page.setViewportSize({ width: 1280, height: 900 });
	await seedWorkspace(page, 'dark', 'loaded', { taxpayerClassification: 'N' }, [{
		id: 'item-17-draft', taxpayerId, formCode: code, returnPeriod: '2025-12',
		status: 'Draft', updatedAt: 1794441600000, finalFlag: '0',
		values: {
			[id('rdoPg1Pt1I13MethodOfDeduc')]: 'I',
			[id('txtPg3Pt6S1I17bProfessionalFee')]: '250',
			[id('txtPg3Pt6I17OthersIDesc')]: 'Saved expense',
			[id('txtPg3Pt6I17OthersIAmt')]: '25',
		},
	}]);
	await page.goto(`${base}/${code}?return=item-17-draft`);
	await goToReturnPage(page, 3);

	const title = 'Other ordinary allowable deductions';
	const heading = page.getByRole('heading', { name: new RegExp(`^${title} `) });
	const group = page.locator('.line-list').filter({ has: heading });
	const list = group.getByRole('list', { name: `${title} line items` });
	const add = group.getByRole('button', { name: 'Add item', exact: true });
	const drawer = page.getByRole('dialog');
	const total = page.locator('[id="frm1702EX:txtPg3Pt6S1I18TotOrdinaryAllowableItemDeduc"]');
	await expect(heading).toHaveText(`${title} (1/6)`);
	await expect(total).toHaveText('275');

	for (const letter of ['D', 'E', 'F', 'G', 'H']) {
		await add.click();
		const description = drawer.getByRole('textbox', { name: 'Description', exact: true });
		const amount = drawer.getByRole('textbox', { name: 'Amount', exact: true });
		await expect(drawer.getByRole('textbox')).toHaveCount(2);
		await description.fill(`Expense ${letter}`);
		await amount.fill('100');
		await drawer.getByRole('button', { name: 'Add item', exact: true }).click();
		await expect(drawer).toBeHidden();
		await expect(list.getByRole('listitem').filter({ hasText: `Expense ${letter}` }))
			.toContainText(`17${letter}`);
	}
	await expect(heading).toHaveText(`${title} (6/6)`);
	await expect(add).toBeDisabled();
	await expect(total).toHaveText('775');

	for (const [viewport, width] of [['desktop', 1280], ['mobile', 390]] as const) {
		await page.setViewportSize({ width, height: 900 });
		await group.scrollIntoViewIfNeeded();
		expect(await group.evaluate(element => element.scrollWidth - element.clientWidth)).toBe(0);
		if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
			await page.locator('[data-corporate-item="16"]').evaluate(element => element.scrollIntoView({ block: 'start' }));
			await page.screenshot({ path: info.outputPath(`item-17-${viewport}.png`), animations: 'disabled' });
		}
	}

	await list.getByRole('button', { name: 'Expense E', exact: true }).click();
	await drawer.getByRole('button', { name: 'Delete item', exact: true }).click();
	await expect(drawer).toBeHidden();
	await expect(add).toBeEnabled();
	await expect(total).toHaveText('675');

	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(base);
	const printed = await printSavedReturn(page, code, info.outputPath('item-17.pdf'));
	const printedField = (name: string) => printed.locator(`[data-field-id="${id(name)}"]`);
	await expect(printedField('txtPg3Pt6I17OthersDDesc')).toHaveValue('Expense D');
	await expect(printedField('txtPg3Pt6I17OthersEDesc')).toHaveValue('');
	await expect(printedField('txtPg3Pt6I17OthersIDesc')).toHaveValue('Saved expense');
	await expect(printedField('txtPg3Pt6S1I18TotOrdinaryAllowableItemDeduc')).toHaveValue('675');
	await printed.close();
	await page.getByRole('button', { name: 'Not now', exact: true }).click();
	await page.getByRole('link', { name: /^Edit BIR Form / }).click();
	await goToReturnPage(page, 3);
	await expect(heading).toHaveText(`${title} (5/6)`);
	await expect(list.getByRole('button', { name: 'Saved expense', exact: true })).toBeVisible();
	await expect(list.getByRole('button', { name: 'Expense E', exact: true })).toHaveCount(0);
	await expect(total).toHaveText('675');
});
