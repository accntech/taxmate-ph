import * as stylex from "@stylexjs/stylex";

export const toastItem = stylex.create({
  badge: {
    marginTop: "calc(var(--spacing) * 3.5)",
    marginLeft: "calc(var(--spacing) * 3.5)",
    display: "flex",
    width: "calc(var(--spacing) * 7)",
    height: "calc(var(--spacing) * 7)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--radius-md)",
  },
  successBadge: {
    backgroundColor: "var(--success-soft)",
    color: "var(--success)",
  },
  infoBadge: {
    backgroundColor: "var(--info-soft)",
    color: "var(--info)",
  },
  warningBadge: {
    backgroundColor: "var(--warn-soft)",
    color: "var(--warn)",
  },
  errorBadge: {
    backgroundColor: "var(--danger-soft)",
    color: "var(--danger)",
  },
  icon: {
    width: "calc(var(--spacing) * 4.5)",
    height: "calc(var(--spacing) * 4.5)",
  },
  copy: {
    minWidth: "0px",
    paddingBlock: "calc(var(--spacing) * 3.5)",
  },
  heading: {
    fontSize: "10px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    "--sx-tracking": "0.08em",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  successHeading: {
    color: "var(--success)",
  },
  infoHeading: {
    color: "var(--info)",
  },
  warningHeading: {
    color: "var(--warn)",
  },
  errorHeading: {
    color: "var(--danger)",
  },
  message: {
    marginTop: "calc(var(--spacing) * 0.5)",
    fontSize: "13px",
    "--sx-leading": "calc(var(--spacing) * 5)",
    lineHeight: "calc(var(--spacing) * 5)",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    textWrap: "pretty",
    overflowWrap: "break-word",
  },
  description: {
    marginTop: "var(--spacing)",
    fontSize: "var(--text-xs)",
    lineHeight: "calc(var(--spacing) * 4.5)",
    "--sx-leading": "calc(var(--spacing) * 4.5)",
    textWrap: "pretty",
    overflowWrap: "break-word",
    color: "var(--fg-muted)",
  },
  dismissButton: {
    display: "flex",
    width: "calc(var(--spacing) * 11)",
    height: "calc(var(--spacing) * 11)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    borderBottomLeftRadius: "var(--radius-xl)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    color: {
      default: "var(--fg-subtle)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    transitionProperty:
      "background-color,border-color,color,box-shadow,transform",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "150ms",
    "--sx-duration": "150ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    backgroundColor: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
    },
    "--sx-shadow": {
      default: null,
      ":focus-visible":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 18%,transparent))",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
    scale: {
      default: null,
      ":active": "0.97",
      "@media (prefers-reduced-motion: reduce)": {
        default: null,
        ":active": "var(--sx-scale-x) var(--sx-scale-y)",
      },
    },
    "--sx-scale-x": {
      default: null,
      "@media (prefers-reduced-motion: reduce)": {
        default: null,
        ":active": "100%",
      },
    },
    "--sx-scale-y": {
      default: null,
      "@media (prefers-reduced-motion: reduce)": {
        default: null,
        ":active": "100%",
      },
    },
    "--sx-scale-z": {
      default: null,
      "@media (prefers-reduced-motion: reduce)": {
        default: null,
        ":active": "100%",
      },
    },
  },
  dismissIcon: {
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
  },
  progressTrack: {
    position: "absolute",
    insetInline: "0px",
    bottom: "0px",
    height: "calc(var(--spacing) * 0.5)",
    transformOrigin: "0",
  },
  progress: {
    display: "block",
    height: "100%",
    width: "100%",
  },
  successProgress: {
    backgroundColor: "var(--success)",
  },
  infoProgress: {
    backgroundColor: "var(--info)",
  },
  warningProgress: {
    backgroundColor: "var(--warn)",
  },
});
