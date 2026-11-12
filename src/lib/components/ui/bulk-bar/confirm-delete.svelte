<script lang="ts">
  import { Button } from "../button/base";
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { deleteConfirmation } from "./confirm-delete.styles";

  import * as stylex from "@stylexjs/stylex";
  import { Dialog } from "../dialog/base";
  import { Input } from "../input/base";
  import { toast } from "../toaster";

  type Props = {
    open: boolean;
    phrase: string;
    title: string;
    description?: string;
    pending: boolean;
    onconfirm: () => void;
  };
  let {
    open = $bindable(),
    phrase,
    title,
    description = "This action cannot be undone. The record will be archived and hidden from the list.",
    pending,
    onconfirm,
  }: Props = $props();

  let confirmText = $state("");
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  let confirmMatches = $derived(
    confirmText.trim().toLowerCase() === phrase.trim().toLowerCase(),
  );

  function close() {
    if (pending) return;
    open = false;
  }

  function confirm() {
    if (pending || !confirmMatches) return;
    onconfirm();
  }

  async function copyPhrase() {
    try {
      await navigator.clipboard.writeText(phrase);
      copied = true;
      if (copyTimer) clearTimeout(copyTimer);
      copyTimer = setTimeout(() => (copied = false), 1400);
    } catch {
      toast.danger("Clipboard unavailable. Copy manually.");
    }
  }
</script>

<Dialog
  bind:open
  size="sm"
  closedByBackdrop={!pending}
  closedByEscape={!pending}
  onOpenChange={(next) => {
    if (!next) confirmText = "";
  }}
  {title}
  {description}
>
  <div class={[stylex.attrs(deleteConfirmation.instructions).class]}>
    <p class={[stylex.attrs(deleteConfirmation.prompt).class]}>
      To confirm, type
      <span class={[stylex.attrs(deleteConfirmation.phraseRow).class]}>
        <code class={[stylex.attrs(deleteConfirmation.phrase).class]}>
          {phrase}
        </code>
        <button
          type="button"
          onclick={copyPhrase}
          disabled={pending}
          aria-label={copied ? "Copied" : "Copy to clipboard"}
          class={[stylex.attrs(deleteConfirmation.copyButton).class]}
        >
          <span
            data-icon
            class={[
              stylex.attrs(
                deleteConfirmation.clipboardIcon,
                copied ? [deleteConfirmation.copiedIcon] : undefined,
              ).class,
            ]}
            aria-hidden="true"
            ><SolarIcon
              icon={copied ? glyphs.doubleCheck : glyphs.copy}
            /></span
          >
        </button>
      </span>
      below.
    </p>
    <Input
      bind:value={confirmText}
      type="text"
      autocomplete="off"
      spellcheck={false}
      aria-label="Type to confirm deletion"
      placeholder={phrase}
      disabled={pending}
    />
  </div>
  {#snippet footer()}
    <button
      type="button"
      onclick={close}
      disabled={pending}
      class={[stylex.attrs(deleteConfirmation.cancelButton).class]}
    >
      Cancel
    </button>
    <Button
      type="button"
      onclick={confirm}
      disabled={pending || !confirmMatches}
      variant="destructive-soft"
      sx={deleteConfirmation.confirmButton}
    >
      {#if pending}
        <span
          class={[stylex.attrs(deleteConfirmation.spinner).class]}
          aria-hidden="true"
        ></span>
        <span>Deleting…</span>
      {:else}
        <span
          data-icon
          class={[stylex.attrs([deleteConfirmation.deleteIcon]).class]}
          aria-hidden="true"><SolarIcon icon={glyphs.trash} /></span
        >
        <span>Delete</span>
      {/if}
    </Button>
  {/snippet}
</Dialog>
