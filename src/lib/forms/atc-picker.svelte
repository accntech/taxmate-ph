<script lang="ts">
	import { Combobox } from '$lib/components/ui/combobox';
	import { Label, FieldErrors } from '$lib/components/ui';
	import { get1601EQATCDescription, get1601EQRate } from './form-1601-eq/form-1601-eq-atcs';
	import { filterATCOptions, getLegacyInterestATCOptions } from './atc-picker';
	import { getWithholdingAtcs } from './withholding-definitions';

	let { id, label = 'ATC', value, category, year = NaN, formCode = '1601EQ', fieldOptions = [], error = '', required = true, onchange }: {
		id: string;
		label?: string;
		value: string;
		category: string;
		year?: number;
		formCode?: string;
		fieldOptions?: { value: string; label: string }[];
		error?: string;
		required?: boolean;
		onchange: (code: string) => void;
	} = $props();
	const options = $derived.by(() => {
		if (formCode === '1601EQ') return filterATCOptions(category, '', value).map(option => {
			const rate = get1601EQRate(option.value, category, year);
			return { value: option.value, label: option.value, secondary: option.description, badge: rate === undefined ? undefined : `${Number(rate)}%` };
		});
		const records = getWithholdingAtcs(formCode, formCode === '0605' ? undefined : category);
		const result = records.filter((record, index) => records.findIndex(item => item.code === record.code) === index).map(record => ({ value: record.code, label: record.code, secondary: record.description, badge: record.rate ? `${Number(record.rate)}%` : undefined }));
		for (const option of [...fieldOptions, ...(formCode === '1602' ? getLegacyInterestATCOptions(category) : [])]) {
			if (!result.some(item => item.value === option.value)) result.push({ value: option.value, label: option.value, secondary: option.label, badge: undefined });
		}
		if (value && !result.some(option => option.value === value)) result.unshift({ value, label: value, secondary: '', badge: undefined });
		return result;
	});
	const selectedDescription = $derived.by(() => {
		if (formCode !== '1601EQ') return options.find(option => option.value === value)?.secondary ?? '';
		const description = value ? get1601EQATCDescription(value, category) : '';
		return description === value ? '' : description;
	});
	const descriptionId = $derived(`${id}-description`);
	const errorId = $derived(`${id}-error`);
	const describedBy = $derived([selectedDescription && descriptionId, error && errorId].filter(Boolean).join(' ') || undefined);
</script>

<div class="grid min-w-0 gap-2" data-slot="form-item">
	<Label for={id} class="text-fg-muted">
		{label}{#if required}<span class="text-danger" aria-hidden="true">*</span>{/if}
	</Label>
	<Combobox
		{id}
		value={value || null}
		{options}
		placeholder="Choose ATC"
		searchPlaceholder="Search code or income"
		emptyMessage="No matching ATCs."
		invalid={!!error}
		aria-required={required || undefined}
		aria-describedby={describedBy}
		popupWidth={576}
		itemHeight={44}
		maxVisibleItems={4}
		clearable
		createLabel="Use ATC"
		onCreate={(query) => { if (query.trim()) onchange(query.trim().toUpperCase()); }}
		onValueChange={(code) => onchange(typeof code === 'string' ? code : '')}
	>
		{#snippet trigger(option)}<span class="truncate">{option.label}</span>{/snippet}
		{#snippet option(option, matchedText)}
			<span class="grid min-w-0 text-left">
				<span class="flex items-center gap-2 font-medium">
					<span>{@render matchedText('label')}</span>
					{#if option.badge}<span class="rounded-sm bg-accent-soft px-1.5 text-xs text-fg-muted">{@render matchedText('badge')}</span>{/if}
				</span>
				<span class="truncate text-xs text-fg-muted">{@render matchedText('secondary')}</span>
			</span>
		{/snippet}
	</Combobox>
	{#if selectedDescription}
		<p id={descriptionId} class="text-xs text-fg-muted">{selectedDescription}</p>
	{/if}
	{#if error}<FieldErrors id={errorId} errors={[error]} />{/if}
</div>
