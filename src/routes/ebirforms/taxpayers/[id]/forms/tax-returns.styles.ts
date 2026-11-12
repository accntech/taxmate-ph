import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  "backLink": {
    "width": "fit-content"
  },
  "loading": {
    "padding": "calc(var(--spacing) * 6)",
    "color": "var(--fg-muted)"
  },
  "notFoundHeading": {
    "fontSize": "1.25rem",
    "lineHeight": "calc(1.75 / 1.25)",
    "fontWeight": 600
  },
  "notFoundDescription": {
    "marginTop": "calc(var(--spacing) * 2)",
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "color": "var(--fg-muted)"
  },
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
  "tin": {
    "fontFamily": "var(--font-mono)",
    "fontSize": "0.75rem",
    "lineHeight": "calc(1 / 0.75)"
  },
  "status": {
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
  "statusMessage": {
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)"
  },
  "validationNotice": {
    "borderRadius": "var(--radius-md)",
    "borderStyle": "solid",
    "borderWidth": "1px",
    "borderColor": "color-mix(in oklab, var(--danger) 30%, transparent)",
    "backgroundColor": "var(--bg-elev)",
    "padding": "calc(var(--spacing) * 4)",
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)"
  },
  "validationHeading": {
    "fontWeight": 500
  },
  "validationList": {
    "marginBlock": "calc(var(--spacing) * 2)",
    "listStyleType": "disc",
    "paddingLeft": "calc(var(--spacing) * 5)"
  },
  "submissionNotice": {
    "borderRadius": "var(--radius-md)",
    "borderStyle": "solid",
    "borderWidth": "1px",
    "borderColor": "var(--border)",
    "backgroundColor": "var(--bg-elev)",
    "padding": "calc(var(--spacing) * 4)",
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "overflowWrap": "break-word"
  },
  "errorTone": {
    "color": "var(--danger)"
  },
  "normalTone": {
    "color": "var(--fg)"
  },
  "error": {
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "color": "var(--danger)"
  },
  "formCode": {
    "fontFamily": "var(--font-mono)",
    "fontWeight": 500,
    "color": "var(--accent)"
  },
  "updatedAt": {
    "whiteSpace": "nowrap",
    "fontSize": "0.75rem",
    "lineHeight": "calc(1 / 0.75)",
    "color": "var(--fg-muted)"
  },
  "menuContent": {
    "display": "flex",
    "flexDirection": "column"
  },
  "pdfProgress": {
    "marginTop": "calc(var(--spacing) * 1)",
    "height": "calc(var(--spacing) * 1.5)",
    "overflow": "hidden",
    "borderRadius": "calc(infinity * 1px)",
    "backgroundColor": "var(--bg-hover)"
  },
  "pdfProgressIndicator": {
    "display": "block",
    "height": "100%",
    "borderRadius": "calc(infinity * 1px)",
    "backgroundColor": "var(--accent)"
  },
  "pdfStatus": {
    "marginTop": "calc(var(--spacing) * 3)",
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "color": "var(--fg-muted)"
  },
  "pdfPath": {
    "wordBreak": "break-all",
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "color": "var(--fg-muted)"
  }
});
