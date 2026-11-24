<script lang="ts" module>
  export type SelectOption<TValue extends string = string> = {
    value: TValue;
    label: string;
    description?: string;
    disabled?: boolean;
  };
</script>

<script lang="ts" generics="TValue extends string = string">
  import {
    createSelectController,
    Select,
    SelectClear,
    SelectContent,
    SelectItem,
    SelectList,
    SelectTrigger,
  } from "@ui-sdk/svelte/select";
  import * as stylex from "@stylexjs/stylex";
  import CheckIcon from "@solar-icons/svelte-v2/linear/check";
  import { tick, type Snippet } from "svelte";
  import type { AriaAttributes } from "svelte/elements";
  import { glyphs } from "../glyphs";
  import { Icon as SolarIcon } from "../icon/base";
  import { styleAttributes } from "../styles/style-attributes";
  import { watchTriggerVisibility } from "../utils/trigger-visibility";
  import { select as selectLayout } from "./select.styles";

  type Props = {
    "aria-label"?: AriaAttributes["aria-label"];
    "aria-labelledby"?: AriaAttributes["aria-labelledby"];
    "aria-required"?: AriaAttributes["aria-required"];
    "aria-describedby"?: AriaAttributes["aria-describedby"];
    "aria-invalid"?: AriaAttributes["aria-invalid"];
    options: SelectOption<TValue>[];
    value: TValue | "";
    onValueChange: (value: TValue | "") => void;
    placeholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    invalid?: boolean;
    clearable?: boolean;
    id?: string;
    name?: string;
    class?: string;
    sx?: stylex.StyleXStyles;
    labelSx?: stylex.StyleXStyles;
    triggerSx?: stylex.StyleXStyles;
    popupSx?: stylex.StyleXStyles;
    optionContent?: Snippet<[SelectOption<TValue>, boolean]>;
  };

  let {
    "aria-label": ariaLabel,
    "aria-labelledby": labelledBy,
    "aria-required": ariaRequired,
    "aria-describedby": describedBy,
    "aria-invalid": ariaInvalid,
    options,
    value,
    onValueChange,
    placeholder = "Select…",
    emptyMessage = "No options",
    disabled = false,
    invalid = false,
    clearable = false,
    id,
    name,
    sx,
    labelSx,
    triggerSx,
    popupSx,
    optionContent,
    class: klass = "",
  }: Props = $props();

  const controller = createSelectController<TValue>();
  let open = $state(false);
  let triggerEl = $state<HTMLButtonElement | null>(null);
  let popoverEl = $state<HTMLDivElement | null>(null);
  let listEl = $state<HTMLDivElement | null>(null);
  let highlight = $state<TValue | null>(null);
  let canScrollUp = $state(false);
  let canScrollDown = $state(false);

  const selectedOption = $derived(options.find((option) => option.value === value));
  const canClear = $derived(clearable && !disabled && !!selectedOption);

  function syncScrollMetrics() {
    if (!listEl) return;
    canScrollUp = listEl.scrollTop > 0;
    canScrollDown = listEl.scrollHeight - listEl.scrollTop - listEl.clientHeight > 1;
  }

  async function onTriggerKeydown(event: KeyboardEvent) {
    if (open || disabled || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key.length !== 1 || !/\S/.test(event.key)) return;
    // The application's closed typeahead opens the list without committing a value.
    event.preventDefault();
    controller.setOpen(true);
    await tick();
    triggerEl?.dispatchEvent(new KeyboardEvent("keydown", {
      key: event.key,
      bubbles: true,
      cancelable: true,
    }));
  }

  $effect(() => {
    if (!open || !triggerEl || !popoverEl) return;
    syncScrollMetrics();
    const observer = new ResizeObserver(syncScrollMetrics);
    if (listEl) observer.observe(listEl);
    const stopWatching = watchTriggerVisibility(triggerEl, popoverEl, () => {
      controller.close({ reason: "focus-out" });
    });
    return () => {
      observer.disconnect();
      stopWatching();
    };
  });
</script>

<Select
  {controller}
  bind:open
  value={selectedOption?.value ?? null}
  items={options}
  {disabled}
  required={ariaRequired === true || ariaRequired === "true"}
  virtualFocus
  modal={false}
  loop
  onValueChange={(next) => onValueChange(next ?? "")}
  onHighlight={(next) => {
    highlight = next;
    void tick().then(syncScrollMetrics);
  }}
