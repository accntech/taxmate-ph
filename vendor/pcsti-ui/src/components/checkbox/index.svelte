<script lang="ts">
  import CheckIcon from "@solar-icons/svelte/linear/check";
  import MinusIcon from "@solar-icons/svelte/linear/minus";
  import { checkbox } from "./index.styles";

  import { styleAttributes } from "../../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  type Props = {
    checked: boolean;
    indeterminate?: boolean;
    size?: "sm" | "md";
    class?: string;
  };
  let {
    checked,
    indeterminate = false,
    size = "sm",
    sx,
    class: klass = "",
  }: Props & { sx?: stylex.StyleXStyles } = $props();
</script>

<span
  {...styleAttributes(
    [
      checkbox.root,
      size === "sm" ? checkbox.small : checkbox.medium,
      checked || indeterminate ? checkbox.checked : checkbox.unchecked,
      sx,
    ],
    [klass].flat(Infinity).filter(Boolean).join(" "),
  )}
  aria-hidden="true"
>
  {#if indeterminate}
    <MinusIcon
      class={stylex.attrs(
        checkbox.checkIcon,
        size === "sm" ? checkbox.smallIcon : checkbox.mediumIcon,
      ).class}
      strokeWidth="3"
      aria-hidden="true"
      focusable="false"
    />
  {:else if checked}
    <CheckIcon
      class={stylex.attrs(
        checkbox.checkIcon,
        size === "sm" ? checkbox.smallIcon : checkbox.mediumIcon,
      ).class}
      strokeWidth="3"
      aria-hidden="true"
      focusable="false"
    />
  {/if}
</span>
