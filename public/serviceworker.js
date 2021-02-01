// so we dont have to reload pictures each time we go into the app
const CACHE_NAME = "version-1";
// offling is the url for when the page is down
const urlsToCache = [ 'index.html', 'offline.html' ];

const self = this;

// Install Service worker
// self is to refer to the this keyword 
// accepts the type of event and the function to be executed
// opening the cache and then adding the files we have loaded on the page into the cache
// returns a promise
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    )
});

// Listen for requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request) 
                    .catch(() => caches.match('offline.html'))
            })
    )
});

// Activate the Service worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
            
    )
});