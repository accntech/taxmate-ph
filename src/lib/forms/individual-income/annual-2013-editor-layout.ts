import type { IncomeEditorField } from './editor-layout';

type Annual2013Layout = Partial<IncomeEditorField> & { column?: string };

const sections: Record<string, string> = {
	A: 'Schedule A · Activity profile and tax relief',
	B: 'Schedule B · Computation of income tax',
	C1: 'Schedule C1 · Tax relief at a special rate',
	C2: 'Schedule C2 · Tax relief on exempt income',
	D: 'Schedule D · Sales and receipts',
	E: 'Schedule E · Other taxable operating income',
	F1: 'Schedule F1 · Cost of sales · Trading',
	F2: 'Schedule F2 · Cost of sales · Manufacturing',
	F3: 'Schedule F3 · Cost of services',
	G: 'Schedule G · Non-operating income',
	H: 'Schedule H · Ordinary itemized deductions',
	I: 'Schedule I · Special itemized deductions',
	J: 'Schedule J · Tax credits and payments'
};

const labels: Record<string, Record<string, string>> = {
	A: {
		1: 'Investment promotion agency or government entity', 2: 'Legal basis',
		3: 'Registered activity or program and registration number', 4: 'Special tax rate (%)',
		5: 'Tax relief effective from', 6: 'Tax relief effective to'
	},
	B: {
		1: 'Net sales, revenue, receipts or fees', 2: 'Add: Other taxable operating income',
		3: 'Total sales, revenue, receipts or fees', 4: 'Less: Cost of sales or services',
		5: 'Gross income from business', 6: 'Add: Non-operating income', 7: 'Total gross income',
		8: 'Ordinary itemized deductions', 9: 'Special itemized deductions', 10: 'Total itemized deductions',
		11: 'Total income from business or profession'
	},
	C1: {
		1: 'Taxable income from business or profession', 2: 'Add: Special itemized deductions', 3: 'Subtotal',
		4: 'Regular income tax otherwise due', 5: 'Less: Income tax due at the special rate',
		6: 'Tax relief before special tax credits', 7: 'Add: Special tax credits', 8: 'Total special-rate tax relief'
	},
	C2: { 9: 'Taxable business income at regular rates', 10: 'Applicable tax rate (%)', 11: 'Tax relief on exempt income' },
	D: {
		1: 'Total sales, revenue, receipts or fees', 2: 'Add: Gross sales not subject to withholding tax',
		3: 'Total sales, revenue, receipts or fees', 4: 'Less: Returns, allowances and discounts', 5: 'Net sales, revenue, receipts or fees'
	},
	F1: {
		1: 'Merchandise inventory, beginning', 2: 'Add: Merchandise purchases', 3: 'Total goods available for sale',
		4: 'Less: Merchandise inventory, ending', 5: 'Cost of sales'
	},
	F2: {
		6: 'Direct materials, beginning', 7: 'Add: Direct material purchases', 8: 'Materials available for use',
		9: 'Less: Direct materials, ending', 10: 'Raw materials used', 11: 'Direct labor', 12: 'Manufacturing overhead',
		13: 'Total manufacturing cost', 14: 'Add: Work in process, beginning', 15: 'Less: Work in process, ending',
		16: 'Cost of goods manufactured', 17: 'Add: Finished goods, beginning', 18: 'Less: Finished goods, ending',
		19: 'Cost of goods manufactured and sold'
	},
	F3: {
		20: 'Direct charges · Salaries, wages and benefits', 21: 'Direct charges · Materials, supplies and facilities',
		22: 'Direct charges · Depreciation', 23: 'Direct charges · Rent', 24: 'Direct charges · Outside services',
		25: 'Direct charges · Other costs', 26: 'Cost of services', 27: 'Total cost of sales or services'
	},
	H: {
		1: 'Advertising and promotions', 2: 'Amortization', 3: 'Amortization', 4: 'Amortization', 5: 'Bad debts',
		6: 'Charitable contributions', 7: 'Commissions', 8: 'Communication, light and water', 9: 'Depletion',
		10: 'Depreciation', 11: 'Directors’ fees', 12: 'Fringe benefits', 13: 'Fuel and oil', 14: 'Insurance',
		15: 'Interest', 16: 'Janitorial and messengerial services', 17: 'Losses', 18: 'Management and consultancy fees',
		19: 'Miscellaneous', 20: 'Office supplies', 21: 'Other services', 22: 'Professional fees', 23: 'Rent',
		24: 'Repairs and maintenance · Labor or labor and materials', 25: 'Repairs and maintenance · Materials and supplies',
		26: 'Representation and entertainment', 27: 'Research and development', 28: 'Royalties',
		29: 'Salaries and allowances', 30: 'Security services', 31: 'SSS, GSIS, PhilHealth, HDMF and other contributions',
		32: 'Taxes and licenses', 33: 'Tolling fees', 34: 'Training and seminars', 35: 'Transportation and travel',
		36: 'Other ordinary deduction', 37: 'Other ordinary deduction', 38: 'Other ordinary deduction',
		39: 'Other ordinary deduction', 40: 'Total ordinary itemized deductions'
	},
	J: {
		1: 'Prior year’s excess credits', 2: 'Tax payments for the first three quarters',
		3: 'Creditable tax withheld for the first three quarters', 4: 'Fourth-quarter creditable tax withheld',
		5: 'Creditable tax withheld per Form 2316', 6: 'Tax paid on the previously filed return',
		7: 'Foreign tax credits', 8: 'Special tax credits', 9: 'Other tax credits or payments', 10: 'Total tax credits and payments'
	},
	K: {
		1: 'Net income or loss per books', 2: 'Add: Taxable income excluded from books', 3: 'Add: Taxable income excluded from books',
		4: 'Total additions and book income', 5: 'Less: Non-taxable income included in books', 6: 'Less: Non-taxable income included in books',
		7: 'Less: Special deductions', 8: 'Less: Special deductions', 9: 'Total deductions', 10: 'Net taxable income or loss'
	}
};

