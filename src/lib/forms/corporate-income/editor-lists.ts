import type { CorporateField, CorporateRow, CorporateSection, CorporateValues } from './types';

export type CorporateEntry = { item: string; rows: CorporateRow[] };
export type CorporateList = {
	label: string;
	counter?: CorporateField;
	entries: CorporateEntry[];
};

export function corporateLists(section: CorporateSection): Map<CorporateRow, CorporateList> {
	const byAnchor = new Map<CorporateRow, CorporateList>();
	const byCounter = new Map<string, CorporateList>();
	const fixed = new Map<string, CorporateList>();
	const details = new Map<string, Map<number, CorporateEntry>>();

	for (const row of section.rows) {
		const counter = row.fields.find(field => field.repeatable);
		const label = row.list ?? counter?.repeatable?.label;
		let list = label ? fixed.get(label) : undefined;
		if (!list && (row.list || counter?.repeatable)) {
			list = { label: row.list ?? counter!.repeatable!.label, entries: [] };
			byAnchor.set(row, list);
			if (label) fixed.set(label, list);
		}
		if (list && (row.list || row.fields.some(field => !field.repeatable && !field.readonly && (field.kind === 'text' || field.kind === 'integer')))) {
			const existing = list.entries.find(entry => entry.item === row.item);
			if (existing) existing.rows.push(row);
			else list.entries.push({ item: row.item ?? '', rows: [row] });
		}
		if (list && counter) {
			list.counter = counter;
			byCounter.set(counter.id, list);
		}
	}

	for (const row of section.rows) {
		if (!row.entry) continue;
		const { group, index } = row.entry;
		const list = byCounter.get(group);
		if (!list) continue;
		const entries = details.get(group) ?? new Map<number, CorporateEntry>();
		details.set(group, entries);
		const existing = entries.get(index);
		if (existing) existing.rows.push(row);
		else {
			const entry = { item: row.item ?? String(index + 1), rows: [row] };
			entries.set(index, entry);
			list.entries.push(entry);
		}
	}
	return byAnchor;
}

export const nolcoListLabel = 'NOLCO carryovers';

const mixedLossColumns = {
	year: 'Year incurred',
	A: 'Net operating loss',
	B: 'Applied in previous years',
	C: 'Expired',
	D: 'Applied this year',
	E: 'Remaining balance'
} as const;

function nolcoRows(section: CorporateSection): CorporateSection {
	const byItem = new Map<string, CorporateRow>();
	const rows = section.rows.flatMap(row => {
		if (row.entry) return [row];
		const match = row.fields[0]?.id.match(/(?:Sc(?:3A|6A|7A|IA|F1)I|IShed[78]_)([4-7])/);
		if (!match) {
			const total = row.fields.length === 1 && /Total NOLCO/i.test(row.label);
			return [total ? { ...row, fields: row.fields.map(field => ({ ...field, kind: 'money' as const })) } : row];
		}

		const item = match[1];
		const fields = row.fields.map(field => {
			if (!field.id.startsWith('frm1702MX:')) return field;
			const column = field.id.match(/(year|[A-E])$/i)?.[1];
			const key = (column?.toLowerCase() === 'year' ? 'year' : column) as keyof typeof mixedLossColumns;
			if (!mixedLossColumns[key]) return field;
			return {
				...field, label: mixedLossColumns[key],
				kind: key === 'year' ? 'integer' as const : 'money' as const,
				maxLength: key === 'year' ? 4 : field.maxLength,
				readonly: field.readonly || (key === 'year' && /Sc7AI4year$/.test(field.id))
			};
		});
		const existing = byItem.get(item);
		if (existing) {
			existing.fields.push(...fields);
			return [];
		}
		const entry = { ...row, item, list: nolcoListLabel, fields };
		byItem.set(item, entry);
		return [entry];
	});
	return { ...section, columns: undefined, rows };
}

export const ownerListLabel = 'Stockholders, partners or members';

