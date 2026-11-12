import { host } from "../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const uploadProgress = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "calc(var(--spacing) * 5)",
    paddingBlock: "calc(var(--spacing) * 2)",
  },
  preview: {
    overflow: "hidden",
    borderRadius: "var(--radius-xl)",
    "--sx-shadow": "var(--shadow-sm)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    "--sx-ring-shadow":
      "var(--sx-ring-inset,) 0 0 0 calc(1px + var(--sx-ring-offset-width)) var(--sx-ring-color, currentcolor)",
    "--sx-ring-color":
      "color-mix(in oklab, var(--border-soft) 10%, transparent)",
  },
  image: {
    maxHeight: "calc(var(--spacing) * 44)",
    width: "100%",
    backgroundColor: "color-mix(in oklab, var(--bg-elev) 30%, transparent)",
    objectFit: "contain",
  },
  progress: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    gap: "calc(var(--spacing) * 2)",
  },
  track: {
    position: "relative",
    height: "calc(var(--spacing) * 1.5)",
    overflow: "hidden",
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: "var(--bg-elev)",
    "--sx-ring-shadow":
      "var(--sx-ring-inset,) 0 0 0 calc(1px + var(--sx-ring-offset-width)) var(--sx-ring-color, currentcolor)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    "--sx-ring-color":
      "color-mix(in oklab, var(--border-soft) 30%, transparent)",
    "--sx-ring-inset": "inset",
  },
  fill: {
    height: "100%",
    transformOrigin: "0",
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: "var(--accent)",
    transitionProperty: "width",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "360ms",
    "--sx-duration": "360ms",
    "--sx-ease": "var(--ease-out)",
  },
  shimmer: {
    width: "100%",
    height: "100%",
    animationName: host.animateShimmerName,
    animationDuration: "var(--animate-shimmer-duration)",
    animationTimingFunction: "var(--animate-shimmer-timing-function)",
    animationDelay: "var(--animate-shimmer-delay)",
    animationIterationCount: "infinite",
    animationDirection: "normal",
    animationFillMode: "none",
    animationPlayState: "running",
    "--sx-gradient-position": {
      default: "to right",
      "@supports (background-image: linear-gradient(in lab, red, red))":
        "to right in oklab",
    },
    backgroundImage: "linear-gradient(var(--sx-gradient-stops))",
    "--sx-gradient-from": "transparent",
    "--sx-gradient-stops":
      "var(--sx-gradient-via-stops, var(--sx-gradient-position), var(--sx-gradient-from) var(--sx-gradient-from-position), var(--sx-gradient-to) var(--sx-gradient-to-position))",
    "--sx-gradient-via":
      "color-mix(in oklab, var(--accent-fg) 40%, transparent)",
    "--sx-gradient-via-stops":
      "var(--sx-gradient-position), var(--sx-gradient-from) var(--sx-gradient-from-position), var(--sx-gradient-via) var(--sx-gradient-via-position), var(--sx-gradient-to) var(--sx-gradient-to-position)",
    "--sx-gradient-to": "transparent",
  },
  summary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  status: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 1.5)",
  },
  completeIcon: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
    color: "var(--accent)",
  },
  spinner: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
    animationName: host.animateSpinRingName,
    animationDuration: "var(--animate-spin-ring-duration)",
    animationTimingFunction: "var(--animate-spin-ring-timing-function)",
    animationDelay: "var(--animate-spin-ring-delay)",
    animationIterationCount: "infinite",
    animationDirection: "normal",
    animationFillMode: "none",
    animationPlayState: "running",
    borderRadius: "calc(infinity * 1px)",
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: "color-mix(in oklab, var(--accent) 30%, transparent)",
    borderTopColor: "var(--accent)",
  },
  label: {
    fontSize: "var(--text-xs)",
    lineHeight: "var(--sx-leading, var(--text-xs--line-height))",
    color: "var(--fg-muted)",
    transitionProperty:
      "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --sx-gradient-from, --sx-gradient-via, --sx-gradient-to",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "200ms",
    "--sx-duration": "200ms",
    "--sx-ease": "var(--ease-out)",
  },
  percentage: {
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-xs)",
    lineHeight: "var(--sx-leading, var(--text-xs--line-height))",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: "color-mix(in oklab, var(--fg) 70%, transparent)",
    "--sx-numeric-spacing": "tabular-nums",
    fontVariantNumeric:
      "var(--sx-ordinal,) var(--sx-slashed-zero,) var(--sx-numeric-figure,) var(--sx-numeric-spacing,) var(--sx-numeric-fraction,)",
  },
});
