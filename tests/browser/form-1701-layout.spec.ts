import { expect, test, type Page } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

const list = `/ebirforms/taxpayers/${taxpayerId}/forms`;
const filingYear = (page: Page) => page.getByRole('group', { name: 'Filing period', exact: true })
	.getByRole('spinbutton', { name: 'Year', exact: true });
const profile = {
	taxpayerName: 'SANTOS, ALEX, REYES', taxpayerClassification: 'I' as const,
	taxpayerType: 'professional' as const, civilStatus: 'Single' as const,
	tradeName: 'Santos Advisory', psicCode: '69200'
};

async function openReturn(page: Page, code: string, width = 1440, joint = false, theme = 'light') {
	await seedWorkspace(page, theme, 'loaded', { ...profile, civilStatus: joint ? 'Married' : 'Single' });
	await page.setViewportSize({ width, height: 1040 });
	await page.goto(`${list}/${code}?new=true`);
	await expect(page.locator('.income-editor')).toBeVisible({ timeout: 20000 });
	if (width <= 390) {
		const sidebar = page.locator('aside.sidebar');
		const toggle = page.getByRole('button', { name: 'Toggle sidebar', exact: true });
		await expect(toggle).toBeVisible();
		if (await sidebar.getAttribute('data-mobile-open') === 'true') await toggle.click();
		await page.keyboard.press('Escape');
		await expect(sidebar).not.toHaveAttribute('data-mobile-open', 'true');
		await expect.poll(async () => (await sidebar.boundingBox())!.x, { timeout: 15000 }).toBeLessThan(-245);
	}
	if (joint) {
		await page.getByRole('radiogroup', { name: /spouse has income/i }).getByRole('radio', { name: 'Yes', exact: true }).check();
		await page.getByRole('radiogroup', { name: 'Filing status', exact: true }).getByRole('radio', { name: /Joint/ }).check();
	}
}

async function enableAttachments(page: Page) {
	await page.getByRole('radiogroup', { name: /Exempt income\?/i }).getByRole('radio', { name: 'Yes', exact: true }).check();
	await page.getByRole('radiogroup', { name: /Income subject to a special rate\?/i }).getByRole('radio', { name: 'Yes', exact: true }).check();
}

const multipleActivities = (page: Page) => page.getByRole('radio', { name: 'Two or more exempt or special-rate activities', exact: true });

async function chooseDeduction(page: Page, query: string, label: string, pickerName = 'Add a deduction') {
	const picker = page.getByRole('combobox', { name: pickerName, exact: true });
	await picker.press('Enter');
	const search = page.getByPlaceholder('Search deductions', { exact: true });
	await expect(search).toBeFocused();
	await search.fill(query);
	await expect(page.getByRole('option', { name: label, exact: true })).toBeVisible();
	await search.press('Enter');
}

async function expandSections(page: Page) {
	const closed = page.locator('.income-editor details:not([open]) > summary');
	while (await closed.count()) await closed.first().click();
}

async function captureEvidence(page: Page, name: string) {
	if (!process.env.FORM_1701_CAPTURE_DIR) return;
	const { mkdirSync } = await import('node:fs');
	const { join } = await import('node:path');
	const directory = join(process.env.FORM_1701_CAPTURE_DIR, 'populated');
	mkdirSync(directory, { recursive: true });
	await page.evaluate(async () => {
		await document.fonts.ready;
		if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
	});
	await page.locator('.income-editor').screenshot({
		path: join(directory, `${name}.png`), animations: 'disabled', scale: 'css',
		style: '.eq-action-bar, .window-titlebar, .skip-link { visibility: hidden !important; }'
	});
}

test('June 1701 filing details end in one full-width divider below the ATC field', async ({ page }, info) => {
	test.setTimeout(120_000);
	await seedWorkspace(page, 'dark', 'loaded', profile);
	await page.setViewportSize({ width: 1680, height: 900 });
	await page.goto(`${list}/1701?new=true`);
	const filing = page.getByRole('region', { name: 'Filing details', exact: true }).locator('.return-filing');
	const atc = filing.locator('[data-income-item="4"]');
	await expect(atc).toBeVisible({ timeout: 90_000 });
	const rightGutter = await atc.evaluate(row => row.parentElement!.getBoundingClientRect().right - row.getBoundingClientRect().right);
	expect(rightGutter).toBeGreaterThan(0);
	await expect(filing).toHaveCSS('border-block-end-width', '1px');
	await expect(atc).toHaveCSS('border-block-end-width', '0px');
	await expect(filing.locator('[data-income-item="3"]')).toHaveCSS('border-block-end-width', '1px');
	await filing.screenshot({ path: info.outputPath('filing-divider-desktop.png'), animations: 'disabled' });

	for (const width of [1100, 390]) {
		await page.setViewportSize({ width, height: 900 });
		await expect(filing).toHaveCSS('border-block-end-width', '0px');
		await expect(atc).toHaveCSS('border-block-end-width', '1px');
	}
	await filing.screenshot({ path: info.outputPath('filing-divider-narrow.png'), animations: 'disabled' });
});

test('January 1701 edits non-operating income in separate Items 19 and 20', async ({ page }, info) => {
	await openReturn(page, '1701v2018', 1440, true);
	await goToReturnPage(page, 2);
	const field = (suffix: string) => page.locator(`[id="frm1701:txtPg2IShed3_${suffix}"]`);
	for (const [item, label, taxpayer, spouse] of [
		[19, 'Rental income', '1200', '300'],
		[20, 'Interest income', '450', '600']
	] as const) {
		const description = field(`${item}Desc`);
		await expect(description).toBeEditable();
		const row = page.locator(`tr[data-income-item="${item}"]`).filter({ has: description });
		await expect(row.locator('td').first()).toHaveText(String(item));
		await expect(description).toHaveAttribute('maxlength', '100');
		await description.fill(label);
		await field(`${item}A`).fill(taxpayer);
		await field(`${item}B`).fill(spouse);
		await field(`${item}B`).blur();
	}
	await expect(field('22A')).toHaveText('₱1,650');
	await expect(field('22B')).toHaveText('₱900');
	await expect(page.getByRole('dialog')).toHaveCount(0);
	for (const width of [1440, 390]) {
		await page.setViewportSize({ width, height: 920 });
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
		await field('19Desc').scrollIntoViewIfNeeded();
		await page.screenshot({ path: info.outputPath(`1701v2018-inline-19-20-${width}.png`), animations: 'disabled' });
	}
});

