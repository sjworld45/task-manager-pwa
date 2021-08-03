const CACHE_NAME = 'cache-v0.1'
const dynamic_cache = 'dynamic-cache-v0.0'
const FILES_TO_CACHE = [
    'app.js',
    'manifest.json',
    'index.html',
    'fallback.html',
    'auth.json',
    'tm_144.png',
    'tm_512.png'
]


self.addEventListener('install', e => e.waitUntil(
  // add or addAll goes out to the server gets the files to be cached
  caches.open(CACHE_NAME).then(c => c.addAll(FILES_TO_CACHE))));

// activate event
self.addEventListener('activate', e => {
  // waitUnitl waits for the callback to finish
  e.waitUntil(
      caches.keys().then(keys => {
        console.log('service worker has been activated');
        return Promise.all(keys
          .filter(key => key !== CACHE_NAME && key != dynamic_cache)
          .map(key => caches.delete(key)))
      })
    )
})

// fetching from cache or server
self.addEventListener('fetch', e => e.respondWith(
  caches.match(e.request).then((r) => {
    return r ||
    // dynamic caching lets us cache all requests that are not part of the precache
     fetch(e.request).then(fetchRes => {
      return caches.open(dynamic_cache).then(cache => {
        cache.put(e.request.url, fetchRes.clone());
        return fetchRes;
      })
    }).catch(() => { 
      //fallbacks to a page only when the request is for a page
      if (e.request.url.indexOf('.html') > -1)
      {
        return caches.match('/fallback.html')
      }
      // else if (e.request.url.indexOf('.png'))
    })
  })
));