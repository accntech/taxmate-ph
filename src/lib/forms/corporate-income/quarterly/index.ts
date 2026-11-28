import type {
  CorporateField,
  CorporateForm,
  CorporateRow,
  CorporateSection,
  CorporateValues,
} from "../types";
import {
  calculateLegacyQuarterly,
  calculateRevisedQuarterly,
  quarterlyMcitRateIsFixed,
  quarterlyRegime,
  quarterlyRegularRate,
} from "./calculations";
import atcOptions from "./atc-options.json";
import legacyAtcOptions from "./legacy-atc-options.json";
import {
  quarterlyCreditCount,
  quarterlyCreditRowCount,
  quarterlyExtraCreditRows,
} from "./extra-credits";
const p = "frm1702q:";
const yesNo = [
  { value: "Y", label: "Yes" },
  { value: "N", label: "No" },
];
const calendarFiscal = [
  { value: "C", label: "Calendar" },
  { value: "F", label: "Fiscal" },
];
const quarters = [1, 2, 3].map((value) => ({
  value: String(value),
  label: ["First quarter", "Second quarter", "Third quarter"][value - 1],
}));
const months = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1).padStart(2, "0"),
  label: String(index + 1).padStart(2, "0"),
}));
const field = (
  name: string,
  kind: CorporateField["kind"] = "money",
  extra: Partial<CorporateField> = {},
): CorporateField => ({
  id:
    name.startsWith("txt") &&
    [
      "txt1stQtr",
      "txt2ndQtr",
      "txt3rdQtr",
      "txtTotal",
      "txtTaxRate",
      "txtMinCorpIncomeTax",
      "txtEmail",
    ].includes(name)
      ? name
      : p + name,
  kind,
  ...extra,
});
const row = (
  item: string,
  label: string,
  fields: CorporateField[],
): CorporateRow => ({ item, label, fields });
const radio = (name: string, options = yesNo, defaultValue?: string) =>
  field(name, "radio", { options, defaultValue, required: true });
const money = (name: string, readonly = false, label?: string) =>
  field(name, "money", { readonly, label, defaultValue: "0" });
