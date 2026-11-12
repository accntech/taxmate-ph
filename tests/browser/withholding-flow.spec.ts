import { expect, test, type Page } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

const listPath = `/ebirforms/taxpayers/${taxpayerId}/forms`;
const field = (page: Page, id: string) => page.locator(`[id="${id}"]`);
const dateControl = (page: Page, id: string) => page.locator('[data-slot="date-input"]').filter({ has: field(page, id) });

async function fillDate(page: Page, id: string, iso: string) {
	const [year, month, day] = iso.split('-');
	const date = dateControl(page, id);
	await date.getByRole('spinbutton', { name: 'Month', exact: true }).fill(month);
	await date.getByRole('spinbutton', { name: 'Day', exact: true }).fill(day);
	await date.getByRole('spinbutton', { name: 'Year', exact: true }).fill(year);
	await date.getByRole('spinbutton', { name: 'Year', exact: true }).press('Tab');
}

async function openDisclosure(page: Page, title: string) {
	const summary = page.locator('summary').filter({ hasText: title }).first();
	const details = summary.locator('..');
	if (await details.getAttribute('open') === null) await summary.click();
}

test('adding an ATC schedule row opens it and moves keyboard focus to its first field', async ({ page }) => {
	await seedWorkspace(page);
	await create(page, '1601E');
	await page.getByRole('button', { name: 'Add row to Computation by ATC', exact: true }).click();
	await expect(field(page, 'frm1601E:txtAtcCode2')).toBeVisible();
	await expect(field(page, 'frm1601E:txtAtcCode2')).toBeFocused();
});

test('new withholding templates reuse the searchable ATC picker and packaged tax rate', async ({ page }) => {
	await seedWorkspace(page);
	await create(page, '1601E');
	await page.getByRole('radiogroup', { name: 'Any tax withheld?' }).getByLabel('Yes', { exact: true }).check();
	const atc = field(page, 'frm1601E:txtAtcCode1');
	await expect(atc).toHaveAttribute('role', 'combobox');
	await atc.click();
	const search = page.getByPlaceholder('Search code or income', { exact: true });
	await search.fill('WI120');
	await expect(page.getByRole('option', { name: /WI120/ })).toContainText('2%');
	await search.press('Enter');
	await field(page, 'frm1601E:txtTaxBase1').fill('100000');
	await expect(field(page, 'frm1601E:txtTaxbeWithHeld1')).toContainText('2,000.00');
});

async function create(page: Page, code: string) {
	await page.goto(listPath);
	await page.getByRole('button', { name: 'Create return', exact: true }).click();
	await page.getByRole('combobox', { name: 'Search BIR forms' }).fill(code);
	await page.getByRole('option', { name: new RegExp(`^BIR Form ${code} `) }).click();
	await expect(page.getByRole('heading', { name: `BIR Form ${code}`, exact: true })).toBeVisible();
}

test('0619E saves and reloads calculations, finalizes and simulates submission without BIR requests', async ({ page }, testInfo) => {
	await page.setViewportSize({ width: 1440, height: 1100 });
	await seedWorkspace(page);
	const birRequests: string[] = [];
	page.on('request', request => { if (/bir\.gov\.ph/i.test(request.url())) birRequests.push(request.url()); });
	await create(page, '0619E');
	await field(page, 'frm0619E:txtYear').fill('2025');
	await page.getByRole('combobox', { name: 'Month', exact: true }).click();
	await page.getByRole('option', { name: 'February', exact: true }).click();
	await fillDate(page, 'frm0619E:dueDate', '2025-03-10');
	await page.getByRole('radiogroup', { name: 'Amended return?' }).getByLabel('Yes', { exact: true }).check();
	await field(page, 'frm0619E:txtTax14').fill('10000');
	await openDisclosure(page, 'Remittances and credits');
	await field(page, 'frm0619E:txtTax15').fill('2000');
	await openDisclosure(page, 'Penalties');
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
	await page.getByRole('menuitem', { name: 'Mock submit', exact: true }).click();
	await expect(row).toContainText('Simulated');
	await expect(page.getByRole('status').last()).toContainText('Nothing sent to BIR');
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

test('a required schedule date error opens the collapsed section and focuses its date input', async ({ page }) => {
	await seedWorkspace(page);
	await create(page, '1604C');
	await field(page, 'frm1604c:txtYear').fill('2025');
	await openDisclosure(page, 'Schedule 1');
	await field(page, 'frm1604c:txtSched1TaxWheld1').fill('1000');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	const row = page.getByRole('row').filter({ hasText: '1604C' });
	await row.getByRole('button', { name: /^More actions/ }).click();
	await page.getByRole('menuitem', { name: 'Mark as final', exact: true }).click();
	await page.getByRole('link', { name: 'Edit return to fix errors', exact: true }).click();
	const date = field(page, 'frm1604c:txtSched1Date1');
	await expect(date).toHaveAttribute('aria-invalid', 'true');
	await page.locator('summary').filter({ hasText: 'Schedule 1' }).click();
	await expect(date).toBeHidden();
	await page.getByRole('alert').getByRole('link', { name: /^Date remitted:/ }).first().click();
	await expect(date).toBeFocused();
});

test('annual withholding exports its original layout with all monthly rows', async ({ page }, testInfo) => {
	await seedWorkspace(page);
	await create(page, '1604C');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await page.evaluate(() => {
		const native = (window as any).__TAURI_INTERNALS__;
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
 test(`0605 autoloads period and accepts searched or typed ATCs at ${width}px`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 960 });
  await seedWorkspace(page);
  await create(page, '0605');
  await expect(field(page, 'frm0605:txtYearEnded')).toHaveValue(String(new Date().getFullYear()));
  await expect(field(page, 'frm0605:itemYearEndMonth')).toBeEnabled();
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
 await expect(field(page, 'frm0605:itemYearEndMonth')).toBeDisabled();
 await expect(field(page, 'frm0605:itemFiscalStartMonth')).toBeDisabled();
});
