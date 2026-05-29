<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	let {
		value = $bindable(''),
		invalid = false,
		label = '',
		help = '',
		class: className = '',
		...rest
	}: {
		value?: string;
		invalid?: boolean;
		label?: string;
		help?: string;
		class?: string;
	} & Omit<HTMLTextareaAttributes, 'value' | 'class'> = $props();
</script>

{#snippet field()}
	<textarea
		bind:value
		{...rest}
		class={[
			'min-h-28 w-full rounded-md border border-border bg-bg-input px-3 py-2 text-sm text-fg',
			'outline-none transition-all placeholder:text-fg-subtle hover:border-fg-subtle/40',
			'focus:border-accent focus:bg-bg-elev focus:shadow-[0_0_0_3px_var(--ring)]',
			invalid && 'border-danger! shadow-[0_0_0_3px_color-mix(in_oklch,var(--danger)_16%,transparent)]!',
			className
		]}
		data-invalid={invalid ? 'true' : undefined}
	></textarea>
{/snippet}

{#if label}
	<label class="flex flex-col gap-1.5">
		<span class="text-[13px] font-medium text-fg-muted">{label}</span>
		{@render field()}
		{#if help}
			<span class="text-xs text-fg-subtle">{help}</span>
		{/if}
	</label>
{:else}
	{@render field()}
{/if}
