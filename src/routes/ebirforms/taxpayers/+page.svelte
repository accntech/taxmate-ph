<script lang="ts">
	import { onMount } from 'svelte';
	import { buildTaxpayerRoute } from '$lib/apps/app-shell';
	import { ebirformsWorkspace as workspace } from '$lib/ebirforms/ebirforms-workspace.svelte';
	import {
		Badge,
		Button,
		ButtonLink,
		Card,
		Input,
		Page,
		PageHeader,
		Select
	} from '$lib/components/ui';
	import { formatTinInput, parseTinInput } from '$lib/profiles/profile';
	import AddCircle from '@solar-icons/svelte/category/ui/Linear/AddCircle.svelte';
	import CheckCircle from '@solar-icons/svelte/category/ui/Linear/CheckCircle.svelte';
	import ClipboardList from '@solar-icons/svelte/category/notes/Linear/ClipboardList.svelte';
	import DocumentAdd from '@solar-icons/svelte/category/notes/Linear/DocumentAdd.svelte';
	import UserCheck from '@solar-icons/svelte/category/users/Linear/UserCheck.svelte';

	const categoryOptions = [
		{ value: 'P', label: 'Private', meta: 'individuals, corporations, estates, trusts' },
		{ value: 'G', label: 'Government', meta: 'national agencies and LGUs' }
	];

	let tinInput = $state(formatTinInput(workspace.profile));
	let tinHelp = $derived(
		tinInput.replace(/\D/g, '').length === 13
			? 'Ready as a 13-digit taxpayer id.'
			: 'Enter 9 TIN digits plus 4 branch digits.'
	);
	let activeProfile = $derived(
		workspace.profiles.find((profile) => profile.id === workspace.selectedProfileId)
	);
	let activeProfileRoute = $derived(
		workspace.selectedProfileId ? `${buildTaxpayerRoute(workspace.selectedProfileId)}/forms` : ''
	);

	onMount(() => {
		void workspace.loadTaxpayerProfiles().then(() => {
			tinInput = formatTinInput(workspace.profile);
		});
	});

	function updateTinParts(value: string) {
		tinInput = value;
		const parts = parseTinInput(value);

		workspace.profile.tin1 = parts.tin1;
		workspace.profile.tin2 = parts.tin2;
		workspace.profile.tin3 = parts.tin3;
		workspace.profile.branchCode = parts.branchCode;
	}

	function startNewProfile() {
		workspace.startNewTaxpayerProfile();
		tinInput = '';
	}

	function selectProfile(id: string) {
		workspace.selectTaxpayerProfile(id);
		tinInput = formatTinInput(workspace.profile);
	}

	async function saveProfile() {
		await workspace.saveTaxpayerProfile();
		tinInput = formatTinInput(workspace.profile);
	}
</script>

<svelte:head>
	<title>Taxpayers | eBIRForms</title>
</svelte:head>

