pub mod profile_store;
pub mod submission;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            profile_store::list_taxpayer_profiles,
            profile_store::save_taxpayer_profile,
            submission::submit_return
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
