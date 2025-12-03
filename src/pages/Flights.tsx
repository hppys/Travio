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

  if (!hasSearched) {
    return (
      // Bg Stone-900 (Hitam kecoklatan hangat)
      <div className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="fixed inset-0 w-full h-full z-0">
          <img
            src={FLIGHT_BG}
            alt="Travel Background"
            className="w-full h-full object-cover object-center scale-[1.02]"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/70 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 pt-20 pb-24 lg:py-0">
          <div className="text-white text-center lg:text-left max-w-xl animate-in slide-in-from-left-10 duration-700">
            <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-4 lg:mb-6 tracking-widest uppercase border border-white/30">
              DISCOVER THE WORLD
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 lg:mb-6 leading-tight drop-shadow-2xl">
              Perjalanan Impian <br />
              {/* Gradasi Orange ke Red (Warm) */}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-200 to-red-200">
                Menanti Anda.
              </span>
            </h1>
          </div>

          <div className="w-full max-w-[480px] animate-in slide-in-from-bottom-10 duration-700 delay-200">
            <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/50">
              <div className="relative z-10">
                <h2 className="text-2xl font-extrabold text-stone-900 mb-6">
                  Mulai Pencarian
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-500 ml-1 uppercase tracking-wider">
                        Dari
                      </label>
                      <select
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-bold text-stone-800 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer text-sm"
                      >
                        <option value="">Kota Asal</option>
                        {cities.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-500 ml-1 uppercase tracking-wider">
                        Ke
                      </label>
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-bold text-stone-800 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer text-sm"
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
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500 ml-1 uppercase tracking-wider">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-bold text-stone-800 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-500 ml-1 uppercase tracking-wider">
                        Penumpang
                      </label>
                      <select
                        value={passengers}
                        onChange={(e) => setPassengers(Number(e.target.value))}
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-bold text-stone-800 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer text-sm"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n} Orang
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-500 ml-1 uppercase tracking-wider">
                        Kelas
                      </label>
                      <select
                        value={seatClass}
                        onChange={(e) => setSeatClass(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-bold text-stone-800 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer text-sm"
                      >
                        <option value="Economy">Economy</option>
                        <option value="Business">Business</option>
                      </select>
                    </div>
                  </div>
                  {/* Tombol Utama Orange */}
                  <button
                    onClick={handleSearch}
                    className="w-full bg-orange-600 text-white font-bold text-sm uppercase tracking-wide py-4 rounded-xl shadow-lg hover:bg-orange-700 transition-all mt-6"
                  >
                    Cari Penerbangan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-24 bg-stone-50 min-h-screen relative z-10">
      {showToast && (
        <Toast
          message="Penerbangan berhasil dipesan!"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border border-stone-200 shadow-sm rounded-xl p-4 mb-6 flex items-center justify-between animate-in slide-in-from-top-5">
        <div
          onClick={handleResetSearch}
          className="cursor-pointer group w-full"
        >
          {/* Warna Hover Orange */}
          <div className="flex items-center gap-2 text-orange-600 mb-1 group-hover:-translate-x-1 transition-transform">
            <span className="text-xs font-bold uppercase tracking-wide">
              Kembali
            </span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <div className="font-bold text-stone-800 text-sm sm:text-base">
                {origin || "Semua"}{" "}
                <span className="text-stone-400 mx-2">/</span>{" "}
                {destination || "Semua"}
              </div>
              <div className="text-xs text-stone-500 mt-0.5 font-medium">
                {new Date(departDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                })}{" "}
                • {passengers} Orang
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-24">
          <div className="animate-spin w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="font-bold text-stone-800 text-sm uppercase tracking-wide">
            Mencari...
          </h3>
        </div>
      )}

      {!loading && filteredFlights.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-stone-200 rounded-xl">
          <h3 className="text-lg font-bold text-stone-800">Tidak ada hasil</h3>
          <button
            onClick={handleResetSearch}
            className="mt-4 text-xs font-bold text-orange-600 underline"
          >
            Cari ulang
          </button>
        </div>
      )}

      {!loading && (
        <div className="space-y-4">
          {filteredFlights.map((flight) => (
            <div
              key={flight.id}
              onClick={() => setSelectedFlight(flight)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 hover:border-orange-500 transition-all cursor-pointer relative overflow-hidden group"
            >
              <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-5">
                    <img
                      src={flight.image_url}
                      alt={flight.airline}
                      className="w-10 h-10 object-contain rounded-md bg-white border border-stone-100 p-1"
                      onError={(e) =>
                        (e.currentTarget.src = "https://placehold.co/50")
                      }
                    />
                    <div>
                      <h3 className="font-bold text-stone-900 text-base">
                        {flight.airline}
                      </h3>
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wide">
                        {flight.duration} • Langsung
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-center">
                    <div>
                      <div className="text-lg font-bold text-stone-800">
                        {new Date(flight.departure_time).toLocaleTimeString(
                          "id-ID",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </div>
                      <div className="text-xs font-bold text-stone-400 mt-1">
                        {flight.departure_city.substring(0, 3).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 mx-6 h-px bg-stone-200"></div>
                    <div>
                      <div className="text-lg font-bold text-stone-800">
                        {new Date(flight.arrival_time).toLocaleTimeString(
                          "id-ID",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </div>
                      <div className="text-xs font-bold text-stone-400 mt-1">
                        {flight.arrival_city.substring(0, 3).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center sm:border-l border-stone-100 sm:pl-6 pt-4 sm:pt-0 border-t sm:border-t-0 mt-2 sm:mt-0">
                  <div className="text-right">
                    <span className="text-lg font-bold text-orange-600 block">
                      Rp {flight.price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-stone-400 font-bold uppercase">
                      Per Orang
                    </span>
                  </div>
                  <button className="bg-stone-900 text-white px-6 py-2 rounded-lg font-bold text-xs mt-3 hover:bg-orange-600 transition-colors">
                    PILIH
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
            className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedFlight(null)}
          ></div>
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="h-40 w-full relative bg-stone-900">
              <img
                src={FLIGHT_BG}
                className="w-full h-full object-cover opacity-50"
              />
              <button
                onClick={() => setSelectedFlight(null)}
                className="absolute top-4 right-4 bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/30 transition font-bold"
              >
                ✕
              </button>
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-2xl font-bold">{selectedFlight.airline}</h2>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                  Detail Penerbangan
                </p>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 mb-6">
                <div className="flex justify-between items-center mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-stone-900">
                      {selectedFlight.departure_city
                        .substring(0, 3)
                        .toUpperCase()}
                    </div>
                    <div className="text-xs font-bold text-stone-500 mt-1">
                      {new Date(
                        selectedFlight.departure_time
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="flex-1 h-px bg-stone-300 mx-4"></div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-stone-900">
                      {selectedFlight.arrival_city
                        .substring(0, 3)
                        .toUpperCase()}
                    </div>
                    <div className="text-xs font-bold text-stone-500 mt-1">
                      {new Date(selectedFlight.arrival_time).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-stone-700 font-medium">
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <span>Tanggal</span>
                    <span>
                      {new Date(departDate).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <span>Penumpang</span>
                    <span>{passengers} Orang</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <span>Kelas</span>
                    <span>{seatClass}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span>Durasi</span>
                    <span>{selectedFlight.duration}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs text-stone-400 mb-1 font-bold uppercase">
                    Total Bayar
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    Rp{" "}
                    {(selectedFlight.price * passengers).toLocaleString(
                      "id-ID"
                    )}
                  </p>
                </div>
                <button
                  onClick={handleBooking}
                  className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition shadow-lg uppercase tracking-wide"
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
