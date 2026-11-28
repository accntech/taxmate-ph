import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

for (const [width, theme] of [[1440, 'light'], [390, 'dark']] as const) {
 test(`sending preferences persist and control the form action at ${width}px`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 960 });
  await seedWorkspace(page, theme);
  await page.goto('/settings');
  const sending = page.getByRole('radiogroup', { name: 'Sending mode' });
  const send = sending.getByRole('radio', { name: 'Send to BIR', exact: true });
  const prepare = sending.getByRole('radio', { name: 'Prepare locally', exact: true });
  await expect(send).toBeChecked({ timeout: 15_000 });
  await send.focus();
  await page.keyboard.press('ArrowRight');
  await expect(prepare).toBeChecked();
  await expect(prepare).toBeFocused();
  await expect(send).not.toBeChecked();
  await page.reload();
  await expect(prepare).toBeChecked();
  await page.screenshot({ path: testInfo.outputPath('sending-settings.png'), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
  await page.getByRole('button', { name: /^More actions for BIR Form/ }).click();
  await expect(page.getByRole('menuitem', { name: 'Prepare locally', exact: true })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Mock submit', exact: true })).toHaveCount(0);
 });
}
