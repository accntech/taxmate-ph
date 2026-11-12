import * as stylex from "@stylexjs/stylex";

export const designSystem = stylex.create({
  "sectionHeading": {
    "display": "flex",
    "alignItems": "baseline",
    "gap": "1rem",
    "borderBottom": "1px solid var(--border-soft)",
    "paddingBottom": ".75rem"
  },
  "sectionIndex": {
    "fontFamily": "var(--font-mono)",
    "fontSize": ".875rem",
    "lineHeight": "1.25rem",
    "fontVariantNumeric": "tabular-nums",
    "color": "var(--fg-subtle)"
  },
  "shrinkable": {
    "minWidth": 0
  },
  "sectionTitle": {
    "fontSize": "1.125rem",
    "lineHeight": "1.75rem",
    "fontWeight": 600,
    "letterSpacing": "-.025em",
    "color": "var(--fg)"
  },
  "sectionDescription": {
    "marginTop": ".125rem",
    "fontSize": ".875rem",
    "lineHeight": "1.25rem",
    "color": "var(--fg-muted)"
  },
  "swatch": {
    "display": "grid",
    "gridTemplateColumns": "auto minmax(0,1fr)",
    "alignItems": "center",
    "gap": ".75rem",
    "borderRadius": "var(--radius-field)",
    "paddingInline": ".5rem",
    "paddingBlock": ".5rem",
    "textAlign": "left",
    "outlineStyle": "none",
    "backgroundColor": {
      "default": null,
      "@media (hover: hover)": {
        ":hover": "var(--bg-hover)"
      }
    },
    "boxShadow": {
      "default": null,
      ":focus-visible": "0 0 0 3px var(--ring)"
    }
  },
  "swatchColor": {
    "width": "2.25rem",
    "height": "2.25rem",
    "flexShrink": 0,
    "borderRadius": "var(--radius-field)",
    "border": "1px solid var(--border-soft)"
  },
  "tokenHeading": {
    "display": "flex",
    "alignItems": "center",
    "gap": ".375rem"
  },
  "tokenName": {
    "overflow": "hidden",
    "textOverflow": "ellipsis",
    "whiteSpace": "nowrap",
    "fontFamily": "var(--font-mono)",
    "fontSize": "13px",
    "color": "var(--fg)"
  },
  "copyConfirmation": {
    "fontFamily": "var(--font-mono)",
    "fontSize": "11px",
    "color": "var(--accent)"
  },
  "copyIcon": {
    "color": "var(--fg-subtle)",
    "opacity": 0,
    "transitionProperty": "opacity",
    "transitionDuration": "150ms",
    "transitionTimingFunction": "var(--default-transition-timing-function)"
  },
  "tokenDetails": {
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "space-between",
    "gap": ".5rem"
  },
  "tokenNote": {
    "flexShrink": 0,
    "fontSize": ".75rem",
    "lineHeight": "1rem",
    "color": "var(--fg-muted)"
  },
  "tokenValue": {
    "maxWidth": "9.5rem",
    "overflow": "hidden",
    "textOverflow": "ellipsis",
    "whiteSpace": "nowrap",
    "fontFamily": "var(--font-mono)",
    "fontSize": "11px",
    "fontVariantNumeric": "tabular-nums",
    "color": "var(--fg-subtle)"
  },
  "monospace": {
    "fontFamily": "var(--font-mono)"
  },
  "section": {
    "display": "grid",
    "gap": "1.25rem"
  },
  "colorGrid": {
    "display": "grid",
    "gap": "1rem",
    "gridTemplateColumns": {
      "default": null,
      "@media (width >= 64rem)": "repeat(2,minmax(0,1fr))"
    }
  },
  "tokenPanel": {
    "display": "grid",
    "gap": ".25rem"
  },
  "panelLabel": {
    "paddingInline": ".5rem",
    "paddingBottom": ".25rem",
    "fontFamily": "var(--font-mono)",
    "fontSize": "11px",
    "textTransform": "uppercase",
    "letterSpacing": ".025em",
    "color": "var(--fg-subtle)"
  },
  "statusPanel": {
    "display": "grid",
    "alignContent": "start",
    "gap": ".5rem"
  },
  "statusHeading": {
    "paddingInline": ".5rem",
    "fontFamily": "var(--font-mono)",
    "fontSize": "11px",
    "textTransform": "uppercase",
    "letterSpacing": ".025em",
    "color": "var(--fg-subtle)"
  },
  "statusList": {
    "display": "grid",
    "gap": ".5rem"
  },
  "statusRow": {
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "space-between",
    "gap": ".75rem",
    "borderRadius": "var(--radius-field)",
    "paddingInline": ".5rem",
    "paddingBlock": ".375rem"
  },
  "inlineLabel": {
    "display": "flex",
    "alignItems": "center",
    "gap": ".625rem"
  },
  "statusDot": {
    "width": ".875rem",
    "height": ".875rem",
    "borderRadius": "9999px"
  },
  "statusToken": {
    "fontFamily": "var(--font-mono)",
    "fontSize": "13px",
    "color": "var(--fg)"
  },
  "hint": {
    "fontSize": ".75rem",
    "lineHeight": "1rem",
    "color": "var(--fg-muted)"
  },
  "typeGrid": {
    "display": "grid",
    "gap": "1rem",
    "gridTemplateColumns": {
      "default": null,
      "@media (width >= 64rem)": "minmax(0,1.3fr) minmax(0,1fr)"
    }
  },
  "typeRow": {
    "display": "grid",
    "gridTemplateColumns": "6.5rem minmax(0,1fr)",
    "alignItems": "baseline",
    "gap": "1rem"
  },
  "specimenLabel": {
    "fontFamily": "var(--font-mono)",
    "fontSize": "11px",
    "textTransform": "uppercase",
    "letterSpacing": ".025em",
    "color": "var(--fg-subtle)"
  },
  "typeSpec": {
    "fontVariantNumeric": "tabular-nums",
    "textTransform": "none",
    "color": "color-mix(in oklab,var(--fg-subtle) 70%,transparent)"
  },
  "ledgerPanel": {
    "display": "grid",
    "alignContent": "start",
    "gap": ".75rem"
  },
  "ledgerHeading": {
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "space-between"
  },
  "bodyMuted": {
    "fontSize": ".875rem",
    "lineHeight": "1.25rem",
    "color": "var(--fg-muted)"
  },
  "shapeGrid": {
    "display": "grid",
    "gap": "1rem",
    "gridTemplateColumns": {
      "default": null,
      "@media (width >= 48rem)": "repeat(3,minmax(0,1fr))"
    }
  },
  "specimenPanel": {
    "display": "grid",
    "alignContent": "start",
    "gap": "1rem"
  },
  "shapeRow": {
    "display": "flex",
    "alignItems": "center",
    "gap": ".75rem"
  },
  "radiusSample": {
    "width": "3rem",
    "height": "3rem",
    "border": "1px solid var(--border)",
    "backgroundColor": "var(--bg-elev-2)"
  },
  "shapeDetails": {
    "display": "grid"
  },
  "body": {
    "fontSize": ".875rem",
    "lineHeight": "1.25rem",
    "color": "var(--fg)"
  },
  "radiusSpec": {
    "fontFamily": "var(--font-mono)",
    "fontSize": "11px",
    "fontVariantNumeric": "tabular-nums",
    "color": "var(--fg-subtle)"
  },
  "elevationSample": {
    "width": "3rem",
    "height": "3rem",
    "borderRadius": "var(--radius-field)",
    "backgroundColor": "var(--bg-elev)"
  },
  "elevationSpec": {
    "fontFamily": "var(--font-mono)",
    "fontSize": "11px",
    "color": "var(--fg-subtle)"
  },
  "motionSample": {
    "display": "grid",
    "gap": ".375rem"
  },
  "motionTrack": {
    "height": ".625rem",
    "width": "100%",
    "borderRadius": "9999px",
    "backgroundColor": "var(--bg-elev-2)"
  },
  "motionFill": {
    "display": "block",
    "height": "100%",
    "borderRadius": "9999px",
    "backgroundColor": "var(--accent)"
  },
  "motionSpec": {
    "fontFamily": "var(--font-mono)",
    "fontSize": "11px",
    "lineHeight": "1.25rem",
    "color": "var(--fg-subtle)"
  },
  "componentPanel": {
    "display": "grid",
    "gap": "1rem"
  },
  "buttonSamples": {
    "display": "flex",
    "flexWrap": "wrap",
    "alignItems": "center",
    "gap": ".625rem"
  },
  "badgeSamples": {
    "display": "flex",
    "flexWrap": "wrap",
    "gap": ".5rem"
  },
  "fieldSamples": {
    "display": "grid",
    "gap": "1rem",
    "gridTemplateColumns": {
      "default": null,
      "@media (width >= 48rem)": "repeat(2,minmax(0,1fr))"
    }
  },
  "overlayPanel": {
    "display": "flex",
    "flexWrap": "wrap",
    "alignItems": "center",
    "justifyContent": "space-between",
    "gap": "1rem"
  },
  "overlayActions": {
    "display": "flex",
    "gap": ".625rem"
  },
  "dialogBody": {
    "fontSize": ".875rem",
    "lineHeight": "1.5rem",
    "color": "var(--fg-muted)"
  },
  "validationLog": {
    "display": "grid",
    "gap": ".75rem",
    "padding": "1.25rem"
  },
  "validationRow": {
    "display": "flex",
    "alignItems": "center",
    "gap": ".625rem",
    "fontSize": ".875rem",
    "lineHeight": "1.25rem",
    "color": "var(--fg)"
  },
  "valid": {
    "color": "var(--success)"
  },
  "warning": {
    "color": "var(--warn)"
  },
  "ledgerRow": {
    "display": "flex",
    "alignItems": "baseline",
    "justifyContent": "space-between",
    "gap": "1rem"
  },
  "ledgerTotal": {
    "marginTop": ".25rem",
    "borderTop": "1px solid var(--border)",
    "paddingTop": ".625rem"
  },
  "ledgerAmount": {
    "fontFamily": "var(--font-mono)",
    "fontSize": ".875rem",
    "lineHeight": "1.25rem",
    "fontVariantNumeric": "tabular-nums",
    "color": "var(--fg)"
  },
  "emphasized": {
    "fontWeight": 600
  },
  "negative": {
    "color": "var(--danger)"
  },
  "specimenText": {
    "overflow": "hidden",
    "textOverflow": "ellipsis",
    "whiteSpace": "nowrap",
    "color": "var(--fg)"
  },
  "displayType": {
    "fontSize": "1.875rem",
    "lineHeight": "2.25rem",
    "fontWeight": 600,
    "letterSpacing": "-.025em"
  },
  "headingType": {
    "fontSize": "1.5rem",
    "lineHeight": "2rem",
    "fontWeight": 600,
    "letterSpacing": "-.025em"
  },
  "sectionType": {
    "fontSize": "1.125rem",
    "lineHeight": "1.75rem",
    "fontWeight": 600
  },
  "bodyType": {
    "fontSize": ".875rem",
    "lineHeight": "1.5rem"
  },
  "labelType": {
    "fontSize": ".75rem",
    "lineHeight": "1rem",
    "fontWeight": 500,
    "textTransform": "uppercase",
    "letterSpacing": ".025em",
    "color": "var(--fg-muted)"
  }
});
