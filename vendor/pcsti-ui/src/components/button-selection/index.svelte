<script lang="ts" generics="T extends string">
  import { selection as selectionLayout } from "./index.styles";

  import { styleAttributes } from "../../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import { onMount } from "svelte";
  import { getSelectionDecision } from "./selection";

  type Option = { value: T; label: string };

  import type { AriaAttributes } from "svelte/elements";

  type Props = {
    id?: string;
    "aria-describedby"?: AriaAttributes["aria-describedby"];
    "aria-invalid"?: AriaAttributes["aria-invalid"];
    value: T | null | undefined;
    disabled?: boolean;
    options: Option[];
    name?: string;
    ariaLabel?: string;
    ariaDescribedby?: string;
    class?: string;
    tone?: "neutral" | "primary";
    truncateLabels?: boolean;
    height?: "default" | "input";
    onValueChange?: (value: T) => void;
  };

  let {
    id,
    "aria-describedby": describedBy,
    "aria-invalid": ariaInvalid,
    value = $bindable(),
    disabled = false,
    options,
    name,
    ariaLabel,
    ariaDescribedby,
    sx,
    class: className = "",
    tone = "neutral",
    truncateLabels = true,
    height = "default",
    onValueChange,
  }: Props & { sx?: stylex.StyleXStyles } = $props();

  const STRETCH_MS = 120;
  const SNAP_MS = 220;
  const STRETCH_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
  const SNAP_EASING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
  const NAVIGATION_KEYS = [
    "ArrowRight",
    "ArrowDown",
    "ArrowLeft",
    "ArrowUp",
    "Home",
    "End",
  ] as const;

  type NavigationKey = (typeof NAVIGATION_KEYS)[number];

  let buttonRefs: HTMLButtonElement[] = $state([]);
  let reduceMotion = $state(false);
  let stretchTimer: ReturnType<typeof setTimeout> | undefined;
  let hasMounted = $state(false);

  const currentIdx = $derived(options.findIndex((o) => o.value === value));
  let fromIdx = $state(-1);
  let isStretching = $state(false);
  let canAnimate = $state(false);

  const pillTransition = $derived(
    reduceMotion || !canAnimate
      ? "none"
      : isStretching
        ? `left ${STRETCH_MS}ms ${STRETCH_EASING}, width ${STRETCH_MS}ms ${STRETCH_EASING}`
        : `left ${SNAP_MS}ms ${SNAP_EASING}, width ${SNAP_MS}ms ${SNAP_EASING}`,
  );

  function select(nextVal: T) {
    if (disabled) return;
    const decision = getSelectionDecision({
      value,
      nextValue: nextVal,
      currentIdx,
      options,
      reduceMotion,
    });
    if (decision.kind === "ignore") return;

    clearTimeout(stretchTimer);
    stretchTimer = undefined;

    value = decision.value;
    onValueChange?.(decision.value);

    if (decision.kind === "snap") {
      canAnimate = false;
      fromIdx = decision.fromIdx;
      isStretching = false;
      return;
    }

    fromIdx = decision.fromIdx;
    canAnimate = true;
    isStretching = true;

    stretchTimer = setTimeout(() => {
      stretchTimer = undefined;
      isStretching = false;
      fromIdx = decision.nextIdx;
    }, STRETCH_MS);
  }

  function focusAt(index: number) {
    const btn = buttonRefs[index];
    if (btn) btn.focus();
  }

  function isNavigationKey(key: string): key is NavigationKey {
    return NAVIGATION_KEYS.includes(key as NavigationKey);
  }

  function getStep(key: NavigationKey) {
    return key === "ArrowRight" || key === "ArrowDown" ? 1 : -1;
  }

  function getStartingIndex(step: number, last: number) {
    return step > 0 ? 0 : last;
  }

  function wrapIndex(index: number, last: number, step: number) {
    return (index + step + last + 1) % (last + 1);
  }

  function getArrowIndex(key: NavigationKey, last: number) {
    const step = getStep(key);
    return currentIdx < 0
      ? getStartingIndex(step, last)
      : wrapIndex(currentIdx, last, step);
  }

  function getNextIndex(key: NavigationKey, last: number) {
    if (key === "Home") return 0;
    if (key === "End") return last;

    return getArrowIndex(key, last);
  }

  function moveSelectionTo(index: number) {
    select(options[index].value);
    focusAt(index);
  }

  function onKeydown(e: KeyboardEvent) {
    if (disabled || !isNavigationKey(e.key)) return;

    e.preventDefault();
    moveSelectionTo(getNextIndex(e.key, options.length - 1));
  }

  onMount(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    reduceMotion = motionPreference.matches;

    function updateMotionPreference(event: MediaQueryListEvent) {
      reduceMotion = event.matches;
      if (!reduceMotion) return;
      clearTimeout(stretchTimer);
      stretchTimer = undefined;
      canAnimate = false;
      isStretching = false;
      fromIdx = currentIdx;
    }

    motionPreference.addEventListener("change", updateMotionPreference);
    fromIdx = currentIdx;
    hasMounted = true;

    return () => {
      clearTimeout(stretchTimer);
      motionPreference.removeEventListener("change", updateMotionPreference);
    };
  });
