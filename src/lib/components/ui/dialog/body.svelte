<script lang="ts">
  import { dialogBody } from "./body.styles";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import { ScrollFade } from "../scroll-fade";

  type Props = {
    children?: Snippet;
    hasHeader: boolean;
    scrollBody: boolean;
    scrollFade: boolean;
  };

  let { children, hasHeader, scrollBody, scrollFade }: Props = $props();
</script>

{#if children}
  {#if scrollBody && scrollFade}
    <ScrollFade
      class={stylex.attrs(
        hasHeader && dialogBody.belowHeader,
        dialogBody.fadeFrame,
      ).class}
      trackClass={[dialogBody.scrollable, dialogBody.fadeTrack]}
    >
      {@render children()}
    </ScrollFade>
  {:else}
    <div
      data-dialog-scroll-region={scrollBody ? "" : undefined}
      class={[
        stylex.attrs(
          hasHeader && dialogBody.belowHeader,
          scrollBody && dialogBody.scrollable,
        ).class,
      ]}
    >
      {@render children()}
    </div>
  {/if}
{/if}
