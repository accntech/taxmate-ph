<script lang="ts">
	import * as stylex from "@stylexjs/stylex";
	import { designSystem } from "./design-system.styles";
	import { Badge, Button, Card, Dialog, Drawer, Input, TinInput, CurrencyInput, NumberInput, Page, PageHeader, Select, Textarea, ToggleGroup } from '$lib/components/ui';
	import ArrowRight from '@solar-icons/svelte/category/arrows/Linear/ArrowRight.svelte';
	import CheckCircle from '@solar-icons/svelte/category/ui/Linear/CheckCircle.svelte';
	import InfoCircle from '@solar-icons/svelte/category/ui/Linear/InfoCircle.svelte';
	import DangerTriangle from '@solar-icons/svelte/category/ui/Linear/DangerTriangle.svelte';
	import Copy from '@solar-icons/svelte/category/ui/Linear/Copy.svelte';

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
		{ style: designSystem.displayType, label: 'Display', spec: '30 / 1.1' },
		{ style: designSystem.headingType, label: 'Title', spec: '24 / 1.2' },
		{ style: designSystem.sectionType, label: 'Section', spec: '18 / 1.4' },
		{ style: designSystem.bodyType, label: 'Body', spec: '14 / 1.7' },
		{ style: designSystem.labelType, label: 'Label', spec: '12 / caps' }
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
	<div class={stylex.attrs(designSystem.sectionHeading).class}>
		<span class={stylex.attrs(designSystem.sectionIndex).class}>{index}</span>
		<div class={stylex.attrs(designSystem.shrinkable).class}>
			<h2 class={stylex.attrs(designSystem.sectionTitle).class}>{title}</h2>
			<p class={stylex.attrs(designSystem.sectionDescription).class}>{desc}</p>
		</div>
	</div>
{/snippet}

