<script lang="ts">
  import { formSection } from "./form-section.styles";

  import { styleAttributes } from "../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    title,
    step,
    sx,
    class: className = "",
    aside,
    children,
    headerSx,
    titleSx,
    stepSx,
    style,
    ...rest
  }: {
    title: string;
    step?: string | number;
    class?: string;
    aside?: Snippet;
    children: Snippet;
  } & {
    sx?: stylex.StyleXStyles;
    headerSx?: stylex.StyleXStyles;
    titleSx?: stylex.StyleXStyles;
    stepSx?: stylex.StyleXStyles;
  } & Omit<
      HTMLAttributes<HTMLElement>,
      "title" | "children" | "class"
    > = $props();

  const classes = $derived(formSection.root);
  const uid = $props.id();
  const headingId = `${uid}-title`;
</script>

<section
  {...rest}
  {...styleAttributes(
    [classes, sx],
    [className].flat(Infinity).filter(Boolean).join(" "),
    style,
  )}
  aria-labelledby={headingId}
>
  <header {...stylex.attrs(formSection.header, headerSx)}>
    {#if step !== undefined}
      <span {...stylex.attrs(formSection.step, stepSx)}>{step}</span>
    {/if}
    <h2 id={headingId} {...stylex.attrs(formSection.title, titleSx)}>
      {title}
    </h2>
    {@render aside?.()}
  </header>

  {@render children()}
</section>
