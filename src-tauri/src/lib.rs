pub mod pdf_export;
pub mod profile_store;
pub mod return_history;
pub mod submission;
pub mod working_returns;
mod window_chrome;

use tauri::Manager;

#[tauri::command]
fn desktop_platform() -> &'static str {
    std::env::consts::OS
}

#[cfg(desktop)]
fn show_main_window(app: &tauri::AppHandle) -> Result<(), String> {
    let window = app
        .get_webview_window("main")
        .ok_or("Main window is unavailable")?;
    #[cfg(target_os = "windows")]
    window_chrome::prepare(&window);
    window.unminimize().map_err(|error| error.to_string())?;
    window.show().map_err(|error| error.to_string())?;
    window.set_focus().map_err(|error| error.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    window_chrome::initialize();
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            desktop_platform,
            window_chrome::window_chrome_sync,
            window_chrome::window_chrome_pointer_enter,
            pdf_export::export_form_pdf,
            pdf_export::cancel_pdf_export,
            profile_store::list_taxpayer_profiles,
            profile_store::save_taxpayer_profile,
            profile_store::delete_taxpayer_profile,
            submission::submit_return,
            working_returns::load_working_returns,
            working_returns::save_working_returns,
            return_history::list_submitted_returns
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");
    app.run(|app, event| match event {
        #[cfg(desktop)]
        tauri::RunEvent::Ready => {
            if let Err(error) = show_main_window(app) {
                eprintln!("Unable to show main window: {error}");
            }
        }
        #[cfg(target_os = "macos")]
        tauri::RunEvent::Reopen { .. } => {
            if let Err(error) = show_main_window(app) {
                eprintln!("Unable to reopen main window: {error}");
            }
        }
        tauri::RunEvent::Exit => window_chrome::shutdown(),
        _ => {}
    });
}
