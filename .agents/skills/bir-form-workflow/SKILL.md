---
name: bir-form-workflow
description: Use when adding, changing, or reviewing a BIR form or revision in eBIRForms, including editor layout, profile autofill, validation, saved values, pagination, and PDF output.
---

# BIR Form Workflow

## Find the references

- Identify the form and revision in the source package named by the user. In the local extraction, start at `../_extracted_embedded_files/forms/` and follow assets into its sibling `img/` directory. Use the matching revision for field IDs, numbering, choices, calculations, and validation.
- For changed fields, verify the section, item number, control type, column meaning, and profile ownership against the source. Read the column headings before interpreting a field ID suffix. Adjacent fields can represent taxpayer and spouse, separate entries, or different amounts such as income and withholding.
- For print, follow the HTA’s active Print Preview handler through to the artwork and value placement. June 2013 Form 1700 uses `printme()` → `printOCR()` to overlay values on four images. Use the matching HTA output for the BIR form and the rendered 1601EQ PDF for the app’s report bands, including its source-reference and print-date footer. Start at `src/lib/printing/return-report.ts` for the bands.
- Use `src/lib/forms/form-1601-eq/` for editor precedents and `src/lib/forms/printing/form-1601-eq-print.svelte` for the print precedent. Keep a reference for each surface you change.

## Apply the change

- Match controls to field meaning. Use shared labeled checkboxes, radio groups for exclusive choices, searchable comboboxes for long code lists such as PSOC, and numeric or currency controls for counts or money. Keep computed values as plain read-only text aligned with editable amounts.
- Show profile-managed taxpayer and spouse details from the saved profile with the 1601EQ edit icon. Group TIN segments in one control where users enter them. Preserve segment positions, leading zeros, incomplete drafts, and saved filing choices.
- Preserve source sections and item numbers. Keep fields for the same item on one row at desktop widths, with one description and consistent amount columns. Use column headers for taxpayer and spouse and retain each person’s column when only the other person has an applicable amount. Match widths to expected values, use one divider per boundary, and place pagination below the form. Apply the form’s schedule and payment-detail rules.
- Review each affected toggle in both directions. Reset dependent choices when their prerequisite stops applying and preserve unrelated entries.

## Verify and show the result

- Run `bun run check`, the relevant unit tests, and targeted browser checks for affected workflows. Run `bun run test:run` when changing shared layout, field mapping, defaults, or calculations. Extend existing tests for missing regressions. Use revision-specific assertions for changed field mappings and browser assertions for toggle transitions and measurable layout constraints. Start with `tests/browser/individual-income.spec.ts` for income returns. When CI is in scope, wire these existing checks into it.
- For behavior changes, enter synthetic values through the normal editor and verify affected subtotals and totals through save, reopen, validation, and export where applicable. Exercise affected filing states and tax regimes, including single, joint with matching rates, and joint with mixed rates where supported. Check blank versus zero, avoid extra clicks for a sole applicable choice, and use a sparse older draft when merging fields.
- For layout changes, capture every affected editor page at desktop and narrow widths after overlays settle. Include populated schedules, long values, and blank and populated optional controls. Verify amount alignment, bounded inputs, single dividers, readable labels, keyboard order, overflow, and pagination. For review, supply these previews, the exercised filing states, and the affected rendered PDF pages. Resolve findings against that evidence before sign-off.
- For print changes, inspect each affected PDF page for page count and orientation, values in their boxes, clear borders, and one expected header and footer per page. Verify the native export path when changing desktop integration and state any gaps.
- Reuse the verification run to generate editor and PDF previews for the affected surfaces. Show them before reporting completion and list the checks that actually ran.
