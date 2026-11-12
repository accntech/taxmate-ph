<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { StyleXStyles } from "@stylexjs/stylex";
  import { styleAttributes } from "../styles/style-attributes";
  type Props = Omit<
    HTMLInputAttributes,
    "type" | "role" | "checked" | "indeterminate"
  > & {
    checked?: boolean;
    indeterminate?: boolean;
    sx?: StyleXStyles;
  };
  let {
    checked = $bindable(false),
    indeterminate = $bindable(false),
    sx,
    class: className,
    style,
    ...rest
  }: Props = $props();
</script>

<input
  {...rest}
  type="checkbox"
  bind:checked
  bind:indeterminate
  {...styleAttributes(sx, "", style)}
  class={[styleAttributes(sx).class, className]}
/>
