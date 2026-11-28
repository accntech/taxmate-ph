import { expect, test } from '@playwright/test';
import { formPath, seedWorkspace, taxpayerId } from './fixtures';

const formsPath = `/ebirforms/taxpayers/${taxpayerId}/forms`;

test('shows the form skeleton while an editor module loads', async ({ page }) => {
 test.setTimeout(45_000);
 await seedWorkspace(page);
 const editorRequest = Promise.withResolvers<void>();
 const releaseEditor = Promise.withResolvers<void>();
 await page.route('**/income-editor.svelte*', async route => {
  editorRequest.resolve();
  await releaseEditor.promise;
  await route.continue();
 });
 await page.goto(`${formsPath}/1701A?new=true`, { waitUntil: 'domcontentloaded' });
 await editorRequest.promise;
 const skeleton = page.locator('[data-slot="form-skeleton"]');
 try {
  await expect(skeleton).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save draft' })).toHaveCount(0);
 } finally {
  releaseEditor.resolve();
 }
 await expect(page.getByRole('button', { name: 'Save draft' })).toBeEnabled({ timeout: 15_000 });
 await expect(skeleton).toHaveCount(0);
});

test('opening 1601EQ skips the income and generic withholding editor modules', async ({ page }) => {
 const unrelatedEditors: string[] = [];
 page.on('request', request => {
  const path = new URL(request.url()).pathname;
  if (path.endsWith('/income-editor.svelte') || path.endsWith('/withholding-editor.svelte')) {
   unrelatedEditors.push(path);
  }
 });
 await seedWorkspace(page);
 await page.goto(formsPath);
 await page.getByRole('link', { name: /^Edit BIR Form / }).click();
 await expect(page.getByRole('textbox', { name: 'Year', exact: true })).toHaveValue('2026', { timeout: 15_000 });
 expect(unrelatedEditors).toEqual([]);
});

for (const action of ['open', 'create'] as const) {
 test(`${action} a form from the list without reloading saved returns and taxpayers`, async ({ page }) => {
  await seedWorkspace(page);
  await page.goto(formsPath);
  const savedForm = page.getByRole('link', { name: /^Edit BIR Form / });
  await expect(savedForm).toBeVisible({ timeout: 15_000 });
  await page.evaluate(() => {
   const tauri = (window as typeof window & {
    __TAURI_INTERNALS__: { invoke: (command: string, ...args: unknown[]) => Promise<unknown> };
   }).__TAURI_INTERNALS__;
   const invoke = tauri.invoke;
   tauri.invoke = (command, ...args) => {
    if (command === 'load_working_returns' || command === 'list_taxpayer_profiles') {
     performance.mark(command);
    }
    return invoke(command, ...args);
   };
   const getItem = Storage.prototype.getItem;
   Storage.prototype.getItem = function (key) {
    if (key === 'ebirforms-created-returns-v1') performance.mark('load_working_returns');
    return getItem.call(this, key);
   };
  });

  if (action === 'create') {
   await page.getByRole('button', { name: 'Create return', exact: true }).click();
   await page.getByRole('option').filter({ hasText: '1601EQ' }).click();
  } else {
   await savedForm.click();
  }
  await expect(page.getByRole('textbox', { name: 'Year', exact: true })).toHaveValue('2026', { timeout: 15_000 });
  const storageReads = await page.evaluate(() => performance.getEntriesByType('mark')
   .map(entry => entry.name)
   .filter(name => name === 'load_working_returns' || name === 'list_taxpayer_profiles'));
  expect(storageReads).toEqual([]);
 });
}

for (const exit of ['Cancel', 'Back'] as const) {
 test(`new form ${exit} leaves saved forms unchanged`, async ({ page }) => {
  await seedWorkspace(page);
  await page.goto(formsPath);
  const before = await page.evaluate(() => localStorage.getItem('ebirforms-created-returns-v1'));
  await page.getByRole('button', { name: 'Create return', exact: true }).click();
  await page.getByRole('option').filter({ hasText: '1601EQ' }).click();
  await expect(page.getByRole('heading', { name: /^Quarterly Remittance Return/ })).toBeVisible();
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
 await expect(page.getByRole('heading', { name: /^Quarterly Remittance Return/ })).toBeVisible();
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
