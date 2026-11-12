// Copied from PCSTI packages/ui/src/components/pagination/helpers.ts.
export type PaginationItem = number | "…";

const maxVisiblePages = 7;

function pageRange(start: number, end: number): number[] {
  return Array.from(
    { length: Math.max(0, end - start + 1) },
    (_, index) => start + index,
  );
}

function clampPage(page: number, pageCount: number): number {
  return Math.min(Math.max(page, 1), pageCount);
}

function leadingGap(start: number): PaginationItem[] {
  return start > 2 ? ["…"] : [];
}

function trailingGap(end: number, pageCount: number): PaginationItem[] {
  return end < pageCount - 1 ? ["…"] : [];
}

export function buildPaginationItems(
  page: number,
  pageCount: number,
): PaginationItem[] {
  if (pageCount <= maxVisiblePages) return pageRange(1, pageCount);

  const current = clampPage(page, pageCount);
  const start = Math.max(2, current - 1);
  const end = Math.min(pageCount - 1, current + 1);

  return [
    1,
    ...leadingGap(start),
    ...pageRange(start, end),
    ...trailingGap(end, pageCount),
    pageCount,
  ];
}
