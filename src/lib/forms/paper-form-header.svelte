<script lang="ts">
	let { number, revision, title, subtitle, centered = false }: {
		number: string;
		revision: string;
		title: string;
		subtitle?: string;
		centered?: boolean;
	} = $props();
</script>

<header class={['paper-form-header', centered && 'centered']}>
	<h1>
		{title}
		{#if subtitle}<span>{subtitle}</span>{/if}
	</h1>
	<div class="form-number">
		<span class="form-reference">
			<span>BIR Form No.</span>
			<strong>{number}</strong>
		</span>
		<span class="form-revision font-mono">{revision}</span>
	</div>
</header>

<style>
	.paper-form-header {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: .75rem;
		padding: .875rem;
		border-bottom: 1px solid var(--border);
	}
	h1 {
		margin: 0;
		font-family: var(--font-sans);
		font-size: clamp(1.125rem, 1rem + .75cqi, 1.5rem);
		font-weight: 700;
		line-height: 1.25;
		text-align: start;
		overflow-wrap: anywhere;
	}
	h1 span {
		display: block;
		margin-top: .25rem;
		color: var(--fg-muted);
		font-size: .875rem;
		font-weight: 500;
		line-height: 1.4;
	}
	.centered h1 { text-align: center; }
	.centered .form-number { justify-content: center; }
	.form-number {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: .25rem .75rem;
		color: var(--fg-muted);
		font-size: .75rem;
		line-height: 1.4;
	}
	.form-reference {
		display: inline-flex;
		align-items: baseline;
		gap: .375rem;
		white-space: nowrap;
	}
	.form-reference strong {
		color: var(--fg);
		font-size: 1rem;
		font-weight: 700;
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
	}
	.form-revision {
		font-size: .875rem;
		font-weight: 600;
	}

	@container paper-form (min-width: 40rem) {
		.paper-form-header {
			grid-template-columns: minmax(0, 1fr) auto;
			column-gap: 1.5rem;
		}
		.form-number {
			flex-direction: column;
			align-items: flex-end;
		}
		.centered {
			grid-template-columns: minmax(8rem, 1fr) minmax(0, 3fr) minmax(8rem, 1fr);
		}
		.centered h1 { grid-column: 2; }
		.centered .form-number { justify-content: start; }
	}
</style>
