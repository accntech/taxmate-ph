import { browser } from '$app/environment';

export type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

export type PaperSize = 'a4' | 'letter' | 'long';
export type FilingPeriod = 'monthly' | 'quarterly' | 'annual';

export type Prefs = {
	paperSize: PaperSize;
	filingPeriod: FilingPeriod;
	defaultTaxpayer: string;
};

const THEME_KEY = 'taxmate-ph-theme';
const SIDEBAR_KEY = 'taxmate-ph-sidebar-collapsed';
const PREFS_KEY = 'taxmate-ph-prefs';
const LEGACY_SIDEBAR_KEY = 'taxmate-ph-sidebar';

const defaultPrefs: Prefs = {
	paperSize: 'long',
	filingPeriod: 'quarterly',
	defaultTaxpayer: ''
};

function isThemeMode(value: unknown): value is ThemeMode {
	return value === 'light' || value === 'dark' || value === 'system';
}

class SettingsStore {
	themeMode = $state<ThemeMode>('system');
	resolvedTheme = $state<ResolvedTheme>('light');
	sidebarCollapsed = $state(false);
	prefs = $state<Prefs>({ ...defaultPrefs });

	#mq: MediaQueryList | null = null;
	#initialized = false;

	init() {
		if (!browser || this.#initialized) {
			return;
		}

		this.#initialized = true;

		const storedTheme = localStorage.getItem(THEME_KEY);
		this.themeMode = isThemeMode(storedTheme) ? storedTheme : 'system';

		this.#mq = window.matchMedia('(prefers-color-scheme: dark)');
		this.#mq.addEventListener('change', this.#onSystemChange);
		this.#applyTheme();

		this.sidebarCollapsed = localStorage.getItem(SIDEBAR_KEY) === '1';

		try {
			const raw = localStorage.getItem(PREFS_KEY);
			if (raw) {
				this.prefs = { ...defaultPrefs, ...(JSON.parse(raw) as Partial<Prefs>) };
			}
		} catch {
			this.prefs = { ...defaultPrefs };
		}

		return () => this.#mq?.removeEventListener('change', this.#onSystemChange);
	}

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
		root.dataset.theme = resolved;
		root.dataset.themeMode = this.themeMode;
		root.style.colorScheme = resolved;
	}

	setThemeMode(mode: ThemeMode) {
		this.themeMode = mode;

		if (browser) {
			localStorage.setItem(THEME_KEY, mode);
			this.#applyTheme();
		}
	}

	setSidebarCollapsed(value: boolean) {
		this.sidebarCollapsed = value;

		if (browser) {
			localStorage.setItem(SIDEBAR_KEY, value ? '1' : '0');
		}
	}

	updatePrefs(patch: Partial<Prefs>) {
		this.prefs = { ...this.prefs, ...patch };

		if (browser) {
			localStorage.setItem(PREFS_KEY, JSON.stringify(this.prefs));
		}
	}

	resetToDefaults() {
		if (browser) {
			for (const key of [THEME_KEY, SIDEBAR_KEY, PREFS_KEY, LEGACY_SIDEBAR_KEY]) {
				localStorage.removeItem(key);
			}
		}

		this.themeMode = 'system';
		this.sidebarCollapsed = false;
		this.prefs = { ...defaultPrefs };

		if (browser) {
			this.#applyTheme();
		}
	}
}

export const settings = new SettingsStore();
