export type FormStatus = 'ready' | 'planned';

export type FormField = {
	id: string;
	label: string;
	type: 'text' | 'number' | 'select';
	required?: boolean;
	options?: string[];
};

export type FormSummary = {
	code: string;
	title: string;
	category: string;
	status: FormStatus;
};

export type FormDefinition = FormSummary & {
	fields: FormField[];
};

const forms: FormDefinition[] = [
	{
		code: '1601EQ',
		title: 'Quarterly Remittance Return of Creditable Income Taxes Withheld',
		category: 'Withholding Tax',
		status: 'ready',
		fields: [
			{ id: 'frm1601EQ:txtTIN1', label: 'TIN 1', type: 'text', required: true },
			{ id: 'frm1601EQ:txtTIN2', label: 'TIN 2', type: 'text', required: true },
			{ id: 'frm1601EQ:txtTIN3', label: 'TIN 3', type: 'text', required: true },
			{ id: 'frm1601EQ:txtBranchCode', label: 'Branch Code', type: 'text', required: true },
			{ id: 'frm1601EQ:txtRDOCode', label: 'RDO Code', type: 'text', required: true },
			{ id: 'frm1601EQ:txtTaxpayerName', label: 'Taxpayer Name', type: 'text', required: true },
			{ id: 'frm1601EQ:txtYear', label: 'Return Year', type: 'text', required: true },
			{
				id: 'frm1601EQ:optQuarter',
				label: 'Quarter',
				type: 'select',
				required: true,
				options: ['Q1', 'Q2', 'Q3', 'Q4']
			},
			{ id: 'frm1601EQ:txtTaxDue', label: 'Tax Due', type: 'number', required: true }
		]
	}
];

export function listForms(): FormSummary[] {
	return forms.map(({ fields, ...summary }) => summary);
}

export function getFormDefinition(code: string): FormDefinition | undefined {
	return forms.find((form) => form.code === code);
}
