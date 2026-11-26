import type { CorporateValues } from "../types";
import { mixedNumber } from "./calculation";

const p = "frm1702MX:";
export function mixedHasActivities(
  code: string,
  values: CorporateValues,
): boolean {
  return code === "1702MX"
    ? values[p + "chkPg2Pt4I30MoreThanOne"] === "Y"
    : values[p + "rdoPg2I1"] === "F";
}
export function mixedActivityCount(
  values: CorporateValues,
  group: "EX" | "SP",
): number {
  return Math.min(
    99,
    Math.max(0, Math.trunc(mixedNumber(values[p + `total${group}Attach`]))),
  );
}

type ActivityRollup = { target: string; page: number; source: string };

const specialDeductions = [1, 2, 3, 4].map(row => ({
  target: `txtPg6Sc6I${row}C`, page: 4, source: `ScHI${row}C3`,
}));
const legacyRollups: ActivityRollup[] = [
  ...[1, 2, 3, 5].map(row => ({ target: `txtPg4Sc3I${row}C`, page: 2, source: `ScDI${row}` })),
  ...Array.from({ length: 39 }, (_, index) => {
    const row = index + 1;
    const suffix = [2, 3, 4, 36, 37, 38, 39].includes(row) ? "C1" : "";
    return {
      target: `txtPg${row < 36 ? 5 : 6}Sc5I${row}C`,
      page: row < 30 ? 3 : 4,
      source: `ScGI${row}${suffix}`,
    };
  }),
  ...specialDeductions,
];
const revisedRollups: ActivityRollup[] = [
  ...[[1, 1], [2, 2], [4, 4], [6, 56]].map(([item, source]) => ({
    target: `txtPg2Sc2Itm${item}`, page: 1, source: `ScBI${source}`,
  })),
  ...Array.from({ length: 25 }, (_, index) => {
    const row = index + 1;
    const item = row <= 16 ? String(row) : "17" + String.fromCharCode(97 + row - 17);
    return { target: `txtPg3Sc5Itm${item}`, page: row <= 8 ? 1 : 2, source: `ScDI${row}` };
  }),
  { target: "txtPg2Sc2It10", page: 1, source: "ScBI10" },
  ...specialDeductions,
];
const legacyRollupFields = new Set(legacyRollups.map(rollup => p + rollup.target));
const revisedRollupFields = new Set(revisedRollups.map(rollup => p + rollup.target));

export function mixedActivityRollupField(code: string, id: string): boolean {
  const targets = code === "1702MX" ? legacyRollupFields : revisedRollupFields;
  return /[AB]$/.test(id) && targets.has(id.slice(0, -1));
}

