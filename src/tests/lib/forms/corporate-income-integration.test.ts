import { describe, expect, it } from 'vitest';
import { getFormDefinition, listForms } from '$lib/forms';
import { createInitialFormValues, initialProfile } from '$lib/ebirforms/ebirforms-workspace.svelte';
import { getReturnExportValues, getReturnTin, getReturnEmail, getReturnPeriod, validateReturnValues } from '$lib/forms/form-runtime';
import { calculateCorporateIncome, corporateEditorPages, getCorporateIncomeForm } from '$lib/forms/corporate-income';

const codes = [
	'1702EX', '1702EXv2018', '1702EXv2018C', '1702MX', '1702MXv2018', '1702MXv2018C',
	'1702Q', '1702Qv2008C', '1702Qv2018C', '1702RT', '1702RTv2018', '1702RTv2018C'
];

describe('corporate income returns', () => {
	it('recalculates June 2013 regular and mixed page counts from generated sheets', () => {
		const regularCount = 'frm1702RT:txtPg1Pt2PagesFilled';
		const mixedCount = 'frm1702MX:txtPg1Pt2NumberofPagesFiled';
		const regularRows = 'frm1702RT:txtPg4Sc3I3CtrModal';
		const mixedActivities = {
			'frm1702MX:chkPg2Pt4I30MoreThanOne': 'Y',
			'frm1702MX:totalEXAttach': '1',
			'frm1702MX:totalSPAttach': '1'
		};
		expect(getReturnExportValues('1702RT', { [regularCount]: '99', [regularRows]: '23' })[regularCount]).toBe('10');
		expect(getReturnExportValues('1702RT', { [regularCount]: '10', [regularRows]: '0' })[regularCount]).toBe('8');
		expect(getReturnExportValues('1702MX', { [mixedCount]: '99', ...mixedActivities })[mixedCount]).toBe('17');
		expect(getReturnExportValues('1702MX', { [mixedCount]: '17', ...mixedActivities, 'frm1702MX:chkPg2Pt4I30MoreThanOne': 'N' })[mixedCount]).toBe('9');
	});

	it('shows only the attachment count from the ENCS exempt cover signatory fields', () => {
		const code = '1702EXv2018C';
		const hidden = ['AuthorizedRepresentative', 'Treasurer', 'TitleofSignatory', 'TitleofSignatory2', 'TINofSignatory', 'TINofSignatory2']
			.map(name => `frm1702EX:txtPg1Pt2${name}`);
		const attachment = 'frm1702EX:txtPg1P2I23NumOfAttachments';
		const draft = { [hidden[0]]: 'Sample Representative', [attachment]: '03' };
		const { field } = getCorporateFields(code, draft);
		expect(field(attachment)?.label).toBe('Number of attachments');
		for (const id of hidden) {
			expect(field(id)).toBeUndefined();
			expect(getFormDefinition(code)!.fields.some(field => field.id === id)).toBe(true);
			expect(getCorporateFields('1702EXv2018', draft).field(id)).toBeDefined();
		}
		expect(getReturnExportValues(code, draft)).toMatchObject(draft);
	});

	it('requires descriptions for populated exempt income but leaves unused rows optional', () => {
		const values = createInitialFormValues(initialProfile, '1702EX');
		values['frm1702EX:txtPg4S3I1Col2'] = '1200';
		const errors = validateReturnValues('1702EX', values);
		expect(errors['frm1702EX:txtPg4S3I1Col1']).toBeTruthy();
		expect(errors['frm1702EX:txtPg4S3I2Col1']).toBeUndefined();
	});

	it('requires legacy exempt owner details in the mandatory slots only', () => {
		const values = createInitialFormValues(initialProfile, '1702EX');
		const errors = validateReturnValues('1702EX', values);
		expect(errors['frm1702EX:txtPg6S8I1Col1Name']).toBeTruthy();
		expect(errors['frm1702EX:txtPg6S8I1Col2TIN1']).toBeTruthy();
		expect(errors['frm1702EX:txtPg6S8I3Col1Name']).toBeUndefined();
	});

	it('registers all selectable revisions and exposes revision-specific fields', () => {
		expect(listForms().filter(form => form.category === 'Corporate Income Tax').map(form => form.code).sort()).toEqual(codes);
		for (const code of codes) {
			const definition = getFormDefinition(code)!;
			expect(definition.status).toBe('ready');
			expect(definition.fields.length).toBeGreaterThan(25);
			expect(new Set(definition.fields.map(field => field.id)).size).toBe(definition.fields.length);
		}
	});

	it.each(codes)('loads the saved corporation identity in %s', code => {
		const profile = { ...initialProfile, tin1: '007', branchCode: '00012', taxpayerName: 'Sample Corporation', email: 'CORP@example.com' };
		const values = createInitialFormValues(profile, code);
		const fields = getFormDefinition(code)!.fields;
		expect(fields.some(field => field.profileKey === 'taxpayerName' && values[field.id] === profile.taxpayerName)).toBe(true);
		expect(getReturnTin(code, values, initialProfile)).toEqual({ tin1: '007', tin2: '456', tin3: '789', branchCode: '00012' });
		expect(getReturnEmail(code, values, initialProfile)).toBe('corp@example.com');
		expect(getReturnPeriod(code, values)).toMatch(/^\d{4}/);
	});
});

