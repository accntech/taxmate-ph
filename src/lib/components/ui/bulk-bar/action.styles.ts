import { host } from "../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const bulkAction = stylex.create({
  root: {
    display: "inline-flex",
    flex: "none",
    alignItems: "center",
    gap: "calc(var(--spacing) * 1.5)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    paddingInline: "calc(var(--spacing) * 2)",
    paddingBlock: "var(--spacing)",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    transitionProperty:
      "transform,background-color,color,border-color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
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
    pointerEvents: {
      default: null,
      ":disabled": "none",
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
  pending: {
    opacity: "100%",
  },
  idle: {
    opacity: {
      default: null,
      ":disabled": "45%",
    },
  },
  danger: {
    color: {
      default: "var(--fg-muted)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--danger)",
      },
    },
    borderColor: {
      default: "transparent",
      "@media (hover: hover)": {
        default: null,
        ":hover": "color-mix(in oklch,var(--danger) 40%,transparent)",
      },
      ":focus-visible": "color-mix(in oklch,var(--danger) 60%,var(--border))",
    },
    backgroundColor: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--danger-soft)",
      },
    },
    "--sx-shadow": {
      default: null,
      ":focus-visible":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--danger) 18%,transparent))",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
  },
  neutral: {
    color: {
      default: "var(--fg-muted)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    borderColor: {
      default: "transparent",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--border)",
      },
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
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
  },
  dangerSpinner: {
    borderColor: "color-mix(in oklch,var(--danger) 30%,transparent)",
    borderTopColor: "var(--danger)",
  },
  neutralSpinner: {
    borderColor: "color-mix(in oklch,var(--accent) 30%,transparent)",
    borderTopColor: "var(--accent)",
  },
  label: {
    display: {
      default: "none",
      "@media (width >= 48rem)": "inline",
    },
  },
  icon: {
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
    flex: "none",
  },
});
