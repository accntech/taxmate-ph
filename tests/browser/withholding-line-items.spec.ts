import { expect, test, type Page } from '@playwright/test';
import { getWithholdingAtcs, getWithholdingDefinition, withholdingDefinitions, type WithholdingSchedule } from '../../src/lib/forms/withholding-definitions';
import { seedWorkspace, taxpayerId } from './fixtures';

test.beforeEach(async ({ page }) => {
	// Keep each mounted editor stable while other workspace work triggers Vite HMR.
	await page.routeWebSocket('**/*', socket => socket.close());
});

async function openSchedule(page: Page, title: string) {
	const heading = page.locator('summary').filter({ hasText: title }).first();
	if (await heading.locator('..').getAttribute('open') === null) await heading.click();
}

async function seededSchedule(page: Page, code: string, scheduleId: string, tuples: string[][]) {
	const definition = getWithholdingDefinition(code)!;
	const schedule = definition.schedules.find(schedule => schedule.id === scheduleId)!;
	const values: Record<string, string> = {
		[definition.prefix + 'optCategory']: 'P', [definition.prefix + 'optWithheld']: 'Y',
		[definition.prefix + 'optRelief']: 'Y', [definition.yearField]: '2017',
		...(definition.monthField ? { [definition.monthField]: '06' } : {}),
		...(definition.quarterField ? { [definition.quarterField]: 'Q2' } : {})
	};
	for (const [index, tuple] of tuples.entries()) for (const [part, field] of schedule.rows[index].fields.entries()) values[field.id] = tuple[part];
	await seedWorkspace(page);
	await page.addInitScript(({ code, values }) => {
		const data = JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!);
		Object.assign(data.returns[0], { formCode: code, values });
		localStorage.setItem('ebirforms-created-returns-v1', JSON.stringify(data));
	}, { code, values });
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?return=review-return`);
	await openSchedule(page, schedule.title);
	return schedule;
}

function scheduleList(page: Page, schedule: WithholdingSchedule) {
	return page.getByRole('list', { name: `${schedule.title} line items`, exact: true });
}

for (const definition of withholdingDefinitions.filter(definition => definition.schedules.some(schedule => schedule.id === 'atc'))) {
	test(`${definition.code} commits a valid ATC only after Add and discards edited drafts`, async ({ page }) => {
		await seedWorkspace(page);
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${definition.code}?new=true`);
		await page.getByRole('radiogroup', { name: 'Any tax withheld?', exact: true }).getByRole('radio', { name: 'Yes', exact: true }).check();
		const schedule = definition.schedules.find(schedule => schedule.id === 'atc')!;
		await openSchedule(page, schedule.title);
		await page.getByRole('button', { name: `Add line item to ${schedule.title}`, exact: true }).click();
		const editor = page.getByRole('dialog', { name: 'New line item', exact: true });
		await editor.getByRole('button', { name: 'Add', exact: true }).click();
		await expect(editor).toBeVisible();
		const code = getWithholdingAtcs(definition.code, 'P').find(record => record.code !== 'N/A')!.code;
		await editor.getByRole('combobox', { name: 'ATC', exact: true }).click();
		await page.getByPlaceholder('Search code or income', { exact: true }).fill(code);
		await page.getByRole('option', { name: new RegExp(`^${code} `) }).first().click();
		await editor.getByRole('textbox', { name: 'Tax base', exact: true }).fill('1000');
		await expect(scheduleList(page, schedule).getByRole('listitem')).toHaveCount(0);
		await editor.getByRole('button', { name: 'Add', exact: true }).click();
		await expect(editor).toBeHidden();
		await expect(scheduleList(page, schedule).getByRole('listitem')).toHaveCount(1);
		await expect(scheduleList(page, schedule)).toContainText(code);
		await scheduleList(page, schedule).getByRole('button', { name: 'Edit line item 1', exact: true }).click();
		const edit = page.getByRole('dialog', { name: 'Edit line item 1', exact: true });
		await edit.getByRole('textbox', { name: 'Tax base', exact: true }).fill('2000');
		await edit.getByRole('button', { name: 'Cancel', exact: true }).click();
		await expect(scheduleList(page, schedule)).toContainText('1,000.00');
		await expect(scheduleList(page, schedule)).not.toContainText('2,000.00');
	});
}

