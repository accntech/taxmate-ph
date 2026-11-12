import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "neutral": {
    "borderColor": "var(--border)",
    "backgroundColor": "var(--bg-elev-2)",
    "color": "var(--fg-muted)"
  },
  "accent": {
    "borderColor": {
      "default": "var(--accent)",
      "@supports (color: color-mix(in lab, red, red))": "color-mix(in oklab, var(--accent) 25%, transparent)"
    },
    "backgroundColor": "var(--accent-soft)",
    "color": "var(--accent)"
  },
  "success": {
    "borderColor": {
      "default": "var(--success)",
      "@supports (color: color-mix(in lab, red, red))": "color-mix(in oklab, var(--success) 25%, transparent)"
    },
    "backgroundColor": "var(--success-soft)",
    "color": "var(--success)"
  },
  "warn": {
    "borderColor": {
      "default": "var(--warn)",
      "@supports (color: color-mix(in lab, red, red))": "color-mix(in oklab, var(--warn) 25%, transparent)"
    },
    "backgroundColor": "var(--warn-soft)",
    "color": "var(--warn)"
  },
  "danger": {
    "borderColor": {
      "default": "var(--danger)",
      "@supports (color: color-mix(in lab, red, red))": "color-mix(in oklab, var(--danger) 25%, transparent)"
    },
    "backgroundColor": "var(--danger-soft)",
    "color": "var(--danger)"
  },
  "info": {
    "borderColor": {
      "default": "var(--info)",
      "@supports (color: color-mix(in lab, red, red))": "color-mix(in oklab, var(--info) 25%, transparent)"
    },
    "backgroundColor": "var(--info-soft)",
    "color": "var(--info)"
  },
  "small": {
    "minHeight": "calc(var(--spacing) * 6)",
    "paddingInline": "calc(var(--spacing) * 2)",
    "fontSize": "11px"
  },
  "medium": {
    "minHeight": "calc(var(--spacing) * 7)",
    "paddingInline": "calc(var(--spacing) * 2.5)",
    "fontSize": "var(--text-xs)",
    "lineHeight": "var(--sx-leading, var(--text-xs--line-height))"
  },
  "root": {
    "display": "inline-flex",
    "width": "fit-content",
    "alignItems": "center",
    "gap": "calc(var(--spacing) * 1)",
    "borderRadius": "var(--radius-md)",
    "borderStyle": "var(--sx-border-style)",
    "borderWidth": "1px",
    "--sx-leading": "1",
    "lineHeight": 1,
    "--sx-font-weight": "var(--font-weight-semibold)",
    "fontWeight": "var(--font-weight-semibold)"
  },
  "singleLine": {
    "whiteSpace": "nowrap"
  }
});
