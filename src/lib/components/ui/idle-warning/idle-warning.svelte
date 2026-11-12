<script lang="ts">
  import { Button } from "../button/base";
  import { idleWarning } from "./idle-warning.styles";

  import * as stylex from "@stylexjs/stylex";
  import { Dialog } from "../dialog/base";

  type Props = {
    open: boolean;
    remainingSeconds: number;
    onstay: () => void;
    onsignout: () => void;
  };

  let { open, remainingSeconds, onstay, onsignout }: Props = $props();

  function onOpenChange(next: boolean) {
    if (!next && open) onstay();
  }
</script>

<Dialog
  {open}
  {onOpenChange}
  size="sm"
  closedByBackdrop={false}
  title="Still there?"
  description="You'll be signed out in {remainingSeconds}s due to inactivity."
>
  {#snippet footer()}
    <button
      type="button"
      class={[stylex.attrs(idleWarning.signOutButton).class]}
      onclick={onsignout}
    >
      Sign out now
    </button>
    <Button
      type="button"
      variant="accent-soft"
      sx={idleWarning.stayButton}
      onclick={onstay}
    >
      Stay signed in
    </Button>
  {/snippet}
</Dialog>
