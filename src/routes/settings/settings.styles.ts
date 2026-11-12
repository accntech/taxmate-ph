import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  "sectionHeading": {
    "display": "flex",
    "alignItems": "flex-start",
    "gap": "calc(var(--spacing) * 3)",
    "borderBottomStyle": "solid",
    "borderBottomWidth": "1px",
    "borderColor": "var(--border-soft)",
    "paddingBottom": "calc(var(--spacing) * 3)"
  },
  "sectionIcon": {
    "display": "grid",
    "width": "calc(var(--spacing) * 8)",
    "height": "calc(var(--spacing) * 8)",
    "flexShrink": 0,
    "placeItems": "center",
    "borderRadius": "var(--radius-md)",
    "backgroundColor": "var(--accent-soft)",
    "color": "var(--accent)"
  },
  "copy": {
    "minWidth": "0px"
  },
  "sectionTitle": {
    "fontSize": "1rem",
    "lineHeight": "1.5",
    "fontWeight": 600,
    "letterSpacing": "-0.025em",
    "color": "var(--fg)"
  },
  "sectionDescription": {
    "marginTop": "calc(var(--spacing) * 0.5)",
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "color": "var(--fg-muted)"
  },
  "settingRow": {
    "display": "grid",
    "gap": {
      "default": "calc(var(--spacing) * 3)",
      "@media (width >= 40rem)": "calc(var(--spacing) * 6)"
    },
    "paddingBlock": "calc(var(--spacing) * 4)",
    "gridTemplateColumns": {
      "default": null,
      "@media (width >= 40rem)": "minmax(0,1fr) auto"
    },
    "alignItems": {
      "default": null,
      "@media (width >= 40rem)": "center"
    }
  },
  "rowSeparator": {
    "borderBottomStyle": "solid",
    "borderBottomWidth": "1px",
    "borderColor": "var(--border-soft)"
  },
  "settingLabel": {
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "fontWeight": 500,
    "color": "var(--fg)"
  },
  "settingDescription": {
    "marginTop": "calc(var(--spacing) * 0.5)",
    "fontSize": "13px",
    "lineHeight": "calc(var(--spacing) * 5)",
    "color": "var(--fg-muted)"
  },
  "settingControl": {
    "justifySelf": {
      "default": null,
      "@media (width >= 40rem)": "end"
    }
  },
  "segment": {
    "minHeight": "calc(var(--spacing) * 8)",
    "borderRadius": "var(--radius-sm)",
    "paddingInline": "calc(var(--spacing) * 3)",
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "fontWeight": 500,
    "outlineStyle": "none"
  },
  "segmentInteraction": {
    "transitionProperty": "color,background-color,box-shadow",
    "transitionTimingFunction": "var(--default-transition-timing-function, ease)",
    "transitionDuration": "150ms",
    "boxShadow": {
      "default": null,
      ":focus-visible": "0 0 0 3px var(--ring)"
    }
  },
  "selectedSegment": {
    "backgroundColor": "var(--bg-elev)",
    "color": "var(--fg)",
    "boxShadow": {
      "default": "var(--shadow-sm)",
      ":focus-visible": "0 0 0 3px var(--ring)"
    }
  },
  "unselectedSegment": {
    "color": {
      "default": "var(--fg-muted)",
      ":hover": "var(--fg)"
    }
  },
  "themeControl": {
    "display": "grid",
    "gap": "calc(var(--spacing) * 1.5)",
    "justifyItems": {
      "default": null,
      "@media (width >= 40rem)": "end"
    }
  },
  "segmentGroup": {
    "display": "inline-flex",
    "borderRadius": "var(--radius-md)",
    "borderStyle": "solid",
    "borderWidth": "1px",
    "borderColor": "var(--border)",
    "backgroundColor": "var(--bg-elev-2)",
    "padding": "calc(var(--spacing) * 0.5)"
  },
  "themeNote": {
    "fontSize": "0.75rem",
    "lineHeight": "calc(1 / 0.75)",
    "color": "var(--fg-subtle)"
  },
  "select": {
    "width": "calc(var(--spacing) * 56)"
  },
  "card": {
    "display": "grid",
    "gap": "calc(var(--spacing) * 1)"
  },
  "dispatcherDescription": {
    "paddingBottom": "calc(var(--spacing) * 2)",
    "fontSize": "13px",
    "lineHeight": "calc(var(--spacing) * 5)",
    "color": "var(--fg-muted)"
  },
  "submissionLog": {
    "minWidth": "0px",
    "borderTopStyle": "solid",
    "borderTopWidth": "1px",
    "borderColor": "var(--border-soft)",
    "paddingBlock": "calc(var(--spacing) * 4)"
  },
  "logHeading": {
    "display": "flex",
    "flexWrap": "wrap",
    "alignItems": "center",
    "justifyContent": "space-between",
    "gap": "calc(var(--spacing) * 3)"
  },
  "logTitle": {
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "fontWeight": 600,
    "color": "var(--fg)"
  },
  "logDescription": {
    "marginTop": "calc(var(--spacing) * 2)",
    "fontSize": "13px",
    "lineHeight": "calc(var(--spacing) * 5)",
    "color": "var(--fg-muted)"
  },
  "logStatus": {
    "marginTop": "calc(var(--spacing) * 3)",
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "color": "var(--fg-muted)"
  },
  "logError": {
    "marginTop": "calc(var(--spacing) * 3)",
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "color": "var(--danger)"
  },
  "logPath": {
    "marginTop": "calc(var(--spacing) * 3)",
    "wordBreak": "break-all",
    "fontSize": "0.75rem",
    "lineHeight": "calc(var(--spacing) * 5)",
    "color": "var(--fg-subtle)"
  },
  "logTruncatedNote": {
    "marginTop": "calc(var(--spacing) * 2)",
    "fontSize": "0.75rem",
    "lineHeight": "calc(1 / 0.75)",
    "color": "var(--fg-muted)"
  },
  "logField": {
    "position": "relative",
    "marginTop": "calc(var(--spacing) * 3)"
  },
  "logActions": {
    "position": "absolute",
    "right": "calc(var(--spacing) * 2)",
    "top": "calc(var(--spacing) * 2)"
  },
  "logEntries": {
    "display": "block",
    "width": "100%",
    "resize": "vertical",
    "borderRadius": "var(--radius-md)",
    "borderStyle": "solid",
    "borderWidth": "1px",
    "borderColor": "var(--border)",
    "backgroundColor": "var(--bg-elev-2)",
    "padding": "calc(var(--spacing) * 3)",
    "paddingTop": "calc(var(--spacing) * 14)",
    "fontFamily": "var(--font-mono)",
    "fontSize": "0.75rem",
    "lineHeight": "calc(var(--spacing) * 5)",
    "color": "var(--fg)",
    "outlineStyle": {
      "default": null,
      ":focus-visible": "solid"
    },
    "outlineWidth": {
      "default": null,
      ":focus-visible": "2px"
    },
    "outlineOffset": {
      "default": null,
      ":focus-visible": "2px"
    },
    "outlineColor": {
      "default": null,
      ":focus-visible": "var(--accent)"
    }
  },
  "visuallyHidden": {
    "position": "absolute",
    "width": "1px",
    "height": "1px",
    "padding": 0,
    "margin": "-1px",
    "overflow": "hidden",
    "clip": "rect(0, 0, 0, 0)",
    "whiteSpace": "nowrap",
    "borderWidth": 0
  },
  "copyError": {
    "marginTop": "calc(var(--spacing) * 2)",
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "color": "var(--danger)"
  },
  "aboutGrid": {
    "display": "grid",
    "gap": "calc(var(--spacing) * 3)",
    "paddingBlock": "calc(var(--spacing) * 4)",
    "gridTemplateColumns": {
      "default": null,
      "@media (width >= 40rem)": "repeat(2, minmax(0, 1fr))"
    }
  },
  "aboutRow": {
    "display": {
      "default": "flex",
      "@media (width >= 40rem)": "block"
    },
    "alignItems": "center",
    "justifyContent": "space-between",
    "gap": "calc(var(--spacing) * 3)"
  },
  "aboutLabel": {
    "fontSize": "13px",
    "color": "var(--fg-muted)"
  },
  "applicationValue": {
    "fontWeight": 500,
    "color": "var(--fg)",
    "marginTop": {
      "default": null,
      "@media (width >= 40rem)": "calc(var(--spacing) * 0.5)"
    }
  },
  "versionValue": {
    "fontFamily": "var(--font-mono)",
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "fontVariantNumeric": "tabular-nums",
    "color": "var(--fg)",
    "marginTop": {
      "default": null,
      "@media (width >= 40rem)": "calc(var(--spacing) * 0.5)"
    }
  },
  "aboutDescription": {
    "borderTopStyle": "solid",
    "borderTopWidth": "1px",
    "borderColor": "var(--border-soft)",
    "paddingTop": "calc(var(--spacing) * 4)",
    "fontSize": "13px",
    "lineHeight": "calc(var(--spacing) * 6)",
    "color": "var(--fg-muted)"
  },
  "links": {
    "marginTop": "calc(var(--spacing) * 3)",
    "display": "flex",
    "flexWrap": "wrap",
    "columnGap": "calc(var(--spacing) * 5)",
    "rowGap": "calc(var(--spacing) * 2)"
  },
  "externalLink": {
    "fontSize": "0.875rem",
    "lineHeight": "calc(1.25 / 0.875)",
    "fontWeight": 500,
    "color": "var(--accent)",
    "textUnderlineOffset": "4px",
    "textDecorationLine": {
      "default": null,
      ":hover": "underline"
    }
  }
});
