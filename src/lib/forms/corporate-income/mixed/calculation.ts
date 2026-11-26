import { normalizeLegacyExemptIdentification } from '../exempt/identification';
import { legacyMixedIdentificationFields } from './identification';
import { calculateRevisedNolco } from "./nolco";
import legacy from "./1702mx.json";
import revised from "./1702mxv2018.json";
import create from "./1702mxv2018c.json";
import type { CorporateValues } from "../types";
import { rollupMixedDetails } from "./repeatables";
import {
  calculateMixedActivities,
  mixedActivityCount,
  mixedHasActivities,
} from "./attachments";
import {
  legacyMixedAtc,
  legacyMixedOtherAtcElected,
  legacyMixedRateOptions,
  legacyMixedReliefRate,
  legacyMixedSpecialRate,
} from "./atc";

const prefix = "frm1702MX:";
export const mixedSourceData = {
  "1702MX": legacy,
  "1702MXv2018": revised,
  "1702MXv2018C": create,
};
export type MixedCode = keyof typeof mixedSourceData;
export function mixedNumber(value: string | undefined): number {
  return (
    Number((value ?? "").replaceAll(",", "").replace(/^\((.*)\)$/, "-$1")) || 0
  );
}

export function mixedLegalBasis(values: CorporateValues): string {
  return (values[prefix + "txtPg2Pt4I32CB"] ?? "").toUpperCase().replace(/[. ]/g, "");
}

const legacyFivePercentAgencies = new Set([
  "PEZA", "ECOZONE", "BCDA", "SBMA", "CDC", "PPMC", "JHSEZ", "MSEZ", "CEZA",
  "ZCSEZA", "APECO", "AFAB", "TEZ", "EPZA", "MEPZA",
]);
const legacyFivePercentLaws = new Set([
  "7227", "9400", "7916", "8748", "7922", "7903", "9490", "10083", "9728", "9593",
]);

function legacySpecialActivityCount(values: CorporateValues): number {
  return mixedHasActivities("1702MX", values) ? mixedActivityCount(values, "SP") : 0;
}

/** Returns the forced Schedule 1 Item 11 special-rate fraction, if applicable. */
export function legacyMixedForcedRate(values: CorporateValues): number | undefined {
  if (legacySpecialActivityCount(values) > 0) return;
  const basis = mixedLegalBasis(values).replace(/^RA/, "");
  const ipa = (values[prefix + "txtPg2Pt4I31CB"] ?? "").toUpperCase();
  const qualifiesForFivePercent =
    (legacyFivePercentAgencies.has(ipa) || legacyFivePercentLaws.has(basis)) &&
    mixedNumber(values[legacyMixedReliefRate]) === 5;
  const isIC030or031 =
    legacyMixedOtherAtcElected(values) && ["IC030", "IC031"].includes(values[legacyMixedAtc]);
  const regularSales = mixedNumber(values[prefix + "txtPg3Sc1I1CC"]);
  const specialSales = mixedNumber(values[prefix + "txtPg3Sc1I1CB"]);
  const regularSalesShare = Math.round((regularSales / (regularSales + specialSales)) * 100);

  if (isIC030or031 && qualifiesForFivePercent) {
    const grossTax = mixedNumber(values[prefix + "txtPg3Sc1I5CB"]) * 0.05;
    const netTax = mixedNumber(values[prefix + "txtPg3Sc1I10CB"]) * 0.3;
    return regularSalesShare > 50 && grossTax <= netTax ? 0.3 : 0.05;
  }
  if (isIC030or031) return regularSalesShare > 50 ? 0.3 : undefined;
  if (qualifiesForFivePercent) return 0.05;
  if (basis === "10693") return 0.02;
}

function legacySupplementalAmounts(
  values: CorporateValues,
  group: string,
  amountIds: string[],
): number {
  const count = Math.min(99, Math.max(0, Math.trunc(mixedNumber(values[prefix + "txtCtrmodal" + group]))));
  return amountIds.reduce((total, amountId) => {
    const entered = mixedNumber(values[prefix + amountId]);
    const additional = Array.from({ length: count }, (_, index) =>
      mixedNumber(values[prefix + `${amountId}-${index + 1}`]),
    ).reduce((sum, amount) => sum + amount, 0);
    return total + entered + additional;
  }, 0);
}

