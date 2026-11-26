import {
  legacyMixedAtc,
  legacyMixedOtherAtc,
  legacyMixedOtherAtcElected,
  legacyMixedRateOptions,
  legacyMixedSpecialRate,
} from "./atc";
import { philippineCalendarDate } from '../../filing-calendar';
import { validateLegacyExemptIdentification } from '../exempt/identification';
import { legacyMixedIdentificationFields } from './identification';
import { revisedNolcoField } from "./nolco";
import { refineMixedPages } from "./layout";
import type { CorporateForm, CorporatePage, CorporateValues } from "../types";
import {
  calculateMixed,
  legacyMixedForcedRate,
  mixedLegalBasis,
  mixedNumber,
  mixedSourceData,
  type MixedCode,
} from "./calculation";
import {
  mixedRepeatablePages,
  mixedAttachmentRepeatablePages,
  expandMixedAttachmentDetails,
  expandMixedDetails,
  mixedDetailContinuations,
  validateMixedDetails,
} from "./repeatables";
import { mixedHasActivities, mixedActivityCount, mixedActivityRollupField } from "./attachments";
export { calculateMixed } from "./calculation";

const p = "frm1702MX:";
const fieldLabels: Record<string, string> = {
  rdoPg1I1: "1 Accounting period",
  ddlPg1I2Date: "2 Year-end month",
  txtPg1I2YearEnd: "2 Year ended",
  rdoPg1I3Amended: "3 Amended return?",
  rdoPg1I4ShortPeriod: "4 Short period return?",
  chkPg1I5ATCR1: "5 Subject to minimum corporate income tax (IC 055)?",
  drpPg1I5ATCR2: "5 Alphanumeric tax code (ATC)",
  chkPg1I5ATCR2: "5 Other alphanumeric tax code?",
  txtPg1Pt1I6TINC1: "TIN, first three digits",
  txtPg1Pt1I6TINC2: "TIN, second three digits",
  txtPg1Pt1I6TINC3: "TIN, third three digits",
  txtPg1Pt1I6TINC4: "Branch code",
  txtPg1Pt1I7RDO: "7 RDO code",
  txtPg1Pt1I8: "8 Date of incorporation (MM/DD/YYYY)",
  txtPg1Pt1I9RegisteredName: "9 Registered name",
  txtPg1Pt1I9RegisteredName2: "Registered name, line 2",
  txtPg1Pt1I9RegisteredName3: "Registered name, line 3",
  txtPg1Pt1I10RegisteredAddress: "10 Registered address",
  txtPg1Pt1I10RegisteredAddress2: "Registered address, line 2",
  txtPg1Pt1I10RegisteredAddress3: "Registered address, line 3",
  txtZIP: "9A ZIP code",
  txtPg1Pt1I11ContactNumber: "11 Contact number",
  txtPg1Pt1I12Email: "12 Email address",
  rdoPg1Pt1I13MethodOfDeduc: "13 Method of deduction",
  txtPg1Pt1I13MainLine: "13 Main line of business",
  txtPg1Pt1I14PSICCode: "14 PSIC code",
  rdoPg1Pt1I15MethodofDeduction: "15 Method of deduction",
  rdoPg1Pt2I21Overpayment: "Overpayment election",
  rdoPg1AttMTaxRegime: "Tax regime for this activity",
  rdoPg2I1: "Activities under exempt or special tax regimes",
  chkPg2Pt4I30MoreThanOne: "30 More than one activity or project?",
};
const columns = {
  A: "Exempt",
  B: "Special rate",
  C: "Regular rate",
  D: "Total",
};

