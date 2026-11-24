import type { IncomeEditorField } from './editor-layout';

export type Annual1701Reference = {
	label: string;
	target: string;
	multipleActivities?: true;
	activityRegime?: 'Exempt' | 'Special Rate';
};

type References = Record<string, Annual1701Reference[]>;

const prefix = 'frm1701:';
const june: References = {};
const january: References = {};

function add(references: References, from: string, label: string, target: string, options?: Pick<Annual1701Reference, 'multipleActivities' | 'activityRegime'>) {
	(references[prefix + from] ??= []).push({ label, target: prefix + target, ...options });
}

// June 2013 source anchors use globally numbered items and Schedule 1–9 totals.
for (const [column, person] of [['C1', 'A'], ['C2', 'B']]) {
	add(june, 'txtPg1Pt2I26IncomeTax', `From Item 72${person}`, `txtPg3Pt5I72TotalIncomeTax${column}`);
	add(june, 'txtPg1Pt2I27LessTotalTax', `From Item 76${person}`, `txtPg3Pt5I76TotalTax${column}`);

	const sourceAmounts = [
		['41GrossCompensation', `txtPg5Sc1I5${person}TotalComIncome`, `Schedule 1, Item 5${person}1`],
		['50NetSales', `txtPg5Sc2I5${person === 'A' ? 'TaxPayerC1' : 'SpouseC2'}`, `Schedule 2, Item 5${person}`],
		['51AddOther', `txtPg5Sc3I3${person === 'A' ? 'TaxPayerC1' : 'SpouseC2'}`, `Schedule 3, Item 3${person}`],
		['53LessCostSales', `txtPg6Sc4CI27${person === 'A' ? 'TaxPayerC1' : 'SpouseC2'}`, `Schedule 4, Item 27${person}`],
		['55AddNonOper', `txtPg6Sc5I6${person === 'A' ? 'TaxPayerC1' : 'SpouseC2'}`, `Schedule 5, Item 6${person}`],
		['57Ordinary', `txtPg7Sc6I40${person === 'A' ? 'TaxTotalPayerC1' : 'TotalSpouseC2'}`, `Schedule 6, Item 40${person}`],
		['58Special', `txtPg8Sc7I5${person === 'A' ? 'TaxPayer' : 'Spouse'}`, `Schedule 7, Item 5${person}`],
		['59Allowance', `txtPg8Sc8${person}1I8TotalNOLCO`, `Schedule 8${person}.1, Item 8`]
	];
	for (const [item, target, source] of sourceAmounts) {
		const amount = `txtPg2Pt4I${item}${column}`;
		add(june, amount, `From ${source}`, target);
		add(june, target, `To Part IV, Item ${item.match(/^\d+/)![0]}${person}`, amount);
	}

	add(june, `txtPg8Sc8${person}I3NetOperatingLoss`, `To Schedule 8${person}.1, Item 4A`, `txtPg8Sc8${person}1I4Amount`);
	add(june, `txtPg3Pt5I68RegularRate${column}`, `From Item 67${person}`, `txtPg2Pt4I67TaxDueRegular${column}`);
	add(june, `txtPg3Pt5I87LessTax${column}`, `From Item 67${person}`, `txtPg2Pt4I67TaxDueRegular${column}`);
	add(june, `txtPg3Pt5I73Regular${column}`, `From Schedule 9, Item 10${person}`, `txtPg9Sc9I10${person === 'A' ? 'TaxPayerC1' : 'SpouseC2'}`);
	add(june, `txtPg3Pt5I89AddSpecial${column}`, `From Schedule 9, Item 8${person}`, `txtPg9Sc9I8${person === 'A' ? 'TaxPayerC1' : 'SpouseC2'}`);
	add(june, `txtPg9Sc9I5${person === 'A' ? 'TaxPayerC1' : 'SpouseC2'}`, `From Schedule 1, Item 5${person}2`, `txtPg5Sc1I5${person}TotalTaxWithheld`);
	add(june, `txtPg9Sc9I10${person === 'A' ? 'TaxPayerC1' : 'SpouseC2'}`, `To Item 73${person}`, `txtPg3Pt5I73Regular${column}`);
	add(june, `txtPg3Pt5I72TotalIncomeTax${column}`, 'To Item 26', 'txtPg1Pt2I26IncomeTax');
	add(june, `txtPg3Pt5I76TotalTax${column}`, 'To Item 27', 'txtPg1Pt2I27LessTotalTax');
	add(june, person === 'A' ? 'txtPg5Sc4AI5TaxPayerC1' : 'txtPg5Sc4I5SpouseC2',
		`To Schedule 4, Item 27${person}`, `txtPg6Sc4CI27${person === 'A' ? 'TaxPayerC1' : 'SpouseC2'}`);

	const specialColumn = person === 'A' ? 'C2' : 'C6';
	const exemptColumn = person === 'A' ? 'C3' : 'C7';
	add(june, `txtPg3Pt5I69SpecialRate${column}`, `From Part IX, Item 18${person === 'A' ? 'B' : 'F'}`, `txtPg12Pt9I18TotalIncome${specialColumn}`);
	add(june, `txtPg3Pt5I74Special${column}`, `From Part IX, Item 19${person === 'A' ? 'B' : 'F'}`, `txtPg12Pt9I19TotalTaxCredits${specialColumn}`);
	add(june, `txtPg3Pt5I75Exempt${column}`, `From Part IX, Item 19${person === 'A' ? 'C' : 'G'}`, `txtPg12Pt9I19TotalTaxCredits${exemptColumn}`);
	add(june, `txtPg3Pt5I91SpecialTax${column}`, `From Part IX, Item 21${person === 'A' ? 'B' : 'F'}`, `txtPg12Pt9I21TaxRelief${specialColumn}`);
	add(june, `txtPg3Pt5I92ExemptTax${column}`, `From Part IX, Item 21${person === 'A' ? 'C' : 'G'}`, `txtPg12Pt9I21TaxRelief${exemptColumn}`);
	add(june, `txtPg12Pt9I21TaxRelief${specialColumn}`, `From Schedule C1, Item 8${person}`,
		`txtPg1mScC1I8TotalTaxReliefAvailment${column}TYPE`);
	add(june, `txtPg12Pt9I21TaxRelief${specialColumn}`, `To Part VI, Item 91${person}`, `txtPg3Pt5I91SpecialTax${column}`);
	add(june, `txtPg12Pt9I21TaxRelief${exemptColumn}`, `From Schedule C2, Item 11${person}`,
		`txtPg1mScC2I11TaxReliefAvailment${column}TYPE`);
	add(june, `txtPg12Pt9I21TaxRelief${exemptColumn}`, `To Part VI, Item 92${person}`, `txtPg3Pt5I92ExemptTax${column}`);

	// Part IX cites the regular computation separately from activity attachments.
	const regularColumn = person === 'A' ? 'C1' : 'C5';
	const regularSources = [
		['1Sales', '50NetSales', '50'], ['2Other', '51AddOther', '51'],
		['4LessCost', '53LessCostSales', '53'], ['6AddNon', '55AddNonOper', '55'],
		['8Ordinary', '57Ordinary', '57'], ['9Special', '58Special', '58'],
		['10Allowance', '59Allowance', '59'], ['14AddNet', '63AddNet', '63'],
		['16LessExcess', '65LessExcess', '65']
	];
	for (const [item, source, number] of regularSources) {
		add(june, `txtPg12Pt9I${item}${regularColumn}`, `From Part IV, Item ${number}${person}`, `txtPg2Pt4I${source}${column}`);
	}
	add(june, `txtPg12Pt9I18TotalIncome${regularColumn}`, `From Item 68${person}`, `txtPg3Pt5I68RegularRate${column}`);
	add(june, `txtPg12Pt9I19TotalTaxCredits${regularColumn}`, `From Schedule 9, Item 10${person}`, `txtPg9Sc9I10${person === 'A' ? 'TaxPayerC1' : 'SpouseC2'}`);
	add(june, `txtPg12Pt9I21TaxRelief${regularColumn}`, `From Item 90${person}`, `txtPg3Pt5I90RegularTax${column}`);
}
add(june, 'txtPg1Pt2I31TotalPenalties', 'From Item 84', 'txtPg3Pt5I84TotalPenalties');
for (const [source, target, number] of [
	['txtPg3Pt5I79LessPortion', 'txtPg1Pt2I29PortionTax', '29'],
	['txtPg3Pt5I84TotalPenalties', 'txtPg1Pt2I31TotalPenalties', '31'],
	['txtPg3Pt5I85TotalAmount', 'txtPg1Pt2I32TotalUponFiling', '32']
]) add(june, source, `To Item ${number}`, target);