function getCorporateFields(code: string, input: Record<string, string>) {
	const form = getCorporateIncomeForm(code)!;
	const values = calculateCorporateIncome(form, input);
	const fields = corporateEditorPages(form, values).flatMap(page =>
		page.sections.flatMap(section => section.rows.flatMap(row => row.fields))
	);
	return { values, field: (id: string) => fields.find(field => field.id === id) };
}

describe('corporate calculated fields', () => {
	const q = 'frm1702q:';
	const mx = 'frm1702MX:';
	const rt = 'frm1702RT:';
	const ex = 'frm1702EX:';

	it('ignores stale exempt rates and shows the fixed zero rate', () => {
		const exemptRate = q + 'Sched1:txtTax10A';
		const { values, field } = getCorporateFields('1702Qv2018C', {
			[q + 'cbATC_2']: 'IC011_0%',
			[q + 'Sched1:txtTax1A']: '1000',
			[exemptRate]: '10'
		});
		expect(values[exemptRate]).toBe('0');
		expect(values[q + 'txtTax25']).toBe('0');
		expect(field(exemptRate)?.readonly).toBe(true);
	});

	it.each(['1702Q', '1702Qv2008C', '1702Qv2018C'])('keeps only itemized deductions editable in %s', code => {
		const revised = code === '1702Qv2018C';
		const method = revised ? q + 'rbMthdOfDdctns' : '1702q:OptMethodDeduct';
		const deductions = q + (revised ? 'Sched2:txtTax6' : 'txt21C');
		const source = q + (revised ? 'Sched2:txtTax1' : 'txt16C');
		const input = { [source]: '1000', [deductions]: '550' };
		const osd = getCorporateFields(code, { ...input, [method]: revised ? 'Debtor' : 'O' });
		const itemized = getCorporateFields(code, { ...input, [method]: revised ? 'Itemized' : 'I' });
		expect(Number(osd.values[deductions])).toBe(400);
		expect(osd.field(deductions)?.readonly).toBe(true);
		expect(Number(itemized.values[deductions])).toBe(550);
		expect(itemized.field(deductions)?.readonly).toBeFalsy();
	});

	it('derives the original July 2008 regular rate from the legacy ATC and leaves CREATE manual', () => {
		const rate = q + 'txt25B';
		const input = { [q + 'txtAtc']: 'IC080', [rate]: '30' };
		const original = getCorporateFields('1702Q', input);
		const create = getCorporateFields('1702Qv2008C', input);
		expect(Number(original.values[rate])).toBe(2.5);
		expect(original.field(rate)?.readonly).toBe(true);
		expect(Number(create.values[rate])).toBe(30);
		expect(create.field(rate)?.readonly).toBeFalsy();
	});

	it('displays derived 2018 quarterly rates and keeps the transitional rates editable', () => {
		const regularRate = q + 'Sched2:txtTax10';
		const mcitRate = q + 'Sched3:txtTax5';
		const input = {
			[q + 'rbATC_1']: 'IC055',
			[q + 'cbATC_2']: 'IC010_25%',
			[regularRate]: '27.5',
			[mcitRate]: '1.5'
		};
		const fixed = getCorporateFields('1702Qv2018C', {
			...input, [q + 'txtYrEndYear']: '2026', [q + 'rbYrEndMonth']: '12'
		});
		const transitional = getCorporateFields('1702Qv2018C', {
			...input, [q + 'txtYrEndYear']: '2020', [q + 'rbYrEndMonth']: '07'
		});
		expect(fixed.values).toMatchObject({ [regularRate]: '25', [mcitRate]: '2' });
		expect(fixed.field(regularRate)?.readonly).toBe(true);
		expect(fixed.field(mcitRate)?.readonly).toBe(true);
		expect(transitional.values).toMatchObject({ [regularRate]: '27.5', [mcitRate]: '1.5' });
		expect(transitional.field(regularRate)?.readonly).toBeFalsy();
		expect(transitional.field(mcitRate)?.readonly).toBeFalsy();
	});

	it.each(['1702MX', '1702MXv2018', '1702MXv2018C'])('labels attachment rollups in %s only in multi-activity mode', code => {
		const legacy = code === '1702MX';
		const election = mx + (legacy ? 'chkPg2Pt4I30MoreThanOne' : 'rdoPg2I1');
		const total = mx + (legacy ? 'txtPg4Sc3I1CB' : 'txtPg2Sc2Itm1B');
		const input = {
			[mx + 'totalSPAttach']: '2',
			[mx + (legacy ? 'txtPg2SP1ScDI1' : 'txtPg1SP1ScBI1')]: '123',
			[mx + (legacy ? 'txtPg2SP2ScDI1' : 'txtPg1SP2ScBI1')]: '456',
			[total]: '999'
		};
		const mixed = getCorporateFields(code, { ...input, [election]: legacy ? 'Y' : 'F' });
		const single = getCorporateFields(code, { ...input, [election]: legacy ? 'N' : 'C' });
		expect(mixed.values[total]).toBe('579');
		expect(mixed.field(total)?.readonly).toBe(true);
		expect(single.field(total)?.readonly).toBeFalsy();
	});

	it.each(['1702MXv2018', '1702MXv2018C'])('labels attachment NOLCO carry-ins in %s', code => {
		const { values, field } = getCorporateFields(code, {
			[mx + 'rdoPg2I1']: 'F',
			[mx + 'totalSPAttach']: '1',
			[mx + 'txtPg1I2YearEnd']: '2025',
			[mx + 'txtPg1SP1ScBI1']: '100',
			[mx + 'txtPg1SP1ScDI1']: '500'
		});
		expect(values[mx + 'txtPg2SP1ScF1I7year']).toBe('2025');
		for (const name of ['ScFI1', 'ScFI2', 'ScF1I7year']) {
			expect(field(mx + 'txtPg2SP1' + name)?.readonly).toBe(true);
		}
	});

	it('shows the June 2013 mixed rate as fixed only when RA 10693 sets it', () => {
		const rate = mx + 'txtPg2Pt4I34SpecialTaxRate';
		const { values, field } = getCorporateFields('1702MX', { [mx + 'txtPg2Pt4I32CB']: 'R.A. 10693', [rate]: '9' });
		expect(Number(values[rate])).toBe(2);
		expect(field(rate)?.kind).toBe('percent');
		expect(field(rate)?.readonly).toBe(true);
		expect(getCorporateFields('1702MX', {}).field(rate)?.readonly).toBeFalsy();
	});

	it('shows the fixed annual regular rate and leaves later CREATE fields editable', () => {
		const rate = rt + 'Pg2Pt4I40IncomeTaxRate';
		const input = { [rate]: '25' };
		expect(getCorporateFields('1702RTv2018', input).field(rate)?.readonly).toBe(true);
		const fixed = getCorporateFields('1702RTv2018C', { ...input, [rt + 'txtPg1I2Year']: '19' });
		const manual = getCorporateFields('1702RTv2018C', { ...input, [rt + 'txtPg1I2Year']: '2025' });
		for (const id of [rate, rt + 'txtPg2Pt4I42MinimumCorporate', rt + 'txtPg2Pt5I57SpecialAllowable']) {
			expect(fixed.field(id)?.readonly).toBe(true);
			expect(manual.field(id)?.readonly).toBeFalsy();
		}
		expect(fixed.values[rate]).toBe('30');
		expect(manual.values[rate]).toBe('25');
	});

	it('labels the fixed exempt rate on the original January 2018 return', () => {
		const rate = ex + 'txtPg2Pt4I40TaxRate';
		const original = getCorporateFields('1702EXv2018', { [rate]: '10' });
		expect(original.values[rate]).toBe('0');
		expect(original.field(rate)?.readonly).toBe(true);
		expect(getCorporateFields('1702EXv2018C', {}).field(rate)?.readonly).toBeFalsy();
	});
});
