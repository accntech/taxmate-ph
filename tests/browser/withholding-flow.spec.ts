import { execFileSync } from 'node:child_process';
import { expect, test, type Page } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';
import { printSavedReturn } from './helpers/return-pdf';

const listPath = `/ebirforms/taxpayers/${taxpayerId}/forms`;
const field = (page: Page, id: string) => page.locator(`[id="${id}"]`);
const dateControl = (page: Page, id: string) => page.locator('[data-slot="date-input"]').filter({ has: field(page, id) });

async function fillDate(page: Page, id: string, iso: string) {
	const [year, month, day] = iso.split('-');
	const date = dateControl(page, id);
	// Set the year and month first so the day uses the target month's bounds.
	await date.getByRole('spinbutton', { name: 'Year', exact: true }).fill(year);
	await date.getByRole('spinbutton', { name: 'Month', exact: true }).fill(month);
	const dayField = date.getByRole('spinbutton', { name: 'Day', exact: true });
	await dayField.fill(day);
	await dayField.blur();
}

async function openDisclosure(page: Page, title: string) {
	const summary = page.locator('summary').filter({ hasText: title }).first();
	const details = summary.locator('..');
	if (await details.getAttribute('open') === null) await summary.click();
}

test('adding an ATC schedule row opens it and moves keyboard focus to its first field', async ({ page }) => {
	await seedWorkspace(page);
	await create(page, '1601E');
	await page.getByRole('radiogroup', { name: 'Any tax withheld?' }).getByLabel('Yes', { exact: true }).check();
	await page.getByRole('button', { name: 'Add line item to Computation by ATC', exact: true }).click();
	await expect(page.getByRole('dialog', { name: 'New line item', exact: true })).toBeVisible();
	await expect(field(page, 'frm1601E:txtAtcCode1')).toBeVisible();
	await expect(field(page, 'frm1601E:txtAtcCode1')).toBeFocused();
});

test('new withholding templates reuse the searchable ATC picker and packaged tax rate', async ({ page }) => {
	await seedWorkspace(page);
	await create(page, '1601E');
	await page.getByRole('radiogroup', { name: 'Any tax withheld?' }).getByLabel('Yes', { exact: true }).check();
	await page.getByRole('button', { name: 'Add line item to Computation by ATC', exact: true }).click();
	const atc = field(page, 'frm1601E:txtAtcCode1');
	await expect(atc).toHaveAttribute('role', 'combobox');
	await atc.click();
	const search = page.getByPlaceholder('Search code or income', { exact: true });
	await search.fill('WI120');
	await expect(page.getByRole('option', { name: /WI120/ })).toContainText('2%');
	await search.press('Enter');
	await field(page, 'frm1601E:txtTaxBase1').fill('100000');
	await expect(field(page, 'frm1601E:txtTaxbeWithHeld1')).toContainText('2,000.00');
	await page.getByRole('dialog', { name: 'New line item', exact: true }).getByRole('button', { name: 'Add', exact: true }).click();
	await expect(page.getByRole('list', { name: 'Computation by ATC line items', exact: true })).toContainText('2,000.00');
});

async function create(page: Page, code: string) {
	await page.goto(listPath);
	await page.getByRole('button', { name: 'Create return', exact: true }).click();
	await page.getByRole('combobox', { name: 'Search BIR forms' }).fill(code);
	await page.getByRole('option', { name: new RegExp(`^BIR Form ${code} `) }).click();
	await expect(page.getByRole('region', { name: `BIR Form ${code} workspace`, exact: true }).getByRole('heading', { level: 1 })).toBeVisible();
}

