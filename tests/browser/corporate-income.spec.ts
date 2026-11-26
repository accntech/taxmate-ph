import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';
import { printSavedReturn } from './helpers/return-pdf';

const revisions = [
	['1702EX', 7], ['1702EXv2018', 3], ['1702EXv2018C', 3],
	['1702MX', 9], ['1702MXv2018', 4], ['1702MXv2018C', 4],
	['1702Q', 2], ['1702Qv2008C', 2], ['1702Qv2018C', 3],
	['1702RT', 8], ['1702RTv2018', 4], ['1702RTv2018C', 4]
] as const;

test('corporate tax and schedule dividers span the form with content inset', async ({ page }, info) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702EX?new=true`);
	const editor = page.locator('.corporate-editor');
	await expect(editor.locator('h1')).toBeVisible({ timeout: 30_000 });
	for (const [number, selector] of [[2, '.corporate-row + .corporate-row'], [4, '.corporate-rows > :not(:first-child).line-list']] as const) {
		await goToReturnPage(page, number);
		for (const width of [1280, 390]) {
			await page.setViewportSize({ width, height: 900 });
			const rule = editor.locator(selector).first();
			await expect(rule).toBeVisible();
			const geometry = await rule.evaluate(element => {
				const rule = element.getBoundingClientRect();
				const section = element.closest('section')!.getBoundingClientRect();
				const style = getComputedStyle(element);
				return {
					left: Math.abs(rule.left - section.left),
					right: Math.abs(rule.right - section.right),
					border: parseFloat(style.borderBlockStartWidth),
					padding: parseFloat(style.paddingInlineStart)
				};
			});
			expect(geometry.left).toBeLessThan(1);
			expect(geometry.right).toBeLessThan(1);
			expect(geometry.border).toBeGreaterThan(0);
			expect(geometry.padding).toBeGreaterThan(0);
			if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
				await rule.locator('xpath=ancestor::section[1]').screenshot({
					path: info.outputPath(`page-${number}-${width}.png`),
					animations: 'disabled',
					style: '.eq-action-bar, [aria-label="Window title bar"] { visibility: hidden; }'
				});
			}
		}
	}
});

test('older quarterly filing grids have a single full-width bottom divider', async ({ page }, info) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
	for (const code of ['1702Q', '1702Qv2008C']) {
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
		const filing = page.locator('.corporate-section.filing');
		const cells = filing.locator('.corporate-row');
		await expect(cells).toHaveCount(5);
		await expect(cells.nth(2)).not.toHaveCSS('box-shadow', 'none');
		await expect(cells.nth(3)).toHaveCSS('box-shadow', 'none');
		await expect(cells.nth(4)).toHaveCSS('box-shadow', 'none');
		await expect(filing).toHaveCSS('border-block-end-width', '1px');
		if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
			await filing.screenshot({ path: info.outputPath(`${code}-filing.png`), animations: 'disabled' });
		}
	}
});

test('corporate filing grid shares the outer right edge with the form border', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await seedWorkspace(page, 'dark', 'loaded', { taxpayerClassification: 'N' }, []);
	for (const code of ['1702EX', '1702Q', '1702Qv2018C']) {
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
		const sheet = page.locator('.corporate-editor');
		const filing = sheet.locator('.corporate-section.filing');
		await expect(filing).toBeVisible({ timeout: 30_000 });
		const edges = await filing.locator('.corporate-row').evaluateAll(rows => {
			const right = rows[0].closest('section')!.getBoundingClientRect().right;
			return rows.filter(row => Math.abs(row.getBoundingClientRect().right - right) < 1)
				.map(row => getComputedStyle(row).borderInlineEndWidth);
		});
		expect(edges).toHaveLength(code === '1702Q' ? 1 : 2);
		expect(edges).toEqual(Array(edges.length).fill('0px'));
		await expect(sheet).toHaveCSS('border-inline-end-width', '1px');
	}
});

test('corporate cover keeps the group boundaries around signatory and certificate fields', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702RT?new=true`);
	const summary = page.getByRole('region', { name: /Part II.*Total Tax Payable/ });
	const row = (input: RegExp) => summary.locator('.corporate-row').filter({ has: page.getByRole('textbox', { name: input }) });
	await expect(summary.locator('.corporate-row.total')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
	await expect(row(/authorized representative/i)).toHaveCSS('border-block-start-width', '1px');
	await expect(row(/treasurer/i)).toHaveCSS('border-block-start-width', '0px');
	await expect(summary.locator('[data-corporate-item="22"]').first()).toHaveCSS('border-block-start-width', '1px');
	await expect(summary.locator('[data-corporate-item="22"]').last()).toHaveCSS('border-block-start-width', '0px');
	await expect(summary.locator('[data-corporate-item="23"]')).toHaveCSS('border-block-start-width', '0px');
});

