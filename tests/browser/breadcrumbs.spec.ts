import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

test('return breadcrumbs navigate through the taxpayer hierarchy', async ({ page }, testInfo) => {
 await page.setViewportSize({ width: 1440, height: 960 });
 await seedWorkspace(page);
 await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
 const nav = page.getByRole('navigation', { name: 'Breadcrumb' });
 await expect(nav).toBeVisible();
 await expect(nav).not.toContainText('TaxMate');
 await expect(nav.locator('[aria-current="page"]')).toHaveText('Tax Returns');
 const taxpayer = nav.locator(`a[href="/ebirforms/taxpayers/${taxpayerId}"]`);
 await expect(taxpayer).toHaveText('001-234-567-0008');
 await expect(nav).not.toContainText('Example Services Corporation');
 await page.screenshot({ path: testInfo.outputPath('tax-returns-breadcrumbs.png') });
 await taxpayer.click();
 await expect(page).toHaveURL(new RegExp(`/taxpayers/${taxpayerId}$`));
 await nav.getByRole('link', { name: 'eBIRForms', exact: true }).click();
 await expect(page).toHaveURL(/\/ebirforms\/taxpayers$/);
});
