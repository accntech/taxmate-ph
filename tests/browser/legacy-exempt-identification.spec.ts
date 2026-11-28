import { expect, test, type Page } from '@playwright/test';
import { philippineCalendarDate } from '../../src/lib/forms/filing-calendar';
import { seedWorkspace, taxpayerId } from './fixtures';

const formsPath = `/ebirforms/taxpayers/${taxpayerId}/forms`;
const id = (key: string) => `frm1702EX:${key}`;
const numberId = id('txtPg1Pt2I23CommunityTax');
const dateId = id('txtPg1Pt1I24DateofIssue');
const placeId = id('txtPg1Pt1I25PlaceofIssue');
const amountId = id('txtPg1Pt1I26Amount');
const control = (page: Page, key: string) => page.locator(`[id="${key}"]`);

async function fillDate(page: Page, year: string, month: string, day: string) {
	const date = page.locator('[data-slot="date-input"]').filter({ has: control(page, dateId) });
	await date.getByRole('spinbutton', { name: 'Year', exact: true }).fill(year);
	await date.getByRole('spinbutton', { name: 'Month', exact: true }).fill(month);
	const dayInput = date.getByRole('spinbutton', { name: 'Day', exact: true });
	await dayInput.fill(day);
	await dayInput.blur();
}

test('June 2013 1702EX switches CTC and SEC and keeps the active identification through save and reopen', async ({ page, context }, info) => {
	await seedWorkspace(page, 'dark', 'loaded', { taxpayerClassification: 'N' }, []);
	await page.goto(`${formsPath}/1702EX?new=true`);
	const ctc = page.getByRole('radio', { name: 'Community tax certificate', exact: true });
	const sec = page.getByRole('radio', { name: 'SEC registration', exact: true });
	const number = control(page, numberId);
	const amount = control(page, amountId);
	const place = control(page, placeId);
	const identification = page.getByRole('region', { name: 'Filing identification', exact: true });
	const issueMonth = control(page, dateId);
	const issueDay = page.getByRole('group', { name: /^Date of issue/i }).getByRole('spinbutton', { name: 'Day', exact: true });
	const issueYear = page.getByRole('group', { name: /^Date of issue/i }).getByRole('spinbutton', { name: 'Year', exact: true });
	await expect(ctc).toBeVisible({ timeout: 20_000 });
	await expect(amount).toBeDisabled();

	await ctc.check();
	await expect(number).toHaveAccessibleName('CTC number');
	await expect(number).toHaveAttribute('maxlength', '8');
	await expect(amount).toBeEnabled();
	await number.fill('00123456');
	const year = String(philippineCalendarDate().year);
	await fillDate(page, year, '01', '01');
	await place.fill('Example City');
	await amount.fill('925');
	await expect(issueMonth).toHaveValue('01');
	await expect(issueDay).toHaveValue('01');
	await expect(issueYear).toHaveValue(year);
	await identification.screenshot({ path: info.outputPath('1702ex-ctc-dark.png'), animations: 'disabled' });

	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(formsPath);
	const savedCertificate = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns[0].values);
	expect(savedCertificate).toMatchObject({ CTCorReg: 'CTC', [numberId]: '00123456', [dateId]: `01/01/${year}`,
		[placeId]: 'Example City', [amountId]: '925' });
	await page.getByRole('link', { name: /^Edit BIR Form / }).click();
	await expect(ctc).toBeChecked();
	await expect(number).toHaveValue('00123456');
	await expect(amount).toHaveValue('925');

	await sec.check();
	await expect(number).toHaveAccessibleName(/SEC registration number/i);
	await expect(number).toHaveAttribute('maxlength', '10');
	await expect(number).toHaveValue('');
	await expect(issueMonth).toHaveValue('');
	await expect(issueDay).toHaveValue('');
	await expect(issueYear).toHaveValue('');
	await expect(place).toHaveValue('Example City');
	await expect(amount).toBeDisabled();
	await number.fill('CS-00123');
	await fillDate(page, '2000', '02', '29');

	await ctc.check();
	await expect(number).toHaveValue('');
	await expect(issueMonth).toHaveValue('');
	await expect(issueDay).toHaveValue('');
	await expect(issueYear).toHaveValue('');
	await expect(place).toHaveValue('Example City');
	await expect(amount).toBeEnabled();
	await expect(amount).toHaveValue('0');

	await sec.check();
	await number.fill('CS-00123');
	await fillDate(page, '2000', '02', '29');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(formsPath);
	const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns[0].values);
	expect(saved).toMatchObject({ CTCorReg: 'Reg', [numberId]: 'CS-00123', [dateId]: '02/29/2000',
		[placeId]: 'Example City', [amountId]: '0' });
	await page.getByRole('link', { name: /^Edit BIR Form / }).click();
	await expect(sec).toBeChecked();
	await expect(number).toHaveValue('CS-00123');
	await expect(amount).toBeDisabled();
	await identification.screenshot({ path: info.outputPath('1702ex-sec-dark.png'), animations: 'disabled' });

	const reports = await page.evaluate(async (drafts) => {
		const forms = '/src/lib/forms/index.ts';
		const report = '/src/lib/printing/return-report.ts';
		const { getFormDefinition } = await import(forms);
		const { buildReturnReport } = await import(report);
		const reports: string[] = [];
		for (const values of drafts) reports.push(await buildReturnReport(getFormDefinition('1702EX'), values, 'Draft', 'a4'));
		return reports;
	}, [savedCertificate, saved]);
	const print = await context.newPage();
	for (const [index, kind, expected] of [
		[0, 'ctc', { p1I40: '00123456', p1I41: '01', p1I42: '01', p1I43: year, p1I44: 'Example City', p1I45: '925' }],
		[1, 'sec', { p1I40: 'CS-00123', p1I41: '02', p1I42: '29', p1I43: '2000', p1I44: 'Example City', p1I45: '0' }]
	] as const) {
		await print.setContent(reports[index]);
		const first = print.locator('.withholding-print-page').first();
		for (const [element, value] of Object.entries(expected)) {
			await expect(first.locator(`[id="${element}"]`)).toHaveText(value);
		}
		await print.emulateMedia({ media: 'print' });
		await print.pdf({ path: info.outputPath(`1702ex-${kind}-draft.pdf`), preferCSSPageSize: true, printBackground: true });
	}
});

