<script lang="ts">
  import ChevronDownIcon from "@solar-icons/svelte/linear/alt-arrow-down";
  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import { fade } from "./index.styles";

  type Props = {
    class?: string;
    trackClass?: stylex.StyleXStyles;
    arrowClass?: stylex.StyleXStyles;
    children: Snippet;
  };

  let {
    class: klass = "",
    trackClass = null,
    arrowClass = null,
    children,
  }: Props = $props();

  let downOpacity = $state(0);
  let upOpacity = $state(0);

  function updateOpacities(node: HTMLElement) {
    const remaining = node.scrollHeight - node.scrollTop - node.clientHeight;
    downOpacity = Math.max(0, Math.min(1, remaining / 24));
    upOpacity = Math.max(0, Math.min(1, node.scrollTop / 24));
  }

  function watchScroll(node: HTMLElement) {
    const update = () => updateOpacities(node);
    update();
    node.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    const observeContent = () => {
      ro.disconnect();
      ro.observe(node);
      for (const child of node.children) ro.observe(child);
      update();
    };
    observeContent();
    const mutations = new MutationObserver(observeContent);
    mutations.observe(node, { childList: true, subtree: true });
    return () => {
      node.removeEventListener("scroll", update);
      ro.disconnect();
      mutations.disconnect();
    };
  }
</script>

<div class="pcsti-scroll-fade {klass}">
  <div {@attach watchScroll} {...stylex.attrs(trackClass)}>
    {@render children()}
  </div>
  <div
    class="pcsti-scroll-fade__edge pcsti-scroll-fade__edge--top"
    style:opacity={upOpacity}
    aria-hidden="true"
  >
    <span
      class={[
        stylex.attrs(fade.arrow, arrowClass).class,
        "pcsti-scroll-fade__arrow pcsti-scroll-fade__arrow--up",
      ]}
    >
      <ChevronDownIcon size="100%" aria-hidden="true" focusable="false" />
    </span>
  </div>
  <div
    class="pcsti-scroll-fade__edge pcsti-scroll-fade__edge--bottom"
    style:opacity={downOpacity}
    aria-hidden="true"
  >
    <span
      class={[
        stylex.attrs(fade.arrow, arrowClass).class,
        "pcsti-scroll-fade__arrow",
      ]}
    >
      <ChevronDownIcon size="100%" aria-hidden="true" focusable="false" />
    </span>
  </div>
</div>

<style>
  .pcsti-scroll-fade {
    position: relative;
  }

  .pcsti-scroll-fade__edge {
    position: absolute;
    right: 0;
    left: 0;
    z-index: 10;
    display: flex;
    height: 1.5rem;
    pointer-events: none;
    transition: opacity 180ms ease-out;
  }

  .pcsti-scroll-fade__edge--top {
    top: 0;
    align-items: flex-start;
    justify-content: center;
    padding-top: 0.125rem;
    background: linear-gradient(
      to bottom,
      var(--scroll-fade-bg, var(--bg-elev)),
      transparent
    );
  }

  .pcsti-scroll-fade__edge--bottom {
    bottom: 0;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 0.125rem;
    background: linear-gradient(
      to top,
      var(--scroll-fade-bg, var(--bg-elev)),
      transparent
    );
  }

  .pcsti-scroll-fade__arrow--up {
    transform: rotate(180deg);
  }
</style>
