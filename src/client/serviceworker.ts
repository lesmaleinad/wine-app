/// <reference lib="webworker" />
export default null;
declare let self: ServiceWorkerGlobalScope;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker
            .register('client/serviceWorker.js')
            .then((res) => console.log('service worker registered'))
            .catch((err) => console.log('service worker not registered', err));
    });
}

const CACHE_NAME = `static-cache`;
const filesToCache = ['/'];

/**
 * Cache files on install
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        (async function () {
            const cache = await caches.open(CACHE_NAME);
            await cache.addAll(filesToCache);
        })()
    );
});

/**
 * Delete outdated caches when activated
 */
self.addEventListener('activate', (event) => {
    self.clients.claim();

    event.waitUntil(
        (async function () {
            // Remove old caches.
            const promises = (await caches.keys()).map((cacheName) => {
                if (CACHE_NAME !== cacheName) {
                    return caches.delete(cacheName);
                }
            });

            await Promise.all<any>(promises);
        })()
    );
});

/**
 * Reply with cached data when possible
 */
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }
    event.respondWith(
        (async function () {
            const cachedResponse = await caches.match(event.request, {
                ignoreSearch: true,
            });
            return cachedResponse || fetch(event.request);
        })()
    );
});
