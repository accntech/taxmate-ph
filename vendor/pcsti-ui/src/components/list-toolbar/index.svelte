<script lang="ts">
  import { listToolbar } from "./index.styles";

  import { styleAttributes } from "../../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";

  type Props = {
    search?: Snippet;
    chips?: Snippet;
    filters?: Snippet;
    density?: Snippet;
    columns?: Snippet;
    actions?: Snippet;
    class?: string;
  };

  let {
    search,
    chips,
    filters,
    density,
    columns,
    actions,
    sx,
    class: className = "",
  }: Props & { sx?: stylex.StyleXStyles } = $props();
</script>

<div
  {...styleAttributes(
    [listToolbar.root, sx],
    [className].flat(Infinity).filter(Boolean).join(" "),
  )}
>
  <div class={[stylex.attrs(listToolbar.queryControls).class]}>
    <div class={[stylex.attrs(listToolbar.search).class]}>
      {@render search?.()}
    </div>

    <div class={[stylex.attrs(listToolbar.chips).class]}>
      {@render chips?.()}
    </div>

    <div class={[stylex.attrs(listToolbar.filters).class]}>
      {@render filters?.()}
    </div>
  </div>

  <div class={[stylex.attrs(listToolbar.actions).class]}>
    <div class={[stylex.attrs(listToolbar.viewControls).class]}>
      {@render density?.()}
      {@render columns?.()}
    </div>
    {@render actions?.()}
  </div>
</div>
