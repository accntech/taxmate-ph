<script lang="ts">
	import { Badge, Button, Card, Dialog, Drawer, Input, Page, PageHeader, Select, Textarea, ToggleGroup } from '$lib/components/ui';
	import ArrowRight from '@solar-icons/svelte/category/arrows/Linear/ArrowRight.svelte';
	import CheckCircle from '@solar-icons/svelte/category/ui/Linear/CheckCircle.svelte';
	import InfoCircle from '@solar-icons/svelte/category/ui/Linear/InfoCircle.svelte';
	import DangerTriangle from '@solar-icons/svelte/category/ui/Linear/DangerTriangle.svelte';
	import Copy from '@solar-icons/svelte/category/ui/Linear/Copy.svelte';
	import Wallet from '@solar-icons/svelte/category/money/Linear/Wallet.svelte';

	type TokenRow = { token: string; note: string };

	const surfaces: TokenRow[] = [
		{ token: '--bg', note: 'App canvas' },
		{ token: '--bg-elev', note: 'Raised panel' },
		{ token: '--bg-elev-2', note: 'Inset / muted' },
		{ token: '--bg-hover', note: 'Hover fill' },
		{ token: '--bg-input', note: 'Field surface' },
		{ token: '--border', note: 'Hairline' },
		{ token: '--border-soft', note: 'Faint divider' }
	];
	const content: TokenRow[] = [
		{ token: '--fg', note: 'Primary text' },
		{ token: '--fg-muted', note: 'Secondary' },
		{ token: '--fg-subtle', note: 'Tertiary / hints' },
		{ token: '--fg-inverse', note: 'On accent' }
	];
	const accent: TokenRow[] = [
		{ token: '--accent', note: 'Single brand hue' },
		{ token: '--accent-hover', note: 'Pressed / hover' },
		{ token: '--accent-soft', note: 'Tinted backdrop' },
		{ token: '--accent-fg', note: 'Text on accent' }
	];
	const semantic: TokenRow[] = [
		{ token: '--success', note: 'Filed / valid' },
		{ token: '--warn', note: 'Needs review' },
		{ token: '--danger', note: 'Rejected / error' },
		{ token: '--info', note: 'Informational' }
	];

	const everyToken = [...surfaces, ...content, ...accent, ...semantic].map((row) => row.token);
	const extraTokens = ['--success-soft', '--warn-soft', '--danger-soft', '--info-soft'];

	let values = $state<Record<string, string>>({});
	let scheme = $state('light');
	let copied = $state('');
	let copyTimer: ReturnType<typeof setTimeout>;

	$effect(() => {
		const root = document.documentElement;
		const read = () => {
			const cs = getComputedStyle(root);
			const next: Record<string, string> = {};
			for (const token of [...everyToken, ...extraTokens]) {
				next[token] = cs.getPropertyValue(token).trim();
			}
			values = next;
			scheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
		};
		read();
		const observer = new MutationObserver(read);
		observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
		return () => observer.disconnect();
	});

	async function copyToken(token: string) {
		try {
			await navigator.clipboard.writeText(`var(${token})`);
			clearTimeout(copyTimer);
			copied = token;
			copyTimer = setTimeout(() => (copied = ''), 1400);
		} catch {
			copied = '';
		}
	}

	const typeScale = [
		{ cls: 'text-3xl font-semibold tracking-tight', label: 'Display', spec: '30 / 1.1' },
		{ cls: 'text-2xl font-semibold tracking-tight', label: 'Title', spec: '24 / 1.2' },
		{ cls: 'text-lg font-semibold', label: 'Section', spec: '18 / 1.4' },
		{ cls: 'text-sm leading-6', label: 'Body', spec: '14 / 1.7' },
		{ cls: 'text-xs font-medium uppercase tracking-wide text-fg-muted', label: 'Label', spec: '12 / caps' }
	];

	const ledger = [
		{ label: 'Sales — vatable', amount: 1_842_500.0 },
		{ label: 'Output VAT (12%)', amount: 221_100.0 },
		{ label: 'Input VAT — purchases', amount: -148_320.5 },
		{ label: 'VAT payable', amount: 72_779.5 }
	];
	const peso = new Intl.NumberFormat('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	const radii = [
		{ token: '--radius-panel', label: 'Panel', px: '8px' },
		{ token: '--radius-field', label: 'Field', px: '6px' }
	];
	const shadows = [
		{ token: '--shadow-ui-sm', label: 'Resting' },
		{ token: '--shadow-ui-md', label: 'Lifted' },
		{ token: '--shadow-ui-lg', label: 'Overlay' }
	];

	let period = $state('monthly');
	const periods = [
		{ value: 'monthly', label: 'Monthly', meta: 'Form 2550M' },
		{ value: 'quarterly', label: 'Quarterly', meta: 'Form 2550Q' },
		{ value: 'annual', label: 'Annual', meta: 'Form 1701' }
	];

	let density = $state('comfortable');
	const densities = [
		{ value: 'compact', label: 'Compact' },
		{ value: 'comfortable', label: 'Comfortable' },
		{ value: 'spacious', label: 'Spacious' }
	];

	let tin = $state('008-115-227-000');
	let notes = $state('');
	let dialogOpen = $state(false);
	let drawerOpen = $state(false);
