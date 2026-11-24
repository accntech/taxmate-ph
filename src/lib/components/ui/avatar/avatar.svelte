<script lang="ts">
  import { Avatar, AvatarFallback, AvatarImage } from "@ui-sdk/svelte/avatar";
  import { avatar } from "./avatar.styles";

  import { styleAttributes } from "../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import {
    DEFAULT_AVATAR_IMAGE_SIZE,
    DEFAULT_AVATAR_SRCSET_WIDTHS,
    avatarImageResources,
    displayedAvatarSrc,
  } from "./helpers";

  type Props = {
    src?: string | null;
    fallback: string;
    alt?: string;
    class?: string;
    imageClass?: stylex.StyleXStyles;
    fallbackClass?: stylex.StyleXStyles;
    style?: string;
    sizes?: string;
    optimizedSize?: number;
    srcsetWidths?: readonly number[];
    loading?: "eager" | "lazy";
    decoding?: "async" | "auto" | "sync";
    ariaHidden?: boolean;
    children?: Snippet;
  };

  let {
    src = null,
    fallback,
    alt = "",
    sx,
    class: className = "",
    imageClass = avatar.image,
    fallbackClass = null,
    style,
    sizes = "96px",
    optimizedSize = DEFAULT_AVATAR_IMAGE_SIZE,
    srcsetWidths = DEFAULT_AVATAR_SRCSET_WIDTHS,
    loading = "lazy",
    decoding = "async",
    ariaHidden = false,
    children,
  }: Props & { sx?: stylex.StyleXStyles } = $props();

  let failedSrc = $state<string | null>(null);
  const visibleSrc = $derived(displayedAvatarSrc(src, failedSrc));
  const imageResources = $derived.by(() => {
    if (!visibleSrc) return null;
    return avatarImageResources(visibleSrc, optimizedSize, srcsetWidths);
  });

  function handleError() {
    failedSrc = visibleSrc;
  }
</script>

<Avatar
  {...styleAttributes(
    [avatar.root, sx],
    [className].flat(Infinity).filter(Boolean).join(" "),
    style,
  )}
  aria-hidden={ariaHidden || undefined}
>
  {#snippet render({ props, children: content, state })}
    <div {...props}>
      {@render content?.(state)}
    </div>
  {/snippet}
  {@render children?.()}
  {#if imageResources}
    <AvatarImage
      src={imageResources.src}
      srcset={imageResources.srcset}
      {sizes}
      {alt}
      width={optimizedSize}
      height={optimizedSize}
      class={stylex.attrs(imageClass).class}
      {loading}
      {decoding}
      onerror={handleError}
    />
  {:else}
    <AvatarFallback class={stylex.attrs(avatar.fallback, fallbackClass).class}>
      {fallback}
    </AvatarFallback>
  {/if}
</Avatar>
