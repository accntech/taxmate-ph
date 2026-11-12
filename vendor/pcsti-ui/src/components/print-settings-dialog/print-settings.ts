export type PaperSize = "A4" | "Letter" | "Long";
export type Margin = "None" | "Narrow" | "Normal" | "Wide";
export type Orientation = "portrait" | "landscape";

export type PrintSettings = {
  paperSize: PaperSize;
  margin: Margin;
  orientation: Orientation;
};

export const PAPER_SIZES: PaperSize[] = ["A4", "Letter", "Long"];
export const MARGINS: Margin[] = ["None", "Narrow", "Normal", "Wide"];
export const ORIENTATIONS: Orientation[] = ["portrait", "landscape"];

export const DEFAULT_PRINT_SETTINGS: PrintSettings = {
  paperSize: "A4",
  margin: "Normal",
  orientation: "portrait",
};

const STORAGE_KEY = "pcsti-print-settings";

function readSettings(settingsKey?: string): Partial<PrintSettings> | null {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(
      settingsKey ? `${STORAGE_KEY}:${settingsKey}` : STORAGE_KEY,
    );
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return parsed !== null && typeof parsed === "object"
      ? (parsed as Partial<PrintSettings>)
      : null;
  } catch {
    return null;
  }
}

/** Only complete, valid profiles can bypass first-use document setup. */
export function hasPrintSettings(settingsKey: string): boolean {
  const saved = readSettings(settingsKey);
  return (
    !!saved &&
    PAPER_SIZES.includes(saved.paperSize as PaperSize) &&
    MARGINS.includes(saved.margin as Margin) &&
    ORIENTATIONS.includes(saved.orientation as Orientation)
  );
}

export function loadPrintSettings(settingsKey?: string): PrintSettings {
  const saved = readSettings(settingsKey);
  return {
    paperSize: PAPER_SIZES.includes(saved?.paperSize as PaperSize)
      ? saved!.paperSize!
      : DEFAULT_PRINT_SETTINGS.paperSize,
    margin: MARGINS.includes(saved?.margin as Margin)
      ? saved!.margin!
      : DEFAULT_PRINT_SETTINGS.margin,
    orientation: ORIENTATIONS.includes(saved?.orientation as Orientation)
      ? saved!.orientation!
      : DEFAULT_PRINT_SETTINGS.orientation,
  };
}

export function savePrintSettings(
  settings: PrintSettings,
  settingsKey?: string,
): void {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(
      settingsKey ? `${STORAGE_KEY}:${settingsKey}` : STORAGE_KEY,
      JSON.stringify(settings),
    );
  } catch {
    // Printing remains available when browser storage is blocked or full.
  }
}
