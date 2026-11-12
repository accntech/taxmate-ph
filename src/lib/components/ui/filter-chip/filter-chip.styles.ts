import { host } from "../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const filterChip = stylex.create({
  root: {
    display: "inline-flex",
    minHeight: {
      default: "calc(var(--spacing) * 7.5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 8)",
    },
    maxWidth: "calc(var(--spacing) * 55)",
    animationName: host.animateChipInName,
    animationDuration: "var(--animate-chip-in-duration)",
    animationTimingFunction: "var(--animate-chip-in-timing-function)",
    animationDelay: "var(--animate-chip-in-delay)",
    animationIterationCount: 1,
    animationDirection: "normal",
    animationFillMode: "both",
    animationPlayState: "running",
    alignItems: "center",
    gap: "calc(var(--spacing) * 1.5)",
    borderRadius: "calc(infinity * 1px)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border-soft)",
    backgroundColor: "var(--bg-elev-2)",
    paddingBlock: "var(--spacing)",
    paddingRight: "var(--spacing)",
    paddingLeft: "calc(var(--spacing) * 2.5)",
    fontSize: "var(--text-xs)",
    lineHeight: "var(--sx-leading, var(--text-xs--line-height))",
  },
  label: {
    flex: "none",
    color: "var(--fg-subtle)",
  },
  value: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--fg)",
  },
  clearButton: {
    display: "inline-flex",
    width: {
      default: "calc(var(--spacing) * 5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 6)",
    },
    height: {
      default: "calc(var(--spacing) * 5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 6)",
    },
    flex: "none",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "calc(infinity * 1px)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
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
      ":active": "90%",
    },
    "--sx-scale-y": {
      default: null,
      ":active": "90%",
    },
    "--sx-scale-z": {
      default: null,
      ":active": "90%",
    },
    scale: {
      default: null,
      ":active": "var(--sx-scale-x) var(--sx-scale-y)",
    },
  },
  clearIcon: {
    width: "calc(var(--spacing) * 3)",
    height: "calc(var(--spacing) * 3)",
  },
});
