import { expect, test } from '@playwright/test';
import { formPath, seedWorkspace, taxpayerId } from './fixtures';

const taxpayersPath = '/ebirforms/taxpayers';
const profilePath = `${taxpayersPath}/${taxpayerId}`;
const formsPath = `${profilePath}/forms`;
const formName = 'BIR Form 1601EQ';
const missingProfilePath = `${taxpayersPath}/1111111110000`;

test('the taxpayer detail only displays the requested profile', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(missingProfilePath);
	await expect(page.getByRole('heading', { name: 'Taxpayer not found' })).toBeVisible({ timeout: 15_000 });
	await expect(page.getByText('Ready for forms')).toHaveCount(0);
	await expect(page.getByText('Example Services Corporation', { exact: true })).toHaveCount(0);
});

test('the taxpayer detail retries when the profile store cannot be read', async ({ page }) => {
	await seedWorkspace(page, 'light', 'error-once');
	await page.goto(profilePath);
	await expect(page.getByRole('heading', { name: 'Could not load taxpayer' })).toBeVisible({ timeout: 15_000 });
	await page.getByRole('button', { name: 'Retry', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Example Services Corporation' })).toBeVisible();
});

test('canceling profile correction resumes the exact unsaved return', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(formPath);
	const year = page.getByRole('textbox', { name: 'Year', exact: true });
	await expect(year).toHaveValue('2026', { timeout: 15_000 });
	await year.fill('2027');
	await year.blur();
	await page.getByRole('link', { name: 'Edit taxpayer information' }).click();
	await expect(page).toHaveURL(`${profilePath}/edit`);
	await page.getByRole('link', { name: 'Cancel', exact: true }).click();
	await expect(page).toHaveURL(formPath);
	await expect(year).toHaveValue('2027');
	await page.goBack();
	await expect(page).toHaveURL(formPath);
	await expect(year).toHaveValue('2027');
	const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!));
	expect(stored.returns[0].values['frm1601EQ:txtYear']).toBe('2026');
});

test('saving profile correction resumes the return with refreshed taxpayer fields', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {}, undefined, { persistProfile: true });
	await page.goto(`${formsPath}/1601EQ?new=true`);
	const year = page.getByRole('textbox', { name: 'Year', exact: true });
	await expect(year).toBeVisible({ timeout: 15_000 });
	await year.fill('2027');
	await year.blur();
	await page.getByRole('link', { name: 'Edit taxpayer information' }).click();
	await page.getByRole('textbox', { name: 'Taxpayer name', exact: true }).fill('Corrected taxpayer name');
	await page.getByRole('button', { name: 'Save profile', exact: true }).click();
	await expect(page).toHaveURL(`${formsPath}/1601EQ?new=true`);
	await expect(year).toHaveValue('2027');
	await expect(page.getByText('Corrected taxpayer name', { exact: true }).first()).toBeVisible();
	const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!));
	expect(stored.returns).toHaveLength(1);
});

test('a different taxpayer TIN does not replace the original identity in a suspended return', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {}, undefined, { persistProfile: true });
	await page.goto(formPath);
	const year = page.getByRole('textbox', { name: 'Year', exact: true });
	await expect(year).toHaveValue('2026', { timeout: 15_000 });
	await year.fill('2027');
	await year.blur();
	await page.getByRole('link', { name: 'Edit taxpayer information' }).click();
	await page.getByRole('textbox', { name: 'TIN and branch code' }).fill('0022345670008');
	await page.getByRole('textbox', { name: 'Taxpayer name', exact: true }).fill('Different taxpayer');
	await page.getByRole('button', { name: 'Save profile', exact: true }).click();
	await expect(page).toHaveURL(formPath);
	await expect(year).toHaveValue('2027');
	const information = page.getByRole('region', { name: 'Taxpayer information' });
	await expect(information).toContainText('Example Services Corporation');
	await expect(information).not.toContainText('Different taxpayer');
});

test('profile editing blocks navigation while saving', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(taxpayersPath);
	await page.getByRole('link', { name: 'Edit profile for Example Services Corporation' }).click({ timeout: 15_000 });
	const save = page.getByRole('button', { name: 'Save profile', exact: true });
	await expect(save).toBeVisible({ timeout: 15_000 });
	await page.evaluate(() => {
		const internals = Reflect.get(window, '__TAURI_INTERNALS__');
		const invoke = internals.invoke;
		internals.invoke = async (command: string, ...args: unknown[]) => {
			if (command === 'save_taxpayer_profile') await new Promise<void>(resolve => Reflect.set(window, 'releaseProfileSave', resolve));
			return invoke(command, ...args);
		};
	});
	await save.click();
	await expect(page.getByRole('button', { name: 'Saving…', exact: true })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeDisabled();
	await expect(page.getByText('Open forms', { exact: true })).toHaveAttribute('aria-disabled', 'true');
	await page.evaluate(() => history.back());
	await expect(page).toHaveURL(`${profilePath}/edit`);
	await expect(page.getByRole('status')).toContainText('Wait for the profile to finish saving');
	await page.evaluate(() => Reflect.get(window, 'releaseProfileSave')());
	await expect(page).toHaveURL(taxpayersPath);
});

test('return deletion cannot be dismissed after confirmation until it finishes', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {}, undefined, { uiAgent: true });
	await page.goto(formsPath);
	const actions = page.getByRole('button', { name: `More actions for ${formName}, 2026Q2` });
	await expect(actions).toBeVisible({ timeout: 15_000 });
	await page.evaluate(() => {
		const internals = Reflect.get(window, '__TAURI_INTERNALS__');
		const invoke = internals.invoke;
		internals.invoke = async (command: string, ...args: unknown[]) => {
			if (command === 'save_working_returns') await new Promise<void>(resolve => Reflect.set(window, 'releaseReturnDelete', resolve));
			return invoke(command, ...args);
		};
	});
	await actions.click();
	await page.getByRole('menuitem', { name: 'Delete…' }).click();
	const dialog = page.getByRole('dialog', { name: 'Delete return?' });
	await dialog.getByRole('button', { name: 'Delete return' }).click();
	await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeDisabled();
	await expect(dialog.getByRole('button', { name: 'Deleting…' })).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(dialog).toBeVisible();
	await page.evaluate(() => Reflect.get(window, 'releaseReturnDelete')());
	await expect(dialog).toBeHidden();
	await expect(page.getByRole('status')).toContainText('Saved form deleted');
});

test('return row Edit exposes the form and period to assistive technology', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(formsPath);
	await expect(page.getByRole('link', { name: `Edit ${formName}, 2026Q2` })).toBeVisible({ timeout: 15_000 });
});

test('return archive and undo announce the record outcome', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(formsPath);
	await page.getByRole('button', { name: `More actions for ${formName}, 2026Q2` }).click({ timeout: 15_000 });
	await page.getByRole('menuitem', { name: 'Archive', exact: true }).click();
	await expect(page.getByRole('status')).toContainText(`${formName}, 2026Q2 archived`);
	await page.getByRole('button', { name: 'Undo archive' }).click();
	await expect(page.getByRole('status')).toContainText(`${formName}, 2026Q2 restored`);
});