for (const [code, scheduleId, tuples] of [
	['1601E', 'atc', [['WI120', '100000', '2', '2000'], ['WI010', '20000', '10', '2000']]],
	['1600', 'payees', [['001234567', 'First payee', 'WI100', '1000', '5', '50'], ['009876543', 'Second payee', 'WI100', '2000', '5', '100']]],
	['1601FQ', 'treaty', [['TT01', 'WI202', '1000', '5', '50'], ['TT02', 'WI203', '2000', '10', '200']]]
] as const) {
	test(`${code}/${scheduleId} drags whole rows, animates, and persists its order`, async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 1100 });
		const schedule = await seededSchedule(page, code, scheduleId, tuples.map(tuple => [...tuple]));
		const list = scheduleList(page, schedule);
		await list.scrollIntoViewIfNeeded();
		const original = await list.getByRole('listitem').first().elementHandle();
		const source = await list.getByRole('button', { name: 'Drag line item 2', exact: true }).boundingBox();
		const target = await list.getByRole('button', { name: 'Drag line item 1', exact: true }).boundingBox();
		await page.mouse.move(source!.x + source!.width / 2, source!.y + source!.height / 2);
		await page.mouse.down();
		await page.mouse.move(target!.x + target!.width / 2, target!.y + target!.height / 2, { steps: 8 });
		await expect(list.getByRole('listitem').first()).toContainText(tuples[1][0]);
		await page.mouse.up();
		expect(await original!.textContent()).toContain(tuples[0][0]);
		await list.getByRole('button', { name: 'Drag line item 1', exact: true }).press('ArrowDown');
		await expect.poll(() => original!.evaluate(element => element.getAnimations().some(animation => animation.playState === 'running' && (animation.effect as KeyframeEffect).getKeyframes().some(frame => frame.transform && frame.transform !== 'none')))).toBe(true);
		await list.getByRole('button', { name: 'Drag line item 2', exact: true }).press('ArrowUp');
		await list.getByRole('button', { name: 'Remove line item 1', exact: true }).click();
		await page.getByRole('region', { name: schedule.title, exact: true }).getByRole('button', { name: 'Undo', exact: true }).click();
		await expect(list.getByRole('listitem').first()).toContainText(tuples[1][0]);
		await page.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(page).toHaveURL(/\/forms$/);
		const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns[0].values);
		for (const [index, field] of schedule.rows[0].fields.entries()) if (!field.readonly) expect(saved[field.id]).toBe(tuples[1][index]);
		await page.getByRole('link', { name: 'Edit', exact: true }).click();
		await openSchedule(page, schedule.title);
		await expect(list.getByRole('listitem').first()).toContainText(tuples[1][0]);
	});
}

test('overflow drafts allocate row 11 only on commit', async ({ page }) => {
	const schedule = await seededSchedule(page, '1601E', 'atc', Array.from({ length: 10 }, () => ['WI120', '1000', '2', '20']));
	const list = scheduleList(page, schedule);
	const add = page.getByRole('button', { name: `Add line item to ${schedule.title}`, exact: true });
	await add.click();
	const editor = page.getByRole('dialog', { name: 'New line item', exact: true });
	await expect(editor.locator('[id="frm1601E:txtAtcCode11"]')).toBeVisible();
	await editor.getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(list.getByRole('listitem')).toHaveCount(10);
	await add.click();
	await editor.getByRole('combobox', { name: 'ATC', exact: true }).click();
	await page.getByPlaceholder('Search code or income', { exact: true }).fill('WI120');
	await page.getByRole('option', { name: /^WI120 / }).click();
	await editor.getByRole('textbox', { name: 'Tax base', exact: true }).fill('2000');
	await editor.getByRole('button', { name: 'Add', exact: true }).click();
	await expect(list.getByRole('listitem')).toHaveCount(11);
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns[0].values);
	expect(saved['frm1601E:__rows:atc']).toBe('11');
	expect(saved['frm1601E:txtTaxBase11']).toBe('2000');
});

test('annual month rows use draft editing while preserving their assigned month', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1604C?new=true`);
	const schedule = getWithholdingDefinition('1604C')!.schedules[0];
	await openSchedule(page, schedule.title);
	await page.getByRole('button', { name: `Add line item to ${schedule.title}`, exact: true }).click();
	const editor = page.getByRole('dialog', { name: 'New line item', exact: true });
	await editor.getByRole('combobox', { name: 'Schedule row', exact: true }).click();
	await page.getByRole('option', { name: 'March', exact: true }).click();
	await expect(editor.locator('[id="frm1604c:txtSched1Date3"]')).toBeVisible();
	await editor.getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(scheduleList(page, schedule).getByRole('listitem')).toHaveCount(0);
});

test('fixed fringe-benefit rows keep their prescribed category and tax rate', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1603Qv2018?new=true`);
	await page.getByRole('radiogroup', { name: 'Any tax withheld?', exact: true }).getByRole('radio', { name: 'Yes', exact: true }).check();
	const schedule = getWithholdingDefinition('1603Qv2018')!.schedules[0];
	await openSchedule(page, schedule.title);
	await page.getByRole('button', { name: `Add line item to ${schedule.title}`, exact: true }).click();
	const editor = page.getByRole('dialog', { name: 'New line item', exact: true });
	await editor.getByRole('textbox', { name: 'Monetary value of benefit', exact: true }).fill('650');
	await editor.getByRole('button', { name: 'Add', exact: true }).click();
	await expect(editor).toBeHidden();
	const list = scheduleList(page, schedule);
	await expect(list).toContainText('Citizens and resident / engaged aliens');
	await expect(list).toContainText('350.00');
	await expect(list.getByRole('button', { name: /^Drag line item/ })).toHaveCount(0);
});

