import { expect, test, type Locator, type Page } from '@playwright/test';
import { getWithholdingDefinition, withholdingDefinitions } from '../../src/lib/forms/withholding-definitions';
import { seedWorkspace, taxpayerId } from './fixtures';

const atcForms = withholdingDefinitions.filter(definition => [
 ...definition.sections.flatMap(section => section.fields),
 ...definition.schedules.flatMap(schedule => schedule.rows.flatMap(row => row.fields))
].some(field => !field.readonly && /^(?:\d+\s+)?ATC$/.test(field.label)));

async function openScheduleEditor(page: Page, title: string) {
 const summary = page.locator('summary').filter({ hasText: title }).first();
 if (await summary.locator('..').getAttribute('open') === null) await summary.click();
 await page.getByRole('button', { name: `Add line item to ${title}`, exact: true }).click();
 await expect(page.getByRole('dialog', { name: 'New line item', exact: true })).toBeVisible();
}

async function exercisePicker(page: Page, picker: Locator) {
 await picker.click();
 const search = page.getByPlaceholder('Search code or income', { exact: true });
 await expect(search).toBeFocused();
 await expect(page.getByRole('button', { name: /^Use ATC/ })).toHaveCount(0);
 const firstOption = page.getByRole('option').first();
 await expect(firstOption).toBeVisible();
 await expect(firstOption).toHaveCSS('height', '44px');
 const code = (await firstOption.innerText()).split(/\s+/)[0];
 await search.fill(code);
 await expect(page.getByRole('option').first()).toContainText(code);
 await search.press('Enter');
 await expect(picker).toHaveText(code);
 await expect(page.locator('[popover="manual"]')).toHaveCount(0);
 await picker.locator('..').getByRole('button', { name: 'Clear selection', exact: true }).click();
 await expect(picker).toHaveText('Choose ATC');
 await picker.click();
 await search.fill('   ');
 await expect(page.getByRole('button', { name: /^Use ATC/ })).toHaveCount(0);
 await search.fill('zz999');
 const use = page.getByRole('button', { name: 'Use ATC "zz999"', exact: true });
 await expect(use).toHaveCSS('height', '36px');
 await use.click();
 await expect(picker).toHaveText('ZZ999');
 await expect(page.locator('[popover="manual"]')).toHaveCount(0);
 await picker.click();
 await search.press('Escape');
 await expect(picker).toBeFocused();
 await expect(picker).toHaveText('ZZ999');
 await expect(page.locator('[popover="manual"]')).toHaveCount(0);
}

for (const definition of atcForms) {
 test(`${definition.code} ATC fields share search, custom entry and empty-text handling`, async ({ page }) => {
  await seedWorkspace(page);
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${definition.code}?new=true`);
  await expect(page.getByRole('heading', { name: `BIR Form ${definition.code}`, exact: true })).toBeVisible();
  let exercised = 0;
  const standalone = await page.getByRole('combobox', { name: 'ATC', exact: true }).evaluateAll(elements => elements.map(element => element.id));
  for (const id of standalone) {
   await exercisePicker(page, page.locator(`[id="${id}"]`));
   exercised++;
  }
  for (const schedule of definition.schedules) {
   const atcs = schedule.rows[0].fields.filter(field => !field.readonly && /^(?:\d+\s+)?ATC$/.test(field.label));
   if (!atcs.length) continue;
   await openScheduleEditor(page, schedule.title);
   for (const field of atcs) {
    await exercisePicker(page, page.locator(`[id="${field.id}"]`));
    exercised++;
   }
   await page.getByRole('dialog', { name: 'New line item', exact: true }).getByRole('button', { name: 'Cancel', exact: true }).click();
   await expect(page.getByRole('dialog', { name: 'New line item', exact: true })).toBeHidden();
  }
  expect(exercised).toBeGreaterThan(0);
 });
}

for (const category of ['P', 'G']) {
 test(`legacy 1602 searches its ${category} source catalog`, async ({ page }) => {
  await seedWorkspace(page);
  await page.addInitScript(category => {
   const native = (window as any).__TAURI_INTERNALS__;
   const invoke = native.invoke;
   native.invoke = async (command: string, args: unknown) => {
    const result = await invoke(command, args);
    return command === 'list_taxpayer_profiles' ? result.map((profile: object) => ({ ...profile, category })) : result;
   };
  }, category);
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1602?new=true`);
  await expect(page.getByRole('heading', { name: 'BIR Form 1602', exact: true })).toBeVisible();
  await openScheduleEditor(page, getWithholdingDefinition('1602')!.schedules.find(schedule => schedule.rows[0].fields.some(field => field.label === 'ATC'))!.title);
  await page.getByRole('combobox', { name: 'ATC', exact: true }).first().click();
  const search = page.getByPlaceholder('Search code or income', { exact: true });
  await search.fill('WI161');
  await expect(page.getByRole('option', { name: /WI161/ })).toHaveCount(category === 'P' ? 1 : 0);
  await search.fill('WI440');
  await expect(page.getByRole('option', { name: /WI440/ })).toBeVisible();
  await search.fill('Not Applicable');
  await expect(page.getByRole('option', { name: /NA/ })).toBeVisible();
 });
}

test('revised 1602Q searches both descriptions for shared interest codes', async ({ page }) => {
 await seedWorkspace(page);
 await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1602Qv2018?new=true`);
 await expect(page.getByRole('heading', { name: 'BIR Form 1602Qv2018', exact: true })).toBeVisible();
 await openScheduleEditor(page, getWithholdingDefinition('1602Qv2018')!.schedules.find(schedule => schedule.rows[0].fields.some(field => field.label === 'ATC'))!.title);
 await page.getByRole('combobox', { name: 'ATC', exact: true }).first().click();
 await page.getByPlaceholder('Search code or income', { exact: true }).fill('deposit substitutes');
 await expect(page.getByRole('option', { name: /WI161/ })).toBeVisible();
 await expect(page.getByRole('option', { name: /WC161/ })).toBeVisible();
});
