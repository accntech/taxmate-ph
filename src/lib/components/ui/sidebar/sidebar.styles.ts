import * as stylex from "@stylexjs/stylex";

export const sidebar = stylex.create({
  root: {
    top: {
      default: "0px",
      "@media (width >= 48rem)": "0px",
    },
    left: {
      default: "0px",
      "@media (width >= 48rem)": "auto",
    },
    zIndex: {
      default: 50,
      "@media (width >= 48rem)": 30,
    },
    display: "flex",
    height: {
      default: "100dvh",
      "@media (width >= 48rem)": "100dvh",
    },
    maxHeight: {
      default: "100dvh",
      "@media (width >= 48rem)": "100dvh",
    },
    width: {
      default: "calc(var(--spacing) * 70)",
      "@media (width >= 48rem)": "auto",
    },
    flexDirection: "column",
    overflow: {
      default: "hidden",
      "@media (width >= 48rem)": {
        default: null,
        ':is([data-state="collapsed"])': "visible",
      },
    },
    borderRightStyle: "solid",
    borderRightWidth: "1px",
    borderColor: {
      default: "var(--border)",
      "@media (width >= 48rem)": "var(--border-soft)",
    },
    backgroundColor: "var(--bg)",
    "--sx-shadow": {
      default: "12px 0 32px -16px var(--sx-shadow-color, rgba(0,0,0,0.4))",
      "@media (width >= 48rem)": "0 0 #0000",
    },
    boxShadow: {
      default:
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
      "@media (width >= 48rem)":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
    "--sx-ease": "var(--ease-drawer)",
    transitionTimingFunction: {
      default: "var(--ease-drawer)",
      "@media (width < 48rem)":
        "var(--sx-ease, var(--default-transition-timing-function))",
    },
    transitionProperty: {
      default: null,
      "@media (prefers-reduced-motion: reduce)": "none",
      "@media (width < 48rem)": "transform, translate, scale, rotate",
    },
    position: {
      default: null,
      "@media (width < 48rem)": "fixed",
      "@media (width >= 48rem)": "sticky",
    },
    "--sx-translate-x": {
      default: null,
      "@media (width < 48rem)": {
        default: "-100%",
        ':is([data-mobile-open="true"])': "0px",
      },
    },
    translate: {
      default: null,
      "@media (width < 48rem)": {
        default: "var(--sx-translate-x) var(--sx-translate-y)",
        ':is([data-mobile-open="true"])':
          "var(--sx-translate-x) var(--sx-translate-y)",
      },
    },
    transitionDuration: {
      default: null,
      "@media (width < 48rem)": {
        default: "220ms",
        ':is([data-mobile-open="true"])': "320ms",
      },
    },
    "--sx-duration": {
      default: null,
      "@media (width < 48rem)": {
        default: "220ms",
        ':is([data-mobile-open="true"])': "320ms",
      },
    },
  },
  scrollFrame: {
    position: "relative",
    display: "flex",
    minHeight: "0px",
    flex: "1",
    flexDirection: "column",
  },
  navigation: {
    display: "flex",
    minHeight: "0px",
    flex: "1",
    flexDirection: "column",
    gap: "calc(var(--spacing) * 0.5)",
    overflowX: "hidden",
    overflowY: "auto",
    overscrollBehavior: "contain",
    padding: "8px 14px",
  },
  scrollUpFade: {
    pointerEvents: "none",
    position: "absolute",
    insetInline: "0px",
    top: "0px",
    zIndex: 10,
    display: "flex",
    height: "calc(var(--spacing) * 6)",
    alignItems: "flex-start",
    justifyContent: "center",
    "--sx-gradient-position": {
      default: "to bottom",
      "@supports (background-image: linear-gradient(in lab, red, red))":
        "to bottom in oklab",
    },
    backgroundImage: "linear-gradient(var(--sx-gradient-stops))",
    "--sx-gradient-from": "var(--bg)",
    "--sx-gradient-stops":
      "var(--sx-gradient-via-stops, var(--sx-gradient-position), var(--sx-gradient-from) var(--sx-gradient-from-position), var(--sx-gradient-to) var(--sx-gradient-to-position))",
    "--sx-gradient-to": "transparent",
    paddingTop: "calc(var(--spacing) * 0.5)",
    opacity: {
      default: "0%",
      ":is([data-show])": "100%",
    },
    transitionProperty: "opacity",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "180ms",
    "--sx-duration": "180ms",
    "--sx-ease": "var(--ease-out)",
  },
  scrollIcon: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
    color: "var(--fg-subtle)",
  },
  scrollDownFade: {
    pointerEvents: "none",
    position: "absolute",
    insetInline: "0px",
    bottom: "0px",
    zIndex: 10,
    display: "flex",
    height: "calc(var(--spacing) * 6)",
    alignItems: "flex-end",
    justifyContent: "center",
    "--sx-gradient-position": {
      default: "to top",
      "@supports (background-image: linear-gradient(in lab, red, red))":
        "to top in oklab",
    },
    backgroundImage: "linear-gradient(var(--sx-gradient-stops))",
    "--sx-gradient-from": "var(--bg)",
    "--sx-gradient-stops":
      "var(--sx-gradient-via-stops, var(--sx-gradient-position), var(--sx-gradient-from) var(--sx-gradient-from-position), var(--sx-gradient-to) var(--sx-gradient-to-position))",
    "--sx-gradient-to": "transparent",
    paddingBottom: "calc(var(--spacing) * 0.5)",
    opacity: {
      default: "0%",
      ":is([data-show])": "100%",
    },
    transitionProperty: "opacity",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "180ms",
    "--sx-duration": "180ms",
    "--sx-ease": "var(--ease-out)",
  },
  footer: {
    flex: "none",
    borderTopStyle: "solid",
    borderTopWidth: "1px",
    borderColor: "var(--border-soft)",
  },
  header: {
    display: "flex",
    height: "calc(var(--spacing) * 16)",
    flex: "none",
    alignItems: "center",
    gap: {
      default: "calc(var(--spacing) * 2.5)",
      ':is(:where(.group\\/sb)[data-state="collapsed"] *)': "0px",
    },
    paddingInline: {
      default: "calc(var(--spacing) * 5)",
      ':is(:where(.group\\/sb)[data-state="collapsed"] *)':
        "calc(var(--spacing) * 4.5)",
    },
    transition:
      "background-color 120ms var(--ease-out),\tcolor 120ms var(--ease-out),\tborder-color 120ms var(--ease-out),\tbox-shadow 120ms var(--ease-out),\ttransform 160ms var(--ease-out),\tpadding 260ms var(--ease-drawer),\tgap 260ms var(--ease-drawer)",
  },
});
