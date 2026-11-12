<script lang="ts">
  import { icons as cameraLayoutIcons } from "./source-camera.icons";
  import { Icon as SolarIcon } from "../icon";

  import { camera as cameraLayout } from "./source-camera.styles";

  import * as stylex from "@stylexjs/stylex";
  import { onMount, onDestroy } from "svelte";

  type Props = {
    onselect: (blob: Blob) => void;
  };

  let { onselect }: Props = $props();

  let stream = $state<MediaStream | null>(null);
  let error = $state("");
  let videoEl = $state<HTMLVideoElement>();

  onMount(() => {
    void startCamera();
  });

  onDestroy(() => {
    stream?.getTracks().forEach(stopTrack);
  });

  async function startCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      stream = s;
      if (videoEl) videoEl.srcObject = s;
    } catch (e) {
      error = getCameraErrorMessage(e);
    }
  }

  function getCameraErrorMessage(e: unknown) {
    if (!(e instanceof DOMException)) {
      return "An unexpected error occurred while accessing the camera.";
    }

    return (
      cameraErrorMessages[e.name] ??
      "Unable to access camera. Please check your device settings."
    );
  }

  const cameraErrorMessages: Record<string, string> = {
    NotAllowedError:
      "Camera access denied. Please allow camera access in your browser settings.",
    PermissionDeniedError:
      "Camera access denied. Please allow camera access in your browser settings.",
    NotFoundError: "No camera found. Please connect a camera and try again.",
    DevicesNotFoundError:
      "No camera found. Please connect a camera and try again.",
  };

  function stopTrack(track: MediaStreamTrack) {
    track.stop();
  }

  function capture() {
    if (!videoEl) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoEl, 0, 0);
    canvas.toBlob(selectBlob, "image/jpeg", 0.9);
  }

  function selectBlob(blob: Blob | null) {
    if (blob) onselect(blob);
  }
</script>

<div class={[stylex.attrs(cameraLayout.root).class]}>
  {#if error}
    <div class={[stylex.attrs(cameraLayout.error).class]}>
      <span
        data-icon
        class={[stylex.attrs(cameraLayout.errorIcon).class]}
        aria-hidden="true"
        ><SolarIcon icon={cameraLayoutIcons.errorIcon} /></span
      >
      <p class={[stylex.attrs(cameraLayout.statusMessage).class]}>{error}</p>
    </div>
  {:else}
    {#if !stream}
      <div class={[stylex.attrs(cameraLayout.loading).class]}>
        <span
          class={[stylex.attrs(cameraLayout.spinner).class]}
          aria-hidden="true"
        ></span>
        <p class={[stylex.attrs(cameraLayout.statusMessage).class]}>
          Accessing camera…
        </p>
      </div>
    {/if}

    <div class={[stylex.attrs(cameraLayout.preview).class]}>
      <video
        bind:this={videoEl}
        autoplay
        playsinline
        muted
        class={[stylex.attrs(cameraLayout.video).class]}
      ></video>

      <div class={[stylex.attrs(cameraLayout.guide).class]}>
        <div class={[stylex.attrs(cameraLayout.topLeftCorner).class]}></div>
        <div class={[stylex.attrs(cameraLayout.topRightCorner).class]}></div>
        <div class={[stylex.attrs(cameraLayout.bottomLeftCorner).class]}></div>
        <div class={[stylex.attrs(cameraLayout.bottomRightCorner).class]}></div>
      </div>
    </div>

    <button
      type="button"
      aria-label="Capture photo"
      class={[stylex.attrs(cameraLayout.captureButton).class, "group"]}
      onclick={capture}
    >
      <span
        class={[stylex.attrs(cameraLayout.shutterRing).class]}
        aria-hidden="true"
      ></span>
      <span
        class={[stylex.attrs(cameraLayout.shutter).class]}
        aria-hidden="true"
      ></span>
    </button>
  {/if}
</div>
