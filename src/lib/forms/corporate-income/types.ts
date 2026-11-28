import type { TaxpayerProfile } from '$lib/profiles/profile';

export type CorporateValues = Record<string, string>;

export type CorporateField = {
	id: string;
	label?: string;
	kind: 'text' | 'integer' | 'money' | 'select' | 'radio' | 'checkbox' | 'date' | 'percent';
	readonly?: boolean;
	required?: boolean;
	profileKey?: keyof TaxpayerProfile;
	defaultValue?: string;
	options?: { value: string; label: string }[];
	maxLength?: number;
	repeatable?: { label: string; limit: number; fixed?: boolean; rollup?: boolean; seedFrom?: string[]; continuationOnly?: boolean };
	column?: number;
};

export type CorporateRow = {
	label: string;
	item?: string;
	fields: CorporateField[];
	entry?: { group: string; index: number };
	list?: string;
	heading?: string;
	layout?: 'deduction';
	disabled?: boolean;
};
export type CorporateSection = { title: string; rows: CorporateRow[]; columns?: string[] };
export type CorporatePage = { title: string; sections: CorporateSection[] };

export type CorporateForm = {
	code: string;
	title: string;
	revision: string;
	year: string;
	month?: string;
	quarter?: string;
	periodType?: string;
	shortPeriod?: string;
	amount?: string;
	pagesFiledField?: string;
	decimals?: 0 | 2;
	pages: CorporatePage[];
	expandPages?: (values: CorporateValues) => CorporatePage[];
	continuations?: (values: CorporateValues) => CorporateSection[];
	calculate: (values: CorporateValues) => CorporateValues;
	validate?: (values: CorporateValues) => CorporateValues;
	fieldApplies?: (id: string, values: CorporateValues) => boolean;
	fieldReadonly?: (id: string, values: CorporateValues) => boolean;
	attachmentGroups?: {
		key: string;
		label: string;
		countField: string;
		templatePages: CorporatePage[];
		expandPages?: (pages: CorporatePage[], values: CorporateValues, id: string) => CorporatePage[];
		applies: (values: CorporateValues) => boolean;
	}[];
};
