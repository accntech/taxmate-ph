<script lang="ts">
  import {
    Pagination as SdkPagination,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@ui-sdk/svelte/pagination";
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { pagination } from "./pagination.styles";

  import { styleAttributes } from "../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import { buildPaginationItems } from "./helpers";

  type Props = {
    page: number;
    pageSize: number;
    total: number;
    href?: (page: number) => string;
    onchange?: (page: number) => void;
    summary?: boolean;
    compact?: boolean;
    class?: string;
    children?: Snippet;
  };
  let {
    page,
    pageSize,
    total,
    href,
    onchange,
    summary = true,
    compact = false,
    sx,
    class: klass = "",
    children,
  }: Props & { sx?: stylex.StyleXStyles } = $props();

  let pageCount = $derived(Math.max(1, Math.ceil(total / pageSize)));
  let start = $derived(total === 0 ? 0 : (page - 1) * pageSize + 1);
  let end = $derived(Math.min(total, page * pageSize));

  let pages = $derived(buildPaginationItems(page, pageCount));
</script>

<div
  {...styleAttributes(
    [pagination.root, compact && pagination.compact, sx],
    [klass].flat(Infinity).filter(Boolean).join(" "),
  )}
>
  <div
    class={[
      stylex.attrs(pagination.summary, compact && pagination.compactSummary)
        .class,
    ]}
  >
    {#if summary}
      <span>
        Showing <strong class={[stylex.attrs(pagination.count).class]}
          >{start}–{end}</strong
        >
        of
        <strong class={[stylex.attrs(pagination.count).class]}
          >{total.toLocaleString()}</strong
        >
      </span>
    {/if}
    {#if children}
      {#if summary}<span
          aria-hidden="true"
          class={[
            stylex.attrs(
              pagination.separator,
              compact && pagination.compactHidden,
            ).class,
          ]}>·</span
        >{/if}
      {@render children()}
    {/if}
  </div>
  <SdkPagination
    {page}
    {pageCount}
    getHref={href}
    onPageChange={href ? undefined : onchange}
    aria-label="Pagination"
    class={[
      stylex.attrs(
        pagination.navigation,
        compact && pagination.compactNavigation,
      ).class,
    ]}
  >
    {#if page > 1}
      <PaginationPrevious
        class={[
          stylex.attrs(
            pagination.stepButton,
            compact && pagination.compactStep,
          ).class,
        ]}
        aria-label="Previous page"
        data-sveltekit-reset={href ? "false" : undefined}
      >
        <span
          data-icon
          class={[
            stylex.attrs(
              pagination.navigationIcon,
              compact && pagination.compactIcon,
            ).class,
          ]}
          aria-hidden="true"><SolarIcon icon={glyphs.chevronLeft} /></span
        >
        <span
          class={[
            stylex.attrs(
              pagination.stepLabel,
              compact && pagination.compactHidden,
            ).class,
          ]}>Prev</span
        >
      </PaginationPrevious>
    {:else}
      <span
        class={[
          stylex.attrs(
            pagination.disabledStep,
            compact && pagination.compactStep,
          ).class,
        ]}
        aria-hidden="true"
      >
        <span
          data-icon
          class={[
            stylex.attrs(
              pagination.navigationIcon,
              compact && pagination.compactIcon,
            ).class,
          ]}
          aria-hidden="true"><SolarIcon icon={glyphs.chevronLeft} /></span
        >
        <span
          class={[
            stylex.attrs(
              pagination.stepLabel,
              compact && pagination.compactHidden,
            ).class,
          ]}>Prev</span
        >
      </span>
    {/if}
    <div
      class={[
        stylex.attrs(
          pagination.pageSummary,
          compact && pagination.compactPageSummary,
        ).class,
      ]}
    >
      <span
        class={[
          stylex.attrs(
            pagination.pageLabel,
            compact && pagination.compactVisible,
          ).class,
        ]}>Page</span
      >
      <span
        class={[
          stylex.attrs(
            pagination.pageLabel,
            compact && pagination.compactVisible,
          ).class,
        ]}>&nbsp;</span
      >
      <span
        class={[
          stylex.attrs(
            pagination.pageCount,
            compact && pagination.compactVisible,
          ).class,
        ]}>{page}</span
      >
      <span
        class={[
          stylex.attrs(
            pagination.pageLabel,
            compact && pagination.compactVisible,
          ).class,
        ]}>&nbsp;of&nbsp;</span
      >
      <span
        class={[
          stylex.attrs(
            pagination.pageCount,
            compact && pagination.compactVisible,
          ).class,
        ]}>{pageCount}</span
      >
      {#each pages as p, i (`${i}-${p}`)}
        {#if p === "…"}
          <span
            class={[
              stylex.attrs(
                pagination.ellipsis,
                compact && pagination.compactHidden,
              ).class,
            ]}>…</span
          >
        {:else}
          <PaginationLink page={p}
            aria-label="Page {p}"
            class={[
              stylex.attrs(
                pagination.pageButton,
                compact && pagination.compactHidden,
                p === page ? pagination.currentPage : null,
              ).class,
            ]}
            data-sveltekit-reset={href ? "false" : undefined}
          >
            {p}
          </PaginationLink>
        {/if}
      {/each}
    </div>
    {#if page < pageCount}
      <PaginationNext
        class={[
          stylex.attrs(
            pagination.stepButton,
            compact && pagination.compactStep,
          ).class,
        ]}
        aria-label="Next page"
        data-sveltekit-reset={href ? "false" : undefined}
      >
        <span
          class={[
            stylex.attrs(
              pagination.stepLabel,
              compact && pagination.compactHidden,
            ).class,
          ]}>Next</span
        >
        <span
          data-icon
          class={[
            stylex.attrs(
              pagination.navigationIcon,
              compact && pagination.compactIcon,
            ).class,
          ]}
          aria-hidden="true"><SolarIcon icon={glyphs.chevronRight} /></span
        >
      </PaginationNext>
    {:else}
      <span
        class={[
          stylex.attrs(
            pagination.disabledStep,
            compact && pagination.compactStep,
          ).class,
        ]}
        aria-hidden="true"
      >
        <span
          class={[
            stylex.attrs(
              pagination.stepLabel,
              compact && pagination.compactHidden,
            ).class,
          ]}>Next</span
        >
        <span
          data-icon
          class={[
            stylex.attrs(
              pagination.navigationIcon,
              compact && pagination.compactIcon,
            ).class,
          ]}
          aria-hidden="true"><SolarIcon icon={glyphs.chevronRight} /></span
        >
      </span>
    {/if}
  </SdkPagination>
</div>
