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
	const details = $derived([
		['Taxpayer name', value('taxpayerName')],
		['TIN and branch code', formatTinInput({ tin1: value('tin1'), tin2: value('tin2'), tin3: value('tin3'), branchCode: value('branchCode') })],
		['RDO code', value('rdoCode')],
		['Registered address', [value('address'), value('address2')].filter(Boolean).join(', ')]
	]);
</script>

<section class="eq-section taxpayer-information" aria-label="Taxpayer information">
	<header class="eq-section-header">
		<h2>Taxpayer information</h2>
		<ButtonLink href={taxpayerHref} variant="ghost" size="icon" aria-label="Edit taxpayer information" title="Edit taxpayer information">
			<span class="edit-icon"><Icon icon={glyphs.pencil} /></span>
		</ButtonLink>
	</header>
	<dl>
		{#each details as [label, content] (label)}
			<div>
				<dt>{label}</dt>
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
	@container return-workspace (min-width: 32rem) {
		dl { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	}
	@container return-workspace (min-width: 60rem) {
		dl { grid-template-columns: repeat(4, minmax(0, 1fr)); }
	}
</style>
