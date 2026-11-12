import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

// Use the actual list and shared form controls; native storage is isolated by the fixture.
test.beforeEach(async ({ page }) => {
  await seedWorkspace(page);
});

test('columns dismisses under the sticky header without scrolling back or reopening', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 600 });
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
  const trigger = page.getByRole('button', { name: 'Columns', exact: true, includeHidden: true }).first();
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const scrollPosition = await trigger.evaluate(button => {
    document.body.style.paddingBottom = '1000px';
    window.scrollBy(0, button.getBoundingClientRect().top - 5);
    return window.scrollY;
  });
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('menu')).toHaveCount(0);
  expect(scrollPosition).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollPosition);
  expect(await trigger.evaluate(button => button.getBoundingClientRect().bottom)).toBeLessThan(54);
  await page.screenshot({ path: testInfo.outputPath('columns-dismissed.png') });
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
});

test('columns closes when an ancestor becomes invisible', async ({ page }) => {
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
  const trigger = page.getByRole('button', { name: 'Columns', exact: true, includeHidden: true }).first();
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await trigger.evaluate(button => { button.parentElement!.style.visibility = 'hidden'; });
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('columns stays open during scrolling while the trigger is visible', async ({ page }) => {
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
  const trigger = page.getByRole('button', { name: 'Columns', exact: true, includeHidden: true }).first();
  await trigger.click();
  await trigger.evaluate(() => {
    document.body.style.paddingBottom = '1000px';
    window.scrollBy(0, 10);
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(10);
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('select dismisses after its trigger leaves the viewport', async ({ page }) => {
  await page.goto('/design-system');
  const trigger = page.getByRole('combobox', { name: 'Filing period' });
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('listbox')).toHaveCount(0);
});

for (const width of [1440, 390]) {
  test(`dropdown closes when clipped by a nested scroller at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 700 });
    await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
    const trigger = page.getByRole('button', { name: width < 768 ? 'Add filter' : 'Columns', exact: true }).first();
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await trigger.evaluate(button => {
      const root = button.parentElement!;
      const scroller = document.createElement('div');
      root.before(scroller);
      scroller.style.cssText = 'width:80px;height:40px;overflow:auto';
      scroller.append(root);
      root.style.cssText = 'margin-left:100px;width:40px';
      scroller.scrollLeft = 100;
    });
    // Still visible at the scroller's right edge.
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await trigger.evaluate(button => { button.parentElement!.parentElement!.scrollLeft = 0; });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
}

test('scrolling inside the menu keeps it open', async ({ page }) => {
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
  const trigger = page.getByRole('button', { name: 'Columns', exact: true }).first();
  await trigger.click();
  await page.getByRole('menu').evaluate(panel => {
    panel.style.maxHeight = '70px';
    panel.style.overflowY = 'auto';
    panel.scrollTop = 30;
  });
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('menuitemcheckbox', { name: 'Return period' })).toHaveAttribute('aria-checked', 'true');
});

test('mobile filter sheet stays open over its own backdrop', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
  const trigger = page.getByRole('button', { name: 'Add filter', exact: true });
  await trigger.click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
});
