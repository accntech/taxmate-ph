<script lang="ts">
  import { lineBar } from "./line-bar-loader.styles";

  import { styleAttributes } from "../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";

  let {
    sx,
    class: className = "",
    containerClass = "",
  }: {
    class?: string;
    containerClass?: string;
  } & { sx?: stylex.StyleXStyles } = $props();
</script>

<div class={containerClass}>
  <div
    {...styleAttributes(
      [lineBar.progress, sx],
      ["loader", className].flat(Infinity).filter(Boolean).join(" "),
    )}
  ></div>
</div>

<style>
  .loader {
    animation: loader 5s linear infinite;
  }

  @keyframes loader {
    0% {
      width: 1%;
      opacity: 0;
    }

    30% {
      width: 50%;
    }

    50% {
      width: 100%;
      opacity: 1;
    }

    100% {
      width: 1%;
      opacity: 0;
    }
  }
</style>
