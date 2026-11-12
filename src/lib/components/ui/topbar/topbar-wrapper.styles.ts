import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "root": {
    "position": "sticky",
    "top": "calc(var(--spacing) * 0)",
    "zIndex": 20,
    "display": "flex",
    "minHeight": "calc(var(--spacing) * 14)",
    "alignItems": "center",
    "gap": "calc(var(--spacing) * 3.5)",
    "borderBottomStyle": "var(--sx-border-style)",
    "borderBottomWidth": "1px",
    "borderColor": "var(--border-soft)",
    "backgroundColor": {
      "default": "var(--bg)",
      "@supports (color: color-mix(in lab, red, red))": "color-mix(in oklab, var(--bg) 95%, transparent)"
    },
    "paddingInline": {
      "default": "calc(var(--spacing) * 4)",
      "@media (width >= 64rem)": "calc(var(--spacing) * 7)"
    },
    "paddingBlock": "calc(var(--spacing) * 3)",
    "--sx-backdrop-blur": "blur(8px)",
    "WebkitBackdropFilter": "var(--sx-backdrop-blur,) var(--sx-backdrop-brightness,) var(--sx-backdrop-contrast,) var(--sx-backdrop-grayscale,) var(--sx-backdrop-hue-rotate,) var(--sx-backdrop-invert,) var(--sx-backdrop-opacity,) var(--sx-backdrop-saturate,) var(--sx-backdrop-sepia,)",
    "backdropFilter": "var(--sx-backdrop-blur,) var(--sx-backdrop-brightness,) var(--sx-backdrop-contrast,) var(--sx-backdrop-grayscale,) var(--sx-backdrop-hue-rotate,) var(--sx-backdrop-invert,) var(--sx-backdrop-opacity,) var(--sx-backdrop-saturate,) var(--sx-backdrop-sepia,)"
  },
  "menuButton": {
    "display": "grid",
    "width": "calc(var(--spacing) * 8)",
    "height": "calc(var(--spacing) * 8)",
    "placeItems": "center",
    "borderRadius": "var(--radius-md)",
    "borderStyle": "var(--sx-border-style)",
    "borderWidth": "1px",
    "borderColor": {
      "default": "transparent",
      ":focus-visible": {
        "default": "var(--accent)",
        "@supports (color: color-mix(in lab, red, red))": "color-mix(in oklch,var(--accent) 60%,var(--border))"
      }
    },
    "backgroundColor": {
      "default": "transparent",
      ":hover": {
        "default": null,
        "@media (hover: hover)": "var(--bg-hover)"
      }
    },
    "color": "var(--fg)",
    "transitionProperty": "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --sx-gradient-from, --sx-gradient-via, --sx-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter, display, content-visibility, overlay, pointer-events",
    "transitionTimingFunction": "var(--sx-ease, var(--default-transition-timing-function))",
    "transitionDuration": "var(--sx-duration, var(--default-transition-duration))",
    "--sx-outline-style": "none",
    "outlineStyle": "none",
    "--sx-shadow": {
      "default": null,
      ":focus-visible": {
        "default": "0 0 0 3px var(--sx-shadow-color, var(--accent))",
        "@supports (color: color-mix(in lab, red, red))": "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 18%,transparent))"
      }
    },
    "boxShadow": {
      "default": null,
      ":focus-visible": "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)"
    },
    "--sx-scale-x": {
      "default": null,
      ":active": "95%"
    },
    "--sx-scale-y": {
      "default": null,
      ":active": "95%"
    },
    "--sx-scale-z": {
      "default": null,
      ":active": "95%"
    },
    "scale": {
      "default": null,
      ":active": "var(--sx-scale-x) var(--sx-scale-y)"
    }
  },
  "breadcrumbs": {
    "display": {
      "default": "none",
      "@media (width >= 48rem)": "flex"
    },
    "minWidth": "calc(var(--spacing) * 0)",
    "flex": 1,
    "alignItems": "center",
    "gap": "calc(var(--spacing) * 2)",
    "fontSize": "13px",
    "color": "var(--fg-muted)"
  },
  "separator": {
    "color": "var(--fg-subtle)"
  },
  "link": {
    "overflow": "hidden",
    "textOverflow": "ellipsis",
    "whiteSpace": "nowrap",
    "borderRadius": "var(--radius-sm)",
    "borderStyle": "var(--sx-border-style)",
    "borderWidth": "1px",
    "borderColor": "transparent",
    "color": {
      "default": "var(--fg-subtle)",
      ":last-child": "var(--fg)",
      ":hover": {
        "default": null,
        "@media (hover: hover)": "var(--fg)"
      }
    },
    "transitionProperty": "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --sx-gradient-from, --sx-gradient-via, --sx-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter, display, content-visibility, overlay, pointer-events",
    "transitionTimingFunction": "var(--sx-ease, var(--default-transition-timing-function))",
    "transitionDuration": "var(--sx-duration, var(--default-transition-duration))",
    "--sx-font-weight": {
      "default": null,
      ":last-child": "var(--font-weight-medium)"
    },
    "fontWeight": {
      "default": null,
      ":last-child": "var(--font-weight-medium)"
    }
  },
  "currentPage": {
    "overflow": "hidden",
    "textOverflow": "ellipsis",
    "whiteSpace": "nowrap",
    "color": {
      "default": "var(--fg-subtle)",
      ":last-child": "var(--fg)"
    },
    "--sx-font-weight": {
      "default": null,
      ":last-child": "var(--font-weight-medium)"
    },
    "fontWeight": {
      "default": null,
      ":last-child": "var(--font-weight-medium)"
    }
  },
  "actions": {
    "marginLeft": "auto",
    "display": "flex",
    "alignItems": "center",
    "gap": "calc(var(--spacing) * 2)"
  }
});
