<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { Button } from "../button/base";
  import { useDeletionState } from "./state.svelte";
  import { deletionProgress } from "./progress.styles";
  import { deletionStatus } from "./status.styles";

  const deletion = useDeletionState();
  const pending = $derived(deletion?.pendingCount ?? 0);
  const refresh = $derived(deletion?.refreshCount ?? 0);
  const unknown = $derived(deletion?.unknownCount ?? 0);
</script>

{#if pending || refresh || unknown}
  <div {...stylex.attrs(deletionProgress.root)}>
    <span role="status" aria-live="polite" aria-atomic="true">
      {#if pending}
        <span {...stylex.attrs(deletionStatus.root)}>
          <span {...stylex.attrs(deletionStatus.spinner)} aria-hidden="true"
          ></span>
          Deleting {pending}
          {pending === 1 ? "record" : "records"}…
        </span>
      {/if}
      {#if refresh}
        {refresh}
        {refresh === 1 ? "record was" : "records were"} deleted. Refresh the page
        to update the list.
      {/if}
      {#if unknown}
        Deletion of {unknown}
        {unknown === 1 ? "record" : "records"} is unconfirmed. Refresh the page to
        check before trying again.
      {/if}
    </span>
    {#if refresh || unknown}
      <Button
        size="compact"
        disabled={pending > 0}
        onclick={() => window.location.reload()}>Refresh page</Button
      >
    {/if}
  </div>
{/if}