test('0619E follows the PDF field order in a centered paper form', async ({ page }, testInfo) => {
	await seedWorkspace(page);
	await page.goto(`${listPath}/0619E?new=true`);
	const title = page.getByRole('heading', { name: /Monthly Remittance Form/ });
	await expect(title).toBeVisible({ timeout: 3000 });
	const header = title.locator('..');
	await expect(header.getByText('0619-E', { exact: true })).toBeVisible();
	await expect(header.getByText('January 2018', { exact: true })).toBeVisible();
	const period = page.getByRole('region', { name: 'Return period', exact: true });
	const taxpayer = page.getByRole('region', { name: 'Taxpayer information', exact: true });
	const remittance = page.getByRole('region', { name: 'Part II · Tax Remittance', exact: true });
	await expect(period).toContainText('WME10');
	await expect(period).toContainText('WE');
	await expect(taxpayer.locator('dt')).toHaveText([
		'7 TIN and branch code', '8 RDO code', '9 Withholding agent’s name', '10 Registered address',
		'10A ZIP code', '11 Contact number', '12 Category of withholding agent', '13 Email address'
	]);
	await page.getByRole('radiogroup', { name: 'Amended return?', exact: true }).getByLabel('Yes', { exact: true }).check();
	await field(page, 'frm0619E:txtTax14').fill('10000');
	await field(page, 'frm0619E:txtTax15').fill('2000');
	await field(page, 'frm0619E:txtTax17A').fill('300');
	await expect(field(page, 'frm0619E:txtTax16')).toHaveText('₱8,000.00');
	await expect(field(page, 'frm0619E:txtTax18')).toHaveText('₱8,300.00');

	for (const width of [1440, 390, 320]) {
		await page.setViewportSize({ width, height: 960 });
		await page.evaluate(() => document.fonts.ready);
		const [heading, masthead, periodBox, taxpayerBox, remittanceBox] = await Promise.all(
			[title, header, period, taxpayer, remittance].map(locator => locator.boundingBox())
		);
		expect(Math.abs(heading!.x + heading!.width / 2 - masthead!.x - masthead!.width / 2)).toBeLessThan(1);
		await expect(title).toHaveCSS('text-align', 'center');
		expect(periodBox!.y).toBeLessThan(taxpayerBox!.y);
		expect(taxpayerBox!.y).toBeLessThan(remittanceBox!.y);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
		await page.screenshot({ path: testInfo.outputPath(`0619e-paper-${width}.png`), fullPage: true });
	}
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	await page.getByRole('row').filter({ hasText: '0619E' }).getByRole('link', { name: 'Edit', exact: true }).click();
	await expect(field(page, 'frm0619E:txtTax15')).toHaveValue('2,000.00');
	await expect(field(page, 'frm0619E:txtTax18')).toHaveText('₱8,300.00');
});

for (const width of [1440, 390, 320]) {
	test(`0619F shows the full Item 5 tax type at ${width}px`, async ({ page }, testInfo) => {
		const wb = 'WB — Withholding tax — banks and other financial institutions';
		await page.setViewportSize({ width, height: 960 });
		await seedWorkspace(page);
		await page.goto(`${listPath}/0619F?new=true`);
		const taxType = page.getByRole('combobox', { name: 'Tax type', exact: true });
		const label = taxType.getByText(wb, { exact: true });
		await expect(label).toBeVisible({ timeout: 20_000 });
		await page.evaluate(() => document.fonts.ready);
		const textFits = (element: HTMLElement) => {
			const range = document.createRange();
			range.selectNodeContents(element);
			const bounds = element.getBoundingClientRect();
			return [...range.getClientRects()].every(line =>
				line.left >= bounds.left - 1 && line.right <= bounds.right + 1 &&
				line.top >= bounds.top - 1 && line.bottom <= bounds.bottom + 1
			);
		};
		expect(await label.evaluate(textFits), 'selected tax type fits without clipping').toBe(true);
		const formHeader = page.locator('.paper-form-header');
		const period = page.getByRole('region', { name: 'Return period', exact: true });
		if (width !== 320) {
			const header = (await formHeader.boundingBox())!;
			const box = (await period.boundingBox())!;
			await page.screenshot({
				path: testInfo.outputPath(`0619-f-item-5-${width}.png`),
				animations: 'disabled',
				clip: { x: header.x, y: header.y, width: header.width, height: box.y + box.height - header.y }
			});
			await page.screenshot({
				path: testInfo.outputPath(`0619-f-full-${width}.png`),
				fullPage: true,
				animations: 'disabled',
				style: '.eq-action-bar { position: static !important; }'
			});
		}
		await taxType.press('Enter');
		const option = page.getByRole('option', { name: wb, exact: true });
		await expect(option).toBeVisible();
		expect(await option.getByText(wb, { exact: true }).evaluate(textFits), 'dropdown tax type fits without clipping').toBe(true);
		await expect(page.getByRole('option', { name: 'WF — Final withholding tax', exact: true })).toBeVisible();
		await taxType.press('Escape');
		await expect(option).toBeHidden();
	});
}

