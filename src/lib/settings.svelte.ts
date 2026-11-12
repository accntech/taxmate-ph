import { browser } from '$app/environment';
import type { SubmissionMode } from '$lib/tauri/submission';

export type ColorTheme = 'ebirforms' | 'teal' | 'catppuccin';

export type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

export type PaperSize = 'a4' | 'letter' | 'long';

export type Prefs = {
	submissionMode: SubmissionMode;
	paperSize: PaperSize;
};

const PALETTE_KEY = 'taxmate-ph-palette';
const THEME_KEY = 'taxmate-ph-theme';
const SIDEBAR_KEY = 'taxmate-ph-sidebar-collapsed';
const PREFS_KEY = 'taxmate-ph-prefs';
const LEGACY_SIDEBAR_KEY = 'taxmate-ph-sidebar';

const defaultPrefs: Prefs = {
	submissionMode: 'legacy_sftp',
	paperSize: 'long'
};

function isThemeMode(value: unknown): value is ThemeMode {
	return value === 'light' || value === 'dark' || value === 'system';
}

function isColorTheme(value: unknown): value is ColorTheme {
	return value === 'ebirforms' || value === 'teal' || value === 'catppuccin';
}

function readPreference(key: string) {
	try { return localStorage.getItem(key); } catch { return null; }
}

function savePreference(key: string, value: string | null) {
	try {
		if (value === null) localStorage.removeItem(key);
		else localStorage.setItem(key, value);
	} catch {
		// Appearance changes still work for this session when storage is unavailable.
	}
}

class SettingsStore {
	colorTheme = $state<ColorTheme>('ebirforms');
	themeMode = $state<ThemeMode>('system');
	resolvedTheme = $state<ResolvedTheme>('light');
	sidebarCollapsed = $state(false);
	prefs = $state<Prefs>({ ...defaultPrefs });

	#mq: MediaQueryList | null = null;
	#initialized = false;
	#themeFrame: number | null = null;

	init() {
		if (!browser || this.#initialized) {
			return;
		}

		this.#initialized = true;

		const storedTheme = readPreference(THEME_KEY);
		this.themeMode = isThemeMode(storedTheme) ? storedTheme : 'system';
		const storedPalette = readPreference(PALETTE_KEY);
		this.colorTheme = isColorTheme(storedPalette) ? storedPalette : 'ebirforms';

		this.#mq = window.matchMedia('(prefers-color-scheme: dark)');
		this.#mq.addEventListener('change', this.#onSystemChange);
		window.addEventListener('storage', this.#onStorageChange);
		this.#applyTheme();

		this.sidebarCollapsed = readPreference(SIDEBAR_KEY) === '1';

		try {
			const raw = readPreference(PREFS_KEY);
			if (raw) {
				const stored = JSON.parse(raw) as Partial<Prefs>;
				this.prefs = { ...defaultPrefs, ...stored, submissionMode: stored.submissionMode === 'dry_run' ? 'dry_run' : 'legacy_sftp' };
			}
		} catch {
			this.prefs = { ...defaultPrefs };
		}

		return () => {
			this.#mq?.removeEventListener('change', this.#onSystemChange);
			window.removeEventListener('storage', this.#onStorageChange);
			this.#initialized = false;
			if (this.#themeFrame !== null) cancelAnimationFrame(this.#themeFrame);
			this.#themeFrame = null;
			document.documentElement.removeAttribute('data-theme-switching');
		};
	}

	#onStorageChange = (event: StorageEvent) => {
		if (event.storageArea !== localStorage) return;
		if (event.key === THEME_KEY || event.key === null) {
			this.themeMode = isThemeMode(event.newValue) ? event.newValue : 'system';
		}
		if (event.key === PALETTE_KEY || event.key === null) {
			this.colorTheme = isColorTheme(event.newValue) ? event.newValue : 'ebirforms';
		}
		if (event.key === THEME_KEY || event.key === PALETTE_KEY || event.key === null) this.#applyTheme();
	};

	#onSystemChange = () => {
		if (this.themeMode === 'system') {
			this.#applyTheme();
		}
	};

	#resolve(): ResolvedTheme {
		if (this.themeMode === 'system') {
			return this.#mq?.matches ? 'dark' : 'light';
		}

		return this.themeMode;
	}

	#applyTheme() {
		const resolved = this.#resolve();
		this.resolvedTheme = resolved;

		const root = document.documentElement;
		const changing = root.dataset.theme !== resolved || root.dataset.palette !== this.colorTheme;
		if (changing) {
			if (this.#themeFrame !== null) cancelAnimationFrame(this.#themeFrame);
			root.setAttribute('data-theme-switching', '');
			// Cancel component color fades before replacing the shared palette.
			void root.offsetHeight;
		}
		root.dataset.palette = this.colorTheme;
		root.dataset.theme = resolved;
		root.dataset.themeMode = this.themeMode;
		root.style.colorScheme = resolved;
		if (changing) {
			this.#themeFrame = requestAnimationFrame(() => {
				this.#themeFrame = requestAnimationFrame(() => {
					root.removeAttribute('data-theme-switching');
					this.#themeFrame = null;
				});
			});
		}
	}

	setColorTheme(theme: ColorTheme) {
		this.colorTheme = theme;
		if (browser) {
			savePreference(PALETTE_KEY, theme);
			this.#applyTheme();
		}
	}

	setThemeMode(mode: ThemeMode) {
		this.themeMode = mode;

		if (browser) {
			savePreference(THEME_KEY, mode);
			this.#applyTheme();
		}
	}

	setSidebarCollapsed(value: boolean) {
		this.sidebarCollapsed = value;

		if (browser) {
			savePreference(SIDEBAR_KEY, value ? '1' : '0');
		}
	}

	updatePrefs(patch: Partial<Prefs>) {
		this.prefs = { ...this.prefs, ...patch };

		if (browser) {
			savePreference(PREFS_KEY, JSON.stringify(this.prefs));
		}
	}

	resetToDefaults() {
		if (browser) {
			for (const key of [PALETTE_KEY, THEME_KEY, SIDEBAR_KEY, PREFS_KEY, LEGACY_SIDEBAR_KEY]) {
				savePreference(key, null);
			}
		}

		this.colorTheme = 'ebirforms';
		this.themeMode = 'system';
		this.sidebarCollapsed = false;
		this.prefs = { ...defaultPrefs };

		if (browser) {
			this.#applyTheme();
		}
	}
}

export const settings = new SettingsStore();
