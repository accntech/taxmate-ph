import { expect, test } from '@playwright/test';
import type { CreatedReturn } from '../../src/lib/ebirforms/created-returns';
import { seedWorkspace, taxpayerId } from './fixtures';

const profile = {
	lineOfBusiness: 'Accounting and advisory services',
	psicCode: '47913',
	taxpayerClassification: 'N' as const,
	taxpayerSize: 'small' as const
};
const returnPath = (code: string, id = `info-${code}`) => `/ebirforms/taxpayers/${taxpayerId}/forms/${code}?return=${id}`;
const draft: Omit<CreatedReturn, 'id' | 'formCode'> = {
	taxpayerId, returnPeriod: '2025', status: 'Draft', updatedAt: 1794441600000, finalFlag: '0', values: {}
};

const taxpayerLabels: Partial<Record<string, string[]>> = {
	'1601EQ': ['6 TIN and branch code', '7 RDO code', '8 Taxpayer name', '9 Registered address'],
	'0605': ['9 TIN and branch code', '10 RDO code', '11 Taxpayer classification', '12 Line of business / occupation', '13 Taxpayer name', '14 Telephone number', '15 Registered address', '16 ZIP code'],
	'0619E': ['7 TIN and branch code', '8 RDO code', '9 Withholding agent’s name', '10 Registered address', '10A ZIP code', '11 Contact number', '12 Category of withholding agent', '13 Email address'],
	'0619F': ['6 TIN and branch code', '7 RDO code', '8 Withholding agent’s name', '9 Registered address', '9A ZIP code', '10 Contact number', '11 Category of withholding agent', '12 Email address'],
	'1701MS': ['6 TIN and branch code', '7 RDO code', '8 Taxpayer name', '9 Email address', '10 Contact number']
};

test('all supported returns show their taxpayer information', async ({ page }) => {
	test.setTimeout(120_000);
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Tax workspaces', exact: true })).toBeVisible({ timeout: 15_000 });
	// Vite handles the form catalog's JSON imports in the browser.
	const forms = await page.evaluate(async () => {
		const root = '/src/lib/forms';
		const { listForms } = await import(`${root}/index.ts`) as typeof import('../../src/lib/forms');
		const { getIndividualIncomeForm } = await import(`${root}/individual-income/index.ts`) as typeof import('../../src/lib/forms/individual-income');
		const { getWithholdingPaperLayout } = await import(`${root}/withholding-paper-layout.ts`) as typeof import('../../src/lib/forms/withholding-paper-layout');
		return listForms().filter(form => form.status === 'ready').map(({ code }) => ({
			code,
			taxpayer: ['1601EQ', '0605', '0619E', '0619F'].includes(code) || getIndividualIncomeForm(code)
				? null
				: getWithholdingPaperLayout(code).taxpayer
		}));
	});
	expect(forms.length).toBeGreaterThan(0);
	await seedWorkspace(page, 'light', 'loaded', profile, forms.map(({ code }) => ({
		...draft, id: `info-${code}`, formCode: code
	})));
	for (const form of forms) {
		await test.step(form.code, async () => {
			await page.goto(returnPath(form.code));
			const information = page.getByRole('region', { name: 'Taxpayer information', exact: true });
			await expect(information).toBeVisible({ timeout: 15_000 });
			const contact = form.code === '1701MS'
				? ['example@example.com', '09171234567']
				: ['123 Example Street', 'Example City'];
			for (const value of ['Example Services Corporation', '001-234-567-00008', '040', ...contact]) {
				await expect(information).toContainText(value);
			}
			const labels = taxpayerLabels[form.code];
			if (labels) await expect(information.locator('dt')).toHaveText(labels);
			else if (form.taxpayer) {
				await expect(information.getByText(`${form.taxpayer.tin} TIN and branch code`, { exact: true })).toBeVisible();
				await expect(information.getByText(`${form.taxpayer.rdoCode} RDO code`, { exact: true })).toBeVisible();
			} else {
				await expect(information.getByText(/TIN and branch code$/).first()).toBeVisible();
				await expect(information.getByText(/RDO code$/)).toBeVisible();
			}
			await expect(information.getByRole('link', { name: 'Edit taxpayer information' })).toHaveAttribute('href', `/ebirforms/taxpayers/${taxpayerId}/edit`);
		});
	}
});

test('taxpayer information fits narrow light and dark return editors', async ({ page }) => {
	const forms = ['1601EQ', '0605', '0619E', '1601FQ', '1701A'];
	await page.setViewportSize({ width: 390, height: 900 });
	await seedWorkspace(page, 'light', 'loaded', profile, forms.map(code => ({
		...draft, id: `info-${code}`, formCode: code
	})));

	for (const code of forms) {
		await page.goto(returnPath(code));
		const information = page.getByRole('region', { name: 'Taxpayer information', exact: true });
		await expect(information).toBeVisible({ timeout: 15_000 });
		for (const theme of ['light', 'dark']) {
			await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${code} in ${theme}`).toBe(true);
		}
	}
});

test('final returns show their saved identity and preserve blank saved fields', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', profile, [{
		...draft, id: 'final-info', formCode: '0605', status: 'Final', finalFlag: '1',
		values: {
			'frm0605:txtTaxpayerName': 'Original Filed Name',
			'frm0605:txtAddress': '',
			'frm0605:txtClassification': 'I'
		}
	}]);
	await page.goto(returnPath('0605', 'final-info'));
	const information = page.getByRole('region', { name: 'Taxpayer information', exact: true });
	await expect(information).toContainText('Original Filed Name');
	await expect(information).not.toContainText('Example Services Corporation');
	await expect(information.locator('div').filter({ has: page.locator('dt', { hasText: /^15 Registered address$/ }) }).locator('dd')).toHaveText('Example City');
	await expect(information.locator('div').filter({ has: page.locator('dt', { hasText: /^11 Taxpayer classification$/ }) }).locator('dd')).toHaveText('Individual');
});
