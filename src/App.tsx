import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Flights from "./pages/Flights";
import Hotels from "./pages/Hotels";
import Rentals from "./pages/Rentals";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";

import FlightDetail from "./pages/FlightDetail";
import HotelDetail from "./pages/HotelDetail";
import RentalDetail from "./pages/RentalDetail";

function App() {
  // State untuk mendeteksi status online/offline
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-stone-50 font-sans antialiased text-stone-900">
        <Navbar />

        {/* INDIKATOR OFFLINE */}
        {!isOnline && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
            📡 Mode Offline (Data Disimpan di HP)
          </div>
        )}

        <main className="pb-20 pt-0 md:pt-20">
          <Routes>
            <Route path="/" element={<Flights />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/rentals" element={<Rentals />} />

            <Route path="/flights/:id" element={<FlightDetail />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/rentals/:id" element={<RentalDetail />} />

            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
