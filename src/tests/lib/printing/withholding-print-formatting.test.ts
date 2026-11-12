import { describe, expect, it } from "vitest";
import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
import { printBindings as propertyBindings } from "$lib/forms/printing/form-1606-print.svelte";
import { printBindings as compensationBindings } from "$lib/forms/printing/form-1601c-print.svelte";
import { createWithholdingValues } from "$lib/forms/withholding-rules";
import { initialProfile } from "$lib/ebirforms/ebirforms-workspace.svelte";

describe("original withholding print formatting", () => {
  it("marks each entered FMV amount independently using the original source mapping", () => {
    const fields = [
      "txtFMVLand",
      "txtFMVImprovements",
      "txtFMVZonal",
      "txtFMVBIR",
    ];
    for (const [index, field] of fields.entries()) {
      const values = createWithholdingValues("1606", initialProfile);
      for (const key of fields) values["frm1606:" + key] = "";
      values["frm1606:" + field] = "1000.00";
      const model = createWithholdingPrintModel(
        "1606",
        values,
        propertyBindings,
      );
      for (let choice = 0; choice < fields.length; choice++) {
        expect(model.checks["frm1606:opt27" + "ABCD"[choice]]).toBe(
          choice === index,
        );
      }
    }
  });

  it("formats overflow date fields like native date slots without altering reference text", () => {
    const values = createWithholdingValues("1601C", initialProfile);
    values["frm1601c:__rows:adjustments"] = "4";
    values["frm1601c:sched1:txtDatePaid0"] = "2025-02-28";
    values["frm1601c:sched1:txtDatePaid3"] = "2025-03-31";
    values["frm1601c:sched1:txtNumber3"] = "2025-03-31";
    const model = createWithholdingPrintModel(
      "1601C",
      values,
      compensationBindings,
    );
    const cells = model.continuations.flatMap((page) =>
      page.rows.flatMap((row) => row.cells),
    );
    expect(Object.values(model.text)).toContain("02/28/2025");
    expect(cells.find((cell) => cell.id.endsWith("txtDatePaid3"))?.value).toBe(
      "03/31/2025",
    );
    expect(cells.find((cell) => cell.id.endsWith("txtNumber3"))?.value).toBe(
      "2025-03-31",
    );
  });
});
