export type TableSearchRow = { id: string; [key: string]: string | number };

export function matchesRecord(
 row: TableSearchRow,
 keys: string[],
 query: string,
 identifierKeys: string[] = []
): boolean {
 const search = query.trim().toLocaleLowerCase();
 const digits = /^[\d\s-]+$/.test(search) ? search.replace(/\D/g, '') : '';
 return keys.some(key => {
  const value = String(row[key] ?? '').toLocaleLowerCase();
  return value.includes(search) || Boolean(digits && identifierKeys.includes(key) && value.replace(/\D/g, '').includes(digits));
 });
}

export type TableViewState = {
 query: string;
 applied: Record<string, string[]>;
 hidden: string[];
 compact: boolean;
 sortKey: string;
 sortDirection: 'ascending' | 'descending';
 page: number;
 pageSize: number;
};

type ViewSchema = {
 columns: { key: string; locked?: boolean }[];
 filters: { key: string; options: { value: string }[] }[];
};
type TableViewStorage = Pick<Storage, 'getItem' | 'setItem'>;
const storagePrefix = 'ebirforms-table-view:';

function isObject(value: unknown): value is Record<string, unknown> {
 return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Discard obsolete fields instead of letting older view settings hide new columns. */
export function restoreTableView(raw: string, schema: ViewSchema): TableViewState | null {
 try {
  const parsed: unknown = JSON.parse(raw);
  if (!isObject(parsed) || parsed.version !== 1 || typeof parsed.query !== 'string'
   || !isObject(parsed.applied) || !Array.isArray(parsed.hidden) || typeof parsed.compact !== 'boolean'
   || typeof parsed.sortKey !== 'string' || !['ascending', 'descending'].includes(String(parsed.sortDirection))) return null;
  const applied: Record<string, string[]> = {};
  if (isObject(parsed.applied)) {
   for (const filter of schema.filters) {
    const values = parsed.applied[filter.key];
    if (!Array.isArray(values)) continue;
    applied[filter.key] = [...new Set(values.filter((value): value is string => typeof value === 'string' && filter.options.some(option => option.value === value)))];
   }
  }
  const hidden = Array.isArray(parsed.hidden)
   ? [...new Set(parsed.hidden.filter((key): key is string => typeof key === 'string' && schema.columns.some(column => column.key === key && !column.locked)))]
   : [];
  return {
   query: typeof parsed.query === 'string' ? parsed.query : '',
   applied,
   hidden,
   compact: parsed.compact === true,
   sortKey: typeof parsed.sortKey === 'string' && schema.columns.some(column => column.key === parsed.sortKey) ? parsed.sortKey : '',
   sortDirection: parsed.sortDirection === 'descending' ? 'descending' : 'ascending',
   page: typeof parsed.page === 'number' && Number.isSafeInteger(parsed.page) && parsed.page > 0 ? parsed.page : 1,
   pageSize: typeof parsed.pageSize === 'number' && [12, 24, 48].includes(parsed.pageSize) ? parsed.pageSize : 12
  };
 } catch {
  return null;
 }
}

export function loadTableView(storage: TableViewStorage, key: string, schema: ViewSchema): TableViewState | null {
 try {
  const raw = storage.getItem(storagePrefix + key);
  return raw === null ? null : restoreTableView(raw, schema);
 } catch {
  return null;
 }
}

export function saveTableView(storage: TableViewStorage, key: string, state: TableViewState): void {
 try {
  storage.setItem(storagePrefix + key, JSON.stringify({ version: 1, ...state }));
 } catch {
  // View preferences are optional. A blocked or full session store must not prevent work.
 }
}
