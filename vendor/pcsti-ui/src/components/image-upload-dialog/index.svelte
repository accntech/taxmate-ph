<script lang="ts">
  import { Icon as SolarIcon } from "../icon";

  import { glyphs } from "../../icons";

  import { imageUpload } from "./index.styles";

  import * as stylex from "@stylexjs/stylex";
  import { Dialog } from "../dialog";
  import type {
    ImageUploadResult,
    ImageUploadError,
    UploadSource,
    UploadStep,
  } from "./types";
  import { uploadToCloudinary } from "./cloudinary-upload";
  import SourceTabs from "./source-tabs.svelte";
  import SourceLocal from "./source-local.svelte";
  import SourceUrl from "./source-url.svelte";
  import SourceCamera from "./source-camera.svelte";
  import ImageCropper from "./image-cropper.svelte";
  import UploadProgress from "./upload-progress.svelte";
  import { isUploadAbort, uploadErrorMessage } from "./helpers";

  type Props = {
    cloudName: string;
    uploadPreset: string;
    folder: string;
    aspectRatio?: number;
    maxFileSize?: number;
    allowedFormats?: string[];
    onSuccess?: (id: string, result: ImageUploadResult) => void | Promise<void>;
    onError?: (error: ImageUploadError) => void;
  };

  let {
    cloudName,
    uploadPreset,
    folder,
    aspectRatio = 1,
    maxFileSize = 5 * 1024 * 1024,
    allowedFormats = ["png", "jpg", "jpeg", "webp"],
    onSuccess,
    onError,
  }: Props = $props();

  let open = $state(false);
  let step = $state<UploadStep>("select");
  let source = $state<UploadSource>("local");
  let currentEntityId = $state("");
  let selectedBlob = $state<Blob | null>(null);
  let croppedBlob = $state<Blob | null>(null);
  let progress = $state(0);
  let errorMessage = $state("");
  let abortController: AbortController | null = null;

  const canDismiss = $derived(step !== "uploading");
  const stepMinHeight = $derived.by(() => {
    if (step === "crop") return imageUpload.cropHeight;
    if (step === "uploading" || step === "error")
      return imageUpload.resultHeight;
    return imageUpload.sourceHeight;
  });

  export function upload(entityId: string) {
    currentEntityId = entityId;
    resetState();
    open = true;
  }

  function resetState() {
    step = "select";
    source = "local";
    selectedBlob = null;
    croppedBlob = null;
    progress = 0;
    errorMessage = "";
  }

  function handleSourceSelected(blob: File | Blob) {
    selectedBlob = blob;
    step = "crop";
  }

  function beginUpload(blob: Blob): AbortController {
    croppedBlob = blob;
    selectedBlob = null;
    step = "uploading";
    progress = 0;
    const controller = new AbortController();
    abortController = controller;
    return controller;
  }

  function uploadBlob(blob: Blob, signal: AbortSignal) {
    return uploadToCloudinary({
      blob,
      cloudName,
      uploadPreset,
      folder,
      onProgress: (p) => {
        progress = p;
      },
      signal,
    });
  }

  async function finishUpload(result: ImageUploadResult) {
    croppedBlob = null;
    open = false;
    await onSuccess?.(currentEntityId, result);
  }

  function showUploadError(error: unknown) {
    selectedBlob = null;
    croppedBlob = null;
    errorMessage = uploadErrorMessage(error);
    step = "error";
    onError?.({ message: errorMessage });
  }

  async function handleCropConfirm(blob: Blob) {
    const controller = beginUpload(blob);
    try {
      const result = await uploadBlob(blob, controller.signal);
      await finishUpload(result);
    } catch (e) {
      if (!isUploadAbort(e)) showUploadError(e);
    } finally {
      abortController = null;
    }
  }

  function handleBack() {
    selectedBlob = null;
    step = "select";
  }

  function handleRetry() {
    resetState();
  }

  function abortPendingClose(next: boolean) {
    if (!next) abortController?.abort();
  }

  function applyDismissibleOpenChange(next: boolean) {
    if (!canDismiss) return;
    open = next;
    if (!next) resetState();
  }

  function handleOpenChange(next: boolean) {
    abortPendingClose(next);
    applyDismissibleOpenChange(next);
  }
</script>

<Dialog
  bind:open
  onOpenChange={handleOpenChange}
  size="md"
  closedByBackdrop={canDismiss}
  closedByEscape={canDismiss}
  title="Upload Photo"
  description="Select and crop an image to upload"
>
  <div class={[stylex.attrs(imageUpload.root, stepMinHeight).class]}>
    {#key step}
      <div class={[stylex.attrs(imageUpload.step).class]}>
        {#if step === "select"}
          <SourceTabs
            active={source}
            onchange={(s) => {
              source = s;
            }}
          />
          {#if source === "local"}
            <SourceLocal
              {maxFileSize}
              {allowedFormats}
              onselect={handleSourceSelected}
            />
          {:else if source === "url"}
            <SourceUrl {allowedFormats} onselect={handleSourceSelected} />
          {:else if source === "camera"}
            <SourceCamera onselect={handleSourceSelected} />
          {/if}
        {:else if step === "crop" && selectedBlob}
          <ImageCropper
            source={selectedBlob}
            {aspectRatio}
            onconfirm={handleCropConfirm}
            onback={handleBack}
          />
        {:else if step === "uploading" && croppedBlob}
          <UploadProgress previewBlob={croppedBlob} {progress} />
        {:else if step === "error"}
          <div class={[stylex.attrs(imageUpload.error).class]}>
            <div class={[stylex.attrs(imageUpload.errorBadge).class]}>
              <span
                data-icon
                class={[stylex.attrs([imageUpload.errorIcon]).class]}
                aria-hidden="true"><SolarIcon icon={glyphs.shieldAlert} /></span
              >
            </div>
            <div class={[stylex.attrs(imageUpload.errorCopy).class]}>
              <p class={[stylex.attrs(imageUpload.errorTitle).class]}>
                Upload failed
              </p>
              <p class={[stylex.attrs(imageUpload.errorMessage).class]}>
                {errorMessage}
              </p>
            </div>
            <button
              type="button"
              class={[stylex.attrs(imageUpload.retryButton).class]}
              onclick={handleRetry}
            >
              Try Again
            </button>
          </div>
        {/if}
      </div>
    {/key}
  </div>
</Dialog>
