import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "touch": {
    "minHeight": "calc(var(--spacing) * 12)",
    "fontSize": "var(--text-base)",
    "lineHeight": "var(--sx-leading, var(--text-base--line-height))"
  },
  "field": {
    "display": "grid",
    "minWidth": "calc(var(--spacing) * 0)",
    "gap": "calc(var(--spacing) * 2)"
  },
  "label": {
    "color": "var(--fg-muted)"
  },
  "required": {
    "color": "var(--danger)"
  },
  "help": {
    "fontSize": "var(--text-xs)",
    "lineHeight": "var(--sx-leading, var(--text-xs--line-height))",
    "color": "var(--fg-subtle)"
  }
});
