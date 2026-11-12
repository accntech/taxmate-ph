<script lang="ts">
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { listPager } from "./list-pager.styles";

  import * as stylex from "@stylexjs/stylex";
  import { Button } from "../button/base";
  import { ListPageSizePicker } from "../list-page-size-picker/base";
  import { Menu } from "../menu/base";
  import { Pagination } from "../pagination/base";

  type PageSize = 12 | 24 | 36;

  type Props = {
    page: number;
    pageSize: number;
    total: number;
    hrefForPage: (page: number) => string;
    onPageSizePick: (size: PageSize) => void;
    pageSizeOptions?: readonly PageSize[];
    loading?: boolean;
    summary?: boolean;
    class?: string;
  };

  let {
    page,
    pageSize,
    total,
    hrefForPage,
    onPageSizePick,
    pageSizeOptions = [12, 24, 36],
    loading = false,
    summary = true,
    sx,
    class: klass = "",
  }: Props & { sx?: stylex.StyleXStyles } = $props();

  const hasDefaultPageSizeOptions = $derived(
    pageSizeOptions.length === 3 &&
      pageSizeOptions[0] === 12 &&
      pageSizeOptions[1] === 24 &&
      pageSizeOptions[2] === 36,
  );
  let settled = $state.raw<{ page: number; pageSize: number; total: number }>();
  const display = $derived(settled ?? { page, pageSize, total });

  $effect(() => {
    if (!loading) settled = { page, pageSize, total };
  });

  function pickPageSize(next: PageSize, close: () => void) {
    close();
    if (next === pageSize) return;
    onPageSizePick(next);
  }
</script>

<div aria-busy={loading}>
  <Pagination
    page={display.page}
    pageSize={display.pageSize}
    total={display.total}
    href={hrefForPage}
    {summary}
    {sx}
    class={[klass].filter(Boolean).join(" ")}
  >
    {#if hasDefaultPageSizeOptions}
      <ListPageSizePicker size={display.pageSize} onpick={onPageSizePick} />
    {:else}
      <Menu
        label="Rows per page"
        align="left"
        panelClass={listPager.panel}
        triggerClass={listPager.trigger}
      >
        {#snippet trigger()}
          {display.pageSize} per page
          <span
            data-icon
            class={[stylex.attrs([listPager.menuIcon]).class]}
            aria-hidden="true"><SolarIcon icon={glyphs.chevronDown} /></span
          >
        {/snippet}
        {#snippet content({ close })}
          {#each pageSizeOptions as option (option)}
            <Button
              type="button"
              size="compact"
              variant="ghost"
              role="menuitemradio"
              aria-checked={display.pageSize === option}
              onclick={() => pickPageSize(option, close)}
              sx={[
                listPager.option,
                display.pageSize === option
                  ? listPager.selected
                  : listPager.unselected,
              ]}
              class={[display.pageSize === option ? "" : ""]
                .filter(Boolean)
                .join(" ")}
            >
              <span>{option} per page</span>
              <span class={[stylex.attrs(listPager.optionLabel).class]}>
                {#if display.pageSize === option}
                  <span
                    data-icon
                    class={[stylex.attrs([listPager.checkIcon]).class]}
                    aria-hidden="true"
                    ><SolarIcon icon={glyphs.checkCircle} /></span
                  >
                {/if}
              </span>
            </Button>
          {/each}
        {/snippet}
      </Menu>
    {/if}
  </Pagination>
</div>
