import * as stylex from '@stylexjs/stylex';

export const formCommand = stylex.create({
  root: {
    display: "flex",
    minHeight: 0,
    flexDirection: "column"
  },
  searchHeader: {
    flexShrink: 0,
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderColor: "var(--border-soft)",
    padding: "0.75rem"
  },
  searchField: {
    position: "relative"
  },
  searchIcon: {
    pointerEvents: "none",
    position: "absolute",
    insetBlock: 0,
    left: "0.75rem",
    display: "flex",
    width: "1.25rem",
    alignItems: "center",
    color: "var(--fg-muted)"
  },
  searchInput: {
    height: "2.75rem",
    borderColor: "transparent",
    backgroundColor: "transparent",
    paddingLeft: "2.5rem",
    paddingRight: "3.5rem",
    boxShadow: "none"
  },
  close: {
    position: "absolute",
    right: "0.75rem",
    top: "50%",
    translate: "0 -50%",
    borderRadius: "0.25rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "var(--border)",
    paddingInline: "0.375rem",
    paddingBlock: "0.125rem",
    fontSize: "11px",
    color: "var(--fg-muted)",
    backgroundColor: {
      default: null,
      ":hover": "var(--bg-hover)"
    }
  },
  resultHeading: {
    display: "flex",
    minWidth: 0,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    paddingInline: "1.25rem",
    paddingBottom: "0.5rem",
    paddingTop: "1rem",
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: "var(--fg-muted)"
  },
  heading: {
    flexShrink: 0,
    fontWeight: 500
  },
  taxpayer: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  results: {
    height: {
      default: "10rem",
      "@media (width >= 40rem)": "14rem"
    },
    minHeight: 0,
    maxHeight: "45dvh",
    overflowY: "auto",
    paddingInline: "0.5rem",
    paddingBottom: "0.5rem"
  },
  result: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    gap: "0.75rem",
    borderRadius: "0.375rem",
    paddingInline: "0.75rem",
    paddingBlock: "0.75rem",
    textAlign: "left",
    transitionProperty: "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "150ms",
    backgroundColor: {
      default: null,
      ":hover": "var(--bg-hover)",
      ":is([aria-selected=\"true\"])": "var(--bg-hover)"
    },
    outlineWidth: {
      default: null,
      ":focus-visible": "2px"
    },
    outlineStyle: {
      default: null,
      ":focus-visible": "solid"
    },
    outlineOffset: {
      default: null,
      ":focus-visible": "-2px"
    },
    outlineColor: {
      default: null,
      ":focus-visible": "var(--accent)"
    },
    cursor: {
      default: null,
      ":disabled": "not-allowed"
    },
    opacity: {
      default: null,
      ":disabled": 0.5
    }
  },
  resultIcon: {
    display: "grid",
    width: "2.25rem",
    height: "2.25rem",
    flexShrink: 0,
    placeItems: "center",
    borderRadius: "0.375rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "var(--border)",
    backgroundColor: "var(--bg-elev)",
    color: "var(--accent)"
  },
  icon: {
    width: "1.25rem",
    height: "1.25rem"
  },
  resultText: {
    display: "grid",
    minWidth: 0,
    flex: 1,
    gap: "0.25rem"
  },
  resultTitle: {
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    fontWeight: 500
  },
  resultDescription: {
    fontSize: "0.75rem",
    lineHeight: 1.625,
    color: "var(--fg-muted)"
  },
  category: {
    display: {
      default: "none",
      "@media (width >= 40rem)": "block"
    },
    maxWidth: "7rem",
    flexShrink: 0,
    textAlign: "right",
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: "var(--fg-muted)"
  },
  empty: {
    display: "grid",
    minHeight: {
      default: "10rem",
      "@media (width >= 40rem)": "14rem"
    },
    alignContent: "center",
    gap: "0.5rem",
    padding: "1rem",
    textAlign: "center"
  },
  hint: {
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: "var(--fg-muted)"
  },
  status: {
    flexShrink: 0,
    paddingInline: "1.25rem",
    paddingBottom: "0.75rem",
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: "var(--danger)"
  },
  footer: {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderColor: "var(--border-soft)",
    backgroundColor: "var(--bg)",
    paddingInline: "0.75rem",
    paddingBlock: "0.5rem"
  },
  footerStatus: {
    display: "flex",
    minWidth: 0,
    alignItems: "center",
    gap: "0.75rem"
  },
  footerActions: {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    gap: "0.75rem"
  },
  navigationHint: {
    display: {
      default: "none",
      "@media (width >= 40rem)": "flex"
    },
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: "var(--fg-muted)"
  },
  navigationLabel: {
    marginLeft: "0.25rem"
  }
});
