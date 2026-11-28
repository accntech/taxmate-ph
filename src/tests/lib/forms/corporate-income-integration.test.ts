import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getFormDefinition, listForms } from '$lib/forms';
import { createInitialFormValues, initialProfile } from '$lib/ebirforms/ebirforms-workspace.svelte';
import { getManagedTaxpayerValues, getReturnExportValues, getReturnTin, getReturnEmail, getReturnPeriod, validateReturnValues } from '$lib/forms/form-runtime';
import { calculateCorporateIncome, corporateEditorPages, getCorporateIncomeForm } from '$lib/forms/corporate-income';
import { corporateBackgroundRows } from '$lib/forms/corporate-income/background-layout';

const codes = [
	'1702EX', '1702EXv2018', '1702EXv2018C', '1702MX', '1702MXv2018', '1702MXv2018C',
	'1702Q', '1702Qv2008C', '1702Qv2018C', '1702RT', '1702RTv2018', '1702RTv2018C'
];

describe('corporate filing and calendar-date validation', () => {
	beforeEach(() => vi.setSystemTime(new Date('2026-11-27T16:00:00Z')));
	afterEach(() => vi.useRealTimers());

	it.each(codes.filter(code => !code.startsWith('1702EX')))('rejects a future filing period in %s', code => {
		const form = getCorporateIncomeForm(code)!;
		const values = {
			[form.year]: '2099',
			[form.month!]: '12',
			[form.periodType!]: 'C',
			...(form.quarter ? { [form.quarter]: '1' } : {})
		};
		expect(validateReturnValues(code, values)[form.year]).toBe('Choose an ended taxable period.');
		expect(validateReturnValues(code, { ...values, [form.year]: '2019' })[form.year]).toBeUndefined();
	});

	it.each(codes.filter(code => code.startsWith('1702Q')))('validates the selected quarter rather than the fiscal year end in %s', code => {
		const form = getCorporateIncomeForm(code)!;
		const values = {
			[form.year]: '2027',
			[form.month!]: '03',
			[form.periodType!]: 'F',
			[form.quarter!]: '1'
		};
		expect(validateReturnValues(code, values)[form.year]).toBeUndefined();
		expect(validateReturnValues(code, { ...values, [form.quarter!]: '3' })[form.year])
			.toBe('Choose an ended taxable period.');
	});

	it.each([
		['1702EX', 'frm1702EX:txtPg1Pt1I8DateofIncorporation'],
		['1702EXv2018', 'frm1702EX:txtPg1Pt1I10DateofIncorporation'],
		['1702EXv2018C', 'frm1702EX:txtPg1Pt1I10DateofIncorporation'],
		...codes.filter(code => code.startsWith('1702MX')).map(code => [code, 'frm1702MX:txtPg1Pt1I8'])
	])('rejects an impossible incorporation date in %s', (code, id) => {
		const form = getCorporateIncomeForm(code)!;
		const values = { [form.year]: '2025', [form.month!]: '12' };
		expect(validateReturnValues(code, { ...values, [id]: '2024-02-30' })[id]).toBe('Enter a valid date.');
		expect(validateReturnValues(code, { ...values, [id]: '2/29/2024' })[id]).toBeUndefined();
	});

	it.each(codes.filter(code => code.startsWith('1702EX')))('validates both exemption dates in %s', code => {
		const item = code === '1702EX' ? '19' : '17';
		const form = getCorporateIncomeForm(code)!;
		const start = `frm1702EX:txtPg1Pt1I${item}EffectivityFrom`;
		const end = `frm1702EX:txtPg1Pt1I${item}EffectivityTo`;
		const values = { [form.year]: '2025', [start]: '2/30/2024', [end]: '2025-04-31' };
		expect(validateReturnValues(code, values)).toMatchObject({
			[start]: 'Enter a valid date.',
			[end]: 'Enter a valid date.'
		});
		const reversed = { ...values, [start]: '2/28/2025', [end]: '2/27/2025' };
		expect(validateReturnValues(code, reversed)[end]).toBe('Exemption end date must follow the start date.');
	});
});

