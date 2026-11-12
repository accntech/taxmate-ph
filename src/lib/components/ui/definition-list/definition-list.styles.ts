import * as stylex from "@stylexjs/stylex";

export const definitionList = stylex.create({
  root: {
    minWidth: 0,
    display: "grid",
    columnGap: "calc(var(--spacing) * 3)",
    rowGap: "calc(var(--spacing) * 1.5)",
  },
  label: {
    minWidth: 0,
    overflowWrap: "anywhere",
    alignSelf: "center",
    fontSize: "11px",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    "--sx-tracking": "0.04em",
    letterSpacing: "0.04em",
    color: "var(--fg-muted)",
    textTransform: "uppercase",
  },
  value: {
    minWidth: 0,
    overflowWrap: "anywhere",
    alignSelf: "center",
    fontSize: "13px",
    color: "var(--fg)",
  },
  monospacedValue: {
    fontFamily: "var(--font-mono)",
    "--sx-numeric-spacing": "tabular-nums",
    fontVariantNumeric:
      "var(--sx-ordinal,) var(--sx-slashed-zero,) var(--sx-numeric-figure,) var(--sx-numeric-spacing,) var(--sx-numeric-fraction,)",
  },
});
