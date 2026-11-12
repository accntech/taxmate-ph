import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "root": {
    "display": "grid",
    "minWidth": "calc(var(--spacing) * 0)",
    "gap": "calc(var(--spacing) * 2)"
  },
  "label": {
    "color": "var(--fg-muted)"
  },
  "required": {
    "color": "var(--danger)"
  }
});
