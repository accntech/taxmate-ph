import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

test('saves a trade name and a PSIC chosen by activity description', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 960 });
	await seedWorkspace(page, 'light', 'loaded', { psicCode: '0001' });
	const editPath = `/ebirforms/taxpayers/${taxpayerId}/edit`;
	await page.goto(editPath);
	const tradeName = page.getByRole('textbox', { name: 'Trade name', exact: true });
	const psic = page.getByRole('combobox', { name: 'PSIC code', exact: true });
	await expect(tradeName).toBeVisible({ timeout: 15000 });
	await expect(psic).toContainText('0001');
	await page.evaluate(() => {
		const native = (window as any).__TAURI_INTERNALS__;
		const invoke = native.invoke;
		let saved: unknown;
		native.invoke = async (command: string, args: any) => {
			if (command === 'save_taxpayer_profile') saved = args.profile;
			if (command === 'list_taxpayer_profiles' && saved) return [saved];
			return invoke(command, args);
		};
	});

	await tradeName.fill('  Alex & Reyes Advisory  ');
	await expect(page.locator('footer[aria-label="Taxpayer actions"]')).toHaveCSS('position', 'sticky');
	await psic.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
	await psic.click();
	const search = page.getByPlaceholder('Search code or industry');
	await search.fill('retail sale via internet');
	const option = page.getByRole('option', { name: /47913.*retail sale via internet/i });
	await expect(option).toBeVisible();
	await option.click();
	await expect(psic).toContainText('47913');
	await page.getByRole('button', { name: 'Save profile', exact: true }).click();
	await expect(page).toHaveURL('/ebirforms/taxpayers');
	await page.locator(`a[href="${editPath}"]`).click();
	await expect(tradeName).toHaveValue('Alex & Reyes Advisory');
	await expect(psic).toContainText('47913');
});

test('shows PSOC only for profiles classified as Individual', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N', civilStatus: 'Single', psocCode: '0110' });
	const profilePath = `/ebirforms/taxpayers/${taxpayerId}`;
	await page.goto(profilePath);
	const personal = page.getByRole('region', { name: 'Personal details', exact: true });
	await expect(personal).toContainText('Single', { timeout: 15000 });
	await expect(personal).not.toContainText('Occupation code (PSOC)');
	await page.getByRole('link', { name: 'Edit profile', exact: true }).click();
	const classification = page.getByRole('combobox', { name: 'Tax classification', exact: true });
	const psoc = page.getByRole('combobox', { name: 'Occupation code (PSOC)', exact: true });
	await expect(classification).toHaveText('Non-individual');
	await expect(psoc).toHaveCount(0);
	await classification.click();
	await page.getByRole('option', { name: 'Individual', exact: true }).click();
	await expect(psoc).toContainText('0110');

	await page.goto(`${profilePath}/forms/1700?new=true`);
	const legacyPsoc = page.locator('[data-profile-key="psocCode"]');
	await expect(legacyPsoc).toContainText('Occupation code (PSOC)', { timeout: 15000 });
	await expect(legacyPsoc).not.toContainText('0110');
});

test('saves an optional taxpayer type only for an Individual profile', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' });
	const editPath = `/ebirforms/taxpayers/${taxpayerId}/edit`;
	await page.goto(editPath);
	const classification = page.getByRole('combobox', { name: 'Tax classification', exact: true });
	const taxpayerType = page.getByRole('combobox', { name: 'Taxpayer type', exact: true });
	await expect(classification).toHaveText('Non-individual', { timeout: 15000 });
	await expect(taxpayerType).toHaveCount(0);

	await page.evaluate(() => {
		const native = (window as any).__TAURI_INTERNALS__;
		const invoke = native.invoke;
		let saved: unknown;
		native.invoke = async (command: string, args: any) => {
			if (command === 'save_taxpayer_profile') saved = args.profile;
			if (command === 'list_taxpayer_profiles' && saved) return [saved];
			return invoke(command, args);
		};
	});

	await classification.click();
	await page.getByRole('option', { name: 'Individual', exact: true }).click();
	await expect(taxpayerType).toHaveText('Not specified');
	await taxpayerType.click();
	await expect(page.getByRole('option')).toHaveText(['Not specified', 'Single', 'Professional', 'Estate', 'Trust']);
	await page.getByRole('option', { name: 'Estate', exact: true }).click();
	await page.getByRole('button', { name: 'Save profile', exact: true }).click();
	await expect(page).toHaveURL('/ebirforms/taxpayers');

	const edit = page.locator(`a[href="${editPath}"]`);
	await edit.click();
	await expect(taxpayerType).toHaveText('Estate');
	await classification.click();
	await page.getByRole('option', { name: 'Non-individual', exact: true }).click();
	await expect(taxpayerType).toHaveCount(0);
	await page.getByRole('button', { name: 'Save profile', exact: true }).click();
	await expect(page).toHaveURL('/ebirforms/taxpayers');

	await edit.click();
	await classification.click();
	await page.getByRole('option', { name: 'Individual', exact: true }).click();
	await expect(taxpayerType).toHaveText('Not specified');
});