// The June 2013 HTA sums these regime amounts in field blur and detail-save handlers.
const legacyRegimeAmountRows = [
  ["txtPg4Sc3I", [1, 2, 3, 5]],
  ["txtPg4Sc3AI", [1, 2, 4]],
  ["txtPg4Sc3BI", [6, 7, 9, 11, 12, 14, 15, 17, 18]],
  ["txtPg4Sc3CI", [20, 21, 22, 23, 24, 25]],
  ["txtPg5Sc5I", Array.from({ length: 35 }, (_, index) => index + 1)],
  ["txtPg6Sc5I", [36, 37, 38, 39]],
  ["txtPg6Sc6I", [1, 2, 3, 4]],
  ["txtPg6Sc8I", [1, 2, 3, 5, 6]],
  ["txtPg7Sc8I", [7, 8, 9, 10, 11, 12]],
  ["txtPg7Sc10I", [1, 2, 3, 5, 6, 7, 8]],
] as const;

/** Source helper operations with literal IDs and no conditional or dynamic inputs. */
function sourceSchedules(
  code: MixedCode,
  values: CorporateValues,
): CorporateValues {
  const result = { ...values };
  if (code === "1702MX") {
    for (const [group, items] of legacyRegimeAmountRows) {
      for (const item of items) {
        const stem = prefix + group + item + "C";
        const total = mixedNumber(result[stem + "A"]) +
          mixedNumber(result[stem + "B"]) + mixedNumber(result[stem + "C"]);
        result[stem + "D"] = String(Math.round(total));
      }
    }
  }
  const operations = mixedSourceData[code].operations;
  for (let pass = 0; pass < 12; pass += 1) {
    let changed = false;
    for (const operation of operations) {
      const sum = operation.add.reduce(
        (total, name) => total + mixedNumber(result[prefix + name]),
        0,
      );
      const difference = operation.subtract.reduce(
        (total, name) => total + mixedNumber(result[prefix + name]),
        0,
      );
      const value = String(Math.round(sum - difference));
      changed ||= result[prefix + operation.target] !== value;
      result[prefix + operation.target] = value;
    }
    if (!changed) break;
  }
  return result;
}

