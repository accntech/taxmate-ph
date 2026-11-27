<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ButtonLink } from '$lib/components/ui';
	import Icon from '$lib/components/ui/icon/icon.svelte';
	import { glyphs } from '$lib/components/ui/icons';
	import type { TaxpayerProfile } from '$lib/profiles/profile';
	import { formatTinInput, isValidPsocCode } from '$lib/profiles/profile';
	import { getIndividualIncomeForm } from './individual-income';
	import { isLegacy1700ContactValid } from './individual-income/compensation';
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
	const legacy1700 = $derived(formCode === '1700');
	const revised1700 = $derived(formCode === '1700v2018');
	const income = $derived(getIndividualIncomeForm(formCode));
	const profileFields = $derived(formCode === '1601EQ' ? legacyFields : income?.identity ?? Object.fromEntries(
		(getWithholdingDefinition(formCode)?.sections ?? []).flatMap(section => section.fields)
			.filter(field => field.profileKey).map(field => [field.profileKey!, field.id])
	));
	function value(key: keyof TaxpayerProfile): string {
		const field = profileFields[key];
		// Saved blanks are meaningful; only absent return values fall back to the profile.
		const current = (field ? values[field] : undefined) ?? profile[key];
		return typeof current === 'string' ? current : '';
	}
	const payment = $derived(formCode === '0605');
	const remittance = $derived(formCode === '0619E' || formCode === '0619F');
	const remittanceTinItem = $derived(formCode === '0619F' ? 6 : 7);
	const paper = $derived(formCode === '1601EQ' || payment || remittance || !!itemNumbers);
	const classification = $derived(value('taxpayerClassification'));
	const category = $derived(value('category'));
	const tin = $derived(formatTinInput({ tin1: value('tin1'), tin2: value('tin2'), tin3: value('tin3'), branchCode: value('branchCode') }));
	const address = $derived([value('address'), value('address2'), formCode === '1700' ? values['frm1700:txtPg1Pt1I9Address3'] : ''].filter(Boolean).join(', '));
	const legacyName = $derived(['LastName', 'FirstName', 'MiddleName'].map(part => values['frm1700:txtPg1Pt1I8TaxFiler' + part]).filter(Boolean).join(', '));
	const annualName = $derived(['', 'FirstName', 'MiddleName'].map(part => values['frm1701:txtPg1Pt1I8TaxFiler' + part]).filter(Boolean).join(', '));
	const legacyCivilStatus: Record<string, string> = {
		'frm1700:rdoPg1Pt1I13SingleInd': 'Single', 'frm1700:rdoPg1Pt1I13MarriedInd': 'Married',
		'frm1700:rdoPg1Pt1I13LegalSeparatedInd': 'Legally separated', 'frm1700:rdoPg1Pt1I13WidowerInd': 'Widowed'
	};
	const monospaceKeys = new Set(['tin', 'rdoCode', 'zipCode', 'contactNumber', 'birthDate', 'psocCode']);
	const profileLabels: Partial<Record<TaxpayerItemKey, string>> = {
		tin: 'TIN and branch code', rdoCode: 'RDO code', taxpayerName: 'Withholding agent’s name',
		address: 'Registered address', zipCode: 'ZIP code', category: 'Category of withholding agent',
		contactNumber: 'Contact number', email: 'Email address', birthDate: 'Date of birth', civilStatus: 'Civil status', psocCode: 'Occupation code (PSOC)', lineOfBusiness: 'Line of business / occupation'
	};

	const groupedExtras = $derived(extraItems.reduce<{ key: string; item: string; fieldIds: string[] }[]>((rows, { id, item }) => {
		const row = income && rows.find(row => row.item === item);
		if (row) row.fieldIds.push(id);
		else rows.push({ key: id, item, fieldIds: [id] });
		return rows;
	}, []));
	const legacyPsoc = $derived(values['frm1700:txtPg1Pt1I7Psoc'] ??
		(profile.taxpayerClassification === 'I' ? profile.psocCode ?? '' : ''));
	const legacyProfileNotice = $derived(legacy1700 ? {
		psocCode: !legacyPsoc.trim() ? 'Required' : isValidPsocCode(legacyPsoc) ? '' : 'Enter a four-digit PSOC code',
		birthDate: values['frm1700:txtPg1Pt1I10DOB'] ? '' : 'Required',
		civilStatus: legacyCivilStatus[values['frm1700:rdoPg1Pt1I13CivilStatusInd']] ? '' : 'Required',
		contactNumber: isLegacy1700ContactValid(value('contactNumber')) ? '' : 'Enter a valid contact number'
	} as Partial<Record<string, string>> : {});
	const paperRows = $derived([
		...Object.entries(itemNumbers ?? {}).map(([rawKey, item]) => {
			const key = rawKey as TaxpayerItemKey;
			const legacyDetails: Partial<Record<TaxpayerItemKey, string>> = formCode === '1700' ? {
				taxpayerName: legacyName || value('taxpayerName'),
				psocCode: legacyPsoc,
				birthDate: values['frm1700:txtPg1Pt1I10DOB'] ?? '',
				civilStatus: legacyCivilStatus[values['frm1700:rdoPg1Pt1I13CivilStatusInd']] ?? ''
			} : formCode === '1701' ? { taxpayerName: annualName || profile.taxpayerName } : {};
			const content = key === 'tin' ? tin : key === 'address' ? address :
				key === 'category' ? category === 'P' ? 'Private' : category === 'G' ? 'Government' : '' : legacyDetails[key] ?? value(key);
			const label = formCode === '1606' && key === 'taxpayerName' ? 'Buyer’s name' :
				formCode === '1606' && key === 'address' ? 'Buyer’s registered address' : income && key === 'taxpayerName' ? 'Taxpayer name' : profileLabels[key] ?? key;
			const addressControls = legacy1700 && key === 'address' ? groupedExtras.find(row => row.item === item)?.fieldIds : undefined;
			return { key, item, label, content, fieldIds: addressControls };
		}),
		...groupedExtras.filter(row => !(legacy1700 && row.item === itemNumbers?.address)).map(row => ({ ...row, label: '', content: '' }))
	].sort((a, b) => compareFormItems(a.item, b.item)));

	const details = $derived(remittance ? [
		{ item: remittanceTinItem, key: 'tin', label: 'TIN and branch code', content: tin },
		{ item: remittanceTinItem + 1, key: 'rdoCode', label: 'RDO code', content: value('rdoCode') },
		{ item: remittanceTinItem + 2, label: 'Withholding agent’s name', content: value('taxpayerName') },
		{ item: remittanceTinItem + 3, label: 'Registered address', content: address },
		{ item: `${remittanceTinItem + 3}A`, key: 'zipCode', label: 'ZIP code', content: value('zipCode') },
		{ item: remittanceTinItem + 4, key: 'contactNumber', label: 'Contact number', content: value('contactNumber') },
		{ item: remittanceTinItem + 5, label: 'Category of withholding agent', content: category === 'P' ? 'Private' : category === 'G' ? 'Government' : '' },
		{ item: remittanceTinItem + 6, label: 'Email address', content: value('email') }
	] : [
		{ item: payment ? 13 : 8, label: 'Taxpayer name', content: value('taxpayerName') },
		{ item: payment ? 9 : 6, key: 'tin', label: 'TIN and branch code', content: tin },
		{ item: payment ? 10 : 7, key: 'rdoCode', label: 'RDO code', content: value('rdoCode') },
		{ item: payment ? 15 : 9, label: 'Registered address', content: address },
		...(payment ? [
			{ item: 11, label: 'Taxpayer classification', content: classification === 'I' ? 'Individual' : classification === 'N' ? 'Non-individual' : '' },
			{ item: 12, label: 'Line of business / occupation', content: value('lineOfBusiness') },
			{ item: 14, key: 'contactNumber', label: 'Telephone number', content: value('contactNumber') },
			{ item: 16, key: 'zipCode', label: 'ZIP code', content: value('zipCode') }
		] : [])
	]);
