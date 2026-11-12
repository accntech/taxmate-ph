import * as stylex from "@stylexjs/stylex";

export const menu = stylex.create({
  mobilePosition: {
    position: {
      default: null,
      "@media (width < 48rem)": "fixed",
      "@media (width >= 48rem)": "absolute",
    },
    insetInline: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 3)",
    },
    bottom: {
      default: null,
      "@media (width < 48rem)": "calc(0.75rem + env(safe-area-inset-bottom))",
    },
    zIndex: {
      default: null,
      "@media (width < 48rem)": 80,
    },
    maxHeight: {
      default: null,
      "@media (width < 48rem)": "60vh",
    },
    overflowY: {
      default: null,
      "@media (width < 48rem)": "auto",
    },
    borderRadius: {
      default: null,
      "@media (width < 48rem)": "var(--radius-xl)",
    },
  },
  desktopPosition: {
    position: "absolute",
  },
  mobileAbove: {
    bottom: {
      default: null,
      "@media (width >= 48rem)": "calc(100% + 4px)",
    },
  },
  mobileBelow: {
    top: {
      default: null,
      "@media (width >= 48rem)": "calc(100% + 4px)",
    },
  },
  above: {
    bottom: "calc(100% + 4px)",
  },
  below: {
    top: "calc(100% + 4px)",
  },
  mobileRight: {
    right: {
      default: null,
      "@media (width >= 48rem)": "0px",
    },
  },
  mobileLeft: {
    left: {
      default: null,
      "@media (width >= 48rem)": "0px",
    },
  },
  right: {
    right: "0px",
  },
  left: {
    left: "0px",
  },
  aboveRightOrigin: {
    transformOrigin: "100% 100%",
  },
  aboveLeftOrigin: {
    transformOrigin: "0 100%",
  },
  belowRightOrigin: {
    transformOrigin: "100% 0",
  },
  belowLeftOrigin: {
    transformOrigin: "0 0",
  },
  trigger: {
    display: "inline-flex",
    minHeight: "1.875rem",
    whiteSpace: "nowrap",
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
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--fg)",
    transitionProperty:
      "transform,background-color,border-color,color,box-shadow,opacity",
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
    pointerEvents: {
      default: null,
      ":disabled": "none",
    },
    opacity: {
      default: null,
      ":disabled": "60%",
    },
  },
  root: {
    position: "relative",
    display: "inline-flex",
  },
  backdrop: {
    position: "fixed",
    inset: "0px",
    zIndex: 70,
    backgroundColor: "color-mix(in oklab, var(--color-black) 40%, transparent)",
    display: {
      default: null,
      "@media (width >= 48rem)": "none",
    },
  },
  panel: {
    zIndex: 50,
    borderRadius: "var(--radius-lg)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border)",
    backgroundColor: "var(--bg-elev)",
    padding: "var(--spacing)",
    "--sx-shadow": "var(--shadow-lg)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
  },
});
