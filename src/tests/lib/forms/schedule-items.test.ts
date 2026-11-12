import { describe, expect, it } from 'vitest';
import { getWithholdingDefinition, withholdingDefinitions, withholdingSchedules } from '$lib/forms/withholding-definitions';
import { createWithholdingValues } from '$lib/forms/withholding-rules';
import { activeScheduleRows, isReorderableSchedule, nextScheduleDraft, scheduleItemValues, validateScheduleDraft, writeScheduleItems } from '$lib/forms/schedule-items';

describe('schedule line-item mapping', () => {
	it('does not treat calculated defaults as committed line items', () => {
		const definition = getWithholdingDefinition('1603Qv2018')!;
		expect(activeScheduleRows(definition.schedules[0], createWithholdingValues(definition.code))).toEqual([]);
	});
	it('keeps sparse imported entries visible', () => {
		const definition = getWithholdingDefinition('1601E')!;
		const schedule = definition.schedules[0];
		expect(activeScheduleRows(schedule, { [schedule.rows[9].fields[0].id]: 'WI120' }).map(row => row.id)).toEqual([schedule.rows[9].id]);
	});
	it('distinguishes interchangeable items from fixed months and categories', () => {
		for (const definition of withholdingDefinitions) for (const schedule of definition.schedules) {
			const fixed = schedule.id.startsWith('remittances-') || ['fringe', 'interest'].includes(schedule.id);
			expect(isReorderableSchedule(schedule), definition.code + '/' + schedule.id).toBe(!fixed);
		}
	});
	for (const definition of withholdingDefinitions) for (const schedule of definition.schedules) {
		if (schedule.id.startsWith('remittances-') || ['fringe', 'interest'].includes(schedule.id)) continue;
		it(`${definition.code}/${schedule.id} moves whole tuples and clears unused slots`, () => {
			const values: Record<string, string> = {};
			for (const [index, row] of schedule.rows.slice(0, 2).entries()) for (const field of row.fields) {
				values[field.id] = field.readonly ? 'stale-calculation' : field.type === 'date' ? `2025-01-0${index + 1}` : field.type === 'money' || field.type === 'number' ? String((index + 1) * 100) : `item-${index + 1}`;
			}
			const first = scheduleItemValues(schedule.rows[0], values);
			const second = scheduleItemValues(schedule.rows[1], values);
			const patch = writeScheduleItems(definition, schedule, [second, first], values);
			for (const [index, field] of schedule.rows[0].fields.entries()) if (!field.readonly) expect(patch[field.id]).toBe(second[index]);
			for (const [index, field] of schedule.rows[1].fields.entries()) if (!field.readonly) expect(patch[field.id]).toBe(first[index]);
			for (const row of schedule.rows.slice(2)) for (const field of row.fields) expect(patch[field.id] === '' || field.readonly).toBe(true);
			expect(patch[definition.yearField]).toBeUndefined();
		});
	}
	it('allocates overflow only in the returned draft patch', () => {
		const definition = getWithholdingDefinition('1601E')!;
		const schedule = definition.schedules[0];
		const values = Object.fromEntries(schedule.rows.map(row => [row.fields[0].id, 'WI120']));
		const before = { ...values };
		const draft = nextScheduleDraft(definition, schedule, values)!;
		expect(draft.row.fields[0].id).toBe('frm1601E:txtAtcCode11');
		expect(draft.allocationPatch).toEqual({ 'frm1601E:__rows:atc': '11' });
		expect(values).toEqual(before);
	});
	it('rejects allocations beyond 1,000 and fixed row reordering', () => {
		const definition = getWithholdingDefinition('1601E')!;
		const values: Record<string, string> = { 'frm1601E:__rows:atc': '1000' };
		const schedule = withholdingSchedules(definition, values)[0];
		for (const row of schedule.rows) values[row.fields[0].id] = 'WI120';
		expect(nextScheduleDraft(definition, schedule, values)).toBeNull();
		expect(() => writeScheduleItems(definition, schedule, Array.from({ length: 1001 }, () => ['', '', '', '']), values)).toThrow();
		const annual = getWithholdingDefinition('1604C')!;
		expect(() => writeScheduleItems(annual, annual.schedules[0], [], {})).toThrow();
	});
	it('validates only the draft row and its withholding/relief prerequisites', () => {
		const definition = getWithholdingDefinition('1601E')!;
		const schedule = definition.schedules[0];
		const row = schedule.rows[0];
		const values = { ...createWithholdingValues(definition.code), 'frm1601E:optCategory': 'P', 'frm1601E:optWithheld': 'Y' };
		expect(Object.keys(validateScheduleDraft(definition, schedule, row, {}, values)).length).toBeGreaterThan(0);
		const draft = { 'frm1601E:txtAtcCode1': 'WI120', 'frm1601E:txtTaxBase1': '100000' };
		expect(validateScheduleDraft(definition, schedule, row, draft, values)).toEqual({});
		expect(validateScheduleDraft(definition, schedule, row, draft, { ...values, 'frm1601E:optWithheld': 'N' })).toHaveProperty('frm1601E:optWithheld');
	});
	it('preserves editable special-law rates when committing and recalculates the withheld amount', () => {
		const definition = getWithholdingDefinition('1601E')!;
		const values = { ...createWithholdingValues(definition.code), 'frm1601E:optCategory': 'P', 'frm1601E:optWithheld': 'Y', 'frm1601E:optRelief': 'Y', 'frm1601E:txtAtcCode1': 'N/A', 'frm1601E:txtTaxBase1': '1000', 'frm1601E:txtTaxRate1': '3' };
		const schedule = withholdingSchedules(definition, values)[0];
		expect(validateScheduleDraft(definition, schedule, schedule.rows[0], values, values)).toEqual({});
		const patch = writeScheduleItems(definition, schedule, [scheduleItemValues(schedule.rows[0], values)], values);
		expect(patch['frm1601E:txtTaxRate1']).toBe('3');
		expect(patch['frm1601E:txtTaxbeWithHeld1']).toBe('30.00');
	});
	it('does not block an ATC draft on an unrelated treaty row needing relief', () => {
		const definition = getWithholdingDefinition('1601FQ')!;
		const schedule = definition.schedules.find(schedule => schedule.id === 'atc')!;
		const treaty = definition.schedules.find(schedule => schedule.id === 'treaty')!;
		const values = { ...createWithholdingValues(definition.code), [definition.prefix + 'optCategory']: 'P', [definition.prefix + 'optWithheld']: 'Y', [definition.prefix + 'optRelief']: 'N', [treaty.rows[0].fields[0].id]: 'TT01' };
		const draft = { [schedule.rows[0].fields[0].id]: 'WI202', [schedule.rows[0].fields[1].id]: '1000' };
		expect(validateScheduleDraft(definition, schedule, schedule.rows[0], draft, values)).toEqual({});
	});
});
