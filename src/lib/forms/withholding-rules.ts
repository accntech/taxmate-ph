import { joinRegisteredLines, mapRegisteredLines, registeredAddressLines, registeredNameLines, taxpayerEmailError, type TaxpayerProfile } from "$lib/profiles/profile";
import { isPackagedRdoCode } from "$lib/profiles/rdo-codes";
import { normalizeCurrencyInput } from "$lib/components/ui/currency-input/currency";
import {
  getWithholdingDefinition,
  getWithholdingAtcs,
  is1602QDecedentWithdrawalInactive,
  withholdingFields,
  withholdingSchedules,
  withholdingSchedulesEnabled,
  withholdingRowCountKey,
  withholdingPriorRemittanceFields,
  withoutInactiveWithholdingScheduleValues,
  type WithholdingDefinition,
  type WithholdingField,
} from "./withholding-definitions";
import { taxTypeOptions } from "./form-0605/tax-types";

import { philippineCalendarDate } from "./filing-calendar";

type Values = Record<string, string>;
const twoDigits = (value: number) => String(value).padStart(2, "0");
const annualInformationReturns = ["1604C", "1604CF", "1604E", "1604F"];
/** Input parsing for calculation never changes editable draft strings. Validation rejects invalid text. */
function number(value: string | undefined): number {
  const s = (value ?? "").replaceAll(",", "").trim();
  if (!/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)) return 0;
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}
const rounded = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const money = (n: number) => rounded(n).toFixed(2);
function definition(code: string): WithholdingDefinition {
  const d = getWithholdingDefinition(code);
  if (!d) throw new Error(`Unsupported withholding form: ${code}`);
  return d;
}
function activeField(field: WithholdingField, values: Values): boolean {
  return (
    !field.showWhen || values[field.showWhen.field] === field.showWhen.value
  );
}

export function isRequiredRemittanceField(code: string, scheduleId: string, field: WithholdingField): boolean {
  return scheduleId.startsWith("remittances-") && !field.readonly &&
    (field.type === "text" || field.type === "date" ||
      (code === "1604Ev2018" && /TaxWheld|TaxWithheld/.test(field.id)));
}

export function monthlyRemittanceDueDate(year: string, month: string): string {
  if (!/^\d{4}$/.test(year) || !/^(?:0[1-9]|1[0-2])$/.test(month)) return "";
  return month === "12" ? `${Number(year) + 1}-01-10` : `${year}-${twoDigits(Number(month) + 1)}-10`;
}

export function inactiveMonthlyRemittanceAmounts(code: string, values: Values): string[] {
  if (code !== "0619E" && code !== "0619F") return [];
  const prefix = `frm${code}:`;
  const none = values[prefix + "optWithheld"] === "N";
  const taxType = values[prefix + "txtTaxTypeCode"];
  return [
    ...(code === "0619F" && (none || taxType === "WF") ? ["txtTax13"] : []),
    ...(none || (code === "0619F" && taxType === "WB") ? ["txtTax14"] : []),
  ];
}

function hasInstallmentPrice(value: string | undefined): boolean {
  const raw = value?.trim() ?? "";
  const normalized = normalizeCurrencyInput(raw);
  // Legacy drafts use zero for a selling-price box that was never filled.
  return !!raw && (normalized === null || Number(normalized) !== 0);
}

export function hasConflictingInstallmentPrices(values: Values): boolean {
  if (values["frm1606:transactionType"] !== "Installment sale") return false;
  const selling = values["frm1606:txtSelling"];
  const gross = values["frm1606:txtGross"];
  if (!hasInstallmentPrice(selling) || !hasInstallmentPrice(gross)) return false;
  const normalizedSelling = normalizeCurrencyInput(selling);
  const normalizedGross = normalizeCurrencyInput(gross);
  return normalizedSelling === null || normalizedGross === null || Number(normalizedSelling) !== Number(normalizedGross);
}

export function withholdingProfileValues(d: WithholdingDefinition, profile: TaxpayerProfile): Values {
  const fields = withholdingFields(d);
  const addressFields = ["address", "address2"].flatMap(key =>
    fields.filter(field => field.profileKey === key).map(field => field.id)
  );
  const values: Values = Object.fromEntries(fields.flatMap(({ id, profileKey }) => {
    if (!profileKey) return [];
    const value = profile[profileKey];
    if (profileKey === "taxpayerName") return [[id, joinRegisteredLines(registeredNameLines(profile))]];
    if (profileKey === "email") return [[id, (profile.email ?? "").trim().toLowerCase()]];
    return [[id, typeof value === "string" ? value : ""]];
  }));
  return { ...values, ...mapRegisteredLines(addressFields, registeredAddressLines(profile)) };
}

