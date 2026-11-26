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

/** Source helper operations with literal IDs and no conditional or dynamic inputs. */
function sourceSchedules(
  code: MixedCode,
  values: CorporateValues,
): CorporateValues {
  const result = { ...values };
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
    for (const column of ["A", "B", "C"]) {
      const suffix = `C${column}`;
      put(`txtPg3Sc1I1${suffix}`, n(`txtPg4Sc3I6${suffix}`));
      put(`txtPg3Sc1I2${suffix}`, n(`txtPg4Sc3CI27${suffix}`));
      put(
        `txtPg3Sc1I3${suffix}`,
        n(`txtPg3Sc1I1${suffix}`) - n(`txtPg3Sc1I2${suffix}`),
      );
      put(`txtPg3Sc1I4${suffix}`, n(`txtPg5Sc4I4${suffix}`));
      put(
        `txtPg3Sc1I5${suffix}`,
        sum(`txtPg3Sc1I3${suffix}`, `txtPg3Sc1I4${suffix}`),
      );
      put(`txtPg3Sc1I6${suffix}`, n(`txtPg6Sc5I40${suffix}`));
      put(`txtPg3Sc1I7${suffix}`, n(`txtPg6Sc6I5${suffix}`));
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
    const atc = result[prefix + "drpPg1I5ATCR2"];
    const basis = mixedLegalBasis(result);
    const ipa = (result[prefix + "txtPg2Pt4I31CB"] ?? "").toUpperCase();
    const recognizedIpa = [
      "PEZA",
      "ECOZONE",
      "BCDA",
      "SBMA",
      "CDC",
      "PPMC",
      "JHSEZ",
      "MSEZ",
      "CEZA",
      "ZCSEZA",
      "APECO",
      "AFAB",
      "TEZ",
      "EPZA",
      "MEPZA",
    ].includes(ipa);
    const recognizedBasis = [
      "RA7227",
      "7227",
      "RA9400",
      "9400",
      "RA7916",
      "7916",
      "RA8748",
      "8748",
      "RA7922",
      "7922",
      "RA7903",
      "7903",
      "RA9490",
      "9490",
      "RA10083",
      "10083",
      "RA9728",
      "9728",
      "RA9593",
      "9593",
    ].includes(basis);
    const qualifiesForFivePercent =
      (recognizedIpa || recognizedBasis) &&
      n("txtPg2Pt4I34SpecialTaxRate") === 5;
    const isIC030or031 =
      elected("chkPg1I5ATCR2") && ["IC030", "IC031"].includes(atc);
    const totalSales = n("txtPg3Sc1I1CB") + n("txtPg3Sc1I1CC");
    const regularSalesShare = Math.round(
      (n("txtPg3Sc1I1CC") / totalSales) * 100,
    );
    let forcedRate = 0;
    let grossRate = false;
    if (!mixedHasActivities(code, result)) {
      if (isIC030or031 && qualifiesForFivePercent) {
        const grossTax = n("txtPg3Sc1I5CB") * 0.05;
        const netTax = n("txtPg3Sc1I10CB") * 0.3;
        forcedRate = regularSalesShare > 50 && grossTax <= netTax ? 30 : 5;
        grossRate = forcedRate === 5;
      } else if (isIC030or031) {
        if (regularSalesShare > 50) forcedRate = 30;
      } else if (qualifiesForFivePercent) {
        forcedRate = 5;
        grossRate = true;
      } else if (["RA10693", "10693"].includes(basis)) {
        result[prefix + "txtPg2Pt4I34SpecialTaxRate"] = "2.0";
        forcedRate = 2;
      }
      if (forcedRate > 0)
        result[prefix + "drpPg3Sc1I11CB"] = String(forcedRate / 100);
    }
    const salesRate =
      ["IC080", "IC190", "IC191"].includes(atc) ||
      ["RA10693", "10693"].includes(basis);
    const specialBase = grossRate
      ? n("txtPg3Sc1I5CB")
      : salesRate
        ? n("txtPg3Sc1I1CB")
        : Math.max(0, n("txtPg3Sc1I10CB"));
    const attachmentTax = Array.from(
      { length: mixedActivityCount(result, "SP") },
      (_, index) => n(`txtPg1SP${index + 1}ScBI12`),
    ).reduce((total, value) => total + value, 0);
    for (const column of ["A", "B", "C"]) {
      put(
        `txtPg3Sc2I1C${column}`,
        column === "C" ? 0 : Math.max(0, n(`txtPg3Sc1I10C${column}`)) * 0.3,
      );
      put(`txtPg3Sc2I2C${column}`, n(`txtPg6Sc6I5C${column}`) * 0.3);
    }
    put(
      "txtPg3Sc1I12CB",
      mixedHasActivities(code, result)
        ? attachmentTax
        : specialBase * n("drpPg3Sc1I11CB"),
    );
    put("txtPg3Sc1I12CC", Math.max(0, n("txtPg3Sc1I10CC")) * 0.3);
    put("txtPg3Sc1I14CB", n("txtPg3Sc1I12CB") - n("txtPg3Sc1I13CB"));
    put(
      "txtPg3Sc1I15CC",
      elected("chkPg1I5ATCR1") ? Math.max(0, n("txtPg3Sc1I5CC")) * 0.02 : 0,
    );
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
