import type { CorporateValues } from '../types';
import legacyArithmetic from './1702rt-arithmetic.json';
import revisedArithmetic from './1702rtv2018-arithmetic.json';

type Arithmetic = { operation: string; args: string[] };
const prefix = 'frm1702RT:';
export const regularField = (name: string) => prefix + name;
export function regularNumber(values: CorporateValues, name: string): number {
 const value = (values[regularField(name)] ?? '').replaceAll(',', '').replace(/^\((.*)\)$/, '-$1');
 return Number(value) || 0;
}
const put = (values: CorporateValues, name: string, value: number) => { values[regularField(name)] = String(Math.round(value)); };
const sum = (values: CorporateValues, names: string) => names.split(',').reduce((total, name) => total + regularNumber(values, name), 0);

function calculateSchedules(values: CorporateValues, legacy: boolean): void {
 const rules: Arithmetic[] = legacy ? legacyArithmetic : revisedArithmetic;
 // Source formulas are in display order, including forward references. Repeating
 // the schedule pass resolves the balance sheet and carryover dependencies.
 for (let pass = 0; pass < 3; pass++) {
  for (const { operation, args } of rules) {
   let total = sum(values, args[0]);
   if (operation === 'getDifference') total -= sum(values, args[1]);
   if (operation === 'sumThenDifference') total += sum(values, args[1]) - sum(values, args[2]);
   const output = args.at(-1)!;
   if (/Sc(?:4|8)I[123]C4$/.test(output)) total = Math.max(0, total);
   put(values, output, total);
  }
 }
}

export function regularUsesOsd(values: CorporateValues, legacy: boolean): boolean {
 const base = legacy ? 'rdoPg1Pt1I15' : 'rdoPg1Pt1I13';
 return values[regularField(base + 'ItemizedDeduction')] === regularField(base + 'OptionalStandard') ||
  ['Y', regularField(base + 'OptionalStandard')].includes(values[regularField(base + 'OptionalStandard')]);
}

export function regularUsesManualRates(code: string, values: CorporateValues): boolean {
 const year = regularNumber(values, 'txtPg1I2Year');
 const fullYear = year > 0 && year < 100 ? 2000 + year : year;
 return code === '1702RTv2018C' && fullYear >= 2020;
}

function calculateCarryovers(values: CorporateValues, legacy: boolean): void {
 const nolco = legacy ? 'txtPg5Sc6A' : 'txtPg4Sc3A';
 const mcit = legacy ? 'txtPg6Sc8' : 'txtPg4Sc4';
 for (const row of [4, 5, 6, 7]) {
  put(values, `${nolco}I${row}C6`, regularNumber(values, `${nolco}I${row}C2`) -
   sum(values, `${nolco}I${row}C3,${nolco}I${row}C4,${nolco}I${row}C5`));
 }
 for (const row of [1, 2, 3]) {
  put(values, `${mcit}I${row}C4`, Math.max(0, regularNumber(values, `${mcit}I${row}C3`) - regularNumber(values, `${mcit}I${row}C2`)));
  const balance = regularNumber(values, `${mcit}I${row}C4`) - sum(values, `${mcit}I${row}C5,${mcit}I${row}C6,${mcit}I${row}C7`);
  put(values, `${mcit}I${row}C8`, legacy ? Math.max(0, balance) : balance);
 }
 put(values, `${mcit}I4TotalExcessMCIT`, sum(values, `${mcit}I1C7,${mcit}I2C7,${mcit}I3C7`));
 put(values, legacy ? 'txtPg5Sc6AI8TotalNOLCO' : 'txtPg4Sc4I8TotalNOLCO', sum(values, [4, 5, 6, 7].map(row => `${nolco}I${row}C5`).join(',')));
}

