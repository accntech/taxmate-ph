import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "right": {
    "right": "calc(var(--spacing) * 0)",
    "left": "auto"
  },
  "left": {
    "right": "auto",
    "left": "calc(var(--spacing) * 0)"
  },
  "sm": {
    "maxWidth": {
      "default": null,
      "@media (width >= 40rem)": "var(--container-sm)"
    }
  },
  "md": {
    "maxWidth": {
      "default": null,
      "@media (width >= 40rem)": "var(--container-md)"
    }
  },
  "lg": {
    "maxWidth": {
      "default": null,
      "@media (width >= 40rem)": "var(--container-lg)"
    }
  },
  "xl": {
    "maxWidth": {
      "default": null,
      "@media (width >= 40rem)": "var(--container-2xl)"
    }
  },
  "focus": {
    "--sx-outline-style": {
      "default": null,
      ":focus": "none"
    },
    "outlineStyle": {
      "default": null,
      ":focus": "none"
    },
    "boxShadow": {
      "default": null,
      ":focus-visible": "none"
    }
  },
  "root": {
    "position": "fixed",
    "insetBlock": "calc(var(--spacing) * 0)",
    "margin": "calc(var(--spacing) * 0)",
    "height": "100dvh",
    "maxHeight": "none",
    "width": "100dvw",
    "maxWidth": "none",
    "borderStyle": "var(--sx-border-style)",
    "borderWidth": "0px",
    "backgroundColor": "transparent",
    "padding": "calc(var(--spacing) * 0)"
  },
  "visibility": {
    "color": "var(--fg)",
    "opacity": {
      "default": "0%",
      ":is([open], :popover-open, :open)": "100%"
    },
    "transitionProperty": "opacity,translate",
    "transitionTimingFunction": "var(--sx-ease, var(--default-transition-timing-function))",
    "transitionDuration": "var(--sx-duration, var(--default-transition-duration))",
    "::backdrop": {
      "backgroundColor": {
        "default": "color-mix(in srgb, #000 45%, transparent)",
        "@supports (color: color-mix(in lab, red, red))": "color-mix(in oklab, var(--color-black) 45%, transparent)"
      }
    }
  },
  "panel": {
    "position": "relative",
    "display": "flex",
    "height": "100dvh",
    "minHeight": "calc(var(--spacing) * 0)",
    "flexDirection": "column",
    "overflow": "hidden",
    "borderStyle": "var(--sx-border-style)",
    "borderWidth": "1px",
    "borderColor": "var(--border)",
    "backgroundColor": "var(--bg-elev)"
  },
  "panelShadow": {
    "--sx-shadow": "0 20px 25px -5px var(--sx-shadow-color, rgb(0 0 0 / 0.1)), 0 8px 10px -6px var(--sx-shadow-color, rgb(0 0 0 / 0.1))",
    "boxShadow": "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)"
  },
  "header": {
    "flex": "none",
    "borderBottomStyle": "var(--sx-border-style)",
    "borderBottomWidth": "1px",
    "borderColor": "var(--border-soft)",
    "padding": "calc(var(--spacing) * 5)"
  },
  "headerWithClose": {
    "paddingRight": "calc(var(--spacing) * 12)"
  },
  "title": {
    "margin": "calc(var(--spacing) * 0)",
    "fontSize": "15px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    "fontWeight": "var(--font-weight-semibold)",
    "--sx-tracking": "var(--tracking-tight)",
    "letterSpacing": "var(--tracking-tight)",
    "color": "var(--fg)"
  },
  "description": {
    "fontSize": "13px",
    "--sx-leading": "var(--leading-snug)",
    "lineHeight": "var(--leading-snug)",
    "color": "var(--fg-subtle)"
  },
  "descriptionSpacing": {
    "marginTop": "calc(var(--spacing) * 1.5)"
  },
  "closeButton": {
    "position": "absolute",
    "top": "calc(var(--spacing) * 3)",
    "right": "calc(var(--spacing) * 3)",
    "zIndex": 20,
    "display": "grid",
    "width": "calc(var(--spacing) * 7)",
    "height": "calc(var(--spacing) * 7)",
    "placeItems": "center",
    "borderRadius": "var(--radius-md)",
    "color": {
      "default": "var(--fg-subtle)",
      ":hover": {
        "default": null,
        "@media (hover: hover)": "var(--fg)"
      }
    },
    "transitionProperty": "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --sx-gradient-from, --sx-gradient-via, --sx-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter, display, content-visibility, overlay, pointer-events",
    "transitionTimingFunction": "var(--sx-ease, var(--default-transition-timing-function))",
    "transitionDuration": "var(--sx-duration, var(--default-transition-duration))",
    "backgroundColor": {
      "default": null,
      ":hover": {
        "default": null,
        "@media (hover: hover)": "var(--bg-hover)"
      }
    }
  },
  "body": {
    "minHeight": "calc(var(--spacing) * 0)",
    "flex": 1,
    "overflowY": "auto"
  },
  "footer": {
    "display": "flex",
    "flex": "none",
    "justifyContent": "flex-end",
    "gap": "calc(var(--spacing) * 2)",
    "borderTopStyle": "var(--sx-border-style)",
    "borderTopWidth": "1px",
    "borderColor": "var(--border-soft)",
    "padding": "calc(var(--spacing) * 4)"
  }
});
