import type { TaxpayerProfile } from "$lib/profiles/profile";

/** Application field IDs follow the packaged identifiers for computation fields.
 * Radio groups and split calendar dates are represented by a single value.
 * Source: docs/research/ebirforms-v7.9.6.0/withholding/ (static package, not current law).
 */
export type WithholdingField = {
  id: string;
  label: string;
  type: "text" | "money" | "number" | "select" | "date";
  required?: boolean;
  readonly?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string;
  profileKey?: keyof TaxpayerProfile;
  group?: "credits" | "penalties" | "attachments";
  showWhen?: { field: string; value: string };
  allowNegative?: boolean;
};
export type WithholdingRow = {
  id: string;
  label: string;
  fields: WithholdingField[];
};
export type WithholdingSchedule = {
  id: string;
  title: string;
  rows: WithholdingRow[];
  totals?: WithholdingField[];
  repeatable?: boolean;
};
export type WithholdingDefinition = {
  code: string;
  title: string;
  revision: "legacy" | "revised" | "standalone";
  period: "month" | "quarter" | "year" | "date";
  minYear?: number;
  maxYear?: number;
  prefix: string;
  yearField: string;
  monthField?: string;
  quarterField?: string;
  dateField?: string;
  totalField: string;
  source: string;
  sections: { id: string; title: string; fields: WithholdingField[] }[];
  schedules: WithholdingSchedule[];
};
export const withholdingMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const yesNo = [
  { value: "Y", label: "Yes" },
  { value: "N", label: "No" },
];
const category = [
  { value: "P", label: "Private" },
  { value: "G", label: "Government" },
];
const months = withholdingMonths.map((label, i) => ({
  value: String(i + 1).padStart(2, "0"),
  label,
}));
const opts = (values: string[]) =>
  values.map((value) => ({ value, label: value }));
const f = (
  prefix: string,
  name: string,
  label: string,
  type: WithholdingField["type"] = "text",
  extra: Partial<WithholdingField> = {},
): WithholdingField => ({ id: prefix + name, label, type, ...extra });
const m = (
  prefix: string,
  name: string,
  label: string,
  readonly = false,
  extra: Partial<WithholdingField> = {},
) => f(prefix, name, label, "money", { readonly, ...extra });
const select = (
  p: string,
  n: string,
  l: string,
  options = yesNo,
  extra: Partial<WithholdingField> = {},
) => f(p, n, l, "select", { options, ...extra });
const section = (id: string, title: string, fields: WithholdingField[]) => ({
  id,
  title,
  fields,
});
const source = (name: string) =>
  `docs/research/ebirforms-v7.9.6.0/withholding/${name}.md`;
