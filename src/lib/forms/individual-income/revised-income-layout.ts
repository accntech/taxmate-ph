import type { IncomeEditorField } from './editor-layout';
import { annual2018EditorLayout } from './annual-2018-editor-layout';
export { annual2018EditorLayout } from './annual-2018-editor-layout';

const msAmountLabels: Record<string, [string, string]> = {
	txtGross: ['1', 'Gross compensation income'], txtLessNonTaxable: ['2', 'Non-taxable or exempt compensation'],
	txtTaxableCompensationIncome: ['3', 'Taxable compensation income'], txtTaxpayerNo4: ['4', 'Tax due on compensation'],
	txtAllowableItemizedDeductionsNo10: ['10A', 'Ordinary allowable itemized deductions'],
	txtSpecialAllowableNo10: ['10B', 'Special allowable itemized deductions'], txtNetOperatingLossNo10: ['10C', 'Net operating loss carryover'],
	txtTotalAllowableItemixedDeductionsNo10: ['10D', 'Total itemized deductions'],
	txtNonOperatingIncomeNo13: ['13', 'Non-operating income'], txtTaxDueSpecial: ['17', 'Tax due at special or preferential rate'],
	TotalTaxDueCompensationA: ['18A', 'Total special-rate tax due'], TotalTaxDueCompensationB: ['18B', 'Total regular-rate tax due'],
	txtSalesRevenuesFeesANo19: ['19', 'Net sales, revenue, receipts or fees'],
	txtOtherNonOperatingIncomeNo20: ['20', 'Other non-operating income'], txtTotalIncomeNo21: ['21', 'Total income'],
	txtLess22: ['22', 'Less allowable reduction'],
	txtTaxableIncomeLoss23: ['23', 'Taxable income or loss'], txtTaxDueBusinessIncome24: ['24', 'Tax due at 8%'],
	txtCompensationBusinessNo25: ['25', 'Total tax due on compensation and business income'],
	txtTotalTaxCreditsPaymentsPartVNo10: ['10', 'Total tax credits and payments'],
	totalTaxReliefAvailment: ['11', 'Total tax relief']
};

export function revisedIncomeFieldKind(code: string, field: IncomeEditorField): string {
	if (code !== '1701MS') return field.kind;
	const name = field.id.replace('frm1701MS:', '');
	if (/^txtTaxRate[ab]$/.test(name)) return 'percent';
	if (field.page === '2' && !/^(?:txtPg2|Pg2TaxPayer|addForeign|addOther)/.test(name)) return 'money';
	if (field.page === '1' && /No(?:19|20|21|22|23|24|25|26|27|28|29)[ab]$|(?:Compromise28|AggregateAmountPayable30)[ab]$/.test(name)) return 'money';
	return field.kind;
}

