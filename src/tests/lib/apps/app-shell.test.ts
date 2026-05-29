import { describe, expect, it } from 'vitest';
import {
	buildTaxpayerFormsRoute,
	buildTaxpayerRoute,
	getFieldKitSteps,
	getSuiteApp,
	listSuiteApps,
	listSuiteNavItems
} from '$lib/apps/app-shell';

describe('suite app shell metadata', () => {
	it('lists eBIRForms as active and the other apps as placeholders', () => {
		expect(listSuiteApps()).toEqual([
			{
				id: 'ebirforms',
				name: 'eBIRForms',
				description: 'Create, save, submit, and print BIR forms by taxpayer.',
				href: '/ebirforms/taxpayers',
				status: 'active'
			},
			{
				id: 'vat-relief',
				name: 'VAT Relief',
				description: 'VAT relief schedules and validation workspace.',
				href: '/vat-relief',
				status: 'placeholder'
			},
			{
				id: 'alphalist',
				name: 'Alphalist',
				description: 'Withholding tax alphalist preparation workspace.',
				href: '/alphalist',
				status: 'placeholder'
			}
		]);
	});

	it('finds suite apps by id', () => {
		expect(getSuiteApp('ebirforms')?.name).toBe('eBIRForms');
		expect(getSuiteApp('missing')).toBeUndefined();
	});

	it('builds taxpayer-scoped eBIRForms routes', () => {
		expect(buildTaxpayerRoute('1234567890000')).toBe('/ebirforms/taxpayers/1234567890000');
		expect(buildTaxpayerFormsRoute('1234567890000', '1601EQ')).toBe(
			'/ebirforms/taxpayers/1234567890000/forms/1601EQ'
		);
	});

	it('defines the field kit shell navigation order', () => {
		expect(listSuiteNavItems().map((item) => item.id)).toEqual([
			'home',
			'ebirforms',
			'vat-relief',
			'alphalist'
		]);
		expect(listSuiteNavItems()[1]).toMatchObject({
			id: 'ebirforms',
			stepLabel: 'Prepare',
			shortName: 'Forms'
		});
	});

	it('defines field kit preparation steps for the app shell', () => {
		expect(getFieldKitSteps()).toEqual([
			{ id: 'profile', label: 'Profile', description: 'Select or create the taxpayer record.' },
			{ id: 'prepare', label: 'Prepare', description: 'Complete the active BIR form sections.' },
			{ id: 'review', label: 'Review', description: 'Check validation and final-copy status.' },
			{ id: 'export', label: 'Export', description: 'Generate savefiles, printouts, and receipts.' }
		]);
	});
});
