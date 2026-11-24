import { describe, expect, it } from 'vitest';
import { getIndividualIncomeForm } from '../../../lib/forms/individual-income';
import { incomeEditorFields } from '../../../lib/forms/individual-income/editor-layout';
import { january1700References } from '../../../lib/forms/individual-income/annual-1700-january-references';

const p = 'frm1700:';

describe('January 2018 Form 1700 source references', () => {
	it('opens both rate-specific tax sources in the same person column', () => {
		expect(january1700References(p + 'txtPg1I26A')).toEqual([
			{ label: 'From Part V.A, Item 47A', target: p + 'txtPg2I47A', owner: 'Taxpayer' },
			{ label: 'From Part V.B, Item 53A', target: p + 'txtPg2I53A', owner: 'Taxpayer' }
		]);
		expect(january1700References(p + 'txtPg1I26B')).toEqual([
			{ label: 'From Part V.A, Item 47B', target: p + 'txtPg2I47B', owner: 'Spouse' },
			{ label: 'From Part V.B, Item 53B', target: p + 'txtPg2I53B', owner: 'Spouse' }
		]);
	});

	it('keeps credits, net payable, and employer totals assigned to their owner', () => {
		expect(january1700References(p + 'txtPg1I27B')).toContainEqual({
			label: 'From Part V.C, Item 58B', target: p + 'txtPg2I58B', owner: 'Spouse'
		});
		expect(january1700References(p + 'txtPg1I28A')).toContainEqual({
			label: 'From Part V, Item 59A', target: p + 'txtPg2I59A', owner: 'Taxpayer'
		});
		expect(january1700References(p + 'txtPg2I42B')).toContainEqual({
			label: 'From Schedule 1, Item 5Bc', target: p + 'txtPg2ISched1c_5BREG', owner: 'Spouse'
		});
		expect(january1700References(p + 'txtPg2I48A')).toContainEqual({
			label: 'From Schedule 1, Item 5Ad', target: p + 'txtPg2ISched1d_5ACIFR', owner: 'Taxpayer'
		});
		expect(january1700References(p + 'txtPg2I54B')).toContainEqual({
			label: 'From Schedule 1, Item 5Be', target: p + 'txtPg2ISched1e_5BTW', owner: 'Spouse'
		});
	});

	it('follows the source’s reverse anchors to the corresponding summary and schedule item', () => {
		expect(january1700References(p + 'txtPg2I53B')).toContainEqual({
			label: 'To Part III, Item 26B', target: p + 'txtPg1I26B', owner: 'Spouse'
		});
		expect(january1700References(p + 'txtPg2I58A')).toContainEqual({
			label: 'To Part III, Item 27A', target: p + 'txtPg1I27A', owner: 'Taxpayer'
		});
		expect(january1700References(p + 'txtPg2ISched1e_5BTW')).toContainEqual({
			label: 'To Part V.C, Item 54B', target: p + 'txtPg2I54B', owner: 'Spouse'
		});
	});

	it('resolves every source-backed target within the rendered revision', () => {
		const fields = incomeEditorFields(getIndividualIncomeForm('1700v2018')!);
		const ids = new Set(fields.map(field => field.id));
		let count = 0;
		for (const field of fields) {
			for (const reference of january1700References(field.id)) {
				expect(ids.has(reference.target), reference.target).toBe(true);
				expect(reference.target).not.toBe(field.id);
				expect(reference.label).toMatch(/^(From|To) .+ Item \d/);
				count += 1;
			}
		}
		expect(count).toBe(28);
		expect(january1700References('unrelated')).toEqual([]);
	});
});