function pagesFor(code: MixedCode): CorporatePage[] {
  const pages = structuredClone(mixedSourceData[code].pages) as CorporatePage[];
  const labels: Record<string, string> = code === "1702MX" ? fieldLabels : {
    ...fieldLabels,
    txtPg1Pt1I8: "10 Date of incorporation (MM/DD/YYYY)",
    txtPg1Pt1I9RegisteredName: "8 Registered name",
    txtPg1Pt1I10RegisteredAddress: "9 Registered address",
  };
  const pageTitles =
    code === "1702MX"
      ? [
          "Return summary",
          "Tax relief and tax payable",
          "Income tax computation",
          "Sales and costs",
          "Other income and deductions",
          "Deductions and losses",
          "Credits and reconciliation",
          "Ownership and capital",
          "Supplemental information",
        ]
      : [
          "Return summary",
          "Tax computation",
          "Tax relief and deductions",
          "Losses and reconciliation",
        ];
  pages.forEach((page, index) => {
    if (!page.title.startsWith("Mandatory attachment"))
      page.title = pageTitles[index];
  });
  const amount =
    code === "1702MX" ? "txtPg1Pt2I20TotalAmount" : "txtPg1Pt2I21TotalAmount";
  for (const page of pages) {
    for (const section of page.sections) {
      const reliefBasis = /(?:Schedule 1 - Basis|Part IV - Basis)/.test(
        section.title,
      );
      if (reliefBasis)
        section.columns = [
          "Exempt",
          "Special rate",
          "Special tax relief under regular rate",
        ];
      if (
        !reliefBasis &&
        section.rows.some(
          (row) =>
            row.fields.filter((field) => field.kind === "money").length === 4,
        )
      )
        section.columns = ["Exempt", "Special rate", "Regular rate", "Total"];
      for (const row of section.rows) {
        const first = row.fields[0].id.slice(p.length);
        if (labels[first]) row.label = labels[first];
        if (/^txtPg\d+(?:AttM)?TIN1$/.test(first))
          row.label = "Taxpayer identification";
        if (row.label === first) row.label = section.title;
        const numbered = row.label.match(/^(\d+[A-Za-z]?)\s+(.+)$/);
        if (numbered) {
          row.item = numbered[1];
          row.label = numbered[2];
        }
        for (const field of row.fields) {
          const name = field.id.slice(p.length);
          field.label = labels[name] ?? field.label;
          if (name === "rdoPg2I1")
            field.options = [
              { value: "C", label: "One activity or project" },
              { value: "F", label: "Two or more activities or projects" },
            ];
          if (reliefBasis) {
            const column = name.match(/C([ABC])$/)?.[1];
            if (column) {
              field.column = ["A", "B", "C"].indexOf(column) + 1;
              field.label = `${row.label} · ${section.columns![field.column - 1]}`;
            }
            if (/txtPg2Pt4I3[56]C[ABC]$/.test(name)) field.kind = "date";
            if (name === "txtPg2Pt4I34SpecialTaxRate") {
              field.kind = "percent";
              field.column = 2;
              field.label = "Special tax rate";
            }
          }
          if (field.kind === "money" || field.kind === "percent") {
            const column = name.match(/(?:C)?([ABCD])$/)?.[1] as
              keyof typeof columns | undefined;
            if (column && row.fields.length >= 3) field.label = columns[column];
            if (column && section.columns?.length === 4)
              field.column = ["A", "B", "C", "D"].indexOf(column) + 1;
          }
          if (name === "txtPg1I2YearEnd") {
            field.maxLength = 4;
            field.kind = "integer";
          }
          if (name === "ddlPg1I2Date") field.defaultValue = "12";
          if (name === "txtPg2Sc2It14C" && code === "1702MXv2018")
            field.defaultValue = "30";
          if (
            name === amount ||
            /^txtPg1Pt2I(?:14TotalIncome|15LessTotalTax|16NetTaxPayable|20TotalPenalties)$/.test(
              name,
            )
          )
            field.readonly = true;
          if (
            code !== "1702MX" &&
            /^txtPg2Sc2(?:Itm[35789]|It1[123579])[ABCD]$/.test(name)
          )
            field.readonly = true;
          if (name === "txtPg2Sc2It18C")
            field.readonly = code === "1702MXv2018";
          if (name.startsWith("chk")) {
            field.kind = "checkbox";
            field.options = undefined;
          }
          if (field.profileKey) {
            field.readonly = true;
            field.label =
              {
                tin1: "TIN, first three digits",
                tin2: "TIN, second three digits",
                tin3: "TIN, third three digits",
                branchCode: "Branch code",
                taxpayerName: "Registered name",
              }[
                field.profileKey as
                  "tin1" | "tin2" | "tin3" | "branchCode" | "taxpayerName"
              ] ?? field.label;
          }
          if (/^txtAttMCtr/.test(name)) continue;
          if (/AttMScAI[123]$/.test(name) || /AttMScHI\d+C[12]$/.test(name)) {
            field.kind = "text";
            field.readonly = false;
          }
          const specialDeductionField = /AttMScHI1C([123])$/.exec(name)?.[1];
          if (specialDeductionField) {
            field.label = ["Description", "Legal basis", "Amount"][Number(specialDeductionField) - 1];
            row.item ??= "1";
          }
          if (/AttMSc[AB]I(?:4|11|13)$/.test(name) && /Rate/i.test(row.label)) {
            field.kind = "percent";
            field.readonly = false;
          }
          if (/AttMSc.*(?:year|month)$/i.test(name)) {
            field.kind = "integer";
            field.readonly = false;
          }
          if (code !== "1702MX" && /AttMSc(?:FI[12]|F1I7year)$/.test(name))
            field.readonly = true;
          if (name === "rdoPg1AttMTaxRegime") field.readonly = true;
          if (/^txtPg3IShed[78]_[4-7][ABCDE]$/.test(name)) {
            field.kind = "money";
            field.readonly = name.endsWith("E");
            field.label = {
              A: "Net operating loss",
              B: "Applied in previous years",
              C: "Expired",
              D: "Applied this year",
              E: "Balance",
            }[name.slice(-1) as "A" | "B" | "C" | "D" | "E"];
          }
          if (/^txtPg3IShed[78]_[4-7]Year$/.test(name)) {
            field.kind = "integer";
            field.maxLength = 4;
            field.label = "Year incurred";
          }
          if (!field.label || field.label === name) field.label = row.label;
          if (row.item && field.label?.startsWith(row.item + " "))
            field.label = field.label.slice(row.item.length + 1);
        }
      }
    }
  }
  const tinRow = pages[0].sections
    .flatMap((section) => section.rows)
    .find((row) =>
      row.fields.some((field) => field.id === p + "txtPg1Pt1I6TINC1"),
    );
  if (tinRow)
    tinRow.fields.push({
      id: p + "txtPg1Pt1I7RDO",
      label: "7 RDO code",
      kind: "text",
      profileKey: "rdoCode",
      readonly: true,
      required: true,
    });
  for (const page of pages) {
    if (page.title.startsWith("Mandatory attachment")) {
      const number = page.title.match(/\d+/)?.[0];
      const identity = page.sections
        .flatMap((section) => section.rows)
        .find((row) =>
          row.fields.some((field) => field.id === p + `txtPg${number}AttMTIN1`),
        );
      if (identity)
        identity.fields.push({
          id: p + `txtPg${number}AttMRegisteredName`,
          label: "Registered name",
          kind: "text",
          profileKey: "taxpayerName",
          readonly: true,
        });
    }
    if (code !== "1702MX") {
      const sections: CorporatePage["sections"] = [];
      for (const original of page.sections) {
        let current = { ...original, rows: [] as typeof original.rows };
        for (const row of original.rows) {
          const first = row.fields[0].id;
          const title =
            first === p + "txtPg3Sc5Itm1A"
              ? "Schedule 5 – Ordinary Allowable Itemized Deductions"
              : first === p + "txtPg6Sc6I1description"
                ? "Schedule 6 – Special Allowable Itemized Deductions"
                : undefined;
          if (title && current.rows.length) {
            sections.push(current);
            current = {
              title,
              columns: ["Exempt", "Special rate", "Regular rate", "Total"],
              rows: [],
            };
          }
          current.rows.push(row);
        }
        if (current.rows.length) sections.push(current);
      }
      page.sections = sections;
    }
    for (const section of page.sections) {
      section.rows = section.rows
        .map((row) => ({
          ...row,
          fields: row.fields.filter(
            (field) => !field.id.startsWith(p + "txtAttMCtr"),
          ),
        }))
        .filter((row) => row.fields.length);
    }
  }
  return refineMixedPages(code, pages);
}