test('January 1701 edits Item 17D inline in Schedule 4', async ({ page }, info) => {
	await seedWorkspace(page, 'light', 'loaded', profile, [{
		id: 'inline-services', taxpayerId, formCode: '1701v2018', returnPeriod: '2025', status: 'Draft', finalFlag: '0',
		updatedAt: 1794441600000, values: {
			'frm1701:txtPg1I1Year': '2025',
			'frm1701:rdoPg1I7ATC': 'II012',
			'frm1701:rdoPg1I21AMethodDeduction': 'Itemized',
			'frm1701:txtPg3IShed4_17dDesc': 'Existing services',
			'frm1701:txtPg3IShed4_17dA': '750'
		}
	}]);
	await page.goto(`${list}/1701v2018?return=inline-services`);
	await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 45000 });
	await goToReturnPage(page, 3);
	const schedule = page.getByRole('region', { name: 'Schedule 4 · Ordinary itemized deductions', exact: true });
	const row = schedule.locator('[data-income-item="17D"]');
	const description = row.locator('[id="frm1701:txtPg3IShed4_17dDesc"]');
	const amount = row.locator('[id="frm1701:txtPg3IShed4_17dA"]');
	await expect(description).toHaveValue('Existing services');
	await expect(amount).toHaveValue('750');
	await description.fill('Equipment maintenance');
	await amount.fill('900');
	await amount.blur();
	await expect(schedule.locator('[id="frm1701:txtPg3IShed4_18A"]')).toHaveText('₱900');
	await expect(page.getByRole('dialog')).toHaveCount(0);
	for (const width of [1440, 390]) {
		await page.setViewportSize({ width, height: 920 });
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
		await row.screenshot({
			path: info.outputPath(`1701v2018-inline-17d-${width}.png`), animations: 'disabled',
			style: '.eq-action-bar { position: static !important; }'
		});
	}
});

test('January 1701 edits Part VII Item 9 inline', async ({ page }, info) => {
	await openReturn(page, '1701v2018');
	await goToReturnPage(page, 4);
	const field = (item: string) => page.locator(`[id="frm1701:txtPg4IPart7_${item}"]`);
	const description = field('9Specify');
	await expect(description).toBeEditable();
	const row = page.locator('tr[data-income-item="9"]').filter({ has: description });
	await expect(row.getByRole('rowheader')).toContainText(/other tax credits/i);
	await description.fill('Credit certificate');
	await row.locator('[id="frm1701:txtPg4IPart7_9A"]').fill('250');
	await row.locator('[id="frm1701:txtPg4IPart7_9A"]').blur();
	await expect(field('10A')).toHaveText('₱250');
	await expect(page.getByRole('dialog')).toHaveCount(0);
	for (const width of [1440, 390]) {
		await page.setViewportSize({ width, height: 920 });
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
		await row.screenshot({
			path: info.outputPath(`1701v2018-inline-part-vii-9-${width}.png`), animations: 'disabled',
			style: '.eq-action-bar { position: static !important; }'
		});
	}
});

test('1701 operating-loss headings and totals share one divider', async ({ page }) => {
	await openReturn(page, '1701v2018');
	await goToReturnPage(page, 3);
	const computation = page.getByRole('region', { name: 'Schedule 6 · Computation of net operating loss', exact: true });
	for (const width of [390, 1280]) {
		await page.setViewportSize({ width, height: 900 });
		await expect(computation.locator('header')).toHaveCSS('border-block-end-width', '1px');
		await expect(computation.locator('.schedule-drawer-summary')).toHaveCSS('border-block-start-width', '0px');
	}
});

test('1701 empty deduction schedules share the heading and summary rules', async ({ page }) => {
	await openReturn(page, '1701v2018');
	await goToReturnPage(page, 3);
	const deductions = page.getByRole('region', { name: 'Schedule 5 · Special deductions · Taxpayer', exact: true });
	const empty = deductions.getByText('No items added', { exact: true });
	await expect(deductions.locator('header')).toHaveCSS('border-block-end-width', '1px');
	await expect(empty).toHaveCSS('border-block-start-width', '0px');
	await expect(empty).toHaveCSS('border-block-end-width', '0px');
	for (const width of [1440, 390]) {
		await page.setViewportSize({ width, height: 960 });
		await expect(empty).toHaveCSS('text-align', 'start');
		await expect(empty).toHaveCSS('font-weight', '400');
		await expect(empty).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
		await expect(deductions.getByRole('button', { name: 'Add item', exact: true })).toBeEnabled();
	}
	await expect(deductions.locator('.schedule-drawer-summary')).toHaveCSS('border-block-start-width', '1px');
});

for (const code of ['1701', '1701v2018']) {
	test(`${code} joint mobile references name each filer and open the matching amount`, async ({ page }) => {
		await openReturn(page, code, 390, true);
		const references = code === '1701' ? [
			['From Item 72A · Taxpayer', 'frm1701:txtPg3Pt5I72TotalIncomeTaxC1'],
			['From Item 72B · Spouse', 'frm1701:txtPg3Pt5I72TotalIncomeTaxC2']
		] : [
			['From Part VII, Item 10A · Taxpayer', 'frm1701:txtPg4IPart7_10A'],
			['From Part VII, Item 10B · Spouse', 'frm1701:txtPg4IPart7_10B']
		];
		for (const [label, target] of references) {
			await goToReturnPage(page, 1);
			const reference = page.getByRole('button', { name: label, exact: true });
			await expect(reference).toBeVisible();
			await reference.click();
			await expect(page.locator(`[id="${target}"]`)).toBeFocused();
		}
		if (code === '1701') {
			await goToReturnPage(page, 1);
			await expect(page.getByRole('button', { name: 'From Item 84 · Both filers', exact: true })).toBeVisible();
		}
	});
}

test('June 1701 item reference opens and focuses the tax-due calculation', async ({ page }) => {
	await openReturn(page, '1701');
	await filingYear(page).fill('2017');
	const taxDue = page.getByRole('table', { name: 'Calculated tax amounts' }).getByRole('row', { name: /^26 / });
	await taxDue.getByRole('button', { name: 'From Item 72A · Taxpayer', exact: true }).click();
	await expect(page.locator('[id="frm1701:txtPg3Pt5I72TotalIncomeTaxC1"]')).toBeFocused();
	await expect(page.getByRole('button', { name: 'Find a page, page 3 of 12', exact: true })).toBeVisible();
	await goToReturnPage(page, 1);
	await expect(filingYear(page)).toHaveValue('2017');
});

test('January 1701 item reference reaches the tax-credit total by keyboard on mobile', async ({ page }) => {
	await openReturn(page, '1701v2018', 390);
	const taxCredits = page.getByRole('table', { name: 'Calculated tax amounts' }).getByRole('row', { name: /^23 / });
	const reference = taxCredits.getByRole('button', { name: 'From Part VII, Item 10A · Taxpayer', exact: true });
	await reference.focus();
	await reference.press('Enter');
	await expect(page.locator('[id="frm1701:txtPg4IPart7_10A"]')).toBeFocused();
	await expect(page.getByRole('navigation', { name: 'Return pages' }).getByRole('button', { name: /^Find a page,/ })).toHaveText('Page 4 of 4');
});

test('January 1701 links to separate activity inputs only for multiple activities', async ({ page }) => {
	await openReturn(page, '1701v2018');
	await enableAttachments(page);
	await goToReturnPage(page, 5);
	const pager = page.getByRole('navigation', { name: 'Return pages' });
	const findPage = pager.getByRole('button', { name: /^Find a page,/ });
	await expect(findPage).toHaveText('Page 5 of 6');
	const oneActivity = page.getByRole('radio', { name: 'One exempt or special-rate activity', exact: true });
	await oneActivity.check();
	const consolidation = page.getByRole('table', { name: 'Schedule B · Consolidated income tax', exact: true });
	await page.getByRole('button', { name: /Show \d+ more income items/ }).click();
	const activityReference = consolidation.getByRole('button', { name: 'From Part XI, Schedule B, Item 1A · Taxpayer', exact: true });
	await expect(consolidation.getByRole('button', { name: 'From Schedule C, Item 18B · Taxpayer', exact: true })).toBeVisible();
	await expect(activityReference).toHaveCount(0);
	await goToReturnPage(page, 6);
	await expect(pager.getByRole('button', { name: 'Next page', exact: true })).toHaveCount(0);
	await findPage.click();
	const picker = page.getByRole('dialog', { name: 'Go to page', exact: true });
	await expect(picker.getByRole('option')).toHaveCount(6);
	await picker.getByRole('option', { name: /^Page 5 ·/ }).click();
	await multipleActivities(page).check();
	await expect(findPage).toHaveText('Page 5 of 8');
	await activityReference.click();
	await expect(page.locator('[id="frm1701:txtPg3mSchedB_1ATYPE"]')).toBeFocused();
	await goToReturnPage(page, 5);
	await oneActivity.check();
	await expect(findPage).toHaveText('Page 5 of 6');
	await expect(page.getByRole('button', { name: 'Open activity attachment', exact: true })).toHaveCount(0);
	await expect(activityReference).toHaveCount(0);
});

