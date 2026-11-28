/** Calculations and filing options for quarterly Form 1701Q. */
import { philippineCalendarDate } from '../filing-calendar';

type Values = Record<string, string>;
const prefix = 'frm1701q:';
const field = (name: string) => prefix + name;
const amount = (values: Values, name: string) => Number((values[field(name)] || '0').replaceAll(',', '')) || 0;
const money = (value: number) => value.toFixed(2);
const wholePeso = (value: number) => Math.round(Number(value.toFixed(2)));

function graduatedTax(income: number, year: number): number {
 const brackets = year < 2018
  ? [[500000, 125000, .32], [250000, 50000, .30], [140000, 22500, .25], [70000, 8500, .20], [30000, 2500, .15], [10000, 500, .10], [0, 0, .05]]
  : year <= 2022
   ? [[8000000, 2410000, .35], [2000000, 490000, .32], [800000, 130000, .30], [400000, 30000, .25], [250000, 0, .20], [0, 0, 0]]
   : [[8000000, 2202500, .35], [2000000, 402500, .30], [800000, 102500, .25], [400000, 22500, .20], [250000, 0, .15], [0, 0, 0]];
 const [threshold, base, rate] = brackets.find(([threshold]) => income >= threshold) ?? [0, 0, 0];
 return Math.max(0, base + (income - threshold) * rate);
}

export function quarterlyAmountField(code: string): string {
 return field(code === '1701Q' ? 'txt41C' : 'txt31');
}

const estateOrTrust = (values: Values) => ['Estate', 'Trust'].includes(values[field('optTaxpayerType')]);
const amending = (values: Values) => values[field('AmendedRtn')] === 'Y';

export function quarterlyIncludesSpouse(code: string, values: Values): boolean {
 const revised = code === '1701Qv2018';
 if (revised && estateOrTrust(values)) return false;
 const include = values['income:useSavedSpouse'];
 if (include === 'Y' || include === 'N') return include === 'Y';
 const identity = revised ? ['txtSpouseName', 'txtSpouseTIN1', 'txtSpouseTIN2', 'txtSpouseTIN3']
  : ['txtSpousename', 'txt7TIN1', 'txt7TIN2', 'txt7TIN3'];
 return identity.some(name => {
  const value = values[field(name)]?.trim();
  return value && !/^0+$/.test(value);
 });
}

export function quarterlyRateForAtc(atc: string): 'Graduated' | 'Percentage' | '' | undefined {
 if (['II012', 'II014', 'II013'].includes(atc)) return 'Graduated';
 if (['II015', 'II017', 'II016'].includes(atc)) return 'Percentage';
 if (atc === 'II011') return '';
 return undefined;
}

export function quarterlyTaxReliefPatch(values: Values, id: string, value: string): Values | undefined {
 if (id === field('j_id217')) return { [id]: value, [field('txtTaxRelief25')]: value === 'Y' ? '1' : '0' };
 if (id === field('txtTaxRelief25')) return { [id]: values[field('j_id217')] === 'Y' ? value : '0' };
 return undefined;
}

const compensationOnlySpouse = (values: Values) => values[field('optSpouseType_3')] === 'Compensation' &&
 !values[field('optSpouseType_1')] && !values[field('optSpouseType_2')];
const quarterlyAtc = (values: Values, spouse: boolean) => {
 if (spouse && compensationOnlySpouse(values)) return 'II011';
 if (!spouse && estateOrTrust(values)) return 'II012';
 return values[field(spouse ? 'optSpouseATC' : 'optATC')] ?? '';
};
export function quarterlySelectedRate(values: Values, spouse: boolean) {
 const atc = quarterlyAtc(values, spouse);
 return !spouse && atc === 'II011' ? undefined : quarterlyRateForAtc(atc);
}