test('the UI agent creates, saves, reopens and exports a corporate return', async ({ page }, info) => {
	await page.routeWebSocket('**/*', socket => socket.close());
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, [], { uiAgent: true });
	const forms = `/ebirforms/taxpayers/${taxpayerId}/forms`;
	await page.goto(forms);
	await expect.poll(() => page.evaluate(() => Reflect.get(window, 'uiAgentReady')), { timeout: 15_000 }).toBe(true);
	const request = (data: Record<string, unknown>) => page.evaluate(data =>
		(window as unknown as { sendUiAgentRequest: (data: unknown) => Promise<unknown> }).sendUiAgentRequest(data), data);
	async function press(target: string) {
		await expect(request({ method: 'act', target, action: 'press' })).resolves.toMatchObject({ ok: true });
	}
	await expect(page.getByRole('button', { name: 'Create return', exact: true })).toBeEnabled();
	await press('Create return');
	await expect(page.getByRole('option').filter({ hasText: /BIR Form 1702/ })).toHaveCount(12);
	await press('BIR Form 1702EXv2018C');
	await expect(page.getByRole('heading', { name: /Annual Income Tax Return.*For Exempt Corporations/ })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Edit taxpayer information' })).toBeVisible();
	await expect(request({ method: 'query', text: 'Drawee bank or agency' })).resolves.toMatchObject({
		ok: true, result: { controls: [] }
	});
	await expect(request({ method: 'query', text: 'Penalty - Compromise' })).resolves.toMatchObject({
		ok: true, result: { controls: [expect.objectContaining({ target: 'Add: Penalty - Compromise', actions: ['set_value'] })] }
	});
	await expect(request({
		method: 'act', target: 'Add: Penalty - Compromise', action: 'set_value', args: { value: '250' }
	})).resolves.toMatchObject({ ok: true });
	await expect(page.locator('[id="frm1702EX:txtPg1Pt2I22TotalAmtPayable"]')).toHaveText('250');
	await press('Save draft');
	await expect(page).toHaveURL(forms);
	const record = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns[0]);
	expect(record).toMatchObject({ formCode: '1702EXv2018C', status: 'Draft',
		values: { 'frm1702EX:txtPg1Pt2I21PenaltyCompromise': '250', 'frm1702EX:txtPg1Pt2I22TotalAmtPayable': '250' } });
	await press(`Edit BIR Form 1702EXv2018C Draft (${record.id})`);
	await expect(page.locator('[id="frm1702EX:txtPg1Pt2I22TotalAmtPayable"]')).toHaveText('250');
	await goToReturnPage(page, 2);
	await expect(page.getByRole('heading', { name: 'Tax computation', exact: true })).toBeVisible();
	await goToReturnPage(page, 1);
	await expect(page.locator('[id="frm1702EX:txtPg1Pt2I22TotalAmtPayable"]')).toHaveText('250');
	await press('← Back to forms');
	await expect(page).toHaveURL(forms);
	const pdf = info.outputPath('1702ex-create-ui-agent.pdf');
	const printed = await printSavedReturn(page, record.formCode, pdf, async () => {
		const actions = page.getByRole('button', { name: /^More actions for BIR Form 1702EXv2018C,/ });
		const label = await actions.getAttribute('aria-label');
		if (!label) throw new Error('Missing return actions label');
		await press(label);
		await press('Generate PDF');
	});
	await expect(printed.locator('[data-field-id="frm1702EX:txtPg1Pt2I22TotalAmtPayable"]')).toHaveValue('250');
	const text = execFileSync('pdftotext', ['-f', '1', '-l', '1', '-layout', pdf, '-'], { encoding: 'utf8' });
	expect(text).toMatch(/Total Amount Payable[^\n]*\b250\b/i);
	await printed.close();
});

