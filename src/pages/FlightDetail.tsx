import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Flight } from "../types";
import { flightService } from "../services/flightService";
import { useOrder } from "../context/OrderContext";
import Toast from "../components/Toast";
import { FLIGHT_BG } from "../constants/images";

export default function FlightDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const { addOrder } = useOrder();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (id) {
      flightService
        .getById(Number(id))
        .then(setFlight)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleBooking = () => {
    if (flight) {
      addOrder({
        type: "FLIGHT",
        title: `${flight.airline} (${flight.departure_city} → ${flight.arrival_city})`,
        subtitle: `1 Penumpang • Economy`,
        pricePerUnit: flight.price,
        totalPrice: flight.price,
        dateRange: new Date(flight.departure_time).toLocaleDateString("id-ID"),
        durationInfo: flight.duration,
        image: flight.image_url,
      });
      setShowToast(true);
      setTimeout(() => navigate("/orders"), 1500);
    }
  };

  if (loading || !flight)
    return <div className="p-10 text-center">Memuat...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {showToast && (
        <Toast
          message="Berhasil dipesan! Mengalihkan..."
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Header Image */}
      <div className="h-64 w-full relative">
        <img src={FLIGHT_BG} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <div className="inline-block px-3 py-1 bg-blue-600 rounded-full text-xs font-bold mb-2">
            Penerbangan
          </div>
          <h1 className="text-3xl font-bold">{flight.airline}</h1>
          <p className="opacity-90">
            {flight.departure_city} ➝ {flight.arrival_city}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-10 relative z-10">
        {/* Ticket Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-dashed border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-800">
                  {flight.departure_city.substring(0, 3).toUpperCase()}
                </div>
                <div className="text-sm text-slate-500">
                  {new Date(flight.departure_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div className="flex-1 px-4 flex flex-col items-center">
                <span className="text-xs text-slate-400 mb-1">
                  {flight.duration}
                </span>
                <div className="w-full h-[2px] bg-slate-200 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-slate-400">
                    ✈
                  </span>
                </div>
                <span className="text-xs text-green-600 font-bold mt-1">
                  Langsung
                </span>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-800">
                  {flight.arrival_city.substring(0, 3).toUpperCase()}
                </div>
                <div className="text-sm text-slate-500">
                  {new Date(flight.arrival_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl">
              <img
                src={flight.image_url}
                className="w-12 h-12 object-contain bg-white rounded-xl shadow-sm"
              />
              <div>
                <h3 className="font-bold text-slate-800">{flight.airline}</h3>
                <p className="text-xs text-slate-500">
                  Airbus A320 • Economy Class
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 mb-3">Fasilitas</h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">🧳 Bagasi 20 kg</div>
              <div className="flex items-center gap-2">🍽️ Makanan</div>
              <div className="flex items-center gap-2">🔌 USB Port</div>
              <div className="flex items-center gap-2">🎬 Hiburan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Sticky */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 safe-area-bottom z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Total Harga</div>
            <div className="text-2xl font-bold text-blue-600">
              Rp {flight.price.toLocaleString("id-ID")}
            </div>
          </div>
          <button
            onClick={handleBooking}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Pesan Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
