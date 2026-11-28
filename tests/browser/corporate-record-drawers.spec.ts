import { expect, test } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';
import { printSavedReturn } from './helpers/return-pdf';

const base = `/ebirforms/taxpayers/${taxpayerId}/forms`;

test('fixed amortization slots use Add item and description links with drawer deletion', async ({ page }, testInfo) => {
 await seedWorkspace(page, 'dark', 'loaded', { taxpayerClassification: 'N' }, []);
 await page.goto(`${base}/1702EX?new=true`);
 await goToReturnPage(page, 4);
 const list = page.locator('.line-list').filter({ has: page.getByRole('heading', { name: /^Amortization \(/ }) });
 await expect(list.getByRole('listitem')).toHaveCount(0);
 await list.getByRole('button', { name: 'Add item', exact: true }).click();
 const drawer = page.getByRole('dialog');
 await expect(drawer.getByText('Amortization', { exact: true })).toBeVisible();
 await drawer.screenshot({ path: testInfo.outputPath('amortization-drawer-dark.png'), animations: 'disabled' });
 await drawer.getByRole('textbox', { name: 'Description', exact: true }).fill('Permit amortization');
 await drawer.getByRole('textbox', { name: 'Amount', exact: true }).fill('50');
 await drawer.getByRole('button', { name: 'Add item', exact: true }).click();
 await expect(drawer).toBeHidden();
 await list.getByRole('button', { name: 'Permit amortization', exact: true }).click();
 await expect(drawer).toHaveAccessibleDescription('Amortization');
 await drawer.getByRole('button', { name: 'Delete item', exact: true }).click();
 await expect(drawer).toBeHidden();
 await expect(list.getByRole('heading', { name: /^Amortization \(/ })).toBeVisible();
});

test('numbered ownership entries use registered name links and delete from the drawer', async ({ page }) => {
 await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, [{ id: 'owner-draft', taxpayerId, formCode: '1702EX', returnPeriod: '2025-12', status: 'Draft', updatedAt: 1794441600000, finalFlag: '0', values: {
  'frm1702EX:txtPg6S8I1Col1Name': 'Sample Owner',
 } }]);
 await page.goto(`${base}/1702EX?return=owner-draft`);
 await goToReturnPage(page, 6);
 const list = page.getByRole('list', { name: 'Stockholders, partners or members line items' });
 await list.getByRole('button', { name: 'Sample Owner', exact: true }).click();
 await page.getByRole('dialog').getByRole('button', { name: 'Delete item', exact: true }).click();
 await expect(list.getByRole('listitem')).toHaveCount(0);
 await page.getByRole('button', { name: 'Undo', exact: true }).click();
 await expect(list.getByRole('button', { name: 'Sample Owner', exact: true })).toBeFocused();
});

test('saved continuation rows retain their total through drawer deletion and re-entry', async ({ page }) => {
 await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, [{ id: 'continuation-draft', taxpayerId, formCode: '1702RTv2018C', returnPeriod: '2025-12', status: 'Draft', updatedAt: 1794441600000, finalFlag: '0', values: {
  'frm1702RT:rdoPg1Pt1I13ItemizedDeduction': 'frm1702RT:rdoPg1Pt1I13ItemizedDeduction',
  'frm1702RT:txtPg3Sc1I17iCtrModal': '2',
  'frm1702RT:txtPg3Sc1I17i.1C1': 'Saved postage', 'frm1702RT:txtPg3Sc1I17i.1C2': '100',
  'frm1702RT:txtPg3Sc1I17i.2C1': 'Saved stationery', 'frm1702RT:txtPg3Sc1I17i.2C2': '200',
 } }]);
 await page.goto(`${base}/1702RTv2018C?return=continuation-draft`);
 await goToReturnPage(page, 3);
 const list = page.getByRole('list', { name: 'Other ordinary allowable deductions line items' });
 await expect(list.getByRole('listitem')).toHaveCount(2);
 await list.getByRole('button', { name: 'Saved postage', exact: true }).click();
 await page.getByRole('dialog').getByRole('button', { name: 'Delete item', exact: true }).click();
 await expect(page.getByRole('dialog')).toBeHidden();
 await expect(list.getByRole('listitem')).toHaveCount(1);
 await expect(list.getByRole('button', { name: 'Saved stationery', exact: true })).toBeVisible();
 await expect(page.locator('[id="frm1702RT:txtPg3Sc1I18TotalOrdinaryAllowable"]')).toHaveText('200');
 await page.getByRole('button', { name: 'Undo', exact: true }).click();
 await expect(list.getByRole('button', { name: 'Saved postage', exact: true })).toBeFocused();
 await expect(list.getByRole('listitem')).toHaveCount(2);
 await expect(page.locator('[id="frm1702RT:txtPg3Sc1I18TotalOrdinaryAllowable"]')).toHaveText('300');
});

