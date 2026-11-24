import { afterEach, describe, expect, it, vi } from "vitest";
import {
  hasPrintSettings,
  loadPrintSettings,
  savePrintSettings,
  type PrintSettings,
} from "../../../lib/components/ui/print-settings-dialog/print-settings";

const saved: PrintSettings = {
  paperSize: "Long",
  margin: "Wide",
  orientation: "landscape",
};
const updated: PrintSettings = {
  paperSize: "Letter",
  margin: "Narrow",
  orientation: "portrait",
};

function useStorage(entries: [string, string][] = []) {
  const storage = new Map(entries);
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  });
  return storage;
}

afterEach(() => vi.unstubAllGlobals());

describe("print settings storage", () => {
  it.each([undefined, "1701Qv2018"])("writes preferences to the TaxMate key for profile %s", (profile) => {
    const suffix = profile ? `:${profile}` : "";
    const legacyKey = `pcsti-print-settings${suffix}`;
    const storage = useStorage([[legacyKey, JSON.stringify(saved)]]);

    savePrintSettings(updated, profile);

    expect(storage.get(`taxmate-print-settings${suffix}`)).toBe(JSON.stringify(updated));
    expect(storage.get(legacyKey)).toBe(JSON.stringify(saved));
    expect(loadPrintSettings(profile)).toEqual(updated);
  });

  it("moves shared and per-form preferences to the TaxMate keys on first load", () => {
    const storage = useStorage([
      ["pcsti-print-settings", JSON.stringify(saved)],
      ["pcsti-print-settings:1701Qv2018", JSON.stringify(updated)],
    ]);

    expect(loadPrintSettings()).toEqual(saved);
    expect(loadPrintSettings("1701Qv2018")).toEqual(updated);
    expect(Array.from(storage)).toEqual([
      ["taxmate-print-settings", JSON.stringify(saved)],
      ["taxmate-print-settings:1701Qv2018", JSON.stringify(updated)],
    ]);
    expect(hasPrintSettings("1701Qv2018")).toBe(true);
    expect(hasPrintSettings("1701Av2018")).toBe(false);
  });

  it("keeps the previous entry readable when the first migration write fails", () => {
    const previousEntry: [string, string] = ["pcsti-print-settings", JSON.stringify(saved)];
    const storage = useStorage([previousEntry]);
    vi.spyOn(localStorage, "setItem").mockImplementationOnce(() => {
      throw new Error("Storage quota exceeded");
    });

    expect(loadPrintSettings()).toEqual(saved);
    expect(Array.from(storage)).toEqual([previousEntry]);

    expect(loadPrintSettings()).toEqual(saved);
    expect(Array.from(storage)).toEqual([["taxmate-print-settings", JSON.stringify(saved)]]);
  });
});
