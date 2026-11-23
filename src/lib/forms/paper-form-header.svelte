<script lang="ts">
	let { number, revision, title, subtitle }: {
		number: string;
		revision: string;
		title: string;
		subtitle?: string;
	} = $props();
</script>

<header class="paper-form-header">
	<div class="agency">
		<img src="/legacy/img/withholding/original-1d5df704be8f0f62.gif" alt="" width="42" height="42" />
		<div>
			<span>Republika ng Pilipinas</span>
			<span>Kagawaran ng Pananalapi</span>
			<span>Kawanihan ng Rentas Internas</span>
		</div>
	</div>
	<h1>
		{title}
		{#if subtitle}<span>{subtitle}</span>{/if}
	</h1>
	<div class="form-number">
		<span>BIR Form No.</span>
		<strong>{number}</strong>
		<span>{revision}</span>
	</div>
</header>

<style>
	.paper-form-header {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-areas: "agency" "title" "number";
		border-bottom: 1px solid var(--border);
	}
	.agency {
		grid-area: agency;
		display: flex;
		align-items: center;
		gap: .625rem;
		padding: .625rem .875rem;
		border-bottom: 1px solid var(--border);
	}
	.agency img {
		flex: none;
		border-radius: 50%;
		background: white;
		object-fit: contain;
	}
	.agency span, .form-number span {
		display: block;
		color: var(--fg-muted);
		font-size: .75rem;
		line-height: 1.35;
	}
	h1 {
		grid-area: title;
		align-self: center;
		margin: 0;
		padding: .75rem .875rem;
		font-family: var(--font-sans);
		font-size: clamp(1rem, .875rem + 1cqi, 1.5rem);
		font-weight: 700;
		line-height: 1.25;
		text-align: center;
		text-wrap: balance;
	}
	h1 span {
		display: block;
		margin-top: .25rem;
		font-size: .875rem;
		font-weight: 500;
		line-height: 1.35;
	}
	.form-number {
		grid-area: number;
		display: grid;
		grid-template-columns: auto auto minmax(0, 1fr);
		align-items: baseline;
		gap: .5rem;
		padding: .5rem .875rem;
		border-top: 1px solid var(--border);
	}
	.form-number strong {
		font-size: clamp(1.25rem, 1rem + 1.25cqi, 1.875rem);
		font-weight: 700;
		line-height: 1.1;
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}
	.form-number span:last-child { text-align: end; }

	@container paper-form (min-width: 40rem) {
		.paper-form-header {
			grid-template-columns: minmax(12rem, 1fr) minmax(0, 1.8fr) minmax(12rem, 1fr);
			grid-template-areas: "agency title number";
		}
		.agency { border-bottom: 0; }
		.form-number {
			justify-self: end;
			min-width: 9.5rem;
			grid-template-columns: minmax(0, 1fr);
			align-content: center;
			gap: .125rem;
			padding-block: .625rem;
			border-top: 0;
			border-inline-start: 1px solid var(--border);
		}
		.form-number span:last-child { text-align: start; }
	}
</style>
