import { describe, expect, it } from "vitest";
import rawPages from "$lib/forms/corporate-income/exempt/1702ex-pages.json";
import type { CorporatePage } from "$lib/forms/corporate-income/types";
import {
  exemptRepeatablePages,
  expandExemptPages,
  exemptContinuations,
  rollupExemptDetails,
  validateExemptDetails,
  exemptAdditionalFinalTax,
  exemptAdditionalExemptIncome,
} from "$lib/forms/corporate-income/exempt/repeatables";
const pages = rawPages as CorporatePage[];
const p = "frm1702EX:";
const fields = (pages: CorporatePage[]) =>
  pages.flatMap((page) =>
    page.sections.flatMap((section) =>
      section.rows.flatMap((row) => row.fields),
    ),
  );

describe("legacy exempt repeatable schedules", () => {
  it("inserts the exact source ordinary and supplemental row counts", () => {
    const ids = fields(exemptRepeatablePages(pages)).map((field) => field.id);
    expect(ids).toContain("Pg5S4I39PopLength");
    expect(ids).toContain("Pg7S9Pt3PopLength");
  });
  it("rolls ordinary details into the original amount without losing a first saved entry", () => {
    const result = rollupExemptDetails(pages, {
      Pg5S4I39PopLength: "2",
      [p + "txtPg5S4I39Col1"]: "Original expense",
      [p + "txtPg5S4I39Col2"]: "100",
      [p + "txtPg5S4I39_2Col1"]: "Second expense",
      [p + "txtPg5S4I39_2Col2"]: "250",
    });
    expect(result[p + "txtPg5S4I39_1Col1"]).toBe("Original expense");
    expect(result[p + "txtPg5S4I39Col2"]).toBe("350");
    expect(result[p + "txtPg5S4I39Col1"]).toBe("OTHERS");
  });
  it("expands stock details using source C_3 and C_4 identifiers and preserves date controls", () => {
    const expanded = expandExemptPages(exemptRepeatablePages(pages), {
      Pg7S9Pt3PopLength: "1",
    });
    const list = fields(expanded);
    expect(list.find((field) => field.id === p + "ddPg7S9I10C_3")?.kind).toBe(
      "select",
    );
    expect(
      list.find((field) => field.id === p + "txtPg7Sc9I13DateofIssueC_4")?.kind,
    ).toBe("date");
    expect(
      exemptContinuations(pages, { Pg7S9Pt3PopLength: "1" })[0].rows,
    ).toHaveLength(6);
  });
  it("adds only source final-tax and exempt amount columns from supplemental records", () => {
    const values = {
      Pg7S9Pt1PopLength: "1",
      Pg7S9Pt2PopLength: "1",
      Pg7S9Pt5PopLength: "1",
      [p + "txtPg7S9Pt1_1Col2"]: "10000",
      [p + "txtPg7S9Pt1_1Col4"]: "100",
      [p + "txtPg7Sc9I8ActualAmountC_3"]: "3000",
      [p + "txtPg7Sc9I9FinalTaxC_3"]: "300",
      [p + "txtPg7Sc9I9FinalTaxC_4"]: "400",
      [p + "txtPg7Sc10I5ActualAmountC_3"]: "5000",
    };
    expect(exemptAdditionalFinalTax(values)).toBe(800);
    expect(exemptAdditionalExemptIncome(values)).toBe(5000);
  });
  it("clears deleted ordinary details and totals when the detailed list is emptied", () => {
    const values = rollupExemptDetails(pages, {
      Pg5S4I39PopLength: "0",
      [p + "txtPg5S4I39Col1"]: "OTHERS",
      [p + "txtPg5S4I39Col2"]: "100",
      [p + "txtPg5S4I39_1Col1"]: "Removed",
      [p + "txtPg5S4I39_1Col2"]: "100",
    });
    expect(values[p + "txtPg5S4I39Col2"]).toBe("0");
    expect(values).not.toHaveProperty(p + "txtPg5S4I39_1Col2");
  });
  it("requires supporting descriptions when a supplemental amount is entered", () => {
    const errors = validateExemptDetails(pages, {
      Pg7S9Pt2PopLength: "1",
      [p + "txtPg7Sc9I9FinalTaxC_3"]: "500",
    });
    expect(errors[p + "txtPg7Sc9I5DescriptionofPropertyC_3"]).toBeDefined();
  });
  it("rolls up special deductions using the amount column and retains the legal basis field", () => {
    const result = rollupExemptDetails(pages, {
      Pg5S5I4PopLength: "2",
      [p + "txtPg5S5I4_1Col1"]: "First",
      [p + "txtPg5S5I4_1Col2"]: "RA 1000",
      [p + "txtPg5S5I4_1Col3"]: "100",
      [p + "txtPg5S5I4_2Col1"]: "Second",
      [p + "txtPg5S5I4_2Col2"]: "RA 2000",
      [p + "txtPg5S5I4_2Col3"]: "200",
    });
    expect(result[p + "txtPg5S5I4Col3"]).toBe("300");
    expect(result[p + "txtPg5S5I4Col2"]).toBe("RA 1000");
  });
});
