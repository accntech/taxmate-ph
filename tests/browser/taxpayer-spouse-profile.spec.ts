import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { seedWorkspace, taxpayerId } from './fixtures';

test('waits for Individual tax classification on a new married taxpayer', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto('/ebirforms/taxpayers/new');
	const classification = page.getByRole('combobox', { name: 'Tax classification', exact: true });
	const spouse = page.getByRole('group', { name: 'Spouse details', exact: true });
	await page.getByRole('combobox', { name: 'Civil status', exact: true }).click({ timeout: 15000 });
	await page.getByRole('option', { name: 'Married', exact: true }).click();
	await expect(spouse).toHaveCount(0);
	await classification.click();
	await page.getByRole('option', { name: 'Individual', exact: true }).click();
	await expect(spouse.getByRole('textbox', { name: 'Spouse name', exact: true })).toBeVisible();
});

test('shows spouse details only when tax classification is Individual', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {
		taxpayerClassification: 'N',
		civilStatus: 'Married',
		spouse: { taxpayerName: 'Reyes, Cameron' }
	});
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/edit`);
	const classification = page.getByRole('combobox', { name: 'Tax classification', exact: true });
	const spouse = page.getByRole('group', { name: 'Spouse details', exact: true });
	await expect(classification).toHaveText('Non-individual', { timeout: 15000 });
	await expect(spouse).toHaveCount(0);

	await classification.click();
	await page.getByRole('option', { name: 'Individual', exact: true }).click();
	await expect(spouse.getByRole('textbox', { name: 'Spouse name', exact: true })).toHaveValue('Reyes, Cameron');
	await spouse.getByRole('textbox', { name: 'Spouse TIN and branch code' }).fill('123');

	await classification.click();
	await page.getByRole('option', { name: 'Non-individual', exact: true }).click();
	await expect(spouse).toHaveCount(0);
	await page.evaluate(() => {
		const native = (window as any).__TAURI_INTERNALS__;
		const invoke = native.invoke;
		native.invoke = async (command: string, args: any) => {
			if (command === 'save_taxpayer_profile') {
				localStorage.setItem('test-saved-spouse', JSON.stringify(args.profile.spouse));
			}
			return invoke(command, args);
		};
	});
	await page.getByRole('button', { name: 'Save profile', exact: true }).click();
	await expect(page).toHaveURL('/ebirforms/taxpayers');
	const savedSpouse = await page.evaluate(() => localStorage.getItem('test-saved-spouse'));
	expect(savedSpouse && JSON.parse(savedSpouse)).toEqual({ taxpayerName: 'Reyes, Cameron' });
});

test('shows optionally saved spouse information in both taxpayer profile pages', async ({ page }) => {
	test.setTimeout(60000);
	await seedWorkspace(page, 'light', 'loaded', { psocCode: '0123', taxpayerClassification: 'I' });
	await page.addInitScript(() => {
		const native = (window as any).__TAURI_INTERNALS__;
		const invoke = native.invoke;
		native.invoke = async (command: string, args: any) => {
			if (command === 'save_taxpayer_profile') {
				localStorage.setItem('test-taxpayer-spouse-profile', JSON.stringify(args.profile));
				return { profile: args.profile, path: 'test-profile.xml' };
			}
			if (command === 'list_taxpayer_profiles') {
				const saved = localStorage.getItem('test-taxpayer-spouse-profile');
				if (saved) return [JSON.parse(saved)];
			}
			return invoke(command, args);
		};
	});
	const profilePath = `/ebirforms/taxpayers/${taxpayerId}`;
	await page.goto(`${profilePath}/edit`);
	const psoc = page.getByRole('combobox', { name: 'Occupation code (PSOC)', exact: true });
	const search = page.getByPlaceholder('Search code or occupation');
	await expect(psoc).toBeVisible({ timeout: 12000 });
	await expect(psoc).toContainText('0123');
	await psoc.click();
	await search.fill('account');
	const accountant = page.getByRole('option', { name: /^2411 Accountants$/i });
	await expect(accountant).toBeVisible();
	const output = process.env.INCOME_PREVIEW_DIR;
	if (output) {
		mkdirSync(output, { recursive: true });
		await page.screenshot({ animations: 'disabled', path: resolve(output, 'taxpayer-profile-psoc-search.png') });
	}
	await search.press('Enter');
	await expect(psoc).toContainText('2411');
	await psoc.press('Enter');
	await search.fill('not specified');
	const noOccupation = page.getByRole('option', { name: 'Not specified', exact: true });
	await expect(noOccupation).toHaveAttribute('aria-posinset', '1');
	await noOccupation.dispatchEvent('click');
	await expect(psoc).toContainText('Choose occupation');
	await psoc.click();
	await search.fill('0110');
	await expect(page.getByRole('option', { name: /0110.*Armed forces/i })).toBeVisible();
	await search.press('Enter');
	await expect(psoc).toContainText('0110');
	if (output) {
		const details = page.getByRole('group', { name: 'Personal details', exact: true });
		await details.evaluate(node => node.scrollIntoView({ block: 'center' }));
		await details.screenshot({ path: resolve(output, 'taxpayer-profile-psoc.png') });
	}
	await page.getByRole('combobox', { name: 'Civil status', exact: true }).click({ timeout: 20000 });
	await page.getByRole('option', { name: 'Married', exact: true }).press('Enter');
	await page.getByRole('textbox', { name: 'Citizenship', exact: true }).fill('Filipino');
	const spouse = page.getByRole('group', { name: 'Spouse details', exact: true });
	await spouse.getByRole('textbox', { name: 'Spouse name', exact: true }).fill('Reyes, Cameron');
	const spouseBirthDate = spouse.locator('[data-slot="date-input"]');
	await spouseBirthDate.getByRole('spinbutton', { name: 'Month', exact: true }).fill('06');
	await spouseBirthDate.getByRole('spinbutton', { name: 'Day', exact: true }).fill('15');
	await spouseBirthDate.getByRole('spinbutton', { name: 'Year', exact: true }).fill('1991');
	const tin = spouse.getByRole('textbox', { name: 'Spouse TIN and branch code' });
	const rdo = spouse.getByRole('textbox', { name: 'Spouse RDO code' });
	await tin.fill('123');
	await page.getByRole('button', { name: 'Save profile', exact: true }).click();
	await expect(tin).toBeFocused();
	await expect(tin).toHaveAttribute('aria-invalid', 'true');
	await tin.fill('12345678900001');
	await rdo.fill('040');
	await expect(tin).toHaveValue('123-456-789-00001');
	await spouse.getByRole('textbox', { name: 'Spouse email', exact: true }).fill('Cameron@example.test');

	await page.setViewportSize({ width: 1280, height: 920 });
	expect(Math.abs((await tin.boundingBox())!.y - (await rdo.boundingBox())!.y)).toBeLessThan(2);
	await page.setViewportSize({ width: 390, height: 900 });
	await expect(page.getByRole('complementary', { name: 'Primary' })).not.toBeInViewport();
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	await page.getByRole('button', { name: 'Save profile', exact: true }).click();
	await expect(page).toHaveURL('/ebirforms/taxpayers');

	await page.goto(profilePath);
	const savedSpouse = page.getByRole('region', { name: 'Spouse details', exact: true });
	await expect(savedSpouse).toContainText('Reyes, Cameron');
	const personal = page.getByRole('region', { name: 'Personal details', exact: true });
	await expect(personal).toContainText('Occupation code (PSOC)');
	await expect(personal).toContainText(/0110.*Armed Forces/i);
	await expect(savedSpouse).toContainText('123-456-789-00001');
	await expect(savedSpouse).toContainText('cameron@example.test');

	await page.getByRole('link', { name: 'Edit profile', exact: true }).click();
	await expect(spouse.getByRole('textbox', { name: 'Spouse name', exact: true })).toHaveValue('Reyes, Cameron');
	await expect(psoc).toContainText('0110');
	await expect(spouseBirthDate.getByRole('spinbutton', { name: 'Year', exact: true })).toHaveValue('1991');
	await expect(page.getByRole('combobox', { name: 'Civil status', exact: true })).toHaveText('Married');
	await expect(page.getByRole('textbox', { name: 'Citizenship', exact: true })).toHaveValue('Filipino');
});
