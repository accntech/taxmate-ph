<script lang="ts">
  import SdkModal from "./sdk-modal.svelte";
  import { dialog as dialogLayout } from "./dialog.styles";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import { DIALOG_SIZE_CLASS } from "../utils/dialog-controls.svelte";
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

</script>

<SdkModal
  bind:open
  {onOpenChange}
  {closedByBackdrop}
  {closedByEscape}
  aria-labelledby={title ? titleId : undefined}
  aria-label={ariaLabel}
  aria-describedby={description ? descId : undefined}
  data-size={size}
  data-backdrop={backdrop}
  data-overflow-visible={overflowVisible}
  class={[
    "taxmate-base-dialog",
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
  />
</SdkModal>

<style>
  :global(dialog.taxmate-base-dialog) {
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

  :global(dialog.taxmate-base-dialog[data-open]:not([data-starting-style])) {
    opacity: 1;
    translate: 0 0;
    transition-duration: 320ms;
  }

  :global(dialog.taxmate-base-dialog)::backdrop {
    background: rgb(0 0 0 / 0.45);
    opacity: 0;
    transition:
      opacity 140ms ease-out,
      overlay 140ms allow-discrete,
      display 140ms allow-discrete;
  }

  :global(dialog.taxmate-base-dialog[data-open]:not([data-starting-style]))::backdrop {
    opacity: 1;
    transition-duration: 240ms;
  }

  :global(dialog.taxmate-base-dialog[data-backdrop="blur"])::backdrop {
    background: rgb(0 0 0 / 0.55);
    backdrop-filter: blur(12px);
  }

  :global(dialog.taxmate-base-dialog[data-backdrop="transparent"])::backdrop,
  :global(dialog.taxmate-base-dialog[data-backdrop="transparent"][data-open]:not([data-starting-style]))::backdrop {
    background: transparent;
  }

  :global(dialog.taxmate-base-dialog[data-overflow-visible="true"]) {
    overflow: visible;
  }

  @starting-style {
    :global(dialog.taxmate-base-dialog[data-open]:not([data-starting-style])) {
      opacity: 0;
      translate: 0 100%;
    }

    :global(dialog.taxmate-base-dialog[data-open]:not([data-starting-style]))::backdrop {
      opacity: 0;
    }
  }

  @media (min-width: 40rem) {
    :global(dialog.taxmate-base-dialog) {
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

    :global(dialog.taxmate-base-dialog[data-open]:not([data-starting-style])) {
      scale: 1;
      transition-duration: 240ms;
    }

    @starting-style {
      :global(dialog.taxmate-base-dialog[data-open]:not([data-starting-style])) {
        opacity: 0;
        scale: 0.96;
        translate: 0 0;
      }
    }

    :global(dialog.taxmate-base-dialog[data-size="sm"]) {
      max-width: 24rem;
    }

    :global(dialog.taxmate-base-dialog[data-size="md"]) {
      max-width: 28rem;
    }

    :global(dialog.taxmate-base-dialog[data-size="lg"]) {
      max-width: 32rem;
    }

    :global(dialog.taxmate-base-dialog[data-size="xl"]) {
      max-width: 42rem;
    }
  }

  :global(dialog.taxmate-base-dialog[data-size="full"]) {
    inset: calc(var(--spacing) * 2);
    margin: auto;
    width: calc(100dvw - var(--spacing) * 4);
    max-width: none;
    height: calc(100dvh - var(--spacing) * 4);
    max-height: calc(100dvh - var(--spacing) * 4);
    translate: 0 0;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(dialog.taxmate-base-dialog),
    :global(dialog.taxmate-base-dialog[data-open]:not([data-starting-style])) {
      scale: 1;
      translate: 0 0;
      transition-duration: 120ms;
    }

    :global(dialog.taxmate-base-dialog)::backdrop,
    :global(dialog.taxmate-base-dialog[data-open]:not([data-starting-style]))::backdrop {
      transition-duration: 80ms;
    }
  }
</style>
