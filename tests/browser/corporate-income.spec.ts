import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';
import { printSavedReturn } from './helpers/return-pdf';
import { seedLegacyPrintArtwork } from './helpers/legacy-print-artwork';

test.beforeEach(async ({ page }) => { await seedLegacyPrintArtwork(page); });

const revisions = [
	['1702EX', 7], ['1702EXv2018', 3], ['1702EXv2018C', 3],
	['1702MX', 9], ['1702MXv2018', 4], ['1702MXv2018C', 4],
	['1702Q', 2], ['1702Qv2008C', 2], ['1702Qv2018C', 3],
	['1702RT', 8], ['1702RTv2018', 4], ['1702RTv2018C', 4]
] as const;

for (const [code] of revisions) {
	test(`${code} groups filing details and keeps the cover within the viewport`, async ({ page }, info) => {
		await seedWorkspace(page, 'light', 'loaded', {
			taxpayerClassification: 'N',
			taxpayerName: 'Example Manufacturing and Business Management Services Corporation',
			address: 'Unit 1206, 123 Example Building, Example Business District',
			email: 'corporatefiling@example.com'
		}, []);
		await page.setViewportSize({ width: 1280, height: 900 });
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
		const filing = page.getByRole('region', { name: /^(?:taxpayer and )?filing (?:information|details)$/i });
		const background = page.getByRole('region', { name: /background information/i });
		const cells = filing.locator('[data-corporate-item]');
		const period = cells.nth(1).getByRole('group', { name: 'Year ended', exact: true });
		const month = period.getByRole('spinbutton', { name: 'Month', exact: true });
		const year = period.getByRole('spinbutton', { name: 'Year', exact: true });
		const picker = period.getByRole('button', { name: 'Choose month and year', exact: true });
		await expect(filing).toBeVisible({ timeout: 20_000 });
		await expect(cells.locator('> .paper-item-number')).toHaveText(['1', '2', '3', '4', '5']);
		await expect(filing.locator('.corporate-row')).toHaveCount(5);
		await expect(filing.getByRole('radiogroup', { name: 'Accounting period', exact: true })).toBeVisible();
		await expect(filing.locator('legend').filter({ hasText: /^\d+\s+/ })).toHaveCount(0);
		await expect(background.getByRole('link', { name: 'Edit taxpayer information' })).toBeVisible();
		for (const [label, value] of [
			['Registered name', 'Example Manufacturing and Business Management Services Corporation'],
			['Registered address', 'Unit 1206, 123 Example Building, Example Business District']
		]) {
			await expect(background.getByRole('status', { name: label, exact: true })).toContainText(value);
			await expect(background.getByRole('textbox', { name: label, exact: true })).toHaveCount(0);
		}
		if (code.startsWith('1702EX')) {
			await filing.getByRole('radio', { name: 'Fiscal', exact: true }).check();
		}
		for (const width of [1280, 760, 390]) {
			await page.setViewportSize({ width, height: 900 });
			await page.keyboard.press('Escape');
			await expect.poll(async () => {
				const first = (await cells.nth(0).boundingBox())!;
				const second = (await cells.nth(1).boundingBox())!;
				return width === 390
					? first.y + first.height <= second.y + 1
					: first.y === second.y && first.x + first.width <= second.x + 1;
			}).toBe(true);
			const filingColumns = await cells.evaluateAll(elements => elements.map((cell, index) => {
				const previous = elements[index - 1];
				const style = getComputedStyle(cell);
				return {
					item: cell.getAttribute('data-corporate-item'),
					sharesRow: !!previous && previous.getBoundingClientRect().top === cell.getBoundingClientRect().top,
					startBorder: style.borderInlineStartWidth,
					endBorder: style.borderInlineEndWidth
				};
			}));
			for (const { item, sharesRow, startBorder, endBorder } of filingColumns) {
				expect(startBorder, `Item ${item} at ${width}px`).toBe(sharesRow ? '1px' : '0px');
				expect(endBorder).toBe('0px');
			}
			await expect.poll(async () => {
				const monthBox = (await month.boundingBox())!;
				const yearBox = (await year.boundingBox())!;
				const button = (await picker.boundingBox())!;
				return Math.abs(monthBox.y - yearBox.y) <= 2 && monthBox.x < yearBox.x && yearBox.x < button.x;
			}).toBe(true);
			await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
			if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
				await filing.evaluate(element => element.scrollIntoView({ block: 'center' }));
				await filing.screenshot({ path: info.outputPath(`${code}-filing-${width}.png`), animations: 'disabled' });
				await background.screenshot({ path: info.outputPath(`${code}-background-${width}.png`), animations: 'disabled' });
			}
		}
		if (code.startsWith('1702RT')) {
			const atc = cells.nth(4);
			const regular = atc.getByRole('checkbox', { name: 'Regular income tax' });
			const selection = atc.getByRole('combobox', { name: 'Applicable ATC' });
			await expect(selection).toBeVisible();
			await regular.uncheck();
			await expect(selection).toHaveCount(0);
			await regular.check();
			await expect(selection).toBeVisible();
		}
	});
}

