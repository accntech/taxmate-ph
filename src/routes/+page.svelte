<script lang="ts">
	import { getFieldKitSteps, listSuiteApps } from '$lib/apps/app-shell';
	import { Badge, ButtonLink, Page } from '$lib/components/ui';
	import ArrowRight from '@solar-icons/svelte/category/arrows/Linear/ArrowRight.svelte';
	import CheckCircle from '@solar-icons/svelte/category/ui/Linear/CheckCircle.svelte';
	import DocumentText from '@solar-icons/svelte/category/notes/Linear/DocumentText.svelte';
	import BillList from '@solar-icons/svelte/category/money/Linear/BillList.svelte';
	import UsersGroupRounded from
		'@solar-icons/svelte/category/users/Linear/UsersGroupRounded.svelte';

	const suiteApps = listSuiteApps();
	const activeApps = suiteApps.filter((app) => app.status === 'active');
	const plannedApps = suiteApps.filter((app) => app.status !== 'active');
	const kitSteps = getFieldKitSteps();
</script>

{#snippet appIcon(id: string, size = 24)}
	{#if id === 'ebirforms'}
		<DocumentText {size} color="currentColor" />
	{:else if id === 'vat-relief'}
		<BillList {size} color="currentColor" />
	{:else}
		<UsersGroupRounded {size} color="currentColor" />
	{/if}
{/snippet}

<svelte:head>
	<title>TaxMate PH</title>
	<meta
		name="description"
		content="Open eBIRForms, VAT Relief, and Alphalist workspaces from TaxMate PH."
	/>
</svelte:head>

<Page size="lg" class="@container">
	<div class="suite-home">
		<header class="suite-heading">
			<h1>Tax workspaces</h1>
			<p>Choose a workspace to prepare your Philippine tax files.</p>
		</header>

		<section aria-label="Available workspaces" class="available-workspaces">
			{#each activeApps as app (app.id)}
				<div class="active-workspace">
					<div class="workspace-icon" aria-hidden="true">
						{@render appIcon(app.id, 28)}
					</div>
					<div class="workspace-copy">
						<div class="workspace-title">
							<h2>{app.name}</h2>
							<Badge tone="success">
								<CheckCircle size={14} color="currentColor" />
								Available now
							</Badge>
						</div>
						<p>{app.description}</p>
					</div>
					<ButtonLink href={app.href} size="touch" class="workspace-action">
						Open {app.name}
						<ArrowRight size={18} color="currentColor" />
					</ButtonLink>
				</div>
			{/each}
		</section>

		<section aria-labelledby="planned-heading" class="planned-workspaces">
			<div class="section-heading">
				<h2 id="planned-heading">Planned workspaces</h2>
				<p>Preview what’s coming to the suite.</p>
			</div>
			<div class="planned-list">
				{#each plannedApps as app (app.id)}
					<a href={app.href} class="planned-workspace">
						<span class="planned-icon" aria-hidden="true">
							{@render appIcon(app.id, 22)}
						</span>
						<span class="planned-copy">
							<span class="planned-title">{app.name}</span>
							<span class="planned-description">{app.description}</span>
						</span>
						<span class="preview-action">
							Preview <span class="sr-only">{app.name}</span>
							<ArrowRight size={17} color="currentColor" />
						</span>
					</a>
				{/each}
			</div>
		</section>

		<section aria-labelledby="workflow-heading" class="workflow">
			<h2 id="workflow-heading">Your filing workflow</h2>
			<ol>
				{#each kitSteps as step, index (step.id)}
					<li>
						<div class="step-title">
							<span class="step-number" aria-hidden="true">{index + 1}</span>
							<h3>{step.label}</h3>
						</div>
						<p>{step.description}</p>
					</li>
				{/each}
			</ol>
		</section>
	</div>
</Page>

<style>
	.suite-home {
		display: grid;
		gap: 2.5rem;
		padding-block: 0.75rem;
	}

	h1, h2, h3, p { margin: 0; }

	.suite-heading h1 {
		font-family: var(--font-sans);
		font-size: 1.75rem;
		font-weight: 650;
		letter-spacing: -0.025em;
		line-height: 1.25;
	}

	.suite-heading p { margin-top: 0.5rem; color: var(--fg-muted); }
	.available-workspaces { display: grid; gap: 1rem; }

	.active-workspace {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 2rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-panel);
		background: var(--bg-elev);
	}

	.workspace-icon {
		display: grid;
		flex-shrink: 0;
		place-items: center;
		width: 3.5rem;
		height: 3.5rem;
		border-radius: var(--radius-field);
		background: var(--accent-soft);
		color: var(--accent);
	}

	.workspace-copy { flex: 1; min-width: 0; }
	.workspace-title { display: flex; align-items: center; flex-wrap: wrap; gap: 0.75rem; }
	.workspace-title h2 { font-size: 1.375rem; font-weight: 650; letter-spacing: -0.02em; }
	.workspace-copy p { margin-top: 0.5rem; color: var(--fg-muted); line-height: 1.6; }
	.active-workspace :global(.workspace-action) {
		flex-shrink: 0;
		min-height: 3rem;
		padding-inline: 1rem;
		font-size: 0.9375rem;
	}

	.section-heading h2, .workflow > h2 { font-size: 1rem; font-weight: 600; }
	.section-heading p { margin-top: 0.25rem; color: var(--fg-muted); font-size: 0.875rem; }
	.planned-list { margin-top: 1rem; border-top: 1px solid var(--border); }

	.planned-workspace {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem 0.75rem;
		border-bottom: 1px solid var(--border);
		color: var(--fg);
		text-decoration: none;
		transition: background-color 150ms ease-out;
	}

	.planned-workspace:hover { background: var(--bg-hover); }
	.planned-workspace:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
	.planned-icon { display: flex; color: var(--fg-muted); }
	.planned-copy { display: grid; gap: 0.25rem; flex: 1; min-width: 0; }
	.planned-title { font-weight: 600; }
	.planned-description { color: var(--fg-muted); font-size: 0.875rem; line-height: 1.5; }
	.preview-action { display: flex; align-items: center; gap: 0.5rem; color: var(--accent); font-size: 0.875rem; font-weight: 600; }

	.workflow { margin-top: 0.25rem; }
	.workflow ol { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 1.5rem; list-style: none; padding: 0; margin: 1rem 0 0; }
	.step-title { display: flex; gap: 0.5rem; align-items: center; }
	.step-number { color: var(--fg-muted); font-size: 0.75rem; font-variant-numeric: tabular-nums; }
	.step-title h3 { font-size: 0.875rem; font-weight: 600; }
	.workflow li p { margin-top: 0.5rem; font-size: 0.8125rem; line-height: 1.6; color: var(--fg-muted); }

	@container (max-width: 48rem) {
		.active-workspace { flex-wrap: wrap; padding: 1.5rem; }
		.active-workspace :global(.workspace-action) { margin-left: 4.75rem; }
		.workflow ol { grid-template-columns: repeat(3, minmax(0, 1fr)); }
	}

	@container (max-width: 30rem) {
		.suite-home { gap: 2rem; padding-block: 0.25rem; }
		.active-workspace { gap: 1rem; padding: 1.25rem; }
		.workspace-title { gap: 0.5rem; }
		.workspace-icon { width: 2.75rem; height: 2.75rem; }
		.workspace-copy { flex-basis: calc(100% - 3.75rem); }
		.active-workspace :global(.workspace-action) { margin-left: 0; width: 100%; }
		.planned-workspace { flex-wrap: wrap; gap: 0.75rem; padding-inline: 0; }
		.planned-copy { flex-basis: calc(100% - 2.25rem); }
		.preview-action { margin-left: 2.125rem; }
		.workflow ol { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; }
	}

	@media (prefers-reduced-motion: reduce) {
		.planned-workspace { transition: none; }
	}
</style>
