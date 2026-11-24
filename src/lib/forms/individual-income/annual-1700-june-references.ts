export type June1700Reference = {
	label: string;
	target: string;
	owner: 'Taxpayer' | 'Spouse' | 'Both filers';
};

const references: Record<string, readonly June1700Reference[]> = {};
const prefix = 'frm1700:';

function connect(
	summary: string,
	summaryItem: string,
	computation: string,
	computationItem: string,
	owner: June1700Reference['owner']
): void {
	references[prefix + summary] = [{
		label: 'From Part IV, Item ' + computationItem,
		target: prefix + computation,
		owner
	}];
	references[prefix + computation] = [{
		label: 'To Part II, Item ' + summaryItem,
		target: prefix + summary,
		owner
	}];
}

// June 2013 Form 1700 Part II cites Part IV Items 14, 19, 22 and 27.
// Part IV explicitly returns these amounts to Part II, including Item 28 → Item 31.
// The Part IV headings identify column A as Tax Filer and column B as Spouse.
connect('txtPg1Pt2I23FilerTaxDue', '23', 'txtPg2Pt4I14C1', '14A', 'Taxpayer');
connect('txtPg1Pt2I24SpouseTaxDue', '24', 'txtPg2Pt4I14C2', '14B', 'Spouse');
connect('txtPg1Pt2I26TaxFilersTaxCredit', '26', 'txtPg2Pt4I19C1', '19A', 'Taxpayer');
connect('txtPg1Pt2I27SpouseTaxCredit', '27', 'txtPg2Pt4I19C2', '19B', 'Spouse');
connect('txtPg1Pt2I29', '29', 'txtPg2Pt4I22', '22', 'Both filers');
connect('txtPg1Pt2I30', '30', 'txtPg2Pt4I27', '27', 'Both filers');
connect('txtPg1Pt2I31', '31', 'txtPg2Pt4I28', '28', 'Both filers');

export function june1700References(fieldId: string): readonly June1700Reference[] {
	return references[fieldId] ?? [];
}
