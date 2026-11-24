<script lang="ts">
  import * as stylex from '@stylexjs/stylex';
  import { SelectItem as SdkSelectItem, type SelectItemProps } from '@ui-sdk/svelte/select';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import CheckCircle from '@solar-icons/svelte/category/ui/Linear/CheckCircle.svelte';
  import { wrapperStyles } from './select-item-wrapper.styles';

  let {
    ref = $bindable<HTMLDivElement | null>(null),
    class: className = '',
    value,
    label,
    children: content,
    ...rest
  }: Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'> & SelectItemProps<string> & {
    class?: string;
    ref?: HTMLDivElement | null;
    children?: Snippet<[{ selected: boolean; highlighted: boolean }]>;
  } = $props();
</script>

<SdkSelectItem {...rest} {value} {label} class={[stylex.attrs(wrapperStyles.root).class, className]}>
  {#snippet render({ props, state })}
    <div {...props} bind:this={ref}>
      <span class={stylex.attrs(wrapperStyles.selectionIndicator).class} aria-hidden="true">
        {#if state.selected}<CheckCircle size={16} color="currentColor" />{/if}
      </span>
      {#if content}
        {@render content({ selected: state.selected, highlighted: state.highlighted })}
      {:else}
        {label || value}
      {/if}
    </div>
  {/snippet}
</SdkSelectItem>
