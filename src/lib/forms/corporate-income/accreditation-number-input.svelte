<script lang="ts">
	import { Input } from '$lib/components/ui';
	import { externalAuditorLabels } from '../external-auditor';
	import type { CorporateField, CorporateValues } from './types';

	let { fields, values, errors, onvaluechange }: {
		fields: CorporateField[];
		values: CorporateValues;
		errors: CorporateValues;
		onvaluechange: (patch: CorporateValues) => void;
	} = $props();

	let draft = $state<string>();
	const value = $derived(fields.map(field => values[field.id] ?? '').join('-').replace(/-+$/, ''));
	const lengths = $derived(fields.map(field => field.maxLength ?? 0));

	function skipSeparator(event: InputEvent & { currentTarget: HTMLInputElement }) {
		const input = event.currentTarget;
		const position = input.selectionStart;
		if (position === null || position !== input.selectionEnd) return;

		if (event.inputType === 'deleteContentBackward' && input.value[position - 1] === '-' && position < input.value.length) {
			event.preventDefault();
			input.setSelectionRange(position - 1, position - 1);
		} else if (event.inputType === 'deleteContentForward' && input.value[position] === '-' && position + 1 < input.value.length) {
			event.preventDefault();
			input.setSelectionRange(position + 1, position + 1);
		}
	}

	function edit(input: HTMLInputElement) {
		const previous = draft ?? value;
		const text = input.value.replace(/[^\d-]/g, '');
		const position = input.selectionStart ?? input.value.length;
		const segments = text.split('-');
		const last = segments.length - 1;

		// Preserve explicit slots. Only distribute compact digits or digits appended at the end.
		if (last === 0 || (text.startsWith(previous) && /^\d+$/.test(text.slice(previous.length)))) {
			const tail = segments[last];
			const remainingLengths = lengths.slice(last);
			if (tail.length <= remainingLengths.reduce((total, length) => total + length, 0)) {
				segments.pop();
				let offset = 0;
				for (const length of remainingLengths) {
					if (offset >= tail.length) break;
					segments.push(tail.slice(offset, offset + length));
					offset += length;
				}
			}
		}

		if (segments.length > lengths.length || segments.some((part, index) => part.length > lengths[index])) {
			const caret = Math.max(0, position - Math.max(0, text.length - previous.length));
			input.value = previous;
			input.setSelectionRange(caret, caret);
			return;
		}

		const formatted = segments.join('-');
		if (input.value !== formatted) {
			let caret = 0;
			for (const character of input.value.slice(0, position).replace(/[^\d-]/g, '')) {
				// Move past separators inserted before the original caret.
				while (character !== '-' && formatted[caret] === '-') caret++;
				caret++;
			}
			input.value = formatted;
			input.setSelectionRange(caret, caret);
		}
		draft = formatted;
		onvaluechange(Object.fromEntries(fields.map((field, index) => [field.id, segments[index] ?? ''])));
	}
</script>

<Input
	id={fields[0].id}
	label={externalAuditorLabels.accreditation}
	class="font-mono"
	placeholder="00-000000-000-0000"
	autocomplete="off"
	value={draft ?? value}
	error={fields.map(field => errors[field.id]).find(Boolean)}
	onbeforeinput={skipSeparator}
	oninput={({ currentTarget }) => edit(currentTarget)}
	onblur={() => { draft = undefined; }}
/>