export function quarterlyFilerReady(values: Values, spouse: boolean): boolean {
 if (spouse && !quarterlyIncludesSpouse('1701Qv2018', values)) return false;
 const rate = quarterlySelectedRate(values, spouse);
 const method = values[field(spouse ? 'optSpouseMethod' : 'optMethodOfDeduction')];
 return rate === 'Percentage' || (spouse && rate === '') ||
  (rate === 'Graduated' && (method === 'I' || method === 'O'));
}
const spouseTaxApplies = (values: Values) => quarterlyIncludesSpouse('1701Qv2018', values) && quarterlyAtc(values, true) !== 'II011';
// Older drafts may have a credit with no choice saved. An explicit No excludes it.
const foreignCreditApplies = (values: Values, spouse: boolean) => values[field(spouse ? 'optSpouseForeignTaxCred' : 'optForeignTaxCredits')] !== 'N';

function legacySpouseField(name: string): boolean {
 const identity = /^(?:optATC22|txt(?:7(?:TIN[1-3]|BranchCode|RDOCode)|Spousename|12Address|16Birth(?:Month|Day|Year)|17|18Telno|21|22[ABC]))$/;
 // Legacy credits and penalties interleave taxpayer and spouse letters in the same item.
 const amounts = /^txt(?:(?:2[6-9]|3[0-79]|41)B|38[BDFHJLN]|40[BDFH])$/;
 return identity.test(name) || amounts.test(name);
}

export function quarterlyIncomeFieldApplies(code: string, id: string, values: Values): boolean {
 if (code === '1701Q' && id === 'frm1701:optMethodOfDeduction24') return quarterlyIncludesSpouse(code, values);
 if (!id.startsWith(prefix)) return true;
 const name = id.slice(prefix.length);
 if (code === '1701Q') {
  if (!quarterlyIncludesSpouse(code, values) && legacySpouseField(name)) return false;
  if (/^txt38[IJ]$/.test(name)) return amending(values);
  if (name === 'txt29A') return values['frm1701:optMethodOfDeduction23'] !== 'O';
  if (name === 'txt29B') return values['frm1701:optMethodOfDeduction24'] !== 'O';
  return true;
 }
 if (code !== '1701Qv2018') return true;
 if (!quarterlyIncludesSpouse(code, values) && /^(?:opt|txt)Spouse/.test(name)) return false;
 if (name === 'txtForeignTaxNumber') return foreignCreditApplies(values, false);
 if (name === 'txtSpouseForeignTaxNum') return foreignCreditApplies(values, true);
 if (name === 'txt43Desc' || name === 'txt48Desc') {
  const rate = name === 'txt43Desc' ? 'Graduated' : 'Percentage';
  return quarterlySelectedRate(values, false) === rate || (spouseTaxApplies(values) && quarterlySelectedRate(values, true) === rate);
 }
 if (name === 'optTaxRate') return !!quarterlySelectedRate(values, false);
 if (name === 'optSpouseTaxRate') return spouseTaxApplies(values) && !!quarterlySelectedRate(values, true);
 if (name === 'optSpouseMethod') return spouseTaxApplies(values) && quarterlySelectedRate(values, true) === 'Graduated';
 if (name === 'optMethodOfDeduction') return quarterlySelectedRate(values, false) === 'Graduated';
 const item = name.match(/^txt(\d+)([AB])$/);
 if (!item) return true;
 const number = Number(item[1]);
 const spouse = item[2] === 'B';
 if (spouse && number >= 26 && number <= 68 && !quarterlyIncludesSpouse(code, values)) return false;
 if (spouse && number >= 36 && number <= 68 && !spouseTaxApplies(values)) return false;
 if (number === 59) return amending(values);
 if (number === 60) return foreignCreditApplies(values, spouse);
 const rate = quarterlySelectedRate(values, spouse);
 if (number >= 36 && number <= 46) {
  const method = values[field(spouse ? 'optSpouseMethod' : 'optMethodOfDeduction')];
  if (number === 37 || number === 39) return rate === 'Graduated' && method === 'I';
  if (number === 40) return rate === 'Graduated' && method === 'O';
  return rate === 'Graduated';
 }
 if (number >= 47 && number <= 54) {
  const atc = quarterlyAtc(values, spouse);
  return rate === 'Percentage' && (number !== 52 || atc !== 'II016');
 }
 return true;
}

