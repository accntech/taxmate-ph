import * as stylex from "@stylexjs/stylex";

export const infoTip = stylex.create({
  root: {
    display: "inline-flex",
  },
  trigger: {
    display: "inline-flex",
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
    flex: "none",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "calc(infinity * 1px)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    backgroundColor: {
      default: "transparent",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
    },
    color: {
      default: "var(--fg-subtle)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
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
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 18%,transparent))",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
  },
  icon: {
    width: "calc(var(--spacing) * 3)",
    height: "calc(var(--spacing) * 3)",
  },
  popup: {
    pointerEvents: {
      default: "none",
      ':is([data-open="true"])': "auto",
    },
    position: "fixed",
    top: "0px",
    left: "0px",
    zIndex: 100,
    width: "calc(var(--spacing) * 64)",
    maxWidth: "min(16rem, calc(100vw - 1rem))",
    "--sx-scale-x": {
      default: "95%",
      ':is([data-open="true"])': "100%",
    },
    "--sx-scale-y": {
      default: "95%",
      ':is([data-open="true"])': "100%",
    },
    "--sx-scale-z": {
      default: "95%",
      ':is([data-open="true"])': "100%",
    },
    scale: {
      default: "var(--sx-scale-x) var(--sx-scale-y)",
      ':is([data-open="true"])': "var(--sx-scale-x) var(--sx-scale-y)",
    },
    overscrollBehavior: "contain",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border)",
    backgroundColor: "var(--bg-elev)",
    padding: "calc(var(--spacing) * 3)",
    fontSize: "12px",
    "--sx-leading": "var(--leading-relaxed)",
    lineHeight: "var(--leading-relaxed)",
    color: "var(--fg-muted)",
    opacity: {
      default: "0%",
      ':is([data-open="true"])': "100%",
    },
    "--sx-shadow": "var(--shadow-lg)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    transitionProperty: "opacity,transform",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "150ms",
    "--sx-duration": "150ms",
    "--sx-ease": "var(--ease-out)",
  },
});
