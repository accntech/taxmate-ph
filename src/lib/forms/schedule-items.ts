import {
	withholdingRowCountKey, withholdingSchedules,
	type WithholdingDefinition, type WithholdingRow, type WithholdingSchedule
} from './withholding-definitions';
import { calculateWithholding, validateWithholding } from './withholding-rules';

type Values = Record<string, string>;

export function activeScheduleRows(schedule: WithholdingSchedule, values: Values, errors: Values = {}): WithholdingRow[] {
	return schedule.rows.filter(row => row.fields.some(field => {
		if (errors[field.id]) return true;
		if (field.readonly) return false;
		const value = values[field.id]?.trim();
		return !!value && (!['money', 'number'].includes(field.type) || Number(value.replaceAll(',', '')) !== 0);
	}));
}

/** Calendar and prescribed-rate rows must retain their own legacy field identities. */
export function isReorderableSchedule(schedule: WithholdingSchedule): boolean {
	return !!schedule.repeatable || ['adjustments', 'interest-treaty', 'interest-preferential', 'interest-books'].includes(schedule.id);
}

function allocatedSchedule(definition: WithholdingDefinition, schedule: WithholdingSchedule, values: Values): WithholdingSchedule {
	return withholdingSchedules(definition, values).find(item => item.id === schedule.id) ?? schedule;
}

export function nextScheduleDraft(definition: WithholdingDefinition, schedule: WithholdingSchedule, values: Values): {
	schedule: WithholdingSchedule; row: WithholdingRow; allocationPatch: Values;
} | null {
	const allocated = allocatedSchedule(definition, schedule, values);
	const occupied = new Set(activeScheduleRows(allocated, values).map(row => row.id));
	const unused = allocated.rows.find(row => !occupied.has(row.id));
	if (unused) return { schedule: allocated, row: unused, allocationPatch: {} };
	if (!allocated.repeatable || allocated.rows.length >= 1000) return null;
	const allocationPatch = { [withholdingRowCountKey(definition, schedule.id)]: String(allocated.rows.length + 1) };
	const expanded = allocatedSchedule(definition, allocated, { ...values, ...allocationPatch });
	return { schedule: expanded, row: expanded.rows[allocated.rows.length], allocationPatch };
}

export function scheduleItemValues(row: WithholdingRow, values: Values): string[] {
	return row.fields.map(field => values[field.id] ?? '');
}

export function validateScheduleDraft(definition: WithholdingDefinition, schedule: WithholdingSchedule, row: WithholdingRow, draft: Values, values: Values): Values {
	const candidate = { ...values, ...draft };
	const runtimeRow = allocatedSchedule(definition, schedule, candidate).rows.find(item => item.id === row.id) ?? row;
	const validation = validateWithholding(definition.code, candidate);
	const relevant = new Set(runtimeRow.fields.map(field => field.id));
	if (!schedule.id.startsWith('remittances-') && schedule.id !== 'interest-books') relevant.add(definition.prefix + 'optWithheld');
	if (['treaty', 'interest-treaty', 'interest-preferential'].includes(schedule.id)) relevant.add(definition.prefix + 'optRelief');
	const errors = Object.fromEntries(Object.entries(validation).filter(([id]) => relevant.has(id)));
	if (!activeScheduleRows({ ...schedule, rows: [runtimeRow] }, candidate).length) {
		const first = runtimeRow.fields.find(field => !field.readonly);
		if (first) errors[first.id] = 'Enter at least one value for this line item.';
	}
	return errors;
}

/** Pack interchangeable rows as complete tuples; no transient UI identities enter saved values. */
export function writeScheduleItems(definition: WithholdingDefinition, schedule: WithholdingSchedule, items: string[][], values: Values): Values {
	if (!isReorderableSchedule(schedule)) throw new Error('This schedule has fixed row identities.');
	const current = allocatedSchedule(definition, schedule, values);
	const limit = current.repeatable ? 1000 : current.rows.length;
	if (items.length > limit || items.some(item => item.length !== current.rows[0]?.fields.length)) {
		throw new RangeError('Line items exceed the schedule capacity or have an invalid field shape.');
	}
	const allocationPatch: Values = items.length > current.rows.length
		? { [withholdingRowCountKey(definition, schedule.id)]: String(items.length) }
		: {};
	const allocated = allocatedSchedule(definition, current, { ...values, ...allocationPatch });
	const patch: Values = { ...allocationPatch };
	for (const [index, row] of allocated.rows.entries()) {
		for (const [part, field] of row.fields.entries()) patch[field.id] = items[index]?.[part] ?? '';
	}
	const calculated = calculateWithholding(definition.code, { ...values, ...patch });
	for (const row of allocated.rows.slice(0, items.length)) {
		for (const field of row.fields) patch[field.id] = calculated[field.id] ?? patch[field.id];
	}
	return patch;
}
