import templates from './templates/fields.json';

type Values = Record<string, string>;
const regimes = ['Exempt', 'Special Rate'] as const;
type Regime = (typeof regimes)[number];

export const revisedActivityCountId = 'frm1701:rdoPg1m';
export const revisedActivityRegimeId = 'frm1701:Pg3mTaxRegimeTYPE';
const nativeCounterId = 'frm1701:txtAttachmentTypes';
const templateIds = new Set(templates['1701v2018']
	.filter(field => field.page.endsWith('TYPE') && field.id.endsWith('TYPE'))
	.map(field => field.id));
const indexedSuffix = /(?:TYPE|ACT[1-9][0-9]*|(?:EX|SP)[1-9][0-9]*)$/;

export function revisedActivityTemplateId(id: string): string {
	const template = id.replace(indexedSuffix, 'TYPE');
	return templateIds.has(template) ? template : id;
}

export function isRevisedActivityFieldId(id: string): boolean {
	return templateIds.has(revisedActivityTemplateId(id));
}

export function revisedActivityFieldId(templateId: string, slot: string): string {
	return isRevisedActivityFieldId(templateId) ? templateId.replace(indexedSuffix, slot) : templateId;
}

export function revisedActivitySlots(values: Values): string[] {
	const slots = ['TYPE', ...Object.keys(values).flatMap(id => {
		const index = /^frm1701:Pg3mTaxRegimeACT([1-9][0-9]*)$/.exec(id)?.[1];
		return index && index !== '1' ? [Number(index)] : [];
	}).sort((left, right) => left - right).map(index => `ACT${index}`)];
	const active = slots.filter(slot => values[revisedActivityFieldId(revisedActivityRegimeId, slot)] !== 'Removed');
	return active.length ? active : ['TYPE'];
}

export function revisedActivityRegime(values: Values, slot: string): Regime | undefined {
	const value = values[revisedActivityFieldId(revisedActivityRegimeId, slot)];
	return value === 'Exempt' || value === 'Special Rate' ? value : undefined;
}

export function revisedActivityRegimeApplies(values: Values, spouse: boolean, regime: Regime): boolean {
	const field = regime === 'Exempt'
		? spouse ? 'rdoPg2I10IncomeExempt' : 'rdoPg1I19IncomeExempt'
		: spouse ? 'rdoPg2I11IncomeSpecial' : 'rdoPg1I20IncomeSpecial';
	return values[`frm1701:${field}`] === 'Yes';
}

export function usesRevisedActivityAttachments(values: Values, joint: boolean): boolean {
	return values[revisedActivityCountId] === '2' && regimes.some(regime =>
		revisedActivityRegimeApplies(values, false, regime) ||
		(joint && revisedActivityRegimeApplies(values, true, regime)));
}

const nativeSuffix = /(?:EX|SP)[1-9][0-9]*$/;
const nativeRegimeRadio = /^frm1701:rdoPg3m(?:Exempt|SpecialRate)((?:EX|SP)[1-9][0-9]*)$/;

export function exportRevisedActivityFields(values: Values, joint: boolean): Values {
	const output = Object.fromEntries(Object.entries(values).filter(([id]) =>
		!isRevisedActivityFieldId(id) && !nativeRegimeRadio.test(id) && id !== nativeCounterId));
	let exempt = 0;
	let special = 0;
	if (usesRevisedActivityAttachments(values, joint)) {
		for (const slot of revisedActivitySlots(values)) {
			const regime = revisedActivityRegime(values, slot);
			if (!regime || !(revisedActivityRegimeApplies(values, false, regime) ||
				(joint && revisedActivityRegimeApplies(values, true, regime)))) continue;
			const suffix = regime === 'Exempt' ? `EX${++exempt}` : `SP${++special}`;
			for (const template of templateIds) {
				if (template === revisedActivityRegimeId) continue;
				const local = revisedActivityFieldId(template, slot);
				if (local in values) output[revisedActivityFieldId(template, suffix)] = values[local];
			}
			output[`frm1701:rdoPg3mExempt${suffix}`] = String(regime === 'Exempt');
			output[`frm1701:rdoPg3mSpecialRate${suffix}`] = String(regime === 'Special Rate');
		}
	}
	output[nativeCounterId] = `EX${exempt},SP${special}`;
	if (values[revisedActivityCountId] === '1' || values[revisedActivityCountId] === '2') {
		output[`${revisedActivityCountId}Option1`] = String(values[revisedActivityCountId] === '1');
		output[`${revisedActivityCountId}Option2`] = String(values[revisedActivityCountId] === '2');
	}
	return output;
}

export function importRevisedActivityFields(values: Values): Values {
	const nativeFields = Object.keys(values).flatMap(id => {
		const suffix = nativeRegimeRadio.exec(id)?.[1] ?? (isRevisedActivityFieldId(id) ? nativeSuffix.exec(id)?.[0] : undefined);
		return suffix ? [{ id, suffix }] : [];
	});
	const output = { ...values };
	const count = values[`${revisedActivityCountId}Option2`] === 'true' ? '2' :
		values[`${revisedActivityCountId}Option1`] === 'true' ? '1' : undefined;
	if (count) output[revisedActivityCountId] = count;
	if (!nativeFields.length) return output;
	for (const id of Object.keys(output)) {
		if (isRevisedActivityFieldId(id) || nativeRegimeRadio.test(id) || id === nativeCounterId) delete output[id];
	}
	const suffixes = [...new Set(nativeFields.map(field => field.suffix))].sort((left, right) =>
		left.slice(0, 2).localeCompare(right.slice(0, 2)) || Number(left.slice(2)) - Number(right.slice(2)));
	const slotBySuffix = new Map(suffixes.map((suffix, index) => [suffix, index === 0 ? 'TYPE' : `ACT${index + 1}`]));
	for (const [suffix, slot] of slotBySuffix) {
		output[revisedActivityFieldId(revisedActivityRegimeId, slot)] = suffix.startsWith('EX') ? 'Exempt' : 'Special Rate';
	}
	for (const { id, suffix } of nativeFields) {
		const slot = slotBySuffix.get(suffix);
		if (slot && isRevisedActivityFieldId(id) && revisedActivityTemplateId(id) !== revisedActivityRegimeId)
			output[revisedActivityFieldId(id, slot)] = values[id];
	}
	return output;
}
