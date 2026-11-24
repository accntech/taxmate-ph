import { expect, test, type Page } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

const list = `/ebirforms/taxpayers/${taxpayerId}/forms`;
const profile = {
	taxpayerName: 'SANTOS, ALEX, REYES', taxpayerClassification: 'I' as const,
	taxpayerType: 'professional' as const, civilStatus: 'Single' as const,
	tradeName: 'Santos Advisory', psicCode: '69200'
};

async function openReturn(page: Page, code: string, width = 1440, joint = false) {
	await seedWorkspace(page, 'light', 'loaded', { ...profile, civilStatus: joint ? 'Married' : 'Single' });
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
	await page.getByRole('textbox', { name: 'Filing year', exact: true }).fill('2017');
	const taxDue = page.getByRole('table', { name: 'Calculated tax amounts' }).getByRole('row', { name: /^26 / });
	await taxDue.getByRole('button', { name: 'From Item 72A · Taxpayer', exact: true }).click();
	await expect(page.locator('[id="frm1701:txtPg3Pt5I72TotalIncomeTaxC1"]')).toBeFocused();
	await expect(page.getByText('Page 3 of 12', { exact: true })).toBeVisible();
	await goToReturnPage(page, 1);
	await expect(page.getByRole('textbox', { name: 'Filing year', exact: true })).toHaveValue('2017');
});

test('January 1701 item reference reaches the tax-credit total by keyboard on mobile', async ({ page }) => {
	await openReturn(page, '1701v2018', 390);
	const taxCredits = page.getByRole('table', { name: 'Calculated tax amounts' }).getByRole('row', { name: /^23 / });
	const reference = taxCredits.getByRole('button', { name: 'From Part VII, Item 10A · Taxpayer', exact: true });
	await reference.focus();
	await reference.press('Enter');
	await expect(page.locator('[id="frm1701:txtPg4IPart7_10A"]')).toBeFocused();
	await expect(page.getByRole('navigation', { name: 'Return pages' }).locator('.page-summary > .page-count')).toHaveText(['4', '4']);
});

test('January 1701 links to separate activity inputs only for multiple activities', async ({ page }) => {
	await openReturn(page, '1701v2018');
	await enableAttachments(page);
	await goToReturnPage(page, 5);
	const consolidation = page.getByRole('table', { name: 'Schedule B · Consolidated income tax', exact: true });
	const activityReference = consolidation.getByRole('button', { name: 'From Part XI, Schedule B, Item 1A · Taxpayer', exact: true });
	await expect(consolidation.getByRole('button', { name: 'From Schedule C, Item 18B · Taxpayer', exact: true })).toBeVisible();
	await expect(activityReference).toHaveCount(0);
	await page.getByRole('radio', { name: 'Two or more exempt or special-rate activities', exact: true }).check();
	await activityReference.click();
	await expect(page.locator('[id="frm1701:txtPg3mSchedB_1ATYPE"]')).toBeFocused();
});

test('June 1701 keeps the first amount visible beside optional descriptions on mobile', async ({ page }) => {
	await openReturn(page, '1701', 390);
	await enableAttachments(page);
	await goToReturnPage(page, 16);
	const deductions = page.getByRole('table', { name: /Schedule H .*Ordinary itemized deductions/ });
	const amount = deductions.locator('[id="frm1701:txtPg4mScHI36C2TYPE"]');
	const description = deductions.locator('[id="frm1701:txtPg4mScHI36NatureOfIncomeC1TYPE"]');
	await expect(description).toBeVisible();
	const amountInView = await amount.evaluate(input =>
		input.getBoundingClientRect().right <= input.closest('.regime-viewport')!.getBoundingClientRect().right
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
	await page.getByRole('textbox', { name: 'Filing year', exact: true }).fill('2017');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	const values = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns.find((record: { formCode: string }) => record.formCode === '1701').values);
	expect(values['frm1701:rdoPg1Pt1I4ATC']).toBe('Mixed');
	expect(values['frm1701:rdoPg1Pt1I21Accounting']).toBe('Accrual');
	await page.getByRole('row').filter({ hasText: 'BIR Form 1701' }).getByRole('link', { name: 'Edit', exact: true }).click();
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
	const employer = page.getByRole('region', { name: 'Schedule 1 · Employer 1', exact: true });
	await expect(employer.getByRole('radiogroup', { name: 'Income earner', exact: true })).toHaveCount(0);
	await expect(employer).toContainText('Taxpayer');
	await employer.locator('[id="frm1701:txtPg2IShed1c_1CI"]').fill('500000');
	await employer.locator('[id="frm1701:txtPg2IShed1c_1CI"]').blur();
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
	await page.getByRole('textbox', { name: 'Filing year', exact: true }).fill('2025');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns.find((record: { formCode: string }) => record.formCode === '1701v2018').values);
	expect(saved['frm1701:rdoPg1Overpayment']).toBe('Refund');
});

