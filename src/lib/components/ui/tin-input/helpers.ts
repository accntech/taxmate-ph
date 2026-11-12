const MAX_TIN_DIGITS = 14;

export function getTinDigits(value: string | null | undefined): string {
  return (value ?? "").replace(/\D/g, "").slice(0, MAX_TIN_DIGITS);
}

export function formatTinValue(value: string | null | undefined): string {
  const inputDigits = getTinDigits(value);
  const digits = inputDigits.length === 9 ? `${inputDigits}000` : inputDigits;
  const groups = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 9),
    digits.slice(9),
  ];

  return groups.filter(Boolean).join("-");
}
