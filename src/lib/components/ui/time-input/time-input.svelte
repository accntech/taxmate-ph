<script lang="ts">
  import { TimeInput as SdkTimeInput, TimeInputSegment } from "@ui-sdk/svelte/time-input";
  import * as stylex from "@stylexjs/stylex";
  import type { AriaAttributes } from "svelte/elements";
  import { parseTimeValue } from "./helpers";
  import { timeInput } from "./time-input.styles";

  type Props = {
    "aria-label"?: AriaAttributes["aria-label"];
    "aria-labelledby"?: AriaAttributes["aria-labelledby"];
    "aria-describedby"?: AriaAttributes["aria-describedby"];
    "aria-invalid"?: AriaAttributes["aria-invalid"];
    value?: string;
    name?: string;
    id?: string;
    disabled?: boolean;
    invalid?: boolean;
    size?: "sm" | "md";
  };

  let {
    "aria-label": ariaLabel,
    "aria-labelledby": labelledBy,
    "aria-describedby": describedBy,
    "aria-invalid": ariaInvalid,
    value = $bindable(""),
    name,
    id,
    disabled = false,
    invalid = false,
    size = "md",
  }: Props = $props();

  const parsedValue = $derived(parseTimeValue(value) ? value.trim() : null);
  const invalidState = $derived(invalid || ariaInvalid === true || ariaInvalid === "true");
</script>

<SdkTimeInput
  value={parsedValue}
  onValueChange={(next) => { value = next ?? ""; }}
  {id}
  {name}
  {disabled}
  hourCycle={12}
  locale="en-US"
  aria-label={ariaLabel}
  aria-labelledby={labelledBy}
  aria-describedby={describedBy}
  class={[
    stylex.attrs(timeInput.root, size === "sm" ? timeInput.small : timeInput.medium).class,
    "group",
  ]}
>
  {#snippet render({ props, state, children })}
    <div {...props} data-invalid={invalidState ? "true" : undefined}>
      {@render children?.(state)}
    </div>
  {/snippet}
  {#snippet children({ segments })}
    <div class={stylex.attrs(timeInput.segments).class}>
      {#each segments as segment (segment.key)}
        {#if segment.editable}
          {@const isPeriod = segment.type === "dayPeriod"}
          <TimeInputSegment
            {segment}
            aria-describedby={describedBy}
            aria-label={isPeriod ? "AM or PM" : segment.type === "hour" ? "Hour" : "Minute"}
            class={[
              stylex.attrs(isPeriod ? timeInput.period : timeInput.digit, timeInput.editable).class,
              "time-input-segment",
            ]}
          >
            {#snippet render({ props })}
              <input
                {...props}
                placeholder={isPeriod ? "AM" : segment.type === "hour" ? "HH" : "MM"}
                aria-invalid={invalid || ariaInvalid || undefined}
              />
            {/snippet}
          </TimeInputSegment>
        {:else if segment.text.trim()}
          <TimeInputSegment {segment} class={stylex.attrs(timeInput.placeholder).class} />
        {/if}
      {/each}
    </div>
  {/snippet}
</SdkTimeInput>

<style>
  :global(.time-input-segment::placeholder) {
    color: var(--fg-subtle);
    opacity: 1;
  }
</style>