function coordinates(field: IncomeEditorField, section: string, item: string, label: string, column?: string): Annual2013Layout {
	return {
		section, item, label: `${item} ${label}`, shortLabel: undefined, column,
		rowKey: `1701:${field.page}:${section}:${item}`,
		person: column === 'Taxpayer' ? 'taxpayer' : column === 'Spouse' ? 'spouse' : undefined
	};
}

/** Preserve legacy field IDs while restoring the headings carried by the source tables. */
export function annual2013EditorLayout(field: IncomeEditorField): Annual2013Layout {
	const name = field.id.replace('frm1701:', '');
	if (!field.page.includes('m')) return {};
	if (/^txtPg12Pt9I18(?:Taxfiler|Spouse)SPOutputTYPE$/.test(name)) return { kind: 'hidden', label: 'Calculated special-rate income tax' };
	const identity = name.match(/^txtPg\dm(TIN[1-4]|BranchCode|RegisteredName)TYPE$/);
	if (identity) return { label: identity[1] === 'RegisteredName' ? 'Taxpayer name' : identity[1] === 'BranchCode' || identity[1] === 'TIN4' ? 'Branch code' : 'TIN segment' };
	if (name === 'rdoPg1mTaxRegimeTYPE') return {
		section: 'Activity tax regime', label: 'Tax regime', item: undefined, rowKey: '1701:activity-tax-regime',
		choiceLabels: { ...field.choiceLabels, Exempt: 'Exempt', SpecialRate: 'Special rate' }
	};
	const match = name.match(/^txtPg(\d)mSc([A-K](?:[123])?)I(\d+)(.*?)TYPE$/);
	if (!match) return {};
	const [, page, schedule, rawItem, control] = match;
	let item = rawItem;
	if (schedule === 'H' && page === '4' && /^[6-9]$/.test(item)) item = String(Number(item) + 10);
	const columnNumber = Number(control.match(/C([1-4])$/)?.[1]);
	const hasDescription = schedule === 'E' && item !== '3' || schedule === 'G' && item !== '6' ||
		schedule === 'H' && (Number(item) >= 2 && Number(item) <= 4 || Number(item) >= 36 && Number(item) <= 39);
	if (schedule === 'K') {
		const person = columnNumber === 2 ? 'spouse' : 'taxpayer';
		const section = `Schedule K${columnNumber} · Reconciliation · ${person === 'taxpayer' ? 'Taxpayer' : 'Spouse'}`;
		const description = control.startsWith('Desc');
		return { ...coordinates(field, section, item, labels.K[item], description ? 'Description' : 'Amount'),
			person, kind: description ? 'text' : 'money', shortLabel: description ? 'Adjustment description' : 'Amount' };
	}
	if (schedule === 'I') {
		const total = item === '5';
		const column = total ? columnNumber === 1 ? 'Taxpayer' : 'Spouse' :
			({ 1: 'Description', 2: 'Legal basis', 3: 'Taxpayer', 4: 'Spouse' } as Record<number, string>)[columnNumber];
		return { ...coordinates(field, sections.I, item, total ? 'Total special itemized deductions' : 'Special itemized deduction', column),
			kind: column === 'Description' || column === 'Legal basis' ? 'text' : 'money', shortLabel: column };
	}
	const description = hasDescription && columnNumber === 1 || schedule === 'J' && control === 'Others';
	const column = description ? 'Description' : hasDescription ? columnNumber === 2 ? 'Taxpayer' : 'Spouse' :
		columnNumber === 1 ? 'Taxpayer' : columnNumber === 2 ? 'Spouse' : undefined;
	const label = schedule === 'E' ? item === '3' ? 'Total other taxable operating income' : 'Other taxable operating income' :
		schedule === 'G' ? item === '6' ? 'Total non-operating income' : 'Non-operating income' : labels[schedule]?.[item];
	if (!label) return {};
	const kind = schedule === 'A' ? item === '4' ? 'percent' : Number(item) >= 5 ? 'date' : 'text' :
		schedule === 'C2' && item === '10' ? 'percent' : description ? 'text' : 'money';
	return { ...coordinates(field, sections[schedule], item, label, column), kind,
		shortLabel: description ? 'Description' : undefined };
}
