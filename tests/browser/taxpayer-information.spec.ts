import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

test('business, PSIC and both classifications are saved and edited in taxpayer information', async ({ page }, testInfo) => {
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
 await expect(page.getByRole('textbox', { name: 'PSIC code', exact: true })).toHaveValue('');
 await page.getByRole('textbox', { name: 'Line of business / occupation', exact: true }).fill('Accounting and advisory services');
 await page.getByRole('textbox', { name: 'PSIC code', exact: true }).fill('0123');
 await page.getByRole('combobox', { name: 'Taxpayer size classification', exact: true }).click();
 await page.getByRole('option', { name: 'Small', exact: true }).click();
 await page.getByRole('combobox', { name: 'Tax classification', exact: true }).click();
 await page.getByRole('option', { name: 'Non-individual', exact: true }).click();
 await page.getByRole('button', { name: 'Save profile', exact: true }).click();
 await expect(page).toHaveURL('/ebirforms/taxpayers');
 await page.goto(editPath);
 await expect(page.getByRole('textbox', { name: 'Line of business / occupation', exact: true })).toHaveValue('Accounting and advisory services');
 await expect(page.getByRole('textbox', { name: 'PSIC code', exact: true })).toHaveValue('0123');
 await expect(page.getByRole('combobox', { name: 'Taxpayer size classification', exact: true })).toHaveText('Small');
 await expect(page.getByRole('combobox', { name: 'Tax classification', exact: true })).toHaveText('Non-individual');
 for (const width of [1280, 390]) {
  await page.setViewportSize({ width, height: 900 });
  if (width < 768) await expect(page.getByRole('complementary', { name: 'Primary' })).not.toBeInViewport();
  await expect(page.getByRole('textbox', { name: 'PSIC code', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath(`taxpayer-information-${width}.png`), fullPage: true, animations: 'disabled' });
 }
 await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/0605?return=profile-0605`);
 await expect(page.locator('input[id="frm0605:txtLineBus"]')).toHaveCount(0);
 await expect(page.getByRole('combobox', { name: 'Taxpayer classification', exact: true })).toHaveCount(0);
 await expect(page.locator('summary').filter({hasText:'Taxpayer details'})).toHaveCount(0);
 await page.getByRole('button', {name:'Save draft',exact:true}).click();
 const values = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns.find((record: {id:string}) => record.id==='profile-0605').values);
 expect(values['frm0605:txtLineBus']).toBe('Accounting and advisory services');
 expect(values['frm0605:txtClassification']).toBe('N');
});
