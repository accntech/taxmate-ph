import legacyTemplates from './templates/fields.json';
import { revisedActivityFieldId, revisedActivityRegime, revisedActivityRegimeApplies, revisedActivitySlots, usesRevisedActivityAttachments } from './annual-2018-activities';

export type Worksheet = {
	read: (name: string) => number;
	copy: (target: string, source: string) => void;
	total: (target: string, sources: string[]) => void;
	derive: (target: string, sources: string[], amount: () => number) => void;
};

const items = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, index) => start + index);
const ordinaryItems = [...items(1, 16), '17a', '17b', '17c', '17d'];
const januaryRegimes = ['Exempt', 'Special Rate'] as const;
const januaryFilers = [
	{ column: 'A', spouse: false, reliefSection: '1', firstReliefItem: 1, incomeColumns: ['A', 'B'], ordinaryColumns: ['A', 'B'] },
	{ column: 'B', spouse: true, reliefSection: '2', firstReliefItem: 6, incomeColumns: ['E', 'F'], ordinaryColumns: ['C', 'D'] }
] as const;
const januaryIncomeRollups = [[1, 1], [2, 2], [4, 4], [6, 6], [7, 7], [12, 10], [13, 11], [17, 15]] as const;
const januaryOtherIncome = [[12, 10], [13, 11]] as const;
const scheduleB = (item: number, column: string) => `txtPg1mI${item}${column}SchdB`;
const scheduleC = (item: number | string, column: string) => `txtPg2mI${item}${column}SchdC`;
const scheduleD = (item: number, column: string) => `txtPg2mI${item}${column}SchdD`;
const partXiIncome = (item: number, column: string) => `txtPg3mSchedB_${item}${column}TYPE`;
const partXiExpense = (item: number | string, column: string) => `txtPg${Number(item) <= 3 ? 3 : 4}mSchedC_${item}${column}TYPE`;
const partXiRelief = (section: string, item: number, column: string) => `txtPg4mSchedD${section}_${item}${column}TYPE`;
const localActivityField = (template: string, slot: string) =>
	revisedActivityFieldId(`frm1701:${template}`, slot).slice('frm1701:'.length);

function calculateRevisedActivity(sheet: Worksheet, slot: string, activityRegime?: 'Exempt' | 'Special Rate') {
	const { read, copy, total, derive } = sheet;
	for (const { column, reliefSection, firstReliefItem } of januaryFilers) {
		const income = (item: number) => localActivityField(partXiIncome(item, column), slot);
		const expense = (item: number | string) => localActivityField(partXiExpense(item, column), slot);
		const relief = (item: number) => localActivityField(partXiRelief(reliefSection, item, column), slot);
		const reliefTotal = relief(firstReliefItem + 4);
		total(expense(18), ordinaryItems.map(expense));
		total(reliefTotal, items(firstReliefItem, firstReliefItem + 3).map(relief));
		copy(income(6), expense(18));
		copy(income(7), reliefTotal);

		const difference = (target: number, left: number, right: number) =>
			derive(income(target), [income(left), income(right)], () => read(income(left)) - read(income(right)));
		difference(3, 1, 2);
		difference(5, 3, 4);
		total(income(8), [income(6), income(7)]);
		difference(9, 5, 8);
		total(income(12), [income(10), income(11)]);
		total(income(13), [income(9), income(12)]);
		const base = income(5);
		const rate = income(14);
		derive(income(15), [base, income(13), rate], () => activityRegime === 'Special Rate' ? read(base) * read(rate) / 100 : 0);
	}
}

const revisedRollups = new Set([
	...januaryFilers.flatMap(({ column, incomeColumns, ordinaryColumns }) => [
		...incomeColumns.flatMap(incomeColumn => januaryIncomeRollups.map(([item]) => scheduleB(item, incomeColumn))),
		...ordinaryColumns.flatMap(ordinaryColumn => [...ordinaryItems, 18].map(item => scheduleC(item, ordinaryColumn))),
		...items(1, 5).map(item => scheduleD(item, column))
	]),
	...januaryOtherIncome.map(([item]) => scheduleB(item, 'Desc')),
	scheduleC('17d', 'Desc'),
	...items(1, 4).flatMap(item => [scheduleD(item, 'Desc'), scheduleD(item, 'LB')])
]);

