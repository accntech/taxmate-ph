use std::fs;

use ebirforms_tauri_lib::profile_store::{
    delete_taxpayer_profile_from_root, list_taxpayer_profiles_from_root,
};

#[test]
fn deletes_the_loaded_file_when_xml_tin_fields_do_not_match_its_filename() {
    let root = tempfile::tempdir().unwrap();
    let profiles = root.path().join("profile");
    let returns = root.path().join("savefile");
    fs::create_dir_all(&profiles).unwrap();
    fs::create_dir_all(&returns).unwrap();
    let selected = profiles.join("1234567890000.xml");
    let other = profiles.join("0000.xml");
    let xml = "<div><div>tin1=tin1=</div><div>tin2=tin2=</div><div>tin3=tin3=</div><div>tin4=0000tin4=</div></div>";
    fs::write(&selected, xml).unwrap();
    fs::write(&other, xml).unwrap();
    let saved_return = returns.join("1234567890000-1601EQ-2026Q1.xml");
    fs::write(&saved_return, "keep saved return").unwrap();

    let loaded = list_taxpayer_profiles_from_root(root.path()).unwrap();
    let profile = loaded
        .iter()
        .find(|profile| profile.id == "1234567890000")
        .expect("loaded profile identity must use its actual filename");
    assert_eq!(profile.tin1, "");
    assert_eq!(profile.branch_code, "0000");

    delete_taxpayer_profile_from_root(root.path(), &profile.id).unwrap();

    assert!(!selected.exists());
    assert_eq!(fs::read_to_string(other).unwrap(), xml);
    assert_eq!(
        fs::read_to_string(saved_return).unwrap(),
        "keep saved return"
    );
    let remaining = list_taxpayer_profiles_from_root(root.path()).unwrap();
    assert_eq!(remaining.len(), 1);
    assert_eq!(remaining[0].id, "0000");
}

#[test]
fn deletes_loaded_legacy_profiles_without_normalizing_their_identifiers() {
    let root = tempfile::tempdir().unwrap();
    let profiles = root.path().join("profile");
    let returns = root.path().join("savefile");
    fs::create_dir_all(&profiles).unwrap();
    fs::create_dir_all(&returns).unwrap();
    let canonical = profiles.join("1234567890000.xml");
    fs::write(&canonical, "keep canonical profile").unwrap();

    for branch in ["000", "00000"] {
        let id = format!("123456789{branch}");
        let selected = profiles.join(format!("{id}.xml"));
        let saved_return = returns.join(format!("{id}-1601EQ-2026Q1.xml"));
        fs::write(
            &selected,
            format!("<div><div>tin1=123tin1=</div><div>tin2=456tin2=</div><div>tin3=789tin3=</div><div>tin4={branch}tin4=</div></div>"),
        ).unwrap();
        fs::write(&saved_return, "keep saved return").unwrap();
        let loaded = list_taxpayer_profiles_from_root(root.path()).unwrap();
        let profile = loaded.iter().find(|profile| profile.id == id).unwrap();

        delete_taxpayer_profile_from_root(root.path(), &profile.id).unwrap();

        assert!(!selected.exists());
        assert_eq!(
            fs::read_to_string(&canonical).unwrap(),
            "keep canonical profile"
        );
        assert_eq!(
            fs::read_to_string(saved_return).unwrap(),
            "keep saved return"
        );
    }
}

#[test]
fn deletes_only_the_selected_profile_and_preserves_returns() {
    let root = tempfile::tempdir().unwrap();
    let profiles = root.path().join("profile");
    let returns = root.path().join("savefile");
    fs::create_dir_all(&profiles).unwrap();
    fs::create_dir_all(&returns).unwrap();
    let selected = profiles.join("1234567890000.xml");
    let other = profiles.join("9876543210000.xml");
    let saved_return = returns.join("1234567890000-1601EQ-2026Q1.xml");
    fs::write(&selected, "selected profile").unwrap();
    fs::write(&other, "other profile").unwrap();
    fs::write(&saved_return, "saved return").unwrap();

    delete_taxpayer_profile_from_root(root.path(), "1234567890000").unwrap();

    assert!(!selected.exists());
    assert_eq!(fs::read_to_string(other).unwrap(), "other profile");
    assert_eq!(fs::read_to_string(saved_return).unwrap(), "saved return");
}

#[test]
fn rejects_invalid_identifiers_before_touching_files() {
    let root = tempfile::tempdir().unwrap();
    let outside = root.path().join("1234567890000.xml");
    fs::write(&outside, "keep").unwrap();
    for id in [
        "",
        "../1234567890000",
        "..\\1234567890000",
        "/1234567890000",
        "..",
        "1234567890000.xml",
        " 1234567890000",
        "1234567890000 ",
        "１２３４５６７８９００００",
        "123456789000a",
    ] {
        let error = delete_taxpayer_profile_from_root(root.path(), id).unwrap_err();
        assert!(error.message.contains("only digits"), "{}", error.message);
    }
    assert_eq!(fs::read_to_string(outside).unwrap(), "keep");
}

#[test]
fn reports_missing_profile_without_claiming_success() {
    let root = tempfile::tempdir().unwrap();
    let error = delete_taxpayer_profile_from_root(root.path(), "1234567890000").unwrap_err();
    assert!(error.message.contains("Could not delete taxpayer profile"));
}
