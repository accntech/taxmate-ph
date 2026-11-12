<script lang="ts">
  import { dialog as dialogLayout } from "./index.styles";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import {
    DIALOG_SIZE_CLASS,
    createDialogControls,
  } from "../../utils/dialog-controls.svelte";
  import DialogContent from "./content.svelte";

  type Size = "sm" | "md" | "lg" | "xl" | "full";

  type Props = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    size?: Size;
    closedByBackdrop?: boolean;
    closedByEscape?: boolean;
    backdrop?: "dim" | "transparent" | "blur";
    hideCloseButton?: boolean;
    overflowVisible?: boolean;
    scrollBody?: boolean;
    scrollFade?: boolean;
    title?: string;
    ariaLabel?: string;
    description?: string;
    children?: Snippet;
    footer?: Snippet;
    class?: string;
  };

  let {
    open = $bindable(false),
    onOpenChange,
    size = "md",
    closedByBackdrop = true,
    closedByEscape = true,
    backdrop = "dim",
    hideCloseButton = false,
    overflowVisible = false,
    scrollBody = false,
    scrollFade = false,
    title,
    ariaLabel,
    description,
    children,
    footer,
    sx,
    class: className = "",
  }: Props & { sx?: stylex.StyleXStyles } = $props();

  const showCloseButton = $derived(
    !hideCloseButton && (closedByBackdrop || closedByEscape),
  );

  const uid = $props.id();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;

  const modal = createDialogControls({
    getOpen: () => open,
    setOpenValue: (next) => (open = next),
    onOpenChange: (next) => onOpenChange?.(next),
    closedByBackdrop: () => closedByBackdrop,
    closedByEscape: () => closedByEscape,
  });
</script>

<dialog
  {@attach modal.syncOpen}
  onclose={modal.onClose}
  oncancel={modal.onCancel}
  onclick={modal.onDialogClick}
  aria-labelledby={title ? titleId : undefined}
  aria-label={ariaLabel}
  aria-describedby={description ? descId : undefined}
  data-size={size}
  data-backdrop={backdrop}
  data-overflow-visible={overflowVisible}
  class={[
    stylex.attrs(
      dialogLayout.root,
      DIALOG_SIZE_CLASS[size === "full" ? "xl" : size],
    ).class,
  ]}
>
  <DialogContent
    {title}
    {description}
    {titleId}
    {descId}
    {showCloseButton}
    showHeading={!ariaLabel || Boolean(title || description)}
    {overflowVisible}
    {scrollBody}
    {scrollFade}
    {children}
    {footer}
    {sx}
    class={[className].filter(Boolean).join(" ")}
    onclose={() => modal.setOpen(false)}
  />
</dialog>

<style>
  dialog {
    position: fixed;
    inset-inline: 0;
    inset-block: auto env(safe-area-inset-bottom);
    margin: 0;
    width: 100vw;
    width: 100dvw;
    max-width: none;
    height: auto;
    max-height: 90vh;
    max-height: 90dvh;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--fg);
    opacity: 0;
    translate: 0 100%;
    transition:
      opacity 180ms var(--ease-drawer),
      translate 180ms var(--ease-drawer),
      scale 180ms var(--ease-drawer),
      overlay 180ms allow-discrete,
      display 180ms allow-discrete;
  }

  dialog[open] {
    opacity: 1;
    translate: 0 0;
    transition-duration: 320ms;
  }

  dialog::backdrop {
    background: rgb(0 0 0 / 0.45);
    opacity: 0;
    transition:
      opacity 140ms ease-out,
      overlay 140ms allow-discrete,
      display 140ms allow-discrete;
  }

  dialog[open]::backdrop {
    opacity: 1;
    transition-duration: 240ms;
  }

  dialog[data-backdrop="blur"]::backdrop {
    background: rgb(0 0 0 / 0.55);
    backdrop-filter: blur(12px);
  }

  dialog[data-backdrop="transparent"]::backdrop,
  dialog[data-backdrop="transparent"][open]::backdrop {
    background: transparent;
  }

  dialog[data-overflow-visible="true"] {
    overflow: visible;
  }

  @starting-style {
    dialog[open] {
      opacity: 0;
      translate: 0 100%;
    }

    dialog[open]::backdrop {
      opacity: 0;
    }
  }

  @media (min-width: 40rem) {
    dialog {
      inset: 0;
      margin: auto;
      width: calc(100vw - 2rem);
      height: fit-content;
      max-height: calc(100vh - 2rem);
      max-height: calc(100dvh - 2rem);
      translate: 0 0;
      scale: 0.96;
      transition-duration: 140ms;
    }

    dialog[open] {
      scale: 1;
      transition-duration: 240ms;
    }

    @starting-style {
      dialog[open] {
        opacity: 0;
        scale: 0.96;
        translate: 0 0;
      }
    }

    dialog[data-size="sm"] {
      max-width: 24rem;
    }

    dialog[data-size="md"] {
      max-width: 28rem;
    }

    dialog[data-size="lg"] {
      max-width: 32rem;
    }

    dialog[data-size="xl"] {
      max-width: 42rem;
    }
  }

  dialog[data-size="full"] {
    inset: calc(var(--spacing) * 2);
    margin: auto;
    width: calc(100dvw - var(--spacing) * 4);
    max-width: none;
    height: calc(100dvh - var(--spacing) * 4);
    max-height: calc(100dvh - var(--spacing) * 4);
    translate: 0 0;
  }

  @media (prefers-reduced-motion: reduce) {
    dialog,
    dialog[open] {
      scale: 1;
      translate: 0 0;
      transition-duration: 120ms;
    }

    dialog::backdrop,
    dialog[open]::backdrop {
      transition-duration: 80ms;
    }
  }
</style>
