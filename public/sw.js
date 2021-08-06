const STATIC_CACHE = 'cache-v0.1.8'
const dynamic_cache = 'dynamic-cache-v0.4'
const FILES_TO_CACHE = [
  '/',
  '/manifest.json',
  '/index.html',
  '/style.css',
  '/fallback.html',
  '/task-app.js',
  '/app.js',
  '/db.js',
  '/auth.js',
  '/tm_144.png',
  '/tm_192.png',
  '/tm_512.png',
]

// install Event
self.addEventListener('install', evt => {
  console.log('sw installed')
  evt.waitUntil(
  // waits until all the files are cached
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .catch(err => console.log('error', err)))}
)

// activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      console.log('service worker has been activated')
      return Promise.all(keys
          .filter(key => key !== STATIC_CACHE)
          .map(key => caches.delete(key)))
    })
  )
}
)

// fetch event 
self.addEventListener('fetch', evt => {
  console.log(evt.request.url)
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      // console.log(cacheRes.clone(), evt.request.url)
      return cacheRes ||
      fetch(evt.request)
        .then(fetchRes => {
          console.log(fetchRes.clone(), evt.request.url)
          return caches.open(dynamic_cache).then(cache => {
            if (evt.request.url.indexOf('fire') === -1
             && evt.request.url.indexOf('google') === -1)
            {
              cache.put(evt.request.url, fetchRes.clone())
            }
            return fetchRes
          })
        })
        .catch(err => console.log('page missing',evt.request.url))
    })
  )
})