<script lang="ts">
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { toastItem } from "./toast-item.styles";

  import * as stylex from "@stylexjs/stylex";
  import type { ToastItem } from "./toast-types.js";
  import { toastState } from "./toast-instance.svelte.js";

  let { item }: { item: ToastItem } = $props();

  function iconClass(type: ToastItem["type"]) {
    switch (type) {
      case "success":
        return glyphs.checkCircle;
      case "info":
        return glyphs.infoCircle;
      case "warning":
        return glyphs.warningTriangle;
      case "error":
        return glyphs.closeCircle;
    }
  }
</script>

<span
  class={[
    stylex.attrs(
      toastItem.badge,
      item.type === "success" && toastItem.successBadge,
      item.type === "info" && toastItem.infoBadge,
      item.type === "warning" && toastItem.warningBadge,
      item.type === "error" && toastItem.errorBadge,
    ).class,
  ]}
  aria-hidden="true"
>
  <span class={[stylex.attrs(toastItem.icon).class]} aria-hidden="true"
    ><SolarIcon icon={iconClass(item.type)} /></span
  >
</span>
<div class={[stylex.attrs(toastItem.copy).class]}>
  <p
    class={[
      stylex.attrs(
        toastItem.heading,
        item.type === "success" && toastItem.successHeading,
        item.type === "info" && toastItem.infoHeading,
        item.type === "warning" && toastItem.warningHeading,
        item.type === "error" && toastItem.errorHeading,
      ).class,
    ]}
  >
    {item.type === "error" ? "Needs attention" : item.type}
  </p>
  <p class={[stylex.attrs(toastItem.message).class]}>
    {item.message}
  </p>
  {#if item.description}
    <p class={[stylex.attrs(toastItem.description).class]}>
      {item.description}
    </p>
  {/if}
</div>
<button
  type="button"
  class={[stylex.attrs(toastItem.dismissButton).class]}
  aria-label={`Dismiss ${item.type} notification`}
  onclick={() => toastState.dismiss(item.id)}
>
  <span
    data-icon
    class={[stylex.attrs([toastItem.dismissIcon]).class]}
    aria-hidden="true"><SolarIcon icon={glyphs.closeSquare} /></span
  >
</button>
{#if item.duration !== null}
  <div
    data-slot="toast-progress"
    class={[stylex.attrs(toastItem.progressTrack).class, "toast-progress"]}
    aria-hidden="true"
  >
    <span
      class={[
        stylex.attrs(
          toastItem.progress,
          item.type === "success" && toastItem.successProgress,
          item.type === "info" && toastItem.infoProgress,
          item.type === "warning" && toastItem.warningProgress,
        ).class,
      ]}
    ></span>
  </div>
{/if}

<style>
  .toast-progress {
    animation: toast-countdown var(--toast-duration) linear forwards;
  }
  :global([data-paused="true"]) .toast-progress {
    animation-play-state: paused;
  }
  @keyframes toast-countdown {
    to {
      transform: scaleX(0);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .toast-progress {
      animation: none;
    }
  }
</style>
