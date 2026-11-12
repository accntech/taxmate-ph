<script lang="ts">
  import { type ButtonSize } from "../button/base";
  import { type ButtonVariant } from "../button/base";

  import * as stylex from "@stylexjs/stylex";

  import type { Snippet } from "svelte";

  import { Button } from "../button/base";
  let {
    type = "submit",
    variant = "primary",
    size = "normal",
    sx,
    class: className = "",
    children,
    ...rest
  }: {
    type?: "button" | "submit" | "reset" | null;
    variant?: ButtonVariant;
    size?: ButtonSize;
    class?: string;
    children?: Snippet;
    disabled?: boolean;
  } & { sx?: stylex.StyleXStyles } = $props();
</script>

<Button
  {type}
  {variant}
  {size}
  {sx}
  class={[className].filter(Boolean).join(" ")}
  {...rest}
>
  {@render children?.()}
</Button>
