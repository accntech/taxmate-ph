<script lang="ts">
  import CheckIcon from "@solar-icons/svelte/linear/check";
  import { Icon as SolarIcon } from "../icon";

  import { glyphs } from "../../icons";

  import { formFooter } from "./index.styles";

  import * as stylex from "@stylexjs/stylex";
  import { onMount, type Snippet } from "svelte";
  import type { Attachment } from "svelte/attachments";

  type Props = {
    submitting: boolean;
    fieldCount: number;
    disabled?: boolean;
    submitLabel?: string;
    submittingLabel?: string;
    submitIcon?: "arrow-right" | "download";
    readyLabel?: string;
    cancelLabel?: string;
    unitLabel?: string;
    reviewLabel?: string;
    onCancel?: () => void;
    actions?: Snippet;
    submitAction?: Snippet;
  };
  let {
    submitting,
    fieldCount,
    disabled = false,
    submitLabel = "Submit",
    submittingLabel = "Submitting…",
    submitIcon = "arrow-right",
    readyLabel = "Ready to submit",
    cancelLabel = "Cancel",
    unitLabel = "fields",
    reviewLabel = "to review",
    onCancel,
    actions,
    submitAction,
  }: Props = $props();

  let floating = $state(false);
  const submitIconClass = $derived(
    submitIcon === "download" ? glyphs.download : glyphs.arrowRight,
  );

  onMount(() => {
    const update = () => {
      floating =
        window.innerHeight + window.scrollY <
        document.documentElement.scrollHeight - 2;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  });

  function cancel() {
    if (submitting) return;
    if (onCancel) {
      onCancel();
      return;
    }
    history.back();
  }

  function lockFormWhileSubmitting(
    isSubmitting: boolean,
  ): Attachment<HTMLElement> {
    return (node) => {
      const form = node.closest("form");
      if (!form || !isSubmitting) {
        form?.removeAttribute("aria-busy");
        return;
      }

      const preventResubmit = (event: SubmitEvent) => {
        event.preventDefault();
        event.stopImmediatePropagation();
      };
      form.addEventListener("submit", preventResubmit, true);

      let footerRegion: HTMLElement = node;
      while (
        footerRegion.parentElement &&
        footerRegion.parentElement !== form
      ) {
        footerRegion = footerRegion.parentElement;
      }

      const regions = [...form.children].filter(
        (child): child is HTMLElement =>
          child instanceof HTMLElement && child !== footerRegion,
      );
      const previousInert = regions.map((region) => region.inert);
      form.setAttribute("aria-busy", "true");
      for (const region of regions) region.inert = true;

      return () => {
        form.removeEventListener("submit", preventResubmit, true);
        for (const [index, region] of regions.entries()) {
          region.inert = previousInert[index] ?? false;
        }
        form.removeAttribute("aria-busy");
      };
    };
  }
</script>

<div
  class={[
    stylex.attrs(
      formFooter.root,
      floating ? formFooter.floating : formFooter.inline,
    ).class,
  ]}
  aria-busy={submitting}
  {@attach lockFormWhileSubmitting(submitting)}
>
  {#if submitting}
    <span
      class={[stylex.attrs(formFooter.loadingAnnouncement).class]}
      role="status"
      aria-live="polite">{submittingLabel}</span
    >
  {/if}
  <div class={[stylex.attrs(formFooter.actions).class]}>
    {#if submitAction}
      {@render submitAction()}
    {:else}
      <button
        type="submit"
        class={[stylex.attrs(formFooter.submitButton).class]}
        disabled={submitting || disabled}
      >
        {#if submitting}
          <span
            class={[stylex.attrs(formFooter.spinner).class]}
            aria-hidden="true"
          ></span>
          <span>{submittingLabel}</span>
        {:else}
          <span
            data-icon
            class={[stylex.attrs(formFooter.icon).class]}
            aria-hidden="true"><SolarIcon icon={submitIconClass} /></span
          >
          <span>{submitLabel}</span>
          <span
            class={[stylex.attrs(formFooter.shortcutHint).class]}
            aria-hidden="true">⏎</span
          >
        {/if}
      </button>
    {/if}
    {@render actions?.()}
    <button
      type="button"
      onclick={cancel}
      disabled={submitting}
      class={[stylex.attrs(formFooter.cancelButton).class]}
    >
      {cancelLabel}
    </button>
  </div>
  <div class={[stylex.attrs(formFooter.summary).class]}>
    <span class={[stylex.attrs(formFooter.statusDot).class]} aria-hidden="true">
      <CheckIcon
        class={stylex.attrs(formFooter.icon).class}
        strokeWidth="2"
        aria-hidden="true"
        focusable="false"
      />
    </span>
    <span class={[stylex.attrs(formFooter.readyLabel).class]}>{readyLabel}</span
    >
    <span class={[stylex.attrs(formFooter.separator).class]}>·</span>
    <span class={[stylex.attrs(formFooter.reviewLabel).class]}>
      <strong class={[stylex.attrs(formFooter.fieldCount).class]}
        >{fieldCount} {unitLabel}</strong
      >
      {reviewLabel}
    </span>
  </div>
</div>