export function createWithholdingValues(
  code: string,
  profile?: TaxpayerProfile,
): Values {
  const d = definition(code),
    values: Values = {};
  for (const field of withholdingFields(d)) values[field.id] = field.defaultValue ?? "";
  if (profile) Object.assign(values, withholdingProfileValues(d, profile));
  const { year, month, day } = philippineCalendarDate();
  if (d.yearField in values) {
    const reportingYear = annualInformationReturns.includes(code) ? year - 1 : year;
    values[d.yearField] = String(Math.min(reportingYear, d.maxYear ?? reportingYear));
  }
  if (d.monthField) {
    values[d.monthField] = code === "1601E" || code === "1601F" ? "01" : twoDigits(month);
  }
  if (code.startsWith("0619")) {
    values[d.yearField] = String(month === 1 ? year - 1 : year);
    values[d.monthField!] = twoDigits(month === 1 ? 12 : month - 1);
    values[d.prefix + "dueDate"] = monthlyRemittanceDueDate(values[d.yearField], values[d.monthField!]);
  }
  if (code === "1603Qv2018") values[d.yearField] = "2018";
  if (code === "0605") {
    values[d.prefix + "itemFiscalStartMonth"] = "Calendar";
  } else if (d.dateField) {
    values[d.dateField] = `${year}-${twoDigits(month)}-${twoDigits(day)}`;
  }
  return calculateWithholding(code, values);
}

function paymentYearValues(prefix: string, values: Values): Values {
  const basis = prefix + "itemFiscalStartMonth";
  const month = prefix + "itemYearEndMonth";
  const individual = values[prefix + "txtClassification"] === "I";
  if (individual || values[basis] === "Calendar") {
    return { ...values, [basis]: "Calendar", [month]: "12" };
  }
  return values;
}

