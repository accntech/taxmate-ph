import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  "backLink": {
    "width": "fit-content"
  },
  "taxpayerCard": {
    "display": "grid",
    "minWidth": "calc(var(--spacing) * 64)",
    "gap": "calc(var(--spacing) * 2)"
  },
  "taxpayerIdentity": {
    "display": "flex",
    "alignItems": "center",
    "gap": "calc(var(--spacing) * 2)",
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "fontWeight": 600,
    "color": "var(--fg)"
  },
  "tin": {
    "fontFamily": "var(--font-mono)",
    "fontSize": "0.75rem",
    "lineHeight": "calc(1 / 0.75)",
    "color": "var(--fg-muted)"
  },
  "summaryGrid": {
    "display": "grid",
    "gap": "calc(var(--spacing) * 3)",
    "gridTemplateColumns": {
      "default": null,
      "@media (width >= 40rem)": "repeat(2, minmax(0, 1fr))",
      "@media (width >= 64rem)": "repeat(4, minmax(0, 1fr))"
    }
  },
  "summaryCard": {
    "display": "grid",
    "gap": "calc(var(--spacing) * 1)"
  },
  "summaryLabel": {
    "fontSize": "0.75rem",
    "lineHeight": "calc(1 / 0.75)",
    "fontWeight": 500,
    "color": "var(--fg-muted)"
  },
  "summaryValue": {
    "overflow": "hidden",
    "textOverflow": "ellipsis",
    "whiteSpace": "nowrap",
    "fontFamily": "var(--font-mono)",
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "fontWeight": 600,
    "color": "var(--fg)"
  },
  "actions": {
    "display": "grid",
    "gap": "calc(var(--spacing) * 3)",
    "gridTemplateColumns": {
      "default": null,
      "@media (width >= 40rem)": "repeat(2, minmax(0, 1fr))"
    }
  },
  "action": {
    "width": "100%"
  }
});
