<script lang="ts">
	import { isActivePath, isParent, type NavItem } from '../types';
	import AltArrowDown from '@solar-icons/svelte/category/arrows/Linear/AltArrowDown.svelte';

	let {
		item,
		activePath,
		collapsed = false,
		expanded = false,
		onToggle
	}: {
		item: NavItem;
		activePath: string;
		collapsed?: boolean;
		expanded?: boolean;
		onToggle?: () => void;
	} = $props();

	const parent = $derived(isParent(item));
	const selfActive = $derived(!parent && isActivePath((item as { href: string }).href, activePath));
	const descendantActive = $derived(
		parent &&
			(item as { children: { href: string }[] }).children.some((child) =>
				isActivePath(child.href, activePath)
			)
	);
	const active = $derived(selfActive || descendantActive);
	const rowBase =
		'group/nr sidebar-row-anim flex w-full cursor-pointer items-center rounded-md border border-transparent bg-transparent py-[0.4375rem] text-left text-[13px] text-fg-muted outline-none select-none hover:bg-bg-hover hover:text-fg active:scale-[0.98] data-[active]:border-border data-[active]:bg-bg-elev data-[active]:text-fg data-[active]:shadow-sm focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_var(--ring)]';
	const rowCollapsed = 'justify-center gap-0 px-3.5';
	const rowExpanded = 'gap-2.5 px-2.5';
	const iconBase = 'size-4 flex-none opacity-85 group-data-[active]/nr:text-accent';
	const labelBase = 'sidebar-reveal-anim min-w-0 flex-1 truncate';
</script>

{#if parent}
	{@const parentItem = item as Extract<NavItem, { children: unknown }>}
	<div data-state={expanded ? 'open' : 'closed'}>
		<button
			type="button"
			class="{rowBase} {collapsed ? rowCollapsed : rowExpanded}"
			data-active={active ? 'true' : undefined}
			aria-expanded={expanded}
			onclick={() => onToggle?.()}
		>
			{#if parentItem.icon}
				<span class="{parentItem.icon} {iconBase}" aria-hidden="true"></span>
			{/if}
			<span class="{labelBase} {collapsed ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'}">
				{parentItem.label}
			</span>
			<span
				class={[
					'sidebar-reveal-anim text-fg-subtle transition-transform',
					expanded ? 'rotate-0' : '-rotate-90',
					collapsed ? 'w-0 opacity-0' : 'w-3 opacity-100'
				]}
				aria-hidden="true"
			>
				<AltArrowDown size={13} color="currentColor" />
			</span>
		</button>

		{#if expanded && !collapsed}
			<ul class="mb-1.5 ml-[1.375rem] mt-0.5 flex list-none flex-col gap-px border-l border-border-soft pl-2.5">
				{#each parentItem.children as child (child.href)}
					<li>
						<a
							href={child.href}
							class="flex items-center gap-2 rounded-md border border-transparent px-2.5 py-[0.3125rem] text-[12.5px] text-fg-muted transition hover:bg-bg-hover hover:text-fg data-active:bg-bg-elev data-active:text-fg"
							data-active={isActivePath(child.href, activePath) ? 'true' : undefined}
						>
							<span class="size-1 flex-none rounded-full bg-fg-subtle" aria-hidden="true"></span>
							<span class="truncate">{child.label}</span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
{:else}
	{@const leaf = item as Extract<NavItem, { href: string }>}
	<a
		href={leaf.href}
		class="{rowBase} {collapsed ? rowCollapsed : rowExpanded}"
		data-active={selfActive ? 'true' : undefined}
	>
		{#if leaf.icon}
			<span class="{leaf.icon} {iconBase}" aria-hidden="true"></span>
		{/if}
		<span class="{labelBase} {collapsed ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'}">
			{leaf.label}
		</span>
	</a>
{/if}
