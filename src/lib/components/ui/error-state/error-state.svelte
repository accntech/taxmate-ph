<script lang="ts">
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { errorState } from "./error-state.styles";

  import { styleAttributes } from "../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import { errorStateMessage } from "./helpers";

  type Variant = "card" | "inline";

  type Props = {
    error?: unknown;
    title?: string;
    description?: string;
    onRetry?: (() => void) | undefined;
    retryLabel?: string;
    variant?: Variant;
    class?: string;
  };

  let {
    error,
    title = "We couldn't load this",
    description,
    onRetry,
    retryLabel = "Try again",
    variant = "card",
    sx,
    class: className = "",
  }: Props & { sx?: stylex.StyleXStyles } = $props();

  let retrying = $state(false);

  const message = $derived(errorStateMessage(description, error));

  async function handleRetry() {
    if (!onRetry || retrying) return;
    retrying = true;
    try {
      await onRetry();
    } finally {
      retrying = false;
    }
  }
</script>

{#if variant === "card"}
  <section
    {...styleAttributes(
      [errorState.card, sx],
      [className].flat(Infinity).filter(Boolean).join(" "),
    )}
    role="alert"
    aria-live="polite"
  >
    <span class={[stylex.attrs(errorState.accentEdge).class]} aria-hidden="true"
    ></span>

    <div class={[stylex.attrs(errorState.summary).class]}>
      <div
        class={[stylex.attrs(errorState.iconBadge).class]}
        aria-hidden="true"
      >
        <span data-icon class={[stylex.attrs([errorState.icon]).class]}
          ><SolarIcon icon={glyphs.shieldAlert} /></span
        >
      </div>
      <div class={[stylex.attrs(errorState.copy).class]}>
        <div class={[stylex.attrs(errorState.heading).class]}>
          <h2 class={[stylex.attrs(errorState.title).class]}>
            {title}
          </h2>
          <span
            class={[stylex.attrs(errorState.errorCode).class]}
            aria-hidden="true"
          >
            err · client
          </span>
        </div>
        <p class={[stylex.attrs(errorState.message).class]}>
          {message}
        </p>

        {#if onRetry}
          <div class={[stylex.attrs(errorState.actions).class]}>
            <button
              type="button"
              onclick={handleRetry}
              disabled={retrying}
              class={[stylex.attrs(errorState.retryButton).class]}
            >
              {#if retrying}
                <span
                  class={[stylex.attrs(errorState.spinner).class]}
                  aria-hidden="true"
                ></span>
              {:else}
                <span
                  data-icon
                  class={[stylex.attrs([errorState.retryIcon]).class]}
                  aria-hidden="true"><SolarIcon icon={glyphs.sync} /></span
                >
              {/if}
              <span>{retrying ? "Retrying…" : retryLabel}</span>
            </button>
          </div>
        {/if}
      </div>
    </div>
  </section>
{:else}
  <div
    {...styleAttributes(
      [errorState.inline, sx],
      [className].flat(Infinity).filter(Boolean).join(" "),
    )}
    role="alert"
    aria-live="polite"
  >
    <div
      class={[stylex.attrs(errorState.inlineIconBadge).class]}
      aria-hidden="true"
    >
      <span data-icon class={[stylex.attrs([errorState.inlineIcon]).class]}
        ><SolarIcon icon={glyphs.shieldAlert} /></span
      >
    </div>
    <div class={[stylex.attrs(errorState.copy).class]}>
      <div class={[stylex.attrs(errorState.inlineTitle).class]}>
        {title}
      </div>
      <p class={[stylex.attrs(errorState.inlineMessage).class]}>{message}</p>
      {#if onRetry}
        <button
          type="button"
          onclick={handleRetry}
          disabled={retrying}
          class={[stylex.attrs(errorState.inlineRetryButton).class]}
        >
          {#if retrying}
            <span
              class={[stylex.attrs(errorState.spinner).class]}
              aria-hidden="true"
            ></span>
          {:else}
            <span
              data-icon
              class={[stylex.attrs([errorState.retryIcon]).class]}
              aria-hidden="true"><SolarIcon icon={glyphs.sync} /></span
            >
          {/if}
          <span>{retrying ? "Retrying…" : retryLabel}</span>
        </button>
      {/if}
    </div>
  </div>
{/if}
