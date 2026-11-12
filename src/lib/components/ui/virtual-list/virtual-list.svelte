<script lang="ts" generics="T">
  import { virtualList } from "./virtual-list.styles";

  import { styleAttributes } from "../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";

  type Props = {
    items: T[];
    itemHeight: number;
    overscan?: number;
    class?: string;
    ariaLabel?: string;
    key: (item: T, index: number) => string | number;
    row: Snippet<[item: T, index: number]>;
  };

  let {
    items,
    itemHeight,
    overscan = 6,
    sx,
    class: klass = "",
    ariaLabel,
    key,
    row,
  }: Props & { sx?: stylex.StyleXStyles } = $props();

  let viewport: HTMLDivElement | undefined = $state();
  let scrollTop = $state(0);
  let viewportHeight = $state(0);

  /** Reveal a row and update the render window without waiting for a scroll event. */
  export function scrollToIndex(index: number) {
    if (!viewport || index < 0 || index >= items.length) return;
    const top = index * itemHeight;
    const bottom = top + itemHeight;
    const height = viewport.clientHeight;
    if (top < viewport.scrollTop) {
      viewport.scrollTop = top;
    } else if (bottom > viewport.scrollTop + height) {
      viewport.scrollTop = bottom - height;
    }
    scrollTop = viewport.scrollTop;
  }

  $effect(() => {
    if (!viewport) return;
    const node = viewport;
    const update = () => {
      scrollTop = node.scrollTop;
      viewportHeight = node.clientHeight;
    };
    update();
    node.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => {
      node.removeEventListener("scroll", update);
      ro.disconnect();
    };
  });

  const total = $derived(items.length * itemHeight);
  const start = $derived(
    Math.max(0, Math.floor(scrollTop / itemHeight) - overscan),
  );
  const end = $derived(
    Math.min(
      items.length,
      Math.ceil((scrollTop + viewportHeight) / itemHeight) + overscan,
    ),
  );
  const visible = $derived(items.slice(start, end));
  const offsetY = $derived(start * itemHeight);
</script>

<div
  bind:this={viewport}
  {...styleAttributes(
    [virtualList.viewport, sx],
    [klass].flat(Infinity).filter(Boolean).join(" "),
  )}
  role={ariaLabel ? "list" : undefined}
  aria-label={ariaLabel}
>
  <div
    class={[stylex.attrs(virtualList.spacer).class]}
    style="height: {total}px;"
  >
    <div
      class={[stylex.attrs(virtualList.rows).class]}
      style="transform: translateY({offsetY}px);"
    >
      {#each visible as item, i (key(item, start + i))}
        <div
          style="height: {itemHeight}px;"
          role={ariaLabel ? "listitem" : undefined}
        >
          {@render row(item, start + i)}
        </div>
      {/each}
    </div>
  </div>
</div>
