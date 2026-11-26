const cachePrefix = 'eight-aces-offline-';
const cacheName = cachePrefix + '1.12.3';
const scope = self.registration.scope;
const assetNames = [
  "shared-theme-components.css",
  "game-update.js",
  "game-install.js",
  "shared-footer.css",
  "shared-footer.js",
  "card-backs.css",
  "games-chest/domino-icon.png",

  "statistics-reset.js",
  "progress-summary.css",
  'progress-bar.css', 'progress-bar.js',
  'games-chest/games.json',
  'games-chest/sudoku-logo.svg',
  'games-chest/domino-logo.svg',
  'games-chest/eightaces-icon.png',
  'games-chest/garibaldka-icon.png',
  'games-chest/gomoku-icon.png',
  'games-chest/kierki-icon.png',

  'index.html', 'credits.html', 'version.json', 'manifest.webmanifest',
  'logo.svg', 'favicon.ico', 'favicon-32.png', 'favicon-48.png', 'settings-gear.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable.png', 'apple-touch-icon.png',
  'style.css', 'shared-settings.css', 'shared-palettes.css', 'themes.css', 'shared-game.css', 'pasjans.css',
  'shared-victory.css', 'games-chest-menu.css', 'theme-gallery.css',
  'app.js', 'settings-strings.js', 'shared-preferences.js', 'shared-progress-backup.js', 'progress-backup.js', 'preferences-strings.js', 'results.js', 'move-worker.js', 'engine.js', 'locales.js', 'i18n.js', 'strings.js', 'game-help.js',
  'shared-victory.js', 'games-chest-menu.js', 'credits.js',
  'garden.webp', 'tropics.webp', 'beach.webp', 'orange-grove.webp',
  'copper-table.webp', 'copper-portrait.webp', 'starry-sky.webp', 'andromeda-portrait.webp'
];
const assets = new Set(assetNames.map(name => new URL(name, scope).href));

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    try {
      await cache.addAll([...assets].map(url => new Request(url, { cache: 'reload' })));
    } catch {
      // A transient failure in one request makes addAll reject the entire batch.
      // Recover without activating until every required offline asset is present.
      const pending = [...assets];
      for (let index = 0; index < pending.length; index += 8) {
        await Promise.all(pending.slice(index, index + 8).map(async url => {
          if (await cache.match(url)) return;
          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              await cache.add(new Request(url, { cache: 'reload' }));
              return;
            } catch (error) {
              if (attempt === 2) throw error;
              await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 450));
            }
          }
        }));
      }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(cachePrefix) && key !== cacheName)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'game-update-activate') event.waitUntil(self.skipWaiting());
  if (event.data === 'game-update-version') event.ports[0]?.postMessage(cacheName.slice(cachePrefix.length));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.href === new URL('version.json?check-update=1', scope).href) return;
  url.search = '';
  url.hash = '';
  const key = url.href === scope ? new URL('index.html', scope).href : url.href;
  // Serve a consistent release, including versioned asset URLs and gallery queries.
  if (!assets.has(key)) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    return await cache.match(key) ?? fetch(event.request);
  })());
});
