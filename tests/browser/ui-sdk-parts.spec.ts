import { expect, test } from '@playwright/test';
import { seedWorkspace } from './fixtures';

test.beforeEach(async ({ page }) => {
  await seedWorkspace(page);
  await page.routeWebSocket('**/*', socket => socket.close());
  await page.goto('/');
  await expect(page.locator('#main-content')).toBeVisible({timeout: 15_000});
  await page.evaluate(async () => {
    const fixtureModule = '/src/tests/fixtures/mount-form-focus.ts';
    (await import(/* @vite-ignore */ fixtureModule)).mountFormFocus();
  });
});

test('composed select exposes its options and keeps disabled choices unavailable', async ({ page }) => {
  const trigger = page.getByLabel('Primitive select', { exact: true });
  await trigger.click();
  await expect(page.getByRole('option', { name: 'First Quarter', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('option', { name: 'Third Quarter', exact: true })).toHaveAttribute('data-disabled', '');
  await page.getByRole('option', { name: 'Second Quarter', exact: true }).click();
  await expect(trigger).toHaveText('Second Quarter');
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

for (const kind of ['Inline', 'Floating']) {
  test(`${kind.toLowerCase()} tooltip responds to hover and keyboard focus`, async ({ page }) => {
    const trigger = page.getByRole('button', { name: `${kind} tooltip trigger`, exact: true });
    const tooltip = page.getByRole('tooltip').filter({ hasText: `${kind} hint` });
    await trigger.hover();
    await expect(tooltip).toBeVisible();
    await page.mouse.move(0, 0);
    await expect(tooltip).toBeHidden();
    await trigger.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(trigger).toBeFocused();
    await expect(tooltip).toBeVisible();
  });
}

test('tooltip describes its child control and Escape dismisses it without moving focus', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Inline tooltip trigger', exact: true });
  await trigger.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  const tooltip = page.getByRole('tooltip').filter({ hasText: 'Inline hint' });
  await expect(tooltip).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-describedby', /\S/);
  const description = await trigger.getAttribute('aria-describedby');
  await expect(page.locator(`[id="${description}"]`)).toHaveText('Inline hint');
  await page.keyboard.press('Escape');
  await expect(tooltip).toBeHidden();
  await expect(trigger).toBeFocused();
});


test('explicitly unclamped tooltip retains the requested placement beyond the viewport', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Unclamped tooltip trigger', exact: true });
  await trigger.evaluate(control => { control.parentElement!.style.cssText += ';position:fixed;left:0;top:200px;z-index:1000;'; });
  await trigger.hover();
  const tooltip = page.getByRole('tooltip').filter({hasText: 'Unclamped hint'});
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveAttribute('data-side', 'left');
  await expect.poll(async () => (await tooltip.boundingBox())!.x).toBeLessThan(0);
});
