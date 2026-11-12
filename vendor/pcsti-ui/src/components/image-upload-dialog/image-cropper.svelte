<script lang="ts">
  import { Button } from "../button";
  import { icons as imageCropperIcons } from "./image-cropper.icons";
  import { Icon as SolarIcon } from "../icon";

  import { glyphs } from "../../icons";

  import { imageCropper } from "./image-cropper.styles";

  import * as stylex from "@stylexjs/stylex";
  import { onMount } from "svelte";
  import type Cropper from "cropperjs";
  import {
    confirmCropBlob,
    cropCanvasOptions,
    cropOutputOptions,
  } from "./image-cropper-helpers";

  type Props = {
    source: Blob;
    aspectRatio?: number;
    onconfirm: (blob: Blob) => void;
    onback: () => void;
  };

  let { source, aspectRatio = NaN, onconfirm, onback }: Props = $props();

  function initialRatio() {
    return aspectRatio;
  }

  let imgEl = $state<HTMLImageElement>();
  let cropper: Cropper | null = null;
  let objectUrl = $state("");
  let activeRatio = $state(initialRatio());

  const ratios: { label: string; value: number }[] = [
    { label: "Free", value: NaN },
    { label: "1:1", value: 1 },
    { label: "4:3", value: 4 / 3 },
    { label: "16:9", value: 16 / 9 },
  ];

  function setRatio(value: number) {
    activeRatio = value;
    const selection = cropper?.getCropperSelection();
    if (selection) selection.aspectRatio = value;
  }

  onMount(() => {
    let disposed = false;
    objectUrl = URL.createObjectURL(source);
    if (!imgEl) {
      return () => {
        disposed = true;
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      };
    }
    const img = imgEl;
    const initCropper = async () => {
      const { default: Cropper } = await import("cropperjs");
      if (disposed || !img.isConnected) return;
      cropper = new Cropper(img);

      const canvas = cropper.getCropperCanvas();
      if (canvas) {
        canvas.background = false;
        canvas.style.height = "20rem";
      }

      const selection = cropper.getCropperSelection();
      if (selection) {
        selection.initialCoverage = 0.8;
        selection.aspectRatio = activeRatio;
      }
    };
    img.addEventListener("load", initCropper, { once: true });

    return () => {
      disposed = true;
      img.removeEventListener("load", initCropper);
      cropper?.destroy();
      cropper = null;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  });

  async function handleCrop() {
    const selection = cropper?.getCropperSelection();
    if (!selection) return;

    const canvas = await selection.$toCanvas(cropCanvasOptions(activeRatio));
    const { mime, quality } = cropOutputOptions(source.type);
    canvas.toBlob((blob) => confirmCropBlob(blob, onconfirm), mime, quality);
  }

  function handleSkip() {
    onconfirm(source);
  }
</script>

<div class={[stylex.attrs(imageCropper.root).class]}>
  <div class={[stylex.attrs(imageCropper.preview).class]}>
    <img
      bind:this={imgEl}
      src={objectUrl}
      alt="Crop preview"
      class={[stylex.attrs(imageCropper.image).class]}
    />
  </div>

  <div
    role="radiogroup"
    aria-label="Aspect ratio"
    class={[stylex.attrs(imageCropper.controls).class]}
  >
    {#each ratios as ratio (ratio.label)}
      {@const isActive =
        (Number.isNaN(activeRatio) && Number.isNaN(ratio.value)) ||
        activeRatio === ratio.value}
      <button
        type="button"
        role="radio"
        aria-checked={isActive}
        class={[
          stylex.attrs(
            imageCropper.ratio,
            isActive && imageCropper.selectedRatio,
            !isActive && imageCropper.unselectedRatio,
          ).class,
        ]}
        onclick={() => setRatio(ratio.value)}
      >
        {ratio.label}
      </button>
    {/each}
  </div>

  <div class={[stylex.attrs(imageCropper.footer).class]}>
    <button
      type="button"
      class={[stylex.attrs(imageCropper.secondaryButton).class]}
      onclick={onback}
    >
      <span
        data-icon
        class={[stylex.attrs([imageCropper.backIcon]).class]}
        aria-hidden="true"><SolarIcon icon={glyphs.arrowLeft} /></span
      >
      Back
    </button>
    <div class={[stylex.attrs(imageCropper.controls).class]}>
      <Button
        type="button"
        variant="accent-soft"
        sx={imageCropper.secondaryButton}
        onclick={handleSkip}
      >
        Just Upload
      </Button>
      <Button
        type="button"
        variant="accent-soft"
        sx={imageCropper.uploadButton}
        onclick={handleCrop}
      >
        <span
          data-icon
          class={[stylex.attrs(imageCropper.uploadIcon).class]}
          aria-hidden="true"
          ><SolarIcon icon={imageCropperIcons.uploadIcon} /></span
        >
        Crop & Upload
      </Button>
    </div>
  </div>
</div>
