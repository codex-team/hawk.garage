/* eslint-disable no-undef */

/**
 * This file will be post-processed by WORKBOX plugin
 */

workbox.core.setCacheNameDetails({ prefix: 'hawk.garage' });

// Workbox generates precache manifest and write it in self.__precacheManifest
workbox.precaching.precacheAndRoute(self.__precacheManifest);

// Return a specific response for all navigation requests.
workbox.routing.registerNavigationRoute('/index.html');

// Don't wait until old service worker stop
workbox.core.skipWaiting();

// Claim any currently available clients once the service worker becomes active
workbox.core.clientsClaim();

// Cache all images (such as favicons)
workbox.routing.registerRoute(
  /\.(png|jpg|jpeg|svg|gif)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images.
        maxEntries: 20,
        // Cache for a maximum of a week.
        maxAgeSeconds: 7 * 24 * 60 * 60
      })
    ]
  })
);

if (workbox) {
  console.log('Hawk worker loaded');
} else {
  console.log('Hawk worker didn\'t load');
}