function calculateRevised(code: string, values: CorporateValues): void {
 const n = (name: string) => regularNumber(values, name);
 const set = (name: string, value: number) => put(values, name, value);
 const osd = regularUsesOsd(values, false);
 const manualCreate = regularUsesManualRates(code, values);
 set('txtPg2Pt4I29NetSales', n('txtPg2Pt4I27Sales') - n('txtPg2Pt4I28LessSales'));
 set('txtPg2Pt4I31GrossIncome', n('txtPg2Pt4I29NetSales') - n('txtPg2Pt4I30LessCost'));
 set('txtPg2Pt4I33TotalGross', n('txtPg2Pt4I31GrossIncome') + n('txtPg2Pt4I32AddOtherTaxable'));
 set('txtPg2Pt4I34OrdinaryAllowable', n('txtPg3Sc1I18TotalOrdinaryAllowable'));
 set('txtPg2Pt4I35SpecialAllowable', n('txtPg3Sc2I5TotalSpecialAllowable'));
 set('txtPg2Pt4I36Nolco', n('txtPg4Sc4I8TotalNOLCO'));
 set('txtPg2Pt4I37TotalItemized', osd ? 0 : sum(values, 'txtPg2Pt4I34OrdinaryAllowable,txtPg2Pt4I35SpecialAllowable,txtPg2Pt4I36Nolco'));
 set('txtPg2Pt4I38OptionalStandard', osd ? n('txtPg2Pt4I33TotalGross') * .4 : 0);
 set('txtPg2Pt4I39NetTaxable', n('txtPg2Pt4I33TotalGross') - n(osd ? 'txtPg2Pt4I38OptionalStandard' : 'txtPg2Pt4I37TotalItemized'));
 const rate = manualCreate ? n('Pg2Pt4I40IncomeTaxRate') : 30;
 values[regularField('Pg2Pt4I40IncomeTaxRate')] = String(rate);
 set('txtPg2Pt4I41IncomeTaxDue', Math.max(0, n('txtPg2Pt4I39NetTaxable')) * rate / 100);
 if (!manualCreate) set('txtPg2Pt4I42MinimumCorporate', ['Y', 'IC055'].includes(values[regularField('rdoPg1I5Atc')]) ? Math.max(0, n('txtPg2Pt4I33TotalGross')) * .02 : 0);
 set('txtPg2Pt4I43TotalIncomeTax', Math.max(n('txtPg2Pt4I41IncomeTaxDue'), n('txtPg2Pt4I42MinimumCorporate')));
 set('txtPg2Pt4I47ExcessMCIT', n('txtPg4Sc4I4TotalExcessMCIT'));
 const amended = values[regularField('rdoPg1I3Ammend')] === 'Y';
 if (!amended) set('txtPg2Pt4I51TaxPaidInReturn', 0);
 set('txtPg2Pt4I55TotalTaxCredits', sum(values, 'txtPg2Pt4I44ExcessCredits,txtPg2Pt4I45IncomeTaxPaymentUnderMCIT,txtPg2Pt4I46IncomeTaxUnderRegular,txtPg2Pt4I47ExcessMCIT,txtPg2Pt4I48CreditableTaxWithheldFromPrevious,txtPg2Pt4I49CreditableTaxWithheldFor4thQuarter,txtPg2Pt4I50ForeignTaxCredits,txtPg2Pt4I51TaxPaidInReturn,txtPg2Pt452SpecialTaxCredits,txtPg2Pt4I53C2,txtPg2Pt4I54C2'));
 set('txtPg2Pt4I56NetTax', n('txtPg2Pt4I43TotalIncomeTax') - n('txtPg2Pt4I55TotalTaxCredits'));
 set('txtPg1Pt2I14IncomeTax', n('txtPg2Pt4I43TotalIncomeTax'));
 set('txtPg1Pt2I15TotalTaxCredits', n('txtPg2Pt4I55TotalTaxCredits'));
 set('txtPg1Pt2I16NetTax', n('txtPg2Pt4I56NetTax'));
 set('txtPg1Pt2I20TotalPenalties', sum(values, 'txtPg1Pt2I17Surcharge,txtPg1Pt2I18Interest,txtPg1Pt2I19Compromise'));
 const net = n('txtPg1Pt2I16NetTax'), penalties = n('txtPg1Pt2I20TotalPenalties');
 set('txtPg1Pt2I21TotalAmount', net < 0 ? (penalties > 0 ? penalties : net) : net + penalties);
 if (osd) set('txtPg2Pt5I57SpecialAllowable', 0);
 else if (!manualCreate) set('txtPg2Pt5I57SpecialAllowable', n('txtPg2Pt4I35SpecialAllowable') * rate / 100);
 set('txtPg2Pt5I58AddSpecialTax', n('txtPg2Pt452SpecialTaxCredits'));
 set('txtPg2Pt5I59TotalTax', n('txtPg2Pt5I57SpecialAllowable') + n('txtPg2Pt5I58AddSpecialTax'));
 const loss = !osd && n('txtPg2Pt4I34OrdinaryAllowable') > n('txtPg2Pt4I33TotalGross');
 set('txtPg4Sc3I1GrossIncome', loss ? n('txtPg2Pt4I33TotalGross') : 0);
 set('txtPg4Sc3I2TotalDeductions', loss ? n('txtPg2Pt4I34OrdinaryAllowable') : 0);
 set('txtPg4Sc3I3NetOperatingLoss', n('txtPg4Sc3I1GrossIncome') - n('txtPg4Sc3I2TotalDeductions'));
 set('txtPg4Sc3AI4C2', -n('txtPg4Sc3I3NetOperatingLoss'));
 values[regularField('txtPg4Sc3AI4C1')] = loss ? values[regularField('txtPg1I2Year')] : '';
 if (net >= 0) values[regularField('Pg1Pt2I21')] = '';
}

