const CACHE = 'ot-calc-v13';
const FILES = [
  './index.html',
  './manifest.json',
  './icon.svg'
];

// ติดตั้ง: cache ไฟล์ทั้งหมด
// ไม่ skipWaiting อัตโนมัติ — รอคำสั่งจากหน้าเว็บก่อน
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  // ไม่เรียก self.skipWaiting() ที่นี่
  // เพื่อให้แอปแสดง banner "มีอัปเดต" ก่อน แล้วค่อย activate
});

// Activate: ลบ cache เก่า
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: ตอบจาก cache ก่อน (offline-first)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// รับคำสั่งจากหน้าเว็บ: เมื่อผู้ใช้กด "อัปเดตเดี๋ยวนี้"
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