test('January 1701 saves two separate activities and consolidates their sales', async ({ page }) => {
	await openReturn(page, '1701v2018');
	await filingYear(page).fill('2025');
	await enableAttachments(page);
	await goToReturnPage(page, 5);
	const consolidatedSales = page.locator('[id="frm1701:txtPg1mI1BSchdB"]');
	const oneActivity = page.getByRole('radio', { name: 'One exempt or special-rate activity', exact: true });
	await oneActivity.check();
	await consolidatedSales.fill('725');
	await consolidatedSales.blur();
	await multipleActivities(page).check();
	await page.getByRole('button', { name: 'Open activity attachment', exact: true }).click();
	const sales = page.locator('[id="frm1701:txtPg3mSchedB_1ATYPE"]');
	const chooseSpecialRate = page.getByRole('radio', { name: 'Special Rate', exact: true });
	await chooseSpecialRate.check();
	await expandSections(page);
	await sales.fill('70000');
	await sales.blur();
	const addActivity = page.getByRole('button', { name: 'Add activity', exact: true });
	await expect(addActivity).toBeVisible();
	await addActivity.click();
	await chooseSpecialRate.check();
	await expandSections(page);
	await expect(sales).not.toHaveValue('70,000');
	await sales.fill('55000');
	await sales.blur();
	const activities = page.getByRole('combobox', { name: 'Activity', exact: true });
	const chooseActivity = async (number: number) => {
		const option = activities.getByRole('option', { name: new RegExp(`^Activity ${number}\\b`) });
		await activities.selectOption(await option.evaluate((element: HTMLOptionElement) => element.value));
	};
	await chooseActivity(1);
	await expect(sales).toHaveValue('70,000');
	await page.getByRole('button', { name: 'Remove activity', exact: true }).click();
	await expect(activities.getByRole('option')).toHaveCount(1);
	await goToReturnPage(page, 5);
	await expect(consolidatedSales).toHaveText('₱55,000');
	await goToReturnPage(page, 7);
	await page.getByRole('button', { name: 'Undo removal', exact: true }).click();
	await expect(activities.getByRole('option')).toHaveCount(2);
	await chooseActivity(2);
	await expect(sales).toHaveValue('55,000');
	await goToReturnPage(page, 5);
	await expect(consolidatedSales).toHaveText('₱125,000');
	await oneActivity.check();
	await expect(consolidatedSales).toHaveValue('725');
	await consolidatedSales.fill('850');
	await consolidatedSales.blur();
	await multipleActivities(page).check();
	await expect(consolidatedSales).toHaveText('₱125,000');
	await captureEvidence(page, '2018-01-two-activities-consolidation');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	await page.getByRole('link', { name: /^Edit BIR Form 1701v2018,/ }).click();
	await expect(page.locator('.income-editor')).toBeVisible();
	await goToReturnPage(page, 5);
	await expect(consolidatedSales).toHaveText('₱125,000');
	await oneActivity.check();
	await expect(consolidatedSales).toHaveValue('850');
	await multipleActivities(page).check();
	await goToReturnPage(page, 7);
	await chooseActivity(1);
	await expect(sales).toHaveValue('70,000');
	await chooseActivity(2);
	await expect(sales).toHaveValue('55,000');
	await page.getByRole('radio', { name: 'Exempt', exact: true }).check();
	await goToReturnPage(page, 5);
	await expect(page.locator('[id="frm1701:txtPg1mI1ASchdB"]')).toHaveText('₱55,000');
	await expect(consolidatedSales).toHaveText('₱70,000');
	const exemptSource = page.getByRole('button', { name: 'From Part XI, Schedule B, Item 1A (Exempt) · Taxpayer', exact: true });
	await exemptSource.click();
	await expect(activities.locator('option:checked')).toHaveText('Activity 2 · Exempt');
	await expect(sales).toBeFocused();
	await sales.blur();
	await expect(sales).toHaveValue('55,000');
});

test('June 1701 keeps optional descriptions and their amounts within the mobile drawer', async ({ page }) => {
	await openReturn(page, '1701', 390);
	await enableAttachments(page);
	await goToReturnPage(page, 16);
	const deductions = page.getByRole('table', { name: /Schedule H .*Ordinary itemized deductions/ });
	await deductions.locator('[data-record-fields~="frm1701:txtPg4mScHI36NatureOfIncomeC1TYPE"]').click();
	const drawer = page.getByRole('dialog', { name: 'Add item', exact: true });
	const amount = drawer.locator('[id="frm1701:txtPg4mScHI36C2TYPE"]');
	const description = drawer.locator('[id="frm1701:txtPg4mScHI36NatureOfIncomeC1TYPE"]');
	await expect(description).toBeVisible();
	await expect(amount).toBeVisible();
	const amountInView = await amount.evaluate(input =>
		input.getBoundingClientRect().right <= input.closest('dialog')!.getBoundingClientRect().right
	);
	expect(amountInView).toBe(true);
});

test('June 1701 shows the other accounting field only for the matching election', async ({ page }) => {
	await openReturn(page, '1701');
	const accounting = page.getByRole('combobox', { name: 'Accounting method', exact: true });
	const detail = page.locator('[id="frm1701:txtPg1Pt1I21Others"]');
	await expect(detail).toHaveCount(0);
	await accounting.click();
	await page.getByRole('option', { name: 'Other (specify)', exact: true }).click();
	await expect(detail).toBeVisible();
	await detail.fill('Hybrid method');
	await accounting.click();
	await page.getByRole('option', { name: 'Cash', exact: true }).click();
	await expect(detail).toHaveCount(0);
	await accounting.click();
	await page.getByRole('option', { name: 'Other (specify)', exact: true }).click();
	await expect(detail).toHaveValue('Hybrid method');
});

test('June 1701 uses the full taxpayer name above schedules', async ({ page }) => {
	await openReturn(page, '1701');
	await goToReturnPage(page, 2);
	await expect(page.locator('.schedule-taxpayer')).toHaveText(profile.taxpayerName);
});

test('June 1701 identifies the amount regime beside the last consolidated row on mobile', async ({ page }) => {
	await openReturn(page, '1701', 390);
	await goToReturnPage(page, 12);
	const viewport = page.getByRole('region', { name: 'Taxpayer tax regimes', exact: true });
	const lastRow = viewport.locator('tbody tr').last();
	await lastRow.scrollIntoViewIfNeeded();
	await viewport.evaluate(element => { element.scrollLeft = element.scrollWidth; });
	const total = lastRow.getByText('Total', { exact: true });
	await expect(total).toBeInViewport();
});

