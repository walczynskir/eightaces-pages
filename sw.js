const cachePrefix = 'eight-aces-offline-';
const cacheName = cachePrefix + '1.5.0';
const scope = self.registration.scope;
const assetNames = [
  'index.html', 'credits.html', 'version.json', 'manifest.webmanifest',
  'logo.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable.png', 'apple-touch-icon.png',
  'style.css', 'shared-palettes.css', 'themes.css', 'shared-game.css', 'pasjans.css',
  'shared-victory.css', 'games-chest-menu.css', 'theme-gallery.css',
  'app.js', 'engine.js', 'locales.js', 'i18n.js', 'strings.js', 'game-help.js',
  'shared-victory.js', 'games-chest-menu.js', 'credits.js',
  'garden.webp', 'tropics.webp', 'beach.webp', 'orange-grove.webp',
  'copper-table.webp', 'copper-portrait.webp', 'andromeda-portrait.webp'
];
const assets = new Set(assetNames.map(name => new URL(name, scope).href));

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll([...assets].map(url => new Request(url, { cache: 'reload' })));
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

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
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
