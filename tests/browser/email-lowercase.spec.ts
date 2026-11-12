import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

test('email input lowercases typing and pasted text and saves lowercase', async ({ page }) => {
 await seedWorkspace(page);
 await page.addInitScript(() => {
  const native = (window as any).__TAURI_INTERNALS__;
  const previous = native.invoke;
  native.invoke = async (command: string, args: any) => {
   if (command === 'save_taxpayer_profile') {
    localStorage.setItem('test-email-profile', JSON.stringify(args.profile));
    return { profile: args.profile, path: 'test-profile.xml' };
   }
   if (command === 'list_taxpayer_profiles') {
    const saved = localStorage.getItem('test-email-profile');
    if (saved) return [JSON.parse(saved)];
   }
   return previous(command, args);
  };
 });
 await page.goto(`/ebirforms/taxpayers/${taxpayerId}/edit`);
 const email = page.getByRole('textbox', { name: 'Email', exact: true });
 await email.fill('');
 await email.pressSequentially('Mixed.Case@Example.COM');
 await expect(email).toHaveValue('mixed.case@example.com');
 await email.fill('Pasted.Address@EXAMPLE.COM');
 await expect(email).toHaveValue('pasted.address@example.com');
 await page.getByRole('button', { name: /save/i }).click();
 await expect(page).toHaveURL('/ebirforms/taxpayers');
 await page.goto(`/ebirforms/taxpayers/${taxpayerId}/edit`);
 await expect(email).toHaveValue('pasted.address@example.com');
});
