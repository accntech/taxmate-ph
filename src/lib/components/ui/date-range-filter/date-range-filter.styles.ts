import * as stylex from "@stylexjs/stylex";

export const dateRange = stylex.create({
  presets: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--spacing)",
    paddingInline: {
      default: "calc(var(--spacing) * 2.5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 2)",
    },
    paddingTop: "var(--spacing)",
    paddingBottom: "calc(var(--spacing) * 2.5)",
  },
  presetButton: {
    borderRadius: "calc(infinity * 1px)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "var(--border-soft)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--border)",
      },
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    backgroundColor: {
      default: "var(--bg)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
    },
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBlock: {
      default: "calc(var(--spacing) * 0.75)",
      "@media (width < 48rem)": "var(--spacing)",
    },
    fontSize: {
      default: "11.5px",
      "@media (width < 48rem)": "12.5px",
    },
    color: {
      default: "var(--fg-muted)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    transitionProperty: "background-color,color,border-color,box-shadow",
    transitionTimingFunction:
      "var(--sx-ease, var(--default-transition-timing-function))",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
    "--sx-outline-style": "none",
    outlineStyle: "none",
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
  dateFields: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "calc(var(--spacing) * 2)",
    paddingInline: {
      default: "calc(var(--spacing) * 2.5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 2)",
    },
    paddingBottom: "calc(var(--spacing) * 2)",
  },
  dateField: {
    display: "flex",
    minWidth: "0px",
    flexDirection: "column",
    gap: "var(--spacing)",
    fontSize: "10.5px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    "--sx-tracking": "0.06em",
    letterSpacing: "0.06em",
    color: "var(--fg-subtle)",
    textTransform: "uppercase",
  },
});
