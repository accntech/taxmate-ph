import * as stylex from "@stylexjs/stylex";

export const listPager = stylex.create({
  panel: {
    minWidth: "calc(var(--spacing) * 35)",
  },
  trigger: {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--spacing)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    paddingInline: "calc(var(--spacing) * 2)",
    paddingBlock: "var(--spacing)",
    fontSize: "12px",
    color: "var(--fg-muted)",
    transitionProperty: "background-color,border-color,box-shadow,color",
    transitionTimingFunction:
      "var(--sx-ease, var(--default-transition-timing-function))",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    backgroundColor: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
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
  menuIcon: {
    width: "calc(var(--spacing) * 3)",
    height: "calc(var(--spacing) * 3)",
  },
  option: {
    width: "100%",
    justifyContent: "space-between",
    textAlign: "left",
  },
  selected: {
    color: "var(--fg)",
  },
  unselected: {
    color: "var(--fg-muted)",
  },
  optionLabel: {
    display: "grid",
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
    flex: "none",
    placeItems: "center",
  },
  checkIcon: {
    width: "calc(var(--spacing) * 3)",
    height: "calc(var(--spacing) * 3)",
    color: "var(--fg-muted)",
  },
});
