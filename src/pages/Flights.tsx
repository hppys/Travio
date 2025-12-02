import { useEffect, useState } from "react";
import type { Flight } from "../types";
import { flightService } from "../services/flightService";
import { useOrder } from "../context/OrderContext";
import Toast from "../components/Toast";
import { FLIGHT_BG } from "../constants/images";

export default function Flights() {
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departDate, setDepartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [passengers, setPassengers] = useState(1);
  const [seatClass, setSeatClass] = useState("Economy");
  const [showToast, setShowToast] = useState(false);
  const { addOrder } = useOrder();

  useEffect(() => {
    flightService
      .getAll()
      .then((data) => {
        setAllFlights(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const cities = Array.from(
    new Set([
      ...allFlights.map((f) => f.departure_city),
      ...allFlights.map((f) => f.arrival_city),
    ])
  ).sort();

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const results = allFlights.filter((flight) => {
        const isOriginMatch = origin ? flight.departure_city === origin : true;
        const isDestMatch = destination
          ? flight.arrival_city === destination
          : true;
        return isOriginMatch && isDestMatch;
      });
      setFilteredFlights(results);
      setHasSearched(true);
      setLoading(false);
    }, 600);
  };

  const handleResetSearch = () => {
    setHasSearched(false);
    setFilteredFlights([]);
  };

  const handleBooking = () => {
    if (!selectedFlight) return;
    const total = selectedFlight.price * passengers;
    const dateStr = new Date(departDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    addOrder({
      type: "FLIGHT",
      title: `${selectedFlight.airline} (${selectedFlight.departure_city} → ${selectedFlight.arrival_city})`,
      subtitle: `${passengers} Penumpang • ${seatClass}`,
      dateRange: dateStr,
      durationInfo: selectedFlight.duration,
      pricePerUnit: selectedFlight.price,
      totalPrice: total,
      image: selectedFlight.image_url,
    });
    setSelectedFlight(null);
    setShowToast(true);
  };

  // --- TAMPILAN SEARCH MODE (STATIS / ESTETIK MOBILE) ---
  if (!hasSearched) {
    return (
      // Container full height (dvh) dan overflow hidden
      <div className="relative w-full h-dvh flex items-center justify-center overflow-hidden bg-slate-900">
        {/* BACKGROUND FIXED & ESTETIK */}
        <div className="fixed inset-0 w-full h-full z-0">
          <img
            src={FLIGHT_BG}
            alt="Travel Background"
            // Menambahkan scale sedikit agar terlihat lebih premium
            className="w-full h-full object-cover object-center scale-[1.02]"
          />
          {/* Overlay Gradient Vertikal untuk estetika mobile */}
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/70 backdrop-blur-[1px]"></div>
        </div>

        {/* KONTEN UTAMA (Ditambah padding atas 'pt-20' di mobile agar tidak terlalu mepet) */}
        <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 pt-20 pb-24 lg:py-0">
          {/* Text Section */}
          <div className="text-white text-center lg:text-left max-w-xl animate-in slide-in-from-left-10 duration-700">
            <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold mb-4 lg:mb-6 tracking-wider uppercase border border-white/30 shadow-lg">
              ✈️ Discover The World
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 lg:mb-6 leading-tight drop-shadow-2xl">
              Perjalanan Impian <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-indigo-100">
                Menanti Anda.
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-white/90 leading-relaxed drop-shadow-md hidden sm:block">
              Cari dan pesan tiket penerbangan ke berbagai destinasi favorit
              dengan harga terbaik.
            </p>
          </div>

          {/* Floating Form */}
          <div className="w-full max-w-[480px] animate-in slide-in-from-bottom-10 duration-700 delay-200">
            <div className="bg-white/85 backdrop-blur-xl p-6 sm:p-8 rounded-4xl shadow-2xl shadow-black/20 border border-white/50 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                  Mulai Pencarian
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 ml-3 uppercase tracking-wider">
                        Dari
                      </label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-blue-600">
                          🛫
                        </span>
                        <select
                          value={origin}
                          onChange={(e) => setOrigin(e.target.value)}
                          className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl pl-12 pr-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer truncate"
                        >
                          <option value="">Kota Asal</option>
                          {cities.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 ml-3 uppercase tracking-wider">
                        Ke
                      </label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-blue-600">
                          🛬
                        </span>
                        <select
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl pl-12 pr-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer truncate"
                        >
                          <option value="">Kota Tujuan</option>
                          {cities.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-3 uppercase tracking-wider">
                      Tanggal Pergi
                    </label>
                    <input
                      type="date"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                      className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-5 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 ml-3 uppercase tracking-wider">
                        Penumpang
                      </label>
                      <select
                        value={passengers}
                        onChange={(e) => setPassengers(Number(e.target.value))}
                        className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-5 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n} Orang
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 ml-3 uppercase tracking-wider">
                        Kelas
                      </label>
                      <select
                        value={seatClass}
                        onChange={(e) => setSeatClass(e.target.value)}
                        className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-5 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="Economy">Economy</option>
                        <option value="Business">Business</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={handleSearch}
                    className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-all active:scale-95 mt-6"
                  >
                    🔍 Cari Penerbangan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- HASIL PENCARIAN (DINAMIS / BISA SCROLL) ---
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-24 bg-slate-50 min-h-screen relative z-10">
      {showToast && (
        <Toast
          message="Penerbangan berhasil dipesan!"
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
                {origin || "Semua Kota"}{" "}
                <span className="text-slate-300">➝</span>{" "}
                {destination || "Semua Kota"}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {new Date(departDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                })}{" "}
                • {passengers} Pax
              </div>
            </div>
            <div className="text-2xl opacity-10">✈️</div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-24">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="font-bold text-slate-800">Sedang mencari...</h3>
        </div>
      )}
      {!loading && filteredFlights.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm px-6">
          <div className="text-6xl mb-4 opacity-80">📅</div>
          <h3 className="text-xl font-bold text-slate-800">
            Tidak ada penerbangan
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
        <div className="space-y-4">
          {filteredFlights.map((flight) => (
            <div
              key={flight.id}
              onClick={() => setSelectedFlight(flight)}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-full bg-linear-to-l from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex flex-col sm:flex-row gap-5 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-5">
                    <img
                      src={flight.image_url}
                      alt={flight.airline}
                      className="w-12 h-12 object-contain rounded-xl bg-white border border-slate-100 p-1"
                      onError={(e) =>
                        (e.currentTarget.src = "https://placehold.co/50")
                      }
                    />
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">
                        {flight.airline}
                      </h3>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-wide">
                        {flight.duration} • Langsung
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-800">
                        {new Date(flight.departure_time).toLocaleTimeString(
                          "id-ID",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-1">
                        {flight.departure_city.substring(0, 3).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 mx-4 flex flex-col items-center justify-center relative -top-2">
                      <div className="w-full h-0.5 bg-slate-200 relative">
                        <div className="absolute right-0 -top-[5px] text-slate-300 text-xs">
                          ➤
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-800">
                        {new Date(flight.arrival_time).toLocaleTimeString(
                          "id-ID",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-1">
                        {flight.arrival_city.substring(0, 3).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center sm:border-l border-slate-100 sm:pl-6 pt-4 sm:pt-0 border-t sm:border-t-0 mt-2 sm:mt-0">
                  <div className="text-right">
                    <span className="text-xl font-bold text-orange-500 block">
                      Rp {flight.price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      /pax
                    </span>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm mt-3 shadow-lg shadow-blue-200 group-hover:bg-blue-700 transition-all">
                    Pilih
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedFlight && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedFlight(null)}
          ></div>
          <div className="relative bg-slate-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-4xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="h-48 w-full relative">
              <img src={FLIGHT_BG} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
              <button
                onClick={() => setSelectedFlight(null)}
                className="absolute top-4 right-4 bg-black/20 text-white w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-6 text-white">
                <h2 className="text-2xl font-bold">{selectedFlight.airline}</h2>
                <p className="text-sm opacity-90">Penerbangan Langsung</p>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800">
                      {selectedFlight.departure_city
                        .substring(0, 3)
                        .toUpperCase()}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(
                        selectedFlight.departure_time
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col items-center px-4">
                    <span className="text-xs text-slate-400 mb-1">
                      {selectedFlight.duration}
                    </span>
                    <div className="w-full h-px bg-slate-300 relative flex items-center justify-center">
                      <span className="bg-white px-2 text-slate-400 text-xs">
                        ✈
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800">
                      {selectedFlight.arrival_city
                        .substring(0, 3)
                        .toUpperCase()}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(selectedFlight.arrival_time).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    📅 {new Date(departDate).toLocaleDateString("id-ID")}
                  </div>
                  <div className="flex items-center gap-2">
                    💺 {passengers} Penumpang
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs text-slate-500 mb-1">
                    Total Pembayaran
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    Rp{" "}
                    {(selectedFlight.price * passengers).toLocaleString(
                      "id-ID"
                    )}
                  </p>
                </div>
                <button
                  onClick={handleBooking}
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition shadow-lg"
                >
                  Pesan Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
