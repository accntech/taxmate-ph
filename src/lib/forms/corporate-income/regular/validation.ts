import { taxpayerEmailError } from '$lib/profiles/profile';
import type { CorporatePage, CorporateValues } from '../types';
import { regularField as field, regularNumber as number, regularUsesOsd } from './calculations';

function validDate(value: string): boolean {
 const parts = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
 const source = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
 const iso = parts ? value : source ? `${source[3]}-${source[1]}-${source[2]}` : '';
 const date = new Date(iso + 'T00:00:00Z');
 return !!iso && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === iso;
}

export function validateRegular(code: string, pages: CorporatePage[], values: CorporateValues): CorporateValues {
 const errors: CorporateValues = {};
 const legacy = code === '1702RT';
 const required = (id: string, label: string) => {
  if (!values[field(id)]?.trim()) errors[field(id)] = `Enter ${label}.`;
 };
 const year = Number(values[field('txtPg1I2Year')]);
 if (!/^\d{4}$/.test(values[field('txtPg1I2Year')] ?? '') || year < (legacy ? 2013 : 2018)) errors[field('txtPg1I2Year')] = `Enter a year from ${legacy ? 2013 : 2018} onward.`;
 const month = Number(values[field('ddlPg1I2Month')]);
 if (month < 1 || month > 12 || !Number.isInteger(month)) errors[field('ddlPg1I2Month')] = 'Select the year-end month.';
 required('rdoPg1I1', 'the accounting period');
 if (values[field('rdoPg1I1')] === 'C' && month !== 12 && values[field('rdoPg1I4ShortPeriod')] !== 'Y') errors[field('ddlPg1I2Month')] = 'A calendar year ends in December unless this is a short-period return.';
 required(legacy ? 'txtPg1Pt1I9Name' : 'txtPg1Pt1I8Name1', 'the registered name in taxpayer details');
 required(legacy ? 'txtPg1Pt1I10Address' : 'txtPg1Pt1I9Address1', 'the registered address in taxpayer details');
 required(legacy ? 'txtPg1Pt1I7RDO' : 'txtRDO', 'the RDO code in taxpayer details');
 required('txtPg1Pt1I11Contact', 'the contact number in taxpayer details');
 required(legacy ? 'txtPg1Pt1I8' : 'txtPg1Pt1I10', 'the date of incorporation or organization');
 const email = taxpayerEmailError(values[field('txtPg1Pt1I12Email')] ?? '', true);
 if (email) errors[field('txtPg1Pt1I12Email')] = email;
 for (const part of [1, 2, 3]) if (!/^\d{3}$/.test(values[field('txtPg1Pt1I6TIN' + part)] ?? '')) errors[field('txtPg1Pt1I6TIN' + part)] = 'Complete the taxpayer TIN in taxpayer details.';
 if (!/^\d{3,5}$/.test(values[field('txtPg1Pt1I6TIN4')] ?? '')) errors[field('txtPg1Pt1I6TIN4')] = 'Complete the branch code in taxpayer details.';
 const incorporationId = legacy ? 'txtPg1Pt1I8' : 'txtPg1Pt1I10';
 const incorporation = values[field(incorporationId)] ?? '';
 const incorporationYear = Number(incorporation.match(/^\d{4}/)?.[0] ?? incorporation.match(/\d{4}$/)?.[0]);
 const incorporationMonth = Number(incorporation.startsWith(String(incorporationYear)) ? incorporation.slice(5, 7) : incorporation.slice(0, 2));
 if (incorporationYear > year || (incorporationYear === year && incorporationMonth > month)) errors[field(incorporationId)] = 'The incorporation date cannot follow the end of the taxable year.';
 if (['Y', 'IC055'].includes(values[field('rdoPg1I5Atc')]) && incorporationYear && year - incorporationYear < 4) errors[field('rdoPg1I5Atc')] = 'MCIT starts in the fourth taxable year following incorporation.';
 const method = legacy ? 'rdoPg1Pt1I15ItemizedDeduction' : 'rdoPg1Pt1I13ItemizedDeduction';
 required(method, 'the method of deductions');
 if (!['Y', 'IC055'].includes(values[field('rdoPg1I5Atc')]) && values[field('rdoPg1I5AtcOther')] !== 'Y') errors[field('rdoPg1I5Atc')] = 'Select the applicable ATC.';
 const net = number(values, legacy ? 'txtPg1Pt2I18NetTax' : 'txtPg1Pt2I16NetTax');
 if (net < 0 && !values[field('Pg1Pt2I21')]) errors[field('Pg1Pt2I21')] = 'Select how the overpayment will be treated.';
 const fields = pages.flatMap(page => page.sections.flatMap(section => section.rows.flatMap(row => row.fields)));
 for (const item of fields) {
  const value = values[item.id]?.trim();
  if (!value) continue;
  if (item.kind === 'date' && !validDate(value)) errors[item.id] = 'Enter a valid date.';
  if (item.kind === 'money' || item.kind === 'percent') {
   const raw = value.replaceAll(',', '').replace(/^\((.*)\)$/, '-$1');
   if (!Number.isFinite(Number(raw))) errors[item.id] = 'Enter a valid amount.';
  }
 }
 for (const page of pages) for (const section of page.sections) for (const row of section.rows) {
  const descriptions = row.fields.filter(item => item.kind === 'text' && !item.profileKey && !item.readonly);
  const amounts = row.fields.filter(item => item.kind === 'money' && !item.readonly);
  if (descriptions.length && amounts.some(item => number(values, item.id.split(':').at(-1)!) > 0)) {
   for (const item of descriptions) if (!values[item.id]?.trim()) errors[item.id] = 'Complete the details for the entered amount.';
  }
 }
 const nolco = legacy ? 'txtPg5Sc6A' : 'txtPg4Sc3A';
 for (const row of [4, 5, 6, 7]) {
  const amount = number(values, `${nolco}I${row}C2`);
  const used = [3, 4, 5].reduce((total, column) => total + number(values, `${nolco}I${row}C${column}`), 0);
  if (used > amount) errors[field(`${nolco}I${row}C5`)] = 'NOLCO applied and expired cannot exceed the loss available.';
  if (amount > 0 && !(row === 7 && number(values, `${nolco}I7CtrModal`) > 0) && !/^\d{4}$/.test(values[field(`${nolco}I${row}C1`)] ?? '')) errors[field(`${nolco}I${row}C1`)] = 'Enter the year the loss was incurred.';
 }
 const mcit = legacy ? 'txtPg6Sc8' : 'txtPg4Sc4';
 for (const row of [1, 2, 3]) {
  const used = [5, 6, 7].reduce((total, column) => total + number(values, `${mcit}I${row}C${column}`), 0);
  if (used > number(values, `${mcit}I${row}C4`)) errors[field(`${mcit}I${row}C7`)] = 'MCIT applied and expired cannot exceed the excess MCIT available.';
 }
 const reconciliation = legacy ? 'txtPg6Sc9I10NetTaxableIncome' : 'txtPg4Sc5I10NetTaxableIncome';
 const taxable = legacy ? 'txtPg2Pt4I40NetTaxable' : 'txtPg2Pt4I39NetTaxable';
 if (number(values, reconciliation) !== number(values, taxable)) errors[field(reconciliation)] = 'The reconciliation must equal net taxable income in the computation of tax.';
 if (legacy) {
  const assets = number(values, 'txtPg7Sc10I7TotalAssets');
  const liabilities = number(values, 'txtPg7Sc10I17TotalLiabilitiesEquity');
  if (!regularUsesOsd(values, true) && (assets <= 0 || liabilities <= 0)) errors[field('txtPg7Sc10I7TotalAssets')] = 'Complete the balance sheet with positive total assets and liabilities/equity.';
  if (assets !== liabilities) errors[field('txtPg7Sc10I17TotalLiabilitiesEquity')] = 'Total assets must equal total liabilities and equity.';
  const kinds = ['Stockholders', 'Partners', 'Members'].filter(kind => values[field('chkPg7Sc11' + kind)] === 'Y');
  if (!kinds.length) errors[field('chkPg7Sc11Stockholders')] = 'Select stockholders, partners, or members information.';
  const enteredRows = Array.from({ length: 20 }, (_, index) => index + 1).filter(row => values[field(`txtPg7Sc11I${row}C1`)]?.trim());
  const minimum = kinds.includes('Partners') ? 2 : 1;
  if (kinds.length && enteredRows.length < minimum) errors[field('txtPg7Sc11I1C1')] = `Enter at least ${minimum} registered ${minimum === 1 ? 'name' : 'names'} with TIN.`;
  for (const row of enteredRows) {
   for (const segment of [1, 2, 3]) if (!/^\d{3}$/.test(values[field(`txtPg7Sc11I${row}Tin${segment}`)] ?? '')) errors[field(`txtPg7Sc11I${row}Tin${segment}`)] = 'Enter a complete TIN.';
   if (!/^\d{3,5}$/.test(values[field(`txtPg7Sc11I${row}Tin4`)] ?? '')) errors[field(`txtPg7Sc11I${row}Tin4`)] = 'Enter the branch code.';
   if (!kinds.includes('Members') && (number(values, `txtPg7Sc11I${row}C3`) <= 0 || number(values, `txtPg7Sc11I${row}C4`) <= 0)) errors[field(`txtPg7Sc11I${row}C3`)] = 'Enter the capital contribution and ownership percentage.';
  }
 }
 if (code.endsWith('C') && year >= 2020) {
  const rate = number(values, 'Pg2Pt4I40IncomeTaxRate');
  if (rate <= 0 || rate > 100) errors[field('Pg2Pt4I40IncomeTaxRate')] = 'Enter the applicable income tax rate.';
 }
 if (!regularUsesOsd(values, legacy) && !legacy && number(values, 'txtPg2Pt4I35SpecialAllowable') > 0 && number(values, 'txtPg2Pt5I57SpecialAllowable') <= 0) errors[field('txtPg2Pt5I57SpecialAllowable')] = 'Enter the tax relief from special allowable deductions.';
 return errors;
}
