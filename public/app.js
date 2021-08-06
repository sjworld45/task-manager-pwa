if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(reg => console.log('service worker registered'))
    .catch(err => console.log('sw not registered', err))
}