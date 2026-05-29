<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		value = $bindable(''),
		invalid = false,
		class: className = '',
		label = '',
		help = '',
		size = 'md',
		leading,
		trailing,
		...rest
	}: {
		value?: string;
		invalid?: boolean;
		class?: string;
		label?: string;
		help?: string;
		size?: 'md' | 'touch';
		leading?: Snippet;
		trailing?: Snippet;
	} & Omit<HTMLInputAttributes, 'value' | 'class' | 'size'> = $props();

	const sizeClass = $derived(size === 'touch' ? 'min-h-12 text-base' : 'min-h-9 text-sm');
</script>

{#snippet field()}
	<div
		class={[
			'group flex items-center gap-2 rounded-md border border-border bg-bg-input px-3 py-1.5',
			'transition-all hover:border-[color-mix(in_oklch,var(--fg-subtle)_30%,var(--border))]',
			'focus-within:border-[color-mix(in_oklch,var(--accent)_60%,var(--border))]',
			'focus-within:bg-bg-elev',
			'focus-within:shadow-[0_0_0_3px_color-mix(in_oklch,var(--accent)_18%,transparent)]',
			invalid &&
				'border-[color-mix(in_oklch,var(--danger)_60%,var(--border))]! shadow-[0_0_0_3px_color-mix(in_oklch,var(--danger)_12%,transparent)]!',
			sizeClass,
			className
		]}
		data-invalid={invalid ? 'true' : undefined}
	>
		{@render leading?.()}
		<input
			bind:value
			class="min-w-0 flex-1 bg-transparent text-fg outline-none focus-visible:shadow-none placeholder:text-fg-subtle"
			{...rest}
		/>
		{@render trailing?.()}
	</div>
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

<style>
	input:-webkit-autofill {
		-webkit-text-fill-color: var(--fg);
		-webkit-box-shadow: 0 0 0 1000px var(--bg-input) inset;
		caret-color: var(--fg);
		transition: background-color 9999s ease-out 0s;
	}
</style>
