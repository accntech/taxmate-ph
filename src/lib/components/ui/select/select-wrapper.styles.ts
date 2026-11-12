import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "field": {
    "display": "grid",
    "minWidth": "calc(var(--spacing) * 0)",
    "gap": "calc(var(--spacing) * 2)"
  },
  "required": {
    "color": "var(--danger)"
  },
  "option": {
    "display": "flex",
    "minWidth": "calc(var(--spacing) * 0)",
    "alignItems": "center",
    "gap": "calc(var(--spacing) * 2)"
  },
  "optionDetails": {
    "display": "grid",
    "minWidth": "calc(var(--spacing) * 0)",
    "gap": "calc(var(--spacing) * 0.5)"
  },
  "optionLabel": {
    "overflow": "hidden",
    "textOverflow": "ellipsis",
    "whiteSpace": "nowrap",
    "--sx-font-weight": "var(--font-weight-medium)",
    "fontWeight": "var(--font-weight-medium)"
  },
  "optionDescription": {
    "fontSize": "var(--text-xs)",
    "lineHeight": "var(--sx-leading, var(--text-xs--line-height))",
    "color": "var(--fg-muted)"
  }
});
