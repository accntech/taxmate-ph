import { formatCurrencyInput } from '$lib/components/ui/currency-input/currency';
import { corporateAttachmentInstances, corporateFields } from '.';
import { corporateContinuationRowsPerPage as rowsPerPage } from './continuation-pagination';
import type { CorporateForm, CorporateSection, CorporateValues } from './types';

import sharedPrintStyles from '../printing/withholding-print.css?raw';
import sourceStyles from '../individual-income/templates/source-layout.css?raw';
import printStyles from './paper.css?raw';

const templates = import.meta.glob<string>('./templates/form-*.html', { query: '?raw', import: 'default' });
export const corporatePaperStyles = `${sharedPrintStyles}\n${sourceStyles}\n${printStyles}`;

function appendContinuation(surface: HTMLElement, section: CorporateSection, values: CorporateValues, form: CorporateForm) {
	for (let offset = 0; offset < section.rows.length; offset += rowsPerPage) {
		const page = document.createElement('div');
		page.className = 'corporate-source-sheet withholding-print-page-content original-continuation';
		const heading = document.createElement('h2');
		heading.textContent = section.title;
		const table = document.createElement('table');
		const columns = section.columns ?? section.rows[0]?.fields.map(field =>
			field.label || (field.kind === 'money' ? 'Amount' : 'Details')) ?? [];
		const headers = ['Item', 'Description', ...columns];
		const header = table.createTHead().insertRow();
		for (const title of headers) {
			const cell = document.createElement('th');
			cell.scope = 'col';
			cell.textContent = title;
			header.append(cell);
		}
		const body = table.createTBody();
		for (const row of section.rows.slice(offset, offset + rowsPerPage)) {
			const line = body.insertRow();
			line.insertCell().textContent = row.item ?? '';
			line.insertCell().textContent = row.label;
			for (const field of row.fields) {
				const cell = line.insertCell();
				const value = values[field.id] ?? field.defaultValue ?? '';
				cell.textContent = field.kind === 'money' ? formatCurrencyInput(value, form.decimals ?? 2, true) : value;
			}
		}
		page.append(heading, table);
		surface.append(page);
	}
}

export async function renderCorporatePaper(surface: HTMLElement, form: CorporateForm, values: CorporateValues): Promise<void> {
	const load = templates[`./templates/form-${form.code.toLowerCase()}.html`];
	if (!load) throw new Error(`No printable layout is available for ${form.code}.`);
	const template = document.createElement('template');
	template.innerHTML = await load();
	const fields = corporateFields(form);
	const definitions = new Map(fields.map(field => [field.id, field]));
	const byChoiceId = new Map(fields.flatMap(field => field.options
		?.filter(option => option.value.includes(':')).map(option => [option.value, field] as const) ?? []));
	const fixed = template.content.querySelectorAll<HTMLElement>('[data-source-page]:not([data-corporate-attachment])');
	surface.append(...fixed);
	const variants = template.content.querySelectorAll<HTMLElement>('[data-corporate-attachment]');
	for (const { id, title, group } of corporateAttachmentInstances(form, values)) {
		const attachmentFields = group.templatePages.flatMap(page => page.sections.flatMap(section => section.rows.flatMap(row => row.fields)));
		for (const field of attachmentFields) definitions.set(field.id.replaceAll('AttM', id), field);
		for (const source of variants) {
			const copy = source.cloneNode(true) as HTMLElement;
			copy.innerHTML = copy.innerHTML.replaceAll('AttM', id);
			copy.id = copy.id.replaceAll('AttM', id);
			copy.dataset.sourcePage = id;
			copy.setAttribute('aria-label', title);
			surface.append(copy);
		}
	}
	for (const section of form.continuations?.(values) ?? []) appendContinuation(surface, section, values, form);
	for (const control of surface.querySelectorAll<HTMLElement>('[data-corporate-field]')) {
		const sourceId = control.dataset.corporateField!;
		const definition = definitions.get(sourceId) ?? definitions.get(control.id) ?? byChoiceId.get(control.id);
		const id = definitions.has(sourceId) ? sourceId : definition?.id ?? sourceId;
		const active = !form.fieldApplies || form.fieldApplies(id, values);
		let value = active ? values[id] ?? values[sourceId] ?? definition?.defaultValue : '';
		if (control instanceof HTMLInputElement && control.type === 'radio' && definition?.kind === 'checkbox') {
			control.type = 'checkbox';
		}
		if (control instanceof HTMLInputElement && control.type === 'radio') {
			if (value !== undefined) control.checked = [control.id, control.value].includes(value) ||
				(id === sourceId && control.name !== id && value === 'Y' && !definition?.options);
			continue;
		}
		if (control instanceof HTMLInputElement && control.type === 'checkbox') {
			if (value !== undefined) control.checked = ['Y', 'true', '1', 'on', control.value].includes(value) && value !== 'N';
			continue;
		}
		if (value === undefined) continue;
		if (definition?.kind === 'money') {
			value = formatCurrencyInput(value, form.decimals ?? 2, true);
			control.style.textAlign = 'right';
		}
		if (sourceId === form.year && (form.code === '1702EX' || form.code.startsWith('1702RT') || control.getAttribute('maxlength') === '2' || sourceId.endsWith(':txtYrEndYear'))) {
			value = value.slice(-2);
		}
		if (/^\d{4}-\d{2}-\d{2}$/.test(value)) value = `${value.slice(5).replace('-', '/')}/${value.slice(0, 4)}`;
		if (control.dataset.choice !== undefined) value = value === control.dataset.choice ? 'X' : '';
		if (control.dataset.datePart !== undefined) value = value.split('/')[Number(control.dataset.datePart)] ?? '';
		if (control.dataset.slice) {
			const [start, end] = control.dataset.slice.split(':').map(Number);
			value = value.slice(start, end);
		}
		control.dataset.fieldId = sourceId;
		if (control instanceof HTMLSelectElement) {
			const option = Array.from(control.options).find(option => option.value === value);
			const label = document.createElement('span');
			label.className = 'corporate-print-choice';
			label.dataset.corporateField = sourceId;
			label.dataset.fieldId = sourceId;
			label.dataset.printValue = '';
			label.textContent = option?.label.trim() || value;
			control.replaceWith(label);
		} else if (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement) {
			control.value = value;
		} else {
			control.dataset.printValue = '';
			control.textContent = value;
		}
	}
}
