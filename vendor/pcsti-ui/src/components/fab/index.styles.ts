import * as stylex from "@stylexjs/stylex";

export const fab = stylex.create({
  root: {
    position: "fixed",
    right: "calc(var(--spacing) * 4)",
    bottom: "calc(1rem + env(safe-area-inset-bottom))",
    zIndex: 35,
    display: {
      default: "grid",
      "@media (width >= 48rem)": "none",
    },
    width: "calc(var(--spacing) * 14)",
    height: "calc(var(--spacing) * 14)",
    placeItems: "center",
    borderRadius: "28px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "var(--accent)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--accent-hover)",
      },
    },
    backgroundColor: "var(--accent)",
    color: "var(--accent-fg)",
    "--sx-shadow": {
      default:
        "0 6px 16px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 22%,transparent)), 0 1px 3px var(--sx-shadow-color, rgba(0,0,0,0.08))",
      ":focus-visible":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 35%,transparent))",
    },
    boxShadow: {
      default:
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
    transitionProperty: "transform,opacity,border-color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "180ms",
    "--sx-duration": "180ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    cornerShape: "squircle",
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
  hidden: {
    pointerEvents: "none",
    "--sx-translate-y": "calc(var(--spacing) * 2.5)",
    translate: "var(--sx-translate-x) var(--sx-translate-y)",
    "--sx-scale-x": "90%",
    "--sx-scale-y": "90%",
    "--sx-scale-z": "90%",
    scale: "var(--sx-scale-x) var(--sx-scale-y)",
    opacity: "0%",
  },
  visible: {
    "--sx-translate-y": "0px",
    translate: "var(--sx-translate-x) var(--sx-translate-y)",
    "--sx-scale-x": "100%",
    "--sx-scale-y": "100%",
    "--sx-scale-z": "100%",
    scale: "var(--sx-scale-x) var(--sx-scale-y)",
    opacity: "100%",
  },
  icon: {
    width: "calc(var(--spacing) * 5.5)",
    height: "calc(var(--spacing) * 5.5)",
  },
});
