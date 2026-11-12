import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
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
    "insetInline": "calc(var(--spacing) * 0)",
    "top": {
      "default": "auto",
      "@media (width >= 40rem)": "0px"
    },
    "bottom": "calc(var(--spacing) * 0)",
    "margin": "calc(var(--spacing) * 0)",
    "height": "auto",
    "maxHeight": "90dvh",
    "width": "100dvw",
    "maxWidth": "none"
  },
  "surface": {
    "borderStyle": "var(--sx-border-style)",
    "borderWidth": "0px",
    "backgroundColor": "transparent",
    "padding": "calc(var(--spacing) * 0)",
    "color": "var(--fg)"
  },
  "centered": {
    "margin": {
      "default": null,
      "@media (width >= 40rem)": "auto"
    },
    "height": {
      "default": null,
      "@media (width >= 40rem)": "fit-content"
    }
  },
  "desktopBounds": {
    "maxHeight": {
      "default": null,
      "@media (width >= 40rem)": "calc(100dvh - 2rem)"
    },
    "width": {
      "default": null,
      "@media (width >= 40rem)": "calc(100vw - 2rem)"
    }
  },
  "panel": {
    "position": "relative",
    "display": "flex",
    "maxHeight": "90dvh",
    "flexDirection": "column",
    "overflow": "hidden",
    "borderTopLeftRadius": "var(--radius-xl)",
    "borderTopRightRadius": "var(--radius-xl)",
    "borderStyle": "var(--sx-border-style)",
    "borderWidth": "1px"
  },
  "panelSurface": {
    "borderColor": "var(--border)",
    "backgroundColor": "var(--bg-elev)",
    "--sx-shadow": "0 10px 15px -3px var(--sx-shadow-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--sx-shadow-color, rgb(0 0 0 / 0.1))",
    "boxShadow": "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    "maxHeight": {
      "default": null,
      "@media (width >= 40rem)": "calc(100dvh - 2rem)"
    },
    "borderRadius": {
      "default": null,
      "@media (width >= 40rem)": "var(--radius-xl)"
    }
  },
  "commandPadding": {
    "padding": "calc(var(--spacing) * 0)"
  },
  "defaultPadding": {
    "padding": "calc(var(--spacing) * 5)"
  },
  "dragHandle": {
    "marginInline": "auto",
    "marginBottom": "calc(var(--spacing) * 3)",
    "height": "calc(var(--spacing) * 1)",
    "width": "calc(var(--spacing) * 9)",
    "flex": "none",
    "borderRadius": "calc(infinity * 1px)",
    "backgroundColor": {
      "default": "var(--fg-subtle)",
      "@supports (color: color-mix(in lab, red, red))": "color-mix(in oklab, var(--fg-subtle) 40%, transparent)"
    },
    "display": {
      "default": null,
      "@media (width >= 40rem)": "none"
    }
  },
  "closeButton": {
    "position": "absolute",
    "top": "calc(var(--spacing) * 3)",
    "right": "calc(var(--spacing) * 3)",
    "display": {
      "default": "none",
      "@media (width >= 40rem)": "grid"
    },
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
  "hiddenHeading": {
    "position": "absolute",
    "width": "1px",
    "height": "1px",
    "padding": 0,
    "margin": "-1px",
    "overflow": "hidden",
    "clipPath": "inset(50%)",
    "whiteSpace": "nowrap",
    "borderWidth": 0
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
  "descriptionSpacing": {
    "marginTop": "calc(var(--spacing) * 1.5)"
  },
  "description": {
    "fontSize": "13px",
    "--sx-leading": "var(--leading-snug)",
    "lineHeight": "var(--leading-snug)",
    "color": "var(--fg-subtle)"
  },
  "commandBody": {
    "display": "flex",
    "minHeight": "calc(var(--spacing) * 0)",
    "flexDirection": "column",
    "overflow": "hidden"
  },
  "bodySpacing": {
    "marginTop": "calc(var(--spacing) * 4)"
  },
  "body": {
    "marginInline": "calc(var(--spacing) * -5)",
    "minHeight": "calc(var(--spacing) * 0)",
    "flex": 1,
    "overflowY": "auto",
    "paddingInline": "calc(var(--spacing) * 5)"
  },
  "footer": {
    "marginTop": "calc(var(--spacing) * 5)",
    "display": "flex",
    "flexWrap": "wrap",
    "justifyContent": "flex-end",
    "gap": "calc(var(--spacing) * 2)"
  }
});
