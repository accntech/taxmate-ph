import type { CorporateField, CorporatePage, CorporateRow, CorporateSection, CorporateValues } from '../types';
import { regularField as field, regularNumber as number } from './calculations';

type SupplementalGroup = { key: string; schedule: number; first: number; last: number; label: string };
const groups: SupplementalGroup[] = [
 { key: 'Pg8Sc12II', schedule: 12, first: 5, last: 9, label: 'Real properties subject to final tax' },
 { key: 'Pg8Sc12III', schedule: 12, first: 10, last: 15, label: 'Shares of stock subject to final tax' },
 { key: 'Pg8Sc12IV', schedule: 12, first: 16, last: 18, label: 'Other income subject to final tax' },
 { key: 'Pg8Sc13I', schedule: 13, first: 2, last: 5, label: 'Exempt properties received' },
 { key: 'Pg8Sc13II', schedule: 13, first: 6, last: 7, label: 'Other exempt income' }
];
const countId = (group: SupplementalGroup) => field('txtCtrmodal' + group.key);
const count = (group: SupplementalGroup, values: CorporateValues) => Math.max(0, Math.min(99, Math.floor(number(values, 'txtCtrmodal' + group.key))));
const groupRows = (group: SupplementalGroup, pages: CorporatePage[]): CorporateRow[] => {
 const pattern = new RegExp(`Pg8Sc${group.schedule}I(\\d+)C`);
 return pages.flatMap(page => page.sections.flatMap(section => section.rows)).filter(row => row.fields.some(item => {
  const match = item.id.match(pattern);
  return match && Number(match[1]) >= group.first && Number(match[1]) <= group.last;
 }));
};
function detailField(item: CorporateField, index: number): CorporateField {
 let id = item.id.replace(/C([12])Date$/, (_, column) => `C${column === '1' ? 'A' : 'B'}Date${index}`);
 if (id === item.id) id = item.id.replace(/C([12])$/, (_, column) => `C${column === '1' ? 'A' : 'B'}-${index}`);
 if (/ddlPg8Sc12I10C[12]$/.test(item.id)) id = item.id.replace('ddlPg8', 'drpPg8').replace(/C([12])$/, (_, column) => `C${column === '1' ? 'A' : 'B'}-1-${index}`);
 if (/txtPg8Sc12I10C[12]$/.test(item.id)) id = item.id.replace(/C([12])$/, (_, column) => `C${column === '1' ? 'A' : 'B'}-2-${index}`);
 return { ...item, id, readonly: false };
}
function detailRows(group: SupplementalGroup, pages: CorporatePage[], values: CorporateValues): CorporateRow[] {
 const template = groupRows(group, pages);
 return Array.from({ length: count(group, values) }, (_, index) => template.map(row => ({
  ...row, entry: { group: countId(group), index }, item: `${row.item ?? ''}.${index + 1}`, label: `${row.label} · additional pair ${index + 1}`,
  fields: row.fields.filter(item => item.id !== countId(group)).map(item => detailField(item, index + 1))
 }))).flat();
}
export function supplementalCountPages(pages: CorporatePage[]): CorporatePage[] {
 const result = structuredClone(pages);
 for (const group of groups) {
  const row = groupRows(group, result).at(-1);
  row?.fields.push({ id: countId(group), label: group.label, kind: 'integer', defaultValue: '0', maxLength: 2, repeatable: { label: group.label, limit: 99 } });
 }
 return result;
}
export function expandSupplementalPages(pages: CorporatePage[], values: CorporateValues): CorporatePage[] {
 const result = structuredClone(pages);
 for (const page of result) for (const section of page.sections) {
  section.rows = section.rows.flatMap(row => {
   const group = groups.find(group => row.fields.some(item => item.id === countId(group)));
   return group ? [row, ...detailRows(group, pages, values)] : [row];
  });
 }
 return result;
}
export function supplementalContinuations(pages: CorporatePage[], values: CorporateValues): CorporateSection[] {
 return groups.filter(group => count(group, values) > 0).map(group => ({title: group.label, rows: detailRows(group, pages, values)}));
}
export function supplementalAdditionalTax(values: CorporateValues): number {
 return groups.filter(group => group.schedule === 12).reduce((total, group) => total +
  Array.from({ length: count(group, values) }, (_, index) => ['A', 'B'].reduce((subtotal, column) =>
   subtotal + number(values, `txtPg8Sc12I${group.last}C${column}-${index + 1}`), 0)).reduce((sum, amount) => sum + amount, 0), 0);
}
export function supplementalAdditionalExempt(values: CorporateValues): number {
 return groups.filter(group => group.schedule === 13).reduce((total, group) => total +
  Array.from({ length: count(group, values) }, (_, index) => ['A', 'B'].reduce((subtotal, column) =>
   subtotal + number(values, `txtPg8Sc13I${group.last}C${column}-${index + 1}`), 0)).reduce((sum, amount) => sum + amount, 0), 0);
}
export function validateSupplementalDetails(pages: CorporatePage[], values: CorporateValues): CorporateValues {
 const errors: CorporateValues = {};
 for (const group of groups) {
  const raw = values[countId(group)];
  if (raw && (!/^\d+$/.test(raw) || Number(raw) > 99)) errors[countId(group)] = 'Enter a number of additional pairs from 0 to 99.';
  const details = detailRows(group, pages, values);
  for (let index = 1; index <= count(group, values); index++) for (const column of ['A', 'B']) {
   const fields = details.flatMap(row => row.fields).filter(item => new RegExp(`C${column}(?:Date|-|-[12]-)${index}$`).test(item.id));
   const entered = fields.some(item => item.kind === 'money' && number(values, item.id.slice('frm1702RT:'.length)) > 0);
   if (!entered) continue;
   for (const item of fields) if ((item.kind === 'text' || item.kind === 'date') && !values[item.id]?.trim()) errors[item.id] = 'Complete the details for the entered amount.';
  }
 }
 return errors;
}
