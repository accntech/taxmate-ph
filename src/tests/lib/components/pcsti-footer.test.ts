import { describe, expect, it } from "vitest";
import { buildPaginationItems } from "$lib/components/ui/pagination/pagination-helpers";

describe("PCSTI pagination ranges", () => {
  it("shows every page for a small list, including one empty-data page", () => {
    expect(buildPaginationItems(1, 1)).toEqual([1]);
    expect(buildPaginationItems(2, 3)).toEqual([1, 2, 3]);
  });
  it("keeps first and last page access around a middle gap", () => {
    expect(buildPaginationItems(5, 10)).toEqual([1, "…", 4, 5, 6, "…", 10]);
  });
  it("clamps window calculations at the first and last page", () => {
    expect(buildPaginationItems(0, 10)).toEqual([1, 2, "…", 10]);
    expect(buildPaginationItems(20, 10)).toEqual([1, "…", 9, 10]);
  });
});

import { render } from "svelte/server";
import Pagination from "$lib/components/ui/pagination/pagination.svelte";
import PageSizePicker from "$lib/components/ui/list-page-size-picker/list-page-size-picker.svelte";
function renderedText(body: string) {
  return body
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

describe("PCSTI footer presentation", () => {
  it("renders a truthful empty result count and the current first page", () => {
    const { body } = render(Pagination, {
      props: { page: 1, pageSize: 12, total: 0, label: "Taxpayers pagination" },
    });
    expect(renderedText(body)).toContain("Showing 0–0 of 0");
    expect(body).toContain('aria-label="Taxpayers pagination"');
    expect(body).toContain('aria-label="Page 1" aria-current="page"');
    expect(body).not.toContain('aria-label="Previous page"');
    expect(body).not.toContain('aria-label="Next page"');
  });
  it("exposes numbered pages and next navigation for a first page of records", () => {
    const { body } = render(Pagination, {
      props: { page: 1, pageSize: 12, total: 25 },
    });
    expect(renderedText(body)).toContain("Showing 1–12 of 25");
    expect(body).toContain('aria-label="Page 3"');
    expect(body).toContain('aria-label="Next page"');
    expect(body).not.toContain('aria-label="Previous page"');
  });
  it("ends with the remaining records and previous navigation on the last page", () => {
    const { body } = render(Pagination, {
      props: {
        page: 3,
        pageSize: 12,
        total: 25,
        href: (page) => `?page=${page}`,
      },
    });
    expect(renderedText(body)).toContain("Showing 25–25 of 25");
    expect(body).toContain('href="?page=2"');
    expect(body).toContain('aria-label="Previous page"');
    expect(body).not.toContain('aria-label="Next page"');
  });
  it("names the rows-per-page popup and shows the selected size", () => {
    const { body } = render(PageSizePicker<number>, {
      props: { size: 48, options: [12, 24, 48], onpick: () => {} },
    });
    expect(body).toContain('aria-label="Rows per page"');
    expect(renderedText(body)).toContain("48 per page");
  });
});
