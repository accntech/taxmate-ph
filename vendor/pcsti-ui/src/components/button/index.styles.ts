import * as stylex from "@stylexjs/stylex";

export const button = stylex.create({
  root: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.375rem",
    borderRadius: "var(--radius-md)",
    borderWidth: "1px",
    borderStyle: "solid",
    fontWeight: 500,
    outline: "none",
    transitionProperty:
      "transform,background-color,border-color,color,box-shadow,opacity",
    transitionDuration: "160ms",
    transitionTimingFunction: "var(--ease-out)",
    scale: { default: null, ":active": "0.97" },
    pointerEvents: { default: null, ":disabled": "none" },
    opacity: { default: null, ":disabled": 0.6 },
  },
  normal: {
    minHeight: "2.25rem",
    paddingInline: "0.875rem",
    paddingBlock: "0.375rem",
    fontSize: "13px",
  },
  compact: {
    minHeight: "1.875rem",
    paddingInline: "0.625rem",
    paddingBlock: "0.25rem",
    fontSize: "12.5px",
  },
  icon: { width: "2rem", height: "2rem", padding: 0 },
  iconSmall: { width: "1.875rem", height: "1.875rem", padding: 0 },
  primary: {
    borderColor: {
      default: "var(--primary)",
      ":hover": "var(--primary-hover)",
    },
    backgroundColor: {
      default: "var(--primary)",
      ":hover": "var(--primary-hover)",
    },
    color: "var(--primary-fg)",
    boxShadow: {
      default: null,
      ":focus-visible":
        "0 0 0 3px color-mix(in oklch, var(--primary) 35%, transparent)",
    },
  },
  accent: {
    borderColor: { default: "var(--accent)", ":hover": "var(--accent-hover)" },
    backgroundColor: {
      default: "var(--accent)",
      ":hover": "var(--accent-hover)",
    },
    color: "var(--accent-fg)",
    boxShadow: {
      default: null,
      ":focus-visible":
        "0 0 0 3px color-mix(in oklch, var(--accent) 35%, transparent)",
    },
  },
  destructive: {
    borderColor: "var(--danger)",
    backgroundColor: {
      default: "var(--danger)",
      ":hover": "color-mix(in oklch, var(--danger) 85%, black)",
    },
    color: "white",
    boxShadow: {
      default: null,
      ":focus-visible":
        "0 0 0 3px color-mix(in oklch, var(--danger) 45%, transparent)",
    },
  },
  destructiveGhost: {
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch, var(--danger) 60%, var(--border))",
    },
    backgroundColor: { default: "transparent", ":hover": "var(--danger-soft)" },
    color: "var(--danger)",
    boxShadow: {
      default: null,
      ":focus-visible":
        "0 0 0 3px color-mix(in oklch, var(--danger) 18%, transparent)",
    },
  },
  destructiveOutlined: {
    borderColor: {
      default: "color-mix(in oklch, var(--danger) 35%, var(--border))",
      ":focus-visible": "color-mix(in oklch, var(--danger) 60%, var(--border))",
    },
    backgroundColor: {
      default: "var(--bg-elev)",
      ":hover": "var(--danger-soft)",
    },
    color: "var(--danger)",
    boxShadow: {
      default: null,
      ":focus-visible":
        "0 0 0 3px color-mix(in oklch, var(--danger) 18%, transparent)",
    },
  },
  primarySoft: {
    borderColor: {
      default: "transparent",
      ":focus-visible":
        "color-mix(in oklch, var(--primary) 60%, var(--border))",
    },
    backgroundColor: {
      default: "var(--primary-soft)",
      "@media (hover: hover)": {
        default: null,
        ":hover":
          "color-mix(in oklch, var(--primary) 10%, var(--primary-soft))",
      },
    },
    color: "color-mix(in oklab, var(--primary) 80%, var(--fg))",
    boxShadow: {
      default: null,
      ":focus-visible":
        "0 0 0 3px color-mix(in oklch, var(--primary) 18%, transparent)",
    },
    transitionProperty:
      "background-color,border-color,color,box-shadow,opacity,transform",
  },
  accentSoft: {
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch, var(--accent) 60%, var(--border))",
    },
    backgroundColor: {
      default: "var(--accent-soft)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "color-mix(in oklch, var(--accent) 10%, var(--accent-soft))",
      },
    },
    color: "color-mix(in oklab, var(--accent) 80%, var(--fg))",
    boxShadow: {
      default: null,
      ":focus-visible":
        "0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent)",
    },
    transitionProperty:
      "background-color,border-color,color,box-shadow,opacity,transform",
  },
  destructiveSoft: {
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch, var(--danger) 60%, var(--border))",
    },
    backgroundColor: {
      default: "var(--destructive-button-bg, var(--danger-soft))",
      "@media (hover: hover)": {
        default: null,
        ":hover":
          "var(--destructive-button-hover-bg, color-mix(in oklch, var(--danger) 10%, var(--danger-soft)))",
      },
    },
    color:
      "var(--destructive-button-fg, color-mix(in oklab, var(--danger) 80%, var(--fg)))",
    boxShadow: {
      default: null,
      ":focus-visible":
        "0 0 0 3px color-mix(in oklch, var(--danger) 18%, transparent)",
    },
    transitionProperty:
      "background-color,border-color,color,box-shadow,opacity,transform",
  },
  successSoft: {
    borderColor: {
      default: "transparent",
      ":focus-visible":
        "color-mix(in oklch, var(--success) 60%, var(--border))",
    },
    backgroundColor: {
      default: "var(--success-soft)",
      "@media (hover: hover)": {
        default: null,
        ":hover":
          "color-mix(in oklch, var(--success) 10%, var(--success-soft))",
      },
    },
    color: "color-mix(in oklab, var(--success) 80%, var(--fg))",
    boxShadow: {
      default: null,
      ":focus-visible":
        "0 0 0 3px color-mix(in oklch, var(--success) 18%, transparent)",
    },
    transitionProperty:
      "background-color,border-color,color,box-shadow,opacity,transform",
  },
  outlined: {
    borderColor: {
      default: "var(--border)",
      ":focus-visible": "color-mix(in oklch, var(--accent) 60%, var(--border))",
    },
    backgroundColor: { default: "var(--bg-elev)", ":hover": "var(--bg-hover)" },
    color: "var(--fg)",
    boxShadow: {
      default: null,
      ":focus-visible":
        "0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent)",
    },
  },
  ghost: {
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch, var(--accent) 60%, var(--border))",
    },
    backgroundColor: { default: "transparent", ":hover": "var(--bg-hover)" },
    color: { default: "var(--fg-muted)", ":hover": "var(--fg)" },
    boxShadow: {
      default: null,
      ":focus-visible":
        "0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent)",
    },
  },
});
