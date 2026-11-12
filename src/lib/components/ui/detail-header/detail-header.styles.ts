import * as stylex from "@stylexjs/stylex";

export const detailHeader = stylex.create({
  root: {
    position: "sticky",
    top: "0px",
    zIndex: 10,
    flex: "none",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    borderColor: "var(--border-soft)",
    backgroundColor: "var(--bg-elev)",
    padding: "calc(var(--spacing) * 5)",
    paddingRight: "calc(var(--spacing) * 12)",
  },
  summary: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "calc(var(--spacing) * 3.5)",
  },
  heading: {
    display: "flex",
    minWidth: "0px",
    flex: "1",
    flexDirection: "column",
    gap: "calc(var(--spacing) * 1.5)",
  },
  subtitle: {
    fontFamily: "var(--font-mono)",
    fontSize: "10.5px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    "--sx-tracking": "0.06em",
    letterSpacing: "0.06em",
    color: "var(--fg-subtle)",
    textTransform: "uppercase",
  },
  title: {
    fontSize: "var(--text-lg)",
    lineHeight: "var(--sx-leading, var(--text-lg--line-height))",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    overflowWrap: "anywhere",
    color: "var(--fg)",
  },
});
