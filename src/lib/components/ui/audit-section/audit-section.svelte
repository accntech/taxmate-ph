<script lang="ts">
  import { auditSection } from "./audit-section.styles";

  import * as stylex from "@stylexjs/stylex";
  import type { AuditEvent, AuditField, AuditInfo } from "../types/audit";

  type Props = {
    audit?: AuditInfo;
    events?: readonly AuditEvent[];
    fields?: readonly AuditField[];
    showUpdated?: boolean;
    posted?: boolean;
    postedAt?: Date | null;
    postedBy?: string | null;
    cancellation?: string | null;
    cancelledBy?: string | null;
    cancelledAt?: Date | null;
    showCancellationDetails?: boolean;
    animationDelay?: string;
  };

  let {
    audit,
    events = [],
    fields = [],
    showUpdated = true,
    posted = false,
    postedAt = null,
    postedBy = null,
    cancellation = null,
    cancelledBy = null,
    cancelledAt = null,
    showCancellationDetails = false,
    animationDelay = "280ms",
  }: Props = $props();

  const dateTimeFmt = new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  function formatDateTime(d: Date): string {
    return dateTimeFmt.format(d);
  }
</script>

<section
  class={[stylex.attrs(auditSection.root).class]}
  style="animation-delay: {animationDelay}"
>
  <div
    class={[stylex.attrs(auditSection.accentEdge).class]}
    aria-hidden="true"
  ></div>
  <header class={[stylex.attrs(auditSection.header).class]}>
    <h3 class={[stylex.attrs(auditSection.title).class]}>
      <span
        class={[stylex.attrs(auditSection.titleMarker).class]}
        aria-hidden="true"
      ></span>
      Audit
    </h3>
  </header>
  <dl class={[stylex.attrs(auditSection.entries).class]}>
    {#if audit}
      <dt class={[stylex.attrs(auditSection.label).class]}>Created</dt>
      <dd class={[stylex.attrs(auditSection.timestamp).class]}>
        <time datetime={audit.createdAt.toISOString()} data-value-type="date">
          {formatDateTime(audit.createdAt)}
        </time>
        {#if audit.createdBy}
          <span class={[stylex.attrs(auditSection.actor).class]}>
            By {audit.createdBy}</span
          >
        {/if}
      </dd>
      {#if showUpdated && audit.updatedAt.getTime() !== audit.createdAt.getTime()}
        <dt class={[stylex.attrs(auditSection.label).class]}>Updated</dt>
        <dd class={[stylex.attrs(auditSection.timestamp).class]}>
          <time datetime={audit.updatedAt.toISOString()} data-value-type="date">
            {formatDateTime(audit.updatedAt)}
          </time>
          {#if audit.updatedBy}
            <span class={[stylex.attrs(auditSection.actor).class]}>
              By {audit.updatedBy}</span
            >
          {/if}
        </dd>
      {/if}
    {/if}
    {#if posted}
      <dt class={[stylex.attrs(auditSection.label).class]}>Posted</dt>
      <dd class={[stylex.attrs(auditSection.timestamp).class]}>
        {#if postedAt}
          <time datetime={postedAt.toISOString()} data-value-type="date">
            {formatDateTime(postedAt)}
          </time>
        {:else}
          —
        {/if}
        {#if postedBy}
          <span class={[stylex.attrs(auditSection.actor).class]}
            >By {postedBy}</span
          >
        {/if}
      </dd>
    {/if}
    {#each events as event (event.label)}
      <dt class={[stylex.attrs(auditSection.label).class]}>{event.label}</dt>
      <dd class={[stylex.attrs(auditSection.timestamp).class]}>
        {#if event.at}
          <time datetime={event.at.toISOString()} data-value-type="date">
            {formatDateTime(event.at)}
          </time>
        {:else}
          —
        {/if}
        {#if event.by}
          <span class={[stylex.attrs(auditSection.actor).class]}
            >By {event.by}</span
          >
        {/if}
      </dd>
    {/each}
    {#each fields as field (field.label)}
      <dt class={[stylex.attrs(auditSection.label).class]}>{field.label}</dt>
      <dd
        class={[stylex.attrs(auditSection.reason).class]}
        data-value-type={field.valueType}
      >
        {field.value}
      </dd>
    {/each}
    {#if showCancellationDetails || cancelledBy !== null || cancelledAt !== null}
      <dt class={[stylex.attrs(auditSection.label).class]}>Cancelled</dt>
      <dd class={[stylex.attrs(auditSection.timestamp).class]}>
        {#if cancelledAt}
          <time datetime={cancelledAt.toISOString()} data-value-type="date">
            {formatDateTime(cancelledAt)}
          </time>
        {:else}
          —
        {/if}
        {#if cancelledBy}
          <span class={[stylex.attrs(auditSection.actor).class]}>
            By {cancelledBy}
          </span>
        {/if}
      </dd>
    {/if}
    {#if cancellation}
      <dt class={[stylex.attrs(auditSection.label).class]}>Reason</dt>
      <dd class={[stylex.attrs(auditSection.reason).class]}>
        {cancellation}
      </dd>
    {/if}
  </dl>
</section>
