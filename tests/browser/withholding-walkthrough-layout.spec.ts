import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

for (const width of [390, 1024, 1280, 1440]) {
 test(`1606 keeps transaction date segments inside their control at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 900 });
  await seedWorkspace(page);
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1606?new=true`);
  const period = page.getByRole('region', { name: 'Return period', exact: true });
  const date = period.locator('[data-slot="date-input"]');
  await expect(date).toBeVisible();
  const year = date.getByRole('spinbutton', { name: 'Year', exact: true });
  await year.fill('2025');
  await date.getByRole('spinbutton', { name: 'Month', exact: true }).fill('11');
  await date.getByRole('spinbutton', { name: 'Day', exact: true }).fill('25');
  await year.blur();
  const issues = await date.evaluate(element => {
   const box = element.getBoundingClientRect();
   const calendar = element.querySelector('button')!.getBoundingClientRect();
   return [...element.querySelectorAll('input[role="spinbutton"]')].map(input => input.getBoundingClientRect()).filter(rect => rect.left < box.left || rect.right > calendar.left || rect.right > box.right).length;
  });
  expect(issues).toBe(0);
  await page.screenshot({ path: info.outputPath(`1606-${width}.png`), fullPage: true });
 });
}

for (const code of ['0619E', '0619F']) {
 test(`${code} keeps filing choices legible at desktop and narrow widths`, async ({ page }, info) => {
  await seedWorkspace(page);
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
  const period = page.getByRole('region', { name: 'Return period', exact: true });
  await expect(period).toBeVisible();
  await page.getByRole('combobox', { name: 'Month', exact: false }).click();
  await page.getByRole('option', { name: 'September', exact: true }).click();
  for (const width of [1280, 1440, 390, 320]) {
   await page.setViewportSize({ width, height: 900 });
   await page.evaluate(() => document.fonts.ready);
   if (width === 390) await page.getByRole('button', { name: 'Toggle sidebar', exact: true }).click();
   const issues = await period.evaluate(element => {
    const month = element.querySelector('[role="combobox"]')!;
    const label = [...month.querySelectorAll('span')].find(span => span.textContent === 'September' && !span.querySelector('span'))!;
    const legends = [...element.querySelectorAll('legend')];
    return {
     monthClipped: label.scrollWidth > label.clientWidth + 1,
     detachedRequired: legends.some(legend => {
      const marker = legend.querySelector('span');
      return marker && marker.getBoundingClientRect().top > legend.getBoundingClientRect().top + 5;
     }),
     overflow: document.documentElement.scrollWidth > innerWidth
    };
   });
   expect(issues).toEqual({ monthClipped: false, detachedRequired: false, overflow: false });
   await page.screenshot({ path: info.outputPath(`${code}-${width}.png`), fullPage: true });
  }
 });
}

test('1601EQ names the quarter prompt without truncation', async ({ page }) => {
 await page.setViewportSize({ width: 1280, height: 900 });
 await seedWorkspace(page);
 await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1601EQ?new=true`);
 const quarter = page.getByRole('combobox', { name: 'Quarter', exact: false });
 await expect(quarter).toHaveText('Choose quarter');
 await quarter.click();
 await page.getByRole('option', { name: 'Second Quarter', exact: true }).click();
 expect(await quarter.evaluate(element => {
  const label = [...element.querySelectorAll('span')].find(span => span.textContent === 'Second Quarter' && !span.querySelector('span'))!;
  return label.scrollWidth > label.clientWidth + 1;
 })).toBe(false);
});
