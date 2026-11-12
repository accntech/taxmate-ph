<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import { Badge, ButtonLink, Page } from '$lib/components/ui';
	import ArrowRight from '@solar-icons/svelte/category/arrows/Linear/ArrowRight.svelte';

	let {
		title,
		description,
		icon,
		steps
	}: {
		title: string;
		description: string;
		icon: Snippet;
		steps: { title: string; description: string }[];
	} = $props();
</script>

<Page size="lg" class="@container">
	<div class="planned-workspace">
		<header class="workspace-heading">
			<div class="workspace-title">
				<h1>{title}</h1>
				<Badge tone="neutral">Planned</Badge>
			</div>
			<p>{description}</p>
		</header>

		<section class="workspace-notice" aria-labelledby="availability-heading">
			<div class="notice-content">
				<span class="workspace-icon" aria-hidden="true">
					{@render icon()}
				</span>
				<h2 id="availability-heading">This workspace is not available yet</h2>
				<p>
					{title} preparation and file generation are not enabled.
					You can use eBIRForms for the tax forms currently available in the suite.
				</p>
				<nav aria-label={`${title} navigation`}>
					<ButtonLink href={resolve('/ebirforms/taxpayers')} size="touch">
						Open eBIRForms
						<ArrowRight size={17} color="currentColor" />
					</ButtonLink>
					<ButtonLink href={resolve('/')} variant="secondary" size="touch">
						Back to suite
					</ButtonLink>
				</nav>
			</div>

			<div class="planned-workflow">
				<h2>Planned workflow</h2>
				<ol>
					{#each steps as step, index (step.title)}
						<li>
							<div class="step-heading">
								<span class="step-number" aria-hidden="true">{index + 1}</span>
								<h3>{step.title}</h3>
							</div>
							<p>{step.description}</p>
						</li>
					{/each}
				</ol>
			</div>
		</section>
	</div>
</Page>

<style>
	.planned-workspace {
		display: grid;
		gap: 1.75rem;
		padding-block: 0.75rem;
	}

	h1, h2, h3, p { margin: 0; }
	.workspace-title { display: flex; align-items: center; flex-wrap: wrap; gap: 0.75rem; }

	h1 {
		font-family: var(--font-sans);
		font-size: 1.75rem;
		font-weight: 650;
		letter-spacing: -0.025em;
		line-height: 1.25;
	}

	.workspace-heading p { margin-top: 0.5rem; color: var(--fg-muted); line-height: 1.6; }

	.workspace-notice {
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: var(--radius-panel);
		background: var(--bg-elev);
	}

	.notice-content {
		display: grid;
		justify-items: center;
		padding: 3.5rem 2rem;
		text-align: center;
	}

	.workspace-icon {
		display: grid;
		place-items: center;
		width: 3.5rem;
		height: 3.5rem;
		margin-bottom: 1.5rem;
		border-radius: var(--radius-field);
		background: var(--accent-soft);
		color: var(--accent);
	}

	.notice-content h2 {
		font-family: var(--font-sans);
		font-size: 1.25rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.4;
		text-wrap: balance;
	}

	.notice-content p {
		max-width: 54ch;
		margin-top: 0.75rem;
		color: var(--fg-muted);
		font-size: 0.875rem;
		line-height: 1.75;
		text-wrap: pretty;
	}

	nav { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; margin-top: 1.75rem; }
	.planned-workflow { padding: 1.5rem 2rem 1.75rem; border-top: 1px solid var(--border); }
	.planned-workflow > h2 { font-size: 0.875rem; font-weight: 600; }

	ol {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 2rem;
		padding: 0;
		margin: 1.25rem 0 0;
		list-style: none;
	}

	.step-heading { display: flex; align-items: baseline; gap: 0.625rem; }
	.step-number { color: var(--fg-muted); font-size: 0.75rem; font-variant-numeric: tabular-nums; }
	h3 { font-size: 0.875rem; font-weight: 600; line-height: 1.5; }
	li p { margin-top: 0.5rem; color: var(--fg-muted); font-size: 0.8125rem; line-height: 1.6; }

	@container (max-width: 40rem) {
		ol { grid-template-columns: 1fr; gap: 1.25rem; }
		li p { margin-top: 0.25rem; padding-left: 1.125rem; }
	}

	@container (max-width: 30rem) {
		.planned-workspace { gap: 1.5rem; padding-block: 0.25rem; }
		.notice-content { padding: 2rem 1.25rem; }
		.planned-workflow { padding: 1.25rem; }
		nav { display: grid; justify-content: stretch; width: 100%; }
	}
</style>
