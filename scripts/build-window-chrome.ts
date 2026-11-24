import { createHash } from "node:crypto";
import { copyFile, mkdir, rm } from "node:fs/promises";
import { join, resolve } from "node:path";

// Keep downloaded packages outside the directory Tauri bundles.
const root = resolve(import.meta.dir, "..");
const nativeRoot = join(root, "src-tauri");
const output = join(nativeRoot, "target/window-chrome");
const cache = join(nativeRoot, "target/window-chrome-cache");
const bootstrapName = "Microsoft.WindowsAppRuntime.Bootstrap.dll";
const licenseName = "WindowsAppSDK-LICENSE.txt";
const installerName = "windowsappruntimeinstall-x64.exe";
const foundationId = "microsoft.windowsappsdk.foundation";
const foundationVersion = "1.8.250906002";
const foundationHash =
  "77acb164613b71b55924e22f60da7c94f78ab9ebd426395f49e79ca3a0bea77c";
const runtimeVersion = "1.8.250907003";
const runtimeHash =
  "1386d53e21788360f6cdd37096d16124c728692c721453f92a25dae3e14c28c6";
const windowsTarget = "x86_64-pc-windows-msvc";

async function run(command: string[], env = process.env) {
  const child = Bun.spawn(command, {
    cwd: root,
    env,
    stdout: "inherit",
    stderr: "inherit",
  });
  const code = await child.exited;
  if (code !== 0) throw new Error(`${command[0]} exited with ${code}`);
}

async function download(url: string, path: string, expectedHash: string) {
  const file = Bun.file(path);
  const cached = await file.exists();
  let bytes: ArrayBuffer;
  if (cached) {
    bytes = await file.arrayBuffer();
  } else {
    console.log(`Downloading ${url}`);
    const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
    if (!response.ok)
      throw new Error(`Download failed (${response.status}): ${url}`);
    bytes = await response.arrayBuffer();
  }
  const hash = createHash("sha256").update(new Uint8Array(bytes)).digest("hex");
  if (hash !== expectedHash) {
    throw new Error(
      cached
        ? `Cached download has changed; remove and rebuild: ${path}`
        : `SHA-256 mismatch: ${url}`,
    );
  }
  if (!cached) await Bun.write(path, bytes);
}

async function stageRuntime() {
  const test = process.argv.includes("--test");
  if (process.platform !== "win32") {
    console.log("Staging the Windows App Runtime requires a Windows host.");
    if (test) process.exitCode = 1;
    return;
  }

  await mkdir(output, { recursive: true });
  // Avoid shipping the obsolete bridge when upgrading an existing build tree.
  await rm(join(output, "taxmate-window-chrome.dll"), { force: true });
  const arch = process.env.TAURI_ENV_ARCH ?? process.arch;
  const triple = process.env.TAURI_ENV_TARGET_TRIPLE;
  const supported =
    (arch === "x86_64" || arch === "x64") &&
    (!triple || triple === windowsTarget) &&
    process.arch === "x64";
  if (!supported) {
    for (const name of [bootstrapName, installerName, licenseName]) {
      await rm(join(output, name), { force: true });
    }
    await Bun.write(
      join(output, "README.txt"),
      `Native title bar unavailable for ${triple ?? arch}. TaxMate PH uses the standard Windows frame.\n`,
    );
    console.log(`Windows App Runtime staged only for ${windowsTarget}.`);
    if (test) process.exitCode = 1;
    return;
  }

  await mkdir(cache, { recursive: true });
  const sdkPackage = `${foundationId}.${foundationVersion}`;
  const foundationArchive = join(cache, `${sdkPackage}.zip`);
  const foundation = join(cache, sdkPackage);
  const bootstrap = join(foundation, "runtimes/win-x64/native", bootstrapName);
  const license = join(foundation, "license.txt");
  await download(
    `https://api.nuget.org/v3-flatcontainer/${foundationId}/${foundationVersion}/${sdkPackage}.nupkg`,
    foundationArchive,
    foundationHash,
  );

  const markerPath = join(foundation, ".ready");
  const marker = Bun.file(markerPath);
  if (
    !(await marker.exists()) ||
    (await marker.text()) !== foundationHash ||
    !(await Bun.file(bootstrap).exists()) ||
    !(await Bun.file(license).exists())
  ) {
    await rm(markerPath, { force: true });
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
        TAXMATE_SDK_ARCHIVE: foundationArchive,
        TAXMATE_SDK_DEST: foundation,
      },
    );
    await Bun.write(marker, foundationHash);
  }
  await copyFile(bootstrap, join(output, bootstrapName));
  await copyFile(license, join(output, licenseName));
  await Bun.write(
    join(output, "README.txt"),
    "TaxMate PH uses Windows App SDK 1.8 for the native title bar on x64. The standard Windows frame is available when the runtime cannot be loaded.\n",
  );

  if (process.argv.includes("--bundle-runtime")) {
    const installer = join(cache, installerName);
    await download(
      `https://aka.ms/windowsappsdk/1.8/${runtimeVersion}/${installerName}`,
      installer,
      runtimeHash,
    );
    await copyFile(installer, join(output, installerName));
  }

  console.log(`Windows App Runtime bootstrapper staged in ${output}`);
  if (test) {
    await run([
      "cargo",
      "test",
      "--manifest-path",
      join(nativeRoot, "Cargo.toml"),
      "--target",
      windowsTarget,
      "--lib",
      "window_chrome::native::tests::native_caption_lifecycle",
      "--",
      "--ignored",
      "--exact",
    ]);
  }
}

await stageRuntime();
