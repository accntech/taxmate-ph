import { expect, test, type Page } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

const revisions = [
	{ code: '1701', pages: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '1mTYPE', '2mTYPE', '3mTYPE', '4mTYPE', '5mTYPE'] },
	{ code: '1701v2018', pages: ['1', '2', '3', '4', '1m', '2m', '1mTYPE', '2mTYPE'] }
];

type FilingState = 'single' | 'joint' | 'mixed' | 'mixed-taxpayer';
type Reference = { label: string; target: string; page: string };

async function expandSections(page: Page) {
	const closed = page.locator('.income-editor details:not([open]) > summary');
	while (await closed.count()) await closed.first().click();
}

async function openReturn(page: Page, code: string, width: number, state: FilingState) {
	const joint = state !== 'single';
	await seedWorkspace(page, 'light', 'loaded', {
		taxpayerName: 'SANTOS, ALEX, REYES', taxpayerClassification: 'I', taxpayerType: 'professional',
		civilStatus: joint ? 'Married' : 'Single', tradeName: 'Santos Advisory', psicCode: '69200',
		...(joint ? { spouse: { taxpayerName: 'SANTOS, TAYLOR, CRUZ', tin1: '765', tin2: '432', tin3: '100', branchCode: '00000', rdoCode: '040' } } : {})
	});
	await page.setViewportSize({ width, height: 1040 });
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
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
	if (code === '1701v2018') {
		await page.getByRole('combobox', { name: 'Alphanumeric tax code (ATC)', exact: true }).click();
		await page.getByRole('option', { name: state === 'mixed-taxpayer' ? /II016/ : /II012/ }).click();
	}
	// June joint and January mixed cases exercise spouse-only attachment eligibility.
	const spouseOnly = code === '1701' && joint || state === 'mixed' || state === 'mixed-taxpayer';
	for (const label of [/^Exempt income\?$/i, /^Income subject to a special rate\?$/i]) {
		await page.getByRole('radiogroup', { name: label }).getByRole('radio', { name: spouseOnly ? 'No' : 'Yes', exact: true }).check();
	}
	if (joint) {
		await goToReturnPage(page, code === '1701' ? 4 : 2);
		await page.getByRole('radiogroup', { name: 'Spouse has exempt income?', exact: true }).getByRole('radio', { name: 'Yes', exact: true }).check();
		await page.getByRole('radiogroup', { name: 'Spouse has income subject to a special rate?', exact: true }).getByRole('radio', { name: 'Yes', exact: true }).check();
		if (code === '1701v2018') {
			await page.getByRole('combobox', { name: 'Spouse alphanumeric tax code (ATC)', exact: true }).click();
			await page.getByRole('option', { name: state === 'mixed' ? /II015/ : state === 'mixed-taxpayer' ? /II013/ : /II012/ }).click();
		}
	}
	if (code === '1701v2018') {
		await goToReturnPage(page, 5);
		await page.getByRole('radio', { name: 'Two or more exempt or special-rate activities', exact: true }).check();
	}
	await goToReturnPage(page, 1);
}

async function checkSourceExamples(page: Page, code: string, state: FilingState) {
	// These expected destinations follow the A/B ownership headings in the legacy HTA,
	// independently of the target metadata used by the exhaustive interaction sweep.
	const examples = code === '1701' ? [
		['From Item 72A · Taxpayer', 'frm1701:txtPg3Pt5I72TotalIncomeTaxC1', '3'],
		['From Item 76A · Taxpayer', 'frm1701:txtPg3Pt5I76TotalTaxC1', '3'],
		...(state !== 'single' ? [['From Item 72B · Spouse', 'frm1701:txtPg3Pt5I72TotalIncomeTaxC2', '3']] : [])
	] : [
		['From Part VI, Item 5A · Taxpayer', 'frm1701:txtPg4ISc6_5A', '4'],
		['From Part VII, Item 10A · Taxpayer', 'frm1701:txtPg4IPart7_10A', '4'],
		...(state !== 'single' ? [['From Part VII, Item 10B · Spouse', 'frm1701:txtPg4IPart7_10B', '4']] : [])
	];
	for (const [label, target, destination] of examples) {
		const button = page.getByRole('button', { name: label, exact: true });
		await expect(button).toHaveAttribute('data-reference-target', target);
		await expect(button).toHaveAttribute('data-reference-page', destination);
	}
	if (state === 'single') {
		await expect(page.getByRole('button', { name: code === '1701' ? 'From Item 72B · Spouse' : 'From Part VII, Item 10B · Spouse', exact: true })).toHaveCount(0);
	}
	if (code === '1701v2018' && state === 'mixed-taxpayer') {
		await goToReturnPage(page, 4);
		await expect(page.getByRole('button', { name: 'From Schedule 3.B, Item 32A · Taxpayer', exact: true }))
			.toHaveAttribute('data-reference-target', 'frm1701:txtPg3IShed3_32A');
		await expect(page.getByRole('button', { name: 'From Schedule 3.A, Item 25B · Spouse', exact: true }))
			.toHaveAttribute('data-reference-target', 'frm1701:txtPg2IShed3_25B');
		await expect(page.getByRole('button', { name: 'From Schedule 3.A, Item 25A · Taxpayer', exact: true })).toHaveCount(0);
		await expect(page.getByRole('button', { name: 'From Schedule 3.B, Item 32B · Spouse', exact: true })).toHaveCount(0);
		await goToReturnPage(page, 1);
	}
}

