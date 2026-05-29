<script lang="ts">
	import { page } from '$app/state';
	import {
		getFieldKitSteps,
		listSuiteNavItems,
		type SuiteNavItem
	} from '$lib/apps/app-shell';
	import { settings } from '$lib/settings.svelte';
	import Home2 from '@solar-icons/svelte/category/ui/Linear/Home2.svelte';
	import DocumentText from '@solar-icons/svelte/category/notes/Linear/DocumentText.svelte';
	import BillList from '@solar-icons/svelte/category/money/Linear/BillList.svelte';
	import UsersGroupRounded from
		'@solar-icons/svelte/category/users/Linear/UsersGroupRounded.svelte';
	import Settings from '@solar-icons/svelte/category/settings/Linear/Settings.svelte';
	import { onMount } from 'svelte';
	import { Badge, Sidebar, Topbar, type Crumb } from '$lib/components/ui';
	import '@fontsource-variable/inter';
	import '@fontsource-variable/source-serif-4';
	import '@fontsource/arimo/400.css';
	import '@fontsource/arimo/700.css';
	import '../app.css';

	const appLogoPath = '/brand/taxmate-logo.svg';
	let { children } = $props();
	let mobileOpen = $state(false);
	let isMobile = $state(false);

	const navItems = listSuiteNavItems();
	const fieldKitSteps = getFieldKitSteps();

	let pathname = $derived(page.url.pathname);
	let onSettings = $derived(pathname === '/settings' || pathname.startsWith('/settings/'));
	let crumbs: Crumb[] = $derived.by(() => {
		if (onSettings) {
			return [{ label: 'TaxMate PH', href: '/' }, { label: 'Settings' }];
		}

		const current = navItems.find((item) => isCurrent(item));
		return [{ label: 'TaxMate PH', href: '/' }, { label: current?.name ?? 'Workspace' }];
	});

	function handleMenu() {
		if (isMobile) {
			mobileOpen = !mobileOpen;
			return;
		}

		settings.setSidebarCollapsed(!settings.sidebarCollapsed);
	}

	function isCurrent(item: SuiteNavItem) {
		if (item.id === 'home') {
			return pathname === '/';
		}

		if (item.id === 'ebirforms') {
			return pathname.startsWith('/ebirforms');
		}

		return pathname === item.href || pathname.startsWith(`${item.href}/`);
	}

	onMount(() => settings.init());
</script>

