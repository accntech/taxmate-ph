import { createHash } from "node:crypto";
import { copyFile, mkdir, readdir, unlink } from "node:fs/promises";
import { join, resolve } from "node:path";

// Only this directory is bundled. Keep SDKs, object files and import libraries outside it.
const nativeRoot = resolve(import.meta.dir, "../src-tauri");
const output = join(nativeRoot, "target/window-chrome");
const cache = join(nativeRoot, "target/window-chrome-cache");
const dllName = "taxmate-window-chrome.dll";
const bootstrapName = "Microsoft.WindowsAppRuntime.Bootstrap.dll";
const installerName = "windowsappruntimeinstall-x64.exe";
const packages = [
  [
    "microsoft.windowsappsdk.base",
    "1.8.250831001",
    "76c20ad89f166ef204cd698648d1b160ded1d71607aeebcfb8303e1a539a4937",
  ],
  [
    "microsoft.windowsappsdk.foundation",
    "1.8.250906002",
    "77acb164613b71b55924e22f60da7c94f78ab9ebd426395f49e79ca3a0bea77c",
  ],
  [
    "microsoft.windowsappsdk.interactiveexperiences",
    "1.8.250906004",
    "454b682994bbbcf3f5029f42fa1aebff72b0bb29dde1ca6e1e99cae264c74451",
  ],
] as const;
const runtimeVersion = "1.8.250907003";
const runtimeHash =
  "1386d53e21788360f6cdd37096d16124c728692c721453f92a25dae3e14c28c6";

async function run(command: string[], env = process.env) {
  const child = Bun.spawn(command, {
    cwd: cache,
    env,
    stdout: "inherit",
    stderr: "inherit",
  });
  const code = await child.exited;
  if (code !== 0) throw new Error(`${command[0]} exited with ${code}`);
}

async function download(url: string, path: string, expectedHash: string) {
  if (!(await Bun.file(path).exists())) {
    console.log(`Downloading ${url}`);
    const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
    if (!response.ok)
      throw new Error(`Download failed (${response.status}): ${url}`);
    const bytes = await response.arrayBuffer();
    if (
      createHash("sha256").update(new Uint8Array(bytes)).digest("hex") !==
      expectedHash
    ) {
      throw new Error(`SHA-256 mismatch: ${url}`);
    }
    await Bun.write(path, bytes);
  }
  const bytes = await Bun.file(path).arrayBuffer();
  if (
    createHash("sha256").update(new Uint8Array(bytes)).digest("hex") !==
    expectedHash
  ) {
    throw new Error(`Cached download has changed; remove and rebuild: ${path}`);
  }
}

