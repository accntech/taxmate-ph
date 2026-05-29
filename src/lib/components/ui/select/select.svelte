<script lang="ts" generics="T extends string">
	import type { Snippet } from 'svelte';
	import AltArrowDown from '@solar-icons/svelte/category/arrows/Linear/AltArrowDown.svelte';

	type SelectOption<TValue extends string> = {
		value: TValue;
		label: string;
		meta?: string;
	};

	let {
		value = $bindable<T>(),
		options,
		onchange,
		label = '',
		placeholder = 'Select an option',
		invalid = false,
		disabled = false,
		class: className = '',
		leading
	}: {
		value: T;
		options: SelectOption<T>[];
		onchange?: (value: T) => void;
		label?: string;
		placeholder?: string;
		invalid?: boolean;
		disabled?: boolean;
		class?: string;
		leading?: Snippet;
	} = $props();

	const uid = $props.id();
	const labelId = `${uid}-label`;
	const listboxId = `${uid}-listbox`;
	const selectedIndex = $derived(options.findIndex((option) => option.value === value));
	const selectedOption = $derived(selectedIndex >= 0 ? options[selectedIndex] : undefined);
	let open = $state(false);
	let activeIndex = $state(-1);
	let root: HTMLDivElement | undefined = $state();

	function optionId(index: number) {
		return `${uid}-option-${index}`;
	}

	function setOpen(next: boolean) {
		if (disabled || options.length === 0) {
			return;
		}

		open = next;
		activeIndex = next ? Math.max(selectedIndex, 0) : -1;
	}

	function select(option: SelectOption<T>) {
		value = option.value;
		onchange?.(option.value);
		setOpen(false);
	}

	function move(step: 1 | -1) {
		if (!open) {
			setOpen(true);
			return;
		}

		activeIndex = (activeIndex + step + options.length) % options.length;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			move(1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			move(-1);
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (!open) {
				setOpen(true);
				return;
			}
			const option = options[activeIndex];
			if (option) {
				select(option);
			}
		} else if (event.key === 'Escape') {
			event.preventDefault();
			setOpen(false);
		}
	}

	function onDocumentPointerdown(event: PointerEvent) {
		if (!open || !root || !(event.target instanceof Node)) {
			return;
		}

		if (!root.contains(event.target)) {
			setOpen(false);
		}
	}
</script>

<svelte:document onpointerdown={onDocumentPointerdown} />

<div bind:this={root} class="relative grid gap-1.5 {className}">
	{#if label}
		<span id={labelId} class="text-[13px] font-medium text-fg-muted">{label}</span>
	{/if}
	<button
		type="button"
		role="combobox"
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-controls={listboxId}
		aria-labelledby={label ? labelId : undefined}
		aria-invalid={invalid || undefined}
		aria-disabled={disabled || undefined}
		{disabled}
		onclick={() => setOpen(!open)}
		onkeydown={onKeydown}
		class={[
			'flex min-h-9 w-full items-center justify-between gap-2 rounded-md border border-border',
			'bg-bg-input px-3 py-1.5 text-left text-sm text-fg transition-all outline-none',
			'hover:border-[color-mix(in_oklch,var(--fg-subtle)_30%,var(--border))]',
			'focus-visible:border-[color-mix(in_oklch,var(--accent)_60%,var(--border))]',
			'focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,var(--accent)_18%,transparent)]',
			open && 'bg-bg-elev',
			invalid &&
				'border-[color-mix(in_oklch,var(--danger)_60%,var(--border))]! shadow-[0_0_0_3px_color-mix(in_oklch,var(--danger)_12%,transparent)]!'
		]}
	>
		{@render leading?.()}
		<span class="min-w-0 flex-1 truncate {selectedOption ? '' : 'text-fg-subtle'}">
			{selectedOption?.label ?? placeholder}
		</span>
		<span class="text-fg-subtle transition-transform {open ? 'rotate-180' : ''}" aria-hidden="true">
			<AltArrowDown size={16} color="currentColor" />
		</span>
	</button>

	{#if open}
		<div
			id={listboxId}
			role="listbox"
			tabindex="-1"
			aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
			class="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-auto rounded-md border border-border bg-bg-elev p-1 shadow-lg"
		>
			{#each options as option, index (option.value)}
				<button
					id={optionId(index)}
					type="button"
					role="option"
					aria-selected={option.value === value}
					tabindex="-1"
					onmouseenter={() => (activeIndex = index)}
					onclick={() => select(option)}
					class={[
						'grid w-full gap-0.5 rounded-md px-2.5 py-2 text-left text-sm transition',
						'outline-none',
						index === activeIndex && 'bg-bg-hover',
						option.value === value ? 'bg-accent-soft text-accent' : 'text-fg hover:bg-bg-hover'
					]}
				>
					<span class="font-medium">{option.label}</span>
					{#if option.meta}
						<span class="text-xs text-fg-subtle">{option.meta}</span>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
