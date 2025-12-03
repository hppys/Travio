import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate", // Update otomatis saat ada versi baru
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],

      // --- KONFIGURASI OFFLINE (WORKBOX) ---
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"], // Cache file statis lokal

        // Strategi Caching untuk Data Dinamis (API & Gambar)
        runtimeCaching: [
          {
            // 1. Cache API Backend (NetworkFirst)
            // Strategi: Coba ambil data terbaru dari internet.
            // Jika offline, gunakan data terakhir yang disimpan.
            urlPattern: /^https:\/\/api-ta-pbb-5o1x\.vercel\.app\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-data-cache",
              expiration: {
                maxEntries: 50, // Simpan maksimal 50 request
                maxAgeSeconds: 60 * 60 * 24 * 7, // Simpan selama 7 hari
              },
              networkTimeoutSeconds: 10, // Jika internet lambat > 10dtk, ambil dari cache
            },
          },
          {
            // 2. Cache Gambar Eksternal (CacheFirst)
            // Strategi: Cek cache dulu. Jika ada, pakai itu (hemat kuota/cepat).
            // Jika tidak ada, baru download. Cocok untuk Unsplash/Placehold.
            urlPattern: /^https:\/\/(images\.unsplash\.com|placehold\.co)\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "external-images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // Simpan 30 hari
              },
              cacheableResponse: {
                statuses: [0, 200], // Cache response sukses saja
              },
            },
          },
          {
            // 3. Cache Font Google (StaleWhileRevalidate)
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 tahun
              },
            },
          },
        ],
      },

      // --- MANIFEST APLIKASI ---
      manifest: {
        name: "Travio - Travel App",
        short_name: "Travio",
        description: "Aplikasi Booking Pesawat, Hotel, dan Rental",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "icon-192x192.jpg", // Pastikan file ini ada di folder public
            sizes: "192x192",
            type: "image/jpg",
          },
          {
            src: "icon-512x512.jpg", // Pastikan file ini ada di folder public
            sizes: "512x512",
            type: "image/jpg",
          },
          {
            src: "icon-512x512.jpg",
            sizes: "512x512",
            type: "image/jpg",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
