import { expect, test } from '@playwright/test';
import { openDesignSystemFixture } from './fixtures';

test('closed typeahead opens without changing the stored selection until Enter', async ({ page }) => {
  await openDesignSystemFixture(page);
  const period = page.getByRole('combobox', { name: 'Filing period', exact: true });
  await expect(period).toHaveText('Monthly');
  await period.focus();
  await period.press('a');
  await expect(period).toHaveAttribute('aria-expanded', 'true');
  await expect(period).toBeFocused();
  await expect(period).toHaveText('Monthly');
  const activeId = await period.getAttribute('aria-activedescendant');
  expect(activeId).toBeTruthy();
  await expect(page.locator(`[id="${activeId}"]`)).toContainText('Annual');
  await period.press('Enter');
  await expect(period).toHaveText('Annual');
  await expect(period).toHaveAttribute('aria-expanded', 'false');
  await expect(period).toBeFocused();
});

test('Escape restores the selected highlight and outside presses keep normal focus movement', async ({ page }) => {
  await openDesignSystemFixture(page);
  const period = page.getByRole('combobox', { name: 'Filing period', exact: true });
  await period.click();
  await period.press('End');
  await period.press('Escape');
  await expect(period).toHaveText('Monthly');
  await expect(period).toBeFocused();
  await period.press('Enter');
  const activeId = await period.getAttribute('aria-activedescendant');
  await expect(page.locator(`[id="${activeId}"]`)).toContainText('Monthly');
  const notes = page.getByRole('textbox', { name: 'Reviewer notes', exact: true });
  await notes.click();
  await expect(period).toHaveAttribute('aria-expanded', 'false');
  await expect(notes).toBeFocused();
});
