<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './nav-item-wrapper.styles';
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
	const iconBase = stylex.attrs(wrapperStyles.icon).class;
	const labelBase = ["sidebar-reveal-anim", stylex.attrs(wrapperStyles.label).class].join(' ');
</script>

{#if parent}
	{@const parentItem = item as Extract<NavItem, { children: unknown }>}
	<div data-state={expanded ? 'open' : 'closed'}>
		<button
			type="button"
			class={["group/nr sidebar-row-anim", stylex.attrs(wrapperStyles.row, collapsed ? wrapperStyles.collapsed : wrapperStyles.expanded).class]}
			data-active={active ? 'true' : undefined}
			aria-expanded={expanded}
			onclick={() => onToggle?.()}
		>
			{#if parentItem.icon}
				<span class="{parentItem.icon} {iconBase}" aria-hidden="true"></span>
			{/if}
			<span class="{labelBase} {collapsed ? stylex.attrs(wrapperStyles.hiddenLabel).class : stylex.attrs(wrapperStyles.visibleLabel).class}">
				{parentItem.label}
			</span>
			<span
				class={[
					["sidebar-reveal-anim", stylex.attrs(wrapperStyles.caret).class].join(' '),
					expanded ? stylex.attrs(wrapperStyles.expandedCaret).class : stylex.attrs(wrapperStyles.collapsedCaret).class,
					collapsed ? stylex.attrs(wrapperStyles.hiddenCaret).class : stylex.attrs(wrapperStyles.visibleCaret).class
				]}
				aria-hidden="true"
			>
				<AltArrowDown size={13} color="currentColor" />
			</span>
		</button>

		{#if expanded && !collapsed}
			<ul class={stylex.attrs(wrapperStyles.children).class}>
				{#each parentItem.children as child (child.href)}
					<li>
						<a
							href={child.href}
							class={stylex.attrs(wrapperStyles.childLink).class}
							data-active={isActivePath(child.href, activePath) ? 'true' : undefined}
						>
							<span class={stylex.attrs(wrapperStyles.childMarker).class} aria-hidden="true"></span>
							<span class={stylex.attrs(wrapperStyles.childLabel).class}>{child.label}</span>
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
		class={["group/nr sidebar-row-anim", stylex.attrs(wrapperStyles.row, collapsed ? wrapperStyles.collapsed : wrapperStyles.expanded).class]}
		data-active={selfActive ? 'true' : undefined}
	>
		{#if leaf.icon}
			<span class="{leaf.icon} {iconBase}" aria-hidden="true"></span>
		{/if}
		<span class="{labelBase} {collapsed ? stylex.attrs(wrapperStyles.hiddenLabel).class : stylex.attrs(wrapperStyles.visibleLabel).class}">
			{leaf.label}
		</span>
	</a>
{/if}
