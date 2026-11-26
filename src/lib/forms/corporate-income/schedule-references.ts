import type { CorporateField, CorporatePage } from './types';

type Transfer = readonly [receiving: string, supplying: string];

const legacyQuarterly: Transfer[] = [['txt28', 'txtMinCorpIncomeTax']];
const quarterly: Transfer[] = [
	['txtTax14', 'Sched2:txtTax13'],
	['txtTax17', 'Sched1:txtTax13B'],
	['txtTax19', 'Sched4:txtTax7'],
	['Sched2:txtTax12', 'Sched3:txtTax6']
];
const exempt: Transfer[] = [
	['txtPg1Pt2I18TaxDue', 'txtPg2Pt4I41TaxDue'],
	['txtPg1Pt2I19TotalTaxCrPmt', 'txtPg2Pt4I50TotalTaxCrPmt'],
	['txtPg1Pt2I20TotalOverpmt', 'txtPg2Pt4I51TotalOverpayment'],
	['txtPg2Pt4I35OrdinaryAllowable', 'txtPg3Pt6S1I18TotOrdinaryAllowableItemDeduc'],
	['txtPg2Pt4I36SpecialAllowable', 'txtPg3Pt6S2I5TotSpecialAllowedItemDeduc']
];
const legacyExempt: Transfer[] = [
	['txtPg1Pt2I20TotalIncome', 'txtPg2Pt4I41TotalIncome'],
	['txtPg2Pt4I31NetSales', 'txtPg3S1I6NetSales'],
	['txtPg2Pt4I32LessCost', 'txtPg3S2I27TotalCostSales'],
	['txtPg2Pt4I34AddOther', 'txtPg4S3I4TotalTaxIncome'],
	['txtPg2Pt4I36OrdinaryAllowable', 'txtPg5S4I40TotalAllowableDeduction'],
	['txtPg2Pt4I37SpecialAllowable', 'txtPg5S5I5TotalAllowable']
];
const regular: Transfer[] = [
	['txtPg1Pt2I14IncomeTax', 'txtPg2Pt4I43TotalIncomeTax'],
	['txtPg1Pt2I15TotalTaxCredits', 'txtPg2Pt4I55TotalTaxCredits'],
	['txtPg1Pt2I16NetTax', 'txtPg2Pt4I56NetTax'],
	['txtPg2Pt4I34OrdinaryAllowable', 'txtPg3Sc1I18TotalOrdinaryAllowable'],
	['txtPg2Pt4I35SpecialAllowable', 'txtPg3Sc2I5TotalSpecialAllowable'],
	['txtPg2Pt4I36Nolco', 'txtPg4Sc4I8TotalNOLCO'],
	['txtPg4Sc3AI4C2', 'txtPg4Sc3I3NetOperatingLoss'],
	['txtPg2Pt4I47ExcessMCIT', 'txtPg4Sc4I4TotalExcessMCIT']
];
const legacyRegular: Transfer[] = [
	['txtPg1Pt2I16IncomeTax', 'txtPg2Pt4I44TotalIncomeTax'],
	['txtPg1Pt2I17TotalTaxCredits', 'txtPg2Pt4I45LessTotalTax'],
	['txtPg1Pt2I18NetTax', 'txtPg2Pt4I46NetTax'],
	['txtPg1Pt2I19TotalPenalties', 'txtPg2Pt4I50TotalPenalties'],
	['txtPg1Pt2I20TotalAmount', 'txtPg2Pt4I51TotalAmount'],
	['txtPg2Pt4I31LessCost', 'txtPg3Sc2I27TotalSales'],
	['txtPg2Pt4I33AddOtherTaxable', 'txtPg4Sc3I4OtherTaxTotalAmount'],
	['txtPg2Pt4I35OrdinaryAllowable', 'txtPg5Sc4I40TotalOrdinaryAllowable'],
	['txtPg2Pt4I36SpecialAllowable', 'txtPg5Sc5I5TotalSpecialAllowable'],
	['txtPg2Pt4I37Nolco', 'txtPg5Sc6AI8TotalNOLCO'],
	['txtPg5Sc6AI4C2', 'txtPg5Sc6I3NetOperatingLoss'],
	['txtPg2Pt4I45LessTotalTax', 'txtPg6Sc7I12TotalTaxCredits']
];
const mixed: Transfer[] = [
	['txtPg2Sc2It10C', 'txtPg3IShed78D'],
	['txtPg2Sc2It10B', 'txtPg3IShed88D'],
	['txtPg3IShed7_7A', 'txtPg6Sc7I3'],
	['txtPg4IShed8_7A', 'txtPg4Sc8It3'],
	['txtPg1Pt2I14TotalIncome', 'txtPg2Sc2It19D'],
	['txtPg1Pt2I15LessTotalTax', 'txtPg2Sc3It32D'],
	['txtPg2Sc3It23C', 'txtPg7Sc9I4'],
	['txtPg2Sc4Itm6D', 'txtPg2Sc3It29D'],
	...['A', 'B', 'C'].flatMap((column): Transfer[] => [
		[`txtPg2Sc2Itm8${column}`, `txtPg3Sc5Itm18${column}`],
		[`txtPg2Sc2Itm9${column}`, `txtPg6Sc6I5C${column}`]
	])
];
const legacyMixed: Transfer[] = [
	['txtPg3Sc1I1CD', 'txtPg4Sc3I6CD'],
	['txtPg3Sc1I2CD', 'txtPg4Sc3CI27CD'],
	['txtPg3Sc1I4CD', 'txtPg5Sc4I4CD'],
	['txtPg3Sc1I6CD', 'txtPg6Sc5I40CD'],
	['txtPg3Sc1I7CD', 'txtPg6Sc6I5CD'],
	['txtPg3Sc2I6CD', 'txtPg7Sc8I10CD'],
	['txtPg6Sc8I4CD', 'txtPg7Sc9I4'],
	['txtPg3Sc1I8CC', 'txtPg6Sc7AI8'],
	['txtPg6Sc7AI4CA', 'txtPg6Sc7I3'],
	['txtPg1Pt2I16TotalIncome', 'txtPg2Pt5I37CD'],
	['txtPg1Pt2I17LessTotalTax', 'txtPg2Pt5I38CD'],
	['txtPg1Pt2I18NetTaxPayable', 'txtPg2Pt5I39CD'],
	['txtPg1Pt2I19TotalPenalties', 'txtPg2Pt5I43'],
	['txtPg1Pt2I20TotalAmount', 'txtPg2Pt5I44'],
	['txtPg2Pt5I37CD', 'txtPg3Sc1I16CD'],
	['txtPg2Pt5I38CD', 'txtPg7Sc8I13CD']
];

