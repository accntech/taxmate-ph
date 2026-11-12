<script lang="ts">
  import { toaster as toasterLayout } from "./toaster.styles";

  import * as stylex from "@stylexjs/stylex";
  import { flip } from "svelte/animate";
  import { MediaQuery } from "svelte/reactivity";
  import { fly } from "svelte/transition";
  import {
    createToastLayer,
    handleToastFocusOut,
    handleToastKeydown,
    handleToastVisibilityChange,
  } from "./toast-interactions.js";
  import { toastState } from "./toast-instance.svelte.js";
  import ToastItem from "./toast-item.svelte";
  import {
    toastClass,
    toastDuration,
    toastEntrance,
    toastExit,
    toastReorder,
    toastRole,
  } from "./toast-presentation.js";

  const prefersReducedMotion = new MediaQuery(
    "(prefers-reduced-motion: reduce)",
  );
  const isMobile = new MediaQuery("(width < 40rem)");
  const visibleToasts = $derived.by(() =>
    [...toastState.visibleItems].reverse(),
  );
  const toastLayer = createToastLayer();
</script>

<svelte:document onvisibilitychange={handleToastVisibilityChange} />

<section
  data-slot="toaster"
  aria-label="Notifications"
  popover="manual"
  class={[stylex.attrs(toasterLayout.root).class]}
  {@attach toastLayer}
>
  {#each visibleToasts as item (item.id)}
    <div
      data-slot="toast"
      data-type={item.type}
      data-paused={item.paused}
      role={toastRole(item.type)}
      aria-atomic="true"
      class={[stylex.attrs(toastClass(item.type)).class]}
      style:--toast-duration={toastDuration(item)}
      onpointerenter={() => toastState.pause(item.id, "pointer")}
      onpointerleave={() => toastState.resume(item.id, "pointer")}
      onfocusin={() => toastState.pause(item.id, "focus")}
      onfocusout={(event) => handleToastFocusOut(event, item.id)}
      onkeydown={(event) => handleToastKeydown(event, item.id)}
      in:fly={toastEntrance(isMobile.current, prefersReducedMotion.current)}
      out:fly={toastExit(isMobile.current, prefersReducedMotion.current)}
      animate:flip={toastReorder(prefersReducedMotion.current)}
    >
      <ToastItem {item} />
    </div>
  {/each}
</section>
