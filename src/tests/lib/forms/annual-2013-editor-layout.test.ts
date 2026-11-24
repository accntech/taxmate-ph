import { describe, expect, it } from 'vitest';
import { getIndividualIncomeForm } from '../../../lib/forms/individual-income';
import { incomeEditorFields, incomeEditorRows } from '../../../lib/forms/individual-income/editor-layout';
import { annual2013EditorLayout } from '../../../lib/forms/individual-income/annual-2013-editor-layout';

const form = getIndividualIncomeForm('1701')!;
const fields = () => incomeEditorFields(form).map(field => ({ ...field, ...annual2013EditorLayout(field) }));
const field = (name: string) => fields().find(item => item.id === `frm1701:${name}`)!;

describe('June 2013 activity attachment editor meanings', () => {
	it('keeps industry, occupation and accounting labels separate and readable', () => {
		expect(field('txtPg1Pt1I18PSIC')).toMatchObject({ item: '18', label: '18 Industry code (PSIC)' });
		expect(field('txtPg1Pt1I19PSOC')).toMatchObject({ item: '19', label: '19 Occupation code (PSOC)' });
		expect(field('txtPg1Pt1I21Others')).toMatchObject({ item: '21', label: '21 Other accounting method' });
	});

	it('identifies separate property entries and keeps the combined total unqualified', () => {
		for (const [item, name, label] of [
			['4', 'DescriptionOfProperty', 'Property description'],
			['5', 'ModeOfTransfer', 'Mode of transfer'],
			['6', 'CARNo', 'Certificate authorizing registration number']
		]) {
			for (const entry of [1, 2]) {
				expect(field(`txtPg11Sc12BI${item}${name}C${entry}`).label).toBe(`${item} ${label} · Entry ${entry}`);
			}
		}
		expect(field('txtPg11Sc12BI10TotalIncomeC1').label).toBe('10 Total exempt income or receipts');
	});

	it('names the forty-percent deduction in both taxpayer and spouse computation rows', () => {
		for (const column of [1, 2]) {
			expect(field(`txtPg2Pt4I61OSDC${column}`).label).toBe('61 40% Optional Standard Deduction (OSD)');
		}
	});

	it('keeps exempt interest, income and final tax in distinct stable columns', () => {
		expect(field('txtPg11Sc12AI1InterestsC1')).toMatchObject({ column: 'Exempt amount', rowHeading: 'Interest' });
		expect(field('txtPg11Sc12AI1InterestsC2')).toMatchObject({ column: 'Income amount', rowHeading: 'Interest' });
		expect(field('txtPg11Sc12AI1FinalTaxWithheldC3')).toMatchObject({ column: 'Final tax withheld or paid' });
		expect(field('txtPg11Sc12AI2RoyaltiesC1')).toMatchObject({ column: 'Income amount', rowHeading: 'Royalties' });
		expect(field('txtPg11Sc12AI2FinalTaxWithheldC2')).toMatchObject({ column: 'Final tax withheld or paid' });
	});

	it('restores Schedule A headings, people, percentages, dates, and source-hidden outputs', () => {
		expect(field('txtPg1mScAI1InvestmentPromotionC1TYPE')).toMatchObject({
			section: 'Schedule A · Activity profile and tax relief', label: '1 Investment promotion agency or government entity',
			person: 'taxpayer', column: 'Taxpayer'
		});
		expect(field('txtPg1mScAI1InvestmentPromotionC2TYPE')).toMatchObject({ person: 'spouse', column: 'Spouse' });
		expect(field('txtPg1mScAI4ISpecialTaxRateC1TYPE')).toMatchObject({ kind: 'percent', label: '4 Special tax rate (%)' });
		expect(field('txtPg1mScAI5EffectivityDateMonthC1TYPE')).toMatchObject({ kind: 'date', label: '5 Tax relief effective from' });
		expect(field('txtPg12Pt9I18TaxfilerSPOutputTYPE').kind).toBe('hidden');
	});

	it('distinguishes description columns from taxpayer and spouse amounts', () => {
		const description = field('txtPg3mScGI1NatureOfIncomeC1TYPE');
		const taxpayer = field('txtPg3mScGI1C2TYPE');
		const spouse = field('txtPg3mScGI1C3TYPE');
		expect(description).toMatchObject({ column: 'Description', kind: 'text', label: '1 Non-operating income' });
		expect(taxpayer).toMatchObject({ column: 'Taxpayer', person: 'taxpayer', kind: 'money' });
		expect(spouse).toMatchObject({ column: 'Spouse', person: 'spouse', kind: 'money' });
		expect(incomeEditorRows([description, taxpayer, spouse])).toHaveLength(1);
		expect(field('txtPg4mScII1LegalBasisC2TYPE')).toMatchObject({ column: 'Legal basis', kind: 'text' });
		expect(field('txtPg4mScII1C3TYPE')).toMatchObject({ column: 'Taxpayer', person: 'taxpayer' });
	});

	it('corrects the source’s reused IDs to their displayed item numbers', () => {
		expect(field('txtPg4mScHI6JanitorialC1TYPE')).toMatchObject({ item: '16', label: '16 Janitorial and messengerial services' });
		expect(field('txtPg4mScHI7LossesC1TYPE')).toMatchObject({ item: '17', label: '17 Losses' });
		expect(field('txtPg4mScHI8ManagementC1TYPE')).toMatchObject({ item: '18' });
		expect(field('txtPg4mScHI9MiscellaneousC1TYPE')).toMatchObject({ item: '19' });
	});

	it('gives every attachment control a readable label and groups reconciliation adjustments', () => {
		const attachments = fields().filter(field => field.page.includes('m'));
		expect(attachments.filter(field => /TYPE|Pg\d|\bSc\b|undefined|^\d+$/.test(field.label))).toEqual([]);
		expect(field('txtPg5mScJI1PriorYearsExcessCreditsC1TYPE')).toMatchObject({ label: '1 Prior year’s excess credits', column: 'Taxpayer' });
		expect(field('txtPg5mScKI2DescC1TYPE')).toMatchObject({ label: '2 Add: Taxable income excluded from books', column: 'Description' });
		expect(field('txtPg5mScKI5C2TYPE')).toMatchObject({ label: '5 Less: Non-taxable income included in books', column: 'Amount', person: 'spouse' });
	});
});