const printCases: ReadonlyArray<readonly [string, number, Record<string, string>?]> = [
	...revisions,
	['1702EX', 10, {
		'frm1702EX:txtPg1Pt2NumberofPagesFiled': '99',
		Pg4S3I3PopLength: '23',
		Pg5S4I39PopLength: '1'
	}],
	['1702RT', 10, {
		'frm1702RT:txtPg1Pt2PagesFilled': '99',
		'frm1702RT:txtPg4Sc3I3CtrModal': '23'
	}],
	['1702MX', 13, {
		'frm1702MX:txtPg1Pt2NumberofPagesFiled': '99',
		'frm1702MX:chkPg2Pt4I30MoreThanOne': 'Y',
		'frm1702MX:totalEXAttach': '1'
	}]
];

const pageCountInputs: Record<string, string> = {
	'1702RT': 'frm1702RT:txtPg1Pt2PagesFilled',
	'1702MX': 'frm1702MX:txtPg1Pt2NumberofPagesFiled'
};

for (const [code, , values] of printCases) {
	if (!values) continue;
	test(`${code} omits the page count from a reopened draft`, async ({ page }, info) => {
		const id = 'old-page-count';
		await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, [{
			id, taxpayerId, formCode: code, returnPeriod: '2025-12',
			status: 'Draft', updatedAt: 1794441600000, finalFlag: '0', values
		}]);
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?return=${id}`);
		const editor = page.locator('.corporate-editor');
		await expect(editor.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 30000 });
		for (const width of [1280, 390]) {
			await page.setViewportSize({ width, height: 950 });
			await expect(editor.getByText('Number of pages filed', { exact: true })).toHaveCount(0);
			await expect(editor.getByRole('status', { name: 'Number of pages filed', exact: true })).toHaveCount(0);
			await expect(editor.getByRole('textbox', { name: 'Number of pages filed', exact: true })).toHaveCount(0);
			await editor.screenshot({ path: info.outputPath(`${code}-editor-${width}.png`), animations: 'disabled' });
		}
	});
}

for (const [code, printedPages, savedValues] of printCases) {
	test(`${code} exports the expected source pages and corporation identity${savedValues ? ' with additional pages' : ''}`, async ({ page, context }, info) => {
		await page.route('**/__corporate-paper', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html>' }));
		await page.goto('/__corporate-paper');
		const html = await page.evaluate(async ({ code, savedValues }) => {
			const base = '/src/lib';
			const { getFormDefinition } = await import(`${base}/forms/index.ts`);
			const { createInitialFormValues } = await import(`${base}/ebirforms/ebirforms-workspace.svelte.ts`);
			const { buildReturnReport } = await import(`${base}/printing/return-report.ts`);
			const profile = {
				id: '00123456700008', tin1: '001', tin2: '234', tin3: '567', branchCode: '00008', rdoCode: '047',
				taxpayerName: 'SAMPLE LEDGER CORPORATION', address: '42 Narra Street', address2: 'Test City',
				zipCode: '1000', contactNumber: '0285550148', email: 'corp@example.test', taxpayerClassification: 'N',
				category: 'P', lineOfBusiness: 'Professional services', psicCode: '69200'
			};
			const values = { ...createInitialFormValues(profile, code), ...savedValues };
			return buildReturnReport(getFormDefinition(code), values, 'Draft', code.includes('v2018') ? 'legal' : 'a4');
		}, { code, savedValues });
		if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
			await writeFile(info.outputPath(`${code}.html`), html);
		}
		const output = await context.newPage();
		await output.setContent(html.replaceAll('__EBIRFORMS_PRINT_SOURCE_URL__', 'file:///corporate-return-preview.html'));
		await output.emulateMedia({ media: 'print' });
		await expect(output.locator('.withholding-print-page')).toHaveCount(printedPages);
		await expect(output.locator('.withholding-page-header')).toHaveCount(printedPages);
		await expect(output.locator('.withholding-page-footer')).toHaveCount(printedPages);
		const pdfPath = info.outputPath(`${code}.pdf`);
		await output.pdf({ path: pdfPath, preferCSSPageSize: true, printBackground: true });
		const text = execFileSync('pdftotext', ['-layout', pdfPath, '-'], { encoding: 'utf8' });
		const geometry = execFileSync('pdfinfo', ['-f', '1', '-l', String(printedPages), pdfPath], { encoding: 'utf8' });
		expect(geometry).toMatch(new RegExp(`^Pages:\\s+${printedPages}$`, 'm'));
		expect(text.replace(/\s+/g, '')).toContain('047');
		const pageCountInput = pageCountInputs[code];
		if (pageCountInput) {
			await expect(output.locator(`[data-corporate-field="${pageCountInput}"]`)).toHaveValue(String(printedPages));
			const firstPage = text.split('\f', 1)[0];
			expect(firstPage).toMatch(new RegExp(`Number of pages filed\\s+${printedPages}\\b`, 'i'));
		}
		if (code === '1702EX') {
			const pageCount = output.locator('#p1I39');
			await expect(pageCount).toHaveText(String(printedPages));
			expect(await pageCount.evaluate(element => {
				const text = document.createRange();
				text.selectNodeContents(element);
				return text.getBoundingClientRect().right <= element.getBoundingClientRect().right;
			})).toBe(true);
			await expect(output.locator('[data-corporate-field="frm1702EX:txtPg1Pt1I9RegisteredName"]').first()).toHaveText('SAMPLE LEDGER CORPORATION');
			expect(text.replace(/\s+/g, '')).toContain('SAMPLELEDGERCORPORATION');
			expect(text).not.toMatch(/X{4}|568741235959/);
		} else {
			expect(text.replace(/\s+/g, ' ')).toMatch(/SAMPLE\s+LEDGER\s+CORPORATION/i);
		}
	});
}

for (const width of [1280, 390]) {
	test(`all corporate editor pages fit at ${width}px`, async ({ page }, info) => {
		test.setTimeout(120_000);
		await page.setViewportSize({ width, height: 900 });
		await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
		if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
			await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1701Qv2018?new=true`);
			await expect(page.locator('.income-editor').getByRole('heading', { level: 1 })).toBeVisible();
			await page.screenshot({ path: info.outputPath('existing-1701qv2018.png'), animations: 'disabled' });
		}
		for (const [code] of revisions) {
			await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`, { waitUntil: 'domcontentloaded' });
			const editor = page.locator('.corporate-editor');
			await expect(editor.getByRole('link', { name: 'Edit taxpayer information' }).first()).toBeVisible();
			const pager = editor.getByRole('navigation', { name: 'Return pages' });
			await expect(pager).toBeVisible();
			const next = pager.getByRole('button', { name: 'Next page' });
			for (let index = 1; index <= 12; index++) {
				if (index > 1) {
					await pager.getByRole('button', { name: 'Next page' }).click();
					await expect(pager.locator('[aria-current="page"]')).toHaveText(String(index));
				}
				await expect(editor.getByRole('heading', { level: 2 })).toBeVisible();
				await expect(editor.getByRole('heading', { name: /details of payment/i })).toHaveCount(0);
				await expect(editor.getByRole('textbox', { name: /drawee bank|payment date/i })).toHaveCount(0);
				const bounds = await editor.evaluate(element => {
					const right = element.getBoundingClientRect().right;
					return { overflow: element.scrollWidth - element.clientWidth,
						insetRules: [...element.querySelectorAll('.corporate-section:not(.background) > .corporate-rows')]
							.filter(rows => getComputedStyle(rows).display === 'block')
							.flatMap(rows => {
								const section = rows.parentElement!;
								const bounds = section.getBoundingClientRect();
								return [...rows.children].filter(row => {
									if (parseFloat(getComputedStyle(row).borderBlockStartWidth) === 0) return false;
									const edge = row.getBoundingClientRect();
									return Math.abs(edge.left - bounds.left) > 1 || Math.abs(edge.right - bounds.right) > 1;
								}).map(() => section.getAttribute('aria-label'));
							}),
						offenders: [...element.querySelectorAll<HTMLElement>('*')]
							.filter(node => node.getBoundingClientRect().right > right + 1)
							.slice(0, 8).map(node => {
								const trail: string[] = [];
								for (let entry: HTMLElement | null = node; entry && trail.length < 6; entry = entry.parentElement) {
									const { x, width } = entry.getBoundingClientRect();
									trail.push(`${entry.id || entry.getAttribute('data-slot') || String(entry.className).split(' ')[0]}:${Math.round(x)}/${Math.round(width)}`);
								}
								return trail.join(' > ');
							})
					};
				});
				expect(bounds.overflow, `${code}, page ${index} at ${width}px (${bounds.offenders.join(', ')})`).toBeLessThanOrEqual(1);
				expect(bounds.insetRules, `${code}, page ${index} at ${width}px`).toEqual([]);
				if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
					await editor.screenshot({
						path: info.outputPath(`${code}-page-${index}.png`),
						animations: 'disabled',
						style: '.eq-action-bar, [aria-label="Window title bar"] { visibility: hidden; }'
					});
				}
				if (!await next.isVisible()) break;
			}
			await expect(next).toHaveCount(0);
		}
	});
}

for (const [referenceCode, corporateCode] of [['1701v2018', '1702RTv2018C'], ['1701Qv2018', '1702Qv2018C']]) {
	test(`${corporateCode} entry typography matches ${referenceCode}`, async ({ page }, info) => {
		await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
		const typography = (selector: string) => page.locator(selector).first().evaluate(element => {
			const { fontFamily, fontSize, fontWeight, lineHeight } = getComputedStyle(element);
			return { fontFamily, fontSize, fontWeight, lineHeight };
		});
		const selectors = ['h1', '.page-context h2', 'section h3'];
		for (const width of [1280, 390]) {
			await page.setViewportSize({ width, height: 900 });
			await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${referenceCode}?new=true`);
			const reference = await Promise.all([...selectors, '.taxpayer-information dt', '.taxpayer-information dd']
				.map(selector => typography(`.income-editor ${selector}`)));
			if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
				await page.screenshot({ path: info.outputPath(`${referenceCode}-${width}.png`), animations: 'disabled' });
			}
			await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${corporateCode}?new=true`);
			const corporate = await Promise.all([...selectors, '.managed-value .value-label', '.managed-value output']
				.map(selector => typography(`.corporate-editor ${selector}`)));
			expect(corporate).toEqual(reference);
			if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
				await page.screenshot({ path: info.outputPath(`${corporateCode}-${width}.png`), animations: 'disabled' });
			}
		}
	});
}

test('corporate Background Information follows 1701 and 1701Q TIN and RDO placement', async ({ page }, info) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
	await page.setViewportSize({ width: 1280, height: 900 });
	for (const code of ['1701v2018', '1701Qv2018', ...revisions.map(([code]) => code)]) {
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
		const title = page.getByRole('heading', { name: /background information/i });
		const background = page.locator('section').filter({ has: title }).filter({
			has: page.getByRole('link', { name: 'Edit taxpayer information' })
		}).last();
		const tin = background.getByText('TIN and branch code', { exact: code.startsWith('1702') });
		const rdo = background.getByText(/^(?:[567] )?RDO code$/i);
		await expect(tin).toBeVisible();
		await expect(rdo).toBeVisible();
		const left = (await tin.boundingBox())!;
		const right = (await rdo.boundingBox())!;
		expect(right.x, code).toBeGreaterThan(left.x);
		expect(Math.abs(right.y - left.y), code).toBeLessThan(6);
		if (['1701v2018', '1701Qv2018', '1702Q', '1702RTv2018C'].includes(code)) {
			if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') await background.screenshot({ path: info.outputPath(`${code}-background-desktop.png`) });
			await page.setViewportSize({ width: 390, height: 900 });
			const difference = () => expect.poll(async () => (await rdo.boundingBox())!.y - (await tin.boundingBox())!.y, { message: code });
			if (code.includes('Q')) await difference().toBeGreaterThan(6);
			else await difference().toBeLessThan(6);
			if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') await background.screenshot({ path: info.outputPath(`${code}-background-mobile.png`) });
			await page.setViewportSize({ width: 1280, height: 900 });
		}
	}
});

test('quarterly filing uses distinct period labels and the shared ATC search', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702Qv2018C?new=true`);
	const editor = page.locator('.corporate-editor');
	await expect(editor.getByRole('heading', { level: 1, name: /^Quarterly Income Tax Return/ })).toBeVisible();
	await expect(editor.getByRole('textbox', { name: 'Year ended' })).toBeVisible();
	await expect(editor.getByRole('combobox', { name: 'Year-end month' })).toBeVisible();
	const atc = editor.getByRole('combobox', { name: /Alphanumeric tax code/ });
	await atc.click();
	await expect(page.getByPlaceholder('Search code or income')).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(editor.getByRole('combobox', { name: 'Go to section', exact: true })).toHaveCount(0);
	await editor.getByRole('button', { name: 'Find a page, page 1 of 3', exact: true }).click();
	const picker = page.getByRole('dialog', { name: 'Go to page', exact: true });
	await picker.getByRole('option', { name: /Page 2.*Income tax schedules/ }).click();
	await expect(editor.getByRole('navigation', { name: 'Return pages' }).locator('[aria-current="page"]')).toHaveText('2');
});

