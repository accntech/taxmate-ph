// Adapted from the MIT-licensed Suki apps/dining/src-tauri/windows/window-chrome.test.cpp.
// Source commit: 072f8ef0b8c360906875fcd3388b44cef3c88198.

use std::ptr::{null, null_mut};
use std::thread;
use std::time::{Duration, Instant};

use windows_sys::w;
use windows_sys::Win32::Foundation::{HWND, POINT, RECT};
use windows_sys::Win32::Graphics::Gdi::ClientToScreen;
use windows_sys::Win32::System::LibraryLoader::GetModuleHandleW;
use windows_sys::Win32::System::Ole::{OleInitialize, OleUninitialize};
use windows_sys::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DefWindowProcW, DestroyWindow, DispatchMessageW, GetClientRect,
    IsWindowVisible, PeekMessageW, RegisterClassW, SendMessageW, SetWindowPos, ShowWindow,
    TranslateMessage, WindowFromPoint, CW_USEDEFAULT, HTCLIENT, HTCLOSE, HWND_TOPMOST, MSG,
    PM_REMOVE, SWP_NOACTIVATE, SWP_NOMOVE, SWP_NOSIZE, SWP_NOZORDER, SW_MINIMIZE,
    SW_SHOWMINNOACTIVE, SW_SHOWNOACTIVATE, WM_NCHITTEST, WNDCLASSW, WS_CHILD, WS_OVERLAPPEDWINDOW,
    WS_VISIBLE,
};

use super::{CaptionGeometry, Chrome};

struct OleApartment;

impl OleApartment {
    fn initialize() -> Self {
        let result = unsafe { OleInitialize(null()) };
        assert!(result >= 0, "initialize OLE: {result:#010x}");
        Self
    }
}

impl Drop for OleApartment {
    fn drop(&mut self) {
        unsafe { OleUninitialize() };
    }
}

struct TestWindow(HWND);

impl Drop for TestWindow {
    fn drop(&mut self) {
        unsafe { DestroyWindow(self.0) };
        settle();
    }
}

fn settle() {
    let deadline = Instant::now() + Duration::from_millis(100);
    while Instant::now() < deadline {
        let mut message = MSG::default();
        unsafe {
            while PeekMessageW(&mut message, null_mut(), 0, 0, PM_REMOVE) != 0 {
                TranslateMessage(&message);
                DispatchMessageW(&message);
            }
        }
        thread::sleep(Duration::from_millis(1));
    }
}

fn create_test_window() -> TestWindow {
    let class = WNDCLASSW {
        lpfnWndProc: Some(DefWindowProcW),
        hInstance: unsafe { GetModuleHandleW(null()) },
        lpszClassName: w!("TaxMateChromeRegression"),
        ..Default::default()
    };
    assert_ne!(unsafe { RegisterClassW(&class) }, 0, "register test window");
    let hwnd = unsafe {
        CreateWindowExW(
            0,
            class.lpszClassName,
            w!("TaxMate PH title-bar regression"),
            WS_OVERLAPPEDWINDOW,
            CW_USEDEFAULT,
            CW_USEDEFAULT,
            800,
            600,
            null_mut(),
            null_mut(),
            class.hInstance,
            null(),
        )
    };
    assert!(!hwnd.is_null(), "create test window");
    TestWindow(hwnd)
}

fn hit_test_at(hwnd: HWND, x: i32, y: i32) -> (HWND, isize) {
    let mut point = POINT { x, y };
    unsafe {
        assert_ne!(ClientToScreen(hwnd, &mut point), 0);
        let target = WindowFromPoint(point);
        assert!(!target.is_null(), "no window at ({}, {})", point.x, point.y);
        // WM_NCHITTEST uses signed screen coordinates packed into two 16-bit words.
        let coordinates = u32::from(point.x as u16) | (u32::from(point.y as u16) << 16);
        let hit = SendMessageW(target, WM_NCHITTEST, 0, coordinates as isize);
        (target, hit)
    }
}

