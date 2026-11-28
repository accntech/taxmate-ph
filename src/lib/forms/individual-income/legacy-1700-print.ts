import { fillFourBranchCodeBoxes } from '$lib/printing/branch-code-boxes';
import type { IncomeForm } from '.';
import { paperControls, renderIndividualIncomeValues } from './paper';

const splitDateSlot = /^(.*(?:DOB|DOB[1-4]_|DateofIssue|DateofIssueC[12]_|DatePayment))([123])$/;
const digitSlot = /^txtYear$|(?:TIN[123]|RDOCode|Psoc|ZipCde)$/;

/** Fill the source OCR layer using the same values and choice rules as the other return PDFs. */
export function renderLegacy1700Print(
	root: ParentNode,
	controls: ParentNode,
	form: IncomeForm,
	values: Record<string, string>
): void {
	renderIndividualIncomeValues(controls, form, values);
	const printedValues = new Map(paperControls(controls).map(control => [
		control.id.replace(/^frm1700:/, ''),
		control instanceof HTMLInputElement && ['checkbox', 'radio'].includes(control.type)
			? (control.checked ? 'X' : '')
			: control.value.trim()
	]));
	for (const slot of root.querySelectorAll<HTMLElement>('[data-legacy-print-id]')) {
		const id = slot.dataset.legacyPrintId!;
		const date = id.match(splitDateSlot);
		const value = date
			? printedValues.get(date[1].replace(/_$/, ''))?.split('/')[Number(date[2]) - 1] ?? ''
			: printedValues.get(id) ?? '';
		if (slot.hasAttribute('data-print-branch-boxes') || slot.firstElementChild?.hasAttribute('data-legacy-branch-part')) {
			fillFourBranchCodeBoxes(slot, value);
			continue;
		}
		if (!date && !digitSlot.test(id)) slot.style.removeProperty('letter-spacing');
		slot.textContent = /MiddleName\d*$/.test(id) ? (Array.from(value.toUpperCase())[0] ?? '') :
			/Email/i.test(id) ? value.toLowerCase() : value.toUpperCase();
	}
}