function base(
  code: string,
  title: string,
  period: WithholdingDefinition["period"],
  total: string,
  revision: WithholdingDefinition["revision"] = "standalone",
  prefix = `frm${code.replace("v2018", "")}:`,
): WithholdingDefinition {
  const year = prefix + "txtYear";
  const fields: WithholdingField[] =
    period === "date"
      ? [f(prefix, "date", "Date of transaction", "date", { required: true })]
      : [f(prefix, "txtYear", "Year", "number", { required: true })];
  if (period === "month")
    fields.push(
      select(prefix, "txtMonth", "Month", months, { required: true }),
    );
  if (period === "quarter")
    fields.push(
      select(prefix, "optQuarter", "Quarter", opts(["Q1", "Q2", "Q3", "Q4"]), {
        required: true,
      }),
    );
  fields.push(
    select(prefix, "optAmend", "Amended return?", yesNo, {
      required: true,
      defaultValue: "N",
    }),
  );
  if (!code.startsWith("1604") && code !== "0605")
    fields.push(
      select(prefix, "optWithheld", "Any tax withheld?", yesNo, {
        required: true,
        defaultValue: "N",
      }),
    );
  if (!code.startsWith("0619") && code !== "1603")
    fields.push(
      f(prefix, "txtSheets", "Number of sheets attached", "number", {
        defaultValue: "0",
        group: "attachments",
      }),
    );
  const identity: WithholdingField[] = [
    ["txtTIN1", "TIN — first 3 digits", "tin1"],
    ["txtTIN2", "TIN — middle 3 digits", "tin2"],
    ["txtTIN3", "TIN — last 3 digits", "tin3"],
    ["txtBranchCode", "Branch code", "branchCode"],
    ["txtRDOCode", "RDO code", "rdoCode"],
    ["txtTaxpayerName", "Withholding agent / taxpayer name", "taxpayerName"],
    ["txtAddress", "Registered address", "address"],
    ["txtAddress2", "Address continuation", "address2"],
    ["txtZipCode", "ZIP code", "zipCode"],
    ["txtTelNum", "Contact number", "contactNumber"],
    ["txtEmail", "Email address", "email"],
  ].map(([n, l, k]) =>
    f(prefix, n, l, "text", {
      profileKey: k as keyof TaxpayerProfile,
      required:
        k !== "address2" &&
        (k !== "email" || revision === "revised" || code.startsWith("0619")),
    }),
  );
  if (code !== "0605")
    identity.push(
      select(prefix, "optCategory", "Category of withholding agent", category, {
        required: true,
        profileKey: "category",
      }),
    );
  if (revision === "legacy" || code === "0605" || code === "1600")
    identity.push(
      f(prefix, "txtLineBus", "Line of business / occupation", "text", {
        required: true,
        profileKey: "lineOfBusiness",
      }),
    );
  return {
    code,
    title,
    period,
    revision,
    prefix,
    yearField: year,
    monthField: period === "month" ? prefix + "txtMonth" : undefined,
    quarterField: period === "quarter" ? prefix + "optQuarter" : undefined,
    dateField: period === "date" ? prefix + "date" : undefined,
    minYear: revision === "revised" ? 2018 : 1900,
    maxYear: ["1601C", "1601E", "1601F", "1602", "1603"].includes(code)
      ? 2017
      : undefined,
    totalField: prefix + total,
    source: source(code.replace("v2018", "").toLowerCase()),
    sections: [
      section("period", "Return details", fields),
      section("taxpayer", "Taxpayer details", identity),
    ],
    schedules: [],
  };
}
function moneySection(
  d: WithholdingDefinition,
  entries: [string, string, boolean?][],
  title = "Tax computation",
) {
  d.sections.push(
    section(
      "computation",
      title,
      entries.map(([id, label, ro]) => m(d.prefix, id, label, ro)),
    ),
  );
}
function penalties(
  p: string,
  names: string[],
  total: string,
): WithholdingField[] {
  return [
    ...names.map((n, i) =>
      m(p, n, ["Surcharge", "Interest", "Compromise"][i], false, {
        group: "penalties",
      }),
    ),
    m(p, total, "Total penalties", true, { group: "penalties" }),
  ];
}
function relief(d: WithholdingDefinition) {
  d.sections[0].fields.push(
    select(d.prefix, "optRelief", "Availing of tax relief?", yesNo, {
      defaultValue: "N",
    }),
    f(
      d.prefix,
      "reliefDescription",
      "Special law or international tax treaty",
      "text",
      {
        showWhen: { field: d.prefix + "optRelief", value: "Y" },
        required: true,
      },
    ),
  );
}
function atcSchedule(
  d: WithholdingDefinition,
  count = 10,
  title = "Computation by ATC",
  id = "atc",
): WithholdingSchedule {
  const rows = Array.from({ length: count }, (_, i) => ({
    id: `${id}-${i + 1}`,
    label: `${i + 1}`,
    fields: [
      f(d.prefix, `txtAtcCode${i + 1}`, "ATC"),
      m(d.prefix, `txtTaxBase${i + 1}`, "Tax base"),
      f(d.prefix, `txtTaxRate${i + 1}`, "Rate (%)", "number", {
        readonly: true,
      }),
      m(d.prefix, `txtTaxbeWithHeld${i + 1}`, "Tax withheld", true),
    ],
  }));
  const schedule = { id, title, rows, repeatable: true };
  d.schedules.push(schedule);
  return schedule;
}
function payeeSchedule(d: WithholdingDefinition, count = 10) {
  d.schedules.push({
    id: "payees",
    repeatable: true,
    title: "Details of withholding by payee",
    rows: Array.from({ length: count }, (_, i) => ({
      id: `payee-${i + 1}`,
      label: `${i + 1}`,
      fields: [
        f(d.prefix, `dtSched:txtTin${i + 1}`, "Payee TIN"),
        f(d.prefix, `dtSched:txtFullname${i + 1}`, "Payee name"),
        f(d.prefix, `dtSched:drpAtcCode${i + 1}`, "ATC"),
        m(d.prefix, `dtSched:amount${i + 1}`, "Income payment"),
        f(d.prefix, `dtSched:txtRatePercent${i + 1}`, "Rate (%)", "number", {
          readonly: true,
        }),
        m(d.prefix, `dtSched:taxWithheld${i + 1}`, "Tax withheld", true),
      ],
    })),
    totals: [
      m(
        d.prefix,
        "dtSched:TotaltaxWithheld",
        "Schedule withholding total",
        true,
      ),
    ],
  });
}
function treatySchedule(d: WithholdingDefinition, count = 10) {
  relief(d);
  d.schedules.push({
    id: "treaty",
    repeatable: true,
    title: "Schedule 1 — Tax treaty withholding",
    rows: Array.from({ length: count }, (_, i) => ({
      id: `treaty-${i + 1}`,
      label: `${i + 1}`,
      fields: [
        f(d.prefix, `treaty:${i + 1}:code`, "Treaty code"),
        f(d.prefix, `treaty:${i + 1}:atc`, "ATC"),
        m(d.prefix, `treaty:${i + 1}:income`, "Income payment"),
        f(d.prefix, `treaty:${i + 1}:rate`, "Treaty rate (%)", "number"),
        m(d.prefix, `treaty:${i + 1}:tax`, "Tax withheld", true),
      ],
    })),
  });
}
function compensationSchedule(d: WithholdingDefinition, old: boolean) {
  d.schedules.push({
    id: "adjustments",
    repeatable: old,
    title: "Adjustment of taxes withheld in previous months",
    rows: Array.from({ length: 3 }, (_, i) => ({
      id: `adjustment-${i}`,
      label: `${i + 1}`,
      fields: [
        f(d.prefix, `sched1:txtMonthYear${i}`, "Month/year (MM/YYYY)"),
        f(d.prefix, `sched1:txtDatePaid${i}`, "Date paid", "date"),
        f(d.prefix, `sched1:txtBankCode${i}`, "Bank code"),
        f(d.prefix, `sched1:txtNumber${i}`, "Receipt / reference number"),
        m(d.prefix, `sched1:txtTaxPaid${i}`, "Tax paid"),
        m(
          d.prefix,
          `sched1:txtShouldTaxDue${i}`,
          "Tax that should have been withheld",
        ),
        m(d.prefix, `sched1:txtAdjustments${i}`, "Adjustment", true),
        ...(old
          ? [
              select(d.prefix, `sched1:periodType${i}`, "Adjustment period", [
                { value: "M", label: "Current year" },
                { value: "Y", label: "Year-end adjustment" },
              ]),
            ]
          : []),
      ],
    })),
  });
}
const definitions: WithholdingDefinition[] = [];
{
  const d = base("0605", "Payment Form", "date", "txtTax21");
  const p = d.prefix;
  d.sections[0].fields = [
    select(
      p,
      "itemFiscalStartMonth",
      "Year basis",
      opts(["Calendar", "Fiscal"]),
      { required: true },
    ),
    f(p, "txtYearEnded", "Year ended", "number", { required: true }),
    select(p, "itemYearEndMonth", "Year-end month", months, {
      required: true,
      defaultValue: "12",
    }),
    f(p, "dueDate", "Due date", "date"),
    f(p, "date", "Return period", "date", { required: true }),
    f(p, "txtATCCode", "ATC", "text", { required: true }),
    f(p, "txtTaxTypeCode", "Tax type code", "text", { required: true }),
  ];
  d.yearField = p + "txtYearEnded";
  d.minYear = 1904;
  d.sections[1].fields.push(
    select(
      p,
      "txtClassification",
      "Taxpayer classification",
      [
        { value: "I", label: "Individual" },
        { value: "N", label: "Non-individual" },
      ],
      { required: true, profileKey: "taxpayerClassification" },
    ),
  );
  d.sections.push(
    section("payment", "Payment details", [
      select(
        p,
        "itemMannerOfPayment",
        "Manner of payment",
        opts([
          "Self-assessment",
          "Penalties",
          "Tax deposit / advance payment",
          "Income tax second installment",
          "Others",
          "Preliminary/final assessment / deficiency",
          "Accounts receivable / delinquent account",
        ]),
        { required: true },
      ),
      select(
        p,
        "itemModeOfPayment",
        "Type of payment",
        opts(["Installment", "Partial payment", "Full payment"]),
        { required: true },
      ),
      f(p, "txtNumOfInstallment", "Installment number", "number", {
        showWhen: { field: p + "itemModeOfPayment", value: "Installment" },
        required: true,
      }),
      f(p, "txtOthersName", "Other payment description", "text", {
        showWhen: { field: p + "itemMannerOfPayment", value: "Others" },
        required: true,
      }),
      select(p, "itemApprovedYN", "Approved by investigating office?", yesNo),
    ]),
  );
  moneySection(d, [["txtTax19", "19 Basic tax / deposit / advance payment"]]);
  d.sections
    .at(-1)!
    .fields.push(
      ...penalties(p, ["txtTax20A", "txtTax20B", "txtTax20C"], "txtTax20D"),
      m(p, "txtTax21", "21 Total amount payable", true),
    );
  definitions.push(d);
}
for (const code of ["0619E", "0619F"]) {
  const e = code === "0619E",
    d = base(
      code,
      e
        ? "Monthly Remittance of Creditable Income Taxes Withheld (Expanded)"
        : "Monthly Remittance of Final Income Taxes Withheld",
      "month",
      e ? "txtTax18" : "txtTax19",
      "revised",
    ),
    p = d.prefix;
  d.sections[0].fields.push(
    f(p, "dueDate", "Due date", "date", { required: true }),
  );
  if (!e)
    d.sections[0].fields.push(
      select(p, "txtTaxTypeCode", "Tax type", opts(["WB", "WF"]), {
        required: true,
      }),
    );
  moneySection(
    d,
    e
      ? [
          ["txtTax14", "14 Taxes withheld for remittance"],
          ["txtTax15", "15 Amount previously remitted"],
          ["txtTax16", "16 Net amount of remittance", true],
        ]
      : [
          ["txtTax13", "13 WMF10 — Interest on deposits / deposit substitutes"],
          ["txtTax14", "14 WMF20 — Other final income taxes"],
          ["txtTax15", "15 Total taxes withheld", true],
          ["txtTax16", "16 Amount previously remitted"],
          ["txtTax17", "17 Net amount of remittance", true],
        ],
  );
  d.sections
    .at(-1)!
    .fields.push(
      ...penalties(
        p,
        e
          ? ["txtTax17A", "txtTax17B", "txtTax17C"]
          : ["txtTax18A", "txtTax18B", "txtTax18C"],
        e ? "txtTax17D" : "txtTax18D",
      ),
      m(p, e ? "txtTax18" : "txtTax19", "Total amount of remittance", true),
    );
  definitions.push(d);
}
for (const code of [
  "1600",
  "1600WP",
  "1601E",
  "1601F",
  "1601FQ",
  "1600PTv2018",
  "1600VTv2018",
]) {
  const revised = code.includes("v2018"),
    fq = code === "1601FQ",
    final = code === "1601F" || fq,
    wp = code === "1600WP";
  const title = (
    {
      1600: "Monthly Remittance of VAT and Other Percentage Taxes Withheld",
      "1600WP": "Remittance of Percentage Tax on Winnings and Prizes",
      "1601E":
        "Monthly Remittance of Creditable Income Taxes Withheld (Expanded)",
      "1601F": "Monthly Remittance of Final Income Taxes Withheld",
      "1601FQ": "Quarterly Remittance of Final Income Taxes Withheld",
      "1600PTv2018": "Monthly Remittance of Other Percentage Taxes Withheld",
      "1600VTv2018": "Monthly Remittance of VAT Withheld",
    } as Record<string, string>
  )[code];
  const d = base(
    code,
    title,
    fq ? "quarter" : wp ? "date" : "month",
    revised
      ? "txtPg1P2I27TotAmtStillDueOverremit"
      : fq
        ? "txtTax32"
        : final
          ? "txtTax20"
          : wp
            ? "txtTax16"
            : "txtTax18",
    revised || fq
      ? "revised"
      : code === "1601E" || code === "1601F"
        ? "legacy"
        : "standalone",
  );
  const p = d.prefix;
  atcSchedule(d);
  if (["1600", "1600WP"].includes(code) || revised)
    payeeSchedule(d, revised ? 5 : 10);
  if (final) treatySchedule(d);
  else if (revised) relief(d);
  if (["1600", "1601E"].includes(code)) {
    // Original enableSelTreaty adds the N/A special-law ATC; WP disables relief.
    d.sections[0].fields.push(
      select(p, "optRelief", "Payees availing of special-law relief?", yesNo, {
        defaultValue: "N",
      }),
      select(
        p,
        code === "1600" ? "selTreaty" : "j_id402",
        "Tax relief",
        [{ value: "1", label: "Special Law" }],
        {
          defaultValue: "1",
          required: true,
          showWhen: { field: p + "optRelief", value: "Y" },
        },
      ),
    );
  }
  if (revised) {
    moneySection(d, [
      ["txtPg1P2I18TotTaxWithheld", "18 Total taxes withheld", true],
      ["txtPg1P2I19TaxRemittedInRtrn", "19 Taxes remitted in previous return"],
      ["txtPg1P2I20OthrPymntsMade", "20 Other payments made"],
      ["txtPg1P2I21TotTaxPymntsMade", "21 Total payments made", true],
      [
        "txtPg1P2I22TaxStillDueOverremit",
        "22 Tax still due / overremittance",
        true,
      ],
    ]);
    d.sections
      .at(-1)!
      .fields.push(
        ...penalties(
          p,
          [
            "txtPg1P2I23Surcharge",
            "txtPg1P2I24Interest",
            "txtPg1P2I25Compromise",
          ],
          "txtPg1P2I26TotPenalties",
        ),
        m(
          p,
          "txtPg1P2I27TotAmtStillDueOverremit",
          "27 Total amount still due / overremittance",
          true,
        ),
      );
  } else if (fq) {
    moneySection(d, [
      ["txtTax20", "20 Taxes withheld at regular rates", true],
      ["txtTax21", "21 Taxes withheld at treaty rates", true],
      ["txtTax22", "22 Total taxes withheld", true],
      ["txtTax23", "23 First-month remittance"],
      ["txtTax24", "24 Second-month remittance"],
      ["txtTax25", "25 Previously remitted on amended return"],
      ["txtTax26", "26 Total remittances", true],
      ["txtTax27", "27 Tax still due / overremittance", true],
    ]);
    d.sections
      .at(-1)!
      .fields.push(
        ...penalties(p, ["txtTax28", "txtTax29", "txtTax30"], "txtTax31"),
        m(p, "txtTax32", "32 Total amount still due / overremittance", true),
      );
  } else if (final) {
    moneySection(d, [
      ["txtTax14", "14 Tax withheld at regular rates", true],
      ["txtTax15", "15 Tax withheld at treaty rates", true],
      ["txtTax16", "16 Total tax required to be withheld", true],
      ["txtTax17", "17 Tax previously remitted"],
      ["txtTax18", "18 Tax still due / overremittance", true],
    ]);
    d.sections
      .at(-1)!
      .fields.push(
        ...penalties(p, ["txtTax19A", "txtTax19B", "txtTax19C"], "txtTax19D"),
        m(p, "txtTax20", "20 Total amount still due / overremittance", true),
      );
  } else if (wp) {
    moneySection(d, [
      ["txtTax12", "12 Total tax withheld", true],
      ["txtTax13", "13 Tax previously remitted"],
      ["txtTax14", "14 Tax still due / overremittance", true],
    ]);
    d.sections
      .at(-1)!
      .fields.push(
        ...penalties(p, ["txtTax15A", "txtTax15B", "txtTax15C"], "txtTax15D"),
        m(p, "txtTax16", "16 Total amount still due / overremittance", true),
      );
  } else {
    moneySection(d, [
      ["txtTax14", "14 Total tax withheld", true],
      ...(code === "1601E"
        ? ([
            ["txtTax15A", "15A Tax previously remitted"],
            ["txtTax15B", "15B Other payments"],
            ["txtTax15C", "15C Total payments", true],
          ] as [string, string, boolean?][])
        : ([["txtTax15", "15 Tax previously remitted"]] as [
            string,
            string,
            boolean?,
          ][])),
      ["txtTax16", "16 Tax still due / overremittance", true],
    ]);
    d.sections
      .at(-1)!
      .fields.push(
        ...penalties(p, ["txtTax17A", "txtTax17B", "txtTax17C"], "txtTax17D"),
        m(p, "txtTax18", "18 Total amount still due / overremittance", true),
      );
  }
  definitions.push(d);
}
for (const code of ["1601C", "1601Cv2018"]) {
  const revised = code.includes("v2018"),
    d = base(
      code,
      "Monthly Remittance of Income Taxes Withheld on Compensation",
      "month",
      revised ? "txtTax36" : "txtTax25",
      revised ? "revised" : "legacy",
      "frm1601c:",
    );
  const p = d.prefix;
  compensationSchedule(d, !revised);
  relief(d);
  moneySection(
    d,
    revised
      ? [
          ["txtTax14", "14 Total compensation"],
          ["txtTax15", "15 Statutory minimum wage"],
          ["txtTax16", "16 Holiday / overtime / night / hazard pay for MWEs"],
          ["txtTax17", "17 13th month pay and other benefits"],
          ["txtTax18", "18 De minimis benefits"],
          ["txtTax19", "19 Mandatory contributions and union dues"],
          ["txtTax20", "20 Other non-taxable compensation"],
          ["txtTax21", "21 Total non-taxable compensation", true],
          ["txtTax22", "22 Total taxable compensation", true],
          ["txtTax23", "23 Taxable compensation not subject to withholding"],
          ["txtTax24", "24 Net taxable compensation", true],
          ["txtTax25", "25 Total taxes withheld"],
          ["txtTax26", "26 Adjustment from schedule", true],
          ["txtTax27", "27 Taxes withheld for remittance", true],
          ["txtTax28", "28 Previously remitted on amended return"],
          ["txtTax29", "29 Other remittances"],
          ["txtTax30", "30 Total remittances", true],
          ["txtTax31", "31 Tax still due / overremittance", true],
        ]
      : [
          ["txtTax15", "15 Total compensation"],
          ["txtTax16A", "16A Statutory minimum wage"],
          ["txtTax16B", "16B Holiday / overtime / night / hazard pay for MWEs"],
          ["txtTax16C", "16C Other non-taxable compensation"],
          ["txtTax17", "17 Taxable compensation", true],
          ["txtTax18", "18 Tax required to be withheld"],
          ["txtTax19", "19 Adjustments from schedule", true],
          ["txtTax20", "20 Total taxes withheld", true],
          ["txtTax21A", "21A Previously remitted on amended return"],
          ["txtTax21B", "21B Other payments"],
          ["txtTax22", "22 Total tax credits", true],
          ["txtTax23", "23 Tax still due / overremittance", true],
        ],
  );
  d.sections
    .at(-1)!
    .fields.push(
      ...penalties(
        p,
        revised
          ? ["txtTax32", "txtTax33", "txtTax34"]
          : ["txtTax24A", "txtTax24B", "txtTax24C"],
        revised ? "txtTax35" : "txtTax24D",
      ),
      m(
        p,
        revised ? "txtTax36" : "txtTax25",
        "Total amount still due / overremittance",
        true,
      ),
    );
  if (revised)
    d.sections
      .at(-1)!
      .fields.push(
        f(p, "txt20Other", "Description of other non-taxable compensation"),
        f(p, "txt29Other", "Description of other remittances"),
      );
  definitions.push(d);
}
for (const code of ["1603", "1603Qv2018"]) {
  const revised = code.includes("v2018"),
    d = base(
      code,
      "Quarterly Remittance of Final Income Taxes Withheld on Fringe Benefits",
      "quarter",
      revised ? "txtTax23" : "txt22",
      revised ? "revised" : "legacy",
    );
  const p = d.prefix;
  relief(d);
  if (!revised)
    d.sections[0].fields.push(
      select(
        p,
        "monthsCovered",
        "3 Months covered",
        opts(["1", "2", "3", "1,2", "1,3", "2,3", "1,2,3"]).map((o) => ({
          value: o.value,
          label: o.value
            .split(",")
            .map(
              (x) =>
                ["First month", "Second month", "Third month"][Number(x) - 1],
            )
            .join(", "),
        })),
        { required: true },
      ),
    );
  d.schedules.push({
    id: "fringe",
    title: "Fringe benefits tax computation",
    rows: (revised
      ? [
          [1, 65, 35],
          [2, 75, 25],
        ]
      : [
          [320, 85, 15],
          [330, 75, 25],
          [360, 65, 35],
        ]
    ).map(([n, divisor, rate]) => ({
      id: `fringe-${n}`,
      label:
        rate === 35
          ? "Citizens and resident / engaged aliens"
          : rate === 25
            ? "Non-resident aliens not engaged in business"
            : "Qualifying employees of multinationals",
      fields: [
        m(
          p,
          revised ? `Sched1:txtValue${n}` : `txtFringe${n}`,
          "Monetary value of benefit",
        ),
        f(
          p,
          revised ? `Sched1:txtDivisor${n}` : `divisor${n}`,
          "Gross-up divisor (%)",
          "number",
          { readonly: true, defaultValue: String(divisor) },
        ),
        m(
          p,
          revised ? `Sched1:txtTaxBase${n}` : `txtBase${n}`,
          "Grossed-up monetary value",
          true,
        ),
        f(
          p,
          revised ? `Sched1:txtTaxRate${n}` : `rate${n}`,
          "Tax rate (%)",
          "number",
          { readonly: true, defaultValue: String(rate) },
        ),
        m(
          p,
          revised ? `Sched1:txtTaxWithheld${n}` : `txtReq${n}`,
          "Tax withheld",
          true,
        ),
      ],
    })),
  });
  if (revised) {
    moneySection(d, [
      ["txtTax14", "14 Taxes withheld from schedule", true],
      ["txtTax15", "15 Previously remitted on amended return"],
      ["txtTax16", "16 Other remittances"],
      ["txtTax17", "17 Total remittances", true],
      ["txtTax18", "18 Tax still due / overremittance", true],
    ]);
    d.sections
      .at(-1)!
      .fields.push(
        ...penalties(p, ["txtTax19", "txtTax20", "txtTax21"], "txtTax22"),
        m(p, "txtTax23", "23 Total amount still due", true),
      );
  } else {
    moneySection(d, [
      ["txt18A", "18A Total monetary value", true],
      ["txt18B", "18B Total tax withheld", true],
      ["txt19", "19 Previously remitted on amended return"],
      ["txt20", "20 Tax still due / overremittance", true],
    ]);
    d.sections
      .at(-1)!
      .fields.push(
        ...penalties(p, ["txt21A", "txt21B", "txt21C"], "txt21D"),
        m(p, "txt22", "22 Total amount still due / overremittance", true),
      );
  }
  definitions.push(d);
}
for (const code of ["1602", "1602Qv2018"]) {
  const revised = code.includes("v2018"),
    d = base(
      code,
      revised
        ? "Quarterly Remittance of Final Income Taxes Withheld on Interest Paid"
        : "Monthly Remittance of Final Income Taxes Withheld on Interest Paid",
      revised ? "quarter" : "month",
      revised ? "txt28" : "txt37",
      revised ? "revised" : "legacy",
    );
  const p = d.prefix;
  relief(d);
  const domesticCodes = [
    "WI161",
    "WC161",
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
  const domesticLabels = [
    "Individual — bank deposits",
    "Corporation — bank deposits",
    "Individual — deposit substitutes",
    "Corporation — deposit substitutes",
    "Individual — trust funds",
    "Corporation — trust funds",
    "Individual — other interest",
    "Corporation — other interest",
    "Preterminated deposits — less than 3 years",
    "Preterminated deposits — 3 to less than 4 years",
    "Preterminated deposits — 4 to less than 5 years",
    "Corporation — preterminated deposits",
    "Individual — foreign currency",
    "Corporation — foreign currency",
    "Withdrawals from decedent deposit",
  ];
  if (revised) {
    d.schedules.push({
      id: "interest",
      title: "Schedule 1 — Interest at regular rates",
      rows: domesticCodes.map((atc, i) => ({
        id: `interest-${i + 1}`,
        label: `${i + 1} ${atc} — ${domesticLabels[i]}`,
        fields: [
          m(
            p,
            `txtSched1Amount${i + 1}`,
            i === 12 || i === 13
              ? "Interest in foreign currency"
              : "Interest / amount",
          ),
          f(p, `txtSched1TaxRate${i + 1}`, "Rate (%)", "number", {
            readonly: true,
            defaultValue: String(
              i === 9
                ? 12
                : i === 10
                  ? 5
                  : i === 14
                    ? 6
                    : i === 12 || i === 13
                      ? 15
                      : 20,
            ),
          }),
          ...(i === 12 || i === 13
            ? [f(p, `txtSched1Rate${i + 1}`, "BSP exchange rate", "number")]
            : []),
          m(p, `txtSched1Tax${i + 1}`, "Tax withheld", true),
        ],
      })),
      totals: [m(p, "txtSched1Total", "Total regular-rate tax", true)],
    });
    for (const n of [2, 3])
      d.schedules.push({
        id: n === 2 ? "interest-treaty" : "interest-preferential",
        title: `Schedule ${n} — ${n === 2 ? "Treaty" : "Preferential"} rates`,
        rows: [1, 2].map((i) => ({
          id: `interest-${n}-${i}`,
          label: String(i),
          fields:
            n === 2
              ? [
                  f(p, `txtSched2TreatyCode${i}`, "Treaty code"),
                  f(p, `txtSched2ATC${i}`, "ATC"),
                  m(p, `txtSched2Interest${i}`, "Total interest"),
                  f(p, `txtSched2TaxRate${i}`, "Rate (%)", "number"),
                  m(p, `txtSched2TaxesWithheld${i}`, "Tax withheld", true),
                ]
              : [
                  f(
                    p,
                    `txtSched3IPA${i}`,
                    "Investment promotion agency (IPA) code",
                  ),
                  m(p, `txtSched3TotInterest${i}`, "Total interest"),
                  f(p, `txtSched3TaxRate${i}`, "Rate (%)", "number"),
                  m(p, `txtSched3TaxWithheld${i}`, "Tax withheld", true),
                ],
        })),
        totals: [m(p, `txtSched${n}Total`, "Schedule total", true)],
      });
    moneySection(d, [
      ["txt14", "14 Tax at regular rates", true],
      ["txt15", "15 Tax at treaty rates", true],
      ["txt16", "16 Tax at preferential rates", true],
      ["txt17", "17 Total tax withheld", true],
      ["txt18", "18 First-month remittance"],
      ["txt19", "19 Second-month remittance"],
      ["txt20", "20 Previously remitted on amended return"],
      ["txt21", "21 Overremittance from previous quarter"],
      ["txt22", "22 Total remittances", true],
      ["txt23", "23 Tax still due / overremittance", true],
    ]);
    d.sections
      .at(-1)!
      .fields.push(
        ...penalties(p, ["txt24", "txt25", "txt26"], "txt27"),
        m(p, "txt28", "28 Total amount still due / overremittance", true),
        select(
          p,
          "overpaymentOption",
          "Disposition of overremittance",
          opts(["Refund", "Tax credit certificate", "Carry forward"]),
        ),
      );
  } else {
    const domestic = Array.from({ length: 10 }, (_, i) => i + 14);
    d.schedules.push({
      id: "interest",
      title: "Section A — Interest at regular rates",
      rows: [
        ...domestic.map((n) => ({
          id: `interest-${n}`,
          label: `Item ${n}`,
          fields: [
            m(p, `txt${n}A`, "Amount of interest"),
            f(p, `txt${n}B`, "Rate (%)", "number", {
              readonly: true,
              defaultValue: "20",
            }),
            m(p, `txt${n}C`, "Tax withheld", true),
          ],
        })),
        ...[24, 25].map((n) => ({
          id: `interest-${n}`,
          label:
            n === 24
              ? "Individual — foreign currency"
              : "Corporation — foreign currency",
          fields: [
            m(p, `txt${n}A`, "Interest in foreign currency"),
            f(p, `txt${n}B`, "Rate (%)", "number", {
              readonly: true,
              defaultValue: "15",
            }),
            f(p, `txt${n}C`, "Conversion factor", "number"),
            m(p, `txt${n}D`, "Tax withheld", true),
          ],
        })),
        ...["D", "G"].map((suffix, i) => ({
          id: `interest-22${suffix}`,
          label: `Preterminated deposits — ${i === 0 ? "3 to less than 4" : "4 to less than 5"} years`,
          fields: [
            m(p, `txt22${suffix}`, "Interest"),
            f(p, `rate22${suffix}`, "Rate (%)", "number", {
              readonly: true,
              defaultValue: i === 0 ? "12" : "5",
            }),
            m(p, i === 0 ? "txt22F" : "txt22I", "Tax withheld", true),
          ],
        })),
      ],
    });
    for (const [id, label, ns] of [
      ["interest-treaty", "Section B — Treaty rates", [27, 28]],
      ["interest-preferential", "Section C — Preferential rates", [30, 31]],
    ] as const)
      d.schedules.push({
        id,
        title: label,
        rows: ns.map((n) => ({
          id: `interest-${n}`,
          label: `Item ${n}`,
          fields: [
            f(p, `txt${n}`, "Treaty / special rate code"),
            f(p, `txt${n}A`, "ATC"),
            m(p, `txt${n}B`, "Interest"),
            f(p, `txt${n}C`, "Rate (%)", "number"),
            m(p, `txt${n}D`, "Tax withheld", true),
          ],
        })),
      });
    d.schedules.push({
      id: "interest-books",
      title: "Schedule 1 — Interest expense per books",
      rows: Array.from({ length: 10 }, (_, i) => ({
        id: `books-${i + 1}`,
        label: `${i + 1}`,
        fields: [
          m(p, `txtReg${i + 1}`, "Regular banking unit"),
          m(p, `txtForeign${i + 1}`, "Foreign currency deposit unit"),
          m(p, `txtTotal${i + 1}C`, "Total", true),
          m(p, `txtInst${i + 1}`, "Financial institution"),
        ],
      })),
      totals: ["A", "B", "C", "D"].map((s, i) =>
        m(
          p,
          `txtTotal${s}`,
          [
            "Regular banking total",
            "Foreign currency total",
            "Total interest",
            "Financial institutions total",
          ][i],
          true,
        ),
      ),
    });
    moneySection(d, [
      ["txt26", "26 Total regular-rate tax", true],
      ["txt29", "29 Total treaty-rate tax", true],
      ["txt32", "32 Total preferential-rate tax", true],
      ["txt33", "33 Total tax withheld", true],
      ["txt34", "34 Previously remitted on amended return"],
      ["txt35", "35 Tax still due / overremittance", true],
    ]);
    d.sections
      .at(-1)!
      .fields.push(
        ...penalties(p, ["txt36A", "txt36B", "txt36C"], "txt36D"),
        m(p, "txt37", "37 Total amount still due / overremittance", true),
      );
  }
  definitions.push(d);
}
for (const code of ["1604C", "1604CF", "1604E", "1604Ev2018", "1604F"]) {
  const revised = ["1604C", "1604Ev2018", "1604F"].includes(code),
    newE = code === "1604Ev2018";
  const d = base(
    code,
    code === "1604C"
      ? "Annual Information Return of Income Taxes Withheld on Compensation"
      : code === "1604CF"
        ? "Annual Information Return of Income Taxes Withheld on Compensation and Final Withholding Taxes"
        : code === "1604F"
          ? "Annual Information Return of Income Payments Subjected to Final Withholding Taxes"
          : "Annual Information Return of Creditable Income Taxes Withheld (Expanded)",
    "year",
    newE ? "txtSched1TotRemAmtTtl" : "txtSched1Total",
    revised ? "revised" : "legacy",
    `frm${code.replace("v2018", "").toLowerCase()}:`,
  );
  const p = d.prefix;
  const schedules =
    code === "1604C"
      ? [[1, 12, "Compensation (1601-C)", true]]
      : code === "1604CF"
        ? [
            [1, 12, "Compensation", true],
            [2, 12, "Final withholding", false],
            [3, 12, "Interest withholding", false],
            [4, 4, "Fringe benefits", false],
          ]
        : code === "1604F"
          ? [
              [1, 4, "Final withholding (1601-FQ)", false],
              [2, 4, "Interest withholding (1602-Q)", false],
              [3, 4, "Fringe benefits (1603-Q)", false],
            ]
          : [
              [
                1,
                newE ? 4 : 12,
                newE
                  ? "Expanded withholding (1601-EQ)"
                  : "Expanded withholding",
                false,
              ],
              [2, 12, "Real property withholding (1606)", false],
            ];
  for (const [n, count, title, adjust] of schedules as [
    number,
    number,
    string,
    boolean,
  ][]) {
    const root = `txtSched${n}`;
    const names = newE
      ? [
          "RemDate",
          "BankCode",
          "TRANo",
          "TaxWithheld",
          "Penalties",
          "TotRemAmt",
        ]
      : [
          "Date",
          "BankVal",
          code === "1604F" ? "TRA" : "Reference",
          "TaxWheld",
          "Pen",
          "TotalAmt",
        ];
    const totalNames = newE
      ? ["TaxWithheldTtl", "PenaltiesTtl", "TotRemAmtTtl"]
      : ["TaxWheldTotal", "PenTotal", "Total"];
    d.schedules.push({
      id: `remittances-${n}`,
      title: `Schedule ${n} — ${title}`,
      rows: Array.from({ length: count }, (_, i) => ({
        id: `remittance-${n}-${i + 1}`,
        label: count === 4 ? `Quarter ${i + 1}` : withholdingMonths[i],
        fields: [
          f(p, `${root}${names[0]}${i + 1}`, "Date remitted", "date"),
          ...(code === "1604F"
            ? []
            : [f(p, `${root}${names[1]}${i + 1}`, "Bank / agency")]),
          ...(["1604CF", "1604E"].includes(code)
            ? []
            : [
                f(
                  p,
                  code === "1604C"
                    ? `txtTra${i + 1}`
                    : `${root}${names[2]}${i + 1}`,
                  "TRA / receipt / reference",
                ),
              ]),
          m(p, `${root}${names[3]}${i + 1}`, "Tax withheld"),
          ...(adjust
            ? [
                m(p, `${root}Adj${i + 1}`, "Adjustment", false, {
                  allowNegative: true,
                }),
              ]
            : []),
          m(p, `${root}${names[4]}${i + 1}`, "Penalties"),
          m(p, `${root}${names[5]}${i + 1}`, "Total remitted", true),
        ],
      })),
      totals: [
        m(p, root + totalNames[0], "Total tax withheld", true),
        ...(adjust ? [m(p, root + "AdjTotal", "Total adjustments", true)] : []),
        m(p, root + totalNames[1], "Total penalties", true),
        m(p, root + totalNames[2], "Total remitted", true),
      ],
    });
  }
  if (code === "1604C" || code === "1604CF")
    d.sections[0].fields.push(
      select(
        p,
        "releasedOfFunds",
        "Refund of excess withholding released?",
        yesNo,
        { defaultValue: "N" },
      ),
      f(p, "refundDate", "Date refunded", "date", {
        required: true,
        showWhen: { field: p + "releasedOfFunds", value: "Y" },
      }),
      m(p, "txt12", "12 Total overremittance", false, {
        required: true,
        showWhen: { field: p + "releasedOfFunds", value: "Y" },
      }),
      select(p, "select13", "13 Month of first crediting", months, {
        required: true,
        showWhen: { field: p + "releasedOfFunds", value: "Y" },
      }),
    );
  if (code === "1604C" || code === "1604Ev2018" || code === "1604F")
    d.sections[0].fields.push(
      select(p, "topAgent", "Top withholding agent?", yesNo, {
        defaultValue: "N",
      }),
    );
  if (code === "1604F") relief(d);
  definitions.push(d);
}
{
  const d = base(
    "1606",
    "Withholding Tax Remittance Return for Onerous Transfer of Real Property",
    "date",
    "txtTotal",
  );
  const p = d.prefix;
  d.minYear = 1904;
  d.sections[1].title = "Buyer / withholding agent";
  d.sections[1].fields = d.sections[1].fields.filter(
    (field) =>
      !["zipCode", "contactNumber", "address2"].includes(
        field.profileKey ?? "",
      ),
  );
  d.sections[0].fields.push(
    select(
      p,
      "atc",
      "13 ATC",
      [
        { value: "WI155", label: "WI155 — Individual seller" },
        { value: "WC155", label: "WC155 — Corporate seller" },
      ],
      { required: true },
    ),
  );
  d.sections.push(
    section("seller", "Seller details", [
      f(p, "sellerTin", "Seller TIN", "text", { required: true }),
      f(p, "sellerRdo", "Seller RDO code", "text", { required: true }),
      f(p, "txtSellerName", "Seller name", "text", { required: true }),
      f(p, "sellerAddress", "Seller address", "text", { required: true }),
    ]),
  );
  d.sections.push(
    section("property", "Property and transaction", [
      select(
        p,
        "propertyType",
        "Property type",
        opts([
          "Residential",
          "Agricultural",
          "Commercial",
          "Industrial",
          "Residential condominium",
          "Commercial condominium",
          "Others",
        ]),
        { required: true },
      ),
      f(p, "txtLocation", "Location of property", "text", { required: true }),
      f(p, "propertyRdo", "Property RDO code", "text", { required: true }),
      f(p, "txtTCT", "TCT / OCT / CCT number", "text", { required: true }),
      f(p, "txtArea", "Area sold (square metres)", "number"),
      f(p, "txtTaxDC", "Tax declaration number"),
      // Original Item 18 has no checked default or mandatory-validation branch.
      select(
        p,
        "j_id394",
        "18 Does the selling price cover more than one property?",
        yesNo,
      ),
      select(
        p,
        "transactionType",
        "Transaction",
        opts([
          "Cash sale",
          "Foreclosure sale",
          "Installment sale",
          "Exempt",
          "Others",
        ]),
        { required: true },
      ),
      f(p, "txtOthers20", "Exempt / other transaction description"),
      select(
        p,
        "Habitual",
        "Seller habitually engaged in real estate?",
        yesNo,
        { required: true },
      ),
      m(p, "txtSelling", "21 Selling price"),
      m(p, "txtCost", "22 Cost and other expenses"),
      m(p, "txtMortgage", "23 Mortgage assumed"),
      m(p, "txtTotalP", "24 Payments in initial year"),
      m(p, "txtAmount", "25 Amount of this installment"),
      f(p, "txtTotalN", "26 Number of installments", "number"),
    ]),
  );
  relief(d);
  moneySection(d, [
    ["txtFMVLand", "27A Land value per tax declaration"],
    ["txtFMVImprovements", "27B Improvements per tax declaration"],
    ["txtFMVZonal", "27C Zonal land value"],
    ["txtFMVBIR", "27D BIR improvements value"],
    ["txtFMVLI", "28B Fair market value of land and improvements", true],
    ["txtGross", "28A Gross selling price"],
    ["txtBid", "28C Bid price"],
    ["txtInstallment", "28D Installment collected"],
    ["txtOthers28E", "28E Other applicable amount"],
    ["txtTax", "30 Taxable base", true],
  ]);
  d.sections
    .at(-1)!
    .fields.push(
      select(
        p,
        "txtTaxRate",
        "31 Tax rate (%)",
        opts(["0", "1.5", "3", "5", "6"]),
        { required: true },
      ),
      m(p, "txtTaxR", "32 Tax required to be withheld", true),
      m(p, "txtLess", "33 Previously remitted on amended return"),
      m(p, "txtTaxDue", "34 Tax still due / overremittance", true),
      ...penalties(
        p,
        ["txtSurcharge", "txtInterest", "txtCompromise"],
        "txtTotalPenalties",
      ),
      m(p, "txtTotal", "36 Total amount still due / overremittance", true),
      select(
        p,
        "overpaymentOption",
        "37 Disposition of overremittance",
        opts(["Refund", "Tax credit certificate"]),
      ),
    );
  definitions.push(d);
}
// Presentation groups retain each field's original calculation and persistence key.
for (const d of definitions) {
  for (const section of d.sections) {
    if (section.id !== "computation") continue;
    for (const field of section.fields) {
      if (
        !field.group &&
        /previous|previously|first-month remittance|second-month remittance|other (?:tax )?(?:payments|remittances)|total (?:tax )?(?:payments|remittances|credits)/i.test(
          field.label,
        )
      )
        field.group = "credits";
    }
  }
}
export const withholdingDefinitions: readonly WithholdingDefinition[] =
  definitions;
export function getWithholdingDefinition(
  code: string,
): WithholdingDefinition | undefined {
  return definitions.find((d) => d.code === code);
}
export function withholdingFields(
  d: WithholdingDefinition,
  values: Record<string, string> = {},
): WithholdingField[] {
  return [
    ...d.sections.flatMap((s) => s.fields),
    ...withholdingSchedules(d, values).flatMap((s) => [
      ...s.rows.flatMap((r) => r.fields),
      ...(s.totals ?? []),
    ]),
  ];
}

/** Valid, reachable ten-column records from evidence/atc-rates.json; no malformed-row repair. */
export const withholdingAtcRecords: readonly {
  form: string;
  code: string;
  description: string;
  rate: string;
  category: string;
}[] = [
  {
    form: "1600",
    code: "WV010",
    description: "VAT WITHHOLDING  ON  PURCHASE OF GOODS",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WV020",
    description: "VAT WITHHOLDING  ON  PURCHASE OF  SERVICES",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WV030",
    description: "VAT WITHHOLDING  ON  GOVERNMENT PUBLIC WORK CONTRACTS",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB030",
    description: "TAX ON CARRIERS AND KEEPERS OF GARAGES",
    rate: "3.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB040",
    description: "FRANCHISE TAX ON GAS AND WATER UTILITIES",
    rate: "2.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB050",
    description:
      "FRANCHISE TAX ON RADIO & TV BROADCASTING COMPANIES WHOSE ANNUAL GROSS RECEIPTS DO NOT EXCEED P10 M & WHO ARE NOT VAT-REGISTERED TAXPAYERS",
    rate: "3.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB070",
    description: "TAX ON LIFE INSURANCE PREMIUMS",
    rate: "2.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB090",
    description:
      "TAX ON OVERSEAS DISPATCH, MESSAGE OR CONVERSATION FROM THE PHILIPPINES",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB120",
    description:
      "BUSINESS TAX ON AGENTS OF FOREIGN INSURANCE CO.- INSURANCE AGENTS",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB121",
    description:
      "BUSINESS TAX ON AGENTS OF  FOREIGN  INSURANCE CO.- OWNER OF THE PROPERTY",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB130",
    description: "TAX ON INTERNATIONAL CARRIERS",
    rate: "3.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB140",
    description: "TAX ON COCKPITS",
    rate: "18.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB150",
    description: "TAX ON CABARET, NIGHT AND DAY CLUBS",
    rate: "18.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB160",
    description: "TAX  ON BOXING EXHIBITIONS",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB170",
    description: "TAX ON PROFESSIONAL BASKETBALL GAMES",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB180",
    description: "TAX ON JAI - ALAI AND RACE TRACKS",
    rate: "30.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB200",
    description:
      "TAX ON SALE, BARTER OR EXCHANGE OF STOCKS LISTED & TRADED THROUGH LOCAL STOCK EXCHANGE",
    rate: "0.5",
    category: "G",
  },
  {
    form: "1600",
    code: "WB201",
    description:
      "TAX ON SHARES OF STOCK SOLD OR EXCHANGED THROUGH INITIAL AND SECONDARY PUBLIC OFFERING: -  NOT OVER 25%",
    rate: "4.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB202",
    description:
      "TAX ON SHARES OF STOCK SOLD OR EXCHANGED THROUGH INITIAL AND SECONDARY PUBLIC OFFERING: -  OVER 25% BUT NOT EXCEEDING 33 1/3 %",
    rate: "2.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB203",
    description:
      "TAX ON SHARES OF STOCK SOLD OR EXCHANGED THROUGH INITIAL AND SECONDARY PUBLIC OFFERING: -  OVER 33 1/3%",
    rate: "1.0",
    category: "G",
  },
  {
    form: "0605",
    code: "FP010",
    description: "FINES AND PEN - ON TAX ON INCOME",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP020",
    description: "FINES AND PEN - ON TAX ON TRANSFERS OF PROPERTY",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP030",
    description: "FINES AND PEN - ON VALUE-ADDED TAX",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP040",
    description: "FINES AND PEN - ON OTHER PERCENTAGE TAXES",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP042",
    description: "FINES AND PEN - ON STOCK TRANS (IPO) ",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP050",
    description: "FINES AND PEN - ON EXCISE TAXES",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP051",
    description: "FINES AND PEN - ON EXCISE SPECIFIC",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP060",
    description: "FINES AND PEN - ON DOCUMENTARY STAMP TAXES",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP070",
    description: "FINES AND PEN - ON MISCELLANEOUS TAXES",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP071",
    description: "FINES AND PEN - ON ENERGY TAX",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP090",
    description: "OTHERS FINES AND PENALTIES",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP100",
    description: "FINES AND PEN - CAPITAL GAINS",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP110",
    description: "FINES AND PEN - ON COMPENSATION",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP120",
    description: "FINES AND PEN - ON FINAL",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP130",
    description: "FINES AND PEN - ON EXPANDED",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP140",
    description: "FINES AND PEN - GOVERNMENT MONEY",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP141",
    description: "FINES AND PEN - WINNING AND PRIZES",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP150",
    description: "FINES AND PEN - BANKS AND FINANCIAL INSTITUTION",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP160",
    description: "FINES AND PEN - ESTATE TAX",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP170",
    description: "FINES AND PEN - DONORS TAX",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP180",
    description: "FINES AND PEN - W/T ON REAL PROP/M VEHICLES NOT SUBJ TO CG",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP190",
    description: "FINES AND PEN - REGISTRATION FEE",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "FP930",
    description: "FINES AND PEN - INSPECTION FEES",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "II011",
    description: "PURE COMPENSATION",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "II012",
    description: "PURE BUSINESS",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "II013",
    description: "MIXED INCOME",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "MC010",
    description: "TAX AMNESTY ON INCOME (INDIVIDUAL)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "MC020",
    description: "TAX AMNESTY ON INCOME (CORPORATE)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "MC030",
    description: "COMP. PYMTS ON DELQNT. ACCOUNTS AND DISP. ASSESSMENTS",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "MC031",
    description: "DEFICIENCY TAX",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "MC040",
    description: "INCOME FROM FORFEITED PROPERTIES",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "MC050",
    description: "PROCEEDS FROM RESALE OF ESTATE TAKEN FOR TAXES",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "MC060",
    description: "ENERGY TAX ON EXCESS ELECTRIC POWER CONSUMPTION",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "MC090",
    description: "TIN CARD FEES",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "MC180",
    description: "REGISTRATION FEE FOR VAT/NON-VAT TAXPAYERS",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "MC190",
    description: "TRAVEL TAX",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "MC200",
    description: "OTHER MISCELLANEOUS TAXES",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "MC210",
    description: "MISCELLANEOUS TAXES - OTHER TAX REVENUE",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "MC220",
    description: "ADVANCE PAYMENT OF VALUE ADDED TAX ON PRIVILEGE STORE",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "MC230",
    description: "ADVANCE PAYMENT OF INCOME TAX  ON PRIVILEGE STORE",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "MC240",
    description: "ADVANCE PAYMENT OF PERCENTAGE TAX ON PRIVILEGE STORE",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "VM160",
    description: "VAT ON MANUFACTURING - SUGAR",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XA010",
    description: "DIST SPIR PROD FR SAP OF NIPA, ETC UND SEC 138(a)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XA020",
    description: "DIST SPIRIT PROD IN A POT STILL",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XA031",
    description: "DIST SPRT O.T. SAP OF NIPA, ETC UND SEC. 141 (B)(1)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XA032",
    description: "DIST SPRT O.T. SAP OF NIPA, ETC UND SEC. 141 (B)(2)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XA033",
    description: "DIST SPRT O.T. SAP OF NIPA, ETC UND SEC. 141 (B)(3)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XA040",
    description: "MEDICINAL PREP FLAVORING EXTRACTS AND ALL OTHER PREP",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XA051",
    description: "BEER, LGR BEER, ALE, PRTR FERMIN LIQ, ETC UND SEC 143 (A)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XA052",
    description: "BEER, LGR BEER, ALE, PRTR FERMIN LIQ, ETC UND SEC 143 (B)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XA053",
    description: "BEER, LGR BEER, ALE, PRTR FERMIN LIQ, ETC UND SEC 143 (C)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XA061",
    description: "SPARKLING WINES/CHAMPAGNE, ETC UND SEC 142 (A)(1)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XA062",
    description: "SPARKLING WINES/CHAMPAGNE, ETC UND SEC 142 (A)(2)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XA070",
    description: "STILL WINES CONTAINING 14% ALCOHOL OR LESS ALCOHOL",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XA080",
    description: "STILL WINES CONTAINING OVER 14% ALCOHOL",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XA090",
    description: "FORTIFIED WINES",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XB010",
    description: "SWEETENED JUICE DRINKS",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XB020",
    description: "SWEETENED TEA",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XB030",
    description: "CARBONATED BEVERAGES",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XB040",
    description: "FLAVORED WATER",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XB050",
    description: "ENERGY AND SPORTS DRINKS",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XB060",
    description:
      "POWDERED DRINKS NOT CLASSIFIED AS MILK, JUICE, TEA AND COFFEE",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XB070",
    description: "CEREAL AND GRAIN BEVERAGES",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XB080",
    description: "OTHER NON-ALCOHOLIC BEVERAGES THAT CONTAIN ADDED SUGAR",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XB090",
    description: "USING PURELY HIGH FRUCTOSE CORN SYRUP",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XB100",
    description: "USING PURELY COCONUT SAP SUGAR AND PURELY STEVIOL GLYCOSIDES",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XC010",
    description: "PERFORMANCE OF SERVICES ON INVASIVE COSMETIC PROCEDURES",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XG020",
    description: "AUTOMOBILES (GASOLINE), ENGINE DISPL UP TO 1600CC",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XG030",
    description: "AUTOMOBILES (GASOLINE), ENGINE DISPL OF 1601 TO 2000CC",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XG040",
    description: "AUTOMOBILES (GASOLINE), ENGINE DISPL OF 2001 TO 2700CC",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XG050",
    description: "AUTOMOBILES (GASOLINE), ENG DISPL 2701 OR OVER",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XG060",
    description: "AUTOMOBILES (DIESEL), ENG DISPL UP TO 1800CC",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XG070",
    description: "AUTOMOBILES (DIESEL), ENG DISPL OF 1801 TO 2300CC",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XG080",
    description: "AUTOMOBILES (DIESEL), ENG DISPL OF 2301 TO 3000CC",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XG090",
    description: "AUTOMOBILES (DIESEL), ENG DISPL OF 3001CC OR OVER",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XG100",
    description: "JEWELRY",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XG110",
    description: "PERFUMES AND TOILET WATERS",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XG120",
    description: "YACHTS AND OTHER VESSELS INTENDED FOR PLEASURE",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XM010",
    description: "COAL AND COKE",
    rate: "<!--10.00/null-->",
    category: "",
  },
  {
    form: "0605",
    code: "XM020",
    description: "NON-METALLIC MINERALS AND QUARRY RESOURCES",
    rate: "2.0",
    category: "",
  },
  {
    form: "0605",
    code: "XM030",
    description: "GOLD AND CHROMITE",
    rate: "2.0",
    category: "",
  },
  {
    form: "0605",
    code: "XM040",
    description: "COPPER AND OTHER METALLIC MINERALS",
    rate: "2.0",
    category: "",
  },
  {
    form: "0605",
    code: "XM050",
    description: "INDIGENOUS PETROLEUM",
    rate: "3.0",
    category: "",
  },
  {
    form: "0605",
    code: "XM051",
    description: "LOCALLY EXTRACTED NATURAL GAS AND LIQUIFIED NATURAL GAS",
    rate: "2.0",
    category: "",
  },
  {
    form: "0605",
    code: "XP010",
    description: "LUBRICATING OIL",
    rate: "<!--P4.50/Liter-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP020",
    description: "GREASE",
    rate: "<!--P4.50/Kilo-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP030",
    description: "PROCESSED GAS",
    rate: "<!--P0.05/Liter-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP040",
    description: "WAXES AND PETROLATUM",
    rate: "<!--P3.50/Kilo-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP060",
    description: "PREMIUM GASOLINE - UNLEADED",
    rate: "<!--P4.35/Liter-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP070",
    description: "PREMIUM GASOLINE - LEADED",
    rate: "<!--P5.35/Liter-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP080",
    description: "REGULAR GASOLINE",
    rate: "<!--P4.35/Liter-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP090",
    description: "NAPTHA",
    rate: "<!--P4.35/Liter-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP100",
    description: "NAPTHA TO USED FOR PETRO-CHEMICAL",
    rate: "<!--P0.0/Liter-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP110",
    description: "AVIATION GASOLINE",
    rate: "<!--P5.35/Liter-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP120",
    description: "AVIATION TURBO JET FUEL",
    rate: "<!--P3.67/Liter-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP130",
    description: "KEROSENE",
    rate: "<!--P0.0/Liter-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP131",
    description: "KEROSENE USED AS AVIATION FUEL",
    rate: "<!--P3.67/Liter-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP140",
    description: "DIESEL FUEL AND SIMILAR FUEL OILS",
    rate: "<!--P0.0/Liter-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP150",
    description: "LPG USED FOR MOTIVE POWER",
    rate: "<!--P0.0/Liter-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP160",
    description: "LPG",
    rate: "<!--P0.0/Kilo-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP170",
    description: "ASPHALTS",
    rate: "<!--P0.56/Kilo-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP180",
    description: "BUNKER/REFINERY FUEL/FEEDSTOCK",
    rate: "<!--P0.0/Liter-->",
    category: "",
  },
  {
    form: "0605",
    code: "XP190",
    description: "BASESTOCKS FOR LUBRICATING OIL SAND GREASES, HVD, ETC.",
    rate: "<!--P4.5/Liter-->",
    category: "",
  },
  {
    form: "0605",
    code: "XT010",
    description: "SMOKING TOBACCO AND OTHER PARTIALLY MANUF TOBACCO",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XT020",
    description: "CHEWING TOBACCO",
    rate: "0.94",
    category: "",
  },
  {
    form: "0605",
    code: "XT030",
    description: "CIGARS",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XT040",
    description: "CIGARETTES PACKED BY HAND",
    rate: "2.72",
    category: "",
  },
  {
    form: "0605",
    code: "XT050",
    description: "CIGARETTES PACKED BY MACHINE, SEC 145 (C)(1)",
    rate: "28.30",
    category: "",
  },
  {
    form: "0605",
    code: "XT060",
    description: "CIGARETTES PACKED BY MACHINE, SEC 145 (C)(2)",
    rate: "12.0",
    category: "",
  },
  {
    form: "0605",
    code: "XT070",
    description: "CIGARETTES PACKED BY MACHINE, SEC 145 (C)(3)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XT080",
    description: "TOBACCO INSPECT FEES FOR EACH THOUSAND CIGARS",
    rate: "0.50",
    category: "",
  },
  {
    form: "0605",
    code: "XT090",
    description: "TOBACCO INSPECT FEES FOR EACH THOUSAND CIGARETTES",
    rate: "0.10",
    category: "",
  },
  {
    form: "0605",
    code: "XT100",
    description: "TOBACCO INSPECT FEE PER KG OF LEAF TOBACCO AND OTHER",
    rate: "0.02",
    category: "",
  },
  {
    form: "0605",
    code: "XT110",
    description: "PER KG OF SCRAPS AND OTHER MANUF TOBACCO PROD",
    rate: "0.03",
    category: "",
  },
  {
    form: "0605",
    code: "XT120",
    description: "ADDL IMPT BLENDING TOBACCO INSPECT AND MONITOR FEE",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "XT130",
    description: "CIGARETTES PACKED BY MACHINE, SEC. 145 (C)(4)",
    rate: "",
    category: "",
  },
  {
    form: "1601E",
    code: "WC010",
    description: "PROFL TALENT FEE PD TO JURIDICL (GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC011",
    description: "PROFL TALENT FEE PD TO JURIDICL (GROSS INC &gt; 720,000)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC050",
    description:
      "MANAGEMENT AND TECHNICAL CONSULTANTS (GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC051",
    description:
      "MANAGEMENT AND TECHNICAL CONSULTANTS (GROSS INC &gt; 720,000)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC515",
    description: "COMM OF INDPNT AND/OR EXCL SALES REP,MKTG AGENTS(CORP)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC535",
    description: "PYMTS MADE BY PRE-NEED CO. TO FUNERAL PARLORS(CORP)",
    rate: "1.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC540",
    description: "TOLLING FEE PAID TO REFINERIES(CORPORATE)",
    rate: "5.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC610",
    description: "PYMTS MADE TO SUPPLIERS OF AGRICULTURAL PRODUCTS(CORP)",
    rate: "1.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC630",
    description: "PYMTS ON PURCH-MINERALS,MINERAL PROD,QUARRY RESRCS(CORP)",
    rate: "5.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC632",
    description: "INCME PYMT ON PURCH OF GOLD BYBSPTO GOLDMINRS RA7076",
    rate: "5.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC640",
    description: "PYMT BY GOVT TO LOCAL/RSDNT SUPPLIER(CORP-GOODS)",
    rate: "1.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC650",
    description:
      "GROSS AMOUNT OF REFUND GIVEN BY MERALCO TO CUSTOMERS WITH ACTIVE CONTRACTS",
    rate: "25.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC651",
    description: "WITHHOLDING ON GROSS AMT OF REF TO MERALCO CUS-TERMINATED",
    rate: "32.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC660",
    description: "GROS OF INT RFUND OF MTER DPOSIT RESIDNTL ELECT&gt;200KW MER",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC661",
    description: "GROS OF INT RFUND OF MTER DPOSIT NONRES ELECT&gt;200KW MER",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC662",
    description: "GROS OF INT RFUND OF MTER DPOSIT RESIDNTL ELECT&gt;200KW DU",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC663",
    description: "GROS OF INT RFUND OF MTER DPOSIT NONRES ELECT>200KW DU",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI010",
    description: "PROFLS, LAWYERS,CPAS, ENGR (GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI011",
    description: "PROFLS, LAWYERS,CPAS, ENGR (GROSS INC &gt; 720,000)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI020",
    description:
      "PROF ENTRTNR-IF CURR YR GROSS INC DOESNT EXCEED P720,000 (IND.)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI021",
    description:
      "PROF ENTRTAINRS-IF CURRENT YR GROSS INC EXCEEDS P720,000 (IND.)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI030",
    description: "PROF ATH-IF CURR YR GROSS INC DOESNT EXCEED P720,000 (IND.)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI031",
    description:
      "PROF ATHLETES-IF CURRENT YR GROSS INC EXCEEDS P720,000 (IND.)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI040",
    description:
      "MOVIE,STAGE,ETC-IF CURR YR GROSS INC DOESNT EXCEED P720T (IND.)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI041",
    description:
      "MOVIE,STAGE,ETC-IF CURRENT YR GROSS INC EXCEEDS P720,000 (IND.)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI050",
    description:
      "MANAGEMENT AND TECHNICAL CONSULTANTS (GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI051",
    description: "MANAGEMENT AND TECHNICAL CONSULTANTS (GROSS INC &gt;720,000)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI060",
    description: "BUSINESS AND BOOKKEEPING AGENTS (GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI061",
    description: "BUSINESS AND BOOKKEEPING AGENTS (GROSS INC &gt; 720,000)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI070",
    description: "INSURANCE AGENTS AND ADJUSTERS (GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI071",
    description: "INSURANCE AGENTS AND ADJUSTERS (GROSS INC &gt; 720,000)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI080",
    description:
      "OTHER RCPNT OF TF-IF CURR YR GROSS INC DSNT EXCEED P720T (IND.)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI081",
    description:
      "OTHER RCPNT OF TF-IF CURR YR GROSS INC EXCEEDS P720,000 (IND.)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI090",
    description:
      "FEES OF DIRECTORS NOT EMPLOYEE OF COMP(GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI091",
    description:
      "FEES OF DIRECTORS NOT EMPLOYEE OF COMP(GROSS INC &gt; 720,000)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI100",
    description: "RENTALS (INDIVIDUAL)",
    rate: "5.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI110",
    description: "CINEM. FILM RENTALS -(INDIVIDUAL)",
    rate: "5.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI120",
    description: "CONTRACTORS (INDIVIDUAL)",
    rate: "2.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI130",
    description: "INCOME DISTRIBUTION TO BENEFICIARIES (IND.)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI140",
    description: "AMOUNTS PAID TO CERTAIN BROKERS AND AGENTS (IND.) ",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI141",
    description:
      "PYMTS FOR MED PRACTITIONRS THRU A DULY REG PROF PRTNRSHP (INC. &lt;= 720,000)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI142",
    description:
      "PAYMENTS FOR MED PRACTITIONERS THRU A DULY REG PROF PARTNERSHIP (INC &gt;720,000)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI150",
    description:
      "PYMT TO MED PRACTNRS THRU HOSP/CLINICS(GROSS INC &gt;720,000)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI151",
    description:
      "PYMT TO MED PRACTNRS THRU HOSP/CLINICS(GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI152",
    description:
      "PYMT TO PARTNERS IN PROF PARTNERSHIP (GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI153",
    description: "PYMT TO PARTNERS IN PROF PRTNSHIP (GROSS INC &gt; 720,000)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI156",
    description: "PAYMENTS MADE BY CREDIT CARD COMPANIES TO INDIVIDUALS",
    rate: "0.5",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI157",
    description: "PYMT BY GOVT TO LOCAL/RSDNT SUPPLIER(INDIV-SERVICES)",
    rate: "2.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI158",
    description:
      "INCOME PAYMENTS MADE BY TOP 20,000 PRIVATE CORPORATIONS TO THEIR LOCAL/RESIDENT SUPPLIERS OF GOODS OTHER THAN THOSE COVERED BY OTHER RATES OF WITHHOLDING TAX",
    rate: "1.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI159",
    description: "ADDL PAYMENTS TO GOVT PERSONNEL FROM IMPORTERS,SHIPPING",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI160",
    description:
      "INCOME PAYMENTS MADE BY TOP 20,000 PRIVATE CORPORATIONS TO THEIR LOCAL/RESIDENT SUPPLIERS OF SERVICES OTHER THAN THOSE COVERED BY OTHER RATES OF WITHHOLDING TAX",
    rate: "2.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI515",
    description: "COMM OF INDPNT AND/OR EXCL SALES REP,MKTG AGENTS OF CO.",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI530",
    description: "GROSS PYMTS TO EMBALMERS BY FUNERAL COMPANIES",
    rate: "1.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI535",
    description: "PYMTS MADE BY PRE-NEED CO. TO FUNERAL PARLORS",
    rate: "1.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI540",
    description: "TOLLING FEE PAID TO REFINERIES",
    rate: "5.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI610",
    description: "PYMTS MADE TO SUPPLIERS OF AGRICULTURAL PRODUCTS",
    rate: "1.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI630",
    description: "PYMTS ON PURCH-MINERALS,MINERAL PROD,QUARRY RESOURCES",
    rate: "5.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI632",
    description: "INCM PYMT ON PURCH OF GOLD BYBSPTO GOLDMINRS RA7076 IND",
    rate: "5.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI640",
    description: "PYMT BY GOVT TO LOCAL/RSDNT SUPPLIER(INDIV-GOODS)",
    rate: "1.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI650",
    description:
      "GROSS AMOUNT OF REFUND GIVEN BY MERALCO TO CUSTOMERS WITH ACTIVE CONTRACTS",
    rate: "25.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI651",
    description: "WITHHOLDING ON GROSS AMT OF REF TO MERALCO CUS-TERMINATED",
    rate: "32.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI660",
    description:
      "GROS OF INT RFUND OF MTER DPOSIT RESID ELECT&gt;200KW MER IND",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI661",
    description:
      "GROS OF INT RFUND OF MTER DPOSIT NONRS ELECT&gt;200KW MER IND",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI662",
    description: "GROS OF INT RFUND OF MTER DPOSIT RESID ELECT&gt;200KW DU IND",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI663",
    description: "GROS OF INT RFUND OF MTER DPOSIT NONRS ELECT&gt;200KW DU IND",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC010",
    description: "PROFL TALENT FEE PD TO JURIDICL (GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WC011",
    description: "PROFL TALENT FEE PD TO JURIDICL (GROSS INC &gt; 720,000)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WC050",
    description:
      "MANAGEMENT AND TECHNICAL CONSULTANTS (GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WC051",
    description:
      "MANAGEMENT AND TECHNICAL CONSULTANTS (GROSS INC &gt; 720,000)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WC515",
    description: "COMM OF INDPNT AND/OR EXCL SALES REP,MKTG AGENTS(CORP)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WC535",
    description: "PYMTS MADE BY PRE-NEED CO. TO FUNERAL PARLORS(CORP)",
    rate: "1.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WC540",
    description: "TOLLING FEE PAID TO REFINERIES(CORPORATE)",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WC610",
    description: "PYMTS MADE TO SUPPLIERS OF AGRICULTURAL PRODUCTS(CORP)",
    rate: "1.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WC630",
    description: "PYMTS ON PURCH-MINERALS,MINERAL PROD,QUARRY RESRCS(CORP)",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WC632",
    description: "INCME PYMT ON PURCH OF GOLD BYBSPTO GOLDMINRS RA7076",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WC640",
    description: "PYMT BY GOVT TO LOCAL/RSDNT SUPPLIER(CORP-GOODS)",
    rate: "1.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WC650",
    description:
      "GROSS AMOUNT OF REFUND GIVEN BY MERALCO TO CUSTOMERS WITH ACTIVE CONTRACTS",
    rate: "25.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WC651",
    description: "WITHHOLDING ON GROSS AMT OF REF TO MERALCO CUS-TERMINATED",
    rate: "32.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WC660",
    description: "GROS OF INT RFUND OF MTER DPOSIT RESIDNTL ELECT&gt;200KW MER",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WC661",
    description: "GROS OF INT RFUND OF MTER DPOSIT NONRES ELECT&gt;200KW MER",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WC662",
    description: "GROS OF INT RFUND OF MTER DPOSIT RESIDNTL ELECT&gt;200KW DU",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WC663",
    description: "GROS OF INT RFUND OF MTER DPOSIT NONRES ELECT>200KW DU",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI010",
    description: "PROFLS, LAWYERS,CPAS, ENGR (GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI011",
    description: "PROFLS, LAWYERS,CPAS, ENGR (GROSS INC &gt; 720,000)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI020",
    description:
      "PROF ENTRTNR-IF CURR YR GROSS INC DOESNT EXCEED P720,000 (IND.)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI021",
    description:
      "PROF ENTRTAINRS-IF CURRENT YR GROSS INC EXCEEDS P720,000 (IND.)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI030",
    description: "PROF ATH-IF CURR YR GROSS INC DOESNT EXCEED P720,000 (IND.)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI031",
    description:
      "PROF ATHLETES-IF CURRENT YR GROSS INC EXCEEDS P720,000 (IND.)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI040",
    description:
      "MOVIE,STAGE,ETC-IF CURR YR GROSS INC DOESNT EXCEED P720T (IND.)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI041",
    description:
      "MOVIE,STAGE,ETC-IF CURRENT YR GROSS INC EXCEEDS P720,000 (IND.)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI050",
    description:
      "MANAGEMENT AND TECHNICAL CONSULTANTS (GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI051",
    description: "MANAGEMENT AND TECHNICAL CONSULTANTS (GROSS INC &gt;720,000)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI060",
    description: "BUSINESS AND BOOKKEEPING AGENTS (GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI061",
    description: "BUSINESS AND BOOKKEEPING AGENTS (GROSS INC &gt; 720,000)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI070",
    description: "INSURANCE AGENTS AND ADJUSTERS (GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI071",
    description: "INSURANCE AGENTS AND ADJUSTERS (GROSS INC &gt; 720,000)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI080",
    description:
      "OTHER RCPNT OF TF-IF CURR YR GROSS INC DSNT EXCEED P720T (IND.)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI081",
    description:
      "other rcpnt of tf-if curr yr gross inc exceeds P720,000 (IND.)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI090",
    description:
      "FEES OF DIRECTORS NOT EMPLOYEE OF COMP(GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI091",
    description:
      "FEES OF DIRECTORS NOT EMPLOYEE OF COMP(GROSS INC &gt; 720,000)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI100",
    description: "RENTALS (INDIVIDUAL)",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI110",
    description: "CINEM. FILM RENTALS -(INDIVIDUAL)",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI120",
    description: "CONTRACTORS (INDIVIDUAL)",
    rate: "2.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI130",
    description: "INCOME DISTRIBUTION TO BENEFICIARIES (IND.)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI140",
    description: "AMOUNTS PAID TO CERTAIN BROKERS AND AGENTS (IND.)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI141",
    description:
      "PYMTS FOR MED PRACTITIONRS THRU A DULY REG PROF PRTNRSHP (INC. &lt;= 720,000)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI142",
    description:
      "PAYMENTS FOR MED PRACTITIONERS THRU A DULY REG PROF PARTNERSHIP (INC &gt;720,000)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI150",
    description:
      "PYMT TO MED PRACTNRS THRU HOSP/CLINICS(GROSS INC &gt;720,000)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI151",
    description:
      "PYMT TO MED PRACTNRS THRU HOSP/CLINICS(GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI152",
    description:
      "PAYM TO PARTNERS IN PROF PARTNERSHIP (GROSS INC &lt;= 720,000)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI153",
    description: "PYMT TO PARTNERS IN PROF PRTNSHIP (GROSS INC &gt; 720,000)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI156",
    description: "PAYMENTS MADE BY CREDIT CARD COMPANIES TO INDIVIDUALS",
    rate: "0.5",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI157",
    description: "PYMT BY GOVT TO LOCAL/RSDNT SUPPLIER(INDIV-SERVICES)",
    rate: "2.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI158",
    description:
      "INCOME PAYMENTS MADE BY TOP 20,000 PRIVATE CORPORATIONS TO THEIR LOCAL/RESIDENT SUPPLIERS OF GOODS OTHER THAN THOSE COVERED BY OTHER RATES OF WITHHOLDING TAX",
    rate: "1.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI159",
    description: "ADDL PAYMENTS TO GOVT PERSONNEL FROM IMPORTERS,SHIPPING",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI160",
    description:
      "INCOME PAYMENTS MADE BY TOP 20,000 PRIVATE CORPORATIONS TO THEIR LOCAL/RESIDENT SUPPLIERS OF SERVICES OTHER THAN THOSE COVERED BY OTHER RATES OF WITHHOLDING TAX",
    rate: "2.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI515",
    description: "COMM OF INDPNT AND/OR EXCL SALES REP,MKTG AGENTS OF CO.",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI530",
    description: "GROSS PYMTS TO EMBALMERS BY FUNERAL COMPANIES",
    rate: "1.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI535",
    description: "PYMTS MADE BY PRE-NEED CO. TO FUNERAL PARLORS",
    rate: "1.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI540",
    description: "TOLLING FEE PAID TO REFINERIES",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI610",
    description: "PYMTS MADE TO SUPPLIERS OF AGRICULTURAL PRODUCTS",
    rate: "1.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI630",
    description: "PYMTS ON PURCH-MINERALS,MINERAL PROD,QUARRY RESOURCES",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI632",
    description: "INCM PYMT ON PURCH OF GOLD BYBSPTO GOLDMINRS RA7076 IND",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI640",
    description: "PYMT BY GOVT TO LOCAL/RSDNT SUPPLIER(INDIV-GOODS)",
    rate: "1.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI650",
    description:
      "GROSS AMOUNT OF REFUND GIVEN BY MERALCO TO CUSTOMERS WITH ACTIVE CONTRACTS",
    rate: "25.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI651",
    description: "WITHHOLDING ON GROSS AMT OF REF TO MERALCO CUS-TERMINATED",
    rate: "32.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI660",
    description:
      "GROS OF INT RFUND OF MTER DPOSIT RESID ELECT&gt;200KW MER IND",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI661",
    description:
      "GROS OF INT RFUND OF MTER DPOSIT NONRS ELECT&gt;200KW MER IND",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI662",
    description: "GROS OF INT RFUND OF MTER DPOSIT RESID ELECT&gt;200KW DU IND",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI663",
    description: "GROS OF INT RFUND OF MTER DPOSIT NONRS ELECT&gt;200KW DU IND",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WC180",
    description:
      "FINAL TAX -INTEREST ON FOREIGN CURRENCY PAYABLE TO NON-RESIDENT FOREIGN CORPORATION",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC190",
    description:
      "FINAL TAX -INTEREST ON FOREIGN CURRENCY PAYABLE TO OFFSHORE BANKING UNIT/FOREIGN CURRENCY DEP. UNIT",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC191",
    description: "WITHOLDING TAX ON INCOME PAYMENT TO FCDUS",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC212",
    description:
      "CASH DIVIDEND PAYMENTS BY DOMESTIC CORPORATION TO CITIZENS AND RESIDENT ALIENS/NRFCs",
    rate: "30.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC213",
    description:
      "PROPERTY DIVIDEND PAYMENTS BY DOMESTIC CORPORATION TO CITIZENS AND RESIDENT ALIENS/NRFCs",
    rate: "30.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC222",
    description: "CASH DIVIDEND PAYMNT TO CORP TO NRFCS",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC223",
    description:
      "FT- PROPERTY DIVIDEND PAYMENT BY DOMESTIC CORP TO NFRC WHOSE COUNTRIES ALLOWED TAX DEEMED PAID CREDIT (SUBJ TO TAX SPARING RULE)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC230",
    description: "ON OTHER PAYMENTS TO NRFCs",
    rate: "30.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC250",
    description: "FINAL TAX -ON ROYALTIES PAID TO JURIDICAL PERSONS",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC280",
    description:
      "BRANCH PROFIT REMITTANCES BY ALL OTHER CORPS. EXCEPT EPZA REG",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC290",
    description:
      "FINAL TAX -ON LEASE/CHARTER FEES PAYABLE TO NON-RESIDENT LESSOR OF FOREIGN VESSELS",
    rate: "4.5",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC300",
    description:
      "FINAL TAX -ON LEASE/CHARTER FEES PAYABLE TO NON-RESIDENT LESSOR OF AIRCRAFT/MACHINES",
    rate: "7.5",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC310",
    description:
      "ON PYTS TO OIL EXPLORATION SERVICE CONTRACTORS AND SUBCONTRACTORS - CORPORATE",
    rate: "8.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC340",
    description:
      "ON PYT TO NON RESIDENT CINEMATOGRAPHIC FILM OWNER, LESSOR OR DISTRIBUTOR - CORPORATE",
    rate: "25.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC410",
    description: "FT-INFORMER CASH REWARD TO JURIDICAL PERSONS - CORPORATE",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WI202",
    description: "CASH DIVIDEND PAYMNT TO DOMESTIC CORP TO CITIZENS",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WI203",
    description:
      "FT-PROPERTY DIVIDEND PAYMENT BY DOMESTIC CORP TO CITIZENS AND RESIDENT ALIENS",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WI224",
    description: "FT-CASH DIVIDEND PAYMENT BY DOMESTIC CORP TO NRAETB",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WI225",
    description: "FT-PROPERTY DIVIDEND PAYMENT BY DOMESTIC CORP TO NRAETB",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WI226",
    description: "FT-SHARE OF NRA IN DISTRIB NET INC PART/JNT VENT ETC",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WI240",
    description: "PROFIT SHARE OF INDIVIDUAL PARTNERS IN A TAXABLE PARTNERSHIP",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WI250",
    description:
      "FINAL TAX -ON ROYALTIES PAID TO CITIZENS AND RESIDENT ALIENS ",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WI260",
    description: "FINAL TAX -ON AWARDS/PRIZES",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WI310",
    description:
      "ON PYTS TO OIL EXPLORATION SERVICE CONTRACTORS AND SUBCONTRACTORS - INDIVIDUAL",
    rate: "8.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WI330",
    description:
      "FINAL TAX -ON PAYMENTS TO NR ALIEN INDIVIDUAL NOT ENGAGED IN TRADE OR BUSINESS WITHIN THE PHILIPPINES",
    rate: "25.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WI340",
    description:
      "ON PYT TO NON RESIDENT CINEMATOGRAPHIC FILM OWNER, LESSOR OR DISTRIBUTOR - INDIVIDUAL",
    rate: "25.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WI341",
    description: "FT-ON ROYALTIES PD TO NRAETB ON CINEMATOGRAPHIC FILMS WORKS",
    rate: "25.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WI350",
    description:
      "(IND)INTEREST OR OTHER PAYMENTS IN TAX-FREE COVENANT BONDS, MORTGAGES, DEEDS OF TRUST OR OTHER OBLIG.",
    rate: "30.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WI380",
    description:
      "FINAL WITHHOLDING TAX ON ROYALTIES ON BOOKS, LITERARY WORKS AND MUSICAL COMPOSITIONS",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WI410",
    description: "(IND) INFORMERS REWARDS",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WC180",
    description:
      "FINAL TAX -INTEREST ON FOREIGN CURRENCY PAYABLE TO NON-RESIDENT FOREIGN CORPORATION",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WC190",
    description:
      "FINAL TAX -INTEREST ON FOREIGN CURRENCY PAYABLE TO OFFSHORE BANKING UNIT/FOREIGN CURRENCY DEP. UNIT",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WC191",
    description: "WITHOLDING TAX ON INCOME PAYMENT TO FCDUS",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WC212",
    description:
      "CASH DIVIDEND PAYMENTS BY DOMESTIC CORPORATION TO CITIZENS AND RESIDENT ALIENS/NRFCs",
    rate: "30.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WC213",
    description:
      "PROPERTY DIVIDEND PAYMENTS BY DOMESTIC CORPORATION TO CITIZENS AND RESIDENT ALIENS/NRFCs",
    rate: "30.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WC222",
    description: "CASH DIVIDEND PAYMNT TO CORP TO NRFCS",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WC223",
    description:
      "FT- PROPERTY DIVIDEND PAYMENT BY DOMESTIC CORP TO NFRC WHOSE COUNTRIES ALLOWED TAX DEEMED PAID CREDIT (SUBJ TO TAX SPARING RULE)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WC230",
    description: "ON OTHER PAYMENTS TO NRFCs",
    rate: "30.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WC250",
    description: "FINAL TAX -ON ROYALTIES PAID TO JURIDICAL PERSONS",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WC280",
    description:
      "BRANCH PROFIT REMITTANCES BY ALL OTHER CORPS. EXCEPT EPZA REG",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WC290",
    description:
      "FINAL TAX -ON LEASE/CHARTER FEES PAYABLE TO NON-RESIDENT LESSOR OF FOREIGN VESSELS",
    rate: "4.5",
    category: "G",
  },
  {
    form: "1601F",
    code: "WC300",
    description:
      "FINAL TAX -ON LEASE/CHARTER FEES PAYABLE TO NON-RESIDENT LESSOR OF AIRCRAFT/MACHINES",
    rate: "7.5",
    category: "G",
  },
  {
    form: "1601F",
    code: "WC310",
    description:
      "ON PYTS TO OIL EXPLORATION SERVICE CONTRACTORS AND SUBCONTRACTORS - CORPORATE",
    rate: "8.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WC340",
    description:
      "ON PYT TO NON RESIDENT CINEMATOGRAPHIC FILM OWNER, LESSOR OR DISTRIBUTOR - CORPORATE",
    rate: "25.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WC410",
    description: "FT-INFORMER CASH REWARD TO JURIDICAL PERSONS - CORPORATE",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WI202",
    description: "CASH DIVIDEND PAYMNT TO DOMESTIC CORP TO CITIZENS",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WI203",
    description:
      "FT-PROPERTY DIVIDEND PAYMENT BY DOMESTIC CORP TO CITIZENS AND RESIDENT ALIENS",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WI224",
    description: "FT-CASH DIVIDEND PAYMENT BY DOMESTIC CORP TO NRAETB",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WI225",
    description: "FT-PROPERTY DIVIDEND PAYMENT BY DOMESTIC CORP TO NRAETB",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WI226",
    description: "FT-SHARE OF NRA IN DISTRIB NET INC PART/JNT VENT ETC",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WI240",
    description: "PROFIT SHARE OF INDIVIDUAL PARTNERS IN A TAXABLE PARTNERSHIP",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WI250",
    description:
      "FINAL TAX -ON ROYALTIES PAID TO CITIZENS AND RESIDENT ALIENS ",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WI260",
    description: "FINAL TAX -ON AWARDS/PRIZES",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WI310",
    description:
      "ON PYTS TO OIL EXPLORATION SERVICE CONTRACTORS AND SUBCONTRACTORS - INDIVIDUAL",
    rate: "8.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WI330",
    description:
      "FINAL TAX -ON PAYMENTS TO NR ALIEN INDIVIDUAL NOT ENGAGED IN TRADE OR BUSINESS WITHIN THE PHILIPPINES",
    rate: "25.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WI340",
    description:
      "ON PYT TO NON RESIDENT CINEMATOGRAPHIC FILM OWNER, LESSOR OR DISTRIBUTOR - INDIVIDUAL",
    rate: "25.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WI341",
    description: "FT-ON ROYALTIES PD TO NRAETB ON CINEMATOGRAPHIC FILMS WORKS",
    rate: "25.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WI350",
    description:
      "(IND)INTEREST OR OTHER PAYMENTS IN TAX-FREE COVENANT BONDS, MORTGAGES, DEEDS OF TRUST OR OTHER OBLIG.",
    rate: "30.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WI380",
    description:
      "FINAL WITHHOLDING TAX ON ROYALTIES ON BOOKS, LITERARY WORKS AND MUSICAL COMPOSITIONS",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WI410",
    description: "(IND) INFORMERS REWARDS",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1600WP",
    code: "WB191",
    description:
      "TAX ON WINNINGS FROM DOUBLE, FORECAST/QUINELLA AND TRIFECTA BETS ON HORSE RACES PAID BY GOVERNMENT WITHHOLDING TAX AGENT",
    rate: "4.0",
    category: "G",
  },
  {
    form: "1600WP",
    code: "WB192",
    description:
      "TAX ON WINNINGS OR PRIZES PAID TO WINNERS OF WINNING HORSE RACE TICKETS OTHER THAN DOUBLE, FORECAST/QUINELLA AND TRIFECTA BETS; AND OWNERS OF WINNING RACE HORSES PAID BY GOVERNMENT WITHHOLDING TAX AGENT",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1600WP",
    code: "WB193",
    description:
      "TAX ON WINNINGS FROM DOUBLE, FORECAST/QUINELLA AND TRIFECTA BETS ON HORSE RACES PAID BY PRIVATE WITHHOLDING TAX AGENT",
    rate: "4.0",
    category: "P",
  },
  {
    form: "1600WP",
    code: "WB194",
    description:
      "TAX ON WINNINGS OR PRIZES PAID TO WINNERS OF WINNING HORSE RACE TICKETS OTHER THAN DOUBLE, FORECAST/QUINELLA AND TRIFECTA BETS; AND OWNERS OF WINNING RACE HORSES PAID BY PRIVATE WITHHOLDING TAX AGENT",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1600",
    code: "WB301",
    description:
      "A. ON INTEREST, COMMISSIONS AND DISCOUNTS FROM LENDING ACTIVITIES AS WELL AS INCOME FROM FINANCIAL LEASING, ON THE BASIS OF THE REMAINING MATURITIES OF INSTRUMENT FROM WHICH SUCH RECEIPTS ARE DERIVED - MATURITY PERIOD IS FIVE YEARS OR LESS",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB303",
    description:
      "A. ON INTEREST, COMMISSIONS AND DISCOUNTS FROM LENDING ACTIVITIES AS WELL AS INCOME FROM FINANCIAL LEASING, ON THE BASIS OF THE REMAINING MATURITIES OF INSTRUMENT FROM WHICH SUCH RECEIPTS ARE DERIVED - MATURITY PERIOD IS MORE THAN FIVE YEARS",
    rate: "1.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB102",
    description:
      "B. ON DIVIDENDS AND EQUITY SHARES AND NET INCOME OF SUBSIDIARIES",
    rate: "0.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB103",
    description:
      "C. ON ROYALTIES, RENTALS OF PROPERTY, REAL OR PERSONAL, PROFITS FROM EXCHANGE AND ALL OTHER ITEMS TREATED AS GROSS INCOME UNDER THE CODE",
    rate: "7.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB104",
    description:
      "D. ON NET TRADING GAINS WITHIN THE TAXABLE YEAR ON FOREIGN CURRENCY, DEBT SECURITIES, DERIVATIVES AND OTHER SIMILAR FINANCIAL INSTRUMENTS",
    rate: "7.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB108",
    description:
      "A. ON INTEREST, COMMISSIONS AND DISCOUNTS FROM LENDING ACTIVITIES AS WELL AS INCOME FROM FINANCIAL LEASING, ON THE BASIS OF THE REMAINING MATURITIES OF INSTRUMENT FROM WHICH SUCH RECEIPTS ARE DERIVED - MATURITY PERIOD IS FIVE YEARS OR LESS",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB109",
    description:
      "A. ON INTEREST, COMMISSIONS AND DISCOUNTS FROM LENDING ACTIVITIES AS WELL AS INCOME FROM FINANCIAL LEASING, ON THE BASIS OF THE REMAINING MATURITIES OF INSTRUMENT FROM WHICH SUCH RECEIPTS ARE DERIVED - MATURITY PERIOD IS MORE THAN FIVE YEARS",
    rate: "1.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB110",
    description:
      "B. ON ALL OTHER ITEMS TREATED AS GROSS INCOME UNDER THE CODE ",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WV040",
    description:
      "VAT WITHHOLDING  FROM NON-RESIDENTS (GOVERNMENT WITHHOLDING AGENT)",
    rate: "12.0",
    category: "P",
  },
  {
    form: "1600",
    code: "WV050",
    description:
      "VAT WITHHOLDING FROM  NON-RESIDENTS (PRIVATE WITHHOLDING AGENT)",
    rate: "12.0",
    category: "P",
  },
  {
    form: "1600",
    code: "WV012",
    description:
      "VAT WITHHOLDING ON PURCHASES OF GOODS (WITH WAIVER OF PRIVILEGE TO CLAIM INPUT TAX CREDIT) (CREDITABLE)",
    rate: "12.0",
    category: "P",
  },
  {
    form: "1600",
    code: "WV014",
    description:
      "VAT WITHHOLDING ON PURCHASES OF GOODS (WITH WAIVER OF PRIVILEGE TO CLAIM INPUT TAX CREDIT) (FINAL)",
    rate: "12.0",
    category: "P",
  },
  {
    form: "1600",
    code: "WV022",
    description:
      "VAT WITHHOLDING ON PURCHASES OF SERVICES (WITH WAIVER OF PRIVILEGE TO CLAIM INPUT TAX CREDIT) (CREDITABLE)",
    rate: "12.0",
    category: "P",
  },
  {
    form: "1600",
    code: "WV024",
    description:
      "VAT WITHHOLDING ON PURCHASES OF SERVICES (WITH WAIVER OF PRIVILEGE TO CLAIM INPUT TAX CREDIT) (FINAL)",
    rate: "12.0",
    category: "P",
  },
  {
    form: "1600",
    code: "WB080",
    description:
      "PERSONS EXEMPT FROM VAT UNDER SEC. 109V (CREDITABLE)-GOVERNMENT WITHHOLDING AGENT",
    rate: "3.0",
    category: "P",
  },
  {
    form: "1600",
    code: "WB082",
    description:
      "PERSONS EXEMPT FROM VAT UNDER SEC. 109V (CREDITABLE)-PRIVATE WITHHOLDING AGENT",
    rate: "3.0",
    category: "P",
  },
  {
    form: "1600",
    code: "WB084",
    description: "PERSONS EXEMPT FROM VAT UNDER SEC. 109V (FINAL)",
    rate: "3.0",
    category: "P",
  },
  {
    form: "1600",
    code: "WV040",
    description:
      "VAT WITHHOLDING  FROM NON-RESIDENTS (GOVERNMENT WITHHOLDING AGENT)",
    rate: "12.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WV050",
    description:
      "VAT WITHHOLDING FROM  NON-RESIDENTS (PRIVATE WITHHOLDING AGENT)",
    rate: "12.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WV012",
    description:
      "VAT WITHHOLDING ON PURCHASES OF GOODS (WITH WAIVER OF PRIVILEGE TO CLAIM INPUT TAX CREDIT) (CREDITABLE)",
    rate: "12.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WV014",
    description:
      "VAT WITHHOLDING ON PURCHASES OF GOODS (WITH WAIVER OF PRIVILEGE TO CLAIM INPUT TAX CREDIT) (FINAL)",
    rate: "12.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WV022",
    description:
      "VAT WITHHOLDING ON PURCHASES OF SERVICES (WITH WAIVER OF PRIVILEGE TO CLAIM INPUT TAX CREDIT) (CREDITABLE)",
    rate: "12.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WV024",
    description:
      "VAT WITHHOLDING ON PURCHASES OF SERVICES (WITH WAIVER OF PRIVILEGE TO CLAIM INPUT TAX CREDIT) (FINAL)",
    rate: "12.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB080",
    description:
      "PERSONS EXEMPT FROM VAT UNDER SEC. 109V (CREDITABLE)-GOVERNMENT WITHHOLDING AGENT",
    rate: "3.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB082",
    description:
      "PERSONS EXEMPT FROM VAT UNDER SEC. 109V (CREDITABLE)-PRIVATE WITHHOLDING AGENT",
    rate: "3.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB084",
    description: "PERSONS EXEMPT FROM VAT UNDER SEC. 109V (FINAL)",
    rate: "3.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WC350",
    description:
      "(CORP)INTEREST OR OTHER PAYMENTS IN TAX-FREE COVENANT BONDS, MORTGAGES, DEEDS OF TRUST OR OTHER OBLIG.",
    rate: "30.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WI700",
    description:
      "(CORP) CASH OR PROPERTY DIVIDENDS PAID BY A REIT SUBJECT TO FINAL TAX",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WC700",
    description:
      "(IND) CASH OR PROPERTY DIVIDENDS PAID BY A REIT SUBJECT TO FINAL TAX",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601F",
    code: "WC350",
    description:
      "(CORP)INTEREST OR OTHER PAYMENTS IN TAX-FREE COVENANT BONDS, MORTGAGES, DEEDS OF TRUST OR OTHER OBLIG.",
    rate: "30.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WI700",
    description:
      "(CORP) CASH OR PROPERTY DIVIDENDS PAID BY A REIT SUBJECT TO FINAL TAX",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601F",
    code: "WC700",
    description:
      "(IND) CASH OR PROPERTY DIVIDENDS PAID BY A REIT SUBJECT TO FINAL TAX",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WV060",
    description: "OTHER SERVICES RENDERED IN THE PHILIPPINES BY NON-RESIDENTS",
    rate: "12.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WV070",
    description: "OTHER SERVICES RENDERED IN THE PHILIPPINES BY NON-RESIDENTS",
    rate: "12.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC710",
    description:
      "INTEREST INCOME DERIVED FROM ANY OTHER DEBT INSTRUMENTS NOT W/IN THE COVERAGE OF DEPOSIT SUBSTITUTES AND RR NO. 14-2012 (CORPORATE)",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WC710",
    description:
      "INTEREST INCOME DERIVED FROM ANY OTHER DEBT INSTRUMENTS NOT W/IN THE COVERAGE OF DEPOSIT SUBSTITUTES AND RR NO. 14-2012 (CORPORATE)",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601E",
    code: "WI710",
    description:
      "INTEREST INCOME DERIVED FROM ANY OTHER DEBT INSTRUMENTS NOT W/IN THE COVERAGE OF DEPOSIT SUBSTITUTES AND RR NO. 14-2012  (INDIVIDUAL)",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601E",
    code: "WI710",
    description:
      "INTEREST INCOME DERIVED FROM ANY OTHER DEBT INSTRUMENTS NOT W/IN THE COVERAGE OF DEPOSIT SUBSTITUTES AND RR NO. 14-2012  (INDIVIDUAL)",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI226",
    description:
      "SHARE OF NRAETB IN THE DISTRIBUTABLE NET INCOME AFTER TAX OF A PARTNERSHIP (EXCEPT GENERAL PROFESSIONAL PARTNERSHIP) OF WHICH HE IS A PARTNER, OR SHARE IN THE NET INCOME AFTER TAX OF AN ASSOCIATION, JOINT ACCOUNT OR A JOINT VENTURE TAXABLE AS A CORPORATION OF WHICH HE IS A MEMBER OR A CO-VENTURER",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI240",
    description:
      "DISTRIBUTIVE SHARE OF INDIVIDUAL PARTNERS IN A TAXABLE PARTNERSHIP, ASSOCIATION, JOINT ACCOUNT OR JOINT VENTURE OR CONSORTIUM",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI250",
    description:
      "ALL KINDS OF ROYALTY PAYMENTS TO CITIZENS, RESIDENTS ALIENS AND NRAETB (OTHER THAN WI380 AND WI341), DOMESTIC AND RESIDENT FOREIGN CORPORATIONS",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI260",
    description:
      "ON PRIZES EXCEEDING P10,000 AND OTHER WINNINGS PAID TO INDIVIDUALS",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI310",
    description:
      "ON PAYMENTS TO OIL EXPLORATION SERVICE CONTRACTORS/SUB-CONTRACTORS",
    rate: "8.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI330",
    description:
      "PAYMENTS TO NON-RESIDENT ALIEN NOT ENGAGE IN TRADE OR BUSINESS WITHIN THE PHILIPPINES (NRANETB) EXCEPT ON SALE OF SHARES IN DOMESTIC CORPORATION AND REAL PROPERTY",
    rate: "25.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI340",
    description:
      "ON PAYMENTS TO NON-RESIDENT INDIVIDUAL/FOREIGN CORPORATE CINEMATOGRAPHIC FILM OWNERS, LESSORS OR DISTRIBUTORS",
    rate: "25.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI341",
    description:
      "ROYALTIES PAID TO NRAETB ON CINEMATOGRAPHIC FILMS AND SIMILAR WORKS",
    rate: "25.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI350",
    description:
      "FINAL TAX ON INTEREST OR OTHER PAYMENTS UPON TAX-FREE COVENANT BONDS, MORTGAGES, DEEDS OF TRUST OR OTHER OBLIGATIONS UNDER SEC. 57C OF THE NATIONAL INTERNAL REVENUE CODE OF 1997, AS AMENDED",
    rate: "30.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI380",
    description:
      "ROYALTIES PAID TO CITIZENS, RESIDENT ALIENS AND NRAETB ON BOOKS, OTHER LITERARY WORKS AND MUSICAL COMPOSITIONS",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI410",
    description: "INFORMERS CASH REWARD TO INDIVIDUALS/JURIDICAL PERSONS",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI700",
    description:
      "CASH OR PROPERTY DIVIDEND PAID BY A REAL ESTATE INVESTMENT TRUST (REIT)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC180",
    description:
      "INTEREST ON FOREIGN LOANS PAYABLE TO NON-RESIDENT FOREIGN CORPORATIONS (NRFCS)",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC190",
    description:
      "INTEREST AND OTHER INCOME PAYMENTS ON FOREIGN CURRENCY TRANSACTIONS/LOANS PAYABLE TO OFFSHORE BANKING UNITS (OBUS)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC191",
    description:
      "INTEREST AND OTHER INCOME PAYMENTS ON FOREIGN CURRENCY TRANSACTIONS/LOANS PAYABLE TO FOREIGN CURRENCY DEPOSIT UNITS (FCDUS)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC212",
    description:
      "CASH DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO CITIZENS AND RESIDENT ALIENS/NRFCS",
    rate: "30.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC213",
    description:
      "PROPERTY DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO CITIZENS AND RESIDENT ALIENS/NRFCS",
    rate: "30.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC222",
    description:
      "CASH DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO NRFCS WHOSE COUNTRIES ALLOWED TAX DEEMED PAID CREDIT (SUBJECT TO TAX SPARING RULE)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC223",
    description:
      "PROPERTY DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO NRFCS WHOSE COUNTRIES ALLOWED TAX DEEMED PAID CREDIT (SUBJECT TO TAX SPARING RULE)",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC230",
    description: "ON OTHER PAYMENTS TO NRFCS",
    rate: "30.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC250",
    description:
      "ALL KINDS OF ROYALTY PAYMENTS TO CITIZENS, RESIDENTS ALIENS AND NRAETB (OTHER THAN WI380 AND WI341), DOMESTIC AND RESIDENT FOREIGN CORPORATIONS",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC280",
    description:
      "BRANCH PROFIT REMITTANCES BY ALL CORPORATIONS EXCEPT PEZA/SBMA/CDA REGISTERED",
    rate: "15.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC290",
    description:
      "ON THE GROSS RENTALS, LEASE AND CHARTER FEES DERIVED BY NON-RESIDENT OWNER OR LESSOR OF FOREIGN VESSELS",
    rate: "4.5",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC300",
    description:
      "ON THE GROSS RENTALS, CHARTERS AND OTHER FEES DERIVED BY NON-RESIDENT LESSOR OR AIRCRAFT, MACHINERIES AND EQUIPMENT",
    rate: "7.5",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC310",
    description:
      "ON PAYMENTS TO OIL EXPLORATION SERVICE CONTRACTORS/SUB-CONTRACTORS",
    rate: "8.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC340",
    description:
      "ON PAYMENTS TO NON-RESIDENT INDIVIDUAL/FOREIGN CORPORATE CINEMATOGRAPHIC FILM OWNERS, LESSORS OR DISTRIBUTORS",
    rate: "25.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC410",
    description: "INFORMERS CASH REWARD TO INDIVIDUALS/JURIDICAL PERSONS",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC700",
    description:
      "CASH OR PROPERTY DIVIDEND PAID BY A REAL ESTATE INVESTMENT TRUST (REIT)",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI202",
    description:
      "CASH DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO CITIZENS AND RESIDENT ALIENS/NRFCS",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI203",
    description:
      "PROPERTY DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO CITIZENS AND RESIDENT ALIENS/NRFCS",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI224",
    description:
      "CASH DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO NON-RESIDENT ALIEN ENGAGE IN TRADE OR BUSINESS WITHIN THE PHILIPPINES (NRAETB)",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI225",
    description: "PROPERTY DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO NRAETB",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI226",
    description:
      "SHARE OF NRAETB IN THE DISTRIBUTABLE NET INCOME AFTER TAX OF A PARTNERSHIP (EXCEPT GENERAL PROFESSIONAL PARTNERSHIP) OF WHICH HE IS A PARTNER, OR SHARE IN THE NET INCOME AFTER TAX OF AN ASSOCIATION, JOINT ACCOUNT OR A JOINT VENTURE TAXABLE AS A CORPORATION OF WHICH HE IS A MEMBER OR A CO-VENTURER",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI240",
    description:
      "DISTRIBUTIVE SHARE OF INDIVIDUAL PARTNERS IN A TAXABLE PARTNERSHIP, ASSOCIATION, JOINT ACCOUNT OR JOINT VENTURE OR CONSORTIUM",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI250",
    description:
      "ALL KINDS OF ROYALTY PAYMENTS TO CITIZENS, RESIDENTS ALIENS AND NRAETB (OTHER THAN WI380 AND WI341), DOMESTIC AND RESIDENT FOREIGN CORPORATIONS",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI260",
    description:
      "ON PRIZES EXCEEDING P10,000 AND OTHER WINNINGS PAID TO INDIVIDUALS",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI310",
    description:
      "ON PAYMENTS TO OIL EXPLORATION SERVICE CONTRACTORS/SUB-CONTRACTORS",
    rate: "8.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI330",
    description:
      "PAYMENTS TO NON-RESIDENT ALIEN NOT ENGAGE IN TRADE OR BUSINESS WITHIN THE PHILIPPINES (NRANETB) EXCEPT ON SALE OF SHARES IN DOMESTIC CORPORATION AND REAL PROPERTY",
    rate: "25.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI340",
    description:
      "ON PAYMENTS TO NON-RESIDENT INDIVIDUAL/FOREIGN CORPORATE CINEMATOGRAPHIC FILM OWNERS, LESSORS OR DISTRIBUTORS",
    rate: "25.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI341",
    description:
      "ROYALTIES PAID TO NRAETB ON CINEMATOGRAPHIC FILMS AND SIMILAR WORKS",
    rate: "25.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI350",
    description:
      "FINAL TAX ON INTEREST OR OTHER PAYMENTS UPON TAX-FREE COVENANT BONDS, MORTGAGES, DEEDS OF TRUST OR OTHER OBLIGATIONS UNDER SEC. 57C OF THE NATIONAL INTERNAL REVENUE CODE OF 1997, AS AMENDED",
    rate: "30.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI380",
    description:
      "ROYALTIES PAID TO CITIZENS, RESIDENT ALIENS AND NRAETB ON BOOKS, OTHER LITERARY WORKS AND MUSICAL COMPOSITIONS",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI410",
    description: "INFORMERS CASH REWARD TO INDIVIDUALS/JURIDICAL PERSONS",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI700",
    description:
      "CASH OR PROPERTY DIVIDEND PAID BY A REAL ESTATE INVESTMENT TRUST (REIT)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC180",
    description:
      "INTEREST ON FOREIGN LOANS PAYABLE TO NON-RESIDENT FOREIGN CORPORATIONS (NRFCS)",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC190",
    description:
      "INTEREST AND OTHER INCOME PAYMENTS ON FOREIGN CURRENCY TRANSACTIONS/LOANS PAYABLE TO OFFSHORE BANKING UNITS (OBUS)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC191",
    description:
      "INTEREST AND OTHER INCOME PAYMENTS ON FOREIGN CURRENCY TRANSACTIONS/LOANS PAYABLE TO FOREIGN CURRENCY DEPOSIT UNITS (FCDUS)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC212",
    description:
      "CASH DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO CITIZENS AND RESIDENT ALIENS/NRFCS",
    rate: "30.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC213",
    description:
      "PROPERTY DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO CITIZENS AND RESIDENT ALIENS/NRFCS",
    rate: "30.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC222",
    description:
      "CASH DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO NRFCS WHOSE COUNTRIES ALLOWED TAX DEEMED PAID CREDIT (SUBJECT TO TAX SPARING RULE)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC223",
    description:
      "PROPERTY DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO NRFCS WHOSE COUNTRIES ALLOWED TAX DEEMED PAID CREDIT (SUBJECT TO TAX SPARING RULE)",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC230",
    description: "ON OTHER PAYMENTS TO NRFCS",
    rate: "30.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC250",
    description:
      "ALL KINDS OF ROYALTY PAYMENTS TO CITIZENS, RESIDENTS ALIENS AND NRAETB (OTHER THAN WI380 AND WI341), DOMESTIC AND RESIDENT FOREIGN CORPORATIONS",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC280",
    description:
      "BRANCH PROFIT REMITTANCES BY ALL CORPORATIONS EXCEPT PEZA/SBMA/CDA REGISTERED",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC290",
    description:
      "ON THE GROSS RENTALS, LEASE AND CHARTER FEES DERIVED BY NON-RESIDENT OWNER OR LESSOR OF FOREIGN VESSELS",
    rate: "4.5",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC300",
    description:
      "ON THE GROSS RENTALS, CHARTERS AND OTHER FEES DERIVED BY NON-RESIDENT LESSOR OR AIRCRAFT, MACHINERIES AND EQUIPMENT",
    rate: "7.5",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC310",
    description:
      "ON PAYMENTS TO OIL EXPLORATION SERVICE CONTRACTORS/SUB-CONTRACTORS",
    rate: "8.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC340",
    description:
      "ON PAYMENTS TO NON-RESIDENT INDIVIDUAL/FOREIGN CORPORATE CINEMATOGRAPHIC FILM OWNERS, LESSORS OR DISTRIBUTORS",
    rate: "25.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC410",
    description: "INFORMERS CASH REWARD TO INDIVIDUALS/JURIDICAL PERSONS",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC700",
    description:
      "CASH OR PROPERTY DIVIDEND PAID BY A REAL ESTATE INVESTMENT TRUST (REIT)",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1602Q",
    code: "WI161",
    description: "FT-BANK DEPOSITS(INDIVIDUAL)",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1602Q",
    code: "WI162",
    description: "FT-FROM TREASURY BILLS",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1602Q",
    code: "WI163",
    description:
      "FT-DEP. SUBST., TRUST FUND AND SIMILAR ARRANGEMENTS(INDIVIDUAL)",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1602Q",
    code: "WI165",
    description: "ON AMOUNTS WITHDRAWN FROM DECEDENT'S DEPOSIT ACCOUNT",
    rate: "6.0",
    category: "P",
  },
  {
    form: "1602Q",
    code: "WI170",
    description: "FINAL WTAX:FOREIGN CURRENCY DEPOSITS(INDIVIDUAL)",
    rate: "15.00",
    category: "P",
  },
  {
    form: "1602Q",
    code: "WI440",
    description:
      "ON INTEREST INCOME FROM LONG-TERM DEPOSIT IN THE FORM OF SAVINGS TRUST FUNDS, DEPOSIT SUBSTITUTES WHICH WAS PRE-TERMINATED BY THE HOLDER BEFORE THE 5TH YEAR-INDIVIDUAL",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1602Q",
    code: "WI441",
    description:
      "ON INTEREST INCOME FROM LONG-TERM DEPOSIT IN THE FORM OF SAVINGS TRUST FUNDS, DEPOSIT SUBSTITUTES WHICH WAS PRE-TERMINATED BY THE HOLDER BEFORE THE 5TH YEAR-INDIVIDUAL",
    rate: "12.0",
    category: "P",
  },
  {
    form: "1602Q",
    code: "WI442",
    description:
      "ON INTEREST INCOME FROM LONG-TERM DEPOSIT IN THE FORM OF SAVINGS TRUST FUNDS, DEPOSIT SUBSTITUTES WHICH WAS PRE-TERMINATED BY THE HOLDER BEFORE THE 5TH YEAR-INDIVIDUAL",
    rate: "5.0",
    category: "P",
  },
  {
    form: "1602Q",
    code: "WC161",
    description: "FT-BANK DEPOSITS(CORPORATE)",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1602Q",
    code: "WC162",
    description: "FT-FROM TREASURY BILLS",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1602Q",
    code: "WC163",
    description:
      "FT-DEP. SUBST., TRUST FUND AND SIMILAR ARRANGEMENTS(CORPORATE)",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1602Q",
    code: "WC170",
    description: "FINAL WTAX:FOREIGN CURRENCY DEPOSITS(CORPORATE)",
    rate: "15.00",
    category: "P",
  },
  {
    form: "1602Q",
    code: "WC440",
    description:
      "ON INTEREST INCOME FROM LONG-TERM DEPOSIT IN THE FORM OF SAVINGS TRUST FUNDS, DEPOSIT SUBSTITUTES WHICH WAS PRE-TERMINATED BY THE HOLDER BEFORE THE 5TH YEAR-CORPORATE",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1602Q",
    code: "WI440",
    description:
      "ON INTEREST INCOME FROM LONG-TERM DEPOSIT IN THE FORM OF SAVINGS TRUST FUNDS, DEPOSIT SUBSTITUTES WHICH WAS PRE-TERMINATED BY THE HOLDER BEFORE THE 5TH YEAR-INDIVIDUAL",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1602Q",
    code: "WI441",
    description:
      "ON INTEREST INCOME FROM LONG-TERM DEPOSIT IN THE FORM OF SAVINGS TRUST FUNDS, DEPOSIT SUBSTITUTES WHICH WAS PRE-TERMINATED BY THE HOLDER BEFORE THE 5TH YEAR-INDIVIDUAL",
    rate: "12.0",
    category: "G",
  },
  {
    form: "1602Q",
    code: "WI442",
    description:
      "ON INTEREST INCOME FROM LONG-TERM DEPOSIT IN THE FORM OF SAVINGS TRUST FUNDS, DEPOSIT SUBSTITUTES WHICH WAS PRE-TERMINATED BY THE HOLDER BEFORE THE 5TH YEAR-INDIVIDUAL",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB080",
    description:
      "PERSONS EXEMPT FROM VAT UNDER SEC. 109V (CREDITABLE)-GOVERNMENT WITHHOLDING AGENT",
    rate: "1.0",
    category: "P",
  },
  {
    form: "1600",
    code: "WB080",
    description:
      "PERSONS EXEMPT FROM VAT UNDER SEC. 109V (CREDITABLE)-GOVERNMENT WITHHOLDING AGENT",
    rate: "1.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB082",
    description:
      "PERSONS EXEMPT FROM VAT UNDER SEC. 109V (CREDITABLE)-PRIVATE WITHHOLDING AGENT",
    rate: "1.0",
    category: "P",
  },
  {
    form: "1600",
    code: "WB084",
    description: "PERSONS EXEMPT FROM VAT UNDER SEC. 109V (FINAL)",
    rate: "1.0",
    category: "P",
  },
  {
    form: "1600",
    code: "WB082",
    description:
      "PERSONS EXEMPT FROM VAT UNDER SEC. 109V (CREDITABLE)-PRIVATE WITHHOLDING AGENT",
    rate: "1.0",
    category: "G",
  },
  {
    form: "1600",
    code: "WB084",
    description: "PERSONS EXEMPT FROM VAT UNDER SEC. 109V (FINAL)",
    rate: "1.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC212",
    description:
      "CASH DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO CITIZENS AND RESIDENT ALIENS/NRFCS",
    rate: "25.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC213",
    description:
      "PROPERTY DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO CITIZENS AND RESIDENT ALIENS/NRFCS",
    rate: "25.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC810",
    description:
      "FINAL TAX REPRESENTING FRANCHISE TAX ON PAYMENTS TO NRFC SUPPLIER OF PAGCOR RELATED TO ITS GAMING OPERATIONS",
    rate: "5.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI240",
    description:
      "DISTRIBUTIVE SHARE OF INDIVIDUAL PARTNERS IN A TAXABLE PARTNERSHIP, ASSOCIATION, JOINT ACCOUNT OR JOINT VENTURE OR CONSORTIUM",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI341",
    description:
      "ROYALTIES PAID TO NRAETB ON CINEMATOGRAPHIC FILMS AND SIMILAR WORKS",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI350",
    description:
      "FINAL TAX ON INTEREST OR OTHER PAYMENTS UPON TAX-FREE COVENANT BONDS, MORTGAGES, DEEDS OF TRUST OR OTHER OBLIGATIONS UNDER SEC. 57C OF THE NATIONAL INTERNAL REVENUE CODE OF 1997, AS AMENDED",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC212",
    description:
      "CASH DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO CITIZENS AND RESIDENT ALIENS/NRFCS",
    rate: "25.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC213",
    description:
      "PROPERTY DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO CITIZENS AND RESIDENT ALIENS/NRFCS",
    rate: "25.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WC230",
    description: "ON OTHER PAYMENTS TO NRFCS",
    rate: "25.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI240",
    description:
      "DISTRIBUTIVE SHARE OF INDIVIDUAL PARTNERS IN A TAXABLE PARTNERSHIP, ASSOCIATION, JOINT ACCOUNT OR JOINT VENTURE OR CONSORTIUM",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI341",
    description:
      "ROYALTIES PAID TO NRAETB ON CINEMATOGRAPHIC FILMS AND SIMILAR WORKS",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1601FQ",
    code: "WI350",
    description:
      "FINAL TAX ON INTEREST OR OTHER PAYMENTS UPON TAX-FREE COVENANT BONDS, MORTGAGES, DEEDS OF TRUST OR OTHER OBLIGATIONS UNDER SEC. 57C OF THE NATIONAL INTERNAL REVENUE CODE OF 1997, AS AMENDED",
    rate: "20.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB030",
    description: "TAX ON CARRIERS AND KEEPERS OF GARAGES",
    rate: "3.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB040",
    description: "FRANCHISE TAX ON GAS AND UTILITIES",
    rate: "2.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB050",
    description:
      "FRANCHISE TAX ON RADIO & RADIO & TV BROADCASTING COMPANIES WHOSE ANNUAL GROSS RECEIPTS DO NOT EXCEED P10M & WHO ARE NOT VAT-REGISTERED TAXPAYERS",
    rate: "3.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB070",
    description: "TAX ON LIFE INSURANCE PREMIUMS",
    rate: "2.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB080",
    description:
      "PERSONS EXEMPT FROM VAT UNDER SEC. 109BB (CREDITABLE)-GOVERNMENT WITHHOLDING AGENT",
    rate: "3.0",
    category: "PG",
  },
  {
    form: "1600PTv2018",
    code: "WB080",
    description:
      "PERSONS EXEMPT FROM VAT UNDER SEC. 109BB (CREDITABLE)-GOVERNMENT WITHHOLDING AGENT",
    rate: "1.0",
    category: "PG",
  },
  {
    form: "1600PTv2018",
    code: "WB082",
    description:
      "PERSONS EXEMPT FROM VAT UNDER SEC. 109BB (CREDITABLE)-PRIVATE WITHHOLDING AGENT",
    rate: "3.0",
    category: "PG",
  },
  {
    form: "1600PTv2018",
    code: "WB082",
    description:
      "PERSONS EXEMPT FROM VAT UNDER SEC. 109BB (CREDITABLE)-PRIVATE WITHHOLDING AGENT",
    rate: "1.0",
    category: "PG",
  },
  {
    form: "1600PTv2018",
    code: "WB084",
    description:
      "PERSONS EXEMPT FROM VAT UNDER SECTION 109BB (FINAL) (SECTION 116 APPLIES)",
    rate: "3.0",
    category: "PG",
  },
  {
    form: "1600PTv2018",
    code: "WB084",
    description:
      "PERSONS EXEMPT FROM VAT UNDER SECTION 109BB (FINAL) (SECTION 116 APPLIES)",
    rate: "1.0",
    category: "PG",
  },
  {
    form: "1600PTv2018",
    code: "WB090",
    description:
      "TAX ON OVERSEAS DISPATCH, MESSAGE OR CONVERSATION FROM THE PHILIPPINES",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB120",
    description:
      "BUSINESS TAX ON AGENTS OF FOREIGN INSURANCE COMPANIES – INSURANCE AGENTS",
    rate: "4.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB121",
    description:
      "BUSINESS TAX ON AGENTS OF FOREIGN INSURANCE COMPANIES – OWNER OF THE PROPERTY",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB130",
    description: "TAX ON INTERNATIONAL CARRIERS",
    rate: "3.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB140",
    description: "TAX ON COCKPITS",
    rate: "18.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB150",
    description:
      "TAX ON AMUSEMENT PLACES, SUCH AS CABARETS, NIGHT AND DAY CLUBS, VIDEOKE BARS, KARAOKE BARS, KARAOKE TELEVISION, KARAOKE BOXES, MUSIC LOUNGES AND OTHER SIMILAR ESTABLISHMENTS",
    rate: "18.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB160",
    description: "TAX ON BOXING EXHIBITIONS",
    rate: "10.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB170",
    description: "TAX ON PROFESSIONAL BASKETBALL GAMES",
    rate: "15.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB180",
    description: "TAX ON JAI-ALAI AND RACE TRACKS",
    rate: "30.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB200",
    description:
      "TAX ON SALE, BARTER OR EXCHANGE OF STOCKS LISTED AND TRADED THROUGH LOCAL STOCK EXCHANGE",
    rate: "0.6",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB201",
    description:
      "TAX ON SHARES OF STOCK SOLD OR EXCHANGED THROUGH INITIAL AND SECONDARY PUBLIC OFFERING: NOT OVER 25%",
    rate: "4.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB202",
    description:
      "TAX ON SHARES OF STOCK SOLD OR EXCHANGED THROUGH INITIAL AND SECONDARY PUBLIC OFFERING: OVER 25% BUT NOT EXCEEDING 33 1/3%",
    rate: "2.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB203",
    description:
      "TAX ON SHARES OF STOCK SOLD OR EXCHANGED THROUGH INITIAL AND SECONDARY PUBLIC OFFERING: OVER 33 1/3%",
    rate: "1.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB301",
    description:
      "TAX ON BANKS AND NON-BANK FINANCIAL INTERMEDIARIES PERFORMING QUASI BANKING FUNCTIONS (ON INTEREST, COMMISSIONS AND DISCOUNTS FROM LENDING ACTIVITIES AS WELL AS INCOME FROM FINANCIAL LEASING, ON THE BASIS OF THE REMAINING MATURITIES OF INSTRUMENT FROM WHICH SUCH RECEIPTS ARE DERIVED: MATURITY PERIOD IS FIVE YEARS OR LESS)",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB303",
    description:
      "TAX ON BANKS AND NON-BANK FINANCIAL INTERMEDIARIES PERFORMING QUASI BANKING FUNCTIONS (ON INTEREST, COMMISSIONS AND DISCOUNTS FROM LENDING ACTIVITIES AS WELL AS INCOME FROM FINANCIAL LEASING, ON THE BASIS OF THE REMAINING MATURITIES OF INSTRUMENT FROM WHICH SUCH RECEIPTS ARE DERIVED: MATURITY PERIOD IS MORE THAN FIVE YEARS)",
    rate: "1.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB102",
    description:
      "TAX ON BANKS AND NON-BANK FINANCIAL INTERMEDIARIES PERFORMING QUASI BANKING FUNCTIONS (ON DIVIDENDS AND EQUITY SHARES AND NET INCOME OF SUBSIDIARIES)",
    rate: "0.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB103",
    description:
      "TAX ON BANKS AND NON-BANK FINANCIAL INTERMEDIARIES PERFORMING QUASI BANKING FUNCTIONS (ON ROYALTIES, RENTALS OF PROPERTY, REAL OR PERSONAL, PROFITS FROM EXCHANGE AND ALL OTHER ITEMS TREATED AS GROSS INCOME UNDER THE CODE)",
    rate: "7.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB104",
    description:
      "TAX ON BANKS AND NON-BANK FINANCIAL INTERMEDIARIES PERFORMING QUASI BANKING FUNCTIONS (ON NET TRADING GAINS WITHIN THE TAXABLE YEAR ON FOREIGN CURRENCY, DEBT SECURITIES, DERIVATIVES AND OTHER SIMILAR FINANCIAL INSTRUMENTS)",
    rate: "7.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB108",
    description:
      "TAX ON OTHER NON-BANKS FINANCIAL INTERMEDIARIES NOT PERFORMING QUASI-BANKING FUNCTIONS (ON INTEREST, COMMISSIONS AND DISCOUNTS FROM LENDING ACTIVITIES AS WELL AS INCOME FROM FINANCIAL LEASING, ON THE BASIS OF THE REMAINING MATURITIES OF INSTRUMENT FROM WHICH SUCH RECEIPTS ARE DERIVED: MATURITY PERIOD IS FIVE YEARS OR LESS)",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB109",
    description:
      "TAX ON OTHER NON-BANKS FINANCIAL INTERMEDIARIES NOT PERFORMING QUASI-BANKING FUNCTIONS (ON INTEREST, COMMISSIONS AND DISCOUNTS FROM LENDING ACTIVITIES AS WELL AS INCOME FROM FINANCIAL LEASING, ON THE BASIS OF THE REMAINING MATURITIES OF INSTRUMENT FROM WHICH SUCH RECEIPTS ARE DERIVED: MATURITY PERIOD IS MORE THAN FIVE YEARS)",
    rate: "1.0",
    category: "G",
  },
  {
    form: "1600PTv2018",
    code: "WB110",
    description:
      "TAX ON OTHER NON-BANKS FINANCIAL INTERMEDIARIES NOT PERFORMING QUASI-BANKING FUNCTIONS (ON ALL OTHER ITEMS TREATED AS GROSS INCOME UNDER THE CODE)",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1600VTv2018",
    code: "WV010",
    description: "VAT WITHHOLDING ON PURCHASE OF GOODS",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1600VTv2018",
    code: "WV020",
    description: "VAT WITHHOLDING ON PURCHASE OF SERVICES",
    rate: "5.0",
    category: "G",
  },
  {
    form: "1600VTv2018",
    code: "WV110",
    description: "VAT ON LOCAL SALES OF REGISTERED BUSINESS ENTERPRISES (RBEs)",
    rate: "12.0",
    category: "PG",
  },
  {
    form: "1600VTv2018",
    code: "WV050",
    description:
      "FINAL WITHHOLDING VAT ON PAYMENTS FOR LEASE OR USE OF PROPERTIES OR PROPERTY RIGHTS OWNED BY NONRESIDENTS (PRIVATE WITHHOLDING AGENT)",
    rate: "12.0",
    category: "PG",
  },
  {
    form: "1600VTv2018",
    code: "WV060",
    description:
      "FINAL WITHHOLDING VAT ON OTHER SERVICES RENDERED IN THE PHILIPPINES BY NON-RESIDENTS (GOVERNMENT WITHHOLDING AGENT)",
    rate: "12.0",
    category: "PG",
  },
  {
    form: "1600VTv2018",
    code: "WV070",
    description:
      "FINAL WITHHOLDING VAT ON OTHER SERVICES RENDERED IN THE PHILIPPINES BY NON-RESIDENTS (PRIVATE WITHHOLDING AGENT)",
    rate: "12.0",
    category: "PG",
  },
  {
    form: "1600VTv2018",
    code: "WV012",
    description:
      "VAT WITHHOLDING ON PURCHASES OF GOODS (WITH WAIVER OF PRIVILEGE TO CLAIM INPUT TAX CREDIT) (CREDITABLE)",
    rate: "12.0",
    category: "PG",
  },
  {
    form: "1600VTv2018",
    code: "WV014",
    description:
      "VAT WITHHOLDING ON PURCHASES OF GOODS (WITH WAIVER OF PRIVILEGE TO CLAIM INPUT TAX CREDIT) (FINAL)",
    rate: "12.0",
    category: "PG",
  },
  {
    form: "1600VTv2018",
    code: "WV022",
    description:
      "VAT WITHHOLDING ON PURCHASES OF SERVICES (WITH WAIVER OF PRIVILEGE TO CLAIM INPUT TAX CREDIT)(CREDITABLE)",
    rate: "12.0",
    category: "PG",
  },
  {
    form: "1600VTv2018",
    code: "WV024",
    description:
      "VAT WITHHOLDING ON PURCHASES OF SERVICES (WITH WAIVER OF PRIVILEGE TO CLAIM INPUT TAX CREDIT) (FINAL)",
    rate: "12.0",
    category: "PG",
  },
  {
    form: "0605",
    code: "DS010",
    description: "DOCUMENTARY STAMP TAX IN GENERAL",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "IC080",
    description: "INCOME TAX ON INTERNATIONAL CARRIERS",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT010",
    description: "PERSONS EXEMPT FROM VAT UNDER SEC. 109(BB) (SEC. 116)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT040",
    description: "DOMESTIC CARRIERS AND KEEPERS OF GARAGES (SEC. 117)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT041",
    description: "PERCENTAGE TAX ON INTERNATIONAL CARRIERS",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT060",
    description: "FRANCHISES ON GAS AND WATER UTILITIES (SEC. 119)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT070",
    description:
      "FRANCHISES ON RADIO/TV BROADCASTING COMPANIES WHOSE ANNUAL GROSS RECEIPTS DO NOT EXCEED P10 M (SEC. 119)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT090",
    description:
      "OVERSEAS DISPATCH, MESSAGE OR CONVERSATION ORIGINATING FROM THE PHILIPPINES (SEC. 120)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT140",
    description: "COCKPITS (SEC. 125)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT150",
    description:
      "TAX ON AMUSEMENT PLACES, SUCH AS CABARETS, NIGHT AND DAY CLUBS, VIDEOKE BARS, KARAOKE BARS, KARAOKE TELEVISION, KARAOKE BOXES, MUSIC LOUNGES AND OTHER SIMILAR ESTABLISHMENTS (SEC. 125)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT160",
    description: "BOXING EXHIBITION (SEC. 125)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT170",
    description: "PROFESSIONAL BASKETBALL GAMES (SEC. 125)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT180",
    description: "JAI-ALAI AND RACE TRACKS (SEC. 125)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT105",
    description:
      "ON INTEREST, COMMISSIONS AND DISCOUNTS FROM LENDING ACTIVITIES AS WELL AS INCOME FROM FINANCIAL LEASING, ON THE BASIS OF REMAINING MATURITIES OF INSTRUMENTS FROM WHICH SUCH RECEIPTS ARE DERIVED. MATURITY PERIOD IS FIVE (5) YEARS OR LESS",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT101",
    description:
      "ON INTEREST, COMMISSIONS AND DISCOUNTS FROM LENDING ACTIVITIES AS WELL AS INCOME FROM FINANCIAL LEASING, ON THE BASIS OF REMAINING MATURITIES OF INSTRUMENTS FROM WHICH SUCH RECEIPTS ARE DERIVED. MATURITY PERIOD IS MORE THAN FIVE (5) YEARS",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT102",
    description:
      "ON DIVIDENDS AND EQUITY SHARES AND NET INCOME OF SUBSIDIARIES",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT103",
    description:
      "ON ROYALTIES, RENTALS OF PROPERTY, REAL OR PERSONAL, PROFITS FROM EXCHANGE AND ALL OTHER GROSS INCOME",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT104",
    description:
      "ON NET TRADING GAINS WITHIN THE TAXABLE YEAR ON FOREIGN CURRENCY, DEBT SECURITIES, DERIVATIVES AND OTHER FINANCIAL INSTRUMENTS",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT113",
    description:
      "ON INTEREST, COMMISSIONS AND DISCOUNTS FROM LENDING ACTIVITIES AS WELL AS INCOME FROM FINANCIAL LEASING, ON THE BASIS OF REMAINING MATURITIES OF INSTRUMENTS FROM WHICH SUCH RECEIPTS ARE DERIVED. MATURITY PERIOD IS FIVE (5) YEARS OR LESS",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT114",
    description:
      "ON INTEREST, COMMISSIONS AND DISCOUNTS FROM LENDING ACTIVITIES AS WELL AS INCOME FROM FINANCIAL LEASING, ON THE BASIS OF REMAINING MATURITIES OF INSTRUMENTS FROM WHICH SUCH RECEIPTS ARE DERIVED. MATURITY PERIOD IS MORE THAN FIVE (5) YEARS",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT115",
    description: "FROM ALL OTHER ITEMS TREATED AS GROSS INCOME UNDER THE CODE",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT120",
    description: "LIFE INSURANCE PREMIUMS (SEC. 123)",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT130",
    description: "INSURANCE AGENTS",
    rate: "",
    category: "",
  },
  {
    form: "0605",
    code: "PT132",
    description:
      "OWNERS OF PROPERTY OBTAINING INSURANCE DIRECTLY WITH FOREIGN INSURANCE COMPANIES",
    rate: "",
    category: "",
  },
  {
    form: "1601FQ",
    code: "WI740",
    description: "FINAL WT ON FOREIGN NATIONALS EMPLOYED BY POGO ENTITIES",
    rate: "25.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI750",
    description:
      "ON GROSS INCOME EARNED BY FOREIGN NATIONALS OR NON-FILIPINO CITIZENS, REGARDLESS OF THEIR RESIDENCY, WHO ARE EMPLOYED AND ASSIGNED IN THE PHILIPPINES BY OFFSHORE GAMING LICENSEE OR ITS ACCREDITED SERVICE PROVIDER.",
    rate: "25.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WC230",
    description: "ON OTHER PAYMENTS TO NRFCS",
    rate: "25.0",
    category: "P",
  },
  {
    form: "0605",
    code: "EXB10",
    description: "EXCISE TAX ON EXPORT OF SWEETENED JUICE DRINKS",
    rate: "",
    category: "",
  },
  {
    form: "1600VTv2018",
    code: "WV080",
    description:
      "FINAL WITHHOLDING VAT ON PURCHASE OF DIGITAL SERVICE CONSUMED IN THE PHILS FROM NON-RESIDENT DSPs (PRIVATE WA)",
    rate: "12.0",
    category: "P",
  },
  {
    form: "1600VTv2018",
    code: "WV090",
    description:
      "FINAL WITHHOLDING VAT ON PURCHASE OF DIGITAL SERVICE CONSUMED IN THE PHILS FROM NON-RESIDENT DSPs (GOVT WA)",
    rate: "12.0",
    category: "G",
  },
  {
    form: "1600VTv2018",
    code: "WV100",
    description:
      "FINAL WITHHOLDING VAT ON THE GROSS AMOUNT BY RESIDENT E-MARKETPLACE TO THE NON-RESIDENT SELLERS/MERCHANTS FOR THE DIGITAL SERVICES SOLD/PAID THRU THEIR PLATFORM/FACILITY",
    rate: "12.0",
    category: "PG",
  },
  {
    form: "0605",
    code: "WV110",
    description: "VAT ON LOCAL SALES OF REGISTERED BUSINESS ENTERPRISES (RBEs)",
    rate: "",
    category: "",
  },
  {
    form: "1601FQ",
    code: "WI202",
    description:
      "CASH DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO CITIZENS AND RESIDENT ALIENS/NRFCS",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI203",
    description:
      "PROPERTY DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO CITIZENS AND RESIDENT ALIENS/NRFCS",
    rate: "10.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI224",
    description:
      "CASH DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO NON-RESIDENT ALIEN ENGAGE IN TRADE OR BUSINESS WITHIN THE PHILIPPINES (NRAETB)",
    rate: "20.0",
    category: "P",
  },
  {
    form: "1601FQ",
    code: "WI225",
    description: "PROPERTY DIVIDEND PAYMENT BY DOMESTIC CORPORATION TO NRAETB",
    rate: "20.0",
    category: "P",
  },
];
export function getWithholdingAtcs(code: string, category?: string) {
  const records = withholdingAtcRecords.filter(
    (r) =>
      r.form === code &&
      (!category ||
        r.category === category ||
        (["1600PTv2018", "1600VTv2018"].includes(code) && r.category === "PG")),
  );
  return ["1600", "1601E"].includes(code)
    ? [
        ...records,
        {
          form: code,
          code: "N/A",
          description: "SPECIAL LAW",
          rate: "0",
          category: category ?? "P",
        },
      ]
    : records;
}

export function withholdingSchedules(
  d: WithholdingDefinition,
  values: Record<string, string> = {},
): WithholdingSchedule[] {
  return d.schedules
    .map((schedule) => {
      if (!schedule.repeatable) return schedule;
      const requested = Number(
        values[withholdingRowCountKey(d, schedule.id)] ?? schedule.rows.length,
      );
      const count = Number.isSafeInteger(requested)
        ? Math.max(schedule.rows.length, Math.min(1000, requested))
        : schedule.rows.length;
      if (count === schedule.rows.length) return schedule;
      const template = schedule.rows[0];
      const rows = Array.from({ length: count }, (_, i) =>
        i < schedule.rows.length
          ? schedule.rows[i]
          : {
              id: `${schedule.id}-${i + 1}`,
              label: String(i + 1),
              fields: template.fields.map((field) => ({
                ...field,
                id:
                  schedule.id === "treaty"
                    ? field.id.replace(/:1:/, `:${i + 1}:`)
                    : field.id.replace(
                        /\d+$/,
                        String(i + (schedule.id === "adjustments" ? 0 : 1)),
                      ),
              })),
            },
      );
      return { ...schedule, rows };
    })
    .map((schedule) => {
      if (
        ["1600", "1601E"].includes(d.code) &&
        ["atc", "payees"].includes(schedule.id)
      ) {
        schedule = {
          ...schedule,
          rows: schedule.rows.map((row) => ({
            ...row,
            fields: row.fields.map((field) => {
              const atc = row.fields[schedule.id === "atc" ? 0 : 2];
              return /(?:txtTaxRate|txtRatePercent)\d+$/.test(field.id)
                ? {
                    ...field,
                    readonly: !(
                      values[d.prefix + "optRelief"] === "Y" &&
                      values[atc.id] === "N/A"
                    ),
                  }
                : field;
            }),
          })),
        };
      }
      return schedule;
    });
}
export function withholdingRowCountKey(
  d: WithholdingDefinition,
  scheduleId: string,
): string {
  return d.prefix + "__rows:" + scheduleId;
}
