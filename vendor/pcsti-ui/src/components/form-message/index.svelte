<script lang="ts" module>
  import { formMessage } from "./index.styles";

  import { styleAttributes } from "../../styles/style-attributes";

  export type FormMessageKind = "status" | "error";
</script>

<script lang="ts">
  import * as stylex from "@stylexjs/stylex";

  import type { Snippet } from "svelte";

  let {
    kind = "status",
    message,
    id,
    sx,
    class: className = "",
    children,
  }: {
    kind?: FormMessageKind;
    message?: string | undefined;
    id?: string;
    class?: string;
    children?: Snippet;
  } & { sx?: stylex.StyleXStyles } = $props();

  const classes = $derived(
    kind === "status" ? formMessage.status : formMessage.error,
  );
</script>

{#if message || children}
  <div
    {id}
    {...styleAttributes(
      [classes, sx],
      [className].flat(Infinity).filter(Boolean).join(" "),
    )}
    role={kind === "status" ? "status" : "alert"}
    aria-live={kind === "status" ? "polite" : "assertive"}
  >
    {#if message}
      {message}
    {:else}
      {@render children?.()}
    {/if}
  </div>
{/if}
