import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';
import { withholdingDefinitions } from '../../src/lib/forms/withholding-definitions';

for (const [width, theme] of [[1440, 'light'], [390, 'dark']] as const) {
	test(`form labels and drawer spacing stay consistent at ${width}px`, async ({ page }, testInfo) => {
		await page.setViewportSize({ width, height: 1000 });
		await seedWorkspace(page, theme);
		await page.routeWebSocket('**/*', socket => socket.close());
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1604C?new=true`);
		const schedule = page.locator('details').filter({ has: page.locator('summary', { hasText: 'Schedule 1' }) }).first();
		await schedule.locator('summary').click();
		await schedule.getByRole('button', { name: /Add line item/ }).click();
		const editor = page.getByRole('dialog', { name: 'New line item', exact: true }).and(page.locator('[open]'));
		await expect(editor).toBeVisible();
		const metrics = await editor.evaluate(element => {
			const fields = element.querySelector('.editor-fields')!;
			const row = fields.querySelector('.editor-row')!;
			const assigned = fields.firstElementChild!;
			return {
				gap: row.getBoundingClientRect().top - assigned.getBoundingClientRect().bottom,
				rowGap: parseFloat(getComputedStyle(row).rowGap),
				labels: [...element.querySelectorAll('[data-slot="label"], .value-label')].map(label => ({
					size: getComputedStyle(label).fontSize,
					lineHeight: getComputedStyle(label).lineHeight,
					color: getComputedStyle(label).color
				}))
			};
		});
		expect.soft(metrics.gap).toBeCloseTo(16.875, 1);
		expect.soft(metrics.rowGap).toBeCloseTo(16.875, 1);
		for (const label of metrics.labels) {
			expect.soft(label.size).toBe('12px');
			expect.soft(label.lineHeight).toBe('18.75px');
			expect.soft(label.color).toBe(metrics.labels[0].color);
		}
		await editor.evaluate(async element => { await Promise.all(element.getAnimations().map(animation => animation.finished.catch(() => {}))); });
		await page.screenshot({ path: testInfo.outputPath(`annual-drawer-${theme}.png`) });
		await editor.getByRole('button', { name: 'Cancel', exact: true }).click();
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/edit`);
		await expect(page.getByRole('form', { name: 'Taxpayer profile' })).toBeVisible();
		for (const label of await page.locator('[data-slot="label"]').all()) await expect(label).toHaveCSS('font-size', '12px');
	});
}

for (const width of [1440, 390]) {
	test(`shared control sizing matches at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 1000 });
		await seedWorkspace(page);
		await page.goto('/design-system');
		await expect(page.locator('main')).toBeVisible();
		await page.evaluate(async () => {
			const fixtureModule = '/src/tests/fixtures/mount-form-focus.ts';
			(await import(/* @vite-ignore */ fixtureModule)).mountFormFocus();
		});
		const fixture = page.getByRole('region', { name: 'Form focus fixture' });
		for (const name of ['Reference input', 'Password input', 'Number input', 'Currency input', 'TIN input', 'Period select', 'Primitive select']) {
			const control = fixture.getByLabel(name, { exact: true });
			await expect(control).toHaveCSS('font-size', '13px');
			const frame = await control.evaluate(el => el.matches('input:not([type=password])')) ? control.locator('..') : control;
			expect((await frame.boundingBox())!.height, name).toBeCloseTo(35.625, 1);
		}
	});
}

for (const definition of withholdingDefinitions) {
	test(`${definition.code} uses shared labels and field rhythm in the form and drawers`, async ({ page }) => {
		await seedWorkspace(page);
		await page.routeWebSocket('**/*', socket => socket.close());
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${definition.code}?new=true`);
		await expect(page.getByRole('heading', { name: `BIR Form ${definition.code}`, exact: true })).toBeVisible();
		const assertLabels = async (selector: string) => {
			const labels = await page.locator(selector).evaluateAll(elements => elements.map(element => {
				const style = getComputedStyle(element);
				return [style.fontSize, style.lineHeight, style.fontWeight];
			}));
			expect(labels.length).toBeGreaterThan(0);
			for (const label of labels) expect(label).toEqual(['12px', '18.75px', '500']);
		};
		await assertLabels('.eq-workspace [data-slot="label"], .eq-workspace [data-slot="radio-group"] > legend');
		for (const schedule of definition.schedules) {
			const disclosure = page.locator('summary').filter({ hasText: schedule.title }).first();
			if (await disclosure.locator('..').getAttribute('open') === null) await disclosure.click();
			await page.getByRole('button', { name: `Add line item to ${schedule.title}`, exact: true }).click();
			const editor = page.getByRole('dialog', { name: 'New line item', exact: true }).and(page.locator('[open]'));
			await expect(editor).toBeVisible();
			await assertLabels('dialog[open] [data-slot="label"], dialog[open] .value-label, dialog[open] [data-slot="radio-group"] > legend');
			await expect(editor.locator('.editor-row')).toHaveCSS('row-gap', '16.875px');
			await editor.getByRole('button', { name: 'Cancel', exact: true }).click();
		}
	});
}
