// Definindo o nome da versão do cache
const CACHE_NAME = "pwa-cache-v1";

// Arquivos críticos a serem cacheados na instalação
const staticAssets = [
  "/",
  "index.html",
  "/css/main.css",
  "/css/plugins.css",
  "/js/all.js",
  "/js/plugins.js",
  "/img/icon-192x192.png",
  "/img/icon-512x512.png",
  "/img/12.webp",
  "/img/hero.webp",
  "/img/thiago.webp",
  "/img/selo.svg",
  "/img/halteres.png",
];

// Evento de instalação: cacheando arquivos críticos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: cacheando arquivos críticos");
      return cache.addAll(staticAssets);
    })
  );
});

// Evento de ativação: removendo caches antigos
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("Service Worker: limpando caches antigos");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento de fetch: buscando recursos do cache, com fallback para a rede
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((fetchResponse) => {
          // Cache dinâmico para recursos não críticos
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request.url, fetchResponse.clone());
            return fetchResponse;
          });
        })
      );
    })
  );
});
