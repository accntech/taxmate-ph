<script lang="ts">
  import * as stylex from '@stylexjs/stylex';
  import { SelectTrigger as SdkSelectTrigger, type SelectTriggerProps } from '@ui-sdk/svelte/select';
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import AltArrowDown from '@solar-icons/svelte/category/arrows/Linear/AltArrowDown.svelte';
  import { wrapperStyles } from './select-trigger-wrapper.styles';

  let {
    ref = $bindable<HTMLButtonElement | null>(null),
    class: className = '',
    children,
    'aria-invalid': ariaInvalid,
    ...rest
  }: Omit<HTMLButtonAttributes, 'children' | 'class'> & SelectTriggerProps & {
    class?: string;
    ref?: HTMLButtonElement | null;
    children?: Snippet;
  } = $props();
</script>

<SdkSelectTrigger
  {...rest}
  class={['select-normal-size', stylex.attrs(wrapperStyles.root).class, 'field-focus', className]}
>
  {#snippet render({ props })}
    <button {...props} bind:this={ref} role="combobox" aria-invalid={ariaInvalid}>
      {@render children?.()}
      <span class={stylex.attrs(wrapperStyles.icon).class} aria-hidden="true">
        <AltArrowDown size={16} color="currentColor" />
      </span>
    </button>
  {/snippet}
</SdkSelectTrigger>

<style>
  :global(.select-normal-size[data-slot="select-trigger"]) { min-height: var(--form-control-height); font-size: var(--form-control-size); }
  :global(.field-focus[data-slot='select-trigger']:focus-visible) { border-color: var(--field-focus-border); background-color: var(--bg-elev); box-shadow: 0 0 0 3px var(--field-focus-halo); }
  :global(.field-focus[data-slot='select-trigger'][aria-invalid='true']) { border-color: var(--field-error-border); box-shadow: 0 0 0 3px var(--field-error-halo); }
  :global(.field-focus[data-slot='select-trigger'][aria-invalid='true']:focus-visible) { box-shadow: 0 0 0 3px var(--field-error-focus-halo); }
</style>