export function calculateQuarterly(code: string, values: Values): Values {
 const result = { ...values };
 const revised = code === '1701Qv2018';
 if (!revised) {
  result[field('txtTaxRelief25')] = values[field('j_id217')] === 'Y'
   ? ['1', '2'].includes(values[field('txtTaxRelief25')]) ? values[field('txtTaxRelief25')] : '1'
   : '0';
 }
 const includesSpouse = quarterlyIncludesSpouse(code, values);
 const read = (name: string) => !revised && !includesSpouse && legacySpouseField(name) ? 0 : amount(result, name);
 const write = (name: string, value: number) => { result[field(name)] = money(revised ? wholePeso(value) : Number(value.toFixed(2))); };
 for (const person of ['A', 'B']) {
  const spouse = person === 'B';
  if (!revised) {
   const deduction = values[`frm1701:optMethodOfDeduction${spouse ? '24' : '23'}`];
   const cost = deduction === 'O' ? 0 : read('txt29' + person);
   if (deduction === 'O') {
    write('txt33' + person, read('txt26' + person) * .4);
   }
   write('txt28' + person, read('txt26' + person) + read('txt27' + person));
   write('txt30' + person, read('txt28' + person) - cost);
   write('txt32' + person, read('txt30' + person) + read('txt31' + person));
   write('txt34' + person, read('txt32' + person) - read('txt33' + person));
   write('txt36' + person, read('txt34' + person) + read('txt35' + person));
   write('txt37' + person, graduatedTax(read('txt36' + person), 2017));
   const credits = (spouse ? ['B', 'D', 'F', 'H', 'J', 'L'] : ['A', 'C', 'E', 'G', 'I', 'K'])
    .map(suffix => 'txt38' + suffix)
    .reduce((total, name) => total + (quarterlyIncomeFieldApplies(code, field(name), values) ? read(name) : 0), 0);
   write(spouse ? 'txt38N' : 'txt38M', credits);
   write('txt39' + person, read('txt37' + person) - credits);
   const penalties = (spouse ? ['B', 'D', 'F'] : ['A', 'C', 'E']).reduce((total, suffix) => total + read('txt40' + suffix), 0);
   write(spouse ? 'txt40H' : 'txt40G', penalties);
   write('txt41' + person, read('txt39' + person) + penalties);
   continue;
  }
  const rate = quarterlySelectedRate(values, spouse);
  const deduction = values[field(spouse ? 'optSpouseMethod' : 'optMethodOfDeduction')];
  const atc = quarterlyAtc(values, spouse);
  if (!spouse || includesSpouse) {
   if (atc) result[field(spouse ? 'optSpouseATC' : 'optATC')] = atc;
   if (rate !== undefined) result[field(spouse ? 'optSpouseTaxRate' : 'optTaxRate')] = rate;
  }
  const canCalculate = !spouse || spouseTaxApplies(values);
  const ready = quarterlyFilerReady(values, spouse);
  const graduated = canCalculate && rate === 'Graduated';
  const percentage = canCalculate && rate === 'Percentage';
  if (graduated) {
   const cost = deduction === 'I' ? read('txt37' + person) : 0;
   write('txt38' + person, read('txt36' + person) - cost);
   write('txt40' + person, deduction === 'O' ? read('txt36' + person) * .4 : 0);
   const deductions = deduction === 'O' ? read('txt40' + person) : deduction === 'I' ? read('txt39' + person) : 0;
   write('txt41' + person, read('txt38' + person) - deductions);
   write('txt45' + person, [41, 42, 43, 44].reduce((total, item) => total + read('txt' + item + person), 0));
   if (ready) write('txt46' + person, graduatedTax(read('txt45' + person), read('txtYear')));
   else result[field('txt46' + person)] = '';
  } else {
   for (const item of [38, 40, 41, 45, 46]) write('txt' + item + person, 0);
  }
  if (percentage) {
   const reduction = atc === 'II016' ? 0 : read('txt52' + person);
   write('txt49' + person, read('txt47' + person) + read('txt48' + person));
   write('txt51' + person, read('txt49' + person) + read('txt50' + person));
   write('txt53' + person, read('txt51' + person) - reduction);
   write('txt54' + person, Math.max(0, wholePeso(read('txt53' + person) * .08)));
  } else {
   for (const item of [49, 51, 53, 54]) write('txt' + item + person, 0);
  }
  const credits = canCalculate ? [55, 56, 57, 58, 59, 60, 61]
   .map(item => 'txt' + item + person)
   .reduce((total, name) => total + (quarterlyIncomeFieldApplies(code, field(name), values) ? read(name) : 0), 0) : 0;
  write('txt62' + person, credits);
  const tax = graduated ? read('txt46' + person) : percentage ? read('txt54' + person) : 0;
  write('txt63' + person, tax - read('txt62' + person));
  write('txt67' + person, canCalculate ? read('txt64' + person) + read('txt65' + person) + read('txt66' + person) : 0);
  write('txt68' + person, read('txt63' + person) + read('txt67' + person));
  write('txt26' + person, tax);
  write('txt27' + person, read('txt62' + person));
  write('txt28' + person, read('txt63' + person));
  write('txt29' + person, read('txt67' + person));
  write('txt30' + person, read('txt68' + person));
  if (canCalculate && !ready) {
   for (const item of [26, 28, 30, 63, 68]) result[field('txt' + item + person)] = '';
  }
 }
 if (revised) {
  if (quarterlyFilerReady(values, false) && (!includesSpouse || quarterlyFilerReady(values, true))) {
   write('txt31', read('txt30A') + read('txt30B'));
  } else result[field('txt31')] = '';
  for (const name of ['TIN1', 'TIN2', 'TIN3', 'BranchCode', 'TaxpayerName']) result[field('txtPg2' + name)] = values[field('txt' + name)] ?? '';
 } else write('txt41C', read('txt41A') + read('txt41B'));
 return result;
}

