<script lang="ts">
	// Adapted from PCSTI's NumberInput; retain string values for legacy form XML.
	import type { ComponentProps } from 'svelte';
	import Input from '../input/input.svelte';
	import { numberInputError } from './number';

	let {
		value = $bindable(''),
		decimal = false,
		min,
		max,
		error = '',
		onchange,
		oninput,
		onbeforeinput,
		onkeydown,
		onpaste,
		readonly = false,
		...rest
	}: Omit<ComponentProps<typeof Input>, 'value' | 'type' | 'inputmode' | 'onchange' | 'min' | 'max'> & {
		value?: string;
		decimal?: boolean;
		min?: number;
		max?: number;
		onchange?: (value: string) => void;
	} = $props();

	const formatError = $derived(numberInputError(value, { decimal, min, max }));
	const allowed = $derived(decimal ? /^-?[\d.]*$/ : /^-?\d*$/);
</script>

<Input
	{...rest}
	{readonly}
	type="text"
	inputmode={decimal ? 'decimal' : 'numeric'}
	value={value}
	error={formatError || error}
	oninput={(event) => {
		if (!readonly) {
			value = event.currentTarget.value;
			onchange?.(value);
		}
		oninput?.(event);
	}}
	onbeforeinput={(event) => {
		if (event.data && !allowed.test(event.data)) event.preventDefault();
		onbeforeinput?.(event);
	}}
	onkeydown={(event) => {
		if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key.length === 1 && !allowed.test(event.key)) event.preventDefault();
		onkeydown?.(event);
	}}
	onpaste={(event) => {
		const text = event.clipboardData?.getData('text') ?? '';
		if (text && !allowed.test(text.trim())) event.preventDefault();
		onpaste?.(event);
	}}
/>