test('June 1701 keeps the joint schedule item visible while scrolling to spouse amounts', async ({ page }) => {
	await openReturn(page, '1701', 390, true);
	await goToReturnPage(page, 2);
	const viewport = page.locator('.joint-schedule-viewport').first();
	const header = viewport.locator('th[scope="row"]').first();
	await expect(header).toBeVisible();
	const before = await header.evaluate(element => element.getBoundingClientRect().x);
	await viewport.evaluate(element => { element.scrollLeft = element.scrollWidth; });
	const after = await header.evaluate(element => element.getBoundingClientRect().x);
	expect(after).toBeCloseTo(before, 0);
});

test('1701 exclusive choices with three or more options use selects and preserve saved source codes', async ({ page }) => {
	await openReturn(page, '1701');
	const atc = page.getByRole('combobox', { name: 'Alphanumeric tax code (ATC)', exact: true });
	await expect(atc).toBeVisible();
	await atc.click();
	await page.getByRole('option', { name: 'Mixed', exact: true }).click();
	const accounting = page.getByRole('combobox', { name: 'Accounting method', exact: true });
	await accounting.click();
	await page.getByRole('option', { name: 'Accrual', exact: true }).click();
	await filingYear(page).fill('2017');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	const values = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns.find((record: { formCode: string }) => record.formCode === '1701').values);
	expect(values['frm1701:rdoPg1Pt1I4ATC']).toBe('Mixed');
	expect(values['frm1701:rdoPg1Pt1I21Accounting']).toBe('Accrual');
	await page.getByRole('row').filter({ hasText: 'BIR Form 1701' }).getByRole('link', { name: /^Edit BIR Form / }).click();
	await expect(atc).toContainText('Mixed');
	await expect(accounting).toContainText('Accrual');
});


for (const code of ['1701', '1701v2018']) {
	test(`${code} names the 40% optional standard deduction explicitly`, async ({ page }) => {
		await openReturn(page, code);
		if (code === '1701v2018') {
			await page.getByRole('combobox', { name: 'Alphanumeric tax code (ATC)', exact: true }).click();
			await page.getByRole('option', { name: /II012/ }).click();
		}
		await expect(page.getByRole('radio', { name: '40% Optional Standard Deduction (OSD)', exact: true })).toBeVisible();
	});
}

test('1701 January single-filer employer records its sole earner without an extra choice', async ({ page }) => {
	await openReturn(page, '1701v2018');
	await goToReturnPage(page, 2);
	await page.getByRole('region', { name: 'Employers', exact: true }).getByRole('button', { name: 'Add employer', exact: true }).click();
	const employer = page.getByRole('dialog', { name: 'Add employer', exact: true });
	await expect(employer.getByRole('radiogroup', { name: 'Income earner', exact: true })).toHaveCount(0);
	await expect(employer).toContainText('Taxpayer');
	await employer.getByRole('textbox', { name: 'Employer name · Taxpayer', exact: true }).fill('Example Employer');
	await employer.getByRole('textbox', { name: 'Employer TIN and branch code', exact: true }).fill('11122233300000');
	await employer.locator('[id="frm1701:txtPg2IShed1c_1CI"]').fill('500000');
	await employer.getByRole('button', { name: 'Add item', exact: true }).click();
	await expect(employer).toBeHidden();
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns.find((record: { formCode: string }) => record.formCode === '1701v2018').values);
	expect(saved['frm1701:chkPg2IShed1a_1']).toBe('1Taxpayer');
	expect(saved['frm1701:txtPg2IShed1c_1CI']).toBe('500000');
});

test('1701 January overpayment uses a select while preserving refund codes', async ({ page }) => {
	await openReturn(page, '1701v2018');
	await goToReturnPage(page, 4);
	const credit = page.locator('[id="frm1701:txtPg4IPart7_1A"]');
	await credit.fill('500');
	await credit.blur();
	await goToReturnPage(page, 1);
	const refund = page.locator('[id="frm1701:rdoPg1Overpayment"]');
	await expect(refund).toHaveAttribute('role', 'combobox');
	await refund.click();
	const options = page.getByRole('option');
	await expect(options).toHaveCount(3);
	await page.getByRole('option', { name: 'Refund', exact: true }).click();
	await filingYear(page).fill('2025');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns.find((record: { formCode: string }) => record.formCode === '1701v2018').values);
	expect(saved['frm1701:rdoPg1Overpayment']).toBe('Refund');
});

test('January 1701 clears an ineligible overpayment choice at zero', async ({ page }) => {
	await openReturn(page, '1701v2018');
	const refund = page.getByRole('combobox', { name: 'Apply overpayment as', exact: true });
	const setTaxCredits = async (amount: string) => {
		await goToReturnPage(page, 4);
		const credit = page.locator('[id="frm1701:txtPg4IPart7_1A"]');
		await credit.fill(amount);
		await credit.blur();
		await goToReturnPage(page, 1);
	};
	await setTaxCredits('500');
	await refund.click();
	await page.getByRole('option', { name: 'Refund', exact: true }).click();
	await expect(refund).toHaveText('Refund');
	await setTaxCredits('0');
	await expect(refund).toBeHidden();
	await setTaxCredits('500');
	await expect(refund).toBeEnabled();
	await expect(refund).not.toHaveText('Refund');
});

for (const width of [1440, 390]) {
	test(`1701 consolidated amounts display a populated value completely at ${width}px`, async ({ page }) => {
		await openReturn(page, '1701', width);
		await goToReturnPage(page, 5);
		const source = page.locator('[id="frm1701:txtPg5Sc2I1TaxPayerC1"]');
		await source.fill('123456789');
		await source.blur();
		await goToReturnPage(page, 12);
		const amount = page.locator('output[id="frm1701:txtPg12Pt9I1SalesC1"]');
		await expect(amount).toHaveText('₱123,456,789');
		const size = await amount.locator('..').evaluate(cell => ({ client: cell.clientWidth, scroll: cell.scrollWidth }));
		expect(size.client).toBeGreaterThanOrEqual(size.scroll);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
		await captureEvidence(page, `2013-06-regimes-${width}-left`);
		await page.locator('.regime-viewport').evaluateAll(areas => areas.forEach(area => area.scrollLeft = area.scrollWidth));
		await captureEvidence(page, `2013-06-regimes-${width}-right`);
	});
}

for (const [code, field] of [
	['1701', 'frm1701:txtPg2Pt4I42LessNonC1'],
	['1701v2018', 'frm1701:txtPg2IShed3_8A']
]) {
	test(`${code} mobile schedule shows the complete whole-peso amount after blur`, async ({ page }) => {
		await openReturn(page, code, 390);
		await goToReturnPage(page, 2);
		const amount = page.locator(`[id="${field}"]`);
		await amount.fill('123456789.12');
		await amount.blur();
		await expect(amount).toHaveValue('123,456,789');
		const size = await amount.evaluate((input: HTMLInputElement) => ({ client: input.clientWidth, scroll: input.scrollWidth }));
		expect(size.client).toBeGreaterThanOrEqual(size.scroll);
		await captureEvidence(page, `${code}-mobile-formatted-amount`);
	});
}

