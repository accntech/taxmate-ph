import { host } from "../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const deleteConfirmation = stylex.create({
  instructions: {
    display: "flex",
    flexDirection: "column",
    gap: "calc(var(--spacing) * 3)",
  },
  prompt: {
    fontSize: "13px",
    "--sx-leading": "var(--leading-relaxed)",
    lineHeight: "var(--leading-relaxed)",
    color: "var(--fg-subtle)",
  },
  phraseRow: {
    marginInline: "calc(var(--spacing) * 0.5)",
    display: "inline-flex",
    maxWidth: "100%",
    alignItems: "center",
    gap: "var(--spacing)",
    borderRadius: "0.25rem",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border-soft)",
    backgroundColor: "color-mix(in oklch,var(--fg) 3%,var(--bg-elev))",
    paddingBlock: "calc(var(--spacing) * 0.5)",
    paddingRight: "var(--spacing)",
    paddingLeft: "calc(var(--spacing) * 1.5)",
    verticalAlign: "middle",
  },
  phrase: {
    minWidth: "0px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontFamily: "var(--font-mono)",
    fontSize: "12.5px",
    lineHeight: "calc(var(--spacing) * 5)",
    "--sx-tracking": "-0.01em",
    letterSpacing: "-0.01em",
    color: "var(--fg)",
    userSelect: "all",
  },
  copyButton: {
    marginBlock: "calc(var(--spacing) * -0.5)",
    display: "inline-flex",
    width: "calc(var(--spacing) * 5)",
    height: "calc(var(--spacing) * 5)",
    flex: "none",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.25rem",
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
      ":active": "95%",
    },
    "--sx-scale-y": {
      default: null,
      ":active": "95%",
    },
    "--sx-scale-z": {
      default: null,
      ":active": "95%",
    },
    scale: {
      default: null,
      ":active": "var(--sx-scale-x) var(--sx-scale-y)",
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
  clipboardIcon: {
    width: "calc(var(--spacing) * 3)",
    height: "calc(var(--spacing) * 3)",
  },
  copiedIcon: {
    color: "var(--success)",
  },
  cancelButton: {
    display: "inline-flex",
    height: "calc(var(--spacing) * 9)",
    alignItems: "center",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "var(--border)",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    paddingInline: "calc(var(--spacing) * 3.5)",
    fontSize: "13px",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--fg)",
    transitionProperty: "background-color,border-color,color,box-shadow",
    transitionTimingFunction:
      "var(--sx-ease, var(--default-transition-timing-function))",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
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
    pointerEvents: {
      default: null,
      ":disabled": "none",
    },
    opacity: {
      default: null,
      ":disabled": "60%",
    },
  },
  confirmButton: {
    display: "inline-flex",
    height: "calc(var(--spacing) * 9)",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--danger) 60%,var(--border))",
    },
    backgroundColor: {
      default: "var(--danger-soft)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "color-mix(in oklch,var(--danger) 10%,var(--danger-soft))",
      },
    },
    paddingInline: "calc(var(--spacing) * 3.5)",
    fontSize: "13px",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: "color-mix(in oklab,var(--danger) 80%,var(--fg))",
    transitionProperty: "background-color,border-color,color,box-shadow",
    transitionTimingFunction:
      "var(--sx-ease, var(--default-transition-timing-function))",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
    "--sx-outline-style": "none",
    outlineStyle: "none",
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
    pointerEvents: {
      default: null,
      ":disabled": "none",
    },
    opacity: {
      default: null,
      ":disabled": "45%",
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
    borderColor: "color-mix(in oklab, currentColor 30%, transparent)",
    borderTopColor: "currentColor",
  },
  deleteIcon: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
  },
});