const fixedLists = [
	[/^frm1702RT:txtPg7Sc11I(\d+)C1$/, ownerListLabel],
	[/^frm1702MX:txtPg8Sc12I(\d+)C1$/, ownerListLabel],
	[/^frm1702EX:txtPg6S8I(\d+)Col1Name$/, ownerListLabel],
	[/^frm1702EX:txtPg2Pt4I(48|49)OtherTaxCrPmtDesc$/, 'Other tax credits'],
	[/^frm1702EX:txtPg3Pt6I(17Others[D-I])Desc$/, 'Other ordinary allowable deductions'],
	[/^frm1702EX:txtPg3Pt6S2I([1-4])Description$/, 'Special allowable deductions'],
	[/^frm1702EX:txtPg3Pt6S3I([23])NonDeductExpenseOtherIncomeDesc$/, 'Reconciliation additions'],
	[/^frm1702EX:txtPg3Pt6S3I([56])NonTaxIncomeAndIncomeSubjectToFinTaxDesc$/, 'Reconciliation income exclusions'],
	[/^frm1702EX:txtPg3Pt6S3I([78])SpecialDeductDesc$/, 'Reconciliation deductions'],
	[/^frm1702q:txt31G(?:others)?$/, 'Other tax credits'],
	[/^frm1702q:Sched4:txtOthrTxCrdts([01])$/, 'Additional other tax credits'],
	[/^frm1702RT:txtPg4Sc3I([123])C1$/, 'Other taxable income'],
	[/^frm1702RT:txtPg4Sc4I([234])C1$/, 'Other amortization'],
	[/^frm1702RT:txtPg5Sc4I(3[6-9])C1$/, 'Other ordinary allowable deductions'],
	[/^frm1702RT:txtPg5Sc5I([1-4])C1$/, 'Special allowable deductions'],
	[/^frm1702RT:txtPg6Sc9I([23])C1$/, 'Reconciliation additions'],
	[/^frm1702RT:txtPg6Sc9I([56])C1$/, 'Reconciliation income exclusions'],
	[/^frm1702RT:txtPg6Sc9I([78])C1$/, 'Reconciliation deductions'],
	[/^frm1702EX:txtPg5S4I(3[6-9])Col1$/, 'Other ordinary allowable deductions'],
	[/^frm1702EX:txtPg5S5I([1-4])Col1$/, 'Special allowable deductions'],
	[/^frm1702EX:txtPg5S6I([23])Col1$/, 'Reconciliation additions'],
	[/^frm1702EX:txtPg5S6I([56])Col1$/, 'Reconciliation income exclusions'],
	[/^frm1702EX:txtPg5S6I([78])Col1$/, 'Reconciliation special deductions'],
	[/^frm1702MX:txtPg5Sc4I([123])$/, 'Other taxable income'],
	[/^frm1702MX:txtPg5Sc5I([234])$/, 'Other amortizations'],
	[/^frm1702MX:txtPg7Sc10I([23])$/, 'Reconciliation additions'],
	[/^frm1702MX:txtPg7Sc10I([56])$/, 'Reconciliation income exclusions'],
	[/^frm1702MX:txtPg7Sc10I([78])$/, 'Reconciliation deductions'],
	[/^frm1702RT:txtPg8Sc12I(4)C1$/, 'Prizes and winnings subject to final withholding'],
	[/^frm1702EX:txtPg7Sc9I(4)PrizesC1$/, 'Additional prizes and winnings'],
	[/^frm1702RT:txtPg2Pt4I(53)C1$/, 'Other tax credits'],
	[/^frm1702RT:txtPg3Sc1I(17[d-i])C1$/, 'Other ordinary allowable deductions'],
	[/^frm1702RT:txtPg3Sc2I([1-3])C1$/, 'Special allowable deductions'],
	[/^frm1702RT:txtPg4Sc5I(2)C1$/, 'Reconciliation additions'],
	[/^frm1702RT:txtPg4Sc5I(5)C1$/, 'Reconciliation income exclusions'],
	[/^frm1702RT:txtPg4Sc5I(7)C1$/, 'Reconciliation deductions'],
	[/^frm1702MX:txtPg6Sc5I(3[6-8])other$/, 'Other ordinary allowable deductions'],
	[/^frm1702MX:txtPg6Sc6I([1-3])description$/, 'Special allowable deductions'],
	[/^frm1702MX:txtPg3Sc6I(4)description$/, 'Special allowable deductions'],
	[/^frm1702MX:txtPg7Sc8I(11)$/, 'Other tax credits'],
	[/^frm1702MX:txtPg4Sc10Itm(2)$/, 'Reconciliation additions'],
	[/^frm1702MX:txtPg4Sc10Itm(5)$/, 'Reconciliation income exclusions'],
	[/^frm1702MX:txtPg4Sc10Itm(7)$/, 'Reconciliation deductions']
] as const;

export function fixedCorporateListRow(row: CorporateRow): CorporateRow {
	for (const [pattern, label] of fixedLists) {
		const match = row.fields.map(field => pattern.exec(field.id)).find(Boolean);
		if (!match) continue;
		if (label === 'Other amortization' && row.fields.find(field => pattern.test(field.id))?.kind !== 'text') continue;
		const owner = label === ownerListLabel;
		return {
			...row,
			list: label,
			item: (row.item ?? match[1] ?? '1').replace('17Others', '17').replace(/\s+/g, ''),
			fields: row.fields.map(field => {
				if (!owner) {
					if (field.repeatable || field.kind === 'integer' || /year/i.test(field.id)) return field;
					const amountCount = row.fields.filter(item => item.kind === 'money').length;
					const fieldLabel = field.kind === 'money'
						? amountCount > 1 ? field.label : 'Amount'
						: /LegalBasis|legal basis/i.test(field.id + (field.label ?? '')) || /legal$/i.test(field.id) ? 'Legal basis' : 'Description';
					return { ...field, label: fieldLabel };
				}
				const name = pattern.test(field.id) ? 'Registered name'
					: /(?:Col3CapContri|C3)$/.test(field.id) ? 'Capital contribution'
					: /(?:Col4PTotal|C4)$/.test(field.id) ? 'Ownership percentage' : field.label;
				return { ...field, label: name, kind: name === 'Ownership percentage' ? 'percent' : field.kind };
			})
		};
	}
	return row;
}

