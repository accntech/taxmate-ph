<script lang="ts">
  // Ported from PCSTI ERP density-toggle and shared ToggleGroup; source motion and measurements retained.
  type T = "compact" | "comfortable";
  import SolarIcon from "./icon.svelte";
  import { glyphs } from "./icons";
  import type { IconComponent } from "./icons";

  import { onMount } from "svelte";

  type Option = {
    value: T;
    label: string;
    icon?: IconComponent;
  };

  import type { AriaAttributes } from "svelte/elements";

  type Props = {
    id?: string;
    "aria-describedby"?: AriaAttributes["aria-describedby"];
    value: T;
    options?: Option[];
    onchange: (v: T) => void;
    variant?: "outline" | "ghost";
    ariaLabel?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    class?: string;
  };
  let {
    id,
    "aria-describedby": describedBy,
    value,
    options = [
      { value: "compact", label: "Compact rows", icon: glyphs.rowsCompact },
      {
        value: "comfortable",
        label: "Comfortable rows",
        icon: glyphs.rowsComfortable,
      },
    ],
    onchange,
    variant = "outline",
    ariaLabel = "Row density",
    disabled = false,
    fullWidth = false,
    class: klass = "",
  }: Props = $props();

  const STRETCH_MS = 120;
  const SNAP_MS = 220;
  const STRETCH_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
  const SNAP_EASING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

  let container = $state<HTMLDivElement | undefined>();
  let buttonRefs: HTMLButtonElement[] = $state([]);
  let pillLeft = $state(0);
  let pillWidth = $state(0);
  let hasMeasured = $state(false);
  let transitionStyle = $state("none");
  let reduceMotion = $state(false);
  let snapTimer: ReturnType<typeof setTimeout> | undefined;
  let snapFrame: number | undefined;
  let settleFrame: number | undefined;

  function cancelMotion() {
    clearTimeout(snapTimer);
    snapTimer = undefined;
    if (snapFrame !== undefined) cancelAnimationFrame(snapFrame);
    snapFrame = undefined;
    if (settleFrame !== undefined) cancelAnimationFrame(settleFrame);
    settleFrame = undefined;
  }

  // fallow-ignore-next-line complexity
  function rectFor(index: number): { left: number; width: number } | null {
    const btn = buttonRefs[index];
    if (!btn || !container) return null;
    let left = 0;
    let node: HTMLElement | null = btn;
    while (node && node !== container) {
      left += node.offsetLeft;
      node = node.offsetParent as HTMLElement | null;
    }
    return { left, width: btn.offsetWidth };
  }

  function setPill(left: number, width: number) {
    pillLeft = left;
    pillWidth = width;
  }

  function jumpTo(val: T) {
    const i = options.findIndex((o) => o.value === val);
    const r = rectFor(i);
    transitionStyle = "none";
    if (!r) {
      setPill(0, 0);
      return;
    }
    setPill(r.left, r.width);
  }

  function animateTo(nextVal: T) {
    cancelMotion();
    const nextI = options.findIndex((o) => o.value === nextVal);
    const next = rectFor(nextI);
    if (!next) return;

    const hasPrev = pillWidth > 0;
    if (reduceMotion || !hasPrev) {
      transitionStyle = "none";
      setPill(next.left, next.width);
      return;
    }

    const prevLeft = pillLeft;
    const prevRight = pillLeft + pillWidth;
    const stretchLeft = Math.min(prevLeft, next.left);
    const stretchWidth =
      Math.max(prevRight, next.left + next.width) - stretchLeft;

    transitionStyle = `left ${STRETCH_MS}ms ${STRETCH_EASING}, width ${STRETCH_MS}ms ${STRETCH_EASING}`;
    setPill(stretchLeft, stretchWidth);

    snapTimer = setTimeout(() => {
      snapTimer = undefined;
      if (reduceMotion) return;
      snapFrame = requestAnimationFrame(() => {
        snapFrame = undefined;
        if (reduceMotion) return;
        transitionStyle = `left ${SNAP_MS}ms ${SNAP_EASING}, width ${SNAP_MS}ms ${SNAP_EASING}`;
        setPill(next.left, next.width);
      });
    }, STRETCH_MS);
  }

  function handleClick(nextVal: T) {
    if (disabled) return;
    if (nextVal === value) return;
    if (variant === "outline") animateTo(nextVal);
    onchange(nextVal);
  }

  onMount(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    reduceMotion = motionPreference.matches;

    function updateMotionPreference(event: MediaQueryListEvent) {
      reduceMotion = event.matches;
      if (!reduceMotion) return;
      cancelMotion();
      jumpTo(value);
    }

    motionPreference.addEventListener("change", updateMotionPreference);

    jumpTo(value);
    hasMeasured = true;

    const ro = new ResizeObserver(() => jumpTo(value));
    if (container) ro.observe(container);

    const start = performance.now();
    const settle = () => {
      jumpTo(value);
      if (!reduceMotion && performance.now() - start < 500) {
        settleFrame = requestAnimationFrame(settle);
      } else settleFrame = undefined;
    };
    if (!reduceMotion) settleFrame = requestAnimationFrame(settle);

    return () => {
      ro.disconnect();
      motionPreference.removeEventListener("change", updateMotionPreference);
      cancelMotion();
    };
  });