test('1702-RT saves the combined year-end month and year under the existing field keys', async ({ page }, info) => {
	const code = '1702RTv2018';
	const id = 'blank-closing-month';
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, [{
		id, taxpayerId, formCode: code, returnPeriod: '2025',
		status: 'Draft', updatedAt: 1794441600000, finalFlag: '0',
		values: { 'frm1702RT:txtPg1I2Year': '2025', 'frm1702RT:ddlPg1I2Month': '' }
	}]);
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?return=${id}`);
	const filing = page.getByRole('region', { name: 'Filing details', exact: true });
	const period = filing.getByRole('group', { name: 'Year ended', exact: true });
	const month = period.getByRole('spinbutton', { name: 'Month', exact: true });
	const year = period.getByRole('spinbutton', { name: 'Year', exact: true });
	await filing.getByRole('radio', { name: 'Fiscal', exact: true }).check();
	for (const width of [1280, 390]) {
		await page.setViewportSize({ width, height: 900 });
		await page.keyboard.press('Escape');
		const closingYear = width === 1280 ? '2024' : '2025';
		await month.fill('11');
		await year.fill(closingYear);
		await year.blur();
		await expect(month).toHaveValue('11');
		await expect(year).toHaveValue(closingYear);
		await period.getByRole('button', { name: 'Choose month and year', exact: true }).click();
		await page.getByRole('button', { name: /^September(?:\s|$)/ }).click();
		await expect(month).toHaveValue('09');
		await expect(year).toHaveValue(closingYear);
		if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
			await filing.screenshot({ path: info.outputPath(`1702rt-year-end-${width}.png`), animations: 'disabled' });
		}
	}
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	const saved = await page.evaluate(returnId => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns
		.find((record: { id: string }) => record.id === returnId), id);
	expect(saved.values).toMatchObject({ 'frm1702RT:ddlPg1I2Month': '09', 'frm1702RT:txtPg1I2Year': '2025' });
});

test('1702-Q retains blank registered fields for missing profile values', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N', taxpayerName: '', address: '', address2: '' }, []);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702Qv2018C?new=true`);
	const background = page.getByRole('region', { name: /background information/i });
	await expect(background).toBeVisible({ timeout: 20_000 });
	for (const label of ['Registered name', 'Registered address']) {
		const field = background.getByRole('textbox', { name: label, exact: true });
		await expect(field).toHaveValue('');
		await expect(field).toHaveJSProperty('readOnly', true);
	}
	await expect(background.getByRole('link', { name: 'Edit taxpayer information' })).toBeVisible();
});

