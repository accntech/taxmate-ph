<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ButtonLink } from '$lib/components/ui';
	import Icon from '$lib/components/ui/icon/icon.svelte';
	import { glyphs } from '$lib/components/ui/icons';
	import type { TaxpayerProfile } from '$lib/profiles/profile';
	import { formatTinInput } from '$lib/profiles/profile';
	import { getWithholdingDefinition } from './withholding-definitions';
	import { compareFormItems, type TaxpayerItemKey } from './withholding-paper-layout';

	let { formCode, values, profile, taxpayerHref, itemNumbers, extraItems = [], extraField }: {
		formCode: string;
		values: Record<string, string>;
		profile: TaxpayerProfile;
		taxpayerHref: string;
		itemNumbers?: Partial<Record<TaxpayerItemKey, string>>;
		extraItems?: { id: string; item: string }[];
		extraField?: Snippet<[string]>;
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
	const remittance = $derived(formCode === '0619E' || formCode === '0619F');
	const remittanceTinItem = $derived(formCode === '0619F' ? 6 : 7);
	const paper = $derived(formCode === '1601EQ' || payment || remittance || !!itemNumbers);
	const classification = $derived(value('taxpayerClassification'));
	const category = $derived(value('category'));
	const tin = $derived(formatTinInput({ tin1: value('tin1'), tin2: value('tin2'), tin3: value('tin3'), branchCode: value('branchCode') }));
	const address = $derived([value('address'), value('address2')].filter(Boolean).join(', '));
	const profileLabels: Partial<Record<TaxpayerItemKey, string>> = {
		tin: 'TIN and branch code', rdoCode: 'RDO code', taxpayerName: 'Withholding agent’s name',
		address: 'Registered address', zipCode: 'ZIP code', category: 'Category of withholding agent',
		contactNumber: 'Contact number', email: 'Email address', lineOfBusiness: 'Line of business / occupation'
	};

	const paperRows = $derived([
		...Object.entries(itemNumbers ?? {}).map(([rawKey, item]) => {
			const key = rawKey as TaxpayerItemKey;
			const content = key === 'tin' ? tin : key === 'address' ? address :
				key === 'category' ? category === 'P' ? 'Private' : category === 'G' ? 'Government' : '' : value(key);
			const label = formCode === '1606' && key === 'taxpayerName' ? 'Buyer’s name' :
				formCode === '1606' && key === 'address' ? 'Buyer’s registered address' : profileLabels[key] ?? key;
			return { key, item, label, content, fieldId: undefined };
		}),
		...extraItems.map(({ id, item }) => ({ key: id, item, fieldId: id, label: '', content: '' }))
	].sort((a, b) => compareFormItems(a.item, b.item)));

	const details = $derived(remittance ? [
		{ item: remittanceTinItem, label: 'TIN and branch code', content: tin },
		{ item: remittanceTinItem + 1, label: 'RDO code', content: value('rdoCode') },
		{ item: remittanceTinItem + 2, label: 'Withholding agent’s name', content: value('taxpayerName') },
		{ item: remittanceTinItem + 3, label: 'Registered address', content: address },
		{ item: `${remittanceTinItem + 3}A`, label: 'ZIP code', content: value('zipCode') },
		{ item: remittanceTinItem + 4, label: 'Contact number', content: value('contactNumber') },
		{ item: remittanceTinItem + 5, label: 'Category of withholding agent', content: category === 'P' ? 'Private' : category === 'G' ? 'Government' : '' },
		{ item: remittanceTinItem + 6, label: 'Email address', content: value('email') }
	] : [
		{ item: payment ? 13 : 8, label: 'Taxpayer name', content: value('taxpayerName') },
		{ item: payment ? 9 : 6, label: 'TIN and branch code', content: tin },
		{ item: payment ? 10 : 7, label: 'RDO code', content: value('rdoCode') },
		{ item: payment ? 15 : 9, label: 'Registered address', content: address },
		...(payment ? [
			{ item: 11, label: 'Taxpayer classification', content: classification === 'I' ? 'Individual' : classification === 'N' ? 'Non-individual' : '' },
			{ item: 12, label: 'Line of business / occupation', content: value('lineOfBusiness') },
			{ item: 14, label: 'Telephone number', content: value('contactNumber') },
			{ item: 16, label: 'ZIP code', content: value('zipCode') }
		] : [])
	]);
</script>

<section class={['eq-section taxpayer-information', { paper, payment, remittance, 'mapped-paper': !!itemNumbers }]} aria-label="Taxpayer information">
	<header class="eq-section-header">
		<h2>{paper ? 'Part I · Background Information' : 'Taxpayer information'}</h2>
		<ButtonLink href={taxpayerHref} variant="ghost" size="icon" aria-label="Edit taxpayer information" title="Edit taxpayer information">
			<span class="edit-icon"><Icon icon={glyphs.pencil} /></span>
		</ButtonLink>
	</header>
	{#if itemNumbers}
		<div class="profile-grid">
			{#each paperRows as row (row.key)}
				{#if row.fieldId && extraField}
					<div class="profile-extra">
						<span class="taxpayer-item" aria-hidden="true">{row.item}</span>
						{@render extraField(row.fieldId)}
					</div>
				{:else}
					<dl data-profile-key={row.key}>
						<dt><span class="taxpayer-item">{row.item}</span> {row.label}</dt>
						<dd>{row.content || '—'}</dd>
					</dl>
				{/if}
			{/each}
		</div>
	{:else}
		<dl>
			{#each (paper && !remittance ? [...details].sort((a, b) => Number(a.item) - Number(b.item)) : details) as { item, label, content } (item)}
				<div>
				<dt>{#if paper}<span class="taxpayer-item">{item}</span>{/if} {label}</dt>
					<dd>{content || '—'}</dd>
				</div>
			{/each}
		</dl>
	{/if}
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
		.paper:not(.payment, .remittance, .mapped-paper) dl { grid-template-columns: minmax(0, 1.2fr) minmax(0, .6fr) minmax(0, 2fr); }
		.paper:not(.payment, .remittance, .mapped-paper) dl > div:nth-child(n + 2):nth-child(-n + 3) { border-inline-start: 1px solid var(--border); }
		.paper:not(.payment, .remittance, .mapped-paper) dl > div:last-child { grid-column: 1 / -1; }
		.payment dl { grid-template-columns: repeat(2, minmax(0, 1fr)); }
		.payment dl > div:nth-child(even) { border-inline-start: 1px solid var(--border); }
		.remittance dl { grid-template-columns: repeat(4, minmax(0, 1fr)); }
		.remittance dl > div:nth-child(1), .remittance dl > div:nth-child(4) { grid-column: span 3; }
		.remittance dl > div:nth-child(3), .remittance dl > div:nth-child(8) { grid-column: 1 / -1; }
		.remittance dl > div:nth-child(6), .remittance dl > div:nth-child(7) { grid-column: span 2; }
		.remittance dl > div:is(:nth-child(2), :nth-child(5), :nth-child(7)) { border-inline-start: 1px solid var(--border); }
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
	.mapped-paper > .eq-section-header, .profile-grid { border-block-start: 1px solid var(--border); }
	.profile-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 1px;
		background: var(--border);
	}
	.profile-grid > dl, .profile-extra {
		display: block;
		flex: 1 0 var(--profile-cell-width, 100%);
		min-width: 0;
		padding: .75rem .875rem;
		background: var(--bg-elev);
	}
	.profile-extra { display: grid; grid-template-columns: 1.75rem minmax(0, 1fr); gap: .375rem; align-items: start; }
	.profile-extra > .taxpayer-item { margin-inline-end: 0; font-size: .8rem; }
	.profile-extra :global([data-slot="form-item"]) { grid-template-columns: minmax(0, 1fr); }
	@container paper-form (min-width: 36rem) {
		.profile-grid { --profile-cell-width: calc((100% - 1px) / 2); }
		.profile-grid > [data-profile-key="address"] { --profile-cell-width: 100%; }
	}
	@container paper-form (min-width: 58rem) {
		.profile-grid { --profile-cell-width: calc((100% - 3px) / 4); }
		.profile-grid > [data-profile-key="address"] { --profile-cell-width: calc((100% - 1px) / 2); }
	}
</style>
