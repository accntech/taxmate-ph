<script lang="ts">
  import { Icon as SolarIcon } from "../icon";

  import { glyphs } from "../../icons";

  import { bulkBar } from "./index.styles";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import type { Attachment } from "svelte/attachments";

  type Props = {
    count: number;
    onclear: () => void;
    children: Snippet;
  };
  let { count, onclear, children }: Props = $props();

  let stuck = $state(false);

  const watchStuck: Attachment = (node) => {
    const topbarH = getComputedStyle(document.documentElement)
      .getPropertyValue("--topbar-h")
      .trim();
    const stickTop = parseFloat(topbarH) || 56;
    const io = new IntersectionObserver(
      ([entry]) => {
        stuck =
          !entry.isIntersecting && entry.boundingClientRect.top <= stickTop;
      },
      { rootMargin: `-${stickTop}px 0px 0px 0px`, threshold: 0 },
    );
    io.observe(node);
    return () => io.disconnect();
  };
</script>

<div
  {@attach watchStuck}
  class={[stylex.attrs(bulkBar.sentinel).class]}
  aria-hidden="true"
></div>
<div
  role="region"
  aria-label="Bulk actions"
  data-stuck={stuck}
  class={[stylex.attrs(bulkBar.root).class]}
>
  <span class={[stylex.attrs(bulkBar.selectionSummary).class]}>
    <span class={[stylex.attrs(bulkBar.selectionDot).class]} aria-hidden="true"
    ></span>
    <span class={[stylex.attrs(bulkBar.count).class]} aria-live="polite"
      >{count}</span
    >
  </span>
  <span class={[stylex.attrs(bulkBar.selectedLabel).class]}>selected</span>
  <span class={[stylex.attrs(bulkBar.separator).class]} aria-hidden="true"
  ></span>
  {@render children()}
  <button
    type="button"
    onclick={onclear}
    aria-label="Clear selection"
    class={[stylex.attrs(bulkBar.clearButton).class]}
  >
    <span
      data-icon
      class={[stylex.attrs([bulkBar.clearIcon]).class]}
      aria-hidden="true"><SolarIcon icon={glyphs.closeCircle} /></span
    >
    <span class={[stylex.attrs(bulkBar.shortClearLabel).class]}>Clear</span>
    <span class={[stylex.attrs(bulkBar.longClearLabel).class]}
      >Clear selection</span
    >
  </button>
</div>