/** Each project retains the IDs produced by the Windows addAttachment handler. */
export function calculateMixedActivities(
  code: string,
  values: CorporateValues,
): CorporateValues {
  if (!mixedHasActivities(code, values)) return values;
  const result = { ...values };
  const n = (id: string) => mixedNumber(result[p + id]);
  const put = (id: string, value: number) => {
    result[p + id] = String(Math.round(value));
  };
  const rollups = code === "1702MX" ? legacyRollups : revisedRollups;
  for (const group of ["EX", "SP"] as const) {
    const count = mixedActivityCount(result, group);
    for (let index = 1; index <= count; index += 1) {
      const activity = group + index;
      const id = (page: number, name: string) =>
        `txtPg${page}${activity}${name}`;
      const a = (page: number, name: string) => n(id(page, name));
      const set = (page: number, name: string, value: number) =>
        put(id(page, name), value);
      result[p + `rdoPg1${activity}TaxRegime`] =
        group === "EX" ? "Exempt" : "SpecialRate";
      if (code === "1702MX") {
        set(2, "ScDI4", a(2, "ScDI1") + a(2, "ScDI2") + a(2, "ScDI3"));
        set(2, "ScDI6", a(2, "ScDI4") - a(2, "ScDI5"));
        set(2, "ScE1I3", a(2, "ScE1I1") + a(2, "ScE1I2"));
        set(2, "ScE1I5", a(2, "ScE1I3") - a(2, "ScE1I4"));
        set(2, "ScE2I8", a(2, "ScE2I6") + a(2, "ScE2I7"));
        set(2, "ScE2I10", a(2, "ScE2I8") - a(2, "ScE2I9"));
        set(2, "ScE2I13", a(2, "ScE2I10") + a(2, "ScE2I11") + a(2, "ScE2I12"));
        set(2, "ScE2I16", a(2, "ScE2I13") + a(2, "ScE2I14") - a(2, "ScE2I15"));
        set(2, "ScE2I19", a(2, "ScE2I16") + a(2, "ScE2I17") - a(2, "ScE2I18"));
        set(
          2,
          "ScE3I26",
          [20, 21, 22, 23, 24, 25].reduce(
            (total, row) => total + a(2, `ScE3I${row}`),
            0,
          ),
        );
        set(2, "ScE3I27", a(2, "ScE1I5") + a(2, "ScE2I19") + a(2, "ScE3I26"));
        set(
          3,
          "ScFI4C1",
          [1, 2, 3].reduce((total, row) => total + a(3, `ScFI${row}C1`), 0),
        );
        let ordinary = 0;
        for (let row = 1; row <= 39; row += 1)
          ordinary += a(
            row < 30 ? 3 : 4,
            `ScGI${row}${[2, 3, 4, 36, 37, 38, 39].includes(row) ? "C1" : ""}`,
          );
        set(4, "ScGI40", ordinary);
        set(
          4,
          "ScHI5",
          [1, 2, 3, 4].reduce((total, row) => total + a(4, `ScHI${row}C3`), 0),
        );
        set(1, "ScBI1", a(2, "ScDI6"));
        set(1, "ScBI2", a(2, "ScE3I27"));
        set(1, "ScBI3", a(1, "ScBI1") - a(1, "ScBI2"));
        set(1, "ScBI4", a(3, "ScFI4C1"));
        set(1, "ScBI5", a(1, "ScBI3") + a(1, "ScBI4"));
        set(1, "ScBI6", ordinary);
        set(1, "ScBI7", a(4, "ScHI5"));
        for (let row = 4; row <= 7; row += 1)
          set(
            4,
            `ScIAI${row}CE`,
            a(4, `ScIAI${row}CA`) -
              a(4, `ScIAI${row}CB`) -
              a(4, `ScIAI${row}CC`) -
              a(4, `ScIAI${row}CD`),
          );
        set(
          4,
          "ScIAI8CD",
          [4, 5, 6, 7].reduce((total, row) => total + a(4, `ScIAI${row}CD`), 0),
        );
        set(1, "ScBI8", a(4, "ScIAI8CD"));
        set(1, "ScBI9", a(1, "ScBI6") + a(1, "ScBI7") + a(1, "ScBI8"));
        set(1, "ScBI10", a(1, "ScBI5") - a(1, "ScBI9"));
        const rate = a(1, "ScBI11");
        const taxBase =
          rate === 5 ? a(1, "ScBI5") : Math.max(0, a(1, "ScBI10"));
        set(1, "ScBI12", group === "EX" ? 0 : (taxBase * rate) / 100);
      } else {
        let ordinary = 0;
        for (let row = 1; row <= 25; row += 1)
          ordinary += a(row <= 8 ? 1 : 2, `ScDI${row}`);
        set(4, "ScGI40", ordinary);
        set(
          4,
          "ScHI5",
          [1, 2, 3, 4].reduce((total, row) => total + a(4, `ScHI${row}C3`), 0),
        );
        for (let row = 4; row <= 7; row += 1)
          set(
            2,
            `ScF1I${row}E`,
            a(2, `ScF1I${row}A`) -
              a(2, `ScF1I${row}B`) -
              a(2, `ScF1I${row}C`) -
              a(2, `ScF1I${row}D`),
          );
        set(
          2,
          "ScF1I8D",
          [4, 5, 6, 7].reduce((total, row) => total + a(2, `ScF1I${row}D`), 0),
        );
        set(1, "ScBI3", a(1, "ScBI1") - a(1, "ScBI2"));
        set(1, "ScBI5", a(1, "ScBI3") - a(1, "ScBI4"));
        set(1, "ScBI57", a(1, "ScBI5") + a(1, "ScBI56"));
        set(1, "ScBI8", ordinary);
        set(1, "ScBI9", a(4, "ScHI5"));
        set(1, "ScBI10", a(2, "ScF1I8D"));
        set(1, "ScBI11", a(1, "ScBI8") + a(1, "ScBI9") + a(1, "ScBI10"));
        set(1, "ScBI12", a(1, "ScBI57") - a(1, "ScBI11"));
        const rate = a(1, "ScBI13");
        const taxBase =
          rate === 10
            ? a(1, "ScBI12")
            : rate === 5
              ? a(1, "ScBI57")
              : rate === 2 || a(1, "ScBI3") >= a(1, "ScBI57")
                ? a(1, "ScBI1")
                : a(1, "ScBI57");
        set(1, "ScBI14", group === "EX" ? 0 : (taxBase * rate) / 100);
        const hasLoss =
          group === "SP" && a(1, "ScBI57") >= 0 && ordinary > a(1, "ScBI57");
        set(2, "ScFI1", hasLoss ? a(1, "ScBI57") : 0);
        set(2, "ScFI2", hasLoss ? ordinary : 0);
        set(2, "ScFI3", a(2, "ScFI1") - a(2, "ScFI2"));
        set(2, "ScF1I7A", hasLoss ? -a(2, "ScFI3") : 0);
        set(
          2,
          "ScF1I7E",
          a(2, "ScF1I7A") - a(2, "ScF1I7B") - a(2, "ScF1I7C") - a(2, "ScF1I7D"),
        );
        result[p + id(2, "ScF1I7year")] = hasLoss
          ? (result[p + "txtPg1I2YearEnd"] ?? "")
          : "";
      }
      if (code === "1702MX") {
        set(1, "ScCI1", Math.max(0, a(1, "ScBI10")) * 0.3);
        set(1, "ScCI2", a(4, "ScHI5") * 0.3);
      } else if (group === "SP") {
        set(1, "ScCI1", (a(1, "ScBI12") * a(1, "ScBI13")) / 100);
        set(1, "ScCI2", (a(1, "ScBI9") * a(1, "ScBI13")) / 100);
      }
      set(1, "ScCI3", a(1, "ScCI1") + a(1, "ScCI2"));
      set(1, "ScCI4", a(1, code === "1702MX" ? "ScBI12" : "ScBI14"));
      set(1, "ScCI5", a(1, "ScCI3") - a(1, "ScCI4"));
      set(1, "ScCI7", a(1, "ScCI5") + a(1, "ScCI6"));
    }
    const column = group === "EX" ? "A" : "B";
    const aggregate = (page: number, name: string) =>
      Array.from({ length: count }, (_, index) =>
        n(`txtPg${page}${group}${index + 1}${name}`),
      ).reduce((total, value) => total + value, 0);
    for (const { target, page, source } of rollups) {
      put(target + column, aggregate(page, source));
    }
  }
  return result;
}