test('1701 January consolidation identifies each taxpayer and regime column', async ({ page }) => {
	await openReturn(page, '1701v2018', 1440, true);
	await enableAttachments(page);
	await goToReturnPage(page, 5);
	await expandSections(page);
	const schedule = page.getByRole('table', { name: /Schedule A.*Basis of Tax Relief/i });
	await expect(schedule).toBeVisible();
	const filer = page.getByRole('combobox', { name: 'Editing details for' });
	const taxpayerAgency = page.locator('[id="frm1701:txtPg1mI1ASchdA"]');
	const spouseAgency = page.locator('[id="frm1701:txtPg1mI1DSchdA"]');
	await expect(taxpayerAgency).toBeVisible();
	await taxpayerAgency.fill('Taxpayer agency');
	await filer.selectOption('spouse');
	await expect(taxpayerAgency).toBeHidden();
	await spouseAgency.fill('Spouse agency');
	await filer.selectOption('taxpayer');
	await expect(taxpayerAgency).toHaveValue('Taxpayer agency');
	await expect(spouseAgency).toBeHidden();
	for (const regime of ['Exempt', 'Special', 'Regular']) await expect(schedule).toContainText(regime);
	await captureEvidence(page, '2018-01-joint-consolidation-05');
	await goToReturnPage(page, 6);
	const picker = page.getByRole('combobox', { name: 'Add a deduction', exact: true });
	const showAll = page.getByRole('button', { name: 'Show all 20 deduction items', exact: true });
	await expect(picker).toBeVisible();
	await expect(showAll).toBeVisible();
	const [pickerBounds, buttonBounds] = await Promise.all([picker.boundingBox(), showAll.boundingBox()]);
	expect(buttonBounds!.x).toBeGreaterThan(pickerBounds!.x + pickerBounds!.width);
	expect(Math.abs(buttonBounds!.y - pickerBounds!.y)).toBeLessThanOrEqual(1);
	expect(Math.abs(buttonBounds!.height - pickerBounds!.height)).toBeLessThanOrEqual(1);
	await chooseDeduction(page, 'janitorial', '17A · Janitorial and messenger services');
	const amount = page.locator('[id="frm1701:txtPg2mI17aASchdC"]');
	await expect(amount).toBeFocused();
	await amount.fill('123456789.12');
	await amount.blur();
	const size = await amount.evaluate((input: HTMLInputElement) => ({ client: input.clientWidth, scroll: input.scrollWidth }));
	expect(size.client).toBeGreaterThanOrEqual(size.scroll);
	await showAll.click();
	await expect(page.getByRole('combobox', { name: 'Add a deduction', exact: true })).toBeHidden();
	await page.getByRole('button', { name: 'Show entered deductions', exact: true }).click();
	await expect(amount).toHaveValue('123,456,789');
	await expect(page.getByRole('combobox', { name: 'Add a deduction', exact: true })).toHaveText('Choose a deduction');
	await expect(page.locator('.income-editor')).not.toContainText(/(?:C[12]TYPE|\bm Sched|Desc Schd|LB Schd)/);
	await captureEvidence(page, '2018-01-joint-consolidation-06');

	await page.locator('summary').filter({ hasText: 'Consolidated special itemized deductions' }).click();
	await chooseDeduction(page, '1 · Special itemized deduction', '1 · Special itemized deduction', 'Add a special deduction');
	await expect(page.locator('[id="frm1701:txtPg2mI1DescSchdD"]')).toBeFocused();
});

test('1701 January matrix date segments fit beside the calendar button', async ({ page }) => {
	await openReturn(page, '1701v2018');
	await enableAttachments(page);
	await goToReturnPage(page, 5);
	await expandSections(page);
	const groups = page.getByRole('table', { name: /Schedule A.*Basis of Tax Relief/i }).locator('[data-slot="date-input"] [role="group"]');
	await expect(groups.first()).toBeVisible();
	const defects = await groups.evaluateAll(elements => elements.flatMap(group => {
		const outer = group.getBoundingClientRect();
		const segments = [...group.querySelectorAll('[role="spinbutton"]')].map(segment => segment.getBoundingClientRect());
		const calendar = group.querySelector('button')?.getBoundingClientRect();
		const outside = segments.some(segment => segment.x < outer.x || segment.right > outer.right);
		const overlaps = segments.some((segment, index) => index > 0 && segments[index - 1].right > segment.x + 1);
		const coversCalendar = calendar && segments.some(segment => segment.right > calendar.x + 1);
		return outside || overlaps || coversCalendar ? [{ id: group.id, outside, overlaps, coversCalendar }] : [];
	}));
	expect(defects).toEqual([]);
});

test('1701 January joint employers retain the taxpayer and spouse earner choices', async ({ page }) => {
	await openReturn(page, '1701v2018', 390, true);
	await goToReturnPage(page, 2);
	await page.getByRole('region', { name: 'Employers', exact: true }).getByRole('button', { name: 'Add employer', exact: true }).click();
	const employer = page.getByRole('dialog', { name: 'Add employer', exact: true });
	const earner = employer.getByRole('radiogroup', { name: 'Income earner', exact: true });
	await expect(earner.getByRole('radio', { name: 'Taxpayer', exact: true })).toBeVisible();
	await expect(earner.getByRole('radio', { name: 'Spouse', exact: true })).toBeVisible();
	await earner.getByRole('radio', { name: 'Spouse', exact: true }).check();
	await expect(earner.getByRole('radio', { name: 'Spouse', exact: true })).toBeChecked();
});

test('1701 January activity tax rates have percentage controls and readable labels', async ({ page }) => {
	await openReturn(page, '1701v2018');
	await enableAttachments(page);
	await goToReturnPage(page, 5);
	await multipleActivities(page).check();
	await goToReturnPage(page, 7);
	await expandSections(page);
	const rate = page.locator('[id="frm1701:txtPg3mSchedA_4ATYPE"]');
	await expect(rate).toBeVisible();
	await expect(rate.locator('..')).not.toContainText('₱');
	await expect(page.locator('.income-editor')).not.toContainText(/(?:C[12]TYPE|\bm Sched|Desc Schd|LB Schd|%\s*%)/);
});

