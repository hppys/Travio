import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Flights from "./pages/Flights";
import Hotels from "./pages/Hotels";
import Rentals from "./pages/Rentals";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";

// Import Detail Pages
import FlightDetail from "./pages/FlightDetail";
import HotelDetail from "./pages/HotelDetail";
import RentalDetail from "./pages/RentalDetail";
import TicketDetail from "./pages/TicketDetail"; // <-- IMPORT BARU

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-stone-50 font-sans antialiased text-stone-900">
        <Navbar />
        <main className="pb-20 pt-0 md:pt-20">
          <Routes>
            <Route path="/" element={<Flights />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/rentals" element={<Rentals />} />

            <Route path="/flights/:id" element={<FlightDetail />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/rentals/:id" element={<RentalDetail />} />

            {/* Rute Baru untuk E-Ticket */}
            <Route path="/tickets/:id" element={<TicketDetail />} />

            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
