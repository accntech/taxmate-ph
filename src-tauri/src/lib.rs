pub mod pdf_export;
pub mod profile_store;
pub mod return_history;
pub mod submission;
pub mod working_returns;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            pdf_export::export_form_pdf,
            profile_store::list_taxpayer_profiles,
            profile_store::save_taxpayer_profile,
            profile_store::delete_taxpayer_profile,
            submission::submit_return,
            working_returns::load_working_returns,
            working_returns::save_working_returns,
            return_history::list_submitted_returns
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
