import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
import { seedWorkspace, taxpayerId } from './fixtures';

const forms: Record<string, number> = {
	'0605': 1, '0619E': 1, '0619F': 1, '1600': 1, '1600PTv2018': 2,
	'1600VTv2018': 2, '1600WP': 1, '1601C': 1, '1601Cv2018': 2,
	'1601E': 1, '1601EQ': 1, '1601F': 2, '1601FQ': 2, '1602': 2,
	'1602Qv2018': 3, '1603': 1, '1603Qv2018': 2, '1604C': 1,
	'1604CF': 1, '1604E': 1, '1604Ev2018': 2, '1604F': 2, '1606': 1
};

const cases = [...Object.entries(forms).map(([code, expectedPages]) => ({ code, expectedPages, paper: 'long' })),
	...['letter', 'a4'].map((paper) => ({ code: '1604CF', expectedPages: 1, paper }))];
for (const { code, expectedPages, paper } of cases) {
	test(`${code} ${paper} actual PDF preserves circular marks, value size and complete glyphs`, async ({ page, context }, testInfo) => {
		await seedWorkspace(page);
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
		const html = await page.evaluate(async ({ code, paper }) => {
			const base = '/src/lib';
			const catalog = await import(`${base}/forms/index.ts`);
			const definitions = await import(`${base}/forms/withholding-definitions.ts`);
			const rules = await import(`${base}/forms/withholding-rules.ts`);
			const reports = await import(`${base}/printing/return-report.ts`);
			const runtime = await import(`${base}/forms/form-runtime.ts`);
			const profile = {
				tin1: '123', tin2: '456', tin3: '789', branchCode: '0000', rdoCode: '047',
				taxpayerName: 'Harborview Quality Services, Inc.',
				address: '28 Narra Street, Barangay Bel-Air', address2: 'Makati City, Metro Manila',
				zipCode: '1209', contactNumber: '0285550148', category: 'P',
				email: 'accounts@harborview.example', lineOfBusiness: 'Wholesale Trade', taxpayerClassification: 'N'
			};
			const definition = definitions.getWithholdingDefinition(code);
			let values = definition ? rules.createWithholdingValues(code, profile)
				: (await import(`${base}/ebirforms/ebirforms-workspace.svelte.ts`)).createInitialFormValues(profile);
			values = runtime.calculateReturn(code, values);
			return reports.buildReturnReport(catalog.getFormDefinition(code), values, 'Draft', paper);
		}, { code, paper });
		// Rendering a fresh page matters: Vite's live app stylesheet must not leak
		// into the standalone document used by the actual PDF export.
		const print = await context.newPage();
		await print.setContent(html);
		await print.emulateMedia({ media: 'print' });
		await print.evaluate(() => document.fonts.ready);
		const pdf = testInfo.outputPath(`${code}.pdf`);
		await print.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true, tagged: true });
		const args = [resolve('tests/browser/helpers/pdf-output-quality.py'), pdf];
		const radioRegions = await print.evaluate((paper) => {
			const frames = [...document.querySelectorAll('.withholding-print-page')];
			if (!frames.length) return null; // Legacy EQ has no instructional vector bullets.
			const marginX = paper === 'a4' ? 10 * 72 / 25.4 : 0.45 * 72;
			const marginY = paper === 'a4' ? 12 * 72 / 25.4 : 0.55 * 72;
			return [...document.querySelectorAll('.pdf-radio-vector')].map((svg) => {
				const frame = svg.closest('.withholding-print-page')!;
				const box = svg.getBoundingClientRect(), frameBox = frame.getBoundingClientRect();
				return { page: frames.indexOf(frame) + 1, checked: svg.querySelectorAll('circle').length === 2,
					x: (box.left - frameBox.left + box.width / 2) * 0.75 + marginX,
					y: (box.top - frameBox.top + box.height / 2) * 0.75 + marginY };
			});
		}, paper);
		if (radioRegions) {
			const regionsPath = testInfo.outputPath('radio-regions.json');
			writeFileSync(regionsPath, JSON.stringify(radioRegions));
			args.push('--radio-regions', regionsPath);
		}
		if (['0619E', '0619F', '1602Qv2018'].includes(code)) {
			const exposed = await print.evaluate((code) => {
				const nodes = [...document.querySelectorAll<HTMLElement>('[data-normalized-print-value]')]
					.filter((element) => {
						const id = element.id || element.dataset.fieldId || '';
						return code.startsWith('0619') ? /(?:^|:)(?:txtAddress2?|txtEmail2?)$/.test(id) : /:fntSched1TaxRate\d+$/.test(id);
					});
				for (const element of nodes) element.style.setProperty('overflow', 'visible', 'important');
				return nodes.length;
			}, code);
			expect(exposed, 'every targeted address/email/rate control must exist').toBe(code.startsWith('0619') ? 3 : 12);
			const reference = testInfo.outputPath(`${code}-unclipped.pdf`);
			await print.pdf({ path: reference, preferCSSPageSize: true, printBackground: true, tagged: true });
			args.push('--reference', reference);
		}
		const audit = JSON.parse(execFileSync('python3', args, { encoding: 'utf8' }));
		await testInfo.attach('actual-pdf-audit', { body: JSON.stringify(audit, null, 2), contentType: 'application/json' });
		expect(audit.pages).toBe(expectedPages);
		if (!code.startsWith('0619')) {
			expect(audit.circles, 'radio vectors must exist').toBeGreaterThan(0);
			expect(audit.dots, 'selected radio dots must be visible vector fills').toBeGreaterThan(0);
		}
		expect(audit.issues).toEqual([]);
		await print.close();
	});
}
