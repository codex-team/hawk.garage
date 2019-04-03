/**
 * This file will be post-processed by WORKBOX plugin
 */

workbox.core.setCacheNameDetails({prefix: 'hawk.garage'});

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

if (workbox) {
  console.log(`Yay! Workbox is loaded`);
} else {
  console.log(`Boo! Workbox didn't load`);
}