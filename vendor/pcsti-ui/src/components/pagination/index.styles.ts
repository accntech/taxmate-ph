import { host } from "../../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const pagination = stylex.create({
  root: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: {
      default: "center",
      "@media (width < 48rem)": "stretch",
    },
    justifyContent: "space-between",
    gap: {
      default: "calc(var(--spacing) * 3)",
      "@media (width < 48rem)": "calc(var(--spacing) * 3)",
    },
    borderTopStyle: "solid",
    borderTopWidth: "1px",
    borderColor: "var(--border-soft)",
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2.5)",
    fontSize: "12.5px",
    color: "var(--fg-muted)",
    flexDirection: {
      default: null,
      "@media (width < 48rem)": "column",
    },
    padding: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 3)",
    },
    paddingBottom: {
      default: null,
      "@media (width < 48rem)": "calc(0.75rem + env(safe-area-inset-bottom))",
    },
  },
  summary: {
    display: "flex",
    alignItems: "center",
    gap: {
      default: "calc(var(--spacing) * 2)",
      "@media (width < 48rem)": "calc(var(--spacing) * 3)",
    },
    order: {
      default: null,
      "@media (width < 48rem)": "2",
    },
    justifyContent: {
      default: null,
      "@media (width < 48rem)": "space-between",
    },
    fontSize: {
      default: null,
      "@media (width < 48rem)": "13px",
    },
  },
  count: {
    fontFamily: "var(--font-mono)",
    color: "var(--fg)",
    "--sx-numeric-spacing": "tabular-nums",
    fontVariantNumeric:
      "var(--sx-ordinal,) var(--sx-slashed-zero,) var(--sx-numeric-figure,) var(--sx-numeric-spacing,) var(--sx-numeric-fraction,)",
  },
  separator: {
    display: {
      default: null,
      "@media (width < 48rem)": "none",
    },
  },
  navigation: {
    display: "flex",
    alignItems: "center",
    gap: {
      default: "var(--spacing)",
      "@media (width < 48rem)": "calc(var(--spacing) * 2)",
    },
    order: {
      default: null,
      "@media (width < 48rem)": "1",
    },
    justifyContent: {
      default: null,
      "@media (width < 48rem)": "space-between",
    },
  },
  stepButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: {
      default: "var(--spacing)",
      "@media (width < 48rem)": "calc(var(--spacing) * 1.5)",
    },
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
      "@media (width < 48rem)": "var(--border-soft)",
    },
    paddingInline: "calc(var(--spacing) * 2)",
    paddingBlock: "var(--spacing)",
    fontSize: {
      default: "12px",
      "@media (width < 48rem)": "var(--text-sm)",
    },
    color: {
      default: "var(--fg-muted)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    transitionProperty: "transform,background-color,color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    backgroundColor: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
      "@media (width < 48rem)": "var(--bg)",
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
    "--sx-scale-x": {
      default: null,
      ":active": "97%",
    },
    "--sx-scale-y": {
      default: null,
      ":active": "97%",
    },
    "--sx-scale-z": {
      default: null,
      ":active": "97%",
    },
    scale: {
      default: null,
      ":active": "var(--sx-scale-x) var(--sx-scale-y)",
    },
    minHeight: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 7.5)",
    },
    minWidth: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 8.5)",
    },
    flex: {
      default: null,
      "@media (width < 48rem)": "none",
    },
    justifyContent: {
      default: null,
      "@media (width < 48rem)": "center",
    },
    lineHeight: {
      default: null,
      "@media (width < 48rem)":
        "var(--sx-leading, var(--text-sm--line-height))",
    },
    "--sx-font-weight": {
      default: null,
      "@media (width < 48rem)": "var(--font-weight-medium)",
    },
    fontWeight: {
      default: null,
      "@media (width < 48rem)": "var(--font-weight-medium)",
    },
  },
  navigationIcon: {
    width: {
      default: "calc(var(--spacing) * 3)",
      "@media (width < 48rem)": "calc(var(--spacing) * 4)",
    },
    height: {
      default: "calc(var(--spacing) * 3)",
      "@media (width < 48rem)": "calc(var(--spacing) * 4)",
    },
  },
  stepLabel: {
    position: {
      default: null,
      "@media (width < 48rem)": "absolute",
    },
    width: {
      default: null,
      "@media (width < 48rem)": "1px",
    },
    height: {
      default: null,
      "@media (width < 48rem)": "1px",
    },
    padding: {
      default: null,
      "@media (width < 48rem)": "0",
    },
    margin: {
      default: null,
      "@media (width < 48rem)": "-1px",
    },
    overflow: {
      default: null,
      "@media (width < 48rem)": "hidden",
    },
    clipPath: {
      default: null,
      "@media (width < 48rem)": "inset(50%)",
    },
    whiteSpace: {
      default: null,
      "@media (width < 48rem)": "nowrap",
    },
    borderWidth: {
      default: null,
      "@media (width < 48rem)": "0",
    },
  },
  disabledStep: {
    display: "inline-flex",
    alignItems: "center",
    gap: {
      default: "var(--spacing)",
      "@media (width < 48rem)": "calc(var(--spacing) * 1.5)",
    },
    borderRadius: "var(--radius-md)",
    paddingInline: "calc(var(--spacing) * 2)",
    paddingBlock: "var(--spacing)",
    fontSize: {
      default: "12px",
      "@media (width < 48rem)": "var(--text-sm)",
    },
    color: "var(--fg-subtle)",
    opacity: "50%",
    minHeight: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 7.5)",
    },
    minWidth: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 8.5)",
    },
    flex: {
      default: null,
      "@media (width < 48rem)": "none",
    },
    justifyContent: {
      default: null,
      "@media (width < 48rem)": "center",
    },
    borderStyle: {
      default: null,
      "@media (width < 48rem)": host.borderStyle,
    },
    borderWidth: {
      default: null,
      "@media (width < 48rem)": "1px",
    },
    borderColor: {
      default: null,
      "@media (width < 48rem)": "var(--border-soft)",
    },
    lineHeight: {
      default: null,
      "@media (width < 48rem)":
        "var(--sx-leading, var(--text-sm--line-height))",
    },
    "--sx-font-weight": {
      default: null,
      "@media (width < 48rem)": "var(--font-weight-medium)",
    },
    fontWeight: {
      default: null,
      "@media (width < 48rem)": "var(--font-weight-medium)",
    },
  },
  pageSummary: {
    display: "flex",
    alignItems: "center",
    gap: {
      default: "var(--spacing)",
      "@media (width < 48rem)": "0px",
    },
    flex: {
      default: null,
      "@media (width < 48rem)": "1",
    },
    justifyContent: {
      default: null,
      "@media (width < 48rem)": "center",
    },
    fontSize: {
      default: null,
      "@media (width < 48rem)": "var(--text-sm)",
    },
    lineHeight: {
      default: null,
      "@media (width < 48rem)":
        "var(--sx-leading, var(--text-sm--line-height))",
    },
    "--sx-numeric-spacing": {
      default: null,
      "@media (width < 48rem)": "tabular-nums",
    },
    fontVariantNumeric: {
      default: null,
      "@media (width < 48rem)":
        "var(--sx-ordinal,) var(--sx-slashed-zero,) var(--sx-numeric-figure,) var(--sx-numeric-spacing,) var(--sx-numeric-fraction,)",
    },
  },
  pageLabel: {
    display: {
      default: "none",
      "@media (width < 48rem)": "inline",
    },
  },
  pageCount: {
    display: {
      default: "none",
      "@media (width < 48rem)": "inline",
    },
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--fg)",
  },
  ellipsis: {
    paddingInline: "var(--spacing)",
    color: "var(--fg-subtle)",
    display: {
      default: null,
      "@media (width < 48rem)": "none",
    },
  },
  pageButton: {
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBlock: "var(--spacing)",
    fontSize: "12px",
    color: {
      default: "var(--fg-muted)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    transitionProperty: "transform,background-color,color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
    "--sx-ease": "var(--ease-out)",
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
    "--sx-scale-x": {
      default: null,
      ":active": "97%",
    },
    "--sx-scale-y": {
      default: null,
      ":active": "97%",
    },
    "--sx-scale-z": {
      default: null,
      ":active": "97%",
    },
    scale: {
      default: null,
      ":active": "var(--sx-scale-x) var(--sx-scale-y)",
    },
    display: {
      default: null,
      "@media (width < 48rem)": "none",
    },
  },
  currentPage: {
    backgroundColor: "var(--bg-elev-2)",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--fg)",
  },
  compact: { flexDirection: "column", alignItems: "stretch" },
  compactSummary: {
    order: 2,
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  compactNavigation: { order: 1, justifyContent: "space-between" },
  compactStep: {
    minHeight: "calc(var(--spacing) * 7.5)",
    minWidth: "calc(var(--spacing) * 8.5)",
    justifyContent: "center",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "var(--border-soft)",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    backgroundColor: "var(--bg)",
    flex: "none",
  },
  compactIcon: {
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
  },
  compactPageSummary: {
    flex: "1",
    justifyContent: "center",
    gap: "0px",
    whiteSpace: "nowrap",
  },
  compactHidden: { display: "none" },
  compactVisible: { display: "inline" },
});
