import * as stylex from "@stylexjs/stylex";

export const tooltip = stylex.create({
  sideAnchor: {
    top: "calc(1 / 2 * 100%)",
  },
  left: {
    right: "calc(100% + var(--tt-offset))",
  },
  leftOrigin: {
    transformOrigin: "100%",
  },
  sideViewportShift: {
    "--sx-translate-x": "var(--tt-shift,0)",
    translate: "var(--sx-translate-x) var(--sx-translate-y)",
  },
  sideCenterShift: {
    "--sx-translate-y": "calc(calc(1 / 2 * 100%) * -1)",
    translate: "var(--sx-translate-x) var(--sx-translate-y)",
  },
  right: {
    left: "calc(100% + var(--tt-offset))",
  },
  rightOrigin: {
    transformOrigin: "0",
  },
  above: {
    bottom: "calc(100% + var(--tt-offset))",
    transformOrigin: "bottom",
  },
  below: {
    top: "calc(100% + var(--tt-offset))",
    transformOrigin: "top",
  },
  alignStart: {
    left: "0px",
    "--sx-translate-x": "var(--tt-shift,0)",
    translate: "var(--sx-translate-x) var(--sx-translate-y)",
  },
  alignCenter: {
    left: "calc(1 / 2 * 100%)",
    "--sx-translate-x": "calc(-50% + var(--tt-shift,0))",
    translate: "var(--sx-translate-x) var(--sx-translate-y)",
  },
  alignEnd: {
    right: "0px",
    "--sx-translate-x": "var(--tt-shift,0)",
    translate: "var(--sx-translate-x) var(--sx-translate-y)",
  },
  floatingTrigger: {
    display: "inline-flex",
  },
  floatingPopup: {
    pointerEvents: "none",
    position: "fixed",
    zIndex: 80,
    "--sx-scale-x": "100%",
    "--sx-scale-y": "100%",
    "--sx-scale-z": "100%",
    scale: "var(--sx-scale-x) var(--sx-scale-y)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border)",
    backgroundColor: "var(--bg-elev)",
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
    fontSize: "12.5px",
    whiteSpace: "nowrap",
    color: "var(--fg)",
    opacity: "100%",
    "--sx-shadow": "var(--shadow-lg)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
  },
  trigger: {
    position: "relative",
    display: "inline-flex",
  },
  popup: {
    pointerEvents: "none",
    visibility: {
      default: "hidden",
      "@media (hover: hover)": {
        default: null,
        ":is(:where(.group\\/tt):hover *)": "visible",
      },
      ":is(:where(.group\\/tt):has(:focus-visible) *)": "visible",
    },
    position: "absolute",
    zIndex: 60,
    "--sx-scale-x": {
      default: "97%",
      "@media (prefers-reduced-motion: reduce)": "100%",
      "@media (hover: hover)": {
        default: null,
        ":is(:where(.group\\/tt):hover *)": "100%",
      },
      ":is(:where(.group\\/tt):has(:focus-visible) *)": "100%",
    },
    "--sx-scale-y": {
      default: "97%",
      "@media (prefers-reduced-motion: reduce)": "100%",
      "@media (hover: hover)": {
        default: null,
        ":is(:where(.group\\/tt):hover *)": "100%",
      },
      ":is(:where(.group\\/tt):has(:focus-visible) *)": "100%",
    },
    "--sx-scale-z": {
      default: "97%",
      "@media (prefers-reduced-motion: reduce)": "100%",
      "@media (hover: hover)": {
        default: null,
        ":is(:where(.group\\/tt):hover *)": "100%",
      },
      ":is(:where(.group\\/tt):has(:focus-visible) *)": "100%",
    },
    scale: {
      default: "var(--sx-scale-x) var(--sx-scale-y)",
      "@media (prefers-reduced-motion: reduce)":
        "var(--sx-scale-x) var(--sx-scale-y)",
      "@media (hover: hover)": {
        default: null,
        ":is(:where(.group\\/tt):hover *)":
          "var(--sx-scale-x) var(--sx-scale-y)",
      },
      ":is(:where(.group\\/tt):has(:focus-visible) *)":
        "var(--sx-scale-x) var(--sx-scale-y)",
    },
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border)",
    backgroundColor: "var(--bg-elev)",
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
    fontSize: "12.5px",
    whiteSpace: "nowrap",
    color: "var(--fg)",
    opacity: {
      default: "0%",
      "@media (hover: hover)": {
        default: null,
        ":is(:where(.group\\/tt):hover *)": "100%",
      },
      ":is(:where(.group\\/tt):has(:focus-visible) *)": "100%",
    },
    "--sx-shadow": "var(--shadow-lg)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    transitionProperty: {
      default: "opacity,scale,visibility",
      "@media (prefers-reduced-motion: reduce)": "opacity",
    },
    transitionTimingFunction: {
      default: "var(--ease-out)",
      "@media (prefers-reduced-motion: reduce)":
        "var(--sx-ease, var(--default-transition-timing-function))",
    },
    transitionDuration: {
      default: "150ms",
      "@media (prefers-reduced-motion: reduce)":
        "var(--sx-duration, var(--default-transition-duration))",
    },
    "--sx-duration": "150ms",
    "--sx-ease": "var(--ease-out)",
  },
});
