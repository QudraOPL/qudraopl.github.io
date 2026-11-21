// غيّر رقم النسخة لما تعدّل أي ملف، عشان الموبايلات تاخد التحديث
const VERSION = 'qudra-v6';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'logo-white.png',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-180.png', 'icons/maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// الملفات بتاعة الأبلكيشن: من النت الأول، ولو مفيش نت من الكاش. بيانات الشيت دايماً من النت.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