for (const { code, revision, total } of [
	{ code: '1701', revision: '2013-06', total: 17 },
	{ code: '1701v2018', revision: '2018-01', total: 8 }
]) {
	for (const width of [1440, 390]) {
		test(`1701 ${revision} captures every expanded page at ${width}px`, async ({ page }) => {
			test.skip(!process.env.FORM_1701_CAPTURE_DIR, 'Capture is enabled with an output directory.');
			test.setTimeout(180000);
			const { mkdirSync } = await import('node:fs');
			const { join } = await import('node:path');
			const directory = join(process.env.FORM_1701_CAPTURE_DIR!, revision, width === 390 ? 'mobile' : 'desktop');
			mkdirSync(directory, { recursive: true });
			await openReturn(page, code, width, true);
			await filingYear(page).fill(code === '1701' ? '2017' : '2025');
			await enableAttachments(page);
			if (code === '1701v2018') {
				await goToReturnPage(page, 5);
				await multipleActivities(page).check();
				await goToReturnPage(page, 1);
			}
			const editor = page.locator('.income-editor');
			const pager = editor.getByRole('navigation', { name: 'Return pages' });
			for (let number = 1; number <= total; number += 1) {
				await expect(pager.getByRole('button', { name: /^Find a page,/ })).toHaveText(`Page ${number} of ${total}`);
				await expandSections(page);
				await expect(editor.locator('details:not([open])')).toHaveCount(0);
				const radios = await editor.getByRole('radiogroup').evaluateAll(groups => groups.map(group => ({
					label: group.getAttribute('aria-label'), count: group.querySelectorAll('[role="radio"], input[type="radio"]').length
				})).filter(group => group.count > 2));
				expect(radios).toEqual([]);
				await expect(editor).not.toContainText(/(?:C[12]TYPE|\bm Sched|Desc Schd|LB Schd|I Part9 \d|%\s*%)/);
				expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
				await page.evaluate(async () => {
					await document.fonts.ready;
					if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
				});
				await editor.screenshot({
					path: join(directory, `page-${String(number).padStart(2, '0')}.png`),
					animations: 'disabled', scale: 'css',
					style: '.eq-action-bar, .window-titlebar, .skip-link { visibility: hidden !important; }'
				});
				if (number < total) await pager.getByRole('button', { name: 'Next page', exact: true }).click();
			}
			await expect(pager.getByRole('button', { name: 'Next page', exact: true })).toHaveCount(0);
		});
	}
}

for (const { code, revision, total } of [
	{ code: '1701', revision: '2013-06', total: 17 },
	{ code: '1701v2018', revision: '2018-01', total: 8 }
]) {
	for (const width of [320, 390]) {
		test(`${code} joint ${width}px reference owners wrap cleanly on every page`, async ({ page }) => {
			test.setTimeout(180000);
			await openReturn(page, code, width, true);
			await enableAttachments(page);
			if (code === '1701v2018') {
				await goToReturnPage(page, 5);
				await multipleActivities(page).check();
			}
			const editor = page.locator('.income-editor');
			const pager = editor.getByRole('navigation', { name: 'Return pages' });
			let checked = 0;
			for (let number = 1; number <= total; number += 1) {
				await goToReturnPage(page, number);
				await expandSections(page);
				const defects = await editor.locator('.filer-reference-list').evaluateAll(lists => lists.flatMap(list => {
					const bounds = list.getBoundingClientRect();
					const buttons = [...list.querySelectorAll<HTMLButtonElement>('button[data-reference-target]')];
					return buttons.flatMap((button, index) => {
						const rect = button.getBoundingClientRect();
						const previous = index > 0 ? buttons[index - 1].getBoundingClientRect() : undefined;
						const atomicParts = [...button.querySelectorAll<HTMLElement>('.filer-reference-item, .filer-reference-owner')];
						const splitPart = atomicParts.some(part => {
							const lines = [...part.getClientRects()];
							return lines.length > 1 && Math.max(...lines.map(line => line.top)) - Math.min(...lines.map(line => line.top)) > 1;
						});
						const outside = rect.left < bounds.left - 1 || rect.right > bounds.right + 1;
						const clipped = button.scrollWidth > button.clientWidth + 1;
						const overlaps = previous && rect.top < previous.bottom - 1;
						const owner = button.querySelector('.filer-reference-owner')?.textContent?.trim();
						const shortCitation = /^From\s+Item\s+\d+[A-Z]?\s+·\s+(?:Taxpayer|Spouse|Both filers)$/.test(button.textContent?.trim() ?? '');
						const style = getComputedStyle(button);
						const lineHeight = Number.parseFloat(style.lineHeight);
						const verticalInsets = Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom) +
							Number.parseFloat(style.borderTopWidth) + Number.parseFloat(style.borderBottomWidth);
						const contentHeight = rect.height - verticalInsets;
						const tooManyLines = shortCitation && Number.isFinite(lineHeight) && contentHeight > lineHeight * 2 + 1;
						return outside || clipped || overlaps || splitPart || tooManyLines || !owner ? [{
							label: button.textContent?.trim(), outside, clipped, overlaps, splitPart, tooManyLines, owner
						}] : [];
					});
				}));
				expect.soft(defects, `Page ${number} reference label layout`).toEqual([]);
				await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
				const references = editor.locator('button[data-reference-target]');
				const count = await references.count();
				checked += count;
				if (count) {
					const reference = references.last();
					const target = await reference.getAttribute('data-reference-target');
					await reference.click();
					await expect(page.locator(`[id="${target}"]`)).toBeFocused();
					const drawer = page.getByRole('dialog');
					if (await drawer.isVisible()) await drawer.getByRole('button', { name: 'Cancel', exact: true }).click();
					await goToReturnPage(page, number);
					await expandSections(page);
				}
				if (process.env.FORM_1701_OWNER_CAPTURE_DIR) {
					const { mkdirSync } = await import('node:fs');
					const { join } = await import('node:path');
					const directory = join(process.env.FORM_1701_OWNER_CAPTURE_DIR, revision, `mobile-${width}`);
					mkdirSync(directory, { recursive: true });
					await page.evaluate(async () => {
						await document.fonts.ready;
						if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
					});
					await editor.screenshot({
						path: join(directory, `page-${String(number).padStart(2, '0')}.png`), animations: 'disabled', scale: 'css',
						style: '.eq-action-bar, .window-titlebar, .skip-link { visibility: hidden !important; }'
					});
				}
			}
			await expect(pager.getByRole('button', { name: /^Find a page,/ })).toHaveText(`Page ${total} of ${total}`);
			expect(checked).toBeGreaterThan(20);
		});
	}
}