export type CorporateScheduleReference = { target: string; page: number; label: string };

export function corporateScheduleReferences(
	code: string,
	pages: CorporatePage[],
	applies: (field: CorporateField) => boolean,
	activityIds: string[] = []
): Map<string, CorporateScheduleReference[]> {
	const prefix = 'frm' + code.split('v')[0].replace('1702Q', '1702q') + ':';
	const transfers = code === '1702Qv2018C' ? quarterly
		: code.startsWith('1702Q') ? legacyQuarterly
		: code === '1702EX' ? legacyExempt : code.startsWith('1702EX') ? exempt
		: code === '1702RT' ? legacyRegular : code.startsWith('1702RT') ? regular
		: code === '1702MX' ? legacyMixed : mixed;
	const locations = new Map<string, { page: number; label: string }>();
	for (const [index, page] of pages.entries()) for (const section of page.sections) for (const row of section.rows) {
		for (const field of row.fields) {
			if (!applies(field) || locations.has(field.id)) continue;
			const attachment = page.title.match(/^(.+?) · Mandatory attachment /)?.[1];
			const heading = section.title.match(/^(?:Part [IVX]+|Schedule (?:\d+(?:\.\d+)?[A-Z]?|[IVXLCDM]+A?|[A-Z](?:\.\d+)?))\b/i)?.[0];
			const item = row.item || field.id.match(/(?:Itm|It|I)(\d+)/)?.[1];
			const column = field.column && section.columns?.[field.column - 1];
			const label = [heading || section.title || `Page ${index + 1}`, item && `Item ${item}`].filter(Boolean).join(', ');
			locations.set(field.id, {
				page: index + 1,
				label: [attachment, label, column].filter(Boolean).join(' · ')
			});
		}
	}
	const references = new Map<string, CorporateScheduleReference[]>();
	for (const [receiving, supplying] of [...transfers, ...activityTransfers(code, activityIds)]) {
		const to = prefix + receiving;
		const from = supplying === 'txtMinCorpIncomeTax' ? supplying : prefix + supplying;
		const receiver = locations.get(to);
		const supplier = locations.get(from);
		if (!receiver || !supplier) continue;
		references.set(to, [...references.get(to) ?? [], { target: from, page: supplier.page, label: `From ${supplier.label}` }]);
		references.set(from, [...references.get(from) ?? [], { target: to, page: receiver.page, label: `To ${receiver.label}` }]);
	}
	return references;
}

function activityTransfers(code: string, activityIds: string[]): Transfer[] {
	const legacy = code === '1702MX';
	return activityIds.flatMap((id): Transfer[] => {
		const column = id.startsWith('EX') ? 'A' : 'B';
		if (legacy) {
			return [
				...[1, 2, 3, 5].map((item): Transfer => [`txtPg4Sc3I${item}C${column}`, `txtPg2${id}ScDI${item}`]),
				[`txtPg1${id}ScBI8`, `txtPg4${id}ScIAI8CD`]
			];
		}
		return [
			[`txtPg2Sc2Itm1${column}`, `txtPg1${id}ScBI1`],
			[`txtPg2Sc2Itm2${column}`, `txtPg1${id}ScBI2`],
			[`txtPg2Sc2Itm4${column}`, `txtPg1${id}ScBI4`],
			[`txtPg2Sc2Itm6${column}`, `txtPg1${id}ScBI56`],
			[`txtPg2Sc2It10${column}`, `txtPg1${id}ScBI10`],
			[`txtPg1${id}ScBI10`, `txtPg2${id}ScF1I8D`],
			[`txtPg2${id}ScF1I7A`, `txtPg2${id}ScFI3`]
		];
	});
}
