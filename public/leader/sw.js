// 주도주 스크리너 PWA 서비스워커.
// 셸(앱 자원)은 캐시 우선(오프라인 가능), 데이터(latest.json)는 네트워크 우선(항상 최신).
const CACHE = "leader-screener-v19";  // bump on shell(index.html/app.js/styles.css) 변경 → 기기 셸 캐시 갱신
const SHELL = [
  "./index.html",
  "./styles.css",
  "./app.js",
  "./coins.html",
  "./manifest.webmanifest",
  "./lib/lightweight-charts.standalone.production.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  // addAll은 하나라도 404면 통째로 실패한다 — 셸 목록이 어긋나도 설치는 되도록 개별 add.
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // 리서치 목록(API)과 스냅샷 데이터는 항상 최신을 받아야 한다 → 네트워크 우선, 실패 시 캐시.
  // 데이터는 leader.starfolio.io 오리진이라 pathname 으로만 판별한다.
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.includes("/data/latest") ||
    url.pathname.endsWith("/data/coins.json") ||
    url.pathname.endsWith("/data/exports.json") ||
    url.pathname.endsWith("/data/thermometer.json")
  ) {
    e.respondWith(
      fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  // 셸: 캐시 우선 → 네트워크
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
});
