<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { useDeletionState } from "./state.svelte";
  import { deletionStatus } from "./status.styles";
  import { Icon } from "../icon/base";
  import { glyphs } from "../glyphs";

  let { id, compact = false }: { id: string; compact?: boolean } = $props();
  const deletion = useDeletionState();
  const status = $derived(deletion?.status(id));
  const label = $derived(
    status === "deleting"
      ? "Deleting…"
      : status === "unconfirmed"
        ? "Deletion unconfirmed — refresh required"
        : "Deleted — refresh required",
  );
</script>

{#if status}
  <span
    data-deletion-status={compact ? "compact" : "full"}
    {...stylex.attrs(deletionStatus.root)}
    aria-label={compact ? label : undefined}
    title={compact ? label : undefined}
  >
    {#if status === "deleting"}
      <span {...stylex.attrs(deletionStatus.spinner)} aria-hidden="true"></span>
    {:else if compact}
      <span {...stylex.attrs(deletionStatus.icon)} aria-hidden="true"
        ><Icon
          icon={status === "unconfirmed"
            ? glyphs.warningTriangle
            : glyphs.doubleCheck}
        /></span
      >
    {/if}
    {#if !compact}
      <span>{label}</span>
    {/if}
  </span>
{/if}
