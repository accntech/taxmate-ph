import type {
  CorporateField,
  CorporatePage,
  CorporateRow,
  CorporateSection,
  CorporateValues,
} from "../types";
import { mixedNumber } from "./calculation";

const p = "frm1702MX:";
type DetailGroup = {
  base: string;
  count: string;
  label: string;
  fields: string[];
  moneyColumns?: number;
};
const legacy: DetailGroup[] = [
  {
    base: "txtPg5Sc4I3",
    count: "txtCtrmodalPg5Sc4I3",
    label: "Other taxable income",
    fields: ["txtPg5Sc4I3", "txtPg5Sc4I3CA", "txtPg5Sc4I3CB", "txtPg5Sc4I3CC"],
  },
  {
    base: "txtPg5Sc5I4",
    count: "txtCtrmodalPg5Sc5I4",
    label: "Other amortizations",
    fields: ["txtPg5Sc5I4", "txtPg5Sc5I4CA", "txtPg5Sc5I4CB", "txtPg5Sc5I4CC"],
  },
  {
    base: "txtPg6Sc5I39",
    count: "txtCtrmodalPg6Sc5I39",
    label: "Other ordinary allowable deductions",
    fields: [
      "txtPg6Sc5I39other",
      "txtPg6Sc5I39CA",
      "txtPg6Sc5I39CB",
      "txtPg6Sc5I39CC",
    ],
  },
  {
    base: "txtPg6Sc6",
    count: "txtCtrmodalPg6Sc6",
    label: "Special allowable deductions",
    fields: [
      "txtPg6Sc6I4description",
      "txtPg6Sc6I4legal",
      "txtPg6Sc6I4CA",
      "txtPg6Sc6I4CB",
      "txtPg6Sc6I4CC",
    ],
  },
  {
    base: "txtPg7Sc8",
    count: "txtCtrmodalPg7Sc8",
    label: "Other tax credits",
    fields: [
      "txtPg7Sc8I12",
      "txtPg7Sc8I12CA",
      "txtPg7Sc8I12CB",
      "txtPg7Sc8I12CC",
    ],
  },
  ...[3, 6, 8].map((item) => ({
    base: `txtPg7Sc10I${item}`,
    count: `txtCtrmodalPg7Sc10I${item}`,
    label:
      item === 3
        ? "Reconciliation additions"
        : item === 6
          ? "Reconciliation income exclusions"
          : "Reconciliation deductions",
    fields: [
      `txtPg7Sc10I${item}`,
      ...["A", "B", "C"].map((column) => `txtPg7Sc10I${item}C${column}`),
    ],
  })),
];
const revised: DetailGroup[] = [
  {
    base: "txtPg2Sc3",
    count: "txtCtrmodalPg7Sc8",
    label: "Other tax credits",
    fields: [
      "txtPg2Sc3It31",
      "txtPg2Sc3It31A",
      "txtPg2Sc3It31B",
      "txtPg2Sc3It31C",
    ],
  },
  {
    base: "txtPg3Sc5It17i",
    count: "txtCtrmodalPg3Sc5I17i",
    label: "Other ordinary allowable deductions",
    fields: [
      "txtPg3Sc5It17i",
      "txtPg3Sc5Itm17iA",
      "txtPg3Sc5Itm17iB",
      "txtPg3Sc5Itm17iC",
    ],
  },
  {
    base: "txtPg6Sc6",
    count: "txtCtrmodalPg6Sc6",
    label: "Special allowable deductions",
    fields: [
      "txtPg6Sc6I4description",
      "txtPg6Sc6I4legal",
      "txtPg6Sc6I4CA",
      "txtPg6Sc6I4CB",
      "txtPg6Sc6I4CC",
    ],
  },
  ...[3, 6, 8].map((item) => ({
    base: `txtPg4Sc10Itm${item}`,
    count: `txtCtrmodalPg7Sc10I${item}`,
    label:
      item === 3
        ? "Reconciliation additions"
        : item === 6
          ? "Reconciliation income exclusions"
          : "Reconciliation deductions",
    fields: [
      `txtPg4Sc10Itm${item}`,
      ...["A", "B", "C"].map((column) => `txtPg4Sc10Itm${item}${column}`),
    ],
  })),
];
function attachmentGroups(code: string, instance: string): DetailGroup[] {
  const group = (
    base: string,
    counter: string,
    label: string,
    fields: string[],
  ) => ({
    base: base.replaceAll("AttM", instance),
    count: counter.replaceAll("AttM", instance),
    label:
      (instance === "AttM"
        ? ""
        : `${instance.startsWith("EX") ? "Exempt activity" : "Special-rate activity"} ${instance.slice(2)} · `) +
      label,
    fields: fields.map((id) => id.replaceAll("AttM", instance)),
    moneyColumns: 1,
  });
  const special = group(
    "txtPg4AttMScHI4",
    "txtAttMCtrPg4MScHI4",
    "special allowable deductions",
    ["txtPg4AttMScHI4C1", "txtPg4AttMScHI4C2", "txtPg4AttMScHI4C3"],
  );
  if (code !== "1702MX")
    return [
      group(
        "txtPg2AttMScDI17i",
        "txtAttMCtrPg2MScDI17i",
        "other ordinary allowable deductions",
        ["txtPg2AttMScDI17iother", "txtPg2AttMScDI25"],
      ),
      special,
    ];
  return [
    group("txtPg3AttMScF", "txtAttMCtrPg3MScFI3", "other taxable income", [
      "txtPg3AttMScFI3other",
      "txtPg3AttMScFI3C1",
    ]),
    group("txtPg3AttMScGI4", "txtAttMCtrPg3MScGI4", "other amortizations", [
      "txtPg3AttMScGI4other",
      "txtPg3AttMScGI4C1",
    ]),
    group(
      "txtPg4AttMScGI39",
      "txtAttMCtrPg4MScGI39",
      "other ordinary allowable deductions",
      ["txtPg4AttMScGI39other", "txtPg4AttMScGI39C1"],
    ),
    special,
  ];
}
function activeGroups(code: string, values: CorporateValues): DetailGroup[] {
  const multiple =
    code === "1702MX"
      ? values[p + "chkPg2Pt4I30MoreThanOne"] === "Y"
      : values[p + "rdoPg2I1"] === "F";
  return [
    ...groups(code),
    ...(multiple
      ? (["EX", "SP"] as const).flatMap((key) =>
          Array.from(
            {
              length: Math.max(
                0,
                Math.min(
                  99,
                  Math.trunc(mixedNumber(values[p + `total${key}Attach`])),
                ),
              ),
            },
            (_, index) => attachmentGroups(code, key + (index + 1)),
          ).flat(),
        )
      : []),
  ];
}
const groups = (code: string) => (code === "1702MX" ? legacy : revised);
const count = (group: DetailGroup, values: CorporateValues) =>
  Math.max(0, Math.min(99, Math.trunc(mixedNumber(values[p + group.count]))));
