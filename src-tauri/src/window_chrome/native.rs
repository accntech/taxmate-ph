//! Ported from the C++/WinRT bridge adapted from Suki's dining app (MIT).
//! Source commit: 072f8ef0b8c360906875fcd3388b44cef3c88198.

mod bindings;
mod color;
mod runtime;
#[cfg(test)]
mod tests;

use self::bindings::{
    AppWindow, AppWindowTitleBar, DispatcherQueue, DispatcherQueueController,
    InputNonClientPointerSource, NonClientRegionKind, TitleBarHeightOption, WindowId,
};
use super::{geometry, Geometry};
use std::{cell::RefCell, ptr::null_mut};
use windows::{Graphics::RectInt32, UI::Color};
use windows_core::{Error, Result, HRESULT};
use windows_sys::{
    w,
    Win32::{
        Foundation::{E_FAIL, E_INVALIDARG, E_NOTIMPL, E_UNEXPECTED, HWND, POINT, RECT},
        Graphics::Gdi::{PtInRect, ScreenToClient},
        System::LibraryLoader::{GetProcAddress, LoadLibraryW},
        UI::{
            HiDpi::GetDpiForWindow,
            WindowsAndMessaging::{
                GetClientRect, GetCursorPos, IsIconic, IsWindow, SendMessageW, HTCLIENT,
                WM_NCMOUSEMOVE,
            },
        },
    },
};

#[derive(Clone, Copy, Default)]
pub(super) struct CaptionGeometry {
    pub(super) extended: bool,
    pub(super) height: i32,
    pub(super) left_inset: i32,
    pub(super) right_inset: i32,
    pub(super) dpi: u32,
}

struct Chrome {
    app_window: Option<AppWindow>,
    dispatcher: Option<DispatcherQueueController>,
    hwnd: HWND,
    extended: bool,
    dark_theme: Option<bool>,
    last_geometry: CaptionGeometry,
    broken: bool,
}

thread_local! {
    // WinRT objects belong to the UI thread. Use a fallible borrow because
    // caption updates may synchronously dispatch window messages.
    static CHROME: RefCell<Option<Chrome>> = const { RefCell::new(None) };
}

pub(super) fn initialize() {
    if !cfg!(all(target_arch = "x86_64", target_env = "msvc")) {
        return;
    }
    match Chrome::initialize() {
        Ok(chrome) => CHROME.set(Some(chrome)),
        Err(error) => eprintln!("Using the standard Windows frame: {error}"),
    }
}

pub(super) fn sync(hwnd: HWND, dark: bool, fullscreen: bool) -> Geometry {
    CHROME.with(|state| {
        let Ok(mut state) = state.try_borrow_mut() else {
            return Geometry::default();
        };
        state
            .as_mut()
            .and_then(|chrome| chrome.sync(hwnd, dark, fullscreen).ok())
            .map(geometry)
            .unwrap_or_default()
    })
}

pub(super) fn pointer_enter(hwnd: HWND) {
    CHROME.with(|state| {
        if let Ok(state) = state.try_borrow() {
            if let Some(chrome) = state.as_ref() {
                chrome.pointer_enter(hwnd);
            }
        }
    });
}

pub(super) fn shutdown() {
    CHROME.with(|state| {
        if let Ok(mut state) = state.try_borrow_mut() {
            // Keep the borrow while shutdown pumps messages so new syncs are ignored.
            drop(state.take());
        }
    });
}

impl Chrome {
    fn initialize() -> Result<Self> {
        runtime::initialize()?;
        Ok(Self {
            app_window: None,
            dispatcher: None,
            hwnd: null_mut(),
            extended: false,
            dark_theme: None,
            last_geometry: CaptionGeometry::default(),
            broken: false,
        })
    }

    fn sync(&mut self, hwnd: HWND, dark: bool, fullscreen: bool) -> Result<CaptionGeometry> {
        if self.broken {
            return Err(Error::from_hresult(HRESULT(E_FAIL)));
        }
        // SAFETY: the caller supplies an HWND on this UI thread.
        if unsafe { IsWindow(hwnd) } == 0 || (!self.hwnd.is_null() && self.hwnd != hwnd) {
            return Err(Error::from_hresult(HRESULT(E_INVALIDARG)));
        }
        if fullscreen {
            self.reset();
            return Ok(CaptionGeometry::default());
        }
        // Minimized windows report unusable caption insets. The last visible
        // geometry keeps the WebView layout stable until the restore resize.
        if unsafe { IsIconic(hwnd) } != 0 {
            return Ok(self.last_geometry);
        }
        match self.configure(hwnd, dark) {
            Ok(geometry) => {
                self.last_geometry = geometry;
                Ok(geometry)
            }
            Err(error) => {
                self.broken = true;
                self.reset();
                eprintln!("Using the standard Windows frame: {error}");
                Err(error)
            }
        }
    }

