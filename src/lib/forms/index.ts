import { withholdingDefinitions } from './withholding-definitions';
export type FormStatus = 'ready' | 'planned';

export type FormField = {
	id: string;
	label: string;
	type: 'text' | 'number' | 'select';
	required?: boolean;
	profileKey?: string;
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

const atcFields = [13, 14, 15, 16, 17, 18].flatMap((line): FormField[] => [
	{ id: `frm1601EQ:txtATC${line}`, label: `Item ${line} ATC`, type: 'text' },
	{ id: `frm1601EQ:txtTaxBase${line}`, label: `Item ${line} Tax Base`, type: 'number' },
	{ id: `frm1601EQ:txtTaxRate${line}`, label: `Item ${line} Tax Rate`, type: 'text' },
	{
		id: `frm1601EQ:txtTaxWithheld${line}`,
		label: `Item ${line} Tax Withheld`,
		type: 'number'
	}
]);

const forms: FormDefinition[] = [
	{
		code: '1601EQ',
		title: 'Quarterly Remittance Return of Creditable Income Taxes Withheld',
		category: 'Withholding Tax',
		status: 'ready',
		fields: [
			{ id: 'frm1601EQ:txtYear', label: '1 For the Year', type: 'text', required: true },
			{
				id: 'frm1601EQ:optQuarter',
				label: '2 Quarter',
				type: 'select',
				required: true,
				options: ['Q1', 'Q2', 'Q3', 'Q4']
			},
			{
				id: 'frm1601EQ:optAmendedReturn',
				label: '3 Amended Return?',
				type: 'select',
				required: true,
				options: ['Y', 'N']
			},
			{
				id: 'frm1601EQ:optTaxesWithheld',
				label: '4 Any Taxes Withheld?',
				type: 'select',
				required: true,
				options: ['Y', 'N']
			},
			{ id: 'frm1601EQ:txtSheetsAttached', label: '5 No. of Sheet/s Attached', type: 'number' },
			{ id: 'frm1601EQ:txtTIN1', label: 'TIN 1', type: 'text', required: true },
			{ id: 'frm1601EQ:txtTIN2', label: 'TIN 2', type: 'text', required: true },
			{ id: 'frm1601EQ:txtTIN3', label: 'TIN 3', type: 'text', required: true },
			{ id: 'frm1601EQ:txtBranchCode', label: 'Branch Code', type: 'text', required: true },
			{ id: 'frm1601EQ:txtRDOCode', label: 'RDO Code', type: 'text', required: true },
			{ id: 'frm1601EQ:txtTaxpayerName', label: 'Taxpayer Name', type: 'text', required: true },
			{ id: 'frm1601EQ:txtAddress', label: '9 Registered Address', type: 'text', required: true },
			{ id: 'frm1601EQ:txtAddress2', label: '9 Registered Address Line 2', type: 'text' },
			{ id: 'frm1601EQ:txtZipCode', label: '9A ZIP Code', type: 'text', required: true },
			{ id: 'frm1601EQ:txtTelNum', label: '10 Contact Number', type: 'text', required: true },
			{
				id: 'frm1601EQ:optCategory',
				label: '11 Category of Withholding Agent',
				type: 'select',
				required: true,
				options: ['P', 'G']
			},
			{ id: 'txtEmail', label: '12 Email Address', type: 'text', required: true },
			...atcFields,
			{
				id: 'frm1601EQ:txtTotalTaxesWithheld',
				label: '19 Total Taxes Withheld for the Quarter',
				type: 'number'
			},
			{
				id: 'frm1601EQ:txtRemittanceFirstMonth',
				label: '20 Remittances Made: 1st Month',
				type: 'number'
			},
			{
				id: 'frm1601EQ:txtRemittanceSecondMonth',
				label: '21 Remittances Made: 2nd Month',
				type: 'number'
			},
			{
				id: 'frm1601EQ:txtTaxRemittedPreviousReturn',
				label: '22 Tax Remitted in Return Previously Filed',
				type: 'number'
			},
			{
				id: 'frm1601EQ:txtOverremittancePreviousQuarter',
				label: '23 Over-remittance from Previous Quarter',
				type: 'number'
			},
			{ id: 'frm1601EQ:txtTotalRemittances', label: '24 Total Remittances Made', type: 'number' },
			{ id: 'frm1601EQ:txtTaxStillDue', label: '25 Tax Still Due/(Over-remittance)', type: 'number' },
			{ id: 'frm1601EQ:txtSurcharge', label: '26 Surcharge', type: 'number' },
			{ id: 'frm1601EQ:txtInterest', label: '27 Interest', type: 'number' },
			{ id: 'frm1601EQ:txtCompromise', label: '28 Compromise', type: 'number' },
			{ id: 'frm1601EQ:txtTotalPenalties', label: '29 Total Penalties', type: 'number' },
			{
				id: 'frm1601EQ:txtTotalAmountDue',
				label: '30 Total Amount Still Due/(Over-remittance)',
				type: 'number'
			}
		]
	}
];

for (const definition of withholdingDefinitions) {
 const allFields = [...definition.sections.flatMap(section => section.fields),
  ...definition.schedules.flatMap(schedule => [...schedule.rows.flatMap(row => row.fields), ...(schedule.totals ?? [])])];
 forms.push({ code: definition.code, title: definition.title, category: 'Withholding Tax', status: 'ready',
  fields: allFields.map(field => ({ id: field.id, label: field.label,
   type: field.type === 'money' ? 'number' : field.type === 'date' ? 'text' : field.type,
   required: field.required, profileKey: field.profileKey, options: field.options?.map(option => option.value) })) });
}

export function listForms(): FormSummary[] {
	return forms.map(({ fields, ...summary }) => summary);
}

export function getFormDefinition(code: string): FormDefinition | undefined {
	return forms.find((form) => form.code === code);
}
