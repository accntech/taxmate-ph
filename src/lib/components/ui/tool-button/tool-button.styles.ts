import { host } from "../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const toolButton = stylex.create({
  root: {
    display: "inline-flex",
    width: "auto",
    minWidth: "calc(var(--spacing) * 7.5)",
    paddingInline: "calc(var(--spacing) * 2)",
    backgroundColor: {
      default: "var(--bg)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
    },
    color: {
      default: "var(--fg-muted)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
  },
  iconFrame: {
    position: "relative",
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
    flex: "none",
  },
  icon: {
    display: "block",
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
  },
  loadingIcon: {
    opacity: "0%",
  },
  spinner: {
    position: "absolute",
    inset: "0px",
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
    borderColor: "var(--fg-muted)",
    borderTopColor: "transparent",
  },
  tooltip: {
    display: "inline-flex",
  },
});
