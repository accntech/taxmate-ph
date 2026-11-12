<script lang="ts">
  import { icons as localImageIcons } from "./source-local.icons";
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { localImage } from "./source-local.styles";

  import * as stylex from "@stylexjs/stylex";
  type Props = {
    maxFileSize?: number;
    allowedFormats?: string[];
    onselect: (file: File) => void;
  };

  let {
    maxFileSize = 5 * 1024 * 1024,
    allowedFormats = ["png", "jpg", "jpeg", "webp"],
    onselect,
  }: Props = $props();

  let dragging = $state(false);
  let error = $state("");
  let fileInput = $state<HTMLInputElement>();

  const acceptAttribute = $derived(
    allowedFormats.map((f) => `image/${f === "jpg" ? "jpeg" : f}`).join(","),
  );
  const formatsText = $derived(
    `${allowedFormats.map((f) => f.toUpperCase()).join(", ")} up to ${(maxFileSize / (1024 * 1024)).toFixed(0)}MB`,
  );

  function validate(file: File): string | null {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!allowedFormats.includes(ext)) {
      return `Invalid file type. Allowed: ${allowedFormats.join(", ")}`;
    }
    if (file.size > maxFileSize) {
      return `File too large. Maximum size: ${(maxFileSize / (1024 * 1024)).toFixed(0)}MB`;
    }
    return null;
  }

  function processFile(file: File) {
    const validationError = validate(file);
    if (validationError) {
      error = validationError;
      return;
    }
    error = "";
    onselect(file);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    const file = e.dataTransfer?.files[0];
    if (file) processFile(file);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    dragging = true;
  }

  function handleDragLeave() {
    dragging = false;
  }

  function handleFileChange(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (file) processFile(file);
    input.value = "";
  }

  function openPicker() {
    fileInput?.click();
  }
</script>

<input
  bind:this={fileInput}
  type="file"
  accept={acceptAttribute}
  onchange={handleFileChange}
  class={[stylex.attrs(localImage.fileInput).class]}
/>

<button
  type="button"
  class={[
    stylex.attrs(
      localImage.dropzone,
      dragging ? localImage.dragging : localImage.idle,
    ).class,
    "group",
  ]}
  onclick={openPicker}
  ondrop={handleDrop}
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
>
  <div
    class={[
      stylex.attrs(
        localImage.iconBadge,
        dragging ? localImage.draggingBadge : localImage.idleBadge,
        dragging ? [null] : [localImage.idleBadgeTheme],
      ).class,
    ]}
  >
    <span
      data-icon
      class={[
        stylex.attrs(
          localImage.uploadIcon,
          dragging ? localImage.draggingIcon : localImage.idleIcon,
        ).class,
      ]}
      aria-hidden="true"><SolarIcon icon={localImageIcons.uploadIcon} /></span
    >
  </div>

  <div class={[stylex.attrs(localImage.instructions).class]}>
    <p
      class={[
        stylex.attrs(
          localImage.prompt,
          dragging ? localImage.draggingPrompt : localImage.idlePrompt,
        ).class,
      ]}
    >
      {dragging ? "Drop to upload" : "Drag and drop an image here"}
    </p>
    <p class={[stylex.attrs(localImage.hint).class]}>
      {formatsText}
    </p>
  </div>

  <div class={[stylex.attrs(localImage.separatorRow).class]}>
    <hr class={[stylex.attrs(localImage.separator).class]} />
    <span class={[stylex.attrs(localImage.hint).class]}>or</span>
    <hr class={[stylex.attrs(localImage.separator).class]} />
  </div>

  <span class={[stylex.attrs(localImage.browseLabel).class]}> Browse </span>

  {#if error}
    <div class={[stylex.attrs(localImage.error).class]}>
      <span
        data-icon
        class={[stylex.attrs([localImage.errorIcon]).class]}
        aria-hidden="true"><SolarIcon icon={glyphs.shieldAlert} /></span
      >
      <p class={[stylex.attrs(localImage.errorMessage).class]}>{error}</p>
    </div>
  {/if}
</button>
