import { expect, test, type Locator, type Page } from '@playwright/test';
import { formPath, goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

function currencySpacing(amount: Locator) {
	return amount.evaluate(async input => {
		const wrapper = input.parentElement!;
		await Promise.allSettled(wrapper.getAnimations().map(animation => animation.finished));
		const style = getComputedStyle(wrapper);
		return [style.paddingInlineStart, style.paddingInlineEnd, style.columnGap];
	});
}

async function standardCurrencySpacing(page: Page) {
	const reference = await page.context().newPage();
	try {
		await reference.setViewportSize(page.viewportSize()!);
		await seedWorkspace(reference);
		await reference.goto(formPath);
		const amount = reference.locator('[id="frm1601EQ:txtRemittanceFirstMonth"]');
		await expect.poll(() => amount.evaluate(input => getComputedStyle(input.parentElement!).display)).toBe('flex');
		return await currencySpacing(amount);
	} finally {
		await reference.close();
	}
}

async function openQuarterlyReturn(page: Page, code: '1701Q' | '1701Qv2018', width = 1440) {
	await page.setViewportSize({ width, height: 1040 });
	await seedWorkspace(page, 'light', 'loaded', {
		taxpayerName: 'SANTOS, ALEX, REYES', taxpayerClassification: 'I', civilStatus: 'Married',
		spouse: {
			taxpayerName: 'SANTOS, TAYLOR, CRUZ', tin1: '765', tin2: '432', tin3: '100',
			branchCode: '00000', rdoCode: '047'
		}
	});
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
	const editor = page.locator('.income-editor');
	await expect(editor).toBeVisible({ timeout: 45000 });
	if (width === 390) {
		await page.keyboard.press('Escape');
		await expect.poll(async () => (await page.locator('aside.sidebar').boundingBox())!.x).toBeLessThan(-245);
	}
	return editor;
}

async function setAtc(page: Page, id: 'optATC' | 'optSpouseATC', code: 'II012' | 'II015') {
	await page.locator(`[id="frm1701q:${id}"]`).selectOption(code);
}

test('1701Q July identifies tax relief and clears the method when the filer opts out', async ({ page }) => {
	const editor = await openQuarterlyReturn(page, '1701Q');
	const question = editor.getByRole('radiogroup', { name: /availing of tax relief/i });
	const method = editor.locator('[id="frm1701q:txtTaxRelief25"]');
	await expect(question.getByRole('radio', { name: 'No' })).toBeChecked();
	await expect(method).toBeDisabled();
	await expect(method).not.toHaveText('0');
	await question.getByRole('radio', { name: 'Yes' }).check();
	await expect(method).toHaveText('Special Rate');
	await method.click();
	await page.getByRole('option', { name: 'International Tax Treaty', exact: true }).click();
	await question.getByRole('radio', { name: 'No' }).check();
	await expect(method).toBeDisabled();
	await expect(method).not.toContainText('International Tax Treaty');
	await question.getByRole('radio', { name: 'Yes' }).check();
	await expect(method).toHaveText('Special Rate');
	await question.getByRole('radio', { name: 'No' }).check();
	await editor.getByRole('textbox', { name: 'Filing year' }).fill('2017');
	await editor.getByRole('radio', { name: 'First quarter' }).check();
	await page.getByRole('button', { name: 'Save draft' }).click();
	await expect(page).toHaveURL(/\/forms$/);
	const returns = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns);
	const saved = returns.find((record: { formCode: string }) => record.formCode === '1701Q');
	expect(saved.values).toMatchObject({ 'frm1701q:j_id217': 'N', 'frm1701q:txtTaxRelief25': '0' });
	await page.getByRole('row').filter({ hasText: '1701Q' }).getByRole('link', { name: 'Edit' }).click();
	await expect(question.getByRole('radio', { name: 'No' })).toBeChecked();
	await expect(method).toBeDisabled();
});

test('1701Q July uses one computation row per item with the source descriptions and filer columns', async ({ page }) => {
	const editor = await openQuarterlyReturn(page, '1701Q');
	await editor.getByRole('button', { name: 'Use saved spouse details' }).click();
	const table = editor.getByRole('table', { name: /Computation of Tax/i });
	await expect(table.getByRole('columnheader')).toHaveText(['Item', 'Description', 'Taxpayer', 'Spouse']);
	const withheld = table.getByRole('row', { name: /38G\/H.*Form 2307/i });
	await expect(withheld.getByRole('rowheader')).toHaveCount(1);
	const amounts = withheld.getByRole('textbox');
	await expect(amounts.nth(0)).toHaveAttribute('id', 'frm1701q:txt38G');
	await expect(amounts.nth(1)).toHaveAttribute('id', 'frm1701q:txt38H');
	expect(await currencySpacing(amounts.nth(0))).toEqual(await standardCurrencySpacing(page));
	const aggregate = table.getByRole('row', { name: /41C.*aggregate amount payable/i });
	await expect(aggregate.locator('[id="frm1701q:txt41C"]')).toBeVisible();
});

