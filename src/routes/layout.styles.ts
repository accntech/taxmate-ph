import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  "appIcon": {
    "display": "grid",
    "width": "calc(var(--spacing) * 5)",
    "height": "calc(var(--spacing) * 5)",
    "placeItems": "center"
  },
  "workspaceLabel": {
    "paddingInline": "calc(var(--spacing) * 2.5)",
    "fontSize": "11px",
    "fontWeight": 600,
    "textTransform": "uppercase",
    "color": "var(--fg-subtle)"
  },
  "collapsedLabel": {
    "maxWidth": "0px",
    "opacity": 0
  },
  "navigationRow": {
    "display": "grid",
    "alignItems": "center",
    "borderRadius": "var(--radius-md)",
    "borderStyle": "solid",
    "borderWidth": "1px",
    "borderColor": {
      "default": "transparent",
      ":focus-visible": "var(--accent)"
    },
    "color": {
      "default": "var(--fg-muted)",
      ":hover": "var(--fg)"
    },
    "backgroundColor": {
      "default": null,
      ":hover": "var(--bg-hover)"
    },
    "scale": {
      "default": null,
      ":active": "0.98"
    },
    "boxShadow": {
      "default": null,
      ":focus-visible": "0 0 0 3px var(--ring)"
    }
  },
  "collapsedNavigation": {
    "marginInline": "auto",
    "width": "calc(var(--spacing) * 11)",
    "maxWidth": "100%",
    "height": "calc(var(--spacing) * 11)",
    "gridTemplateColumns": "1.25rem 0fr",
    "justifyContent": "center",
    "gap": "0px",
    "padding": "0px"
  },
  "expandedNavigation": {
    "display": "grid",
    "minHeight": "calc(var(--spacing) * 13)",
    "gridTemplateColumns": "auto minmax(0,1fr)",
    "gap": "calc(var(--spacing) * 3)",
    "paddingInline": "calc(var(--spacing) * 3)",
    "paddingBlock": "calc(var(--spacing) * 2)"
  },
  "activeCollapsedNavigation": {
    "backgroundColor": {
      "default": "var(--accent-soft)",
      ":hover": "var(--bg-hover)"
    },
    "color": {
      "default": "var(--accent)",
      ":hover": "var(--fg)"
    }
  },
  "activeNavigation": {
    "borderColor": {
      "default": "var(--border)",
      ":focus-visible": "var(--accent)"
    },
    "backgroundColor": {
      "default": "var(--bg-elev)",
      ":hover": "var(--bg-hover)"
    },
    "color": {
      "default": "var(--fg)",
      ":hover": "var(--fg)"
    },
    "boxShadow": {
      "default": "var(--shadow-ui-sm)",
      ":focus-visible": "0 0 0 3px var(--ring)"
    }
  },
  "navigationCopy": {
    "display": "grid",
    "minWidth": "0px"
  },
  "navigationDetails": {
    "display": "grid",
    "width": "11.75rem",
    "gap": "calc(var(--spacing) * 1)"
  },
  "navigationHeading": {
    "display": "flex",
    "minWidth": "0px",
    "alignItems": "center",
    "justifyContent": "space-between",
    "gap": "calc(var(--spacing) * 2)"
  },
  "truncatedLabel": {
    "overflow": "hidden",
    "textOverflow": "ellipsis",
    "whiteSpace": "nowrap"
  },
  "navigationDescription": {
    "fontSize": "0.75rem",
    "lineHeight": "1.375",
    "whiteSpace": "normal",
    "color": "var(--fg-subtle)"
  },
  "footer": {
    "padding": "calc(var(--spacing) * 3)"
  },
  "expandedSettings": {
    "minHeight": "calc(var(--spacing) * 11)",
    "gridTemplateColumns": "auto minmax(0,1fr)",
    "gap": "calc(var(--spacing) * 3)",
    "paddingInline": "calc(var(--spacing) * 3)",
    "paddingBlock": "calc(var(--spacing) * 2)"
  },
  "settingsIcon": {
    "display": "grid",
    "width": "calc(var(--spacing) * 5)",
    "height": "calc(var(--spacing) * 5)",
    "flexShrink": 0,
    "placeItems": "center"
  },
  "settingsLabel": {
    "minWidth": "0px",
    "overflow": "hidden",
    "textOverflow": "ellipsis",
    "whiteSpace": "nowrap",
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "fontWeight": 500
  },
  "mainColumn": {
    "minWidth": "0px"
  }
});