for (const code of ['1702MX', '1702RT'] as const) {
	test(`June 2013 ${code} switches CTC and SEC and reopens the saved registration`, async ({ page }) => {
		const p = `frm${code}:`;
		await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(`${formsPath}/${code}?new=true`);
		const identification = page.getByRole('region', { name: 'Filing identification', exact: true });
		await expect(identification).toBeVisible({ timeout: 45000 });
		const amount = control(page, p + 'txtPg1Pt2I25AmountCTC');
		const number = control(page, p + (code === '1702RT' ? 'txtPg1Pt2I22CTC' : 'txtPg1Pt2I22'));
		await expect(amount).toBeDisabled();
		await page.getByRole('radio', { name: 'Community tax certificate', exact: true }).check();
		await expect(number).toHaveAccessibleName('CTC number');
		await number.fill('00123456');
		await amount.fill('925');
		await page.getByRole('radio', { name: 'SEC registration', exact: true }).check();
		await expect(number).toHaveValue('');
		await expect(number).toHaveAccessibleName('SEC registration number');
		await expect(amount).toBeDisabled();
		await number.fill('CS-00123');
		const date = identification.getByRole('group', { name: /^Date of issue/ });
		await date.getByRole('spinbutton', { name: 'Year', exact: true }).fill('2000');
		await date.getByRole('spinbutton', { name: 'Month', exact: true }).fill('02');
		await date.getByRole('spinbutton', { name: 'Day', exact: true }).fill('29');
		await identification.getByRole('textbox', { name: 'Place of issue', exact: true }).fill('Example City');
		await page.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(page).toHaveURL(formsPath);
		await page.getByRole('link', { name: /^Edit BIR Form / }).click();
		await expect(number).toHaveValue('CS-00123');
		await expect(page.getByRole('radio', { name: 'SEC registration', exact: true })).toBeChecked();
		await expect(amount).toBeDisabled();
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	});
}
