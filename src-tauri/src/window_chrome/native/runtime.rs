use std::{
    os::windows::ffi::OsStrExt,
    path::PathBuf,
    ptr::{null, null_mut},
};
use windows_core::{Error, Result, HRESULT};
use windows_sys::{
    core::{PCWSTR, PWSTR},
    w,
    Win32::{
        Foundation::{FreeLibrary, E_FAIL, HMODULE},
        Security::PSID,
        Storage::Packaging::Appx::{
            PackageDependencyLifetimeKind_Process, PackageDependencyProcessorArchitectures_X64,
            PACKAGEDEPENDENCY_CONTEXT, PACKAGE_VERSION,
        },
        System::{
            LibraryLoader::{
                GetModuleHandleW, GetProcAddress, LoadLibraryExW, LOAD_LIBRARY_SEARCH_DEFAULT_DIRS,
                LOAD_LIBRARY_SEARCH_DLL_LOAD_DIR,
            },
            Memory::{GetProcessHeap, HeapFree},
        },
    },
};

type CreateDependency = unsafe extern "system" fn(
    PSID,
    PCWSTR,
    PACKAGE_VERSION,
    i32,
    i32,
    PCWSTR,
    i32,
    *mut PWSTR,
) -> i32;
type AddDependency =
    unsafe extern "system" fn(PCWSTR, i32, i32, *mut PACKAGEDEPENDENCY_CONTEXT, *mut PWSTR) -> i32;
type RemoveDependency = unsafe extern "system" fn(PACKAGEDEPENDENCY_CONTEXT) -> i32;
type DeleteDependency = unsafe extern "system" fn(PCWSTR) -> i32;

const BOOTSTRAP_DLL: &str = "Microsoft.WindowsAppRuntime.Bootstrap.dll";
const APP_SDK_1_8: u32 = 0x0001_0008;

pub(super) fn initialize() -> Result<()> {
    // Keep the SDK package graph alive for the process. WinRT factory caches and
    // dispatcher callbacks can outlive both the HWND and the last Chrome instance.
    bootstrap().or_else(|bootstrap_error| {
        use_installed_framework().map_err(|fallback_error| {
            Error::new(
                fallback_error.code(),
                format!("App Runtime bootstrap: {bootstrap_error}. Installed framework: {fallback_error}"),
            )
        })
    })
}

fn bootstrap_path() -> std::io::Result<PathBuf> {
    let executable = std::env::current_exe()?;
    let packaged = executable
        .with_file_name("window-chrome")
        .join(BOOTSTRAP_DLL);
    #[cfg(any(debug_assertions, test))]
    if !packaged.is_file() {
        return Ok(PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("target")
            .join("window-chrome")
            .join(BOOTSTRAP_DLL));
    }
    Ok(packaged)
}

fn bootstrap() -> Result<()> {
    let path = bootstrap_path()?;
    let wide: Vec<u16> = path.as_os_str().encode_wide().chain(Some(0)).collect();
    // SAFETY: Load from the application's absolute resource path. The pinned SDK
    // header defines this export as WINAPI with PACKAGE_VERSION passed by value.
    unsafe {
        let module = LoadLibraryExW(
            wide.as_ptr(),
            null_mut(),
            LOAD_LIBRARY_SEARCH_DLL_LOAD_DIR | LOAD_LIBRARY_SEARCH_DEFAULT_DIRS,
        );
        if module.is_null() {
            return Err(Error::from_win32());
        }
        let result = bootstrap_module(module);
        if result.is_err() {
            FreeLibrary(module);
        }
        result
    }
}

unsafe fn bootstrap_module(module: HMODULE) -> Result<()> {
    type Initialize = unsafe extern "system" fn(u32, PCWSTR, PACKAGE_VERSION, i32) -> i32;
    let symbol = GetProcAddress(module, c"MddBootstrapInitialize2".as_ptr().cast())
        .ok_or_else(Error::from_win32)?;
    let initialize: Initialize = std::mem::transmute(symbol);
    HRESULT(initialize(
        APP_SDK_1_8,
        null(),
        PACKAGE_VERSION::default(),
        0,
    ))
    .ok()
}

fn use_installed_framework() -> Result<()> {
    // SAFETY: These four Windows 11 exports are optional. Their signatures match
    // appmodel.h, and the handles and allocated ID are cleaned up on failure.
    unsafe {
        let kernel = GetModuleHandleW(w!("kernelbase.dll"));
        if kernel.is_null() {
            return Err(Error::from_win32());
        }
        let create = GetProcAddress(kernel, c"TryCreatePackageDependency".as_ptr().cast());
        let add = GetProcAddress(kernel, c"AddPackageDependency".as_ptr().cast());
        let remove = GetProcAddress(kernel, c"RemovePackageDependency".as_ptr().cast());
        let delete = GetProcAddress(kernel, c"DeletePackageDependency".as_ptr().cast());
        let (Some(create), Some(add), Some(remove), Some(delete)) = (create, add, remove, delete)
        else {
            return Err(Error::from_hresult(HRESULT(E_FAIL)));
        };
        let create: CreateDependency = std::mem::transmute(create);
        let add: AddDependency = std::mem::transmute(add);
        let remove: RemoveDependency = std::mem::transmute(remove);
        let delete: DeleteDependency = std::mem::transmute(delete);
        let mut id = null_mut();
        HRESULT(create(
            null_mut(),
            w!("Microsoft.WindowsAppRuntime.1.8_8wekyb3d8bbwe"),
            PACKAGE_VERSION::default(),
            PackageDependencyProcessorArchitectures_X64,
            PackageDependencyLifetimeKind_Process,
            null(),
            0,
            &mut id,
        ))
        .ok()?;
        let mut context = null_mut();
        let result = HRESULT(add(id, 0, 0, &mut context, null_mut())).ok();
        if result.is_err() {
            if !context.is_null() {
                remove(context);
            }
            delete(id);
        }
        HeapFree(GetProcessHeap(), 0, id.cast());
        result
    }
}
