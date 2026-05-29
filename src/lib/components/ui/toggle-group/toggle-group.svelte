<script lang="ts" generics="T extends string">
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
		'relative inline-flex items-stretch gap-0',
		variant === 'outline' && 'min-h-8 rounded-md border border-border bg-bg-elev-2 p-0.5',
		className
	]}
>
	{#each options as option (option.value)}
		{@const pressed = value === option.value}
		<button
			type="button"
			aria-label={option.label}
			aria-pressed={pressed}
			onclick={() => select(option.value)}
			class={[
				'relative z-1 grid place-items-center rounded-sm border border-transparent px-2',
				'transition-[color,background-color,border-color,box-shadow] duration-150 outline-none',
				'focus-visible:border-[color-mix(in_oklch,var(--accent)_60%,var(--border))]',
				'focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,var(--accent)_18%,transparent)]',
				variant === 'outline'
					? pressed
						? 'bg-bg-elev text-fg shadow-sm'
						: 'text-fg-muted hover:text-fg'
					: pressed
						? 'bg-bg-hover text-fg'
						: 'text-fg-subtle hover:bg-bg-hover hover:text-fg'
			]}
		>
			{#if option.icon}
				<span class={option.icon} aria-hidden="true"></span>
			{:else}
				{option.label}
			{/if}
		</button>
	{/each}
</div>
