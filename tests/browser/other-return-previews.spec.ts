import { execFileSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, test, type Locator } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

const output = process.env.BIR_RETURN_PREVIEW_DIR;
const codes = [
	'0605', '0619E', '0619F', '1600', '1600PTv2018', '1600VTv2018', '1600WP',
	'1601C', '1601Cv2018', '1601E', '1601EQ', '1601F', '1601FQ', '1602', '1602Qv2018',
	'1603', '1603Qv2018', '1604C', '1604CF', '1604E', '1604Ev2018', '1604F', '1606',
	'1700', '1700v2018', '1701', '1701v2018', '1701A', '1701MS', '1701Q', '1701Qv2018'
];
const list = `/ebirforms/taxpayers/${taxpayerId}/forms`;
const legacyPageCountIds: Record<string, string> = {
	'1700': 'txtPg1Pt2NumberofPagesFiled',
	'1701': 'txtPg1Pt2I33PagesFilled'
};
const withholdingPages: Record<string, number> = {
	'1600PTv2018': 2, '1600VTv2018': 2, '1601Cv2018': 2, '1601F': 2, '1601FQ': 2,
	'1602': 2, '1602Qv2018': 3, '1603Qv2018': 2, '1604Ev2018': 2, '1604F': 2
};

async function expectAmountsAligned(surface: Locator, context: string) {
	const misaligned = await surface.locator('input[inputmode="decimal"]:visible').evaluateAll(inputs =>
		inputs.filter(input => !['right', 'end'].includes(getComputedStyle(input).textAlign)).map(input => input.id));
	expect(misaligned, context).toEqual([]);
	await expect.poll(() => surface.locator(':is([data-slot="currency-input"] input, .signed-schedule-amount input, input[data-amount-input]):visible').evaluateAll(inputs => {
		const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
		return inputs.flatMap(input => {
			const style = getComputedStyle(input.parentElement!);
			const insets = [style.paddingInlineStart, style.paddingInlineEnd, style.paddingBlockStart, style.paddingBlockEnd].map(parseFloat);
			const minimum = [.75, .75, .375, .375];
			return insets.some((inset, side) => inset + .1 < minimum[side] * rem) ? [{ id: input.id, insets }] : [];
		});
	}), { message: `${context} currency input padding` }).toEqual([]);
}

async function expectPaymentAmountColumn(form: Locator, code: string, width: number) {
	const inputSelector = code === '0605'
		? (width < 768 ? '#computation-of-tax ~ * input[inputmode="decimal"]' : '.basic-tax input[inputmode="decimal"], .penalties > :last-child input[inputmode="decimal"]')
		: code === '1601EQ' ? '.paper-summary .paper-amount-row input[inputmode="decimal"]'
		: code.startsWith('0619') ? '.remittance-row input[inputmode="decimal"]'
		: '.form-paper-part-two > :is(.form-paper-money, [data-computation-item]) input[inputmode="decimal"]';
	const totalSelector = code === '0605' ? '.payment-total output'
		: code === '1601EQ' ? '.paper-summary :is(.paper-total-row dd, .paper-final-total .eq-total)'
		: code.startsWith('0619') ? '.remittance-total output'
		: '.form-paper-part-two > .form-paper-total output';
	const inputs = form.locator(`:is(${inputSelector}):visible`);
	const totals = form.locator(`:is(${totalSelector}):visible`);
	if (!(await inputs.count()) || !(await totals.count())) return;
	const edges = [
		...await inputs.evaluateAll(elements => elements.map(input => ({ id: input.id, right: input.getBoundingClientRect().right }))),
		...await totals.evaluateAll(elements => elements.map(total => {
			const text = document.createRange();
			text.selectNodeContents(total);
			return { id: total.id || total.parentElement!.textContent?.trim(), right: text.getBoundingClientRect().right };
		}))
	];
	const reference = edges[0].right;
	expect(edges.filter(edge => Math.abs(edge.right - reference) > 2), `${code} amount column at ${width}px, target ${reference}px`).toEqual([]);
}

