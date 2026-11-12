//! Adapted from Suki apps/dining/src-tauri/src/window_chrome.rs (MIT declared in package.json).
//! Source commit: 072f8ef0b8c360906875fcd3388b44cef3c88198. Native appearance only; no application data access.
//! Native window appearance only; this module never touches application data.

#[derive(Debug, Default, PartialEq, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Geometry {
    extended: bool,
    height: f64,
    left_inset: f64,
    right_inset: f64,
}

#[cfg(target_os = "windows")]
#[repr(C)]
#[derive(Default)]
struct NativeGeometry {
    extended: u32,
    height: i32,
    left_inset: i32,
    right_inset: i32,
    dpi: u32,
}

#[cfg(target_os = "windows")]
fn geometry(result: i32, value: NativeGeometry) -> Geometry {
    if result < 0
        || value.extended != 1
        || value.dpi == 0
        || value.height <= 0
        || value.left_inset < 0
        || value.right_inset < 0
    {
        return Geometry::default();
    }
    let dip = |pixels| f64::from(pixels) * 96.0 / f64::from(value.dpi);
    Geometry {
        extended: true,
        height: dip(value.height),
        left_inset: dip(value.left_inset),
        right_inset: dip(value.right_inset),
    }
}

/// Called before Tauri creates its event loop, on the application's main thread.
pub fn initialize() {
    // Support escape hatch: set TAXMATE_STANDARD_FRAME=1 before launching TaxMate PH.
    #[cfg(target_os = "windows")]
    if std::env::var("TAXMATE_STANDARD_FRAME").as_deref() != Ok("1") {
        native::initialize();
    }
}

/// Exit is delivered on the same UI thread used for initialization and syncing.
pub fn shutdown() {
    #[cfg(target_os = "windows")]
    native::shutdown();
}

/// Called on the UI thread before native startup shows the main window.
/// Failure keeps the standard frame and must never prevent presentation.
#[cfg(target_os = "windows")]
pub fn prepare(window: &tauri::WebviewWindow) {
    if let Ok(hwnd) = window.hwnd() {
        // Match the shell's initial light appearance. Frontend syncing takes over
        // persisted theme, resize and fullscreen changes after mounting.
        native::sync(hwnd.0, false, window.is_fullscreen().unwrap_or(false));
    }
}

#[tauri::command]
pub async fn window_chrome_sync(
    window: tauri::WebviewWindow,
    dark: bool,
    fullscreen: bool,
) -> Result<Geometry, String> {
    if window.label() != "main" {
        return Err("Window chrome is available only to the main window".into());
    }
    #[cfg(target_os = "windows")]
    {
        let (sender, receiver) = tokio::sync::oneshot::channel();
        let native_window = window.clone();
        if window
            .run_on_main_thread(move || {
                let value = native_window
                    .hwnd()
                    .map(|hwnd| native::sync(hwnd.0, dark, fullscreen))
                    .unwrap_or_default();
                let _ = sender.send(value);
            })
            .is_err()
        {
            return Ok(Geometry::default());
        }
        Ok(receiver.await.unwrap_or_default())
    }
    #[cfg(not(target_os = "windows"))]
    {
        let _ = (dark, fullscreen);
        Ok(Geometry::default())
    }
}

#[tauri::command]
pub fn window_chrome_pointer_enter(window: tauri::WebviewWindow) -> Result<(), String> {
    if window.label() != "main" {
        return Err("Window chrome is available only to the main window".into());
    }
    #[cfg(target_os = "windows")]
    {
        let native_window = window.clone();
        window
            .run_on_main_thread(move || {
                if let Ok(hwnd) = native_window.hwnd() {
                    native::pointer_enter(hwnd.0);
                }
            })
            .map_err(|error| error.to_string())?;
    }
    Ok(())
}

#[cfg(target_os = "windows")]
mod native {
    use super::{geometry, Geometry, NativeGeometry};
    use std::{cell::Cell, os::windows::ffi::OsStrExt, path::PathBuf};
    use windows_sys::Win32::{Foundation::HWND, System::LibraryLoader::*};

    #[derive(Clone, Copy)]
    struct Bridge {
        sync: unsafe extern "C" fn(HWND, i32, i32, *mut NativeGeometry) -> i32,
        pointer_enter: unsafe extern "C" fn(HWND),
        shutdown: unsafe extern "C" fn(),
    }

    thread_local! {
        // Copies release the Cell borrow before native code pumps window messages.
        static BRIDGE: Cell<Option<Bridge>> = const { Cell::new(None) };
    }