export function validateMixed(
  code: string,
  values: CorporateValues,
): CorporateValues {
  const errors: CorporateValues = validateMixedDetails(code, values);
  if (code === '1702MX') {
    Object.assign(errors, validateLegacyExemptIdentification(values, philippineCalendarDate(), legacyMixedIdentificationFields));
    if (values[legacyMixedIdentificationFields.type] === 'CTC' && mixedNumber(values[legacyMixedIdentificationFields.amount]) <= 0) {
      errors[legacyMixedIdentificationFields.amount] = 'Enter a community tax certificate amount.';
    }
  }
  const n = (name: string) => mixedNumber(values[p + name]);
  const need = (name: string, message: string) => {
    if (!values[p + name]?.trim()) errors[p + name] = message;
  };
  need("rdoPg1I1", "Select calendar or fiscal year.");
  need("txtPg1I2YearEnd", "Enter the filing year.");
  need("ddlPg1I2Date", "Select the year-end month.");
  need("txtPg1Pt1I8", "Enter the date of incorporation.");
  const election = values[p + "chkPg1I5ATCR1"];
  if (code === "1702MX") {
    const otherElected = legacyMixedOtherAtcElected(values);
    if (!otherElected && !["Y", "IC055", "true", "1"].includes(election))
      errors[legacyMixedOtherAtc] = "Select at least one alphanumeric tax code.";
    if (otherElected)
      if (!values[legacyMixedAtc]) errors[legacyMixedAtc] = "Choose an alphanumeric tax code.";
    need("txtPg1Pt1I13MainLine", "Enter the main line of business.");
    if (!/^\d{4}$/.test(values[p + "txtPg1Pt1I14PSICCode"] ?? ""))
      errors[p + "txtPg1Pt1I14PSICCode"] = "Enter a four-digit PSIC code.";
  } else if (
    !["Y", "IC055", "true", "1"].includes(election) &&
    !values[p + "drpPg1I5ATCR2"]
  )
    errors[p + "drpPg1I5ATCR2"] = "Select at least one alphanumeric tax code.";
  if (code !== "1702MX") {
    need("rdoPg1Pt1I13MethodOfDeduc", "Select the method of deduction.");
    for (const column of ["A", "B", "C", "D"]) {
      if (n(`txtPg2Sc2It13${column}`) !== n(`txtPg2Sc2Itm10${column}`))
        errors[p + `txtPg2Sc2Itm10${column}`] =
          "Schedule 10 reconciliation must equal Schedule 2 net taxable income in this column.";
    }
    if (code === "1702MXv2018C") {
      for (const column of ["A", "B"]) {
        if (n(`txtPg2Sc2It13${column}`) > 0 && n(`txtPg3Sc4Itm1${column}`) <= 0)
          errors[p + `txtPg3Sc4Itm1${column}`] =
            "Enter the regular income tax otherwise due in Schedule 4 item 1.";
      }
      for (const column of ["A", "B", "C"]) {
        if (n(`txtPg2Sc2Itm9${column}`) > 0 && n(`txtPg2Sc4Itm2${column}`) <= 0)
          errors[p + `txtPg2Sc4Itm2${column}`] =
            "Enter tax relief on special allowable deductions in Schedule 4 item 2.";
      }
    }
  }
  if (mixedHasActivities(code, values)) {
    for (const group of ["EX", "SP"] as const) {
      for (
        let index = 1;
        index <= mixedActivityCount(values, group);
        index += 1
      ) {
        const activity = group + index;
        const stem = `txtPg1${activity}`;
        if (n(stem + (code === "1702MX" ? "ScBI5" : "ScBI57")) !== 0) {
          need(
            stem + "ScAI1",
            "Enter the investment promotion agency or implementing entity for this activity.",
          );
          need(stem + "ScAI2", "Enter the legal basis for this activity.");
          need(stem + "ScAI3", "Enter the registered activity or program.");
          if (group === "SP" && n(stem + "ScAI4") <= 0)
            errors[p + stem + "ScAI4"] =
              "Enter the special tax rate for this activity.";
          if (code === "1702MX") {
            for (const item of ["5", "6"]) {
              need(stem + `ScAI${item}month`, "Enter the relief month.");
              need(stem + `ScAI${item}year`, "Enter the relief year.");
            }
          } else {
            need(
              stem + "Pt5ScAIt5",
              "Enter the effectivity date of the tax relief.",
            );
            need(
              stem + "Pt5ScAIt6",
              "Enter the expiration date of the tax relief.",
            );
          }
        }
      }
    }
  }
  if (
    mixedHasActivities(code, values) &&
    mixedActivityCount(values, "EX") + mixedActivityCount(values, "SP") === 0
  )
    errors[p + "totalEXAttach"] =
      "Add at least one exempt or special-rate activity.";
  if (code !== "1702MX") {
    for (const schedule of ["7", "8"] as const) {
      const years = new Set<string>();
      for (const row of [4, 5, 6, 7]) {
        const amount = (column: string) =>
          revisedNolcoField(schedule, row, column);
        if (n(amount("B")) + n(amount("C")) + n(amount("D")) > n(amount("A")))
          errors[p + amount("D")] =
            "Applied and expired amounts together cannot exceed the available loss.";
        const year = values[p + amount("Year")];
        if (year && years.has(year))
          errors[p + amount("Year")] = "Year incurred cannot have duplicates.";
        if (year) years.add(year);
      }
    }
    const descriptionPairs = [
      ...["d", "e", "f", "g", "h", "i"].map((letter) => ({
        descriptions: [`txtPg3Sc5It17${letter}`],
        amounts: ["A", "B", "C"].map(
          (column) => `txtPg3Sc5Itm17${letter}${column}`,
        ),
      })),
      ...[30, 31].map((row) => ({
        descriptions: [`txtPg2Sc3It${row}`],
        amounts: ["A", "B", "C"].map((column) => `txtPg2Sc3It${row}${column}`),
      })),
      ...[1, 2, 3, 4].map((row) => ({
        descriptions: [`txtPg6Sc6I${row}description`, `txtPg6Sc6I${row}legal`],
        amounts: ["A", "B", "C"].map((column) => `txtPg6Sc6I${row}C${column}`),
      })),
    ];
    for (const pair of descriptionPairs) {
      const hasAmount = pair.amounts.some((id) => n(id) !== 0);
      const descriptions = pair.descriptions.map((id) =>
        Boolean(values[p + id]?.trim()),
      );
      if (
        (hasAmount && descriptions.some((filled) => !filled)) ||
        (!hasAmount && descriptions.some(Boolean))
      )
        errors[p + pair.descriptions[0]] =
          "Provide the description, legal basis where applicable, and a nonzero amount together.";
    }
  }
  for (const row of [1, 2, 3]) {
    const stem = `txtPg7Sc9I${row}`;
    if (
      n(stem + "CD") + n(stem + "CE") + n(stem + "CF") >
      Math.max(0, n(stem + "CB") - n(stem + "CA"))
    )
      errors[p + stem + "CF"] =
        "Applied and expired amounts together cannot exceed the excess MCIT.";
  }
  const net = n(
    code === "1702MX" ? "txtPg1Pt2I20TotalAmount" : "txtPg1Pt2I16NetTaxPayable",
  );
  if (net < 0)
    need("rdoPg1Pt2I21Overpayment", "Select how to apply the overpayment.");
  return errors;
}

