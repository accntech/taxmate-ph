import { expect, test } from '@playwright/test';
import { formPath, seedWorkspace, taxpayerId } from './fixtures';

test('1601EQ draws a single rule at each edge of the empty withholding section', async ({ page }) => {
	await seedWorkspace(page, 'dark', 'loaded', {}, []);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1601EQ?new=true`);
	await page.getByRole('radiogroup', { name: 'Any taxes withheld?' }).getByRole('radio', { name: 'Yes' }).check();
	const lines = page.getByRole('region', { name: 'Taxes withheld', exact: true });
	const empty = lines.locator('.empty');
	const summary = page.getByRole('complementary', { name: 'Summary' });
	for (const width of [390, 1280]) {
		await page.setViewportSize({ width, height: 900 });
		await expect(lines.locator('header')).toHaveCSS('border-block-end-width', '1px');
		await expect(empty).toHaveCSS('border-block-start-width', '0px');
		await expect(empty).toHaveCSS('border-block-end-width', '0px');
		await expect(summary).toHaveCSS('border-block-start-width', '1px');
	}
});

test('dark 1601EQ section headings use the raised surface color', async ({ page }) => {
	await seedWorkspace(page, 'dark');
	await page.goto(formPath);
	const root = page.locator('html');
	await expect(root).toHaveCSS('--bg-elev-2', /^#[\da-f]{6}$/i);
	const sectionFill = await root.evaluate(root =>
		getComputedStyle(root).getPropertyValue('--bg-elev-2').trim());
	const rgb = `rgb(${[1, 3, 5].map(i => parseInt(sectionFill.slice(i, i + 2), 16)).join(', ')})`;
	for (const name of ['Taxpayer information', 'Taxes withheld']) {
		await expect(page.getByRole('region', { name, exact: true }).locator('header')).toHaveCSS('background-color', rgb);
	}
});

for (const width of [1440, 1100, 960, 768, 560, 390, 320]) {
	test(`1601EQ workspace at ${width}px keeps actions together and summary readable`, async ({ page }, testInfo) => {
		await page.setViewportSize({ width, height: 960 });
		await seedWorkspace(page);
		await page.goto(formPath);
		await expect(page.getByText('Loading saved form…', { exact: true })).toBeHidden();
		const actions = page.locator('footer[aria-label="Return actions"]');
		await expect(actions.getByRole('button', { name: 'Save draft', exact: true })).toBeVisible();
		await expect(actions.getByRole('button', { name: 'Cancel', exact: true })).toBeVisible();
		await expect(actions.getByRole('button', { name: 'Submit to BIR', exact: true })).toHaveCount(0);
		const period = await page.getByRole('region', { name: 'Return period', exact: true }).boundingBox();
		const summary = await page.getByRole('complementary', { name: 'Summary', exact: true }).boundingBox();
		expect(period).not.toBeNull();
		expect(summary).not.toBeNull();
		expect(summary!.y).toBeGreaterThan(period!.y + period!.height);
		const taxItems = page.getByRole('region', { name: 'Taxes withheld', exact: true });
		const taxBounds = await taxItems.boundingBox();
		expect(summary!.y).toBeGreaterThanOrEqual(taxBounds!.y + taxBounds!.height - 1);
		await expect(page.getByText('1601-EQ', { exact: true })).toBeVisible();
		const heading = page.getByRole('heading', { name: /^Quarterly Remittance Return/ });
		const masthead = heading.locator('..');
		await expect(masthead.getByText('Kawanihan ng Rentas Internas', { exact: true })).toHaveCount(0);
		const [title, number] = await Promise.all([heading.boundingBox(), masthead.locator('.form-number').boundingBox()]);
		const header = (await masthead.boundingBox())!;
		const wideHeaderWidth = await page.evaluate(() => 40 * parseFloat(getComputedStyle(document.documentElement).fontSize));
		await expect(heading).toHaveCSS('text-align', 'start');
		if (header.width < wideHeaderWidth) {
			expect(number!.y).toBeGreaterThanOrEqual(title!.y + title!.height - 1);
			expect(Math.abs(number!.x - title!.x)).toBeLessThan(1);
		} else {
			expect(number!.x).toBeGreaterThanOrEqual(title!.x + title!.width - 1);
		}
		await expect.poll(() => page.locator('.paper-sheet').evaluate((sheet) => {
			const frame = sheet.getBoundingClientRect();
			const problems: string[] = [];
			if (frame.left < 0 || frame.right > innerWidth + 1) problems.push('paper sheet outside viewport');
			for (const control of sheet.querySelectorAll('input:not([type="radio"]), [role="combobox"]')) {
				const cell = control.closest('.paper-period-field, .entry-cell, .paper-amount-row');
				const box = control.getBoundingClientRect();
				if (!cell || !box.width) continue;
				const bounds = cell.getBoundingClientRect();
				if (box.left < bounds.left - 1 || box.right > bounds.right + 1) problems.push(control.id + ' outside cell');
				if (innerWidth <= 390) {
					const surface = control instanceof HTMLInputElement ? control.parentElement! : control;
					const height = surface.getBoundingClientRect().height;
					if (height < 36 || height > 40) problems.push(control.id + ' is not compact');
				}
			}
			return problems;
		})).toEqual([]);
		if (width <= 390) {
			const quarter = page.getByRole('combobox', { name: 'Quarter', exact: true });
			await expect.poll(() => quarter.getByText('Second Quarter', { exact: true }).evaluate(label =>
				label.scrollWidth - label.clientWidth
			)).toBeLessThanOrEqual(1);
			for (const button of await actions.getByRole('button').all()) {
				const height = (await button.boundingBox())!.height;
				expect(height).toBeGreaterThanOrEqual(36);
				expect(height).toBeLessThanOrEqual(40);
			}
		}
		await expect(page.getByRole('complementary', { name: 'Summary', exact: true }).getByText('30', { exact: true })).toBeVisible();
		await expect(page.getByRole('complementary', { name: 'Summary', exact: true })).toContainText('Total amount still due');
		await page.getByRole('button', { name: /^Add line item/ }).click();
		const editor = page.getByRole('dialog', { name: 'New line item', exact: true });
		await expect(editor).toBeVisible();
		await expect(editor.getByRole('group', { name: 'ATC row 2', exact: true })).toBeVisible();
		await editor.getByRole('button', { name: 'Cancel', exact: true }).click();
		await expect(editor).toBeHidden();
		await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
		const bar = await actions.boundingBox();
		expect(bar!.y + bar!.height).toBeLessThanOrEqual(961);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
		await page.screenshot({ path: testInfo.outputPath(`1601eq-paper-${width}.png`), fullPage: true });
		await actions.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(page).toHaveURL(/\/forms$/);
	});
}

test('keyboard focus clears the sticky footer on narrow forms', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 960 });
	await seedWorkspace(page);
	await page.goto(formPath);
	const secondMonth = page.locator('[id="frm1601EQ:txtRemittanceSecondMonth"]');
	await secondMonth.focus();
	const input = await secondMonth.boundingBox();
	const footer = await page.locator('footer[aria-label="Return actions"]').boundingBox();
	expect(input!.y + input!.height).toBeLessThan(footer!.y - 3);
});

test('return footer uses the same solid surface as the workspace', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(formPath);
	const footer = page.locator('footer[aria-label="Return actions"]');
	await expect(footer).toBeVisible();
	const surface = await page.getByRole('region', { name: 'BIR Form 1601EQ workspace', exact: true }).evaluate(element => getComputedStyle(element).backgroundColor);
	await expect(footer).toHaveCSS('background-color', surface);
	await expect(footer).toHaveCSS('backdrop-filter', 'none');
});

test('summary reads from the calculation breakdown to the final amount', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(formPath);
	const summary = page.getByRole('complementary', { name: 'Summary', exact: true });
	const breakdown = await summary.locator('dl').last().boundingBox();
	const total = await summary.locator('.eq-amount-due').boundingBox();
	expect(total!.y).toBeGreaterThanOrEqual(breakdown!.y + breakdown!.height);
	await expect(summary).toContainText('₱765.44');
});

test('currency amounts align right while resting and editing', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(formPath);
	const remittance = page.getByRole('textbox', { name: 'First month', exact: true });
	const taxBase = page.getByRole('textbox', { name: 'Item 13 Tax base', exact: true });
	await expect(remittance).toHaveValue('1,234.56');
	await expect(remittance).toHaveCSS('text-align', 'right');
	await expect(taxBase).toHaveCSS('text-align', 'right');

	await page.setViewportSize({ width: 390, height: 844 });
	await remittance.focus();
	await expect(remittance).toHaveValue('1234.56');
	await expect(remittance).toHaveCSS('text-align', 'right');
	await expect(taxBase).toHaveCSS('text-align', 'right');
});

test('1601EQ mobile withholding lines line up with the quarterly total', async ({ page }) => {
	await seedWorkspace(page);
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto(formPath);
	const line = page.locator('output[aria-label="Item 13 Tax withheld"]');
	const total = page.getByRole('complementary', { name: 'Summary', exact: true }).locator('.paper-total-row dd').first();
	const rangeEnd = (element: Element) => {
		const text = document.createRange();
		text.selectNodeContents(element);
		return text.getBoundingClientRect().right;
	};
	const [lineEdge, totalEdge] = await Promise.all([line.evaluate(rangeEnd), total.evaluate(rangeEnd)]);
	expect(Math.abs(lineEdge - totalEdge)).toBeLessThanOrEqual(2);
	await page.getByRole('button', { name: 'Edit line item 1', exact: true }).click();
	const drawer = page.getByRole('dialog');
	const computed = drawer.getByRole('status', { name: 'Tax withheld', exact: true });
	await expect(computed).toBeVisible();
	const offset = await computed.evaluate(output => {
		const input = document.getElementById(output.getAttribute('for')!)!;
		const text = document.createRange();
		text.selectNodeContents(output);
		return input.getBoundingClientRect().right - text.getBoundingClientRect().right;
	});
	expect(Math.abs(offset)).toBeLessThanOrEqual(2);
});
