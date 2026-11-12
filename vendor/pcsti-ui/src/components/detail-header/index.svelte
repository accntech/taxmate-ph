<script lang="ts">
  import { detailHeader } from "./index.styles";

  import * as stylex from "@stylexjs/stylex";
  import { styleAttributes } from "../../styles/style-attributes";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type Props = {
    title: string;
    subtitle?: string | null;
    status?: Snippet;
    actions?: Snippet;
    sx?: stylex.StyleXStyles;
    summarySx?: stylex.StyleXStyles;
    headingSx?: stylex.StyleXStyles;
    titleSx?: stylex.StyleXStyles;
    subtitleSx?: stylex.StyleXStyles;
  };

  let {
    title,
    subtitle = null,
    status,
    actions,
    sx,
    summarySx,
    headingSx,
    titleSx,
    subtitleSx,
    class: className = "",
    style,
    ...rest
  }: Props & Omit<HTMLAttributes<HTMLElement>, "title" | "children"> = $props();
  const attributes = $derived(
    styleAttributes([detailHeader.root, sx], "", style),
  );
</script>

<header {...rest} {...attributes} class={[attributes.class, className]}>
  <div {...stylex.attrs(detailHeader.summary, summarySx)}>
    <div {...stylex.attrs(detailHeader.heading, headingSx)}>
      {#if subtitle}
        <span {...stylex.attrs(detailHeader.subtitle, subtitleSx)}>
          {subtitle}
        </span>
      {/if}
      <h2 {...stylex.attrs(detailHeader.title, titleSx)}>
        {title}
      </h2>
      {@render actions?.()}
    </div>
    {@render status?.()}
  </div>
</header>
