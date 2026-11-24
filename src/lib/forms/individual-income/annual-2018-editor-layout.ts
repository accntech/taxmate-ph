import type { IncomeEditorField } from './editor-layout';

type Annual2018Layout = Partial<IncomeEditorField> & { column?: string; subheading?: string };

const conciseAmountLabels: Record<string, Record<string, string>> = {
	Shed2: {
		4: 'Gross compensation income', 5: 'Less: Non-taxable or exempt compensation',
		6: 'Taxable compensation income', 7: 'Tax due on compensation'
	},
	Shed3: {
		8: 'Sales, revenues, receipts or fees', 9: 'Less: Sales returns, allowances and discounts',
		10: 'Net sales, revenues, receipts or fees', 11: 'Less: Cost of sales or services',
		12: 'Gross income or loss from operations', 13: 'Ordinary allowable itemized deductions',
		14: 'Special allowable itemized deductions', 15: 'Net operating loss carryover allowance',
		16: 'Total allowable itemized deductions', 17: '40% Optional Standard Deduction (OSD)',
		18: 'Net income or loss', 21: 'Share in income from a general professional partnership',
		22: 'Total other non-operating income', 23: 'Taxable business income or loss',
		24: 'Total taxable compensation and business income', 25: 'Total tax due on compensation and business income',
		26: 'Sales, revenues, receipts or fees', 28: 'Total income subject to 8% tax',
		30: 'Taxable income or loss', 31: 'Tax due on business income at 8%',
		32: 'Total tax due on compensation and business income'
	},
	Shed4: { 18: 'Total ordinary itemized deductions' },
	Sc6: {
		1: 'Regular income tax due', 2: 'Special-rate income tax due',
		3: 'Less: Share remitted to another government agency', 4: 'Net special-rate income tax due',
		5: 'Total income tax due'
	},
	Part7: {
		1: 'Prior year’s excess credits', 2: 'Tax payments for the first three quarters',
		3: 'Creditable tax withheld for the first three quarters', 4: 'Fourth-quarter creditable tax withheld per Form 2307',
		5: 'Creditable tax withheld per Form 2316', 6: 'Tax paid on the previously filed return',
		7: 'Foreign tax credits', 8: 'Special tax credits', 10: 'Total tax credits and payments'
	},
	Part8: {
		1: 'Regular income tax otherwise due', 2: 'Tax relief on special itemized deductions',
		3: 'Tax relief subtotal', 4: 'Less: Income tax due', 5: 'Tax relief before special tax credits',
		6: 'Add: Special tax credits', 7: 'Total special-rate tax relief',
		8: 'Regular income tax on exempt income', 9: 'Tax relief on special itemized deductions',
		10: 'Total exempt-income tax relief'
	}
};

const reliefLabels: Record<string, string> = {
	1: 'Investment promotion agency or implementing government entity',
	2: 'Legal basis',
	3: 'Registered activity or program and registration number',
	4: 'Special tax rate (%)',
	5: 'Tax relief or exemption start date',
	6: 'Tax relief or exemption end date'
};
const incomeLabels: Record<string, string> = {
	1: 'Sales, revenues, receipts or fees',
	2: 'Less: Sales returns, allowances and discounts',
	3: 'Net sales, revenues, receipts or fees',
	4: 'Less: Cost of sales or services',
	5: 'Gross income or loss from operations',
	6: 'Ordinary allowable itemized deductions',
	7: 'Special allowable itemized deductions',
	8: 'Net operating loss carryover allowance',
	9: 'Total allowable itemized deductions',
	10: '40% Optional Standard Deduction (OSD)',
	11: 'Net income or loss',
	12: 'Other non-operating income',
	13: 'Other non-operating income',
	14: 'Share in income from a general professional partnership',
	15: 'Total other non-operating income',
	16: 'Total taxable income or loss',
	17: 'Income tax due'
};
const deductionLabels: Record<string, string> = {
	1: 'Amortization', 2: 'Bad debts', 3: 'Charitable and other contributions',
	4: 'Depletion', 5: 'Depreciation', 6: 'Entertainment, amusement and recreation',
	7: 'Fringe benefits', 8: 'Interest', 9: 'Losses', 10: 'Pension trusts',
	11: 'Rent', 12: 'Research and development', 13: 'Salaries, wages and allowances',
	14: 'SSS, GSIS, PhilHealth, HDMF and other contributions',
	15: 'Taxes and licenses', 16: 'Transportation and travel',
	'17a': 'Janitorial and messenger services', '17b': 'Professional fees',
	'17c': 'Security services', '17d': 'Other services', 18: 'Total ordinary allowable itemized deductions'
};
const activityIncomeLabels: Record<string, string> = {
	...incomeLabels,
	8: 'Total itemized deductions', 9: 'Net income or loss',
	10: 'Other non-operating income', 11: 'Other non-operating income',
	12: 'Total other non-operating income', 13: 'Total taxable income or loss',
	14: 'Applicable income tax rate (%)', 15: 'Income tax due'
};
const lossColumns: Record<string, string> = {
	Year: 'Year incurred', A: 'Net operating loss', B: 'Applied in prior years',
	C: 'Expired loss', D: 'Applied this year', E: 'Loss available to carry over'
};

