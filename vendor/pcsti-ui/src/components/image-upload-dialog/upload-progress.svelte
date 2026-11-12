<script lang="ts">
  import { Icon as SolarIcon } from "../icon";

  import { glyphs } from "../../icons";

  import { uploadProgress } from "./upload-progress.styles";

  import * as stylex from "@stylexjs/stylex";
  import { onDestroy } from "svelte";

  type Props = {
    previewBlob: Blob;
    progress: number;
  };

  let { previewBlob, progress }: Props = $props();

  function initialUrl() {
    return URL.createObjectURL(previewBlob);
  }

  let previewUrl = $state(initialUrl());

  onDestroy(() => {
    URL.revokeObjectURL(previewUrl);
  });

  const label = $derived(progress >= 100 ? "Processing…" : "Uploading…");
</script>

<div class={[stylex.attrs(uploadProgress.root).class]}>
  <div class={[stylex.attrs(uploadProgress.preview).class]}>
    <img
      src={previewUrl}
      alt="Upload preview"
      class={[stylex.attrs(uploadProgress.image).class]}
    />
  </div>

  <div class={[stylex.attrs(uploadProgress.progress).class]}>
    <div class={[stylex.attrs(uploadProgress.track).class]}>
      <div
        class={[stylex.attrs(uploadProgress.fill).class]}
        style="width: {progress}%"
      >
        {#if progress > 0 && progress < 100}
          <div
            class={[stylex.attrs(uploadProgress.shimmer).class]}
            style="background-size: 200% 100%"
            aria-hidden="true"
          ></div>
        {/if}
      </div>
    </div>

    <div class={[stylex.attrs(uploadProgress.summary).class]}>
      <div class={[stylex.attrs(uploadProgress.status).class]}>
        {#if progress >= 100}
          <span
            data-icon
            class={[stylex.attrs([uploadProgress.completeIcon]).class]}
            aria-hidden="true"><SolarIcon icon={glyphs.checkCircle} /></span
          >
        {:else}
          <span
            class={[stylex.attrs(uploadProgress.spinner).class]}
            aria-hidden="true"
          ></span>
        {/if}
        <span class={[stylex.attrs(uploadProgress.label).class]}>{label}</span>
      </div>
      <span class={[stylex.attrs(uploadProgress.percentage).class]}
        >{progress}%</span
      >
    </div>
  </div>
</div>