for (const width of [1440, 390]) {
	test(`1701 January edits deductions and operating losses in drawers at ${width}px`, async ({ page }, testInfo) => {
		await openReturn(page, '1701v2018', width, false, width === 1440 ? 'dark' : 'light');
		await filingYear(page).fill('2025');
		await page.getByRole('combobox', { name: 'Alphanumeric tax code (ATC)', exact: true }).click();
		await page.getByRole('option', { name: /II012/ }).click();
		await goToReturnPage(page, 3);

		const field = (id: string) => page.locator(`[id="frm1701:txtPg3IShed${id}"]`);
		const special = 'Schedule 5 · Special deductions · Taxpayer';
		const computation = 'Schedule 6 · Computation of net operating loss';
		const carryover = 'Schedule 6 · Loss carryover · Taxpayer';
		const section = (name: string) => page.getByRole('region', { name, exact: true });
		const action = (name: string, label: string) => section(name).getByRole('button', { name: label, exact: true });

		await expect(field('5_1Desc')).toHaveCount(0);
		await expect(section(special).getByText('No items added', { exact: true })).toBeVisible();
		await action(special, 'Add item').click();
		const deductions = page.getByRole('dialog', { name: special, exact: true });
		await expect(deductions).toBeVisible();
		await expect.poll(async () => {
			const description = (await field('5_1Desc').locator('..').boundingBox())!;
			const legal = (await field('5_1Legal').locator('..').boundingBox())!;
			const amount = (await field('5_1Amt').locator('..').boundingBox())!;
			return {
				stacked: legal.y >= description.y + description.height + 8 && amount.y >= legal.y + legal.height + 8,
				aligned: [legal, amount].every(box => Math.abs(box.x - description.x) <= 1 && Math.abs(box.width - description.width) <= 1),
			};
		}).toEqual({ stacked: true, aligned: true });
		const addDeduction = deductions.getByRole('button', { name: 'Add item', exact: true });
		await addDeduction.click();
		await expect(field('5_1Desc')).toBeFocused();
		await expect(deductions.getByText('Enter the special deduction description.', { exact: true })).toBeVisible();
		await expect(deductions.getByText('Enter the legal basis for the special deduction.', { exact: true })).toBeVisible();
		await expect(deductions.getByText('Enter a deduction amount greater than zero.', { exact: true })).toBeVisible();
		await field('5_1Desc').fill('Eligible deduction');
		await field('5_1Legal').fill('Statutory provision');
		await field('5_1Amt').fill('1200');
		await field('5_1Amt').blur();
		await page.screenshot({ path: testInfo.outputPath(`1701-deductions-drawer-${width}.png`), animations: 'disabled' });
		await deductions.getByRole('button', { name: 'Add item', exact: true }).click();
		await expect(action(special, 'Edit Item 1')).toBeFocused();
		const deductionLine = section(special).getByRole('listitem').filter({ hasText: 'Eligible deduction' });
		await expect(deductionLine).toContainText('Legal basis · Statutory provision');
		await expect(deductionLine).toContainText('₱1,200');
		await action(special, 'Edit Item 1').click();
		await field('5_1Desc').fill('Discard this change');
		await page.keyboard.press('Escape');
		await expect(action(special, 'Edit Item 1')).toBeFocused();
		await expect(field('5_3')).toHaveJSProperty('tagName', 'OUTPUT');
		await expect(field('5_3')).toHaveText('₱1,200');
		await page.getByRole('button', { name: 'To Schedule 3.A, Item 14A · Taxpayer', exact: true }).click();
		await expect(page.locator('[id="frm1701:txtPg2IShed3_14A"]')).toBeFocused();
		await page.getByRole('button', { name: 'From Schedule 5, Item 3 · Taxpayer', exact: true }).click();
		await expect(field('5_3')).toBeFocused();

		await expect(action(computation, 'Edit details')).toHaveCount(0);
		await goToReturnPage(page, 2);
		await page.locator('[id="frm1701:txtPg2IShed3_8A"]').fill('900');
		await page.locator('[id="frm1701:txtPg2IShed3_8A"]').blur();
		await goToReturnPage(page, 3);
		await field('4_1A').fill('1500');
		await field('4_1A').blur();
		await expect(field('6_1A')).toHaveJSProperty('tagName', 'OUTPUT');
		await expect(field('6_1A')).toHaveText('₱900');
		await expect(field('6_2A')).toHaveText('₱1,500');
		await expect(field('6_3A')).toHaveText('-₱600');
		await page.getByRole('button', { name: 'To Schedule 6.A.1, Item 7A · Taxpayer', exact: true }).click();
		await expect(field('6_7A')).toBeFocused();
		await expect(field('6_7A')).toHaveText('₱600');
		const lossDrawer = page.getByRole('dialog', { name: carryover, exact: true });
		await lossDrawer.getByRole('button', { name: 'Cancel', exact: true }).click();
		await action(carryover, 'Add item').click();
		const addLoss = lossDrawer.getByRole('button', { name: 'Add item', exact: true });
		await field('6_4Year').fill('2026');
		await field('6_4A').fill('1000');
		await field('6_4D').fill('1400');
		await addLoss.click();
		await expect(field('6_4Year')).toBeFocused();
		await expect(lossDrawer.getByText('Enter a year before the filing year.', { exact: true })).toBeVisible();
		await expect(lossDrawer.getByText('Applied and expired amounts together cannot exceed the net operating loss.', { exact: true })).toBeVisible();
		await field('6_4Year').fill('2023');
		await field('6_4D').fill('400');
		await field('6_4D').blur();
		await field('6_4Year').locator('xpath=ancestor::fieldset[1]').scrollIntoViewIfNeeded();
		await expect(field('6_4E')).toHaveText('₱600');
		expect(await lossDrawer.evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth)).toBe(true);
		await page.screenshot({ path: testInfo.outputPath(`1701-carryover-drawer-${width}.png`), animations: 'disabled' });
		await lossDrawer.getByRole('button', { name: 'Add item', exact: true }).click();
		await expect(action(carryover, 'Edit Item 4')).toBeFocused();
		const lossLine = section(carryover).getByRole('listitem').filter({ hasText: '2023' });
		await expect(lossLine).toContainText('Net operating loss');
		await expect(lossLine).toContainText('Applied this year');
		await expect(lossLine).toContainText('Loss available to carry over');
		await expect(lossLine).toContainText('₱1,000');
		await expect(lossLine).toContainText('₱400');
		await expect(lossLine).toContainText('₱600');
		await expect(field('6_8D')).toHaveJSProperty('tagName', 'OUTPUT');
		await expect(field('6_8D')).toHaveText('₱400');
		await page.screenshot({ path: testInfo.outputPath(`1701-schedule-totals-${width}.png`), animations: 'disabled' });

		await page.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(page).toHaveURL(/\/forms$/);
		await page.getByRole('row').filter({ hasText: 'BIR Form 1701' }).getByRole('link', { name: /^Edit BIR Form / }).click();
		await goToReturnPage(page, 3);
		await expect(field('5_3')).toHaveText('₱1,200');
		await expect(field('6_8D')).toHaveText('₱400');
		await action(special, 'Edit Item 1').click();
		await expect(field('5_1Desc')).toHaveValue('Eligible deduction');
		await field('5_1Legal').clear();
		await deductions.getByRole('button', { name: 'Update', exact: true }).click();
		await expect(field('5_1Legal')).toBeFocused();
		await expect(deductions.getByText('Enter the legal basis for the special deduction.', { exact: true })).toBeVisible();
		await deductions.getByRole('button', { name: 'Cancel', exact: true }).click();
		await action(special, 'Edit Item 1').click();
		await expect(field('5_1Legal')).toHaveValue('Statutory provision');
	});
}

