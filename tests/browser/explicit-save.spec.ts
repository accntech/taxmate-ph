import { expect, test } from '@playwright/test';
import { formPath, seedWorkspace, taxpayerId } from './fixtures';

const formsPath = `/ebirforms/taxpayers/${taxpayerId}/forms`;

for (const exit of ['Cancel', 'Back'] as const) {
 test(`new form ${exit} leaves saved forms unchanged`, async ({ page }) => {
  await seedWorkspace(page);
  await page.goto(formsPath);
  const before = await page.evaluate(() => localStorage.getItem('ebirforms-created-returns-v1'));
  await page.getByRole('button', { name: 'Create return', exact: true }).click();
  await page.getByRole('option').filter({ hasText: '1601EQ' }).click();
  await expect(page.getByRole('heading', { name: 'BIR Form 1601EQ', exact: true })).toBeVisible();
  if (exit === 'Cancel') await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  else await page.getByRole('link', { name: '← Back to forms', exact: true }).click();
  await expect(page).toHaveURL(formsPath);
  expect(await page.evaluate(() => localStorage.getItem('ebirforms-created-returns-v1'))).toBe(before);
 });
}

test('Save creates a new form and updates it only when saved again', async ({ page }) => {
 await seedWorkspace(page);
 await page.goto(formsPath);
 const before = await page.evaluate(() => localStorage.getItem('ebirforms-created-returns-v1'));
 await page.getByRole('button', { name: 'Create return', exact: true }).click();
 await page.getByRole('option').filter({ hasText: '1601EQ' }).click();
 await expect(page.getByRole('heading', { name: 'BIR Form 1601EQ', exact: true })).toBeVisible();
 expect(await page.evaluate(() => localStorage.getItem('ebirforms-created-returns-v1'))).toBe(before);
 await page.getByRole('button', { name: 'Save draft', exact: true }).click();
 await expect(page).toHaveURL(formsPath);
 const records = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns);
 expect(records).toHaveLength(2);
 const id = records.find((record: { id: string }) => record.id !== 'review-return').id;
 await page.locator(`a[href*="${id}"]`).click();
 await page.getByRole('textbox', { name: 'Year', exact: true }).fill('2025');
 await page.getByRole('button', { name: 'Save draft', exact: true }).click();
 await expect(page).toHaveURL(formsPath);
 const updated = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns);
 expect(updated).toHaveLength(2);
 expect(updated.find((record: { id: string }) => record.id === id).values['frm1601EQ:txtYear']).toBe('2025');
});

test('canceling edits preserves the saved BIR form', async ({ page }) => {
 await seedWorkspace(page);
 await page.goto(formPath);
 const before = await page.evaluate(() => localStorage.getItem('ebirforms-created-returns-v1'));
 await page.getByRole('textbox', { name: 'Year', exact: true }).fill('2025');
 await page.getByRole('button', { name: 'Cancel', exact: true }).click();
 await expect(page).toHaveURL(formsPath);
 expect(await page.evaluate(() => localStorage.getItem('ebirforms-created-returns-v1'))).toBe(before);
});
