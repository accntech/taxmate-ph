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
fn geometry(value: native::CaptionGeometry) -> Geometry {
    if !value.extended {
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
pub fn prepare(window: &tauri::WebviewWindow, dark: bool) {
    if let Ok(hwnd) = window.hwnd() {
        native::sync(hwnd.0, dark, window.is_fullscreen().unwrap_or(false));
    }
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum AppearanceMode {
    Light,
    Dark,
    System,
}

/// Apply backing and native appearance together on the UI thread.
#[tauri::command]
pub fn window_appearance_sync(
    window: tauri::WebviewWindow,
    mode: Option<AppearanceMode>,
    color: Option<tauri::window::Color>,
) -> Result<(), String> {
    if window.label() != "main" {
        return Err("Window appearance is available only to the main window".into());
    }
    if let Some(color) = color {
        window
            .set_background_color(Some(color))
            .map_err(|error| error.to_string())?;
    }
    if let Some(mode) = mode {
        let theme = match mode {
            AppearanceMode::Light => Some(tauri::Theme::Light),
            AppearanceMode::Dark => Some(tauri::Theme::Dark),
            AppearanceMode::System => None,
        };
        window.set_theme(theme).map_err(|error| error.to_string())?;
    }
    Ok(())
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
mod native;
