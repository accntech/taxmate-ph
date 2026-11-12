import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

test('1601-E prints the special law only while tax relief is Yes', async ({ page }) => {
  await seedWorkspace(page);
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
  const reports = await page.evaluate(async () => {
    const base = '/src/lib';
    const rules = await import(`${base}/forms/withholding-rules.ts`);
    const catalog = await import(`${base}/forms/index.ts`);
    const print = await import(`${base}/printing/return-report.ts`);
    const values = rules.createWithholdingValues('1601E');
    const html: string[] = [];
    for (const relief of ['Y', 'N']) {
      values['frm1601E:optRelief'] = relief;
      values['frm1601E:j_id402'] = '1';
      html.push(await print.buildReturnReport(catalog.getFormDefinition('1601E'), values, 'Draft', 'long'));
    }
    return html;
  });
  for (const [index, expected] of ['Special Law', ''].entries()) {
    await page.setContent(reports[index]);
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('[data-field-id="frm1601E:j_id402"]')).toHaveText(expected);
    await expect(page.locator(`[data-field-id="frm1601E:j_id398:_${index + 1}"]`)).toBeChecked();
  }
});
