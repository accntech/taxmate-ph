<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tone = 'neutral' | 'accent' | 'success' | 'warn' | 'danger' | 'info';

	let {
		tone = 'neutral',
		size = 'md',
		class: className = '',
		children
	}: {
		tone?: Tone;
		size?: 'sm' | 'md';
		class?: string;
		children?: Snippet;
	} = $props();

	const toneClass: Record<Tone, string> = {
		neutral: 'border-border bg-bg-elev-2 text-fg-muted',
		accent: 'border-accent/25 bg-accent-soft text-accent',
		success: 'border-success/25 bg-success-soft text-success',
		warn: 'border-warn/25 bg-warn-soft text-warn',
		danger: 'border-danger/25 bg-danger-soft text-danger',
		info: 'border-info/25 bg-info-soft text-info'
	};

	const sizeClass = $derived(size === 'sm' ? 'min-h-6 px-2 text-[11px]' : 'min-h-7 px-2.5 text-xs');
</script>

<span
	class={[
		'inline-flex w-fit items-center gap-1 rounded-md border font-semibold leading-none',
		'whitespace-nowrap',
		toneClass[tone],
		sizeClass,
		className
	]}
>
	{@render children?.()}
</span>