for (const width of [1280, 390]) {
	test(`return identification keeps labels beside their values at ${width}px`, async ({ page }, info) => {
		await page.setViewportSize({ width, height: 900 });
		await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702EX?new=true`);
		await goToReturnPage(page, 2);
		const identity = page.getByRole('region', { name: 'Return identification', exact: true });
		const tin = identity.locator('output[id="frm1702EX:txtPg2TinC1"]');
		const name = identity.locator('output[id="frm1702EX:txtPg2RegisteredName"]');
		await expect(tin).toHaveText('001-234-567-0008');
		await expect(name).toHaveText('Example Services Corporation');
		for (const value of [tin, name]) {
			const label = await value.getAttribute('aria-labelledby');
			const labelBox = await identity.locator(`[id="${label}"]`).boundingBox();
			const valueBox = await value.boundingBox();
			expect(valueBox!.y).toBeGreaterThan(labelBox!.y);
			expect(Math.abs(valueBox!.x - labelBox!.x)).toBeLessThanOrEqual(1);
		}
		if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
			await identity.screenshot({ path: info.outputPath('return-identification.png'), animations: 'disabled' });
		}
	});
}

test('legacy EX groups auditor TIN segments', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702EX?new=true`);
	const editor = page.locator('.corporate-editor');
	await goToReturnPage(page, 2);
	const tin = editor.locator('[id="frm1702EX:txtPg2Pt6I46TinC1"]');
	await expect(tin).toHaveAttribute('placeholder', '000-000-000-00000');
	await tin.fill('00123456700008');
	await tin.blur();
	await expect(tin).toHaveValue('001-234-567-00008');
	await expect(editor.locator('[id="frm1702EX:txtPg2Pt6I46TinC2"]')).toHaveCount(0);
});