function calculateMixedPass(
  code: string,
  values: CorporateValues,
): CorporateValues {
  const revision = code as MixedCode;
  let result = sourceSchedules(
    revision,
    calculateMixedActivities(code, rollupMixedDetails(code, values)),
  );
  if (code === '1702MX') normalizeLegacyExemptIdentification(result, legacyMixedIdentificationFields);
  const n = (name: string) => mixedNumber(result[prefix + name]);
  const put = (name: string, value: number) => {
    result[prefix + name] = String(Math.round(value));
  };
  const sum = (...names: string[]) =>
    names.reduce((total, name) => total + n(name), 0);
  const elected = (name: string) =>
    ["Y", "IC055", "true", "1"].includes(result[prefix + name]);
  for (const row of [1, 2, 3]) {
    const stem = `txtPg7Sc9I${row}`;
    put(stem + "CC", Math.max(0, n(stem + "CB") - n(stem + "CA")));
    put(
      stem + "CG",
      n(stem + "CC") - n(stem + "CD") - n(stem + "CE") - n(stem + "CF"),
    );
  }
  if (code === "1702MX") {
    const currentLoss = Math.max(0, -n("txtPg6Sc7I3"));
    result[prefix + "txtPg6Sc7AI4year"] = currentLoss
      ? result[prefix + "txtPg1I2YearEnd"] ?? ""
      : "";
    put("txtPg6Sc7AI4CA", currentLoss);
    for (const row of [4, 5, 6, 7]) {
      const stem = `txtPg6Sc7AI${row}C`;
      put(stem + "E", n(stem + "A") - sum(stem + "B", stem + "C", stem + "D"));
    }
    put("txtPg3Sc1I8CC", n("txtPg6Sc7AI8"));
    const multiple = mixedHasActivities(code, result);
    for (const column of ["A", "B", "C"] as const) {
      const group = column === "A" ? "EX" : "SP";
      const activityCount = multiple && column !== "C" ? mixedActivityCount(result, group) : 0;
      const activityAmount = (item: number) => Array.from(
        { length: activityCount },
        (_, index) => n(`txtPg1${group}${index + 1}ScBI${item}`),
      ).reduce((total, value) => total + value, 0);
      const suffix = `C${column}`;
      put(`txtPg3Sc1I1${suffix}`, n(`txtPg4Sc3I6${suffix}`));
      put(`txtPg3Sc1I2${suffix}`, n(`txtPg4Sc3CI27${suffix}`) + activityAmount(2));
      put(
        `txtPg3Sc1I3${suffix}`,
        n(`txtPg3Sc1I1${suffix}`) - n(`txtPg3Sc1I2${suffix}`),
      );
      put(`txtPg3Sc1I4${suffix}`, n(`txtPg5Sc4I4${suffix}`) + activityAmount(4));
      put(
        `txtPg3Sc1I5${suffix}`,
        sum(`txtPg3Sc1I3${suffix}`, `txtPg3Sc1I4${suffix}`),
      );
      put(`txtPg3Sc1I6${suffix}`, n(`txtPg6Sc5I40${suffix}`));
      put(`txtPg3Sc1I7${suffix}`, n(`txtPg6Sc6I5${suffix}`));
      if (column !== "C") put(`txtPg3Sc1I8${suffix}`, activityAmount(8));
      put(
        `txtPg3Sc1I9${suffix}`,
        sum(
          `txtPg3Sc1I6${suffix}`,
          `txtPg3Sc1I7${suffix}`,
          `txtPg3Sc1I8${suffix}`,
        ),
      );
      put(
        `txtPg3Sc1I10${suffix}`,
        n(`txtPg3Sc1I5${suffix}`) - n(`txtPg3Sc1I9${suffix}`),
      );
    }
    for (let item = 1; item <= 10; item += 1) {
      const stem = `txtPg3Sc1I${item}C`;
      put(stem + "D", sum(stem + "A", stem + "B", stem + "C"));
    }
    put("txtPg3Sc1I11CA", 0);
    result[prefix + "txtPg3Sc1I11CC"] = "30.0";

    const forcedRate = legacyMixedForcedRate(result);
    const specialActivityCount = legacySpecialActivityCount(result);
    if (specialActivityCount === 0) {
      if (forcedRate !== undefined) {
        result[legacyMixedSpecialRate] = String(forcedRate);
        if (forcedRate === 0.02) result[legacyMixedReliefRate] = "2.0";
      } else {
        const options = legacyMixedRateOptions(result);
        const savedRate = Number(result[legacyMixedSpecialRate]);
        const savedOption = options.find(option => Number(option.value) === savedRate);
        result[legacyMixedSpecialRate] = savedOption?.value ?? options[0].value;
      }
    }
    const atc = result[legacyMixedAtc];
    const basis = mixedLegalBasis(result);
    const salesRate =
      ["IC080", "IC190", "IC191"].includes(atc) ||
      ["RA10693", "10693"].includes(basis);
    const specialBase = forcedRate === 0.05
      ? n("txtPg3Sc1I5CB")
      : salesRate
        ? n("txtPg3Sc1I1CB")
        : Math.max(0, n("txtPg3Sc1I10CB"));
    const attachmentTax = Array.from(
      { length: specialActivityCount },
      (_, index) => n(`txtPg1SP${index + 1}ScBI12`),
    ).reduce((total, value) => total + value, 0);
    for (const column of ["A", "B", "C"]) {
      put(
        `txtPg3Sc2I1C${column}`,
        column === "C" ? 0 : Math.max(0, n(`txtPg3Sc1I10C${column}`)) * 0.3,
      );
      put(`txtPg3Sc2I2C${column}`, n(`txtPg6Sc6I5C${column}`) * 0.3);
    }
    put("txtPg3Sc2I1CD", sum("txtPg3Sc2I1CA", "txtPg3Sc2I1CB", "txtPg3Sc2I1CC"));
    put(
      "txtPg3Sc1I12CB",
      specialActivityCount > 0
        ? attachmentTax
        : specialBase * n("drpPg3Sc1I11CB"),
    );
    put("txtPg3Sc1I12CC", Math.max(0, n("txtPg3Sc1I10CC")) * 0.3);
    put("txtPg3Sc1I12CD", sum("txtPg3Sc1I12CB", "txtPg3Sc1I12CC"));
    put("txtPg3Sc1I14CB", n("txtPg3Sc1I12CB") - n("txtPg3Sc1I13CB"));
    put(
      "txtPg3Sc1I15CC",
      elected("chkPg1I5ATCR1") ? Math.max(0, n("txtPg3Sc1I5CC")) * 0.02 : 0,
    );
    put("txtPg3Sc1I15CD", n("txtPg3Sc1I15CC"));
    put("txtPg3Sc1I16CB", n("txtPg3Sc1I14CB"));
    put("txtPg3Sc1I16CC", Math.max(n("txtPg3Sc1I12CC"), n("txtPg3Sc1I15CC")));
    put("txtPg3Sc1I16CD", sum("txtPg3Sc1I16CB", "txtPg3Sc1I16CC"));
    put("txtPg2Pt5I37CB", n("txtPg3Sc1I16CB"));
    put("txtPg2Pt5I37CC", n("txtPg3Sc1I16CC"));
    put("txtPg2Pt5I37CD", n("txtPg3Sc1I16CD"));
    put(
      "txtPg2Pt5I38CD",
      sum("txtPg7Sc8I13CA", "txtPg7Sc8I13CB", "txtPg7Sc8I13CC"),
    );
    put("txtPg1Pt2I16TotalIncome", n("txtPg2Pt5I37CD"));
    put("txtPg1Pt2I17LessTotalTax", n("txtPg2Pt5I38CD"));
    put(
      "txtPg1Pt2I18NetTaxPayable",
      n("txtPg1Pt2I16TotalIncome") - n("txtPg1Pt2I17LessTotalTax"),
    );
    put(
      "txtPg1Pt2I19TotalPenalties",
      sum("txtPg2Pt5I40", "txtPg2Pt5I41", "txtPg2Pt5I42"),
    );
    put("txtPg2Pt5I43", n("txtPg1Pt2I19TotalPenalties"));
    put(
      "txtPg2Pt5I44",
      n("txtPg1Pt2I18NetTaxPayable") +
        (n("txtPg1Pt2I18NetTaxPayable") >= 0
          ? n("txtPg1Pt2I19TotalPenalties")
          : 0),
    );
    put(
      "txtPg1Pt2I20TotalAmount",
      sum("txtPg1Pt2I18NetTaxPayable", "txtPg1Pt2I19TotalPenalties"),
    );
    put("txtPg9Sc13I19",
      sum("txtPg9Sc13I1CC", "txtPg9Sc13I2CC", "txtPg9Sc13I3CC") +
      legacySupplementalAmounts(result, "Pg9Sc13I", ["txtPg9Sc13I4CC"]) +
      legacySupplementalAmounts(result, "Pg9Sc13II", ["txtPg9Sc13I9CA", "txtPg9Sc13I9CB"]) +
      legacySupplementalAmounts(result, "Pg9Sc13III", ["txtPg9Sc13I15CA", "txtPg9Sc13I15CB"]) +
      legacySupplementalAmounts(result, "Pg9Sc13IV", ["txtPg9Sc13I18CA", "txtPg9Sc13I18CB"]),
    );
    put("txtPg9Sc14I8",
      n("txtPg9Sc14I1") +
      legacySupplementalAmounts(result, "Pg9Sc14I", ["txtPg9Sc14I5CA", "txtPg9Sc14I5CB"]) +
      legacySupplementalAmounts(result, "Pg9Sc14II", ["txtPg9Sc14I7CA", "txtPg9Sc14I7CB"]),
    );
  } else {
    const optional = result[prefix + "rdoPg1Pt1I13MethodOfDeduc"] === "O";
    result = calculateRevisedNolco(code, result);
    for (const column of ["A", "B", "C"]) {
      put(
        `txtPg2Sc2Itm3${column}`,
        n(`txtPg2Sc2Itm1${column}`) - n(`txtPg2Sc2Itm2${column}`),
      );
      put(
        `txtPg2Sc2Itm5${column}`,
        n(`txtPg2Sc2Itm3${column}`) - n(`txtPg2Sc2Itm4${column}`),
      );
      put(
        `txtPg2Sc2Itm7${column}`,
        sum(`txtPg2Sc2Itm5${column}`, `txtPg2Sc2Itm6${column}`),
      );
      put(`txtPg2Sc2Itm8${column}`, n(`txtPg3Sc5Itm18${column}`));
      put(`txtPg2Sc2Itm9${column}`, n(`txtPg6Sc6I5C${column}`));
      put(
        `txtPg2Sc2It11${column}`,
        optional && column === "C"
          ? 0
          : sum(
              `txtPg2Sc2Itm8${column}`,
              `txtPg2Sc2Itm9${column}`,
              `txtPg2Sc2It10${column}`,
            ),
      );
      put(
        `txtPg2Sc2It13${column}`,
        n(`txtPg2Sc2Itm7${column}`) - n(`txtPg2Sc2It11${column}`),
      );
    }
    result = calculateRevisedNolco(code, result);
    put("txtPg2Sc2It12C", optional ? n("txtPg2Sc2Itm7C") * 0.4 : 0);
    if (optional)
      put("txtPg2Sc2It13C", n("txtPg2Sc2Itm7C") - n("txtPg2Sc2It12C"));
    const rate = n("txtPg2Sc2It14B");
    let specialBase =
      n("txtPg2Sc2Itm3B") >= n("txtPg2Sc2Itm7B")
        ? n("txtPg2Sc2Itm1B")
        : n("txtPg2Sc2Itm7B");
    if (code === "1702MXv2018" && rate === 10)
      specialBase = n("txtPg2Sc2It13B");
    if (code === "1702MXv2018" && rate === 5) specialBase = n("txtPg2Sc2Itm7B");
    if (code === "1702MXv2018" && rate === 2) specialBase = n("txtPg2Sc2Itm1B");
    const attachmentTax = Array.from(
      { length: mixedActivityCount(result, "SP") },
      (_, index) => n(`txtPg1SP${index + 1}ScBI14`),
    ).reduce((total, value) => total + value, 0);
    put(
      "txtPg2Sc2It15B",
      mixedHasActivities(code, result)
        ? attachmentTax
        : (specialBase * rate) / 100,
    );
    put("txtPg2Sc2It15C", (n("txtPg2Sc2It13C") * n("txtPg2Sc2It14C")) / 100);
    put("txtPg2Sc2It17B", n("txtPg2Sc2It15B") - n("txtPg2Sc2It16B"));
    put("txtPg2Sc2It17C", n("txtPg2Sc2It15C"));
    if (code === "1702MXv2018")
      put(
        "txtPg2Sc2It18C",
        elected("chkPg1I5ATCR1") ? n("txtPg2Sc2Itm7C") * 0.02 : 0,
      );
    put("txtPg2Sc2It19B", n("txtPg2Sc2It17B"));
    put("txtPg2Sc2It19C", Math.max(n("txtPg2Sc2It15C"), n("txtPg2Sc2It18C")));
    for (const stem of [
      "Itm1",
      "Itm2",
      "Itm3",
      "Itm4",
      "Itm5",
      "Itm6",
      "Itm7",
      "Itm8",
      "Itm9",
      "It10",
      "It11",
      "It13",
      "It15",
      "It16",
      "It17",
      "It18",
      "It19",
    ]) {
      put(
        `txtPg2Sc2${stem}D`,
        sum(...["A", "B", "C"].map((column) => `txtPg2Sc2${stem}${column}`)),
      );
    }
    put("txtPg2Sc2It12D", n("txtPg2Sc2It12C"));
    if (code === "1702MXv2018") {
      for (const column of ["A", "B", "C"]) {
        if (column !== "C")
          put(
            `txtPg3Sc4Itm1${column}`,
            (n(`txtPg2Sc2It13${column}`) * n("txtPg2Sc2It14C")) / 100,
          );
        put(
          `txtPg2Sc4Itm2${column}`,
          (n(`txtPg2Sc2Itm9${column}`) * n("txtPg2Sc2It14C")) / 100,
        );
      }
    }
    put("txtPg1Pt2I14TotalIncome", n("txtPg2Sc2It19D"));
    put(
      "txtPg1Pt2I15LessTotalTax",
      sum("txtPg2Sc3It32A", "txtPg2Sc3It32B", "txtPg2Sc3It32C"),
    );
    put(
      "txtPg1Pt2I16NetTaxPayable",
      n("txtPg1Pt2I14TotalIncome") - n("txtPg1Pt2I15LessTotalTax"),
    );
    put(
      "txtPg1Pt2I20TotalPenalties",
      sum("txtPg1Pt2I17", "txtPg1Pt2I18", "txtPg1Pt2I19"),
    );
    const net = n("txtPg1Pt2I16NetTaxPayable");
    const penalties = n("txtPg1Pt2I20TotalPenalties");
    put(
      "txtPg1Pt2I21TotalAmount",
      net >= 0 ? net + penalties : penalties > 0 ? penalties : net,
    );
  }
  const netField =
    code === "1702MX" ? "txtPg1Pt2I20TotalAmount" : "txtPg1Pt2I16NetTaxPayable";
  if (n(netField) >= 0) result[prefix + "rdoPg1Pt2I21Overpayment"] = "";
  return result;
}

/** Settle cross-schedule copies after the regime-specific formulas. */
export function calculateMixed(
  code: string,
  values: CorporateValues,
): CorporateValues {
  return calculateMixedPass(code, calculateMixedPass(code, values));
}
