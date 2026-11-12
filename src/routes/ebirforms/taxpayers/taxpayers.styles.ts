import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  "header": {
    "display": "flex",
    "flexWrap": "wrap",
    "alignItems": "center",
    "justifyContent": "space-between",
    "gap": "calc(var(--spacing) * 4)",
    "paddingBlock": "calc(var(--spacing) * 2)"
  },
  "heading": {
    "fontSize": "1.5rem",
    "lineHeight": "calc(2 / 1.5)",
    "fontWeight": 600,
    "letterSpacing": "-0.025em"
  },
  "description": {
    "marginTop": "calc(var(--spacing) * 1)",
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "color": "var(--fg-muted)"
  },
  "hint": {
    "marginTop": "calc(var(--spacing) * 1)",
    "fontSize": "0.75rem",
    "lineHeight": "calc(1 / 0.75)",
    "color": "var(--fg-subtle)"
  },
  "loadError": {
    "borderRadius": "var(--radius-panel)",
    "borderStyle": "solid",
    "borderWidth": "1px",
    "borderColor": "color-mix(in oklab, var(--danger) 30%, transparent)",
    "backgroundColor": "var(--bg-elev)",
    "padding": "calc(var(--spacing) * 5)"
  },
  "errorHeading": {
    "fontSize": "1rem",
    "lineHeight": "1.5",
    "fontWeight": 600
  },
  "errorDescription": {
    "marginTop": "calc(var(--spacing) * 2)",
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "color": "var(--fg-muted)"
  },
  "retryAction": {
    "marginTop": "calc(var(--spacing) * 4)"
  },
  "technicalDetails": {
    "marginTop": "calc(var(--spacing) * 4)",
    "fontSize": "0.75rem",
    "lineHeight": "calc(1 / 0.75)",
    "color": "var(--fg-muted)"
  },
  "technicalSummary": {
    "cursor": "pointer"
  },
  "technicalMessage": {
    "marginTop": "calc(var(--spacing) * 2)",
    "overflowWrap": "break-word",
    "fontFamily": "var(--font-mono)"
  },
  "emptyState": {
    "borderRadius": "var(--radius-panel)",
    "borderStyle": "solid",
    "borderWidth": "1px",
    "borderColor": "var(--border)",
    "backgroundColor": "var(--bg-elev)",
    "padding": "calc(var(--spacing) * 8)",
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "color": "var(--fg-muted)"
  },
  "archiveNotice": {
    "display": "flex",
    "flexWrap": "wrap",
    "alignItems": "center",
    "justifyContent": "space-between",
    "gap": "calc(var(--spacing) * 3)",
    "borderRadius": "var(--radius-md)",
    "borderStyle": "solid",
    "borderWidth": "1px",
    "borderColor": "var(--border)",
    "backgroundColor": "var(--bg-elev)",
    "paddingInline": "calc(var(--spacing) * 4)",
    "paddingBlock": "calc(var(--spacing) * 3)"
  },
  "status": {
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)"
  },
  "taxpayerLink": {
    "fontWeight": 500,
    "color": {
      "default": "var(--fg)",
      ":hover": "var(--accent)"
    },
    "textUnderlineOffset": "4px",
    "textDecorationLine": {
      "default": null,
      ":hover": "underline",
      ":focus-visible": "underline"
    }
  },
  "tin": {
    "whiteSpace": "nowrap",
    "fontFamily": "var(--font-mono)",
    "fontSize": "0.75rem",
    "lineHeight": "calc(1 / 0.75)"
  },
  "mutedCell": {
    "color": "var(--fg-muted)"
  },
  "footerNote": {
    "fontSize": "0.75rem",
    "lineHeight": "calc(1 / 0.75)",
    "color": "var(--fg-muted)"
  },
  "error": {
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "color": "var(--danger)"
  }
});
