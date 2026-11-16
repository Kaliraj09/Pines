/* Pines service worker: makes the app work offline.
   After you change any app file, bump VERSION (or run: node make-sw-list.js). */
const VERSION = 'pines-v1794821520535';
const SHELL = [
 "./",
 "./assets/covers/avalin.jpg",
 "./assets/covers/carol.svg",
 "./assets/covers/crows.svg",
 "./assets/covers/danger.svg",
 "./assets/covers/jekyll.svg",
 "./assets/covers/kabuli.svg",
 "./assets/covers/kannagi.svg",
 "./assets/covers/macbeth.svg",
 "./assets/covers/monte.svg",
 "./assets/covers/necklace.svg",
 "./assets/covers/scandal.svg",
 "./assets/covers/telltale.svg",
 "./assets/covers/tenali.svg",
 "./assets/covers/timemachine.svg",
 "./assets/covers/treasure.svg",
 "./assets/covers/vetala.svg",
 "./assets/css/01-base.css",
 "./assets/css/02-report-detail.css",
 "./assets/css/03-ui3-display-type.css",
 "./assets/css/04-ui4-banners.css",
 "./assets/css/05-ui5-mobile-overrides.css",
 "./assets/css/06-ui6-details.css",
 "./assets/css/07-pro.css",
 "./assets/css/08-mint.css",
 "./assets/css/09-mobile.css",
 "./assets/css/10-mobile-fixes.css",
 "./assets/css/11-themes.css",
 "./assets/css/12-studio-tools.css",
 "./assets/css/13-scenes-toggle.css",
 "./assets/css/14-table-read.css",
 "./assets/css/15-registration-pay.css",
 "./assets/css/16-settings-tabs.css",
 "./assets/icons/apple-touch-icon.png",
 "./assets/icons/favicon-32.png",
 "./assets/icons/favicon.svg",
 "./assets/icons/icon-192.png",
 "./assets/icons/icon-512.png",
 "./assets/icons/icon-maskable.png",
 "./index.html",
 "./js/core/actions-project.js",
 "./js/core/actions-reports.js",
 "./js/core/actions-settings.js",
 "./js/core/actions.js",
 "./js/core/boot.js",
 "./js/core/duration.js",
 "./js/core/history-nav.js",
 "./js/core/persist-view.js",
 "./js/core/scene-heading.js",
 "./js/core/state-and-helpers.js",
 "./js/core/tanglish.js",
 "./js/data/library-registry.js",
 "./js/data/library/carol.js",
 "./js/data/library/crows.js",
 "./js/data/library/danger.js",
 "./js/data/library/jekyll.js",
 "./js/data/library/kabuli.js",
 "./js/data/library/kannagi.js",
 "./js/data/library/macbeth.js",
 "./js/data/library/monte.js",
 "./js/data/library/necklace.js",
 "./js/data/library/scandal.js",
 "./js/data/library/telltale.js",
 "./js/data/library/tenali.js",
 "./js/data/library/timemachine.js",
 "./js/data/library/treasure.js",
 "./js/data/library/vetala.js",
 "./js/data/pines-originals.js",
 "./js/export/pdf-pagination.js",
 "./js/services/backup-reminder.js",
 "./js/services/cookies-site-data.js",
 "./js/services/daily-snapshots.js",
 "./js/services/device-transfer.js",
 "./js/services/pin-lock.js",
 "./js/services/pwa-install.js",
 "./js/services/scheduled-backup.js",
 "./js/services/screenshot-watermark.js",
 "./js/ui/cool-fx.js",
 "./js/ui/first-time-tour.js",
 "./js/ui/mint-fx.js",
 "./js/ui/scroll-progress-fx.js",
 "./js/views/authorship-ledger.js",
 "./js/views/budget.js",
 "./js/views/characters.js",
 "./js/views/directors-notes-2.js",
 "./js/views/directors-notes.js",
 "./js/views/export-tab.js",
 "./js/views/export.js",
 "./js/views/find-replace.js",
 "./js/views/home.js",
 "./js/views/legal.js",
 "./js/views/library-shelf.js",
 "./js/views/library.js",
 "./js/views/pines-originals.js",
 "./js/views/pitch-deck.js",
 "./js/views/policies.js",
 "./js/views/project-dashboard.js",
 "./js/views/reports-hub.js",
 "./js/views/reports.js",
 "./js/views/revisions.js",
 "./js/views/roadmap.js",
 "./js/views/schedule.js",
 "./js/views/settings.js",
 "./js/views/table-read.js",
 "./js/views/visualize.js",
 "./js/views/write-tab.js",
 "./js/write/autocomplete.js",
 "./js/write/dual-dialogue.js",
 "./manifest.webmanifest"
];
const EXTERNAL = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION).then(c =>
      Promise.allSettled(SHELL.map(u => c.add(new Request(u, { cache: 'reload' }))))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('pines-') && k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  if (!same && !EXTERNAL.includes(url.hostname)) return; /* never touch Google Drive API etc. */

  /* Opening the app: try the network, fall back to the saved copy when offline. */
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put('./index.html', copy));
        return res;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  /* Everything else: serve the saved copy instantly, refresh it in the background. */
  e.respondWith(
    caches.open(VERSION).then(c =>
      c.match(req).then(hit => {
        const net = fetch(req).then(res => {
          if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone());
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    )
  );
});