for (const width of [1440, 390]) {
	test(`1701 consolidated amounts display a populated value completely at ${width}px`, async ({ page }) => {
		await openReturn(page, '1701', width);
		await goToReturnPage(page, 12);
		const amount = page.locator('[id="frm1701:txtPg12Pt9I1SalesC1"]');
		await amount.fill('123456789.12');
		await amount.blur();
		const size = await amount.evaluate((input: HTMLInputElement) => ({ client: input.clientWidth, scroll: input.scrollWidth }));
		expect(size.client).toBeGreaterThanOrEqual(size.scroll);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
		await captureEvidence(page, `2013-06-regimes-${width}-left`);
		await page.locator('.regime-viewport').evaluateAll(areas => areas.forEach(area => area.scrollLeft = area.scrollWidth));
		await captureEvidence(page, `2013-06-regimes-${width}-right`);
	});
}

for (const [code, field] of [
	['1701', 'frm1701:txtPg2Pt4I41GrossCompensationC1'],
	['1701v2018', 'frm1701:txtPg2IShed3_8A']
]) {
	test(`${code} mobile schedule shows the complete formatted amount after blur`, async ({ page }) => {
		await openReturn(page, code, 390);
		await goToReturnPage(page, 2);
		const amount = page.locator(`[id="${field}"]`);
		await amount.fill('123456789.12');
		await amount.blur();
		await expect(amount).toHaveValue('123,456,789.12');
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
	await expect(schedule).toContainText(/Taxpayer/);
	await expect(schedule).toContainText(/Spouse/);
	for (const regime of ['Exempt', 'Special', 'Regular']) await expect(schedule).toContainText(regime);
	await captureEvidence(page, '2018-01-joint-consolidation-05');
	await goToReturnPage(page, 6);
	const amount = page.locator('[id="frm1701:txtPg2mI17aASchdC"]');
	await amount.fill('123456789.12');
	await amount.blur();
	const size = await amount.evaluate((input: HTMLInputElement) => ({ client: input.clientWidth, scroll: input.scrollWidth }));
	expect(size.client).toBeGreaterThanOrEqual(size.scroll);
	await expect(page.locator('.income-editor')).not.toContainText(/(?:C[12]TYPE|\bm Sched|Desc Schd|LB Schd)/);
	await captureEvidence(page, '2018-01-joint-consolidation-06');
});

test('1701 January matrix date segments fit beside the calendar button', async ({ page }) => {
	await openReturn(page, '1701v2018');
	await enableAttachments(page);
	await goToReturnPage(page, 5);
	const groups = page.locator('.column-schedule [data-slot="date-input"] [role="group"]');
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
	const employer = page.getByRole('region', { name: 'Schedule 1 · Employer 1', exact: true });
	const earner = employer.getByRole('radiogroup', { name: 'Income earner', exact: true });
	await expect(earner.getByRole('radio', { name: 'Taxpayer', exact: true })).toBeVisible();
	await expect(earner.getByRole('radio', { name: 'Spouse', exact: true })).toBeVisible();
	await earner.getByRole('radio', { name: 'Spouse', exact: true }).check();
	await expect(earner.getByRole('radio', { name: 'Spouse', exact: true })).toBeChecked();
});

test('1701 January activity tax rates have percentage controls and readable labels', async ({ page }) => {
	await openReturn(page, '1701v2018');
	await enableAttachments(page);
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
			await page.getByRole('textbox', { name: 'Filing year', exact: true }).fill(code === '1701' ? '2017' : '2025');
			await enableAttachments(page);
			const editor = page.locator('.income-editor');
			const pager = editor.getByRole('navigation', { name: 'Return pages' });
			for (let number = 1; number <= total; number += 1) {
				await expect(pager.locator('.page-summary > .page-count')).toHaveText([String(number), String(total)]);
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
			await expect(pager.locator('.page-summary > .page-count')).toHaveText([String(total), String(total)]);
			expect(checked).toBeGreaterThan(20);
		});
	}
}