async function expectIncomeAmountColumns(form: Locator, context: string) {
	const mismatches = await form.locator('.income-editor table.tax-summary:visible').evaluateAll(tables =>
		tables.flatMap(table => {
			const columns = new Map<number, { id: string; right: number; editable: boolean }[]>();
			for (const cell of table.querySelectorAll('tbody td')) {
				const input = cell.querySelector('[data-slot="currency-input"] input, .signed-schedule-amount input, input[data-amount-input]');
				const total = cell.querySelector('output') ?? (cell.matches('.summary-value[id]') ? cell : null);
				if (!input && !total?.textContent?.includes('₱')) continue;
				const range = document.createRange();
				if (total) range.selectNodeContents(total);
				const right = input?.getBoundingClientRect().right ?? range.getBoundingClientRect().right;
				const column = Math.round(cell.getBoundingClientRect().right);
				const amounts = columns.get(column) ?? [];
				amounts.push({ id: (input ?? total)!.id, right, editable: Boolean(input) });
				columns.set(column, amounts);
			}
			return [...columns.values()].flatMap(amounts => {
				const reference = amounts.find(amount => amount.editable);
				return reference && amounts.some(amount => !amount.editable) ? amounts.filter(amount => Math.abs(amount.right - reference.right) > 2)
					.map(amount => ({ field: amount.id, columnReference: reference.id, offset: amount.right - reference.right })) : [];
			});
		})
	);
	expect(mismatches, context).toEqual([]);
}

async function expectDrawerAmountColumn(drawer: Locator, context: string) {
	const edges = await drawer.evaluate(element => {
		const amounts = [...element.querySelectorAll('[data-slot="currency-input"] input')].map(input => input.getBoundingClientRect().right);
		const totals = [...element.querySelectorAll('[data-slot="calculated-value"] output')].filter(output => output.textContent?.includes('₱')).map(output => {
			const text = document.createRange();
			text.selectNodeContents(output);
			return text.getBoundingClientRect().right;
		});
		return { amounts, totals };
	});
	if (!edges.amounts.length || !edges.totals.length) return;
	expect(edges.totals.filter(right => edges.amounts.every(edge => Math.abs(edge - right) > 2)), context).toEqual([]);
}

