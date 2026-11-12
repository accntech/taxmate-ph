import * as stylex from "@stylexjs/stylex";

export const shortcuts = stylex.create({
  icon: {
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
  },
  iconButton: {
    display: "grid",
    width: "calc(var(--spacing) * 8)",
    height: "calc(var(--spacing) * 8)",
    placeItems: "center",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    color: "var(--fg)",
    transitionProperty:
      "opacity,transform,background-color,border-color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
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
      "@media (prefers-reduced-motion: reduce)": "100%",
    },
    "--sx-scale-y": {
      default: null,
      ":active": "95%",
      "@media (prefers-reduced-motion: reduce)": "100%",
    },
    "--sx-scale-z": {
      default: null,
      ":active": "95%",
      "@media (prefers-reduced-motion: reduce)": "100%",
    },
    scale: {
      default: null,
      ":active": "var(--sx-scale-x) var(--sx-scale-y)",
      "@media (prefers-reduced-motion: reduce)":
        "var(--sx-scale-x) var(--sx-scale-y)",
    },
    "--sx-translate-y": {
      default: null,
      "@media (prefers-reduced-motion: reduce)": "0px",
    },
    translate: {
      default: null,
      "@media (prefers-reduced-motion: reduce)":
        "var(--sx-translate-x) var(--sx-translate-y)",
    },
  },
  immediateReveal: {
    opacity: "100%",
    transitionDelay: "0ms",
    "--sx-duration": "240ms",
    transitionDuration: "240ms",
  },
  earlyReveal: {
    opacity: "100%",
    transitionDelay: "40ms",
    "--sx-duration": "240ms",
    transitionDuration: "240ms",
  },
  lateReveal: {
    opacity: "100%",
    transitionDelay: "80ms",
    "--sx-duration": "240ms",
    transitionDuration: "240ms",
  },
  hidden: {
    pointerEvents: "none",
    "--sx-translate-y": "calc(var(--spacing) * -1.5)",
    translate: "var(--sx-translate-x) var(--sx-translate-y)",
    "--sx-scale-x": "94%",
    "--sx-scale-y": "94%",
    "--sx-scale-z": "94%",
    scale: "var(--sx-scale-x) var(--sx-scale-y)",
    opacity: "0%",
    transitionDelay: "0ms",
    "--sx-duration": "160ms",
    transitionDuration: "160ms",
  },
  primaryAction: {
    display: "inline-flex",
    height: "calc(var(--spacing) * 8)",
    flex: "none",
    alignItems: "center",
    gap: "calc(var(--spacing) * 1.5)",
    borderRadius: "var(--radius-md)",
    backgroundColor: {
      default: "var(--accent)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--accent-hover)",
      },
    },
    paddingInline: "calc(var(--spacing) * 3)",
    fontSize: "13px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--accent-fg)",
    transitionProperty: "background-color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
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
  },
  tooltip: {
    flex: "none",
    display: {
      default: null,
      "@media (width < 48rem)": "none",
    },
  },
  hiddenTooltip: {
    pointerEvents: "none",
  },
  separator: {
    display: {
      default: null,
      "@media (width < 48rem)": "none",
    },
    marginInline: "var(--spacing)",
    height: "calc(var(--spacing) * 4)",
    width: "1px",
    flex: "none",
    alignSelf: "center",
    backgroundColor: "var(--border)",
    transitionProperty: "opacity",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
    "--sx-ease": "var(--ease-out)",
  },
  visibleSeparator: {
    opacity: "100%",
    transitionDelay: "160ms",
    "--sx-duration": "240ms",
    transitionDuration: "240ms",
  },
  hiddenSeparator: {
    opacity: "0%",
    transitionDelay: "0ms",
    "--sx-duration": "160ms",
    transitionDuration: "160ms",
  },
});