for (const code of ['1702Q', '1702Qv2008C']) {
 test(`${code} item 31G uses inline fields and includes the credit in the total`, async ({ page }, info) => {
  await page.routeWebSocket('**/*', socket => socket.close());
  await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, [{
   id: 'quarterly-credit', taxpayerId, formCode: code, returnPeriod: '2025-Q1',
   status: 'Draft', updatedAt: 1794441600000, finalFlag: '0', values: {
    'frm1702q:txtYearEnded': '2025',
    'frm1702q:optQtr': '1',
    'frm1702q:txt31A': '25',
    'frm1702q:txt31Gothers': 'Carried credit',
    'frm1702q:txt31G': '900',
   },
  }]);
  await page.goto(`${base}/${code}?return=quarterly-credit`);
  const row = page.locator('[data-corporate-item="31G"]');
  const description = row.getByRole('textbox', { name: 'Description', exact: true });
  const amount = row.getByRole('textbox', { name: 'Other tax credits / payments', exact: true });
  const total = page.locator('[id="frm1702q:txt31H"]');
  await expect(description).toHaveValue('Carried credit');
  await expect(amount).toHaveValue('900.00');
  await expect(total).toHaveText('925.00');
  await expect(page.getByRole('button', { name: 'Add item', exact: true })).toHaveCount(0);

  await description.fill('Prior payment');
  await amount.fill('1200');
  await amount.blur();
  await expect(total).toHaveText('1,225.00');

  for (const [viewport, width] of [['desktop', 1280], ['mobile', 390]] as const) {
   await page.setViewportSize({ width, height: 900 });
   await row.scrollIntoViewIfNeeded();
   expect(await row.evaluate(element => element.scrollWidth - element.clientWidth)).toBe(0);
   const [detailBox, amountBox] = await Promise.all([description.boundingBox(), amount.boundingBox()]);
   if (viewport === 'desktop') expect(detailBox!.x).toBeLessThan(amountBox!.x);
   else expect(detailBox!.y).toBeLessThan(amountBox!.y);
   if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
    await row.screenshot({ path: info.outputPath(`item-31g-${viewport}.png`), animations: 'disabled' });
   }
  }

  await page.getByRole('button', { name: 'Save draft', exact: true }).click();
  await expect(page).toHaveURL(base);
  if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') {
   const printed = await printSavedReturn(page, code, info.outputPath('item-31g.pdf'));
   await expect(printed.locator('[data-field-id="frm1702q:txt31Gothers"]')).toHaveValue('Prior payment');
   await expect(printed.locator('[data-field-id="frm1702q:txt31G"]')).toHaveValue('1,200.00');
   await expect(printed.locator('[data-field-id="frm1702q:txt31H"]')).toHaveValue('1,225.00');
   await printed.close();
   await page.getByRole('button', { name: 'Not now', exact: true }).click();
  }
  await page.getByRole('link', { name: /^Edit BIR Form / }).click();
  await expect(description).toHaveValue('Prior payment');
  await expect(description).toHaveAttribute('required', '');
  await expect(amount).toHaveValue('1,200.00');
  await expect(total).toHaveText('1,225.00');

  await description.clear();
  await amount.fill('0');
  await amount.blur();
  await expect(total).toHaveText('25.00');
  await expect(description).not.toHaveAttribute('required');
  await expect(page.getByRole('dialog')).toHaveCount(0);
 });
}
