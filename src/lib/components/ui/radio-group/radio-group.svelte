<script lang="ts">
	import { FieldErrors } from '../field-errors';

	let {
		id,
		label,
		value = $bindable(''),
		options,
		required = false,
		disabled = false,
		help = '',
		error = '',
		onchange
	}: {
		id?: string;
		label: string;
		value?: string;
		options: { value: string; label: string; description?: string }[];
		required?: boolean;
		disabled?: boolean;
		help?: string;
		error?: string;
		onchange?: (value: string) => void;
	} = $props();
	const uid = $props.id();
	const controlId = $derived(id ?? `${uid}-radio`);
	const descriptionId = `${uid}-description`;
</script>

<fieldset
	data-slot="radio-group"
	role="radiogroup"
	aria-labelledby={`${uid}-legend`}
	aria-required={required || undefined}
	aria-invalid={!!error || undefined}
	aria-describedby={error || help ? descriptionId : undefined}
	{disabled}
>
	<legend id={`${uid}-legend`}>
		{label}{#if required}<span class="text-danger" aria-hidden="true"> *</span>{/if}
	</legend>
	<div class="choices">
		{#each options as option, index (option.value)}
			<label class="choice">
				<span class="radio-control">
					<input
						id={index === 0 ? controlId : `${controlId}-${option.value}`}
						type="radio"
						name={uid}
						value={option.value}
						bind:group={value}
						{required}
						aria-describedby={error || help ? descriptionId : undefined}
						onchange={() => onchange?.(option.value)}
					/>
				</span>
				<span>
					<span class="choice-label">{option.label}</span>
					{#if option.description}<span class="choice-description">{option.description}</span>{/if}
				</span>
			</label>
		{/each}
	</div>
	{#if error}
		<FieldErrors id={descriptionId} errors={[error]} />
	{:else if help}
		<p id={descriptionId} class="help">{help}</p>
	{/if}
</fieldset>

<style>
	fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
	legend { margin-bottom: .5rem; padding: 0; font-size: .875rem; font-weight: 500; line-height: 1; }
	.choices { display: flex; flex-wrap: wrap; gap: 1.25rem; }
	.choices + :global(*) { margin-top: .5rem; }
	.choice { display: flex; min-height: 2.375rem; align-items: center; gap: .5rem; padding-block: .375rem; cursor: pointer; }
	.radio-control { display: inline-flex; width: 1rem; height: 1rem; flex-shrink: 0; border-radius: 50%; }
	input { width: 100%; height: 100%; margin: 0; accent-color: var(--accent); }
	.radio-control:has(input:focus-visible) {
		outline: 1px solid var(--field-focus-border);
		outline-offset: 0;
		box-shadow: 0 0 0 3px var(--field-focus-halo);
	}
	fieldset[aria-invalid='true'] .radio-control { outline: 1px solid var(--field-error-border); outline-offset: 0; box-shadow: 0 0 0 3px var(--field-error-halo); }
	fieldset[aria-invalid='true'] .radio-control:has(input:focus-visible) { box-shadow: 0 0 0 3px var(--field-error-focus-halo); }
	.radio-control input:focus-visible { outline: none; box-shadow: none; }
	.choice-label { display: block; font-size: .875rem; font-weight: 500; }
	.choice-description, .help { display: block; color: var(--fg-muted); font-size: .75rem; line-height: 1.4; }
	fieldset:disabled .choice { cursor: default; opacity: .6; }
	@media (forced-colors: active) {
		fieldset .radio-control:has(input:focus-visible) { outline: 2px solid Highlight; outline-offset: 2px; box-shadow: none; }
	}
</style>
