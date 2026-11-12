<script lang="ts">
  import { Icon as SolarIcon } from "../icon";

  import { glyphs } from "../../icons";

  import { themeToggle } from "./index.styles";

  import { styleAttributes } from "../../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import { onMount } from "svelte";
  import { resetMode, setMode, userPrefersMode } from "mode-watcher";
  import { Tooltip } from "../tooltip";

  let {
    sx,
    class: className = "",
    variant = "segmented",
  }: { class?: string; variant?: "segmented" | "cycle" } & {
    sx?: stylex.StyleXStyles;
  } = $props();

  const options = [
    { pref: "light", label: "Light theme" },
    { pref: "system", label: "System theme" },
    { pref: "dark", label: "Dark theme" },
  ] as const;

  const activeIndex = $derived(
    Math.max(
      0,
      options.findIndex((o) => o.pref === userPrefersMode.current),
    ),
  );

  let leftExt = $state(0);
  let rightExt = $state(0);
  let collapseTimer: ReturnType<typeof setTimeout> | null = null;

  function selectTheme(pref: "light" | "system" | "dark") {
    if (pref === userPrefersMode.current) return;
    const newIdx = options.findIndex((o) => o.pref === pref);
    const fromIdx = activeIndex;

    leftExt = Math.min(fromIdx, newIdx);
    rightExt = Math.max(fromIdx, newIdx);

    if (collapseTimer) clearTimeout(collapseTimer);
    collapseTimer = setTimeout(() => {
      leftExt = newIdx;
      rightExt = newIdx;
    }, 160);

    if (pref === "system") resetMode();
    else setMode(pref);
  }

  const cycleOrder = ["light", "dark", "system"] as const;
  const cycleLabel = {
    light: "Light theme",
    dark: "Dark theme",
    system: "System theme",
  } as const;

  let mounted = $state(false);
  onMount(() => {
    leftExt = activeIndex;
    rightExt = activeIndex;
    mounted = true;
  });

  function cycleTheme() {
    const current = userPrefersMode.current ?? "system";
    const idx = cycleOrder.indexOf(current as (typeof cycleOrder)[number]);
    const next = cycleOrder[(idx + 1) % cycleOrder.length];
    if (next === "system") resetMode();
    else setMode(next);
  }
</script>

{#if variant === "cycle"}
  <Tooltip
    label={mounted ? cycleLabel[userPrefersMode.current ?? "system"] : "Theme"}
    placement="bottom"
  >
    <button
      type="button"
      {...styleAttributes(
        [themeToggle.cycleButton, sx],
        [className].flat(Infinity).filter(Boolean).join(" "),
      )}
      aria-label={mounted
        ? cycleLabel[userPrefersMode.current ?? "system"]
        : "Theme"}
      onclick={cycleTheme}
    >
      {#if !mounted}
        <span
          class={[stylex.attrs(themeToggle.placeholder).class]}
          aria-hidden="true"
        ></span>
      {:else if userPrefersMode.current === "light"}
        <span
          data-icon
          class={[stylex.attrs([themeToggle.cycleLightIcon]).class]}
          aria-hidden="true"><SolarIcon icon={glyphs.sun} /></span
        >
      {:else if userPrefersMode.current === "dark"}
        <span
          data-icon
          class={[stylex.attrs([themeToggle.cycleDarkIcon]).class]}
          aria-hidden="true"><SolarIcon icon={glyphs.moon} /></span
        >
      {:else}
        <span
          data-icon
          class={[stylex.attrs([themeToggle.cycleSystemIcon]).class]}
          aria-hidden="true"><SolarIcon icon={glyphs.monitor} /></span
        >
      {/if}
    </button>
  </Tooltip>
{:else}
  <div
    {...styleAttributes(
      [themeToggle.options, sx],
      [className].flat(Infinity).filter(Boolean).join(" "),
    )}
    role="radiogroup"
    aria-label="Theme"
  >
    {#if mounted}
      <span
        aria-hidden="true"
        class={[stylex.attrs(themeToggle.selectionIndicator).class]}
        style="--l: {leftExt}; --r: {rightExt};"
      ></span>
    {/if}
    {#each options as { pref, label } (pref)}
      {@const on = mounted && userPrefersMode.current === pref}
      <Tooltip {label} placement="bottom">
        <button
          type="button"
          class={[
            stylex.attrs(
              themeToggle.option,
              on ? themeToggle.selected : themeToggle.unselected,
            ).class,
          ]}
          aria-label={label}
          role="radio"
          aria-checked={on}
          onclick={() => selectTheme(pref)}
        >
          {#if pref === "light"}
            <span
              data-icon
              class={[stylex.attrs([themeToggle.modeIcon]).class]}
              aria-hidden="true"><SolarIcon icon={glyphs.sun} /></span
            >
          {:else if pref === "system"}
            <span
              data-icon
              class={[stylex.attrs([themeToggle.modeIcon]).class]}
              aria-hidden="true"><SolarIcon icon={glyphs.monitor} /></span
            >
          {:else}
            <span
              data-icon
              class={[stylex.attrs([themeToggle.modeIcon]).class]}
              aria-hidden="true"><SolarIcon icon={glyphs.moon} /></span
            >
          {/if}
        </button>
      </Tooltip>
    {/each}
  </div>
{/if}
