use std::fs;

use ebirforms_tauri_lib::profile_store::{
    list_taxpayer_profiles_from_root, save_taxpayer_profile_to_root, TaxpayerProfile,
};

fn sample_profile() -> TaxpayerProfile {
    TaxpayerProfile {
        id: "1234567890000".into(),
        tin1: "123".into(),
        tin2: "456".into(),
        tin3: "789".into(),
        branch_code: "0000".into(),
        rdo_code: "040".into(),
        taxpayer_name: "Sample Taxpayer".into(),
        address: "123 Sample Street".into(),
        address2: "Barangay Example, Makati City".into(),
        zip_code: "1200".into(),
        contact_number: "09171234567".into(),
        category: "P".into(),
        email: "taxpayer@example.com".into(),
    }
}

#[test]
fn saves_taxpayer_profile_to_legacy_profile_folder() {
    let root = tempfile::tempdir().expect("temp app data root");
    let saved = save_taxpayer_profile_to_root(root.path(), sample_profile()).expect("save profile");

    assert!(saved.path.ends_with("profile/1234567890000.xml"));

    let xml = fs::read_to_string(saved.path).expect("profile xml");
    assert!(xml.contains("<div>fn=Sample%20Taxpayerfn=</div>"));
    assert!(xml.contains("<div>tin1=123tin1=</div>"));
    assert!(xml.contains("<div>tin4=0000tin4=</div>"));
    assert!(xml.contains("<div>rdo=040rdo=</div>"));
    assert!(xml.contains("<div>addr=123%20Sample%20Streetaddr=</div>"));
    assert!(xml.contains("<div>addr2=Barangay%20Example%2C%20Makati%20Cityaddr2=</div>"));
    assert!(xml.contains("<div>zip=1200zip=</div>"));
    assert!(xml.contains("<div>tel=09171234567tel=</div>"));
    assert!(xml.contains("<div>category=Pcategory=</div>"));
    assert!(xml.contains("<div>email=taxpayer@example.comemail=</div>"));
}

#[test]
fn lists_saved_taxpayer_profiles_from_disk() {
    let root = tempfile::tempdir().expect("temp app data root");
    save_taxpayer_profile_to_root(root.path(), sample_profile()).expect("save profile");

    let profiles = list_taxpayer_profiles_from_root(root.path()).expect("list profiles");

    assert_eq!(profiles, vec![sample_profile()]);
}