test('keyboard activation of a calculated-field error opens its schedule and moves focus', async ({ page }) => {
	const code = '1702EXv2018C';
	const key = (field: string) => `frm1702EX:${field}`;
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, [{
		id: 'exempt-reconciliation', taxpayerId, formCode: code, returnPeriod: '2025-12',
		status: 'Draft', updatedAt: 1794441600000, finalFlag: '0',
		values: {
			[key('txtPg1I2YearEnd')]: '2025', [key('rdoPg1I1')]: 'C',
			[key('txtPg2Pt4I28SalesReceiptsRevFees')]: '1000',
			[key('rdoPg1Pt1I13MethodOfDeduc')]: 'I'
		}
	}]);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?return=exempt-reconciliation&validate=true`);
	const link = page.getByRole('link', { name: /Reconcile this amount with item 39/ });
	await link.focus();
	await page.keyboard.press('Enter');
	await expect(page.locator('.corporate-editor').getByRole('heading', { level: 2, name: 'Schedules' })).toBeVisible();
	await expect(page.locator('[id="frm1702EX:txtPg3Pt6S3I10NetTaxableIncome"]')).toBeFocused();
});

test('quarterly credit entries require a description and keep the remaining total after removal', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702Qv2018C?new=true`);
	await goToReturnPage(page, 3);
	const add = page.locator('.line-list').filter({ has: page.getByRole('heading', { name: /^Additional other tax credits \(/ }) }).getByRole('button', { name: 'Add item', exact: true });
	const dialog = page.getByRole('dialog', { name: 'Add item' });
	for (const [description, amount] of [['Prior withholding', '1200'], ['Additional withholding', '1500']]) {
		await add.click();
		await dialog.getByRole('textbox', { name: 'Amount' }).fill(amount);
		await dialog.getByRole('button', { name: 'Add item', exact: true }).click();
		await expect(dialog.getByText(/Required|Enter the tax credit description/)).toBeVisible();
		await dialog.getByRole('textbox', { name: 'Description' }).fill(description);
		await dialog.getByRole('button', { name: 'Add item', exact: true }).click();
		await expect(dialog).toHaveCount(0);
	}
	const list = page.getByRole('list', { name: 'Additional other tax credits line items' });
	await expect(list.getByRole('listitem')).toHaveCount(2);
	await list.getByRole('button', { name: 'Prior withholding', exact: true }).click();
	await page.getByRole('dialog').getByRole('button', { name: 'Delete item', exact: true }).click();
	await expect(page.getByRole('dialog')).toBeHidden();
	await expect(list.getByText('Additional withholding')).toBeVisible();
	await expect(list.getByText('Prior withholding')).toHaveCount(0);
	await expect(page.locator('[id="frm1702q:Sched4:txtTax7"]')).toHaveText('1,500');
});

