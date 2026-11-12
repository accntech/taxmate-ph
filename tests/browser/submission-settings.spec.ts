import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

for (const [width, theme] of [[1440, 'light'], [390, 'dark']] as const) {
 test(`sending preferences persist and control the form action at ${width}px`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 960 });
  await seedWorkspace(page, theme);
  await page.goto('/settings');
  const sending = page.getByRole('group', { name: 'Sending mode' });
  await expect(sending.getByRole('button', { name: 'Send to BIR', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await sending.getByRole('button', { name: 'Prepare locally', exact: true }).click();
  await page.reload();
  await expect(sending.getByRole('button', { name: 'Prepare locally', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.screenshot({ path: testInfo.outputPath('sending-settings.png'), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
  await page.getByRole('button', { name: /^More actions for BIR Form/ }).click();
  await expect(page.getByRole('menuitem', { name: 'Prepare locally', exact: true })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Mock submit', exact: true })).toHaveCount(0);
 });
}
