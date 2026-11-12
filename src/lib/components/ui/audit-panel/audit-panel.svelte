<script lang="ts">
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { auditPanel } from "./audit-panel.styles";

  import * as stylex from "@stylexjs/stylex";
  import { Button } from "../button/base";
  import { AuditSection } from "../audit-section";
  import type { AuditInfo } from "../types/audit";

  type AuditLoadState =
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "error"; message: string }
    | { kind: "loaded"; data: AuditInfo | null };

  type Props = {
    state: AuditLoadState;
    animationDelay?: string;
    onRetry?: () => void;
  };

  let { state, animationDelay = "130ms", onRetry }: Props = $props();
</script>

{#if state.kind === "loading" || state.kind === "idle"}
  <div class={[stylex.attrs(auditPanel.loadingPanel).class]}>
    <div class={[stylex.attrs(auditPanel.loadingHeader).class]}>
      <div
        class={[
          stylex.attrs(auditPanel.loadingTitle).class,
          "skeleton skeleton-line sm",
        ]}
      ></div>
    </div>
    <div class={[stylex.attrs(auditPanel.loadingRows).class]}>
      {#each Array(2) as _, i (i)}
        <div class={[stylex.attrs(auditPanel.loadingRow).class]}>
          <div
            class={[
              stylex.attrs(auditPanel.loadingLabel).class,
              "skeleton skeleton-line",
            ]}
          ></div>
          <div
            class={[
              stylex.attrs(auditPanel.loadingValue).class,
              "skeleton skeleton-line",
            ]}
          ></div>
        </div>
      {/each}
    </div>
  </div>
{:else if state.kind === "error"}
  <div class={[stylex.attrs(auditPanel.errorPanel).class]}>
    <div class={[stylex.attrs(auditPanel.errorSummary).class]}>
      <span
        data-icon
        class={[stylex.attrs([auditPanel.errorIcon]).class]}
        aria-hidden="true"><SolarIcon icon={glyphs.warningTriangle} /></span
      >
      <div class={[stylex.attrs(auditPanel.errorCopy).class]}>
        <p class={[stylex.attrs(auditPanel.errorTitle).class]}>
          Could not load audit.
        </p>
        <p class={[stylex.attrs(auditPanel.errorMessage).class]}>
          {state.message}
        </p>
      </div>
    </div>
    {#if onRetry}
      <div>
        <Button
          type="button"
          size="compact"
          variant="outlined"
          onclick={onRetry}
          sx={auditPanel.retryButton}
        >
          <span
            data-icon
            class={[stylex.attrs([auditPanel.retryIcon]).class]}
            aria-hidden="true"><SolarIcon icon={glyphs.sync} /></span
          >
          Retry
        </Button>
      </div>
    {/if}
  </div>
{:else if state.data}
  <AuditSection audit={state.data} {animationDelay} />
{/if}
