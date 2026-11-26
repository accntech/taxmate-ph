import type { CorporateValues } from "../types";
import { quarterlyCreditCount, quarterlyCreditRowCount } from "./extra-credits";
import legacyAtcOptions from "./legacy-atc-options.json";
const prefix = "frm1702q:";
const exemptAtcs = new Set(["IC011_0%", "IC021_Exempt", "IC200_0%"]);
const specialAtcs = new Set([
  "IC030_10%",
  "IC030_1%",
  "IC031_10%",
  "IC031_1%",
  "IC200_5%",
  "IC210_2%",
  "IC080_2.5%",
  "IC101_10%",
  "IC190_10%_NotSubjectToFinalTax",
  "IC190_30%_OtherThanForeignCurrencyTransaction",
  "IC191_10%",
  "IC190_25%_NotSubjectToFinalTax_New",
  "IC190_25%_OtherThanForeignCurrencyTransaction_New",
  "IC191_25%_NotSubjectToFinalTax_New",
]);
export function quarterlyRegime(atc: string): "exempt" | "special" | "regular" {
  return exemptAtcs.has(atc)
    ? "exempt"
    : specialAtcs.has(atc)
      ? "special"
      : "regular";
}

function quarterlyYearEnd(values: CorporateValues) {
  const enteredYear = Number(values[prefix + "txtYrEndYear"]);
  return {
    year: enteredYear < 100 ? 2000 + enteredYear : enteredYear,
    month: values[prefix + "rbForClndrFscl"] === "C"
      ? 12
      : Number(values[prefix + "rbYrEndMonth"]),
  };
}

export function quarterlyRegularRate(values: CorporateValues): string | undefined {
  const atc = values[prefix + "cbATC_2"] ?? "";
  const { year, month } = quarterlyYearEnd(values);
  if (quarterlyRegime(atc) !== "regular" || (year === 2020 && (month === 7 || month === 8))) {
    return undefined;
  }
  return atc.match(/_(\d+(?:\.\d+)?)%/)?.[1];
}

export function quarterlyMcitRateIsFixed(values: CorporateValues): boolean {
  const { year, month } = quarterlyYearEnd(values);
  return values[prefix + "rbATC_1"] === "IC055" &&
    quarterlyRegime(values[prefix + "cbATC_2"] ?? "") === "regular" &&
    (year === 2018 || year === 2019 || (year === 2020 && month >= 1 && month <= 6) ||
      (year >= 2024 && month >= 7));
}

/** Equations from the active compute18A–compute34 and Schedule 1 handlers. */
export function calculateLegacyQuarterly(
  code: string,
  input: CorporateValues,
): CorporateValues {
  const values = { ...input };
  const n = (id: string) => Number((values[id] ?? "").replaceAll(",", "")) || 0;
  const get = (name: string) => n(prefix + name);
  const set = (name: string, amount: number) => {
    values[prefix + name] = amount.toFixed(2);
  };
  if (values[prefix + "optTreaty"] !== "Y")
    values[prefix + "lstTaxTreaty"] = "";
  if (values[prefix + "optRemenderRtn"] !== "Y") set("txt31F", 0);
  if (values[prefix + "optQtr"] === "1") {
    for (const name of ["txt23A", "txt23B", "txt31B", "txt31C", "txt31D"])
      set(name, 0);
  }
  if (values[prefix + "itemFiscalStartMonth"] === "C")
    values[prefix + "itemYearEndMonth"] = "12";
  for (const column of ["A", "B", "C"])
    set("txt18" + column, get("txt16" + column) - get("txt17" + column));
  set("txt20A", get("txt18A"));
  set("txt20B", get("txt18B") + get("txt19A"));
  set("txt20C", get("txt18C") + get("txt19B"));
  if (values["1702q:OptMethodDeduct"] === "O")
    set("txt21C", get("txt20C") * 0.4);
  set("txt22A", get("txt20B") - get("txt21B"));
  set("txt22B", get("txt20C") - get("txt21C"));
  if (code === "1702Q") {
    const atc = values[prefix + "txtAtc"];
    const rate = legacyAtcOptions.find(option => option.value === atc)?.rate;
    if (rate !== undefined) set("txt25B", rate);
  }
  for (const column of ["A", "B"]) {
    set("txt24" + column, get("txt22" + column) + get("txt23" + column));
    set(
      "txt26" + column,
      (Math.max(0, get("txt24" + column)) * get("txt25" + column)) / 100,
    );
  }
  const gross = n("txt1stQtr") + n("txt2ndQtr") + n("txt3rdQtr");
  values.txtTotal = gross.toFixed(2);
  values.txtMinCorpIncomeTax = (
    (gross * (code === "1702Q" ? 2 : n("txtTaxRate"))) /
    100
  ).toFixed(2);
  set("txt28", n("txtMinCorpIncomeTax"));
  set("txt29A", Math.max(get("txt26B"), get("txt28")));
  if (get("txt28") > get("txt26B")) set("txt29B", 0);
  set("txt29C", get("txt29A") - get("txt29B"));
  set("txt29D", get("txt26A") - get("txt27"));
  set("txt30", get("txt29C") + get("txt29D"));
  set(
    "txt31H",
    ["A", "B", "C", "D", "E", "F", "G"].reduce(
      (sum, column) => sum + get("txt31" + column),
      0,
    ),
  );
  set("txt32", get("txt30") - get("txt31H"));
  set("txt33D", get("txt33A") + get("txt33B") + get("txt33C"));
  set("txt34", get("txt32") + get("txt33D"));
  return values;
}

