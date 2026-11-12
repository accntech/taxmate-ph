import * as stylex from "@stylexjs/stylex";

export const listToolbar = stylex.create({
  root: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: {
      default: "calc(var(--spacing) * 2)",
      "@media (width >= 48rem)": "calc(var(--spacing) * 2.5)",
    },
    padding: {
      default: "calc(var(--spacing) * 2.5)",
      "@media (width >= 48rem)": "calc(var(--spacing) * 3)",
    },
  },
  queryControls: {
    minWidth: "0px",
    display: {
      default: null,
      "@media (width < 48rem)": "contents",
      "@media (width >= 48rem)": "flex",
    },
    flex: {
      default: null,
      "@media (width >= 48rem)": "1",
    },
    flexWrap: {
      default: null,
      "@media (width >= 48rem)": "wrap",
    },
    gap: {
      default: null,
      "@media (width >= 48rem)": "calc(var(--spacing) * 2.5)",
    },
  },
  search: {
    order: {
      default: null,
      "@media (width < 48rem)": "1",
    },
    minWidth: {
      default: null,
      "@media (width < 48rem)": "0px",
    },
    flex: {
      default: null,
      "@media (width < 48rem)": "1",
    },
  },
  chips: {
    order: {
      default: null,
      "@media (width < 48rem)": "5",
    },
    display: {
      default: null,
      "@media (width < 48rem)": "flex",
      "@media (width >= 48rem)": "contents",
    },
    flexBasis: {
      default: null,
      "@media (width < 48rem)": "100%",
    },
    scrollbarWidth: {
      default: null,
      "@media (width < 48rem)": "none",
    },
    flexWrap: {
      default: null,
      "@media (width < 48rem)": "nowrap",
    },
    alignItems: {
      default: null,
      "@media (width < 48rem)": "center",
    },
    gap: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 2)",
    },
    overflowX: {
      default: null,
      "@media (width < 48rem)": "auto",
    },
    "::-webkit-scrollbar": {
      display: {
        default: null,
        "@media (width < 48rem)": "none",
      },
    },
  },
  filters: {
    order: {
      default: null,
      "@media (width < 48rem)": "2",
    },
    display: {
      default: null,
      "@media (width >= 48rem)": "contents",
    },
  },
  actions: {
    display: {
      default: null,
      "@media (width < 48rem)": "contents",
      "@media (width >= 48rem)": "flex",
    },
    marginLeft: {
      default: null,
      "@media (width >= 48rem)": "auto",
    },
    alignItems: {
      default: null,
      "@media (width >= 48rem)": "center",
    },
    gap: {
      default: null,
      "@media (width >= 48rem)": "calc(var(--spacing) * 2)",
    },
  },
  viewControls: {
    display: {
      default: "contents",
      "@media (width < 48rem)": "none",
    },
  },
});
