import { expect, it } from "vitest";
import { corporateEditorPages, getCorporateIncomeForm } from "../../../lib/forms/corporate-income";

const prefix = "frm1702MX:";
const schedule = "txtPg4EX1ScHI";

function rows(draft: Record<string, string>) {
  const form = getCorporateIncomeForm("1702MX")!;
  const values = Object.fromEntries(Object.entries({
    chkPg2Pt4I30MoreThanOne: "Y",
    totalEXAttach: "1",
    ...draft,
  }).map(([id, value]) => [prefix + id, value]));
  return corporateEditorPages(form, values)
    .flatMap(page => page.sections)
    .find(section => section.rows.some(row => row.fields[0].id === prefix + schedule + "1C1"))!.rows;
}

it("labels the inline Schedule H controls and opens the next row after both text fields are filled", () => {
  const [first, second, third, addItem] = rows({ [schedule + "1C1"]: "Training", [schedule + "1C3"]: "0" });
  for (const [index, row] of [first, second, third].entries()) {
    expect(row.item).toBe(String(index + 1));
    expect(row.layout).toBe("deduction");
    expect(row.fields.map(({ id, label, kind, maxLength, readonly }) => [id, label, kind, maxLength, readonly])).toEqual([
      [prefix + schedule + (index + 1) + "C1", "Description", "text", 27, false],
      [prefix + schedule + (index + 1) + "C2", "Legal basis", "text", 15, false],
      [prefix + schedule + (index + 1) + "C3", "Amount", "money", 12, false],
    ]);
  }
  expect(first.disabled).toBe(false);
  expect(second.disabled).toBe(true);
  expect(third.disabled).toBe(true);
  expect(addItem.disabled).toBeUndefined();
  expect(addItem.fields.at(-1)?.repeatable?.rollup).toBe(true);

  const [, unlocked, sparse] = rows({
    [schedule + "1C1"]: "Training",
    [schedule + "1C2"]: "Sample basis",
    [schedule + "3C3"]: "125",
  });
  expect(unlocked.disabled).toBe(false);
  expect(sparse.disabled).toBe(false);
});