test('0619F follows the final withholding PDF and reopens the saved tax type and amounts', async ({ page }, testInfo) => {
	await seedWorkspace(page);
	await page.goto(`${listPath}/0619F?new=true`);
	const title = page.getByRole('heading', { name: 'Monthly Remittance Form of Final Income Taxes Withheld', exact: true });
	await expect(title).toBeVisible({ timeout: 3000 });
	const header = title.locator('..');
	await expect(header.getByText('0619-F', { exact: true })).toBeVisible();
	await expect(header.getByText('January 2018', { exact: true })).toBeVisible();
	const period = page.getByRole('region', { name: 'Return period', exact: true });
	const taxpayer = page.getByRole('region', { name: 'Taxpayer information', exact: true });
	const remittance = page.getByRole('region', { name: 'Part II · Tax Remittance', exact: true });
	const taxType = period.getByRole('combobox', { name: 'Tax type', exact: true });
	await taxType.click();
	await expect(page.getByRole('option', { name: /^WB —/ })).toBeVisible();
	await page.getByRole('option', { name: /^WF —/ }).click();
	await expect(taxpayer.locator('dt')).toHaveText([
		'6 TIN and branch code', '7 RDO code', '8 Withholding agent’s name', '9 Registered address',
		'9A ZIP code', '10 Contact number', '11 Category of withholding agent', '12 Email address'
	]);
	await expect(remittance.getByLabel(/^WMF10/)).toBeVisible();
	await expect(remittance.getByLabel(/^WMF20/)).toBeVisible();
	await page.getByRole('radiogroup', { name: 'Any tax withheld?', exact: true }).getByLabel('Yes', { exact: true }).check();
	await page.getByRole('radiogroup', { name: 'Amended return?', exact: true }).getByLabel('Yes', { exact: true }).check();
	await field(page, 'frm0619F:txtTax14').fill('2500.25');
	await field(page, 'frm0619F:txtTax16').fill('500');
	await field(page, 'frm0619F:txtTax18B').fill('10');
	await expect(field(page, 'frm0619F:txtTax15')).toHaveText('₱2,500.25');
	await expect(field(page, 'frm0619F:txtTax17')).toHaveText('₱2,000.25');
	await expect(field(page, 'frm0619F:txtTax19')).toHaveText('₱2,010.25');

	for (const width of [1440, 390, 320]) {
		await page.setViewportSize({ width, height: 960 });
		await page.evaluate(() => document.fonts.ready);
		const [heading, masthead, periodBox, taxpayerBox, remittanceBox] = await Promise.all(
			[title, header, period, taxpayer, remittance].map(locator => locator.boundingBox())
		);
		expect(Math.abs(heading!.x + heading!.width / 2 - masthead!.x - masthead!.width / 2)).toBeLessThan(1);
		await expect(title).toHaveCSS('text-align', 'center');
		expect(periodBox!.y).toBeLessThan(taxpayerBox!.y);
		expect(taxpayerBox!.y).toBeLessThan(remittanceBox!.y);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
		await page.screenshot({ path: testInfo.outputPath(`0619f-paper-${width}.png`), fullPage: true });
	}

	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	await page.getByRole('row').filter({ hasText: '0619F' }).getByRole('link', { name: 'Edit', exact: true }).click();
	await expect(taxType).toContainText('WF');
	await expect(field(page, 'frm0619F:txtTax14')).toHaveValue('2,500.25');
	await expect(field(page, 'frm0619F:txtTax19')).toHaveText('₱2,010.25');
});

test('0619E saves and reloads calculations and finalizes without BIR requests', async ({ page }, testInfo) => {
	await page.setViewportSize({ width: 1440, height: 1100 });
	await seedWorkspace(page);
	const birRequests: string[] = [];
	page.on('request', request => { if (/bir\.gov\.ph/i.test(request.url())) birRequests.push(request.url()); });
	await create(page, '0619E');
	await field(page, 'frm0619E:txtYear').fill('2025');
	await page.getByRole('combobox', { name: 'Month', exact: true }).click();
	await page.getByRole('option', { name: 'February', exact: true }).click();
	const due = dateControl(page, 'frm0619E:dueDate');
	await expect(due.getByRole('spinbutton', { name: 'Month', exact: true })).toHaveValue('03');
	await expect(due.getByRole('spinbutton', { name: 'Day', exact: true })).toHaveValue('10');
	await expect(due.getByRole('spinbutton', { name: 'Year', exact: true })).toHaveValue('2025');
	await page.getByRole('radiogroup', { name: 'Amended return?' }).getByLabel('Yes', { exact: true }).check();
	await field(page, 'frm0619E:txtTax14').fill('10000');
	await field(page, 'frm0619E:txtTax15').fill('2000');
	await field(page, 'frm0619E:txtTax17A').fill('300');
	await page.getByRole('radiogroup', { name: 'Any tax withheld?' }).getByLabel('Yes', { exact: true }).check();
	await expect(field(page, 'frm0619E:txtTax18')).toContainText('8,300.00');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	let row = page.getByRole('row').filter({ hasText: '0619E' });
	await expect(row).toContainText('8,300.00');
	await row.getByRole('link', { name: 'Edit', exact: true }).click();
	await expect(field(page, 'frm0619E:txtTax14')).toHaveValue('10,000.00');
	await expect(field(page, 'frm0619E:txtTax18')).toContainText('8,300.00');
	await page.screenshot({ path: testInfo.outputPath('0619e-desktop.png'), fullPage: true });
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	row = page.getByRole('row').filter({ hasText: '0619E' });
	await row.getByRole('button', { name: /^More actions/ }).click();
	await page.getByRole('menuitem', { name: 'Mark as final', exact: true }).click();
	await expect(row).toContainText('Final');
	await row.getByRole('button', { name: /^More actions/ }).click();
	await expect(page.getByRole('menuitem', { name: 'Submit to BIR', exact: true })).toBeDisabled();
	expect(birRequests).toEqual([]);
});

