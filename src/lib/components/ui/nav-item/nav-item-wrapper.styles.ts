import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "row": {
    "display": "flex",
    "width": "100%",
    "cursor": "pointer",
    "alignItems": "center",
    "borderRadius": "var(--radius-md)",
    "borderStyle": "var(--sx-border-style)",
    "borderWidth": "1px",
    "borderColor": {
      "default": "transparent",
      ":focus-visible": "var(--accent)",
      ":is([data-active])": "var(--border)"
    },
    "backgroundColor": {
      "default": "transparent",
      ":hover": {
        "default": null,
        "@media (hover: hover)": "var(--bg-hover)"
      },
      ":is([data-active])": "var(--bg-elev)"
    },
    "paddingBlock": "0.4375rem",
    "textAlign": "left",
    "fontSize": "13px",
    "color": {
      "default": "var(--fg-muted)",
      ":hover": {
        "default": null,
        "@media (hover: hover)": "var(--fg)"
      },
      ":is([data-active])": "var(--fg)"
    },
    "--sx-outline-style": "none",
    "outlineStyle": "none",
    "WebkitUserSelect": "none",
    "userSelect": "none",
    "--sx-shadow": {
      "default": null,
      ":focus-visible": "0 0 0 3px var(--sx-shadow-color, var(--ring))",
      ":is([data-active])": "0 1px 3px 0 var(--sx-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--sx-shadow-color, rgb(0 0 0 / 0.1))"
    },
    "boxShadow": {
      "default": null,
      ":focus-visible": "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
      ":is([data-active])": "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)"
    },
    "scale": {
      "default": null,
      ":active": 0.98
    }
  },
  "icon": {
    "width": "calc(var(--spacing) * 4)",
    "height": "calc(var(--spacing) * 4)",
    "flex": "none",
    "opacity": "85%",
    "color": {
      "default": null,
      ":is(:where(.group\\/nr)[data-active] *)": "var(--accent)"
    }
  },
  "label": {
    "minWidth": "calc(var(--spacing) * 0)",
    "flex": 1,
    "overflow": "hidden",
    "textOverflow": "ellipsis",
    "whiteSpace": "nowrap"
  },
  "hiddenLabel": {
    "maxWidth": "calc(var(--spacing) * 0)",
    "opacity": "0%"
  },
  "visibleLabel": {
    "maxWidth": "100%",
    "opacity": "100%"
  },
  "caret": {
    "color": "var(--fg-subtle)",
    "transitionProperty": "transform, translate, scale, rotate",
    "transitionTimingFunction": "var(--sx-ease, var(--default-transition-timing-function))",
    "transitionDuration": "var(--sx-duration, var(--default-transition-duration))"
  },
  "expandedCaret": {
    "rotate": "0deg"
  },
  "collapsedCaret": {
    "rotate": "calc(90deg * -1)"
  },
  "hiddenCaret": {
    "width": "calc(var(--spacing) * 0)",
    "opacity": "0%"
  },
  "visibleCaret": {
    "width": "calc(var(--spacing) * 3)",
    "opacity": "100%"
  },
  "children": {
    "marginTop": "calc(var(--spacing) * 0.5)",
    "marginBottom": "calc(var(--spacing) * 1.5)",
    "marginLeft": "1.375rem",
    "display": "flex",
    "listStyleType": "none",
    "flexDirection": "column",
    "gap": "1px",
    "borderLeftStyle": "var(--sx-border-style)",
    "borderLeftWidth": "1px",
    "borderColor": "var(--border-soft)",
    "paddingLeft": "calc(var(--spacing) * 2.5)"
  },
  "childLink": {
    "display": "flex",
    "alignItems": "center",
    "gap": "calc(var(--spacing) * 2)",
    "borderRadius": "var(--radius-md)",
    "borderStyle": "var(--sx-border-style)",
    "borderWidth": "1px",
    "borderColor": "transparent",
    "paddingInline": "calc(var(--spacing) * 2.5)",
    "paddingBlock": "0.3125rem",
    "fontSize": "12.5px",
    "color": {
      "default": "var(--fg-muted)",
      ":hover": {
        "default": null,
        "@media (hover: hover)": "var(--fg)"
      },
      ":is([data-active])": "var(--fg)"
    },
    "transitionProperty": "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --sx-gradient-from, --sx-gradient-via, --sx-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter, display, content-visibility, overlay, pointer-events",
    "transitionTimingFunction": "var(--sx-ease, var(--default-transition-timing-function))",
    "transitionDuration": "var(--sx-duration, var(--default-transition-duration))",
    "backgroundColor": {
      "default": null,
      ":hover": {
        "default": null,
        "@media (hover: hover)": "var(--bg-hover)"
      },
      ":is([data-active])": "var(--bg-elev)"
    }
  },
  "childMarker": {
    "width": "calc(var(--spacing) * 1)",
    "height": "calc(var(--spacing) * 1)",
    "flex": "none",
    "borderRadius": "calc(infinity * 1px)",
    "backgroundColor": "var(--fg-subtle)"
  },
  "childLabel": {
    "overflow": "hidden",
    "textOverflow": "ellipsis",
    "whiteSpace": "nowrap"
  },
  "collapsed": {
    "justifyContent": "center",
    "gap": 0,
    "paddingInline": "calc(var(--spacing) * 3.5)"
  },
  "expanded": {
    "gap": "calc(var(--spacing) * 2.5)",
    "paddingInline": "calc(var(--spacing) * 2.5)"
  }
});
