import { describe, expect, it } from 'vitest';
import { matchesRecord, type TableViewState } from '$lib/ebirforms/record-table-state';

const row = { id: 'taxpayer', name: 'Sample Taxpayer', tin: '123-456-789-0000', rdo: '040' };
const keys = ['name', 'tin', 'rdo'];

describe('record search', () => {
 it.each(['123456789', '1234567890000', '123 456 789 0000'])('matches a TIN supplied as %s', query => {
  expect(matchesRecord(row, keys, query, ['tin'])).toBe(true);
 });
 it('keeps branch identity and alphabetic queries meaningful', () => {
  expect(matchesRecord(row, keys, '1234567890001', ['tin'])).toBe(false);
  expect(matchesRecord(row, keys, 'abc123456789', ['tin'])).toBe(false);
  expect(matchesRecord(row, keys, '123456789')).toBe(false);
 });
 it('keeps case-insensitive ordinary text and formatted identifiers working', () => {
  expect(matchesRecord(row, keys, ' sample ')).toBe(true);
  expect(matchesRecord(row, keys, '123-456-789')).toBe(true);
  expect(matchesRecord(row, keys, 'missing')).toBe(false);
 });
});

import * as tableState from '$lib/ebirforms/record-table-state';
const schema = {
 columns: [{ key: 'name', locked: true }, { key: 'tin' }, { key: 'status' }],
 filters: [{ key: 'status', options: [{ value: 'Active' }, { value: 'Archived' }] }]
};
const savedView = { query: 'Sample', applied: { status: ['Archived'] }, hidden: ['status'], compact: true, sortKey: 'tin', sortDirection: 'descending', page: 3, pageSize: 24 } satisfies TableViewState;
const serialized = JSON.stringify({ version: 1, ...savedView });

describe('record table view persistence', () => {
 it('restores all list settings from a versioned snapshot', () => {
  expect(tableState.restoreTableView(serialized, schema)).toEqual(savedView);
 });
 it('sanitizes stale columns, filter choices and invalid page settings', () => {
  const stale = JSON.stringify({ version: 1, ...savedView, applied: { status: ['Active', 'Removed'], missing: ['bad'] }, hidden: ['name', 'tin', 'removed'], sortKey: 'removed', page: -2, pageSize: 999 });
  expect(tableState.restoreTableView(stale, schema)).toEqual({ ...savedView, applied: { status: ['Active'] }, hidden: ['tin'], sortKey: '', page: 1, pageSize: 12 });
 });
 it('ignores malformed or unsupported snapshots', () => {
  for (const raw of ['not-json', 'null', '[]', JSON.stringify({ version: 2 }), JSON.stringify({ version: 1 })]) {
   expect(tableState.restoreTableView(raw, schema)).toBeNull();
  }
 });
 it('keeps separate list keys isolated and ignores unavailable storage', () => {
  const data = new Map<string, string>();
  const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); } };
  tableState.saveTableView(storage, 'taxpayers', savedView);
  expect(tableState.loadTableView(storage, 'taxpayers', schema)).toEqual(savedView);
  expect(tableState.loadTableView(storage, 'forms', schema)).toBeNull();
  const unavailable = { getItem: () => { throw Error('blocked'); }, setItem: () => { throw Error('blocked'); } };
  expect(tableState.loadTableView(unavailable, 'taxpayers', schema)).toBeNull();
  expect(() => tableState.saveTableView(unavailable, 'taxpayers', savedView)).not.toThrow();
 });
});
