<script lang="ts">
  import { dialogFooter } from "./footer.styles";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";

  type Props = {
    footer?: Snippet;
  };

  let { footer }: Props = $props();
</script>

{#if footer}
  <div class={[stylex.attrs(dialogFooter.root).class]}>
    {@render footer()}
  </div>
{/if}
