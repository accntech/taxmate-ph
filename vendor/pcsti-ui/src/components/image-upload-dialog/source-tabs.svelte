<script lang="ts">
  import { icons as imageSourcesIcons } from "./source-tabs.icons";
  import { Icon as SolarIcon } from "../icon";
  import type { IconComponent } from "../icon";

  import { glyphs } from "../../icons";

  import { imageSources } from "./source-tabs.styles";

  import * as stylex from "@stylexjs/stylex";
  import type { UploadSource } from "./types";

  type Props = {
    active: UploadSource;
    onchange: (source: UploadSource) => void;
  };

  let { active, onchange }: Props = $props();

  const tabs: {
    source: UploadSource;
    label: string;
    iconClass: IconComponent;
  }[] = [
    {
      source: "local",
      label: "My Files",
      iconClass: glyphs.monitor,
    },
    {
      source: "url",
      label: "Web Address",
      iconClass: imageSourcesIcons.linkIcon,
    },
    {
      source: "camera",
      label: "Camera",
      iconClass: glyphs.camera,
    },
  ];

  const activeIndex = $derived(
    Math.max(
      0,
      tabs.findIndex((t) => t.source === active),
    ),
  );
</script>

<div
  role="group"
  aria-label="Image source"
  class={[stylex.attrs(imageSources.root).class]}
>
  <div class={[stylex.attrs(imageSources.tabs).class]}>
    {#each tabs as tab, i (tab.source)}
      {@const isActive = active === tab.source}
      <button
        type="button"
        aria-pressed={isActive}
        class={[
          stylex.attrs(
            imageSources.tab,
            isActive ? imageSources.active : imageSources.inactive,
          ).class,
          "group",
        ]}
        style="animation-delay: {i * 40}ms"
        onclick={() => onchange(tab.source)}
      >
        <span
          class={[
            stylex.attrs(
              imageSources.icon,
              isActive ? imageSources.activeIcon : imageSources.inactiveIcon,
              isActive ? [null] : [imageSources.inactiveIconTheme],
            ).class,
          ]}
          aria-hidden="true"><SolarIcon icon={tab.iconClass} /></span
        >
        {tab.label}
      </button>
    {/each}
  </div>
  <span class={[stylex.attrs(imageSources.divider).class]} aria-hidden="true"
  ></span>
  <span
    class={[stylex.attrs(imageSources.indicatorTrack).class]}
    style="transform: translateX(calc({activeIndex} * 100%))"
    aria-hidden="true"
  >
    <span class={[stylex.attrs(imageSources.indicator).class]}></span>
  </span>
</div>
