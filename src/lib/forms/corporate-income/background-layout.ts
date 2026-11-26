import { compareFormItems } from '../withholding-paper-layout';
import type { CorporateField, CorporateForm, CorporateRow } from './types';

export function corporateBackgroundRows(form: CorporateForm, rows: CorporateRow[]): CorporateRow[] {
	const cells = rows.flatMap(row => {
		const [first] = row.fields;
		const split = row.fields.filter(field => field !== first && (field.profileKey === 'rdoCode' || field.profileKey === 'zipCode'));
		const item = row.item || (first?.profileKey === 'tin1' ? '6' : undefined);
		const remaining = { ...row, item, fields: row.fields.filter(field => !split.includes(field)) };
		return [remaining, ...split.map(field => ({
			fields: [field],
			item: field.profileKey === 'rdoCode' ? '7' : '9A',
			label: field.label ?? ''
		}))];
	});

	// Legacy quarterly stores contact after ZIP even though the source numbers it before address.
	const ordered = form.quarter ? cells.sort((a, b) => compareFormItems(a.item || '99', b.item || '99')) : cells;
	return ordered.map(row => ({
		...row,
		fields: row.fields.map(field => ({ ...field, label: backgroundLabel(field, row) }))
	}));
}

function backgroundLabel(field: CorporateField, row: CorporateRow): string {
	const label = field.label || row.label;
	const line = field.id.match(/(?:Name|Address)([23])$/)?.[1];
	if (line && /(?:RegisteredName|RegisteredAddress|Pt1I8Name|Pt1I9Address)/.test(field.id)) {
		return `Registered ${/Name[23]$/.test(field.id) ? 'name' : 'address'} line ${line}`;
	}
	switch (field.profileKey) {
		case 'rdoCode': return 'RDO code';
		case 'taxpayerName': return 'Registered name';
		case 'address': return 'Registered address';
		case 'address2': return 'Registered address line 2';
		case 'zipCode': return 'ZIP code';
		case 'contactNumber': return 'Contact number';
		case 'email': return 'Email address';
		default: return row.item && label.startsWith(`${row.item} `) ? label.slice(row.item.length + 1) : label;
	}
}

export function corporateBackgroundCell(row: CorporateRow) {
	const key = row.fields[0]?.profileKey;
	if (key === 'tin1' || key === 'rdoCode') return 'identity-cell';
	if (key === 'zipCode' || key === 'contactNumber') return 'short-cell';
	if (key === 'address' || key === 'address2' || key === 'taxpayerName' || key === 'email'
		|| row.fields.length > 1 || row.fields[0]?.kind === 'radio') return 'wide-cell';
	return '';
}
