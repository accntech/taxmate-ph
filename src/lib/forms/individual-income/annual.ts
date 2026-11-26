/** Whole-peso results retain the saved return’s decimal string format. */
import { roundWholePeso } from '$lib/components/ui/currency-input/currency';
import { incomeIncludesSpouse } from "./profile-fields";
import { calculateJuneActivities, calculateRevisedActivities } from "./annual-activity-calculations";
import { calculateJuneConsolidation, calculateJuneReconciliation, calculateJuneSupplementalIncome } from "./annual-june-schedules";

type Values = Record<string, string>;
const prefix = "frm1701:";
const id = (name: string) => prefix + name;
const isChecked = (value: string) => ["Y", "true", "1", "on"].includes(value);
const number = (value: string | undefined) => {
  const cleaned = (value ?? "").replace(/,/g, "").trim().replace(/%$/, "");
  const parsed = Number(cleaned.replace(/^\((.*)\)$/, "-$1"));
  return Number.isFinite(parsed) ? parsed : 0;
};
const range = (first: number, last: number) =>
  Array.from({ length: last - first + 1 }, (_, i) => first + i);
const legacyEmployerRows = [1, 2, 3, 4];
const dependentRows = range(1, 4);

function birthYear(value: string): number {
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value);
  const local = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
  if (!iso && !local) return 0;
  const [year, month, day] = iso
    ? [Number(iso[1]), Number(iso[2]), Number(iso[3])]
    : [Number(local![3]), Number(local![1]), Number(local![2])];
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? year : 0;
}

export const legacy1701Filing = {
  total: id("txtPg1Pt2I32TotalUponFiling"), overpayment: id("rdoPg1Pt2Overpayment"),
  pages: id("txtPg1Pt2I33PagesFilled"), type: id("rdoPg1I34CTCGovID"),
  certificate: id("rdoPg1I34CTC"), governmentId: id("rdoPg1I34GovID"),
  number: id("txtPg1Pt2I34CTC"), issueDate: id("txtPg1Pt2I35Month"),
  issuePlace: id("txtPg1Pt2I36PlaceOfIssue"), amount: id("txtPg1Pt2I37AmountIfCTC")
};
export function legacy1701IsOverpaid(values: Values): boolean {
  return number(values[legacy1701Filing.total]) < 0;
}
const legacyEmployer = (row: number) => ({
  earner: `rdoPg5Sc1I${row}TaxpayerSpouse`,
  gross: `txtPg5Sc1I${row}ComIncomeC2`,
  withheld: `txtPg5Sc1I${row}TaxWithheldC3`,
});

export function revised1701RateForAtc(atc?: string): "Graduated" | "Percentage" | "" | undefined {
  if (atc === "II011") return "";
  if (["II012", "II013", "II014"].includes(atc ?? "")) return "Graduated";
  if (["II015", "II016", "II017"].includes(atc ?? "")) return "Percentage";
}

const revisedAtc = (values: Values, column: string | undefined) =>
  values[id(column === "A" ? "rdoPg1I7ATC" : "rdoPg2I4ATC")];
const revisedTaxChoice = (column: string | undefined) => column === "A" ? "rdoPg1I21" : "rdoPg2I12";

export function annualFieldApplies(code: string, fieldId: string, values: Values): boolean {
  const field = fieldId.replace(/^frm1701:/, "");
  if (code === "1701" && /^txtPg9Sc9I6(?:TaxPayerC1|SpouseC2)$/.test(field))
    return values[id("rdoPg1I2Ammend")] === "Yes";
  if (code === "1701") {
    const filing = legacy1701Filing;
    const type = values[filing.type];
    if (fieldId === filing.overpayment) return legacy1701IsOverpaid(values);
    if (fieldId === filing.amount) return type === filing.certificate;
    if ([filing.number, filing.issueDate, filing.issuePlace].includes(fieldId))
      return type === filing.certificate || type === filing.governmentId;
  }
  if (code !== "1701v2018") return true;

  const column = field.at(-1);
  const atc = revisedAtc(values, column);
  const atcRate = revised1701RateForAtc(atc);
  const rate = atcRate ?? values[id(revisedTaxChoice(column) + "TaxRate")];
  const pureBusiness = ["II012", "II014", "II015", "II017"].includes(atc);
  if (/^txtPg2IShed2_\d+[AB]$/.test(field)) return !pureBusiness;
  const compensationTotal = field.match(/^txtPg2IShed1c_3([AB])(?:CI|TW)$/)?.[1];
  if (compensationTotal)
    return !["II012", "II014", "II015", "II017"].includes(revisedAtc(values, compensationTotal));
  if (/^rdo(?:Pg1I21|Pg2I12)TaxRate$/.test(field))
    return revised1701RateForAtc(revisedAtc(values, field.startsWith("rdoPg1") ? "A" : "B")) !== "";
  if (/^txtPg4IPart7_5[AB]$/.test(field)) return !pureBusiness;
  const specialDeduction = field.match(/^txtPg3IShed5_([1-6])(?:Amt|Desc|Legal)?$/)?.[1];
  if (specialDeduction) {
    const filer = Number(specialDeduction) <= 3 ? "A" : "B";
    const choice = revisedTaxChoice(filer);
    const program = revised1701RateForAtc(revisedAtc(values, filer));
    return program !== "" && (program ?? values[id(choice + "TaxRate")]) !== "Percentage" &&
      values[id(choice + "AMethodDeduction")] !== "OSD";
  }
  if (/^rdo(?:Pg1I21|Pg2I12)AMethodDeduction$/.test(field)) {
    const filer = field.startsWith("rdoPg1") ? "A" : "B";
    const program = revised1701RateForAtc(revisedAtc(values, filer));
    return program !== "" && (program ?? values[id(revisedTaxChoice(filer) + "TaxRate")]) !== "Percentage";
  }
  if (/^txtPg2IShed3_\d+[AB]$/.test(field)) {
    if (atcRate === "" || rate === "Percentage") return false;
    if (/^txtPg2IShed3_(?:11|13|14|15|16)[AB]$/.test(field))
      return values[id(revisedTaxChoice(column) + "AMethodDeduction")] !== "OSD";
  }
  if (/^txtPg3IShed3_\d+[AB]$/.test(field))
    return atcRate !== "" && rate !== "Graduated" && (atc !== "II016" || !/^txtPg3IShed3_29[AB]$/.test(field));
  const credit = field.match(/^txtPg4IPart7_([678])[AB]$/)?.[1];
  const special = values[id(column === "A" ? "rdoPg1I20IncomeSpecial" : "rdoPg2I11IncomeSpecial")];
  if (credit === "6") return values[id("rdoPg1I2Amended")] === "Yes";
  if (credit === "7")
    return values[id(column === "A" ? "rdoPg1I13ForeignTaxCredits" : "rdoPg2I8ForeignTaxCredits")] !== "No";
  if (credit === "8" || /^txtPg4ISc6_[234][AB]$|^txtPg4IPart8_[1-7][AB]$/.test(field))
    return special !== "No";
  if (/^txtPg4IPart8_(?:8|9|10)[AB]$/.test(field))
    return values[id(column === "A" ? "rdoPg1I19IncomeExempt" : "rdoPg2I10IncomeExempt")] !== "No";
  return true;
}

