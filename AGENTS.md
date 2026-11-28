# Repository Instructions

## TaxMate design and architecture

- For UI or interaction changes, read [DESIGN.md](DESIGN.md) and inspect the closest production screen before editing. Use its component, layout, and interaction patterns as the reference.
- For workflow, application boundary, or setup changes, use the [TaxMate implementation guide](docs/verification/taxmate-implementation-guide.md). Run the affected workflow checks and report the reference, reused code, results, and any intentional departures.

## BIR Forms

- For any BIR form addition or change, load [.agents/skills/bir-form-workflow/SKILL.md](.agents/skills/bir-form-workflow/SKILL.md).
- For complex BIR data-entry patterns, use the [June 2013 Form 1701 baseline](docs/verification/1701-baseline.md). Run `bun run verify:1701` when changing that editor or a shared interaction it exercises.

## Git
- Never auto-commit. Even when told to "commit changes", surface the proposed grouping and
  messages, then wait for approval before running `git commit`. Staging is fine.
- Commit subject must be 65 characters or fewer. If more detail is needed, put it in the body
  after a blank line.
- Use Conventional Commits format: `<type>(<scope>): <description>`.
- Commit type must be lowercase: `feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `test`,
  `perf`, `build`, `ci`, or `revert`.
- Scope is optional but preferred, for example `pdf` or `tauri`.
- Description must be lowercase imperative, for example `add`, `fix`, or `extract`; do not use
  past-tense forms like `added` or third-person forms like `adds`.
- Do not end commit subjects with a period.
- For breaking changes, use `!` before the colon, for example `feat(api)!: update contract`, and
  add a `BREAKING CHANGE:` footer.
- Run `bun run check` before every commit. Block on any error and surface failures instead of
  committing broken code.
- In a worktree, defer commits until implementation is complete. Do not create per-task commits
  during work; surface the full grouping at the end.
- Warn before committing throwaway files such as seed scripts, one-off migration helpers, ad-hoc
  debug scripts, scratch fixtures, or similar single-use artifacts. Recommend deleting or
  ignoring them unless the user explicitly confirms they should be committed.
- When merging worktree branches into `main`, keep history linear and author-date-ordered. Use
  fast-forward merges or cherry-picks, not merge commits.

## Code Style
- Use kebab-case for TypeScript and Svelte filenames.
