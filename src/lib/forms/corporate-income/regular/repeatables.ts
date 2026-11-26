import type { CorporatePage, CorporateRow, CorporateSection, CorporateValues } from '../types';
import { regularField as field, regularNumber as number } from './calculations';

type Group = { base: string; label: string };
const revisedGroups: Group[] = [
 { base: 'txtPg2Pt4I54', label: 'Other tax credits' },
 { base: 'txtPg3Sc1I17i', label: 'Other ordinary allowable deductions' },
 { base: 'txtPg3Sc2I4', label: 'Special allowable deductions' },
 { base: 'txtPg4Sc5I3', label: 'Reconciliation additions' },
 { base: 'txtPg4Sc5I6', label: 'Reconciliation income exclusions' },
 { base: 'txtPg4Sc5I8', label: 'Reconciliation deductions' }
];
const legacyGroups: Group[] = [
 { base: 'txtPg4Sc3I3', label: 'Other taxable income' },
 { base: 'txtPg4Sc4I4', label: 'Other amortization' },
 { base: 'txtPg5Sc4I39', label: 'Other ordinary allowable deductions' },
 { base: 'txtPg5Sc5I4', label: 'Special allowable deductions' },
 { base: 'txtPg5Sc6AI7', label: 'NOLCO carryovers' },
 { base: 'txtPg6Sc7I11', label: 'Other tax credits' },
 { base: 'txtPg6Sc9I3', label: 'Reconciliation additions' },
 { base: 'txtPg6Sc9I6', label: 'Reconciliation income exclusions' },
 { base: 'txtPg6Sc9I8', label: 'Reconciliation deductions' },
 { base: 'txtPg8Sc12I4', label: 'Prizes and winnings subject to final withholding' }
];
const groups = (code: string) => code === '1702RT' ? legacyGroups : revisedGroups;
const count = (values: CorporateValues, group: Group) => Math.max(0, Math.min(99, Math.floor(number(values, group.base + 'CtrModal'))));
const rows = (pages: CorporatePage[]) => pages.flatMap(page => page.sections.flatMap(section => section.rows));
const baseFields = (row: CorporateRow, group: Group) => row.fields.filter(item => new RegExp('^' + field(group.base) + 'C\\d$').test(item.id));
const findRow = (pages: CorporatePage[], group: Group) => rows(pages).find(row => row.fields.some(item => item.id === field(group.base + 'C1')));

export function regularRepeatablePages(code: string, pages: CorporatePage[]): CorporatePage[] {
 const result = structuredClone(pages);
 for (const group of groups(code)) {
  const row = findRow(result, group);
  if (!row) continue;
  row.fields.push({ id: field(group.base + 'CtrModal'), label: group.label, kind: 'integer', defaultValue: '0', maxLength: 2, repeatable: { label: group.label, limit: 99, rollup: true } });
 }
 return result;
}

function detailRows(group: Group, row: CorporateRow, values: CorporateValues): CorporateRow[] {
 return Array.from({ length: count(values, group) }, (_, index) => ({
  item: `${row.item ?? group.base.match(/I(\d+[a-z]?)/)?.[1] ?? ''}.${index + 1}`,
  label: `${group.label} ${index + 1}`,
  entry: { group: field(group.base + "CtrModal"), index },
  fields: baseFields(row, group).map(item => ({
   ...item, readonly: false, id: field(`${group.base}.${index + 1}${item.id.slice(-2)}`)
  }))
 }));
}

export function expandRegularPages(code: string, pages: CorporatePage[], values: CorporateValues): CorporatePage[] {
 const result = structuredClone(pages);
 for (const page of result) for (const section of page.sections) {
  section.rows = section.rows.flatMap(row => {
   const group = groups(code).find(group => row.fields.some(item => item.id === field(group.base + 'CtrModal')));
   if (!group || count(values, group) === 0) return [row];
   const summary: CorporateRow = { ...row, fields: row.fields.map(item => item.id.endsWith('CtrModal') ? item : { ...item, readonly: true }) };
   return [summary, ...detailRows(group, row, values)];
  });
 }
 return result;
}

export function regularContinuations(code: string, pages: CorporatePage[], values: CorporateValues): CorporateSection[] {
 return groups(code).flatMap(group => {
  const row = findRow(pages, group);
  return row && count(values, group) > 0 ? [{ title: group.label, rows: detailRows(group, row, values), columns: baseFields(row, group).map(item => item.label ?? '') }] : [];
 });
}

export function rollupRegularDetails(code: string, pages: CorporatePage[], input: CorporateValues): CorporateValues {
 const values = { ...input };
 for (const group of groups(code)) {
  const row = findRow(pages, group);
  const length = count(values, group);
  if (!row || length === 0) continue;
  const fields = baseFields(row, group);
  const hasSavedDetails = fields.some(item => Object.hasOwn(values, field(group.base + '.1' + item.id.slice(-2))));
  if (!hasSavedDetails) {
   // Opening the detailed list carries the existing entry into its first row.
   for (const item of fields) values[field(group.base + '.1' + item.id.slice(-2))] = values[item.id] ?? '';
  }
  for (const item of fields) {
   const column = item.id.slice(-2);
   const detailIds = Array.from({ length }, (_, index) => field(`${group.base}.${index + 1}${column}`));
   values[item.id] = item.kind === 'money' || item.kind === 'percent'
    ? String(detailIds.reduce((total, id) => total + number(values, id.slice('frm1702RT:'.length)), 0))
    : length === 1 ? values[detailIds[0]] ?? '' : item.kind === 'integer' ? '' : 'OTHERS';
  }
  const pattern = new RegExp('^' + field(group.base).replaceAll('.', '\\.') + '\\.(\\d+)C\\d$');
  for (const id of Object.keys(values)) {
   const match = id.match(pattern);
   if (match && Number(match[1]) > length) delete values[id];
  }
 }
 return values;
}

export function validateRegularDetails(code: string, pages: CorporatePage[], values: CorporateValues): CorporateValues {
 const errors: CorporateValues = {};
 for (const group of groups(code)) {
  const countField = field(group.base + 'CtrModal');
  const raw = values[countField];
  if (raw && (!/^\d+$/.test(raw) || Number(raw) > 99)) errors[countField] = 'Enter a number of entries from 0 to 99.';
  const row = findRow(pages, group);
  if (!row) continue;
  for (const detail of detailRows(group, row, values)) {
   const entered = detail.fields.some(item => (values[item.id] ?? '').trim() && values[item.id] !== '0');
   if (!entered) continue;
   for (const item of detail.fields) {
    if (item.kind === 'text' && !values[item.id]?.trim()) errors[item.id] = `Enter ${item.label?.toLowerCase() ?? 'the description'}.`;
    if (item.kind === 'integer' && !/^\d{4}$/.test(values[item.id] ?? '')) errors[item.id] = 'Enter the year the loss was incurred.';
    if (item.kind === 'money' && values[item.id] && !Number.isFinite(Number(values[item.id].replaceAll(',', '')))) errors[item.id] = 'Enter a valid amount.';
   }
  }
 }
 return errors;
}
