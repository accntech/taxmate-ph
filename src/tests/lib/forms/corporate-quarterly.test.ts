import { describe, expect, it } from "vitest";
import { quarterlyForms } from "$lib/forms/corporate-income/quarterly";
const p = "frm1702q:";
const form = (code: string) =>
  quarterlyForms.find((form) => form.code === code)!;
describe("corporate quarterly returns", () => {
  it("registers the three exact selectable revisions", () => {
    expect(quarterlyForms.map((form) => form.code)).toEqual([
      "1702Q",
      "1702Qv2008C",
      "1702Qv2018C",
    ]);
  });
  it("computes legacy regular tax and credit totals", () => {
    const result = form("1702Q").calculate({
      [p + "txt16C"]: "1000000",
      [p + "txt17C"]: "400000",
      [p + "txt21C"]: "100000",
      [p + "txt25B"]: "30",
      "1702q:OptMethodDeduct": "I",
      [p + "txt31E"]: "10000",
    });
    expect(result[p + "txt26B"]).toBe("150000.00");
    expect(result[p + "txt34"]).toBe("140000.00");
  });
  it("uses the amended legacy MCIT rate and disallows excess MCIT credits when MCIT wins", () => {
    const result = form("1702Qv2008C").calculate({
      txt1stQtr: "1000000",
      txtTaxRate: "1",
      [p + "txt29B"]: "2000",
    });
    expect(result[p + "txt28"]).toBe("10000.00");
    expect(result[p + "txt29B"]).toBe("0.00");
    expect(result[p + "txt34"]).toBe("10000.00");
  });
  it("computes revised OSD, whole peso normal income tax and credits", () => {
    const result = form("1702Qv2018C").calculate({
      [p + "rbQuarter"]: "2",
      [p + "rbMthdOfDdctns"]: "Debtor",
      [p + "cbATC_2"]: "IC010_25%",
      [p + "Sched2:txtTax1"]: "1000000",
      [p + "Sched2:txtTax2"]: "400000",
      [p + "Sched4:txtTax5"]: "10000",
    });
    expect(result[p + "Sched2:txtTax6"]).toBe("240000");
    expect(result[p + "txtTax14"]).toBe("90000");
    expect(result[p + "txtTax25"]).toBe("80000");
  });
  it("collects penalties without offsetting them against revised overpayment", () => {
    const result = form("1702Qv2018C").calculate({
      [p + "Sched4:txtTax1"]: "1000",
      [p + "txtTax21"]: "500",
    });
    expect(result[p + "txtTax20"]).toBe("-1000");
    expect(result[p + "txtTax25"]).toBe("500");
  });
  it("clears amended-only payments and previous quarter income in first quarter", () => {
    const result = form("1702Qv2018C").calculate({
      [p + "rbQuarter"]: "1",
      [p + "rbAmendedRtn"]: "N",
      [p + "Sched2:txtTax8"]: "5000",
      [p + "Sched4:txtTax6"]: "1000",
    });
    expect(result[p + "Sched2:txtTax8"]).toBe("0");
    expect(result[p + "Sched4:txtTax6"]).toBe("0");
  });
  it("retains fractional percent choices from the source ATC selector", () => {
    const fields = form("1702Qv2018C").pages.flatMap((page) =>
      page.sections.flatMap((section) =>
        section.rows.flatMap((row) => row.fields),
      ),
    );
    expect(
      fields
        .find((field) => field.id === p + "cbATC_2")
        ?.options?.find((option) => option.value === "IC080_2.5%"),
    ).toBeDefined();
  });
  it("keeps exempt and special schedules distinct from regular tax and clears inapplicable regular values", () => {
    const result = form("1702Qv2018C").calculate({
      [p + "cbATC_2"]: "IC080_2.5%",
      [p + "Sched1:txtTax1B"]: "100000",
      [p + "Sched1:txtTax10B"]: "2.5",
      [p + "Sched2:txtTax1"]: "200000",
      [p + "Sched2:txtTax10"]: "25",
    });
    expect(result[p + "txtTax17"]).toBe("2500");
    expect(result[p + "txtTax14"]).toBe("0");
    expect(result[p + "txtTax25"]).toBe("2500");
  });
  it("applies the source MCIT rate for a post-transition calendar year", () => {
    const result = form("1702Qv2018C").calculate({
      [p + "rbQuarter"]: "1",
      [p + "rbATC_1"]: "IC055",
      [p + "rbForClndrFscl"]: "C",
      [p + "txtYrEndYear"]: "2026",
      [p + "cbATC_2"]: "IC010_25%",
      [p + "Sched3:txtTax1"]: "1000000",
    });
    expect(result[p + "Sched3:txtTax5"]).toBe("2");
    expect(result[p + "Sched3:txtTax6"]).toBe("20000");
    expect(result[p + "txtTax25"]).toBe("20000");
  });
  it("expands source other-credit rows and rolls them into row b without double counting", () => {
    const definition = form("1702Qv2018C");
    const result = definition.calculate({
      "corporate:quarterlyOtherCreditRows": "2",
      [p + "Sched4:txtOthrTxCrdtAmnt0"]: "100",
      [p + "Sched4:txtOthrTxCrdtAmnt1"]: "500",
      [p + "sched4:Description0"]: "First",
      [p + "sched4:Amount0"]: "200",
      [p + "sched4:Description1"]: "Second",
      [p + "sched4:Amount1"]: "300",
    });
    expect(result[p + "Sched4:txtTax7"]).toBe("600");
    expect(result[p + "Sched4:txtOthrTxCrdtAmnt1"]).toBe("500");
    expect(
      definition
        .expandPages?.(result)
        .flatMap((page) =>
          page.sections.flatMap((section) =>
            section.rows.flatMap((row) => row.fields),
          ),
        )
        .some((field) => field.id === p + "sched4:Amount1"),
    ).toBe(true);
    expect(definition.continuations?.(result)[0].rows).toHaveLength(2);
  });
  it("requires a description for each added other-credit amount", () => {
    const errors = form("1702Qv2018C").validate?.({
      "corporate:quarterlyOtherCreditRows": "1",
      [p + "sched4:Amount0"]: "200",
    });
    expect(errors?.[p + "sched4:Description0"]).toBe(
      "Enter the tax credit description",
    );
  });
});

import { readFileSync } from "node:fs";
describe("quarterly source printing", () => {
  for (const [code, pages] of [
    ["1702q", 2],
    ["1702qv2008c", 2],
    ["1702qv2018c", 3],
  ] as const) {
    it(`retains ${code} source pages and removes active source behavior`, () => {
      const template = readFileSync(
        new URL(
          `../../../lib/forms/corporate-income/templates/form-${code}.html`,
          import.meta.url,
        ),
        "utf8",
      );
      expect(template.match(/data-source-page=/g)).toHaveLength(pages);
      expect(template).not.toMatch(/<\/select>\s*<option/);
      expect(template).not.toMatch(
        /<script|\son(?:click|blur|change|keypress)=|https?:\/\/|type="(?:hidden|button|password)"/i,
      );
      expect(template).toContain(
        `data-corporate-field="frm1702q:${code === "1702qv2018c" ? "txtTax25" : "txt34"}"`,
      );
      expect(template).toContain(
        `data-corporate-field="frm1702q:${code === "1702qv2018c" ? "txtRDOCode" : "txtRdoCode"}"`,
      );
    });
  }
});
