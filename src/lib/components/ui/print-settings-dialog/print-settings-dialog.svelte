<script lang="ts">
  import { PrintButton } from "../print-button";
  import { Icon as SolarIcon } from "../icon/base";
  import type { IconComponent } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { printSettings } from "./print-settings-dialog.styles";

  import * as stylex from "@stylexjs/stylex";
  import { untrack, type Snippet } from "svelte";
  import { Dialog } from "../dialog/base";
  import { ButtonSelection } from "../button-selection";
  import { RadioButton } from "../radio-button";
  import {
    DEFAULT_PRINT_SETTINGS,
    hasPrintSettings,
    loadPrintSettings,
    MARGINS,
    ORIENTATIONS,
    PAPER_SIZES,
    savePrintSettings,
    type Margin,
    type Orientation,
    type PaperSize,
    type PrintSettings,
  } from "./print-settings";

  type Props = {
    open: boolean;
    printing?: boolean;
    title?: string;
    description?: string;
    confirmLabel?: string;
    pendingLabel?: string;
    confirmIcon?: IconComponent | null;
    extraOptions?: Snippet;
    leadingOptions?: Snippet;
    /** Opt in only when the caller persists and validates its extra content choices. */
    reuseSavedOptions?: boolean;
    /** Scoped layouts skip setup after first confirmation unless explicitly requested. */
    settingsKey?: string;
    forceSettings?: boolean;
    /** Block generation until caller-owned content choices are ready. */
    confirmDisabled?: boolean;
    onConfirm: (settings: PrintSettings) => void | Promise<void>;
    onOpenChange?: (next: boolean) => void;
  };

  let {
    open = $bindable(false),
    printing = false,
    title = "Document settings",
    description = "Layout settings are remembered on this device.",
    confirmLabel = "Generate",
    pendingLabel = "Generating…",
    confirmIcon = glyphs.document,
    extraOptions,
    leadingOptions,
    reuseSavedOptions = false,
    settingsKey,
    forceSettings = false,
    confirmDisabled = false,
    onConfirm,
    onOpenChange,
  }: Props = $props();

  let paperSize = $state<PaperSize>(DEFAULT_PRINT_SETTINGS.paperSize);
  let margin = $state<Margin>(DEFAULT_PRINT_SETTINGS.margin);
  let orientation = $state<Orientation>(DEFAULT_PRINT_SETTINGS.orientation);
  let dialogOpen = $state(false);
  let error = $state("");
  let activeRequest = false;
  let activeProfile: string | undefined;
  let generating = $state(false);
  const busy = $derived(printing || generating);
  let requestVersion = 0;

  async function generate(settings: PrintSettings, automatic = false) {
    const version = requestVersion;
    error = "";
    generating = true;
    try {
      await onConfirm(settings);
    } catch {
      if (version === requestVersion && open) {
        error = "Could not generate the document. Try again.";
      }
    } finally {
      // A caller keeps open=true on failure; expose setup for an explicit retry.
      if (version === requestVersion) {
        generating = false;
        if (automatic && open) dialogOpen = true;
      }
    }
  }

  $effect(() => {
    const requested = open;
    const profile = settingsKey;
    const forced = forceSettings;
    const requiresContentChoices =
      Boolean(leadingOptions || extraOptions) && !reuseSavedOptions;
    untrack(() => {
      if (!requested) {
        activeRequest = false;
        requestVersion += 1;
        dialogOpen = false;
        generating = false;
        return;
      }
      if (activeRequest && activeProfile === profile) return;
      activeRequest = true;
      activeProfile = profile;
      requestVersion += 1;
      generating = false;
      error = "";
      const settings = loadPrintSettings(profile);
      paperSize = settings.paperSize;
      margin = settings.margin;
      orientation = settings.orientation;
      if (
        profile &&
        !forced &&
        !confirmDisabled &&
        !requiresContentChoices &&
        hasPrintSettings(profile)
      ) {
        dialogOpen = false;
        void generate(settings, true);
      } else {
        dialogOpen = true;
      }
    });
  });

  const paperOptions = PAPER_SIZES.map((s) => ({ value: s, label: s }));
  const marginOptions = MARGINS.map((m) => ({ value: m, label: m }));
  const orientationOptions = ORIENTATIONS.map((o) => ({
    value: o,
    label: o === "portrait" ? "Portrait" : "Landscape",
  }));

  function close() {
    if (busy) return;
    open = false;
    onOpenChange?.(false);
  }

  function reset() {
    if (busy) return;
    paperSize = DEFAULT_PRINT_SETTINGS.paperSize;
    margin = DEFAULT_PRINT_SETTINGS.margin;
    orientation = DEFAULT_PRINT_SETTINGS.orientation;
  }

  function confirm() {
    if (busy || confirmDisabled) return;
    const settings: PrintSettings = { paperSize, margin, orientation };
    savePrintSettings(settings, settingsKey);
    void generate(settings);
  }
