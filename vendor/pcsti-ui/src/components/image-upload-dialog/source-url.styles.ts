import { host } from "../../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const imageUrl = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "calc(var(--spacing) * 4)",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "calc(var(--spacing) * 2)",
  },
  label: {
    fontSize: "var(--text-xs)",
    lineHeight: "var(--sx-leading, var(--text-xs--line-height))",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: "color-mix(in oklab, var(--fg) 70%, transparent)",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
  },
  inputFrame: {
    position: "relative",
    flex: "1",
  },
  linkIcon: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
    color: "var(--fg-muted)",
  },
  clearButton: {
    display: "inline-flex",
    height: "calc(var(--spacing) * 9.5)",
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
    paddingInline: "calc(var(--spacing) * 3)",
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
  clearIcon: {
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
  },
  fetchButton: {
    display: "inline-flex",
    height: "calc(var(--spacing) * 9.5)",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    borderRadius: "var(--radius-md)",
    backgroundColor: {
      default: "var(--accent)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--accent-hover)",
      },
    },
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
    fontSize: "13px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--accent-fg)",
    "--sx-shadow": {
      default: "var(--shadow-sm)",
      ":focus-visible":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 35%,transparent))",
    },
    boxShadow: {
      default:
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
    transitionProperty: "transform,background-color,opacity,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    scale: {
      default: null,
      ":active": "0.97",
    },
    pointerEvents: {
      default: null,
      ":disabled": "none",
    },
    opacity: {
      default: null,
      ":disabled": "60%",
    },
  },
  spinner: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
    flex: "none",
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
    borderColor: "color-mix(in oklch,var(--accent-fg) 30%,transparent)",
    borderTopColor: "var(--accent-fg)",
  },
  error: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 1.5)",
  },
  errorIcon: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
    flex: "none",
    color: "var(--danger)",
  },
  errorMessage: {
    fontSize: "var(--text-xs)",
    lineHeight: "var(--sx-leading, var(--text-xs--line-height))",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--danger)",
  },
  preview: {
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
    alignItems: "center",
    gap: "calc(var(--spacing) * 3)",
    borderRadius: "var(--radius-xl)",
    backgroundColor: "color-mix(in oklab, var(--bg-elev) 30%, transparent)",
    padding: "calc(var(--spacing) * 4)",
    "--sx-ring-shadow":
      "var(--sx-ring-inset,) 0 0 0 calc(1px + var(--sx-ring-offset-width)) var(--sx-ring-color, currentcolor)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    "--sx-ring-color":
      "color-mix(in oklab, var(--border-soft) 10%, transparent)",
  },
  image: {
    maxHeight: "calc(var(--spacing) * 40)",
    borderRadius: "var(--radius-lg)",
    objectFit: "contain",
    "--sx-shadow": "var(--shadow-sm)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
  },
  selectButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    borderRadius: "var(--radius-md)",
    backgroundColor: {
      default: "var(--accent)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--accent-hover)",
      },
    },
    paddingInline: "calc(var(--spacing) * 5)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
    fontSize: "13px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--accent-fg)",
    "--sx-shadow": {
      default: "var(--shadow-sm)",
      ":focus-visible":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 35%,transparent))",
    },
    boxShadow: {
      default:
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
    transitionProperty: "transform,background-color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    scale: {
      default: null,
      ":active": "0.97",
    },
  },
});
