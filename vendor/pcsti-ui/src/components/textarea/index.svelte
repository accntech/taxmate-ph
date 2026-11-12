<script lang="ts">
  import { textarea as textareaLayout } from "./index.styles";

  import { styleAttributes } from "../../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";

  import type { HTMLTextareaAttributes } from "svelte/elements";

  export type TextareaSize = "normal" | "compact";

  let {
    value = $bindable(""),
    invalid = false,
    size = "normal",
    sx,
    class: className = "",
    ...rest
  }: {
    value?: string;
    invalid?: boolean;
    size?: TextareaSize;
    class?: string;
  } & Omit<HTMLTextareaAttributes, "value" | "class" | "size"> & {
      sx?: stylex.StyleXStyles;
    } = $props();

  const baseClass = textareaLayout.root;

  const sizeClasses: Record<TextareaSize, stylex.StyleXStyles> = {
    normal: textareaLayout.normal,
    compact: textareaLayout.compact,
  };

  const textareaClass = $derived([baseClass, sizeClasses[size]]);
</script>

<textarea
  bind:value
  {...rest}
  {...styleAttributes(
    [textareaClass, sx],
    [className].flat(Infinity).filter(Boolean).join(" "),
    rest.style,
  )}
  aria-invalid={invalid || rest["aria-invalid"] || undefined}
  data-invalid={invalid ? "true" : undefined}></textarea>
