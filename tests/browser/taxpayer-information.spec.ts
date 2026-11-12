import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

test('business and tax classification are saved and edited in taxpayer information', async ({ page }) => {
 await seedWorkspace(page);
 await page.addInitScript(() => {
  const key = 'ebirforms-created-returns-v1';
  const saved = JSON.parse(localStorage.getItem(key)!);
  const taxpayerId = saved.returns[0].taxpayerId;
  saved.returns.push({ id: 'profile-0605', taxpayerId, formCode: '0605', returnPeriod: '20250131', status: 'Draft', updatedAt: Date.now(), finalFlag: '0', values: { 'frm0605:txtLineBus': 'Old services', 'frm0605:txtClassification': 'I' } });
  localStorage.setItem(key, JSON.stringify(saved));
  const native = (window as any).__TAURI_INTERNALS__;
  const previous = native.invoke;
  native.invoke = async (command: string, args: any) => {
   if (command === 'save_taxpayer_profile') {
    localStorage.setItem('test-taxpayer-information', JSON.stringify(args.profile));
    return { profile: args.profile, path: 'test-profile.xml' };
   }
   if (command === 'list_taxpayer_profiles') {
    const stored = localStorage.getItem('test-taxpayer-information');
    if (stored) return [JSON.parse(stored)];
   }
   return previous(command, args);
  };
 });
 const editPath = `/ebirforms/taxpayers/${taxpayerId}/edit`;
 await page.goto(editPath);
 await page.getByRole('textbox', { name: 'Line of business / occupation', exact: true }).fill('Accounting and advisory services');
 await page.getByRole('combobox', { name: 'Tax classification', exact: true }).click();
 await page.getByRole('option', { name: 'Non-individual', exact: true }).click();
 await page.getByRole('button', { name: 'Save profile', exact: true }).click();
 await expect(page).toHaveURL('/ebirforms/taxpayers');
 await page.goto(editPath);
 await expect(page.getByRole('textbox', { name: 'Line of business / occupation', exact: true })).toHaveValue('Accounting and advisory services');
 await expect(page.getByRole('combobox', { name: 'Tax classification', exact: true })).toHaveText('Non-individual');
 await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/0605?return=profile-0605`);
 await expect(page.locator('input[id="frm0605:txtLineBus"]')).toHaveCount(0);
 await expect(page.getByRole('combobox', { name: 'Taxpayer classification', exact: true })).toHaveCount(0);
 await expect(page.locator('summary').filter({hasText:'Taxpayer details'})).toHaveCount(0);
 await page.getByRole('button', {name:'Save draft',exact:true}).click();
 const values = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns.find((record: {id:string}) => record.id==='profile-0605').values);
 expect(values['frm0605:txtLineBus']).toBe('Accounting and advisory services');
 expect(values['frm0605:txtClassification']).toBe('N');
});
