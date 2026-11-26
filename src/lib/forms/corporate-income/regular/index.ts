import type { CorporateForm, CorporatePage, CorporateValues } from '../types';
import legacyPages from './1702rt.json';
import revisedPages from './1702rtv2018.json';
import createPages from './1702rtv2018c.json';
import { calculateRegular, regularField, regularUsesManualRates, regularUsesOsd } from './calculations';
import { validateRegular } from './validation';
import { expandSupplementalPages, supplementalAdditionalExempt, supplementalAdditionalTax, supplementalContinuations, supplementalCountPages, validateSupplementalDetails } from './supplemental';
import { expandRegularPages, regularContinuations, regularRepeatablePages, rollupRegularDetails, validateRegularDetails } from './repeatables';

const calculatedRates = new Set([
 regularField('Pg2Pt4I40IncomeTaxRate'),
 regularField('txtPg2Pt4I42MinimumCorporate'),
 regularField('txtPg2Pt5I57SpecialAllowable')
]);

const revisions = [
 { code: '1702RT', revision: 'June 2013', pages: legacyPages },
 { code: '1702RTv2018', revision: 'January 2018', pages: revisedPages },
 { code: '1702RTv2018C', revision: 'January 2018 · CREATE', pages: createPages }
];

export const regularForms: CorporateForm[] = revisions.map(({ code, revision, pages }) => {
 const legacy = code === '1702RT';
 const fixedPages = regularRepeatablePages(code, pages as CorporatePage[]);
 const editorPages = legacy ? supplementalCountPages(fixedPages) : fixedPages;
 const expandedPages = (values: CorporateValues) => {
  const expanded = expandRegularPages(code, editorPages, values);
  return legacy ? expandSupplementalPages(expanded, values) : expanded;
 };
 return {
  code, title: 'Annual Income Tax Return for Corporations Subject Only to Regular Income Tax', revision,
  year: regularField('txtPg1I2Year'), month: regularField('ddlPg1I2Month'),
  periodType: regularField('rdoPg1I1'), shortPeriod: regularField('rdoPg1I4ShortPeriod'),
  amount: regularField(legacy ? 'txtPg1Pt2I20TotalAmount' : 'txtPg1Pt2I21TotalAmount'), decimals: 0,
  pages: editorPages,
  pagesFiledField: legacy ? regularField('txtPg1Pt2PagesFilled') : undefined,
  expandPages: expandedPages,
  fieldReadonly: legacy ? undefined : (id, values) => calculatedRates.has(id) && !regularUsesManualRates(code, values),
  continuations: (values: CorporateValues) => [...regularContinuations(code, editorPages, values), ...(legacy ? supplementalContinuations(editorPages, values) : [])],
  calculate: (values: CorporateValues) => {
   const result = calculateRegular(code, rollupRegularDetails(code, editorPages, values));
   if (legacy) {
    for (const [name, additional] of [
     ['txtSc12I19TotalFinalTaxWitheld', supplementalAdditionalTax(result)],
     ['txtPg8Sc13I8TotalIncome', supplementalAdditionalExempt(result)]
    ] as const) result[regularField(name)] = String(Number(result[regularField(name)] || 0) + additional);
   }
   return result;
  },
  validate: (values: CorporateValues) => ({ ...validateRegular(code, expandedPages(values), values), ...validateRegularDetails(code, editorPages, values), ...(legacy ? validateSupplementalDetails(editorPages, values) : {}) }),
  fieldApplies: (id: string, values: CorporateValues) => {
   if (id === regularField('drpPg1I5AtcOther')) return values[regularField('rdoPg1I5AtcOther')] === 'Y';
   if (id === regularField(legacy ? 'txtPg6Sc7I8TaxPaidInReturn' : 'txtPg2Pt4I51TaxPaidInReturn')) return values[regularField(legacy ? 'rdoPg1I2Ammend' : 'rdoPg1I3Ammend')] === 'Y';
   if (id === regularField('txtPg2Pt5I57SpecialAllowable') && regularUsesOsd(values, legacy)) return false;
   if (id === regularField('Pg1Pt2I21')) return Number(values[regularField(legacy ? 'txtPg1Pt2I18NetTax' : 'txtPg1Pt2I16NetTax')]) < 0;
   if (regularUsesOsd(values, legacy) && /Sc(?:1|2|3A?)I/.test(id) && !legacy) return false;
   if (regularUsesOsd(values, legacy) && /Sc(?:4|5|6A?)I/.test(id) && legacy) return false;
   return true;
  }
 };
});
