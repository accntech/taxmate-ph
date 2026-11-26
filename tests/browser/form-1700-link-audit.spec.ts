import { expect, test, type Page } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

type FilingState = 'single' | 'joint' | 'nra-taxpayer' | 'nra-spouse';
const revisions = [
	{ code: '1700', revision: '2013-06', pages: 4 },
	{ code: '1700v2018', revision: '2018-01', pages: 2 }
];

async function openReturn(page: Page, code: string, width: number, state: FilingState) {
	const joint = state !== 'single';
	await seedWorkspace(page, 'light', 'loaded', {
		taxpayerName: 'SANTOS, ALEX, REYES', taxpayerClassification: 'I', civilStatus: joint ? 'Married' : 'Single',
		...(joint ? { spouse: { taxpayerName: 'SANTOS, TAYLOR, CRUZ', tin1: '765', tin2: '432', tin3: '100', branchCode: '00000', rdoCode: '040' } } : {})
	});
	await page.setViewportSize({ width, height: 1040 });
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
	await expect(page.locator('.income-editor')).toBeVisible({ timeout: 20000 });
	if (width < 768) {
		const sidebar = page.locator('aside.sidebar');
		const toggle = page.getByRole('button', { name: 'Toggle sidebar', exact: true });
		await expect(toggle).toBeVisible();
		if (await sidebar.getAttribute('data-mobile-open') === 'true') await toggle.click();
		await page.keyboard.press('Escape');
		await expect(sidebar).not.toHaveAttribute('data-mobile-open', 'true');
		await expect.poll(async () => (await sidebar.boundingBox())!.x, { timeout: 15000 }).toBeLessThan(-245);
	}
	if (joint) {
		if (code === '1700') {
			await page.getByRole('radiogroup', { name: 'Joint return?', exact: true }).getByRole('radio', { name: 'Yes', exact: true }).check();
		} else {
			await page.locator('[id="frm1700:rdoPg1I16SpouseHasIncome"]').check();
			await page.getByRole('radio', { name: 'Joint Filing', exact: true }).check();
		}
	}
	if (code === '1700v2018' && state.startsWith('nra-')) {
		const section = state === 'nra-taxpayer'
			? page.getByRole('region', { name: 'Taxpayer information', exact: true })
			: page.getByRole('region', { name: /Part II - Background Information on Spouse/i });
		await section.getByRole('radio', { name: 'Nonresident alien (25%)', exact: true }).check();
	}
}

async function expandSections(page: Page) {
	const closed = page.locator('.income-editor details:not([open]) > summary');
	while (await closed.count()) await closed.first().click();
}

test('1700 asks who earned the income when filing jointly and preserves a spouse assignment when filing separately', async ({ page }) => {
	await openReturn(page, '1700', 1440, 'joint');
	await goToReturnPage(page, 2);
	const employer = page.getByRole('region', { name: 'Part IV · Employer 1', exact: true });
	const earner = employer.getByRole('radiogroup', { name: 'Income earner', exact: true });
	await expect(earner.getByRole('radio', { name: 'Taxpayer', exact: true })).toBeVisible();
	await earner.getByRole('radio', { name: 'Spouse', exact: true }).check();
	const compensation = employer.getByRole('textbox', { name: 'Compensation income', exact: true });
	await compensation.fill('420000');
	await compensation.blur();
	const taxpayerTotal = page.locator('[id="frm1700:txtPg2Pt4I4AC1"]');
	const spouseTotal = page.locator('[id="frm1700:txtPg2Pt4I4BC1"]');
	await expect(taxpayerTotal).toHaveText('₱0');
	await expect(spouseTotal).toHaveText('₱420,000');

	await goToReturnPage(page, 1);
	await page.getByRole('radiogroup', { name: 'Joint return?', exact: true }).getByRole('radio', { name: 'No', exact: true }).check();
	await goToReturnPage(page, 2);
	await expect(earner).toHaveCount(0);
	await expect(employer.getByText('Spouse in saved draft', { exact: true })).toBeVisible();
	await expect(taxpayerTotal).toHaveText('₱0');
	await employer.getByRole('button', { name: 'Assign to taxpayer' }).click();
	await expect(taxpayerTotal).toHaveText('₱420,000');
});

for (const width of [390, 1440]) {
	test(`1700v2018 keeps employer amount columns aligned when the earner changes at ${width}px`, async ({ page }) => {
		await openReturn(page, '1700v2018', width, 'nra-spouse');
		await page.getByRole('region', { name: 'Taxpayer information', exact: true })
			.getByRole('radio', { name: 'Employee (regular rates)', exact: true }).check();
		await goToReturnPage(page, 2);
		const earner = page.getByRole('region', { name: 'Schedule 1 · Employer 1', exact: true })
			.getByRole('radiogroup', { name: 'Income earner' });
		const field = (id: string) => page.locator(`[id="frm1700:txtPg2ISched1${id}"]`);
		const withholding = field('e_1TW');
		for (const [person, rate, hidden, column] of [
			['Taxpayer', 'c_1REG', 'd_1CIFR', 'A'], ['Spouse', 'd_1CIFR', 'c_1REG', 'B']
		]) {
			await earner.getByRole('radio', { name: person, exact: true }).check();
			await expect(field(hidden)).toHaveCount(0);
			await field(rate).fill('1234567');
			await field(rate).blur();
			await withholding.fill('100000');
			await withholding.blur();
			for (const [input, total, value] of [
				[field(rate), field(rate.replace('_1', `_5${column}`)), '₱1,234,567'],
				[withholding, field(`e_5${column}TW`), '₱100,000']
			] as const) {
				await expect(total).toHaveText(value);
				const inputEdge = await input.evaluate(element => element.getBoundingClientRect().right);
				const totalEdge = await total.evaluate(element => element.getBoundingClientRect().right);
				expect(Math.abs(inputEdge - totalEdge)).toBeLessThanOrEqual(2);
			}
		}
	});
}

