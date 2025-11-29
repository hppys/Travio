import { useEffect, useState } from "react";
import type { Hotel } from "../types";
import { hotelService } from "../services/hotelService";
import { useOrder } from "../context/OrderContext";
import Toast from "../components/Toast";

export default function Hotels() {
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showToast, setShowToast] = useState(false);
  const { addOrder } = useOrder();

  const [destination, setDestination] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split("T")[0];
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);

  useEffect(() => {
    hotelService
      .getAll()
      .then((data) => {
        setAllHotels(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const cities = Array.from(
    new Set(allHotels.map((h) => h.hotel_locations[0]?.city))
  )
    .filter(Boolean)
    .sort();

  const getDuration = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
    );
    return diff > 0 ? diff : 0;
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const results = allHotels.filter((hotel) => {
        const hotelCity = hotel.hotel_locations[0]?.city || "";
        const isCityMatch = destination
          ? hotelCity.toLowerCase().includes(destination.toLowerCase())
          : true;
        return isCityMatch;
      });
      setFilteredHotels(results);
      setHasSearched(true);
      setLoading(false);
    }, 600);
  };

  const handleResetSearch = () => {
    setHasSearched(false);
    setFilteredHotels([]);
  };

  const handleBooking = () => {
    if (selectedHotel) {
      const nights = getDuration();
      if (nights <= 0) return alert("Minimal 1 malam");
      addOrder({
        type: "HOTEL",
        title: selectedHotel.name,
        subtitle: `${nights} Malam • Standard Room`,
        pricePerUnit: selectedHotel.price_per_night,
        totalPrice: selectedHotel.price_per_night * nights,
        dateRange: `${new Date(checkIn).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        })} - ${new Date(checkOut).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        })}`,
        durationInfo: `${nights} Malam`,
        image: selectedHotel.image_url,
      });
      setSelectedHotel(null);
      setShowToast(true);
    }
  };

  // --- SEARCH MODE (STATIS / ESTETIK MOBILE) ---
  if (!hasSearched) {
    return (
      <div className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-slate-900">
        {/* BACKGROUND FIXED & ESTETIK */}
        <div className="fixed inset-0 w-full h-full z-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070"
            alt="Hotel Background"
            className="w-full h-full object-cover object-center scale-[1.02]"
          />
          {/* Overlay Gradient Vertikal */}
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/70 backdrop-blur-[1px]"></div>
        </div>

        {/* KONTEN UTAMA (Padding top 'pt-20' di mobile) */}
        <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 pt-20 pb-24 lg:py-0">
          <div className="text-white text-center lg:text-left max-w-xl animate-in slide-in-from-left-10 duration-700">
            <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold mb-4 lg:mb-6 tracking-wider uppercase border border-white/30 shadow-lg">
              🏨 Staycation & Relax
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 lg:mb-6 leading-tight drop-shadow-2xl">
              Temukan Penginapan <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-teal-200">
                Terbaik Untukmu.
              </span>
            </h1>
          </div>

          <div className="w-full max-w-[480px] animate-in slide-in-from-bottom-10 duration-700 delay-200">
            <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-4xl shadow-2xl shadow-black/20 border border-white/50 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                  Cari Hotel
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-slate-500 ml-3 uppercase tracking-wider mb-1 block">
                      Destinasi
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-blue-600">
                        📍
                      </span>
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl pl-12 pr-4 py-3.5 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Semua Lokasi</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 ml-3 uppercase tracking-wider">
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 ml-3 uppercase tracking-wider">
                        Check-out
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 flex items-center justify-between text-blue-800 text-sm font-bold border border-blue-100">
                    <span>Durasi Menginap</span>
                    <span>🌙 {getDuration()} Malam</span>
                  </div>
                  <button
                    onClick={handleSearch}
                    className="w-full bg-linear-to-r from-blue-600 to-teal-500 text-white font-bold text-lg py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-all active:scale-95 mt-4"
                  >
                    🔍 Cari Hotel
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-24 bg-slate-50 min-h-screen relative z-10">
      {showToast && (
        <Toast
          message="Kamar berhasil dipesan!"
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
                {destination || "Semua Lokasi"}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {new Date(checkIn).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                -{" "}
                {new Date(checkOut).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                • {getDuration()} Malam
              </div>
            </div>
            <div className="text-2xl opacity-10">🏨</div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-24">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="font-bold text-slate-800">Sedang mencari hotel...</h3>
        </div>
      )}

      {!loading && filteredHotels.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm px-6">
          <div className="text-6xl mb-4 opacity-80">🏨</div>
          <h3 className="text-xl font-bold text-slate-800">
            Tidak ada hotel ditemukan
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              onClick={() => setSelectedHotel(hotel)}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group cursor-pointer relative"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={hotel.image_url}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) =>
                    (e.currentTarget.src = "https://placehold.co/600x400")
                  }
                />
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center shadow-sm">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-bold text-sm text-slate-800">
                    {hotel.rating}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-slate-800 mb-1 line-clamp-1">
                  {hotel.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                  📍 {hotel.hotel_locations[0]?.city || "Kota"}
                </p>
                <div className="flex items-end justify-between pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-xs text-slate-400 line-through">
                      Rp {(hotel.price_per_night * 1.3).toLocaleString("id-ID")}
                    </p>
                    <p className="text-lg font-extrabold text-orange-500">
                      Rp {hotel.price_per_night.toLocaleString("id-ID")}
                    </p>
                    <p className="text-[10px] text-slate-400">/malam</p>
                  </div>
                  <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold">
                    Pilih
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedHotel && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedHotel(null)}
          ></div>
          <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-4xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative h-72">
              <img
                src={selectedHotel.image_url}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
              <button
                onClick={() => setSelectedHotel(null)}
                className="absolute top-4 right-4 bg-black/30 text-white w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition text-lg font-bold"
              >
                ✕
              </button>
              <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                <h2 className="text-3xl font-bold mb-1">
                  {selectedHotel.name}
                </h2>
                <p className="opacity-90 flex items-center gap-1 text-sm">
                  📍 {selectedHotel.hotel_locations[0]?.city}
                </p>
              </div>
            </div>
            <div className="p-8">
              <div className="flex flex-wrap gap-4 mb-8">
                {selectedHotel.hotel_facilities.map((fac, i) => (
                  <span
                    key={i}
                    className="bg-slate-50 text-slate-600 px-4 py-2 rounded-full text-sm font-medium border border-slate-100 flex items-center gap-2"
                  >
                    ✨ {fac.facility}
                  </span>
                ))}
              </div>
              <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 mb-8">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  📝 Ringkasan Pesanan
                </h4>
                <div className="flex justify-between text-sm mb-3 pb-3 border-b border-blue-100">
                  <span className="text-slate-500">Tanggal</span>
                  <span className="font-bold text-slate-700">
                    {new Date(checkIn).toLocaleDateString("id-ID")} —{" "}
                    {new Date(checkOut).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Durasi</span>
                  <span className="font-bold text-slate-700">
                    {getDuration()} Malam
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-wide">
                    Total Pembayaran
                  </p>
                  <p className="text-3xl font-extrabold text-slate-900">
                    Rp{" "}
                    {(
                      selectedHotel.price_per_night * getDuration()
                    ).toLocaleString("id-ID")}
                  </p>
                </div>
                <button
                  onClick={handleBooking}
                  className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 shadow-xl transition transform active:scale-95"
                >
                  Pesan Kamar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
