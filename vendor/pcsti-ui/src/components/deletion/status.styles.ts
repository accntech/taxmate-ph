import * as stylex from "@stylexjs/stylex";
import { host } from "../../theme.stylex";

export const deletionStatus = stylex.create({
  root: {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--spacing)",
    color: "var(--fg-muted)",
    fontSize: "12px",
    minWidth: 0,
    maxWidth: "100%",
    whiteSpace: "normal",
    overflowWrap: "anywhere",
  },
  spinner: {
    width: "calc(var(--spacing) * 3)",
    height: "calc(var(--spacing) * 3)",
    flexShrink: 0,
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "color-mix(in oklch, var(--fg-muted) 25%, transparent)",
    borderTopColor: "var(--fg-muted)",
    borderRadius: "50%",
    animationName: {
      default: host.animateSpinRingName,
      "@media (prefers-reduced-motion: reduce)": "none",
    },
    animationDuration: "var(--animate-spin-ring-duration)",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  icon: {
    width: "calc(var(--spacing) * 3)",
    height: "calc(var(--spacing) * 3)",
    flexShrink: 0,
  },
});