function tax(base: number, year: number, legacy = false): number {
  const amount = Math.max(0, legacy ? Math.round(base) : base);
  const brackets = legacy
    ? [
        [500000, 125000, 0.32],
        [250000, 50000, 0.3],
        [140000, 22500, 0.25],
        [70000, 8500, 0.2],
        [30000, 2500, 0.15],
        [10000, 500, 0.1],
        [0, 0, 0.05],
      ]
    : year <= 2022
      ? [
          [8000000, 2410000, 0.35],
          [2000000, 490000, 0.32],
          [800000, 130000, 0.3],
          [400000, 30000, 0.25],
          [250000, 0, 0.2],
        ]
      : [
          [8000000, 2202500, 0.35],
          [2000000, 402500, 0.3],
          [800000, 102500, 0.25],
          [400000, 22500, 0.2],
          [250000, 0, 0.15],
        ];
  const bracket = brackets.find(([threshold]) => amount > threshold);
  return bracket
    ? Math.round(bracket[1] + (amount - bracket[0]) * bracket[2])
    : 0;
}

export function annualAmountField(code: string): string {
  return id(
    code === "1701"
      ? "txtPg1Pt2I32TotalUponFiling"
      : "txtPg1I32AggregateAmtPyble",
  );
}

export function calculateAnnual(code: string, values: Values, computed?: Set<string>): Values {
  const result = { ...values };
  const n = (name: string) => number(result[id(name)]);
  const set = (name: string, amount: number) => {
    computed?.add(id(name));
    const rounded = roundWholePeso(amount);
    result[id(name)] = rounded.toFixed(2);
    return rounded;
  };
  const sum = (names: string[]) =>
    names.reduce((total, name) => total + n(name), 0);
  const selected = (name: string) => result[id(name)] ?? "";
  const checked = (name: string) => isChecked(selected(name));
  const applicable = (name: string) => annualFieldApplies(code, id(name), values);
  const activeAmount = (name: string) => applicable(name) ? n(name) : 0;
  const joint = incomeIncludesSpouse(code, values);
  // An upstream schedule is authoritative when it contains entered data. Imported
  // returns with only the downstream amount retain that amount until edited.
  const derive = (target: string, sources: string[], amount: () => number) => {
    computed?.add(id(target));
    if (sources.some((name) => Object.hasOwn(result, id(name))))
      set(target, amount());
  };
  const copy = (target: string, source: string) => derive(target, [source], () => n(source));
  const total = (target: string, sources: string[]) => derive(target, sources, () => sum(sources));
  const worksheet = { read: n, copy, total, derive };
  const deriveOperatingLoss = (grossIncome: string, deductions: string, loss: string, carryover: string) => {
    derive(loss, [grossIncome, deductions], () => n(grossIncome) - n(deductions));
    derive(carryover, [loss], () => Math.max(0, -n(loss)));
  };
  if (code === "1701v2018") {
    calculateRevisedActivities(worksheet, selected("Pg3mTaxRegimeTYPE"));
    const year = n("txtPg1I1Year");
    for (const column of ["A", "B"]) {
      const active = column === "A" || joint;
      const rateField = revisedTaxChoice(column) + "TaxRate";
      const deductionField = revisedTaxChoice(column) + "AMethodDeduction";
      const atcRate = revised1701RateForAtc(revisedAtc(values, column));
      const scheme = atcRate ?? selected(rateField);
      if (atcRate !== undefined) result[id(rateField)] = atcRate;
      const deduction = applicable(deductionField) ? selected(deductionField) : "";
      const field = (item: number) => `txtPg2IShed3_${item}${column}`;
      const ordinary = [...range(1, 16), "17a", "17b", "17c", "17d"].map(
        (item) => `txtPg3IShed4_${item}${column}`,
      );
      derive(`txtPg3IShed4_18${column}`, ordinary, () => sum(ordinary));
      derive(field(13), [`txtPg3IShed4_18${column}`], () =>
        n(`txtPg3IShed4_18${column}`),
      );
      const specialRows = column === "A" ? [1, 2] : [4, 5];
      const special = specialRows.map((item) => `txtPg3IShed5_${item}Amt`);
      const specialTotal = `txtPg3IShed5_${column === "A" ? 3 : 6}`;
      derive(specialTotal, special, () => sum(special));
      derive(field(14), [specialTotal], () => n(specialTotal));
      const grossSources = [8, 9, 11].map(field);
      const scheduleGross = `txtPg3IShed6_1${column}`;
      const scheduleDeductions = `txtPg3IShed6_2${column}`;
      const hasGrossInputs = grossSources.some((name) => Object.hasOwn(values, id(name)));
      set(field(10), n(field(8)) - n(field(9)));
      if (hasGrossInputs || !Object.hasOwn(values, id(field(12)))) {
        set(field(12), n(field(10)) - activeAmount(field(11)));
      }
      if (hasGrossInputs || (!Object.hasOwn(values, id(scheduleGross)) && Object.hasOwn(values, id(field(12))))) {
        set(scheduleGross, activeAmount(field(12)));
      }
      derive(scheduleDeductions, [field(13)], () => activeAmount(field(13)));
      const nolcoPage = column === "A" ? "Pg3" : "Pg4";
      const nolcoRows = column === "A" ? range(4, 7) : range(9, 12);
      deriveOperatingLoss(
        `txtPg3IShed6_1${column}`,
        `txtPg3IShed6_2${column}`,
        `txtPg3IShed6_3${column}`,
        `txt${nolcoPage}IShed6_${column === "A" ? 7 : 12}A`,
      );
      for (const row of nolcoRows) {
        const base = `txt${nolcoPage}IShed6_${row}`;
        set(
          base + "E",
          n(base + "A") - sum(["B", "C", "D"].map((suffix) => base + suffix)),
        );
      }
      const nolcoTotal = `txt${nolcoPage}IShed6_${column === "A" ? 8 : 13}D`;
      derive(
        nolcoTotal,
        nolcoRows.map((row) => `txt${nolcoPage}IShed6_${row}D`),
        () => sum(nolcoRows.map((row) => `txt${nolcoPage}IShed6_${row}D`)),
      );
      derive(field(15), [nolcoTotal], () => n(nolcoTotal));
      const comp = (item: number) => `txtPg2IShed2_${item}${column}`;
      derive(comp(4), [`txtPg2IShed1c_3${column}CI`], () =>
        n(`txtPg2IShed1c_3${column}CI`),
      );
      set(comp(6), activeAmount(comp(4)) - activeAmount(comp(5)));
      set(comp(7), tax(n(comp(6)), year));
      set(field(16), [13, 14, 15].reduce((total, item) => total + activeAmount(field(item)), 0));
      set(field(17), deduction === "OSD" ? n(field(10)) * 0.4 : 0);
      // Source methodRate uses net sales less OSD, excluding cost of sales.
      set(
        field(18),
        deduction === "OSD"
          ? n(field(10)) - n(field(17))
          : n(field(12)) - n(field(16)),
      );
      set(field(22), sum([19, 20, 21].map(field)));
      set(field(23), n(field(18)) + n(field(22)));
      set(field(24), n(comp(6)) + n(field(23)));
      set(field(25), tax(n(field(24)), year));
      const eight = (item: number) => `txtPg3IShed3_${item}${column}`;
      set(eight(28), n(eight(26)) + n(eight(27)));
      set(eight(30), n(eight(28)) - activeAmount(eight(29)));
      // Deterministically clear a former tax at zero, correcting the source's
      // missing equality branch in computeTxtPg3Sc3I31.
      set(eight(31), Math.max(0, n(eight(30))) * 0.08);
      set(eight(32), n(comp(7)) + n(eight(31)));
      const compensationOnly = atcRate !== undefined ? atcRate === "" :
        column === "A"
          ? checked("rdoPg1I6TaxpayerTypeC") &&
            !["S", "P", "E", "T"].some((type) =>
              checked("rdoPg1I6TaxpayerType" + type),
            )
          : checked("rdoPg2I3SpouseTypeC") &&
            !["S", "P"].some((type) => checked("rdoPg2I3SpouseType" + type));
      const regular = compensationOnly
        ? n(comp(7))
        : scheme === "Percentage"
          ? n(eight(32))
          : n(field(25));
      set(`txtPg4ISc6_1${column}`, regular);
      set(
        `txtPg4ISc6_4${column}`,
        activeAmount(`txtPg4ISc6_2${column}`) - activeAmount(`txtPg4ISc6_3${column}`),
      );
      const due = set(
        `txtPg4ISc6_5${column}`,
        regular + n(`txtPg4ISc6_4${column}`),
      );
      set(`txtPg1I22${column}TaxDue`, active ? due : 0);
      derive(`txtPg4IPart7_5${column}`, [`txtPg2IShed1c_3${column}TW`], () =>
        n(`txtPg2IShed1c_3${column}TW`),
      );
      const credits = set(
        `txtPg4IPart7_10${column}`,
        range(1, 9).reduce((total, item) => total + activeAmount(`txtPg4IPart7_${item}${column}`), 0),
      );
      set(`txtPg1I23${column}`, active ? credits : 0);
      set(`txtPg1I24${column}TaxPayable`, active ? due - credits : 0);
      const net = set(
        `txtPg1I26${column}`,
        active ? due - credits - n(`txtPg1I25${column}`) : 0,
      );
      const penalties = set(
        `txtPg1I30${column}`,
        active ? sum([27, 28, 29].map((item) => `txtPg1I${item}${column}`)) : 0,
      );
      set(
        `txtPg1I31${column}TotalAmtPyble`,
        net < 0 && penalties > 0 ? penalties : net + penalties,
      );
      for (const [target, inputs] of [
        [3, [1, 2]],
        [10, [8, 9]],
      ] as const)
        set(
          `txtPg4IPart8_${target}${column}`,
          inputs.reduce((total, item) => total + activeAmount(`txtPg4IPart8_${item}${column}`), 0),
        );
      set(
        `txtPg4IPart8_5${column}`,
        n(`txtPg4IPart8_3${column}`) - activeAmount(`txtPg4IPart8_4${column}`),
      );
      const specialElection = column === "A" ? "rdoPg1I20IncomeSpecial" : "rdoPg2I11IncomeSpecial";
      const specialCredit = `txtPg4IPart8_6${column}`;
      computed?.add(id(specialCredit));
      if (selected(specialElection) === "Yes") copy(specialCredit, `txtPg4IPart7_8${column}`);
      set(
        `txtPg4IPart8_7${column}`,
        n(`txtPg4IPart8_5${column}`) + activeAmount(`txtPg4IPart8_6${column}`),
      );
      set(
        `txtPg4IPart9_5${column}`,
        sum(range(1, 4).map((item) => `txtPg4IPart9_${item}${column}`)),
      );
      set(
        `txtPg4IPart9_10${column}`,
        sum(range(6, 9).map((item) => `txtPg4IPart9_${item}${column}`)),
      );
      set(
        `txtPg4IPart9_11${column}`,
        n(`txtPg4IPart9_5${column}`) - n(`txtPg4IPart9_10${column}`),
      );
    }
    set(
      "txtPg1I32AggregateAmtPyble",
      n("txtPg1I31ATotalAmtPyble") + n("txtPg1I31BTotalAmtPyble"),
    );
    return result;
  }
  calculateJuneSupplementalIncome(worksheet);
  const attachmentRegime = selected("rdoPg1mTaxRegimeTYPE");
  const attachmentActive = (person: "taxpayer" | "spouse", regime: string) => {
    const special = regime === "SpecialRate";
    return person === "taxpayer"
      ? selected(special ? "rdoPg1Pt1I23IncomeSpecial" : "rdoPg1Pt1I22IncomeExempt") === "Yes"
      : joint && selected(special ? "rdoPg4Pt7I108YesNo" : "rdoPg4Pt7I107YesNo") === "Yes";
  };
  calculateJuneActivities(worksheet, attachmentRegime, attachmentActive, selected, (base) => tax(base, 2017, true));
  const employerRows = legacyEmployerRows.map(legacyEmployer).filter(({ gross, withheld }) =>
    Object.hasOwn(values, id(gross)) || Object.hasOwn(values, id(withheld)),
  );
  if (!joint) {
    for (const { earner, gross, withheld } of employerRows) {
      if (!selected(earner) && (n(gross) || n(withheld))) result[id(earner)] = "1";
    }
  }
  for (const [column, person] of [
    ["C1", "TaxPayer"],
    ["C2", "Spouse"],
  ]) {
    const field = (item: number, name: string) =>
      `txtPg2Pt4I${item}${name}${column}`;
    const deduction = selected(
      column === "C1" ? "rdoPg1Pt1I20Deduction" : "rdoPg4Pt7I105Itemized",
    );
    const personChoice = column === "C1" ? "1" : "2";
    const employerColumn = column === "C1" ? "A" : "B";
    const grossTotal = `txtPg5Sc1I5${employerColumn}TotalComIncome`;
    const withheldTotal = `txtPg5Sc1I5${employerColumn}TotalTaxWithheld`;
    const employerInputs = legacyEmployerRows.flatMap((row) => {
      const { gross, withheld } = legacyEmployer(row);
      return [gross, withheld];
    });
    computed?.add(id(grossTotal));
    computed?.add(id(withheldTotal));
    if (employerInputs.some((name) => Object.hasOwn(values, id(name)))) {
      let compensation = 0;
      let withholding = 0;
      for (const { earner, gross, withheld } of employerRows) {
        if (selected(earner) !== personChoice) continue;
        compensation += Math.trunc(n(gross));
        withholding += Math.trunc(n(withheld));
      }
      set(grossTotal, compensation);
      set(withheldTotal, withholding);
    }
    copy(field(41, "GrossCompensation"), grossTotal);
    copy(`txtPg9Sc9I5${person}${column}`, withheldTotal);

    const saleInputs = [1, 2, 4].map(
      (item) => `txtPg5Sc2I${item}${person}${column}`,
    );
    derive(`txtPg5Sc2I3${person}${column}`, saleInputs.slice(0, 2), () =>
      sum(saleInputs.slice(0, 2)),
    );
    derive(
      `txtPg5Sc2I5${person}${column}`,
      saleInputs,
      () => n(`txtPg5Sc2I3${person}${column}`) - n(saleInputs[2]),
    );
    derive(field(50, "NetSales"), [`txtPg5Sc2I5${person}${column}`], () =>
      n(`txtPg5Sc2I5${person}${column}`),
    );
    const filerType = selected("rdoPg1Pt1I7Type");
    computed?.add(id(field(45, "PersonalExemp")));
    if (filerType || selected("rdoPg1Pt1I4ATC") === "Compensation") {
      const exemption = ["Estate", "Trust"].includes(filerType) ? 20000 : 50000;
      const applies =
        column === "C1" ||
        (selected("rdoPg1Pt1I16FilingStatus") === "Joint" &&
          selected("rdoPg1Pt1I14Status") === "Married" &&
          selected("rdoPg1Pt1I15Income") === "WithIncome");
      set(field(45, "PersonalExemp"), applies ? exemption : 0);
    }
    const otherSales = [1, 2].map(
      (item) => `txtPg5Sc3I${item}${person}${column}`,
    );
    derive(`txtPg5Sc3I3${person}${column}`, otherSales, () => sum(otherSales));
    derive(field(51, "AddOther"), [`txtPg5Sc3I3${person}${column}`], () =>
      n(`txtPg5Sc3I3${person}${column}`),
    );
    const nonOperating = range(1, 5).map(
      (item) => `txtPg6Sc5I${item}${person}${column}`,
    );
    derive(`txtPg6Sc5I6${person}${column}`, nonOperating, () =>
      sum(nonOperating),
    );
    derive(field(55, "AddNonOper"), [`txtPg6Sc5I6${person}${column}`], () =>
      n(`txtPg6Sc5I6${person}${column}`),
    );
    const specialDeductions = range(1, 4).map(
      (item) => `txtPg8Sc7I${item}${person}`,
    );
    derive(`txtPg8Sc7I5${person}`, specialDeductions, () =>
      sum(specialDeductions),
    );
    derive(field(58, "Special"), [`txtPg8Sc7I5${person}`], () =>
      n(`txtPg8Sc7I5${person}`),
    );
    const trading = column === "C1" ? "txtPg5Sc4AI" : "txtPg5Sc4I";
    const cost = (item: number) => `${trading}${item}${person}${column}`;
    const tradingInputs = [1, 2, 4].map(cost);
    derive(cost(3), tradingInputs.slice(0, 2), () => n(cost(1)) + n(cost(2)));
    derive(cost(5), tradingInputs, () => n(cost(3)) - n(cost(4)));
    const manufacturing = (item: number) =>
      `txtPg6Sc4BI${item}${person}${column}`;
    total(manufacturing(8), [6, 7].map(manufacturing));
    derive(manufacturing(10), [8, 9].map(manufacturing), () => n(manufacturing(8)) - n(manufacturing(9)));
    total(manufacturing(13), [10, 11, 12].map(manufacturing));
    derive(manufacturing(16), [13, 14, 15].map(manufacturing), () => n(manufacturing(13)) + n(manufacturing(14)) - n(manufacturing(15)));
    derive(manufacturing(19), [16, 17, 18].map(manufacturing), () => n(manufacturing(16)) + n(manufacturing(17)) - n(manufacturing(18)));
    const services = range(20, 25).map(
      (item) => `txtPg6Sc4CI${item}${person}${column}`,
    );
    const serviceTotal = `txtPg6Sc4CI26${person}${column}`;
    derive(serviceTotal, services, () => sum(services));
    const costTotal = `txtPg6Sc4CI27${person}${column}`;
    derive(
      costTotal,
      [cost(5), manufacturing(19), serviceTotal],
      () => n(cost(5)) + n(manufacturing(19)) + n(serviceTotal),
    );
    derive(field(53, "LessCostSales"), [costTotal], () =>
      deduction === "OSD" ? 0 : n(costTotal),
    );
    const nolcoColumn = column === "C1" ? "A" : "B";
    const operatingLoss = `txtPg8Sc8${nolcoColumn}`;
    deriveOperatingLoss(
      operatingLoss + "I1GrossIncome",
      operatingLoss + (nolcoColumn === "A" ? "I2TotalDeduction" : "I2TotalDeductions"),
      operatingLoss + "I3NetOperatingLoss",
      operatingLoss + "1I4Amount",
    );
    const nolcoRows = range(4, 7).map(
      (row) => `txtPg8Sc8${nolcoColumn}1I${row}`,
    );
    for (const base of nolcoRows)
      derive(
        base + "NetOperatingLoss",
        [
          "Amount",
          "AppliedPreviousYear",
          "NOLCOExpired",
          "NOLCOAppliedCurrentYear",
        ].map((suffix) => base + suffix),
        () =>
          Math.trunc(
            n(base + "Amount") -
              sum(
                [
                  "AppliedPreviousYear",
                  "NOLCOExpired",
                  "NOLCOAppliedCurrentYear",
                ].map((suffix) => base + suffix),
              ),
          ),
      );
    const nolcoApplied = nolcoRows.map(
      (base) => base + "NOLCOAppliedCurrentYear",
    );
    derive(`txtPg8Sc8${nolcoColumn}1I8TotalNOLCO`, nolcoApplied, () =>
      sum(nolcoApplied),
    );
    derive(
      field(59, "Allowance"),
      [`txtPg8Sc8${nolcoColumn}1I8TotalNOLCO`],
      () => n(`txtPg8Sc8${nolcoColumn}1I8TotalNOLCO`),
    );
    if (deduction === "OSD")
      for (const [item, name] of [
        [53, "LessCostSales"],
        [57, "Ordinary"],
        [58, "Special"],
        [59, "Allowance"],
      ] as const)
        set(field(item, name), 0);
    const ordinary = [
      ...range(1, 4).map((item) =>
        column === "C1"
          ? `txtPg6Sc6I${item}TaxSumPayerC1`
          : `txtPg6Sc6I${item}SpouseSumC2`,
      ),
      ...range(5, 39).map((item) =>
        column === "C1"
          ? `txtPg7Sc6I${item}TaxSumPayerC1`
          : `txtPg7Sc6I${item}SpouseSumC2`,
      ),
    ];
    const ordinaryTotal = column === "C1" ? "txtPg7Sc6I40TaxTotalPayerC1" : "txtPg7Sc6I40TotalSpouseC2";
    total(ordinaryTotal, ordinary);
    if (deduction !== "OSD") copy(field(57, "Ordinary"), ordinaryTotal);
    else computed?.add(id(field(57, "Ordinary")));

    const dependentCount = column === "C1" ? "txtPg1Pt1I24Dependent" : "txtPg4Pt7I111Dependent";
    const exemption = field(46, "AdditionalExemp");
    const taxpayerClaim = selected("rdoPg1Pt1I24Claiming");
    const spouseClaim = selected("rdoPg4Pt7I110YesNo");
    const claimsDependents = column === "C1" ? taxpayerClaim === "Yes" :
      joint && taxpayerClaim !== "Yes" && spouseClaim === "Yes";
    const birth = birthYear(selected(column === "C1" ? "txtPg1Pt1I11Month" : "ddlPg4Pt7I99Month"));
    const yearText = selected("txtPg1I1Year");
    const filingYear = Number(/^\d{2}$/.test(yearText) ? "20" + yearText : yearText);
    computed?.add(id(dependentCount));
    if ((column === "C1" ? taxpayerClaim : spouseClaim) && !claimsDependents) {
      result[id(dependentCount)] = "0";
    } else if (claimsDependents && dependentRows.some(row => Object.hasOwn(values, id(`txtPg4Pt7ALastName${row}`)))) {
      const eligible = dependentRows.filter(row => {
        const childBirth = birthYear(selected(`txtPg4Pt7AMonth${row}`));
        return !!selected(`txtPg4Pt7ALastName${row}`).trim() && !!selected(`txtPg4Pt7AFirstMiddleName${row}`).trim() &&
          childBirth > 0 && childBirth <= filingYear &&
          (checked(`chkPg4Pt7AIncapacitated${row}`) || (birth > 0 && childBirth > birth && filingYear - childBirth <= 21));
      });
      result[id(dependentCount)] = String(eligible.length);
    }
    derive(exemption, [dependentCount], () => Math.min(4, Math.max(0, n(dependentCount))) * 25000);
    const p3 = (item: number, name: string) =>
      `txtPg3Pt5I${item}${name}${column}`;
    set(
      field(43, "GrossTaxable"),
      Math.max(0, n(field(41, "GrossCompensation")) - n(field(42, "LessNon"))),
    );
    set(
      field(47, "TotalDeductions"),
      sum([
        field(44, "Premium"),
        field(45, "PersonalExemp"),
        field(46, "AdditionalExemp"),
      ]),
    );
    set(
      field(48, "NetTax"),
      Math.max(
        0,
        n(field(43, "GrossTaxable")) - n(field(47, "TotalDeductions")),
      ),
    );
    set(
      field(49, "ExcessDeduct"),
      Math.max(
        0,
        n(field(47, "TotalDeductions")) - n(field(43, "GrossTaxable")),
      ),
    );
    set(
      field(52, "TotalSales"),
      n(field(50, "NetSales")) + n(field(51, "AddOther")),
    );
    set(
      field(54, "GrossIncome"),
      n(field(52, "TotalSales")) - n(field(53, "LessCostSales")),
    );
    set(
      field(56, "TotalGross"),
      n(field(54, "GrossIncome")) + n(field(55, "AddNonOper")),
    );
    set(
      field(60, "TotalAllowable"),
      sum([
        field(57, "Ordinary"),
        field(58, "Special"),
        field(59, "Allowance"),
      ]),
    );
    set(
      field(61, "OSD"),
      deduction === "OSD" ? n(field(52, "TotalSales")) * 0.4 : 0,
    );
    const taxableBusiness = set(
      field(62, "TaxableIncome"),
      Math.round(
        n(field(56, "TotalGross")) -
          n(
            field(
              deduction === "OSD" ? 61 : 60,
              deduction === "OSD" ? "OSD" : "TotalAllowable",
            ),
          ),
      ),
    );
    set(field(63, "AddNet"), n(field(48, "NetTax")));
    set(
      field(64, "NetTax"),
      Math.max(0, taxableBusiness) + n(field(63, "AddNet")),
    );
    set(field(65, "LessExcess"), n(field(49, "ExcessDeduct")));
    set(
      field(66, "TotalTaxable"),
      Math.max(
        0,
        Math.round(n(field(64, "NetTax")) - n(field(65, "LessExcess"))),
      ),
    );
    set(
      field(67, "TaxDueRegular"),
      tax(n(field(66, "TotalTaxable")), 2017, true),
    );
    set(p3(68, "RegularRate"), n(field(67, "TaxDueRegular")));
    const specialRegime = column === "C1" ? "C2" : "C6";
    const exemptRegime = column === "C1" ? "C3" : "C7";
    for (const [target, source, regime, applies] of [
      [p3(69, "SpecialRate"), "18TotalIncome", specialRegime, attachmentActive(column === "C1" ? "taxpayer" : "spouse", "SpecialRate")],
      [p3(74, "Special"), "19TotalTaxCredits", specialRegime, attachmentActive(column === "C1" ? "taxpayer" : "spouse", "SpecialRate")],
      [p3(75, "Exempt"), "19TotalTaxCredits", exemptRegime, attachmentActive(column === "C1" ? "taxpayer" : "spouse", "Exempt")],
    ] as const) {
      computed?.add(id(target));
      if (applies) copy(target, `txtPg12Pt9I${source}${regime}`);
    }
    set(
      p3(71, "NetSpecial"),
      n(p3(69, "SpecialRate")) - n(p3(70, "LessShare")),
    );
    set(
      p3(72, "TotalIncomeTax"),
      n(p3(68, "RegularRate")) + n(p3(71, "NetSpecial")),
    );
    const creditInputs = range(1, 9).map(
      (item) => `txtPg9Sc9I${item}${person}${column}`,
    );
    const creditTotal = `txtPg9Sc9I10${person}${column}`;
    const regularCredit = p3(73, "Regular");
    if (creditInputs.some((field) => Object.hasOwn(result, id(field)))) {
      set(creditTotal, creditInputs.reduce((total, field) => total + activeAmount(field), 0));
    } else {
      set(creditTotal, Object.hasOwn(result, id(creditTotal)) ? n(creditTotal) : n(regularCredit));
    }
    set(regularCredit, n(creditTotal));
    const beforeSpecial = column === "C1" ? "txtPg3Pt5I88TaxRelief1" : "txtPg3Pt5I88TaxRelief2";
    set(p3(86, "Regular"), tax(n(field(66, "TotalTaxable")) + n(field(58, "Special")), 2017, true));
    copy(p3(87, "LessTax"), field(67, "TaxDueRegular"));
    derive(beforeSpecial, [p3(86, "Regular"), p3(87, "LessTax")], () => n(p3(86, "Regular")) - n(p3(87, "LessTax")));
    copy(p3(89, "AddSpecial"), `txtPg9Sc9I8${person}${column}`);
    total(p3(90, "RegularTax"), [beforeSpecial, p3(89, "AddSpecial")]);
    copy(p3(91, "SpecialTax"), `txtPg12Pt9I21TaxRelief${specialRegime}`);
    copy(p3(92, "ExemptTax"), `txtPg12Pt9I21TaxRelief${exemptRegime}`);
    total(p3(93, "TotalTax"), [p3(90, "RegularTax"), p3(91, "SpecialTax"), p3(92, "ExemptTax")]);
    calculateJuneConsolidation(worksheet, column, person, deduction === "OSD");
    calculateJuneReconciliation(worksheet, column);
    set(
      p3(76, "TotalTax"),
      sum([p3(73, "Regular"), p3(74, "Special"), p3(75, "Exempt")]),
    );
    set(p3(77, "NetTax"), n(p3(72, "TotalIncomeTax")) - n(p3(76, "TotalTax")));
    const assets = range(1, 6).map(
      (item) => `txtPg9Sc10I${item}${person}${column}`,
    );
    set(`txtPg9Sc10I7${person}${column}`, sum(assets));
    set(
      `txtPg9Sc10I12${person}${column}`,
      sum(range(8, 11).map((item) => `txtPg9Sc10I${item}${person}${column}`)),
    );
    set(
      `txtPg9Sc10I16${person}${column}`,
      n(`txtPg9Sc10I13${person}${column}`) +
        n(`txtPg9Sc10I14${person}${column}`) -
        n(`txtPg9Sc10I15${person}${column}`),
    );
    set(
      `txtPg9Sc10I17${person}${column}`,
      n(`txtPg9Sc10I12${person}${column}`) +
        n(`txtPg9Sc10I16${person}${column}`),
    );
  }
  total("txtPg3Pt5I94TotalTax", ["txtPg3Pt5I93TotalTaxC1", ...(joint ? ["txtPg3Pt5I93TotalTaxC2"] : [])]);
  set(
    "txtPg1Pt2I26IncomeTax",
    n("txtPg3Pt5I72TotalIncomeTaxC1") +
      (joint ? n("txtPg3Pt5I72TotalIncomeTaxC2") : 0),
  );
  set(
    "txtPg1Pt2I27LessTotalTax",
    n("txtPg3Pt5I76TotalTaxC1") + (joint ? n("txtPg3Pt5I76TotalTaxC2") : 0),
  );
  set(
    "txtPg1Pt2I28NetTax",
    n("txtPg1Pt2I26IncomeTax") - n("txtPg1Pt2I27LessTotalTax"),
  );
  derive("txtPg1Pt2I29PortionTax", ["txtPg3Pt5I79LessPortion"], () =>
    n("txtPg3Pt5I79LessPortion"),
  );
  set(
    "txtPg1Pt2I30TotalAmount",
    n("txtPg1Pt2I28NetTax") - n("txtPg1Pt2I29PortionTax"),
  );
  set(
    "txtPg1Pt2I31TotalPenalties",
    sum([
      "txtPg3Pt5I81Surcharge",
      "txtPg3Pt5I82Interest",
      "txtPg3Pt5I83Compromise",
    ]),
  );
  const net = n("txtPg1Pt2I30TotalAmount");
  set(
    "txtPg1Pt2I32TotalUponFiling",
    net < 0 ? net : net + n("txtPg1Pt2I31TotalPenalties"),
  );
  set("txtPg3Pt5I78NetTaxForTaxFiler", n("txtPg1Pt2I28NetTax"));
  set("txtPg3Pt5I80NetAmount", net);
  set("txtPg3Pt5I84TotalPenalties", n("txtPg1Pt2I31TotalPenalties"));
  set("txtPg3Pt5I85TotalAmount", net + n("txtPg1Pt2I31TotalPenalties"));
  return result;
}

