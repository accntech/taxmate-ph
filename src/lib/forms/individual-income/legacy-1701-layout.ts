import type { IncomeEditorField } from './editor-layout';

const scheduleLabels: Record<string, string> = {
	"2:1": "Total Sales/Revenues/Receipts/Fees",
	"2:2": "Add: Gross Sales/Revenues/Fees not subject to Withholding Tax",
	"2:3": "Total Sales/Revenues/Receipts/Fees",
	"2:4": "Less: Sales Returns, Allowances and Discounts",
	"2:5": "Net Sales/Revenues/Receipts/Fees",
	"4A:1": "Merchandise Inventory, Beginning",
	"4A:2": "Add: Purchases of Merchandise",
	"4A:3": "Total Goods Available for Sale",
	"4A:4": "Less: Merchandise Inventory, Ending",
	"4A:5": "Cost of Sales",
	"4B:6": "Direct Materials, Beginning",
	"4B:7": "Add: Purchases of Direct Materials",
	"4B:8": "Material Available for Use",
	"4B:9": "Less: Direct Materials, Ending",
	"4B:10": "Raw Materials Used",
	"4B:11": "Direct Labor",
	"4B:12": "Manufacturing Overhead",
	"4B:13": "Total Manufacturing Cost",
	"4B:14": "Add: Work in Process, Beginning",
	"4B:15": "Less: Work in Process, Ending",
	"4B:16": "Cost of Goods Manufactured",
	"4B:17": "Add: Finished Goods, Beginning",
	"4B:18": "Less: Finished Goods, Ending",
	"4B:19": "Cost of Goods Manufactured & Sold",
	"4C:20": "Direct Charges - Salaries, Wages and Benefits",
	"4C:21": "Direct Charges - Materials, Supplies and Facilities",
	"4C:22": "Direct Charges - Depreciation",
	"4C:23": "Direct Charges - Rental",
	"4C:24": "Direct Charges - Outside Services",
	"4C:25": "Direct Charges - Others",
	"4C:26": "Total Cost of Services",
	"4C:27": "Total Cost of Sales/Services",
	"6:1": "Advertising and Promotions",
	"6:5": "Bad Debts",
	"6:6": "Charitable Contributions",
	"6:7": "Commissions",
	"6:8": "Communication, Light and Water",
	"6:9": "Depletion",
	"6:10": "Depreciation",
	"6:11": "Director's Fees",
	"6:12": "Fringe Benefits",
	"6:13": "Fuel and Oil",
	"6:14": "Insurance",
	"6:15": "Interest",
	"6:16": "Janitorial and Messengerial Services",
	"6:17": "Losses",
	"6:18": "Management and Consultancy Fee",
	"6:19": "Miscellaneous",
	"6:20": "Office Supplies",
	"6:21": "Other Services",
	"6:22": "Professional Fees",
	"6:23": "Rental",
	"6:24": "Repairs and Maintenance - Labor or Labor & Materials",
	"6:25": "Repairs and Maintenance - Materials/Supplies",
	"6:26": "Representation and Entertainment",
	"6:27": "Research and Development",
	"6:28": "Royalties",
	"6:29": "Salaries and Allowances",
	"6:30": "Security Services",
	"6:31": "SSS, GSIS, Philhealth, HDMF and Other Contributions",
	"6:32": "Taxes and Licenses",
	"6:33": "Tolling Fees",
	"6:34": "Training and Seminars",
	"6:35": "Transportation and Travel",
	"6:40": "Total Ordinary Allowable Itemized Deduction",
	"9:1": "Prior Year's Excess Credits",
	"9:2": "Tax Payments for the First Three Quarters",
	"9:3": "Creditable Tax Withheld for the First Three Quarters",
	"9:4": "Creditable Tax Withheld for the 4th Quarter",
	"9:5": "Creditable Tax Withheld per BIR Form No. 2316",
	"9:6": "Tax Paid in Return previously filed, If this is an Amended Return",
	"9:7": "Foreign Tax Credits, If applicable",
	"9:8": "Special Tax Credits, If applicable",
	"9:9": "Other Payments/Credits, specify",
	"9:10": "Total Tax Credits/Payments",
	"10:1": "Current Assets",
	"10:2": "Long-Term Investments",
	"10:3": "Property, Plant and Equipment - Net",
	"10:4": "Long Term Receivables",
	"10:5": "Intangible Assets",
	"10:6": "Other Assets",
	"10:7": "Total Assets",
	"10:8": "Current Liabilities",
	"10:9": "Long Term Liabilities",
	"10:10": "Deferred Credits",
	"10:11": "Other Liabilities",
	"10:12": "Total Liabilities",
	"10:13": "Capital, Beginning",
	"10:14": "Add: Net Income for the Year",
	"10:15": "Less: Drawings",
	"10:16": "Capital, Ending",
	"10:17": "Total Liabilities and Capital"
};

