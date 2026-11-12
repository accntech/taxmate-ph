import * as stylex from "@stylexjs/stylex";

export const sortHeader = stylex.create({
  button: {
    backgroundColor: "transparent",
    padding: 0,
    font: "inherit",
    color: "inherit",
    textTransform: "inherit",
    letterSpacing: "inherit",
    cursor: "pointer",
  },
  trigger: {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--spacing)",
    borderRadius: "var(--radius-sm)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    transitionProperty: "color,border-color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "150ms",
    "--sx-duration": "150ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    color: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    "--sx-shadow": {
      default: null,
      ":focus-visible":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 18%,transparent))",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
  },
  root: {
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2)",
  },
  alignEnd: {
    justifyContent: "flex-end",
  },
  sortIcon: {
    width: "calc(var(--spacing) * 3)",
    height: "calc(var(--spacing) * 3)",
    transitionProperty: "transform,opacity",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "200ms",
    "--sx-duration": "200ms",
    "--sx-ease": "var(--ease-out)",
  },
  descendingIcon: {
    rotate: "180deg",
  },
  inactiveIcon: {
    opacity: "40%",
  },
});