fn check_input(hwnd: HWND, geometry: &CaptionGeometry, stage: &str) {
    let mut client = RECT::default();
    let content = unsafe {
        assert_ne!(GetClientRect(hwnd, &mut client), 0);
        // A child window stands in for the WebView to test click-through.
        let content = CreateWindowExW(
            0,
            w!("BUTTON"),
            w!("Header action"),
            WS_CHILD | WS_VISIBLE,
            0,
            0,
            client.right,
            client.bottom,
            hwnd,
            null_mut(),
            GetModuleHandleW(null()),
            null(),
        );
        assert!(!content.is_null(), "create header control");
        TestWindow(content)
    };
    assert_ne!(
        unsafe {
            SetWindowPos(
                hwnd,
                HWND_TOPMOST,
                0,
                0,
                0,
                0,
                SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE,
            )
        },
        0
    );
    settle();

    let y = geometry.height / 2;
    for x in [client.right / 2, client.right - geometry.right_inset - 24] {
        let (target, hit) = hit_test_at(hwnd, x, y);
        assert_eq!(target, content.0, "{stage}: header target at x={x}");
        assert_eq!(hit, HTCLIENT as isize, "{stage}: header hit at x={x}");
    }
    let (_, hit) = hit_test_at(hwnd, client.right - 24, y);
    assert_eq!(hit, HTCLOSE as isize, "{stage}: native Close button");
}

fn sync(
    chrome: &mut Chrome,
    hwnd: HWND,
    fullscreen: bool,
    extended: bool,
    stage: &str,
) -> CaptionGeometry {
    let geometry = chrome
        .sync(hwnd, false, fullscreen)
        .unwrap_or_else(|error| panic!("{stage}: {error}"));
    assert_eq!(geometry.extended, extended, "{stage}: caption extension");
    if extended {
        assert!(geometry.height > 0, "{stage}: caption height");
        assert!(
            geometry.right_inset > 0,
            "{stage}: native caption button space"
        );
        assert!(geometry.dpi > 0, "{stage}: window DPI");
    }
    geometry
}

fn show(hwnd: HWND, command: i32) {
    unsafe { ShowWindow(hwnd, command) };
    settle();
}

#[test]
#[ignore = "requires an interactive Windows desktop and Windows App Runtime"]
fn native_caption_lifecycle() {
    let chrome = Chrome::initialize().expect("initialize Windows App Runtime");
    let _apartment = OleApartment::initialize();
    let mut chrome = chrome;
    let window = create_test_window();
    let hwnd = window.0;

    sync(&mut chrome, hwnd, false, true, "hidden startup");
    assert_eq!(unsafe { IsWindowVisible(hwnd) }, 0);
    show(hwnd, SW_SHOWNOACTIVATE);
    assert!(chrome.caption_is_extended().unwrap(), "first visible frame");
    let geometry = sync(&mut chrome, hwnd, false, true, "first mount");
    check_input(hwnd, &geometry, "first mount");

    sync(&mut chrome, hwnd, true, false, "fullscreen startup cleanup");
    show(hwnd, SW_SHOWMINNOACTIVE);
    sync(&mut chrome, hwnd, false, false, "minimized startup");
    show(hwnd, SW_SHOWNOACTIVATE);
    let geometry = sync(&mut chrome, hwnd, false, true, "visible startup");
    check_input(hwnd, &geometry, "visible startup");

    sync(&mut chrome, hwnd, true, false, "reload cleanup");
    assert!(
        chrome.passthrough_is_empty().unwrap(),
        "reload must clear native input pass-through regions"
    );
    let geometry = sync(&mut chrome, hwnd, false, true, "reload mount");
    check_input(hwnd, &geometry, "reload mount");
    for width in [1100, 600] {
        assert_ne!(
            unsafe {
                SetWindowPos(
                    hwnd,
                    null_mut(),
                    0,
                    0,
                    width,
                    600,
                    SWP_NOMOVE | SWP_NOZORDER | SWP_NOACTIVATE,
                )
            },
            0
        );
        settle();
        let geometry = sync(&mut chrome, hwnd, false, true, "resized");
        check_input(hwnd, &geometry, "resized");
    }

    show(hwnd, SW_MINIMIZE);
    sync(&mut chrome, hwnd, false, true, "minimized");
    sync(&mut chrome, hwnd, true, false, "minimized reload cleanup");
    sync(&mut chrome, hwnd, false, false, "minimized reload mount");
    show(hwnd, SW_SHOWNOACTIVATE);
    let geometry = sync(&mut chrome, hwnd, false, true, "restored");
    check_input(hwnd, &geometry, "restored");

    // Round-trip the nullable WinRT color for both themes. This exercises the
    // Rust IReference<Color> implementation through the Windows App SDK.
    for (dark, shade) in [(true, 245), (false, 24)] {
        assert!(chrome.sync(hwnd, dark, false).unwrap().extended);
        let color = chrome
            .app_window
            .as_ref()
            .unwrap()
            .TitleBar()
            .unwrap()
            .ButtonForegroundColor()
            .unwrap()
            .Value()
            .unwrap();
        assert_eq!(
            (color.A, color.R, color.G, color.B),
            (255, shade, shade, shade)
        );
    }
}
