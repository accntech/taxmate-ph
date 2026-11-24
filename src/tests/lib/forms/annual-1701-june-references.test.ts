import { describe, expect, it } from 'vitest';
import { annual1701References } from '../../../lib/forms/individual-income/annual-1701-references';

const p = 'frm1701:';
const references = (name: string) => annual1701References('1701', p + name);

describe('June 2013 original form navigation anchors', () => {
	it('links trading cost totals to the complete cost of sales schedule', () => {
		expect(references('txtPg5Sc4AI5TaxPayerC1')).toContainEqual({
			label: 'To Schedule 4, Item 27A', target: p + 'txtPg6Sc4CI27TaxPayerC1'
		});
		expect(references('txtPg5Sc4I5SpouseC2')).toContainEqual({
			label: 'To Schedule 4, Item 27B', target: p + 'txtPg6Sc4CI27SpouseC2'
		});
	});

	it('returns each consolidated relief column to the matching owner and regime', () => {
		for (const [column, target, item] of [
			['C2', 'txtPg3Pt5I91SpecialTaxC1', '91A'],
			['C6', 'txtPg3Pt5I91SpecialTaxC2', '91B'],
			['C3', 'txtPg3Pt5I92ExemptTaxC1', '92A'],
			['C7', 'txtPg3Pt5I92ExemptTaxC2', '92B']
		]) expect(references('txtPg12Pt9I21TaxRelief' + column)).toContainEqual({
			label: 'To Part VI, Item ' + item, target: p + target
		});
	});

	it('links special and exempt relief to their separate activity computations', () => {
		expect(references('txtPg12Pt9I21TaxReliefC2')).toContainEqual({
			label: 'From Schedule C1, Item 8A', target: p + 'txtPg1mScC1I8TotalTaxReliefAvailmentC1TYPE'
		});
		expect(references('txtPg12Pt9I21TaxReliefC7')).toContainEqual({
			label: 'From Schedule C2, Item 11B', target: p + 'txtPg1mScC2I11TaxReliefAvailmentC2TYPE'
		});
	});
});
