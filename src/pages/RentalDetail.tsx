import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Rental } from "../types";
import { rentalService } from "../services/rentalService";
import { useOrder } from "../context/OrderContext";
import Toast from "../components/Toast";

export default function RentalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const { addOrder } = useOrder();
  const [showToast, setShowToast] = useState(false);

  // Default tanggal sewa (Hari ini - Besok)
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);

  useEffect(() => {
    if (id) {
      rentalService
        .getById(Number(id))
        .then(setRental)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const getDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  const handleBooking = () => {
    if (rental) {
      const days = getDays();
      addOrder({
        type: "RENTAL",
        title: `${rental.car_model} (${rental.company_name})`,
        subtitle: `Lepas Kunci • Asuransi`,
        pricePerUnit: rental.price_per_day,
        totalPrice: rental.price_per_day * days,
        dateRange: `${new Date(startDate).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        })} - ${new Date(endDate).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        })}`,
        durationInfo: `${days} Hari`,
        image: rental.image_url,
      });
      setShowToast(true);
      setTimeout(() => navigate("/orders"), 1500);
    }
  };

  if (loading || !rental)
    return <div className="p-10 text-center">Memuat...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {showToast && (
        <Toast
          message="Mobil berhasil disewa!"
          onClose={() => setShowToast(false)}
        />
      )}

      {/* --- HERO IMAGE (Sama seperti Hotel) --- */}
      <div className="h-80 relative bg-slate-900">
        {/* Gunakan object-contain dengan background gelap agar mobil terlihat jelas */}
        <img
          src={rental.image_url}
          className="w-full h-full object-contain p-8"
          alt={rental.car_model}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

        {/* Judul di atas gambar */}
        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-end">
              <div>
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-2 border border-white/20">
                  Lepas Kunci
                </div>
                <h1 className="text-3xl font-bold mb-1">{rental.car_model}</h1>
                <p className="opacity-90 text-sm flex items-center gap-2">
                  🏢 {rental.company_name} • 📍{" "}
                  {rental.rental_locations[0]?.city}
                </p>
              </div>
              <div className="bg-green-500 text-white px-3 py-1 rounded-lg font-bold text-xs shadow-lg">
                Tersedia
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        {/* Input Tanggal Sewa */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6">
          <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">
            Pilih Tanggal Sewa
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-400 block mb-1">
                Mulai
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-400 block mb-1">
                Selesai
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex items-end">
              <div className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl font-bold text-sm w-full text-center border border-blue-100">
                {getDays()} Hari
              </div>
            </div>
          </div>
        </div>

        {/* Fasilitas Grid */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3 text-slate-800">
            Spesifikasi & Fasilitas
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-2xl border border-slate-100 text-center shadow-sm">
              <div className="text-xl mb-1">💺</div>
              <div className="text-xs font-bold text-slate-600">
                4 ‑ 6 Kursi
              </div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-100 text-center shadow-sm">
              <div className="text-xl mb-1">⚙️</div>
              <div className="text-xs font-bold text-slate-600">
                Manual / Matic
              </div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-100 text-center shadow-sm">
              <div className="text-xl mb-1">❄️</div>
              <div className="text-xs font-bold text-slate-600">AC Dingin</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-100 text-center shadow-sm">
              <div className="text-xl mb-1">🛡️</div>
              <div className="text-xs font-bold text-slate-600">Asuransi</div>
            </div>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-6">
          <h3 className="font-bold text-lg mb-2 text-slate-800">
            Ketentuan Sewa
          </h3>
          <ul className="text-slate-500 text-sm list-disc pl-5 space-y-1">
            <li>Harga sudah termasuk PPN.</li>
            <li>Pengemudi wajib memiliki SIM A aktif.</li>
            <li>Pengembalian terlambat dikenakan denda per jam.</li>
            <li>Bensin dikembalikan pada posisi semula (Bar to Bar).</li>
          </ul>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-0.5">
              Total ({getDays()} Hari)
            </p>
            <span className="text-2xl font-bold text-blue-600">
              Rp {(rental.price_per_day * getDays()).toLocaleString("id-ID")}
            </span>
          </div>
          <button
            onClick={handleBooking}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg active:scale-95"
          >
            Sewa Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
