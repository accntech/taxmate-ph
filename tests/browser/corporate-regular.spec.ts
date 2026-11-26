import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';
import type { CorporateField } from '../../src/lib/forms/corporate-income/types';

const id = (name: string) => `[id="frm1702RT:${name}"]`;

test('regular CREATE details save, reopen and switch deductions at desktop and narrow widths', async ({ page }, info) => {
 await page.setViewportSize({ width: 1440, height: 1000 });
 await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
 await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702RTv2018C?new=true`);
 await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible();
 await page.locator(id('rdoPg1Pt1I13ItemizedDeduction')).check();
 await goToReturnPage(page, 2);
 await page.locator(id('txtPg2Pt4I27Sales')).fill('1000000');
 await page.locator(id('Pg2Pt4I40IncomeTaxRate')).fill('25');
 await page.locator(id('Pg2Pt4I40IncomeTaxRate')).blur();
 await goToReturnPage(page, 3);
 for (const [entry, description, amount] of [[1, 'POSTAGE', '1000'], [2, 'STATIONERY', '2000']] as const) {
  await page.locator('.line-list').filter({ has: page.getByRole('heading', { name: /^Other ordinary allowable deductions \(/ }) }).getByRole('button', { name: 'Add item', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Add item' });
  await dialog.getByRole('textbox', { name: 'Description', exact: true }).fill(description);
  await dialog.getByRole('textbox', { name: 'Amount', exact: true }).fill(amount);
  await dialog.getByRole('button', { name: 'Add item', exact: true }).click();
 }
 await expect(page.locator(id('txtPg3Sc1I18TotalOrdinaryAllowable'))).toHaveText('3,000');
 await page.screenshot({ path: info.outputPath('regular-detailed-deductions-desktop.png'), fullPage: true });
 await page.setViewportSize({ width: 390, height: 920 });
 await page.keyboard.press('Escape');
 await page.screenshot({ path: info.outputPath('regular-detailed-deductions-narrow.png'), fullPage: true });
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
 await page.getByRole('button', { name: 'Save draft', exact: true }).click();
 await page.getByRole('link', { name: 'Edit', exact: true }).click();
 await goToReturnPage(page, 3);
 const deductions = page.getByRole('list', { name: 'Other ordinary allowable deductions line items' });
 await expect(deductions.getByText('STATIONERY')).toBeVisible();
 await expect(deductions.getByText('2,000', { exact: true })).toBeVisible();
 await deductions.getByRole('button', { name: 'POSTAGE', exact: true }).click();
 await page.getByRole('dialog').getByRole('button', { name: 'Delete item', exact: true }).click();
 await expect(page.getByRole('dialog')).toBeHidden();
 await expect(deductions.getByRole('listitem')).toHaveCount(1);
 await expect(deductions.getByText('STATIONERY')).toBeVisible();
 await expect(page.locator(id('txtPg3Sc1I18TotalOrdinaryAllowable'))).toHaveText('2,000');
 await goToReturnPage(page, 1);
 await page.locator(id('rdoPg1Pt1I13ItemizedDeduction-frm1702RT:rdoPg1Pt1I13OptionalStandard')).check();
 await goToReturnPage(page, 2);
 await expect(page.locator(id('txtPg2Pt4I38OptionalStandard'))).toHaveText('400,000');
 await expect(page.locator(id('txtPg2Pt4I34OrdinaryAllowable'))).toHaveText('0');
});

test('regular CREATE native print binds populated amounts, two-digit year and detailed continuation', async ({ page, context }, info) => {
 await page.route('**/__regular-paper', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html>' }));
 await page.goto('/__regular-paper');
 const result = await page.evaluate(async () => {
  const base = '/src/lib';
  const { getFormDefinition } = await import(`${base}/forms/index.ts`);
  const { createInitialFormValues } = await import(`${base}/ebirforms/ebirforms-workspace.svelte.ts`);
  const { getReturnExportValues } = await import(`${base}/forms/form-runtime.ts`);
  const { buildReturnReport } = await import(`${base}/printing/return-report.ts`);
  const { corporateFields, getCorporateIncomeForm } = await import(`${base}/forms/corporate-income/index.ts`);
  const profile = { id: '00123456700008', tin1: '001', tin2: '234', tin3: '567', branchCode: '00008', rdoCode: '047', taxpayerName: 'SAMPLE LEDGER CORPORATION', address: '42 Narra Street', address2: 'Test City', zipCode: '1000', contactNumber: '0285550148', email: 'corp@example.test', taxpayerClassification: 'N', category: 'P' };
  const values = getReturnExportValues('1702RTv2018C', { ...createInitialFormValues(profile, '1702RTv2018C'),
   'frm1702RT:txtPg1I2Year':'2025', 'frm1702RT:txtPg1Pt1I10':'01/01/2010',
   'frm1702RT:rdoPg1Pt1I13ItemizedDeduction':'frm1702RT:rdoPg1Pt1I13ItemizedDeduction',
   'frm1702RT:txtPg2Pt4I27Sales':'1000000', 'frm1702RT:txtPg2Pt4I30LessCost':'200000',
   'frm1702RT:Pg2Pt4I40IncomeTaxRate':'25', 'frm1702RT:txtPg2Pt4I44ExcessCredits':'500', 'frm1702RT:txtPg1Pt2I17Surcharge':'1000',
   'frm1702RT:txtPg3Sc1I17iCtrModal':'2', 'frm1702RT:txtPg3Sc1I17i.1C1':'POSTAGE', 'frm1702RT:txtPg3Sc1I17i.1C2':'1000',
   'frm1702RT:txtPg3Sc1I17i.2C1':'STATIONERY', 'frm1702RT:txtPg3Sc1I17i.2C2':'1000'
  });
  const form = getCorporateIncomeForm('1702RTv2018C');
  const fields: CorporateField[] = corporateFields(form);
  const ids = fields.flatMap(field => [field.id, ...(field.options ?? []).map(option => option.value)]);
  return { html: await buildReturnReport(getFormDefinition('1702RTv2018C'), values, 'Draft', 'legal'), ids };
 });
 const paper = await context.newPage();
 await paper.setContent(result.html.replaceAll('__EBIRFORMS_PRINT_SOURCE_URL__', 'file:///corporate-return-preview.html'));
 await paper.emulateMedia({ media: 'print' });
 await expect(paper.locator('.withholding-print-page')).toHaveCount(5);
 const content = async (name: string) => paper.locator(`[data-corporate-field="frm1702RT:${name}"]`).first().evaluate(element => element instanceof HTMLInputElement ? element.value : element.textContent);
 expect(await content('txtPg1I2Year')).toBe('25');
 expect(await content('txtPg2Pt4I41IncomeTaxDue')).toBe('199,500');
 expect(await content('txtPg1Pt2I21TotalAmount')).toBe('200,000');
 expect(await paper.locator('.original-continuation').innerText()).toContain('POSTAGE');
 expect(await paper.locator('.original-continuation').innerText()).toContain('STATIONERY');
 const missing = await paper.locator('[data-corporate-field]').evaluateAll((elements, ids) => elements
  .map(element => element.getAttribute('data-corporate-field')!).filter(id => !ids.includes(id)), result.ids);
 expect([...new Set(missing)]).toEqual([]);
 await paper.screenshot({ path: info.outputPath('regular-native-print.png'), fullPage: true });
 const pdf = await paper.pdf({ path: info.outputPath('regular-create-populated.pdf'), preferCSSPageSize: true, printBackground: true });
 const text = execFileSync('pdftotext', ['-layout','-','-'], { input: pdf }).toString();
 const geometry = execFileSync('pdfinfo', ['-'], { input: pdf }).toString();
 expect(geometry).toMatch(/^Pages:\s+5$/m);
 expect(text).toContain('200,000');
 expect(text).toContain('199,500');
 expect(text).toContain('POSTAGE');
 expect(text).not.toContain('202025');
 execFileSync('pdftoppm', ['-f','1','-l','2','-scale-to','1400','-png',info.outputPath('regular-create-populated.pdf'),info.outputPath('regular-page')]);
});
