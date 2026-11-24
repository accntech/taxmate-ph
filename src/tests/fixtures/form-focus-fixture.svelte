<script lang="ts">
	import * as stylex from "@stylexjs/stylex";
	const fixture = stylex.create({ root: { display: "grid", maxWidth: "36rem", gap: "1rem", padding: "1rem" } });
	import { Input, NumberInput, CurrencyInput, TinInput, Select, SelectRoot, SelectTrigger, SelectContent, SelectItem, Tooltip, Textarea, RadioGroup, ToggleGroup } from '$lib/components/ui';
	import AtcPicker from '$lib/forms/atc-picker.svelte';
	let invalid = $state(false);
	let choice = $state('N');
	let period = $state('Q1');
	let primitivePeriod = $state<string | null>('Q1');
	let atc = $state('WI120');
	let density = $state('compact');
	const error = $derived(invalid ? 'Check this value.' : '');
</script>

<section aria-label="Form focus fixture" class={stylex.attrs(fixture.root).class}>
	<button type="button" onclick={() => invalid = !invalid}>Toggle field errors</button>
	<Input label="Reference input" {error} />
	<Input label="Password input" type="password" {error} />
	<NumberInput label="Number input" {error} />
	<CurrencyInput label="Currency input" {error} />
	<TinInput label="TIN input" value="0012345670008" {error} />
	<Select label="Period select" bind:value={period} options={[{ value: 'Q1', label: 'First Quarter' }, { value: 'Q2', label: 'Second Quarter' }]} {error} />
	<SelectRoot bind:value={primitivePeriod}>
		<SelectTrigger aria-label="Primitive select" aria-invalid={invalid || undefined}>{primitivePeriod === 'Q2' ? 'Second Quarter' : 'First Quarter'}</SelectTrigger>
		<SelectContent>
			<SelectItem value="Q1" label="First Quarter" />
			<SelectItem value="Q2" label="Second Quarter" />
			<SelectItem value="Q3" label="Third Quarter" disabled />
		</SelectContent>
	</SelectRoot>
	<Textarea label="Notes textarea" {error} />
	<RadioGroup label="Declaration" bind:value={choice} options={[{ value: 'N', label: 'No' }, { value: 'Y', label: 'Yes' }]} {error} />
	<AtcPicker id="focus-atc" value={atc} category="P" {error} onchange={value => atc = value} />
	<ToggleGroup ariaLabel="Density choice" bind:value={density} options={[{ value: 'compact', label: 'Compact' }, { value: 'comfortable', label: 'Comfortable' }]} />
</section>

<div aria-label="Tooltip examples">
	<Tooltip label="Inline hint"><button type="button" aria-label="Inline tooltip trigger">Inline</button></Tooltip>
	<Tooltip label="Floating hint" floating><button type="button" aria-label="Floating tooltip trigger">Floating</button></Tooltip>
	<Tooltip label="Unclamped hint" placement="left" clamp={false}><button type="button" aria-label="Unclamped tooltip trigger">Unclamped</button></Tooltip>
</div>