for (const revision of revisions) {
	for (const width of [1440, 390]) {
		for (const state of (revision.code === '1701v2018' ? ['single', 'joint', 'mixed', 'mixed-taxpayer'] : ['single', 'joint']) as FilingState[]) {
			test(`${revision.code} ${state} ${width}px every rendered item link reaches its field`, async ({ page }, testInfo) => {
				test.setTimeout(180000);
				await openReturn(page, revision.code, width, state);
				await checkSourceExamples(page, revision.code, state);
				const pager = page.locator('nav[aria-label="Return pages"]');
				const inventory: Array<{ source: number; activityRegime?: string; references: Reference[] }> = [];
				const allPages = revision.pages.map((_, index) => index + 1);
				const traversals = revision.code === '1701v2018'
					? [{ activityRegime: 'Exempt', sources: allPages }, { activityRegime: 'Special Rate', sources: [7, 8] }]
					: [{ activityRegime: undefined, sources: allPages }];
				for (const traversal of traversals) {
					if (traversal.activityRegime) {
						await goToReturnPage(page, 7);
						await page.getByRole('radiogroup', { name: 'Activity tax regime', exact: true })
							.getByRole('radio', { name: traversal.activityRegime, exact: true }).check();
					}
					for (const source of traversal.sources) {
						await goToReturnPage(page, source);
						await expandSections(page);
						const references = await page.locator('.income-editor button[data-reference-target]:visible').evaluateAll(buttons => buttons.map(button => ({
							label: button.textContent?.replace(/\s+/g, ' ').trim() ?? '', target: button.getAttribute('data-reference-target') ?? '', page: button.getAttribute('data-reference-page') ?? ''
						})));
						inventory.push({ source, activityRegime: traversal.activityRegime, references });
						for (let index = 0; index < references.length; index += 1) {
							const reference = references[index];
							expect(reference.label).toMatch(/ · (?:Taxpayer|Spouse|Both filers)$/);
							await test.step(`page ${source} ${index + 1} ${reference.label} → ${reference.target}`, async () => {
								await goToReturnPage(page, source);
								await expandSections(page);
								const button = page.locator('.income-editor button[data-reference-target]:visible').nth(index);
								await expect(button).toHaveAttribute('data-reference-target', reference.target);
								await expect(button).toHaveAccessibleName(reference.label);
								await button.click();
								const destination = revision.pages.indexOf(reference.page) + 1;
								expect(destination, `Unknown destination page ${reference.page}`).toBeGreaterThan(0);
								await expect(pager.locator('.page-summary > .page-count')).toHaveText([String(destination), String(revision.pages.length)]);
								const target = page.locator(`[id="${reference.target}"]`);
								await expect(target).toBeFocused({ timeout: 1500 });
								const visible = await target.evaluate(element => {
									const rect = element.getBoundingClientRect();
									const inViewport = rect.width > 0 && rect.height > 0 && rect.bottom > 48 && rect.top < innerHeight - 80 && rect.right > 0 && rect.left < innerWidth;
									const x = Math.max(1, Math.min(innerWidth - 1, rect.x + rect.width / 2));
									const y = Math.max(49, Math.min(innerHeight - 81, rect.y + rect.height / 2));
									const hit = document.elementFromPoint(x, y);
									return inViewport && !!hit && (element === hit || element.contains(hit));
								});
								expect(visible, `${reference.label} must expose the focused target in the viewport`).toBe(true);
								const drawer = page.getByRole('dialog');
								if (await drawer.isVisible()) await drawer.getByRole('button', { name: 'Cancel', exact: true }).click();
							});
						}
					}
				}
				const count = inventory.reduce((total, item) => total + item.references.length, 0);
				expect(count).toBeGreaterThan(20);
				await testInfo.attach('rendered-reference-inventory', { body: JSON.stringify(inventory, null, 2), contentType: 'application/json' });
				console.log(`${revision.code} ${state} ${width}px checked ${count} rendered links across ${revision.pages.length} pages`);
			});
		}
	}
}
