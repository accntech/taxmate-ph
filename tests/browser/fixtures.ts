import { expect, type Page } from '@playwright/test';
import type { TaxpayerProfileInput } from '../../src/lib/profiles/profile';
import type { CreatedReturn } from '../../src/lib/ebirforms/created-returns';

export const taxpayerId = '0012345670008';
export const formPath = `/ebirforms/taxpayers/${taxpayerId}/forms/1601EQ?return=review-return`;

export async function goToReturnPage(page: Page, target: number) {
	const pager = page.getByRole('navigation', { name: 'Return pages' });
	const current = pager.locator('[aria-current="page"]');
	const targetButton = pager.getByRole('button', { name: `Page ${target}`, exact: true });
	let index = Number(await current.textContent());
	while (index !== target) {
		const direction = target > index ? 1 : -1;
		if (await targetButton.isVisible()) {
			await targetButton.click();
			index = target;
		} else {
			await pager.getByRole('button', { name: direction === 1 ? 'Next page' : 'Previous page' }).click();
			index += direction;
		}
		await expect(current).toHaveText(String(index));
	}
}

/** Isolated browser data: native calls never reach the user's saved profiles. */
export async function seedWorkspace(page: Page, theme = 'light', profileState: 'loaded' | 'empty' | 'error' = 'loaded', profileOverrides: Partial<TaxpayerProfileInput> = {}, returns?: CreatedReturn[], options: { persistProfile?: boolean } = {}) {
	await page.addInitScript(({ taxpayerId, theme, profileState, profileOverrides, returns, persistProfile }) => {
		localStorage.setItem('taxmate-ph-theme', theme);
		const profile = {
			id: taxpayerId, tin1: '001', tin2: '234', tin3: '567', branchCode: '0008',
			rdoCode: '040', taxpayerName: 'Example Services Corporation',
			address: '123 Example Street', address2: 'Example City', zipCode: '0123',
			contactNumber: '09171234567', category: 'P', email: 'example@example.com', ...profileOverrides
		};
		const values = {
			'frm1601EQ:txtTIN1': profile.tin1, 'frm1601EQ:txtTIN2': profile.tin2,
			'frm1601EQ:txtTIN3': profile.tin3, 'frm1601EQ:txtBranchCode': profile.branchCode,
			'frm1601EQ:txtRDOCode': profile.rdoCode, 'frm1601EQ:txtTaxpayerName': profile.taxpayerName,
			'frm1601EQ:txtAddress': profile.address, 'frm1601EQ:txtAddress2': profile.address2,
			'frm1601EQ:txtZipCode': profile.zipCode, 'frm1601EQ:txtTelNum': profile.contactNumber,
			'frm1601EQ:optCategory': 'P', txtEmail: profile.email,
			'frm1601EQ:txtYear': '2026', 'frm1601EQ:optQuarter': 'Q2',
			'frm1601EQ:optAmendedReturn': 'N', 'frm1601EQ:optTaxesWithheld': 'Y',
			'frm1601EQ:txtSheetsAttached': '0', 'frm1601EQ:txtATC13': 'WI120',
			'frm1601EQ:txtTaxBase13': '100000', 'frm1601EQ:txtRemittanceFirstMonth': '1234.56'
		};
		localStorage.setItem('ebirforms-created-returns-v1', JSON.stringify({
			version: 1, archivedTaxpayerIds: [], returns: returns ?? [{
				id: 'review-return', taxpayerId, formCode: '1601EQ', returnPeriod: '2026Q2',
				status: 'Draft', updatedAt: 1794441600000, finalFlag: '0', values
			}]
		}));
		Object.assign(window, { __TAURI_INTERNALS__: {
			invoke: async (command: string, args?: { profile?: typeof profile; data?: unknown }) => {
				if (command === 'load_working_returns') return JSON.parse(localStorage.getItem('ebirforms-created-returns-v1') || 'null');
				if (command === 'save_working_returns') { localStorage.setItem('ebirforms-created-returns-v1', JSON.stringify(args?.data)); return; }
				if (command === 'submit_return') return { status: 'drafted', finalFlag: '2', savePath: 'test.xml', sendPath: '', message: 'Package prepared locally.' };
				if (command === 'list_taxpayer_profiles') {
					if (profileState === 'error') throw new Error('Disk unavailable for review');
					const saved = persistProfile && sessionStorage.getItem('ebirforms-test-profile');
					if (saved) return [JSON.parse(saved)];
					return profileState === 'empty' ? [] : [profile];
				}
				if (command === 'list_submitted_returns') return [];
				if (command === 'save_taxpayer_profile') {
					if (persistProfile && args?.profile) sessionStorage.setItem('ebirforms-test-profile', JSON.stringify(args.profile));
					return { profile: args?.profile, path: 'test-profile.xml' };
				}
				if (command === 'delete_taxpayer_profile') return undefined;
				throw new Error(`Unexpected native command in browser review: ${command}`);
			}
		} });
	}, { taxpayerId, theme, profileState, profileOverrides, returns, persistProfile: options.persistProfile });
}
