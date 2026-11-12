import { invoke, isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";

interface WindowChrome {
  extended: boolean;
  height: number;
  leftInset: number;
  rightInset: number;
}

let lifecycleGeneration = 0;

/** Owns the Windows caption lifecycle; unsupported hosts retain their standard frame. */
function startWindowsChrome(): () => void {
  if (
    !isTauri() ||
    document.documentElement.dataset.tauriPlatform !== "windows"
  ) {
    return () => {};
  }
  const generation = ++lifecycleGeneration;
  const root = document.documentElement;
  const appWindow = getCurrentWindow();
  let active = true;
  let pending = false;
  let running: Promise<void> | undefined;
  let timer: number | undefined;
  let unlisten: (() => void) | undefined;
  let dark = root.dataset.theme === "dark";
  let lastSize = "";
  let dragStart: { x: number; y: number } | undefined;

  function clear() {
    if (generation !== lifecycleGeneration) return;
    root.removeAttribute("data-windows-titlebar");
    for (const name of ["height", "left-inset", "right-inset"]) {
      root.style.removeProperty(`--windows-titlebar-${name}`);
    }
  }

  async function sync() {
    while (active && pending) {
      pending = false;
      try {
        const fullscreen = await appWindow.isFullscreen();
        if (!active) return;
        if (fullscreen) clear();
        const chrome = await invoke<WindowChrome>("window_chrome_sync", {
          dark,
          fullscreen,
        });
        if (!active) return;
        if (
          fullscreen ||
          !chrome.extended ||
          chrome.height <= 0 ||
          ![chrome.height, chrome.leftInset, chrome.rightInset].every(
            (value) => Number.isFinite(value) && value >= 0,
          )
        ) {
          clear();
          continue;
        }
        root.style.setProperty(
          "--windows-titlebar-height",
          `${chrome.height}px`,
        );
        root.style.setProperty(
          "--windows-titlebar-left-inset",
          `${chrome.leftInset}px`,
        );
        root.style.setProperty(
          "--windows-titlebar-right-inset",
          `${chrome.rightInset}px`,
        );
        root.setAttribute("data-windows-titlebar", "");
      } catch {
        clear();
      }
    }
  }

  function requestSync() {
    if (!active) return;
    pending = true;
    if (running) return;
    running = sync().finally(() => {
      running = undefined;
      if (active && pending) requestSync();
    });
  }

  function scheduleSync() {
    if (timer !== undefined) window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      timer = undefined;
      requestSync();
    }, 50);
  }

  function pointerEnter() {
    if (active && root.hasAttribute("data-windows-titlebar")) {
      // WebView2 consumes client mouse movement that the native caption needs
      // to clear hover. Notify only on entry, rather than on every movement.
      void invoke("window_chrome_pointer_enter").catch(() => undefined);
    }
  }

  function cancelDrag() {
    dragStart = undefined;
  }

  function mouseDown(event: MouseEvent) {
    cancelDrag();
    if (event.button !== 0 || event.detail !== 1) return;
    const target = event.composedPath()[0];
    if (!(target instanceof HTMLElement)) return;
    const region = target.getAttribute("data-tauri-drag-region");
    if (region !== "" && region !== "true") return;
    // Tauri starts dragging on mouse-down, which can restore a maximized
    // window before the user moves. Intercept only our direct drag regions;
    // controls and double-clicks retain Tauri's existing handling.
    event.preventDefault();
    event.stopImmediatePropagation();
    dragStart = { x: event.clientX, y: event.clientY };
  }

  function mouseMove(event: MouseEvent) {
    if (!dragStart) return;
    if (!(event.buttons & 1)) {
      cancelDrag();
      return;
    }
    if (
      Math.max(
        Math.abs(event.clientX - dragStart.x),
        Math.abs(event.clientY - dragStart.y),
      ) < 4
    )
      return;
    cancelDrag();
    void appWindow.startDragging().catch(() => undefined);
  }

  const themeObserver = new MutationObserver(() => {
    const nextDark = root.dataset.theme === "dark";
    if (dark === nextDark) return;
    dark = nextDark;
    requestSync();
  });
  themeObserver.observe(root, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  document.addEventListener("fullscreenchange", requestSync);
  root.addEventListener("pointerenter", pointerEnter);
  document.addEventListener("mousedown", mouseDown, true);
  document.addEventListener("mousemove", mouseMove, true);
  document.addEventListener("mouseup", cancelDrag, true);
  window.addEventListener("blur", cancelDrag);
  void appWindow
    .onResized(({ payload }) => {
      // Re-applying native chrome can emit a resize with unchanged geometry.
      const size = `${payload.width}:${payload.height}:${window.devicePixelRatio}`;
      if (size === lastSize) return;
      lastSize = size;
      scheduleSync();
    })
    .then((stop) => {
      if (active) unlisten = stop;
      else stop();
    })
    .catch(clear);
  requestSync();

  return () => {
    active = false;
    pending = false;
    if (timer !== undefined) window.clearTimeout(timer);
    themeObserver.disconnect();
    document.removeEventListener("fullscreenchange", requestSync);
    root.removeEventListener("pointerenter", pointerEnter);
    document.removeEventListener("mousedown", mouseDown, true);
    document.removeEventListener("mousemove", mouseMove, true);
    document.removeEventListener("mouseup", cancelDrag, true);
    window.removeEventListener("blur", cancelDrag);
    cancelDrag();
    unlisten?.();
    clear();
    // Restore the standard frame after any in-flight native update has finished.
    void Promise.resolve(running)
      .then(() => {
        if (generation === lifecycleGeneration) {
          return invoke("window_chrome_sync", { dark, fullscreen: true });
        }
      })
      .catch(() => undefined);
  };
}

