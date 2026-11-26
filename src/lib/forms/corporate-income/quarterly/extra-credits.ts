import type { CorporateRow, CorporateValues } from "../types";
export const quarterlyCreditCount = "corporate:quarterlyOtherCreditRows";
const prefix = "frm1702q:sched4:";

export function quarterlyCreditRowCount(values: CorporateValues): number {
  const stored = values[quarterlyCreditCount];
  if (stored !== undefined)
    return Math.max(0, Math.min(999, Math.trunc(Number(stored) || 0)));
  const indexes = Object.keys(values).flatMap((id) => {
    const match = id.match(/^frm1702q:sched4:(?:Description|Amount)(\d+)$/);
    return match ? [Number(match[1]) + 1] : [];
  });
  return Math.max(0, ...indexes);
}

export function quarterlyExtraCreditRows(
  values: CorporateValues,
): CorporateRow[] {
  return Array.from(
    { length: quarterlyCreditRowCount(values) },
    (_, index) => ({
      item: `6b.${index + 1}`,
      entry: { group: quarterlyCreditCount, index },
      label: "Other tax credit / payment",
      fields: [
        {
          id: prefix + "Description" + index,
          kind: "text",
          label: "Description",
          maxLength: 50,
        },
        {
          id: prefix + "Amount" + index,
          kind: "money",
          label: "Amount",
          defaultValue: "0",
        },
      ],
    }),
  );
}
