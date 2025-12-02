import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").then(
      (registration) => {
        console.log("ServiceWorker registration successful:", registration);
      },
      (error) => {
        console.log("ServiceWorker registration failed:", error);
      }
    );
  });
}

// Handle install prompt - GUNAKAN VARIABLE INI
let deferredPrompt: any = null;

window.addEventListener("beforeinstallprompt", (e: any) => {
  e.preventDefault();
  deferredPrompt = e;

  // Tampilkan tombol install
  const installButton = document.getElementById("install-button");
  if (installButton) {
    installButton.style.display = "block";
    installButton.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
      }
    });
  }
});
