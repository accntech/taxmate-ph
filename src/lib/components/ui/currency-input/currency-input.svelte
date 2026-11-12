<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './currency-input-wrapper.styles';
	import type { ComponentProps } from 'svelte';
	import Input from '../input/input.svelte';
	import { commitCurrencyInput, currencyInputError, formatCurrencyInput, normalizeCurrencyInput } from './currency';

	let {
		value = $bindable(''),
		label = '',
		error = '',
		onchange,
		onfocus,
		oninput,
		onblur,
		readonly = false,
		class: className = '',
		...rest
	}: {
		value?: string;
		label?: string;
		error?: string;
		onchange?: (value: string) => void;
	} & Omit<ComponentProps<typeof Input>, 'value' | 'onchange' | 'type' | 'inputmode' | 'leading' | 'trailing'> = $props();

	let draft = $state<string | null>(null);
	const display = $derived(draft ?? formatCurrencyInput(value));
	const formatError = $derived(currencyInputError(value));

	function update(next: string) {
		value = normalizeCurrencyInput(next) ?? next;
		onchange?.(value);
	}

	function blur() {
		if (readonly) return;
		update(commitCurrencyInput(value));
		draft = null;
	}
</script>

<div data-slot="currency-input">
	<Input
		{...rest}
		{label}
		{readonly}
		value={display}
		error={formatError || error}
		type="text"
		inputmode="decimal"
		class={[stylex.attrs(wrapperStyles.control).class, className].filter(Boolean).join(' ')}
		onfocus={(event) => {
			if (!readonly) {
				// PCSTI focuses the ungrouped amount and selects it for replacement.
				// Keep our exact decimal string instead of converting through Number.
				draft = normalizeCurrencyInput(value) ?? value;
				const input = event.currentTarget;
				input.value = draft;
				queueMicrotask(() => input.select());
			}
			onfocus?.(event);
		}}
		oninput={(event) => {
			if (!readonly) {
				draft = event.currentTarget.value;
				update(draft);
			}
			oninput?.(event);
		}}
		onblur={(event) => { blur(); onblur?.(event); }}
	>
		{#snippet leading()}<span aria-hidden="true" class={stylex.attrs(wrapperStyles.symbol).class}>₱</span>{/snippet}
	</Input>
</div>