test('1702-RT uses registered details saved in the taxpayer profile', async ({ page }, info) => {
	const code = '1702RTv2018';
	const returnEditor = `/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`;
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, [], { persistProfile: true });
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto(returnEditor);
	const background = page.getByRole('region', { name: /background information/i });
	const name = background.getByRole('status', { name: 'Registered name', exact: true });
	const address = background.getByRole('status', { name: 'Registered address', exact: true });
	const profileName = 'Example Services Corporation, Manufacturing Division, Philippines';
	const profileAddress = '123 Example Street, Example City, Building 2';
	await background.getByRole('link', { name: 'Edit taxpayer information' }).click();
	await page.getByRole('textbox', { name: 'Registered name line 2', exact: true }).fill('Manufacturing Division', { timeout: 5000 });
	await page.getByRole('textbox', { name: 'Registered name line 3', exact: true }).fill('Philippines');
	await page.getByRole('textbox', { name: 'Address line 3', exact: true }).fill('Building 2');
	await page.getByRole('button', { name: 'Save profile', exact: true }).click();
	await expect(page).toHaveURL(returnEditor);
	await expect(name).toHaveText(profileName);
	await expect(address).toHaveText(profileAddress);
	await expect(background.getByRole('textbox', { name: /Registered (name|address) line/ })).toHaveCount(0);
	for (const width of [1280, 390]) {
		await page.setViewportSize({ width, height: 900 });
		await page.keyboard.press('Escape');
		await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
		if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
			await background.screenshot({ path: info.outputPath(`1702rt-registered-information-${width}.png`), animations: 'disabled' });
		}
	}
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	const edit = page.getByRole('link', { name: /^Edit BIR Form / });
	await expect(edit).toBeVisible();
	const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns
		.find((entry: { formCode: string }) => entry.formCode === '1702RTv2018').values);
	expect(saved).toMatchObject({
		'frm1702RT:txtPg1Pt1I8Name1': 'Example Services Corporation',
		'frm1702RT:txtPg1Pt1I8Name2': 'Manufacturing Division',
		'frm1702RT:txtPg1Pt1I8Name3': 'Philippines',
		'frm1702RT:txtPg1Pt1I9Address2': 'Example City',
		'frm1702RT:txtPg1Pt1I9Address3': 'Building 2'
	});
	await edit.click();
	await expect(name).toHaveText(profileName);
	await expect(address).toHaveText(profileAddress);
	await page.getByRole('link', { name: /Back to forms/ }).click();
	const printed = await printSavedReturn(page, code, info.outputPath('1702rt-registered-information.pdf'));
	for (const [key, value] of Object.entries({
		txtPg1Pt1I8Name2: 'Manufacturing Division',
		txtPg1Pt1I8Name3: 'Philippines',
		txtPg1Pt1I9Address3: 'Building 2'
	})) {
		await expect(printed.locator(`[data-corporate-field="frm1702RT:${key}"]`)).toHaveValue(value);
	}
	await printed.close();
});

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
		await expect(cells.nth(2)).toHaveCSS('border-block-start-width', '0px');
		await expect(cells.nth(3)).toHaveCSS('border-block-start-width', '1px');
		await expect(cells.nth(4)).toHaveCSS('border-block-start-width', '1px');
		const amended = (await cells.nth(3).boundingBox())!;
		const attachments = (await cells.nth(4).boundingBox())!;
		expect(Math.abs(amended.x + amended.width - attachments.x)).toBeLessThan(1);
		expect(amended.y).toBe(attachments.y);
		await expect(filing).toHaveCSS('border-block-end-width', '1px');
		if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
			await filing.screenshot({ path: info.outputPath(`${code}-filing.png`), animations: 'disabled' });
		}
	}
});

for (const code of ['1702Q', '1702Qv2008C']) {
	test(`${code} stacks the four numbered penalty items`, async ({ page }, info) => {
		await page.setViewportSize({ width: 1440, height: 1000 });
		await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
		const rows = page.locator('[data-corporate-item^="33"]');
		await expect(rows.locator('> .paper-item-number')).toHaveText(['33A', '33B', '33C', '33D'], { timeout: 20_000 });
		const fields = ['Surcharge', 'Interest', 'Compromise'].map(label => page.getByRole('textbox', { name: label, exact: true }));
		const total = rows.last().getByRole('status', { name: 'Total penalties', exact: true });
		await expect(total).toHaveText('0.00');
		for (const width of [1440, 390]) {
			await page.setViewportSize({ width, height: 1000 });
			const boxes = await rows.evaluateAll(elements => elements.map(row => {
				const { x, top, right, bottom } = row.getBoundingClientRect();
				return { x, top, right, bottom };
			}));
			for (const [index, box] of boxes.entries()) {
				expect(box.x).toBeGreaterThanOrEqual(0);
				expect(box.right).toBeLessThanOrEqual(width);
				if (index > 0) expect(Math.abs(box.top - boxes[index - 1].bottom)).toBeLessThan(1);
			}
			const rightEdges = await Promise.all(fields.map(async field => {
				const box = (await field.boundingBox())!;
				return box.x + box.width;
			}));
			for (const edge of rightEdges) expect(Math.abs(edge - rightEdges[0])).toBeLessThan(1);
			if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
				await rows.first().evaluate(row => row.scrollIntoView({ block: 'center', behavior: 'instant' }));
				const first = (await rows.first().boundingBox())!;
				const last = (await rows.last().boundingBox())!;
				await page.screenshot({
					path: info.outputPath(`${code}-penalties-${width}.png`),
					animations: 'disabled',
					clip: { x: first.x, y: first.y, width: first.width, height: last.y + last.height - first.y }
				});
			}
		}
		for (const [index, field] of fields.entries()) {
			await expect(field).toBeEditable();
			await field.fill(['100.25', '200.50', '1000.00'][index]);
			await field.blur();
		}
		await expect(total).toHaveText('1,300.75');
		await expect(page.locator('[data-corporate-item="34"] output')).toHaveText('1,300.75');

		await page.setViewportSize({ width: 1440, height: 1000 });
		await page.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(page).toHaveURL(`/ebirforms/taxpayers/${taxpayerId}/forms`);
		await page.getByRole('link', { name: /^Edit BIR Form / }).click();
		await expect(total).toHaveText('1,300.75');
		await page.getByRole('link', { name: 'Back to forms', exact: false }).click();
		const printed = await printSavedReturn(page, code, info.outputPath(`${code}-penalties.pdf`), async () => {
			await page.getByRole('button', { name: /^More actions for BIR Form/ }).click();
			await page.getByRole('menuitem', { name: 'Generate PDF', exact: true }).click();
		});
		await expect(printed.locator('.withholding-print-page')).toHaveCount(2);
		for (const [item, value] of [['33A', 100.25], ['33B', 200.50], ['33C', 1000], ['33D', 1300.75], ['34', 1300.75]] as const) {
			const field = printed.locator(`[data-corporate-field="frm1702q:txt${item}"]`);
			expect(Number((await field.inputValue()).replaceAll(',', ''))).toBe(value);
		}
		await printed.close();
	});
}

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
		expect(edges).toHaveLength(2);
		expect(edges).toEqual(Array(edges.length).fill('0px'));
		await expect(sheet).toHaveCSS('border-inline-end-width', '1px');
	}
});

