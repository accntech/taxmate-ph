export type January1700Reference = {
	label: string;
	target: string;
	owner: 'Taxpayer' | 'Spouse' | 'Both filers';
};

const prefix = 'frm1700:';
const references: Record<string, January1700Reference[]> = {};

function add(from: string, label: string, target: string, owner: January1700Reference['owner']) {
	(references[prefix + from] ??= []).push({ label, target: prefix + target, owner });
}

// January 2018 HTA goToItem anchors cite A/B amounts within the same filer.
for (const [column, owner] of [['A', 'Taxpayer'], ['B', 'Spouse']] as const) {
	add(`txtPg1I26${column}`, `From Part V.A, Item 47${column}`, `txtPg2I47${column}`, owner);
	add(`txtPg1I26${column}`, `From Part V.B, Item 53${column}`, `txtPg2I53${column}`, owner);
	add(`txtPg1I27${column}`, `From Part V.C, Item 58${column}`, `txtPg2I58${column}`, owner);
	add(`txtPg1I28${column}`, `From Part V, Item 59${column}`, `txtPg2I59${column}`, owner);

	const employerSources = [
		['42', 'c', 'REG', 'Part V.A'],
		['48', 'd', 'CIFR', 'Part V.B'],
		['54', 'e', 'TW', 'Part V.C']
	];
	for (const [item, suffix, amount, part] of employerSources) {
		const total = `txtPg2ISched1${suffix}_5${column}${amount}`;
		add(`txtPg2I${item}${column}`, `From Schedule 1, Item 5${column}${suffix}`, total, owner);
		add(total, `To ${part}, Item ${item}${column}`, `txtPg2I${item}${column}`, owner);
	}

	for (const [item, summary] of [['47', '26'], ['53', '26'], ['58', '27'], ['59', '28']]) {
		add(`txtPg2I${item}${column}`, `To Part III, Item ${summary}${column}`, `txtPg1I${summary}${column}`, owner);
	}
}

export function january1700References(fieldId: string): readonly January1700Reference[] {
	return references[fieldId] ?? [];
}