</script>

<Dialog
  open={dialogOpen}
  {title}
  {description}
  size="md"
  scrollBody
  closedByBackdrop={!busy}
  closedByEscape={!busy}
  hideCloseButton={busy}
  onOpenChange={(next) => {
    if (!next && busy) {
      dialogOpen = true;
      return;
    }
    dialogOpen = next;
    open = next;
    onOpenChange?.(next);
  }}
>
  <div class={[stylex.attrs(printSettings.options).class]}>
    {#if error}
      <p role="alert">{error}</p>
    {/if}
    {#if leadingOptions}
      {@render leadingOptions()}
    {/if}
    <section class={[stylex.attrs(printSettings.field).class]}>
      <div class={[stylex.attrs(printSettings.label).class]}>Paper size</div>
      <ButtonSelection
        bind:value={paperSize}
        disabled={busy}
        options={paperOptions}
        ariaLabel="Paper size"
      />
    </section>

    <section class={[stylex.attrs(printSettings.field).class]}>
      <div class={[stylex.attrs(printSettings.label).class]}>Margin</div>
      <div
        role="radiogroup"
        aria-label="Margin"
        {...stylex.attrs(printSettings.marginOptions)}
      >
        {#each marginOptions as option (option.value)}
          <RadioButton
            checked={margin === option.value}
            onSelect={() => (margin = option.value)}
            disabled={busy}
            sx={[
              printSettings.marginOption,
              margin === option.value && printSettings.selectedMargin,
            ]}
          >
            {option.label}
          </RadioButton>
        {/each}
      </div>
    </section>

    <section class={[stylex.attrs(printSettings.field).class]}>
      <div class={[stylex.attrs(printSettings.label).class]}>Orientation</div>
      <ButtonSelection
        bind:value={orientation}
        disabled={busy}
        options={orientationOptions}
        ariaLabel="Orientation"
      />
    </section>

    {#if extraOptions}
      {@render extraOptions()}
    {/if}
  </div>

  {#snippet footer()}
    <div class={[stylex.attrs(printSettings.footer).class]}>
      <button
        type="button"
        disabled={busy}
        onclick={reset}
        class={[stylex.attrs(printSettings.resetButton).class]}
      >
        Reset layout
      </button>
      <div class={[stylex.attrs(printSettings.actions).class]}>
        <button
          type="button"
          disabled={busy}
          onclick={close}
          class={[stylex.attrs(printSettings.cancelButton).class]}
        >
          Cancel
        </button>
        <PrintButton
          type="button"
          disabled={busy || confirmDisabled}
          onclick={confirm}
          variant="accent-soft"
          sx={printSettings.confirmButton}
        >
          {#if busy}
            <span
              class={[stylex.attrs(printSettings.spinner).class]}
              aria-hidden="true"
            ></span>
            {pendingLabel}
          {:else}
            {#if confirmIcon}<span
                data-icon
                class={[stylex.attrs(printSettings.confirmIcon).class]}
                aria-hidden="true"><SolarIcon icon={confirmIcon} /></span
              >{/if}
            {confirmLabel}
          {/if}
        </PrintButton>
      </div>
    </div>
  {/snippet}
</Dialog>