test('the legacy regular cover separates filing identification from the tax summary', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702RT?new=true`);
	const summary = page.getByRole('region', { name: /Part II.*Total Tax Payable/ });
	await expect(summary).toBeVisible({ timeout: 30_000 });
	await expect(summary.locator('.corporate-row.total')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
	await expect(summary.getByRole('textbox', { name: /authorized representative|treasurer|signatory/i })).toHaveCount(0);
	await expect(summary.locator('[data-corporate-item="22"]')).toHaveCount(0);
	const identification = page.getByRole('region', { name: 'Filing identification', exact: true });
	const item22 = identification.locator('[data-corporate-item="22"]');
	await expect(item22).toHaveCount(1);
	await expect(item22.getByRole('radio')).toHaveCount(2);
	await expect(item22.getByRole('textbox')).toBeVisible();
});

for (const [code, item] of [
	['1702RTv2018', '22'], ['1702RTv2018C', '22'], ['1702MXv2018', '22'], ['1702MXv2018C', '22'],
	['1702EXv2018', '23'], ['1702EXv2018C', '23'], ['1702Qv2018C', '26'],
	['1702Q', '5'], ['1702Qv2008C', '5']
] as const) {
	test(`${code} displays a compact standalone attachment count`, async ({ page }, info) => {
		await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
		const editor = page.locator('.corporate-editor');
		const count = page.getByRole('textbox', { name: /^Number of (?:attachments|sheets attached)$/ });
		const row = editor.locator(`[data-corporate-item="${item}"]`).filter({ has: count });
		await expect(editor.locator('input[id*="Signatory" i], input[id*="Signature" i], input[id$="AuthorizedRepresentative" i], input[id$="Treasurer" i]')).toHaveCount(0);
		await expect(editor.getByText(/Title of Signatory TIN/i)).toHaveCount(0);
		await expect(count).toHaveAttribute('inputmode', 'numeric');
		await expect(row.locator('.paper-item-number')).toHaveText(item);
		await expect(row.getByRole('textbox')).toHaveCount(1);
		await count.fill('03');
		for (const width of [1280, 390]) {
			await page.setViewportSize({ width, height: 900 });
			await expect(count).toHaveValue('03');
			await expect.poll(async () => (await count.boundingBox())!.width).toBeLessThanOrEqual(160);
			await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
			if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
				await row.screenshot({ path: info.outputPath(`${code}-attachments-${width}.png`), animations: 'disabled' });
			}
		}
		if (code === '1702RTv2018') {
			await page.setViewportSize({ width: 1280, height: 900 });
			await page.getByRole('button', { name: 'Save draft', exact: true }).click();
			await page.getByRole('link', { name: /^Edit BIR Form / }).click();
			await expect(count).toHaveValue('03');
		}
	});
}

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
			await expect(editor.getByRole('link', { name: 'Edit taxpayer information' }).first(),
				`${code} cover at ${width}px`).toBeVisible({ timeout: 20_000 });
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
	const period = editor.getByRole('group', { name: 'Year ended', exact: true });
	await expect(period.getByRole('spinbutton', { name: 'Month', exact: true })).toBeVisible();
	await expect(period.getByRole('spinbutton', { name: 'Year', exact: true })).toBeVisible();
	await expect(period.getByRole('button', { name: 'Choose month and year', exact: true })).toBeVisible();
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

for (const code of ['1702EXv2018', '1702EXv2018C']) test(`${code} uses the return pager without showing legacy pagination fields`, async ({ page }, info) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);

	const editor = page.locator('.corporate-editor');
	const pager = page.getByRole('navigation', { name: 'Return pages' });
	await expect(pager.locator('[aria-current="page"]')).toHaveText('1', { timeout: 20_000 });
	await goToReturnPage(page, 3);
	await expect(editor.getByRole('heading', { level: 2, name: 'Schedules' })).toBeVisible();
	await expect(editor.getByRole('status', { name: 'Net Taxable Income/(Loss) (Item 4 Less Item 9)', exact: true })).toBeVisible();
	await expect(editor.getByText(/^txt (?:Current|Max) Page$/)).toHaveCount(0);
	await expect(pager.locator('[aria-current="page"]')).toHaveText('3');
	await expect(pager.getByRole('button', { name: 'Next page' })).toHaveCount(0);
	if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
		for (const width of [1280, 390]) {
			await page.setViewportSize({ width, height: 900 });
			await pager.evaluate(element => element.scrollIntoView({ block: 'center' }));
			await page.screenshot({ path: info.outputPath(`${code.toLowerCase()}-page-3-${width}.png`), animations: 'disabled' });
		}
	}
	await goToReturnPage(page, 2);
	await expect(pager.locator('[aria-current="page"]')).toHaveText('2');
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
	await page.getByRole('link', { name: /^Edit BIR Form / }).click();
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

test('1702RT January 2018 adds NOLCO in a drawer and keeps the total and transfer visible', async ({ page }, info) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702RTv2018?new=true`);
	await goToReturnPage(page, 4);
	const schedule = page.getByRole('region', { name: /^Schedule IIIA / });
	const total = schedule.locator('[id="frm1702RT:txtPg4Sc4I8TotalNOLCO"]');
	const transfer = schedule.getByRole('button', { name: 'To Part IV, Item 36' });
	await expect(total).toBeVisible();
	await expect(transfer).toBeVisible();
	const add = schedule.getByRole('button', { name: 'Add item', exact: true });
	await expect(add).toBeVisible();
	await add.click();
	const drawer = page.getByRole('dialog', { name: 'Add item', exact: true });
	await drawer.getByRole('button', { name: 'Add item', exact: true }).click();
	await expect(drawer.getByText('Enter the four-digit year the loss was incurred.')).toBeVisible();
	await drawer.getByRole('textbox', { name: 'Year incurred', exact: true }).fill('2023');
	await drawer.getByRole('textbox', { name: 'Net operating loss', exact: true }).fill('1000');
	await drawer.getByRole('textbox', { name: 'NOLCO applied current year', exact: true }).fill('250');
	await expect(drawer.locator('output').filter({ hasText: '750' })).toBeVisible();
	await drawer.getByRole('button', { name: 'Add item', exact: true }).click();
	await expect(drawer).toBeHidden();
	await expect(schedule.getByRole('button', { name: '2023', exact: true })).toBeVisible();
	await expect(total).toHaveText(/250/);
	await schedule.getByRole('button', { name: '2023', exact: true }).click();
	const edit = page.getByRole('dialog', { name: 'Edit item', exact: true });
	const applied = edit.getByRole('textbox', { name: 'NOLCO applied current year', exact: true });
	await applied.fill('1200');
	await edit.getByRole('button', { name: 'Update', exact: true }).click();
	await expect(edit.getByText('NOLCO applied and expired cannot exceed the loss available.')).toBeVisible();
	await edit.getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(total).toHaveText(/250/);
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await page.getByRole('link', { name: /^Edit BIR Form / }).click();
	await goToReturnPage(page, 4);
	await expect(total).toHaveText(/250/);
	await schedule.getByRole('button', { name: '2023', exact: true }).click();
	await expect(applied).toHaveValue('250');
	await edit.screenshot({ path: info.outputPath('nolco-drawer.png'), animations: 'disabled' });
	await edit.getByRole('button', { name: 'Cancel', exact: true }).click();
	for (const width of [1280, 390]) {
		await page.setViewportSize({ width, height: 900 });
		await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
		await schedule.screenshot({ path: info.outputPath(`nolco-${width}.png`), animations: 'disabled' });
	}
	await transfer.click();
	await expect(page.locator('[id="frm1702RT:txtPg2Pt4I36Nolco"]')).toBeFocused();
	await page.getByRole('link', { name: /Back to forms/ }).click();
	const printed = await printSavedReturn(page, '1702RTv2018', info.outputPath('nolco-return.pdf'));
	await expect(printed.locator('[data-field-id="frm1702RT:txtPg4Sc3AI5C6"]')).toHaveValue('750');
	await expect(printed.locator('[data-field-id="frm1702RT:txtPg4Sc4I8TotalNOLCO"]')).toHaveValue('250');
	await printed.close();
});