export function isRevisedActivityRollupField(id: string): boolean {
	return id.startsWith('frm1701:') && revisedRollups.has(id.slice('frm1701:'.length));
}

export function calculateRevisedActivities(
	sheet: Worksheet & { set: (name: string, amount: number) => number; setText: (name: string, value: string) => void },
	values: Record<string, string>,
	joint: boolean
) {
	const { read, total, set, setText } = sheet;
	const slots = revisedActivitySlots(values);
	for (const slot of slots) calculateRevisedActivity(sheet, slot, revisedActivityRegime(values, slot));
	if (usesRevisedActivityAttachments(values, joint)) {
		const textSources = new Map<string, string[]>();
		const collectText = (target: string, template: string, sources: string[]) => {
			const fields = textSources.get(target) ?? [];
			fields.push(...sources.map(slot => localActivityField(template, slot)));
			textSources.set(target, fields);
		};
		const rollup = (target: string, template: string, sources: string[]) => {
			set(target, sources.reduce((sum, slot) => sum + read(localActivityField(template, slot)), 0));
		};
		for (const { column, spouse, reliefSection, firstReliefItem, incomeColumns, ordinaryColumns } of januaryFilers) {
			const filerSlots = slots.filter(slot => {
				const regime = revisedActivityRegime(values, slot);
				return (!spouse || joint) && regime && revisedActivityRegimeApplies(values, spouse, regime);
			});
			for (const [index, regime] of januaryRegimes.entries()) {
				const regimeSlots = filerSlots.filter(slot => revisedActivityRegime(values, slot) === regime);
				for (const [target, source] of januaryIncomeRollups)
					rollup(scheduleB(target, incomeColumns[index]), partXiIncome(source, column), regimeSlots);
				for (const item of ordinaryItems)
					rollup(scheduleC(item, ordinaryColumns[index]), partXiExpense(item, column), regimeSlots);
			}
			for (const item of items(1, 4)) {
				const activityItem = firstReliefItem + item - 1;
				rollup(scheduleD(item, column), partXiRelief(reliefSection, activityItem, column), filerSlots);
				collectText(scheduleD(item, 'Desc'), partXiRelief(reliefSection, activityItem, ''), filerSlots);
				// The source uses the distinct LBB identifier for spouse Item 8.
				const basisColumn = spouse && activityItem === 8 ? 'LBB' : `${column}LB`;
				collectText(scheduleD(item, 'LB'), partXiRelief(reliefSection, activityItem, basisColumn), filerSlots);
			}
			for (const [target, source] of januaryOtherIncome)
				collectText(scheduleB(target, 'Desc'), partXiIncome(source, ''), filerSlots);
			collectText(scheduleC('17d', 'Desc'), partXiExpense('17d', ''), filerSlots);
		}
		for (const [target, sources] of textSources)
			setText(target, sources.some(source => values[`frm1701:${source}`]?.trim()) ? 'OTHERS' : '');
	}
	for (const column of ['A', 'B', 'C', 'D'])
		total(scheduleC(18, column), ordinaryItems.map(item => scheduleC(item, column)));
	for (const column of ['A', 'B'])
		total(scheduleD(5, column), items(1, 4).map(item => scheduleD(item, column)));
}

const juneOrdinary = legacyTemplates['1701'].map(field => field.id.slice('frm1701:'.length))
	.filter(name => /^txtPg[34]mScHI/.test(name) && !name.includes('I40Total'));
const preferredAgencies = new Set(['PEZA', 'ECOZONE', 'BCDA', 'SBMA', 'CDC', 'PPMC', 'JHSEZ', 'MSEZ', 'CEZA', 'ZCSEZA', 'APECO', 'AFAB', 'TEZ', 'EPZA', 'MEPZA']);
const preferredLaws = new Set(['7227', '9400', '7916', '8748', '7922', '7903', '9490', '10083', '9728', '9593']);

