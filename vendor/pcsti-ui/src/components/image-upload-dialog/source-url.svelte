<script lang="ts">
  import { Button } from "../button";
  import { icons as imageUrlIcons } from "./source-url.icons";
  import { Icon as SolarIcon } from "../icon";

  import { glyphs } from "../../icons";

  import { imageUrl } from "./source-url.styles";

  import * as stylex from "@stylexjs/stylex";
  import { onDestroy } from "svelte";
  import { Input } from "../input";
  import { validateImageResponse } from "./source-url-helpers";

  type Props = {
    allowedFormats?: string[];
    onselect: (blob: Blob) => void;
  };

  type FetchImageResult = { blob: Blob } | { error: string };
  type UrlValidation = { url: string } | { error: string };

  let { allowedFormats = ["png", "jpg", "jpeg", "webp"], onselect }: Props =
    $props();

  let url = $state("");
  let loading = $state(false);
  let error = $state("");
  let previewUrl = $state<string | null>(null);
  let fetchedBlob = $state<Blob | null>(null);

  function revokePreview() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = null;
    }
  }

  function clear() {
    revokePreview();
    fetchedBlob = null;
    error = "";
    url = "";
  }

  async function fetchImage() {
    error = "";
    const validated = validateUrl(url);
    if ("error" in validated) {
      error = validated.error;
      return;
    }

    loading = true;
    revokePreview();
    fetchedBlob = null;

    try {
      const result = await fetchImageBlob(validated.url, allowedFormats);
      if ("error" in result) {
        error = result.error;
        return;
      }

      fetchedBlob = result.blob;
      previewUrl = URL.createObjectURL(result.blob);
    } catch {
      error = "Failed to fetch image. Check the URL and try again.";
    } finally {
      loading = false;
    }
  }

  function validateUrl(value: string): UrlValidation {
    const trimmed = value.trim();
    if (!trimmed) return { error: "Please enter a URL" };

    try {
      new URL(trimmed);
      return { url: trimmed };
    } catch {
      return { error: "Invalid URL" };
    }
  }

  async function fetchImageBlob(
    src: string,
    formats: string[],
  ): Promise<FetchImageResult> {
    const response = await fetch(src);
    const responseError = validateImageResponse(
      {
        ok: response.ok,
        status: response.status,
        contentType: response.headers.get("content-type") ?? "",
      },
      formats,
    );
    if (responseError) return { error: responseError };

    return { blob: await response.blob() };
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchImage();
    }
  }

  onDestroy(revokePreview);
</script>

<div class={[stylex.attrs(imageUrl.root).class]}>
  <div class={[stylex.attrs(imageUrl.field).class]}>
    <p class={[stylex.attrs(imageUrl.label).class]}>Image URL</p>
    <div class={[stylex.attrs(imageUrl.controls).class]}>
      <div class={[stylex.attrs(imageUrl.inputFrame).class]}>
        <Input
          type="url"
          placeholder="https://example.com/image.png"
          bind:value={url}
          onkeydown={handleKeydown}
          disabled={loading}
        >
          {#snippet leading()}
            <span
              data-icon
              class={[stylex.attrs(imageUrl.linkIcon).class]}
              aria-hidden="true"
              ><SolarIcon icon={imageUrlIcons.linkIcon} /></span
            >
          {/snippet}
        </Input>
      </div>
      {#if previewUrl}
        <button
          type="button"
          class={[stylex.attrs(imageUrl.clearButton).class]}
          onclick={clear}
        >
          <span
            data-icon
            class={[stylex.attrs([imageUrl.clearIcon]).class]}
            aria-hidden="true"><SolarIcon icon={glyphs.closeCircle} /></span
          >
          Clear
        </button>
      {:else}
        <button
          type="button"
          class={[stylex.attrs(imageUrl.fetchButton).class]}
          onclick={fetchImage}
          disabled={loading || !url.trim()}
        >
          {#if loading}
            <span
              class={[stylex.attrs(imageUrl.spinner).class]}
              aria-hidden="true"
            ></span>
            Fetching…
          {:else}
            Fetch
          {/if}
        </button>
      {/if}
    </div>
  </div>

  {#if error}
    <div class={[stylex.attrs(imageUrl.error).class]}>
      <span
        data-icon
        class={[stylex.attrs([imageUrl.errorIcon]).class]}
        aria-hidden="true"><SolarIcon icon={glyphs.shieldAlert} /></span
      >
      <p class={[stylex.attrs(imageUrl.errorMessage).class]}>{error}</p>
    </div>
  {/if}

  {#if previewUrl}
    <div class={[stylex.attrs(imageUrl.preview).class]}>
      <img
        src={previewUrl}
        alt="Preview"
        class={[stylex.attrs(imageUrl.image).class]}
      />
      <Button
        type="button"
        variant="accent-soft"
        sx={imageUrl.selectButton}
        onclick={() => {
          if (fetchedBlob) onselect(fetchedBlob);
        }}
      >
        Use this image
      </Button>
    </div>
  {/if}
</div>
