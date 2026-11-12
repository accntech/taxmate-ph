import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { seedWorkspace, taxpayerId } from './fixtures';

for (const code of ['0619E', '0619F']) {
	for (const paper of ['letter', 'a4', 'long']) {
		test(`${code} ${paper} prints selectable HTML labels and preserves populated fields`, async ({ page, context }, testInfo) => {
			await seedWorkspace(page);
			await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
			const html = await page.evaluate(async ({ code, paper }) => {
				const base = '/src/lib';
				const catalog = await import(`${base}/forms/index.ts`);
				const rules = await import(`${base}/forms/withholding-rules.ts`);
				const reports = await import(`${base}/printing/return-report.ts`);
				const values = rules.createWithholdingValues(code, {
					tin1: '123', tin2: '456', tin3: '789', branchCode: '0000', rdoCode: '047',
					taxpayerName: 'Harborview Trading And Services, Inc.', address: '28 Narra Street, Barangay Bel-Air',
					address2: 'Makati City, Metro Manila', zipCode: '1209', contactNumber: '0285550148',
					category: 'P', email: 'accounts@harborview.example'
				});
				Object.assign(values, {
					[`frm${code}:txtYear`]: '2025', [`frm${code}:txtMonth`]: '06',
					[`frm${code}:dueDate`]: '2025-07-10', [`frm${code}:optAmend`]: 'N',
					[`frm${code}:optWithheld`]: 'Y', [`frm${code}:txtTax14`]: '18500.25',
					[`frm${code}:txtTax15`]: code === '0619E' ? '500.00' : '0',
					...(code === '0619F' ? { 'frm0619F:txtTaxTypeCode': 'WF' } : {})
				});
				return reports.buildReturnReport(catalog.getFormDefinition(code), values, 'Finalized', paper);
			}, { code, paper });
			const print = await context.newPage();
			await print.setContent(html);
			await print.emulateMedia({ media: 'print' });
			await print.evaluate(() => document.fonts.ready);
			await expect(print.locator('.withholding-print-page')).toHaveCount(1);
			const sourceWidth = await print.locator('.withholding-print-page').evaluate(element =>
				Number.parseFloat((element as HTMLElement).style.getPropertyValue('--withholding-source-width')));
			expect(sourceWidth, 'static labels must stay inside the original 850px source frame').toBe(850);
			// The printed layout must remain readable/selectable even without raster artwork.
			await expect(print.locator('.withholding-print')).toContainText('Monthly Remittance Form');
			await expect(print.locator('.withholding-print')).toContainText('Part I');
			await expect(print.locator('.withholding-print')).toContainText('Details of Payment');
			const largeImages = await print.locator('.withholding-print img').evaluateAll(images => images.filter(image => {
				const box = image.getBoundingClientRect();
				return box.width > 300 && box.height > 500;
			}).length);
			expect(largeImages, 'the form frame and labels must not be a full-page image').toBe(0);
			await expect(print.locator('[id="txtTaxpayerName"]')).toContainText('Harborview Trading And Services, Inc.');
			await expect(print.locator('[id="txtTax14"]')).toHaveText('18500');
			await expect(print.locator('[id="txtTax14_2"]')).toHaveText('25');
			const total = code === '0619E' ? 'txtTax18' : 'txtTax19';
			await expect(print.locator(`[id="${total}"]`)).toHaveText(code === '0619E' ? '18000' : '18500');
			await expect(print.locator(`[id="${total}_2"]`)).toHaveText('25');
			const taxpayerPosition = await print.locator('[id="txtTaxpayerName"]').evaluate(element => {
				const wrapper = element.closest('#wrapper')!;
				const frame = wrapper.closest<HTMLElement>('.withholding-print-page')!;
				const scale = Number(frame.style.getPropertyValue('--withholding-page-scale'));
				const field = element.parentElement!.getBoundingClientRect();
				const bounds = wrapper.getBoundingClientRect();
				return { x: (field.left - bounds.left) / scale, y: (field.top - bounds.top) / scale };
			});
			// Coordinates come from the outgoing HTA print overlays, independent of the new skeleton.
			expect(taxpayerPosition.x).toBeCloseTo(14, 0);
			expect(taxpayerPosition.y).toBeCloseTo(code === '0619E' ? 257 : 227, 0);
			await expect(print.locator('.withholding-print-draft')).toHaveCount(0);
			const pdf = await print.pdf({ preferCSSPageSize: true, printBackground: true, path: testInfo.outputPath(`${code}-${paper}.pdf`) });
			const info = execFileSync('pdfinfo', ['-'], { input: pdf }).toString();
			expect(info.match(/^Pages:\s+(\d+)/m)?.[1]).toBe('1');
			const text = execFileSync('pdftotext', ['-', '-'], { input: pdf }).toString().replace(/\s+/g, ' ');
			for (const label of ['Monthly Remittance Form', 'Details of Payment', 'Machine Validation/Revenue Official Receipt Details', 'BIR Data Privacy Policy']) {
				expect(text).toContain(label);
			}
			await print.screenshot({ path: testInfo.outputPath(`${code}-${paper}.png`), fullPage: true });
			await print.close();
		});
	}
}
