import type { Page } from '@playwright/test';

export const taxpayerId = '0012345670008';
export const formPath = `/ebirforms/taxpayers/${taxpayerId}/forms/1601EQ?return=review-return`;

/** Isolated browser data: native calls never reach the user's saved profiles. */
export async function seedWorkspace(page: Page, theme = 'light', profileState: 'loaded' | 'empty' | 'error' = 'loaded') {
	await page.addInitScript(({ taxpayerId, theme, profileState }) => {
		localStorage.setItem('taxmate-ph-theme', theme);
		const profile = {
			id: taxpayerId, tin1: '001', tin2: '234', tin3: '567', branchCode: '0008',
			rdoCode: '040', taxpayerName: 'Example Services Corporation',
			address: '123 Example Street', address2: 'Example City', zipCode: '0123',
			contactNumber: '09171234567', category: 'P', email: 'example@example.com'
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
			version: 1, archivedTaxpayerIds: [], returns: [{
				id: 'review-return', taxpayerId, formCode: '1601EQ', returnPeriod: '2026Q2',
				status: 'Draft', updatedAt: 1794441600000, finalFlag: '0', values
			}]
		}));
		Object.assign(window, { __TAURI_INTERNALS__: {
			invoke: async (command: string, args?: { profile?: typeof profile }) => {
				if (command === 'list_taxpayer_profiles') {
					if (profileState === 'error') throw new Error('Disk unavailable for review');
					return profileState === 'empty' ? [] : [profile];
				}
				if (command === 'list_submitted_returns') return [];
				if (command === 'save_taxpayer_profile') return { profile: args?.profile, path: 'test-profile.xml' };
				if (command === 'delete_taxpayer_profile') return undefined;
				throw new Error(`Unexpected native command in browser review: ${command}`);
			}
		} });
	}, { taxpayerId, theme, profileState });
}