for (const width of [1440, 390]) {
	test(`annual withholding at ${width}px groups schedules and avoids horizontal page overflow`, async ({ page }, testInfo) => {
		await page.setViewportSize({ width, height: 960 });
		await seedWorkspace(page);
		await create(page, '1604C');
		await expect(page.locator('.wh-schedule').first()).toBeVisible();
		await expect(page.getByRole('link', { name: 'Edit taxpayer profile' })).toHaveCount(0);
		await expect(page.getByText('Testing only.', { exact: false })).toHaveCount(0);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
		await page.screenshot({ path: testInfo.outputPath(`1604c-${width}.png`), fullPage: true });
	});
}

test('0619F shows inactive withholding as labeled zeroes through save and reopen', async ({ page }, testInfo) => {
	await seedWorkspace(page, 'light', 'loaded', {}, []);
	await create(page, '0619F');
	const withheld = page.getByRole('radiogroup', { name: 'Any tax withheld?', exact: true });
	await withheld.getByRole('radio', { name: 'Yes', exact: true }).check();
	const interest = field(page, 'frm0619F:txtTax13');
	const other = field(page, 'frm0619F:txtTax14');
	const total = field(page, 'frm0619F:txtTax15');
	await expect(other.locator('xpath=self::output')).toHaveText('₱0.00');
	await interest.fill('100');
	await expect(total).toHaveText('₱100.00');
	await page.getByRole('combobox', { name: 'Tax type', exact: true }).click();
	await page.getByRole('option', { name: /^WF —/ }).click();
	await expect(interest.locator('xpath=self::output')).toHaveText('₱0.00');
	await other.fill('250');
	await expect(total).toHaveText('₱250.00');
	await withheld.getByRole('radio', { name: 'No', exact: true }).check();
	await expect(other.locator('xpath=self::output')).toHaveText('₱0.00');
	await expect(total).toHaveText('₱0.00');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	const printed = await printSavedReturn(page, '0619F', testInfo.outputPath('0619f-inactive-amounts.pdf'));
	for (const item of ['txtTax13', 'txtTax14', 'txtTax15']) {
		await expect(field(printed, item)).toHaveText('0');
		await expect(field(printed, item + '_2')).toHaveText('00');
	}
	await printed.close();
	await page.getByRole('button', { name: 'Not now', exact: true }).click();
	await page.getByRole('row').filter({ hasText: '0619F' }).getByRole('link', { name: 'Edit', exact: true }).click();
	await expect(total).toHaveText('₱0.00');
	for (const width of [1280, 390]) {
		await page.setViewportSize({ width, height: 900 });
		await page.getByRole('region', { name: 'Part II · Tax Remittance' }).scrollIntoViewIfNeeded();
		await page.screenshot({
			path: testInfo.outputPath(`0619f-inactive-amounts-${width}.png`), fullPage: true,
			animations: 'disabled', style: '.eq-action-bar { position: static !important; }'
		});
	}
});

test('1606 reconciles two saved selling prices into one labeled amount', async ({ page }, testInfo) => {
	await seedWorkspace(page, 'light', 'loaded', {}, [{
		id: '1606-conflict', taxpayerId, formCode: '1606', returnPeriod: '20251001', status: 'Draft',
		updatedAt: 1794441600000, finalFlag: '0', values: {
			'frm1606:transactionType': 'Installment sale', 'frm1606:date': '2025-10-01',
			'frm1606:txtSelling': '3000', 'frm1606:txtGross': '4000'
		}
	}]);
	await page.goto(`${listPath}/1606?return=1606-conflict`);
	const selling = field(page, 'frm1606:txtSelling');
	const gross = field(page, 'frm1606:txtGross');
	const reconcile = page.getByRole('button', { name: 'Use gross selling price for both items' });
	await expect(selling.locator('xpath=self::output')).toHaveText('₱3,000.00');
	await expect(gross).toHaveValue('4,000.00');
	await expect(reconcile).toBeVisible();
	await reconcile.click();
	await expect(selling).toHaveText('₱4,000.00');
	await expect(reconcile).toHaveCount(0);
	await gross.fill('4100');
	await gross.blur();
	await expect(selling).toHaveText('₱4,100.00');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	const printed = await printSavedReturn(page, '1606', testInfo.outputPath('1606-mirrored-selling-price.pdf'));
	await expect(field(printed, 'frm1606:txtSelling')).toHaveValue('4,100.00');
	await expect(field(printed, 'frm1606:txtGross')).toHaveValue('4,100.00');
	await printed.close();
	await page.getByRole('button', { name: 'Not now', exact: true }).click();
	await page.getByRole('row').filter({ hasText: '1606' }).getByRole('link', { name: 'Edit', exact: true }).click();
	await expect(gross).toHaveValue('4,100.00');
	await expect(selling).toHaveText('₱4,100.00');
	for (const width of [1280, 390]) {
		await page.setViewportSize({ width, height: 900 });
		await selling.scrollIntoViewIfNeeded();
		await page.screenshot({
			path: testInfo.outputPath(`1606-mirrored-selling-price-${width}.png`), fullPage: true,
			animations: 'disabled', style: '.eq-action-bar { position: static !important; }'
		});
	}
});