export function calculateWithholding(code: string, values: Values): Values {
  const d = definition(code),
    p = d.prefix,
    r = { ...(code === "0605" ? paymentYearValues(p, values) : values) };
  const schedules = withholdingSchedules(d, values);
  const schedulesEnabled = withholdingSchedulesEnabled(d, values);
  const inactiveInputs = new Set(schedulesEnabled ? [] : schedules.flatMap(schedule =>
    schedule.rows.flatMap(row => row.fields.filter(field => !field.readonly).map(field => field.id)),
  ));
  const priorRemittance = withholdingPriorRemittanceFields[code];
  if (priorRemittance && values[p + "optAmend"] !== "Y")
    inactiveInputs.add(p + priorRemittance);
  for (const field of withholdingFields(d, values))
    if (field.readonly && field.defaultValue !== undefined)
      r[field.id] = field.defaultValue;
  const readNumber = (id: string) => inactiveInputs.has(id) ? 0 : number(r[id]);
  const n = (k: string) => readNumber(p + k);
  const set = (k: string, v: number) => {
    r[p + k] = money(v);
    return number(r[p + k]);
  };
  const sum = (...keys: string[]) =>
    keys.reduce((s, k) => s + Math.round(n(k) * 100), 0) / 100;
  const add = (target: string, ...keys: string[]) => set(target, sum(...keys));
  const penalty = (a: string, b: string, c: string, total: string) =>
    add(total, a, b, c);
  let atcTotal = 0,
    treatyTotal = 0,
    adjustment = 0;
  const atc = getWithholdingAtcs(code, values[p + "optCategory"], {
    year: Number(values[d.yearField]),
    month: d.monthField ? Number(values[d.monthField]) : undefined,
  });
  for (const schedule of schedules) {
    if (schedule.id === "atc" || schedule.id === "payees") {
      let total = 0;
      for (const row of schedule.rows) {
        const [codeField, baseField, rateField, taxField] =
          schedule.id === "atc"
            ? row.fields
            : [row.fields[2], row.fields[3], row.fields[4], row.fields[5]];
        const record = atc.find(
          (a) => a.code === (values[codeField.id] ?? "").trim(),
        );
        const specialLaw =
          record?.code === "N/A" && ["1600", "1601E"].includes(code);
        const supported =
          record && (!specialLaw || values[p + "optRelief"] === "Y");
        const rate = specialLaw
          ? number(values[rateField.id])
          : record
            ? number(record.rate)
            : 0;
        if (!specialLaw) r[rateField.id] = record ? String(rate) : "";
        r[taxField.id] = money(
          supported && values[p + "optWithheld"] !== "N"
            ? (number(values[baseField.id]) * rate) / 100
            : 0,
        );
        total += number(r[taxField.id]);
      }
      if (schedule.id === "atc") atcTotal = rounded(total);
      else r[p + "dtSched:TotaltaxWithheld"] = money(total);
    }
    if (schedule.id === "treaty") {
      for (const row of schedule.rows) {
        const [, , amount, rate, tax] = row.fields;
        r[tax.id] = money((readNumber(amount.id) * readNumber(rate.id)) / 100);
        treatyTotal += number(r[tax.id]);
      }
    }
    if (schedule.id === "adjustments") {
      for (const row of schedule.rows) {
        const taxPaid = row.fields[4],
          should = row.fields[5],
          out = row.fields[6];
        r[out.id] = money(
          number(values[should.id]) - number(values[taxPaid.id]),
        );
        adjustment += number(r[out.id]);
      }
    }
    if (schedule.id.startsWith("remittances-")) {
      let withheld = 0,
        penalties = 0,
        adjustments = 0,
        total = 0;
      for (const row of schedule.rows) {
        const tax = row.fields.find((f) => /TaxWheld|TaxWithheld/.test(f.id))!;
        const pen = row.fields.find((f) => /Pen\d|Penalties\d/.test(f.id))!;
        const adj = row.fields.find((f) => /Adj\d/.test(f.id));
        const out = row.fields.at(-1)!;
        const amount = rounded(
          number(values[tax.id]) +
            number(values[pen.id]) +
            (adj ? number(values[adj.id]) : 0),
        );
        r[out.id] = money(amount);
        withheld += number(values[tax.id]);
        penalties += number(values[pen.id]);
        adjustments += adj ? number(values[adj.id]) : 0;
        // Original compensation schedule excludes negative remittance rows from the total.
        total += adj ? Math.max(0, amount) : amount;
      }
      // Match original aggregate IDs, since compensation adds an adjustment column.
      for (const field of schedule.totals!) {
        const amount = /AdjTotal$/.test(field.id)
          ? adjustments
          : /TaxWheldTotal$|TaxWithheldTtl$/.test(field.id)
            ? withheld
            : /PenTotal$|PenaltiesTtl$/.test(field.id)
              ? penalties
              : total;
        r[field.id] = money(amount);
      }
    }
  }
  switch (code) {
    case "0605":
      penalty("txtTax20A", "txtTax20B", "txtTax20C", "txtTax20D");
      add("txtTax21", "txtTax19", "txtTax20D");
      break;
    case "0619E":
      for (const item of inactiveMonthlyRemittanceAmounts(code, values)) set(item, 0);
      set("txtTax16", n("txtTax14") - n("txtTax15"));
      penalty("txtTax17A", "txtTax17B", "txtTax17C", "txtTax17D");
      add("txtTax18", "txtTax16", "txtTax17D");
      break;
    case "0619F":
      for (const item of inactiveMonthlyRemittanceAmounts(code, values)) set(item, 0);
      add("txtTax15", "txtTax13", "txtTax14");
      set("txtTax17", n("txtTax15") - n("txtTax16"));
      penalty("txtTax18A", "txtTax18B", "txtTax18C", "txtTax18D");
      add("txtTax19", "txtTax17", "txtTax18D");
      break;
    case "1600":
    case "1601E":
      set("txtTax14", atcTotal);
      if (code === "1601E") add("txtTax15C", "txtTax15A", "txtTax15B");
      set(
        "txtTax16",
        n("txtTax14") - n(code === "1601E" ? "txtTax15C" : "txtTax15"),
      );
      penalty("txtTax17A", "txtTax17B", "txtTax17C", "txtTax17D");
      add("txtTax18", "txtTax16", "txtTax17D");
      break;
    case "1600WP":
      set("txtTax12", atcTotal);
      set("txtTax14", atcTotal - n("txtTax13"));
      penalty("txtTax15A", "txtTax15B", "txtTax15C", "txtTax15D");
      add("txtTax16", "txtTax14", "txtTax15D");
      break;
    case "1600PTv2018":
    case "1600VTv2018": {
      set("txtPg1P2I18TotTaxWithheld", atcTotal);
      const payments = add(
        "txtPg1P2I21TotTaxPymntsMade",
        "txtPg1P2I19TaxRemittedInRtrn",
        "txtPg1P2I20OthrPymntsMade",
      );
      const due = set("txtPg1P2I22TaxStillDueOverremit", atcTotal - payments);
      const pen = penalty(
        "txtPg1P2I23Surcharge",
        "txtPg1P2I24Interest",
        "txtPg1P2I25Compromise",
        "txtPg1P2I26TotPenalties",
      );
      set(
        "txtPg1P2I27TotAmtStillDueOverremit",
        due < 0 && pen > 0 ? pen : due + pen,
      );
      break;
    }
    case "1601F":
      set("txtTax14", atcTotal);
      set("txtTax15", treatyTotal);
      add("txtTax16", "txtTax14", "txtTax15");
      set("txtTax18", n("txtTax16") - n("txtTax17"));
      penalty("txtTax19A", "txtTax19B", "txtTax19C", "txtTax19D");
      add("txtTax20", "txtTax18", "txtTax19D");
      break;
    case "1601FQ":
      set("txtTax20", atcTotal);
      set("txtTax21", treatyTotal);
      add("txtTax22", "txtTax20", "txtTax21");
      add("txtTax26", "txtTax23", "txtTax24", "txtTax25");
      set("txtTax27", n("txtTax22") - n("txtTax26"));
      penalty("txtTax28", "txtTax29", "txtTax30", "txtTax31");
      add("txtTax32", "txtTax27", "txtTax31");
      break;
    case "1601C":
      set(
        "txtTax17",
        n("txtTax15") - sum("txtTax16A", "txtTax16B", "txtTax16C"),
      );
      set("txtTax19", adjustment);
      add("txtTax20", "txtTax18", "txtTax19");
      add("txtTax22", "txtTax21A", "txtTax21B");
      set("txtTax23", n("txtTax20") - n("txtTax22"));
      penalty("txtTax24A", "txtTax24B", "txtTax24C", "txtTax24D");
      add("txtTax25", "txtTax23", "txtTax24D");
      break;
    case "1601Cv2018":
      add(
        "txtTax21",
        "txtTax15",
        "txtTax16",
        "txtTax17",
        "txtTax18",
        "txtTax19",
        "txtTax20",
      );
      set("txtTax22", n("txtTax14") - n("txtTax21"));
      set("txtTax24", n("txtTax22") - n("txtTax23"));
      set("txtTax26", adjustment);
      add("txtTax27", "txtTax25", "txtTax26");
      add("txtTax30", "txtTax28", "txtTax29");
      set("txtTax31", n("txtTax27") - n("txtTax30"));
      penalty("txtTax32", "txtTax33", "txtTax34", "txtTax35");
      add("txtTax36", "txtTax31", "txtTax35");
      break;
    case "1603":
    case "1603Qv2018": {
      let gross = 0,
        tax = 0;
      for (const row of d.schedules.find((s) => s.id === "fringe")!.rows) {
        const [amount, divisor, base, rate, out] = row.fields;
        const historicGeneral = code === "1603" && row.id === "fringe-360";
        // NIRC Section 33 prescribed these rates before TRAIN took effect in 2018.
        const year = n("txtYear");
        const pct = historicGeneral ? (year === 1998 ? 34 : year === 1999 ? 33 : 32) : number(rate.defaultValue);
        const div = historicGeneral ? 100 - pct : number(divisor.defaultValue);
        r[divisor.id] = String(div);
        r[rate.id] = String(pct);
        const benefit = readNumber(amount.id);
        r[base.id] = money((benefit / div) * 100);
        r[out.id] = money((number(r[base.id]) * pct) / 100);
        gross += benefit;
        tax += number(r[out.id]);
      }
      if (code === "1603") {
        set("txt18A", gross);
        set("txt18B", tax);
        set("txt20", tax - n("txt19"));
        penalty("txt21A", "txt21B", "txt21C", "txt21D");
        add("txt22", "txt20", "txt21D");
      } else {
        // Deliberate correction: original computeTotalSchedule passes row 2's ID as a literal.
        // This implementation sums independently computed rows, preserving the printed equation.
        set("txtTax14", tax);
        add("txtTax17", "txtTax15", "txtTax16");
        set("txtTax18", tax - n("txtTax17"));
        penalty("txtTax19", "txtTax20", "txtTax21", "txtTax22");
        add("txtTax23", "txtTax18", "txtTax22");
      }
      break;
    }
    case "1602": {
      let tax = 0;
      for (let i = 14; i <= 23; i++)
        tax += set(`txt${i}C`, n(`txt${i}A`) * 0.2);
      tax +=
        set("txt22F", n("txt22D") * 0.12) + set("txt22I", n("txt22G") * 0.05);
      for (const i of [24, 25])
        tax += set(`txt${i}D`, (n(`txt${i}A`) * n(`txt${i}B`) * n(`txt${i}C`)) / 100);
      set("txt26", tax);
      for (const i of [27, 28, 30, 31])
        set(`txt${i}D`, (n(`txt${i}B`) * n(`txt${i}C`)) / 100);
      add("txt29", "txt27D", "txt28D");
      add("txt32", "txt30D", "txt31D");
      add("txt33", "txt26", "txt29", "txt32");
      set("txt35", n("txt33") - n("txt34"));
      penalty("txt36A", "txt36B", "txt36C", "txt36D");
      add("txt37", "txt35", "txt36D");
      let regular = 0,
        foreign = 0,
        institutions = 0;
      for (let i = 1; i <= 10; i++) {
        add(`txtTotal${i}C`, `txtReg${i}`, `txtForeign${i}`);
        regular += n(`txtReg${i}`);
        foreign += n(`txtForeign${i}`);
        institutions += n(`txtInst${i}`);
      }
      set("txtTotalA", regular);
      set("txtTotalB", foreign);
      set("txtTotalC", regular + foreign);
      set("txtTotalD", institutions);
      break;
    }
    case "1602Qv2018": {
      let tax = 0;
      const decedentWithdrawalInactive = is1602QDecedentWithdrawalInactive(values);
      for (let i = 1; i <= 15; i++) {
        if (i === 15 && decedentWithdrawalInactive) {
          r[p + "txtSched1TaxRate15"] = "";
          set("txtSched1Tax15", 0);
          continue;
        }
        const foreign = i === 13 || i === 14;
        const rate = foreign
          ? n("txtYear") > 2025 ||
            (n("txtYear") === 2025 &&
              ["Q3", "Q4"].includes(values[p + "optQuarter"]))
            ? 20
            : 15
          : i === 10
            ? 12
            : i === 11
              ? 5
              : i === 15
                ? 6
                : 20;
        r[p + `txtSched1TaxRate${i}`] = String(rate);
        tax += set(
          `txtSched1Tax${i}`,
          ((n(`txtSched1Amount${i}`) * rate) / 100) *
            (foreign ? n(`txtSched1Rate${i}`) : 1),
        );
      }
      set("txtSched1Total", tax);
      set("txt14", tax);
      let treaty = 0,
        preferred = 0;
      for (const i of [1, 2]) {
        treaty += set(
          `txtSched2TaxesWithheld${i}`,
          (n(`txtSched2Interest${i}`) * n(`txtSched2TaxRate${i}`)) / 100,
        );
        preferred += set(
          `txtSched3TaxWithheld${i}`,
          (n(`txtSched3TotInterest${i}`) * n(`txtSched3TaxRate${i}`)) / 100,
        );
      }
      set("txtSched2Total", treaty);
      set("txt15", treaty);
      set("txtSched3Total", preferred);
      set("txt16", preferred);
      add("txt17", "txt14", "txt15", "txt16");
      add("txt22", "txt18", "txt19", "txt20", "txt21");
      set("txt23", n("txt17") - n("txt22"));
      penalty("txt24", "txt25", "txt26", "txt27");
      add("txt28", "txt23", "txt27");
      break;
    }
    case "1606": {
      const fmv = set(
        "txtFMVLI",
        Math.max(
          n("txtFMVLand") + n("txtFMVImprovements"),
          n("txtFMVZonal") + n("txtFMVBIR"),
        ),
      );
      const type = values[p + "transactionType"];
      if (type === "Installment sale") {
        const selling = r[p + "txtSelling"];
        const gross = r[p + "txtGross"];
        if (hasInstallmentPrice(gross) && !hasInstallmentPrice(selling)) r[p + "txtSelling"] = gross;
        if (hasInstallmentPrice(selling) && !hasInstallmentPrice(gross)) r[p + "txtGross"] = selling;
      }
      let base = Math.max(n("txtGross"), fmv);
      if (type === "Foreclosure sale") base = Math.max(n("txtBid"), fmv);
      else if (type === "Installment sale") base = n("txtInstallment");
      else if (type === "Exempt" || type === "Others") base = n("txtOthers28E");
      set("txtTax", base);
      set("txtTaxR", type === "Exempt" ? 0 : (base * n("txtTaxRate")) / 100);
      set("txtTaxDue", n("txtTaxR") - n("txtLess"));
      penalty(
        "txtSurcharge",
        "txtInterest",
        "txtCompromise",
        "txtTotalPenalties",
      );
      add("txtTotal", "txtTaxDue", "txtTotalPenalties");
      break;
    }
  }
  return r;
}

