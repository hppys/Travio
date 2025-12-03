import { useEffect, useState } from "react";
import type { Hotel } from "../types";
import { hotelService } from "../services/hotelService";
import { useOrder } from "../context/OrderContext";
import Toast from "../components/Toast";

// 👇 Import HOTEL_BG
import { HOTEL_BG } from "../constants/images";

const DUMMY_HOTELS: Hotel[] = [
  {
    id: 1,
    name: "Grand Hyatt Jakarta",
    rating: 4.8,
    price_per_night: 2500000,
    image_url:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    hotel_locations: [
      { id: 1, city: "Jakarta", country: "Indonesia", hotel_id: 1 },
    ],
    hotel_facilities: [{ facility: "Pool" }, { facility: "Spa" }],
  },
  {
    id: 2,
    name: "The Bali Resort",
    rating: 4.5,
    price_per_night: 1800000,
    image_url:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    hotel_locations: [
      { id: 2, city: "Bali", country: "Indonesia", hotel_id: 2 },
    ],
    hotel_facilities: [{ facility: "Beach" }, { facility: "Bar" }],
  },
  {
    id: 3,
    name: "Yogya Heritage",
    rating: 4.2,
    price_per_night: 900000,
    image_url:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    hotel_locations: [
      { id: 3, city: "Yogyakarta", country: "Indonesia", hotel_id: 3 },
    ],
    hotel_facilities: [{ facility: "Restaurant" }],
  },
];

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
        if (data && data.length > 0) setAllHotels(data);
        else setAllHotels(DUMMY_HOTELS);
      })
      .catch(() => setAllHotels(DUMMY_HOTELS))
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

  // --- SEARCH MODE (STATIS & FIXED) ---
  if (!hasSearched) {
    return (
      <div className="relative w-full h-[calc(100dvh-80px)] flex items-center justify-center overflow-hidden bg-stone-900">
        {/* BACKGROUND FIXED */}
        <div className="fixed inset-0 w-full h-full z-0">
          {/* 👇 Menggunakan HOTEL_BG */}
          <img
            src={HOTEL_BG}
            alt="Hotel Background"
            className="w-full h-full object-cover object-center scale-[1.02]"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/70 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 pt-20 pb-24 lg:py-0">
          <div className="text-white text-center lg:text-left max-w-xl animate-in slide-in-from-left-10 duration-700">
            <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-4 lg:mb-6 tracking-widest uppercase border border-white/30">
              STAY & RELAX
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight drop-shadow-2xl">
              Temukan Penginapan <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-200 to-yellow-200">
                Terbaik.
              </span>
            </h1>
          </div>

          <div className="w-full max-w-[480px] animate-in slide-in-from-bottom-10 duration-700 delay-200">
            <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/50">
              <div className="relative z-10">
                <h2 className="text-2xl font-extrabold text-stone-900 mb-6">
                  Cari Hotel
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-stone-500 ml-1 uppercase tracking-wider">
                      Destinasi
                    </label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-bold text-stone-800 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer text-sm"
                    >
                      <option value="">Semua Lokasi</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-500 ml-1 uppercase tracking-wider">
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-bold text-stone-800 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-500 ml-1 uppercase tracking-wider">
                        Check-out
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-bold text-stone-800 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer text-sm"
                      />
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3 flex items-center justify-between text-orange-900 text-sm font-bold border border-orange-100">
                    <span>Total Menginap</span>
                    <span>{getDuration()} Malam</span>
                  </div>
                  <button
                    onClick={handleSearch}
                    className="w-full bg-stone-900 text-white font-bold text-sm uppercase tracking-wide py-4 rounded-xl shadow-lg hover:bg-stone-800 transition-all mt-4"
                  >
                    Cari Hotel
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-24 bg-stone-50 min-h-screen relative z-10">
      {showToast && (
        <Toast
          message="Kamar berhasil dipesan!"
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border border-stone-200 shadow-sm rounded-xl p-4 mb-6 flex items-center justify-between animate-in slide-in-from-top-5">
        <div
          onClick={handleResetSearch}
          className="cursor-pointer group w-full"
        >
          <div className="flex items-center gap-2 text-orange-600 mb-1 group-hover:-translate-x-1 transition-transform">
            <span className="text-xs font-bold uppercase tracking-wide">
              Kembali
            </span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <div className="font-bold text-stone-800 text-sm sm:text-base">
                {destination || "Semua Lokasi"}
              </div>
              <div className="text-xs text-stone-500 mt-0.5 font-medium">
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
      {!loading && filteredHotels.length === 0 && (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              onClick={() => setSelectedHotel(hotel)}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-100 group cursor-pointer relative"
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
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg flex items-center shadow-sm">
                  <span className="font-bold text-xs text-stone-900">
                    Rating {hotel.rating}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-stone-900 mb-1 line-clamp-1">
                  {hotel.name}
                </h3>
                <p className="text-sm text-stone-500 mb-4 font-medium">
                  {hotel.hotel_locations[0]?.city || "Kota"}
                </p>
                <div className="flex flex-wrap gap-2 mb-4 h-8 overflow-hidden">
                  {hotel.hotel_facilities.slice(0, 3).map((fac, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-1 bg-stone-100 text-stone-600 rounded-md font-bold uppercase tracking-wide"
                    >
                      {fac.facility}
                    </span>
                  ))}
                </div>
                <div className="flex items-end justify-between pt-4 border-t border-stone-100">
                  <div>
                    <p className="text-xs text-stone-400 line-through">
                      Rp {(hotel.price_per_night * 1.3).toLocaleString("id-ID")}
                    </p>
                    <p className="text-lg font-extrabold text-orange-500">
                      Rp {hotel.price_per_night.toLocaleString("id-ID")}
                    </p>
                    <p className="text-[10px] text-stone-400">/malam</p>
                  </div>
                  <button className="bg-stone-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-600 transition-all">
                    LIHAT
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
            className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedHotel(null)}
          ></div>
          <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative h-72 bg-stone-900">
              <img
                src={selectedHotel.image_url}
                className="w-full h-full object-cover opacity-80"
              />
              <button
                onClick={() => setSelectedHotel(null)}
                className="absolute top-4 right-4 bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/30 transition font-bold"
              >
                ✕
              </button>
              <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                <h2 className="text-3xl font-bold mb-1">
                  {selectedHotel.name}
                </h2>
                <p className="opacity-90 text-sm font-medium">
                  {selectedHotel.hotel_locations[0]?.city}
                </p>
              </div>
            </div>
            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedHotel.hotel_facilities.map((fac, i) => (
                  <span
                    key={i}
                    className="bg-stone-100 text-stone-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                  >
                    {fac.facility}
                  </span>
                ))}
              </div>
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 mb-8">
                <h4 className="font-bold text-stone-900 mb-4 text-sm uppercase tracking-wide">
                  Ringkasan Pesanan
                </h4>
                <div className="flex justify-between text-sm mb-2 pb-2 border-b border-stone-200 font-medium text-stone-600">
                  <span>Tanggal</span>
                  <span>
                    {new Date(checkIn).toLocaleDateString("id-ID")} —{" "}
                    {new Date(checkOut).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium text-stone-600">
                  <span>Durasi</span>
                  <span>{getDuration()} Malam</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs text-stone-400 mb-1 font-bold uppercase">
                    Total Pembayaran
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    Rp{" "}
                    {(
                      selectedHotel.price_per_night * getDuration()
                    ).toLocaleString("id-ID")}
                  </p>
                </div>
                <button
                  onClick={handleBooking}
                  className="bg-stone-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-orange-600 transition shadow-lg uppercase tracking-wide"
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