const requiredText = (
  name: string,
  profileKey?: CorporateField["profileKey"],
) => field(name, "text", { required: true, profileKey });
function identity(revised: boolean): CorporateSection {
  const names = revised
    ? [
        "txtTIN1",
        "txtTIN2",
        "txtTIN3",
        "txtBranchCode",
        "txtRDOCode",
        "txtTaxpayerName1",
        "txtAddress",
        "txtZipCode",
      ]
    : [
        "txtTin1",
        "txtTin2",
        "txtTin3",
        "txtBranchCode",
        "txtRdoCode",
        "txtTaxpayerName",
        "txtTaxPayerAdd",
        "txtTaxPayerZip",
      ];
  const keys = [
    "tin1",
    "tin2",
    "tin3",
    "branchCode",
    "rdoCode",
    "taxpayerName",
    "address",
    "zipCode",
  ] as const;
  const f = names.map((name, index) => requiredText(name, keys[index]));
  return {
    title: "Part I – Background information",
    rows: [
      row("6", "Taxpayer Identification Number (TIN)", f.slice(0, 4)),
      row("7", "RDO code", [f[4]]),
      ...(!revised
        ? [
            row("8", "Line of business / occupation", [
              requiredText("txtDescription", "lineOfBusiness"),
            ]),
          ]
        : []),
      row(revised ? "8" : "9", "Registered name", [f[5]]),
      row(revised ? "9" : "11", "Registered address", [f[6]]),
      row(revised ? "9A" : "12", "ZIP code", [f[7]]),
      row("10", "Contact number", [requiredText("txtTelNum", "contactNumber")]),
      row(revised ? "11" : "", "Email address", [
        requiredText("txtEmail", "email"),
      ]),
    ],
  };
}
function legacyPages(code: string): CorporateForm["pages"] {
  const transactions: CorporateRow[] = [
    row(
      "16",
      "Sales / revenues / receipts / fees",
      ["A", "B", "C"].map((col) => money("txt16" + col)),
    ),
    row(
      "17",
      "Less cost of sales / services",
      ["A", "B", "C"].map((col) => money("txt17" + col)),
    ),
    row(
      "18",
      "Gross income",
      ["A", "B", "C"].map((col) => money("txt18" + col, true)),
    ),
    row("19", "Add other non-operating and taxable income", [
      money("txt19A"),
      money("txt19B"),
    ]),
    row(
      "20",
      "Total gross income",
      ["A", "B", "C"].map((col) => money("txt20" + col, true)),
    ),
    row(
      "21",
      "Less deductions",
      ["A", "B", "C"].map((col) => money("txt21" + col)),
    ),
    row(
      "22",
      "Taxable income this quarter",
      ["A", "B"].map((col) => money("txt22" + col, true)),
    ),
    row(
      "23",
      "Add taxable income from previous quarters",
      ["A", "B"].map((col) => money("txt23" + col)),
    ),
    row(
      "24",
      "Total taxable income to date",
      ["A", "B"].map((col) => money("txt24" + col, true)),
    ),
    row("25", "Tax rate except MCIT", [
      field("txt25A", "percent", { defaultValue: "0" }),
      field("txt25B", "percent", {
        defaultValue: code === "1702Q" ? "0" : "25",
        readonly: code === "1702Q",
      }),
    ]),
    row(
      "26",
      "Income tax other than MCIT",
      ["A", "B"].map((col) => money("txt26" + col, true)),
    ),
    row("27", "Less share of other agencies", [money("txt27")]),
    row("28", "Minimum corporate income tax from Schedule 1", [
      money("txt28", true),
    ]),
  ];
  for (const transaction of transactions) {
    const startColumn =
      transaction.item === "28" ? 3 : transaction.fields.length === 3 ? 1 : 2;
    transaction.fields.forEach((field, index) => {
      field.column = startColumn + index;
    });
  }
  return [
    {
      title: "Return and computation",
      sections: [
        {
          title: "Filing information",
          rows: [
            row("1", "For the", [
              radio("itemFiscalStartMonth", calendarFiscal, "C"),
            ]),
            row("2", "Year ended", [
              field("itemYearEndMonth", "select", {
                options: months,
                defaultValue: "12",
                required: true,
              }),
              field("txtYearEnded", "integer", {
                required: true,
                maxLength: 4,
              }),
            ]),
            row("3", "Quarter", [radio("optQtr", quarters)]),
            row("4", "Amended return?", [radio("optRemenderRtn", yesNo, "N")]),
            row("5", "Number of sheets attached", [
              field("txtSheets", "integer", { defaultValue: "0" }),
            ]),
          ],
        },
        identity(false),
        {
          title: "Filing choices",
          rows: [
            row("13", "Method of deductions", [
              {
                id: "1702q:OptMethodDeduct",
                kind: "radio",
                required: true,
                defaultValue: "I",
                options: [
                  { value: "I", label: "Itemized deductions" },
                  { value: "O", label: "40% optional standard deduction" },
                ],
              },
            ]),
            row(
              "14",
              "Availing of tax relief under special law or international tax treaty?",
              [radio("optTreaty", yesNo, "N"), field("lstTaxTreaty", "text")],
            ),
            row("15", "Alphanumeric tax code (ATC)", [
              field("txtAtc", "select", {
                options: legacyAtcOptions,
                required: true,
              }),
            ]),
          ],
        },
        {
          title: "Part II – Computation of tax",
          columns: ["Exempt", "Special rate", "Regular rate"],
          rows: transactions,
        },
        {
          title: "Tax payable",
          rows: [
            row(
              "29A",
              "Tax on transactions under regular rate, normal income tax or MCIT whichever is higher",
              [money("txt29A", true)],
            ),
            row(
              "29B",
              "Less unexpired excess of prior year's MCIT over normal income tax",
              [money("txt29B")],
            ),
            row("29C", "Balance", [money("txt29C", true)]),
            row(
              "29D",
              "Add tax due to BIR on transactions under special rate",
              [money("txt29D", true)],
            ),
            row("30", "Aggregate income tax due", [money("txt30", true)]),
            ...[
              "Prior year excess credits – taxes withheld",
              "Tax payments for previous quarters other than MCIT",
              "MCIT payments for previous quarters",
              "Creditable tax withheld for previous quarters",
              "Creditable tax withheld per BIR Form 2307 this quarter",
              "Tax paid in return previously filed, if amended",
            ].map((label, index) =>
              row("31" + String.fromCharCode(65 + index), label, [
                money("txt31" + String.fromCharCode(65 + index)),
              ]),
            ),
            row("31G", "Other tax credits / payments", [
              field("txt31Gothers", "text", { label: "Description" }),
              money("txt31G", false, "Other tax credits / payments"),
            ]),
            row("31H", "Total tax credits / payments", [money("txt31H", true)]),
            row("32", "Tax payable / (overpayment)", [money("txt32", true)]),
            row("33A", "Surcharge", [money("txt33A", false, "Surcharge")]),
            row("33B", "Interest", [money("txt33B", false, "Interest")]),
            row("33C", "Compromise", [money("txt33C", false, "Compromise")]),
            row("33D", "Total penalties", [
              money("txt33D", true, "Total penalties"),
            ]),
            row("34", "Total amount payable / (overpayment)", [
              money("txt34", true),
            ]),
          ],
        },
      ],
    },
    {
      title: "MCIT schedule",
      sections: [
        {
          title: "Schedule 1 – Computation of minimum corporate income tax",
          rows: [
            row("1", "Gross income for the first quarter", [
              money("txt1stQtr"),
            ]),
            row("2", "Gross income for the second quarter", [
              money("txt2ndQtr"),
            ]),
            row("3", "Gross income for the third quarter", [
              money("txt3rdQtr"),
            ]),
            row(
              "4",
              "Total gross income except gross income taxable under special rate",
              [money("txtTotal", true)],
            ),
            row("5", "MCIT rate", [
              field("txtTaxRate", "percent", {
                defaultValue: "2",
                readonly: code === "1702Q",
              }),
            ]),
            row("6", "Minimum corporate income tax to item 28", [
              money("txtMinCorpIncomeTax", true),
            ]),
          ],
        },
      ],
    },
  ];
}
const incomeLabels = [
  "Sales / receipts / revenues / fees",
  "Less cost of sales / services",
  "Gross income from operation",
  "Add non-operating and other taxable income",
  "Total gross income",
  "Less deductions",
  "Taxable income this quarter",
  "Add taxable income from previous quarters",
  "Total taxable income to date",
  "Applicable income tax rate except MCIT",
  "Income tax due other than MCIT",
];
function scheduleRows(schedule: number, columns: string[]): CorporateRow[] {
  return incomeLabels.map((label, index) =>
    row(
      String(index + 1),
      label,
      columns.map((col) =>
        index === 9
          ? field(`Sched${schedule}:txtTax10${col}`, "percent", {
              defaultValue: "0",
              readonly: schedule === 1 && col === "A",
            })
          : money(
              `Sched${schedule}:txtTax${index + 1}${col}`,
              [3, 5, 7, 9, 11].includes(index + 1),
            ),
      ),
    ),
  );
}
function revisedPages(): CorporateForm["pages"] {
  return [
    {
      title: "Return and tax payable",
      sections: [
        {
          title: "Filing information",
          rows: [
            row("1", "For the", [radio("rbForClndrFscl", calendarFiscal, "C")]),
            row("2", "Year ended (MM / YYYY)", [
              field("rbYrEndMonth", "select", {
                options: months,
                defaultValue: "12",
                required: true,
              }),
              field("txtYrEndYear", "integer", {
                required: true,
                maxLength: 4,
              }),
            ]),
            row("3", "Quarter", [radio("rbQuarter", quarters)]),
            row("4", "Amended return?", [radio("rbAmendedRtn", yesNo, "N")]),
            row("5", "Alphanumeric tax code (ATC)", [
              field("cbATC_2", "select", {
                options: atcOptions,
                required: true,
              }),
              field("rbATC_1", "radio", {
                options: [
                  { value: "IC055", label: "Yes" },
                  { value: "N", label: "No" },
                ],
                defaultValue: "N",
                label: "Subject to MCIT (IC055)?",
              }),
            ]),
          ],
        },
        identity(true),
        {
          title: "Filing choices",
          rows: [
            row("12", "Method of deductions", [
              radio(
                "rbMthdOfDdctns",
                [
                  { value: "Creditor", label: "Itemized deductions" },
                  { value: "Debtor", label: "40% optional standard deduction" },
                ],
                "Creditor",
              ),
            ]),
            row(
              "13",
              "Availing of tax relief under special law or international tax treaty?",
              [radio("rbTxRlf", yesNo, "N"), field("txtTxRlfSpcfy", "text")],
            ),
          ],
        },
        {
          title: "Part II – Total tax payable",
          rows: [
            row(
              "14",
              "Income tax due – regular / normal rate from Schedule 2",
              [money("txtTax14", true)],
            ),
            row(
              "15",
              "Less unexpired excess of prior year's MCIT over regular / normal income tax",
              [money("txtTax15")],
            ),
            row(
              "16",
              "Balance / income tax still due – regular / normal rate",
              [money("txtTax16", true)],
            ),
            row("17", "Add income tax due – special rate from Schedule 1", [
              money("txtTax17", true),
            ]),
            row("18", "Aggregate income tax due", [money("txtTax18", true)]),
            row("19", "Less total tax credits / payments from Schedule 4", [
              money("txtTax19", true),
            ]),
            row("20", "Net tax payable / (overpayment)", [
              money("txtTax20", true),
            ]),
            row("21", "Surcharge", [money("txtTax21")]),
            row("22", "Interest", [money("txtTax22")]),
            row("23", "Compromise", [money("txtTax23")]),
            row("24", "Total penalties", [money("txtTax24", true)]),
            row("25", "Total amount payable / (overpayment)", [
              money("txtTax25", true),
            ]),
            row("26", "Number of attachments", [
              field("txtSheets", "integer", { defaultValue: "0" }),
            ]),
          ],
        },
      ],
    },
    {
      title: "Income tax schedules",
      sections: [
        {
          title:
            "Schedule 1 – Computation of tax due for income subject to special rate",
          columns: ["Exempt", "Special rate"],
          rows: [
            ...scheduleRows(1, ["A", "B"]),
            row("12", "Less share of other agencies, if remitted directly", [
              { ...money("Sched1:txtTax12B"), column: 2 },
            ]),
            row("13", "Net income tax due to national government", [
              { ...money("Sched1:txtTax13B", true), column: 2 },
            ]),
          ],
        },
        {
          title:
            "Schedule 2 – Computation of tax due for income subject to regular / normal rate",
          rows: [
            ...scheduleRows(2, [""]),
            row("12", "Minimum corporate income tax from Schedule 3", [
              money("Sched2:txtTax12", true),
            ]),
            row(
              "13",
              "Income tax due, normal income tax or MCIT whichever is higher",
              [money("Sched2:txtTax13", true)],
            ),
          ],
        },
      ],
    },
    {
      title: "MCIT and tax credits",
      sections: [
        {
          title:
            "Schedule 3 – Computation of minimum corporate income tax (MCIT)",
          rows: [
            row("1", "Gross income regular / normal rate – first quarter", [
              money("Sched3:txtTax1"),
            ]),
            row("2", "Gross income regular / normal rate – second quarter", [
              money("Sched3:txtTax2"),
            ]),
            row("3", "Gross income regular / normal rate – third quarter", [
              money("Sched3:txtTax3"),
            ]),
            row("4", "Total gross income", [money("Sched3:txtTax4", true)]),
            row("5", "MCIT rate", [
              field("Sched3:txtTax5", "percent", { defaultValue: "2" }),
            ]),
            row("6", "Minimum corporate income tax to Schedule 2", [
              money("Sched3:txtTax6", true),
            ]),
          ],
        },
        {
          title: "Schedule 4 – Tax credits / payments",
          rows: [
            ...[
              "Prior year's excess credits",
              "Tax payments for previous quarters other than MCIT",
              "MCIT payments for previous quarters",
              "Creditable tax withheld for previous quarters",
              "Creditable tax withheld per BIR Form 2307 this quarter",
              "Tax paid in return previously filed, if amended",
            ].map((label, index) =>
              row(String(index + 1), label, [
                money("Sched4:txtTax" + (index + 1)),
              ]),
            ),
            ...[0, 1].map((index) =>
              row(
                "6" + String.fromCharCode(65 + index),
                "Other tax credits / payments",
                [
                  field("Sched4:txtOthrTxCrdts" + index, "text"),
                  money("Sched4:txtOthrTxCrdtAmnt" + index),
                ],
              ),
            ),
            row("6b", "Additional other-credit entries", [
              {
                id: quarterlyCreditCount,
                repeatable: {
                  label: "Additional other tax credits",
                  limit: 999,
                  seedFrom: [p + "Sched4:txtOthrTxCrdts1", p + "Sched4:txtOthrTxCrdtAmnt1"],
                },
                kind: "integer",
                defaultValue: "0",
                maxLength: 3,
              },
            ]),
            row("7", "Total tax credits / payments", [
              money("Sched4:txtTax7", true),
            ]),
          ],
        },
      ],
    },
  ];
}
function expandedRevisedPages(values: CorporateValues): CorporateForm["pages"] {
  const pages = revisedPages();
  const credits = pages[2].sections[1];
  if (quarterlyCreditRowCount(values) > 0) {
    const aggregate = credits.rows.find((row) =>
      row.fields.some((field) => field.id === p + "Sched4:txtOthrTxCrdtAmnt1"),
    );
    aggregate?.fields.forEach((field) => {
      field.readonly = true;
    });
    credits.rows.splice(
      credits.rows.length - 1,
      0,
      ...quarterlyExtraCreditRows(values),
    );
  }
  return pages;
}