export function revisedIncomeScheduleLayout(code: string, field: IncomeEditorField): Partial<IncomeEditorField> {
	const name = field.id.split(':').at(-1)!;
	let section = field.section;
	let item = field.item;
	let person = field.person;
	let label = field.label;
	if (code === '1701v2018') {
		const schedule = name.match(/^txtPg[234]I(?:Shed([234])_|Part([789])_)(\d+[a-d]?)(Desc|Specify|Particulars|[AB])$/);
		if (schedule) {
			const [, number, part, row, column] = schedule;
			item = row.toUpperCase();
			if (column === 'A' || column === 'B') person = column === 'A' ? 'taxpayer' : 'spouse';
			if (number === '2') section = 'Schedule 2 · Taxable compensation income';
			if (number === '3') section = name.includes('Pg3') ? 'Schedule 3.B · Business income at 8%' : 'Schedule 3.A · Business income at graduated rates';
			if (number === '3' && ['19', '20', '27', '29'].includes(row)) {
				const title = row === '29' ? 'Less allowable reduction' : 'Other non-operating income';
				label = `${item} ${title}${column === 'Desc' ? ' description' : ''}`;
			}
			if (number === '4') section = 'Schedule 4 · Ordinary itemized deductions';
			if (part === '7') section = 'Part VII · Tax credits and payments';
			if (part === '8') section = 'Part VIII · Tax relief';
			if (part === '9') section = 'Part IX · Reconciliation of income';
		}
		const special = name.match(/^txtPg3IShed5_([1-6])(Desc|Legal|Amt)?$/);
		if (special) {
			const [, row, column] = special;
			item = row;
			person = Number(row) <= 3 ? 'taxpayer' : 'spouse';
			section = `Schedule 5 · Special deductions · ${person === 'taxpayer' ? 'Taxpayer' : 'Spouse'}`;
			label = `${row} ${column === 'Desc' ? 'Deduction description' : column === 'Legal' ? 'Legal basis' : Number(row) % 3 === 0 ? 'Total special deductions' : 'Amount'}`;
		}
		const nolco = name.match(/^txtPg[34]IShed6_(\d+)(Year|[A-E])$/);
		if (nolco) {
			const [, row, column] = nolco;
			item = row;
			person = Number(row) <= 8 ? 'taxpayer' : 'spouse';
			section = `Schedule 6 · Loss carryover · ${person === 'taxpayer' ? 'Taxpayer' : 'Spouse'}`;
			label = `${row} ${Number(row) <= 3 ? ({ '1': 'Gross income', '2': 'Total deductions', '3': 'Net operating loss' } as Record<string, string>)[row] :
				row === '8' || row === '13' ? 'Total loss applied this year' : ({ Year: 'Year incurred', A: 'Net operating loss', B: 'Applied in prior years', C: 'Expired loss', D: 'Applied this year', E: 'Loss available to carry over' } as Record<string, string>)[column]}`;
		}
		const summary = name.match(/^txtPg4ISc6_([1-5])([AB])$/);
		if (summary) {
			item = summary[1]; person = summary[2] === 'A' ? 'taxpayer' : 'spouse';
			section = 'Part VI · Summary of income tax due';
		}
		const employerTotal = name.match(/^txtPg2IShed1c_3([AB])(CI|TW)$/);
		if (employerTotal) {
			item = `3${employerTotal[1]}`;
			person = employerTotal[1] === 'A' ? 'taxpayer' : 'spouse';
			section = 'Schedule 1 · Compensation totals';
			label = `${item} ${employerTotal[2] === 'CI' ? 'Gross compensation income' : 'Tax withheld'}`;
		}
		const employer = name.match(/^(?:txt|chk)Pg2IShed([12])a_(.*)$/);
		const employerAmount = name.match(/^txtPg2IShed1c_([12])(CI|TW)$/);
		if (employer || employerAmount) {
			const row = employer?.[1] ?? employerAmount![1];
			const control = employer?.[2] ?? employerAmount![2];
			section = `Schedule 1 · Employer ${row}`;
			item = row;
			label = `${row} ${control.endsWith('TPName') ? 'Employer name · Taxpayer' : control.endsWith('SName') ? 'Employer name · Spouse' :
				control === 'CI' ? 'Gross compensation income' : control === 'TW' ? 'Tax withheld' : /^TIN/.test(control) ? 'Employer TIN and branch code' :
				control === 'BranchCode' ? 'Employer branch code' : 'Income earner'}`;
			return { section, item, label, person: control.endsWith('TPName') ? 'taxpayer' : control.endsWith('SName') ? 'spouse' : undefined, optionalSection: row === '2',
				rowKey: `${code}:${section}:${/Name|TIN|Branch/.test(control) ? 'identity' : control === 'CI' || control === 'TW' ? 'amounts' : 'person'}` };
		}
	}
	if (code === '1701MS' && field.page === '1') {
		if (/^Part I - Taxpayer\/Filer and Spouse Information$/i.test(section)) section = 'Income and filing choices';
		const declarationLabels: Record<string, string> = {
			perjuryClause: 'I agree to the declaration',
			printedName: 'Printed name of taxpayer or authorized representative',
			authorizeRepresentative: 'Authorized representative’s TIN',
			txtPg1I33NumberOfAttachments: '35 Number of attachments'
		};
		if (declarationLabels[name]) {
			section = 'Declaration';
			label = declarationLabels[name];
		}
	}
	if (code === '1701MS' && field.page === '2') {
		if (/^(?:txtPg2|Pg2TaxPayer)/.test(name)) return {};
		if (/^Part V - Computation of Tax/i.test(section)) section = 'Part V · Tax credits and payments';
		if (/^addForeign/.test(name)) { item = '7'; label = '7 Foreign tax number'; }
		if (/^addOther/.test(name)) { item = '9'; label = '9 Other credit or payment description'; }
		if (field.kind === 'money') {
			person = /(?:b|B|SP|Spouse)$/.test(name) ? 'spouse' : 'taxpayer';
			const stem = name.replace(/(?:aSpouse|[abAB]|TP|SP)$/, '');
			const mapped = msAmountLabels[stem];
			if (mapped) { item = mapped[0]; label = `${item} ${mapped[1]}`; }
		}
		if (/^txtTaxRate[ab]$/.test(name)) {
			item = '16'; label = '16 Special or preferential tax rate (%)';
		}
		if (field.section.startsWith('Part IV')) {
			const row = Number.parseInt(item ?? '0');
			section = row <= 4 ? 'Part IV.A · Compensation income' : row >= 19 ? 'Part IV.B2 · Business income at 8%' : 'Part IV.B1 · Business income at graduated or special rates';
		}
	}
	if (code !== '1701MS' && code !== '1701v2018' && section === field.section && item === field.item && label === field.label && person === field.person) return {};
	const result = { section, item, label: label.replace(/ · (?:Taxpayer|Spouse)$/, ''), person, rowKey: `${code}:${field.page}:${section}:${item ?? field.id}` };
	return code === '1701v2018' ? { ...result, ...annual2018EditorLayout({ ...field, ...result }) } : result;
}