    fn library_path() -> Result<PathBuf, Box<dyn std::error::Error>> {
        let executable = std::env::current_exe()?;
        let packaged = executable
            .parent()
            .ok_or("Executable has no parent directory")?
            // LoadLibraryExW rejects mixed separators even when Path::is_file
            // accepts them, so join each Windows path component separately.
            .join("window-chrome")
            .join("taxmate-window-chrome.dll");
        #[cfg(debug_assertions)]
        if !packaged.is_file() {
            return Ok(PathBuf::from(env!("CARGO_MANIFEST_DIR"))
                .join("target")
                .join("window-chrome")
                .join("taxmate-window-chrome.dll"));
        }
        Ok(packaged)
    }

    impl Bridge {
        fn load() -> Result<Self, Box<dyn std::error::Error>> {
            let path = library_path()?;
            let wide: Vec<u16> = path.as_os_str().encode_wide().chain(Some(0)).collect();
            // SAFETY: absolute application-owned path, fixed C ABI exports, and
            // process-lifetime loading keep SDK callbacks and function pointers valid.
            unsafe {
                let module = LoadLibraryExW(
                    wide.as_ptr(),
                    std::ptr::null_mut(),
                    LOAD_LIBRARY_SEARCH_DLL_LOAD_DIR | LOAD_LIBRARY_SEARCH_DEFAULT_DIRS,
                );
                if module.is_null() {
                    return Err(std::io::Error::last_os_error().into());
                }
                let initialize =
                    GetProcAddress(module, c"taxmate_window_chrome_initialize".as_ptr().cast())
                        .ok_or("Missing window chrome initialize export")?;
                let sync = GetProcAddress(module, c"taxmate_window_chrome_sync".as_ptr().cast())
                    .ok_or("Missing window chrome sync export")?;
                let shutdown =
                    GetProcAddress(module, c"taxmate_window_chrome_shutdown".as_ptr().cast())
                        .ok_or("Missing window chrome shutdown export")?;
                let pointer_enter = GetProcAddress(
                    module,
                    c"taxmate_window_chrome_pointer_enter".as_ptr().cast(),
                )
                .ok_or("Missing window chrome pointer enter export")?;
                let initialize = std::mem::transmute::<
                    unsafe extern "system" fn() -> isize,
                    unsafe extern "C" fn() -> i32,
                >(initialize);
                let bridge = Self {
                    pointer_enter: std::mem::transmute::<
                        unsafe extern "system" fn() -> isize,
                        unsafe extern "C" fn(HWND),
                    >(pointer_enter),
                    sync: std::mem::transmute::<
                        unsafe extern "system" fn() -> isize,
                        unsafe extern "C" fn(HWND, i32, i32, *mut NativeGeometry) -> i32,
                    >(sync),
                    shutdown: std::mem::transmute::<
                        unsafe extern "system" fn() -> isize,
                        unsafe extern "C" fn(),
                    >(shutdown),
                };
                let result = initialize();
                if result < 0 {
                    eprintln!("Native window chrome unavailable: 0x{:08x}", result as u32);
                }
                // Retain shutdown even after partial SDK initialization failed.
                Ok(bridge)
            }
        }
    }

    pub(super) fn initialize() {
        match Bridge::load() {
            Ok(bridge) => BRIDGE.set(Some(bridge)),
            Err(error) => eprintln!("Using the standard Windows frame: {error}"),
        }
    }

    pub(super) fn sync(hwnd: HWND, dark: bool, fullscreen: bool) -> Geometry {
        let Some(bridge) = BRIDGE.get() else {
            return Geometry::default();
        };
        let mut value = NativeGeometry::default();
        // SAFETY: marshalled to the owning UI thread; HWND is from this live
        // Tauri window and the DLL writes one matching repr(C) output value.
        let result =
            unsafe { (bridge.sync)(hwnd, i32::from(dark), i32::from(fullscreen), &mut value) };
        geometry(result, value)
    }

    pub(super) fn shutdown() {
        if let Some(bridge) = BRIDGE.replace(None) {
            // SAFETY: RunEvent::Exit is delivered on the owning UI thread. The
            // native bridge retains dependencies if a HWND still needs callbacks.
            unsafe { (bridge.shutdown)() };
        }
    }

    pub(super) fn pointer_enter(hwnd: HWND) {
        if let Some(bridge) = BRIDGE.get() {
            // SAFETY: the command marshals this live Tauri HWND to its UI thread.
            unsafe { (bridge.pointer_enter)(hwnd) };
        }
    }
}
