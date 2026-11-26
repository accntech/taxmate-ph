import type { Worksheet } from './annual-activity-calculations';

export function calculateJuneReconciliation(sheet: Worksheet, column: string) {
	const { read, derive, total } = sheet;
	const schedule = `txtPg10Sc11${column === 'C1' ? 'A' : 'B'}I`;
	const additions = schedule + '4Total';
	const deductions = schedule + '9Total';
	total(additions, ['1NetIncome', '2TaxableOtherIncomeC2', '3TaxableOtherIncomeC2'].map(name => schedule + name));
	total(deductions, ['5NonTaxableIncomeC2', '6NonTaxableIncomeC2', '7SpecialDeductionsC2', '8SpecialDeductionsC2'].map(name => schedule + name));
	derive(schedule + '10NetTaxableIncomeLoss', [additions, deductions], () => read(additions) - read(deductions));
}

export function calculateJuneSupplementalIncome({ total }: Worksheet) {
	const finalTax = [
		'1FinalTaxWithheldC3',
		...[2, 3, 4, 5, 6].map(item => `${item}FinalTaxWithheldC2`),
		...[11, 17, 20].flatMap(item => ['C1', 'C2'].map(column => `${item}FinalTax${column}`))
	];
	total('txtPg11Sc12AI21TotalFinalTaxC1', finalTax.map(name => 'txtPg11Sc12AI' + name));
	total('txtPg11Sc12BI10TotalIncomeC1', [
		'1ProceedsofLifeInsuranceC1', '2ReturnOfPremiummC1', '3RetirementC1',
		'7ActualAmountC1', '7ActualAmountC2', '9ActualAmountC1', '9ActualAmountC2'
	].map(name => 'txtPg11Sc12BI' + name));
}

const consolidationLines = [
	'1Sales', '2Other', '3TotalSales', '4LessCost', '5GrossIncome', '6AddNon', '7TotalGross',
	'8Ordinary', '9Special', '10Allowance', '11TotalAllowable', '13Taxable', '14AddNet', '15Net',
	'16LessExcess', '17TotalTaxable', '18TotalIncome', '19TotalTaxCredits', '20NetTax', '21TaxRelief'
];

export function calculateJuneConsolidation(sheet: Worksheet, column: string, person: string, osd: boolean) {
	const { copy, derive, read, total } = sheet;
	const taxpayer = column === 'C1';
	const regular = taxpayer ? 'C1' : 'C5';
	const comp = (field: string) => 'txtPg2Pt4I' + field + column;
	const part = (item: string) => `txtPg12Pt9I${item}${regular}`;
	const fields: Record<string, string> = {
		'1Sales': comp('50NetSales'), '2Other': comp('51AddOther'),
		'4LessCost': comp('53LessCostSales'), '6AddNon': comp('55AddNonOper'),
		'8Ordinary': comp('57Ordinary'), '9Special': comp('58Special'), '10Allowance': comp('59Allowance'),
		'14AddNet': comp('48NetTax'), '16LessExcess': comp('65LessExcess'),
		'18TotalIncome': `txtPg3Pt5I68RegularRate${column}`,
		'19TotalTaxCredits': `txtPg9Sc9I10${person}${column}`, '21TaxRelief': `txtPg3Pt5I90RegularTax${column}`
	};
	for (const [item, source] of Object.entries(fields)) copy(part(item), source);

	const difference = (item: string, first: string, second: string) =>
		derive(part(item), [part(first), part(second)], () => read(part(first)) - read(part(second)));
	total(part('3TotalSales'), ['1Sales', '2Other'].map(part));
	difference('5GrossIncome', '3TotalSales', '4LessCost');
	total(part('7TotalGross'), ['5GrossIncome', '6AddNon'].map(part));
	total(part('11TotalAllowable'), ['8Ordinary', '9Special', '10Allowance'].map(part));
	const deduction = osd ? comp('61OSD') : part('11TotalAllowable');
	derive(part('13Taxable'), [part('7TotalGross'), deduction], () => read(part('7TotalGross')) - read(deduction));
	total(part('15Net'), ['13Taxable', '14AddNet'].map(part));
	difference('17TotalTaxable', '15Net', '16LessExcess');
	difference('20NetTax', '18TotalIncome', '19TotalTaxCredits');

	const firstColumn = taxpayer ? 1 : 5;
	for (const item of consolidationLines) {
		const line = (index: number) => `txtPg12Pt9I${item}C${index}`;
		total(line(firstColumn + 3), [line(firstColumn), line(firstColumn + 1), line(firstColumn + 2)]);
	}
}