    fn configure(&mut self, hwnd: HWND, dark: bool) -> Result<CaptionGeometry> {
        if self.app_window.is_none() {
            match DispatcherQueue::GetForCurrentThread() {
                Ok(_) => {}
                // windows-core represents a successful nullable interface as an empty error.
                Err(error) if error.code().is_ok() => {
                    self.dispatcher = Some(DispatcherQueueController::CreateOnCurrentThread()?);
                }
                Err(error) => return Err(error),
            }
            if !AppWindowTitleBar::IsCustomizationSupported()? {
                return Err(Error::from_hresult(HRESULT(E_NOTIMPL)));
            }
            self.app_window = Some(AppWindow::GetFromWindowId(window_id(hwnd)?)?);
            self.hwnd = hwnd;
        }

        let app_window = self
            .app_window
            .as_ref()
            .ok_or_else(|| Error::from_hresult(HRESULT(E_UNEXPECTED)))?;
        let bar = app_window.TitleBar()?;
        if !self.extended {
            // Record the attempted extension so failures partway through also reset.
            self.extended = true;
            bar.SetExtendsContentIntoTitleBar(true)?;
            bar.SetPreferredHeightOption(TitleBarHeightOption::Tall)?;
        }
        if self.dark_theme != Some(dark) {
            apply_caption_colors(&bar, dark)?;
            self.dark_theme = Some(dark);
        }

        let height = bar.Height()?;
        let left_inset = bar.LeftInset()?;
        let right_inset = bar.RightInset()?;
        // SAFETY: the HWND has been validated and belongs to the calling thread.
        let dpi = unsafe { GetDpiForWindow(hwnd) };
        if dpi == 0 || height <= 0 || left_inset < 0 || right_inset < 0 {
            return Err(Error::new(
                HRESULT(E_UNEXPECTED),
                format!("Invalid caption measurements: {height}px tall, insets {left_inset}/{right_inset}px, DPI {dpi}"),
            ));
        }

        let client = client_rect(hwnd)?;
        let width = client.right - client.left - left_inset - right_inset;
        let input = InputNonClientPointerSource::GetForWindowId(app_window.Id()?)?;
        if width > 0 {
            // Let WebView2 receive header input. Windows owns the caption buttons.
            input.SetRegionRects(
                NonClientRegionKind::Passthrough,
                &[RectInt32 {
                    X: left_inset,
                    Y: 0,
                    Width: width,
                    Height: height,
                }],
            )?;
        } else {
            input.ClearRegionRects(NonClientRegionKind::Passthrough)?;
        }

        Ok(CaptionGeometry {
            extended: true,
            height,
            left_inset,
            right_inset,
            dpi,
        })
    }

    fn reset(&mut self) {
        if let Some(window) = self.app_window.as_ref().filter(|_| self.extended) {
            let clear_input = window
                .Id()
                .and_then(InputNonClientPointerSource::GetForWindowId)
                .and_then(|input| input.ClearRegionRects(NonClientRegionKind::Passthrough));
            let reset_bar = window.TitleBar().and_then(|bar| bar.ResetToDefault());
            if let Err(error) = clear_input.and(reset_bar) {
                eprintln!("Could not reset the native title bar: {error}");
            }
        }
        self.extended = false;
        self.dark_theme = None;
        self.last_geometry = CaptionGeometry::default();
    }

    fn pointer_enter(&self, hwnd: HWND) {
        // SAFETY: these calls run on the HWND's owning thread, and RECT/POINT
        // values are stack allocated for the duration of each Win32 call.
        unsafe {
            if self.broken
                || !self.extended
                || hwnd != self.hwnd
                || IsWindow(hwnd) == 0
                || IsIconic(hwnd) != 0
            {
                return;
            }
            let Ok(client) = client_rect(hwnd) else {
                return;
            };
            let mut screen = POINT::default();
            if GetCursorPos(&mut screen) == 0 {
                return;
            }
            let mut pointer = screen;
            if ScreenToClient(hwnd, &mut pointer) == 0 || PtInRect(&client, pointer) == 0 {
                return;
            }
            // The IPC can arrive after the cursor has returned to a native button.
            if pointer.y < self.last_geometry.height
                && pointer.x >= client.right - self.last_geometry.right_inset
            {
                return;
            }
            // WebView2 consumes client mouse moves. Notify the parent frame that
            // the pointer moved off its caption buttons.
            let position = u32::from(screen.x as u16) | (u32::from(screen.y as u16) << 16);
            SendMessageW(hwnd, WM_NCMOUSEMOVE, HTCLIENT as usize, position as isize);
        }
    }

