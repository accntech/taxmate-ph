import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';
import type { CorporateField } from '../../src/lib/forms/corporate-income/types';

const id = (name: string) => `[id="frm1702RT:${name}"]`;

for (const code of ['1702RTv2018', '1702RTv2018C']) {
 test(`${code} displays each item number once across all pages`, async ({ page }, info) => {
  await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
  const editor = page.locator('.corporate-editor');
  await expect(editor).toBeVisible({ timeout: 20_000 });
  const totals = editor.getByRole('region', { name: 'Part II - Total Tax Payable' });
  await expect.soft(totals.locator('[data-corporate-item="14"] .value-label')).toHaveText('Tax Due');
  await expect(totals.locator('[data-corporate-item="16"] .value-label')).toContainText('(Item 14 Less Item 15)');

  for (const pageNumber of [1, 2, 3, 4]) {
   await goToReturnPage(page, pageNumber);
   const repeated = await editor.locator('.corporate-row > .paper-item-number').evaluateAll(numbers => numbers.flatMap(number => {
    const item = number.textContent?.trim().toUpperCase();
    const labels = Array.from(number.parentElement!.querySelectorAll('label, legend, .value-label, .amount-caption > span'));
    return labels.map(label => label.textContent?.trim() ?? '')
     .filter(label => label.split(/\s+/, 1)[0].toUpperCase() === item);
   }));
   expect.soft(repeated, `Page ${pageNumber} repeats item numbers in field labels`).toEqual([]);
   await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
   if (process.env.BIR_BACKGROUND_PREVIEWS === '1') {
    for (const [device, width] of [['desktop', 1280], ['narrow', 390]] as const) {
     await page.setViewportSize({ width, height: 900 });
     await editor.screenshot({ path: info.outputPath(`${code}-page-${pageNumber}-${device}.png`), animations: 'disabled',
      style: '.eq-action-bar { position: static; }' });
    }
   }
  }
 });
}

