import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "root": {
    "display": "grid",
    "minWidth": "calc(var(--spacing) * 0)",
    "gap": "calc(var(--spacing) * 4)",
    "borderRadius": "var(--radius-panel)",
    "borderStyle": "var(--sx-border-style)",
    "borderWidth": "1px",
    "borderColor": "var(--border)",
    "backgroundColor": "var(--bg-elev)",
    "padding": "calc(var(--spacing) * 4)",
    "--sx-shadow": "var(--shadow-ui-sm)",
    "boxShadow": "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)"
  },
  "wideLayout": {
    "gridTemplateColumns": {
      "default": null,
      "@media (width >= 64rem)": "minmax(0,1fr) auto"
    },
    "alignItems": {
      "default": null,
      "@media (width >= 64rem)": "flex-start"
    }
  },
  "identity": {
    "display": "flex",
    "width": "100%",
    "minWidth": "calc(var(--spacing) * 0)",
    "alignItems": "flex-start",
    "gap": "calc(var(--spacing) * 3)"
  },
  "icon": {
    "display": "grid",
    "width": "calc(var(--spacing) * 10)",
    "height": "calc(var(--spacing) * 10)",
    "flexShrink": 0,
    "placeItems": "center",
    "borderRadius": "var(--radius-md)",
    "backgroundColor": "var(--accent-soft)",
    "color": "var(--accent)"
  },
  "heading": {
    "minWidth": "calc(var(--spacing) * 0)",
    "flex": 1
  },
  "eyebrow": {
    "fontFamily": "var(--font-mono)",
    "fontSize": "var(--text-xs)",
    "lineHeight": "var(--sx-leading, var(--text-xs--line-height))",
    "--sx-font-weight": "var(--font-weight-semibold)",
    "fontWeight": "var(--font-weight-semibold)",
    "color": "var(--accent)",
    "textTransform": "uppercase"
  },
  "title": {
    "marginTop": "calc(var(--spacing) * 1)",
    "fontSize": {
      "default": "var(--text-2xl)",
      "@media (width >= 40rem)": "var(--text-3xl)"
    },
    "lineHeight": {
      "default": "var(--leading-tight)",
      "@media (width >= 40rem)": "var(--sx-leading, var(--text-3xl--line-height))"
    },
    "--sx-leading": "var(--leading-tight)",
    "--sx-font-weight": "var(--font-weight-semibold)",
    "fontWeight": "var(--font-weight-semibold)",
    "color": "var(--fg)"
  },
  "description": {
    "marginTop": "calc(var(--spacing) * 2)",
    "maxWidth": "var(--container-3xl)",
    "fontSize": "var(--text-sm)",
    "lineHeight": "calc(var(--spacing) * 6)",
    "--sx-leading": "calc(var(--spacing) * 6)",
    "color": "var(--fg-muted)"
  },
  "actions": {
    "display": "flex",
    "flexWrap": "wrap",
    "gap": "calc(var(--spacing) * 2)",
    "justifyContent": {
      "default": null,
      "@media (width >= 64rem)": "flex-end"
    }
  }
});
