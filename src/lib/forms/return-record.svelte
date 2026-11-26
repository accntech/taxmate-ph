<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import { Button } from '$lib/components/ui';
	import { Sheet } from '$lib/components/ui/sheet';

	type Values = Record<string, string>;
	type Write = (patch: Values) => void;
	let { title, item, label, action, values, onapply, fields }: {
		title: string;
		item: string;
		label?: string;
		action: string;
		values: Values;
		onapply: Write;
		fields: Snippet<[source: Values, write: Write]>;
	} = $props();

	const headingId = $props.id();
	let open = $state(false);
	let draft = $state<Values>({});
	let trigger: HTMLElement | undefined;
	const source = $derived({ ...values, ...draft });

	async function show(control?: HTMLElement, fieldId?: string) {
		trigger = control;
		draft = {};
		open = true;
		await tick();
		const body = document.getElementById(`${headingId}-fields`);
		const dialog = body?.closest('dialog');
		if (!dialog) return;
		await Promise.all(dialog.getAnimations().map(animation => animation.finished.catch(() => {})));
		const field = fieldId ? document.getElementById(fieldId) :
			body?.querySelector<HTMLElement>('input:not([type="hidden"]):not(:disabled), [role="combobox"]:not([aria-disabled="true"])');
		if (open && dialog.open) field?.focus({ preventScroll: true });
	}

	function close() {
		if (!open) return;
		const control = trigger;
		open = false;
		draft = {};
		void tick().then(() => (control?.isConnected ? control : document.getElementById(`${headingId}-action`))?.focus());
	}

	export async function revealField(id: string) {
		await show(document.getElementById(`${headingId}-action`) ?? undefined, id);
	}
</script>

<section class="return-record" aria-labelledby={headingId}>
	<header>
		<h3 id={headingId}>{title}</h3>
		<Button id={`${headingId}-action`} size="sm" variant="secondary" aria-haspopup="dialog"
			onclick={(event) => void show(event.currentTarget)}>{action}</Button>
	</header>
	{#if label}
		<div class="record-row">
			<span class="paper-item-number">{item}</span>
			<button type="button" class="record-label" aria-haspopup="dialog" onclick={(event) => void show(event.currentTarget)}>
				{label}
			</button>
		</div>
	{/if}
</section>

<Sheet bind:open={() => open, (next) => { if (!next) close(); }} {title}>
	{#if open}
		<div id={`${headingId}-fields`} class="record-fields">
			{@render fields(source, (patch) => Object.assign(draft, patch))}
		</div>
	{/if}
	{#snippet footer()}
		<div class="record-actions">
			<Button variant="secondary" onclick={close}>Cancel</Button>
			<Button onclick={() => {
				onapply(draft);
				close();
			}}>Update</Button>
		</div>
	{/snippet}
</Sheet>

<style>
	.return-record { border-block-end: 1px solid var(--border-soft); }
	header, .record-row { display: grid; align-items: center; gap: .5rem; padding-inline: .875rem; }
	header { grid-template-columns: minmax(0, 1fr) auto; padding-block: .5rem; }
	h3 { margin: 0; font-size: .875rem; font-weight: 650; }
	.record-row {
		grid-template-columns: minmax(2rem, max-content) minmax(0, 1fr);
		padding-block: .125rem;
		border-block-start: 1px solid var(--border-soft);
	}
	.paper-item-number { white-space: nowrap; }
	.record-label {
		min-block-size: 2rem;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--accent);
		font: inherit;
		font-size: .875rem;
		text-align: start;
		text-decoration: underline;
		text-underline-offset: .15em;
		overflow-wrap: anywhere;
		cursor: pointer;
	}
	.record-label:hover { text-decoration-thickness: 2px; }
	.record-fields { display: grid; gap: .875rem; padding: 1rem; }
	.record-actions { display: flex; flex-wrap: wrap; justify-content: end; gap: .5rem; }
</style>
