import { host } from "../../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const skeleton = stylex.create({
  root: {
    animationName: host.animatePulseName,
    animationDuration: "var(--animate-pulse-duration)",
    animationTimingFunction: "var(--animate-pulse-timing-function)",
    animationDelay: "var(--animate-pulse-delay)",
    animationIterationCount: "infinite",
    animationDirection: "normal",
    animationFillMode: "none",
    animationPlayState: "running",
    borderRadius: "var(--radius-md)",
    backgroundColor: "var(--bg-hover)",
  },
});