function birthdayErrors(values: Values, errors: Values, base: string, required: boolean): void {
 const month = values[field(base + 'Month')] || '';
 const day = values[field(base + 'Day')] || '';
 const year = values[field(base + 'Year')] || '';
 if (!required && !month && !day && !year) return;
 const date = new Date(Number(year), Number(month) - 1, Number(day));
 if (!/^\d{4}$/.test(year) || !/^\d{1,2}$/.test(month) || !/^\d{1,2}$/.test(day) || date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day) || date > new Date()) {
  errors[field(base + 'Day')] = 'Enter a valid birth date that is not in the future.';
 }
}

export function validateQuarterly(code: string, values: Values): Values {
 const errors: Values = {};
 const revised = code === '1701Qv2018';
 const require = (name: string, label: string) => { if (!values[field(name)]?.trim()) errors[field(name)] = `Enter ${label}.`; };
 const select = (name: string, choices: string[], label: string) => { if (!choices.includes(values[field(name)] || '')) errors[field(name)] = `Select ${label}.`; };
 const year = values[field('txtYear')] || '';
 const currentYear = revised ? philippineCalendarDate().year : new Date().getFullYear();
 if (!/^\d{4}$/.test(year) || Number(year) < 1900 || Number(year) > currentYear) errors[field('txtYear')] = 'Enter a valid return year through the current year.';
 select('DateQuarter', ['1', '2', '3'], 'the first, second, or third quarter');
 select('AmendedRtn', ['Y', 'N'], 'whether this is an amended return');
 const tin = (base: string, required: boolean) => {
  const parts = [1, 2, 3].map(index => values[field(base + 'TIN' + index)] || '');
  if (!required && !parts.some(Boolean)) return;
  if (!parts.every(value => /^\d{3}$/.test(value)) || parts.join('') === '000000000') errors[field(base + 'TIN1')] = 'Enter a valid nine-digit TIN.';
  if (!/^\d{3,5}$/.test(values[field(base + 'BranchCode')] || '')) errors[field(base + 'BranchCode')] = 'Enter a three- to five-digit branch code.';
 };
 tin(revised ? 'txt' : 'txt5', true);
 const rdo = revised ? 'txtRDOCode' : 'txt5RDOCode';
 if (!/^\d{3}$/.test(values[field(rdo)] || '') || values[field(rdo)] === '000') errors[field(rdo)] = 'Select a valid RDO code.';
 require(revised ? 'txtTaxpayerName' : 'txtTaxPayername', 'the taxpayer name');
 require(revised ? 'txtAddress' : 'txt11Address', 'the registered address');
 require(revised ? 'txtZipCode' : 'txt14zip', 'the ZIP code');
 birthdayErrors(values, errors, revised ? 'txtBirth' : 'txt13Birth', true);
 if (!revised) require('txt15Telno', 'the telephone number');
 const spouseTin = revised ? 'txtSpouse' : 'txt7';
 const spouseName = revised ? 'txtSpouseName' : 'txtSpousename';
 const spouse = quarterlyIncludesSpouse(code, values);
 if (spouse) {
  tin(spouseTin, true);
  require(spouseName, 'the spouse name');
  const spouseRdo = revised ? 'txtSpouseRDOCode' : 'txt7RDOCode';
  if (!/^\d{3}$/.test(values[field(spouseRdo)] || '') || values[field(spouseRdo)] === '000') errors[field(spouseRdo)] = 'Select a valid spouse RDO code.';
  if (!revised) {
   require('txt12Address', 'the spouse address');
   require('txt17', 'the spouse ZIP code');
   require('txt18Telno', 'the spouse telephone number');
   birthdayErrors(values, errors, 'txt16Birth', true);
  }
 }
 if (!revised) {
  select('optATC20', ['II011', 'II012', 'II013'], 'the taxpayer ATC');
  if (!['I', 'O'].includes(values['frm1701:optMethodOfDeduction23'])) errors['frm1701:optMethodOfDeduction23'] = 'Select the taxpayer deduction method.';
  if (spouse) {
   select('optATC22', ['II011', 'II012', 'II013'], 'the spouse ATC');
   if (!['I', 'O'].includes(values['frm1701:optMethodOfDeduction24'])) errors['frm1701:optMethodOfDeduction24'] = 'Select the spouse deduction method.';
  }
  return errors;
 }
 select('optTaxpayerType', ['Single', 'Professional', 'Estate', 'Trust'], 'the taxpayer type');
 for (const person of ['A', 'B']) {
  if (person === 'B' && !spouse) continue;
  const spousePerson = person === 'B';
  const atcName = spousePerson ? 'optSpouseATC' : 'optATC';
  const methodName = spousePerson ? 'optSpouseMethod' : 'optMethodOfDeduction';
  const atc = quarterlyAtc(values, spousePerson);
  const rates = ['II012', 'II014', 'II013', 'II015', 'II017', 'II016'];
  if (spousePerson && !['1', '2', '3'].some(index => values[field('optSpouseType_' + index)])) errors[field('optSpouseType_1')] = 'Select the spouse taxpayer type.';
  if (!(spousePerson ? [...rates, 'II011'] : rates).includes(atc)) {
   errors[field(atcName)] = 'Select the ATC.';
   continue;
  }
  const rate = quarterlySelectedRate(values, spousePerson);
  if (rate === 'Graduated') select(methodName, ['I', 'O'], 'the deduction method');
  if (rate === 'Percentage') {
   const cumulativeIncomeCents = [47, 48, 50].reduce(
    (total, item) => total + Math.round(amount(values, 'txt' + item + person) * 100), 0
   );
   if (cumulativeIncomeCents > 300_000_000) {
    errors[field('txt47' + person)] = 'Cumulative sales or receipts plus other non-operating income exceed ₱3,000,000. Select graduated rates.';
   }
   const subtraction = amount(values, 'txt52' + person);
   if (atc !== 'II016' && (subtraction < 0 || subtraction > 250000)) {
    errors[field('txt52' + person)] = 'Item 52 must be between zero and P250,000.';
   }
  }
 }
 return errors;
}
