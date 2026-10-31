/* Service Worker: legt die App auf dem Gerät ab – ab dem zweiten Besuch kommt fast alles aus dem
   Zwischenspeicher, und die App läuft auch offline.

   - Startseite (index.html): erst das Netz (höchstens NET_WAIT ms), sonst die gespeicherte Fassung.
     Kommt sie aus dem Netz, werden alle darin genannten Dateien gespeichert und nicht mehr genannte entfernt.
   - Dateien mit ?v=<Version>: aus dem Speicher – eine neue Version hat eine neue Adresse.
   - Dateien ohne ?v= (z. B. Schriften aus der CSS): aus dem Speicher, im Hintergrund aufgefrischt.

   Muss bei neuen Versionen nicht geändert werden: welche Dateien dazugehören, steht in index.html.
   Nur für die App selbst – Testseiten (tools/test/, labor/) gehen immer direkt ans Netz. */
'use strict';
const CACHE = 'sk-app';
const NET_WAIT = 1500;
const SCOPE = new URL(self.registration.scope);
const isApp = (url) => url.origin === SCOPE.origin && (url.pathname === SCOPE.pathname || url.pathname === `${SCOPE.pathname}index.html`);

// Alle Dateien, die index.html und die CSS nennen (Skripte, CSS, Bilder, Schriften).
async function refsOf(html) {
  const refs = [...html.matchAll(/(?:src|href)="((?:css|js|data|assets)\/[^"]+)"/g)].map((m) => new URL(m[1], SCOPE).href);
  for (const css of refs.filter((u) => /\.css(\?|$)/.test(u))) {
    try {
      const res = await fetch(css);
      const text = await res.clone().text();
      await (await caches.open(CACHE)).put(css, res);
      [...text.matchAll(/url\("?([^")]+)"?\)/g)].forEach((m) => !m[1].startsWith('data:') && refs.push(new URL(m[1], css).href));
    } catch (e) {
      /* offline – beim nächsten Mal */
    }
  }
  return refs;
}

// Nach einer frischen Startseite: fehlende Dateien laden, veraltete löschen.
async function sync(html) {
  const cache = await caches.open(CACHE);
  const refs = await refsOf(html);
  const keep = new Set(refs.concat(SCOPE.href));
  const have = new Set((await cache.keys()).map((r) => r.url));
  await Promise.all(refs.filter((u) => !have.has(u)).map((u) => cache.add(u).catch(() => {})));
  await Promise.all([...have].filter((u) => !keep.has(u)).map((u) => cache.delete(u)));
}

async function page(ev) {
  const cache = await caches.open(CACHE);
  const net = fetch(ev.request).then(async (res) => {
    if (res.ok) {
      const html = await res.clone().text();
      await cache.put(SCOPE.href, res.clone());
      ev.waitUntil(sync(html));
    }
    return res;
  });
  ev.waitUntil(net.catch(() => {}));
  const stored = await cache.match(SCOPE.href);
  if (!stored) return net;
  const late = new Promise((r) => setTimeout(() => r(stored), NET_WAIT));
  return Promise.race([net.catch(() => stored), late]);
}

async function asset(ev) {
  const cache = await caches.open(CACHE);
  const stored = await cache.match(ev.request);
  const versioned = new URL(ev.request.url).searchParams.has('v');
  if (stored && versioned) return stored;
  const net = fetch(ev.request).then((res) => {
    if (res.ok) return cache.put(ev.request, res.clone()).then(() => res);
    return res;
  });
  if (stored) {
    ev.waitUntil(net.catch(() => {}));
    return stored;
  }
  return net;
}

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (ev) => ev.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== SCOPE.origin) return;
  if (req.mode === 'navigate') {
    if (isApp(url)) ev.respondWith(page(ev));
    return;
  }
  // Nur Dateien, die die App-Seite lädt – nicht die der Testseiten.
  ev.respondWith(
    (ev.clientId ? self.clients.get(ev.clientId) : Promise.resolve(null)).then((c) => (c && isApp(new URL(c.url)) ? asset(ev) : fetch(req)))
  );
});
