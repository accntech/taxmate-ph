# TaxMate implementation guide

## Before editing

1. Open the closest production route and follow its shared components, styles,
   state, and tests. Use the analogous user workflow as the reference. For
   example, use Taxpayers for a taxpayer list and Tax Returns for a return list.
2. Identify the requested change and the existing behavior it needs to preserve.
   Compare any proposed rule or design with the production entry point, its
   callers, and its tests. For form rules, trace draft inputs through calculation,
   validation, and the affected output formats. Check for duplicate decisions at
   those boundaries and compare results using the same fixture.
3. Flag a rule that conflicts with code or tests, including the exact references,
   user impact, and which source should change. Preserve the working behavior
   while resolving the conflict. Confirm intent when resolution requires a new
   user workflow, architecture, or build setup.

## Design reference

Use [DESIGN.md](../../DESIGN.md) for component selection, visual conventions,
and production screen references. Match those decisions to the workflow and
checks below.

## Audited UX decisions

Use the reference for the interaction named in each row. Keep each form's
field labels, available choices, eligibility, and filing rules.

| Flow | Behavior to preserve | Reference screen | Local check |
| --- | --- | --- | --- |
| Open a taxpayer | Resolve the requested taxpayer ID before showing the identity or record actions. Show **Taxpayer not found** for a missing ID. Show a load error with **Retry** when profiles could not be read. | [Tax Returns](../../src/routes/ebirforms/taxpayers/%5Bid%5D/forms/+page.svelte) for record matching. [Taxpayers](../../src/routes/ebirforms/taxpayers/+page.svelte) for load errors and Retry. | [Record workflow](../../tests/browser/record-workflow-consistency.spec.ts) |
| Correct a taxpayer profile from a return | Return to the same new or saved return after profile Save or Cancel. Preserve unsaved return inputs in the current session. After Save, refresh only the profile-managed fields for the original taxpayer. A different TIN must never replace that return's identity. Persist the working return through **Save draft**. | [Return editor → Edit taxpayer information](../../src/routes/ebirforms/taxpayers/%5Bid%5D/forms/%5BformCode%5D/+page.svelte) for resuming the return. [Edit taxpayer](../../src/lib/ebirforms/taxpayer-profile-editor.svelte) for profile persistence. | [Record workflow](../../tests/browser/record-workflow-consistency.spec.ts), [explicit save](../../tests/browser/explicit-save.spec.ts) |
| Leave an editor while saving | Show pending feedback and disable conflicting actions. Guard app and browser navigation until the write finishes so a late completion cannot redirect the user from another screen. | [Return editor → Save draft](../../src/routes/ebirforms/taxpayers/%5Bid%5D/forms/%5BformCode%5D/+page.svelte) for the navigation guard. [Edit taxpayer](../../src/lib/ebirforms/taxpayer-profile-editor.svelte) for **Saving…**. | [Record workflow](../../tests/browser/record-workflow-consistency.spec.ts) |
| Permanently delete a record | Confirm the affected record and explain what will be kept. During **Deleting…**, disable Cancel and block Escape and backdrop dismissal. If the write fails, announce the error in the dialog and leave the record available for retry. Deleting a working return keeps its submission history. | [Taxpayers → Delete taxpayer](../../src/routes/ebirforms/taxpayers/+page.svelte) | [Record workflow](../../tests/browser/record-workflow-consistency.spec.ts), [table actions](../../tests/browser/form-table-actions.spec.ts). When changing error handling, also simulate a rejected write and verify the dialog stays open, the record remains, and retry works. |
| Archive, restore, or edit a list row | Name the record in announced archive and restore feedback. Keep **Undo archive** available after a successful archive and surface storage errors. Give each **Edit** link a record-specific accessible name. Return links identify the BIR form and period. | [Taxpayers list](../../src/routes/ebirforms/taxpayers/+page.svelte) for feedback and accessible naming. | [Record workflow](../../tests/browser/record-workflow-consistency.spec.ts), [table actions](../../tests/browser/form-table-actions.spec.ts) |
| Toggle **Amended return?** | Keep the previous remittance in the working draft when users switch to **No**. Exclude it from calculations and applicable outputs while inactive. Restore the entered amount when users switch back to **Yes**. | [1601-EQ → Remittances and credits](../../src/lib/forms/form-1601-eq/form-1601-eq-editor.svelte) | [0619-E/F controls](../../tests/browser/specialized-return-controls.spec.ts), [revised 1601-C](../../tests/browser/withholding-paper-layout.spec.ts) |
| Choose an over-remittance disposition | Use visible radios for the applicable options. Clear the choice once the balance no longer qualifies and require a fresh choice when it qualifies again. Preserve exclusions such as 1601-EQ's fourth-quarter carry-over rule. | [1606 editor](../../src/lib/forms/withholding-editor.svelte) for the fresh-choice behavior. [1601-EQ editor](../../src/lib/forms/form-1601-eq/form-1601-eq-editor.svelte) for quarter-specific options. | [Return field choices](../../tests/browser/return-field-choices.spec.ts), [1606](../../tests/browser/withholding-paper-layout.spec.ts) |
| Edit or remove a child row | Use a `Sheet` with local edits until **Add** or **Update**. Cancel keeps parent values and totals intact. After removal, offer **Undo** while the removal is still applicable. Restore the row and totals, keep unrelated edits, and return focus to the restored row. The parent **Save draft** persists the return. | [Form 1701 deduction drawers](../../src/lib/forms/individual-income/income-editor.svelte) for entry and cancel. [1601-EQ ATC line items](../../src/lib/forms/form-1601-eq/line-items.svelte) for Undo. | [1601-EQ line items](../../tests/browser/1601eq-line-items.spec.ts), [corporate drawers](../../tests/browser/corporate-record-drawers.spec.ts), [individual drawers](../../tests/browser/individual-record-drawers.spec.ts) |
| Choose one setting | Use one named radio group with a single selected value and arrow-key navigation. **Sending mode** retains its compact layout and applies the persisted preference to the return action after reload. | [Settings → Color mode](../../src/routes/settings/+page.svelte) for exclusive-choice behavior. | [Sending preferences](../../tests/browser/submission-settings.spec.ts) |
| Open an empty withholding schedule | Find **No items added** within the named schedule and verify there is no extra divider above the totals at desktop and narrow widths. | [1602-Q → Schedule 1](../../src/lib/forms/schedule-items.svelte) | [Withholding line items](../../tests/browser/withholding-line-items.spec.ts) |

