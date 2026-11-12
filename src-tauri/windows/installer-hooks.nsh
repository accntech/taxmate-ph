; Adapted from Suki apps/dining/src-tauri/windows/installer-hooks.nsh (MIT declared in package.json).
; Source commit: 072f8ef0b8c360906875fcd3388b44cef3c88198. Native appearance only; no application data access.
; The runtime is shared with other apps. Never uninstall it with TaxMate PH.
; Keep installation per-user and do not force-close other Windows App SDK apps.
!macro NSIS_HOOK_POSTINSTALL
  Push $0
  IfFileExists "$INSTDIR\window-chrome\windowsappruntimeinstall-x64.exe" 0 taxmate_runtime_done
  DetailPrint "Installing the Windows App Runtime for TaxMate PH's optional native titlebar..."
  ClearErrors
  ExecWait '"$INSTDIR\window-chrome\windowsappruntimeinstall-x64.exe" --quiet' $0
  IfErrors taxmate_runtime_failed
  StrCmp $0 "0" taxmate_runtime_done
  DetailPrint "Windows App Runtime returned $0. TaxMate PH can still use the standard Windows titlebar."
  Goto taxmate_runtime_done
  taxmate_runtime_failed:
  DetailPrint "Windows App Runtime could not start. TaxMate PH can still use the standard Windows titlebar."
  taxmate_runtime_done:
  ClearErrors
  Pop $0
!macroend
