import { host } from "../../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const bulkBar = stylex.create({
  sentinel: {
    height: "1px",
  },
  selectionSummary: {
    marginRight: "var(--spacing)",
    display: "inline-flex",
    flex: "none",
    alignItems: "center",
    gap: "calc(var(--spacing) * 1.5)",
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: "var(--accent)",
    paddingBlock: "calc(var(--spacing) * 0.5)",
    paddingRight: "calc(var(--spacing) * 2.5)",
    paddingLeft: "calc(var(--spacing) * 2)",
    fontSize: "11.5px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--accent-fg)",
    "--sx-shadow":
      "0 1px 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 30%,transparent))",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
  },
  selectionDot: {
    width: "calc(var(--spacing) * 1.5)",
    height: "calc(var(--spacing) * 1.5)",
    flex: "none",
    animationName: host.animatePulseSoftName,
    animationDuration: "var(--animate-pulse-soft-duration)",
    animationTimingFunction: "var(--animate-pulse-soft-timing-function)",
    animationDelay: "var(--animate-pulse-soft-delay)",
    animationIterationCount: "infinite",
    animationDirection: "normal",
    animationFillMode: "none",
    animationPlayState: "running",
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: "var(--accent-fg)",
  },
  count: {
    fontFamily: "var(--font-mono)",
    "--sx-numeric-spacing": "tabular-nums",
    fontVariantNumeric:
      "var(--sx-ordinal,) var(--sx-slashed-zero,) var(--sx-numeric-figure,) var(--sx-numeric-spacing,) var(--sx-numeric-fraction,)",
  },
  selectedLabel: {
    marginRight: "var(--spacing)",
    flex: "none",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    whiteSpace: "nowrap",
    color: "var(--fg-subtle)",
  },
  separator: {
    marginInline: "var(--spacing)",
    height: "calc(var(--spacing) * 4)",
    width: "1px",
    flex: "none",
    backgroundColor: "var(--border)",
  },
  clearButton: {
    marginLeft: "auto",
    display: "inline-flex",
    flex: "none",
    alignItems: "center",
    gap: "calc(var(--spacing) * 1.5)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--border)",
      },
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    paddingInline: "calc(var(--spacing) * 2)",
    paddingBlock: "var(--spacing)",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: {
      default: "var(--fg-muted)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    transitionProperty:
      "transform,background-color,color,border-color,box-shadow",
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
        ":hover": "var(--bg-elev)",
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
    minHeight: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 11)",
    },
    minWidth: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 11)",
    },
    justifyContent: {
      default: null,
      "@media (width < 48rem)": "center",
    },
  },
  clearIcon: {
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
    flex: "none",
  },
  shortClearLabel: {
    display: {
      default: "none",
      "@media (width >= 48rem)": "inline",
    },
  },
  longClearLabel: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    borderWidth: "0",
    display: {
      default: null,
      "@media (width >= 48rem)": "none",
    },
  },
  root: {
    position: "sticky",
    top: "var(--topbar-h,56px)",
    zIndex: 30,
    display: "flex",
    animationName: host.animateBulkBarInName,
    animationDuration: "var(--animate-bulk-bar-in-duration)",
    animationTimingFunction: "var(--animate-bulk-bar-in-timing-function)",
    animationDelay: "var(--animate-bulk-bar-in-delay)",
    animationIterationCount: 1,
    animationDirection: "normal",
    animationFillMode: "both",
    animationPlayState: "running",
    scrollbarWidth: "none",
    flexWrap: "nowrap",
    alignItems: "center",
    gap: "var(--spacing)",
    overflowX: "auto",
    borderBlockStyle: host.borderStyle,
    borderBlockWidth: "1px",
    borderColor: "var(--border-soft)",
    backgroundColor: {
      default: "color-mix(in oklch,var(--fg) 5%,var(--bg))",
      ":where(.dark, .dark *)":
        "color-mix(in oklch,var(--fg) 7%,var(--bg-elev-2))",
    },
    paddingInline: {
      default: "calc(var(--spacing) * 3)",
      "@media (width >= 48rem)": "calc(var(--spacing) * 4)",
    },
    paddingBlock: {
      default: "calc(var(--spacing) * 2)",
      "@media (width >= 48rem)": "calc(var(--spacing) * 2.5)",
    },
    fontSize: "12.5px",
    color: "var(--fg)",
    transitionProperty: "margin,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "180ms",
    "--sx-duration": "180ms",
    "--sx-ease": "var(--ease-out)",
    marginInline: {
      default: null,
      ':is([data-stuck="true"])': "calc(var(--spacing) * -3.25)",
      "@media (width >= 48rem)": {
        default: null,
        ':is([data-stuck="true"])': "calc(var(--spacing) * -7.25)",
      },
    },
    "--sx-shadow": {
      default: null,
      ':is([data-stuck="true"])': "var(--shadow-md)",
    },
    boxShadow: {
      default: null,
      ':is([data-stuck="true"])':
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
    "::-webkit-scrollbar": {
      display: "none",
    },
  },
});