function calculateLegacy(values: CorporateValues): void {
 const n = (name: string) => regularNumber(values, name);
 const set = (name: string, value: number) => put(values, name, value);
 const osd = regularUsesOsd(values, true);
 set('txtSc12I19TotalFinalTaxWitheld', sum(values, 'txtPg8Sc12I1C3,txtPg8Sc12I2C3,txtPg8Sc12I3C3,txtPg8Sc12I4C3,txtPg8Sc12I9C1,txtPg8Sc12I9C2,txtPg8Sc12I15C1,txtPg8Sc12I15C2,txtPg8Sc12I18C1,txtPg8Sc12I18C2'));
 set('txtPg2Pt4I30NetSales', n('txtPg3Sc1I6NetSales'));
 set('txtPg2Pt4I31LessCost', sum(values, 'txtPg3Sc2I5CostofSales,txtPg3Sc2I19CostOfGoods,txtPg3Sc2I26TotalService'));
 set('txtPg3Sc2I27TotalSales', n('txtPg2Pt4I31LessCost'));
 set('txtPg2Pt4I32GrossIncome', n('txtPg2Pt4I30NetSales') - n('txtPg2Pt4I31LessCost'));
 set('txtPg4Sc3I4OtherTaxTotalAmount', sum(values, 'txtPg4Sc3I1OtherTaxAmount,txtPg4Sc3I2OtherTaxAmount,txtPg4Sc3I3C2'));
 set('txtPg2Pt4I33AddOtherTaxable', n('txtPg4Sc3I4OtherTaxTotalAmount'));
 set('txtPg2Pt4I34TotalGross', n('txtPg2Pt4I32GrossIncome') + n('txtPg2Pt4I33AddOtherTaxable'));
 set('txtPg2Pt4I35OrdinaryAllowable', n('txtPg5Sc4I40TotalOrdinaryAllowable'));
 set('txtPg2Pt4I36SpecialAllowable', n('txtPg5Sc5I5TotalSpecialAllowable'));
 set('txtPg2Pt4I37Nolco', n('txtPg5Sc6AI8TotalNOLCO'));
 set('txtPg2Pt4I38TotalItemized', osd ? 0 : sum(values, 'txtPg2Pt4I35OrdinaryAllowable,txtPg2Pt4I36SpecialAllowable,txtPg2Pt4I37Nolco'));
 set('txtPg2Pt4I39OptionalStandard', osd ? Math.max(0, n('txtPg2Pt4I34TotalGross')) * .4 : 0);
 set('txtPg2Pt4I40NetTaxable', n('txtPg2Pt4I34TotalGross') - n(osd ? 'txtPg2Pt4I39OptionalStandard' : 'txtPg2Pt4I38TotalItemized'));
 set('txtPg2Pt4I42IncomeTaxDue', Math.max(0, n('txtPg2Pt4I40NetTaxable')) * .3);
 set('txtPg2Pt4I43MinimumCorporate', ['Y', 'IC055'].includes(values[regularField('rdoPg1I5Atc')]) ? Math.max(0, n('txtPg2Pt4I34TotalGross')) * .02 : 0);
 set('txtPg2Pt4I44TotalIncomeTax', Math.max(n('txtPg2Pt4I42IncomeTaxDue'), n('txtPg2Pt4I43MinimumCorporate')));
 set('txtPg6Sc7I4ExcessMCIT', n('txtPg2Pt4I42IncomeTaxDue') >= n('txtPg2Pt4I43MinimumCorporate') ? n('txtPg6Sc8I4TotalExcessMCIT') : 0);
 if (values[regularField('rdoPg1I2Ammend')] !== 'Y') set('txtPg6Sc7I8TaxPaidInReturn', 0);
 set('txtPg6Sc7I12TotalTaxCredits', sum(values, 'txtPg6Sc7I1ExcessCredits,txtPg6Sc7I2IncomeTaxPaymentUnderMCIT,txtPg6Sc7I3IncomeTaxUnderRegular,txtPg6Sc7I4ExcessMCIT,txtPg6Sc7I5CreditableTaxWithheldFromPrevious,txtPg6Sc7I6CreditableTaxWithheldFor4thQuarter,txtPg6Sc7I7ForeignTaxCredits,txtPg6Sc7I8TaxPaidInReturn,txtPg6Sc7I9SpecialTaxCredits,txtPg5Sc7I10C2,txtPg6Sc7I11C2'));
 set('txtPg2Pt4I45LessTotalTax', n('txtPg6Sc7I12TotalTaxCredits'));
 set('txtPg2Pt4I46NetTax', n('txtPg2Pt4I44TotalIncomeTax') - n('txtPg2Pt4I45LessTotalTax'));
 set('txtPg2Pt4I50TotalPenalties', sum(values, 'txtPg2Pt4I47Surcharge,txtPg2Pt4I48Interest,txtPg2Pt4I49Compromise'));
 const net = n('txtPg2Pt4I46NetTax');
 set('txtPg2Pt4I51TotalAmount', net < 0 ? net : net + n('txtPg2Pt4I50TotalPenalties'));
 set('txtPg1Pt2I16IncomeTax', n('txtPg2Pt4I44TotalIncomeTax'));
 set('txtPg1Pt2I17TotalTaxCredits', n('txtPg2Pt4I45LessTotalTax'));
 set('txtPg1Pt2I18NetTax', net);
 set('txtPg1Pt2I19TotalPenalties', n('txtPg2Pt4I50TotalPenalties'));
 set('txtPg1Pt2I20TotalAmount', n('txtPg2Pt4I51TotalAmount'));
 set('txtPg2Pt5I52SpecialAllowable', n('txtPg2Pt4I36SpecialAllowable') * .3);
 set('txtPg2Pt5I53AddSpecialTax', n('txtPg6Sc7I9SpecialTaxCredits'));
 set('txtPg2Pt5I54TotalTax', n('txtPg2Pt5I52SpecialAllowable') + n('txtPg2Pt5I53AddSpecialTax'));
 const loss = !osd && n('txtPg2Pt4I35OrdinaryAllowable') > n('txtPg2Pt4I34TotalGross');
 set('txtPg5Sc6I1GrossIncome', loss ? n('txtPg2Pt4I34TotalGross') : 0);
 set('txtPg5Sc6I2TotalDeductions', loss ? n('txtPg2Pt4I35OrdinaryAllowable') : 0);
 set('txtPg5Sc6I3NetOperatingLoss', n('txtPg5Sc6I1GrossIncome') - n('txtPg5Sc6I2TotalDeductions'));
 set('txtPg5Sc6AI4C2', -n('txtPg5Sc6I3NetOperatingLoss'));
 values[regularField('txtPg5Sc6AI4C1')] = loss ? values[regularField('txtPg1I2Year')] : '';
 if (net >= 0) values[regularField('Pg1Pt2I21')] = '';
}

export function calculateRegular(code: string, input: CorporateValues): CorporateValues {
 const values = { ...input };
 const year = values[regularField('txtPg1I2Year')];
 if (/^\d{2}$/.test(year ?? '')) values[regularField('txtPg1I2Year')] = '20' + year;
 const legacy = code === '1702RT';
 if (regularUsesOsd(values, legacy)) {
  const itemized = legacy ? /^txtPg\d+Sc(?:4|5|6A?)I/ : /^txtPg\d+Sc(?:1|2|3A?)I/;
  for (const id of Object.keys(values)) {
   if (!itemized.test(id.slice(prefix.length))) continue;
   values[id] = values[id].trim() && Number.isFinite(Number(values[id].replaceAll(',', ''))) ? '0' : '';
  }
 }
 calculateSchedules(values, legacy);
 calculateCarryovers(values, legacy);
 if (legacy) calculateLegacy(values);
 else calculateRevised(code, values);
 return values;
}
