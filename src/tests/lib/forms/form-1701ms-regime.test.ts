import { describe, expect, it } from 'vitest';
import { annual1701MSFilerReady, calculate1701MS, shortAnnualFieldApplies, validate1701MS } from '$lib/forms/individual-income/annual-short';
import { getReturnExportValues } from '$lib/forms/form-runtime';

const code = '1701MS';
const id = (name: string) => `frm1701MS:${name}`;
const applies = (name: string, values: Record<string, string>) => shortAnnualFieldApplies(code, id(name), values);

describe('1701-MS income schedule prerequisites', () => {
	it('keeps stale amounts dormant until the filer chooses a valid source and tax regime', () => {
		const draft = {
			[id('txtGrossa')]: '400000',
			[id('txtSalesRevenueNo5a')]: '1000000',
			[id('txtSalesRevenuesFeesANo19a')]: '800000',
			[id('txtCreditableTaxNo3a')]: '10000',
			taxCodeDropdown: 'II015'
		};

		expect(applies('txtGrossa', draft)).toBe(false);
		expect(applies('txtSalesRevenueNo5a', draft)).toBe(false);
		expect(applies('txtSalesRevenuesFeesANo19a', draft)).toBe(false);
		expect(applies('methodOfDeductionMain', draft)).toBe(false);

		const result = calculate1701MS(draft);
		expect(result[id('txtIncomeTaxRegularNo22a')]).toBe('0.00');
		expect(result[id('txtAggregateAmountPayable30a')]).toBe('0.00');
		expect(result[id('txtGrossa')]).toBe('400000');
		expect(result[id('txtSalesRevenueNo5a')]).toBe('1000000');
		expect(getReturnExportValues(code, draft)).not.toHaveProperty('taxCodeDropdown');
		expect(getReturnExportValues(code, draft)).not.toHaveProperty(id('txtSalesRevenueNo5a'));

		const graduated = { ...draft, [id('sourceOfIncomeTaxpayer')]: '1', [id('txtTaxpayerNo12a')]: '2', methodOfDeductionMain: 'osd' };
		expect(applies('txtSalesRevenueNo5a', graduated)).toBe(true);
		expect(applies('txtSalesRevenuesFeesANo19a', graduated)).toBe(false);
		expect(calculate1701MS(graduated)[id('txtAggregateAmountPayable30a')]).toBe('52500.00');
	});

	it('allows compensation for a mixed-income filer before unlocking either business schedule', () => {
		const draft = {
			[id('sourceOfIncomeTaxpayer')]: '2',
			[id('txtGrossa')]: '400000',
			[id('txtSalesRevenueNo5a')]: '1500000',
			[id('txtSalesRevenuesFeesANo19a')]: '500000'
		};
		expect(applies('txtGrossa', draft)).toBe(true);
		expect(applies('txtSalesRevenueNo5a', draft)).toBe(false);
		expect(applies('txtSalesRevenuesFeesANo19a', draft)).toBe(false);
		expect(calculate1701MS(draft)[id('txtTaxpayerNo4a')]).toBe('22500.00');
		expect(calculate1701MS(draft)[id('txtTotalIncomeTaxDueNo23a')]).toBe('0.00');

		const eightPercent = { ...draft, [id('txtTaxpayerNo12a')]: '3' };
		expect(applies('txtSalesRevenuesFeesANo19a', eightPercent)).toBe(true);
		expect(applies('txtSalesRevenueNo5a', eightPercent)).toBe(false);
		expect(calculate1701MS(eightPercent)[id('txtTotalIncomeTaxDueNo23a')]).toBe('62500.00');
	});

	it('waits for the deduction choice before recognizing graduated business amounts', () => {
		const draft = {
			[id('sourceOfIncomeTaxpayer')]: '1',
			[id('txtTaxpayerNo12a')]: '2',
			[id('txtSalesRevenueNo5a')]: '1000000',
			[id('txtCostofSalesNo8a')]: '100000'
		};

		expect(annual1701MSFilerReady(draft, false)).toBe(false);
		expect(applies('methodOfDeductionMain', draft)).toBe(true);
		expect(applies('txtSalesRevenueNo5a', draft)).toBe(false);
		expect(validate1701MS(draft).methodOfDeductionMain).toMatch(/deduction/i);

		const itemized = { ...draft, methodOfDeductionMain: 'itemized' };
		expect(annual1701MSFilerReady(itemized, false)).toBe(true);
		expect(calculate1701MS(itemized)[id('txtAggregateAmountPayable30a')]).toBe('127500.00');
	});

	it('does not declare an aggregate amount while a joint filer still needs a regime', () => {
		const draft = {
			[id('civilStatus')]: 'Married',
			[id('txtIfMarried')]: '1',
			[id('sourceOfIncomeTaxpayer')]: '3',
			[id('txtTaxpayerNo12a')]: '3',
			[id('txtSalesRevenuesFeesANo19a')]: '500000',
			[id('sourceOfIncomeSpouse')]: '1',
			[id('txtCreditableTaxNo3b')]: '10000'
		};

		const incomplete = calculate1701MS(draft);
		expect(incomplete[id('txtTotalAmountPayableNo29a')]).toBe('20000.00');
		expect(incomplete[id('txtAggregateAmountPayable30a')]).toBe('0.00');

		const complete = calculate1701MS({
			...draft, [id('sourceOfIncomeSpouse')]: '4', [id('txtGrossb')]: '400000'
		});
		expect(complete.taxCodeDropdownSpouse).toBe('II011');
		expect(complete[id('txtAggregateAmountPayable30a')]).toBe('32500.00');
	});
});
