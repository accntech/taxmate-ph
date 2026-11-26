import { compareFormItems } from '../withholding-paper-layout';
import type { CorporateField, CorporateForm, CorporateRow } from './types';

const registeredLine = /(?:Registered|Pt1I[89])(Name|Address)([23])$/;

export function isRegisteredInformationRow(row: CorporateRow) {
	const key = row.fields[0]?.profileKey;
	return key === 'taxpayerName' || key === 'address';
}

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
	const grouped: CorporateRow[] = [];
	for (const row of ordered) {
		const fields = row.fields.map(field => ({ ...field, label: backgroundLabel(field, row) }));
		const [first] = fields;
		const line = registeredLine.exec(first?.id ?? '');
		const owner = first?.profileKey === 'address2' || line?.[1] === 'Address' ? 'address'
			: line?.[1] === 'Name' ? 'taxpayerName' : undefined;
		const previous = grouped.at(-1);
		if (owner && fields.length === 1 && previous?.fields[0]?.profileKey === owner) {
			previous.fields.push(first);
		} else {
			grouped.push({ ...row, fields });
		}
	}
	return grouped;
}

function backgroundLabel(field: CorporateField, row: CorporateRow): string {
	const label = field.label || row.label;
	const line = registeredLine.exec(field.id);
	if (line) {
		return `Registered ${line[1].toLowerCase()} line ${line[2]}`;
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
	const field = row.fields[0];
	const key = field?.profileKey;
	if (key === 'tin1' || key === 'rdoCode') return 'identity-cell';
	if (key === 'zipCode' || key === 'contactNumber' || key === 'psicCode') return 'short-cell';
	if (key === 'address' || key === 'address2' || key === 'taxpayerName' || key === 'email'
		|| key === 'lineOfBusiness' || row.fields.length > 1 || field?.kind === 'radio'
		|| registeredLine.test(field?.id ?? '')) return 'wide-cell';
	return '';
}
