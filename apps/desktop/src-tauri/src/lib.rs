mod commands;
mod error;
mod ffmpeg;
mod media;
mod peaks;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").expect("main window");
                window.open_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::analyze_media,
            commands::detect_silences,
            commands::compute_peaks,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