// January 2018 citations restart numbering in each schedule and identify A/B owners.
for (const person of ['A', 'B']) {
	add(january, `txtPg1I22${person}TaxDue`, `From Part VI, Item 5${person}`, `txtPg4ISc6_5${person}`);
	add(january, `txtPg1I23${person}`, `From Part VII, Item 10${person}`, `txtPg4IPart7_10${person}`);
	add(january, `txtPg2IShed2_4${person}`, `From Schedule 1, Item 3${person}c`, `txtPg2IShed1c_3${person}CI`);
	add(january, `txtPg4IPart7_5${person}`, `From Schedule 1, Item 3${person}d`, `txtPg2IShed1c_3${person}TW`);
	add(january, `txtPg2IShed1c_3${person}CI`, `To Schedule 2, Item 4${person}`, `txtPg2IShed2_4${person}`);
	add(january, `txtPg2IShed1c_3${person}TW`, `To Part VII, Item 5${person}`, `txtPg4IPart7_5${person}`);
	const sourceAmounts = [
		['13', `txtPg3IShed4_18${person}`, `Schedule 4, Item 18${person}`],
		['14', `txtPg3IShed5_${person === 'A' ? '3' : '6'}`, `Schedule 5, Item ${person === 'A' ? '3' : '6'}`],
		['15', `txt${person === 'A' ? 'Pg3' : 'Pg4'}IShed6_${person === 'A' ? '8' : '13'}D`, `Schedule 6, Item ${person === 'A' ? '8' : '13'}`]
	];
	for (const [item, target, source] of sourceAmounts) {
		add(january, `txtPg2IShed3_${item}${person}`, `From ${source}`, target);
		add(january, target, `To Schedule 3.A, Item ${item}${person}`, `txtPg2IShed3_${item}${person}`);
	}
	add(january, `txtPg4ISc6_1${person}`, `From Schedule 3.A, Item 25${person}`, `txtPg2IShed3_25${person}`);
	add(january, `txtPg4ISc6_1${person}`, `From Schedule 3.B, Item 32${person}`, `txtPg3IShed3_32${person}`);
	add(january, `txtPg2IShed3_25${person}`, `To Part VI, Item 1${person}`, `txtPg4ISc6_1${person}`);
	add(january, `txtPg3IShed3_32${person}`, `To Part VI, Item 1${person}`, `txtPg4ISc6_1${person}`);
	add(january, `txtPg4ISc6_5${person}`, `To Part II, Item 22${person}`, `txtPg1I22${person}TaxDue`);
	add(january, `txtPg4IPart7_10${person}`, `To Part II, Item 23${person}`, `txtPg1I23${person}`);
	add(january, `txtPg4IPart8_6${person}`, `From Part VII, Item 8${person}`, `txtPg4IPart7_8${person}`);
	add(january, `txtPg4IPart7_8${person}`, `To Part VIII, Item 6${person}`, `txtPg4IPart8_6${person}`);

	const specialColumn = person === 'A' ? 'B' : 'F';
	add(january, `txtPg4ISc6_2${person}`, `From Part X, Item 17${specialColumn}`, `txtPg1mI17${specialColumn}SchdB`);
	add(january, `txtPg4IPart8_4${person}`, `From Part X, Item 17${specialColumn}`, `txtPg1mI17${specialColumn}SchdB`);
	add(january, `txtPg4IPart8_1${person}`, `From Part X, Item 16${specialColumn}`, `txtPg1mI16${specialColumn}SchdB`);
	add(january, `txtPg4IPart8_2${person}`, `From Part X, Item 7${specialColumn}`, `txtPg1mI7${specialColumn}SchdB`);
	const exemptColumn = person === 'A' ? 'A' : 'E';
	add(january, `txtPg4IPart8_8${person}`, `From Part X, Item 16${exemptColumn}`, `txtPg1mI16${exemptColumn}SchdB`);
	add(january, `txtPg4IPart8_9${person}`, `From Part X, Item 7${exemptColumn}`, `txtPg1mI7${exemptColumn}SchdB`);
	add(january, `txtPg3IShed6_3${person}`, `To Schedule 6.A.${person === 'A' ? '1, Item 7A' : '2, Item 12A'}`,
		`txt${person === 'A' ? 'Pg3' : 'Pg4'}IShed6_${person === 'A' ? '7' : '12'}A`);

	const regularColumn = person === 'A' ? 'C' : 'G';
	for (const [item, source] of [['1', '8'], ['2', '9'], ['4', '11'], ['6', '13'], ['7', '14'], ['8', '15'], ['12', '19'], ['13', '20'], ['14', '21']]) {
		add(january, `txtPg1mI${item}${regularColumn}SchdB`, `From Schedule 3.A, Item ${source}${person}`, `txtPg2IShed3_${source}${person}`);
	}
	add(january, `txtPg1mI17${regularColumn}SchdB`, `From Schedule 3.B, Item 31${person}`, `txtPg3IShed3_31${person}`);
	const reliefColumns = person === 'A' ? [['A', 'A'], ['B', 'B']] : [['E', 'C'], ['F', 'D']];
	for (const [activityColumn, deductionColumn] of reliefColumns) {
		add(january, `txtPg1mI6${activityColumn}SchdB`, `From Schedule C, Item 18${deductionColumn}`, `txtPg2mI18${deductionColumn}SchdC`);
		add(january, `txtPg1mI7${activityColumn}SchdB`, 'From Schedule D, Item 5', `txtPg2mI5${person}SchdD`);
		add(january, `txtPg2mI18${deductionColumn}SchdC`, `To Part X, Item 6${activityColumn}`, `txtPg1mI6${activityColumn}SchdB`);
		add(january, `txtPg2mI5${person}SchdD`, `To Part X, Item 7${activityColumn}`, `txtPg1mI7${activityColumn}SchdB`);
		for (const item of ['1', '2', '4', '6', '7']) {
			add(january, `txtPg1mI${item}${activityColumn}SchdB`, `From Part XI, Schedule B, Item ${item}${person}`,
				`txtPg3mSchedB_${item}${person}TYPE`, { multipleActivities: true });
		}
		add(january, `txtPg1mI17${activityColumn}SchdB`, `From Part XI, Schedule B, Item 15${person}`,
			`txtPg3mSchedB_15${person}TYPE`, { multipleActivities: true });
		for (const [item, activityItem] of [['12', '10'], ['13', '11']]) {
			add(january, `txtPg1mI${item}${activityColumn}SchdB`, `From Part XI, Schedule B, Item ${activityItem}${person}`,
				`txtPg3mSchedB_${activityItem}${person}TYPE`, { multipleActivities: true });
		}
		const activityRegime = activityColumn === exemptColumn ? 'Exempt' : 'Special Rate';
		for (const [activityItem, item] of [['1', '1'], ['2', '2'], ['4', '4'], ['6', '6'], ['7', '7'], ['10', '12'], ['11', '13'], ['15', '17']]) {
			add(january, `txtPg3mSchedB_${activityItem}${person}TYPE`, `To Part X, Item ${item}${activityColumn}`,
				`txtPg1mI${item}${activityColumn}SchdB`, { multipleActivities: true, activityRegime });
		}
	}
	add(january, `txtPg3mSchedB_6${person}TYPE`, `From Part XI, Schedule C, Item 18${person}`, `txtPg4mSchedC_18${person}TYPE`);
	add(january, `txtPg3mSchedB_7${person}TYPE`, `From Part XI, Schedule D.${person === 'A' ? '1' : '2'}, Item ${person === 'A' ? '5' : '10'}`,
		`txtPg4mSchedD${person === 'A' ? '1_5A' : '2_10B'}TYPE`);
	add(january, `txtPg4mSchedC_18${person}TYPE`, `To Part XI, Schedule B, Item 6${person}`, `txtPg3mSchedB_6${person}TYPE`);
	add(january, `txtPg4mSchedD${person === 'A' ? '1_5A' : '2_10B'}TYPE`, `To Part XI, Schedule B, Item 7${person}`, `txtPg3mSchedB_7${person}TYPE`);
}

