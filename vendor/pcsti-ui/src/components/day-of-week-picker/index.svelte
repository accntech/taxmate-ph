<script lang="ts" module>
  import { weekPicker } from "./index.styles";

  export const WEEKDAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ] as const;
  export type Weekday = (typeof WEEKDAYS)[number];

  const SHORT_LABELS: Record<Weekday, string> = {
    Monday: "M",
    Tuesday: "T",
    Wednesday: "W",
    Thursday: "Th",
    Friday: "F",
    Saturday: "Sa",
    Sunday: "Su",
  };
</script>

<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import type { AriaAttributes } from "svelte/elements";

  type Props = {
    "aria-describedby"?: AriaAttributes["aria-describedby"];
    "aria-invalid"?: AriaAttributes["aria-invalid"];
    id?: string;
    name?: string;
    value: Weekday[];
    onValueChange?: (next: Weekday[]) => void;
    invalid?: boolean;
    disabled?: boolean;
    label?: string;
  };

  let {
    "aria-describedby": describedBy,
    "aria-invalid": ariaInvalid,
    id,
    name,
    value = $bindable([]),
    onValueChange,
    invalid = false,
    disabled = false,
    label = "Days",
  }: Props = $props();

  const resolvedInvalid = $derived(
    invalid || ariaInvalid === true || ariaInvalid === "true",
  );

  function toggle(day: Weekday) {
    if (disabled) return;
    const next = value.includes(day)
      ? value.filter((d) => d !== day)
      : [...WEEKDAYS].filter((d) => value.includes(d) || d === day);
    value = next;
    onValueChange?.(next);
  }
</script>

<div
  {id}
  role="group"
  aria-describedby={describedBy}
  aria-label={label}
  data-invalid={resolvedInvalid || undefined}
  class={[stylex.attrs(weekPicker.root).class]}
>
  {#each WEEKDAYS as day (day)}
    {@const selected = value.includes(day)}
    <button
      type="button"
      aria-pressed={selected}
      aria-describedby={describedBy}
      aria-label={day}
      {disabled}
      onclick={() => toggle(day)}
      class={[
        stylex.attrs(
          weekPicker.day,
          selected
            ? weekPicker.selected
            : resolvedInvalid
              ? weekPicker.invalid
              : weekPicker.unselected,
        ).class,
      ]}
    >
      {SHORT_LABELS[day]}
    </button>
  {/each}
  {#if name}
    {#each value as day (day)}
      <input type="hidden" {name} value={day} />
    {/each}
  {/if}
</div>