const rowFor = (pages: CorporatePage[], group: DetailGroup) =>
  pages
    .flatMap((page) => page.sections.flatMap((section) => section.rows))
    .find((row) =>
      row.fields.some((field) => field.id === p + group.fields[0]),
    );
function baseFields(group: DetailGroup): CorporateField[] {
  const textColumns = group.fields.length - (group.moneyColumns ?? 3);
  return group.fields.map((id, index) => ({
    id: p + id,
    label:
      index < textColumns
        ? index === 0
          ? "Description"
          : "Legal basis"
        : group.moneyColumns === 1
          ? "Amount"
          : ["Exempt", "Special rate", "Regular rate"][index - textColumns],
    kind: index < textColumns ? "text" : "money",
    defaultValue: index < textColumns ? "" : "0",
  }));
}
function details(group: DetailGroup, values: CorporateValues): CorporateRow[] {
  return Array.from({ length: count(group, values) }, (_, index) => ({
    item: String(index + 1),
    entry: { group: p + group.count, index },
    label: group.label,
    fields: baseFields(group).map((field, column) => ({
      ...field,
      id: p + `${group.base}_${index + 1}Col${column + 1}`,
    })),
  }));
}
function preparePages(
  pages: CorporatePage[],
  selectedGroups: DetailGroup[],
): CorporatePage[] {
  for (const group of selectedGroups) {
    const row = rowFor(pages, group);
    if (!row) continue;
    const editable = new Map(
      baseFields(group).map((field) => [field.id, field]),
    );
    const totalId =
      (group.moneyColumns ?? 3) === 3
        ? p + group.fields.at(-1)!.replace(/C$/, "D")
        : undefined;
    const totalField = pages
      .flatMap((page) =>
        page.sections.flatMap((section) =>
          section.rows.flatMap((row) => row.fields),
        ),
      )
      .find((field) => field.id === totalId);
    const sourceIds = new Set([
      ...editable.keys(),
      ...(totalField ? [totalField.id] : []),
    ]);
    for (const page of pages)
      for (const section of page.sections)
        for (const other of section.rows) {
          if (other !== row)
            other.fields = other.fields.filter(
              (field) => !sourceIds.has(field.id),
            );
        }
    row.label = group.label;
    row.item =
      group.fields[0].match(/(?:Itm|It|I)(\d+[a-z]?)/)?.[1] ?? row.item;
    row.fields = [
      ...row.fields.filter((field) => !sourceIds.has(field.id)),
      ...baseFields(group),
      ...(totalField
        ? [{ ...totalField, label: "Total", column: undefined }]
        : []),
    ];
    for (const field of row.fields) field.column = undefined;
    for (const page of pages)
      for (const section of page.sections)
        section.rows = section.rows.filter((row) => row.fields.length);
    row.fields.push({
      id: p + group.count,
      label: group.label,
      repeatable: { label: group.label, limit: 99, rollup: true },
      kind: "integer",
      defaultValue: "0",
      maxLength: 2,
    });
  }
  return pages;
}
function expandPages(
  pages: CorporatePage[],
  values: CorporateValues,
  selectedGroups: DetailGroup[],
): CorporatePage[] {
  const result = structuredClone(pages);
  for (const group of selectedGroups) {
    if (count(group, values) === 0) continue;
    for (const page of result)
      for (const section of page.sections) {
        section.rows = section.rows.flatMap((row) =>
          row.fields.some((field) => field.id === p + group.count)
            ? [
                {
                  ...row,
                  fields: row.fields.map((field) =>
                    field.id === p + group.count
                      ? field
                      : { ...field, readonly: true },
                  ),
                },
                ...details(group, values),
              ]
            : [row],
        );
      }
  }
  return result;
}
export function mixedDetailContinuations(
  code: string,
  values: CorporateValues,
): CorporateSection[] {
  return activeGroups(code, values)
    .filter((group) => count(group, values) > 0)
    .map((group) => ({
      title: group.label,
      columns: baseFields(group).map((field) => field.label ?? ""),
      rows: details(group, values),
    }));
}
export function rollupMixedDetails(
  code: string,
  input: CorporateValues,
): CorporateValues {
  const result = { ...input };
  for (const group of activeGroups(code, result)) {
    const length = count(group, result);
    if (length === 0) {
      const hasSavedDetails = group.fields.some((_, index) =>
        !!result[p + `${group.base}_1Col${index + 1}`]?.trim(),
      );
      if (Object.hasOwn(result, p + group.count) && hasSavedDetails) {
        for (const field of baseFields(group))
          result[field.id] = field.kind === "money" ? "0" : "";
      }
      continue;
    }
    if (
      !group.fields.some((_, index) =>
        Object.hasOwn(result, p + `${group.base}_1Col${index + 1}`),
      )
    ) {
      group.fields.forEach((id, index) => {
        result[p + `${group.base}_1Col${index + 1}`] = result[p + id] ?? "";
      });
    }
    for (const [column, field] of baseFields(group).entries()) {
      const entries = Array.from(
        { length },
        (_, index) =>
          result[p + `${group.base}_${index + 1}Col${column + 1}`] ?? "",
      );
      result[field.id] =
        field.kind === "money"
          ? String(
              entries.reduce((total, value) => total + mixedNumber(value), 0),
            )
          : length === 1
            ? entries[0]
            : "OTHERS";
    }
  }
  return result;
}
export function validateMixedDetails(
  code: string,
  values: CorporateValues,
): CorporateValues {
  const errors: CorporateValues = {};
  for (const group of activeGroups(code, values))
    for (const row of details(group, values)) {
      const text = row.fields.filter((field) => field.kind === "text");
      const money = row.fields.filter((field) => field.kind === "money");
      const entered = row.fields.some(
        (field) => values[field.id]?.trim() && values[field.id] !== "0",
      );
      if (!entered) continue;
      for (const field of text)
        if (!values[field.id]?.trim())
          errors[field.id] = `Enter the ${field.label?.toLowerCase()}.`;
      if (!money.some((field) => mixedNumber(values[field.id]) !== 0))
        errors[money[0].id] = "Enter a nonzero amount for this detailed entry.";
    }
  return errors;
}

export function mixedRepeatablePages(
  code: string,
  pages: CorporatePage[],
): CorporatePage[] {
  return preparePages(pages, groups(code));
}
export function mixedAttachmentRepeatablePages(
  code: string,
  pages: CorporatePage[],
): CorporatePage[] {
  return preparePages(pages, attachmentGroups(code, "AttM"));
}
export function expandMixedDetails(
  code: string,
  pages: CorporatePage[],
  values: CorporateValues,
): CorporatePage[] {
  return expandPages(pages, values, groups(code));
}
export function expandMixedAttachmentDetails(
  code: string,
  pages: CorporatePage[],
  values: CorporateValues,
  id: string,
): CorporatePage[] {
  return expandPages(pages, values, attachmentGroups(code, id));
}