{#snippet swatch(row: TokenRow)}
	<button
		type="button"
		onclick={() => copyToken(row.token)}
		class={['ds-swatch', stylex.attrs(designSystem.swatch).class]}
	>
		<span
			class={stylex.attrs(designSystem.swatchColor).class}
			style="background: var({row.token})"
			aria-hidden="true"
		></span>
		<span class={stylex.attrs(designSystem.shrinkable).class}>
			<span class={stylex.attrs(designSystem.tokenHeading).class}>
				<span class={stylex.attrs(designSystem.tokenName).class}>{row.token}</span>
				{#if copied === row.token}
					<span class={stylex.attrs(designSystem.copyConfirmation).class}>copied</span>
				{:else}
					<span class={["copy-icon", stylex.attrs(designSystem.copyIcon).class]} aria-hidden="true">
						<Copy size={13} color="currentColor" />
					</span>
				{/if}
			</span>
			<span class={stylex.attrs(designSystem.tokenDetails).class}>
				<span class={stylex.attrs(designSystem.tokenNote).class}>{row.note}</span>
				<span
					class={stylex.attrs(designSystem.tokenValue).class}
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
			<Badge tone="neutral" class={stylex.attrs(designSystem.monospace).class}>
				{scheme === 'dark' ? 'dark scheme' : 'light scheme'}
			</Badge>
		{/snippet}
	</PageHeader>

	<!-- 01 · Color -->
	<section class={stylex.attrs(designSystem.section).class}>
		{@render sectionHead('01', 'Color', 'Surfaces stay quiet so a single accent and the status hues carry meaning. Values are live — click any token to copy.')}
		<div class={stylex.attrs(designSystem.colorGrid).class}>
			<Card variant="panel" padding="md" class={stylex.attrs(designSystem.tokenPanel).class}>
				<p class={stylex.attrs(designSystem.panelLabel).class}>Surfaces &amp; lines</p>
				{#each surfaces as row (row.token)}
					{@render swatch(row)}
				{/each}
			</Card>
			<Card variant="panel" padding="md" class={stylex.attrs(designSystem.tokenPanel).class}>
				<p class={stylex.attrs(designSystem.panelLabel).class}>Content</p>
				{#each content as row (row.token)}
					{@render swatch(row)}
				{/each}
			</Card>
			<Card variant="panel" padding="md" class={stylex.attrs(designSystem.tokenPanel).class}>
				<p class={stylex.attrs(designSystem.panelLabel).class}>Accent</p>
				{#each accent as row (row.token)}
					{@render swatch(row)}
				{/each}
			</Card>
			<Card variant="panel" padding="md" class={stylex.attrs(designSystem.statusPanel).class}>
				<p class={stylex.attrs(designSystem.statusHeading).class}>Status</p>
				<div class={stylex.attrs(designSystem.statusList).class}>
					{#each semantic as row (row.token)}
						<div class={stylex.attrs(designSystem.statusRow).class}>
							<span class={stylex.attrs(designSystem.inlineLabel).class}>
								<span class={stylex.attrs(designSystem.statusDot).class} style="background: var({row.token})" aria-hidden="true"></span>
								<span class={stylex.attrs(designSystem.statusToken).class}>{row.token}</span>
							</span>
							<span class={stylex.attrs(designSystem.hint).class}>{row.note}</span>
						</div>
					{/each}
				</div>
			</Card>
		</div>
	</section>

	<!-- 02 · Typography & figures -->
	<section class={stylex.attrs(designSystem.section).class}>
		{@render sectionHead('02', 'Type & figures', 'Geist for prose, a monospaced face for every number. Amounts use tabular figures so columns stay aligned to the centavo.')}
		<div class={stylex.attrs(designSystem.typeGrid).class}>
			<Card variant="panel" padding="lg" class={stylex.attrs(designSystem.section).class}>
				{#each typeScale as step (step.label)}
					<div class={stylex.attrs(designSystem.typeRow).class}>
						<span class={stylex.attrs(designSystem.specimenLabel).class}>
							{step.label}<br /><span class={stylex.attrs(designSystem.typeSpec).class}>{step.spec}</span>
						</span>
						<span class={stylex.attrs(designSystem.specimenText, step.style).class}>Quarterly VAT return</span>
					</div>
				{/each}
			</Card>
			<Card variant="muted" padding="lg" class={stylex.attrs(designSystem.ledgerPanel).class}>
				<div class={stylex.attrs(designSystem.ledgerHeading).class}>
					<span class={stylex.attrs(designSystem.specimenLabel).class}>Tabular figures</span>
					<Badge tone="info" size="sm">2550Q</Badge>
				</div>
				<dl class={stylex.attrs(designSystem.statusList).class}>
					{#each ledger as line (line.label)}
						<div class={stylex.attrs(designSystem.ledgerRow, line.label === 'VAT payable' && designSystem.ledgerTotal).class}>
							<dt class={stylex.attrs(designSystem.bodyMuted).class}>{line.label}</dt>
							<dd
								class={[
									stylex.attrs(designSystem.ledgerAmount, line.label === 'VAT payable' && designSystem.emphasized, line.amount < 0 && designSystem.negative).class
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
	<section class={stylex.attrs(designSystem.section).class}>
		{@render sectionHead('03', 'Shape & motion', 'Two radii, three elevations, and one easing curve. Restraint keeps the interface feeling engineered, not decorated.')}
		<div class={stylex.attrs(designSystem.shapeGrid).class}>
			<Card variant="panel" padding="lg" class={stylex.attrs(designSystem.specimenPanel).class}>
				<p class={stylex.attrs(designSystem.specimenLabel).class}>Radius</p>
				{#each radii as r (r.token)}
					<div class={stylex.attrs(designSystem.shapeRow).class}>
						<span class={stylex.attrs(designSystem.radiusSample).class} style="border-radius: var({r.token})" aria-hidden="true"></span>
						<span class={stylex.attrs(designSystem.shapeDetails).class}>
							<span class={stylex.attrs(designSystem.body).class}>{r.label}</span>
							<span class={stylex.attrs(designSystem.radiusSpec).class}>{r.token} · {r.px}</span>
						</span>
					</div>
				{/each}
			</Card>
			<Card variant="panel" padding="lg" class={stylex.attrs(designSystem.specimenPanel).class}>
				<p class={stylex.attrs(designSystem.specimenLabel).class}>Elevation</p>
				{#each shadows as s (s.token)}
					<div class={stylex.attrs(designSystem.shapeRow).class}>
						<span class={stylex.attrs(designSystem.elevationSample).class} style="box-shadow: var({s.token})" aria-hidden="true"></span>
						<span class={stylex.attrs(designSystem.shapeDetails).class}>
							<span class={stylex.attrs(designSystem.body).class}>{s.label}</span>
							<span class={stylex.attrs(designSystem.elevationSpec).class}>{s.token}</span>
						</span>
					</div>
				{/each}
			</Card>
			<Card variant="panel" padding="lg" class={stylex.attrs(designSystem.specimenPanel).class}>
				<p class={stylex.attrs(designSystem.specimenLabel).class}>Motion</p>
				<div class={['ds-motion', stylex.attrs(designSystem.motionSample).class]}>
					<span class={stylex.attrs(designSystem.motionTrack).class}>
						<span class={['ds-motion-fill', stylex.attrs(designSystem.motionFill).class]}></span>
					</span>
					<span class={stylex.attrs(designSystem.hint).class}>Hover the card — 150ms entrance.</span>
				</div>
				<p class={stylex.attrs(designSystem.motionSpec).class}>
					--ease-ui<br />cubic-bezier(0.2, 0, 0, 1)
				</p>
			</Card>
		</div>
	</section>

	<!-- 04 · Components -->
	<section class={stylex.attrs(designSystem.section).class}>
		{@render sectionHead('04', 'Components', 'Buttons, badges, fields, and overlays — the building blocks every workspace shares.')}

		<Card variant="panel" padding="lg" class={stylex.attrs(designSystem.componentPanel).class}>
			<p class={stylex.attrs(designSystem.specimenLabel).class}>Buttons</p>
			<div class={stylex.attrs(designSystem.buttonSamples).class}>
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

		<div class={stylex.attrs(designSystem.colorGrid).class}>
			<Card variant="panel" padding="lg" class={stylex.attrs(designSystem.specimenPanel).class}>
				<p class={stylex.attrs(designSystem.specimenLabel).class}>Badges</p>
				<div class={stylex.attrs(designSystem.badgeSamples).class}>
					<Badge tone="success"><CheckCircle size={13} color="currentColor" />Filed</Badge>
					<Badge tone="warn"><DangerTriangle size={13} color="currentColor" />Needs review</Badge>
					<Badge tone="danger">Rejected</Badge>
					<Badge tone="info"><InfoCircle size={13} color="currentColor" />Draft</Badge>
					<Badge tone="accent">2550Q</Badge>
					<Badge tone="neutral">Saved locally</Badge>
				</div>
			</Card>
			<Card variant="panel" padding="lg" class={stylex.attrs(designSystem.specimenPanel).class}>
				<p class={stylex.attrs(designSystem.specimenLabel).class}>Toggle &amp; select</p>
				<ToggleGroup bind:value={density} options={densities} ariaLabel="Row density" />
				<Select bind:value={period} options={periods} label="Filing period" />
			</Card>
		</div>

		<Card variant="panel" padding="lg" class={stylex.attrs(designSystem.componentPanel).class}>
			<p class={stylex.attrs(designSystem.specimenLabel).class}>Fields</p>
			<div class={stylex.attrs(designSystem.fieldSamples).class}>
				<TinInput bind:value={tin} label="TIN and branch code" help="9 TIN digits and a 5-digit branch code." />
				<CurrencyInput value="0.00" label="Amount due" help="Pesos and centavos." />
				<CurrencyInput value="1234.56" label="Calculated withholding" readonly help="Calculated amounts remain read-only." />
				<NumberInput value="0" label="Sheets attached" min={0} help="Whole numbers only." />
				<Input type="email" value="not-an-email" label="Email" invalid help="Enter a valid email address." />
				<Textarea bind:value={notes} label="Reviewer notes" placeholder="Optional remarks for this filing…" />
			</div>
		</Card>

		<Card variant="muted" padding="lg" class={stylex.attrs(designSystem.overlayPanel).class}>
			<div class={stylex.attrs(designSystem.tokenPanel).class}>
				<p class={stylex.attrs(designSystem.specimenLabel).class}>Overlays</p>
				<p class={stylex.attrs(designSystem.bodyMuted).class}>Dialogs confirm; drawers hold context beside the work.</p>
			</div>
			<div class={stylex.attrs(designSystem.overlayActions).class}>
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
	<p class={stylex.attrs(designSystem.dialogBody).class}>
		The taxpayer record and validation status will be locked to this period once submitted.
	</p>
	{#snippet footer()}
		<Button variant="secondary" onclick={() => (dialogOpen = false)}>Cancel</Button>
		<Button onclick={() => (dialogOpen = false)}>Submit filing</Button>
	{/snippet}
</Dialog>

<Drawer bind:open={drawerOpen} title="Validation log" description="Checks run against the active return.">
	<div class={stylex.attrs(designSystem.validationLog).class}>
		<div class={stylex.attrs(designSystem.validationRow).class}>
			<span class={stylex.attrs(designSystem.valid).class}><CheckCircle size={16} color="currentColor" /></span>
			TIN format valid
		</div>
		<div class={stylex.attrs(designSystem.validationRow).class}>
			<span class={stylex.attrs(designSystem.valid).class}><CheckCircle size={16} color="currentColor" /></span>
			Output VAT recomputed
		</div>
		<div class={stylex.attrs(designSystem.validationRow).class}>
			<span class={stylex.attrs(designSystem.warning).class}><DangerTriangle size={16} color="currentColor" /></span>
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

	@media (hover: hover) {
		.ds-swatch:hover .copy-icon { opacity: 1; }
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
