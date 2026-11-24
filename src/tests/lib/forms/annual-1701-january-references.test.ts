import { describe, expect, it } from 'vitest';
import { annual1701References } from '../../../lib/forms/individual-income/annual-1701-references';

const p = 'frm1701:';
const targets = (field: string) => annual1701References('1701v2018', p + field).map(reference => reference.target);

describe('January 2018 source navigation ownership', () => {
	it('opens the special and exempt bases for each filer’s tax relief', () => {
		expect(targets('txtPg4IPart8_1A')).toContain(p + 'txtPg1mI16BSchdB');
		expect(targets('txtPg4IPart8_1B')).toContain(p + 'txtPg1mI16FSchdB');
		expect(targets('txtPg4IPart8_2B')).toContain(p + 'txtPg1mI7FSchdB');
		expect(targets('txtPg4IPart8_8A')).toContain(p + 'txtPg1mI16ASchdB');
		expect(targets('txtPg4IPart8_8B')).toContain(p + 'txtPg1mI16ESchdB');
		expect(targets('txtPg4IPart8_9B')).toContain(p + 'txtPg1mI7ESchdB');
	});

	it('opens the corresponding current-year loss history', () => {
		expect(targets('txtPg3IShed6_3A')).toContain(p + 'txtPg3IShed6_7A');
		expect(targets('txtPg3IShed6_3B')).toContain(p + 'txtPg4IShed6_12A');
	});

	it('opens regular other income and eight-percent tax sources', () => {
		expect(targets('txtPg1mI12CSchdB')).toContain(p + 'txtPg2IShed3_19A');
		expect(targets('txtPg1mI13GSchdB')).toContain(p + 'txtPg2IShed3_20B');
		expect(targets('txtPg1mI17CSchdB')).toContain(p + 'txtPg3IShed3_31A');
		expect(targets('txtPg1mI17GSchdB')).toContain(p + 'txtPg3IShed3_31B');
	});

	it('opens each activity’s other income from multi-activity consolidation', () => {
		expect(annual1701References('1701v2018', p + 'txtPg1mI12FSchdB')).toContainEqual({
			label: 'From Part XI, Schedule B, Item 10B',
			target: p + 'txtPg3mSchedB_10BTYPE',
			multipleActivities: true
		});
		expect(targets('txtPg1mI13ASchdB')).toContain(p + 'txtPg3mSchedB_11ATYPE');
	});

	it('returns deduction totals to the correct consolidation or activity filer', () => {
		expect(targets('txtPg2mI18CSchdC')).toContain(p + 'txtPg1mI6ESchdB');
		expect(targets('txtPg2mI18DSchdC')).toContain(p + 'txtPg1mI6FSchdB');
		expect(targets('txtPg4mSchedC_18BTYPE')).toContain(p + 'txtPg3mSchedB_6BTYPE');
		expect(targets('txtPg4mSchedD2_10BTYPE')).toContain(p + 'txtPg3mSchedB_7BTYPE');
	});

	it('keeps activity return links in the chosen tax regime and person column', () => {
		expect(annual1701References('1701v2018', p + 'txtPg3mSchedB_15BTYPE')).toContainEqual({
			label: 'To Part X, Item 17E', target: p + 'txtPg1mI17ESchdB',
			multipleActivities: true, activityRegime: 'Exempt'
		});
		expect(annual1701References('1701v2018', p + 'txtPg3mSchedB_15BTYPE')).toContainEqual({
			label: 'To Part X, Item 17F', target: p + 'txtPg1mI17FSchdB',
			multipleActivities: true, activityRegime: 'Special Rate'
		});
	});
});