test('legacy 1702RT cover aligns item labels and displays each item number once', async ({ page }, info) => {
 await seedWorkspace(page, 'light', 'loaded', {
  taxpayerClassification: 'N', lineOfBusiness: 'Accounting services', psicCode: '69200'
 }, []);
 await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702RT?new=true`);

 const background = page.getByRole('region', { name: /Part I - Background Information/ });
 const totals = page.getByRole('region', { name: /Part II - Total Tax Payable/ });
 await expect(totals).toBeVisible({ timeout: 15_000 });
 const row = (section: typeof background, item: number) => section.locator(`[data-corporate-item="${item}"]`);
 const labelOffset = async (section: typeof background, item: number, selector = '.value-label') => row(section, item).evaluate((element, selector) => {
  const number = element.querySelector('.paper-item-number')!.getBoundingClientRect();
  const label = element.querySelector(selector)!;
  const text = document.createRange();
  text.selectNodeContents(label);
  return text.getBoundingClientRect().left - number.left;
 }, selector);

 for (const [device, width] of [['desktop', 1440], ['narrow', 390]] as const) {
  await page.setViewportSize({ width, height: 1000 });
  await expect(row(totals, 16).locator('.value-label')).toHaveText('Total Income Tax Due (Overpayment)');
  await expect(row(totals, 18).locator('.value-label')).toHaveText(/\(Item 16 Less than Item 17\)$/);
  for (const item of [16, 17, 18, 19, 20]) {
   await expect(row(totals, item).locator('.paper-item-number')).toHaveText(String(item));
   await expect(row(totals, item).locator('.value-label')).not.toHaveText(new RegExp(`^${item}\\s+`));
  }
  const offset = await labelOffset(background, 9);
  for (const item of [10, 11, 12, 13, 14]) {
   expect(await labelOffset(background, item)).toBeCloseTo(offset, 0);
  }
  expect(await labelOffset(totals, 16, '.schedule-reference')).toBeCloseTo(offset, 0);
  const visibleTotalLabel = device === 'desktop' ? '.amount-caption > span' : '.value-label';
  expect(await labelOffset(totals, 16, visibleTotalLabel)).toBeCloseTo(offset, 0);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  const screenshot = { animations: 'disabled', style: '.eq-action-bar { position: static; }' } as const;
  await background.screenshot({ ...screenshot, path: info.outputPath(`1702rt-background-${device}.png`) });
  await totals.screenshot({ ...screenshot, path: info.outputPath(`1702rt-totals-${device}.png`) });
 }

 await row(totals, 16).getByRole('button', { name: 'From Part IV, Item 44' }).click();
 const computation = page.getByRole('region', { name: /Part IV - Computation of Tax/ });
 await expect(row(computation, 44).locator('.value-label')).toHaveText(/^Total Income Tax Due/);
 for (const [device, width] of [['desktop', 1440], ['narrow', 390]] as const) {
  await page.setViewportSize({ width, height: 1000 });
  await row(computation, 44).screenshot({ path: info.outputPath(`1702rt-item-44-${device}.png`), animations: 'disabled' });
 }
});

test('legacy 1702RT share classes save as independent radio selections', async ({ page }, info) => {
 const formCode = '1702RT';
 const draftId = 'share-class-draft';
 const formsPath = `/ebirforms/taxpayers/${taxpayerId}/forms`;
 await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, [{
  id: draftId, taxpayerId, formCode, returnPeriod: '2025-12', status: 'Draft', updatedAt: 1794441600000, finalFlag: '0',
  values: { 'frm1702RT:ddlPg8Sc12I10C2': 'PS' }
 }]);
 await page.setViewportSize({ width: 1440, height: 1000 });
 await page.goto(`${formsPath}/${formCode}?return=${draftId}`);
 await goToReturnPage(page, 8);
 await expect(page.getByRole('heading', { name: /^Real properties subject to final tax/ })).toBeVisible();

 const shareClassA = page.getByRole('radiogroup', { name: 'A Share class', exact: true });
 const shareClassB = page.getByRole('radiogroup', { name: 'B Share class', exact: true });
 const preferred = (group: typeof shareClassA) => group.getByRole('radio', { name: 'Preferred shares', exact: true });
 const common = (group: typeof shareClassA) => group.getByRole('radio', { name: 'Common shares', exact: true });
 await expect(shareClassA.getByRole('radio', { checked: true })).toHaveCount(0);
 await expect(preferred(shareClassB)).toBeChecked();
 await common(shareClassA).check();
 await expect(preferred(shareClassB)).toBeChecked();
 await common(shareClassA).press('ArrowLeft');
 await expect(preferred(shareClassA)).toBeChecked();
 await common(shareClassB).check();
 await expect(preferred(shareClassA)).toBeChecked();
 await expect(preferred(shareClassB)).not.toBeChecked();

 for (const [device, width] of [['desktop', 1440], ['narrow', 390]] as const) {
  await page.setViewportSize({ width, height: 1000 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  await shareClassA.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.screenshot({ path: info.outputPath(`1702rt-share-classes-${device}.png`), animations: 'disabled' });
 }
 await page.getByRole('button', { name: 'Save draft', exact: true }).click();
 await page.getByRole('link', { name: 'Edit', exact: true }).click();
 await goToReturnPage(page, 8);
 await expect(preferred(shareClassA)).toBeChecked();
 await expect(common(shareClassB)).toBeChecked();
});

test('legacy 1702RT Schedule 7 keeps item 10 on one numbered row', async ({ page }, info) => {
 const draftId = 'other-tax-credit-draft';
 await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, [{
  id: draftId, taxpayerId, formCode: '1702RT', returnPeriod: '2025-12', status: 'Draft',
  updatedAt: 1794441600000, finalFlag: '0',
  values: {
   'frm1702RT:txtPg6Sc7I10C1': 'Other tax payment',
   'frm1702RT:txtPg5Sc7I10C2': '1250'
  }
 }]);
 await page.setViewportSize({ width: 1440, height: 1000 });
 await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702RT?return=${draftId}`);
 await goToReturnPage(page, 6);

 const schedule = page.getByRole('region', { name: /^Schedule 7 - Tax Credits/ });
 const item = schedule.locator('[data-corporate-item="10"]');
 await expect(item).toHaveCount(1);
 await expect(item.getByText('10', { exact: true })).toHaveCount(1);
 const description = item.getByRole('textbox', { name: 'Description', exact: true });
 const amount = item.getByRole('textbox', { name: 'Amount', exact: true });
 await expect(description).toHaveValue('Other tax payment');
 await expect(amount).toHaveValue('1,250');
 const item9Amount = schedule.locator(id('txtPg6Sc7I9SpecialTaxCredits'));

 const descriptionBox = (await description.boundingBox())!;
 const amountBox = (await amount.boundingBox())!;
 const item9Box = (await item9Amount.boundingBox())!;
 expect(descriptionBox.x + descriptionBox.width).toBeLessThan(amountBox.x);
 expect(Math.abs(descriptionBox.y - amountBox.y)).toBeLessThan(1);
 expect(Math.abs(amountBox.x - item9Box.x)).toBeLessThan(1);
 expect(Math.abs(amountBox.width - item9Box.width)).toBeLessThan(1);
 await description.press('Tab');
 await expect(amount).toBeFocused();
 await amount.fill('2500');
 await amount.press('Tab');
 await expect(schedule.locator(id('txtPg6Sc7I12TotalTaxCredits'))).toHaveText('2,500');

 for (const [device, width] of [['desktop', 1440], ['narrow', 390]] as const) {
  await page.setViewportSize({ width, height: 1000 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  if (device === 'narrow') {
   const narrowDescription = (await description.boundingBox())!;
   const narrowAmount = (await amount.boundingBox())!;
   expect(narrowAmount.y).toBeGreaterThan(narrowDescription.y + narrowDescription.height);
  }
  await item.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.screenshot({ path: info.outputPath(`1702rt-schedule-7-item-10-${device}.png`), animations: 'disabled' });
 }

 await page.setViewportSize({ width: 1440, height: 1000 });
 await page.getByRole('button', { name: 'Save draft', exact: true }).click();
 await page.getByRole('link', { name: 'Edit', exact: true }).click();
 await goToReturnPage(page, 6);
 await expect(description).toHaveValue('Other tax payment');
 await expect(amount).toHaveValue('2,500');
});

test('legacy 1702RT Schedule 12 aligns income amounts and labels narrow fields', async ({ page }, info) => {
 const formsPath = `/ebirforms/taxpayers/${taxpayerId}/forms`;
 await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
 await page.setViewportSize({ width: 1440, height: 1000 });
 await page.goto(`${formsPath}/1702RT?new=true`);
 await goToReturnPage(page, 8);

 const schedule = page.getByRole('region', { name: /^Schedule 12 - Supplemental Information/ });
 const headers = schedule.locator('.supplemental-headers');
 const topics = ['Interests', 'Royalties', 'Dividends'];
 const amounts = ['Exempt', 'Actual amount/fair market value/net capital gains', 'Final tax withheld/paid'];
 await expect(headers).toBeVisible();
 await expect(headers.getByText(amounts[1], { exact: true })).toBeVisible();
 for (const [index, topic] of topics.entries()) {
  const row = schedule.locator(`[data-corporate-item="${index + 1}"]`);
  const number = (await row.locator('.paper-item-number').boundingBox())!;
  const caption = (await row.getByText(topic, { exact: true }).boundingBox())!;
  expect(Math.abs(number.y + number.height / 2 - caption.y - caption.height / 2)).toBeLessThan(2);
  for (const amount of amounts) {
   const input = row.getByRole('textbox', { name: `${topic} · ${amount}`, exact: true });
   const box = (await input.boundingBox())!;
   const fieldLeft = await input.evaluate(element => element.closest('[data-slot="currency-input"]')!.getBoundingClientRect().left);
   const header = (await headers.getByText(amount, { exact: true }).boundingBox())!;
   expect(Math.abs(box.y + box.height / 2 - caption.y - caption.height / 2)).toBeLessThan(2);
   expect(Math.abs(fieldLeft - header.x)).toBeLessThan(3);
  }
 }

 const interestTax = schedule.getByRole('textbox', { name: 'Interests · Final tax withheld/paid', exact: true });
 await interestTax.fill('250');
 await interestTax.press('Tab');
 await expect(schedule.getByRole('textbox', { name: 'Royalties · Exempt', exact: true })).toBeFocused();
 await expect(schedule.locator(id('txtSc12I19TotalFinalTaxWitheld'))).toHaveText('250');
 const prizes = schedule.locator('.line-list').filter({ has: page.getByRole('heading', { name: /^Prizes and winnings subject to final withholding/ }) });
 const addPrize = prizes.getByRole('button', { name: 'Add item' });
 await addPrize.click();
 const dialog = page.getByRole('dialog');
 for (const amount of amounts) await expect(dialog.getByRole('textbox', { name: amount, exact: true })).toBeVisible();
 await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
 await expect(addPrize).toBeFocused();

 for (const [device, width] of [['desktop', 1440], ['narrow', 390]] as const) {
  await page.setViewportSize({ width, height: 1000 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  if (device === 'narrow') {
   await expect(headers).toBeHidden();
   const interest = schedule.locator('[data-corporate-item="1"]');
   await expect(interest.getByText('Interests', { exact: true })).toBeVisible();
   let previousY = 0;
   for (const amount of amounts) {
    const label = interest.getByText(amount, { exact: true });
    await expect(label).toBeVisible();
    const box = (await label.boundingBox())!;
    expect(box.height).toBeGreaterThan(1);
    expect(box.y).toBeGreaterThan(previousY);
    previousY = box.y;
   }
  }
  await schedule.getByRole('heading', { level: 3 }).evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.screenshot({ path: info.outputPath(`1702rt-schedule-12-${device}.png`), animations: 'disabled' });
 }
 await expect(interestTax).toHaveValue('250');
});

test('corporate return pagination survives reload and resets on a fresh open', async ({ page }, info) => {
 const formCode = '1702RTv2018C';
 const draftId = 'pagination-draft';
 const formsPath = `/ebirforms/taxpayers/${taxpayerId}/forms`;
 await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, [{
  id: draftId, taxpayerId, formCode, returnPeriod: '2025-12', status: 'Draft',
  updatedAt: 1794441600000, finalFlag: '0', values: {}
 }]);
 const pager = page.getByRole('navigation', { name: 'Return pages' });
 const current = pager.locator('[aria-current="page"]');
 const edit = page.getByRole('link', { name: 'Edit', exact: true });
 const back = page.getByRole('link', { name: '← Back to forms', exact: true });

 await page.goto(formsPath);
 await edit.click();
 await expect(current).toHaveText('1');
 await goToReturnPage(page, 2);
 await page.reload();
 await expect(current).toHaveText('2');
 await pager.screenshot({ path: info.outputPath('corporate-pagination-after-reload.png') });
 await goToReturnPage(page, 1);
 await page.reload();
 await expect(current).toHaveText('1');
 await goToReturnPage(page, 2);

 await back.click();
 await edit.click();
 await expect(current).toHaveText('1');
 await goToReturnPage(page, 2);
 await back.click();
 await page.getByRole('button', { name: 'Create return', exact: true }).click();
 await page.getByRole('combobox', { name: 'Search BIR forms' }).fill(formCode);
 await page.getByRole('option', { name: /^BIR Form 1702RTv2018C\b/ }).click();
 await expect(current).toHaveText('1');
 await goToReturnPage(page, 2);
 await page.reload();
 await expect(current).toHaveText('2');

 await page.goto(`${formsPath}/${formCode}?return=${draftId}&page=99`);
 await expect(current).toHaveText('1');
});

test('regular CREATE details save, reopen and switch deductions at desktop and narrow widths', async ({ page }, info) => {
 await page.setViewportSize({ width: 1440, height: 1000 });
 await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
 await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702RTv2018C?new=true`);
 await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 20_000 });
 await page.locator(id('rdoPg1Pt1I13ItemizedDeduction')).check();
 await goToReturnPage(page, 2);
 await page.locator(id('txtPg2Pt4I27Sales')).fill('1000000');
 await page.locator(id('Pg2Pt4I40IncomeTaxRate')).fill('25');
 await page.locator(id('Pg2Pt4I40IncomeTaxRate')).blur();
 await goToReturnPage(page, 3);
 const group = page.locator('.line-list').filter({ has: page.getByRole('heading', { name: 'Other ordinary allowable deductions', exact: true }) });
 const addDeduction = group.getByRole('button', { name: 'Add deduction', exact: true });
 await expect(addDeduction).toBeVisible();
 await expect(page.getByRole('heading', { name: '17 Others (Deductions Subject to Withholding Tax and Other Expenses)', exact: true })).toBeVisible();
 for (const [item, name] of [['17a', 'Janitorial and Messengerial Services'], ['17b', 'Professional Fees'], ['17c', 'Security Services']] as const) {
  const row = page.locator(`[data-corporate-item="${item}"]`);
  await expect(row.locator('.paper-item-number')).toHaveText(item.toUpperCase());
  await expect(row.getByRole('textbox', { name, exact: true })).toBeVisible();
  expect(await row.evaluate(element => {
   const item = element.querySelector('.paper-item-number')!.getBoundingClientRect();
   const amount = element.querySelector('input')!.getBoundingClientRect();
   return Math.abs(item.y + item.height / 2 - amount.y - amount.height / 2);
  })).toBeLessThanOrEqual(2);
 }
 await expect(page.locator(id('txtPg3Sc1I17iC1'))).toHaveCount(0);
 await expect(group.getByText('No deductions added', { exact: true })).toBeVisible();
 await group.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
 await page.screenshot({ path: info.outputPath('regular-deductions-empty.png'), animations: 'disabled' });
 for (const [description, amount] of [['POSTAGE', '1000'], ['STATIONERY', '2000']] as const) {
  await addDeduction.click();
  const dialog = page.getByRole('dialog', { name: 'Add deduction' });
  await dialog.getByRole('textbox', { name: 'Description', exact: true }).fill(description);
  await dialog.getByRole('textbox', { name: 'Amount', exact: true }).fill(amount);
  await dialog.getByRole('button', { name: 'Add deduction', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(addDeduction).toBeFocused();
 }
 await expect(page.locator(id('txtPg3Sc1I18TotalOrdinaryAllowable'))).toHaveText('3,000');
 for (const [device, width] of [['desktop', 1440], ['narrow', 390]] as const) {
  await page.setViewportSize({ width, height: 1000 });
  if (width === 390 && await page.locator('aside.sidebar').getAttribute('data-mobile-open') === 'true') {
   await page.getByRole('button', { name: 'Toggle sidebar', exact: true }).click();
  }
  await group.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  await page.screenshot({ path: info.outputPath(`regular-detailed-deductions-${device}.png`), animations: 'disabled' });
 }
 await page.getByRole('button', { name: 'Save draft', exact: true }).click();
 await page.getByRole('link', { name: 'Edit', exact: true }).click();
 await goToReturnPage(page, 3);
 const deductions = page.getByRole('list', { name: 'Other ordinary allowable deductions line items' });
 await expect(deductions.getByText('STATIONERY')).toBeVisible();
 await expect(deductions.getByRole('listitem').filter({ hasText: 'STATIONERY' }).getByText('17E', { exact: true })).toBeVisible();
 await expect(deductions.getByText('2,000', { exact: true })).toBeVisible();
 await deductions.getByRole('button', { name: 'POSTAGE', exact: true }).click();
 await page.getByRole('dialog').getByRole('button', { name: 'Delete item', exact: true }).click();
 await expect(page.getByRole('dialog')).toBeHidden();
 await expect(deductions.getByRole('listitem')).toHaveCount(1);
 await expect(deductions.getByText('STATIONERY')).toBeVisible();
 await expect(page.locator(id('txtPg3Sc1I18TotalOrdinaryAllowable'))).toHaveText('2,000');
 await goToReturnPage(page, 1);
 await page.locator(id('rdoPg1Pt1I13ItemizedDeduction-frm1702RT:rdoPg1Pt1I13OptionalStandard')).check();
 await goToReturnPage(page, 2);
 await expect(page.locator(id('txtPg2Pt4I38OptionalStandard'))).toHaveText('400,000');
 await expect(page.locator(id('txtPg2Pt4I34OrdinaryAllowable'))).toHaveText('0');
});

test('regular deductions preserve a saved 17i when adding a continuation', async ({ page }) => {
 const formCode = '1702RTv2018';
 const draftId = 'direct-deduction-draft';
 const prefix = 'frm1702RT:txtPg3Sc1I17';
 await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, [{
  id: draftId, taxpayerId, formCode, returnPeriod: '2025-12', status: 'Draft', updatedAt: 1794441600000, finalFlag: '0',
  values: {
   'frm1702RT:rdoPg1Pt1I13ItemizedDeduction': 'frm1702RT:rdoPg1Pt1I13ItemizedDeduction',
   ...Object.fromEntries(['d', 'e', 'f', 'g', 'h'].flatMap(letter => [
    [`${prefix}${letter}C1`, `Fixed deduction ${letter}`],
    [`${prefix}${letter}C2`, '100']
   ])),
   [`${prefix}iC1`]: 'Saved postage',
   [`${prefix}iC2`]: '200'
  }
 }]);
 await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${formCode}?return=${draftId}`);
 await goToReturnPage(page, 3);
 const deductions = page.getByRole('list', { name: 'Other ordinary allowable deductions line items' });
 const add = page.getByRole('button', { name: 'Add deduction', exact: true });
 const dialog = page.getByRole('dialog', { name: 'Add deduction' });
 const total = page.locator(id('txtPg3Sc1I18TotalOrdinaryAllowable'));
 await expect(deductions.getByRole('listitem').filter({ hasText: 'Saved postage' }).getByText('17I', { exact: true })).toBeVisible();
 await expect(deductions.getByRole('listitem')).toHaveCount(6);
 await expect(total).toHaveText('700');
 await add.click();
 await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
 await expect(add).toBeFocused();
 await expect(total).toHaveText('700');
 await add.click();
 await dialog.getByRole('textbox', { name: 'Description', exact: true }).fill('Courier supplies');
 await dialog.getByRole('textbox', { name: 'Amount', exact: true }).fill('300');
 await dialog.getByRole('button', { name: 'Add deduction', exact: true }).click();
 await expect(deductions.getByRole('listitem')).toHaveCount(7);
 await expect(deductions.getByRole('listitem').filter({ hasText: 'Saved postage' }).getByText('17I.1', { exact: true })).toBeVisible();
 await expect(deductions.getByRole('listitem').filter({ hasText: 'Courier supplies' }).getByText('17I.2', { exact: true })).toBeVisible();
 await expect(page.locator(id('txtPg3Sc1I17iC1'))).toHaveCount(0);
 await expect(total).toHaveText('1,000');
});

test('regular CREATE native print binds populated amounts, two-digit year and detailed continuation', async ({ page, context }, info) => {
 await page.route('**/__regular-paper', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html>' }));
 await page.goto('/__regular-paper');
 const result = await page.evaluate(async () => {
  const base = '/src/lib';
  const { getFormDefinition } = await import(`${base}/forms/index.ts`);
  const { createInitialFormValues } = await import(`${base}/ebirforms/ebirforms-workspace.svelte.ts`);
  const { getReturnExportValues } = await import(`${base}/forms/form-runtime.ts`);
  const { buildReturnReport } = await import(`${base}/printing/return-report.ts`);
  const { corporateFields, getCorporateIncomeForm } = await import(`${base}/forms/corporate-income/index.ts`);
  const profile = { id: '00123456700008', tin1: '001', tin2: '234', tin3: '567', branchCode: '00008', rdoCode: '047', taxpayerName: 'SAMPLE LEDGER CORPORATION', address: '42 Narra Street', address2: 'Test City', zipCode: '1000', contactNumber: '0285550148', email: 'corp@example.test', taxpayerClassification: 'N', category: 'P' };
  const values = getReturnExportValues('1702RTv2018C', { ...createInitialFormValues(profile, '1702RTv2018C'),
   'frm1702RT:txtPg1I2Year':'2025', 'frm1702RT:txtPg1Pt1I10':'01/01/2010',
   'frm1702RT:rdoPg1Pt1I13ItemizedDeduction':'frm1702RT:rdoPg1Pt1I13ItemizedDeduction',
   'frm1702RT:txtPg2Pt4I27Sales':'1000000', 'frm1702RT:txtPg2Pt4I30LessCost':'200000',
   'frm1702RT:Pg2Pt4I40IncomeTaxRate':'25', 'frm1702RT:txtPg2Pt4I44ExcessCredits':'500', 'frm1702RT:txtPg1Pt2I17Surcharge':'1000',
   'frm1702RT:txtPg3Sc1I17iCtrModal':'2', 'frm1702RT:txtPg3Sc1I17i.1C1':'POSTAGE', 'frm1702RT:txtPg3Sc1I17i.1C2':'1000',
   'frm1702RT:txtPg3Sc1I17i.2C1':'STATIONERY', 'frm1702RT:txtPg3Sc1I17i.2C2':'1000'
  });
  const form = getCorporateIncomeForm('1702RTv2018C');
  const fields: CorporateField[] = corporateFields(form);
  const ids = fields.flatMap(field => [field.id, ...(field.options ?? []).map(option => option.value)]);
  return { html: await buildReturnReport(getFormDefinition('1702RTv2018C'), values, 'Draft', 'legal'), ids };
 });
 const paper = await context.newPage();
 await paper.setContent(result.html.replaceAll('__EBIRFORMS_PRINT_SOURCE_URL__', 'file:///corporate-return-preview.html'));
 await paper.emulateMedia({ media: 'print' });
 await expect(paper.locator('.withholding-print-page')).toHaveCount(5);
 const content = async (name: string) => paper.locator(`[data-corporate-field="frm1702RT:${name}"]`).first().evaluate(element => element instanceof HTMLInputElement ? element.value : element.textContent);
 expect(await content('txtPg1I2Year')).toBe('25');
 expect(await content('txtPg2Pt4I41IncomeTaxDue')).toBe('199,500');
 expect(await content('txtPg1Pt2I21TotalAmount')).toBe('200,000');
 expect(await paper.locator('.original-continuation').innerText()).toContain('POSTAGE');
 expect(await paper.locator('.original-continuation').innerText()).toContain('STATIONERY');
 const missing = await paper.locator('[data-corporate-field]').evaluateAll((elements, ids) => elements
  .map(element => element.getAttribute('data-corporate-field')!).filter(id => !ids.includes(id)), result.ids);
 expect([...new Set(missing)]).toEqual([]);
 await paper.screenshot({ path: info.outputPath('regular-native-print.png'), fullPage: true });
 const pdf = await paper.pdf({ path: info.outputPath('regular-create-populated.pdf'), preferCSSPageSize: true, printBackground: true });
 const text = execFileSync('pdftotext', ['-layout','-','-'], { input: pdf }).toString();
 const geometry = execFileSync('pdfinfo', ['-'], { input: pdf }).toString();
 expect(geometry).toMatch(/^Pages:\s+5$/m);
 expect(text).toContain('200,000');
 expect(text).toContain('199,500');
 expect(text).toContain('POSTAGE');
 expect(text).not.toContain('202025');
 execFileSync('pdftoppm', ['-f','1','-l','2','-scale-to','1400','-png',info.outputPath('regular-create-populated.pdf'),info.outputPath('regular-page')]);
});
