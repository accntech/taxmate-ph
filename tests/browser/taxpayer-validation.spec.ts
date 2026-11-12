import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

test('saves a packaged alphanumeric RDO from the taxpayer editor', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/edit`);
	const rdo = page.getByRole('textbox', { name: 'RDO code', exact: true });
	await rdo.fill('999');
	await page.getByRole('button', { name: 'Save profile', exact: true }).click();
	await expect(page.getByRole('alert')).toContainText('Profile not saved');
	await expect(rdo).toHaveAttribute('aria-invalid', 'true');
	await expect(page).toHaveURL(`/ebirforms/taxpayers/${taxpayerId}/edit`);
	await rdo.fill('17A');
	expect(await rdo.evaluate((input: HTMLInputElement) => input.validity.patternMismatch)).toBe(false);
	await page.getByRole('button', { name: 'Save profile', exact: true }).click();
	await expect(page).toHaveURL('/ebirforms/taxpayers');
});


test('preserves a legacy profile identity when saving a padded branch', async ({ page }) => {
 await seedWorkspace(page);
 await page.goto(`/ebirforms/taxpayers/${taxpayerId}/edit`);
 const tin = page.getByRole('textbox', { name: 'TIN and branch code', exact: true });
 await expect(tin).toHaveValue('001-234-567-00008');
 await page.evaluate(() => {
  const native = (window as any).__TAURI_INTERNALS__;
  const invoke = native.invoke;
  native.invoke = async (command: string, args: any) => {
   if (command === 'save_taxpayer_profile') (window as any).__savedProfile = args.profile;
   return invoke(command, args);
  };
 });
 await page.getByRole('button', { name: 'Save profile', exact: true }).click();
 await expect(page).toHaveURL('/ebirforms/taxpayers');
 expect(await page.evaluate(() => (window as any).__savedProfile)).toMatchObject({ id: taxpayerId, branchCode: '00008' });
});

test('saves a new taxpayer with all five branch digits', async ({ page }) => {
 await seedWorkspace(page, 'light', 'empty');
 await page.goto('/ebirforms/taxpayers/new');
 await page.evaluate(() => {
  const native = (window as any).__TAURI_INTERNALS__;
  const invoke = native.invoke;
  let saved: unknown;
  native.invoke = async (command: string, args: any) => {
   if (command === 'save_taxpayer_profile') saved = args.profile;
   if (command === 'list_taxpayer_profiles' && saved) return [saved];
   return invoke(command, args);
  };
 });
 await page.getByRole('textbox', { name: 'Taxpayer name', exact: true }).fill('Five Digit Taxpayer');
 const tin = page.getByRole('textbox', { name: 'TIN and branch code', exact: true });
 await tin.fill('00123456712345');
 await tin.blur();
 await expect(tin).toHaveValue('001-234-567-12345');
 await page.getByRole('textbox', { name: 'RDO code', exact: true }).fill('040');
 await page.getByRole('button', { name: 'Save profile', exact: true }).click();
 await expect(page).toHaveURL('/ebirforms/taxpayers');
 await expect(page.getByText('001-234-567-12345', { exact: true })).toBeVisible();
});
