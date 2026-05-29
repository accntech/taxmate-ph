export type SuiteAppStatus = 'active' | 'placeholder';

export type SuiteApp = {
	id: 'ebirforms' | 'vat-relief' | 'alphalist';
	name: string;
	description: string;
	href: string;
	status: SuiteAppStatus;
};

export type SuiteNavItem = {
	id: 'home' | SuiteApp['id'];
	name: string;
	shortName: string;
	stepLabel: string;
	description: string;
	href: string;
	status: SuiteAppStatus | 'home';
};

export type FieldKitStep = {
	id: 'profile' | 'prepare' | 'review' | 'submit' | 'export';
	label: string;
	description: string;
};

const suiteApps: SuiteApp[] = [
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
];

const suiteNavItems: SuiteNavItem[] = [
	{
		id: 'home',
		name: 'Suite',
		shortName: 'Home',
		stepLabel: 'Start',
		description: 'Choose a compliance workspace.',
		href: '/',
		status: 'home'
	},
	{
		id: 'ebirforms',
		name: 'eBIRForms',
		shortName: 'Forms',
		stepLabel: 'Prepare',
		description: 'Create, save, submit, and print BIR forms by taxpayer.',
		href: '/ebirforms/taxpayers',
		status: 'active'
	},
	{
		id: 'vat-relief',
		name: 'VAT Relief',
		shortName: 'VAT',
		stepLabel: 'Validate',
		description: 'VAT relief schedules and validation workspace.',
		href: '/vat-relief',
		status: 'placeholder'
	},
	{
		id: 'alphalist',
		name: 'Alphalist',
		shortName: 'Lists',
		stepLabel: 'Report',
		description: 'Withholding tax alphalist preparation workspace.',
		href: '/alphalist',
		status: 'placeholder'
	}
];

const fieldKitSteps: FieldKitStep[] = [
	{ id: 'profile', label: 'Profile', description: 'Select or create the taxpayer record.' },
	{ id: 'prepare', label: 'Prepare', description: 'Complete the active BIR form sections.' },
	{ id: 'review', label: 'Review', description: 'Check validation and final-copy status.' },
	{ id: 'submit', label: 'Submit', description: 'Send the return to BIR and capture the reference number.' },
	{ id: 'export', label: 'Export', description: 'Generate savefiles, printouts, and receipts.' }
];

export function listSuiteApps(): SuiteApp[] {
	return suiteApps;
}

export function listSuiteNavItems(): SuiteNavItem[] {
	return suiteNavItems;
}

export function getFieldKitSteps(): FieldKitStep[] {
	return fieldKitSteps;
}

export function getSuiteApp(id: string): SuiteApp | undefined {
	return suiteApps.find((app) => app.id === id);
}

export function buildTaxpayerRoute(taxpayerId: string): string {
	return `/ebirforms/taxpayers/${encodeURIComponent(taxpayerId)}`;
}

export function buildTaxpayerFormsRoute(taxpayerId: string, formCode: string): string {
	return `${buildTaxpayerRoute(taxpayerId)}/forms/${encodeURIComponent(formCode)}`;
}
