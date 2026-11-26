<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { tick } from 'svelte';
	import { Button, Dialog } from '$lib/components/ui';
	import { InputControl } from '$lib/components/ui/input';
	import Icon from '$lib/components/ui/icon/icon.svelte';
	import { glyphs } from '$lib/components/ui/icons';
	import { formCommand } from '$lib/ebirforms/form-command.styles';

	let { pages, current, onchange }: {
		pages: { id: string; title: string }[];
		current: string;
		onchange: (page: string) => void | Promise<void>;
	} = $props();

	const uid = $props.id();
	let open = $state(false);
	let query = $state('');
	let activeId = $state('');
	let results = $state<HTMLDivElement>();
	const currentNumber = $derived(pages.findIndex(page => page.id === current) + 1);
	const pageLabel = $derived(`Page ${currentNumber} of ${pages.length}`);
	const terms = $derived(query.trim().toLowerCase().split(/\s+/));
	const matches = $derived(pages.map((page, index) => ({ ...page, number: index + 1 })).filter(page =>
		terms.every(term => /^\d+$/.test(term)
			? Number(term) === page.number
			: `page ${page.title.toLowerCase()}`.includes(term))
	));
	const active = $derived(matches.find(page => page.id === activeId) ?? matches[0]);

	function openPicker() {
		query = '';
		activeId = '';
		open = true;
	}

	function focusSearch(node: HTMLElement) {
		void tick().then(() => { if (node.isConnected) node.focus(); });
	}

	async function selectPage(id: string) {
		open = false;
		await tick();
		await onchange(id);
	}

	function handleKeys(event: KeyboardEvent) {
		if (event.isComposing || !active) return;
		if (event.key === 'Enter') {
			event.preventDefault();
			void selectPage(active.id);
		} else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			const index = matches.findIndex(page => page.id === active.id);
			const direction = event.key === 'ArrowDown' ? 1 : -1;
			activeId = matches[(index + direction + matches.length) % matches.length].id;
			document.getElementById(`${uid}-${activeId}`)?.scrollIntoView({ block: 'nearest' });
		}
	}
</script>

{#if pages.length > 1}
	<Button variant="secondary" size="sm" aria-haspopup="dialog" aria-expanded={open}
		aria-label={`Find a page, ${pageLabel.toLowerCase()}`} onclick={openPicker}>
		{pageLabel}
		<span class="trigger-icon" data-icon aria-hidden="true"><Icon icon={glyphs.chevronDown} /></span>
	</Button>

	<Dialog bind:open layout="command" size="lg" hideCloseButton title="Go to page">
		{#if open}
			<div class={stylex.attrs(formCommand.root).class}>
				<div class={stylex.attrs(formCommand.searchHeader).class}>
					<div class={stylex.attrs(formCommand.searchField).class}>
						<span aria-hidden="true" class={stylex.attrs(formCommand.searchIcon).class}><Icon icon={glyphs.search} /></span>
						<InputControl
							{@attach focusSearch}
							bind:value={query}
							role="combobox"
							aria-label="Search pages"
							aria-autocomplete="list"
							aria-expanded="true"
							aria-controls={`${uid}-results`}
							aria-activedescendant={active ? `${uid}-${active.id}` : undefined}
							placeholder="Search pages…"
							autocomplete="off"
							class={stylex.attrs(formCommand.searchInput).class}
							oninput={() => {
								activeId = '';
								results?.scrollTo({ top: 0, behavior: 'instant' });
							}}
							onkeydown={handleKeys}
						/>
						<button type="button" class={stylex.attrs(formCommand.close).class} onclick={() => open = false}>Close</button>
					</div>
				</div>
				<div class={stylex.attrs(formCommand.resultHeading).class}>Pages</div>
				<div bind:this={results} class={stylex.attrs(formCommand.results).class}>
					<div id={`${uid}-results`} role="listbox" aria-label="Return pages">
						{#each matches as page (page.id)}
							<button type="button" id={`${uid}-${page.id}`} role="option" tabindex="-1"
								aria-current={current === page.id ? 'page' : undefined}
								aria-selected={active?.id === page.id}
								onclick={() => void selectPage(page.id)}
								class={stylex.attrs(formCommand.result).class}>
								<span class={['page-number', stylex.attrs(formCommand.resultTitle).class]}>Page {page.number} ·</span>
								<span>{page.title}</span>
							</button>
						{/each}
					</div>
					{#if matches.length === 0}
						<p role="status" class={stylex.attrs(formCommand.empty).class}>No matching pages</p>
					{/if}
				</div>
			</div>
		{/if}
	</Dialog>
{/if}

<style>
	.trigger-icon { display: block; inline-size: 1rem; block-size: 1rem; flex: none; }
	.page-number { flex: none; white-space: nowrap; }
</style>
