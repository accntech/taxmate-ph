import * as stylex from "@stylexjs/stylex";

export const pickerList = stylex.create({
  emptyMessage: {
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBottom: "calc(var(--spacing) * 1.5)",
    fontSize: {
      default: "var(--text-xs)",
      "@media (width < 48rem)": "var(--text-sm)",
    },
    lineHeight: {
      default: "var(--sx-leading, var(--text-xs--line-height))",
      "@media (width < 48rem)":
        "var(--sx-leading, var(--text-sm--line-height))",
    },
    color: "var(--fg-subtle)",
    padding: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 2)",
    },
  },
  searchRow: {
    paddingInline: {
      default: "calc(var(--spacing) * 2.5)",
      "@media (width < 48rem)": "var(--spacing)",
    },
    paddingTop: "var(--spacing)",
    paddingBottom: {
      default: "calc(var(--spacing) * 1.5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 2)",
    },
  },
  searchField: {
    display: "flex",
    height: {
      default: "calc(var(--spacing) * 7.5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 9)",
    },
    width: "100%",
    alignItems: "center",
    gap: "calc(var(--spacing) * 1.5)",
    borderRadius: "0.25rem",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "var(--border)",
      ":focus-within": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    backgroundColor: {
      default: "var(--bg-input)",
      ":focus-within": "var(--bg-elev)",
    },
    paddingInline: "calc(var(--spacing) * 2)",
    transitionProperty: "background-color,border-color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-shadow": {
      default: null,
      ":focus-within":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 18%,transparent))",
    },
    boxShadow: {
      default: null,
      ":focus-within":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
  },
  searchIcon: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
    flex: "none",
    color: "var(--fg-subtle)",
  },
  searchInput: {
    minWidth: "0px",
    flex: "1",
    borderStyle: "solid",
    borderWidth: "0px",
    backgroundColor: "transparent",
    fontSize: {
      default: "12.5px",
      "@media (width < 48rem)": "15px",
    },
    color: "var(--fg)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    "::placeholder": {
      color: "var(--fg-subtle)",
    },
  },
  scrollFrame: {
    position: "relative",
    display: {
      default: null,
      "@media (width < 48rem)": "flex",
    },
    minHeight: {
      default: null,
      "@media (width < 48rem)": "0px",
    },
    flex: {
      default: null,
      "@media (width < 48rem)": "1",
    },
    flexDirection: {
      default: null,
      "@media (width < 48rem)": "column",
    },
  },
  options: {
    minHeight: "0px",
    flex: "1",
    overflowY: "auto",
    maxHeight: {
      default: null,
      "@media (width >= 48rem)": "calc(var(--spacing) * 64)",
    },
  },
  noMatches: {
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBlock: {
      default: "calc(var(--spacing) * 3)",
      "@media (width < 48rem)": "calc(var(--spacing) * 4)",
    },
    textAlign: "center",
    fontSize: {
      default: "var(--text-xs)",
      "@media (width < 48rem)": "var(--text-sm)",
    },
    lineHeight: {
      default: "var(--sx-leading, var(--text-xs--line-height))",
      "@media (width < 48rem)":
        "var(--sx-leading, var(--text-sm--line-height))",
    },
    color: "var(--fg-subtle)",
  },
  option: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    gap: {
      default: "calc(var(--spacing) * 2)",
      "@media (width < 48rem)": "calc(var(--spacing) * 3)",
    },
    borderRadius: "var(--radius-sm)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    padding: "calc(var(--spacing) * 2.5)",
    textAlign: "left",
    fontSize: {
      default: "13.5px",
      "@media (width < 48rem)": "15px",
      "@media (width >= 48rem)": "12.5px",
    },
    color: "var(--fg)",
    transitionProperty: "background-color,color,border-color,box-shadow",
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
    cursor: {
      default: null,
      ":disabled": "not-allowed",
    },
    opacity: {
      default: null,
      ":disabled": "45%",
    },
    minHeight: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 12)",
    },
    paddingInline: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 3)",
    },
    paddingBlock: {
      default: null,
      "@media (width >= 48rem)": "calc(var(--spacing) * 1.5)",
    },
  },
  selected: {
    backgroundColor: "var(--bg-hover)",
  },
});