</script>

<section class={['eq-section taxpayer-information', { paper, payment, remittance, 'mapped-paper': !!itemNumbers, 'income-profile': !!income, 'legacy-1700': legacy1700, 'revised-1700': revised1700 }]} aria-label="Taxpayer information">
	<header class="eq-section-header">
		<h2>{paper ? 'Part I · Background Information' : 'Taxpayer information'}</h2>
		<ButtonLink href={taxpayerHref} variant="ghost" size="icon" aria-label="Edit taxpayer information" title="Edit taxpayer information">
			<span class="edit-icon"><Icon icon={glyphs.pencil} /></span>
		</ButtonLink>
	</header>
	{#if itemNumbers}
		<div class="profile-grid">
			{#each paperRows as row (row.key)}
				{#if row.fieldIds && extraField && !row.label}
					<div class="profile-extra" class:grouped={row.fieldIds.length > 1} data-income-item={income ? row.item : undefined}>
						<span class="taxpayer-item" aria-hidden="true">{row.item}</span>
						<div class="profile-extra-controls" style:--extra-column-count={row.fieldIds.length}>
							{#each row.fieldIds as id (id)}{@render extraField(id)}{/each}
						</div>
					</div>
				{:else}
					<dl data-profile-key={row.key} data-income-item={revised1700 ? row.item : undefined}>
						<dt><span class="taxpayer-item">{row.item}</span> {row.label}</dt>
						<dd class:font-mono={monospaceKeys.has(row.key) && !legacyProfileNotice[row.key]} class:profile-required={!!legacyProfileNotice[row.key]}>{legacyProfileNotice[row.key] || row.content || '—'}</dd>
						{#if row.fieldIds && extraField}
							<dd class="profile-item-controls">
								{#each row.fieldIds as id (id)}{@render extraField(id)}{/each}
							</dd>
						{/if}
					</dl>
				{/if}
			{/each}
		</div>
	{:else}
		<dl>
			{#each (paper && !remittance ? [...details].sort((a, b) => Number(a.item) - Number(b.item)) : details) as detail (detail.item)}
				<div>
					<dt>{#if paper}<span class="taxpayer-item">{detail.item}</span>{/if} {detail.label}</dt>
					<dd class:font-mono={'key' in detail && monospaceKeys.has(detail.key ?? '')}>{detail.content || '—'}</dd>
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
	.paper {
		--profile-item-width: 1.75rem;
		--profile-item-gap: .375rem;
		padding: 0;
		border-bottom: 0;
	}
	.paper .eq-section-header { margin: 0; padding: .375rem .875rem; background: var(--paper-section-background, var(--bg-hover)); }
	.paper dl { gap: 0; }
	.paper dl > div { padding: .75rem .875rem; border-top: 1px solid var(--border); }
	.taxpayer-item { font-family: var(--font-mono); color: var(--fg); font-weight: 650; }
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
	dt:has(> .taxpayer-item), .profile-extra {
		display: grid;
		grid-template-columns: var(--profile-item-width) minmax(0, 1fr);
		gap: var(--profile-item-gap);
		align-items: start;
	}
	dt:has(> .taxpayer-item) + dd {
		margin-inline-start: calc(var(--profile-item-width) + var(--profile-item-gap));
	}
	.profile-extra.grouped { flex-basis: 100%; }
	.profile-extra-controls { display: grid; min-width: 0; gap: .75rem; }
	@container paper-form (min-width: 36rem) {
		.profile-extra-controls { grid-template-columns: repeat(var(--extra-column-count, 1), minmax(0, 1fr)); }
	}
	.income-profile > .eq-section-header { border-block-start: 0; }
	.income-profile > .profile-grid { --radio-choice-row-gap: .25rem; border-block-end: 1px solid var(--border); }
	.legacy-1700 .profile-grid > [data-profile-key="address"] { flex-basis: 100%; }
	.legacy-1700 { --profile-item-width: 1.1rem; }
	.legacy-1700 .profile-extra.grouped { flex-basis: 100%; }
	.profile-item-controls { margin-top: .625rem; }
	.profile-required { color: var(--danger); font-weight: 600; }
	@container paper-form (min-width: 36rem) {
		.legacy-1700 .profile-grid > [data-profile-key="address"] {
			display: grid;
			grid-template-columns: minmax(0, 1fr) auto;
			column-gap: 1rem;
		}
		.legacy-1700 [data-profile-key="address"] > :is(dt, dd:not(.profile-item-controls)) { grid-column: 1; }
		.legacy-1700 .profile-item-controls { grid-area: 1 / 2 / 3; align-self: center; margin: 0; }
	}
	.profile-extra > .taxpayer-item { font-size: .8rem; }
	.profile-extra :global([data-slot="form-item"]) { grid-template-columns: minmax(0, 1fr); }
	@container paper-form (min-width: 36rem) {
		.profile-grid { --profile-cell-width: calc((100% - 1px) / 2); }
		.profile-grid > [data-profile-key="address"] { --profile-cell-width: 100%; }
	}
	@container paper-form (min-width: 58rem) {
		.profile-grid { --profile-cell-width: calc((100% - 3px) / 4); }
		.profile-grid > [data-profile-key="address"] { --profile-cell-width: calc((100% - 1px) / 2); }
	}
	.revised-1700 .profile-grid > :is(dl, .profile-extra) { padding-block: .625rem; }
	.revised-1700 { --profile-item-width: 1.4rem; }
	@container paper-form (width >= 54rem) {
		.revised-1700 .profile-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); }
		.revised-1700 [data-income-item="4"] { grid-column: 1 / 5; }
		.revised-1700 [data-income-item="5"] { grid-column: 5 / 7; }
		.revised-1700 [data-income-item="6"] { grid-column: 7 / -1; }
		.revised-1700 [data-income-item="7"] { grid-column: 1 / 5; }
		.revised-1700 [data-income-item="8"] { grid-column: 5 / 11; }
		.revised-1700 [data-income-item="8A"] { grid-column: 11 / -1; }
		.revised-1700 [data-income-item="9"] { grid-column: 1 / 4; }
		.revised-1700 [data-income-item="10"] { grid-column: 4 / 10; }
		.revised-1700 [data-income-item="11"] { grid-column: 10 / -1; }
		.revised-1700 [data-income-item="12"] { grid-column: 1 / 9; }
		.revised-1700 .profile-grid:has([data-income-item="13"]) [data-income-item="12"] { grid-column: 1 / 5; }
		.revised-1700 [data-income-item="13"] { grid-column: 5 / 9; }
		.revised-1700 [data-income-item="14"] { grid-column: 9 / -1; }
		.revised-1700 [data-income-item="15"] { grid-column: 1 / -1; }
		.revised-1700 .profile-grid:has([data-income-item="16"]) [data-income-item="15"] { grid-column: 1 / 5; }
		.revised-1700 [data-income-item="16"] { grid-column: 5 / -1; }
		.revised-1700 .profile-grid:has([data-income-item="17"]) [data-income-item="16"] { grid-column: 5 / 9; }
		.revised-1700 [data-income-item="17"] { grid-column: 9 / -1; }
	}
</style>