const microSmall: References = {};
for (const [filer, schedule] of [['a', 'TP'], ['b', 'SP']]) {
	for (const [summary, source, item, part] of [
		['txtIncomeTaxDueNo19' + filer, 'TotalTaxDueCompensationA' + schedule, '18A', 'IV'],
		['txtIncomeTaxRegularNo22' + filer, 'TotalTaxDueCompensationB' + schedule, '18B', 'IV'],
		['txtIncomeTaxRegularNo22' + filer, 'txtCompensationBusinessNo25' + filer, '25', 'IV'],
		['txtTotalTaxCreditsPartIINo24' + filer, 'txtTotalTaxCreditsPaymentsPartVNo10' + filer, '10', 'V']
	]) {
		(microSmall['frm1701MS:' + summary] ??= []).push({ label: `From Part ${part}, Item ${item}`, target: 'frm1701MS:' + source });
	}
}

const quarterly: References = {};
for (const filer of ['A', 'B']) {
	for (const [summary, schedule, title] of [
		['26', '46', 'I'], ['26', '54', 'II'], ['27', '62', 'III'], ['29', '67', 'IV']
	]) {
		const from = `frm1701q:txt${summary}${filer}`;
		const target = `frm1701q:txt${schedule}${filer}`;
		(quarterly[from] ??= []).push({ label: `From Schedule ${title}, Item ${schedule}`, target });
		(quarterly[target] ??= []).push({ label: `To Part III, Item ${summary}`, target: from });
	}
}

export function annual1701References(code: string, fieldId: string): Annual1701Reference[] {
	const references = code === '1701' ? june : code === '1701v2018' ? january : code === '1701MS' ? microSmall : code === '1701Qv2018' ? quarterly : undefined;
	return references?.[fieldId] ?? [];
}

export function annual1701ReferenceOwner(field: Pick<IncomeEditorField, 'id' | 'person'>, joint: boolean) {
	if (field.person) return field.person === 'spouse' ? 'Spouse' : 'Taxpayer';

	// June Part IX is rendered as separate matrices, with four regime columns per filer.
	const column = /^frm1701:txtPg12Pt9I\d+.*C([1-8])$/.exec(field.id)?.[1];
	if (column) return Number(column) <= 4 ? 'Taxpayer' : 'Spouse';

	return joint ? 'Both filers' : 'Taxpayer';
}