test('legacy EX supplemental amounts identify source columns and open named entry lists', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702EX?new=true`);
	await goToReturnPage(page, 7);
	const editor = page.locator('.corporate-editor');
	await expect(editor.getByRole('textbox', { name: /Interests.*Exempt amount/ })).toBeVisible();
	const properties = editor.locator('.line-list').filter({ has: page.getByRole('heading', { name: /^Real properties subject to final tax \(/ }) });
	await properties.getByRole('button', { name: 'Add item', exact: true }).click();
	await expect(page.getByRole('dialog').getByRole('textbox', { name: /Property 1.*Description of Property/ })).toBeVisible();
	await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(page.getByRole('dialog')).toBeHidden();
	await expect(editor.getByRole('navigation', { name: 'Corporate return sections' })).toHaveCount(0);
	const add = editor.locator('.line-list').filter({ has: page.getByRole('heading', { name: /^Additional prizes and winnings \(/ }) }).getByRole('button', { name: 'Add item', exact: true });
	await add.click();
	await expect(page.getByRole('dialog', { name: 'Add item' }).getByRole('textbox').first()).toBeFocused();
	await page.getByRole('dialog', { name: 'Add item' }).getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(add).toBeFocused();
});

test('corporate label references open the referenced schedule item and return to the summary', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702Qv2018C?new=true`);
	const from = page.getByRole('button', { name: 'From Schedule 4, Item 7', exact: true });
	await expect(from).toBeVisible();
	await from.focus();
	await page.keyboard.press('Enter');
	await expect(page.locator('[id="frm1702q:Sched4:txtTax7"]')).toBeFocused();
	await expect(page.getByRole('heading', { name: 'MCIT and tax credits', exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'To Part II, Item 19', exact: true }).click();
	await expect(page.locator('[id="frm1702q:txtTax19"]')).toBeFocused();
});

