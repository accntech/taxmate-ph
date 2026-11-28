import { expect, test } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

const formsPath = `/ebirforms/taxpayers/${taxpayerId}/forms`;

for (const formCode of ['1701A', '1602Qv2018', '1702RTv2018C']) {
	test(`${formCode} restores the URL page on reload and in browser history`, async ({ page }) => {
		const draftId = 'pagination-draft';
		const href = `${formsPath}/${formCode}?return=${draftId}`;
		await seedWorkspace(page, 'light', 'loaded', {}, [{
			id: draftId, taxpayerId, formCode, returnPeriod: '2025-12', status: 'Draft',
			updatedAt: 1794441600000, finalFlag: '0', values: {}
		}]);
		const current = page.getByRole('navigation', { name: 'Return pages' }).locator('[aria-current="page"]');

		await page.goto(href);
		await expect(current).toHaveText('1', { timeout: 15_000 });
		await goToReturnPage(page, 2);
		await expect(page).toHaveURL(`${href}&page=2`);
		await page.reload();
		await expect(current).toHaveText('2', { timeout: 15_000 });
		await page.goBack();
		await expect(page).toHaveURL(href);
		await expect(current).toHaveText('1');
		await page.goForward();
		await expect(current).toHaveText('2');
		await goToReturnPage(page, 1);
		await expect(page).toHaveURL(href);
		await page.goto(`${href}&page=unknown`);
		await expect(current).toHaveText('1', { timeout: 15_000 });
	});
}

test('page changes preserve unsaved return edits', async ({ page }) => {
	await seedWorkspace(page);
	const href = `${formsPath}/1701A?new=true`;
	await page.goto(href);
	const year = page.getByRole('group', { name: 'Filing period', exact: true })
		.getByRole('spinbutton', { name: 'Year', exact: true });
	await year.fill('2025', { timeout: 15_000 });
	await year.blur();
	await goToReturnPage(page, 2);
	await expect(page).toHaveURL(`${href}&page=2`);
	await page.goBack();
	await expect(year).toHaveValue('2025');
	await page.goForward();
	await goToReturnPage(page, 1);
	await expect(year).toHaveValue('2025');
});

test('January 1701 stores the conditional attachment page ID in the URL', async ({ page }) => {
	const href = `${formsPath}/1701v2018?return=attachment-draft`;
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'I', civilStatus: 'Single' }, [{
		id: 'attachment-draft', taxpayerId, formCode: '1701v2018', returnPeriod: '2025', status: 'Draft',
		updatedAt: 1794441600000, finalFlag: '0',
		values: { 'frm1701:rdoPg1I19IncomeExempt': 'Yes', 'frm1701:rdoPg1m': '2' }
	}]);
	await page.goto(`${href}&page=1m`);
	await page.getByRole('button', { name: 'Open activity attachment', exact: true }).click({ timeout: 15_000 });
	await expect(page).toHaveURL(`${href}&page=1mTYPE`);
	await page.reload();
	await expect(page.getByRole('heading', { name: 'Activity profile and income', exact: true }))
		.toBeVisible({ timeout: 15_000 });

	await page.goto(`${formsPath}/1701v2018?new=true&page=1mTYPE`);
	await expect(page.getByRole('navigation', { name: 'Return pages' }).locator('[aria-current="page"]'))
		.toHaveText('1', { timeout: 15_000 });
});
