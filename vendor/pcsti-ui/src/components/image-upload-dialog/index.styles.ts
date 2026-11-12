import { host } from "../../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const imageUpload = stylex.create({
  cropHeight: {
    minHeight: "calc(var(--spacing) * 90)",
  },
  resultHeight: {
    minHeight: "calc(var(--spacing) * 70)",
  },
  sourceHeight: {
    minHeight: "320px",
  },
  root: {
    position: "relative",
  },
  step: {
    display: "flex",
    animationName: {
      default: host.animateStepInName,
      "@media (prefers-reduced-motion: reduce)": "none",
    },
    animationDuration: {
      default: "var(--animate-step-in-duration)",
      "@media (prefers-reduced-motion: reduce)": "0s",
    },
    animationTimingFunction: {
      default: "var(--animate-step-in-timing-function)",
      "@media (prefers-reduced-motion: reduce)": "ease",
    },
    animationDelay: {
      default: "var(--animate-step-in-delay)",
      "@media (prefers-reduced-motion: reduce)": "0s",
    },
    animationIterationCount: {
      default: 1,
      "@media (prefers-reduced-motion: reduce)": 1,
    },
    animationDirection: {
      default: "normal",
      "@media (prefers-reduced-motion: reduce)": "normal",
    },
    animationFillMode: {
      default: "both",
      "@media (prefers-reduced-motion: reduce)": "none",
    },
    animationPlayState: {
      default: "running",
      "@media (prefers-reduced-motion: reduce)": "running",
    },
    flexDirection: "column",
    gap: "calc(var(--spacing) * 4)",
  },
  error: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "calc(var(--spacing) * 4)",
    paddingBlock: "calc(var(--spacing) * 8)",
  },
  errorBadge: {
    display: "flex",
    width: "calc(var(--spacing) * 12)",
    height: "calc(var(--spacing) * 12)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: "color-mix(in oklab, var(--danger) 10%, transparent)",
    "--sx-ring-shadow":
      "var(--sx-ring-inset,) 0 0 0 calc(1px + var(--sx-ring-offset-width)) var(--sx-ring-color, currentcolor)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    "--sx-ring-color": "color-mix(in oklab, var(--danger) 20%, transparent)",
  },
  errorIcon: {
    width: "calc(var(--spacing) * 6)",
    height: "calc(var(--spacing) * 6)",
    color: "var(--danger)",
  },
  errorCopy: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--spacing)",
    textAlign: "center",
  },
  errorTitle: {
    fontSize: "var(--text-sm)",
    lineHeight: "var(--sx-leading, var(--text-sm--line-height))",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--fg)",
  },
  errorMessage: {
    maxWidth: "var(--container-xs)",
    fontSize: "var(--text-xs)",
    lineHeight: "var(--sx-leading, var(--text-xs--line-height))",
    color: "var(--fg-muted)",
  },
  retryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "var(--border)",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    backgroundColor: {
      default: "var(--bg-elev)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
    },
    paddingInline: "calc(var(--spacing) * 5)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
    fontSize: "13px",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--fg)",
    transitionProperty: "transform,background-color,border-color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
    "--sx-ease": "var(--ease-out)",
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
    scale: {
      default: null,
      ":active": "0.97",
    },
  },
});
