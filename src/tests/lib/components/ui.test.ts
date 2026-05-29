import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function source(path: string): string {
	return readFileSync(join(root, path), 'utf8');
}

function sourcesUnder(path: string): string[] {
	const absolutePath = join(root, path);

	return readdirSync(absolutePath).flatMap((entry) => {
		const child = join(path, entry);
		const absoluteChild = join(root, child);

		if (statSync(absoluteChild).isDirectory()) {
			return sourcesUnder(child);
		}

		return child.endsWith('.svelte') || child.endsWith('.ts') || child.endsWith('.css')
			? [child]
			: [];
	});
}

describe('ui component primitives', () => {
	it('exports the shared Svelte UI primitives through one barrel', () => {
		const index = source('src/lib/components/ui/index.ts');

		expect(index).toContain("export * from './badge'");
		expect(index).toContain("export * from './button'");
		expect(index).toContain("export * from './card'");
		expect(index).toContain("export * from './dialog'");
		expect(index).toContain("export * from './drawer'");
		expect(index).toContain("export * from './input'");
		expect(index).toContain("export * from './page'");
		expect(index).toContain("export * from './sidebar'");
		expect(index).toContain("export * from './textarea'");
		expect(index).toContain("export * from './toggle-group'");
	});

	it('keeps snippet composition and bindable values in form controls', () => {
		const input = source('src/lib/components/ui/input/input.svelte');
		const dialog = source('src/lib/components/ui/dialog/dialog.svelte');
		const textarea = source('src/lib/components/ui/textarea/textarea.svelte');
		const toggleGroup = source('src/lib/components/ui/toggle-group/toggle-group.svelte');

		expect(input).toContain('leading?: Snippet');
		expect(input).toContain('trailing?: Snippet');
		expect(input).toContain("value = $bindable('')");
		expect(dialog).toContain('children?: Snippet');
		expect(dialog).toContain('footer?: Snippet');
		expect(textarea).toContain("value = $bindable('')");
		expect(toggleGroup).toContain('aria-pressed={pressed}');
	});

	it('routes all app styling through the native ui theme contract', () => {
		const app = source('src/app.css');
		const theme = source('src/lib/components/ui/theme.css');

		expect(app).toContain("@import './lib/components/ui/theme.css'");
		expect(theme).toContain('--color-bg: var(--bg)');
		expect(theme).toContain(":root[data-theme='dark']");
		expect(theme).toContain('--sidebar-w');
	});

	it('keeps legacy visual systems out of app surfaces', () => {
		const appSurfaceFiles = [
			'src/app.css',
			'src/routes/+layout.svelte',
			'src/routes/+page.svelte',
			'src/routes/alphalist/+page.svelte',
			'src/routes/vat-relief/+page.svelte',
			'src/routes/ebirforms/taxpayers/+page.svelte',
			'src/routes/ebirforms/taxpayers/[id]/+page.svelte',
			'src/routes/ebirforms/taxpayers/[id]/forms/+page.svelte',
			'src/routes/ebirforms/taxpayers/[id]/forms/[formCode]/+page.svelte',
			'src/lib/forms/form-1601-eq.svelte'
		];
		const bannedPatterns = [
			/codex-/,
			/color-codex/,
			/rail-/,
			/launcher-/,
			/product-card/,
			/placeholder-/,
			/planned-/,
			/desktop-rail/,
			/mobile-bottom-nav/,
			/theme-toggle/,
			/fieldkit-/,
			/home-hero/,
			/module-card/
		];

		for (const file of appSurfaceFiles) {
			const content = source(file);

			for (const pattern of bannedPatterns) {
				expect(content, `${file} should not contain ${pattern}`).not.toMatch(pattern);
			}
		}
	});

	it('keeps primitives independent from legacy app classes', () => {
		const files = sourcesUnder('src/lib/components/ui');
		const bannedPatterns = [/codex-/, /rail-/, /theme-toggle/, /[>}]x[<{]/, /[>}]v[<{]/];

		for (const file of files) {
			const content = source(file);

			for (const pattern of bannedPatterns) {
				expect(content, `${file} should not contain ${pattern}`).not.toMatch(pattern);
			}
		}
	});

	it('provides sidebar nav typing helpers', async () => {
		const { isParent } = await import('$lib/components/ui');

		expect(isParent({ label: 'Forms', children: [{ label: '1601EQ', href: '/forms' }] })).toBe(
			true
		);
		expect(isParent({ label: 'Suite', href: '/' })).toBe(false);
	});
});