test('preview fixtures cover all implemented return revisions', async ({ page }) => {
	await page.route('**/__return_preview_fixture', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Return preview fixture</title>' }));
	await page.goto('/__return_preview_fixture');
	const implemented = await page.evaluate(async () => {
		const index = '/src/lib/forms/index.ts';
		const { listForms } = await import(index) as typeof import('../../src/lib/forms');
		return listForms().filter(form => form.status === 'ready').map(form => form.code).sort();
	});
	expect(implemented).toEqual([...codes].sort());
});

const previewCases = [
	...codes.map(code => ({ code, variant: '' })),
	{ code: '1701', variant: 'activity' },
	{ code: '1701v2018', variant: 'activity' }
];

for (const { code, variant } of previewCases) {
	test(`${code}${variant ? ` ${variant}` : ''} editor and PDF evidence`, async ({ page, context }) => {
		test.slow();
		await page.routeWebSocket('**/*', socket => socket.close());
		const profile = {
			id: taxpayerId,
			tin1: '001', tin2: '234', tin3: '567', branchCode: '0008', rdoCode: '047',
			taxpayerName: code.startsWith('17') ? 'SANTOS, ALEXANDRA, REYES' : 'EXAMPLE PROFESSIONAL SERVICES AND TRADING',
			address: '28 Narra Street, Barangay San Lorenzo', address2: 'Makati City', zipCode: '1209',
			contactNumber: '0285550148', category: 'P' as const, email: 'alex.santos@example.test',
			lineOfBusiness: 'PROFESSIONAL SERVICES', psocCode: '0110', taxpayerClassification: code.startsWith('17') ? 'I' as const : 'N' as const,
			birthDate: '1984-02-29', civilStatus: 'Single' as const, citizenship: 'FILIPINO'
		};
		await page.route('**/__return_preview_fixture', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Return preview fixture</title>' }));
		await page.goto('/__return_preview_fixture');
		const fixture = await page.evaluate(async ({ code, profile, variant }) => {
			const base = '/src/lib';
			const catalog = await import(`${base}/forms/index.ts`) as typeof import('../../src/lib/forms');
			const income = await import(`${base}/forms/individual-income/index.ts`) as typeof import('../../src/lib/forms/individual-income');
			const withholding = await import(`${base}/forms/withholding-definitions.ts`) as typeof import('../../src/lib/forms/withholding-definitions');
			const rules = await import(`${base}/forms/withholding-rules.ts`) as typeof import('../../src/lib/forms/withholding-rules');
			const runtime = await import(`${base}/forms/form-runtime.ts`) as typeof import('../../src/lib/forms/form-runtime');
			const report = await import(`${base}/printing/return-report.ts`) as typeof import('../../src/lib/printing/return-report');
			const incomeForm = income.getIndividualIncomeForm(code);
			const withholdingForm = withholding.getWithholdingDefinition(code);
			let values: Record<string, string>;
			if (incomeForm) {
				values = income.createIndividualIncomeValues(incomeForm, profile);
				values[incomeForm.year] = ['1700', '1701', '1701Q'].includes(code) ? '2017' : '2025';
				const amounts: Record<string, Record<string, string>> = {
					1700: { 'frm1700:txtPg2Pt4I1NameOfEmployer': 'EXAMPLE ENGINEERING SERVICES', 'frm1700:rdoPg2Pt4I1Employer': 'frm1700:rdoPg2Pt4I1TaxFiler',
						'frm1700:txtPg2Pt4I1ComIncomeC1': '820000', 'frm1700:txtPg3Pt5I7C1': 'SAMPLE PARCEL', 'frm1700:txtPg3Pt5I10C1': '50000',
						'frm1700:txtPg1Pt2NumberofPagesFiled': '99' },
					'1700v2018': { 'frm1700:rdoPg1I6TaxpayerType': 'Employee', 'frm1700:txtPg2I1PartVIEmployerName1': 'EXAMPLE ENGINEERING SERVICES', 'frm1700:txtPg2ISched1c_1REG': '900000', 'frm1700:txtPg2ISched1e_1TW': '78900' },
					1701: { 'frm1701:rdoPg1Pt1I4ATC': 'Business', 'frm1701:txtPg5Sc2I1TaxPayerC1': '920000', 'frm1701:txtPg5Sc2I4TaxPayerC1': '25000',
						'frm1701:txtPg9Sc9I1TaxPayerC1': '500000', 'frm1701:rdoPg1Pt2Overpayment': 'frm1701:rdoPg1Pt2OverpaymentRefunded',
						'frm1701:txtPg1Pt2I33PagesFilled': '99', 'frm1701:rdoPg1I34CTCGovID': 'frm1701:rdoPg1I34CTC',
						'frm1701:txtPg1Pt2I34CTC': '00123456', 'frm1701:txtPg1Pt2I35Month': '02/14/2018',
						'frm1701:txtPg1Pt2I36PlaceOfIssue': 'MAKATI CITY', 'frm1701:txtPg1Pt2I37AmountIfCTC': '125.50' },
					'1701v2018': { 'frm1701:rdoPg1I7ATC': 'II012', 'frm1701:rdoPg1I21AMethodDeduction': 'OSD', 'frm1701:txtPg2IShed3_8A': '1250000' },
					'1701A': { 'frm1701A:optTaxType': 'S', 'frm1701A:optATC': 'II012', 'frm1701A:txt36A': '1000000' },
					'1701MS': { 'frm1701MS:sourceOfIncomeTaxpayer': '3', 'frm1701MS:txtTaxpayerNo12a': '3', 'frm1701MS:txtSalesRevenuesFeesANo19a': '500000' },
					'1701Q': { 'frm1701q:txt26A': '100000', 'frm1701q:txt27A': '10000' },
					'1701Qv2018': { 'frm1701q:optATC': 'II012', 'frm1701q:optMethodOfDeduction': 'I', 'frm1701q:txt36A': '400000' }
				};
				Object.assign(values, amounts[code]);
				if (variant === 'activity') {
					const trigger = code === '1701' ? 'frm1701:rdoPg1Pt1I22IncomeExempt' : 'frm1701:rdoPg1I19IncomeExempt';
					values[trigger] = 'Yes';
				}
			} else if (withholdingForm) {
				const definition = withholdingForm;
				values = rules.createWithholdingValues(code, profile);
				const year = String(definition.maxYear ?? 2025);
				const fields = [
					...definition.sections.filter(section => section.id !== 'payment').flatMap(section => section.fields),
					...definition.schedules.flatMap(schedule => schedule.rows.slice(0, 1).flatMap(row => row.fields))
				];
				for (const field of fields) {
					if (field.profileKey || field.readonly || field.showWhen) continue;
					const current = values[field.id];
					if (field.type === 'money') values[field.id] = /surcharge|interest|compromise|penalt/i.test(field.label) ? '0' : '12500.50';
					else if (field.type === 'date') values[field.id] = `${year}-02-28`;
					else if (field.type === 'number') values[field.id] = /year/i.test(field.label) ? year : '1';
					else if (field.type === 'select') {
						const yes = /(?:optWithheld|optTaxesWithheld)$/.test(field.id) || (code === '0619F' && field.id.endsWith('optAmend'));
						values[field.id] = (yes ? field.options?.find(option => option.value === 'Y')?.value : undefined) || current || field.options?.[0]?.value || '';
					}
					else if (/atc/i.test(field.label)) values[field.id] = current || withholding.getWithholdingAtcs(code, 'P')[0]?.code || '';
					else if (/TIN/i.test(field.label)) values[field.id] = '9876543210000';
					else if (/RDO/i.test(field.label)) values[field.id] = '047';
					else if (/name/i.test(field.label)) values[field.id] = 'EXAMPLE ENGINEERING SERVICES';
				}
				if (code === '0605') {
					Object.assign(values, {
						'frm0605:itemYearEndMonth': '12', 'frm0605:txtATCCode': 'MC200', 'frm0605:txtTaxTypeCode': 'MC',
						'frm0605:itemMannerOfPayment': 'Self-assessment', 'frm0605:itemModeOfPayment': 'Full payment'
					});
				}
				if (code === '0619F') {
					Object.assign(values, {
						'frm0619F:txtTaxTypeCode': 'WF', 'frm0619F:txtTax13': '0',
						'frm0619F:txtTax14': '12500.50', 'frm0619F:txtTax16': '500'
					});
				}
				if (code === '1606') {
					Object.assign(values, {
						[definition.prefix + 'txtLocation']: '28 NARRA STREET, MAKATI CITY',
						[definition.prefix + 'txtTCT']: 'TCT-012345',
						[definition.prefix + 'txtTaxDC']: 'TD-2025-98765',
						[definition.prefix + 'sellerAddress']: '18 ACACIA STREET, MAKATI CITY',
						[definition.prefix + 'txtArea']: '95', [definition.prefix + 'j_id394']: 'N',
						[definition.prefix + 'txtSelling']: '350000', [definition.prefix + 'txtGross']: '350000',
						[definition.prefix + 'txtTaxRate']: '1.5', [definition.prefix + 'txtAmount']: '', [definition.prefix + 'txtTotalN']: ''
					});
				}
				values[definition.yearField] = year;
				if (definition.monthField) values[definition.monthField] = '02';
				if (definition.quarterField) values[definition.quarterField] = 'Q2';
			} else {
				const workspace = await import(`${base}/ebirforms/ebirforms-workspace.svelte.ts`) as typeof import('../../src/lib/ebirforms/ebirforms-workspace.svelte');
				values = { ...workspace.createInitialFormValues(profile), 'frm1601EQ:txtYear': '2025',
					'frm1601EQ:optQuarter': 'Q2', 'frm1601EQ:optTaxesWithheld': 'Y', 'frm1601EQ:txtATC13': 'WI120',
					'frm1601EQ:txtTaxBase13': '100000', 'frm1601EQ:txtRemittanceFirstMonth': '500' };
			}
			return {
				values, period: runtime.getReturnPeriod(code, values),
				html: await report.buildReturnReport(catalog.getFormDefinition(code)!, values, 'Draft', 'a4')
			};
		}, { code, profile, variant });
		await seedWorkspace(page, 'light', 'loaded', profile, [{
			id: 'preview-return', taxpayerId, formCode: code, returnPeriod: fixture.period,
			status: 'Draft', updatedAt: 1794441600000, finalFlag: '0', values: fixture.values
		}]);
		const directory = output && resolve(output, variant ? `${code}-${variant}` : code);
		if (directory) await mkdir(directory, { recursive: true });
		const form = page.getByRole('region', { name: `BIR Form ${code} workspace`, exact: true });
		const pageCountId = legacyPageCountIds[code];
		for (const width of [1440, 390]) {
			await page.setViewportSize({ width, height: 1000 });
			await page.goto(`${list}/${code}?return=preview-return`);
			await expect(form).toBeVisible({ timeout: 20000 });
			if (pageCountId) {
				await expect(form.getByText('Number of pages filed', { exact: true })).toHaveCount(0);
				await expect(form.locator(`[id="frm${code}:${pageCountId}"]`)).toHaveCount(0);
			}
			const header = form.locator('.paper-form-header');
			const title = header.getByRole('heading', { level: 1 });
			await expect(title).toBeVisible();
			await expect(title).toHaveCSS('text-align', 'start');
			await expect.poll(() => header.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
			await expect(header.getByText('BIR Form No.', { exact: true })).toBeVisible();
			await expect(header.getByText(/Republika ng Pilipinas|Republic of the Philippines/)).toHaveCount(0);
			await expect(header.locator('img')).toHaveCount(0);
			await page.keyboard.press('Escape');
			await page.evaluate(() => document.fonts.ready);
			let number = 1;
			const pager = form.getByRole('navigation', { name: 'Return pages' });
			const next = pager.getByRole('button', { name: 'Next page', exact: true });
			if (withholdingPages[code]) {
				await expect(pager).toContainText(`Page 1 of ${withholdingPages[code]}`);
				await expect(next).toBeEnabled();
			}
			while (true) {
				if (code.startsWith('17') && code !== '1701Q') await expect(pager.locator('..')).toHaveCSS('border-top-width', '0px');
				if (withholdingPages[code]) {
					await expect(pager).toContainText(`Page ${number} of ${withholdingPages[code]}`);
					await expect(form.locator('[data-return-page]:visible')).toHaveAttribute('data-return-page', String(number));
				}
				const problems = await form.evaluate(element => {
					const frame = element.getBoundingClientRect();
					const viewport = document.documentElement.clientWidth;
					const overflowingControls = [...element.querySelectorAll('input:not([type="hidden"]), [role="combobox"], textarea')]
						.filter(control => {
							const bounds = control.getBoundingClientRect();
							if (!bounds.width || control.closest('.regime-viewport')) return false;
							return bounds.left < frame.left - 1 || bounds.right > frame.right + 1;
						})
						.map(control => control.id || control.getAttribute('aria-label'));
					return {
						outsideViewport: frame.left < -1 || frame.right > viewport + 1,
						buttonCheckboxes: element.querySelectorAll('button input[type="checkbox"]').length,
						overflowingControls
					};
				});
				expect(problems, `${code} page ${number} at ${width}px`).toEqual({ outsideViewport: false, buttonCheckboxes: 0, overflowingControls: [] });
				await expectAmountsAligned(form, `${code} page ${number} at ${width}px`);
				if (!code.startsWith('17')) await expectPaymentAmountColumn(form, code, width);
				if (directory) {
					await form.screenshot({
						path: resolve(directory, `editor-${width}-page-${number}.png`), animations: 'disabled',
						style: '.eq-action-bar { position: static !important; } .window-titlebar { visibility: hidden !important; }'
					});
				}
				await form.locator('.income-editor details:not([open]):has(input[inputmode="decimal"])').evaluateAll(details => {
					for (const panel of details) (panel as HTMLDetailsElement).open = true;
				});
				await expectAmountsAligned(form, `${code} page ${number} with disclosures open at ${width}px`);
				if (code.startsWith('17')) await expectIncomeAmountColumns(form, `${code} page ${number} amount columns at ${width}px`);
				const schedules = await form.locator('details.wh-schedule:visible').all();
				for (const [index, schedule] of schedules.entries()) {
					if ((await schedule.getAttribute('open')) === null) await schedule.locator('summary').click();
					const edit = schedule.getByRole('button', { name: 'Edit line item 1', exact: true });
					const add = schedule.getByRole('button', { name: /^Add line item to / });
					if (!(await edit.count()) && !(await add.isEnabled())) continue;
					await (await edit.count() ? edit : add).click();
					const drawer = page.getByRole('dialog');
					await expect(drawer).toBeVisible();
					await expectAmountsAligned(drawer, `${code} page ${number} schedule ${index + 1} at ${width}px`);
					await expectDrawerAmountColumn(drawer, `${code} page ${number} schedule ${index + 1} amount column at ${width}px`);
					if (directory && withholdingPages[code]) {
						await drawer.screenshot({ path: resolve(directory, `editor-${width}-page-${number}-schedule-${index + 1}.png`), animations: 'disabled' });
					}
					await drawer.getByRole('button', { name: 'Cancel', exact: true }).click();
					await expect(drawer).toBeHidden();
				}
				if (!(await next.count()) || await next.isDisabled()) break;
				await next.click();
				number++;
				expect(number).toBeLessThanOrEqual(30);
			}
			if (withholdingPages[code]) {
				expect(number).toBe(withholdingPages[code]);
				await goToReturnPage(page, 1);
				await expect(pager.getByRole('button', { name: 'Previous page', exact: true })).toHaveCount(0);
			}
			if (variant === 'activity') expect(number).toBe(code === '1701' ? 17 : 8);
		}
		const print = await context.newPage();
		await print.setContent(fixture.html.replaceAll('__EBIRFORMS_PRINT_SOURCE_URL__', 'FICTIONAL SAMPLE - FOR REVIEW ONLY'));
		await print.emulateMedia({ media: 'print' });
		await print.evaluate(() => document.fonts.ready);
		const pdfPath = directory ? resolve(directory, 'return-a4.pdf') : undefined;
		const pdf = await print.pdf({ path: pdfPath, preferCSSPageSize: true, printBackground: true });
		const info = execFileSync('pdfinfo', ['-'], { input: pdf, encoding: 'utf8' });
		const pagination = Number(/^Pages:\s+(\d+)/m.exec(info)?.[1]);
		const frames = await print.locator('.withholding-print-page').count();
		expect(pagination).toBe(frames || 1);
		if (pageCountId) {
			expect(pagination).toBe(code === '1700' ? 4 : variant === 'activity' ? 17 : 12);
			await expect(print.locator(`[data-legacy-print-id="${pageCountId}"]`)).toHaveText(String(pagination));
		}
		const text = execFileSync('pdftotext', ['-layout', '-', '-'], { input: pdf, encoding: 'utf8' });
		expect(text.replace(/\s+/g, ' ')).toContain(code === '1701' || code === '1700' ? 'SANTOS' : profile.taxpayerName);
		expect(text.match(/FICTIONAL SAMPLE - FOR REVIEW ONLY/g)).toHaveLength(pagination);
		if (pdfPath && directory) execFileSync('pdftoppm', ['-r', '95', '-png', pdfPath, resolve(directory, 'pdf-page')]);
		await print.close();
	});
}
