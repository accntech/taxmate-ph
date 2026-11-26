import { describe, expect, it } from 'vitest';
import { regularForms } from '$lib/forms/corporate-income/regular';

const field = (name: string) => 'frm1702RT:' + name;
const form = (code: string) => regularForms.find(form => form.code === code)!;
const values = (input: Record<string, string>) => Object.fromEntries(Object.entries(input).map(([name, value]) => [field(name), value]));

describe('regular corporate income return revisions', () => {
 it('retains all three selectable revisions and the source page counts', () => {
  expect(regularForms.map(form => [form.code, form.pages.length])).toEqual([
   ['1702RT', 8], ['1702RTv2018', 4], ['1702RTv2018C', 4]
  ]);
 });
 it('computes the January 2018 OSD, normal tax, credits and penalties', () => {
  const result = form('1702RTv2018').calculate(values({
   txtPg1I2Year: '2019', rdoPg1Pt1I13ItemizedDeduction: field('rdoPg1Pt1I13OptionalStandard'),
   txtPg2Pt4I27Sales: '1000000', txtPg2Pt4I28LessSales: '50000', txtPg2Pt4I30LessCost: '250000',
   txtPg2Pt4I44ExcessCredits: '20000', txtPg1Pt2I17Surcharge: '1000'
  }));
  expect(result[field('txtPg2Pt4I33TotalGross')]).toBe('700000');
  expect(result[field('txtPg2Pt4I38OptionalStandard')]).toBe('280000');
  expect(result[field('txtPg2Pt4I41IncomeTaxDue')]).toBe('126000');
  expect(result[field('txtPg1Pt2I21TotalAmount')]).toBe('107000');
 });
 it('uses entered CREATE rate and MCIT for the C revision', () => {
  const result = form('1702RTv2018C').calculate(values({
   txtPg1I2Year:'2025', rdoPg1Pt1I13ItemizedDeduction:field('rdoPg1Pt1I13OptionalStandard'),
   txtPg2Pt4I27Sales:'1000000', Pg2Pt4I40IncomeTaxRate:'20', txtPg2Pt4I42MinimumCorporate:'150000'
  }));
  expect(result[field('txtPg2Pt4I41IncomeTaxDue')]).toBe('120000');
  expect(result[field('txtPg2Pt4I43TotalIncomeTax')]).toBe('150000');
 });
 it('derives the June 2013 sales, expenses and payable from schedules', () => {
  const result = form('1702RT').calculate(values({
   txtPg1I2Year:'2017', rdoPg1Pt1I15ItemizedDeduction:field('rdoPg1Pt1I15ItemizedDeduction'),
   txtPg3Sc1I1GoodsProp:'1000000', txtPg3Sc1I5LessSales:'100000',
   txtPg3Sc2I1MerchInventory:'200000',txtPg3Sc2I2AddPurchases:'100000',txtPg3Sc2I4LessMerch:'50000',
   txtPg4Sc4I29Salaries:'50000', txtPg6Sc7I1ExcessCredits:'30000'
  }));
  expect(result[field('txtPg2Pt4I30NetSales')]).toBe('900000');
  expect(result[field('txtPg2Pt4I31LessCost')]).toBe('250000');
  expect(result[field('txtPg2Pt4I40NetTaxable')]).toBe('600000');
  expect(result[field('txtPg1Pt2I20TotalAmount')]).toBe('150000');
 });
 it('keeps overpayments with penalties consistent with each revision', () => {
  const result = form('1702RTv2018').calculate(values({
   txtPg1I2Year:'2019', rdoPg1Pt1I13ItemizedDeduction:field('rdoPg1Pt1I13ItemizedDeduction'),
   txtPg2Pt4I44ExcessCredits:'5000',txtPg1Pt2I17Surcharge:'1000'
  }));
  expect(result[field('txtPg1Pt2I16NetTax')]).toBe('-5000');
  expect(result[field('txtPg1Pt2I21TotalAmount')]).toBe('1000');
  expect(form('1702RTv2018').validate!(result)[field('Pg1Pt2I21')]).toBeTruthy();
 });
 it('transfers the exact June 2013 NOLCO total to item 37', () => {
  const result = form('1702RT').calculate(values({
   txtPg1I2Year:'2017', rdoPg1Pt1I15ItemizedDeduction:field('rdoPg1Pt1I15ItemizedDeduction'),
   txtPg3Sc1I1GoodsProp:'1000000', txtPg5Sc6AI5C1:'2016', txtPg5Sc6AI5C2:'100000', txtPg5Sc6AI5C5:'50000'
  }));
  expect(result[field('txtPg5Sc6AI8TotalNOLCO')]).toBe('50000');
  expect(result[field('txtPg2Pt4I37Nolco')]).toBe('50000');
  expect(result[field('txtPg2Pt4I40NetTaxable')]).toBe('950000');
 });
 it('labels calendar, method and payment controls and maps the legacy profile', () => {
  const fields = form('1702RT').pages.flatMap(page => page.sections.flatMap(section => section.rows.flatMap(row => row.fields)));
  expect(fields.find(item => item.id === field('txtPg1Pt1I9Name'))?.profileKey).toBe('taxpayerName');
  expect(fields.find(item => item.id === field('txtPg1Pt1I13Business'))?.profileKey).toBe('lineOfBusiness');
  expect(fields.find(item => item.id === field('rdoPg1I1'))?.label).toBe('1 Accounting period');
  expect(fields.find(item => item.id === field('txtPg1Pt3I26DebitMemoC2'))?.label).toBe('Number');
 });

 it('totals final tax withheld in the legacy supplemental schedule', () => {
  const result = form('1702RT').calculate(values({txtPg8Sc12I1C3:'500',txtPg8Sc12I9C1:'1200'}));
  expect(result[field('txtSc12I19TotalFinalTaxWitheld')]).toBe('1700');
 });

 it('includes the actual third other-income and fourth amortization controls', () => {
  const result = form('1702RT').calculate(values({
   rdoPg1Pt1I15ItemizedDeduction:field('rdoPg1Pt1I15ItemizedDeduction'),
   txtPg4Sc3I3C1:'RECOVERY', txtPg4Sc3I3C2:'10000',
   txtPg4Sc4I4C1:'AMORTIZATION', txtPg4Sc4I4C2:'2000'
  }));
  expect(result[field('txtPg2Pt4I33AddOtherTaxable')]).toBe('10000');
  expect(result[field('txtPg2Pt4I35OrdinaryAllowable')]).toBe('2000');
 });

 it('expands source detail rows and carries their amounts into deductions', () => {
  const input = values({
   rdoPg1Pt1I13ItemizedDeduction:field('rdoPg1Pt1I13ItemizedDeduction'), txtPg2Pt4I27Sales:'100000',
   txtPg3Sc1I17iCtrModal:'2', 'txtPg3Sc1I17i.1C1':'POSTAGE', 'txtPg3Sc1I17i.1C2':'1000',
   'txtPg3Sc1I17i.2C1':'STATIONERY', 'txtPg3Sc1I17i.2C2':'2000'
  });
  const result = form('1702RTv2018').calculate(input);
  expect(result[field('txtPg3Sc1I17iC2')]).toBe('3000');
  expect(result[field('txtPg2Pt4I34OrdinaryAllowable')]).toBe('3000');
  const pages = form('1702RTv2018').expandPages!(result);
  expect(pages.flatMap(page => page.sections.flatMap(section => section.rows.flatMap(row => row.fields))).some(item => item.id === field('txtPg3Sc1I17i.2C2'))).toBe(true);
  expect(form('1702RTv2018').continuations!(result)[0].rows).toHaveLength(2);
 });

 it('clears itemized schedules when changing to OSD and retains credits', () => {
  const saved = form('1702RTv2018').calculate(values({
   rdoPg1Pt1I13ItemizedDeduction:field('rdoPg1Pt1I13ItemizedDeduction'),
   txtPg2Pt4I27Sales:'100000',txtPg3Sc1I13Salaries:'10000',txtPg2Pt4I44ExcessCredits:'1000'
  }));
  const changed = form('1702RTv2018').calculate({...saved,[field('rdoPg1Pt1I13ItemizedDeduction')]:field('rdoPg1Pt1I13OptionalStandard')});
  expect(changed[field('txtPg3Sc1I13Salaries')]).toBe('0');
  expect(changed[field('txtPg2Pt4I34OrdinaryAllowable')]).toBe('0');
  expect(changed[field('txtPg2Pt4I44ExcessCredits')]).toBe('1000');
  const restored = form('1702RTv2018').calculate({...changed,[field('rdoPg1Pt1I13ItemizedDeduction')]:field('rdoPg1Pt1I13ItemizedDeduction')});
  expect(restored[field('txtPg2Pt4I37TotalItemized')]).toBe('0');
 });

 it('keeps the regular ATC and MCIT controls independently selectable', () => {
  const fields = form('1702RTv2018').pages.flatMap(page => page.sections.flatMap(section => section.rows.flatMap(row => row.fields)));
  expect(fields.find(item => item.id === field('rdoPg1I5Atc'))?.kind).toBe('checkbox');
  expect(fields.find(item => item.id === field('rdoPg1I5AtcOther'))?.kind).toBe('checkbox');
  const result = form('1702RTv2018').calculate(values({rdoPg1I5Atc:'Y',rdoPg1I5AtcOther:'Y',txtPg1I2Year:'2019',txtPg2Pt4I27Sales:'100000'}));
  expect(result[field('txtPg2Pt4I42MinimumCorporate')]).toBe('2000');
  expect(result[field('rdoPg1I5AtcOther')]).toBe('Y');
 });

 it('retains legacy supplemental additional property pairs in the total and print continuation', () => {
  const result = form('1702RT').calculate(values({
   txtCtrmodalPg8Sc12II:'1', 'txtPg8Sc12I5CA-1':'LAND', 'txtPg8Sc12I9CA-1':'2500',
   txtCtrmodalPg8Sc13II:'1', 'txtPg8Sc13I6CA-1':'EXEMPT RECEIPT', 'txtPg8Sc13I7CA-1':'9000'
  }));
  expect(result[field('txtSc12I19TotalFinalTaxWitheld')]).toBe('2500');
  expect(result[field('txtPg8Sc13I8TotalIncome')]).toBe('9000');
  const pages = form('1702RT').expandPages!(result);
  expect(pages.flatMap(page => page.sections.flatMap(section => section.rows.flatMap(row => row.fields))).some(item => item.id === field('txtPg8Sc12I5CA-1'))).toBe(true);
  expect(form('1702RT').continuations!(result).some(section => section.title === 'Real properties subject to final tax')).toBe(true);
 });

 it('validates the legacy balance sheet and stakeholder information', () => {
  const result = form('1702RT').calculate(values({
   rdoPg1Pt1I15ItemizedDeduction:field('rdoPg1Pt1I15ItemizedDeduction'),
   txtPg7Sc10I1CurrentAssets:'100000',txtPg7Sc10I8CurrentLiabilities:'10000'
  }));
  const errors = form('1702RT').validate!(result);
  expect(errors[field('txtPg7Sc10I17TotalLiabilitiesEquity')]).toBeTruthy();
  expect(errors[field('chkPg7Sc11Stockholders')]).toBeTruthy();
 });
 it('rejects incorporation after the fiscal year and NOLCO beyond available loss', () => {
  const result = form('1702RTv2018').calculate(values({
   txtPg1I2Year:'2019',ddlPg1I2Month:'6',rdoPg1I1:'F',txtPg1Pt1I10:'2020-01-01',
   txtPg4Sc3AI5C1:'2018',txtPg4Sc3AI5C2:'10000',txtPg4Sc3AI5C5:'12000'
  }));
  const errors = form('1702RTv2018').validate!(result);
  expect(errors[field('txtPg1Pt1I10')]).toBeTruthy();
  expect(errors[field('txtPg4Sc3AI5C5')]).toBeTruthy();
 });

 it('normalizes the source two-digit year when reopening older values', () => {
  const result = form('1702RTv2018C').calculate(values({txtPg1I2Year:'19'}));
  expect(result[field('txtPg1I2Year')]).toBe('2019');
  const fields = form('1702RTv2018C').pages.flatMap(page => page.sections.flatMap(section => section.rows.flatMap(row => row.fields)));
  expect(fields.find(item => item.id === field('txtPg1I2Year'))?.maxLength).toBe(4);
 });

 it('preserves a sparse detail draft and validates its missing description', () => {
  const result = form('1702RTv2018').calculate(values({txtPg3Sc1I17iCtrModal:'1','txtPg3Sc1I17i.1C2':'750'}));
  expect(result[field('txtPg3Sc1I17i.1C2')]).toBe('750');
  expect(result[field('txtPg3Sc1I17iC2')]).toBe('750');
  expect(form('1702RTv2018').validate!(result)[field('txtPg3Sc1I17i.1C1')]).toBeTruthy();
 });

 it('clears manual CREATE special-deduction relief under OSD', () => {
  const result = form('1702RTv2018C').calculate(values({
   txtPg1I2Year:'2025',rdoPg1Pt1I13ItemizedDeduction:field('rdoPg1Pt1I13OptionalStandard'),
   txtPg2Pt5I57SpecialAllowable:'5000'
  }));
  expect(result[field('txtPg2Pt5I57SpecialAllowable')]).toBe('0');
 });

});
