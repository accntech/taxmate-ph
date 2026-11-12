// Adapted from Suki apps/dining/src-tauri/windows/window-chrome.cpp (MIT declared in package.json).
// Source commit: 072f8ef0b8c360906875fcd3388b44cef3c88198. Native appearance only; no application data access.
// UI-thread-only Windows App SDK adapter. No application services or data access.
#define NOMINMAX
#include <windows.h>
#include <cstdint>
#include <cstdio>
#include <MddBootstrap.h>
#include <winrt/Windows.Foundation.h>
#include <winrt/Microsoft.UI.Interop.h>
#include <winrt/Microsoft.UI.Windowing.h>
#include <winrt/Microsoft.UI.Dispatching.h>
#include <winrt/Microsoft.UI.Input.h>
#include <winrt/Windows.UI.h>

using namespace winrt::Microsoft::UI;
using namespace winrt::Microsoft::UI::Windowing;

struct Geometry {
    uint32_t extended;
    int32_t height;
    int32_t leftInset;
    int32_t rightInset;
    uint32_t dpi;
};

static AppWindow appWindow{nullptr};
static Dispatching::DispatcherQueueController dispatcher{nullptr};
static HWND window = nullptr;
static DWORD ownerThread = 0;
static bool initialized = false;
static bool bootstrapped = false;
static bool broken = false;
static bool extended = false;
static bool themed = false;
static bool darkTheme = false;
static Geometry lastGeometry{};
static HRESULT bootstrapResult = E_UNEXPECTED;
static PACKAGEDEPENDENCY_CONTEXT dependencyContext = nullptr;
static PWSTR dependencyId = nullptr;
static decltype(&RemovePackageDependency) removeDependency = nullptr;
static decltype(&DeletePackageDependency) deleteDependency = nullptr;

static void reset() noexcept {
    if (appWindow && extended) {
        try {
            Input::InputNonClientPointerSource::GetForWindowId(appWindow.Id())
                .ClearRegionRects(Input::NonClientRegionKind::Passthrough);
            appWindow.TitleBar().ResetToDefault();
        }
        catch (...) { std::fprintf(stderr, "Could not reset the native title bar.\n"); }
    }
    extended = false;
    themed = false;
    lastGeometry = {};
}

extern "C" __declspec(dllexport) HRESULT taxmate_window_chrome_initialize() noexcept {
    if (initialized) return bootstrapResult;
    initialized = true;
    ownerThread = GetCurrentThreadId();
    // Bootstrap before Tauri creates HWNDs or initializes WebView2.
    bootstrapResult = MddBootstrapInitialize2(0x00010008, nullptr, PACKAGE_VERSION{}, MddBootstrapInitializeOptions_None);
    bootstrapped = SUCCEEDED(bootstrapResult);
    if (!bootstrapped) {
        // Reference an already-installed 1.8 framework on Windows 11. This is a
        // process-lifetime reference; it neither installs nor registers packages.
        auto kernel = GetModuleHandleW(L"kernelbase.dll");
        if (kernel) {
            auto create = reinterpret_cast<decltype(&TryCreatePackageDependency)>(GetProcAddress(kernel, "TryCreatePackageDependency"));
            auto add = reinterpret_cast<decltype(&AddPackageDependency)>(GetProcAddress(kernel, "AddPackageDependency"));
            removeDependency = reinterpret_cast<decltype(&RemovePackageDependency)>(GetProcAddress(kernel, "RemovePackageDependency"));
            deleteDependency = reinterpret_cast<decltype(&DeletePackageDependency)>(GetProcAddress(kernel, "DeletePackageDependency"));
            if (create && add && removeDependency && deleteDependency) {
                bootstrapResult = create(nullptr, L"Microsoft.WindowsAppRuntime.1.8_8wekyb3d8bbwe", PACKAGE_VERSION{}, PackageDependencyProcessorArchitectures_X64, PackageDependencyLifetimeKind_Process, nullptr, CreatePackageDependencyOptions_None, &dependencyId);
                if (SUCCEEDED(bootstrapResult)) {
                    bootstrapResult = add(dependencyId, PACKAGE_DEPENDENCY_RANK_DEFAULT, AddPackageDependencyOptions_None, &dependencyContext, nullptr);
                }
            }
        }
    }
    broken = FAILED(bootstrapResult);
    return bootstrapResult;
}

