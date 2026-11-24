<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import './form-editor-layout.css';
</script>

{#snippet placeholder(width: string, height: string)}
	<Skeleton style={`width: ${width}; height: ${height};`} />
{/snippet}

{#snippet field(labelWidth: string)}
	<div class="field">
		{@render placeholder(labelWidth, '.75rem')}
		{@render placeholder('100%', '2.375rem')}
	</div>
{/snippet}

<div role="status" data-slot="form-skeleton">
	<span class="loading-label">Loading BIR form…</span>
	<div class="eq-workspace" aria-hidden="true">
		<div class="eq-header status-bar">
			{@render placeholder('3.5rem', '1.25rem')}
		</div>
		<div class="paper-sheet">
			<div class="sheet-header">
				{@render placeholder('min(65%, 22rem)', '1.5rem')}
				{@render placeholder('4.5rem', '1rem')}
			</div>
			<div class="field-grid">
				{@render field('45%')}
				{@render field('60%')}
				{@render field('35%')}
				{@render field('50%')}
			</div>
			<div class="section-heading">
				{@render placeholder('min(65%, 12rem)', '.875rem')}
			</div>
			<div class="field-grid taxpayer-grid">
				{@render field('40%')}
				{@render field('50%')}
				{@render field('35%')}
			</div>
		</div>
		<div class="eq-action-bar">
			<div class="eq-actions">
				{@render placeholder('5.5rem', '2.375rem')}
				{@render placeholder('4.5rem', '2.375rem')}
			</div>
		</div>
	</div>
</div>

<style>
	.loading-label {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.status-bar { min-height: 0; }
	.sheet-header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: .75rem;
		padding: .875rem;
		border-bottom: 1px solid var(--border);
	}
	.section-heading {
		padding: .5rem .875rem;
		border-block: 1px solid var(--border);
		background: var(--paper-section-background, var(--bg-hover));
	}
	.section-heading :global(div) { background-color: var(--bg-elev); }
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--form-field-row-gap) var(--form-field-column-gap);
		padding: .875rem;
	}
	.field { display: grid; gap: var(--form-label-gap); }
	.taxpayer-grid > :last-child { grid-column: 1 / -1; }
	@container paper-form (min-width: 36rem) {
		.field-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
		.taxpayer-grid { grid-template-columns: 1fr 2fr; }
	}
</style>
