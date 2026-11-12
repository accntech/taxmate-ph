<script lang="ts">
  import { Icon as SolarIcon } from "../icon";

  import { glyphs } from "../../icons";

  import { pickerList } from "./index.styles";

  import fuzzysort from "fuzzysort";
  import * as stylex from "@stylexjs/stylex";
  import type { SvelteSet } from "svelte/reactivity";
  import { Checkbox } from "../checkbox";
  import { getScrollFadeState } from "./helpers";

  type Option = { value: string; label: string; disabled?: boolean };

  import type { AriaAttributes } from "svelte/elements";

  type Props = {
    id?: string;
    "aria-describedby"?: AriaAttributes["aria-describedby"];
    "aria-invalid"?: AriaAttributes["aria-invalid"];
    options: Option[];
    picked: SvelteSet<string>;
    onToggle: (value: string) => void;
    emptyMessage: string;
    searchPlaceholder?: string;
    searchMode?: "substring" | "fuzzy";
    noMatchMessage?: string;
  };

  let {
    id,
    "aria-describedby": describedBy,
    "aria-invalid": ariaInvalid,
    options,
    picked,
    onToggle,
    emptyMessage,
    searchPlaceholder,
    searchMode = "substring",
    noMatchMessage = "No matches.",
  }: Props = $props();

  let query = $state("");

  let filtered = $derived.by(() => {
    if (!searchPlaceholder) return options;
    const q = query.trim().toLowerCase();
    if (!q) return options;
    if (searchMode === "fuzzy") {
      return fuzzysort
        .go(q, options, { key: "label", threshold: 0, limit: 0 })
        .map((result) => result.obj);
    }
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  });

  function scrollFade(node: HTMLElement) {
    function update() {
      const fade = getScrollFadeState(node);
      node.dataset.fadeTop = fade.top;
      node.dataset.fadeBottom = fade.bottom;
    }
    const raf = requestAnimationFrame(update);
    const ro = new ResizeObserver(update);
    ro.observe(node);
    node.addEventListener("scroll", update, { passive: true });
    return {
      destroy() {
        cancelAnimationFrame(raf);
        ro.disconnect();
        node.removeEventListener("scroll", update);
      },
    };
  }
</script>

{#if options.length === 0}
  <div class={[stylex.attrs(pickerList.emptyMessage).class]}>
    {emptyMessage}
  </div>
{:else}
  {#if searchPlaceholder}
    <div class={[stylex.attrs(pickerList.searchRow).class]}>
      <label class={[stylex.attrs(pickerList.searchField).class]}>
        <span
          data-icon
          class={[stylex.attrs([pickerList.searchIcon]).class]}
          aria-hidden="true"><SolarIcon icon={glyphs.search} /></span
        >
        <input
          type="text"
          bind:value={query}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          class={[stylex.attrs(pickerList.searchInput).class]}
        />
      </label>
    </div>
  {/if}
  <div class={[stylex.attrs(pickerList.scrollFrame).class, "fade-scroll"]}>
    <div
      {id}
      use:scrollFade
      class={[stylex.attrs(pickerList.options).class, "fade-scroll-track"]}
    >
      {#if filtered.length === 0}
        <div class={[stylex.attrs(pickerList.noMatches).class]}>
          {noMatchMessage}
        </div>
      {:else}
        {#each filtered as opt (opt.value)}
          <button
            type="button"
            role="menuitemcheckbox"
            aria-describedby={describedBy}
            aria-invalid={ariaInvalid}
            aria-checked={picked.has(opt.value)}
            disabled={opt.disabled}
            onclick={() => onToggle(opt.value)}
            class={[
              stylex.attrs(
                pickerList.option,
                picked.has(opt.value) ? pickerList.selected : null,
              ).class,
            ]}
          >
            <Checkbox checked={picked.has(opt.value)} />
            <span>{opt.label}</span>
          </button>
        {/each}
      {/if}
    </div>
    <div class="fade-edge fade-edge-top" aria-hidden="true">
      <span data-icon class={[stylex.attrs().class, "fade-chevron"]}
        ><SolarIcon icon={glyphs.chevronUp} /></span
      >
    </div>
    <div class="fade-edge fade-edge-bottom" aria-hidden="true">
      <span data-icon class={[stylex.attrs().class, "fade-chevron"]}
        ><SolarIcon icon={glyphs.chevronDown} /></span
      >
    </div>
  </div>
{/if}

<style>
  .fade-edge {
    position: absolute;
    left: 0;
    right: 0;
    display: grid;
    place-items: center;
    height: 1.5rem;
    pointer-events: none;
    opacity: 0;
    transition:
      opacity 160ms ease-out,
      transform 160ms ease-out;
  }
  .fade-edge-top {
    top: 0;
    background: linear-gradient(
      to bottom,
      var(--bg-elev),
      color-mix(in oklch, var(--bg-elev) 0%, transparent)
    );
    transform: translateY(-2px);
  }
  .fade-edge-bottom {
    bottom: 0;
    background: linear-gradient(
      to top,
      var(--bg-elev),
      color-mix(in oklch, var(--bg-elev) 0%, transparent)
    );
    transform: translateY(2px);
  }
  .fade-scroll-track:global([data-fade-top="on"]) ~ .fade-edge-top,
  .fade-scroll-track:global([data-fade-bottom="on"]) ~ .fade-edge-bottom {
    opacity: 1;
    transform: translateY(0);
  }
  .fade-chevron {
    width: 0.875rem;
    height: 0.875rem;
    color: var(--fg-subtle);
  }
</style>