export function validateAnnual(code: string, values: Values): Values {
  const errors: Values = {};
  const result = calculateAnnual(code, values);
  const n = (name: string) => number(result[id(name)]);
  const value = (name: string) => values[id(name)]?.trim() ?? "";
  const require = (name: string, label: string) => {
    if (!value(name)) errors[id(name)] = `Enter ${label}.`;
  };
  const rawYear = value("txtPg1I1Year");
  const year = Number(
    code === "1701" && /^\d{2}$/.test(rawYear) ? "20" + rawYear : rawYear,
  );
  if (
    !(code === "1701" ? /^(\d{2}|\d{4})$/ : /^\d{4}$/).test(rawYear) ||
    year < (code === "1701" ? 1900 : 2018) ||
    year > new Date().getFullYear()
  )
    errors[id("txtPg1I1Year")] =
      code === "1701"
        ? "Enter a valid filing year before 2018."
        : "Enter a valid filing year from 2018 onward.";
  if (code === "1701" && year >= 2018)
    errors[id("txtPg1I1Year")] =
      "Use the revised form for filing years from 2018 onward.";
  const birthField = code === "1701" ? "txtPg1Pt1I11Month" : "txtPg1I10BirthDate";
  const birthValue = value(birthField);
  if (birthValue) {
    const birth = birthValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    const date = birth
      ? new Date(Number(birth[3]), Number(birth[1]) - 1, Number(birth[2]))
      : null;
    if (
      !birth ||
      !date ||
      date.getFullYear() !== Number(birth[3]) ||
      date.getMonth() !== Number(birth[1]) - 1 ||
      date.getDate() !== Number(birth[2]) ||
      date > new Date()
    )
      errors[id(birthField)] = "Enter a valid birth date in MM/DD/YYYY format.";
  }
  if (code === "1701v2018") {
    require("rdoPg1I7ATC", "the alphanumeric tax code on Item 7");
    require("txtPg1I10BirthDate", "the birth date on Item 10");
    require("txtPg1I12Citizenship", "citizenship on Item 12");
    if (incomeIncludesSpouse(code, values)) {
      for (const [name, label] of [
        ["txtPg2I5SpouseName", "the spouse name"],
        ["txtPg2I6TelNum", "the spouse contact number"],
        ["txtPg2I7Citizenship", "the spouse citizenship"],
        ["rdoPg2I4ATC", "the spouse ATC"],
        ["rdoPg2I8ForeignTaxCredits", "the spouse foreign tax credit election"],
        ["rdoPg2I10IncomeExempt", "the spouse exempt income election"],
        ["rdoPg2I11IncomeSpecial", "the spouse special rate election"],
      ])
        require(name, label);
      if (value("rdoPg2I8ForeignTaxCredits") === "Yes")
        require("txtPg2I9ForeignTaxNumber", "the spouse foreign tax number");
      for (const part of ["TIN1", "TIN2", "TIN3"])
        if (!/^\d{3}$/.test(value("txtPg2I1" + part)))
          errors[id("txtPg2I1" + part)] = "Enter a valid spouse TIN segment.";
      if (!/^\d{3,5}$/.test(value("txtPg2I1BranchCode")))
        errors[id("txtPg2I1BranchCode")] = "Enter the spouse branch code.";
      if (
        !["S", "P", "C"].some((type) =>
          isChecked(value("rdoPg2I3SpouseType" + type)),
        )
      )
        errors[id("rdoPg2I3SpouseTypeS")] = "Select the spouse filer type.";
    }

    require("rdoPg1I16CivilStatus", "civil status on Item 16");
    require("rdoPg1I19IncomeExempt", "the exempt income election on Item 19");
    require("rdoPg1I20IncomeSpecial", "the special rate election on Item 20");
    if (
      !["S", "P", "E", "T", "C"].some((type) =>
        isChecked(value("rdoPg1I6TaxpayerType" + type)),
      )
    )
      errors[id("rdoPg1I6TaxpayerTypeS")] =
        "Select the taxpayer type on Item 6.";
    if (value("rdoPg1I13ForeignTaxCredits") === "Yes")
      require("txtPg1I14ForeignTaxNumber", "the foreign tax number on Item 14");
    if (value("rdoPg1I16CivilStatus") === "Married")
      require("rdoPg1I17SpouseIncome", "the spouse income election on Item 17");
    if (value("rdoPg1I16CivilStatus") === "Married" && value("rdoPg1I17SpouseIncome") === "Yes")
      require("rdoPg1I18FilingStatus", "filing status on Item 18");
    const joint = incomeIncludesSpouse(code, values);
    for (const column of joint ? ["A", "B"] : ["A"]) {
      const base = revisedTaxChoice(column);
      const atcRate = revised1701RateForAtc(revisedAtc(values, column));
      const scheme = atcRate ?? value(base + "TaxRate");
      const compensationOnly = atcRate !== undefined ? atcRate === "" :
        column === "A"
          ? isChecked(value("rdoPg1I6TaxpayerTypeC")) &&
            !["S", "P", "E", "T"].some((type) =>
              isChecked(value("rdoPg1I6TaxpayerType" + type)),
            )
          : isChecked(value("rdoPg2I3SpouseTypeC")) &&
            !["S", "P"].some((type) =>
              isChecked(value("rdoPg2I3SpouseType" + type)),
            );
      if (!compensationOnly && !scheme)
        require(base + "TaxRate", "the tax rate election");
      if (!compensationOnly && scheme === "Graduated")
        require(base + "AMethodDeduction", "the method of deduction");
      if (n(`txtPg1I25${column}`) > n(`txtPg1I22${column}TaxDue`) * 0.5)
        errors[id(`txtPg1I25${column}`)] =
          "Deferred tax cannot exceed 50% of Item 22.";
      const eightPercent = !compensationOnly && scheme === "Percentage";
      const reduction = `txtPg3IShed3_29${column}`;
      const reductionApplies = eightPercent && annualFieldApplies(code, id(reduction), values);
      if (reductionApplies && n(reduction) > 250000)
        errors[id(`txtPg3IShed3_29${column}`)] =
          "The deduction cannot exceed 250,000.";
      if (
        eightPercent &&
        n(`txtPg3IShed3_26${column}`) > 3000000
      )
        errors[id(`txtPg3IShed3_26${column}`)] =
          "Gross receipts exceed the packaged 3,000,000 threshold for the 8% election.";
      if (
        reductionApplies &&
        n(`txtPg2IShed2_6${column}`) > 0 &&
        n(`txtPg3IShed3_29${column}`) > 0
      )
        errors[id(`txtPg3IShed3_29${column}`)] =
          "The 250,000 deduction is unavailable for mixed income earners.";
      const reconcile = `txtPg4IPart9_11${column}`;
      if (
        !compensationOnly && scheme === "Graduated" && value(base + "AMethodDeduction") === "Itemized" &&
        n(reconcile) !== n(`txtPg2IShed3_23${column}`)
      )
        errors[id(reconcile)] =
          "Reconcile taxable income to Schedule 3.A Item 23.";
    }
    for (const row of joint ? [1, 2, 4, 5] : [1, 2]) {
      const base = `txtPg3IShed5_${row}`;
      if (!annualFieldApplies(code, id(base + "Amt"), values)) continue;
      if (
        n(base + "Amt") !== 0 ||
        value(base + "Desc") ||
        value(base + "Legal")
      ) {
        require(base + "Desc", "the special deduction description");
        require(base + "Legal", "the legal basis for the special deduction");
      }
    }
    if (n("txtPg1I32AggregateAmtPyble") < 0)
      require("rdoPg1Overpayment", "the overpayment disposition");
  } else {
    const joint = incomeIncludesSpouse(code, values);
    for (const [name, label] of [
      ["rdoPg1Pt1I4ATC", "the ATC on Item 4"],
      ["txtPg1Pt1I8TaxFiler", "the taxpayer surname on Item 8"],
      ["txtPg1Pt1I8TaxFilerFirstName", "the taxpayer first name on Item 8"],
      ["txtPg1Pt1I10Address", "the registered address on Item 10"],
      ["txtPg1Pt1I11Month", "the birth date on Item 11"],
      ["txtPg1Pt1I12Email", "the email address on Item 12"],
      ["txtPg1Pt1I13Contact", "the contact number on Item 13"],
    ])
      require(name, label);
    const business = ["Business", "Mixed"].includes(value("rdoPg1Pt1I4ATC"));
    if (["Single", "Professional"].includes(value("rdoPg1Pt1I7Type")))
      require("rdoPg1Pt1I14Status", "the civil status on Item 14");
    if (value("rdoPg1Pt1I14Status") === "Married") {
      require("rdoPg1Pt1I15Income", "the spouse income election on Item 15");
      if (value("rdoPg1Pt1I15Income") === "WithIncome")
        require("rdoPg1Pt1I16FilingStatus", "the filing status on Item 16");
    }
    if (joint) {
      for (const part of ["TIN1", "TIN2", "TIN3"])
        if (!/^\d{3}$/.test(value("txtPg4Pt7I95Spouse" + part)))
          errors[id("txtPg4Pt7I95Spouse" + part)] = "Enter a valid spouse TIN segment.";
      if (!/^\d{3,5}$/.test(value("txtPg4Pt7I95SpouseTIN4")))
        errors[id("txtPg4Pt7I95SpouseTIN4")] = "Enter the spouse branch code.";
      const spouseRdo = "ddlPg1Pt4I96RDOCode";
      if (!value(spouseRdo) || /^0+$/.test(value(spouseRdo)))
        errors[id(spouseRdo)] = "Select the spouse RDO code on Item 96.";
      require("txtPg4Pt7I97SpouseName", "the spouse name on Item 97");
      for (const row of legacyEmployerRows) {
        const { earner, gross, withheld } = legacyEmployer(row);
        if ((n(gross) || n(withheld)) && !["1", "2"].includes(value(earner)))
          errors[id(earner)] = "Select the taxpayer or spouse for this employer.";
      }
    }
    if (business)
      for (const [name, label] of [
        ["rdoPg1Pt1I7Type", "the filer type on Item 7"],
        ["txtPg1Pt1I9TradeName", "the trade name on Item 9"],
        ["txtPg1Pt1I17Business", "the line of business on Item 17"],
        ["txtPg1Pt1I18PSIC", "the PSIC on Item 18"],
        ["rdoPg1Pt1I20Deduction", "the deduction method on Item 20"],
        ["rdoPg1Pt1I21Accounting", "the accounting method on Item 21"],
        ["rdoPg1Pt1I22IncomeExempt", "the exempt income election on Item 22"],
        ["rdoPg1Pt1I23IncomeSpecial", "the special rate election on Item 23"],
      ])
        require(name, label);
    if (n("txtPg1Pt2I29PortionTax") > n("txtPg1Pt2I26IncomeTax") * 0.5)
      errors[id("txtPg3Pt5I79LessPortion")] =
        "Deferred tax cannot exceed 50% of Item 26.";
    if (n("txtPg1Pt2I32TotalUponFiling") < 0)
      require("rdoPg1Pt2Overpayment", "the overpayment disposition");
    const filing = legacy1701Filing;
    const type = values[filing.type];
    if (type === filing.certificate || type === filing.governmentId) {
      const identification = values[filing.number]?.trim() ?? "";
      const isCtc = type === filing.certificate;
      if (!(isCtc ? /^\d{1,8}$/ : /^[a-z\d]{1,17}$/i).test(identification))
        errors[filing.number] = isCtc ? "Enter a CTC number with up to eight digits." : "Enter a government ID number with up to 17 letters or digits.";
      if (!values[filing.issuePlace]?.trim()) errors[filing.issuePlace] = "Enter the place of issue.";
      const date = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(values[filing.issueDate] ?? "");
      const [, month, day, year] = (date ?? []).map(Number);
      const issued = new Date(Date.UTC(year, month - 1, day));
      if (!date || year < 1900 || issued.getUTCMonth() !== month - 1 || issued.getUTCDate() !== day)
        errors[filing.issueDate] = "Enter a valid date of issue from 1900 onward.";
      if (isCtc && number(values[filing.amount]) <= 0) errors[filing.amount] = "Enter a positive CTC amount.";
    }
    if (business)
      for (const [person, column] of [
        ["TaxPayer", "C1"],
        ["Spouse", "C2"],
      ]) {
        if (column === "C2" && !joint)
          continue;
        const assets = `txtPg9Sc10I7${person}${column}`;
        if (
          n(assets) <= 0 ||
          n(assets) !== n(`txtPg9Sc10I17${person}${column}`)
        )
          errors[id(assets)] =
            "Total assets must be positive and equal total liabilities and capital.";
      }
  }
  return errors;
}
