<script lang="ts">
  import { type DatePreset } from "./date-presets";

  import { dateRange } from "./index.styles";

  import * as stylex from "@stylexjs/stylex";
  import { Button } from "../button";
  import { DateInput } from "../date-input";

  import { DATE_PRESETS, getDatePresetRange } from "./date-presets";
  type FilterMenuClasses = {
    applyRow: stylex.StyleXStyles;
    cancelButton: stylex.StyleXStyles;
    applyButton: stylex.StyleXStyles;
  };

  type Props = {
    from?: string;
    to?: string;
    classes: FilterMenuClasses;
    onapply: () => void;
    oncancel: () => void;
    presets?: { key: DatePreset; label: string }[];
    fromId?: string;
    toId?: string;
  };

  let {
    from = $bindable(""),
    to = $bindable(""),
    classes,
    onapply,
    oncancel,
    presets = DATE_PRESETS,
    fromId,
    toId,
  }: Props = $props();
  const uid = $props.id();

  function applyPreset(preset: DatePreset) {
    const range = getDatePresetRange(preset);
    from = range.from;
    to = range.to;
  }
</script>

<div class={[stylex.attrs(dateRange.presets).class]}>
  {#each presets as preset (preset.key)}
    <Button
      type="button"
      size="compact"
      variant="outlined"
      onclick={() => applyPreset(preset.key)}
      sx={dateRange.presetButton}
    >
      {preset.label}
    </Button>
  {/each}
</div>
<div class={[stylex.attrs(dateRange.dateFields).class]}>
  <div class={[stylex.attrs(dateRange.dateField).class]}>
    <span id={`${uid}-from-label`}>From</span>
    <DateInput
      id={fromId}
      aria-labelledby={`${uid}-from-label`}
      bind:value={from}
      max={to || undefined}
      size="sm"
      picker={false}
    />
  </div>
  <div class={[stylex.attrs(dateRange.dateField).class]}>
    <span id={`${uid}-to-label`}>To</span>
    <DateInput
      id={toId}
      aria-labelledby={`${uid}-to-label`}
      bind:value={to}
      min={from || undefined}
      size="sm"
      picker={false}
    />
  </div>
</div>
<div class={[stylex.attrs(classes.applyRow).class]}>
  <Button
    type="button"
    size="compact"
    variant="ghost"
    sx={classes.cancelButton}
    onclick={oncancel}
  >
    Cancel
  </Button>
  <Button
    type="button"
    size="compact"
    variant="accent"
    sx={classes.applyButton}
    onclick={onapply}
  >
    Apply
  </Button>
</div>
