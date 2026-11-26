import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

const codes = [
	'0605', '0619E', '0619F', '1600', '1600PTv2018', '1600VTv2018', '1600WP',
	'1601C', '1601Cv2018', '1601E', '1601EQ', '1601F', '1601FQ', '1602', '1602Qv2018',
	'1603', '1603Qv2018', '1604C', '1604CF', '1604E', '1604Ev2018', '1604F', '1606',
	'1700', '1700v2018', '1701', '1701v2018', '1701A', '1701MS', '1701Q', '1701Qv2018',
	'1702EX', '1702EXv2018', '1702EXv2018C', '1702MX', '1702MXv2018', '1702MXv2018C',
	'1702Q', '1702Qv2008C', '1702Qv2018C', '1702RT', '1702RTv2018', '1702RTv2018C'
];

test('background alignment cases cover the form catalog', async ({ page }) => {
	await page.route('**/__background_alignment_catalog', route =>
		route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Form catalog fixture</title>' }));
	await page.goto('/__background_alignment_catalog');
	const catalogCodes = await page.evaluate(async () => {
		const index = '/src/lib/forms/index.ts';
		const { listForms } = await import(index) as typeof import('../../src/lib/forms');
		return listForms().map(form => form.code);
	});
	expect([...codes].sort()).toEqual(catalogCodes.sort());
});

for (const code of codes) {
	test(`${code} background values share a left inset`, async ({ page }, info) => {
		const corporate = code.startsWith('1702');
		const individual = code.startsWith('17') && !corporate;
		await seedWorkspace(page, 'light', 'loaded', {
			taxpayerClassification: individual ? 'I' : 'N',
			taxpayerName: individual ? 'DE LOS SANTOS, ALEXANDRA CATHERINE, VILLANUEVA' :
				'Example Manufacturing and Business Management Services Corporation',
			address: 'Unit 1206, 123 Example Building, Example Business District',
			address2: 'Example City', email: 'corporatefiling@example.test',
			lineOfBusiness: 'Manufacturing and distribution of commercial equipment', psocCode: '4311',
			birthDate: '1984-02-29', civilStatus: 'Single', citizenship: 'FILIPINO'
		}, []);
		await page.setViewportSize({ width: 1280, height: 900 });
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
		const background = corporate ? page.locator('.corporate-section.background') :
			page.getByRole('region', { name: 'Taxpayer information', exact: true });
		await expect(background).toBeVisible({ timeout: 20_000 });
		await page.evaluate(() => document.fonts.ready);

		for (const width of [1280, 390]) {
			await page.setViewportSize({ width, height: 900 });
			const geometry = await background.locator(corporate ? '.corporate-row output' :
				'dd:not(.profile-item-controls)').evaluateAll(values =>
				values.map(value => {
					const labelGroup = value.closest('dl');
					const extra = value.closest('.profile-extra');
					const controls = extra?.querySelector('.profile-extra-controls');
					const hasOwnColumn = controls && controls.firstElementChild !== labelGroup &&
						getComputedStyle(controls).gridTemplateColumns.split(' ').length > 1;
					const cell = value.closest('.corporate-row, dl[data-profile-key]') ??
						(hasOwnColumn ? labelGroup : extra) ?? value.parentElement!;
					const cellBox = cell.getBoundingClientRect();
					const verticalOrigin = extra ? labelGroup!.getBoundingClientRect().top : cellBox.top;
					const border = parseFloat(getComputedStyle(cell).borderInlineStartWidth);
					const range = document.createRange();
					range.selectNodeContents(value);
					const lineStarts = new Map<number, number>();
					for (const rect of range.getClientRects()) {
						if (rect.width === 0) continue;
						const top = rect.top - verticalOrigin;
						const left = rect.left - cellBox.left - border;
						lineStarts.set(top, Math.min(left, lineStarts.get(top) ?? Infinity));
					}
					return {
						item: cell.getAttribute('data-corporate-item') ?? value.parentElement?.querySelector('dt')?.textContent?.trim(),
						hasOwnColumn: Boolean(hasOwnColumn),
						lines: Array.from(lineStarts, ([top, left]) => ({ left, top }))
					};
				})
			);
			expect(geometry.length).toBeGreaterThanOrEqual(4);
			const inset = await background.evaluate(() => .875 * parseFloat(getComputedStyle(document.documentElement).fontSize));
			if (process.env.BIR_BACKGROUND_PREVIEWS === '1') {
				await info.attach(`geometry-${width}`, { body: JSON.stringify(geometry), contentType: 'application/json' });
				await background.screenshot({
					path: info.outputPath(`background-${width}.png`),
					animations: 'disabled',
					style: '.eq-action-bar { visibility: hidden; }'
				});
			}
			const misaligned = geometry.filter(({ hasOwnColumn, lines }) =>
				!lines.length || lines.some(line => Math.abs(line.left - (hasOwnColumn ? 0 : inset)) > .5));
			expect.soft(misaligned, `${width}px viewport, expected ${inset}px text inset`).toEqual([]);
			if (code === '1702Qv2018C' && width === 390) {
				const registered = geometry.filter(({ item }) => item === '8' || item === '9');
				expect(registered).toHaveLength(2);
				expect(registered.every(({ lines }) => lines.length >= 2)).toBe(true);
				expect(registered[0].lines[0].top).toBeCloseTo(registered[1].lines[0].top);
			}
		}
	});
}
