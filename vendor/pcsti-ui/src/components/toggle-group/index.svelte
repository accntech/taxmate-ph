<script lang="ts" generics="T extends string">
  import { Icon as SolarIcon } from "../icon";
  import type { IconComponent } from "../icon";

  import { toggleGroup } from "./index.styles";

  import { styleAttributes } from "../../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import { onMount } from "svelte";
  import { Tooltip } from "../tooltip";

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
    options: Option[];
    onchange: (v: T) => void;
    variant?: "outline" | "ghost";
    ariaLabel: string;
    disabled?: boolean;
    fullWidth?: boolean;
    class?: string;
  };
  let {
    id,
    "aria-describedby": describedBy,
    value,
    options,
    onchange,
    variant = "outline",
    ariaLabel,
    disabled = false,
    fullWidth = false,
    sx,
    class: klass = "",
  }: Props & { sx?: stylex.StyleXStyles } = $props();

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
  {...styleAttributes(
    [
      toggleGroup.root,
      fullWidth ? toggleGroup.fullWidth : toggleGroup.inlineWidth,
      variant === "outline" ? toggleGroup.outline : null,
      sx,
    ],
    [klass].flat(Infinity).filter(Boolean).join(" "),
  )}
>
  {#if variant === "outline"}
    <div
      aria-hidden="true"
      class={[stylex.attrs(toggleGroup.indicator).class]}
      style:left="{pillLeft}px"
      style:width="{pillWidth}px"
      style:opacity={hasMeasured && pillWidth > 0 ? 1 : 0}
      style:transition={transitionStyle}
    ></div>
  {/if}
  {#each options as opt, i (opt.value)}
    {@const pressed = value === opt.value}
    {#snippet segment()}
      <button
        bind:this={buttonRefs[i]}
        type="button"
        aria-label={opt.label}
        aria-pressed={pressed}
        aria-describedby={describedBy}
        {disabled}
        onclick={() => handleClick(opt.value)}
        class={[
          stylex.attrs(
            toggleGroup.option,
            fullWidth ? toggleGroup.stretchedOption : null,
            variant === "outline"
              ? pressed
                ? toggleGroup.pressedOutline
                : toggleGroup.idleOutline
              : pressed
                ? toggleGroup.pressedDefault
                : toggleGroup.idleDefault,
          ).class,
        ]}
      >
        {#if opt.icon}
          <span
            data-icon
            class={[stylex.attrs(toggleGroup.icon).class]}
            aria-hidden="true"><SolarIcon icon={opt.icon} /></span
          >
        {:else}
          {opt.label}
        {/if}
      </button>
    {/snippet}

    <Tooltip
      label={opt.label}
      sx={fullWidth ? toggleGroup.stretchedTooltip : toggleGroup.inlineWidth}
    >
      {@render segment()}
    </Tooltip>
  {/each}
</div>
