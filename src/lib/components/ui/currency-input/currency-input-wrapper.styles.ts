import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "control": {
    "textAlign": "right",
    "--sx-numeric-spacing": "tabular-nums",
    "fontVariantNumeric": "var(--sx-ordinal,) var(--sx-slashed-zero,) var(--sx-numeric-figure,) var(--sx-numeric-spacing,) var(--sx-numeric-fraction,)"
  },
  "symbol": {
    "color": "var(--fg-subtle)"
  }
});
