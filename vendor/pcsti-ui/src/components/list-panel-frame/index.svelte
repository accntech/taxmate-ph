<script lang="ts">
  import { listPanel } from "./index.styles";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";

  type Props = {
    density: "compact" | "comfortable";
    selectedCount: number;
    loading?: boolean;
    loadingLabel?: string;
    children: Snippet;
  };

  let {
    density,
    selectedCount,
    loading = false,
    loadingLabel = "Loading records…",
    children,
  }: Props = $props();

  function restoreFocusWhenContentChanges(node: HTMLElement) {
    let focusWasWithin = node.contains(document.activeElement);

    function handleFocusIn() {
      focusWasWithin = true;
    }

    function handleFocusOut(event: FocusEvent) {
      if (loading) return;
      focusWasWithin =
        event.relatedTarget instanceof Node &&
        node.contains(event.relatedTarget);
    }

    node.addEventListener("focusin", handleFocusIn);
    node.addEventListener("focusout", handleFocusOut);

    $effect(() => {
      if (!loading || !focusWasWithin) return;
      queueMicrotask(() => {
        if (!node.contains(document.activeElement)) node.focus();
      });
    });

    return () => {
      node.removeEventListener("focusin", handleFocusIn);
      node.removeEventListener("focusout", handleFocusOut);
    };
  }
</script>

<section
  class={[stylex.attrs(listPanel.root).class]}
  data-select-mode={selectedCount > 0}
  data-density={density}
  data-loading-announcer={loading ? "" : undefined}
  aria-busy={loading}
  tabindex="-1"
  {@attach restoreFocusWhenContentChanges}
>
  {#if loading}
    <span
      class={[stylex.attrs(listPanel.loadingAnnouncement).class]}
      role="status"
      aria-live="polite">{loadingLabel}</span
    >
  {/if}
  {@render children()}
</section>
