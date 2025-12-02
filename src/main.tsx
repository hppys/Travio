import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA Install Prompt Handler
let deferredPrompt: Event | null = null;

window.addEventListener("beforeinstallprompt", (e: Event) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log("Install prompt available");

  // Tampilkan tombol install jika ada
  const installButton = document.getElementById("install-button");
  if (installButton) {
    installButton.style.display = "block";
  }
});

// Handle install button click
document.addEventListener("DOMContentLoaded", () => {
  const installButton = document.getElementById("install-button");
  if (installButton) {
    installButton.addEventListener("click", async () => {
      if (deferredPrompt && deferredPrompt instanceof Event) {
        const promptEvent = deferredPrompt as any;
        promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        deferredPrompt = null;
      }
    });
  }
});