const corporateNolcoSchedules = [
	['1702RT', 5, /^Schedule 6A /, 'frm1702RT:txtPg5Sc6AI8TotalNOLCO'],
	['1702RTv2018C', 4, /^Schedule IIIA /, 'frm1702RT:txtPg4Sc4I8TotalNOLCO'],
	['1702MX', 6, /^Schedule 7A /, 'frm1702MX:txtPg6Sc7AI8'],
	['1702MX', 13, /^Schedule IA /, 'frm1702MX:txtPg4SP1ScIAI8CD'],
	['1702MXv2018', 4, /^Schedule 7\.1 /, 'frm1702MX:txtPg3IShed78D'],
	['1702MXv2018', 4, /^Schedule 8\.1 /, 'frm1702MX:txtPg3IShed88D'],
	['1702MXv2018', 6, /^Schedule F\.1 /, 'frm1702MX:txtPg2SP1ScF1I8D'],
	['1702MXv2018C', 4, /^Schedule 7\.1 /, 'frm1702MX:txtPg3IShed78D'],
	['1702MXv2018C', 4, /^Schedule 8\.1 /, 'frm1702MX:txtPg3IShed88D'],
	['1702MXv2018C', 6, /^Schedule F\.1 /, 'frm1702MX:txtPg2SP1ScF1I8D']
] as const;

