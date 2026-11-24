<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './currency-input-wrapper.styles';
	import type { ComponentProps } from 'svelte';
	import Input from '../input/input.svelte';
	import { commitCurrencyInput, currencyInputError, formatCurrencyInput, type CurrencyDecimals } from './currency';

	let {
		value = $bindable(''),
		label = '',
		error = '',
		decimals = 2,
		allowNegative = false,
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
		decimals?: CurrencyDecimals;
		allowNegative?: boolean;
		onchange?: (value: string) => void;
	} & Omit<ComponentProps<typeof Input>, 'value' | 'onchange' | 'type' | 'inputmode' | 'leading' | 'trailing'> = $props();

	let draft = $state<string | null>(null);
	const display = $derived(draft ?? formatCurrencyInput(value, decimals, allowNegative));
	const formatError = $derived(currencyInputError(value, allowNegative));

	function update(next: string) {
		value = commitCurrencyInput(next, decimals, allowNegative);
		onchange?.(value);
	}

	function blur() {
		if (readonly) return;
		update(value);
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
		class={className}
		onfocus={(event) => {
			if (!readonly) {
				// Select the ungrouped amount for replacement.
				draft = commitCurrencyInput(value, decimals, allowNegative);
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

<style>
	[data-slot='currency-input'] :global(input) {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
</style>