</script>

<div
  bind:this={container}
  {id}
  role="group"
  aria-describedby={describedBy}
  aria-label={ariaLabel}
  class={["pcsti-toggle", `pcsti-${variant}`, fullWidth && "full-width", klass]}
>
  {#if variant === "outline"}
    <div
      aria-hidden="true"
      class="indicator"
      style:left="{pillLeft}px"
      style:width="{pillWidth}px"
      style:opacity={hasMeasured && pillWidth > 0 ? 1 : 0}
      style:transition={transitionStyle}
    ></div>
  {/if}
  {#each options as opt, i (opt.value)}
    {@const pressed = value === opt.value}
    <button
      bind:this={buttonRefs[i]}
      type="button"
      aria-label={opt.label}
      aria-pressed={pressed}
      aria-describedby={describedBy}
      {disabled}
      onclick={() => handleClick(opt.value)}
      title={opt.label}
      class:pressed
    >
      {#if opt.icon}<span data-icon class="density-icon" aria-hidden="true"
          ><SolarIcon icon={opt.icon} /></span
        >{:else}{opt.label}{/if}
    </button>
  {/each}
</div>

<style>
  .pcsti-toggle {
    position: relative;
    display: inline-flex;
    align-items: stretch;
    gap: 0;
  }
  .pcsti-toggle.full-width {
    display: flex;
    width: 100%;
  }
  .pcsti-outline {
    min-height: 1.875rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-field);
    background: var(--bg-elev-2);
    padding: 0.125rem;
  }
  :global([data-theme="dark"]) .pcsti-outline {
    background: var(--bg);
  }
  button {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    border-radius: 3px;
    border: 1px solid transparent;
    padding: 0 0.5rem;
    color: var(--fg-muted);
    background: transparent;
    cursor: pointer;
    transition:
      color 150ms,
      background-color 150ms,
      border-color 150ms,
      box-shadow 150ms;
  }
  button:hover,
  button.pressed {
    color: var(--fg);
  }
  button:focus-visible {
    outline: none;
    border-color: color-mix(in oklch, var(--accent) 60%, var(--border));
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent);
  }
  button:disabled {
    pointer-events: none;
    opacity: 0.6;
  }
  .full-width button {
    width: 100%;
    flex: 1;
  }
  .pcsti-ghost button.pressed {
    background: var(--bg-hover);
  }
  .density-icon {
    display: block;
    width: 1rem;
    height: 1rem;
  }
  .indicator {
    pointer-events: none;
    position: absolute;
    inset-block: 0.125rem;
    border-radius: 3px;
    background: var(--bg-elev);
    box-shadow: var(--shadow-ui-sm);
  }
  :global([data-theme="dark"]) .indicator {
    background: var(--bg-elev-2);
  }
  @media (forced-colors: active) {
    button:focus-visible {
      outline: 2px solid Highlight;
    }
  }
</style>