function validateQuarterly(
  form: CorporateForm,
  values: CorporateValues,
): CorporateValues {
  const errors: CorporateValues = {};
  for (const field of form.pages.flatMap((page) =>
    page.sections.flatMap((section) =>
      section.rows.flatMap((row) => row.fields),
    ),
  )) {
    if (field.required && !values[field.id]?.trim())
      errors[field.id] = "Required";
    if (
      field.kind === "money" &&
      values[field.id] &&
      !Number.isFinite(Number(values[field.id].replaceAll(",", "")))
    )
      errors[field.id] = "Enter a valid amount";
  }
  if (form.code === "1702Qv2018C") {
    for (const row of quarterlyExtraCreditRows(values)) {
      const [description, amount] = row.fields;
      if (!values[description.id]?.trim())
        errors[description.id] = "Enter the tax credit description";
      if (!(Number((values[amount.id] ?? "").replaceAll(",", "")) > 0))
        errors[amount.id] = "Enter a positive tax credit amount";
    }
    if (!/^\d{1,3}$/.test(values[quarterlyCreditCount] ?? "0"))
      errors[quarterlyCreditCount] = "Enter a number of entries from 0 to 999";
  }
  const year = values[form.year] ?? "";
  const revised = form.code === "1702Qv2018C";
  if (
    !(revised ? /^(?:20)?(?:1[8-9]|[2-9]\d)$/ : /^(?:19|20)\d{2}$/).test(year)
  )
    errors[form.year] = revised
      ? "Enter a year from 2018 onward"
      : "Enter a four-digit year from 1900";
  const relief = p + (revised ? "rbTxRlf" : "optTreaty");
  const specify = p + (revised ? "txtTxRlfSpcfy" : "lstTaxTreaty");
  if (values[relief] === "Y" && !values[specify]?.trim())
    errors[specify] = "Specify the special law or international tax treaty";
  if (form.quarter && !["1", "2", "3"].includes(values[form.quarter]))
    errors[form.quarter] = "Select the first, second or third quarter";
  return errors;
}
function applies(
  revised: boolean,
  id: string,
  values: CorporateValues,
): boolean {
  if (revised) {
    const atc = values[p + "cbATC_2"] ?? "";
    const regime = quarterlyRegime(atc);
    if (atc && regime !== "regular" && id.startsWith(p + "Sched2:"))
      return false;
    if (
      atc &&
      regime === "exempt" &&
      id.startsWith(p + "Sched1:") &&
      /B$/.test(id)
    )
      return false;
    if (
      atc &&
      regime === "special" &&
      id.startsWith(p + "Sched1:") &&
      /A$/.test(id)
    )
      return false;
    if (id.startsWith(p + "Sched3:") && values[p + "rbATC_1"] === "N")
      return false;
  }

  if (id === p + (revised ? "txtTxRlfSpcfy" : "lstTaxTreaty"))
    return values[p + (revised ? "rbTxRlf" : "optTreaty")] === "Y";
  if (id === p + (revised ? "Sched4:txtTax6" : "txt31F"))
    return values[p + (revised ? "rbAmendedRtn" : "optRemenderRtn")] === "Y";
  return true;
}
export const quarterlyForms: CorporateForm[] = [
  "1702Q",
  "1702Qv2008C",
  "1702Qv2018C",
].map((code) => {
  const revised = code === "1702Qv2018C";
  const form: CorporateForm = {
    code,
    title:
      "Quarterly income tax return for corporations, partnerships and other non-individual taxpayers",
    revision: revised
      ? "January 2018 (ENCS)"
      : code === "1702Qv2008C"
        ? "July 2008 (CREATE)"
        : "July 2008",
    year: p + (revised ? "txtYrEndYear" : "txtYearEnded"),
    month: p + (revised ? "rbYrEndMonth" : "itemYearEndMonth"),
    quarter: p + (revised ? "rbQuarter" : "optQtr"),
    periodType: p + (revised ? "rbForClndrFscl" : "itemFiscalStartMonth"),
    amount: p + (revised ? "txtTax25" : "txt34"),
    decimals: revised ? 0 : 2,
    pages: revised ? revisedPages() : legacyPages(code),
    calculate: revised
      ? calculateRevisedQuarterly
      : (values) => calculateLegacyQuarterly(code, values),
    fieldApplies: (id, values) => applies(revised, id, values),
    fieldReadonly: (id, values) => {
      if (!revised) return id === p + "txt21C" && values["1702q:OptMethodDeduct"] === "O";
      if (id === p + "Sched2:txtTax6") return values[p + "rbMthdOfDdctns"] === "Debtor";
      if (id === p + "Sched2:txtTax10") return quarterlyRegularRate(values) !== undefined;
      return id === p + "Sched3:txtTax5" && quarterlyMcitRateIsFixed(values);
    },
  };
  form.validate = (values) => validateQuarterly(form, values);
  if (revised) {
    form.expandPages = expandedRevisedPages;
    form.continuations = (values) => {
      const rows = quarterlyExtraCreditRows(values);
      return rows.length
        ? [
            {
              title: "Schedule 4 – Additional other tax credits / payments",
              rows,
            },
          ]
        : [];
    };
  }
  return form;
});
