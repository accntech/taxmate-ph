import { fillFourBranchCodeBoxes } from '$lib/printing/branch-code-boxes';
import { paperControls } from './paper';

const datePart = /^(\w+Month(?:[1-4]|C[12])?)([MDY])$/;
const repeatedTaxpayer = /^txtPg(?:[2-4]TaxFiler|5RegName|(?:[6-9]|10)TaxName|11RegisteredName|12Pt9TaxFiler)$/;
const accreditationPart = /^txtPg4Pt8I116BIRAccreditation([1-4])$/;
const otherIncomePart = /^(txtPg11Sc12AI18OtherIncomeC[12])([12])$/;

function splitLine(value: string, firstLimit: number): [string, string] {
	if (value.length <= firstLimit) return [value, ''];
	const space = value.lastIndexOf(' ', firstLimit);
	const split = space > firstLimit / 2 ? space : firstLimit;
	return [value.slice(0, split).trimEnd(), value.slice(split).trimStart()];
}

/** Transfer the rendered control values to the source's positioned base-page artwork. */
export function renderLegacy1701Print(root: ParentNode, controls: ParentNode): void {
	const printed = new Map(paperControls(controls).map(control => [
		control.id.replace(/^frm1701:/, ''),
		control instanceof HTMLInputElement && ['checkbox', 'radio'].includes(control.type)
			? (control.checked ? 'X' : '')
			: control.value.trim()
	]));
	const read = (id: string) => printed.get(id) ?? '';
	const lastName = read('txtPg1Pt1I8TaxFiler');
	printed.set('txtPg1Pt1I8TaxFiler', [lastName, read('txtPg1Pt1I8TaxFilerFirstName'), read('txtPg1Pt1I8TaxFilerMiddleName')].filter(Boolean).join(' '));
	printed.set('ddlPg1Pt1I6RDOCode', read('hdnPg1Pt1I6RDOCode'));
	const spouse = read('txtPg4Pt7I97SpouseName').split(',').map(part => part.trim());
	for (const [index, part] of ['L', 'F', 'M'].entries()) {
		printed.set('txtPg4Pt7I97SpouseName' + part, index === 2 ? spouse[index]?.charAt(0) ?? '' : spouse[index] ?? '');
	}
	printed.set('txtPg4Pt7BLot', [1, 2, 3, 4].map(part => read('txtPg4Pt7BLot' + part)).filter(Boolean).join(' '));
	for (const id of ['txtPg1Pt1I10Address', 'txtPg4Pt8I112ExernalEditor', 'txtPg4Pt8I114SigningPartner']) {
		const [line1, line2] = splitLine(read(id), 66);
		printed.set(id, line1);
		printed.set(id + '2', line2);
	}

	for (const slot of root.querySelectorAll<HTMLElement>('[data-legacy-print-id]')) {
		const id = slot.dataset.legacyPrintId!;
		let value = repeatedTaxpayer.test(id) ? read(id) || lastName : read(id);
		const date = id.match(datePart);
		const accreditation = id.match(accreditationPart);
		const otherIncome = id.match(otherIncomePart);
		if (date) value = read(date[1]).split('/')['MDY'.indexOf(date[2])] ?? '';
		if (accreditation) {
			const index = Number(accreditation[1]);
			const bounds = [0, 2, 8, 11, 15];
			value = read('txtPg4Pt8I116BIRAccreditation').slice(bounds[index - 1], bounds[index]);
		}
		if (otherIncome) value = splitLine(read(otherIncome[1]), otherIncome[1].endsWith('C1') ? 17 : 16)[Number(otherIncome[2]) - 1];
		if (slot.hasAttribute('data-print-branch-boxes') || slot.firstElementChild?.hasAttribute('data-legacy-branch-part')) {
			fillFourBranchCodeBoxes(slot, value);
			continue;
		}
		// The artwork's individual digit grids need their original spacing.
		if (!date && !/(?:TIN[1-3](?:C[1-4])?|RDOCode|ZIPCode|I1Year|I1Month)$/i.test(id)) slot.style.letterSpacing = '0px';
		slot.textContent = /Email/i.test(id) ? value.toLowerCase() : value.toUpperCase();
	}
}
