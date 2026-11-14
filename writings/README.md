# Pines – Screenplay Studio (the software)

`index.html` is only a thin shell: it links the CSS files and loads the JS files **in a fixed order**.
Everything else lives in `assets/`, `js/` and `data/`. The landing page (`../index.html`) is untouched.

## Folder map

```
writings/
├─ index.html                      shell: <div id="app"> + <link> CSS + <script> JS (order matters)
├─ assets/
│  ├─ css/01-…16-*.css             stylesheets, loaded in this numeric order (later files override earlier ones)
│  ├─ covers/*.webp                library book covers
│  └─ icons/                       favicon.svg, favicon-32.png, apple-touch-icon.png
└─ js/
   ├─ core/                        state, helpers, scene parser, Tamil engine, actions (A), boot
   ├─ views/                       one file per screen / sidebar menu
   ├─ write/                       Write-tab engine: autocomplete, dual dialogue
   ├─ export/                      PDF page breaks
   ├─ services/                    backup, PIN lock, snapshots, device transfer, cookies, PWA install, watermark
   ├─ ui/                          tour, visual effects
   └─ data/                        library-registry.js + library/<book>.js (one file per reference screenplay)
```

## Sidebar menu → file

| Menu | File |
|---|---|
| Home sidebar: Dashboard / New screenplay | `js/views/home.js` |
| Home sidebar: Library | `js/views/library.js`, `library-shelf.js`, `js/data/library/*.js` |
| Home sidebar: Settings | `js/views/settings.js`, `js/services/device-transfer.js` |
| Project sidebar (menu list + tab router `body()`) | `js/views/project-dashboard.js` |
| Write | `js/views/write-tab.js`, `js/write/*`, `js/views/find-replace.js`, `revisions.js` |
| Reports | `js/views/reports-hub.js`, `reports.js` |
| Schedule | `js/views/schedule.js` |
| Budget | `js/views/budget.js` |
| Characters | `js/views/characters.js` |
| Director's notes | `js/views/directors-notes.js`, then `directors-notes-2.js` (replaces its screen) |
| Visualize | `js/views/visualize.js` |
| Table read | `js/views/table-read.js` |
| Pitch deck | `js/views/pitch-deck.js` |
| Legal | `js/views/legal.js` |
| Export | `js/views/export-tab.js`, `js/views/export.js`, `js/export/pdf-pagination.js` |
| Versions / Details | `js/core/actions-project.js`, `js/views/project-dashboard.js` |

## Rules when editing

* These are classic scripts sharing one global scope (same as the old single file). Keep the `<script>` order in `index.html`.
* To add a new reference screenplay: create `js/data/library/<id>.js` containing `LIBSCR.push({...})`, add its cover to `assets/covers/`, and add one `<script>` line after the other library books.
* To add a new stylesheet: add a `<link>` after the last one so it overrides earlier rules.
* Click actions (`data-a="…"`) are filled into the `A` object by `js/core/actions-settings.js`, `actions-project.js`, `actions-reports.js`; the packs added by individual views are merged in `core/boot.js`.
* `core/boot.js` runs last and opens Home (or the PIN lock). Anything that needs the whole app ready goes before it.
