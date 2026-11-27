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

const previewStyle = '.window-titlebar, .eq-action-bar { visibility: hidden; }';

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
	test(`${code} background values and numbered labels align`, async ({ page }, info) => {
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
		await page.routeWebSocket('**/*', socket => socket.close());
		await page.setViewportSize({ width: 1280, height: 900 });
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
		const background = corporate ? page.locator('.corporate-section.background') :
			page.getByRole('region', { name: 'Taxpayer information', exact: true });
		await expect(background).toBeVisible({ timeout: 20_000 });
		await page.evaluate(() => document.fonts.ready);

		for (const width of code === '0619E' ? [1600, 1280, 390] : [1280, 390]) {
			await page.setViewportSize({ width, height: 900 });
			const labels = await background.locator(corporate ? '.corporate-row > .paper-item-number' :
				'.taxpayer-item').evaluateAll(numbers => numbers.flatMap(number => {
				const cell = number.parentElement!;
				const item = number.textContent?.trim();
				if (!item) return [];
				const range = document.createRange();
				if (cell.matches('dt')) {
					range.setStartAfter(number);
					range.setEnd(cell, cell.childNodes.length);
				} else {
					const label = cell.querySelector('label, legend, .value-label, .profile-extra-controls dt');
					if (!label) return [];
					range.selectNodeContents(label);
				}
				const label = Array.from(range.getClientRects()).find(rect => rect.width > 1);
				if (!label) return [];
				return [{ item, offset: label.left - number.getBoundingClientRect().left }];
			}));
			expect(labels.length).toBeGreaterThanOrEqual(3);
			const labelOffset = labels[0].offset;
			expect.soft(labels.filter(label => Math.abs(label.offset - labelOffset) > .5),
				`${width}px viewport, expected ${labelOffset}px between item and label starts`).toEqual([]);

			const values = background.locator(corporate ? '.corporate-row output' : 'dd:not(.profile-item-controls)');
			await expect.poll(() => values.count()).toBeGreaterThanOrEqual(4);
			const stackedValues = code === '0619E' ? values.or(page.locator('.constant-codes dd')) : values;
			const geometry = await stackedValues.evaluateAll(elements => elements.map(value => {
				const cell = value.closest('.corporate-row, dl[data-profile-key], .constant-codes > div') ??
					value.parentElement!;
				const label = value.parentElement!.querySelector('dt, .value-label')!;
				const number = label.querySelector('.taxpayer-item, .paper-item-number');
				const labelRange = document.createRange();
				labelRange.selectNodeContents(label);
				if (number) labelRange.setStartAfter(number);
				const labelLines = Array.from(labelRange.getClientRects()).filter(rect => rect.width > 0);
				const valueRange = document.createRange();
				valueRange.selectNodeContents(value);
				const lineStarts = new Map<number, number>();
				for (const rect of valueRange.getClientRects()) {
					if (rect.width === 0) continue;
					const top = rect.top - cell.getBoundingClientRect().top;
					lineStarts.set(top, Math.min(rect.left, lineStarts.get(top) ?? Infinity));
				}
				return {
					item: cell.getAttribute('data-corporate-item') ?? label.textContent?.trim(),
					labelStart: labelLines[0]?.left,
					lines: Array.from(lineStarts, ([top, left]) => ({ left, top }))
				};
			}));
			if (process.env.BIR_BACKGROUND_PREVIEWS === '1') {
				await info.attach(`geometry-${width}`, { body: JSON.stringify(geometry), contentType: 'application/json' });
				await background.screenshot({
					path: info.outputPath(`background-${width}.png`),
					animations: 'disabled',
					style: previewStyle
				});
				if (code === '0619E') {
					await page.getByRole('region', { name: 'Return period', exact: true }).screenshot({
						path: info.outputPath(`return-period-${width}.png`),
						animations: 'disabled',
						style: previewStyle
					});
				}
			}
			const misaligned = geometry.filter(({ labelStart, lines }) =>
				labelStart === undefined || !lines.length || lines.some(line => Math.abs(line.left - labelStart) > .5));
			expect.soft(misaligned, `${width}px viewport, expected each value line to start under its label`).toEqual([]);
			if (code === '1702Qv2018C' && width === 390) {
				const registered = geometry.filter(({ item }) => item === '8' || item === '9');
				expect(registered).toHaveLength(2);
				expect(registered.every(({ lines }) => lines.length >= 2)).toBe(true);
				expect(registered[0].lines[0].top).toBeCloseTo(registered[1].lines[0].top);
			}
		}
	});
}
