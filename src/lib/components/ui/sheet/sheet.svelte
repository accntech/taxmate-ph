<script lang="ts">
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { sheet as sheetLayout } from "./sheet.styles";

  import { styleAttributes } from "../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import {
    DIALOG_SIZE_CLASS,
    createDialogControls,
  } from "../utils/dialog-controls.svelte";

  type Side = "right" | "left";
  type Size = "sm" | "md" | "lg" | "xl";

  type Props = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    side?: Side;
    size?: Size;
    closedByBackdrop?: boolean;
    closedByEscape?: boolean;
    hideCloseButton?: boolean;
    title?: string;
    description?: string;
    header?: Snippet;
    children?: Snippet;
    footer?: Snippet;
    class?: string;
  };

  let {
    open = $bindable(false),
    onOpenChange,
    side = "right",
    size = "md",
    closedByBackdrop = true,
    closedByEscape = true,
    hideCloseButton = false,
    title,
    description,
    header,
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

  const sideClass = $derived(
    side === "right" ? sheetLayout.right : sheetLayout.left,
  );

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
  aria-label={header ? title : undefined}
  aria-labelledby={!header && title ? titleId : undefined}
  aria-describedby={description ? descId : undefined}
  data-side={side}
  data-size={size}
  class={[
    stylex.attrs(sheetLayout.root, sideClass, DIALOG_SIZE_CLASS[size]).class,
  ]}
>
  <div
    {...styleAttributes(
      [sheetLayout.panel, sx],
      ["sheet-panel", className].flat(Infinity).filter(Boolean).join(" "),
    )}
  >
    {#if header}
      <div
        class={[
          stylex.attrs(
            sheetLayout.header,
            showCloseButton ? sheetLayout.closeButtonSpace : null,
          ).class,
        ]}
      >
        {@render header()}
      </div>
    {:else if title || description}
      <div
        class={[
          stylex.attrs(
            sheetLayout.header,
            showCloseButton ? sheetLayout.closeButtonSpace : null,
          ).class,
        ]}
      >
        {#if title}
          <h2 id={titleId} class={[stylex.attrs(sheetLayout.title).class]}>
            {title}
          </h2>
        {/if}
        {#if description}
          <p
            id={descId}
            class={[
              stylex.attrs(
                sheetLayout.description,
                title ? sheetLayout.belowTitle : null,
              ).class,
            ]}
          >
            {description}
          </p>
        {/if}
      </div>
    {/if}
    {#if showCloseButton}
      <button
        type="button"
        aria-label="Close"
        onclick={() => modal.setOpen(false)}
        class={[stylex.attrs(sheetLayout.closeButton).class, ""]}
      >
        <span
          data-icon
          class={[stylex.attrs([sheetLayout.closeIcon]).class]}
          aria-hidden="true"><SolarIcon icon={glyphs.closeSquare} /></span
        >
      </button>
    {/if}
    {#if children}
      <div class={[stylex.attrs(sheetLayout.body).class]}>
        {@render children()}
      </div>
    {/if}
    {#if footer}
      <div class={[stylex.attrs(sheetLayout.footer).class]}>
        {@render footer()}
      </div>
    {/if}
  </div>
</dialog>

<style>
  dialog,
  dialog::backdrop {
    transition-behavior: allow-discrete;
  }

  dialog {
    position: fixed;
    inset-block: 0;
    margin: 0;
    width: 100vw;
    width: 100dvw;
    max-width: none;
    height: 100vh;
    height: 100dvh;
    max-height: none;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--fg);
    opacity: 0;
    transform: translateX(100%);
    transition:
      opacity 220ms var(--ease-drawer),
      transform 220ms var(--ease-drawer),
      overlay 220ms allow-discrete,
      display 220ms allow-discrete;
  }

  dialog[data-side="right"] {
    inset-inline: auto 0;
  }

  dialog[data-side="left"] {
    inset-inline: 0 auto;
    transform: translateX(-100%);
  }

  dialog[open] {
    opacity: 1;
    transform: translateX(0);
    transition-duration: 320ms;
  }

  dialog::backdrop {
    background: rgb(0 0 0 / 0.45);
    opacity: 0;
    transition:
      opacity 180ms ease-out,
      overlay 180ms allow-discrete,
      display 180ms allow-discrete;
  }

  dialog[open]::backdrop {
    opacity: 1;
    transition-duration: 240ms;
  }

  @starting-style {
    dialog[data-side="right"][open] {
      opacity: 0;
      transform: translateX(100%);
    }

    dialog[data-side="left"][open] {
      opacity: 0;
      transform: translateX(-100%);
    }

    dialog[open]::backdrop {
      opacity: 0;
    }
  }

  .sheet-panel {
    position: relative;
    display: flex;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    min-height: 0;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border);
    background: var(--bg-elev);
    box-shadow: 0 24px 64px rgb(0 0 0 / 0.22);
  }

  @media (min-width: 40rem) {
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

  @media (prefers-reduced-motion: reduce) {
    dialog,
    dialog::backdrop {
      transition-duration: 0.01ms;
    }
  }
</style>
