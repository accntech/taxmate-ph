# TaxMate Form 1701 data-entry baseline

Use **Form 1701, June 2013**, route ID `1701`, as the primary reference for
complex data entry. The current catalog defines 1,191 field IDs for this
revision, the most among ready forms. Its editor covers 12 base pages and five
conditional pages, joint taxpayer and spouse entry, linked schedule totals,
and deduction drawers. Field IDs include conditional and calculated fields.
Use the target form's own revision for field labels, eligibility, and filing rules.

## What to follow

| Interaction | Production reference and expected behavior |
| --- | --- |
| Navigate a long return | The [income editor](../../src/lib/forms/individual-income/income-editor.svelte) uses shared pagination for active pages. Keep the form number and revision explicit, and expose conditional pages when the return makes them applicable. |
| Enter taxpayer and spouse amounts | Keep each filer's label associated with their amount on desktop and in narrow windows. Preserve the item number, the column meaning, and the difference between editable inputs and calculated totals. See the [editor layout](../../src/lib/forms/individual-income/editor-layout.ts). |
| Follow a linked total to its source | Keep the [schedule reference](../../src/lib/forms/individual-income/annual-1701-references.ts) scoped to the correct item and filer. Open its page or drawer and focus the intended field or result. |
| Edit a schedule item | Follow the income editor's existing inline or `Sheet` interaction. Preserve the drawer's local draft, validation, commit, and cancel behavior. Use [1702-MX](../../src/lib/forms/corporate-income/mixed/index.ts) for repeatable whole-activity attachments. |
| Save and reopen | Keep the [return editor's](../../src/routes/ebirforms/taxpayers/%5Bid%5D/forms/%5BformCode%5D/+page.svelte) **Save draft** boundary. Check that the correct taxpayer and spouse values and applicable schedules survive reopening. |

## Check a change

Run `bun run verify:1701` from the repository root after installing
dependencies and Playwright Chromium. It runs Svelte diagnostics, annual
form and schedule reference unit tests, and selected June 2013 cases from
[Form 1701 layout](../../tests/browser/form-1701-layout.spec.ts), including
joint-filer label wrapping on all 17 expanded pages at 320px and 390px.
For visual changes, compare the affected form pages in matching single- and
joint-filer states at desktop and narrow widths. Check filer labels, focus
destinations, amount columns, and pagination on conditional pages.

Short joint-filer citations such as “From Item 67A · Taxpayer” should fit within
two lines, with the item number and filer name each kept intact. To rerun only
the wrapping checks while adjusting schedule-reference styling, use the command
below.

```sh
bun run test:browser tests/browser/form-1701-layout.spec.ts --grep '1701 joint (320|390)px reference owners'
```
