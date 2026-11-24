import type { IncomeEditorField } from './editor-layout';

const fields = {
	Description: 'Description',
	LegalBasis: 'Legal basis',
	Amount: 'Amount'
} as const;

export function msSpecialDeductionId(spouse: boolean, field: keyof typeof fields, index: number) {
	return `frm1701MS:sched410A${spouse ? '2' : '1'}:${field}${index}`;
}

export function msSpecialDeductionIndices(values: Record<string, string>, spouse: boolean) {
	const pattern = new RegExp(`^frm1701MS:sched410A${spouse ? '2' : '1'}:(?:Description|LegalBasis|Amount)(\\d+)$`);
	const indices = Object.entries(values).flatMap(([id, value]) => {
		const match = pattern.exec(id);
		return match && value.trim() ? [Number(match[1])] : [];
	});
	return [...new Set(indices)].sort((left, right) => left - right);
}

export function msSpecialDeductionFields(aggregate: IncomeEditorField, title: string, index: number): IncomeEditorField[] {
	const item = `10B.${index + 1}`;
	return (Object.entries(fields) as [keyof typeof fields, string][]).map(([field, column]) => ({
		id: msSpecialDeductionId(aggregate.person === 'spouse', field, index),
		item,
		section: title,
		page: aggregate.page,
		person: aggregate.person,
		rowKey: `${title}:${item}`,
		label: `${item} Special itemized deduction`,
		column,
		kind: field === 'Amount' ? 'money' : 'text',
		maxLength: field === 'Amount' ? 25 : 50,
		options: [],
		choiceLabels: {}
	}));
}