const computationLabels: Record<string, string> = {
	41: 'Gross compensation income', 42: 'Non-taxable or exempt compensation', 43: 'Gross taxable compensation',
	44: 'Health and hospitalization insurance premium', 45: 'Personal exemption', 46: 'Additional exemption',
	47: 'Total deductions', 48: 'Net taxable compensation', 49: 'Excess deductions',
	50: 'Net sales, revenue, receipts or fees', 51: 'Other taxable operating income', 52: 'Total sales and operating income',
	53: 'Cost of sales or services', 54: 'Gross business or professional income', 55: 'Non-operating income', 56: 'Total gross income',
	57: 'Ordinary itemized deductions', 58: 'Special itemized deductions', 59: 'Net operating loss carryover',
	60: 'Total itemized deductions', 61: '40% Optional Standard Deduction (OSD)', 62: 'Taxable business or professional income',
	63: 'Net taxable compensation', 64: 'Net taxable income', 65: 'Less: Excess deductions', 66: 'Total taxable income', 67: 'Regular income tax due',
	68: 'Regular income tax due', 69: 'Special income tax due', 70: 'Less: Other government agency share', 71: 'Net special income tax due',
	72: 'Total income tax due', 73: 'Regular tax credits and payments', 74: 'Special tax credits and payments', 75: 'Exempt tax credits and payments',
	76: 'Total tax credits and payments', 77: 'Net tax payable or overpayment', 78: 'Combined net tax payable or overpayment',
	79: 'Less: Second installment', 80: 'Net amount payable or overpayment', 81: 'Surcharge', 82: 'Interest', 83: 'Compromise',
	84: 'Total penalties', 85: 'Amount payable upon filing', 86: 'Regular income tax otherwise due', 87: 'Less: Regular tax due',
	88: 'Tax relief before special tax credits', 89: 'Special tax credits', 90: 'Regular tax relief', 91: 'Special tax relief',
	92: 'Exempt tax relief', 93: 'Total tax relief', 94: 'Combined tax relief'
};

const finalIncomeLabels: Record<string, string> = {
	1: 'Interest', 2: 'Royalties', 3: 'Dividends', 4: 'Prizes and winnings', 5: 'Fringe benefits', 6: 'Compensation at the 15% preferential rate',
	7: 'Property description', 8: 'OCT, TCT, CCT or tax declaration number', 9: 'Certificate authorizing registration number',
	10: 'Amount, fair market value or net capital gain', 11: 'Final tax withheld or paid', 12: 'Kind of shares and stock certificate series',
	13: 'Certificate authorizing registration number', 14: 'Number of shares', 15: 'Date of issue',
	16: 'Amount, fair market value or net capital gain', 17: 'Final tax withheld or paid', 18: 'Other income subject to final tax',
	19: 'Amount, fair market value or net capital gain', 20: 'Final tax withheld or paid', 21: 'Total final tax withheld or paid'
};
const exemptIncomeLabels: Record<string, string> = {
	1: 'Proceeds of life insurance', 2: 'Return of premium', 3: 'Retirement benefits, pensions and gratuities',
	4: 'Property description', 5: 'Mode of transfer', 6: 'Certificate authorizing registration number',
	7: 'Amount or fair market value', 8: 'Other exempt income or receipts', 9: 'Amount or fair market value', 10: 'Total exempt income or receipts'
};

function layout(field: IncomeEditorField, section: string, item: string, label: string, extra: Partial<IncomeEditorField> = {}): Partial<IncomeEditorField> {
	return {
		section, item, label: `${item} ${label}`,
		rowKey: `1701:${field.page}:${section}:${item}`,
		...extra
	};
}