test('proper date input preserves an ISO leap day and opens its project calendar', async ({ page }) => {
	await seedWorkspace(page);
	await create(page, '0619E');
	const due = dateControl(page, 'frm0619E:dueDate');
	await due.getByRole('button', { name: 'Open calendar', exact: true }).click();
	await expect(page.getByRole('dialog', { name: 'Choose date', exact: true })).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(page.getByRole('dialog', { name: 'Choose date', exact: true })).toBeHidden();
	await fillDate(page, 'frm0619E:dueDate', '2024-02-29');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await page.getByRole('row').filter({ hasText: '0619E' }).getByRole('link', { name: 'Edit', exact: true }).click();
	await expect(due.getByRole('spinbutton', { name: 'Month', exact: true })).toHaveValue('02');
	await expect(due.getByRole('spinbutton', { name: 'Day', exact: true })).toHaveValue('29');
	await expect(due.getByRole('spinbutton', { name: 'Year', exact: true })).toHaveValue('2024');
});

test('an incomplete withholding draft is saved; final validation links back to its input', async ({ page }) => {
	await seedWorkspace(page);
	await create(page, '0619E');
	await field(page, 'frm0619E:txtYear').fill('');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	const row = page.getByRole('row').filter({ hasText: '0619E' });
	await row.getByRole('button', { name: /^More actions/ }).click();
	await page.getByRole('menuitem', { name: 'Mark as final', exact: true }).click();
	await expect(page.getByRole('alert')).toContainText('Year');
	const fixLink = page.getByRole('link', { name: 'Edit return to fix errors', exact: true });
	await expect(fixLink).toHaveAttribute('href', /validate=true/);
	await fixLink.click();
	await expect(field(page, 'frm0619E:txtYear')).toHaveValue('');
	await expect(field(page, 'frm0619E:txtYear')).toHaveAttribute('aria-invalid', 'true');
	await page.getByRole('alert').getByRole('link', { name: /^Year:/ }).click();
	await expect(field(page, 'frm0619E:txtYear')).toBeFocused();
});

test('a required schedule date error opens the collapsed section and focuses its editor date input', async ({ page }) => {
	await seedWorkspace(page);
	await page.addInitScript(() => {
		const data = JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!);
		data.returns.push({
			id: 'invalid-annual-remittance', taxpayerId: data.returns[0].taxpayerId,
			formCode: '1604C', returnPeriod: '2025', status: 'Draft', updatedAt: 1794441600000, finalFlag: '0',
			values: { 'frm1604c:txtYear': '2025', 'frm1604c:txtSched1TaxWheld1': '1000' }
		});
		localStorage.setItem('ebirforms-created-returns-v1', JSON.stringify(data));
	});
	await page.goto(listPath);
	const row = page.getByRole('row').filter({ hasText: '1604C' });
	await row.getByRole('button', { name: /^More actions/ }).click();
	await page.getByRole('menuitem', { name: 'Mark as final', exact: true }).click();
	await page.getByRole('link', { name: 'Edit return to fix errors', exact: true }).click();
	const scheduleSummary = page.locator('summary').filter({ hasText: 'Schedule 1' }).first();
	if (await scheduleSummary.locator('..').getAttribute('open') !== null) await scheduleSummary.click();
	const date = field(page, 'frm1604c:txtSched1Date1');
	await expect(date).toBeHidden();
	await page.getByRole('alert').getByRole('link', { name: /^Date remitted:/ }).first().click();
	await expect(page.getByRole('dialog', { name: 'Edit line item 1', exact: true })).toBeVisible();
	await expect(date).toHaveAttribute('aria-invalid', 'true');
	await expect(date).toBeFocused();
});

