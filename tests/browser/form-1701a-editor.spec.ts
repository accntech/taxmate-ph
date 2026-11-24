import { expect, test } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

const formPath = `/ebirforms/taxpayers/${taxpayerId}/forms/1701A?new=true`;
const id = (field: string) => `[id="frm1701A:${field}"]`;

test.beforeEach(async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {
		taxpayerName: 'SANTOS, ALEX, REYES', taxpayerClassification: 'I', civilStatus: 'Single',
		taxpayerType: 'single-proprietor'
	});
	await page.goto(formPath);
	await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 20000 });
});

test('requires a compatible ATC before showing an income schedule', async ({ page }) => {
	await goToReturnPage(page, 2);
	await expect(page.locator(id('txt36A'))).toHaveCount(0);
	await expect(page.locator(id('txt47A'))).toHaveCount(0);
	await page.getByRole('button', { name: 'Choose taxpayer ATC' }).click();
	const atc = page.getByRole('combobox', { name: 'Alphanumeric tax code (ATC)', exact: true });
	await expect(atc).toBeFocused();
	await expect(atc.locator('option:not(:disabled)')).toHaveCount(2);
	await expect(atc.locator('option[value="II017"]')).toHaveCount(0);
	await atc.selectOption('II015');
	await goToReturnPage(page, 2);
	await expect(page.locator(id('txt47A'))).toBeEditable();
	await expect(page.locator(id('txt36A'))).toHaveCount(0);

	await goToReturnPage(page, 1);
	await page.getByRole('radio', { name: 'Professional', exact: true }).check();
	await expect(page.locator(id('optTaxRate'))).toHaveText(/Select an ATC/);
	await expect(atc.locator('option:not(:disabled)')).toHaveText([/II014/, /II017/]);
	await expect(atc.locator('option[value="II015"]')).toHaveCount(0);
	await goToReturnPage(page, 2);
	await expect(page.locator(id('txt47A'))).toHaveCount(0);
});

test('exposes installment guidance and lets the filer jump to tax credits', async ({ page }) => {
	await expect(page.getByText('Up to 50% of Item 20. Due by October 15.', { exact: true })).toBeVisible();
	await goToReturnPage(page, 2);
	await page.getByRole('combobox', { name: 'Go to section' }).click();
	await page.getByRole('option', { name: /tax credits and payments/i }).click();
	await expect(page.getByRole('region', { name: /tax credits and payments/i })).toBeFocused();
});

test('keeps seven-digit amounts readable at 390px', async ({ page }) => {
	const atc = page.getByRole('combobox', { name: 'Alphanumeric tax code (ATC)', exact: true });
	await atc.selectOption('II015');
	await page.setViewportSize({ width: 390, height: 920 });
	await page.keyboard.press('Escape');
	await goToReturnPage(page, 2);
	const sales = page.locator(id('txt47A'));
	await sales.fill('1000000');
	await sales.blur();
	await expect(sales).toHaveValue('1,000,000.00');
	const editableAmountFits = await sales.evaluate((input: HTMLInputElement) => {
		const styles = getComputedStyle(input);
		const text = document.createElement('span');
		Object.assign(text.style, {
			position: 'fixed', visibility: 'hidden', whiteSpace: 'pre',
			font: styles.font, fontVariantNumeric: styles.fontVariantNumeric, letterSpacing: styles.letterSpacing
		});
		text.textContent = input.value;
		document.body.append(text);
		const needed = text.getBoundingClientRect().width;
		text.remove();
		const available = input.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
		return needed <= available;
	});
	expect(editableAmountFits).toBe(true);
	const total = page.locator(id('txt49A'));
	await expect(total).toHaveText('₱1,000,000.00');
	const textFits = await total.evaluate(node => {
		const range = document.createRange();
		range.selectNodeContents(node);
		return range.getClientRects().length === 1 &&
			range.getBoundingClientRect().right <= node.closest('td')!.getBoundingClientRect().right;
	});
	expect(textFits).toBe(true);
});