/** Owns native appearance listeners for the lifetime of the app shell. */
export function startWindowChrome(): () => void {
  if (!isTauri()) return () => {};
  const root = document.documentElement;
  const appWindow = getCurrentWindow();
  let active = true;
  let stopWindows: (() => void) | undefined;
  let unlisten: (() => void) | undefined;
  let observer: MutationObserver | undefined;
  let settled: number | undefined;
  let revision = 0;
  let nativeTheme: "light" | "dark" | null | undefined;
  let themeUpdate = Promise.resolve();

  async function syncMacFullscreen() {
    const current = ++revision;
    try {
      const fullscreen = await appWindow.isFullscreen();
      if (active && current === revision)
        root.toggleAttribute("data-tauri-fullscreen", fullscreen);
    } catch {
      // Keep the reserved traffic-light space when native state is unavailable.
    }
  }

  function syncNativeTheme() {
    const desired = root.dataset.themeMode === "system"
      ? null
      : root.dataset.theme === "dark" ? "dark" : "light";
    if (nativeTheme !== desired) {
      nativeTheme = desired;
      // Serialize overrides so a slower previous choice cannot replace System.
      themeUpdate = themeUpdate.then(async () => {
        if (active && nativeTheme === desired) await appWindow.setTheme(desired);
      }).catch(() => {
        if (nativeTheme === desired) nativeTheme = undefined;
      });
    }
    if (root.dataset.tauriPlatform !== "macos") return;
    // Native backing can show through when macOS rubber-bands the web content.
    const background = getComputedStyle(root).getPropertyValue("--bg").trim();
    if (background)
      void invoke("window_background_sync", { color: background }).catch((error) => {
        console.warn("Unable to sync native window background", error);
      });
  }

  void (async () => {
    try {
      const platform = await invoke<string>("desktop_platform");
      if (!active || !["macos", "windows", "linux"].includes(platform)) return;
      root.dataset.tauriPlatform = platform;
      // Allow the mounted shell and platform insets to reach layout before reveal.
      // A hidden native window need not deliver animation frames, so do not wait
      // for requestAnimationFrame here.
      await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
      if (!active) return;
      void root.offsetHeight;
      await invoke("window_ready", {
        dark: root.dataset.theme === "dark",
        followSystem: root.dataset.themeMode === "system",
        color: getComputedStyle(root).getPropertyValue("--bg").trim(),
      });
      if (!active) return;
      observer = new MutationObserver(syncNativeTheme);
      observer.observe(root, {
        attributes: true,
        attributeFilter: ["data-theme", "data-theme-mode", "data-palette"],
      });
      syncNativeTheme();
      if (platform === "windows") {
        stopWindows = startWindowsChrome();
        return;
      }
      if (platform !== "macos") return;
      document.addEventListener("fullscreenchange", syncMacFullscreen);
      await syncMacFullscreen();
      if (!active) return;
      const stop = await appWindow.onResized(() => {
        void syncMacFullscreen();
        if (settled !== undefined) window.clearTimeout(settled);
        // AppKit may report its final fullscreen state after the resize callback.
        settled = window.setTimeout(() => void syncMacFullscreen(), 250);
      });
      if (active) unlisten = stop;
      else stop();
    } catch (error) {
      console.error("Unable to initialize native window appearance", error);
    }
  })();

  return () => {
    active = false;
    revision++;
    if (settled !== undefined) window.clearTimeout(settled);
    observer?.disconnect();
    document.removeEventListener("fullscreenchange", syncMacFullscreen);
    unlisten?.();
    stopWindows?.();
    root.removeAttribute("data-tauri-platform");
    root.removeAttribute("data-tauri-fullscreen");
  };
}