test('1701Q January preserves joint columns and readable amounts at 390 px', async ({ page }) => {
	const editor = await openQuarterlyReturn(page, '1701Qv2018', 390);
	await editor.getByRole('button', { name: 'Use saved spouse details' }).click();
	await setAtc(page, 'optATC', 'II012');
	await setAtc(page, 'optSpouseATC', 'II015');
	await goToReturnPage(page, 2);
	const graduated = editor.getByRole('table', { name: /Schedule I - For Graduated/ });
	const flatRate = editor.getByRole('table', { name: /Schedule II - For 8%/ });
	for (const table of [graduated, flatRate]) {
		await expect(table.getByRole('columnheader')).toHaveText(['Item', 'Description', 'Taxpayer', 'Spouse']);
	}
	const sales = [
		{ table: graduated, item: '36', id: 'txt36A', amountColumn: 1, emptyColumn: 2 },
		{ table: flatRate, item: '47', id: 'txt47B', amountColumn: 2, emptyColumn: 1 }
	];
	const expectedSpacing = await standardCurrencySpacing(page);
	for (const { table, item, id, amountColumn, emptyColumn } of sales) {
		const row = table.locator(`[data-income-item="${item}"]`);
		const amount = row.getByRole('cell').nth(amountColumn).getByRole('textbox');
		await expect(amount).toHaveAttribute('id', `frm1701q:${id}`);
		expect(await currencySpacing(amount)).toEqual(expectedSpacing);
		await expect(row.getByRole('cell').nth(emptyColumn)).toHaveText('—');
		await amount.fill('123456789.12');
		await amount.blur();
		await expect(amount).toHaveValue('123,456,789.12');
		const { clientWidth, scrollWidth } = await amount.evaluate((input: HTMLInputElement) => ({
			clientWidth: input.clientWidth, scrollWidth: input.scrollWidth
		}));
		expect(clientWidth).toBeGreaterThanOrEqual(scrollWidth);
	}
	expect(await currencySpacing(graduated.locator('[id="frm1701q:txt42A"]'))).toEqual(expectedSpacing);
	await expect(graduated.locator('[data-income-item="42"] th')).not.toContainText(/\b42\b/);
	await expect(graduated.locator('[data-income-item="46"] th')).not.toContainText(/table below/i);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('1701Q July jumps to its computation without adding a page', async ({ page }) => {
	const editor = await openQuarterlyReturn(page, '1701Q');
	const sectionJump = editor.getByRole('combobox', { name: 'Go to section' });
	await expect(sectionJump).toBeVisible({ timeout: 5000 });
	await sectionJump.click();
	await page.getByRole('option', { name: /computation of tax/i }).press('Enter');
	await expect(editor.getByRole('region', { name: /computation of tax/i })).toBeFocused();
	await sectionJump.click();
	await page.getByRole('option', { name: 'Tax credits and payments' }).press('Enter');
	await expect(editor.locator('[id="frm1701q:txt38A"]')).toBeFocused();
	await expect(editor.getByText('Page 1 of 1', { exact: true })).toBeVisible();
});

test('1701Q January shows a pending total and links credits and tax due to the exact schedule items', async ({ page }) => {
	const editor = await openQuarterlyReturn(page, '1701Qv2018');
	const total = editor.locator('[id="frm1701q:txt31"]');
	await expect(total).toHaveText('—');
	const creditsLink = editor.getByRole('button', { name: 'From Schedule III, Item 62' });
	await expect(creditsLink).toBeVisible({ timeout: 5000 });
	await creditsLink.click();
	await expect(editor.locator('[id="frm1701q:txt62A"]')).toBeFocused();
	await expect(editor.getByRole('table', { name: /for graduated|for 8%/i })).toHaveCount(0);
	await editor.getByRole('button', { name: 'Choose taxpayer ATC' }).click();
	const atc = editor.locator('[id="frm1701q:optATC"]');
	await expect(atc).toBeFocused();
	await atc.selectOption('II015');
	await expect(total).toHaveText('₱0.00');
	await editor.getByRole('button', { name: 'From Schedule II, Item 54' }).click();
	await expect(editor.locator('[id="frm1701q:txt54A"]')).toBeFocused();
});
