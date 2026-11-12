import { host } from "../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const formFooter = stylex.create({
  root: {
    position: "sticky",
    bottom: "0px",
    zIndex: 15,
    marginTop: "calc(var(--spacing) * 4)",
    display: "flex",
    flexDirection: {
      default: "column",
      "@media (width >= 40rem)": "row",
    },
    gap: {
      default: "calc(var(--spacing) * 2.5)",
      "@media (width >= 40rem)": "calc(var(--spacing) * 3.5)",
    },
    borderStyle: "solid",
    borderBlockWidth: "1px",
    borderInlineWidth: "1px",
    borderColor: "var(--border-soft)",
    backgroundColor: "color-mix(in oklab, var(--bg) 90%, transparent)",
    paddingBlock: "calc(var(--spacing) * 3)",
    "--sx-shadow": "var(--shadow-sticky-bar)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    "--sx-backdrop-blur": "blur(var(--blur-sm))",

    backdropFilter:
      "var(--sx-backdrop-blur,) var(--sx-backdrop-brightness,) var(--sx-backdrop-contrast,) var(--sx-backdrop-grayscale,) var(--sx-backdrop-hue-rotate,) var(--sx-backdrop-invert,) var(--sx-backdrop-opacity,) var(--sx-backdrop-saturate,) var(--sx-backdrop-sepia,)",
    transitionProperty: "border-radius,border-color",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
    "--sx-ease": "var(--ease-out)",
    flexWrap: {
      default: null,
      "@media (width >= 40rem)": "wrap",
    },
    alignItems: {
      default: null,
      "@media (width >= 40rem)": "center",
    },
    justifyContent: {
      default: null,
      "@media (width >= 40rem)": "space-between",
    },
  },
  floating: {
    marginInline: {
      default: "calc(var(--spacing) * -3)",
      "@media (width >= 48rem)": "calc(var(--spacing) * -7)",
    },
    borderRadius: "0",
    borderInlineStyle: host.borderStyle,
    borderInlineWidth: "0px",
    paddingInline: {
      default: "calc(var(--spacing) * 4)",
      "@media (width >= 48rem)": "calc(var(--spacing) * 7)",
    },
  },
  inline: {
    borderRadius: "var(--radius-lg)",
    paddingInline: "calc(var(--spacing) * 4)",
  },
  loadingAnnouncement: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    borderWidth: "0",
  },
  actions: {
    order: {
      default: "2",
      "@media (width >= 40rem)": "1",
    },
    display: "flex",
    gap: "calc(var(--spacing) * 2)",
  },
  submitButton: {
    display: "inline-flex",
    flex: {
      default: "1",
      "@media (width >= 40rem)": "none",
    },
    alignItems: "center",
    justifyContent: "center",
    gap: "calc(var(--spacing) * 1.5)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "var(--accent)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--accent-hover)",
      },
    },
    backgroundColor: {
      default: "var(--accent)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--accent-hover)",
      },
    },
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 1.75)",
    fontSize: "13px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--accent-fg)",
    transitionProperty:
      "transform,background-color,border-color,opacity,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    "--sx-shadow": {
      default: null,
      ":focus-visible":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 35%,transparent))",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
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
  icon: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
  },
  shortcutHint: {
    marginLeft: "var(--spacing)",
    display: {
      default: "none",
      "@media (width >= 40rem)": "inline-grid",
    },
    height: "calc(var(--spacing) * 4.5)",
    minWidth: "calc(var(--spacing) * 4.5)",
    placeItems: "center",
    borderRadius: "var(--radius-sm)",
    backgroundColor: "color-mix(in oklch,var(--accent-fg) 20%,transparent)",
    paddingInline: "var(--spacing)",
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    "--sx-leading": "1",
    lineHeight: 1,
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--accent-fg)",
  },
  cancelButton: {
    display: "inline-flex",
    flex: {
      default: "1",
      "@media (width >= 40rem)": "none",
    },
    alignItems: "center",
    justifyContent: "center",
    gap: "calc(var(--spacing) * 1.5)",
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
    paddingBlock: "calc(var(--spacing) * 1.75)",
    fontSize: "13px",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--fg)",
    transitionProperty:
      "transform,background-color,border-color,color,box-shadow",
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
  },
  summary: {
    order: {
      default: "1",
      "@media (width >= 40rem)": "2",
    },
    display: "flex",
    minWidth: "0px",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    borderBottomStyle: {
      default: host.borderStyle,
      "@media (width >= 40rem)": host.borderStyle,
    },
    borderBottomWidth: {
      default: "1px",
      "@media (width >= 40rem)": "0px",
    },
    "--sx-border-style": "dashed",
    borderStyle: "dashed",
    borderColor: "var(--border-soft)",
    paddingBottom: {
      default: "calc(var(--spacing) * 2)",
      "@media (width >= 40rem)": "0px",
    },
    fontSize: {
      default: "12px",
      "@media (width >= 40rem)": "13px",
    },
    color: "var(--fg)",
  },
  statusDot: {
    display: "grid",
    width: "calc(var(--spacing) * 4.5)",
    height: "calc(var(--spacing) * 4.5)",
    flex: "none",
    placeItems: "center",
    borderRadius: "calc(infinity * 1px)",
    color: "var(--accent)",
  },
  readyLabel: {
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    whiteSpace: "nowrap",
  },
  separator: {
    color: "var(--fg-subtle)",
  },
  reviewLabel: {
    whiteSpace: "nowrap",
    color: "var(--fg-muted)",
  },
  fieldCount: {
    fontFamily: "var(--font-mono)",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--fg)",
    "--sx-numeric-spacing": "tabular-nums",
    fontVariantNumeric:
      "var(--sx-ordinal,) var(--sx-slashed-zero,) var(--sx-numeric-figure,) var(--sx-numeric-spacing,) var(--sx-numeric-fraction,)",
  },
});