async function build() {
  if (process.platform !== "win32") {
    console.log(
      "Native Windows title bar: build and C++ tests require a Windows x64 MSVC host.",
    );
    return;
  }
  await mkdir(output, { recursive: true });
  await mkdir(cache, { recursive: true });
  const arch = process.env.TAURI_ENV_ARCH ?? process.arch;
  const triple = process.env.TAURI_ENV_TARGET_TRIPLE;
  const supported =
    (arch === "x86_64" || arch === "x64") &&
    (!triple || triple === "x86_64-pc-windows-msvc") &&
    process.arch === "x64";
  if (!supported) {
    // A previous x64 build must never leak into a fallback-only package.
    for (const name of [dllName, bootstrapName, installerName]) {
      await unlink(join(output, name)).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== "ENOENT") throw error;
      });
    }
    await Bun.write(
      join(output, "README.txt"),
      `Native titlebar unavailable for ${triple ?? arch}. TaxMate PH uses the standard Windows frame.\n`,
    );
    console.warn(
      `Window chrome: ${triple ?? arch} uses the standard Windows frame (x64 MSVC only).`,
    );
    if (process.argv.includes("--test"))
      console.warn(
        "Native C++ title-bar tests skipped: this target is unsupported.",
      );
    return;
  }

  for (const [id, version, hash] of packages) {
    const destination = join(cache, `${id}.${version}`);
    const archive = join(cache, `${id}.${version}.zip`);
    await download(
      `https://api.nuget.org/v3-flatcontainer/${id}/${version}/${id}.${version}.nupkg`,
      archive,
      hash,
    );
    const marker = Bun.file(join(destination, ".ready"));
    if ((await marker.exists()) && (await marker.text()) === hash) continue;
    console.log(`Preparing ${id} ${version}`);
    await run(
      [
        "powershell.exe",
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        "$ErrorActionPreference = 'Stop'; Expand-Archive -LiteralPath $env:TAXMATE_SDK_ARCHIVE -DestinationPath $env:TAXMATE_SDK_DEST -Force",
      ],
      {
        ...process.env,
        TAXMATE_SDK_ARCHIVE: archive,
        TAXMATE_SDK_DEST: destination,
      },
    );
    await Bun.write(marker, hash);
  }

  const foundation = join(cache, `${packages[1][0]}.${packages[1][1]}`);
  const interactive = join(cache, `${packages[2][0]}.${packages[2][1]}`);
  const programFiles = process.env["ProgramFiles(x86)"];
  if (!programFiles)
    throw new Error(
      "ProgramFiles(x86) is unavailable; MSVC and Windows SDK are required.",
    );
  const discovery = Bun.spawn(
    [
      join(programFiles, "Microsoft Visual Studio/Installer/vswhere.exe"),
      "-latest",
      "-products",
      "*",
      "-requires",
      "Microsoft.VisualStudio.Component.VC.Tools.x86.x64",
      "-property",
      "installationPath",
    ],
    { stdout: "pipe", stderr: "inherit" },
  );
  const vs = (await new Response(discovery.stdout).text()).trim();
  if ((await discovery.exited) !== 0 || !vs)
    throw new Error("MSVC C++ build tools are required.");
  const version = (
    await Bun.file(
      join(vs, "VC/Auxiliary/Build/Microsoft.VCToolsVersion.default.txt"),
    ).text()
  ).trim();
  const vc = join(vs, "VC/Tools/MSVC", version);
  const sdk = join(programFiles, "Windows Kits/10");
  const sdkVersion = (await readdir(join(sdk, "Include")))
    .filter((value) => /^10\.0\.\d+\.0$/.test(value))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .at(-1);
  if (!sdkVersion) throw new Error("Windows 10/11 SDK is required.");
  const generated = join(cache, "generated");
  await mkdir(generated, { recursive: true });
  await run([
    join(sdk, "bin", sdkVersion, "x64/cppwinrt.exe"),
    "-input",
    join(interactive, "metadata/10.0.18362.0"),
    "-input",
    join(foundation, "metadata"),
    "-reference",
    "sdk",
    "-output",
    generated,
  ]);
  const env = {
    ...process.env,
    INCLUDE: [
      join(vc, "include"),
      ...["ucrt", "shared", "um", "winrt", "cppwinrt"].map((part) =>
        join(sdk, "Include", sdkVersion, part),
      ),
      generated,
      join(foundation, "include"),
      join(interactive, "include"),
    ].join(";"),
    LIB: [
      join(vc, "lib/x64"),
      ...["ucrt", "um"].map((part) =>
        join(sdk, "Lib", sdkVersion, part, "x64"),
      ),
      join(foundation, "lib/native/x64"),
    ].join(";"),
  };
  await run(
    [
      join(vc, "bin/Hostx64/x64/cl.exe"),
      "/nologo",
      "/std:c++20",
      "/EHsc",
      "/MT",
      "/O2",
      "/LD",
      "/DUNICODE",
      "/D_UNICODE",
      join(nativeRoot, "windows/window-chrome.cpp"),
      `/Fe:${join(cache, dllName)}`,
      "/link",
      "windowsapp.lib",
      "user32.lib",
      "comctl32.lib",
      "dwmapi.lib",
      "Microsoft.WindowsAppRuntime.Bootstrap.lib",
    ],
    env,
  );
  await copyFile(join(cache, dllName), join(output, dllName));
  await copyFile(
    join(foundation, "runtimes/win-x64/native", bootstrapName),
    join(output, bootstrapName),
  );
  await copyFile(
    join(foundation, "license.txt"),
    join(output, "WindowsAppSDK-LICENSE.txt"),
  );
  await Bun.write(
    join(output, "README.txt"),
    "TaxMate PH window chrome: Windows App SDK 1.8, x64 MSVC. Runtime installation is optional; the app falls back to the standard Windows frame.\n",
  );

  // Only release packaging downloads the offline installer. Never execute it on the build host.
  if (process.argv.includes("--bundle-runtime")) {
    const installer = join(cache, installerName);
    await download(
      `https://aka.ms/windowsappsdk/1.8/${runtimeVersion}/${installerName}`,
      installer,
      runtimeHash,
    );
    await copyFile(installer, join(output, installerName));
  }
  console.log(`Window chrome built: ${join(output, dllName)}`);
  if (process.argv.includes("--test")) {
    const testExecutable = join(cache, "window-chrome-test.exe");
    await run(
      [
        join(vc, "bin/Hostx64/x64/cl.exe"),
        "/nologo",
        "/std:c++20",
        "/EHsc",
        "/MT",
        "/O2",
        "/DUNICODE",
        "/D_UNICODE",
        join(nativeRoot, "windows/window-chrome.test.cpp"),
        `/Fe:${testExecutable}`,
        "/link",
        "windowsapp.lib",
        "user32.lib",
        "ole32.lib",
        "Microsoft.WindowsAppRuntime.Bootstrap.lib",
      ],
      env,
    );
    await copyFile(join(output, bootstrapName), join(cache, bootstrapName));
    await run([testExecutable]);
  }
}

await build();
