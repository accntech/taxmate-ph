<script lang="ts">
  import { Icon as SolarIcon } from "../icon";
  import type { IconComponent } from "../icon";

  import { detailSection } from "./index.styles";

  import * as stylex from "@stylexjs/stylex";
  import { styleAttributes } from "../../styles/style-attributes";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type Props = {
    title: string;
    icon?: IconComponent | null;
    animationDelay?: string;
    actions?: Snippet;
    children?: Snippet;
    sx?: stylex.StyleXStyles;
    headerSx?: stylex.StyleXStyles;
    titleSx?: stylex.StyleXStyles;
    bodySx?: stylex.StyleXStyles;
    markerSx?: stylex.StyleXStyles;
    accentSx?: stylex.StyleXStyles;
    showAccent?: boolean;
    showMarker?: boolean;
  };

  let {
    title,
    icon = null,
    animationDelay = "60ms",
    actions,
    children,
    sx,
    headerSx,
    titleSx,
    bodySx,
    markerSx,
    accentSx,
    showAccent = true,
    showMarker = true,
    class: className = "",
    style,
    ...rest
  }: Props & Omit<HTMLAttributes<HTMLElement>, "title" | "children"> = $props();
  const attributes = $derived(
    styleAttributes(
      [detailSection.root, sx],
      "",
      `animation-delay: ${animationDelay};${style ?? ""}`,
    ),
  );
</script>

<section {...rest} {...attributes} class={[attributes.class, className]}>
  {#if showAccent}
    <div
      {...stylex.attrs(detailSection.accentEdge, accentSx)}
      aria-hidden="true"
    ></div>
  {/if}
  <header {...stylex.attrs(detailSection.header, headerSx)}>
    <h3 {...stylex.attrs(detailSection.title, titleSx)}>
      {#if icon}
        <span
          data-icon
          class={[stylex.attrs(detailSection.icon).class]}
          aria-hidden="true"><SolarIcon {icon} /></span
        >
      {:else if showMarker}
        <span
          {...stylex.attrs(detailSection.titleMarker, markerSx)}
          aria-hidden="true"
        ></span>
      {/if}
      {title}
    </h3>
    {@render actions?.()}
  </header>
  <div {...stylex.attrs(detailSection.body, bodySx)}>
    {@render children?.()}
  </div>
</section>
