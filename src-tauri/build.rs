fn main() {
    // The generated context embeds icons, including the macOS dev Dock icon.
    println!("cargo:rerun-if-changed=icons");

    if std::env::var("CARGO_CFG_TARGET_OS").as_deref() == Ok("windows") {
        // Cargo checks do not run the Bun hook. Allow resource discovery on a fresh
        // checkout while the actual Windows build prepares the DLLs for packaging.
        let resources = std::path::PathBuf::from(std::env::var_os("CARGO_MANIFEST_DIR").unwrap())
            .join("target/window-chrome");
        if !resources.exists() {
            std::fs::create_dir_all(&resources).expect("create window chrome resource directory");
            std::fs::write(
                resources.join("README.txt"),
                "Native title-bar artifacts are prepared by bun scripts/build-window-chrome.ts.\nWithout the bridge, TaxMate PH uses the standard Windows frame.\nSet TAXMATE_STANDARD_FRAME=1 before launch to force the standard frame.\n",
            )
            .expect("write standard-frame resource placeholder");
        }
    }
    tauri_build::build()
}
