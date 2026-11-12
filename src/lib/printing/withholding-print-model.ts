import {
  getWithholdingAtcs,
  getWithholdingDefinition,
  withholdingFields,
  withholdingSchedules,
} from "$lib/forms/withholding-definitions";
import { calculateWithholding } from "$lib/forms/withholding-rules";
type Values = Record<string, string>;
const aliases: Record<string, string> = {
  tinpart1: "txtTIN1",
  tinpart2: "txtTIN2",
  tinpart3: "txtTIN3",
  tina: "txtTIN1",
  tinb: "txtTIN2",
  tinc: "txtTIN3",
  branchcode: "txtBranchCode",
  rdocode: "txtRDOCode",
  registeredname: "txtTaxpayerName",
  txtpayername: "txtTaxpayerName",
  txtagentname: "txtTaxpayerName",
  txtwthhldngagntsnme: "txtTaxpayerName",
  txtbuyername: "txtTaxpayerName",
  registeredaddress: "txtAddress",
  txtbuyeraddress: "txtAddress",
  zipcode: "txtZipCode",
  telephonenumber: "txtTelNum",
  email: "txtEmail",
  description: "txtLineBus",
  txtlob: "txtLineBus",
  amendedrtn: "optAmend",
  taxwithheld: "optWithheld",
  catagent: "optCategory",
  categoryagent: "optCategory",
  specialtax: "optRelief",
  taxrelief: "optRelief",
  j_id201: "txtMonth",
  monthend: "txtMonth",
  j_id217: "optAmend",
  j_id252: "optWithheld",
  j_id392: "optCategory",
  amendedreturn1: "optAmend",
  amendedreturn: "optAmend",
  anytaxheld: "optWithheld",
  opttaxwithheld: "optWithheld",
  optcategoryagent: "optCategory",
  optspecialtax: "optRelief",
  wthldngagntctgry: "optCategory",
  optqrtr: "optQuarter",
  qtr: "optQuarter",
  privateagent: "topAgent",
  tpwthldngagnt: "topAgent",
  releasedoffunds: "refund",
  availedtaxrelief: "reliefDescription",
  txtpg1i1year: "txtYear",
  txtpg1i1month: "txtMonth",
  txtpg1tin1: "txtTIN1",
  txtpg1tin2: "txtTIN2",
  txtpg1tin3: "txtTIN3",
  txtpg1tin4: "txtBranchCode",
  txtpg1i6rdo: "txtRDOCode",
  txtpg1pt1i7withholdingagentsname: "txtTaxpayerName",
  txtpg1pt1i8registeredaddress: "txtAddress",
  txtpg1pt1i8registeredaddress2: "txtAddress2",
  txpg1i8zipcode: "txtZipCode",
  txtpg1pt1i9contactnumber: "txtTelNum",
  txtpg1pt1i11email: "txtEmail",
  txtpg1i4noofsheets: "txtSheets",
  txtemail2: "txtEmail",
  drpspecialtax: "reliefDescription",
  lsttaxtreaty: "reliefDescription",
  seltreaty: "reliefDescription",
  lstspecialtax: "reliefDescription",
  txtpg1pt1i12taxreliefspec: "reliefDescription",
  j_id398: "optRelief",
  rdtreaty: "optRelief",
  optatc13: "atc",
  pg2sc1tottxwthhldandrmtted: "dtSched:TotaltaxWithheld",
  txttins1: "sellerTin1",
  txttins2: "sellerTin2",
  txttins3: "sellerTin3",
  txtbranchcodes: "sellerBranch",
  txtselleraddress: "sellerAddress",
  txtrdocodes: "sellerRdo",
  txtrdocode16a: "propertyRdo",
};
/** Resolve normalized saved values to the packaged form's original field identifiers. */
export function originalFieldValue(
  code: string,
  id: string,
  values: Values,
): { key: string; value: string } | undefined {
  const prefix = getWithholdingDefinition(code)?.prefix ?? `frm${code}:`;
  const short = id.startsWith(prefix) ? id.slice(prefix.length) : id;
  const lower = short.toLowerCase();
  if (/^BrachMask[12]$/.test(short)) {
    const key = prefix + "txtBranchCode";
    return { key, value: values[key] ?? "" };
  }
  if (/^txtPg[12]TinC[1234]$/i.test(short)) {
    const n = short.slice(-1);
    const key = prefix + (n === "4" ? "txtBranchCode" : "txtTIN" + n);
    return { key, value: values[key] ?? "" };
  }
  if (/^txtPg1I1Year$/i.test(short)) {
    const key = prefix + "txtYear";
    return { key, value: (values[key] ?? "").slice(-2) };
  }
  if (code === "1601C" && short === "txtTax26") {
    const key = prefix + "txtTax19";
    return { key, value: values[key] ?? "0.00" };
  }
  if (code === "1603Qv2018" && short === "Sched1:txtTotalTax") {
    const key = prefix + "txtTax14";
    return { key, value: values[key] ?? "0.00" };
  }
  if (code === "1603" && /^txtMonth[123]$/.test(short)) {
    const key = prefix + "optQuarter";
    const quarter = Number((values[key] ?? "").replace("Q", ""));
    return {
      key,
      value: quarter
        ? [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC",
          ][(quarter - 1) * 3 + Number(short.slice(-1)) - 1]
        : "",
    };
  }
  if (short === "txtTotalOtherTax") {
    const limit = code === "1601FQ" ? 6 : 5;
    return {
      key: prefix + "txtTotalOtherTax",
      value: Object.entries(values)
        .filter(
          ([key]) =>
            /txtTaxbeWithHeld\d+$/.test(key) &&
            Number(key.match(/(\d+)$/)?.[1]) > limit,
        )
        .reduce((sum, [, v]) => sum + (Number(v) || 0), 0)
        .toFixed(2),
    };
  }

  if (short === "txtDvTotalSchedI") {
    const key = prefix + "treaty:1:tax";
    return {
      key,
      value: Object.entries(values)
        .filter(([k]) => /treaty:\d+:tax$/.test(k))
        .reduce((sum, [, v]) => sum + (Number(v) || 0), 0)
        .toFixed(2),
    };
  }
  if (/dtSched:drpAtcCode:\d+$/.test(short)) {
    const key = prefix + short.replace("drpAtcCode:", "drpAtcCode");
    return { key, value: values[key] ?? "" };
  }
  const choiceMap: Record<string, Record<string, string>> = {
    itemfiscalstartmonth: { Calendar: "C", Fiscal: "F" },
    itemmodeofpayment: {
      Installment: "1",
      "Partial payment": "2",
      "Full payment": "3",
    },
    itemmannerofpayment: {
      "Self-assessment": "1",
      Penalties: "5",
      "Tax deposit / advance payment": "2",
      "Income tax second installment": "3",
      Others: "4",
      "Preliminary/final assessment / deficiency": "6",
      "Accounts receivable / delinquent account": "7",
    },
  };
  if (choiceMap[lower]) {
    const key =
      Object.keys(values).find(
        (k) => k.toLowerCase() === (prefix + short).toLowerCase(),
      ) ?? prefix + short;
    return { key, value: choiceMap[lower][values[key]] ?? values[key] ?? "" };
  }
  if (code === "1606") {
    if (/^txtTINS[123]$/.test(short) || short === "txtBranchCodeS") {
      const key = prefix + "sellerTin";
      const digits = (values[key] ?? "").replace(/\D/g, "");
      const n = short === "txtBranchCodeS" ? 3 : Number(short.slice(-1)) - 1;
      return {
        key,
        value: digits.slice(n * 3, n === 3 ? undefined : n * 3 + 3),
      };
    }
    if (lower === "j_id393") {
      const key = prefix + "propertyType";
      return {
        key,
        value:
          (
            {
              Residential: "R",
              Agricultural: "A",
              Commercial: "C",
              Industrial: "I",
              "Residential condominium": "CR",
              "Commercial condominium": "CC",
              Others: "",
            } as Values
          )[values[key]] ?? "",
      };
    }
    if (lower === "j_id395") {
      const key = prefix + "transactionType";
      return {
        key,
        value:
          (
            {
              "Cash sale": "CS",
              "Foreclosure sale": "FS",
              "Installment sale": "IS",
              Exempt: "E",
              Others: "O",
            } as Values
          )[values[key]] ?? "",
      };
    }
    if (lower === "speciallaw") {
      const key = prefix + "Habitual";
      return { key, value: values[key] ?? "" };
    }
    if (lower === "opt37") {
      const key = prefix + "overpaymentOption";
      return { key, value: values[key]?.startsWith("Refund") ? "R" : "I" };
    }
  }
  if (code === "1602" && ["txt22E", "txt22H"].includes(short)) {
    const key = prefix + (short === "txt22E" ? "rate22D" : "rate22G");
    return { key, value: values[key] ?? "" };
  }
  if (code === "1601C" && lower === "j_id402") {
    const key = prefix + "reliefDescription";
    return { key, value: values[key] ?? "" };
  }
  if (code === "1601C" && short === "SectionA:SelMonthYear1_1") {
    const key = prefix + "sched1:periodType0";
    return { key, value: values[key] ?? "" };
  }
  const ptGroup = short.match(/^rdoPg1I(2|3|10|12)/);
  if (ptGroup) {
    const alias: Record<string, string> = {
      "2": "optAmend",
      "3": "optWithheld",
      "10": "optCategory",
      "12": "optRelief",
    };
    const key = prefix + alias[ptGroup[1]];
    return { key, value: values[key] ?? "" };
  }
  const adjustment = short.match(
    /^SectionA:(TxtMonthYearRadio|TxtDatePaidRadio|TxtBankCodeRadio|TxtRORNoRadio|TxtTaxPaidRadio|TxtShouldTaxDueRadio|TxtCurrentYearRadio|TxtFromYearEndRadio|SelMonthYear)(\d+)$/i,
  );
  if (adjustment) {
    const part: Record<string, string> = {
      txtmonthyearradio: "txtMonthYear",
      txtdatepaidradio: "txtDatePaid",
      txtbankcoderadio: "txtBankCode",
      txtrornoradio: "txtNumber",
      txttaxpaidradio: "txtTaxPaid",
      txtshouldtaxdueradio: "txtShouldTaxDue",
      txtcurrentyearradio: "txtAdjustments",
      txtfromyearendradio: "txtAdjustments",
      selmonthyear: "periodType",
    };
    const key =
      prefix +
      "sched1:" +
      part[adjustment[1].toLowerCase()] +
      (Number(adjustment[2]) - 1);
    return {
      key,
      value:
        (/CurrentYear/.test(adjustment[1]) &&
          values[prefix + "sched1:periodType" + (Number(adjustment[2]) - 1)] ===
            "Y") ||
        (/FromYearEnd/.test(adjustment[1]) &&
          values[prefix + "sched1:periodType" + (Number(adjustment[2]) - 1)] !==
            "Y")
          ? ""
          : (values[key] ?? ""),
    };
  }
  const exact = Object.keys(values).find(
    (key) =>
      key.toLowerCase() === id.toLowerCase() ||
      (!id.includes(":") && key.toLowerCase() === (prefix + id).toLowerCase()),
  );
  if (exact)
    return {
      key: exact,
      value: /quarter/i.test(id)
        ? values[exact].replace(/^Q/, "")
        : values[exact],
    };
  const name = id.startsWith(prefix) ? id.slice(prefix.length) : id;
  const alias = aliases[name.toLowerCase()];
  if (alias && prefix + alias in values)
    return {
      key: prefix + alias,
      value:
        alias === "optQuarter"
          ? values[prefix + alias].replace(/^Q/, "")
          : values[prefix + alias],
    };
  const date = name.match(
    /^(txtReturnPeriod|DateWithholding(?:To)?|txtDate|txtDueDate|txtDue)(Month|Day|Year)$/i,
  );
  if (date) {
    const key = prefix + (/due/i.test(date[1]) ? "dueDate" : "date");
    const parts = (values[key] ?? "").split("-");
    return {
      key,
      value:
        parts[{ year: 0, month: 1, day: 2 }[date[2].toLowerCase()] ?? 0] ?? "",
    };
  }
  const refund = name.match(/^txtRef(Month|Date|Year)$/i);
  if (refund) {
    const key = prefix + "refundDate";
    return {
      key,
      value:
        (values[key] ?? "").split("-")[
          { year: 0, month: 1, date: 2 }[refund[1].toLowerCase()] ?? 0
        ] ?? "",
    };
  }
  const treaty = name.match(
    /^(drpTreatyCode|drpATCCode|txtAmtIncomePay|txtRate|txtReqWithheld)(\d+)$/,
  );
  if (treaty) {
    const part: Record<string, string> = {
      drpTreatyCode: "code",
      drpATCCode: "atc",
      txtAmtIncomePay: "income",
      txtRate: "rate",
      txtReqWithheld: "tax",
    };
    const key = prefix + `treaty:${Number(treaty[2]) + 1}:${part[treaty[1]]}`;
    if (key in values) return { key, value: values[key] };
  }
  const payee = name.match(
    /^Pg2Sc1(TIN|Name|ATC|AmtOfIncPmt|TaxRate|AmtOfTxWthhld)(\d+)$/,
  );
  if (payee) {
    const part: Record<string, string> = {
      TIN: "txtTin",
      Name: "txtFullname",
      ATC: "drpAtcCode",
      AmtOfIncPmt: "amount",
      TaxRate: "txtRatePercent",
      AmtOfTxWthhld: "taxWithheld",
    };
    const key = prefix + "dtSched:" + part[payee[1]] + payee[2];
    if (key in values) return { key, value: values[key] };
  }
  if (/(?:Pg[23]|Page[23]).*(?:Agent|Name)/i.test(name))
    return {
      key: prefix + "txtTaxpayerName",
      value: values[prefix + "txtTaxpayerName"] ?? "",
    };
  if (/(?:Pg[23]|Page[23]).*TIN/i.test(name)) {
    const suffix = name.match(/TIN([1234])$/i)?.[1];
    const key =
      prefix +
      (suffix === "4"
        ? "txtBranchCode"
        : suffix
          ? "txtTIN" + suffix
          : "txtTIN1");
    return {
      key,
      value: suffix
        ? (values[key] ?? "")
        : [1, 2, 3].map((n) => values[prefix + "txtTIN" + n] ?? "").join("-"),
    };
  }
  return undefined;
}

