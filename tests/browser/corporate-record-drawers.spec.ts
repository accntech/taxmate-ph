import { expect, test } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

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
});

test('legacy quarterly optional credits use one record drawer', async ({ page }) => {
 await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
 await page.goto(`${base}/1702Q?new=true`);
 const section = page.locator('.line-list').filter({ has: page.getByRole('heading', { name: /^Other tax credits \(/ }) });
 await section.getByRole('button', { name: 'Add item', exact: true }).click();
 const drawer = page.getByRole('dialog');
 await drawer.getByRole('textbox', { name: 'Description', exact: true }).fill('Optional prior credit');
 await drawer.getByRole('textbox', { name: 'Amount', exact: true }).fill('900');
 await drawer.getByRole('button', { name: 'Add item', exact: true }).click();
 await expect(drawer).toBeHidden();
 await section.getByRole('button', { name: 'Optional prior credit', exact: true }).click();
 await drawer.getByRole('button', { name: 'Delete item', exact: true }).click();
 await expect(drawer).toBeHidden();
 await expect(section.getByRole('listitem')).toHaveCount(0);
});