## Preserve the existing boundaries

| Responsibility | Existing owner |
| --- | --- |
| Routing and interaction | `src/routes` composes screens. The return editor route owns navigation, save, and discard, and passes edits to the [eBIRForms workspace](../../src/lib/ebirforms/ebirforms-workspace.svelte.ts). |
| Form definitions and business rules | [`src/lib/forms`](../../src/lib/forms) holds form definitions and family-specific calculations and validation. The [form runtime](../../src/lib/forms/form-runtime.ts) dispatches shared operations. Use the same rules for editing and downstream output. |
| Persistence and desktop commands | The workspace chooses between browser storage and desktop persistence. Use the typed clients in [`src/lib/tauri`](../../src/lib/tauri) for TaxMate's desktop commands. Native storage, PDF export, and submission live under [`src-tauri/src`](../../src-tauri/src). Preserve the existing record format and browser fallback when changing shared workflows. |
| Build and application setup | Keep the [SvelteKit static SPA](../../svelte.config.js), [Vite and StyleX pipeline](../../vite.config.js), and Tauri desktop entry points. Use the [existing Bun scripts](../../package.json) for development and verification. |

## Verify locally

- Run `bun run check` and the tests for the changed workflow. Start with
  `breadcrumbs.spec.ts` for navigation, `taxpayer-layout.spec.ts` for profile
  layout, `appearance-settings.spec.ts` for appearance, and
  `explicit-save.spec.ts` for return persistence under `tests/browser`.
- For the complex form reference, run `bun run verify:1701` for type checking,
  annual form unit tests, and June 2013 browser workflows. Use the
  [Form 1701 baseline](1701-baseline.md) and [DESIGN.md](../../DESIGN.md) for
  component choices and visual comparisons.
- From the repository root, run the command for each affected audited flow.
  These Playwright specs use synthetic records and can stub desktop writes.

  ```sh
  # Record identity, profile correction, deletion, archive, and explicit save
  bun run test:browser tests/browser/record-workflow-consistency.spec.ts tests/browser/form-table-actions.spec.ts tests/browser/explicit-save.spec.ts

  # Amendment and over-remittance
  bun run test:browser tests/browser/specialized-return-controls.spec.ts tests/browser/return-field-choices.spec.ts
  bun run test:browser tests/browser/withholding-paper-layout.spec.ts --grep 'overremittance choices|revised 1601C'

  # Child rows, Settings, and empty schedules
  bun run test:browser tests/browser/1601eq-line-items.spec.ts tests/browser/corporate-record-drawers.spec.ts tests/browser/individual-record-drawers.spec.ts
  bun run test:browser tests/browser/submission-settings.spec.ts
  bun run test:browser tests/browser/withholding-line-items.spec.ts --grep 'empty schedule has no extra divider'
  ```

- For changed visuals, open the real route with synthetic records and compare
  equivalent screen states at desktop and narrow widths. Check the relevant
  themes and keyboard behavior. For changes to desktop commands, exercise the
  native call in Tauri and report which runtime you tested.
- In the handoff, cite the production reference, the shared code reused, the
  checks that ran, and any remaining discrepancy or verification gap.
