import { useEffect, useState } from "react";
import type { Rental } from "../types";
import { rentalService } from "../services/rentalService";
import { useOrder } from "../context/OrderContext";
import Toast from "../components/Toast";

export default function Rentals() {
  const [allRentals, setAllRentals] = useState<Rental[]>([]);
  const [filteredRentals, setFilteredRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [showToast, setShowToast] = useState(false);
  const { addOrder } = useOrder();

  const [location, setLocation] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    rentalService
      .getAll()
      .then((data) => {
        setAllRentals(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const locations = Array.from(
    new Set(allRentals.map((r) => r.rental_locations[0]?.city))
  )
    .filter(Boolean)
    .sort();

  const getDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const results = allRentals.filter((rental) => {
        const rentalCity = rental.rental_locations[0]?.city || "";
        const isLocationMatch = location
          ? rentalCity.toLowerCase().includes(location.toLowerCase())
          : true;
        return isLocationMatch;
      });
      setFilteredRentals(results);
      setHasSearched(true);
      setLoading(false);
    }, 600);
  };

  const handleResetSearch = () => {
    setHasSearched(false);
    setFilteredRentals([]);
  };

  const handleBooking = () => {
    if (selectedRental) {
      const days = getDays();
      addOrder({
        type: "RENTAL",
        title: `${selectedRental.car_model} (${selectedRental.company_name})`,
        subtitle: `Lepas Kunci • Asuransi`,
        pricePerUnit: selectedRental.price_per_day,
        totalPrice: selectedRental.price_per_day * days,
        dateRange: `${new Date(startDate).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        })} - ${new Date(endDate).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        })}`,
        durationInfo: `${days} Hari`,
        image: selectedRental.image_url,
      });
      setSelectedRental(null);
      setShowToast(true);
    }
  };

  // --- SEARCH MODE (STATIS / ESTETIK MOBILE) ---
  if (!hasSearched) {
    return (
      <div className="relative w-full h-dvh flex items-center justify-center overflow-hidden bg-slate-900">
        {/* BACKGROUND FIXED & ESTETIK */}
        <div className="fixed inset-0 w-full h-full z-0">
          <img
            src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&q=80&w=2128"
            alt="Rental Background"
            className="w-full h-full object-cover object-center scale-[1.02]"
          />
          {/* Overlay Gradient Vertikal */}
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/70 backdrop-blur-[1px]"></div>
        </div>

        {/* KONTEN UTAMA (Padding top 'pt-20' di mobile) */}
        <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 pt-20 pb-24 lg:py-0">
          <div className="text-white text-center lg:text-left max-w-xl animate-in slide-in-from-left-10 duration-700">
            <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold mb-4 lg:mb-6 tracking-wider uppercase border border-white/30 shadow-lg">
              🚗 Drive Your Way
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 lg:mb-6 leading-tight drop-shadow-2xl">
              Sewa Mobil Aman <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-cyan-200">
                Tanpa Supir.
              </span>
            </h1>
          </div>

          <div className="w-full max-w-[480px] animate-in slide-in-from-bottom-10 duration-700 delay-200">
            <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-4xl shadow-2xl shadow-black/20 border border-white/50 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                  Mulai Sewa
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-slate-500 ml-3 uppercase tracking-wider mb-1 block">
                      Lokasi Pengambilan
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-blue-600">
                        📍
                      </span>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl pl-12 pr-4 py-3.5 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Pilih Kota</option>
                        {locations.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 ml-3 uppercase tracking-wider">
                        Mulai
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 ml-3 uppercase tracking-wider">
                        Selesai
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 flex items-center justify-between text-blue-800 text-sm font-bold border border-blue-100">
                    <span>Durasi Sewa</span>
                    <span>⏱ {getDays()} Hari</span>
                  </div>
                  <button
                    onClick={handleSearch}
                    className="w-full bg-linear-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-all active:scale-95 mt-4"
                  >
                    🔍 Cari Mobil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LIST HASIL (SCROLLABLE) ---
  return (
    <div
      className={`max-w-7xl mx-auto p-4 sm:p-6 ${
        selectedRental
          ? "overflow-hidden h-screen"
          : "pb-24 bg-slate-50 min-h-screen relative z-10"
      }`}
    >
      {showToast && (
        <Toast
          message="Mobil berhasil disewa!"
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm rounded-2xl p-4 mb-6 flex items-center justify-between animate-in slide-in-from-top-5">
        <div
          onClick={handleResetSearch}
          className="cursor-pointer group w-full"
        >
          <div className="flex items-center gap-2 text-blue-600 mb-1 group-hover:translate-x-1 transition-transform">
            <span className="text-xs font-bold">← Ganti Pencarian</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <div className="font-bold text-slate-800 text-sm sm:text-base">
                {location || "Semua Kota"}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {new Date(startDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                -{" "}
                {new Date(endDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                • {getDays()} Hari
              </div>
            </div>
            <div className="text-2xl opacity-10">🚗</div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-24">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="font-bold text-slate-800">Sedang mencari mobil...</h3>
        </div>
      )}
      {!loading && filteredRentals.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm px-6">
          <div className="text-6xl mb-4 opacity-80">🚗</div>
          <h3 className="text-xl font-bold text-slate-800">
            Mobil tidak tersedia
          </h3>
          <button
            onClick={handleResetSearch}
            className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 rounded-full font-bold text-sm hover:bg-blue-100 transition"
          >
            Cari Lagi
          </button>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRentals.map((car) => (
            <div
              key={car.id}
              onClick={() => setSelectedRental(car)}
              className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col cursor-pointer"
            >
              <div className="h-48 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                <img
                  src={car.image_url}
                  alt={car.car_model}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 relative z-10"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://placehold.co/300x200?text=Car")
                  }
                />
                <div className="absolute inset-0 bg-linear-to-tr from-slate-100/50 to-white/0"></div>
              </div>
              <div className="flex-1 px-1">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 leading-tight">
                      {car.car_model}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {car.company_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block text-lg font-extrabold text-blue-600">
                      Rp {car.price_per_day.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      /hari
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] rounded-lg font-bold border border-slate-100">
                    4 Kursi
                  </span>
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] rounded-lg font-bold border border-slate-100">
                    Manual
                  </span>
                </div>
              </div>
              <button className="w-full mt-5 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm group-hover:bg-blue-600 transition-colors shadow-md">
                Pilih Mobil
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail */}
      {selectedRental && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={() => setSelectedRental(null)}
          ></div>
          <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-4xl shadow-2xl animate-in zoom-in-95 duration-200 p-6 sm:p-8 no-scrollbar">
            <button
              onClick={() => setSelectedRental(null)}
              className="absolute top-5 right-5 bg-slate-100 text-slate-500 w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200 transition z-20 font-bold"
            >
              ✕
            </button>
            <div className="text-center mb-8 pt-2">
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
                Rental Mobil
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
                {selectedRental.car_model}
              </h2>
              <p className="text-slate-500 font-medium">
                {selectedRental.company_name}
              </p>
            </div>
            <div className="bg-slate-50 h-56 rounded-3xl flex items-center justify-center mb-8 relative overflow-hidden border border-slate-100">
              <img
                src={selectedRental.image_url}
                className="w-full h-full object-contain p-6 drop-shadow-2xl z-10"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://placehold.co/300x200?text=Car")
                }
              />
              <div className="absolute bottom-0 w-full h-1/2 bg-linear-to-t from-slate-200/50 to-transparent"></div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {["💺 4 Kursi", "⚙️ Manual", "❄️ AC"].map((fitur, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-100 p-3 rounded-2xl text-center text-sm font-bold text-slate-600 shadow-sm"
                >
                  {fitur}
                </div>
              ))}
            </div>
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Syarat & Ketentuan</h3>
                <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-md font-bold">
                  Penting
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-700 mb-1.5">
                  🪪 Dokumen
                </h4>
                <ul className="text-xs text-slate-500 list-disc pl-4 space-y-1">
                  <li>Wajib e-KTP asli & SIM A aktif.</li>
                  <li>Usia 21 - 60 tahun.</li>
                </ul>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md pt-4 pb-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">
                  Total ({getDays()} Hari)
                </p>
                <p className="text-2xl font-extrabold text-blue-600">
                  Rp{" "}
                  {(selectedRental.price_per_day * getDays()).toLocaleString(
                    "id-ID"
                  )}
                </p>
              </div>
              <button
                onClick={handleBooking}
                className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 shadow-lg transition transform active:scale-95"
              >
                Sewa Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
