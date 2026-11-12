<script lang="ts">
	// PCSTI TIN editing behavior with TaxMate's 9 + 4 digit identifier format.
	import type { ComponentProps } from 'svelte';
	import Input from '../input/input.svelte';
	import { formatTinValue, getTinDigits } from './tin';

	let {
		value = $bindable(''),
		onchange,
		oninput,
		onbeforeinput,
		onfocus,
		onblur,
		onkeydown,
		readonly = false,
		placeholder = '000-000-000-0000',
		class: className = '',
		...rest
	}: Omit<ComponentProps<typeof Input>, 'value' | 'type' | 'maxlength' | 'onchange'> & {
		value?: string;
		onchange?: (value: string) => void;
	} = $props();

	let focused = $state(false);
	const display = $derived(focused ? getTinDigits(value) : formatTinValue(value));

	function update(next: string) {
		value = next;
		onchange?.(value);
	}

	function commit(input: HTMLInputElement) {
		if (readonly) return;
		focused = false;
		const formatted = formatTinValue(value);
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
	maxlength={16}
	class={['font-mono tabular-nums', className].filter(Boolean).join(' ')}
	value={display}
	onbeforeinput={(event) => {
		if (event.data && /\D/.test(event.data) && event.inputType === 'insertText') event.preventDefault();
		onbeforeinput?.(event);
	}}
	oninput={(event) => {
		if (!readonly) {
			const digits = getTinDigits(event.currentTarget.value);
			event.currentTarget.value = digits;
			update(digits);
		}
		oninput?.(event);
	}}
	onfocus={(event) => {
		if (!readonly) {
			focused = true;
			event.currentTarget.value = getTinDigits(value);
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
