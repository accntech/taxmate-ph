import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "root": {
    "display": "grid",
    "gap": "calc(var(--spacing) * 1)",
    "fontSize": "var(--text-sm)",
    "lineHeight": "var(--sx-leading, var(--text-sm--line-height))",
    "--sx-font-weight": "var(--font-weight-medium)",
    "fontWeight": "var(--font-weight-medium)",
    "color": "var(--danger)"
  }
});
