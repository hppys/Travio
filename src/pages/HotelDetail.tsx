import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Hotel } from "../types";
import { hotelService } from "../services/hotelService";
import { useOrder } from "../context/OrderContext";
import Toast from "../components/Toast";

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const { addOrder } = useOrder();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (id) {
      hotelService
        .getById(Number(id))
        .then(setHotel)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleBooking = () => {
    if (hotel) {
      addOrder({
        type: "HOTEL",
        title: hotel.name,
        subtitle: `1 Malam • Standard Room`,
        pricePerUnit: hotel.price_per_night,
        totalPrice: hotel.price_per_night,
        dateRange: new Date().toLocaleDateString("id-ID"),
        durationInfo: "1 Malam",
        image: hotel.image_url,
      });
      setShowToast(true);
      setTimeout(() => navigate("/orders"), 1500);
    }
  };

  if (loading || !hotel)
    return <div className="p-10 text-center">Memuat...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {showToast && (
        <Toast
          message="Kamar berhasil dipesan!"
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Hero Image */}
      <div className="h-80 relative">
        <img src={hotel.image_url} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold mb-1">{hotel.name}</h1>
              <p className="opacity-90 text-sm flex items-center gap-1">
                📍 {hotel.hotel_locations[0]?.city},{" "}
                {hotel.hotel_locations[0]?.country}
              </p>
            </div>
            <div className="bg-white text-slate-900 px-3 py-1 rounded-lg font-bold text-sm flex items-center gap-1">
              ⭐ {hotel.rating}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        {/* Fasilitas */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3 text-slate-800">
            Fasilitas Populer
          </h3>
          <div className="flex flex-wrap gap-2">
            {hotel.hotel_facilities.map((fac, i) => (
              <span
                key={i}
                className="bg-white border border-slate-200 px-3 py-1.5 rounded-full text-sm text-slate-600"
              >
                {fac.facility}
              </span>
            ))}
          </div>
        </div>

        {/* Deskripsi */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-6">
          <h3 className="font-bold text-lg mb-2 text-slate-800">
            Tentang Akomodasi
          </h3>
          <p className="text-slate-500 leading-relaxed text-sm">
            Nikmati pengalaman menginap yang tak terlupakan di {hotel.name}.
            Lokasi strategis di pusat {hotel.hotel_locations[0]?.city}{" "}
            memudahkan Anda menjangkau berbagai destinasi menarik. Kamar bersih,
            pelayanan ramah, dan fasilitas lengkap siap memanjakan Anda.
          </p>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-blue-600">
              Rp {hotel.price_per_night.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-slate-400 block">/ malam</span>
          </div>
          <button
            onClick={handleBooking}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Pilih Kamar
          </button>
        </div>
      </div>
    </div>
  );
}
