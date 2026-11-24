import type { IncomeEditorField } from './editor-layout';

const computation: Record<string, string> = {
	5: 'Non-taxable or exempt compensation',
	6: 'Gross taxable compensation',
	7: 'Health and hospitalization insurance premium',
	8: 'Personal exemption',
	9: 'Additional exemption',
	10: 'Total deductions',
	11: 'Net taxable compensation or excess deductions',
	12: 'Other taxable income',
	13: 'Total taxable income',
	14: 'Income tax due',
	15: 'Tax withheld per BIR Form 2316',
	16: 'Tax paid on the previously filed return',
	17: 'Foreign tax credits',
	18: 'Other tax credits or payments',
	19: 'Total tax credits and payments',
	20: 'Net tax payable or overpayment',
	21: 'Combined net tax payable or overpayment',
	22: 'Amount deferred to the second installment',
	23: 'Combined tax payable after deferral',
	24: 'Surcharge',
	25: 'Interest',
	26: 'Compromise penalty',
	27: 'Total penalties',
	28: 'Total amount payable upon filing'
};

const finalIncome: Record<string, string> = {
	1: 'Interest',
	2: 'Royalties',
	3: 'Dividends',
	4: 'Prizes and winnings',
	5: 'Fringe benefits',
	6: 'Compensation subject to the 15% preferential rate',
	7: 'Property description',
	8: 'OCT, TCT, CCT or tax declaration number',
	9: 'Certificate authorizing registration number',
	10: 'Amount, fair market value or net capital gain',
	11: 'Final tax withheld or paid',
	12: 'Kind of shares and stock certificate series number',
	13: 'Certificate authorizing registration number',
	14: 'Number of shares',
	15: 'Date of issue',
	16: 'Amount, fair market value or net capital gain',
	17: 'Final tax withheld or paid',
	18: 'Other income subject to final tax',
	19: 'Amount, fair market value or net capital gain',
	20: 'Final tax withheld or paid',
	21: 'Total final tax withheld or paid'
};

const exemptIncome: Record<string, string> = {
	1: 'Proceeds of life insurance policy',
	2: 'Return of premium',
	3: 'Retirement benefits, pensions and gratuities',
	4: 'Property description',
	5: 'Mode of transfer',
	6: 'Certificate authorizing registration number',
	7: 'Amount or fair market value',
	8: 'Other exempt income or receipts',
	9: 'Amount, fair market value or net capital gain',
	10: 'Total income or receipts exempt from income tax'
};

const address: Record<string, [item: string, label: string]> = {
	UnitRoomNumber: ['1', 'Unit, room or floor'],
	BuildingNumber: ['1', 'Building name'],
	LotBlkPhHouseNumber: ['2', 'Lot, block, phase or house number'],
	StreetName: ['2', 'Street'],
	SubdivisionVillage: ['3', 'Subdivision or village'],
	Barangay: ['3', 'Barangay'],
	MunicipalityCity: ['4', 'Municipality or city'],
	Province: ['5', 'Province'],
	ZipCde: ['5', 'ZIP code']
};

function layout(
	field: IncomeEditorField,
	section: string,
	item: string,
	label: string,
	phase = '',
	extra: Partial<IncomeEditorField> = {}
): Partial<IncomeEditorField> {
	return {
		section,
		item,
		person: undefined,
		label: `${item} ${label}`,
		rowKey: `1700:${field.page}:${section}:${item}${phase}`,
		optionalSection: /^Part IV · Employer [23]$/.test(section) ||
			(field.page === '3' && section !== 'Final tax total' && section !== 'Exempt income total'),
		...extra
	};
}