/** January 2018 ENCS uses whole pesos, including tax rounded from percentage rates. */
export function calculateRevisedQuarterly(
  input: CorporateValues,
): CorporateValues {
  const values = { ...input };
  const get = (name: string) =>
    Number((values[prefix + name] ?? "").replaceAll(",", "")) || 0;
  const set = (name: string, amount: number) => {
    values[prefix + name] = String(Math.round(amount));
  };
  const sourceYear = values[prefix + "txtYrEndYear"];
  if (/^\d{2}$/.test(sourceYear ?? ""))
    values[prefix + "txtYrEndYear"] = String(2000 + Number(sourceYear));
  const atc = values[prefix + "cbATC_2"] ?? "";
  const regime = quarterlyRegime(atc);
  values[prefix + "rbATC_2"] = atc ? "ATC_2" : "";
  for (const name of ["TIN1", "TIN2", "TIN3", "BranchCode"])
    values[prefix + "txtPg2" + name] = values[prefix + "txt" + name] ?? "";
  values[prefix + "txtPg2TaxpayerName"] =
    values[prefix + "txtTaxpayerName1"] ?? "";
  if (atc && regime !== "regular") {
    for (let item = 1; item <= 13; item++) set("Sched2:txtTax" + item, 0);
    set("txtTax15", 0);
    if (regime === "exempt")
      for (let item = 1; item <= 12; item++)
        set("Sched1:txtTax" + item + "B", 0);
    if (regime === "special")
      for (let item = 1; item <= 11; item++)
        set("Sched1:txtTax" + item + "A", 0);
  }
  if ((atc && regime !== "regular") || values[prefix + "rbATC_1"] === "N") {
    for (let item = 1; item <= 6; item++) set("Sched3:txtTax" + item, 0);
  }
  const first = values[prefix + "rbQuarter"] === "1";
  if (values[prefix + "rbForClndrFscl"] === "C")
    values[prefix + "rbYrEndMonth"] = "12";
  if (values[prefix + "rbTxRlf"] !== "Y") values[prefix + "txtTxRlfSpcfy"] = "";
  if (values[prefix + "rbAmendedRtn"] !== "Y") set("Sched4:txtTax6", 0);
  if (first)
    for (const name of [
      "Sched1:txtTax8A",
      "Sched1:txtTax8B",
      "Sched2:txtTax8",
      "Sched3:txtTax2",
      "Sched3:txtTax3",
      "Sched4:txtTax2",
      "Sched4:txtTax3",
      "Sched4:txtTax4",
    ])
      set(name, 0);
  if (values[prefix + "rbQuarter"] === "2") set("Sched3:txtTax3", 0);
  set("Sched1:txtTax10A", 0);
  for (const col of ["A", "B"]) {
    const f = (item: number) => "Sched1:txtTax" + item + col;
    set(f(3), get(f(1)) - get(f(2)));
    set(f(5), get(f(3)) + get(f(4)));
    set(f(7), get(f(5)) - get(f(6)));
    set(f(9), get(f(7)) + get(f(8)));
    set(f(11), (Math.max(0, get(f(9))) * get(f(10))) / 100);
  }
  set(
    "Sched1:txtTax13B",
    get("Sched1:txtTax11A") + get("Sched1:txtTax11B") - get("Sched1:txtTax12B"),
  );
  set("txtTax17", get("Sched1:txtTax13B"));
  if (quarterlyMcitRateIsFixed(values)) {
    values[prefix + "Sched3:txtTax5"] = "2";
  }
  set(
    "Sched3:txtTax4",
    get("Sched3:txtTax1") + get("Sched3:txtTax2") + get("Sched3:txtTax3"),
  );
  set("Sched3:txtTax6", (get("Sched3:txtTax4") * get("Sched3:txtTax5")) / 100);
  set("Sched2:txtTax3", get("Sched2:txtTax1") - get("Sched2:txtTax2"));
  set("Sched2:txtTax5", get("Sched2:txtTax3") + get("Sched2:txtTax4"));
  if (values[prefix + "rbMthdOfDdctns"] === "Debtor")
    set("Sched2:txtTax6", get("Sched2:txtTax5") * 0.4);
  set("Sched2:txtTax7", get("Sched2:txtTax5") - get("Sched2:txtTax6"));
  set("Sched2:txtTax9", get("Sched2:txtTax7") + get("Sched2:txtTax8"));
  const rate = quarterlyRegularRate(values);
  if (rate !== undefined) values[prefix + "Sched2:txtTax10"] = rate;
  set(
    "Sched2:txtTax11",
    (Math.max(0, get("Sched2:txtTax9")) * get("Sched2:txtTax10")) / 100,
  );
  set("Sched2:txtTax12", get("Sched3:txtTax6"));
  set(
    "Sched2:txtTax13",
    Math.max(get("Sched2:txtTax11"), get("Sched2:txtTax12")),
  );
  if (get("Sched2:txtTax12") > get("Sched2:txtTax11")) set("txtTax15", 0);
  set("txtTax14", get("Sched2:txtTax13"));
  const extraCount = quarterlyCreditRowCount(values);
  const hadExtras = Object.keys(values).some((id) =>
    /^frm1702q:sched4:(?:Description|Amount)\d+$/.test(id) && !!values[id]?.trim(),
  );
  values[quarterlyCreditCount] = String(extraCount);
  if (extraCount > 0) {
    if (values[prefix + "sched4:Amount0"] === undefined) {
      values[prefix + "sched4:Amount0"] =
        values[prefix + "Sched4:txtOthrTxCrdtAmnt1"] ?? "0";
      values[prefix + "sched4:Description0"] =
        values[prefix + "Sched4:txtOthrTxCrdts1"] ?? "";
    }
    const extraTotal = Array.from({ length: extraCount }, (_, index) =>
      get("sched4:Amount" + index),
    ).reduce((total, amount) => total + amount, 0);
    set("Sched4:txtOthrTxCrdtAmnt1", extraTotal);
    values[prefix + "Sched4:txtOthrTxCrdts1"] =
      "Additional tax credits / payments";
  } else if (hadExtras) {
    set("Sched4:txtOthrTxCrdtAmnt1", 0);
    values[prefix + "Sched4:txtOthrTxCrdts1"] = "";
  }
  for (const id of Object.keys(values)) {
    const match = id.match(/^frm1702q:sched4:(?:Description|Amount)(\d+)$/);
    if (match && Number(match[1]) >= extraCount) delete values[id];
  }
  const other =
    get("Sched4:txtOthrTxCrdtAmnt0") + get("Sched4:txtOthrTxCrdtAmnt1");
  set(
    "Sched4:txtTax7",
    [1, 2, 3, 4, 5, 6].reduce(
      (sum, item) => sum + get("Sched4:txtTax" + item),
      other,
    ),
  );
  set("txtTax19", get("Sched4:txtTax7"));
  set("txtTax16", get("txtTax14") - get("txtTax15"));
  set("txtTax18", get("txtTax16") + get("txtTax17"));
  set("txtTax20", get("txtTax18") - get("txtTax19"));
  set("txtTax24", get("txtTax21") + get("txtTax22") + get("txtTax23"));
  set(
    "txtTax25",
    (get("txtTax20") < 0 && get("txtTax24") > 0 ? 0 : get("txtTax20")) +
      get("txtTax24"),
  );
  return values;
}
