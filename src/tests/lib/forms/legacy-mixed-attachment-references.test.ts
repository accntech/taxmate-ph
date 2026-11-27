import { expect, it } from "vitest";
import { getCorporateIncomeForm, corporateEditorPages } from "$lib/forms/corporate-income";
import { corporateScheduleReferences } from "$lib/forms/corporate-income/schedule-references";

it("links legacy 1702MX activity sales, costs, special deductions, and tax due to their source or destination", () => {
  const prefix = "frm1702MX:";
  const form = getCorporateIncomeForm("1702MX")!;
  const values = {
    [prefix + "chkPg2Pt4I30MoreThanOne"]: "Y",
    [prefix + "totalEXAttach"]: "1",
    [prefix + "totalSPAttach"]: "1",
  };
  const pages = corporateEditorPages(form, values);
  const references = corporateScheduleReferences(form.code, pages, () => true, ["EX1", "SP1"]);

  for (const [activity, scheduleB] of [["EX1", 10], ["SP1", 14]] as const) {
    const transfers = [
      [`txtPg2${activity}ScDI6`, `txtPg1${activity}ScBI1`, scheduleB + 1, scheduleB],
      [`txtPg2${activity}ScE3I27`, `txtPg1${activity}ScBI2`, scheduleB + 1, scheduleB],
      [`txtPg4${activity}ScHI5`, `txtPg1${activity}ScBI7`, scheduleB + 3, scheduleB],
      [`txtPg1${activity}ScBI12`, `txtPg1${activity}ScCI4`, scheduleB, scheduleB],
    ] as const;
    for (const [source, destination, sourcePage, destinationPage] of transfers) {
      expect(references.get(prefix + source)).toContainEqual(expect.objectContaining({
        target: prefix + destination,
        page: destinationPage,
        label: expect.stringMatching(/^To /),
      }));
      expect(references.get(prefix + destination)).toContainEqual(expect.objectContaining({
        target: prefix + source,
        page: sourcePage,
        label: expect.stringMatching(/^From /),
      }));
    }
  }
});
