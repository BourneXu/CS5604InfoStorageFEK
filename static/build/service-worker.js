/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

importScripts(
<<<<<<< HEAD
  "/static/build/precache-manifest.d8859110e34ef16cee0d46e105e90f8a.js"
=======
  "/static/build/precache-manifest.09c8570948aa63c98ed2e7955e4ce28b.js"
>>>>>>> 9e98de0ceaedd3070a4676d278f7a8bc63f2c84b
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/static/build/index.html"), {
  
<<<<<<< HEAD
  blacklist: [/^\/_/,/\/[^\/?]+\.[^\/]+$/],
=======
  blacklist: [/^\/_/,/\/[^/?]+\.[^/]+$/],
>>>>>>> 9e98de0ceaedd3070a4676d278f7a8bc63f2c84b
});
