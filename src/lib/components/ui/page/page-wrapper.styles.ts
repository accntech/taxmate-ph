import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "md": {
    "maxWidth": "var(--container-4xl)"
  },
  "lg": {
    "maxWidth": "var(--container-6xl)"
  },
  "xl": {
    "maxWidth": "var(--container-7xl)"
  },
  "full": {
    "maxWidth": "none"
  },
  "root": {
    "marginInline": "auto",
    "display": "grid",
    "width": "100%",
    "minWidth": "calc(var(--spacing) * 0)",
    "gridTemplateColumns": "minmax(0,1fr)",
    "gap": {
      "default": "calc(var(--spacing) * 4)",
      "@media (width >= 64rem)": "calc(var(--spacing) * 5)"
    },
    "paddingInline": {
      "default": "calc(var(--spacing) * 1)",
      "@media (width >= 40rem)": "calc(var(--spacing) * 2)"
    },
    "paddingBottom": "calc(var(--spacing) * 8)"
  }
});
