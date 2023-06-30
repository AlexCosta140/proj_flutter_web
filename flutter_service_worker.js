'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "ded6e6cd8314a94d9bfb2a62ab69ed41",
"index.html": "d60c8a6cdb5921b79f7f096cdb619dfd",
"/": "d60c8a6cdb5921b79f7f096cdb619dfd",
"main.dart.js": "0cbeb3c4a844507b837363db7cde9ec1",
"flutter.js": "eb2682e33f25cd8f1fc59011497c35f8",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "d66dd901170988b7267c3552c097d2ab",
"assets/images/image_2_azul_semed.png": "8d337ab9d7b6f336572ead7834dd362c",
"assets/images/icon_som_reproduzindo.gif": "ef84f28b10d1d30f10b29b112e660075",
"assets/images/reme_segura_05_Homolog.png": "5b6e195c62d86e41f1092902550d0b0d",
"assets/images/icone_microfone.png": "143d0dec067d48fdec8510eda17aba65",
"assets/images/fundo_liso.jpeg": "2c578e8b1b5252ebf4c41929bbf49401",
"assets/images/fonte/montserrat-regular.ttf": "3fe868a1a9930b59d94d2c1d79461e3c",
"assets/images/group_2.png": "6bc9abfc02a7c3fe8010983cd3c5543f",
"assets/images/em_analise.png": "044ac23e69ba4d0eccf34004503faa0b",
"assets/images/horizonte.mp3": "0845ffd62ceb305076dc49b049143c15",
"assets/images/dias_melhores.mp3": "96c82825db6e82cc99262944493a1929",
"assets/images/logo_agetec.png": "6b1e2ca4f74f27866727be4b4c3978c3",
"assets/images/cheque_visto.png": "d418a3ce237f28e525113f071b8befd9",
"assets/images/group_2-confirma.png": "9b98004ffd09cd2ca21ba577282e3a19",
"assets/images/image_2.png": "8a47cc32ad4d999ec28925a96297bb7f",
"assets/images/exclamation.png": "bd5d3b5df94882767267a5b44b0fb889",
"assets/images/reme_segura_05.png": "c58e0b20092da06a9005d4580db3fcf4",
"assets/images/logo_agetec_azul.png": "230ca0b3402049cad6e7cd7d56a651ac",
"assets/images/sirene.mp3": "45c09bb329f12d613ee51c2ca4ea82e9",
"assets/images/ic_launcher.png": "9865fb0212a56626a52c3024e743ac66",
"assets/images/18199.png": "ae167e31f1a8606d02d06297301058b2",
"assets/images/eeeon.mp3": "7f87d71d41eed49a67a6700a711962eb",
"assets/images/login.jpeg": "79b78f070ece97ad3e2707c76fa8e36d",
"assets/images/reme_segura_05_azul.png": "520b7d1e1efddd4ed28db289a9c958f9",
"assets/images/beep1.mp3": "b14591b4d93c818785840e99e0fe76da",
"assets/AssetManifest.json": "b53e266164e705139586e45938afee72",
"assets/NOTICES": "769b9df0b9a434818d804c0fa460a3a9",
"assets/FontManifest.json": "9e63646014493740b20c1e23e359320a",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