const ownerSelection = {
	'1702EX': ['frm1702EX:chkPg6S8StockHolders', 'frm1702EX:chkPg6S8Partners', 'frm1702EX:chkPg6S8MembersInfo'],
	'1702RT': ['frm1702RT:chkPg7Sc11Stockholders', 'frm1702RT:chkPg7Sc11Partners', 'frm1702RT:chkPg7Sc11Members'],
	'1702MX': ['frm1702MX:radPg8Sc12stockholder', 'frm1702MX:radPg8Sc12partner', 'frm1702MX:radPg8Sc12member']
} as const;

export function corporateOwnerSelection(code: string) {
	return ownerSelection[code as keyof typeof ownerSelection];
}

export function corporateOwnerRequired(code: string, row: CorporateRow, field: CorporateField, values: CorporateValues): boolean {
	if (row.list !== ownerListLabel) return false;
	const selection = corporateOwnerSelection(code);
	if (!selection) return false;
	const partners = values[selection[1]] === 'Y';
	const members = values[selection[2]] === 'Y';
	const expected = code === '1702EX' || selection.some(id => values[id] === 'Y');
	const populated = row.fields.some(item => {
		const value = values[item.id]?.trim();
		return value && (!['money', 'percent'].includes(item.kind) || Number(value.replaceAll(',', '')) !== 0);
	});
	if (!populated && (!expected || Number(row.item) > (partners ? 2 : 1))) return false;
	if (field.label === 'Registered name' || /tin[1-4]$/i.test(field.id)) return true;
	return code !== '1702EX' && !members && (field.kind === 'money' || field.kind === 'percent');
}

/** Each numbered source column represents a complete transaction record. */
export function corporateRecordSection(section: CorporateSection): CorporateSection {
 if (/Computation of Available Net Operating Loss Carry Over/i.test(section.title)) return nolcoRows(section);
 const supplemental = [
  [/^frm1702EX:txtPg7Sc9I([5-9])/, 'Real properties subject to final tax'],
  [/^frm1702EX:txtPg7Sc9I(1[0-5])/, 'Shares of stock subject to final tax'],
  [/^frm1702EX:txtPg7Sc9I(1[6-8])/, 'Other income subject to final tax'],
  [/^frm1702EX:txtPg7Sc10I([2-5])/, 'Exempt properties received'],
  [/^frm1702EX:txtPg7Sc10I([67])/, 'Other exempt income'],
  [/^frm1702RT:txtPg8Sc12I([5-9])C/, 'Real properties subject to final tax'],
  [/^frm1702RT:txtPg8Sc12I(1[0-5])C/, 'Shares of stock subject to final tax'],
  [/^frm1702RT:txtPg8Sc12I(1[6-8])C/, 'Other income subject to final tax'],
  [/^frm1702RT:txtPg8Sc13I([2-5])C/, 'Exempt properties received'],
  [/^frm1702RT:txtPg8Sc13I([67])C/, 'Other exempt income'],
  [/^frm1702MX:txtPg9Sc13I([5-9])C/, 'Real properties subject to final tax'],
  [/^frm1702MX:(?:txt|drp)Pg9Sc13I(1[0-5])C/, 'Shares of stock subject to final tax'],
  [/^frm1702MX:txtPg9Sc13I(1[6-8])C/, 'Other income subject to final tax'],
  [/^frm1702MX:txtPg9Sc14I([2-5])C/, 'Exempt properties received'],
  [/^frm1702MX:txtPg9Sc14I([67])C/, 'Other exempt income'],
 ] as const;
 return { ...section, rows: section.rows.flatMap(original => {
  const mcit = /MCIT/i.test(section.title) && original.fields.some(field => field.kind === 'integer' && /year/i.test(field.label ?? '') && !field.readonly);
  const row = mcit ? { ...original, list: 'MCIT carryovers' } : fixedCorporateListRow(original);
  if (row.entry) return [row];
  const group = supplemental.find(([pattern]) => row.fields.some(field => pattern.test(field.id)));
  if (!group) return [row];
  return [1, 2].map(column => ({
   ...row, list: group[1], item: String(column),
   fields: row.fields.filter(field => field.repeatable ? column === 1
    : new RegExp(`C(?:${column}|${column === 1 ? 'A' : 'B'})(?:-[12])?$`).test(field.id)),
  })).filter(record => record.fields.some(field => !field.repeatable));
 }) };
}