test('annual withholding exports its original layout with all monthly rows', async ({ page }, testInfo) => {
	await seedWorkspace(page);
	await create(page, '1604C');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await page.evaluate(() => {
		const native = (window as any).__TAURI_INTERNALS__;
		native.transformCallback = () => 1;
		native.unregisterCallback = () => {};
		const previous = native.invoke;
		native.invoke = async (command: string, args: any) => {
			if (command === 'plugin:dialog|save') return '/tmp/1604c-test.pdf';
			if (command === 'export_form_pdf') { (window as any).withholdingPdf = args.request; return { path: '/tmp/1604c-test.pdf', message: 'Saved' }; }
			return previous(command, args);
		};
	});
	const row = page.getByRole('row').filter({ hasText: '1604C' });
	await row.getByRole('button', { name: /^More actions/ }).click();
	await page.getByRole('menuitem', { name: 'Generate PDF', exact: true }).click();
	await expect.poll(() => page.evaluate(() => (window as any).withholdingPdf?.html ?? '')).toContain('data-form-code="1604C"');
	const html = await page.evaluate(() => (window as any).withholdingPdf.html as string);
	expect(html).toContain('DRAFT');
	const printPage = await page.context().newPage();
	await printPage.setContent(html);
	await printPage.emulateMedia({ media: 'print' });
	await printPage.evaluate(() => document.fonts.ready);
	await expect(printPage.locator('body > .pdf-report-header')).toBeHidden();
	await expect(printPage.locator('.withholding-print-page')).toHaveCount(1);
	await expect(printPage.locator('body')).toContainText('DEC');
	await printPage.pdf({ path: testInfo.outputPath('1604c-test.pdf'), preferCSSPageSize: true, printBackground: true });
	await printPage.screenshot({ path: testInfo.outputPath('1604c-test-print.png'), fullPage: true });
	await printPage.close();
});

for (const width of [1440, 390]) {
 test(`0605 paper editor follows the numbered form and supports ATCs at ${width}px`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 960 });
  await seedWorkspace(page, width === 1440 ? 'dark' : 'light');
  await create(page, '0605');
  const title = page.getByRole('heading', { name: 'Payment Form', exact: true });
  const header = title.locator('..');
  await expect(header.getByText('Kawanihan ng Rentas Internas', { exact: true })).toHaveCount(0);
  const titleBox = (await title.boundingBox())!;
  await expect(title).toHaveCSS('text-align', 'start');
  const numberBox = (await header.locator('.form-number').boundingBox())!;
  if (width === 1440) {
   expect(numberBox.x).toBeGreaterThanOrEqual(titleBox.x + titleBox.width - 1);
  } else {
   expect(numberBox.y).toBeGreaterThanOrEqual(titleBox.y + titleBox.height - 1);
   expect(Math.abs(numberBox.x - titleBox.x)).toBeLessThan(1);
  }
  const period = page.getByRole('region', { name: 'Return period' });
  const background = page.getByRole('region', { name: 'Taxpayer information' });
  const computation = page.getByRole('region', { name: 'Part II · Computation of Tax' });
  await expect(period).toBeVisible();
  await expect(background.locator('dt')).toHaveText([
   '9 TIN and branch code', '10 RDO code', '11 Taxpayer classification', '12 Line of business / occupation',
   '13 Taxpayer name', '14 Telephone number', '15 Registered address', '16 ZIP code'
  ]);
  const boxes = await Promise.all([period, background, computation].map(region => region.boundingBox()));
  expect(boxes[1]!.y).toBeGreaterThanOrEqual(boxes[0]!.y + boxes[0]!.height);
  expect(boxes[2]!.y).toBeGreaterThan(boxes[1]!.y + boxes[1]!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  for (const id of ['frm0605:dueDate', 'frm0605:date']) {
   const date = dateControl(page, id);
   const year = (await date.getByRole('spinbutton', { name: 'Year', exact: true }).boundingBox())!;
   const picker = (await date.getByRole('button', { name: /calendar/i }).boundingBox())!;
   expect(year.x + year.width).toBeLessThanOrEqual(picker.x);
  }
  await expect(field(page, 'frm0605:txtYearEnded')).toHaveValue(String(new Date().getFullYear()));
  await expect(period.locator('output[id="frm0605:itemYearEndMonth"]')).toHaveText('December');
  const atc = field(page, 'frm0605:txtATCCode');
  await expect(atc).toHaveAttribute('role', 'combobox');
  await atc.click();
  const search = page.getByPlaceholder('Search code or income', { exact: true });
  await search.fill('ZZ999');
  await page.getByRole('button', { name: 'Use ATC "ZZ999"', exact: true }).click();
  await expect(atc).toHaveText('ZZ999');
  await atc.click();
  await search.fill('FP010');
  await expect(page.getByRole('option', { name: /FP010/ }).first()).toBeVisible();
  await search.press('Enter');
  await expect(atc).toHaveText('FP010');
  await expect(page.locator('[popover="manual"]')).toBeHidden();
  await page.screenshot({ path: testInfo.outputPath('0605-period-atc.png'), fullPage: true });
 });
}

