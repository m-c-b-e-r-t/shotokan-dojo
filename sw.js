/* Der Offline-Speicher (v1.41.0) ist wieder abgeschaltet. Diese Datei bleibt nur, damit Geräte,
   die ihn schon installiert haben, ihn loswerden: Der Browser lädt beim nächsten Besuch diese
   Fassung, sie löscht den Zwischenspeicher und meldet sich ab. Keine Anfragen werden abgefangen. */
'use strict';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
  );
});