extern "C" __declspec(dllexport) HRESULT taxmate_window_chrome_sync(HWND hwnd, int32_t dark, int32_t fullscreen, Geometry* geometry) noexcept {
    if (!geometry) return E_POINTER;
    *geometry = {};
    if (GetCurrentThreadId() != ownerThread) return RPC_E_WRONG_THREAD;
    if (broken) return E_FAIL;
    if (!IsWindow(hwnd) || (window && window != hwnd)) return E_INVALIDARG;
    if (fullscreen) {
        reset();
        return S_OK;
    }
    // AppWindow reports negative caption insets for minimized HWNDs. They are
    // not usable layout measurements or an SDK failure. Keep the visible
    // window's last geometry; the restore resize will refresh it (and theme).
    if (IsIconic(hwnd)) {
        *geometry = lastGeometry;
        return S_OK;
    }
    const char* stage = "runtime check";
    try {
        if (!appWindow) {
            winrt::check_hresult(bootstrapResult);
            stage = "dispatcher creation";
            if (!Dispatching::DispatcherQueue::GetForCurrentThread()) {
                dispatcher = Dispatching::DispatcherQueueController::CreateOnCurrentThread();
            }
            stage = "customization support";
            if (!AppWindowTitleBar::IsCustomizationSupported()) winrt::throw_hresult(E_NOTIMPL);
            stage = "window interop";
            appWindow = AppWindow::GetFromWindowId(GetWindowIdFromWindow(hwnd));
            window = hwnd;
        }
        stage = "title-bar access";
        auto bar = appWindow.TitleBar();
        if (!extended) {
            // Mark first so a failure halfway through configuration resets the frame.
            extended = true;
            stage = "content extension";
            bar.ExtendsContentIntoTitleBar(true);
            stage = "preferred height";
            bar.PreferredHeightOption(TitleBarHeightOption::Tall);
        }
        stage = "caption colors";
        if (!themed || darkTheme != (dark != 0)) {
            const winrt::Windows::UI::Color transparent{0, 0, 0, 0};
            const winrt::Windows::UI::Color foreground = dark
                ? winrt::Windows::UI::Color{255, 245, 245, 245}
                : winrt::Windows::UI::Color{255, 24, 24, 24};
            const winrt::Windows::UI::Color inactive = dark
                ? winrt::Windows::UI::Color{255, 160, 160, 160}
                : winrt::Windows::UI::Color{255, 112, 112, 112};
            const winrt::Windows::UI::Color hover = dark
                ? winrt::Windows::UI::Color{255, 62, 62, 62}
                : winrt::Windows::UI::Color{255, 229, 229, 229};
            const winrt::Windows::UI::Color pressed = dark
                ? winrt::Windows::UI::Color{255, 78, 78, 78}
                : winrt::Windows::UI::Color{255, 210, 210, 210};
            bar.ButtonBackgroundColor(transparent);
            bar.ButtonInactiveBackgroundColor(transparent);
            bar.ButtonForegroundColor(foreground);
            bar.ButtonInactiveForegroundColor(inactive);
            bar.ButtonHoverBackgroundColor(hover);
            bar.ButtonHoverForegroundColor(foreground);
            bar.ButtonPressedBackgroundColor(pressed);
            bar.ButtonPressedForegroundColor(foreground);
            darkTheme = dark != 0;
            themed = true;
        }
        stage = "caption measurements";
        const auto dpi = GetDpiForWindow(hwnd);
        const auto height = bar.Height();
        const auto left = bar.LeftInset();
        const auto right = bar.RightInset();
        if (!dpi || height <= 0 || left < 0 || right < 0) {
            std::fprintf(stderr, "Caption measurements: dpi=%u height=%d left=%d right=%d minimized=%d\n", dpi, height, left, right, IsIconic(hwnd));
            winrt::throw_hresult(E_UNEXPECTED);
        }
        // Empty drag rectangles restore the SDK's default caption region. Pass
        // the header through to WebView2 instead; HTML's Tauri drag regions
        // handle empty-space dragging while controls receive their own input.
        // Refresh physical-pixel bounds on resize/DPI changes, excluding the
        // system caption buttons and their reserved insets.
        stage = "header input";
        RECT client{};
        if (!GetClientRect(hwnd, &client)) winrt::throw_last_error();
        const auto width = client.right - client.left - left - right;
        auto input = Input::InputNonClientPointerSource::GetForWindowId(appWindow.Id());
        if (width > 0) {
            input.SetRegionRects(Input::NonClientRegionKind::Passthrough,
                {winrt::Windows::Graphics::RectInt32{left, 0, width, height}});
        } else {
            input.ClearRegionRects(Input::NonClientRegionKind::Passthrough);
        }
        lastGeometry = {1, height, left, right, dpi};
        *geometry = lastGeometry;
        return S_OK;
    } catch (...) {
        const auto error = winrt::to_hresult();
        broken = true; // Never retry an SDK that failed while configuring the frame.
        reset();
        std::fprintf(stderr, "Native title bar unavailable during %s: 0x%08x\n", stage, static_cast<unsigned>(error));
        return error;
    }
}

extern "C" __declspec(dllexport) void taxmate_window_chrome_pointer_enter(HWND hwnd) noexcept {
    if (GetCurrentThreadId() != ownerThread || broken || !extended || hwnd != window
        || !IsWindow(hwnd) || IsIconic(hwnd)) return;
    POINT screen{};
    RECT client{};
    if (!GetCursorPos(&screen) || !GetClientRect(hwnd, &client)) return;
    auto pointer = screen;
    if (!ScreenToClient(hwnd, &pointer) || !PtInRect(&client, pointer)) return;
    // IPC can arrive after the pointer returns to a native caption button.
    if (pointer.y < lastGeometry.height
        && pointer.x >= client.right - lastGeometry.rightInset) return;
    // WebView2 consumes client mouse moves, so the SDK never sees the transition
    // out of its caption buttons. Report it through the SDK's parent input path.
    SendMessageW(hwnd, WM_NCMOUSEMOVE, HTCLIENT, MAKELPARAM(screen.x, screen.y));
}

extern "C" __declspec(dllexport) void taxmate_window_chrome_shutdown() noexcept {
    if (GetCurrentThreadId() != ownerThread) return;
    broken = true;
    if (window && IsWindow(window)) {
        // Forced app exit can precede HWND destruction. Restore appearance but
        // retain the SDK graph until process exit so its window callbacks stay valid.
        reset();
        return;
    }
    appWindow = nullptr;
    try {
        if (dispatcher) dispatcher.ShutdownQueue();
        dispatcher = nullptr;
        winrt::clear_factory_cache();
    } catch (...) {
        // Do not remove the package graph while an SDK queue can still run.
        std::fprintf(stderr, "Native title bar queue shutdown failed.\n");
        return;
    }
    if (bootstrapped) { MddBootstrapShutdown(); bootstrapped = false; }
    if (dependencyContext) { removeDependency(dependencyContext); dependencyContext = nullptr; }
    if (dependencyId) { deleteDependency(dependencyId); HeapFree(GetProcessHeap(), 0, dependencyId); dependencyId = nullptr; }
}