async function checkSourceExamples(page: Page, code: string, state: FilingState) {
	const joint = state !== 'single';
	// Expected targets follow the original HTA's printed particulars and A/B columns.
	const examples = code === '1700' ? [
		['From Part IV, Item 14A · Taxpayer', 'frm1700:txtPg2Pt4I14C1'],
		['From Part IV, Item 19A · Taxpayer', 'frm1700:txtPg2Pt4I19C1'],
		[`From Part IV, Item 22 · ${joint ? 'Both filers' : 'Taxpayer'}`, 'frm1700:txtPg2Pt4I22'],
		...(joint ? [['From Part IV, Item 14B · Spouse', 'frm1700:txtPg2Pt4I14C2']] : [])
	] : [
		[state === 'nra-taxpayer' ? 'From Part V.B, Item 53A · Taxpayer' : 'From Part V.A, Item 47A · Taxpayer', state === 'nra-taxpayer' ? 'frm1700:txtPg2I53A' : 'frm1700:txtPg2I47A'],
		['From Part V.C, Item 58A · Taxpayer', 'frm1700:txtPg2I58A'],
		['From Part V, Item 59A · Taxpayer', 'frm1700:txtPg2I59A'],
		...(joint ? [
			[state === 'nra-spouse' ? 'From Part V.B, Item 53B · Spouse' : 'From Part V.A, Item 47B · Spouse', state === 'nra-spouse' ? 'frm1700:txtPg2I53B' : 'frm1700:txtPg2I47B'],
			['From Part V.C, Item 58B · Spouse', 'frm1700:txtPg2I58B']
		] : [])
	];
	for (const [label, target] of examples) {
		await expect(page.getByRole('button', { name: label, exact: true })).toHaveAttribute('data-reference-target', target);
	}
	if (code === '1700v2018') {
		const inapplicable = state === 'nra-taxpayer' ? 'From Part V.A, Item 47A · Taxpayer' : 'From Part V.B, Item 53A · Taxpayer';
		await expect(page.getByRole('button', { name: inapplicable, exact: true })).toHaveCount(0);
		if (joint) {
			const spouseInapplicable = state === 'nra-spouse' ? 'From Part V.A, Item 47B · Spouse' : 'From Part V.B, Item 53B · Spouse';
			await expect(page.getByRole('button', { name: spouseInapplicable, exact: true })).toHaveCount(0);
		}
	}
}

