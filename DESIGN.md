# TaxMate design decisions

TaxMate is a desktop workspace for preparing and managing tax returns. Use the
current production screens as the reference for new work. Match the user's
task, the scope of the edit, and when it takes effect.

## Choose the reference before editing

1. Open the closest production route. Trace its shared components and styles,
   then check the workflow from entry to validation, save or cancel, and the
   resulting screen and focus.
2. Reuse the existing domain component when it serves the same task. Otherwise,
   compose the public [TaxMate UI adapters](src/lib/components/ui/README.md).
   Extend a shared component when the same behavior belongs to multiple callers.
3. Preserve the reference's behavior unless the task changes it. If two screens
   differ, use the one with the same data ownership and save behavior. Check the
   [audited UX decisions](docs/verification/taxmate-implementation-guide.md#audited-ux-decisions)
   for a settled precedent and cite it in the handoff.

## Match the surface

| Task | Production reference and pattern |
| --- | --- |
| Navigate the app | The [root layout](src/routes/+layout.svelte) composes `WindowTitlebar`, `Sidebar`, and `Topbar` using the [app navigation model](src/lib/apps/app-shell.ts). Preserve breadcrumbs, sidebar behavior, and space for native window controls. |
| Find or manage records | [Taxpayers](src/routes/ebirforms/taxpayers/+page.svelte) and [Tax Returns](src/routes/ebirforms/taxpayers/%5Bid%5D/forms/+page.svelte) compose `Page` and [RecordTable](src/lib/ebirforms/record-table.svelte). Match the search, filters, row actions, and loading, empty, and error states to the record workflow. |
| Edit a complete record | Use a `Page` with its own navigation and actions, as in the [return editor](src/routes/ebirforms/taxpayers/%5Bid%5D/forms/%5BformCode%5D/+page.svelte). |
| Make a focused choice or confirm an action | Use `Dialog`. [Tax Returns](src/routes/ebirforms/taxpayers/%5Bid%5D/forms/+page.svelte) uses it with `FormCommand` to choose a form and adapts the chooser to narrow windows. [Taxpayers](src/routes/ebirforms/taxpayers/+page.svelte) provides the reference for confirming deletion. |
| Edit one child item in its parent | Use a `Sheet` for a self-contained record, as in the [Form 1701 deduction editor](src/lib/forms/individual-income/income-editor.svelte). Match draft isolation, focus return, and the outer save boundary to the audited flow. Follow the reference schedule when it uses inline entry. |
| Choose or look up a field value | Follow the [income editor](src/lib/forms/individual-income/income-editor.svelte) for `Select` on compact fixed choices and `RadioGroup` when options should stay visible. Use the domain picker for searchable codes, such as [`AtcPicker`](src/lib/forms/atc-picker.svelte), or the public `Combobox` adapter as in the [taxpayer profile editor](src/lib/ebirforms/taxpayer-profile-editor.svelte). |
| Present a complex BIR form | Use [Form 1701, June 2013](docs/verification/1701-baseline.md) and the [shared paper layout](src/lib/forms/form-editor-layout.css) for numbered fields, taxpayer and spouse columns, read-only totals, pagination, and linked schedules. Use the target form's own revision for labels, item numbers, and applicable choices. |

## Use the existing visual system

- Style the change with the target's StyleX or shared CSS conventions. Use
  [theme tokens](src/lib/components/ui/theme.css) for surfaces, borders, text,
  status, and focus, and the [shared scales](src/lib/components/ui/styles/scales.css)
  for spacing and sizing. Keep the [application CSS layer order](src/app.css).
- Follow the existing type roles. Use the application sans font for UI text,
  the serif token where the reference screen uses it for headings, and the
  mono token for numeric and identifier surfaces that already use it. Use
  the application field adapters to retain string currency and leading zeros.
- Preserve keyboard focus indicators, accessible names, and visible status
  feedback. Compare changed screens in the relevant light and dark appearance
  modes and at desktop and narrow window widths. The reference's spacing,
  readable labels, and resulting focus should hold in equivalent states.

Run the [local checks for the affected workflow](docs/verification/taxmate-implementation-guide.md#verify-locally)
and report the reference, components reused, checks run, and intentional
departures.