</script>

{#snippet sectionHead(index: string, title: string, desc: string)}
	<div class="flex items-baseline gap-4 border-b border-border-soft pb-3">
		<span class="font-mono text-sm tabular-nums text-fg-subtle">{index}</span>
		<div class="min-w-0">
			<h2 class="text-lg font-semibold tracking-tight text-fg">{title}</h2>
			<p class="mt-0.5 text-sm text-fg-muted">{desc}</p>
		</div>
	</div>
{/snippet}

{#snippet swatch(row: TokenRow)}
	<button
		type="button"
		onclick={() => copyToken(row.token)}
		class="ds-swatch group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-field px-2 py-2 text-left outline-none hover:bg-bg-hover focus-visible:shadow-[0_0_0_3px_var(--ring)]"
	>
		<span
			class="size-9 shrink-0 rounded-field border border-border-soft"
			style="background: var({row.token})"
			aria-hidden="true"
		></span>
		<span class="min-w-0">
			<span class="flex items-center gap-1.5">
				<span class="truncate font-mono text-[13px] text-fg">{row.token}</span>
				{#if copied === row.token}
					<span class="font-mono text-[11px] text-accent">copied</span>
				{:else}
					<span class="text-fg-subtle opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
						<Copy size={13} color="currentColor" />
					</span>
				{/if}
			</span>
			<span class="flex items-center justify-between gap-2">
				<span class="shrink-0 text-xs text-fg-muted">{row.note}</span>
				<span
					class="max-w-[9.5rem] truncate font-mono text-[11px] tabular-nums text-fg-subtle"
					title={values[row.token] ?? ''}
				>
					{values[row.token] ?? ''}
				</span>
			</span>
		</span>
	</button>
{/snippet}

<svelte:head>
	<title>Design system · TaxMate PH</title>
	<meta name="description" content="The TaxMate PH design system: tokens, type, and components for Philippine BIR tax workspaces." />
</svelte:head>

<Page size="lg">
	<PageHeader
		eyebrow="Design system"
		title="A calm, precise system for tax work."
		description="The shared vocabulary behind TaxMate PH — one accent hue, tabular figures, and quiet surfaces tuned so numbers and compliance status stay legible from filing to export."
	>
		{#snippet icon()}
			<CheckCircle size={22} color="currentColor" />
		{/snippet}
		{#snippet actions()}
			<Badge tone="neutral" class="font-mono">
				{scheme === 'dark' ? 'dark scheme' : 'light scheme'}
			</Badge>
		{/snippet}
	</PageHeader>

	<!-- 01 · Color -->
	<section class="grid gap-5">
		{@render sectionHead('01', 'Color', 'Surfaces stay quiet so a single accent and the status hues carry meaning. Values are live — click any token to copy.')}
		<div class="grid gap-4 lg:grid-cols-2">
			<Card variant="panel" padding="md" class="grid gap-1">
				<p class="px-2 pb-1 font-mono text-[11px] uppercase tracking-wide text-fg-subtle">Surfaces &amp; lines</p>
				{#each surfaces as row (row.token)}
					{@render swatch(row)}
				{/each}
			</Card>
			<Card variant="panel" padding="md" class="grid gap-1">
				<p class="px-2 pb-1 font-mono text-[11px] uppercase tracking-wide text-fg-subtle">Content</p>
				{#each content as row (row.token)}
					{@render swatch(row)}
				{/each}
			</Card>
			<Card variant="panel" padding="md" class="grid gap-1">
				<p class="px-2 pb-1 font-mono text-[11px] uppercase tracking-wide text-fg-subtle">Accent</p>
				{#each accent as row (row.token)}
					{@render swatch(row)}
				{/each}
			</Card>
			<Card variant="panel" padding="md" class="grid content-start gap-2">
				<p class="px-2 font-mono text-[11px] uppercase tracking-wide text-fg-subtle">Status</p>
				<div class="grid gap-2">
					{#each semantic as row (row.token)}
						<div class="flex items-center justify-between gap-3 rounded-field px-2 py-1.5">
							<span class="flex items-center gap-2.5">
								<span class="size-3.5 rounded-full" style="background: var({row.token})" aria-hidden="true"></span>
								<span class="font-mono text-[13px] text-fg">{row.token}</span>
							</span>
							<span class="text-xs text-fg-muted">{row.note}</span>
						</div>
					{/each}
				</div>
			</Card>
		</div>
	</section>

	<!-- 02 · Typography & figures -->
	<section class="grid gap-5">
		{@render sectionHead('02', 'Type & figures', 'Geist for prose, a monospaced face for every number. Amounts use tabular figures so columns stay aligned to the centavo.')}
		<div class="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
			<Card variant="panel" padding="lg" class="grid gap-5">
				{#each typeScale as step (step.label)}
					<div class="grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-4">
						<span class="font-mono text-[11px] uppercase tracking-wide text-fg-subtle">
							{step.label}<br /><span class="tabular-nums normal-case text-fg-subtle/70">{step.spec}</span>
						</span>
						<span class={['truncate text-fg', step.cls]}>Quarterly VAT return</span>
					</div>
				{/each}
			</Card>
			<Card variant="muted" padding="lg" class="grid content-start gap-3">
				<div class="flex items-center justify-between">
					<span class="font-mono text-[11px] uppercase tracking-wide text-fg-subtle">Tabular figures</span>
					<Badge tone="info" size="sm">2550Q</Badge>
				</div>
				<dl class="grid gap-2">
					{#each ledger as line (line.label)}
						<div class="flex items-baseline justify-between gap-4 {line.label === 'VAT payable' ? 'mt-1 border-t border-border pt-2.5' : ''}">
							<dt class="text-sm text-fg-muted">{line.label}</dt>
							<dd
								class={[
									'font-mono text-sm tabular-nums',
									line.label === 'VAT payable' ? 'font-semibold text-fg' : 'text-fg',
									line.amount < 0 && 'text-danger'
								]}
							>
								{line.amount < 0 ? '(' : ''}₱{peso.format(Math.abs(line.amount))}{line.amount < 0 ? ')' : ''}
							</dd>
						</div>
					{/each}
				</dl>
			</Card>
		</div>
	</section>

	<!-- 03 · Form, radius, motion -->
	<section class="grid gap-5">
		{@render sectionHead('03', 'Shape & motion', 'Two radii, three elevations, and one easing curve. Restraint keeps the interface feeling engineered, not decorated.')}
		<div class="grid gap-4 md:grid-cols-3">
			<Card variant="panel" padding="lg" class="grid content-start gap-4">
				<p class="font-mono text-[11px] uppercase tracking-wide text-fg-subtle">Radius</p>
				{#each radii as r (r.token)}
					<div class="flex items-center gap-3">
						<span class="size-12 border border-border bg-bg-elev-2" style="border-radius: var({r.token})" aria-hidden="true"></span>
						<span class="grid">
							<span class="text-sm text-fg">{r.label}</span>
							<span class="font-mono text-[11px] tabular-nums text-fg-subtle">{r.token} · {r.px}</span>
						</span>
					</div>
				{/each}
			</Card>
			<Card variant="panel" padding="lg" class="grid content-start gap-4">
				<p class="font-mono text-[11px] uppercase tracking-wide text-fg-subtle">Elevation</p>
				{#each shadows as s (s.token)}
					<div class="flex items-center gap-3">
						<span class="size-12 rounded-field bg-bg-elev" style="box-shadow: var({s.token})" aria-hidden="true"></span>
						<span class="grid">
							<span class="text-sm text-fg">{s.label}</span>
							<span class="font-mono text-[11px] text-fg-subtle">{s.token}</span>
						</span>
					</div>
				{/each}
			</Card>
			<Card variant="panel" padding="lg" class="grid content-start gap-4">
				<p class="font-mono text-[11px] uppercase tracking-wide text-fg-subtle">Motion</p>
				<div class="ds-motion grid gap-1.5">
					<span class="h-2.5 w-full rounded-full bg-bg-elev-2">
						<span class="ds-motion-fill block h-full rounded-full bg-accent"></span>
					</span>
					<span class="text-xs text-fg-muted">Hover the card — 150ms entrance.</span>
				</div>
				<p class="font-mono text-[11px] leading-5 text-fg-subtle">
					--ease-ui<br />cubic-bezier(0.2, 0, 0, 1)
				</p>
			</Card>
		</div>
	</section>

	<!-- 04 · Components -->
	<section class="grid gap-5">
		{@render sectionHead('04', 'Components', 'Buttons, badges, fields, and overlays — the building blocks every workspace shares.')}

		<Card variant="panel" padding="lg" class="grid gap-4">
			<p class="font-mono text-[11px] uppercase tracking-wide text-fg-subtle">Buttons</p>
			<div class="flex flex-wrap items-center gap-2.5">
				<Button>Save return</Button>
				<Button variant="secondary">Cancel</Button>
				<Button variant="ghost">Discard draft</Button>
				<Button variant="danger">Reject filing</Button>
				<Button variant="warn">Needs review</Button>
				<Button size="sm" variant="secondary">Small</Button>
				<Button disabled>Submitting…</Button>
				<Button variant="secondary">
					Export savefile
					<ArrowRight size={16} color="currentColor" />
				</Button>
			</div>
		</Card>

		<div class="grid gap-4 lg:grid-cols-2">
			<Card variant="panel" padding="lg" class="grid content-start gap-4">
				<p class="font-mono text-[11px] uppercase tracking-wide text-fg-subtle">Badges</p>
				<div class="flex flex-wrap gap-2">
					<Badge tone="success"><CheckCircle size={13} color="currentColor" />Filed</Badge>
					<Badge tone="warn"><DangerTriangle size={13} color="currentColor" />Needs review</Badge>
					<Badge tone="danger">Rejected</Badge>
					<Badge tone="info"><InfoCircle size={13} color="currentColor" />Draft</Badge>
					<Badge tone="accent">2550Q</Badge>
					<Badge tone="neutral">Saved locally</Badge>
				</div>
			</Card>
			<Card variant="panel" padding="lg" class="grid content-start gap-4">
				<p class="font-mono text-[11px] uppercase tracking-wide text-fg-subtle">Toggle &amp; select</p>
				<ToggleGroup bind:value={density} options={densities} ariaLabel="Row density" />
				<Select bind:value={period} options={periods} label="Filing period" />
			</Card>
		</div>

		<Card variant="panel" padding="lg" class="grid gap-4">
			<p class="font-mono text-[11px] uppercase tracking-wide text-fg-subtle">Fields</p>
			<div class="grid gap-4 md:grid-cols-2">
				<Input bind:value={tin} label="Taxpayer TIN" help="9 or 12 digits, branch code optional." />
				<Input value="0.00" label="Amount due" help="Pesos and centavos.">
					{#snippet leading()}
						<span class="text-fg-subtle"><Wallet size={16} color="currentColor" /></span>
					{/snippet}
					{#snippet trailing()}
						<span class="font-mono text-xs text-fg-subtle">PHP</span>
					{/snippet}
				</Input>
				<Input value="not-an-email" label="Email" invalid help="Enter a valid email address." />
				<Textarea bind:value={notes} label="Reviewer notes" placeholder="Optional remarks for this filing…" />
			</div>
		</Card>

		<Card variant="muted" padding="lg" class="flex flex-wrap items-center justify-between gap-4">
			<div class="grid gap-1">
				<p class="font-mono text-[11px] uppercase tracking-wide text-fg-subtle">Overlays</p>
				<p class="text-sm text-fg-muted">Dialogs confirm; drawers hold context beside the work.</p>
			</div>
			<div class="flex gap-2.5">
				<Button variant="secondary" onclick={() => (dialogOpen = true)}>Open dialog</Button>
				<Button variant="secondary" onclick={() => (drawerOpen = true)}>Open drawer</Button>
			</div>
		</Card>
	</section>
</Page>

<Dialog
	bind:open={dialogOpen}
	title="Submit 2550Q for filing?"
	description="This generates the savefile and marks the return as filed. You can still export a printout afterward."
>
	<p class="text-sm leading-6 text-fg-muted">
		The taxpayer record and validation status will be locked to this period once submitted.
	</p>
	{#snippet footer()}
		<Button variant="secondary" onclick={() => (dialogOpen = false)}>Cancel</Button>
		<Button onclick={() => (dialogOpen = false)}>Submit filing</Button>
	{/snippet}
</Dialog>

<Drawer bind:open={drawerOpen} title="Validation log" description="Checks run against the active return.">
	<div class="grid gap-3 p-5">
		<div class="flex items-center gap-2.5 text-sm text-fg">
			<span class="text-success"><CheckCircle size={16} color="currentColor" /></span>
			TIN format valid
		</div>
		<div class="flex items-center gap-2.5 text-sm text-fg">
			<span class="text-success"><CheckCircle size={16} color="currentColor" /></span>
			Output VAT recomputed
		</div>
		<div class="flex items-center gap-2.5 text-sm text-fg">
			<span class="text-warn"><DangerTriangle size={16} color="currentColor" /></span>
			Input VAT exceeds 70% cap — review
		</div>
	</div>
	{#snippet footer()}
		<Button variant="secondary" onclick={() => (drawerOpen = false)}>Close</Button>
	{/snippet}
</Drawer>

<style>
	.ds-swatch {
		transition: background-color 150ms var(--ease-ui);
	}

	.ds-motion-fill {
		width: 100%;
		transform: scaleX(0.08);
		transform-origin: left;
		transition: transform 150ms var(--ease-ui);
	}

	.ds-motion:hover .ds-motion-fill,
	.ds-motion:focus-within .ds-motion-fill {
		transform: scaleX(1);
	}

	@media (prefers-reduced-motion: reduce) {
		.ds-motion-fill {
			transition: none;
		}
	}
</style>