    #[cfg(test)]
    fn caption_is_extended(&self) -> Result<bool> {
        self.app_window
            .as_ref()
            .ok_or_else(|| Error::from_hresult(HRESULT(E_UNEXPECTED)))?
            .TitleBar()?
            .ExtendsContentIntoTitleBar()
    }

    #[cfg(test)]
    fn passthrough_is_empty(&self) -> Result<bool> {
        let window = self
            .app_window
            .as_ref()
            .ok_or_else(|| Error::from_hresult(HRESULT(E_UNEXPECTED)))?;
        let input = InputNonClientPointerSource::GetForWindowId(window.Id()?)?;
        Ok(input
            .GetRegionRects(NonClientRegionKind::Passthrough)?
            .is_empty())
    }
}

impl Drop for Chrome {
    fn drop(&mut self) {
        // SAFETY: destruction is serialized on the UI thread.
        if !self.hwnd.is_null() && unsafe { IsWindow(self.hwnd) } != 0 {
            self.reset();
            // Forced exit may run while the HWND can still dispatch SDK callbacks.
            std::mem::forget(self.app_window.take());
            std::mem::forget(self.dispatcher.take());
            return;
        }
        self.app_window = None;
        if let Some(dispatcher) = self.dispatcher.take() {
            if let Err(error) = dispatcher.ShutdownQueue() {
                eprintln!("Could not shut down the Windows App SDK dispatcher: {error}");
            }
        }
    }
}

fn apply_caption_colors(bar: &AppWindowTitleBar, dark: bool) -> Result<()> {
    let gray = |shade| {
        color::reference(Color {
            A: 255,
            R: shade,
            G: shade,
            B: shade,
        })
    };
    let transparent = color::reference(Color {
        A: 0,
        R: 0,
        G: 0,
        B: 0,
    });
    let foreground = gray(if dark { 245 } else { 24 });
    let inactive = gray(if dark { 160 } else { 112 });
    let hover = gray(if dark { 62 } else { 229 });
    let pressed = gray(if dark { 78 } else { 210 });
    bar.SetButtonBackgroundColor(&transparent)?;
    bar.SetButtonInactiveBackgroundColor(&transparent)?;
    bar.SetButtonForegroundColor(&foreground)?;
    bar.SetButtonInactiveForegroundColor(&inactive)?;
    bar.SetButtonHoverBackgroundColor(&hover)?;
    bar.SetButtonHoverForegroundColor(&foreground)?;
    bar.SetButtonPressedBackgroundColor(&pressed)?;
    bar.SetButtonPressedForegroundColor(&foreground)
}

fn client_rect(hwnd: HWND) -> Result<RECT> {
    let mut rect = RECT::default();
    // SAFETY: the caller supplies a live HWND and a writable RECT.
    if unsafe { GetClientRect(hwnd, &mut rect) } == 0 {
        Err(Error::from_win32())
    } else {
        Ok(rect)
    }
}

fn window_id(hwnd: HWND) -> Result<WindowId> {
    type GetWindowIdFromWindow = unsafe extern "system" fn(HWND, *mut WindowId) -> i32;

    // SAFETY: This is the HWND interop entry point from the pinned SDK's
    // Microsoft.UI.Interop.h. The SDK DLL stays loaded for the process lifetime.
    unsafe {
        let module = LoadLibraryW(w!("Microsoft.Internal.FrameworkUdk.dll"));
        if module.is_null() {
            return Err(Error::from_win32());
        }
        let symbol = GetProcAddress(module, c"Windowing_GetWindowIdFromWindow".as_ptr().cast())
            .ok_or_else(Error::from_win32)?;
        let get_window_id: GetWindowIdFromWindow = std::mem::transmute(symbol);
        let mut id = WindowId::default();
        HRESULT(get_window_id(hwnd, &mut id)).ok()?;
        Ok(id)
    }
}