test('original July 2008 quarterly MCIT output includes its percent unit', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702Q?new=true`);
	await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible();
	await goToReturnPage(page, 2);
	await expect(page.locator('output[id="txtTaxRate"]')).toHaveText('2%');
});

test('revised quarterly OSD saves and prints the computed deduction and rate', async ({ page }, info) => {
	const code = '1702Qv2018C';
	const id = (name: string) => `frm1702q:${name}`;
	const forms = `/ebirforms/taxpayers/${taxpayerId}/forms`;
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, [{
		id: 'quarterly-osd', taxpayerId, formCode: code, returnPeriod: '2025Q2',
		status: 'Draft', updatedAt: 1794441600000, finalFlag: '0',
		values: {
			[id('txtYrEndYear')]: '2025', [id('rbForClndrFscl')]: 'C', [id('rbQuarter')]: '2',
			[id('cbATC_2')]: 'IC010_25%', [id('rbATC_1')]: 'N', [id('rbMthdOfDdctns')]: 'Debtor'
		}
	}]);
	await page.goto(`${forms}/${code}?return=quarterly-osd`);
	await goToReturnPage(page, 2);
	const sales = page.locator(`input[id="${id('Sched2:txtTax1')}"]`);
	const deduction = page.locator(`output[id="${id('Sched2:txtTax6')}"]`);
	const rate = page.locator(`output[id="${id('Sched2:txtTax10')}"]`);
	await sales.fill('1000');
	await sales.blur();
	await expect(deduction).toHaveText('400');
	await expect(rate).toHaveText('25%');

	for (const width of [1280, 390]) {
		await page.setViewportSize({ width, height: 900 });
		await expect(deduction).toBeVisible();
		await expect(rate).toBeVisible();
		await deduction.scrollIntoViewIfNeeded();
		await page.screenshot({ path: info.outputPath(`1702qv2018c-osd-${width}.png`), animations: 'disabled' });
	}
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(forms);
	await page.getByRole('link', { name: 'Edit', exact: true }).click();
	await goToReturnPage(page, 2);
	await expect(deduction).toHaveText('400');
	await expect(rate).toHaveText('25%');

	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(forms);
	const printed = await printSavedReturn(page, code, info.outputPath('1702qv2018c-osd.pdf'));
	for (const [field, value] of [['Sched2:txtTax6', '400'], ['Sched2:txtTax11', '150']]) {
		const printedField = printed.locator(`[data-field-id="${id(field)}"]`).first();
		expect(await printedField.evaluate(element => element instanceof HTMLInputElement ? element.value : element.textContent)).toBe(value);
	}
	await printed.close();
});
