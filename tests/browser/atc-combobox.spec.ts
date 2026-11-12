import { expect, test } from '@playwright/test';
import { formPath, seedWorkspace } from './fixtures';

for (const width of [1440, 390]) {
 test(`ATC combobox searches and selects at ${width}px`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 960 });
  await seedWorkspace(page);
  await page.goto(formPath);
  const row = page.getByRole('group', { name: 'ATC row 1', exact: true });
  const atc = row.getByRole('combobox', { name: 'ATC', exact: true });
  await expect(atc).toHaveText('WI120');
  await atc.press('Enter');
  const search = page.getByPlaceholder('Search code or income', { exact: true });
  await expect(search).toBeFocused();
  await search.fill('WI01');
  await expect(page.getByRole('option', { name: /WI010/ })).toContainText('5%');
  await expect(page.getByRole('option', { name: /WI011/ })).toContainText('10%');
  await search.fill('WI010');
  const option = page.getByRole('option', { name: /WI010/ });
  await expect(option).toBeVisible();
  await expect(option.locator('mark')).toHaveText('WI010');
  await search.press('Enter');
  await expect(atc).toHaveText('WI010');
  await expect(row.getByLabel('Rate (%)', { exact: true })).toHaveText('5.00%');
  await expect(row.getByLabel('Tax withheld', { exact: true })).toHaveText('₱5,000.00');
  await atc.press('Enter');
  await search.fill('cntrctrs');
  const contractor = page.getByRole('option', { name: /WI120/ });
  await expect(contractor).toBeVisible();
  await expect.poll(async () => (await contractor.locator('mark').allTextContents()).join('')).toBe('CNTRCTRS');
  await expect(page.locator('[popover="manual"]')).toHaveCSS('opacity', '1');
  await page.screenshot({ path: testInfo.outputPath('atc-fuzzy-description.png'), fullPage: true });
  await search.fill('w120');
  await expect(contractor).toBeVisible();
  await expect(contractor.locator('mark')).toHaveText(['W', '120']);
  await page.screenshot({ path: testInfo.outputPath('atc-fuzzy-code.png'), fullPage: true });
  await page.getByRole('option', { name: /WI120/ }).click();
  await expect(atc).toHaveText('WI120');
  await atc.click();
  await search.fill('no-such-income-xyz');
  await expect(page.getByText('No matching ATCs.', { exact: true })).toBeVisible();
  await search.press('Escape');
  await expect(atc).toBeFocused();
  await expect(atc).toHaveText('WI120');
  await atc.click();
  await search.press('Tab');
  await expect(atc).toHaveAttribute('aria-expanded', 'false');
  await expect(row.locator('[id="frm1601EQ:txtTaxBase13"]')).toBeFocused();
  await atc.click();
  await search.press('Shift+Tab');
  await expect(atc).toHaveAttribute('aria-expanded', 'false');
  await atc.click();
  await search.fill('WI010');
  await expect(page.locator('[popover="manual"]')).toHaveCSS('opacity', '1');
  await page.screenshot({ path: testInfo.outputPath('atc-combobox.png'), fullPage: true });
  const bounds = await option.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
 });
}

 test('ATC popup stays inside a short window', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 400 });
  await seedWorkspace(page);
  await page.goto(formPath);
  await page.getByRole('combobox', { name: 'ATC', exact: true }).click();
  const popup = page.locator('[popover="manual"]');
  await expect(popup).toBeVisible();
  const bounds = await popup.boundingBox();
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(400);
 });

 test('ATC fuzzy matches highlight the matched description characters', async ({ page }) => {
  await seedWorkspace(page);
  await page.goto(formPath);
  await page.getByRole('combobox', { name: 'ATC', exact: true }).click();
  await page.getByPlaceholder('Search code or income', { exact: true }).fill('cntrctrs');
  const contractor = page.getByRole('option', { name: /WI120/ });
  await expect(contractor).toBeVisible();
  await expect.poll(async () => (await contractor.locator('mark').allTextContents()).join('')).toBe('CNTRCTRS');
 });

 test('ATC percentages follow the return year', async ({ page }) => {
  await seedWorkspace(page);
  await page.goto(formPath);
  const year = page.getByRole('textbox', { name: 'Year', exact: true });
  const atc = page.getByRole('combobox', { name: 'ATC', exact: true });
  const search = page.getByPlaceholder('Search code or income', { exact: true });
  await year.fill('2018');
  await atc.click();
  await search.fill('WI650');
  await expect(page.getByRole('option', { name: /WI650/ })).toContainText('25%');
  await search.press('Enter');
  await expect(page.getByLabel('Rate (%)', { exact: true })).toHaveText('25.00%');
  await year.fill('2026');
  await atc.click();
  await search.fill('WI650');
  await expect(page.getByRole('option', { name: /WI650/ })).toContainText('15%');
  await search.press('Escape');
  await expect(page.getByLabel('Rate (%)', { exact: true })).toHaveText('15.00%');
 });