/** Accept contiguous digits or the printed three-digit TIN groups and a branch. */
function parseTin(value: string): RegExpMatchArray | null {
  const tin = value.match(/^(\d{9}|\d{3}[- ]\d{3}[- ]\d{3})(?:[- ]?(\d{3,5}))?$/);
  return tin && /[1-9]/.test(tin[1]) ? tin : null;
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}
export function withholdingReturnPeriod(code: string, values: Values): string {
  const d = definition(code),
    year = (values[d.yearField] ?? "").trim();
  if (d.period === "date")
    return (values[d.dateField!] ?? "").replaceAll("-", "");
  if (d.period === "month")
    return year + (values[d.monthField!] ?? "").padStart(2, "0");
  if (d.period === "quarter") return year + (values[d.quarterField!] ?? "");
  return year;
}
export function validateWithholding(
  code: string,
  draftValues: Values,
  now = new Date(),
): Values {
  const { year: currentYear, month: currentMonth, day } = philippineCalendarDate(now);
  const today = `${currentYear}-${twoDigits(currentMonth)}-${twoDigits(day)}`;
  const d = definition(code),
    p = d.prefix,
    errors: Values = {};
  const values = withoutInactiveWithholdingScheduleValues(
    d,
    code === "0605" ? paymentYearValues(p, draftValues) : draftValues,
  );
  const fields = withholdingFields(d, values);
  const text = (k: string) => (values[p + k] ?? "").trim();
  const inactiveMonthlyAmounts = inactiveMonthlyRemittanceAmounts(code, values);
  const inactiveMonthlyIds = new Set(inactiveMonthlyAmounts.map(item => p + item));
  const installmentPrice = code === "1606" && text("transactionType") === "Installment sale"
    ? (hasInstallmentPrice(text("txtGross")) ? text("txtGross") : text("txtSelling") || text("txtGross"))
    : undefined;
  for (const f of fields) {
    if (f.readonly || inactiveMonthlyIds.has(f.id) || !activeField(f, values)) continue;
    const v = f.id === "frm1606:txtGross" && installmentPrice !== undefined
      ? installmentPrice
      : (values[f.id] ?? "").trim();
    if (f.required && !v) {
      errors[f.id] = `${f.label} is required.`;
      continue;
    }
    if (v && (f.type === "money" || f.type === "number")) {
      const normalized = v.replaceAll(",", "");
      const numericPattern =
        f.type === "money"
          ? /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/
          : /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/;
      if (!numericPattern.test(v) || !Number.isFinite(Number(normalized)))
        errors[f.id] =
          f.type === "money"
            ? "Enter a valid amount with up to two decimal places."
            : "Enter a valid number.";
      else if (number(v) < 0 && !f.allowNegative)
        errors[f.id] = "Enter zero or a positive amount.";
      else if (f.label.includes("(%)") && number(v) > 100)
        errors[f.id] = "Enter a percentage from 0 to 100.";
    }
    if (
      v &&
      f.type === "select" &&
      f.options &&
      !f.options.some((o) => o.value === v)
    )
      errors[f.id] = "Choose an option from the list.";
    if (v && f.type === "date" && !validDate(v))
      errors[f.id] = "Enter a valid calendar date.";
    if (f.profileKey && v) {
      if (["tin1", "tin2", "tin3"].includes(f.profileKey) && !/^\d{3}$/.test(v))
        errors[f.id] = "Enter exactly three TIN digits.";
      if (f.profileKey === "branchCode" && !/^\d{3,5}$/.test(v))
        errors[f.id] = "Enter a 3–5 digit branch code.";
      if (f.profileKey === "rdoCode" && !isPackagedRdoCode(v))
        errors[f.id] = "Enter a supported RDO code.";
      if (f.profileKey === "zipCode" && !/^\d{4}$/.test(v))
        errors[f.id] = "Enter a four-digit ZIP code.";
      if (f.profileKey === "email") {
        const emailError = taxpayerEmailError(v);
        if (emailError) errors[f.id] = emailError;
      }
    }
  }
  if (text("txtSheets") && !/^\d+$/.test(text("txtSheets").replaceAll(",", "")))
    errors[p + "txtSheets"] = "Enter a nonnegative whole number of sheets.";
  if (d.period !== "date") {
    const year = Number(values[d.yearField]);
    const maximum = d.maxYear ?? currentYear;
    if (
      !/^\d{4}$/.test(values[d.yearField] ?? "") ||
      year < (d.minYear ?? 1900) ||
      year > maximum
    )
      errors[d.yearField] =
        `Enter a year from ${d.minYear ?? 1900} to ${maximum}.`;
    if (d.period === "month") {
      const month = Number(values[d.monthField!]);
      if (!Number.isInteger(month) || month < 1 || month > 12)
        errors[d.monthField!] = "Choose a valid month.";
      if (
        year === currentYear &&
        (code.startsWith("0619")
          ? month >= currentMonth
          : month > currentMonth)
      )
        errors[d.monthField!] = "Choose a completed reporting month.";
    }
    if (d.period === "quarter") {
      const q = Number((values[d.quarterField!] ?? "").replace("Q", ""));
      if (!Number.isInteger(q) || q < 1 || q > 4)
        errors[d.quarterField!] = "Choose a quarter.";
      else if (
        code === "1601FQ" &&
        year === currentYear &&
        currentMonth - 1 < [2, 6, 9, 12][q - 1]
      )
        errors[d.quarterField!] =
          "This quarter is not yet selectable for the reporting year.";
    }
  }
  if (d.period === "date" && validDate(values[d.dateField!] ?? "")) {
    const year = Number(values[d.dateField!].slice(0, 4));
    if (
      year < (d.minYear ?? 1900) ||
      values[d.dateField!] > today
    )
      errors[d.dateField!] = "Enter a valid date no later than today.";
  }
  for (const s of d.schedules)
    if (s.repeatable && number(values[withholdingRowCountKey(d, s.id)]) > 1000)
      errors[withholdingRowCountKey(d, s.id)] =
        "This return supports up to 1,000 rows per schedule.";
  const atcs = getWithholdingAtcs(code, text("optCategory"), {
    year: Number(values[d.yearField]),
    month: d.monthField ? Number(values[d.monthField]) : undefined,
  });
  const requiresMainAtc = d.schedules.some((s) => s.id === "payees");
  let activeTaxRows = 0;
  let validMainAtc = false;
  for (const schedule of withholdingSchedules(d, values)) {
    for (const row of schedule.rows) {
      const editable = row.fields.filter((f) => !f.readonly);
      const populated = editable.some((f) => {
        const v = (values[f.id] ?? "").trim();
        return (
          v !== "" &&
          (!(f.type === "money" || f.type === "number") || number(v) !== 0)
        );
      });
      if (!populated) continue;
      if (!["interest-books"].includes(schedule.id)) activeTaxRows++;
      if (schedule.id === "atc" || schedule.id === "payees") {
        const atcField = row.fields[schedule.id === "atc" ? 0 : 2];
        const baseField = row.fields[schedule.id === "atc" ? 1 : 3];
        const selectedAtc = (values[atcField.id] ?? "").trim();
        if (selectedAtc === "N/A" && ["1600", "1601E"].includes(code)) {
          const rateField = row.fields[schedule.id === "atc" ? 2 : 4];
          if (
            !(values[rateField.id] ?? "").trim() ||
            number(values[rateField.id]) < 0 ||
            number(values[rateField.id]) > 100
          )
            errors[rateField.id] =
              "Enter a special-law rate from 0 to 100 percent.";
        }
        if (
          !atcs.some((a) => a.code === selectedAtc) ||
          (selectedAtc === "N/A" && text("optRelief") !== "Y")
        )
          errors[atcField.id] =
            "Choose a supported ATC for this form and withholding-agent category.";
        if (number(values[baseField.id]) <= 0)
          errors[baseField.id] = "Enter a tax base greater than zero.";
        if (schedule.id === "atc" && editable.every((f) => !errors[f.id]))
          validMainAtc = true;
        if (schedule.id === "payees") {
          const [tinField, nameField] = editable;
          const tin = (values[tinField.id] ?? "").trim();
          if (!tin)
            errors[tinField.id] = "Payee TIN is required for this payee.";
          else if (!parseTin(tin))
            errors[tinField.id] = "Enter a valid nine-digit payee TIN with an optional 3–5 digit branch code.";
          if (!(values[nameField.id] ?? "").trim())
            errors[nameField.id] = "Payee name is required for this payee.";
        }
      }
      if (schedule.id.startsWith("remittances-")) {
        for (const f of editable) {
          if (!isRequiredRemittanceField(code, schedule.id, f)) continue;
          if (f.type === "money") {
            if (number(values[f.id]) <= 0)
              errors[f.id] = "Enter tax withheld greater than zero.";
          } else if (!(values[f.id] ?? "").trim()) {
            errors[f.id] = `${f.label} is required for this remittance.`;
          }
        }
      }
      if (
        [
          "adjustments",
          "treaty",
          "interest-treaty",
          "interest-preferential",
        ].includes(schedule.id)
      ) {
        for (const f of editable) {
          const value = (values[f.id] ?? "").trim();
          if (!value) {
            errors[f.id] = `${f.label} is required for this row.`;
          } else if (schedule.id === "adjustments" &&
            /:sched1:txtMonthYear\d+$/.test(f.id) &&
            !/^(?:0?[1-9]|1[0-2])\/(?!0000)\d{4}$/.test(value)) {
            errors[f.id] = "Enter a valid month and year (MM/YYYY).";
          }
        }
        if (schedule.id !== "adjustments" && text("optRelief") !== "Y")
          errors[p + "optRelief"] =
            "Select tax relief before entering treaty or preferential-rate details.";
      }
      if (schedule.id === "interest")
        for (const f of editable)
          if (f.label.includes("exchange") || f.label.includes("Conversion"))
            if (number(values[f.id]) <= 0)
              errors[f.id] = "Enter a positive exchange rate.";
    }
  }
  if (
    text("optWithheld") === "Y" &&
    d.schedules.some((s) => ["atc", "fringe", "interest"].includes(s.id)) &&
    (requiresMainAtc ? !validMainAtc : activeTaxRows === 0)
  )
    errors[p + "optWithheld"] =
      requiresMainAtc
        ? "Enter at least one valid row in the withholding computation schedule."
        : "Enter at least one withholding computation row.";
  if (
    text("optWithheld") === "N" &&
    activeTaxRows > 0 &&
    !code.startsWith("1604")
  )
    errors[p + "optWithheld"] =
      "Tax details are present. Select Yes or clear those amounts.";
  if (
    text("optWithheld") === "Y" &&
    ["0619E", "0619F", "1601C", "1601Cv2018"].includes(code)
  ) {
    const key =
      code === "0619E"
        ? "txtTax14"
        : code === "0619F"
          ? text("txtTaxTypeCode") === "WF" ? "txtTax14" : "txtTax13"
          : code === "1601C"
            ? "txtTax18"
            : "txtTax25";
    const amount =
      number(values[p + key]) +
      (code === "0619F" && inactiveMonthlyAmounts.length === 0 ? number(values[p + "txtTax14"]) : 0);
    if (amount <= 0) errors[p + key] = "Enter withholding greater than zero.";
  }
  if (code === "0605") {
    if (text("txtATCCode") && !getWithholdingAtcs(code).some(atc => atc.code === text("txtATCCode")))
      errors[p + "txtATCCode"] = "Choose a supported Form 0605 ATC.";
    if (text("txtTaxTypeCode") && !taxTypeOptions.some(taxType => taxType.value === text("txtTaxTypeCode")))
      errors[p + "txtTaxTypeCode"] = "Choose a supported tax type.";
    if (text("txtNoOfSheets") && !/^\d{1,2}$/.test(text("txtNoOfSheets")))
      errors[p + "txtNoOfSheets"] = "Enter a number of sheets from 0 to 99.";
    if (
      [
        "Preliminary/final assessment / deficiency",
        "Accounts receivable / delinquent account",
      ].includes(text("itemMannerOfPayment")) &&
      !["Y", "N"].includes(text("itemApprovedYN"))
    )
      errors[p + "itemApprovedYN"] =
        "Choose whether the investigating office approved this payment.";
    if (number(values[p + "txtTax19"]) <= 0)
      errors[p + "txtTax19"] = "Enter basic tax greater than zero.";
    if (
      text("itemModeOfPayment") === "Installment" &&
      (!/^\d+$/.test(text("txtNumOfInstallment")) ||
        number(values[p + "txtNumOfInstallment"]) < 1 ||
        number(values[p + "txtNumOfInstallment"]) > 20)
    )
      errors[p + "txtNumOfInstallment"] =
        "Enter an installment number from 1 to 20.";
    const year = Number(text("txtYearEnded"));
    if (!/^\d{4}$/.test(text("txtYearEnded")) || year < 1904 || year > 3000)
      errors[d.yearField] = "Enter a year from 1904 to 3000.";
    if (
      validDate(text("date")) &&
      text("date").slice(0, 7) >
        `${text("txtYearEnded")}-${text("itemYearEndMonth")}`
    )
      errors[p + "date"] = "Return period cannot be after the year ended.";
  }
  if (
    (code === "1604C" || code === "1604CF") &&
    text("releasedOfFunds") === "Y" &&
    validDate(text("refundDate")) &&
    text("refundDate") > today
  )
    errors[p + "refundDate"] = "Enter a refund date no later than today.";
  if (code === "1606") {
    if (hasConflictingInstallmentPrices(values))
      errors[p + "txtGross"] ??= "Reconcile the saved selling price in Item 21 with the gross selling price in Item 28A.";
    const sellerTin = text("sellerTin");
    const seller = parseTin(sellerTin);
    const buyerTin = text("txtTIN1") + text("txtTIN2") + text("txtTIN3");
    const buyerBranch = text("txtBranchCode");
    if (
      seller &&
      seller[1].replace(/[- ]/g, "") === buyerTin &&
      (seller[2] ?? "").padStart(5, "0") === buyerBranch.padStart(5, "0")
    )
      errors[p + "sellerTin"] = "Buyer and seller TINs must differ.";
    else if (sellerTin && !seller?.[2])
      errors[p + "sellerTin"] = "Enter a valid nine-digit seller TIN and 3–5 digit branch code.";
    for (const rdo of ["sellerRdo", "propertyRdo"])
      if (text(rdo) && !isPackagedRdoCode(text(rdo)))
        errors[p + rdo] = "Enter a supported RDO code.";
  }
  if (code === "1602Qv2018") {
    const atcCodes = [
      "WI161",
      "WC161",
      "WI162",
      "WC162",
      "WI163",
      "WC163",
      "WI440",
      "WI441",
      "WI442",
      "WC440",
      "WI170",
      "WC170",
      "WI165",
    ];
    const treaties =
      "AU AT BH BD BE BR CA CN CZ DK FI FR DE HU IN ID IL IT JP KR KW MY NL KZ NG NO PK PL RO RU SG ES SE CH TH UAE GB US VN".split(
        " ",
      );
    for (const i of [1, 2]) {
      const agencies =
        "APECO AFAB BCDA FOI CEZA CDC JHMC PEZA PPMC RBOI-ARMM SBMA TIEZA ZCSEZA".split(
          " ",
        );
      if (
        text(`txtSched3IPA${i}`) &&
        !agencies.includes(text(`txtSched3IPA${i}`).toUpperCase())
      )
        errors[p + `txtSched3IPA${i}`] =
          "Enter an IPA code listed in Schedule 6.";
      if (
        text(`txtSched2ATC${i}`) &&
        !atcCodes.includes(text(`txtSched2ATC${i}`).toUpperCase())
      )
        errors[p + `txtSched2ATC${i}`] = "Enter an ATC listed in Schedule 1.";
      if (
        text(`txtSched2TreatyCode${i}`) &&
        !treaties.includes(text(`txtSched2TreatyCode${i}`).toUpperCase())
      )
        errors[p + `txtSched2TreatyCode${i}`] =
          "Enter a treaty code listed in Schedule 5.";
    }
  }
  const computed = calculateWithholding(code, values);
  if (code === "1603Qv2018" && text("optWithheld") === "Y" && number(computed[p + "txtTax14"]) <= 0)
    errors[p + "optWithheld"] = "Enter fringe benefits that produce positive withholding in Schedule 1.";
  if (code === "1606" && text("optWithheld") === "Y" && number(computed[p + "txtTax"]) <= 0) {
    const baseFields: Record<string, string> = {
      "Cash sale": "txtGross",
      "Foreclosure sale": "txtBid",
      "Installment sale": "txtInstallment",
      Others: "txtOthers28E",
    };
    const baseField = baseFields[text("transactionType")];
    if (baseField && !errors[p + baseField])
      errors[p + baseField] = "Enter an applicable taxable base greater than zero.";
  }
  const enteredWithholding: Record<string, string[]> = {
    "1601C": ["txtTax18"],
    "1601Cv2018": ["txtTax25"],
    "1606": ["txtTaxR"],
  };
  if (
    text("optWithheld") === "N" &&
    (enteredWithholding[code] ?? []).some(
      (key) => number(computed[p + key]) !== 0,
    )
  ) {
    errors[p + "optWithheld"] =
      "Tax withheld is entered. Select Yes or clear the withholding amount.";
  }

  if (
    ["1606", "1602Qv2018"].includes(code) &&
    number(computed[d.totalField]) < 0 &&
    !text("overpaymentOption")
  )
    errors[p + "overpaymentOption"] = "Choose how to apply the overremittance.";
  return errors;
}
