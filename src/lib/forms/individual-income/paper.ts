import { formatCurrencyInput } from '$lib/components/ui/currency-input/currency';
import type { IncomeForm } from '.';
import { legacy1700IncomeSourceChecked } from './compensation';
import { calculateIndividualIncome, hasActivityAttachment, incomeAmountDecimals, incomeCalculatedFields, incomeOutputValues, isIncomeAmount } from '.';
import { is1701MSOverpaymentSelected, overpaymentOptions1701MS } from './form-1701ms-overpayment';
import sourceStyles from './templates/source-layout.css?raw';
import paginationStyles from '../printing/withholding-print.css?raw';
import paperStyles from './paper.css?raw';

const templates = import.meta.glob('./templates/form-*.html', { query: '?raw', import: 'default' });

export const legacy1700PrintStyles = `${paginationStyles}\n${paperStyles}`;
export const individualIncomePaperStyles = `${sourceStyles}\n${legacy1700PrintStyles}`;

export async function loadIndividualIncomePaper(code: string): Promise<string> {
	const load = templates[`./templates/form-${code.toLowerCase()}.html`];
	if (!load) throw new Error(`No printable layout is available for ${code}.`);
	return (await load()) as string;
}

export type PaperControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export function paperControls(root: ParentNode): PaperControl[] {
	return [...root.querySelectorAll<PaperControl>('[data-income-field]')];
}

export function fitLegacyIncomePrintValues(root: ParentNode): void {
	for (const slot of root.querySelectorAll<HTMLElement>(':is(.legacy-1700-print-value, .legacy-1701-print-value) > [data-legacy-print-id]')) {
		if (!slot.textContent || slot.firstElementChild) continue;
		const box = slot.parentElement!;
		const style = getComputedStyle(slot);
		const size = parseFloat(style.fontSize);
		const spacing = parseFloat(style.letterSpacing) || 0;
		const width = slot.getBoundingClientRect().width - spacing;
		if (width > box.clientWidth && box.clientWidth > 0) {
			// Leave room for the final digit or letter next to a ruling.
			const scale = (box.clientWidth - 1) / width;
			slot.style.fontSize = `${size * scale}px`;
			if (spacing > 0) slot.style.letterSpacing = `${spacing * scale}px`;
		}
	}
}

export function renderIncomePrintChoices(root: ParentNode, form: IncomeForm): void {
	// These native HTA print handlers expose the selected label in place of the
	// dropdown. Keep the original slot while taking the control off the page.
	if (!['1700v2018', '1701v2018', '1701A', '1701Q', '1701Qv2018'].includes(form.code)) return;
	for (const control of root.querySelectorAll<HTMLSelectElement>('select[data-income-field]')) {
		const label = document.createElement('span');
		label.id = control.id;
		label.className = 'individual-income-print-choice';
		label.dataset.incomeField = control.dataset.incomeField;
		label.dataset.fieldId = control.id;
		label.dataset.printValue = '';
		label.style.width = `${control.getBoundingClientRect().width}px`;
		const text = control.selectedOptions[0]?.text.trim() ?? '';
		label.textContent = form.code === '1701A' && control.id.includes('drpATCCode') ? text.split('-')[0].trim() : text;
		control.replaceWith(label);
	}
}

export function visiblePaperPages(root: ParentNode, form: IncomeForm, values: Record<string, string>): HTMLElement[] {
	const attachment = hasActivityAttachment(form, values);
	return [...root.querySelectorAll<HTMLElement>('[data-income-page]')].filter(page => /^\d+$/.test(page.dataset.incomePage!) || attachment);
}

export function renderIndividualIncomeValues(root: ParentNode, form: IncomeForm, values: Record<string, string>, errors: Record<string, string> = {}): void {
	const calculated = incomeOutputValues(form, calculateIndividualIncome(form, values));
	const computed = incomeCalculatedFields(form, values);
	const profileFields = new Set(Object.values(form.identity));
	// Legacy profile names occupy separate boxes and the taxpayer may complete those boxes.
	if (form.code === '1700' || form.code === '1701') profileFields.delete(form.identity.taxpayerName!);
	for (const control of paperControls(root)) {
		const key = control.dataset.incomeField!;
		let value = calculated[key] ?? '';
		if (isIncomeAmount(form, key)) value = formatCurrencyInput(value, incomeAmountDecimals(form), true);
		if (key === form.year && /^\d{2}$/.test(value) === false && ['1700', '1701'].includes(form.code) && value.length === 4) value = value.slice(-2);
		if (/^\d{4}-\d{2}-\d{2}$/.test(value)) value = value.slice(5).replace('-', '/') + '/' + value.slice(0, 4);
		const incomingError = errors[key] ?? errors[control.id];
		if (incomingError) {
			control.setAttribute('aria-invalid', 'true');
			control.title = incomingError;
		} else {
			control.removeAttribute('aria-invalid');
			control.removeAttribute('title');
		}
		const readonly = computed.has(key) || (profileFields.has(key) && !!value);
		if (control instanceof HTMLInputElement && control.type === 'radio') {
			control.checked = control.value === value;
			control.disabled = readonly;
		} else if (control instanceof HTMLInputElement && control.type === 'checkbox') {
			const disposition = form.code === '1701MS' ? overpaymentOptions1701MS.find(option => option.choice === key) : undefined;
			if (disposition) control.checked = is1701MSOverpaymentSelected(disposition, calculated);
			else if (form.code === '1700' && /^frm1700:SourceOfIncome_[12]$/.test(key)) control.checked = legacy1700IncomeSourceChecked(key, value);
			else control.checked = control.dataset.incomeChoice ? control.value === value : ['Y', '1', 'true', 'on'].includes(value);
			control.disabled = readonly;
		} else if (control instanceof HTMLSelectElement) {
			if (control.value !== value) control.value = value;
			control.disabled = readonly;
		} else {
			control.readOnly = readonly;
			if (control.value !== value) control.value = value;
		}
	}
}