for (const width of [1440, 390]) {
	test(`1701 June edits joint deductions and operating losses in drawers at ${width}px`, async ({ page }, testInfo) => {
		await openReturn(page, '1701', width, true);
		await filingYear(page).fill('2017');
		await goToReturnPage(page, 8);
		const field = (id: string) => page.locator(`[id="frm1701:txtPg8Sc${id}"]`);
		const special = 'Schedule 7 · Special deductions';
		const computation = 'Schedule 8B · Computation of net operating loss · Spouse';
		const carryover = 'Schedule 8B.1 · Loss carryover · Spouse';
		const section = (name: string) => page.getByRole('region', { name, exact: true });
		const action = (name: string, label: string) => section(name).getByRole('button', { name: label, exact: true });
		const drawer = (name: string) => page.getByRole('dialog', { name, exact: true });
		const commit = (name: string, label: string) => drawer(name).getByRole('button', { name: label, exact: true }).click();

		await expect(field('7I1Description')).toHaveCount(0);
		await action(special, 'Add item').click();
		await field('7I1Description').fill('Eligible deduction');
		await field('7I1LegalBasis').fill('Statutory provision');
		await field('7I1TaxPayer').fill('1200');
		await field('7I1Spouse').fill('800');
		await field('7I1Spouse').blur();
		await page.screenshot({ path: testInfo.outputPath(`1701-june-deductions-${width}.png`), animations: 'disabled' });
		await commit(special, 'Add item');
		await expect(field('7I5TaxPayer')).toHaveText('₱1,200');
		await expect(field('7I5Spouse')).toHaveJSProperty('tagName', 'OUTPUT');
		await expect(field('7I5Spouse')).toHaveText('₱800');

		await action(computation, 'Edit details').click();
		await field('8BI1GrossIncome').fill('9x0');
		await commit(computation, 'Update');
		await expect(field('8BI1GrossIncome')).toBeFocused();
		await expect(field('8BI1GrossIncome')).toHaveAttribute('aria-invalid', 'true');
		await field('8BI1GrossIncome').fill('900');
		await field('8BI2TotalDeductions').fill('1500');
		await field('8BI2TotalDeductions').blur();
		await page.screenshot({ path: testInfo.outputPath(`1701-june-loss-computation-${width}.png`), animations: 'disabled' });
		await commit(computation, 'Update');
		await expect(field('8BI3NetOperatingLoss')).toHaveJSProperty('tagName', 'OUTPUT');
		await expect(field('8BI3NetOperatingLoss')).toHaveText('-₱600');
		await page.getByRole('button', { name: 'To Schedule 8B.1, Item 4A · Spouse', exact: true }).click();
		await expect(field('8B1I4Amount')).toBeFocused();
		await expect(field('8B1I4Amount')).toHaveText('₱600');
		await commit(carryover, 'Cancel');
		await action(carryover, 'Add item').click();
		await field('8B1I5YearIncurred').fill('2018');
		await field('8B1I5Amount').fill('1000');
		await commit(carryover, 'Add item');
		await expect(field('8B1I5YearIncurred')).toBeFocused();
		await expect(drawer(carryover).getByText('Enter a year from 2014 to 2017.', { exact: true })).toBeVisible();
		await field('8B1I5YearIncurred').fill('2016');
		await field('8B1I5NOLCOAppliedCurrentYear').fill('400');
		await field('8B1I5NOLCOAppliedCurrentYear').blur();
		await expect(field('8B1I5NetOperatingLoss')).toHaveText('₱600');
		expect(await drawer(carryover).evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth)).toBe(true);
		await page.screenshot({ path: testInfo.outputPath(`1701-june-loss-carryover-${width}.png`), animations: 'disabled' });
		await commit(carryover, 'Add item');
		await expect(action(carryover, 'Edit Item 5')).toBeFocused();
		await expect(field('8B1I8TotalNOLCO')).toHaveJSProperty('tagName', 'OUTPUT');
		await expect(field('8B1I8TotalNOLCO')).toHaveText('₱400');
		await page.screenshot({ path: testInfo.outputPath(`1701-june-schedule-totals-${width}.png`), animations: 'disabled' });

		await page.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(page).toHaveURL(/\/forms$/);
		await page.getByRole('row').filter({ hasText: 'BIR Form 1701' }).getByRole('link', { name: /^Edit BIR Form / }).click();
		await goToReturnPage(page, 8);
		await expect(field('7I5Spouse')).toHaveText('₱800');
		await expect(field('8B1I8TotalNOLCO')).toHaveText('₱400');
	});
}

test('January 1701 attachment pages use the full editor width and bottom pagination', async ({ page }) => {
	await openReturn(page, '1701v2018');
	await enableAttachments(page);
	await goToReturnPage(page, 5);
	await multipleActivities(page).check();
	const editor = page.locator('.income-editor');
	const pager = editor.getByRole('navigation', { name: 'Return pages' });
	for (let number = 5; number <= 8; number++) {
		await expect(editor.locator('nav[aria-label="Tax relief attachment pages"]')).toHaveCount(0);
		await expect(pager.getByRole('button', { name: /^Find a page,/ })).toHaveText(`Page ${number} of 8`);
		const bounds = await editor.evaluate(element => ({
			x: element.getBoundingClientRect().left + element.clientLeft,
			width: element.clientWidth
		}));
		const content = (await editor.locator('.attachment-content').boundingBox())!;
		expect(Math.abs(content.x - bounds.x)).toBeLessThan(1);
		expect(Math.abs(content.width - bounds.width)).toBeLessThan(1);
		if (number < 8) await pager.getByRole('button', { name: 'Next page', exact: true }).click();
	}
	await pager.getByRole('button', { name: 'Previous page', exact: true }).click();
	await expect(pager.getByRole('button', { name: /^Find a page,/ })).toHaveText('Page 7 of 8');
});

test('January 1701 attachment lets mobile filers choose a deduction and follow its calculated total', async ({ page }) => {
	await openReturn(page, '1701v2018', 390);
	await filingYear(page).fill('2025');
	await enableAttachments(page);
	await goToReturnPage(page, 5);
	const income = page.getByRole('table', { name: 'Schedule B · Consolidated income tax', exact: true });
	const specialSales = page.locator('[id="frm1701:txtPg1mI1BSchdB"]');
	await expect(page.getByRole('combobox', { name: 'Tax regime or total · Schedule B', exact: true })).toBeVisible();
	await expect(specialSales).toBeVisible();
	const exemptSales = income.locator('[id="frm1701:txtPg1mI1ASchdB"]');
	await expect(exemptSales).toBeHidden();
	await page.getByRole('combobox', { name: 'Tax regime or total · Schedule B', exact: true }).selectOption('Exempt');
	await expect(exemptSales).toBeVisible();
	await expect(specialSales).toBeHidden();

	await goToReturnPage(page, 6);
	const consolidatedRent = page.locator('[id="frm1701:txtPg2mI11BSchdC"]');
	await chooseDeduction(page, 'rent', '11 · Rent');
	await expect(consolidatedRent).toBeFocused();
	await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	await captureEvidence(page, '2018-01-single-consolidation-06-mobile');
	await goToReturnPage(page, 5);

	await page.getByRole('radio', { name: 'Two or more exempt or special-rate activities', exact: true }).check();
	await page.getByRole('button', { name: 'Open activity attachment', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Activity profile and income', exact: true })).toBeFocused();
	await page.getByRole('radio', { name: 'Special Rate', exact: true }).check();
	await goToReturnPage(page, 8);
	const rent = page.locator('[id="frm1701:txtPg4mSchedC_11ATYPE"]');
	await expect(rent).toBeHidden();
	await chooseDeduction(page, 'rent', '11 · Rent');
	await expect(rent).toBeFocused();
	await rent.fill('18000');
	await rent.blur();
	const total = page.locator('[id="frm1701:txtPg4mSchedC_18ATYPE"]');
	await expect(total).toHaveText(/₱18,000/);
	await page.getByRole('button', { name: 'To Part XI, Schedule B, Item 6A · Taxpayer', exact: true }).click();
	await expect(page.locator('[id="frm1701:txtPg3mSchedB_6ATYPE"]')).toBeFocused();
	await expect(page.locator('[id="frm1701:txtPg3mSchedB_6ATYPE"]')).toHaveText(/₱18,000/);
	await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	await page.getByRole('row').filter({ hasText: 'BIR Form 1701' }).getByRole('link', { name: /^Edit BIR Form / }).click();
	await expect(page.locator('.income-editor')).toBeVisible();
	await goToReturnPage(page, 8);
	await expect(rent).toHaveValue('18,000');
	await expect(total).toHaveText(/₱18,000/);
	await page.getByRole('button', { name: 'Review consolidation', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Tax relief and income', exact: true })).toBeFocused();
});
