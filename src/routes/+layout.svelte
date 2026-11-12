<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { styles } from './layout.styles';
	import { page } from '$app/state';
	import {
		listSuiteNavItems,
		buildTaxpayerRoute,
		type SuiteNavItem
	} from '$lib/apps/app-shell';
	import { ebirformsWorkspace as workspace } from '$lib/ebirforms/ebirforms-workspace.svelte';
	import { formatTinInput } from '$lib/profiles/profile';
	import { settings } from '$lib/settings.svelte';
	import Home2 from '@solar-icons/svelte/category/ui/Linear/Home2.svelte';
	import DocumentText from '@solar-icons/svelte/category/notes/Linear/DocumentText.svelte';
	import BillList from '@solar-icons/svelte/category/money/Linear/BillList.svelte';
	import UsersGroupRounded from
		'@solar-icons/svelte/category/users/Linear/UsersGroupRounded.svelte';
	import Settings from '@solar-icons/svelte/category/settings/Linear/Settings.svelte';
	import { onMount } from 'svelte';
	import WindowTitlebar from '$lib/window-titlebar.svelte';
	import { Badge, Sidebar, Topbar, type Crumb } from '$lib/components/ui';
	import '@fontsource-variable/inter';
	import '@fontsource-variable/source-serif-4';
	import '@fontsource/arimo/400.css';
	import '@fontsource/arimo/700.css';
	import '$lib/components/ui/styles/scales.css';
	import '../app.css';

	onMount(() => {
		if (import.meta.env.DEV) void import('virtual:stylex:runtime');
	});

	let { children } = $props();
	let mobileOpen = $state(false);
	let isMobile = $state(false);

	const navItems = listSuiteNavItems();

	let pathname = $derived(page.url.pathname);
	let onSettings = $derived(pathname === '/settings' || pathname.startsWith('/settings/'));
	let crumbs: Crumb[] = $derived.by(() => {
		if (onSettings) return [{ label: 'Settings' }];

		if (pathname === '/ebirforms/taxpayers' || pathname.startsWith('/ebirforms/taxpayers/')) {
			const directory = { label: 'eBIRForms', href: '/ebirforms/taxpayers' };
			if (pathname === directory.href) return [{ label: directory.label }];
			if (pathname === `${directory.href}/new`) return [directory, { label: 'New taxpayer' }];

			const id = page.params.id;
			if (!id) return [directory];
			const taxpayerPath = buildTaxpayerRoute(id);
			const profile = workspace.profiles.find(profile => profile.id === id);
			const taxpayer = {
				label: profile ? formatTinInput(profile) : 'Taxpayer',
				href: taxpayerPath
			};
			if (pathname === `${taxpayerPath}/edit`) return [directory, taxpayer, { label: 'Edit taxpayer' }];
			if (pathname === `${taxpayerPath}/forms`) return [directory, taxpayer, { label: 'Tax Returns' }];
			if (page.params.formCode) {
				return [directory, taxpayer, { label: 'Tax Returns', href: `${taxpayerPath}/forms` },
					{ label: `BIR Form ${page.params.formCode}` }];
			}
			return [directory, { label: taxpayer.label }];
		}

		const current = navItems.find((item) => isCurrent(item));
		return [{ label: current?.name ?? 'Workspace' }];
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
	<span class={stylex.attrs(styles.appIcon).class} aria-hidden="true">
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
	{#if import.meta.env.DEV}
		<link rel="stylesheet" href="/virtual:stylex.css" />
	{/if}
</svelte:head>

<a class="skip-link" href="#main-content">Skip to content</a>

<WindowTitlebar>
	<Topbar {crumbs} onMenu={handleMenu} />
</WindowTitlebar>

<div class="app-shell" data-collapsed={settings.sidebarCollapsed && !isMobile ? 'true' : undefined}>
	<Sidebar
		collapsed={settings.sidebarCollapsed}
		bind:mobileOpen
		bind:isMobile
		storageKey="taxmate-ph-sidebar"
	>
		{#snippet content({ collapsed: sidebarCollapsed })}
			<span
				class={["sidebar-reveal-anim", (sidebarCollapsed ? stylex.attrs(styles.workspaceLabel, styles.collapsedLabel).class : stylex.attrs(styles.workspaceLabel).class)]}
			>
				Workspaces
			</span>
			{#each navItems as item (item.id)}
				<a
					aria-current={isCurrent(item) ? 'page' : undefined}
					class={["sidebar-row-anim", (sidebarCollapsed
						? (isCurrent(item) ? stylex.attrs(styles.navigationRow, styles.collapsedNavigation, styles.activeCollapsedNavigation).class : stylex.attrs(styles.navigationRow, styles.collapsedNavigation).class)
						: (isCurrent(item) ? stylex.attrs(styles.navigationRow, styles.expandedNavigation, styles.activeNavigation).class : stylex.attrs(styles.navigationRow, styles.expandedNavigation).class))]}
					href={item.href}
				>
					{@render appIcon(item.id)}
					<span
						class={["sidebar-reveal-anim", (sidebarCollapsed ? stylex.attrs(styles.navigationCopy, styles.collapsedLabel).class : stylex.attrs(styles.navigationCopy).class)]}
					>
						<span class={stylex.attrs(styles.navigationDetails).class}>
							<span class={stylex.attrs(styles.navigationHeading).class}>
								<span class={stylex.attrs(styles.truncatedLabel).class}>{item.name}</span>
								<Badge tone={item.status === 'placeholder' ? 'neutral' : 'accent'} size="sm">
									{item.stepLabel}
								</Badge>
							</span>
							<span class={stylex.attrs(styles.navigationDescription).class}>
								{item.description}
							</span>
						</span>
					</span>
				</a>
			{/each}

		{/snippet}

		{#snippet footer({ collapsed: sidebarCollapsed })}
			<div class={stylex.attrs(styles.footer).class}>
				<a
					href="/settings"
					aria-current={onSettings ? 'page' : undefined}
					class={["sidebar-row-anim", (sidebarCollapsed
						? (onSettings ? stylex.attrs(styles.navigationRow, styles.collapsedNavigation, styles.activeCollapsedNavigation).class : stylex.attrs(styles.navigationRow, styles.collapsedNavigation).class)
						: (onSettings ? stylex.attrs(styles.navigationRow, styles.expandedSettings, styles.activeNavigation).class : stylex.attrs(styles.navigationRow, styles.expandedSettings).class))]}
				>
					<span class={stylex.attrs(styles.settingsIcon).class} aria-hidden="true">
						<Settings size={18} color="currentColor" />
					</span>
					<span
						class={["sidebar-reveal-anim", (sidebarCollapsed ? stylex.attrs(styles.settingsLabel, styles.collapsedLabel).class : stylex.attrs(styles.settingsLabel).class)]}
					>
						Settings
					</span>
				</a>
			</div>
		{/snippet}
	</Sidebar>

	<div class={stylex.attrs(styles.mainColumn).class}>
		<main id="main-content" class="app-main" tabindex="-1">
			{@render children()}
		</main>
	</div>
</div>
