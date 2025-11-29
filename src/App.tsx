import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Flights from "./pages/Flights";
import Hotels from "./pages/Hotels";
import Rentals from "./pages/Rentals";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";

// Import Halaman Detail Baru (Nanti kita buat)
import FlightDetail from "./pages/FlightDetail.tsx";
import HotelDetail from "./pages/HotelDetail.tsx";
import RentalDetail from "./pages/RentalDetail.tsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
        <Navbar />
        <main className="pb-20 pt-0">
          <Routes>
            <Route path="/" element={<Flights />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/rentals" element={<Rentals />} />

            {/* RUTE DETAIL (BARU) */}
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
