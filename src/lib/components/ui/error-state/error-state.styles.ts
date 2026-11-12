import { host } from "../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const errorState = stylex.create({
  card: {
    position: "relative",
    isolation: "isolate",
    overflow: "hidden",
    borderRadius: "var(--radius-2xl)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border-soft)",
    backgroundColor: "var(--bg-elev)",
    padding: "calc(var(--spacing) * 6)",
    animationName: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": host.animateEmptyInName,
    },
    animationDuration: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-empty-in-duration)",
    },
    animationTimingFunction: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-empty-in-timing-function)",
    },
    animationDelay: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-empty-in-delay)",
    },
    animationIterationCount: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": 1,
    },
    animationDirection: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "normal",
    },
    animationFillMode: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "both",
    },
    animationPlayState: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "running",
    },
  },
  accentEdge: {
    pointerEvents: "none",
    position: "absolute",
    insetInline: "0px",
    top: "0px",
    height: "1px",
    backgroundImage:
      "linear-gradient(90deg,transparent 0%,color-mix(in oklch,var(--danger) 45%,transparent) 30%,color-mix(in oklch,var(--danger) 45%,transparent) 70%,transparent 100%)",
    opacity: "60%",
  },
  summary: {
    display: "flex",
    alignItems: "flex-start",
    gap: "calc(var(--spacing) * 3.5)",
  },
  iconBadge: {
    display: "grid",
    width: "calc(var(--spacing) * 9)",
    height: "calc(var(--spacing) * 9)",
    flex: "none",
    placeItems: "center",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "color-mix(in oklch,var(--danger) 25%,var(--border))",
    backgroundColor: "var(--danger-soft)",
    color: "var(--danger)",
    animationName: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        host.animatePulseSoftName,
    },
    animationDuration: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-pulse-soft-duration)",
    },
    animationTimingFunction: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-pulse-soft-timing-function)",
    },
    animationDelay: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-pulse-soft-delay)",
    },
    animationIterationCount: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "infinite",
    },
    animationDirection: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "normal",
    },
    animationFillMode: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "none",
    },
    animationPlayState: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "running",
    },
  },
  icon: {
    width: "calc(var(--spacing) * 4.5)",
    height: "calc(var(--spacing) * 4.5)",
  },
  copy: {
    minWidth: "0px",
    flex: "1",
  },
  heading: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    columnGap: "calc(var(--spacing) * 2)",
    rowGap: "calc(var(--spacing) * 0.5)",
  },
  title: {
    fontSize: "13.5px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    "--sx-tracking": "-0.005em",
    letterSpacing: "-0.005em",
    color: "var(--fg)",
  },
  errorCode: {
    fontFamily: "var(--font-mono)",
    fontSize: "10.5px",
    "--sx-tracking": "0.06em",
    letterSpacing: "0.06em",
    color: "var(--fg-subtle)",
    textTransform: "uppercase",
  },
  message: {
    marginTop: "var(--spacing)",
    fontSize: "13px",
    "--sx-leading": "1.55",
    lineHeight: 1.55,
    color: "var(--fg-muted)",
  },
  actions: {
    marginTop: "calc(var(--spacing) * 3.5)",
  },
  retryButton: {
    display: "inline-flex",
    height: "calc(var(--spacing) * 8.5)",
    alignItems: "center",
    gap: "calc(var(--spacing) * 1.75)",
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
    fontSize: "12.5px",
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
    pointerEvents: {
      default: null,
      ":disabled": "none",
    },
    opacity: {
      default: null,
      ":disabled": "60%",
    },
    "--sx-scale-x": {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": {
        default: null,
        ":active": "97%",
      },
    },
    "--sx-scale-y": {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": {
        default: null,
        ":active": "97%",
      },
    },
    "--sx-scale-z": {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": {
        default: null,
        ":active": "97%",
      },
    },
    scale: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": {
        default: null,
        ":active": "var(--sx-scale-x) var(--sx-scale-y)",
      },
    },
  },
  spinner: {
    width: "calc(var(--spacing) * 3)",
    height: "calc(var(--spacing) * 3)",
    flex: "none",
    borderRadius: "calc(infinity * 1px)",
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: "color-mix(in oklch,var(--accent) 25%,transparent)",
    borderTopColor: "var(--accent)",
    animationName: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        host.animateSpinRingName,
    },
    animationDuration: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-spin-ring-duration)",
    },
    animationTimingFunction: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-spin-ring-timing-function)",
    },
    animationDelay: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-spin-ring-delay)",
    },
    animationIterationCount: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "infinite",
    },
    animationDirection: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "normal",
    },
    animationFillMode: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "none",
    },
    animationPlayState: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "running",
    },
  },
  retryIcon: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
  },
  inline: {
    display: "flex",
    alignItems: "flex-start",
    gap: "calc(var(--spacing) * 3)",
    animationName: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": host.animateEmptyInName,
    },
    animationDuration: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-empty-in-duration)",
    },
    animationTimingFunction: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-empty-in-timing-function)",
    },
    animationDelay: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-empty-in-delay)",
    },
    animationIterationCount: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": 1,
    },
    animationDirection: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "normal",
    },
    animationFillMode: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "both",
    },
    animationPlayState: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "running",
    },
  },
  inlineIconBadge: {
    display: "grid",
    width: "calc(var(--spacing) * 7)",
    height: "calc(var(--spacing) * 7)",
    flex: "none",
    placeItems: "center",
    borderRadius: "var(--radius-md)",
    backgroundColor: "var(--danger-soft)",
    color: "var(--danger)",
  },
  inlineIcon: {
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
  },
  inlineTitle: {
    fontSize: "13px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--fg)",
  },
  inlineMessage: {
    marginTop: "calc(var(--spacing) * 0.5)",
    fontSize: "12.5px",
    "--sx-leading": "var(--leading-normal)",
    lineHeight: "var(--leading-normal)",
    color: "var(--fg-muted)",
  },
  inlineRetryButton: {
    marginTop: "calc(var(--spacing) * 1.5)",
    display: "inline-flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 1.5)",
    borderRadius: "var(--radius-sm)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    backgroundColor: "transparent",
    padding: "0px",
    fontSize: "12.5px",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: {
      default: "var(--accent)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--accent-hover)",
      },
    },
    transitionProperty: "color,opacity",
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
    pointerEvents: {
      default: null,
      ":disabled": "none",
    },
    opacity: {
      default: null,
      ":disabled": "60%",
    },
  },
});