for (const [code, number, heading, totalId] of corporateNolcoSchedules) {
	test(`${code} uses an Add Item drawer for NOLCO ${totalId.split(':')[1]}`, async ({ page }, info) => {
		const attachment = totalId.includes('SP1');
		const values: Record<string, string> = attachment
			? {
				[code === '1702MX' ? 'frm1702MX:chkPg2Pt4I30MoreThanOne' : 'frm1702MX:rdoPg2I1']: code === '1702MX' ? 'Y' : 'F',
				'frm1702MX:totalSPAttach': '1'
			}
			: {};
		await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, [{
			id: 'nolco', taxpayerId, formCode: code, returnPeriod: '2025',
			status: 'Draft', updatedAt: 1794441600000, finalFlag: '0', values
		}]);
		await page.setViewportSize({ width: 1280, height: 900 });
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?return=nolco`);
		await goToReturnPage(page, number);
		const schedule = page.getByRole('region', { name: heading });
		const total = schedule.locator(`[id="${totalId}"]`);
		const transfer = schedule.getByRole('button', { name: /^To / });
		await expect(total).toBeVisible();
		await expect(transfer).toBeVisible();
		await schedule.getByRole('button', { name: 'Add item', exact: true }).click();
		const drawer = page.getByRole('dialog', { name: 'Add item', exact: true });
		await expect(drawer.getByRole('textbox', { name: 'Year incurred', exact: true })).toBeFocused();
		await drawer.getByRole('textbox', { name: 'Year incurred', exact: true }).fill('2023');
		await drawer.getByRole('textbox', { name: 'Net operating loss', exact: true }).fill('1000');
		await drawer.getByRole('textbox', { name: /applied (current|this) year/i }).fill('250');
		await expect(drawer.locator('output').filter({ hasText: '750' })).toBeVisible();
		await drawer.getByRole('button', { name: 'Add item', exact: true }).click();
		await expect(drawer).toBeHidden();
		await expect(total).toHaveText(/250/);
		for (const width of [1280, 390]) {
			await page.setViewportSize({ width, height: 900 });
			await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
			await schedule.screenshot({ path: info.outputPath(`nolco-${width}.png`), animations: 'disabled' });
		}
		const target = await transfer.getAttribute('data-reference-target');
		await transfer.click();
		await expect(page.locator(':focus')).toHaveAttribute('id', target ?? '');
	});
}
