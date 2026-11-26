import type { CorporateValues } from "../types";

export const legacyMixedOtherAtc = "frm1702MX:chkPg1I5ATCR2";
export const legacyMixedAtc = "frm1702MX:drpPg1I5ATCR2";

export function legacyMixedOtherAtcElected(values: CorporateValues): boolean {
  return ["Y", "true", "1"].includes(values[legacyMixedOtherAtc]);
}

export const legacyMixedSpecialRate = "frm1702MX:drpPg3Sc1I11CB";
export const legacyMixedReliefRate = "frm1702MX:txtPg2Pt4I34SpecialTaxRate";

// Rates in the June 2013 source package's atcCodes.xml for form 1702MX.
const legacyAtcRates: Record<string, readonly number[]> = {
  IC010: [30],
  IC011: [0],
  IC020: [30],
  IC021: [0],
  IC030: [10, 30],
  IC031: [10, 30],
  IC040: [30],
  IC041: [0],
  IC055: [2],
  IC070: [30],
  IC080: [2.5],
  IC101: [10],
  IC190: [10, 30],
  IC191: [10, 30],
};

export function legacyMixedRateLabel(rate: number): string {
  return `${new Intl.NumberFormat("en", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 8,
  }).format(rate)}%`;
}

export function legacyMixedRateOptions(values: CorporateValues) {
  const reliefRate = values[legacyMixedReliefRate]?.trim();
  const electedAtc = legacyMixedOtherAtcElected(values);
  const atcRates = electedAtc ? legacyAtcRates[values[legacyMixedAtc]] ?? [] : [];
  const fractions = [(Number(reliefRate) || 0) / 100, ...atcRates.map(rate => rate / 100)];

  // Older drafts may have stored Item 11 without the filing inputs that produce it.
  const savedRate = values[legacyMixedSpecialRate]?.trim();
  const savedFraction = Number(savedRate);
  if (!reliefRate && !electedAtc && savedRate && savedFraction >= 0 && savedFraction <= 1) {
    fractions.push(savedFraction);
  }
  return Array.from(new Set(fractions))
    .sort((a, b) => a - b)
    .map(fraction => ({ value: String(fraction), label: legacyMixedRateLabel(fraction * 100) }));
}
