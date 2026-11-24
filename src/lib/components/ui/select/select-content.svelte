<script lang="ts">
  import * as stylex from '@stylexjs/stylex';
  import { Button } from '@ui-sdk/svelte/button';
  import { SelectContent as SdkSelectContent, SelectList, type SelectContentProps } from '@ui-sdk/svelte/select';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import AltArrowDown from '@solar-icons/svelte/category/arrows/Linear/AltArrowDown.svelte';
  import AltArrowUp from '@solar-icons/svelte/category/arrows/Linear/AltArrowUp.svelte';
  import { wrapperStyles } from './select-content-wrapper.styles';

  let {
    ref = $bindable<HTMLDivElement | null>(null),
    class: className = '',
    sideOffset = 4,
    style: inlineStyle,
    children,
    ...rest
  }: Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'> & SelectContentProps & {
    class?: string;
    container?: DocumentFragment | Element | null;
    ref?: HTMLDivElement | null;
    children?: Snippet;
  } = $props();

  let list = $state<HTMLDivElement | null>(null);
  let canScrollUp = $state(false);
  let canScrollDown = $state(false);

  function syncScroll() {
    if (!list) return;
    canScrollUp = list.scrollTop > 0;
    canScrollDown = list.scrollTop < list.scrollHeight - list.clientHeight - 1;
  }

  function observeList(node: HTMLDivElement) {
    list = node;
    syncScroll();
    const observer = new ResizeObserver(syncScroll);
    observer.observe(node);
    return () => observer.disconnect();
  }
</script>

<SdkSelectContent
  {...rest}
  {sideOffset}
  class={[stylex.attrs(wrapperStyles.root).class, className]}
  style={["--select-available-height: var(--available-height); min-width: var(--anchor-width); max-height: min(18rem, var(--available-height))", inlineStyle].filter(Boolean).join(";")}
>
  {#snippet render({ props })}
    <div {...props} bind:this={ref}>
      {#if canScrollUp}
        <Button
          aria-label="Scroll options up"
          tabindex={-1}
          class={stylex.attrs(wrapperStyles.scrollButton).class}
          onpointerdown={(event) => event.preventDefault()}
          onclick={() => list?.scrollBy({ top: -48 })}
        ><AltArrowUp size={16} color="currentColor" /></Button>
      {/if}
      <SelectList
        onscroll={syncScroll}
        class={stylex.attrs(wrapperStyles.viewport).class}
        style="overflow-y: auto; max-height: min(16rem, calc(var(--select-available-height) - 2rem));"
      >
        {#snippet render({ props: listProps })}
          <div {...listProps} {@attach observeList}>
            {@render children?.()}
          </div>
        {/snippet}
      </SelectList>
      {#if canScrollDown}
        <Button
          aria-label="Scroll options down"
          tabindex={-1}
          class={stylex.attrs(wrapperStyles.scrollButton).class}
          onpointerdown={(event) => event.preventDefault()}
          onclick={() => list?.scrollBy({ top: 48 })}
        ><AltArrowDown size={16} color="currentColor" /></Button>
      {/if}
    </div>
  {/snippet}
</SdkSelectContent>