test('0605 keeps the calculated month and amounts when saved, reopened and printed', async ({ page }, testInfo) => {
 await seedWorkspace(page);
 await create(page, '0605');
 const basis = page.getByRole('combobox', { name: 'Year basis', exact: true });
 const month = page.locator('output[id="frm0605:itemYearEndMonth"]');
 await expect(month).toHaveAccessibleName('Year-end month');
 await expect(month).toHaveText('December');
 await basis.click();
 await page.getByRole('option', { name: 'Fiscal', exact: true }).click();
 const fiscalMonth = page.getByRole('combobox', { name: 'Year-end month', exact: true });
 await fiscalMonth.click();
 await page.getByRole('option', { name: 'June', exact: true }).click();
 await expect(fiscalMonth).toHaveText('June');
 await basis.click();
 await page.getByRole('option', { name: 'Calendar', exact: true }).click();
 await expect(month).toHaveText('December');
 const quarter = page.getByRole('combobox', { name: 'Quarter', exact: true });
 await quarter.click();
 await page.getByRole('option', { name: '2nd', exact: true }).click();
 const sheets = page.getByRole('textbox', { name: 'Sheets attached', exact: true });
 await sheets.fill('3');
 const mode = page.getByRole('radiogroup', { name: 'Type of payment', exact: true });
 const installment = field(page, 'frm0605:txtNumOfInstallment');
 await expect(installment).toHaveCount(0);
 await mode.getByRole('radio', { name: 'Installment', exact: true }).check();
 await installment.fill('2');
 await field(page, 'frm0605:txtTax19').fill('15000');
 await field(page, 'frm0605:txtTax20A').fill('50.25');
 await field(page, 'frm0605:txtTax20B').fill('12.30');
 await field(page, 'frm0605:txtTax20C').fill('7.45');
 await expect(field(page, 'frm0605:txtTax20D')).toHaveText('₱70.00');
 await expect(field(page, 'frm0605:txtTax21')).toHaveText('₱15,070.00');
 await field(page, 'frm0605:txtTax20C').fill('invalid');
 await expect(field(page, 'frm0605:txtTax21')).toHaveText('—');
 await field(page, 'frm0605:txtTax20C').fill('7.45');
 await page.getByRole('button', { name: 'Save draft', exact: true }).click();
 await expect(page).toHaveURL(/\/forms$/);
 const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns.find((record: { formCode: string }) => record.formCode === '0605'));
 expect(saved.values['frm0605:txtNumOfInstallment']).toBe('2');
 expect(saved.values['frm0605:itemYearEndMonth']).toBe('12');
 expect(saved.values['frm0605:txtTax21']).toBe('15070.00');
 await page.getByRole('row').filter({ hasText: '0605' }).getByRole('link', { name: 'Edit', exact: true }).click();
 await expect(quarter).toHaveText('2nd');
 await expect(sheets).toHaveValue('3');
 await expect(installment).toHaveValue('2');
 await expect(month).toHaveText('December');
 await expect(field(page, 'frm0605:txtTax21')).toHaveText('₱15,070.00');
 for (const width of [1280, 430]) {
  await page.setViewportSize({ width, height: 900 });
  const closeSidebar = page.getByRole('button', { name: 'Close sidebar', exact: true });
  if (await closeSidebar.isVisible()) await closeSidebar.click();
  await page.getByRole('region', { name: 'Return period' }).screenshot({
   path: testInfo.outputPath(`0605-period-${width}.png`), animations: 'disabled'
  });
 }
 await page.setViewportSize({ width: 1280, height: 900 });
 await page.getByRole('link', { name: /back to forms/i }).click();
 await expect(page).toHaveURL(/\/forms$/);
 const pdf = testInfo.outputPath('0605-calculated-values.pdf');
 const printed = await printSavedReturn(page, '0605', pdf);
 await expect(field(printed, 'frm0605:itemYearEndMonth')).toHaveText(/December/i);
 const text = execFileSync('pdftotext', ['-layout', pdf, '-'], { encoding: 'utf8' });
 expect(text).toMatch(/12\s*-\s*DECEMBER/i);
 expect(text).toMatch(/15,?070\.00/);
});

test('0605 searches named tax types and uses the selected code in its PDF', async ({ page }) => {
 await seedWorkspace(page);
 await create(page, '0605');
 const taxType = field(page, 'frm0605:txtTaxTypeCode');
 await expect(taxType).toHaveAttribute('role', 'combobox', { timeout: 3000 });
 await taxType.click();
 const search = page.getByPlaceholder('Search tax type code or name', { exact: true });
 await search.fill('income tax');
 await expect(page.getByRole('option', { name: /IT.*Income Tax/ })).toBeVisible();
 await search.press('Enter');
 await expect(taxType).toContainText('IT');
 await expect(taxType).toContainText('Income Tax');
 await page.getByRole('button', { name: 'Save draft', exact: true }).click();
 await expect(page).toHaveURL(/\/forms$/);
 const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns.find((record: { formCode: string }) => record.formCode === '0605'));
 expect(saved.values['frm0605:txtTaxTypeCode']).toBe('IT');
 const html = await page.evaluate(async values => {
  const base = '/src/lib';
  const { getFormDefinition } = await import(`${base}/forms/index.ts`);
  const { buildReturnReport } = await import(`${base}/printing/return-report.ts`);
  return buildReturnReport(getFormDefinition('0605'), values, 'Draft', 'long');
 }, saved.values);
 const printed = await page.context().newPage();
 await printed.setContent(html);
 await expect(field(printed, 'txtTaxTypeCode')).toHaveValue('IT');
});

