<script lang="ts">
	import { tick } from 'svelte';
	import type { FormSummary } from '$lib/forms';
	import { Button } from '$lib/components/ui';
	import { InputControl } from '$lib/components/ui/input';
	import Icon from '$lib/components/ui/icon/icon.svelte';
	import { glyphs } from '$lib/components/ui/icons';

	let { forms, disabled = false, taxpayerName = '', status = '', oncancel, onselect }: {
		forms: FormSummary[];
		taxpayerName?: string;
		status?: string;
		oncancel: () => void;
		disabled?: boolean;
		onselect: (code: string) => void;
	} = $props();
	const uid = $props.id();
	let query = $state('');
	let activeCode = $state('');
	const matches = $derived(forms.filter(form => {
		const text = `BIR Form ${form.code} ${form.title} ${form.category}`.toLowerCase();
		return query.trim().toLowerCase().split(/\s+/).every(word => text.includes(word));
	}));
	const available = $derived(matches.filter(form => form.status === 'ready'));
	const active = $derived(available.find(form => form.code === activeCode) ?? available[0]);

	function focusSearch(node: HTMLElement) {
		void tick().then(() => { if (node.isConnected) node.focus(); });
	}
	function select(code: string) {
		if (!disabled && available.some(form => form.code === code)) onselect(code);
	}
	function onkeydown(event: KeyboardEvent) {
		if (event.isComposing) return;
		if (event.key === 'Enter') {
			event.preventDefault();
			if (active) select(active.code);
		} else if (['ArrowDown', 'ArrowUp'].includes(event.key) && available.length) {
			event.preventDefault();
			const index = available.findIndex(form => form.code === active?.code);
			const next = (index + (event.key === 'ArrowDown' ? 1 : -1) + available.length) % available.length;
			activeCode = available[next].code;
			void tick().then(() => document.getElementById(`${uid}-${activeCode}`)?.scrollIntoView({ block: 'nearest' }));
		}
	}
</script>

<div class="flex min-h-0 flex-col">
	<div class="shrink-0 border-b border-border-soft p-3">
		<div class="relative">
			<span class="pointer-events-none absolute inset-y-0 left-3 flex w-5 items-center text-fg-muted"><Icon icon={glyphs.search} /></span>
			<InputControl
				{@attach focusSearch}
				bind:value={query}
				role="combobox"
				aria-label="Search BIR forms"
				aria-autocomplete="list"
				aria-expanded="true"
				aria-controls={`${uid}-results`}
				aria-activedescendant={active ? `${uid}-${active.code}` : undefined}
				placeholder="Search BIR forms…"
				autocomplete="off"
				class="h-11 border-transparent bg-transparent pl-10 pr-14 shadow-none"
				{disabled}
				oninput={() => activeCode = ''}
				{onkeydown}
			/>
			<button type="button" aria-label="Close" onclick={oncancel} class="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 text-[11px] text-fg-muted hover:bg-bg-hover">esc</button>
		</div>
	</div>
	<div class="flex min-w-0 shrink-0 items-center justify-between gap-4 px-5 pb-2 pt-4 text-xs text-fg-muted">
		<span class="shrink-0 font-medium">Forms</span>
		<span class="truncate" title={taxpayerName}>{taxpayerName}</span>
	</div>
	<div id={`${uid}-results`} role="listbox" aria-label="BIR forms" class="h-40 min-h-0 max-h-[45dvh] overflow-y-auto px-2 pb-2 sm:h-56">
		{#each matches as form (form.code)}
			<button
				id={`${uid}-${form.code}`}
				type="button"
				role="option"
				aria-selected={active?.code === form.code}
				disabled={disabled || form.status !== 'ready'}
				tabindex="-1"
				onpointermove={() => { if (form.status === 'ready') activeCode = form.code; }}
				onclick={() => select(form.code)}
				class="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left transition-colors hover:bg-bg-hover aria-selected:bg-bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
			>
				<span class="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-bg-elev text-accent"><span class="size-5"><Icon icon={glyphs.layers} /></span></span>
				<span class="grid min-w-0 flex-1 gap-1">
					<span class="text-sm font-medium">BIR Form {form.code}</span>
					<span class="text-xs leading-relaxed text-fg-muted">{form.title}</span>
				</span>
				<span class="hidden max-w-28 shrink-0 text-right text-xs text-fg-muted sm:block">{form.status !== 'ready' ? 'Coming soon' : form.category}</span>
			</button>
		{/each}
		{#if matches.length === 0}
			<div class="grid min-h-40 content-center gap-2 p-4 text-center sm:min-h-56">
				<p class="text-sm font-medium">No matching forms</p>
				<p class="text-xs text-fg-muted">Try another form number, title, or category.</p>
			</div>
		{/if}
	</div>
	{#if status}<p role="alert" class="shrink-0 px-5 pb-3 text-xs text-danger">{status}</p>{/if}
	<div class="flex shrink-0 items-center justify-between gap-3 border-t border-border-soft bg-bg px-3 py-2">
		<div class="flex min-w-0 items-center gap-3">
			<Button variant="ghost" size="sm" onclick={oncancel}>Cancel</Button>
			<p role="status" class="text-xs text-fg-muted">{matches.length} {matches.length === 1 ? 'form' : 'forms'} found</p>
		</div>
		<div class="flex shrink-0 items-center gap-3">
			<span class="hidden items-center gap-1 text-xs text-fg-muted sm:flex"><kbd>↑</kbd><kbd>↓</kbd><span class="ml-1">Navigate</span></span>
			<Button variant="secondary" size="sm" disabled={disabled || !active} onclick={() => { if (active) select(active.code); }}>Create return <kbd aria-hidden="true">↵</kbd></Button>
		</div>
	</div>
</div>

<style>
	kbd { border: 1px solid var(--border); border-radius: 3px; padding: 1px 4px; font-family: inherit; font-size: 11px; line-height: 1.2; color: var(--fg-muted); }
</style>
