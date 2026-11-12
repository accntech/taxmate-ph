import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "root": {
    "position": {
      "default": "fixed",
      "@media (width >= 48rem)": "sticky"
    },
    "top": "calc(var(--spacing) * 0)",
    "left": {
      "default": "calc(var(--spacing) * 0)",
      "@media (width >= 48rem)": "auto"
    },
    "zIndex": {
      "default": 50,
      "@media (width >= 48rem)": 30
    },
    "display": "flex",
    "height": "100dvh",
    "maxHeight": "100dvh",
    "width": {
      "default": "17.5rem",
      "@media (width >= 48rem)": "auto"
    },
    "flexDirection": "column",
    "overflow": {
      "default": "hidden",
      "@media (width >= 48rem)": {
        "default": null,
        ":is([data-state=\"collapsed\"])": "visible"
      }
    },
    "borderRightStyle": "var(--sx-border-style)",
    "borderRightWidth": "1px",
    "borderColor": "var(--border)",
    "backgroundColor": "var(--bg)",
    "--sx-shadow": {
      "default": "12px 0 32px -16px var(--sx-shadow-color, rgba(0,0,0,0.4))",
      "@media (width >= 48rem)": "0 0 #0000"
    },
    "boxShadow": {
      "default": "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
      "@media (width >= 48rem)": "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)"
    },
    "--sx-translate-x": {
      "default": null,
      "@media (width < 48rem)": {
        "default": "-100%",
        ":is([data-mobile-open=\"true\"])": "calc(var(--spacing) * 0)"
      }
    },
    "translate": {
      "default": null,
      "@media (width < 48rem)": {
        "default": "var(--sx-translate-x) var(--sx-translate-y)",
        ":is([data-mobile-open=\"true\"])": "var(--sx-translate-x) var(--sx-translate-y)"
      }
    },
    "transitionProperty": {
      "default": null,
      "@media (width < 48rem)": "transform, translate, scale, rotate"
    },
    "transitionTimingFunction": {
      "default": null,
      "@media (width < 48rem)": "var(--sx-ease, var(--default-transition-timing-function))"
    },
    "transitionDuration": {
      "default": null,
      "@media (width < 48rem)": "220ms"
    },
    "--sx-duration": {
      "default": null,
      "@media (width < 48rem)": "220ms"
    }
  },
  "header": {
    "display": "flex",
    "height": "calc(var(--spacing) * 16)",
    "flex": "none",
    "alignItems": "center",
    "gap": {
      "default": "calc(var(--spacing) * 2.5)",
      ":is(:where(.group\\/sb)[data-state=\"collapsed\"] *)": "calc(var(--spacing) * 0)"
    },
    "paddingInline": {
      "default": "calc(var(--spacing) * 5)",
      ":is(:where(.group\\/sb)[data-state=\"collapsed\"] *)": "calc(var(--spacing) * 3.5)"
    }
  },
  "scrollFrame": {
    "position": "relative",
    "display": "flex",
    "minHeight": "calc(var(--spacing) * 0)",
    "flex": 1,
    "flexDirection": "column"
  },
  "navigation": {
    "display": "flex",
    "minHeight": "calc(var(--spacing) * 0)",
    "flex": 1,
    "flexDirection": "column",
    "gap": {
      "default": "calc(var(--spacing) * 1)",
      ":is(:where(.group\\/sb)[data-state=\"collapsed\"] *)": "calc(var(--spacing) * 1.5)"
    },
    "overflowX": "hidden",
    "overflowY": "auto",
    "overscrollBehavior": "contain",
    "padding": "8px 14px",
    "paddingBlock": {
      "default": null,
      ":is(:where(.group\\/sb)[data-state=\"collapsed\"] *)": "calc(var(--spacing) * 3)"
    }
  },
  "scrollUpFade": {
    "pointerEvents": "none",
    "position": "absolute",
    "insetInline": "calc(var(--spacing) * 0)",
    "top": "calc(var(--spacing) * 0)",
    "zIndex": 10,
    "display": "flex",
    "height": "calc(var(--spacing) * 6)",
    "alignItems": "flex-start",
    "justifyContent": "center",
    "--sx-gradient-position": {
      "default": "to bottom",
      "@supports (background-image: linear-gradient(in lab, red, red))": "to bottom in oklab"
    },
    "backgroundImage": "linear-gradient(var(--sx-gradient-stops))",
    "--sx-gradient-from": "var(--bg)",
    "--sx-gradient-stops": "var(--sx-gradient-via-stops, var(--sx-gradient-position), var(--sx-gradient-from) var(--sx-gradient-from-position), var(--sx-gradient-to) var(--sx-gradient-to-position))",
    "--sx-gradient-to": "transparent",
    "paddingTop": "calc(var(--spacing) * 0.5)",
    "opacity": {
      "default": "0%",
      ":is([data-show])": "100%"
    },
    "transitionProperty": "opacity",
    "transitionTimingFunction": "var(--sx-ease, var(--default-transition-timing-function))",
    "transitionDuration": "var(--sx-duration, var(--default-transition-duration))"
  },
  "scrollUpIcon": {
    "rotate": "180deg",
    "color": "var(--fg-subtle)"
  },
  "scrollDownFade": {
    "pointerEvents": "none",
    "position": "absolute",
    "insetInline": "calc(var(--spacing) * 0)",
    "bottom": "calc(var(--spacing) * 0)",
    "zIndex": 10,
    "display": "flex",
    "height": "calc(var(--spacing) * 6)",
    "alignItems": "flex-end",
    "justifyContent": "center",
    "--sx-gradient-position": {
      "default": "to top",
      "@supports (background-image: linear-gradient(in lab, red, red))": "to top in oklab"
    },
    "backgroundImage": "linear-gradient(var(--sx-gradient-stops))",
    "--sx-gradient-from": "var(--bg)",
    "--sx-gradient-stops": "var(--sx-gradient-via-stops, var(--sx-gradient-position), var(--sx-gradient-from) var(--sx-gradient-from-position), var(--sx-gradient-to) var(--sx-gradient-to-position))",
    "--sx-gradient-to": "transparent",
    "paddingBottom": "calc(var(--spacing) * 0.5)",
    "opacity": {
      "default": "0%",
      ":is([data-show])": "100%"
    },
    "transitionProperty": "opacity",
    "transitionTimingFunction": "var(--sx-ease, var(--default-transition-timing-function))",
    "transitionDuration": "var(--sx-duration, var(--default-transition-duration))"
  },
  "scrollDownIcon": {
    "color": "var(--fg-subtle)"
  },
  "footer": {
    "flex": "none",
    "borderTopStyle": "var(--sx-border-style)",
    "borderTopWidth": "1px",
    "borderColor": "var(--border-soft)"
  },
  "backdrop": {
    "position": "fixed",
    "inset": "calc(var(--spacing) * 0)",
    "zIndex": 40,
    "backgroundColor": {
      "default": "color-mix(in srgb, #000 45%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": "color-mix(in oklab, var(--color-black) 45%, transparent)"
    },
    "display": {
      "default": null,
      "@media (width >= 48rem)": "none"
    }
  }
});
