# Pines for Windows (offline installer)

This folder wraps the web app in `../writings` into a normal Windows program (Electron + NSIS installer).
It makes **two installers**:

| File | For |
|---|---|
| `Pines-Setup-1.0.0-x64.exe` | 64-bit Windows |
| `Pines-Setup-1.0.0-ia32.exe` | 32-bit Windows |

## Easiest way: let GitHub build it (no Windows PC needed)

1. Push this repository to GitHub (the `.github/workflows/build-windows.yml` file must be in the repo root).
2. Open the repo → **Actions** → **Build Windows installers** → **Run workflow**.
3. When it finishes (about 5–10 minutes), open the run and download **pines-windows-installers**. It contains both `.exe` files.

To publish them as a release: create a tag named like `desktop-v1.0.0`. The workflow attaches both `.exe` files to that release.

## Build on your own Windows PC

1. Install Node.js 22 (nodejs.org). Internet is needed for this step only.
2. Open a terminal in this `desktop` folder and run:
   ```
   npm install
   npm run dist
   ```
3. The installers appear in `desktop/dist/`. Use `npm run dist:x64` or `npm run dist:ia32` to build just one.

To try the app without making an installer: `npm start`.

## What the build does

* `scripts/prepare.js` copies `../writings` into `desktop/app`, so the web app stays the single source of truth.
* `scripts/vendor.js` downloads the Google Fonts and the 3D library (three.js) once, and points the app at the local copies. After that the program needs no internet. The build stops with an error if any online-only reference is left.
* `main.js` opens the app in its own window. Web links and email links open in the user's browser.

## Things to know

* **Windows 10 or newer** is required (Electron no longer supports Windows 7/8).
* **32-bit end of line:** Electron 43 is the last version that ships 32-bit Windows builds, and it stops getting security fixes in January 2027. `package.json` is pinned to `~43.0.0` for that reason. The 64-bit installer can move to newer Electron versions at any time.
* **Unsigned installer:** Windows SmartScreen will show "Windows protected your PC" until you sign the installer with a code-signing certificate. Users can click *More info → Run anyway*.
* **Data is separate from the website.** Screenplays written in the desktop program are stored on that PC (in `%APPDATA%\Pines`) and are not shared with `pines.kalireads.in`. To move work between them, use Settings → Backup → Export / Import. Uninstalling keeps the data.
* **Online-only features** stay online-only: Google Drive scheduled backup and device transfer.
* **Table read voices** come from the voices installed in Windows. Tamil voices may need the Tamil language pack in Windows settings.
* To release a new version, change `"version"` in `package.json` and build again.