/** A flat list of source field bindings, never a document tree or HTML template. */
export type PrintBinding = {
  id: string;
  source?: string;
  key?: string;
  fallback?: string;
  choice?: string;
  checked?: boolean;
  moneyPart?: number;
  options?: Record<string, string>;
};
export type PrintCell = { id: string; label: string; value: string };
export type PrintRow = {
  id: string;
  label: string;
  description: string;
  cells: PrintCell[];
};
export type PrintContinuation = {
  id: string;
  title: string;
  columns: string[];
  rows: PrintRow[];
};
function printDate(value: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value.slice(5, 7) + "/" + value.slice(8, 10) + "/" + value.slice(0, 4)
    : value;
}

export function createWithholdingPrintModel(
  code: string,
  rawValues: Values,
  bindings: readonly PrintBinding[],
) {
  const definition = getWithholdingDefinition(code);
  if (!definition) throw new Error(`No print model for ${code}`);
  const values = calculateWithholding(code, rawValues);
  const prefix = definition.prefix;
  const mapped = new Set<string>();
  const text: Values = {};
  const checks: Record<string, boolean> = {};
  const catalog = getWithholdingAtcs(code);
  const hasAddress2 = bindings.some(
    (binding) =>
      originalFieldValue(code, binding.source ?? binding.id, values)?.key ===
      prefix + "txtAddress2",
  );
  const resolve = (binding: PrintBinding) =>
    binding.key
      ? { key: binding.key, value: values[binding.key] ?? "" }
      : originalFieldValue(code, binding.source ?? binding.id, values);
  for (const binding of bindings) {
    const result = resolve(binding);
    if (result) mapped.add(result.key);
    let value = result?.value ?? binding.fallback ?? "";
    const nature = binding.id.match(
      /(?:dtSched:naturePayment|txtNatIncPayment)(\d+)$/,
    );
    if (nature) {
      const treaty = /txtNatIncPayment/.test(binding.id);
      const atcKey =
        prefix +
        (treaty
          ? `treaty:${Number(nature[1]) + 1}:atc`
          : `dtSched:drpAtcCode${nature[1]}`);
      value =
        catalog.find((atc) => atc.code === values[atcKey])?.description ?? "";
    }
    if (
      result?.key === prefix + "txtAddress" &&
      !hasAddress2 &&
      values[prefix + "txtAddress2"]
    ) {
      value += ", " + values[prefix + "txtAddress2"];
      mapped.add(prefix + "txtAddress2");
    }
    value = binding.options?.[value] ?? value;
    if (
      code === "1601E" &&
      binding.id === prefix + "j_id402" &&
      values[prefix + "optRelief"] !== "Y"
    ) {
      value = "";
    }
    value = printDate(value);
    if (binding.moneyPart !== undefined)
      value = (Number(value.replaceAll(",", "")) || 0).toFixed(2).split(".")[
        binding.moneyPart
      ];
    if (/fntSched1TaxRate/.test(binding.id) && value && !value.endsWith("%"))
      value += "%";
    text[binding.id] = value;
    if (binding.choice !== undefined)
      checks[binding.id] = result
        ? result.value === binding.choice
        : !!binding.checked;
    if (code === "1606" && /:opt27[A-D]$/.test(binding.id)) {
      // The original tickCheckboxWithValue marks the corresponding entered FMV.
      const amounts = [
        "txtFMVLand",
        "txtFMVImprovements",
        "txtFMVZonal",
        "txtFMVBIR",
      ];
      const amount = amounts["ABCD".indexOf(binding.id.slice(-1))];
      checks[binding.id] = !!rawValues[prefix + amount]?.trim();
    }
    if (code === "1603" && /chk(?:1st|2nd|3rd)$/.test(binding.id)) {
      const n = binding.id.includes("1st")
        ? 1
        : binding.id.includes("2nd")
          ? 2
          : 3;
      checks[binding.id] = (values[prefix + "monthsCovered"] ?? "")
        .split(",")
        .includes(String(n));
      mapped.add(prefix + "monthsCovered");
    }
    if (code === "1602Qv2018" && /OverRemittance[123]$/.test(binding.id)) {
      const expected = ["Refund", "Tax credit certificate", "Carry forward"][
        Number(binding.id.slice(-1)) - 1
      ];
      checks[binding.id] =
        (values[prefix + "overpaymentOption"] ?? "")
          .replaceAll(" ", "")
          .toLowerCase() === expected.replaceAll(" ", "").toLowerCase();
      mapped.add(prefix + "overpaymentOption");
    }
  }
  if (code === "1603")
    for (const field of withholdingFields(definition, values))
      if (/:(?:divisor|rate)(?:320|330|360)$/.test(field.id))
        mapped.add(field.id);
  if (code === "1602Qv2018") mapped.add(prefix + "txtSched1TaxRate15");
  const schedules = withholdingSchedules(definition, values);
  const toRow = (row: {
    id: string;
    label: string;
    fields: { id: string; label: string; type?: string }[];
  }): PrintRow => ({
    id: row.id,
    label: row.label,
    description:
      catalog.find((atc) => atc.code === values[row.fields[0]?.id])
        ?.description ?? "",
    cells: row.fields.map((field) => ({
      ...field,
      value:
        field.type === "date"
          ? printDate(values[field.id] ?? "")
          : (values[field.id] ?? ""),
    })),
  });
  const atcSchedule = schedules.find((schedule) => schedule.id === "atc");
  const limit =
    code === "1601FQ"
      ? 6
      : ["1600PTv2018", "1600VTv2018"].includes(code)
        ? 5
        : 10;
  const atcRows = (atcSchedule?.rows ?? [])
    .filter((row) =>
      row.fields.some(
        (field) =>
          values[field.id] && !["0", "0.00"].includes(values[field.id]),
      ),
    )
    .slice(0, limit)
    .map(toRow);
  for (const row of atcRows) for (const cell of row.cells) mapped.add(cell.id);
  const treatyRows =
    code === "1601F"
      ? (schedules.find((schedule) => schedule.id === "treaty")?.rows ?? [])
          .slice(0, 10)
          .map(toRow)
      : [];
  for (const row of treatyRows)
    for (const cell of row.cells) mapped.add(cell.id);
  const paired = new Set(["250", "310", "340", "410", "700"]);
  const seen = new Set<string>();
  const referenceRows = catalog
    .filter((atc) => {
      if (
        seen.has(atc.code) ||
        (atc.code.startsWith("WC") && paired.has(atc.code.slice(2)))
      )
        return false;
      seen.add(atc.code);
      return true;
    })
    .map((atc) => ({
      id: atc.code,
      description: atc.description,
      rate: atc.rate,
      individual: atc.code.startsWith("WI") ? atc.code : "",
      corporate: atc.code.startsWith("WC")
        ? atc.code
        : paired.has(atc.code.slice(2))
          ? "WC" + atc.code.slice(2)
          : "",
    }));
  const attached: string[] = [];
  const continuations: PrintContinuation[] = [];
  for (const schedule of schedules) {
    const overflow = schedule.rows.filter((row) =>
      row.fields.some(
        (field) =>
          values[field.id] &&
          !["0", "0.00"].includes(values[field.id]) &&
          !mapped.has(field.id),
      ),
    );
    for (let start = 0; start < overflow.length; start += 18) {
      const rows = overflow.slice(start, start + 18).map(toRow);
      for (const row of rows)
        for (const cell of row.cells) attached.push(cell.id);
      continuations.push({
        id: `${schedule.id}-${start}`,
        title: schedule.title,
        columns: rows[0].cells.map((cell) => cell.label),
        rows,
      });
    }
  }
  const notOnForm = withholdingFields(definition, values)
    .filter(
      (field) => field.profileKey && !mapped.has(field.id) && values[field.id],
    )
    .map((field) => field.id);
  const unmapped = withholdingFields(definition, values)
    .filter(
      (field) =>
        values[field.id] &&
        !["0", "0.00"].includes(values[field.id]) &&
        !mapped.has(field.id) &&
        !attached.includes(field.id) &&
        !notOnForm.includes(field.id),
    )
    .map((field) => field.id);
  if (unmapped.length)
    throw new Error(
      `The original ${code} print layout has unmapped return fields: ${unmapped.join(", ")}`,
    );
  return {
    text,
    checks,
    atcRows,
    treatyRows,
    referenceRows,
    continuations,
    taxpayerName: values[prefix + "txtTaxpayerName"] ?? "",
    tin: [1, 2, 3].map((n) => values[prefix + "txtTIN" + n] ?? "").join("-"),
    diagnostics: {
      mapped: [...mapped],
      attached,
      unmapped,
      notOnForm,
      pages:
        ((
          {
            1602: 2,
            "1601F": 2,
            "1601FQ": 2,
            "1600PTv2018": 2,
            "1600VTv2018": 2,
            "1601Cv2018": 2,
            "1603Qv2018": 2,
            "1602Qv2018": 3,
            "1604Ev2018": 2,
            "1604F": 2,
          } as Record<string, number>
        )[code] ?? 1) + continuations.length,
    },
  };
}