test('schedule pointer previews cancel on Escape and reduced motion skips reordering animation', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 1100 });
	const schedule = await seededSchedule(page, '1601E', 'atc', [['WI120', '100000', '2', '2000'], ['WI010', '20000', '10', '2000']]);
	const list = scheduleList(page, schedule);
	await list.scrollIntoViewIfNeeded();
	const second = await list.getByRole('button', { name: 'Drag line item 2', exact: true }).boundingBox();
	const first = await list.getByRole('button', { name: 'Drag line item 1', exact: true }).boundingBox();
	await page.mouse.move(second!.x + 10, second!.y + 10);
	await page.mouse.down();
	await page.mouse.move(first!.x + 10, first!.y + 10, { steps: 8 });
	await expect(list.getByRole('listitem').first()).toContainText('WI010');
	await page.keyboard.press('Escape');
	await page.mouse.up();
	await expect(list.getByRole('listitem').first()).toContainText('WI120');
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await list.getByRole('button', { name: 'Drag line item 1', exact: true }).press('ArrowDown');
	await expect(list.getByRole('listitem').first()).toContainText('WI010');
	expect(await list.evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running' && Number(animation.effect?.getTiming().duration) > 1))).toHaveLength(0);
});

test('signed annual adjustments keep the committed summary calculated', async ({ page }) => {
	const definition = getWithholdingDefinition('1604CF')!;
	const schedule = definition.schedules[0];
	const tuple = schedule.rows[0].fields.map(field => field.readonly ? '900' : field.allowNegative ? '-100' : field.type === 'date' ? '2025-01-10' : field.type === 'money' ? /TaxWheld|TaxWithheld/.test(field.id) ? '1000' : '0' : 'REF01');
	await seededSchedule(page, definition.code, schedule.id, [tuple]);
	const summary = page.getByRole('complementary', { name: 'Summary', exact: true });
	await expect(summary).toContainText('900.00');
	await expect(summary.getByText('Correct the amounts to calculate the total.', { exact: true })).toHaveCount(0);
});

test('payee editor fits a narrow dark window and keeps keyboard focus visible', async ({ page }, testInfo) => {
	await page.setViewportSize({ width: 390, height: 960 });
	await seedWorkspace(page, 'dark');
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1600?new=true`);
	const schedule = getWithholdingDefinition('1600')!.schedules.find(schedule => schedule.id === 'payees')!;
	await openSchedule(page, schedule.title);
	await page.getByRole('button', { name: `Add line item to ${schedule.title}`, exact: true }).click();
	const editor = page.getByRole('dialog', { name: 'New line item', exact: true });
	const first = editor.getByRole('textbox', { name: 'Payee TIN', exact: true });
	await expect(first).toBeFocused();
	await editor.evaluate(async element => { await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {}))); });
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	await page.screenshot({ path: testInfo.outputPath('schedule-payee-dark-narrow.png') });
	await page.keyboard.press('Escape');
	await expect(editor).toBeHidden();
});

for (const definition of withholdingDefinitions.filter(definition => definition.schedules.length)) {
	test(`${definition.code} schedule adds use an isolated draft editor`, async ({ page }) => {
		await seedWorkspace(page);
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${definition.code}?new=true`);
		await expect(page.getByRole('heading', { name: `BIR Form ${definition.code}`, exact: true })).toBeVisible();
		for (const schedule of definition.schedules) {
			await openSchedule(page, schedule.title);
			const add = page.getByRole('button', { name: `Add line item to ${schedule.title}`, exact: true });
			await add.click();
			const editor = page.getByRole('dialog', { name: 'New line item', exact: true });
			await expect(editor).toBeVisible();
			const input = schedule.rows[0].fields.find(field => !field.readonly)!;
			await expect(editor.locator(`[id="${input.id}"]`)).toBeVisible();
			await editor.getByRole('button', { name: 'Cancel', exact: true }).click();
			await expect(editor).toBeHidden();
			await expect(page.getByRole('list', { name: `${schedule.title} line items`, exact: true }).getByRole('listitem')).toHaveCount(0);
		}
	});
}