test('saves a packaged alphanumeric RDO from the taxpayer editor', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/edit`);
	const rdo = page.getByRole('textbox', { name: 'RDO code', exact: true });
	await rdo.fill('999');
	await page.getByRole('button', { name: 'Save profile', exact: true }).click();
	await expect(page.getByRole('alert')).toContainText('Profile not saved');
	await expect(rdo).toHaveAttribute('aria-invalid', 'true');
	await expect(page).toHaveURL(`/ebirforms/taxpayers/${taxpayerId}/edit`);
	await rdo.fill('17A');
	expect(await rdo.evaluate((input: HTMLInputElement) => input.validity.patternMismatch)).toBe(false);
	await page.getByRole('button', { name: 'Save profile', exact: true }).click();
	await expect(page).toHaveURL('/ebirforms/taxpayers');
});


test('preserves a legacy profile identity and its three-digit branch', async ({ page }) => {
 await seedWorkspace(page, 'light', 'loaded', { branchCode: '008' });
 await page.goto(`/ebirforms/taxpayers/${taxpayerId}/edit`);
 const tin = page.getByRole('textbox', { name: 'TIN and branch code', exact: true });
 await expect(tin).toHaveValue('001-234-567-008');
 await page.evaluate(() => {
  const native = (window as any).__TAURI_INTERNALS__;
  const invoke = native.invoke;
  native.invoke = async (command: string, args: any) => {
   if (command === 'save_taxpayer_profile') (window as any).__savedProfile = args.profile;
   return invoke(command, args);
  };
 });
 await page.getByRole('button', { name: 'Save profile', exact: true }).click();
 await expect(page).toHaveURL('/ebirforms/taxpayers');
 expect(await page.evaluate(() => (window as any).__savedProfile)).toMatchObject({ id: taxpayerId, branchCode: '008' });
});

test('saves a new taxpayer with all five branch digits', async ({ page }) => {
 await seedWorkspace(page, 'light', 'empty');
 await page.goto('/ebirforms/taxpayers/new');
 await page.evaluate(() => {
  const native = (window as any).__TAURI_INTERNALS__;
  const invoke = native.invoke;
  let saved: unknown;
  native.invoke = async (command: string, args: any) => {
   if (command === 'save_taxpayer_profile') saved = args.profile;
   if (command === 'list_taxpayer_profiles' && saved) return [saved];
   return invoke(command, args);
  };
 });
 await page.getByRole('textbox', { name: 'Taxpayer name', exact: true }).fill('Five Digit Taxpayer');
 const tin = page.getByRole('textbox', { name: 'TIN and branch code', exact: true });
 await tin.fill('00123456712345');
 await tin.blur();
 await expect(tin).toHaveValue('001-234-567-12345');
 await page.getByRole('textbox', { name: 'RDO code', exact: true }).fill('040');
 await page.getByRole('button', { name: 'Save profile', exact: true }).click();
 await expect(page).toHaveURL('/ebirforms/taxpayers');
 await expect(page.getByText('001-234-567-12345', { exact: true })).toBeVisible();
});

test('rejects a TIN change that would overwrite another taxpayer', async ({ page }) => {
 await seedWorkspace(page);
 await page.addInitScript(() => {
  const native = (window as any).__TAURI_INTERNALS__;
  const invoke = native.invoke;
  native.invoke = async (command: string, args: unknown) => {
   if (command === 'list_taxpayer_profiles') {
    const [profile] = await invoke(command, args);
    return [profile, { ...profile, id: '0022345670008', tin1: '002', taxpayerName: 'Second Taxpayer' }];
   }
   return invoke(command, args);
  };
 });

 await page.goto(`/ebirforms/taxpayers/${taxpayerId}/edit`);
 const tin = page.getByRole('textbox', { name: 'TIN and branch code', exact: true });
 await tin.focus();
 await tin.fill('00223456700008');
 await tin.blur();
 await expect(tin).toHaveValue('002-234-567-00008');
 await page.getByRole('button', { name: 'Save profile', exact: true }).click();

 await expect(tin).toHaveAttribute('aria-invalid', 'true');
 await expect(tin).toBeFocused();
 await expect(page.getByText('This TIN and branch code already belong to another taxpayer.')).toBeVisible();
 await expect(page).toHaveURL(`/ebirforms/taxpayers/${taxpayerId}/edit`);
});
