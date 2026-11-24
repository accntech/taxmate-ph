<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './tin-input-wrapper.styles';
	// Format TaxMate identifiers as nine TIN digits and five branch digits.
	import type { ComponentProps } from 'svelte';
	import Input from '../input/input.svelte';
	import { formatTinValue, getTinDigits, splitTinSegments } from './tin';

	let {
		value = $bindable(''),
		onchange,
		oninput,
		onbeforeinput,
		onfocus,
		onblur,
		onkeydown,
		readonly = false,
		preserveSegments = false,
		placeholder = '000-000-000-00000',
		class: className = '',
		...rest
	}: Omit<ComponentProps<typeof Input>, 'value' | 'type' | 'maxlength' | 'onchange'> & {
		value?: string;
		preserveSegments?: boolean;
		onchange?: (value: string) => void;
	} = $props();

	let focused = $state(false);
	const display = $derived(displayValue(value, focused));

	function displayValue(next: string, editing: boolean) {
		const packed = formatTinValue(next);
		if (preserveSegments && next.includes('-')) {
			const positioned = splitTinSegments(next).join('-').replace(/-+$/, '');
			if (positioned !== packed) return positioned;
		}
		return editing ? getTinDigits(next) : packed;
	}

	function update(next: string) {
		value = next;
		onchange?.(value);
	}

	function commit(input: HTMLInputElement) {
		if (readonly) return;
		focused = false;
		const formatted = displayValue(value, false);
		input.value = formatted;
		update(formatted);
	}
</script>

<Input
	{...rest}
	{placeholder}
	{readonly}
	type="text"
	inputmode="numeric"
	maxlength={17}
	class={[stylex.attrs(wrapperStyles.control).class, className].filter(Boolean).join(' ')}
	value={display}
	onbeforeinput={(event) => {
		const invalid = preserveSegments ? /[^\d-]/ : /\D/;
		if (event.data && invalid.test(event.data) && event.inputType === 'insertText') event.preventDefault();
		onbeforeinput?.(event);
	}}
	oninput={(event) => {
		if (!readonly) {
			const edited = displayValue(event.currentTarget.value, true);
			if (event.currentTarget.value !== edited) event.currentTarget.value = edited;
			update(edited);
		}
		oninput?.(event);
	}}
	onfocus={(event) => {
		if (!readonly) {
			focused = true;
			event.currentTarget.value = displayValue(value, true);
		}
		onfocus?.(event);
	}}
	onblur={(event) => {
		commit(event.currentTarget);
		onblur?.(event);
	}}
	onkeydown={(event) => {
		if (event.key === 'Enter') commit(event.currentTarget);
		onkeydown?.(event);
	}}
/>