export function calculateJuneActivities(
	sheet: Worksheet,
	regime: string,
	active: (person: 'taxpayer' | 'spouse', regime: string) => boolean,
	text: (name: string) => string,
	graduatedTax: (income: number) => number
) {
	const { read, copy, total, derive } = sheet;
	const difference = (target: string, before: string, deduction: string) =>
		derive(target, [before, deduction], () => read(before) - read(deduction));
	for (const person of ['taxpayer', 'spouse'] as const) {
		const taxpayer = person === 'taxpayer';
		const column = taxpayer ? 'C1' : 'C2';
		const amountColumn = taxpayer ? 'C2' : 'C3';
		const activity = (name: string) => `txtPg${name}${column}TYPE`;
		const b = (name: string) => activity('1mScBI' + name);
		const c1 = (name: string) => activity('1mScC1I' + name);
		const c2 = (name: string) => activity('1mScC2I' + name);
		const d = (name: string) => activity('2mScDI' + name);
		const f1 = (name: string) => activity('2mScF1I' + name);
		const f2 = (name: string) => activity('2mScF2I' + name);
		const f3 = (name: string) => activity('3mScF3I' + name);
		const j = (name: string) => activity('5mScJI' + name);
		const k = (name: string) => activity('5mScKI' + name);

		total(d('3TotalSales'), [d('1TotalSales'), d('2GrossSales')]);
		difference(d('5NetSales'), d('3TotalSales'), d('4LessSalesReturns'));
		copy(b('1NetSales'), d('5NetSales'));
		const operating = activity('2mScEI3TotalOtherTaxableIncome');
		total(operating, [1, 2].map(item => `txtPg2mScEI${item}${amountColumn}TYPE`));
		copy(b('2AddOtherIncome'), operating);
		total(f1('3TotalMerchandise'), [f1('1MerchandiseInventory'), f1('2AddPurchaseofMerchandise')]);
		difference(f1('5CostofSales'), f1('3TotalMerchandise'), f1('4LessMerchandiseInventory'));
		total(f2('8MaterialAvailable'), [f2('6DirectMaterials'), f2('7AddPurchasesofDirectMaterials')]);
		difference(f2('10RawMaterials'), f2('8MaterialAvailable'), f2('9LessDirectMaterials'));
		total(f2('13TotalManufacturingCost'), [f2('10RawMaterials'), f2('11DirectLabor'), f2('12ManufacturingOverhead')]);
		for (const [target, first, add, subtract] of [
			['16CostofGoodsManufactured', '13TotalManufacturingCost', '14AddWorkInProcess', '15LessWorkInProcess'],
			['19CostofGoodsManufacturedandSold', '16CostofGoodsManufactured', '17AddFinishedGoods', '18LessFinishedGoods']
		]) {
			const sources = [first, add, subtract].map(f2);
			derive(f2(target), sources, () => read(sources[0]) + read(sources[1]) - read(sources[2]));
		}
		total(f3('26CostOfServices'), items(20, 25).map(item => f3(`${item}DirectCharges`)));
		total(f3('27TotalCostOfSales'), [f1('5CostofSales'), f2('19CostofGoodsManufacturedandSold'), f3('26CostOfServices')]);
		copy(b('4LessCostOfSales'), f3('27TotalCostOfSales'));
		const nonOperating = activity('3mScGI6TotalNonOperatingIncome');
		total(nonOperating, items(1, 5).map(item => `txtPg3mScGI${item}${amountColumn}TYPE`));
		copy(b('6AddNonOperatingIncome'), nonOperating);
		const ordinary = activity('4mScHI40TotalOrdinaryDeduction');
		total(ordinary, juneOrdinary.filter(name => name.endsWith(
			/ScHI(?:[234]Amortization|3[6-9]C)/.test(name) ? amountColumn + 'TYPE' : column + 'TYPE'
		)));
		copy(b('8OrdinaryAllowableDeductions'), ordinary);
		const special = activity('4mScII5TotalSpecialDeductions');
		total(special, items(1, 4).map(item => `txtPg4mScII${item}${taxpayer ? 'C3' : 'C4'}TYPE`));
		copy(b('9SpecialAllowableDeductions'), special);
		const credits = ['1PriorYearsExcessCredits', '2TaxPayments', '3CreditableTaxThreeQuarters',
			'4CreditableTaxFourthQuarter', '5TaxWithheld', '6TaxPaid', '7ForeignTaxCredits', '8SpecialTaxCredits', '9OtherPayments'];
		total(j('10TotalTaxCredits'), credits.map(j));
		total(k('4Total'), [k('1NetIncome'), k('2'), k('3')]);
		total(k('9Total'), items(5, 8).map(item => k(String(item))));
		difference(k('10NetTaxableIncomeLoss'), k('4Total'), k('9Total'));

		total(b('3TotalSales'), [b('1NetSales'), b('2AddOtherIncome')]);
		difference(b('5GrossIncome'), b('3TotalSales'), b('4LessCostOfSales'));
		total(b('7TotalGrossIncome'), [b('5GrossIncome'), b('6AddNonOperatingIncome')]);
		total(b('10TotalAllowableDeductions'), [b('8OrdinaryAllowableDeductions'), b('9SpecialAllowableDeductions')]);
		difference(b('11TotalIncome'), b('7TotalGrossIncome'), b('10TotalAllowableDeductions'));

		const specialRate = activity('1mScAI4ISpecialTaxRate');
		const agency = text(activity('1mScAI1InvestmentPromotion')).trim().toUpperCase();
		const legalBasis = text(activity('1mScAI2LegalBasis')).toUpperCase().replace(/[.\s]/g, '').replace(/^RA/, '');
		const preferred = preferredAgencies.has(agency) || preferredLaws.has(legalBasis);
		const taxBase = preferred ? b('7TotalGrossIncome') : b('11TotalIncome');
		copy(c1('1TaxableIncome'), b('11TotalIncome'));
		copy(c1('2AddSpecialAllowableDeductions'), b('9SpecialAllowableDeductions'));
		total(c1('3SubTotal'), [c1('1TaxableIncome'), c1('2AddSpecialAllowableDeductions')]);
		derive(c1('4RegularIncomeTax'), [c1('3SubTotal')], () => graduatedTax(read(c1('3SubTotal'))));
		derive(c1('5LessIncomeTax'), [taxBase, specialRate], () => Math.max(0, read(taxBase) * read(specialRate) / 100));
		difference(c1('6TaxReliefAvailment'), c1('4RegularIncomeTax'), c1('5LessIncomeTax'));
		copy(c1('7AddSpecialTaxCredits'), j('8SpecialTaxCredits'));
		total(c1('8TotalTaxReliefAvailment'), [c1('6TaxReliefAvailment'), c1('7AddSpecialTaxCredits')]);

		const exemptBase = c2('9TaxableIncome');
		total(exemptBase, [b('9SpecialAllowableDeductions'), b('11TotalIncome')]);
		derive(c2('10ApplicableTaxRate'), [exemptBase], () => {
			const thresholds = [500000, 250000, 140000, 70000, 30000, 10000, 0];
			return [32, 30, 25, 20, 15, 10, 5][thresholds.findIndex(threshold => read(exemptBase) > threshold)] ?? 0;
		});
		derive(c2('11TaxReliefAvailment'), [exemptBase], () => graduatedTax(read(exemptBase)));

		for (const activityRegime of ['SpecialRate', 'Exempt']) {
			const isSpecial = activityRegime === 'SpecialRate';
			const applies = regime === activityRegime && active(person, activityRegime);
			const partColumn = taxpayer ? (isSpecial ? 'C2' : 'C3') : (isSpecial ? 'C6' : 'C7');
			const part = (item: string) => `txtPg12Pt9I${item}${partColumn}`;
			const fields = {
				'1Sales': b('1NetSales'), '2Other': b('2AddOtherIncome'), '3TotalSales': b('3TotalSales'),
				'4LessCost': b('4LessCostOfSales'), '5GrossIncome': b('5GrossIncome'), '6AddNon': b('6AddNonOperatingIncome'),
				'7TotalGross': b('7TotalGrossIncome'), '8Ordinary': b('8OrdinaryAllowableDeductions'), '9Special': b('9SpecialAllowableDeductions'),
				'11TotalAllowable': b('10TotalAllowableDeductions'), '13Taxable': b('11TotalIncome'),
				'15Net': b('11TotalIncome'), '17TotalTaxable': b('11TotalIncome'), '19TotalTaxCredits': j('10TotalTaxCredits'),
				'21TaxRelief': isSpecial ? c1('8TotalTaxReliefAvailment') : c2('11TaxReliefAvailment')
			};
			for (const [item, source] of Object.entries(fields)) {
				derive(part(item), applies ? [source] : [], () => read(source));
			}
			derive(part('18TotalIncome'), applies ? [c1('5LessIncomeTax'), b('11TotalIncome')] : [],
				() => isSpecial && (!preferred || read(specialRate) === 5) ? read(c1('5LessIncomeTax')) : 0);
			difference(part('20NetTax'), part('18TotalIncome'), part('19TotalTaxCredits'));
		}
	}
}