/** Legacy monetary controls use the source's 12-character amount boxes, or 15-character balance-sheet boxes. */
export function legacy1701FieldKind(field: IncomeEditorField): string {
	if (/NumberOfShares/.test(field.id)) return 'text';
	if (field.kind === 'text' && (field.maxLength === 12 || /^frm1701:txtPg9Sc10/.test(field.id))) return 'money';
	return field.kind;
}

export function legacy1701ScheduleLayout(field: IncomeEditorField): Partial<IncomeEditorField> {
	const name = field.id.replace('frm1701:', '');
	const item = field.item ?? name.match(/I(\d+)/)?.[1] ?? '';
	const profileCode = name.match(/^txtPg1Pt1I(18PSIC|19PSOC)$/);
	if (profileCode) {
		const industry = profileCode[1] === '18PSIC';
		return layout(field, field.section, industry ? '18' : '19', industry ? 'Industry code (PSIC)' : 'Occupation code (PSOC)');
	}
	if (name === 'txtPg1Pt1I21Others') return layout(field, field.section, '21', 'Other accounting method');
	const computation = name.match(/^txtPg[23]Pt[45]I(\d+)/);
	if (computation) {
		const amountItem = computation[1];
		return layout(field, field.section, amountItem, computationLabels[amountItem], {
			person: /C[12]$/.test(name) || /^txtPg3Pt5I88TaxRelief[12]$/.test(name)
				? (/[C]?2$/.test(name) ? 'spouse' : 'taxpayer') : undefined
		});
	}
	const employer = name.match(/^(?:txt|rdo)Pg5Sc1I([1-4])(.*)$/);
	if (employer) {
		const [, number, control] = employer;
		const section = `Schedule 1 · Employer ${number}`;
		const label = control === 'NameOfEmp' ? 'Employer name' : control === 'TaxpayerSpouse' ? 'Income earner' :
			control === 'ComIncomeC2' ? 'Gross compensation income' : control === 'TaxWithheldC3' ? 'Tax withheld' :
			control === 'EmpTIN4C1' ? 'Employer branch code' : `Employer TIN, ${['first', 'middle', 'last'][Number(control.match(/TIN(\d)/)?.[1]) - 1]} three digits`;
		return layout(field, section, number, label, {
			person: undefined,
			rowKey: `1701:5:${section}:${control === 'TaxpayerSpouse' ? 'person' : /Income|Withheld/.test(control) ? 'amounts' : 'identity'}`,
			optionalSection: number !== '1'
		});
	}
	const employerTotal = name.match(/^txtPg5Sc1I5([AB])Total(ComIncome|TaxWithheld)$/);
	if (employerTotal) return layout(field, 'Schedule 1 · Compensation totals', employerTotal[1] === 'A' ? '5A' : '5B',
		employerTotal[2] === 'ComIncome' ? 'Gross compensation income' : 'Tax withheld', {
			person: employerTotal[1] === 'A' ? 'taxpayer' : 'spouse', rowHeading: employerTotal[1] === 'A' ? 'Taxpayer totals' : 'Spouse totals'
		});
	const sales = name.match(/^txtPg5Sc2I(\d+)/);
	if (sales) return layout(field, 'Schedule 2 · Sales and receipts', sales[1], scheduleLabels[`2:${sales[1]}`]);
	const schedule = name.match(/^txtPg\d+Sc(3|4A|4B|4C|4|5|6|7|9|10)I(\d+)/);
	if (schedule) {
		const [, rawSchedule, number] = schedule;
		const scheduleNumber = rawSchedule === '4' ? '4A' : rawSchedule;
		const labels: Record<string, string> = {
			3: number === '3' ? 'Total other taxable operating income' : 'Other taxable operating income',
			5: number === '6' ? 'Total non-operating income' : 'Non-operating income',
			6: Number(number) < 5 && Number(number) > 1 ? 'Amortization' : Number(number) >= 36 && Number(number) <= 39 ? 'Other ordinary deduction' : '',
			7: number === '5' ? 'Total special itemized deductions' : 'Special itemized deduction'
		};
		const description = /Description|Amortizations/.test(name);
		const label = scheduleLabels[`${scheduleNumber}:${number}`] || labels[scheduleNumber] || field.label.replace(/^\d+\s*/, '').replace(/ · (?:Taxpayer|Spouse)$/, '');
		if (rawSchedule === '5' && Number(number) <= 5) {
			if (name.endsWith('NatureOfIncome')) return layout(field, field.section, number, `${label} description`);
			return layout(field, field.section, number, field.person === 'spouse' ? 'Spouse amount' : 'Taxpayer amount');
		}
		if (scheduleNumber === '7') {
			const column = description ? 'Description' : /LegalBasis/.test(name) ? 'Legal basis' : name.endsWith('Spouse') ? 'Spouse' : 'Taxpayer';
			return layout(field, 'Schedule 7 · Special deductions', number, label, { column, person: column === 'Spouse' ? 'spouse' : column === 'Taxpayer' ? 'taxpayer' : undefined });
		}
		return layout(field, field.section, number, description ? `${label} description` : /LegalBasis/.test(name) ? 'Legal basis' : label);
	}
	const dependent = name.match(/^(?:txt|chk)Pg4Pt7A(LastName|FirstMiddleName|MiddleName|Month|Incapacitated)([1-4])$/);
	if (dependent) {
		const [, control, number] = dependent;
		const label = { LastName: 'Last name', FirstMiddleName: 'First name', MiddleName: 'Middle name', Month: 'Date of birth', Incapacitated: 'Mentally or physically incapacitated' }[control]!;
		return layout(field, `Part VIIA · Dependent ${number}`, number, label, {
			person: undefined, optionalSection: number !== '1', rowKey: `1701:4:dependent:${number}:${/Name/.test(control) ? 'name' : 'eligibility'}`
		});
	}
	const address = name.match(/^txtPg4Pt7B(.*)$/);
	if (address) {
		const labels: Record<string, [string, string]> = {
			Unit: ['1', 'Unit, room or floor'], Building: ['1', 'Building name'], Lot1: ['2', 'Lot number'], Lot2: ['2', 'Block number'],
			Lot3: ['2', 'Phase number'], Lot4: ['2', 'House number'], Street: ['3', 'Street'], Subdivision: ['3', 'Subdivision or village'],
			Barangay: ['4', 'Barangay'], City: ['4', 'Municipality or city'], Province: ['5', 'Province'], ZipCode: ['5', 'ZIP code']
		};
		const [number, label] = labels[address[1]];
		return layout(field, 'Part VIIB · Current address', number, label, { person: undefined });
	}
	if (name === 'txtPg4Pt8I112ExernalEditor') return layout(field, field.section, '112', 'External auditor or accredited tax agent');
	if (name === 'txtPg4Pt8I114SigningPartner') return layout(field, field.section, '114', 'Signing partner');
	if (name === 'txtPg4Pt8I117Month') return layout(field, field.section, '117', 'Accreditation issue date');
	if (name === 'txtPg4Pt8I118Month') return layout(field, field.section, '118', 'Accreditation expiry date');
	const reconciliation = name.match(/^txtPg10Sc11([AB])I(\d+)(.*)$/);
	if (reconciliation) {
		const [, person, number, control] = reconciliation;
		const description = control.endsWith('C1') && !/NetIncome/.test(control);
		const label = description ? 'Adjustment description' : ({
			1: 'Net income per books', 2: 'Taxable income excluded from books', 3: 'Taxable income excluded from books',
			4: 'Total additions', 5: 'Non-taxable income included in books', 6: 'Non-taxable income included in books',
			7: 'Special deductions', 8: 'Special deductions', 9: 'Total deductions', 10: 'Net taxable income or loss'
		} as Record<string, string>)[number];
		return layout(field, field.section, number, label, { person: person === 'B' ? 'spouse' : 'taxpayer' });
	}
	const operatingLoss = name.match(/^txtPg8Sc8([AB])I([1-3])/);
	if (operatingLoss) {
		const [, filer, number] = operatingLoss;
		const person = filer === 'A' ? 'taxpayer' : 'spouse';
		const label = { '1': 'Gross income', '2': 'Ordinary allowable itemized deductions', '3': 'Net operating loss' }[number]!;
		return layout(field, `Schedule 8${filer} · Computation of net operating loss · ${person === 'taxpayer' ? 'Taxpayer' : 'Spouse'}`,
			number, label, { person, column: 'Amount' });
	}
	const carryover = name.match(/^txtPg8Sc8([AB])1I([4-8])(.*)$/);
	if (carryover) {
		const [, filer, number, control] = carryover;
		const person = filer === 'A' ? 'taxpayer' : 'spouse';
		const section = `Schedule 8${filer}.1 · Loss carryover · ${filer === 'A' ? 'Taxpayer' : 'Spouse'}`;
		const columns: Record<string, string> = {
			YearIncurred: 'Year incurred', Amount: 'Net operating loss', AppliedPreviousYear: 'Applied in prior years',
			NOLCOExpired: 'Expired loss', NOLCOAppliedCurrentYear: 'Applied this year', NetOperatingLoss: 'Available to carry over',
			TotalNOLCO: 'Applied this year'
		};
		return layout(field, section, number, number === '8' ? 'Total loss applied this year' : 'Loss carryover', {
			column: columns[control], person
		});
	}
	const supplemental = name.match(/^(?:txt|ddl)Pg11Sc12([AB])I(\d+)(.*)$/);
	if (supplemental) {
		const [, schedule, number, control] = supplemental;
		const numericItem = Number(number);
		const transaction = /C([12])$/.exec(control)?.[1];
		let section = schedule === 'A' ? 'Schedule 12A · Income subject to final tax' : 'Schedule 12B · Exempt income';
		if (schedule === 'A' && numericItem >= 7 && numericItem <= 11) section = 'Schedule 12A · Real property transactions';
		if (schedule === 'A' && numericItem >= 12 && numericItem <= 17) section = 'Schedule 12A · Share transactions';
		if (schedule === 'A' && numericItem >= 18 && numericItem <= 20) section = 'Schedule 12A · Other final-tax income';
		if (schedule === 'B' && numericItem >= 4 && numericItem <= 7) section = 'Schedule 12B · Property received';
		if (schedule === 'B' && numericItem >= 8 && numericItem <= 9) section = 'Schedule 12B · Other exempt income';
		let label = (schedule === 'A' ? finalIncomeLabels : exemptIncomeLabels)[number];
		if (schedule === 'A' && numericItem <= 6) label = /FinalTax/.test(control) ? 'Final tax withheld or paid' : numericItem === 1 && control.endsWith('C1') ? 'Exempt interest' : 'Income amount';
		if (schedule === 'A' && numericItem === 12) label = name.startsWith('ddl') ? 'Kind of shares' : 'Stock certificate series number';
		const entry = transaction && (schedule === 'A' ? numericItem >= 7 && numericItem <= 20 : numericItem >= 4 && numericItem <= 9);
		const entryLabel = entry ? `${label} · Entry ${transaction}` : label;
		const incomeColumn = schedule === 'A' && numericItem <= 6
			? /FinalTax/.test(control) ? 'Final tax withheld or paid' : numericItem === 1 && control.endsWith('C1') ? 'Exempt amount' : 'Income amount'
			: undefined;
		return layout(field, section, number, entryLabel, {
			person: undefined, optionalSection: numericItem >= 7 && numericItem <= 20,
			rowHeading: schedule === 'A' && numericItem <= 6 ? finalIncomeLabels[number] : undefined,
			shortLabel: entryLabel, column: incomeColumn
		});
	}
	if (field.page === '12' && /Pt9I/.test(name)) {
		const labels: Record<string, string> = {
			1: 'Sales, revenue, receipts or fees', 2: 'Other operating income', 3: 'Total sales and operating income',
			4: 'Cost of sales or services', 5: 'Gross business or professional income', 6: 'Non-operating income', 7: 'Total gross income',
			8: 'Ordinary itemized deductions', 9: 'Special itemized deductions', 10: 'Net operating loss carryover',
			11: 'Total itemized deductions', 13: 'Taxable business or professional income', 14: 'Net taxable compensation',
			15: 'Net taxable income', 16: 'Less: Excess deductions', 17: 'Total taxable income', 18: 'Total income tax due',
			19: 'Less: Tax credits and payments', 20: 'Net tax payable or overpayment', 21: 'Total tax relief'
		};
		return layout(field, 'Part IX · Consolidated income tax', item, labels[item], { person: undefined });
	}
	return {};
}