/** The June 2013 source uses distinct person and transaction columns on each page. */
export function legacy1700ScheduleLayout(field: IncomeEditorField): Partial<IncomeEditorField> {
	const name = field.id.replace(/^frm1700:/, '');
	if (field.page === '2') {
		const employer = name.match(/^(?:txt|rdo)Pg2Pt4I([1-3])(NameOfEmployer|Employer|EMPTIN[123]|EMPTINBranchCode|ComIncomeC1|TaxWithholdC2)$/);
		if (employer) {
			const [, row, part] = employer;
			const section = `Part IV · Employer ${row}`;
			if (part === 'Employer') return layout(field, section, row, 'Income earner', ':earner');
			if (part === 'NameOfEmployer') return layout(field, section, row, 'Employer name', ':identity');
			if (part.startsWith('EMPTIN')) {
				const label = part === 'EMPTINBranchCode' ? 'Branch code' :
					`Employer TIN, ${{ '1': 'first', '2': 'middle', '3': 'last' }[part.at(-1)!]} three digits`;
				return layout(field, section, row, label, ':identity');
			}
			return layout(field, section, row,
				part === 'ComIncomeC1' ? 'Compensation income' : 'Tax withheld',
				':amounts', { kind: 'money' });
		}
		const subtotal = name.match(/^txtPg2Pt4I4([AB])C([12])$/);
		if (subtotal) {
			const person = subtotal[1] === 'A' ? 'taxpayer' : 'spouse';
			return layout(field, 'Part IV · Compensation totals', `4${subtotal[1]}`,
				`${subtotal[2] === '1' ? 'Total compensation income' : 'Total tax withheld'} · ${person === 'taxpayer' ? 'Taxpayer' : 'Spouse'}`,
				'', { person, kind: 'money' });
		}
		if (name === 'txtPg2Pt4I12') {
			return layout(field, 'Part IV · Tax computation', '12', 'Other taxable income description');
		}
		if (name === 'txtPg2Pt4I18TC') {
			return layout(field, 'Part IV · Tax credits', '18', 'Other tax credits or payments description');
		}
		const item = name.match(/^txtPg2Pt4I(\d+)(?:C([12]))?$/);
		if (item && computation[item[1]]) {
			const person = item[2] ? item[2] === '1' ? 'taxpayer' : 'spouse' : undefined;
			const title = person ? `${computation[item[1]]} · ${person === 'taxpayer' ? 'Taxpayer' : 'Spouse'}` : computation[item[1]];
			const section = Number(item[1]) < 15 ? 'Part IV · Tax computation' :
				Number(item[1]) < 20 ? 'Part IV · Tax credits' : 'Part IV · Amount payable';
			return layout(field, section, item[1], title, '', { person, kind: 'money' });
		}
	}
	if (field.page === '3') {
		const exempt = name.match(/^txtPg3Pt5BI(\d+)([AB]|TotalIncome)?$/);
		if (exempt && exemptIncome[exempt[1]]) {
			const [, number, suffix] = exempt;
			const item = Number(number);
			const transaction = suffix === 'A' || suffix === 'B' ? suffix : undefined;
			const column = transaction ? ` · Entry ${transaction}` : '';
			const section = item <= 3 ? 'Part V.B · Income exempt from tax' :
				item <= 7 ? 'Property received through gifts, bequests, or devises' :
				item <= 9 ? 'Other exempt income or receipts' : 'Exempt income total';
			const kind = [1, 2, 3, 7, 9, 10].includes(item) ? 'money' : 'text';
			const shortLabel = transaction ? (item === 8 ? 'Description' : exemptIncome[number]) : undefined;
			return layout(field, section, number, exemptIncome[number] + column, '', { kind, transaction, shortLabel });
		}
		const item = name.match(/^txtPg3Pt5I(\d+)(Exempt|AAFM|FinalTaxWithheld|C[12](?:R[12])?|DateofIssueC[12]|TotTaxWithheldPaid)$/);
		if (item && finalIncome[item[1]]) {
			const [, number, part] = item;
			const sourceColumn = part.match(/C([12])(?:R([12]))?$/);
			const transaction = sourceColumn ? (sourceColumn[1] === '1' ? 'A' : 'B') : undefined;
			const line = sourceColumn?.[2];
			const amountColumn = { Exempt: 'exempt', AAFM: 'amount', FinalTaxWithheld: 'withheld' } as const;
			const column = amountColumn[part as keyof typeof amountColumn];
			let label = finalIncome[number];
			let kind = field.kind;
			if (part === 'Exempt') label += ' exempt from tax';
			else if (part === 'AAFM') label += ' amount or fair market value';
			else if (part === 'FinalTaxWithheld') label += ' final tax withheld';
			else if (transaction) label += ` · Entry ${transaction}${line ? `, line ${line}` : ''}`;
			if (['Exempt', 'AAFM', 'FinalTaxWithheld', 'TotTaxWithheldPaid'].includes(part) ||
				[10, 11, 16, 17, 19, 20].includes(Number(number))) kind = 'money';
			const section = Number(number) <= 6 ? 'Part V.A · Income subject to final tax' :
				Number(number) <= 11 ? 'Real property transactions' :
				Number(number) <= 17 ? 'Share transactions' : number === '21' ? 'Final tax total' : 'Other income subject to final tax';
			const description = number === '12' ? 'Stock certificate series number' : finalIncome[number];
			if (number === '12') label = `${description} · Entry ${transaction}`;
			const shortLabel = column ? {
				exempt: 'Exempt amount', amount: 'Amount or fair market value', withheld: 'Final tax withheld'
			}[column] : transaction ? (line ? (line === '1' ? 'Description' : 'Additional description') : description) : undefined;
			return layout(field, section, number, label, '', {
				kind, transaction, amountColumn: column, shortLabel, rowHeading: column ? finalIncome[number] : undefined
			});
		}
		const shareKind = name.match(/^drpPg3Pt5I12([AB])[12]$/);
		if (shareKind) {
			return layout(field, 'Share transactions', '12',
				`Kind of shares · Entry ${shareKind[1]}`, '', {
					transaction: shareKind[1] === 'A' ? 'A' : 'B',
					shortLabel: 'Kind of shares',
					choiceLabels: { PS: 'Preferred shares', CS: 'Common shares' }
				});
		}
	}
	if (field.page === '4') {
		const addressPart = name.match(/^txtPg4T1(.+)$/);
		if (addressPart && address[addressPart[1]]) {
			const [item, label] = address[addressPart[1]];
			return layout(field, 'Table 1 · Current address', item, label);
		}
		const dependent = name.match(/^(?:txtPg4T2(LastName|FirstName|MiddleName|DependentDOB)|rdoP4T2(MarkIfIncapacitated))([1-4])$/);
		if (dependent) {
			const part = dependent[1] ?? dependent[2];
			const row = dependent[3];
			const section = `Table 2 · Dependent ${row}`;
			const labels: Record<string, string> = {
				LastName: 'Last name', FirstName: 'First name', MiddleName: 'Middle initial',
				DependentDOB: 'Date of birth', MarkIfIncapacitated: 'Mentally or physically incapable of self-support'
			};
			const phase = /Name$/.test(part) ? ':name' : ':details';
			return layout(field, section, row, labels[part], phase);
		}
	}
	return {};
}
