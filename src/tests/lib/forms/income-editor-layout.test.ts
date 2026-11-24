import { describe, expect, it } from 'vitest';
import { getIndividualIncomeForm } from '$lib/forms/individual-income';
import { incomeEditorFields, incomeEditorRows } from '$lib/forms/individual-income/editor-layout';
import paper1700 from '$lib/forms/individual-income/templates/form-1700.html?raw';

const fields = (code: string) => incomeEditorFields(getIndividualIncomeForm(code)!);
const field = (code: string, id: string) => fields(code).find(field => field.id === id)!;

describe('income editor item rows', () => {
	it('keeps revised annual computation and loss carryover columns in their source schedules', () => {
		const spouseSales = field('1701v2018', 'frm1701:txtPg2IShed3_8B');
		expect(spouseSales.person).toBe('spouse');
		expect(spouseSales.section).toBe('Schedule 3.A · Business income at graduated rates');
		const spouseLoss = field('1701v2018', 'frm1701:txtPg4IShed6_9A');
		expect(spouseLoss.person).toBe('spouse');
		expect(spouseLoss.label).toContain('Net operating loss');
		expect(spouseLoss.section).toContain('Spouse');
	});

	it('uses currency for micro/small income while retaining tax rates and descriptions', () => {
		expect(field('1701MS', 'frm1701MS:txtGrossa').kind).toBe('money');
		expect(field('1701MS', 'frm1701MS:txtAllowableItemizedDeductionsNo10a').item).toBe('10A');
		expect(field('1701MS', 'frm1701MS:txtAllowableItemizedDeductionsNo10aSpouse').person).toBe('spouse');
		expect(field('1701MS', 'frm1701MS:txtTaxRatea').kind).toBe('text');
		expect(field('1701MS', 'frm1701MS:addOtherCreditsPayments').kind).toBe('text');
		const credit = fields('1701MS').filter(field => /addOtherCreditsPayments|txtOtherCreditsPaymentsNo9[ab]/.test(field.id));
		expect(incomeEditorRows(credit)).toHaveLength(1);
	});
	it('groups month and year under the single filing item while keeping amendment separate', () => {
		const rows = incomeEditorRows(fields('1701A').filter(field => field.section === 'Filing details'));
		expect(rows[0].item).toBe('1');
		expect(rows[0].fields.map(field => field.id)).toEqual(['frm1701A:txtMonth', 'frm1701A:txtYear']);
		expect(rows[1].item).toBe('2');
	});

	it('groups taxpayer and spouse columns under one tax item with a meaningful description', () => {
		const inputs = ['frm1701A:txt20A', 'frm1701A:txt20B', 'frm1701A:txt21A', 'frm1701A:txt21B'].map(id => field('1701A', id));
		const rows = incomeEditorRows(inputs);
		expect(rows).toHaveLength(2);
		expect(rows[0].item).toBe('20');
		expect(rows[0].fields.map(field => field.person)).toEqual(['taxpayer', 'spouse']);
		expect(rows[0].fields.every(field => /Tax due/i.test(field.label))).toBe(true);
	});

	it('preserves true sub-item numbers and groups employer details in a single row', () => {
		const inputs = ['frm1701:txtPg1I21TaxRate', 'frm1701:rdoPg1I21AMethodDeduction'].map(id =>
			id.endsWith('TaxRate') ? { ...field('1701v2018', 'frm1701:rdoPg1I21TaxRate'), id } : field('1701v2018', id));
		expect(incomeEditorRows(inputs).map(row => row.item)).toEqual(['21', '21A']);
		const employer = fields('1700v2018').filter(field => field.section === 'Schedule 1 · Employer 1');
		const rows = incomeEditorRows(employer);
		const details = rows.find(row => row.fields.some(field => field.id.endsWith('EmployerTIN1')));
		expect(details?.fields.filter(field => /PartVIEmployer/.test(field.id)).map(field => field.id.split('PartVIEmployer')[1])).toEqual([
			'Name1', 'Name2', 'TIN1', 'TIN2', 'TIN3', 'BranchCode'
		]);
		expect(details?.fields.filter(field => /Sched1[cde]_1/.test(field.id))).toHaveLength(3);
		expect(rows).toHaveLength(2);
	});

	it('keeps legacy quarterly credit categories in distinct paired rows', () => {
		const inputs = ['txt38A', 'txt38B', 'txt38C', 'txt38D'].map(id => field('1701Q', 'frm1701q:' + id));
		const rows = incomeEditorRows(inputs);
		expect(rows.map(row => row.item)).toEqual(['38A/B', '38C/D']);
		expect(rows[1].fields.map(field => field.person)).toEqual(['taxpayer', 'spouse']);
	});

	it('uses the exact revised quarterly identity item numbers', () => {
		for (const [id, item] of [
			['txtTIN1', '5'], ['txtRDOCode', '6'], ['optTaxpayerType', '7'], ['optATC', '8'],
			['txtTaxpayerName', '9'], ['txtAddress', '10'], ['txtBirthMonth', '11'], ['txtCitizenship', '13']
		]) expect(field('1701Qv2018', 'frm1701q:' + id).item, id).toBe(item);
	});

	it('groups the annual short-form spouse TIN and branch into the source item', () => {
		const inputs = ['txtSpouseTIN1', 'txtSpouseTIN2', 'txtSpouseTIN3', 'txtSpouseBranchCode'].map(id => field('1701A', 'frm1701A:' + id));
		const rows = incomeEditorRows(inputs);
		expect(rows).toHaveLength(1);
		expect(rows[0].item).toBe('66');
		expect(rows[0].fields).toHaveLength(4);
	});

	it('identifies micro/small taxpayer and spouse amounts without merging penalty sub-items', () => {
		const a = field('1701MS', 'frm1701MS:txtIncomeTaxDueNo19a');
		const b = field('1701MS', 'frm1701MS:txtIncomeTaxDueNo19b');
		expect([a.person, b.person]).toEqual(['taxpayer', 'spouse']);
		expect(incomeEditorRows([a, b])).toHaveLength(1);
		expect(field('1701MS', 'frm1701MS:txtSurchangeNo28a').item).toBe('28A');
		expect(field('1701MS', 'frm1701MS:txtInterestNo28a').item).toBe('28B');
	});

	it('preserves legacy Form 1700 supplemental transaction columns and exempt-income groups', () => {
		const supplemental = (id: string) => field('1700', 'frm1700:' + id);
		const shareFields = ['drpPg3Pt5I12A1', 'txtPg3Pt5I12C1', 'drpPg3Pt5I12B2', 'txtPg3Pt5I12C2'].map(supplemental);
		expect(shareFields.map(item => item.transaction)).toEqual(['A', 'A', 'B', 'B']);
		expect(incomeEditorRows(shareFields).map(row => row.item)).toEqual(['12']);
		expect(supplemental('txtPg3Pt5I2FinalTaxWithheld').amountColumn).toBe('withheld');
		expect(supplemental('txtPg3Pt5I18C1R2').shortLabel).toBe('Additional description');
		expect(supplemental('txtPg3Pt5BI5B').section).toBe('Property received through gifts, bequests, or devises');
		expect(supplemental('txtPg3Pt5BI9A').section).toBe('Other exempt income or receipts');
	});

	it('leaves the share type unselected on a new legacy Form 1700', () => {
		const { defaults } = getIndividualIncomeForm('1700')!;
		expect(defaults['frm1700:drpPg3Pt5I12A1']).toBeUndefined();
		expect(defaults['frm1700:drpPg3Pt5I12B2']).toBeUndefined();
	});

	it('allows the legacy Form 1700 PDF to print an empty share type', () => {
		for (const id of ['frm1700:drpPg3Pt5I12A1', 'frm1700:drpPg3Pt5I12B2']) {
			expect(paper1700).toMatch(new RegExp(`<select [^>]*id="${id}">\\s*<option value=""></option>`));
		}
	});

	it.each(['1700', '1700v2018', '1701', '1701v2018', '1701A', '1701MS', '1701Q', '1701Qv2018'])(
		'%s has descriptive labels without implementation ids or numeric-only labels', code => {
			for (const field of fields(code)) {
				expect(field.label, field.id).not.toMatch(/Pg\d|\bSc\d|^\d+[AB]?\s*(?:·\s*(?:Taxpayer|Spouse))?$/);
			}
		}
	);
});
