// Adapted from Suki apps/dining/src-tauri/windows/window-chrome.test.cpp (MIT declared in package.json).
// Source commit: 072f8ef0b8c360906875fcd3388b44cef3c88198. Native appearance only; no application data access.
// Integration regression: only this test's HWND is used; no Tauri or taxpayer data.
#include "window-chrome.cpp"

static void settle() {
    const auto until = GetTickCount64() + 100;
    do {
        MSG message{};
        while (PeekMessageW(&message, nullptr, 0, 0, PM_REMOVE)) {
            TranslateMessage(&message);
            DispatchMessageW(&message);
        }
        Sleep(1);
    } while (GetTickCount64() < until);
}

int main() {
    const auto initializedResult = taxmate_window_chrome_initialize();
    if (FAILED(initializedResult)) {
        std::fprintf(stderr, "Test requires the installed App Runtime: 0x%08x\n", static_cast<unsigned>(initializedResult));
        taxmate_window_chrome_shutdown();
        return 2;
    }
    OleInitialize(nullptr);
    WNDCLASSW type{};
    type.lpfnWndProc = DefWindowProcW;
    type.hInstance = GetModuleHandleW(nullptr);
    type.lpszClassName = L"TaxMateChromeRegression";
    RegisterClassW(&type);
    HWND hwnd = CreateWindowW(type.lpszClassName, L"TaxMate PH titlebar regression (no taxpayer data)",
        WS_OVERLAPPEDWINDOW, CW_USEDEFAULT, CW_USEDEFAULT, 800, 600,
        nullptr, nullptr, type.hInstance, nullptr);
    if (!hwnd) return 2;
    int failures = 0;
    Geometry visibleGeometry{};
    auto checkInput = [&](const char* label) {
        // A child stands in for WebView2: native caption input must reach it.
        RECT client{};
        GetClientRect(hwnd, &client);
        HWND content = CreateWindowW(L"BUTTON", L"Header action", WS_CHILD | WS_VISIBLE,
            0, 0, client.right, client.bottom, hwnd, nullptr, type.hInstance, nullptr);
        SetWindowPos(hwnd, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE);
        settle();
        for (const auto x : {client.right / 2, client.right - visibleGeometry.rightInset - 24}) {
            POINT point{x, visibleGeometry.height / 2};
            ClientToScreen(hwnd, &point);
            const auto target = WindowFromPoint(point);
            const auto hit = SendMessageW(target, WM_NCHITTEST, 0, MAKELPARAM(point.x, point.y));
            std::fprintf(stderr, "%s: x=%ld content=%d hit=%lld\n", label, x,
                target == content, static_cast<long long>(hit));
            if (target != content || hit != HTCLIENT) ++failures;
        }
        POINT close{client.right - 24, visibleGeometry.height / 2};
        ClientToScreen(hwnd, &close);
        const auto target = WindowFromPoint(close);
        const auto hit = SendMessageW(target, WM_NCHITTEST, 0, MAKELPARAM(close.x, close.y));
        std::fprintf(stderr, "%s: native close hit=%lld\n", label, static_cast<long long>(hit));
        if (hit != HTCLOSE) ++failures;
        DestroyWindow(content);
    };
    auto check = [&](const char* label, bool fullscreen, bool requireExtended) {
        Geometry value{};
        const auto result = taxmate_window_chrome_sync(hwnd, false, fullscreen, &value);
        if (value.extended) visibleGeometry = value;
        std::fprintf(stderr, "%s: result=0x%08x extended=%u height=%d dpi=%u\n",
            label, static_cast<unsigned>(result), value.extended, value.height, value.dpi);
        if (FAILED(result) || (requireExtended && !value.extended)) ++failures;
    };
    // Startup must prepare the custom caption without making the HWND visible.
    check("startup hidden", false, true);
    if (IsWindowVisible(hwnd)) ++failures;
    ShowWindow(hwnd, SW_SHOWNOACTIVATE);
    settle();
    // The first visible frame must already be extended before the frontend's
    // existing mount/resize sync refreshes input bounds after native layout.
    if (!AppWindow::GetFromWindowId(GetWindowIdFromWindow(hwnd))
        .TitleBar().ExtendsContentIntoTitleBar()) ++failures;
    check("first mounted content", false, true);
    checkInput("first presentation header input");
    check("startup cleanup", true, false);
    ShowWindow(hwnd, SW_SHOWMINNOACTIVE);
    settle();
    check("startup minimized", false, false);
    ShowWindow(hwnd, SW_SHOWNOACTIVATE);
    settle();
    check("initial visible", false, true);
    checkInput("header input");
    check("reload cleanup", true, false);
    if (!Input::InputNonClientPointerSource::GetForWindowId(GetWindowIdFromWindow(hwnd))
        .GetRegionRects(Input::NonClientRegionKind::Passthrough).empty()) ++failures;
    check("reload mount", false, true);
    checkInput("remounted header input");
    for (const auto width : {1100, 600}) {
        SetWindowPos(hwnd, nullptr, 0, 0, width, 600, SWP_NOMOVE | SWP_NOZORDER | SWP_NOACTIVATE);
        settle();
        check("resized update", false, true);
        checkInput("resized header input");
    }
    ShowWindow(hwnd, SW_MINIMIZE);
    settle();
    check("minimized update", false, true);
    check("minimized reload cleanup", true, false);
    check("minimized reload mount", false, false);
    ShowWindow(hwnd, SW_SHOWNOACTIVATE);
    settle();
    check("restored update", false, true);
    checkInput("restored header input");
    DestroyWindow(hwnd);
    settle();
    taxmate_window_chrome_shutdown();
    OleUninitialize();
    return failures ? 1 : 0;
}