function layout(field: IncomeEditorField, section: string, item: string, label: string, column?: string): Annual2018Layout {
	return {
		section, item: item.toUpperCase(), label: `${item.toUpperCase()} ${label}`, column,
		rowKey: `1701v2018:${field.page}:${section}:${item.toUpperCase()}`
	};
}

function personColumn(column: string, columnsPerPerson: number, regimes: string[]): Pick<IncomeEditorField, 'person'> & { column: string } {
	const index = column.charCodeAt(0) - 65;
	const person = index < columnsPerPerson ? 'taxpayer' : 'spouse';
	return { person, column: `${person === 'taxpayer' ? 'Taxpayer' : 'Spouse'} · ${regimes[index % columnsPerPerson]}` };
}

/** Column meanings follow the January 2018 HTA headings, independently of field-ID suffixes. */
export function annual2018EditorLayout(field: IncomeEditorField): Annual2018Layout {
	const name = field.id.split(':').at(-1)!;
	const baseAmount = name.match(/^txtPg[234]I(Shed[234]|Sc6|Part[78])_(\d+)[AB]$/);
	if (baseAmount) {
		const shortLabel = conciseAmountLabels[baseAmount[1]]?.[baseAmount[2]];
		if (shortLabel) return { shortLabel };
	}
	const reconciliation = name.match(/^txtPg4IPart9_(\d+)(Particulars|[AB])$/);
	if (reconciliation) {
		const [, item, column] = reconciliation;
		const row = Number(item);
		const add = row >= 2 && row <= 4;
		const less = row >= 6 && row <= 9;
		const label = add ? 'Non-deductible expense or other taxable income' :
			less ? 'Non-taxable income or income subject to final tax' :
			({ 1: 'Net income or loss per books', 5: 'Income after additions', 10: 'Total deductions from book income', 11: 'Net taxable income or loss' } as Record<string, string>)[item];
		return {
			...layout(field, 'Part IX · Reconciliation of income',
				item, label + (column === 'Particulars' ? ' description' : '')),
			person: column === 'Particulars' ? undefined : column === 'A' ? 'taxpayer' : 'spouse',
			...(row === 2 ? { subheading: 'Add: Non-deductible expenses and other taxable income' } :
				row === 6 ? { subheading: 'Less: Non-taxable income and income subject to final tax' } : {})
		};
	}
	const loss = name.match(/^txtPg[34]IShed6_(\d+)(Year|[A-E])$/);
	if (loss) {
		const [, item, column] = loss;
		const row = Number(item);
		if (row <= 3) return {
			...layout(field, 'Schedule 6 · Computation of net operating loss', item,
				({ 1: 'Gross income', 2: 'Ordinary allowable itemized deductions', 3: 'Net operating loss' } as Record<string, string>)[item]),
			person: column === 'A' ? 'taxpayer' : 'spouse'
		};
		const person = row <= 8 ? 'taxpayer' : 'spouse';
		const total = row === 8 || row === 13;
		return {
			...layout(field, `Schedule 6 · Loss carryover · ${person === 'taxpayer' ? 'Taxpayer' : 'Spouse'}`, item,
				total ? 'Total loss applied this year' : 'Net operating loss carryover',
				total ? 'Applied this year' : lossColumns[column]),
			person, kind: column === 'Year' ? 'number' : field.kind
		};
	}
	const baseSpecial = name.match(/^txtPg3IShed5_([1-6])(Desc|Legal|Amt)?$/);
	if (baseSpecial) {
		const [, item, column] = baseSpecial;
		return {
			...layout(field, field.section, item, column ? 'Special itemized deduction' : 'Total special deductions',
				column === 'Desc' ? 'Description' : column === 'Legal' ? 'Legal basis' : 'Amount'),
			person: Number(item) <= 3 ? 'taxpayer' : 'spouse'
		};
	}
	const service = name.match(/^txtPg3IShed4_(17[a-d])(Desc|[AB])$/);
	if (service) return {
		...layout(field, 'Schedule 4 · Ordinary itemized deductions', service[1],
			deductionLabels[service[1]] + (service[2] === 'Desc' ? ' description' : '')),
		person: service[2] === 'Desc' ? undefined : service[2] === 'A' ? 'taxpayer' : 'spouse'
	};
	if (name === 'rdoPg1m') return { label: 'Activities under exempt or special tax regimes', item: undefined, rowKey: undefined };
	if (name === 'Pg3mTaxRegimeTYPE') return { label: 'Activity tax regime', item: undefined, rowKey: undefined };
	const relief = name.match(/^txtPg1mI(\d)([A-F])SchdA$/);
	if (relief) return {
		...layout(field, 'Schedule A · Basis of tax relief', relief[1], reliefLabels[relief[1]]),
		...personColumn(relief[2], 3, ['Exempt', 'Special', 'Regular']),
		...(relief[1] === '4' ? { kind: 'percent' } : ['5', '6'].includes(relief[1]) ? { kind: 'date' } : {})
	};
	const consolidation = name.match(/^txtPg1mI(\d+)(Desc|[A-H])SchdB$/);
	if (consolidation) {
		const [, item, column] = consolidation;
		return {
			...layout(field, 'Schedule B · Consolidated income tax', item,
				incomeLabels[item] + (column === 'Desc' ? ' description' : '')),
			...(column === 'Desc' ? {} : personColumn(column, 4, ['Exempt', 'Special', 'Regular', 'Total']))
		};
	}
	const deductions = name.match(/^txtPg2mI(\d+[a-d]?)(Desc|[A-D])SchdC$/);
	if (deductions) {
		const [, item, column] = deductions;
		return {
			...layout(field, 'Schedule C · Consolidated ordinary itemized deductions', item,
				deductionLabels[item] + (column === 'Desc' ? ' description' : '')),
			...(column === 'Desc' ? {} : personColumn(column, 2, ['Exempt', 'Special']))
		};
	}
	const special = name.match(/^txtPg2mI([1-5])(Desc|LB|[AB])SchdD$/);
	if (special) {
		const [, item, column] = special;
		return {
			...layout(field, 'Schedule D · Consolidated special itemized deductions', item,
				item === '5' ? 'Total special itemized deductions' : 'Special itemized deduction',
				column === 'Desc' ? 'Description' : column === 'LB' ? 'Legal basis' : column === 'A' ? 'Taxpayer' : 'Spouse'),
			person: column === 'A' ? 'taxpayer' : column === 'B' ? 'spouse' : undefined
		};
	}
	const activity = name.match(/^txtPg[34]mSched([ABC])_(\d+[a-d]?)([AB])?TYPE$/);
	if (activity) {
		const [, schedule, item, column] = activity;
		const labels = schedule === 'A' ? { ...reliefLabels, 4: 'Tax rate (%)' } : schedule === 'B' ? activityIncomeLabels : deductionLabels;
		const section = schedule === 'A' ? 'Schedule A · Activity profile for tax relief' :
			schedule === 'B' ? 'Schedule B · Activity income tax computation' : 'Schedule C · Activity ordinary itemized deductions';
		return {
			...layout(field, section, item, labels[item] + (!column ? ' description' : ''), column ? column === 'A' ? 'Taxpayer' : 'Spouse' : undefined),
			person: column === 'A' ? 'taxpayer' : column === 'B' ? 'spouse' : undefined,
			...(schedule === 'A' && item === '4' || schedule === 'B' && item === '14' ? { kind: 'percent' } : schedule === 'A' && ['5', '6'].includes(item) ? { kind: 'date' } : {})
		};
	}
	const activitySpecial = name.match(/^txtPg4mSchedD([12])_(\d+)(.*)TYPE$/);
	if (activitySpecial) {
		const [, schedule, item, suffix] = activitySpecial;
		const person = schedule === '1' ? 'taxpayer' : 'spouse';
		const total = item === '5' || item === '10';
		const label = total ? 'Total special itemized deductions' : /LB/.test(suffix) ? 'Legal basis' : suffix ? 'Amount' : 'Deduction description';
		return {
			...layout(field, `Schedule D.${schedule} · Special deductions · ${person === 'taxpayer' ? 'Taxpayer' : 'Spouse'}`, item, label,
				total ? 'Amount' : /LB/.test(suffix) ? 'Legal basis' : suffix ? 'Amount' : 'Description'),
			...(!total ? { rowHeading: 'Special itemized deduction' } : {}),
			person
		};
	}
	return {};
}
