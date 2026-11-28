import { expect, test, type Locator } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';
import { printSavedReturn } from './helpers/return-pdf';

const code = '1702EX';
const base = `/ebirforms/taxpayers/${taxpayerId}/forms`;
const description = (suffix: string) => `frm1702EX:txtPg7Sc10I2DescriptionofProperty${suffix}`;

function propertyField(drawer: Locator, suffix: string) {
	return drawer.locator(`[id="${description(suffix)}"]`);
}

test('1702EX adds the first exempt property to a printable continuation', async ({ page }, info) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N', branchCode: '01234' }, []);
	await page.goto(`${base}/${code}?new=true`);
	await goToReturnPage(page, 7);

	const add = page.getByRole('heading', { name: /^Exempt properties received \(/ })
		.locator('xpath=../..').getByRole('button', { name: 'Add item', exact: true });
	await add.click();
	const drawer = page.getByRole('dialog', { name: 'Add item' });
	await expect(drawer.locator(`[id="${description('C1')}"]`)).toHaveCount(0, { timeout: 2000 });
	await drawer.getByRole('button', { name: 'Add item', exact: true }).click();
	await expect(drawer.getByText('Enter property details.', { exact: true })).toBeVisible({ timeout: 2000 });
	await expect(propertyField(drawer, 'C_3')).toBeFocused();
	await drawer.getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Exempt properties received (0/99)', exact: true })).toBeVisible();
	await add.click();
	await propertyField(drawer, 'C_3').fill('Printable gift lot');
	await drawer.getByRole('button', { name: 'Add item', exact: true }).click();
	await expect(drawer).toBeHidden();
	await expect(page.getByRole('heading', { name: 'Exempt properties received (1/99)', exact: true })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Other exempt income (0/101)', exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(base);

	const printed = await printSavedReturn(page, code, info.outputPath('exempt-properties.pdf'));
	const branchCodes = printed.locator('[data-source-page] [data-print-branch-boxes]:not([id])');
	await expect(branchCodes).toHaveText(Array(7).fill('1234'));
	for (const branch of await branchCodes.all()) {
		await expect(branch).toHaveCSS('display', 'grid');
		await expect(branch.locator('span')).toHaveText(['1', '2', '3', '4']);
	}
	await expect(printed.locator('.original-continuation').filter({ hasText: 'Exempt properties received' }))
		.toContainText('Printable gift lot');
});

test('1702EX caps exempt properties at 99 while preserving existing original entries', async ({ page }, info) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, [{
		id: 'draft-cap', taxpayerId, formCode: code, returnPeriod: '2025-12',
		status: 'Draft', updatedAt: 1794441600000, finalFlag: '0',
		values: {
			Pg7S9Pt5PopLength: '98',
			[description('C1')]: 'Previously entered property',
			[description('C_3')]: 'First continuation'
		}
	}]);
	await page.goto(`${base}/${code}?return=draft-cap`);
	await goToReturnPage(page, 7);

	const heading = page.getByRole('heading', { name: /^Exempt properties received \(/ });
	const add = heading.locator('xpath=../..').getByRole('button', { name: 'Add item', exact: true });
	const list = page.getByRole('list', { name: 'Exempt properties received line items' });
	await expect(add).toBeDisabled({ timeout: 2000 });
	await expect(heading).toHaveText('Exempt properties received (99/99)');
	await heading.locator('xpath=../..').screenshot({ path: info.outputPath('exempt-properties-cap.png') });
	await list.getByRole('button', { name: 'Previously entered property', exact: true }).click();
	const edit = page.getByRole('dialog', { name: 'Edit item' });
	await expect(propertyField(edit, 'C1')).toHaveValue('Previously entered property');
	await propertyField(edit, 'C1').fill('Updated property');
	await edit.getByRole('button', { name: 'Update', exact: true }).click();
	await expect(edit).toBeHidden();

	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(base);
	await page.getByRole('link', { name: 'Edit', exact: true }).click();
	await goToReturnPage(page, 7);
	await list.getByRole('button', { name: 'Updated property', exact: true }).click();
	await expect(propertyField(edit, 'C1')).toHaveValue('Updated property');
	await edit.getByRole('button', { name: 'Delete item', exact: true }).click();
	await expect(edit).toBeHidden();
	await expect(heading).toHaveText('Exempt properties received (98/99)');

	await add.click();
	const drawer = page.getByRole('dialog', { name: 'Add item' });
	await propertyField(drawer, 'C_199').fill('Last printable lot');
	await drawer.getByRole('button', { name: 'Add item', exact: true }).click();
	await expect(drawer).toBeHidden();
	await expect(heading).toHaveText('Exempt properties received (99/99)');
	await expect(add).toBeDisabled();
	await expect(list.getByRole('button', { name: 'First continuation', exact: true })).toBeVisible();
});
