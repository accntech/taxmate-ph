import * as stylex from "@stylexjs/stylex";

export const deletionProgress = stylex.create({
  root: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "calc(var(--spacing) * 2)",
    padding: "calc(var(--spacing) * 2) calc(var(--spacing) * 3)",
    marginBottom: "calc(var(--spacing) * 3)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "var(--border)",
    borderRadius: "var(--radius-md)",
    backgroundColor: "var(--bg-elev)",
    color: "var(--fg-muted)",
    fontSize: "13px",
  },
});