test('individual 0605 locks December and calendar basis', async ({ page }) => {
 await seedWorkspace(page);
 await page.addInitScript(() => {
  const native = (window as any).__TAURI_INTERNALS__;
  const invoke = native.invoke;
  native.invoke = async (command: string, args: unknown) => {
   const result = await invoke(command, args);
   return command === 'list_taxpayer_profiles' ? result.map((profile: object) => ({ ...profile, taxpayerClassification: 'I' })) : result;
  };
 });
 await create(page, '0605');
 await expect(field(page, 'frm0605:itemYearEndMonth')).toHaveText('December');
 await expect(page.locator('output[id="frm0605:itemYearEndMonth"]')).toHaveAccessibleName('Year-end month');
 const basis = page.locator('output[id="frm0605:itemFiscalStartMonth"]');
 await expect(basis).toHaveAccessibleName('Year basis');
 await expect(basis).toHaveText('Calendar');
});

test('0619F updates its suggested due date with the reporting period and keeps an edited date on reopen', async ({ page }, testInfo) => {
	await seedWorkspace(page, 'light', 'loaded', {}, []);
	await page.clock.setFixedTime(new Date('2025-12-31T16:00:00Z'));
	await create(page, '0619F');
	const prefix = 'frm0619F:';
	const due = dateControl(page, prefix + 'dueDate');
	const month = due.getByRole('spinbutton', { name: 'Month', exact: true });
	const day = due.getByRole('spinbutton', { name: 'Day', exact: true });
	const year = due.getByRole('spinbutton', { name: 'Year', exact: true });
	const withheld = page.getByRole('radiogroup', { name: 'Any tax withheld?' });
	await expect(month).toHaveValue('01');
	await expect(day).toHaveValue('10');
	await expect(year).toHaveValue('2026');
	await expect(page.getByRole('combobox', { name: 'Tax type', exact: true })).toContainText('WB');
	await expect(withheld.locator('input:checked')).toHaveCount(0);
	for (const width of [1280, 390]) {
		await page.setViewportSize({ width, height: 900 });
		const box = (await due.boundingBox())!;
		const calendar = (await due.getByRole('button', { name: 'Open calendar', exact: true }).boundingBox())!;
		const yearBox = (await year.boundingBox())!;
		expect(yearBox.x + yearBox.width).toBeLessThanOrEqual(calendar.x);
		expect(calendar.x + calendar.width).toBeLessThanOrEqual(box.x + box.width);
		await page.screenshot({ path: testInfo.outputPath(`0619f-fresh-defaults-${width}.png`), fullPage: true });
	}
	await page.setViewportSize({ width: 1280, height: 900 });

	const reportingMonth = page.getByRole('combobox', { name: 'Month', exact: true });
	await reportingMonth.click();
	await page.getByRole('option', { name: 'November', exact: true }).click();
	await expect(month).toHaveValue('12');
	await expect(year).toHaveValue('2025');

	await fillDate(page, prefix + 'dueDate', '2025-12-15');
	await reportingMonth.click();
	await page.getByRole('option', { name: 'October', exact: true }).click();
	await expect(day).toHaveValue('15');
	await expect(month).toHaveValue('12');
	await withheld.getByRole('radio', { name: 'No', exact: true }).check();
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await page.getByRole('row').filter({ hasText: '0619F' }).getByRole('link', { name: 'Edit', exact: true }).click();
	await expect(day).toHaveValue('15');
	await expect(month).toHaveValue('12');
	await expect(withheld.getByRole('radio', { name: 'No', exact: true })).toBeChecked();
});

test('1601EQ leaves filing choices open and preserves explicit answers after save', async ({ page }, testInfo) => {
	await seedWorkspace(page, 'light', 'loaded', {}, []);
	await page.clock.setFixedTime(new Date('2026-12-31T16:00:00Z'));
	await create(page, '1601EQ');
	await expect(field(page, 'frm1601EQ:txtYear')).toHaveValue('2027');
	const quarter = page.getByRole('combobox', { name: 'Quarter', exact: true });
	const withheld = page.getByRole('radiogroup', { name: 'Any taxes withheld?' });
	await expect(quarter).toHaveText('Select an option');
	await expect(withheld.locator('input:checked')).toHaveCount(0);
	await page.screenshot({ path: testInfo.outputPath('1601eq-fresh-defaults.png'), fullPage: true });

	await quarter.click();
	await page.getByRole('option', { name: 'Third Quarter', exact: true }).click();
	await withheld.getByRole('radio', { name: 'No', exact: true }).check();
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await page.getByRole('row').filter({ hasText: '1601EQ' }).getByRole('link', { name: 'Edit', exact: true }).click();
	await expect(quarter).toHaveText('Third Quarter');
	await expect(withheld.getByRole('radio', { name: 'No', exact: true })).toBeChecked();
});
