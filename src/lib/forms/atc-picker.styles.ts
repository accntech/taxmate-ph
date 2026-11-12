import * as stylex from '@stylexjs/stylex';

export const atcPicker = stylex.create({
  field: {
    display: "grid",
    minWidth: 0,
    gap: "0.5rem"
  },
  label: {
    color: "var(--fg-muted)"
  },
  required: {
    color: "var(--danger)"
  },
  selectedLabel: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  option: {
    display: "grid",
    minWidth: 0,
    textAlign: "left"
  },
  optionHeading: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: 500
  },
  badge: {
    borderRadius: "0.25rem",
    backgroundColor: "var(--accent-soft)",
    paddingInline: "0.375rem",
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: "var(--fg-muted)"
  },
  optionDescription: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: "var(--fg-muted)"
  },
  description: {
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: "var(--fg-muted)"
  }
});