describe('corporate income returns', () => {
	it.each(codes.filter(code => /^1702(?:RT|MX)/.test(code)))('lists only valid year-end months in %s', code => {
		const form = getCorporateIncomeForm(code)!;
		const month = form.month!;
		const field = getFormDefinition(code)!.fields.find(field => field.id === month);
		expect(field?.options).toEqual(Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0')));
		const values = createInitialFormValues(initialProfile, code);
		expect(values[month]).toBe('12');
		const incomplete = { ...values, [month]: '' };
		expect(calculateCorporateIncome(form, incomplete)[month]).toBe('');
		expect(validateReturnValues(code, incomplete)[month]).toBeTruthy();
	});

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

	const attachmentRows = [
		['1702EXv2018', 'frm1702EX:txtPg1P2I23NumOfAttachments', '23', 'Number of attachments', 2],
		['1702EXv2018C', 'frm1702EX:txtPg1P2I23NumOfAttachments', '23', 'Number of attachments', 2],
		['1702MXv2018', 'frm1702MX:txtPg1P2I23NumOfAttachments', '22', 'Number of attachments', 2],
		['1702MXv2018C', 'frm1702MX:txtPg1P2I23NumOfAttachments', '22', 'Number of attachments', 2],
		['1702RTv2018', 'frm1702RT:txtPg1Pt2PagesFilled', '22', 'Number of attachments', 3],
		['1702RTv2018C', 'frm1702RT:txtPg1Pt2PagesFilled', '22', 'Number of attachments', 3],
		['1702Q', 'frm1702q:txtSheets', '5', 'Number of sheets attached', 2],
		['1702Qv2008C', 'frm1702q:txtSheets', '5', 'Number of sheets attached', 2],
		['1702Qv2018C', 'frm1702q:txtSheets', '26', 'Number of attachments', 2]
	] as const;

	it.each(attachmentRows)('keeps the standalone attachment count on the %s cover', (code, id, item, label, maxLength) => {
		const form = getCorporateIncomeForm(code)!;
		const rows = corporateEditorPages(form, { [id]: '03' })[0].sections.flatMap(section => section.rows);
		const row = rows.find(row => row.fields.some(field => field.id === id));
		expect(row).toMatchObject({ item, label });
		expect(row?.fields).toMatchObject([{ id, label, kind: 'integer', maxLength }]);
		expect(getReturnExportValues(code, { [id]: '03' })[id]).toBe('03');
	});

	it.each(codes)('omits signer controls on the %s cover and preserves saved signer data', code => {
		const form = getCorporateIncomeForm(code)!;
		const signer = /signature|signatory|authorizedrepresentative|treasurer/i;
		const field = form.pages[0].sections.flatMap(section => section.rows.flatMap(row => row.fields))
			.find(field => signer.test(field.id));
		const draft = field ? { [field.id]: 'Sample Signer' } : {};
		const cover = corporateEditorPages(form, draft)[0].sections;
		expect(cover.some(section => section.title === 'Signatories')).toBe(false);
		expect(cover.flatMap(section => section.rows.flatMap(row => row.fields)).filter(field => signer.test(field.id))).toEqual([]);
		if (field) expect(getReturnExportValues(code, draft)[field.id]).toBe('Sample Signer');
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

	it('retains saved continuation lines until the profile explicitly replaces them', () => {
		const code = '1702RTv2018';
		const id = 'frm1702RT:txtPg1Pt1I8Name2';
		const saved = { [id]: 'Previous division' };
		expect({ ...saved, ...getManagedTaxpayerValues(code, initialProfile, 'Draft', saved) }[id]).toBe(saved[id]);
		expect(getManagedTaxpayerValues(code, { ...initialProfile, taxpayerName2: '' }, 'Draft', saved)[id]).toBe('');
	});

	it.each([
		['1601EQ', 'frm1601EQ:txtTaxpayerName', 'frm1601EQ:txtAddress2', 'City, Building 3'],
		['1701Q', 'frm1701q:txtTaxPayername', 'frm1701q:txt11Address', 'Street, City, Building 3']
	])('uses every profile line in the available legacy fields of %s', (code, name, address, expected) => {
		const profile = { ...initialProfile, taxpayerName: 'Sample Name', taxpayerName2: ' Division ', taxpayerName3: '', address: 'Street', address2: 'City', address3: 'Building 3' };
		const exported = getReturnExportValues(code, createInitialFormValues(profile, code));
		expect(exported[name]).toBe('Sample Name, Division');
		expect(exported[address]).toBe(expected);
	});

	it.each(listForms().map(form => form.code))('carries registered continuations into new and reopened %s export values', code => {
		const profile = { ...initialProfile, taxpayerName2: 'Name continuation two', taxpayerName3: 'Name continuation three', address2: 'Address continuation two', address3: 'Address continuation three' };
		const draft = createInitialFormValues(profile, code);
		const reopened = { ...draft, ...getManagedTaxpayerValues(code, profile, 'Draft', draft) };
		for (const values of [draft, reopened]) {
			const exported = Object.values(getReturnExportValues(code, values)).join(' ');
			expect(exported).toContain('Name continuation two');
			expect(exported).toContain('Name continuation three');
			if (code !== '1701MS') {
				expect(exported).toContain('Address continuation two');
				expect(exported).toContain('Address continuation three');
			}
		}
	});

	it.each(['1702RT', '1702RTv2018', '1702RTv2018C'])('keeps the conditional regular ATC inside Item 5 in %s', code => {
		const form = getCorporateIncomeForm(code)!;
		const [filing] = corporateEditorPages(form, {})[0].sections;
		expect(filing.rows.map(row => row.item)).toEqual(['1', '2', '3', '4', '5']);
		const [mcit, regular, atc] = filing.rows[4].fields.map(field => field.id);
		expect([mcit, regular, atc]).toEqual([
			'frm1702RT:rdoPg1I5Atc', 'frm1702RT:rdoPg1I5AtcOther', 'frm1702RT:drpPg1I5AtcOther'
		]);
		expect(form.fieldApplies?.(atc, { [regular]: 'N' })).toBe(false);
		expect(form.fieldApplies?.(atc, { [regular]: 'Y' })).toBe(true);
	});

	it.each(codes.filter(code => /^1702(?:EX|MX|RT)v2018/.test(code)))('keeps the revised identity item numbers in %s', code => {
		const form = getCorporateIncomeForm(code)!;
		const section = corporateEditorPages(form, {})[0].sections.find(section => /background information/i.test(section.title))!;
		const rows = corporateBackgroundRows(form, section.rows);
		const item = (profileKey: string) => rows.find(row => row.fields[0].profileKey === profileKey)?.item;
		expect(['tin1', 'rdoCode', 'taxpayerName', 'address', 'zipCode'].map(item)).toEqual(['6', '7', '8', '9', '9A']);
		expect(rows.filter(row => row.item === '8' || row.item === '9').map(row => row.item)).toEqual(['8', '9']);
		const [name, address] = ['8', '9'].map(item => rows.find(row => row.item === item)!);
		const original = section.rows.flatMap(row => row.fields);
		expect(name.fields.map(field => field.id)).toEqual(original.filter(field =>
			field.profileKey === 'taxpayerName' || /(?:RegisteredName|Pt1I8Name)[23]$/.test(field.id)).map(field => field.id));
		expect(address.fields.map(field => field.id)).toEqual(original.filter(field =>
			field.profileKey === 'address' || field.profileKey === 'address2' ||
			/(?:RegisteredAddress|Pt1I9Address)[23]$/.test(field.id)).map(field => field.id));
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

	it('presents June 2013 penalties and payable in the total column', () => {
		const { field } = getCorporateFields('1702MX', {});
		for (const item of [40, 41, 42, 43, 44]) {
			expect(field(mx + 'txtPg2Pt5I' + item)?.column).toBe(4);
		}
	});

	it('offers the June 2013 special rate from the filing election and keeps fixed rates read-only', () => {
		const rate = mx + 'drpPg3Sc1I11CB';
		const { field } = getCorporateFields('1702MX', {
			[mx + 'txtPg2Pt4I34SpecialTaxRate']: '5',
			[mx + 'chkPg1I5ATCR2']: 'Y',
			[mx + 'drpPg1I5ATCR2']: 'IC030'
		});
		expect(field(rate)).toMatchObject({ column: 2, options: [
			{ value: '0.05', label: '5.0%' },
			{ value: '0.1', label: '10.0%' },
			{ value: '0.3', label: '30.0%' }
		] });
		expect(field(mx + 'txtPg3Sc1I11CA')).toMatchObject({ column: 1, readonly: true });
		expect(field(mx + 'txtPg3Sc1I11CC')).toMatchObject({ column: 3, readonly: true });
	});

	it('shows the saved June 2013 special rate in a sparse draft', () => {
		const id = mx + 'drpPg3Sc1I11CB';
		const { field, values } = getCorporateFields('1702MX', { [id]: '0.075' });
		expect(values[id]).toBe('0.075');
		expect(field(id)?.options).toContainEqual({ value: '0.075', label: '7.5%' });
	});

	it('identifies the source amounts on June 2013 Schedule 13', () => {
		const { field } = getCorporateFields('1702MX', {});
		expect(field(mx + 'txtPg9Sc13I1CB')).toMatchObject({
			column: 2, label: 'Actual amount / fair market value / net capital gains'
		});
		expect(field(mx + 'txtPg9Sc13I1CC')).toMatchObject({ column: 3, label: 'Final tax withheld / paid' });
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
