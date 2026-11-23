<script lang="ts">
	import { ButtonLink } from '$lib/components/ui';
	import Icon from '$lib/components/ui/icon/icon.svelte';
	import { glyphs } from '$lib/components/ui/icons';
	import type { TaxpayerProfile } from '$lib/profiles/profile';
	import { formatTinInput } from '$lib/profiles/profile';
	import { getWithholdingDefinition } from './withholding-definitions';

	let { formCode, values, profile, taxpayerHref }: {
		formCode: string;
		values: Record<string, string>;
		profile: TaxpayerProfile;
		taxpayerHref: string;
	} = $props();

	const legacyFields: Partial<Record<keyof TaxpayerProfile, string>> = {
		tin1: 'frm1601EQ:txtTIN1', tin2: 'frm1601EQ:txtTIN2', tin3: 'frm1601EQ:txtTIN3',
		branchCode: 'frm1601EQ:txtBranchCode', rdoCode: 'frm1601EQ:txtRDOCode',
		taxpayerName: 'frm1601EQ:txtTaxpayerName', address: 'frm1601EQ:txtAddress',
		address2: 'frm1601EQ:txtAddress2'
	};
	const profileFields = $derived(formCode === '1601EQ' ? legacyFields : Object.fromEntries(
		(getWithholdingDefinition(formCode)?.sections ?? []).flatMap(section => section.fields)
			.filter(field => field.profileKey).map(field => [field.profileKey!, field.id])
	));
	function value(key: keyof TaxpayerProfile): string {
		const field = profileFields[key];
		// Saved blanks are meaningful; only absent return values fall back to the profile.
		return (field ? values[field] : undefined) ?? profile[key] ?? '';
	}
	const payment = $derived(formCode === '0605');
	const paper = $derived(formCode === '1601EQ' || payment);
	const classification = $derived(value('taxpayerClassification'));
	const details = $derived([
		{ item: payment ? 13 : 8, label: 'Taxpayer name', content: value('taxpayerName') },
		{ item: payment ? 9 : 6, label: 'TIN and branch code', content: formatTinInput({ tin1: value('tin1'), tin2: value('tin2'), tin3: value('tin3'), branchCode: value('branchCode') }) },
		{ item: payment ? 10 : 7, label: 'RDO code', content: value('rdoCode') },
		{ item: payment ? 15 : 9, label: 'Registered address', content: [value('address'), value('address2')].filter(Boolean).join(', ') },
		...(payment ? [
			{ item: 11, label: 'Taxpayer classification', content: classification === 'I' ? 'Individual' : classification === 'N' ? 'Non-individual' : '' },
			{ item: 12, label: 'Line of business / occupation', content: value('lineOfBusiness') },
			{ item: 14, label: 'Telephone number', content: value('contactNumber') },
			{ item: 16, label: 'ZIP code', content: value('zipCode') }
		] : [])
	]);
</script>

<section class={['eq-section taxpayer-information', { paper, payment }]} aria-label="Taxpayer information">
	<header class="eq-section-header">
		<h2>{paper ? 'Part I · Background Information' : 'Taxpayer information'}</h2>
		<ButtonLink href={taxpayerHref} variant="ghost" size="icon" aria-label="Edit taxpayer information" title="Edit taxpayer information">
			<span class="edit-icon"><Icon icon={glyphs.pencil} /></span>
		</ButtonLink>
	</header>
	<dl>
		{#each (paper ? [...details].sort((a, b) => a.item - b.item) : details) as { item, label, content } (item)}
			<div>
			<dt>{#if paper}<span class="taxpayer-item">{item}</span>{/if} {label}</dt>
				<dd>{content || '—'}</dd>
			</div>
		{/each}
	</dl>
</section>

<style>
	.edit-icon { display: inline-flex; width: 1rem; height: 1rem; flex-shrink: 0; }
	.taxpayer-information { border-bottom: 1px solid var(--border-soft); }
	.eq-section-header { flex-wrap: wrap; gap: .5rem 1rem; }
	dl { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem 1.25rem; margin: 0; }
	dl > div { min-width: 0; }
	dt { color: var(--fg-muted); font-size: .75rem; }
	dd { margin: .25rem 0 0; font-size: .875rem; overflow-wrap: anywhere; }
	.paper { padding: 0; border-bottom: 0; }
	.paper .eq-section-header { margin: 0; padding: .375rem .875rem; background: var(--paper-section-background, var(--bg-hover)); }
	.paper dl { gap: 0; }
	.paper dl > div { padding: .75rem .875rem; border-top: 1px solid var(--border); }
	.taxpayer-item { margin-inline-end: .5rem; color: var(--fg); font-weight: 650; }
	@container paper-form (min-width: 36rem) {
		.paper:not(.payment) dl { grid-template-columns: minmax(0, 1.2fr) minmax(0, .6fr) minmax(0, 2fr); }
		.paper:not(.payment) dl > div:nth-child(n + 2):nth-child(-n + 3) { border-inline-start: 1px solid var(--border); }
		.paper:not(.payment) dl > div:last-child { grid-column: 1 / -1; }
		.payment dl { grid-template-columns: repeat(2, minmax(0, 1fr)); }
		.payment dl > div:nth-child(even) { border-inline-start: 1px solid var(--border); }
	}
	@container paper-form (min-width: 56rem) {
		.payment dl { grid-template-columns: repeat(4, minmax(0, 1fr)); }
		.payment dl > div:nth-child(n + 2):nth-child(-n + 4) { border-inline-start: 1px solid var(--border); }
		.payment dl > div:nth-child(5), .payment dl > div:nth-child(7) { grid-column: span 3; }
	}
	@container return-workspace (min-width: 32rem) {
		dl { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	}
	@container return-workspace (min-width: 60rem) {
		dl { grid-template-columns: repeat(4, minmax(0, 1fr)); }
	}
</style>
