<script lang="ts">
  import { Dialog, DialogContent } from "@ui-sdk/svelte/dialog";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    open = $bindable(false),
    onOpenChange,
    closedByBackdrop = true,
    closedByEscape = true,
    children,
    ...attrs
  }: Pick<HTMLAttributes<HTMLElement>, "class" | "aria-label" | "aria-labelledby" | "aria-describedby"> & {
    "data-size"?: string;
    "data-backdrop"?: string;
    "data-overflow-visible"?: boolean;
    "data-side"?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    closedByBackdrop?: boolean;
    closedByEscape?: boolean;
    children?: Snippet;
  } = $props();
</script>

<Dialog
  bind:open
  presentation="dialog"
  closeOnOutsidePress={closedByBackdrop}
  dismissible={closedByBackdrop || closedByEscape}
  onOpenChange={(next, details) => {
    if (details.reason === "escape-key" && !closedByEscape) {
      details.cancel();
    } else {
      onOpenChange?.(next);
    }
  }}
>
  <DialogContent {...attrs} initialFocus="content" keepMounted>
    {#snippet render({ props })}
      <!-- Preserve the dialog element for nested overlays and existing focus targets. -->
      <dialog {...props} open={props.hidden == null || props.hidden === false} data-overlay-surface>
        {@render children?.()}
      </dialog>
    {/snippet}
  </DialogContent>
</Dialog>