>
  <div {...styleAttributes([selectLayout.root, sx], [klass].flat(Infinity).filter(Boolean).join(" "))}>
    <SelectTrigger
      {id}
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      onkeydown={onTriggerKeydown}
      class={stylex.attrs(
        selectLayout.trigger,
        triggerSx,
        open && selectLayout.open,
        invalid && selectLayout.invalidBorder,
        invalid && selectLayout.invalidHalo,
      ).class}
    >
      {#snippet render({ props })}
        <button
          {...props}
          bind:this={triggerEl}
          role="combobox"
          aria-describedby={describedBy}
          aria-invalid={invalid || ariaInvalid || undefined}
        >
          <span {...stylex.attrs(selectLayout.label, labelSx, !selectedOption && selectLayout.placeholder)}>
            {#if optionContent && selectedOption}
              {@render optionContent(selectedOption, true)}
            {:else}
              {selectedOption?.label || placeholder}
            {/if}
          </span>
          <span
            data-icon
            class={stylex.attrs(selectLayout.chevron, open && selectLayout.openChevron, canClear && selectLayout.clearButtonSpace).class}
            aria-hidden="true"
          ><SolarIcon icon={glyphs.chevronDown} /></span>
        </button>
      {/snippet}
    </SelectTrigger>

    {#if canClear}
      <SelectClear aria-label="Clear selection" tabindex={-1} class={stylex.attrs(selectLayout.clearButton).class}>
        <span data-icon class={stylex.attrs(selectLayout.clearIcon).class} aria-hidden="true">
          <SolarIcon icon={glyphs.closeCircle} />
        </span>
      </SelectClear>
    {/if}

    {#if name}
      <input type="hidden" {name} {value} />
    {/if}

    <SelectContent
      side="bottom"
      align="start"
      sideOffset={4}
      collisionPadding={8}
      class={stylex.attrs(selectLayout.popup, popupSx).class}
      style="width: var(--anchor-width); transform-origin: var(--transform-origin);"
    >
      {#snippet render({ props })}
        <div
          {...props}
          bind:this={popoverEl}
          class={[props.class, "select-popup"]}
        >
          <SelectList onscroll={syncScrollMetrics} class={stylex.attrs(selectLayout.options).class}>
            {#snippet render({ props: listProps })}
              <div {...listProps} bind:this={listEl}>
                {#if options.length === 0}
                  <div class={stylex.attrs(selectLayout.emptyMessage).class}>{emptyMessage}</div>
                {:else}
                  {#each options as option (option.value)}
                    <SelectItem
                      value={option.value}
                      label={option.label}
                      disabled={option.disabled}
                      class={stylex.attrs(
                        selectLayout.option,
                        highlight === option.value && !option.disabled && selectLayout.highlighted,
                        optionContent && value === option.value && selectLayout.selected,
                      ).class}
                    >
                      <span class={stylex.attrs(selectLayout.optionDetails).class}>
                        {#if optionContent}
                          {@render optionContent(option, false)}
                        {:else}
                          <span {...stylex.attrs(selectLayout.optionLabel, labelSx)}>{option.label}</span>
                        {/if}
                        {#if !optionContent && option.description}
                          <span class={stylex.attrs(selectLayout.optionDescription).class}>{option.description}</span>
                        {/if}
                      </span>
                      {#if value === option.value}
                        <CheckIcon class={stylex.attrs(selectLayout.checkIcon).class} strokeWidth="3" aria-hidden="true" focusable="false" />
                      {/if}
                    </SelectItem>
                  {/each}
                {/if}
              </div>
            {/snippet}
          </SelectList>
          <div class={stylex.attrs(selectLayout.scrollUpFade).class} data-show={canScrollUp || undefined} aria-hidden="true">
            <span data-icon class={stylex.attrs(selectLayout.scrollIcon).class}><SolarIcon icon={glyphs.chevronUp} /></span>
          </div>
          <div class={stylex.attrs(selectLayout.scrollDownFade).class} data-show={canScrollDown || undefined} aria-hidden="true">
            <span data-icon class={stylex.attrs(selectLayout.scrollIcon).class}><SolarIcon icon={glyphs.chevronDown} /></span>
          </div>
        </div>
      {/snippet}
    </SelectContent>
  </div>
</Select>

<style>
  .select-popup {
    transition: opacity 150ms var(--ease-out), transform 150ms var(--ease-out);
  }

  .select-popup[data-starting-style] {
    opacity: 0;
    transform: translateY(-3px) scale(0.97);
  }

  .select-popup[data-starting-style][data-side="top"] {
    transform: translateY(3px) scale(0.97);
  }

  .select-popup[data-ending-style] {
    opacity: 0;
    transform: scale(0.97);
    pointer-events: none;
    transition-duration: 110ms;
  }

  @media (prefers-reduced-motion: reduce) {
    .select-popup { transition: none; }
  }
</style>