for (const { code, revision, pages } of revisions) {
	for (const width of [320, 390, 1440]) {
		const states: FilingState[] = code === '1700v2018' && width !== 320
			? ['single', 'joint', 'nra-taxpayer', 'nra-spouse'] : ['single', 'joint'];
		for (const state of states) {
			test(`${code} ${state} ${width}px references preserve ownership, focus and layout`, async ({ page }, testInfo) => {
				test.setTimeout(180000);
				await openReturn(page, code, width, state);
				await checkSourceExamples(page, code, state);
				const editor = page.locator('.income-editor');
				const pager = page.getByRole('navigation', { name: 'Return pages' });
				const inventory: Array<{ source: number; label: string; target: string; destination: string }> = [];
				for (let source = 1; source <= pages; source += 1) {
					await goToReturnPage(page, source);
					await expandSections(page);
					await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
					const pagerFollowsFields = await pager.evaluate(nav => {
						const lastSection = nav.closest('.income-editor')?.querySelector('.income-section:last-of-type');
						return !lastSection || nav.getBoundingClientRect().top >= lastSection.getBoundingClientRect().bottom - 1;
					});
					expect.soft(pagerFollowsFields, `Page ${source} pagination follows the fields`).toBe(true);
					if (source === 1 && state !== 'single') {
						const spouseTin = editor.getByText('Spouse TIN and branch code', { exact: true });
						await expect.soft(spouseTin).toHaveCount(1);
						if (await spouseTin.count()) await expect.soft(spouseTin.locator('..')).toContainText('765-432-100-00000');
					}
					if (source === 2 && code === '1700v2018') {
						await expect.soft(editor.getByRole('heading', { name: 'Part V.C · Tax credits and payments' })).toBeVisible();
						if (state.startsWith('nra-')) {
							const flatRateTitle = 'Part V.B · 25% flat rate for nonresident aliens not engaged in trade or business';
							await expect.soft(editor.getByRole('heading', { name: flatRateTitle })).toBeVisible();
							const flatRate = editor.getByRole('table', { name: flatRateTitle });
							await expect.soft(flatRate.getByRole('columnheader')).toHaveText(['Item', 'Description', 'Taxpayer', 'Spouse']);
							const inactiveCell = flatRate.locator('[data-income-item="53"] td').nth(state === 'nra-taxpayer' ? 2 : 1);
							await expect.soft(inactiveCell).toHaveText('—');
							if (width === 1440) {
								const employer = page.getByRole('region', { name: 'Schedule 1 · Employer 1', exact: true });
								const amountPositions = await employer.getByRole('textbox', { name: /compensation|tax withheld/i }).evaluateAll(inputs => inputs.map(input => input.getBoundingClientRect().top));
								expect.soft(amountPositions).toHaveLength(3);
								expect.soft(new Set(amountPositions).size).toBe(1);
							}
						}
					}
					if (width < 768) {
						const defects = await editor.locator('.filer-reference-list').evaluateAll(lists => lists.flatMap(list => {
							const bounds = list.getBoundingClientRect();
							const buttons = [...list.querySelectorAll<HTMLButtonElement>('button[data-reference-target]')];
							return buttons.flatMap((button, index) => {
								const rect = button.getBoundingClientRect();
								const previous = index ? buttons[index - 1].getBoundingClientRect() : undefined;
								const atomicParts = [...button.querySelectorAll<HTMLElement>('.filer-reference-item, .filer-reference-owner')];
								const splitPart = atomicParts.some(part => {
									const lines = [...part.getClientRects()];
									return lines.length > 1 && Math.max(...lines.map(line => line.top)) - Math.min(...lines.map(line => line.top)) > 1;
								});
								const outside = rect.left < bounds.left - 1 || rect.right > bounds.right + 1;
								const clipped = button.scrollWidth > button.clientWidth + 1;
								const overlap = previous && rect.top < previous.bottom - 1;
								const owner = button.querySelector('.filer-reference-owner')?.textContent?.trim();
								return outside || clipped || overlap || splitPart || !owner ? [{ label: button.textContent?.trim(), outside, clipped, overlap, splitPart, owner }] : [];
							});
						}));
						expect.soft(defects, `Page ${source} reference wrapping`).toEqual([]);
					}
					const references = await editor.locator('button[data-reference-target]:visible').evaluateAll(buttons => buttons.map(button => ({
						label: button.textContent?.replace(/\s+/g, ' ').trim() ?? '',
						target: button.getAttribute('data-reference-target') ?? '', destination: button.getAttribute('data-reference-page') ?? ''
					})));
					if ((state === 'joint' || state === 'nra-spouse') && process.env.FORM_1700_LINK_CAPTURE_DIR) {
						const { mkdirSync } = await import('node:fs');
						const { join } = await import('node:path');
						const device = width === 1440 ? 'desktop' : `mobile-${width}`;
						const directory = join(process.env.FORM_1700_LINK_CAPTURE_DIR, revision, state === 'joint' ? device : `mixed-rates-${device}`);
						mkdirSync(directory, { recursive: true });
						await page.evaluate(async () => {
							await document.fonts.ready;
							if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
						});
						await editor.screenshot({ path: join(directory, `page-${source}.png`), animations: 'disabled', scale: 'css', style: '.eq-action-bar, .window-titlebar, .skip-link { visibility: hidden !important; }' });
					}
					for (let index = 0; index < references.length; index += 1) {
						const reference = references[index];
						inventory.push({ source, ...reference });
						await test.step(`page ${source} ${reference.label} → ${reference.target}`, async () => {
							await goToReturnPage(page, source);
							await expandSections(page);
							const button = editor.locator('button[data-reference-target]:visible').nth(index);
							await expect(button).toHaveAccessibleName(reference.label);
							expect(reference.label).toMatch(/ · (?:Taxpayer|Spouse|Both filers)$/);
							await button.click();
							await expect(pager.getByRole('button', { name: /^Find a page,/ })).toHaveText(`Page ${reference.destination} of ${pages}`);
							const target = page.locator(`[id="${reference.target}"]`);
							await expect(target).toBeFocused({ timeout: 1500 });
							const visible = await target.evaluate(element => {
								const rect = element.getBoundingClientRect();
								const x = Math.max(1, Math.min(innerWidth - 1, rect.x + rect.width / 2));
								const y = Math.max(49, Math.min(innerHeight - 81, rect.y + rect.height / 2));
								const hit = document.elementFromPoint(x, y);
								return rect.bottom > 48 && rect.top < innerHeight - 80 && !!hit && (element === hit || element.contains(hit));
							});
							expect(visible, `${reference.label} exposes its focused target`).toBe(true);
						});
					}
				}
				expect(inventory.length).toBeGreaterThan(5);
				await testInfo.attach('rendered-reference-inventory', { body: JSON.stringify(inventory, null, 2), contentType: 'application/json' });
				console.log(`${code} ${state} ${width}px checked ${inventory.length} reference clicks across ${pages} pages`);
			});
		}
	}
}
