<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { formCommand } from './form-command.styles';
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

<div class={stylex.attrs(formCommand.root).class}>
	<div class={stylex.attrs(formCommand.searchHeader).class}>
		<div class={stylex.attrs(formCommand.searchField).class}>
			<span class={stylex.attrs(formCommand.searchIcon).class}><Icon icon={glyphs.search} /></span>
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
				class={stylex.attrs(formCommand.searchInput).class}
				{disabled}
				oninput={() => activeCode = ''}
				{onkeydown}
			/>
			<button type="button" aria-label="Close" onclick={oncancel} class={stylex.attrs(formCommand.close).class}>esc</button>
		</div>
	</div>
	<div class={stylex.attrs(formCommand.resultHeading).class}>
		<span class={stylex.attrs(formCommand.heading).class}>Forms</span>
		<span class={stylex.attrs(formCommand.taxpayer).class} title={taxpayerName}>{taxpayerName}</span>
	</div>
	<div id={`${uid}-results`} role="listbox" aria-label="BIR forms" class={stylex.attrs(formCommand.results).class}>
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
				class={stylex.attrs(formCommand.result).class}
			>
				<span class={stylex.attrs(formCommand.resultIcon).class}><span class={stylex.attrs(formCommand.icon).class}><Icon icon={glyphs.layers} /></span></span>
				<span class={stylex.attrs(formCommand.resultText).class}>
					<span class={stylex.attrs(formCommand.resultTitle).class}>BIR Form {form.code}</span>
					<span class={stylex.attrs(formCommand.resultDescription).class}>{form.title}</span>
				</span>
				<span class={stylex.attrs(formCommand.category).class}>{form.status !== 'ready' ? 'Coming soon' : form.category}</span>
			</button>
		{/each}
		{#if matches.length === 0}
			<div class={stylex.attrs(formCommand.empty).class}>
				<p class={stylex.attrs(formCommand.resultTitle).class}>No matching forms</p>
				<p class={stylex.attrs(formCommand.hint).class}>Try another form number, title, or category.</p>
			</div>
		{/if}
	</div>
	{#if status}<p role="alert" class={stylex.attrs(formCommand.status).class}>{status}</p>{/if}
	<div class={stylex.attrs(formCommand.footer).class}>
		<div class={stylex.attrs(formCommand.footerStatus).class}>
			<Button variant="ghost" size="sm" onclick={oncancel}>Cancel</Button>
			<p role="status" class={stylex.attrs(formCommand.hint).class}>{matches.length} {matches.length === 1 ? 'form' : 'forms'} found</p>
		</div>
		<div class={stylex.attrs(formCommand.footerActions).class}>
			<span class={stylex.attrs(formCommand.navigationHint).class}><kbd>↑</kbd><kbd>↓</kbd><span class={stylex.attrs(formCommand.navigationLabel).class}>Navigate</span></span>
			<Button variant="secondary" size="sm" disabled={disabled || !active} onclick={() => { if (active) select(active.code); }}>Create return <kbd aria-hidden="true">↵</kbd></Button>
		</div>
	</div>
</div>

<style>
	kbd { border: 1px solid var(--border); border-radius: 3px; padding: 1px 4px; font-family: inherit; font-size: 11px; line-height: 1.2; color: var(--fg-muted); }
</style>