<Page size="xl">
	<PageHeader
		eyebrow="Guided filing"
		title="Start with the taxpayer"
		description="Choose an existing profile or set up a clean taxpayer record before preparing a return. The TIN, RDO, and contact details stay attached to the filing path."
	>
		{#snippet icon()}
			<ClipboardList size={22} color="currentColor" />
		{/snippet}
		{#snippet actions()}
			<Button variant="secondary" size="touch" class="w-full sm:w-auto" onclick={startNewProfile}>
				<AddCircle size={18} color="currentColor" />
				New profile
			</Button>
			{#if activeProfileRoute}
				<ButtonLink href={activeProfileRoute} size="touch" class="w-full sm:w-auto">
					<DocumentAdd size={18} color="currentColor" />
					Open forms
				</ButtonLink>
			{/if}
		{/snippet}
	</PageHeader>

	<div class="grid gap-3 md:grid-cols-3">
		<Card variant="muted" class="flex items-center gap-3">
			<span
				class="grid size-9 shrink-0 place-items-center rounded-md bg-bg-elev text-accent"
				aria-hidden="true"
			>
				<UserCheck size={20} color="currentColor" />
			</span>
			<div class="min-w-0">
				<p class="text-sm font-semibold text-fg">1. taxpayer</p>
				<p class="truncate text-xs text-fg-muted">{activeProfile?.taxpayerName || 'new profile'}</p>
			</div>
		</Card>
		<Card variant="muted" class="flex items-center gap-3">
			<span
				class="grid size-9 shrink-0 place-items-center rounded-md bg-bg-elev text-accent"
				aria-hidden="true"
			>
				<CheckCircle size={20} color="currentColor" />
			</span>
			<div class="min-w-0">
				<p class="text-sm font-semibold text-fg">2. verify</p>
				<p class="truncate font-mono text-xs text-fg-muted">{workspace.activeTin}</p>
			</div>
		</Card>
		<Card variant="muted" class="flex items-center gap-3">
			<span
				class="grid size-9 shrink-0 place-items-center rounded-md bg-bg-elev text-accent"
				aria-hidden="true"
			>
				<DocumentAdd size={20} color="currentColor" />
			</span>
			<div class="min-w-0">
				<p class="text-sm font-semibold text-fg">3. create forms</p>
				<p class="truncate text-xs text-fg-muted">{workspace.statusMessage}</p>
			</div>
		</Card>
	</div>

	<div class="grid gap-4 xl:grid-cols-[24rem_minmax(0,1fr)]">
		<Card class="grid content-start gap-4">
			<div class="grid gap-1">
				<p class="font-mono text-xs font-semibold uppercase text-accent">Step 1</p>
				<h2 class="text-lg font-semibold text-fg">Choose taxpayer</h2>
				<p class="text-sm text-fg-muted">{workspace.profiles.length} saved profiles available</p>
			</div>

			<div class="grid max-h-[32rem] gap-2 overflow-auto pr-1">
				{#if workspace.profiles.length === 0}
					<Card variant="muted" class="text-sm leading-6 text-fg-muted">
						No saved taxpayers yet. Fill out the identity details and save the profile.
					</Card>
				{/if}
				{#each workspace.profiles as savedProfile (savedProfile.id)}
					<button
						type="button"
						class={[
							'grid min-h-28 gap-3 rounded-panel border bg-bg-elev p-3 text-left transition',
							'hover:border-accent/45 hover:shadow-[var(--shadow-ui-sm)]',
							'focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_var(--ring)]',
							'active:scale-[0.99]',
							workspace.selectedProfileId === savedProfile.id
								? 'border-accent shadow-[var(--shadow-ui-sm)]'
								: 'border-border'
						]}
						onclick={() => selectProfile(savedProfile.id)}
					>
						<span class="flex items-start justify-between gap-3">
							<span class="min-w-0">
								<span class="block truncate font-semibold text-fg">
									{savedProfile.taxpayerName || 'Unnamed taxpayer'}
								</span>
								<span class="mt-1 block font-mono text-xs text-fg-muted">
									{formatTinInput(savedProfile)}
								</span>
							</span>
							<Badge tone={savedProfile.category === 'G' ? 'info' : 'neutral'} size="sm">
								{savedProfile.category === 'G' ? 'Gov' : 'Private'}
							</Badge>
						</span>
						<span class="grid gap-1 text-sm text-fg-muted">
							<span>RDO {savedProfile.rdoCode || 'not set'}</span>
							<span class="truncate">{savedProfile.email || 'No email on file'}</span>
						</span>
					</button>
				{/each}
			</div>
		</Card>

		<Card class="grid gap-5">
			<div class="grid gap-3 md:flex md:items-start md:justify-between">
				<div>
					<p class="font-mono text-xs font-semibold uppercase text-accent">Step 2</p>
					<h2 class="mt-1 text-lg font-semibold text-fg">Verify identity details</h2>
					<p class="text-sm text-fg-muted">
						One TIN field updates the three legacy TIN parts and branch code together.
					</p>
				</div>
				{#if activeProfileRoute}
					<ButtonLink href={activeProfileRoute} size="touch" class="w-full md:w-auto">
						<DocumentAdd size={18} color="currentColor" />
						Open forms
					</ButtonLink>
				{/if}
			</div>

			<Card variant="muted" class="grid gap-3 md:grid-cols-4">
				<div class="md:col-span-2">
					<Input
						label="TIN and branch code"
						help={tinHelp}
						inputmode="numeric"
						placeholder="000-000-000-0000"
						value={tinInput}
						oninput={(event) => updateTinParts(event.currentTarget.value)}
						class="font-mono"
					/>
				</div>
				<Input label="RDO Code" inputmode="numeric" bind:value={workspace.profile.rdoCode} />
				<Select
					label="Category"
					options={categoryOptions}
					bind:value={workspace.profile.category}
				/>
			</Card>

			<div class="grid gap-3 md:grid-cols-2">
				<div class="md:col-span-2">
					<Input label="Taxpayer Name" bind:value={workspace.profile.taxpayerName} />
				</div>
				<Input label="Registered Address" bind:value={workspace.profile.address} />
				<Input label="Registered Address Line 2" bind:value={workspace.profile.address2} />
				<Input label="ZIP Code" inputmode="numeric" bind:value={workspace.profile.zipCode} />
				<Input label="Contact Number" inputmode="tel" bind:value={workspace.profile.contactNumber} />
				<div class="md:col-span-2">
					<Input label="Email" type="email" bind:value={workspace.profile.email} />
				</div>
			</div>

			<Card variant="muted" class="grid gap-2 sm:flex sm:justify-end">
				<Button variant="warn" size="touch" class="w-full sm:w-auto" onclick={saveProfile}>
					Save profile
				</Button>
				<Button
					variant="primary"
					size="touch"
					class="w-full sm:w-auto"
					onclick={() => workspace.syncProfileToForm()}
				>
					Apply to active return
				</Button>
			</Card>
		</Card>
	</div>
</Page>
