import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { seedWorkspace } from './fixtures';

for (const [code, branchId] of [
	['1700', 'txtPg1Pt1I5BranchCode'],
	['1701', 'txtPg1Pt1I5TIN4']
] as const) {
	test(`June 2013 Form ${code} prints a saved three-digit branch code`, async ({ page, context }) => {
		await page.route('**/__legacy-branch-test', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html>' }));
		await page.goto('/__legacy-branch-test');
		const html = await page.evaluate(async ({ code, branchId }) => {
			const base = '/src/lib';
			const { getFormDefinition } = await import(`${base}/forms/index.ts`);
			const { buildReturnReport } = await import(`${base}/printing/return-report.ts`);
			return buildReturnReport(getFormDefinition(code), { [`frm${code}:${branchId}`]: '078' }, 'Draft', 'a4');
		}, { code, branchId });
		const print = await context.newPage();
		await print.setContent(html);
		await print.emulateMedia({ media: 'print' });
		const branch = print.locator(`[data-legacy-print-id="${branchId}"]`);
		await expect(branch.locator('[data-legacy-branch-part]')).toHaveText(['0', '0', '7', '8']);
		const pdf = await print.pdf({ preferCSSPageSize: true, printBackground: true });
		const firstPage = execFileSync('pdftotext', ['-f', '1', '-l', '1', '-layout', '-', '-'], { input: pdf }).toString();
		expect(firstPage).toMatch(/\b0[^\S\r\n]*0[^\S\r\n]*7[^\S\r\n]*8\b/);
	});
}

test('June 2013 Form 1701 uses the active HTA artwork and prints entered values', async ({ page, context }) => {
	await page.route('**/__legacy-1701-print-test', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html>' }));
	await page.goto('/__legacy-1701-print-test');
	const html = await page.evaluate(async () => {
		const base = '/src/lib';
		const { getFormDefinition } = await import(`${base}/forms/index.ts`);
		const { getIndividualIncomeForm, createIndividualIncomeValues } = await import(`${base}/forms/individual-income/index.ts`);
		const { buildReturnReport } = await import(`${base}/printing/return-report.ts`);
		const form = getIndividualIncomeForm('1701');
		const values = createIndividualIncomeValues(form, {
			tin1: '001', tin2: '234', tin3: '567', branchCode: '00008', rdoCode: '047',
			taxpayerName: 'SANTOS, ALEX, REYES', birthDate: '1984-02-29', address: '28 Narra Street',
			contactNumber: '0285550148', email: 'alex.santos@example.test', taxpayerClassification: 'I',
			tradeName: 'Santos Advisory', psicCode: '69200'
		});
		return buildReturnReport(getFormDefinition('1701'), {
			...values, [form.year]: '2017', 'frm1701:rdoPg1Pt1I4ATC': 'Business',
			'frm1701:txtPg5Sc1I1NameOfEmp': 'Sample Employer', 'frm1701:txtPg1Pt3I38CashDrawee': 'PAY01'
		}, 'Draft', 'a4');
	});
	const print = await context.newPage();
	await print.setContent(html);
	await print.emulateMedia({ media: 'print' });
	await expect(print.locator('.legacy-1701-ocr')).toHaveCount(12);
	await expect(print.locator('.legacy-1701-ocr img').last()).toHaveAttribute('alt', /page 12/);
	await expect(print.locator('[data-legacy-print-id="txtPg1Pt1I8TaxFiler"]')).toHaveText('SANTOS ALEX REYES');
	await expect(print.locator('[data-legacy-print-id="txtPg1Pt1I9TradeName"]')).toHaveText('SANTOS ADVISORY');
	await expect(print.locator('[data-legacy-print-id="txtPg1Pt1I18PSIC"]')).toHaveText('6920');
	await expect(print.locator('[data-legacy-print-id="rdoPg1Pt1I4Business"]')).toHaveText('X');
	await expect(print.locator('[data-legacy-print-id="txtPg1Pt1I11MonthD"]')).toHaveText('29');
	await expect(print.locator('[data-legacy-print-id="ddlPg1Pt1I6RDOCode"]')).toHaveText('047');
	await expect(print.locator('[data-legacy-print-id="txtPg1Pt1I5TIN4"]')).toHaveText('0008');
	await expect(print.locator('[data-legacy-print-id="ddlPg11Sc12AI12KindPSCSC1"]')).toBeEmpty();
	const pdf = await print.pdf({ preferCSSPageSize: true, printBackground: true });
	const text = execFileSync('pdftotext', ['-layout', '-', '-'], { input: pdf }).toString();
	const geometry = execFileSync('pdfinfo', ['-f', '1', '-l', '12', '-'], { input: pdf }).toString();
	function pageSize(pageNumber: number): [number, number] {
		const match = geometry.match(new RegExp(`^Page\\s+${pageNumber}\\s+size:\\s+([\\d.]+) x ([\\d.]+) pts`, 'm'));
		return [Number(match?.[1]), Number(match?.[2])];
	}
	expect(geometry).toMatch(/^Pages:\s+12$/m);
	const [page1Width, page1Height] = pageSize(1);
	const [page12Width, page12Height] = pageSize(12);
	expect(page1Width).toBeLessThan(page1Height);
	expect(page12Width).toBeGreaterThan(page12Height);
	expect(text).toContain('SANTOS ALEX REYES');
	expect(text).toContain('SANTOS ADVISORY');
	expect(text).toContain('6920');
	expect(text).toContain('SAMPLE EMPLOYER');
	expect(text).not.toContain('PAY01');
});

test('Form 1701-MS does not let the side-by-side tax tables shrink the form', async ({ page, context }) => {
	await page.route('**/__legacy-1701-print-test', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html>' }));
	await page.goto('/__legacy-1701-print-test');
	const html = await page.evaluate(async () => {
		const base = '/src/lib';
		const { getFormDefinition } = await import(`${base}/forms/index.ts`);
		const { buildReturnReport } = await import(`${base}/printing/return-report.ts`);
		return buildReturnReport(getFormDefinition('1701MS'), {}, 'Draft', 'a4');
	});
	const print = await context.newPage();
	await print.setContent(html);
	await print.emulateMedia({ media: 'print' });
	const second = print.locator('[data-income-page="2"]');
	await expect(second.getByText('View Details', { exact: true }).first()).toBeHidden();
	const sheet = (await second.boundingBox())!;
	const first = (await print.locator('[data-income-page="1"]').boundingBox())!;
	const rates = (await second.getByText('Continuation of Table 2', { exact: true }).boundingBox())!;
	expect(rates.x + rates.width).toBeLessThanOrEqual(sheet.x + sheet.width + 1);
	expect(sheet.width).toBeGreaterThan(500);
	expect(sheet.width).toBeCloseTo(first.width, 1);
});

test('Form 1701A prints the chosen month as text in its source slot', async ({ page, context }) => {
	await page.route('**/__legacy-1701-print-test', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html>' }));
	await page.goto('/__legacy-1701-print-test');
	const html = await page.evaluate(async () => {
		const base = '/src/lib';
		const { getFormDefinition } = await import(`${base}/forms/index.ts`);
		const { buildReturnReport } = await import(`${base}/printing/return-report.ts`);
		return buildReturnReport(getFormDefinition('1701A'), {
			'frm1701A:txtMonth': '06', 'frm1701A:txtYear': '2025', 'frm1701A:optShortPeriod': 'Y'
		}, 'Draft', 'a4');
	});
	const print = await context.newPage();
	await print.setContent(html);
	await print.emulateMedia({ media: 'print' });
	const month = print.locator('[id="frm1701A:txtMonth"]');
	await expect(month).toHaveText('06');
	await expect(month).toHaveClass('individual-income-print-choice');
	await expect(print.locator('select[id="frm1701A:txtMonth"]')).toHaveCount(0);
});

test('Legal paper stays selected and sets the PDF page size', async ({ page, context }) => {
	await seedWorkspace(page);
	await page.goto('/settings');
	const paper = page.getByRole('combobox', { name: 'Paper size' });
	await expect(paper).toContainText('Long / Folio', { timeout: 15_000 });
	await paper.click();
	await page.getByRole('option', { name: /Legal/ }).click();
	await page.reload();
	await expect(paper).toContainText('Legal');

	for (const [code, pages] of [['1701v2018', 4], ['1701MS', 2]] as const) {
		const html = await page.evaluate(async (formCode) => {
			const base = '/src/lib';
			const { getFormDefinition } = await import(`${base}/forms/index.ts`);
			const { buildReturnReport } = await import(`${base}/printing/return-report.ts`);
			const { settings } = await import(`${base}/settings.svelte.ts`);
			return buildReturnReport(getFormDefinition(formCode), {}, 'Draft', settings.prefs.paperSize);
		}, code);
		const print = await context.newPage();
		await print.setContent(html);
		const pdf = await print.pdf({ preferCSSPageSize: true, printBackground: true });
		const geometry = execFileSync('pdfinfo', ['-f', '1', '-l', String(pages), '-'], { input: pdf }).toString();
		expect(geometry).toMatch(new RegExp(`^Pages:\\s+${pages}$`, 'm'));
		expect(geometry.match(/^Page\s+\d+\s+size:\s+612 x 1008 pts/gm)).toHaveLength(pages);
		await print.close();
	}
});
