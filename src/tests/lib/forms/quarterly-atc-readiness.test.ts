import { describe, expect, it } from 'vitest';
import { calculateReturn, getReturnExportValues } from '../../../lib/forms/form-runtime';
import { quarterlyIncomeFieldApplies } from '../../../lib/forms/individual-income/quarterly';

const code = '1701Qv2018';
const id = (name: string) => `frm1701q:${name}`;
const fields = (values: Record<string, string>) =>
	Object.fromEntries(Object.entries(values).map(([name, value]) => [id(name), value]));

describe('January 2018 quarterly schedule readiness', () => {
	it('keeps a saved regime and schedule amounts dormant until a valid ATC is selected', () => {
		const draft = fields({
			txtYear: '2025', optTaxRate: 'Graduated', optMethodOfDeduction: 'I',
			txt36A: '500000', txt47A: '400000', txt55A: '5000'
		});
		expect(quarterlyIncomeFieldApplies(code, id('txt36A'), draft)).toBe(false);
		expect(quarterlyIncomeFieldApplies(code, id('txt47A'), draft)).toBe(false);

		const result = calculateReturn(code, draft);
		expect(result[id('txt31')]).toBe('');
		expect(result[id('txt36A')]).toBe('500000');
		expect(result[id('txt47A')]).toBe('400000');
		expect(result[id('optTaxRate')]).toBe('Graduated');
		const output = getReturnExportValues(code, result);
		expect(output).not.toHaveProperty(id('optTaxRate'));
		expect(output).not.toHaveProperty(id('txt36A'));
		expect(output).not.toHaveProperty(id('txt47A'));

		const restored = { ...result, [id('optATC')]: 'II012' };
		expect(quarterlyIncomeFieldApplies(code, id('txt36A'), restored)).toBe(true);
		expect(quarterlyIncomeFieldApplies(code, id('txt47A'), restored)).toBe(false);
		expect(calculateReturn(code, restored)[id('txt31')]).toBe('37500.00');
	});

	it('opens the graduated schedule while leaving the liability pending until a deduction method is selected', () => {
		const draft = fields({ txtYear: '2025', optATC: 'II012', txt36A: '500000' });
		expect(quarterlyIncomeFieldApplies(code, id('optMethodOfDeduction'), draft)).toBe(true);
		expect(quarterlyIncomeFieldApplies(code, id('txt36A'), draft)).toBe(true);
		expect(quarterlyIncomeFieldApplies(code, id('txt39A'), draft)).toBe(false);
		const incomplete = calculateReturn(code, draft);
		expect(incomplete[id('txt31')]).toBe('');
		expect(incomplete[id('txt46A')]).toBe('');

		const itemized = { ...incomplete, [id('optMethodOfDeduction')]: 'I' };
		const osd = { ...incomplete, [id('optMethodOfDeduction')]: 'O' };
		expect(calculateReturn(code, itemized)[id('txt31')]).toBe('42500.00');
		expect(calculateReturn(code, osd)[id('txt31')]).toBe('7500.00');
	});

	it('waits for a spouse ATC before showing a combined liability without blocking the taxpayer schedule', () => {
		const draft = fields({
			txtYear: '2025', optATC: 'II015', txt47A: '500000', txt52A: '250000',
			txtSpouseName: 'EXAMPLE, SAM', optSpouseTaxRate: 'Graduated', optSpouseMethod: 'I', txt36B: '500000'
		});
		expect(quarterlyIncomeFieldApplies(code, id('txt47A'), draft)).toBe(true);
		expect(quarterlyIncomeFieldApplies(code, id('txt36B'), draft)).toBe(false);

		const incomplete = calculateReturn(code, draft);
		expect(incomplete[id('txt26A')]).toBe('20000.00');
		expect(incomplete[id('txt26B')]).toBe('');
		expect(incomplete[id('txt31')]).toBe('');

		const joint = { ...incomplete, [id('optSpouseATC')]: 'II014' };
		expect(calculateReturn(code, joint)[id('txt31')]).toBe('62500.00');

		const compensation = { ...incomplete, [id('optSpouseType_3')]: 'Compensation' };
		expect(calculateReturn(code, compensation)[id('txt31')]).toBe('20000.00');
		expect(quarterlyIncomeFieldApplies(code, id('txt36B'), compensation)).toBe(false);
	});
});
