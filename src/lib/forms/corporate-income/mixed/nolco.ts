import type { CorporateValues } from "../types";
import { mixedNumber } from "./calculation";
import { mixedHasActivities } from "./attachments";

const p = "frm1702MX:";
export function revisedNolcoField(
  schedule: "7" | "8",
  row: number,
  column: string,
): string {
  const page =
    schedule === "7" ||
    (column === "Year" && row < 7) ||
    (row === 6 && column === "C")
      ? "3"
      : "4";
  return `txtPg${page}IShed${schedule}_${row}${column}`;
}
export function calculateRevisedNolco(
  code: string,
  input: CorporateValues,
): CorporateValues {
  const values = { ...input };
  const n = (name: string) => mixedNumber(values[p + name]);
  const put = (name: string, value: number) => {
    values[p + name] = String(Math.round(value));
  };
  for (const schedule of ["7", "8"] as const) {
    const column = schedule === "7" ? "C" : "B";
    const gross = n(`txtPg2Sc2Itm7${column}`);
    const ordinary = n(`txtPg2Sc2Itm8${column}`);
    const loss = gross < ordinary ? ordinary - gross : 0;
    const computation = schedule === "7" ? "txtPg6Sc7I" : "txtPg4Sc8It";
    put(computation + "1", loss ? gross : 0);
    put(computation + "2", loss ? ordinary : 0);
    put(computation + "3", -loss);
    put(revisedNolcoField(schedule, 7, "A"), loss);
    for (const amountColumn of ["B", "C", "D"])
      put(revisedNolcoField(schedule, 7, amountColumn), 0);
    values[p + revisedNolcoField(schedule, 7, "Year")] = loss
      ? (values[p + "txtPg1I2YearEnd"] ?? "")
      : "";
    for (const row of [4, 5, 6, 7]) {
      put(
        revisedNolcoField(schedule, row, "E"),
        n(revisedNolcoField(schedule, row, "A")) -
          n(revisedNolcoField(schedule, row, "B")) -
          n(revisedNolcoField(schedule, row, "C")) -
          n(revisedNolcoField(schedule, row, "D")),
      );
    }
    const applied = [4, 5, 6].reduce(
      (total, row) => total + n(revisedNolcoField(schedule, row, "D")),
      0,
    );
    put(schedule === "7" ? "txtPg3IShed78D" : "txtPg3IShed88D", applied);
    if (schedule === "7" || !mixedHasActivities(code, values))
      put(`txtPg2Sc2It10${column}`, applied);
  }
  return values;
}
