import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Travel App PWA",
        short_name: "TravelApp",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png", // Pastikan file ini ada di folder public nanti
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
