<script lang="ts" generics="T extends string">
	import { Toggle } from '@ui-sdk/svelte/toggle';
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './toggle-group-wrapper.styles';
	type Option<TValue extends string> = {
		value: TValue;
		label: string;
		icon?: string;
	};

	let {
		value = $bindable<T>(),
		options,
		onchange,
		variant = 'outline',
		ariaLabel,
		class: className = ''
	}: {
		value: T;
		options: Option<T>[];
		onchange?: (value: T) => void;
		variant?: 'outline' | 'ghost';
		ariaLabel: string;
		class?: string;
	} = $props();

	function select(next: T) {
		if (next === value) {
			return;
		}

		value = next;
		onchange?.(next);
	}
</script>

<div
	role="group"
	aria-label={ariaLabel}
	class={[
		stylex.attrs(wrapperStyles.root, variant === 'outline' && wrapperStyles.outlined).class,
		className
	]}
>
	{#each options as option (option.value)}
		{@const pressed = value === option.value}
		<Toggle
			aria-label={option.label}
			{pressed}
			onPressedChange={(next, details) => {
				details.cancel();
				if (next) select(option.value);
			}}
			class={stylex.attrs(wrapperStyles.option, wrapperStyles.motion, wrapperStyles.focusBorder, wrapperStyles.focusHalo,
				variant === 'outline' ? pressed ? wrapperStyles.pressedOutline : wrapperStyles.idleOutline : pressed ? wrapperStyles.pressedGhost : wrapperStyles.idleGhost
			).class}
		>
			{#if option.icon}
				<span class={option.icon} aria-hidden="true"></span>
			{:else}
				{option.label}
			{/if}
		</Toggle>
	{/each}
</div>