</script>

<div
  {id}
  role="radiogroup"
  tabindex="-1"
  aria-label={ariaLabel}
  aria-describedby={describedBy ?? ariaDescribedby}
  aria-invalid={ariaInvalid}
  aria-disabled={disabled || undefined}
  onkeydown={onKeydown}
  {...styleAttributes(
    [
      selectionLayout.root,
      height === "input"
        ? selectionLayout.inputHeight
        : selectionLayout.compactHeight,
      sx,
    ],
    [className].flat(Infinity).filter(Boolean).join(" "),
  )}
>
  <!-- prettier-ignore -->
  <div
		aria-hidden="true"
		style:--bs-pad="3px"
		style:--bs-gap="2px"
		style:--bs-count={options.length}
		style:--bs-from={Math.max(0, fromIdx)}
		style:--bs-to={Math.max(0, currentIdx)}
		style:--bs-bw="calc((100% - 2 * var(--bs-pad) - (var(--bs-count) - 1) * var(--bs-gap)) / var(--bs-count))"
		style:--bs-pos-from="calc(var(--bs-pad) + var(--bs-from) * (var(--bs-bw) + var(--bs-gap)))"
		style:--bs-pos-to="calc(var(--bs-pad) + var(--bs-to) * (var(--bs-bw) + var(--bs-gap)))"
		style:--bs-stretch-left="min(var(--bs-pos-from), var(--bs-pos-to))"
		style:--bs-stretch-width="calc(max(var(--bs-pos-from), var(--bs-pos-to)) - min(var(--bs-pos-from), var(--bs-pos-to)) + var(--bs-bw))"
		style:left={isStretching ? 'var(--bs-stretch-left)' : 'var(--bs-pos-to)'}
		style:width={isStretching ? 'var(--bs-stretch-width)' : 'var(--bs-bw)'}
		style:opacity={hasMounted && currentIdx >= 0 ? 1 : 0}
		style:transition={pillTransition}
		class={[stylex.attrs(selectionLayout.indicator, (tone === 'primary') ? selectionLayout.primaryIndicator : selectionLayout.neutralIndicator, (tone === 'primary') ? [null] : [selectionLayout.neutralIndicatorTheme]).class]}
	></div>
  {#each options as option, i (option.value)}
    {@const checked = value === option.value}
    <button
      bind:this={buttonRefs[i]}
      type="button"
      {disabled}
      role="radio"
      aria-describedby={describedBy ?? ariaDescribedby}
      aria-checked={checked}
      tabindex={checked ? 0 : -1}
      onclick={() => select(option.value)}
      class={[
        stylex.attrs(
          selectionLayout.option,
          truncateLabels
            ? selectionLayout.truncatedLabel
            : selectionLayout.fullLabel,
          checked
            ? tone === "primary"
              ? selectionLayout.selectedPrimary
              : selectionLayout.selectedNeutral
            : selectionLayout.unselected,
        ).class,
      ]}
    >
      {option.label}
    </button>
  {/each}
  {#if name}
    <input type="hidden" {name} value={value ?? ""} />
  {/if}
</div>
