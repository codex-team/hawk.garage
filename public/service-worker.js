/* eslint-disable no-undef */

/**
 * This file will be post-processed by WORKBOX plugin
 */

workbox.core.setCacheNameDetails({ prefix: 'hawk.garage' });
workbox.precaching.precacheAndRoute(self.__precacheManifest);

workbox.routing.registerNavigationRoute('/index.html');

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
  console.log('Yay! Workbox is loaded');
} else {
  console.log('Boo! Workbox didn\'t load');
}
