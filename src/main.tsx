import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { OrderProvider } from "./context/OrderContext"; // Import ini

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <OrderProvider>
      {" "}
      {/* Bungkus App di sini */}
      <App />
    </OrderProvider>
  </React.StrictMode>
);