const editorPages = Object.fromEntries(
  (Object.keys(mixedSourceData) as MixedCode[]).map((code) => [
    code,
    mixedRepeatablePages(
      code,
      pagesFor(code).filter(
        (page) => !page.title.startsWith("Mandatory attachment"),
      ),
    ),
  ]),
) as Record<MixedCode, CorporatePage[]>;

export const mixedForms: CorporateForm[] = (
  Object.keys(mixedSourceData) as MixedCode[]
).map((code) => ({
  code,
  title:
    "Annual income tax return for corporations with mixed income tax regimes",
  revision:
    code === "1702MX"
      ? "June 2013"
      : code === "1702MXv2018"
        ? "January 2018"
        : "January 2018 · CREATE",
  year: p + "txtPg1I2YearEnd",
  month: p + "ddlPg1I2Date",
  periodType: p + "rdoPg1I1",
  shortPeriod: p + "rdoPg1I4ShortPeriod",
  amount:
    p +
    (code === "1702MX" ? "txtPg1Pt2I20TotalAmount" : "txtPg1Pt2I21TotalAmount"),
  decimals: 0,
  pages: editorPages[code],
  pagesFiledField: code === "1702MX" ? p + "txtPg1Pt2NumberofPagesFiled" : undefined,
  expandPages: (values) => {
    const pages = expandMixedDetails(code, editorPages[code], values);
    if (code === "1702MX") {
      const rate = pages[2].sections.flatMap(section => section.rows)
        .flatMap(row => row.fields).find(field => field.id === legacyMixedSpecialRate);
      if (rate) rate.options = legacyMixedRateOptions(values);
    }
    return pages;
  },
  continuations: (values) => mixedDetailContinuations(code, values),
  attachmentGroups: (["EX", "SP"] as const).map((key) => ({
    key,
    label: key === "EX" ? "Exempt activity" : "Special-rate activity",
    countField: p + `total${key}Attach`,
    templatePages: mixedAttachmentRepeatablePages(
      code,
      pagesFor(code).filter((page) =>
        page.title.startsWith("Mandatory attachment"),
      ),
    ).map((page) => ({
      ...page,
      sections: page.sections.map((section) => ({
        ...section,
        rows: section.rows.map((row) => ({
          ...row,
          fields: row.fields.map((field) =>
            key === "SP" && /ScCI[12]$/.test(field.id)
              ? { ...field, readonly: true }
              : field,
          ),
        })),
      })),
    })),
    expandPages: (pages, values, id) =>
      expandMixedAttachmentDetails(code, pages, values, id),
    applies: (values) => mixedHasActivities(code, values),
  })),
  calculate: (values) => calculateMixed(code, values),
  validate: (values) => validateMixed(code, values),
  fieldReadonly: (id, values) => {
    if (code === "1702MX" && id === legacyMixedSpecialRate)
      return legacyMixedForcedRate(values) !== undefined;
    if (mixedHasActivities(code, values)) return mixedActivityRollupField(code, id);
    return code === "1702MX" && id === p + "txtPg2Pt4I34SpecialTaxRate" &&
      ["RA10693", "10693"].includes(mixedLegalBasis(values)) && mixedNumber(values[id]) === 2;
  },
  fieldApplies: (id, values) => {
    if (id === p + "rdoPg1Pt2I21Overpayment")
      return (
        mixedNumber(
          values[
            p +
              (code === "1702MX"
                ? "txtPg1Pt2I20TotalAmount"
                : "txtPg1Pt2I16NetTaxPayable")
          ],
        ) < 0
      );
    if (code === "1702MX" && id === legacyMixedSpecialRate)
      return !mixedHasActivities(code, values) || mixedActivityCount(values, "SP") === 0;
    if (id.includes("AttM")) return false;
    if (id.includes("totalEXAttach") || id.includes("totalSPAttach"))
      return mixedHasActivities(code, values);
    return true;
  },
}));