{#snippet appIcon(id: SuiteNavItem['id'], size = 18)}
	<span class="grid size-5 place-items-center" aria-hidden="true">
		{#if id === 'home'}
			<Home2 {size} color="currentColor" />
		{:else if id === 'ebirforms'}
			<DocumentText {size} color="currentColor" />
		{:else if id === 'vat-relief'}
			<BillList {size} color="currentColor" />
		{:else}
			<UsersGroupRounded {size} color="currentColor" />
		{/if}
	</span>
{/snippet}

<svelte:head>
	<title>TaxMate PH</title>
</svelte:head>

<a class="skip-link" href="#main-content">Skip to content</a>

<div class="app-shell" data-collapsed={settings.sidebarCollapsed && !isMobile ? 'true' : undefined}>
	<Sidebar
		collapsed={settings.sidebarCollapsed}
		bind:mobileOpen
		bind:isMobile
		storageKey="taxmate-ph-sidebar"
	>
		{#snippet header({ collapsed: sidebarCollapsed })}
			<a
				class={[
					'sidebar-row-anim text-fg hover:bg-bg-hover',
					sidebarCollapsed
						? 'grid size-11 grid-cols-[2rem_0fr] items-center justify-center gap-0 overflow-hidden rounded-md p-1.5'
						: 'grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] items-center gap-2 rounded-md p-1.5'
				]}
				href="/"
				aria-label="TaxMate PH suite"
			>
				<span
					class="size-8 shrink-0 bg-accent"
					style="-webkit-mask: url('{appLogoPath}') center / contain no-repeat; mask: url('{appLogoPath}') center / contain no-repeat;"
					aria-hidden="true"
				></span>
				<span class={['sidebar-reveal-anim min-w-0', sidebarCollapsed && 'max-w-0 opacity-0']}>
					<span class="block text-sm font-semibold leading-tight">TaxMate PH</span>
					<span class="block text-xs leading-tight text-fg-subtle">
						Local compliance workspace
					</span>
				</span>
			</a>
		{/snippet}

		{#snippet content({ collapsed: sidebarCollapsed })}
			<span
				class={[
					'sidebar-reveal-anim px-2.5 text-[11px] font-semibold uppercase text-fg-subtle',
					sidebarCollapsed && 'max-w-0 opacity-0'
				]}
			>
				Workspaces
			</span>
			{#each navItems as item (item.id)}
				<a
					aria-current={isCurrent(item) ? 'page' : undefined}
					class={[
						'sidebar-row-anim group/nav grid items-center rounded-md border border-transparent text-fg-muted',
						'hover:bg-bg-hover hover:text-fg active:scale-[0.98]',
						'focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_var(--ring)]',
						sidebarCollapsed
							? 'mx-auto size-11 grid-cols-[1.25rem_0fr] justify-center gap-0 p-0'
							: 'grid min-h-13 grid-cols-[auto_minmax(0,1fr)] gap-3 px-3 py-2',
						isCurrent(item) &&
							(sidebarCollapsed
								? 'bg-accent-soft text-accent'
								: 'border-border bg-bg-elev text-fg shadow-[var(--shadow-ui-sm)]')
					]}
					href={item.href}
				>
					{@render appIcon(item.id)}
					<span
						class={[
							'sidebar-reveal-anim grid min-w-0',
							sidebarCollapsed && 'max-w-0 opacity-0'
						]}
					>
						<span class="grid w-[11.75rem] gap-1">
							<span class="flex min-w-0 items-center justify-between gap-2">
								<span class="truncate">{item.name}</span>
								<Badge tone={item.status === 'placeholder' ? 'neutral' : 'accent'} size="sm">
									{item.stepLabel}
								</Badge>
							</span>
							<span class="text-xs leading-snug whitespace-normal text-fg-subtle">
								{item.description}
							</span>
						</span>
					</span>
				</a>
			{/each}

			<div
				class={[
					'mt-3 grid gap-3 border-t border-border-soft px-2 pt-3',
					sidebarCollapsed && 'hidden'
				]}
				aria-label="eBIRForms preparation steps"
			>
				{#each fieldKitSteps as step, index (step.id)}
					<div class="grid grid-cols-[auto_minmax(0,1fr)] gap-2.5">
						<span
							class="grid size-6 place-items-center rounded-full border border-accent/25 bg-accent-soft text-xs font-bold text-accent"
						>
							{index + 1}
						</span>
						<span class="min-w-0">
							<span class="block text-xs font-semibold text-fg">{step.label}</span>
							<span class="block text-[11px] leading-snug text-fg-subtle">
								{step.description}
							</span>
						</span>
					</div>
				{/each}
			</div>
		{/snippet}

		{#snippet footer({ collapsed: sidebarCollapsed })}
			<div class="p-3">
				<a
					href="/settings"
					aria-current={onSettings ? 'page' : undefined}
					class={[
						'sidebar-row-anim group/nav grid items-center rounded-md border border-transparent text-fg-muted',
						'hover:bg-bg-hover hover:text-fg active:scale-[0.98]',
						'focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_var(--ring)]',
						sidebarCollapsed
							? 'mx-auto size-11 grid-cols-[1.25rem_0fr] justify-center gap-0 p-0'
							: 'min-h-11 grid-cols-[auto_minmax(0,1fr)] gap-3 px-3 py-2',
						onSettings &&
							(sidebarCollapsed
								? 'bg-accent-soft text-accent'
								: 'border-border bg-bg-elev text-fg shadow-[var(--shadow-ui-sm)]')
					]}
				>
					<span class="grid size-5 shrink-0 place-items-center" aria-hidden="true">
						<Settings size={18} color="currentColor" />
					</span>
					<span
						class={[
							'sidebar-reveal-anim min-w-0 truncate text-sm font-medium',
							sidebarCollapsed && 'max-w-0 opacity-0'
						]}
					>
						Settings
					</span>
				</a>
			</div>
		{/snippet}
	</Sidebar>

	<div class="min-w-0">
		<Topbar {crumbs} onMenu={handleMenu} />

		<main id="main-content" class="app-main" tabindex="-1">
			{@render children()}
		</main>
	</div>
</div>
