import * as stylex from "@stylexjs/stylex";

export const dialogFooter = stylex.create({
  root: {
    marginTop: "calc(var(--spacing) * 5)",
    marginInline: "calc(var(--spacing) * -5)",
    marginBottom: "calc(var(--spacing) * -5)",
    display: "flex",
    flexShrink: 0,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "calc(var(--spacing) * 2)",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: "var(--border)",
    borderBottomLeftRadius: "inherit",
    borderBottomRightRadius: "inherit",
    backgroundColor: "var(--bg-elev-2)",
    padding: "calc(var(--spacing) * 5)",
  },
});
