<script lang="ts">
  import { skeleton } from "./index.styles";

  import { styleAttributes } from "../../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";

  import type { HTMLAttributes } from "svelte/elements";

  let {
    sx,
    class: className = "",
    ...rest
  }: { class?: string } & Omit<HTMLAttributes<HTMLDivElement>, "class"> & {
      sx?: stylex.StyleXStyles;
    } = $props();
</script>

<div
  {...rest}
  {...styleAttributes(
    [skeleton.root, sx],
    [className].flat(Infinity).filter(Boolean).join(" "),
    rest.style,
  )}
></div>
