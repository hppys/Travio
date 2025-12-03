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
    .sort() as string[];

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
        const isMatch = destination
          ? hotelCity.toLowerCase().includes(destination.toLowerCase())
          : true;
        return isMatch;
      });

      setFilteredHotels(results);
      setHasSearched(true);
      setLoading(false);
    }, 500);
  };

  const handleResetSearch = () => {
    setHasSearched(false);
    setFilteredHotels([]);
  };

  const handleBooking = () => {
    if (!selectedHotel) return;

    const nights = getDuration();
    if (nights <= 0) return alert("Minimal 1 malam");

    addOrder({
      type: "HOTEL",
      title: selectedHotel.name,
      subtitle: `${nights} Malam • Standard Room`,
      pricePerUnit: selectedHotel.price_per_night,
      totalPrice: selectedHotel.price_per_night * nights,
      dateRange: `${new Date(checkIn).toLocaleDateString("id-ID")} - ${new Date(
        checkOut
      ).toLocaleDateString("id-ID")}`,
      durationInfo: `${nights} Malam`,
      image: selectedHotel.image_url,
    });

    setSelectedHotel(null);
    setShowToast(true);
  };

  // ===========================
  //    LANDING PAGE (NO SEARCH)
  // ===========================
  if (!hasSearched) {
    return (
      <div className="relative w-full h-dvh flex items-center justify-center overflow-hidden overflow-x-hidden bg-stone-900">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"
            alt="Hotel Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
        </div>

        <div className="relative w-full max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center overflow-x-hidden">
          <div className="text-white">
            <div className="px-4 py-1.5 bg-white/20 rounded-full text-xs font-bold tracking-widest uppercase border border-white/30 inline-block mb-4">
              STAY & RELAX
            </div>

            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Temukan Penginapan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">
                Terbaik.
              </span>
            </h1>
          </div>

          {/* CARD SEARCH */}
          <div className="bg-white/90 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
            <h2 className="text-2xl font-extrabold text-stone-900 mb-6">
              Cari Hotel
            </h2>

            <div className="space-y-5">
              {/* DESTINASI */}
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase ml-1">
                  Destinasi
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-bold text-stone-800 text-sm outline-none"
                >
                  <option value="">Semua Lokasi</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-500 uppercase ml-1">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-500 uppercase ml-1">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-bold text-sm"
                  />
                </div>
              </div>

              {/* DURASI */}
              <div className="bg-orange-50 rounded-xl p-3 flex justify-between font-bold text-orange-900 text-sm border border-orange-100">
                <span>Total Menginap</span>
                <span>{getDuration()} Malam</span>
              </div>

              {/* BUTTON */}
              <button
                onClick={handleSearch}
                className="w-full bg-stone-900 text-white font-bold text-sm uppercase py-4 rounded-xl hover:bg-stone-800 transition"
              >
                Cari Hotel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===========================
  //        SEARCH RESULTS
  // ===========================
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-24 bg-stone-50 min-h-screen overflow-x-hidden">
      {showToast && (
        <Toast
          message="Kamar berhasil dipesan!"
          onClose={() => setShowToast(false)}
        />
      )}

      {/* HEADER BAR */}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border border-stone-200 shadow-sm rounded-xl p-4 mb-6 flex items-center justify-between">
        <div onClick={handleResetSearch} className="cursor-pointer w-full">
          <div className="text-xs font-bold uppercase text-orange-600">
            Kembali
          </div>
          <div className="font-bold text-stone-800 text-base">
            {destination || "Semua Lokasi"}
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-24">
          <div className="animate-spin w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full mx-auto mb-4" />
          <h3 className="font-bold text-stone-800 text-sm">Mencari...</h3>
        </div>
      )}

      {/* NO RESULT */}
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

      {/* LIST */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 overflow-x-hidden">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              onClick={() => setSelectedHotel(hotel)}
              className="bg-white rounded-3xl shadow-sm border border-stone-100 cursor-pointer hover:shadow-xl transition overflow-hidden"
            >
              <div className="relative h-60">
                <img
                  src={hotel.image_url}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://placehold.co/600x400";
                  }}
                />
                <div className="absolute bottom-3 right-3 bg-white/90 px-3 py-1 rounded-lg text-xs font-bold shadow">
                  Rating {hotel.rating}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-stone-900">
                  {hotel.name}
                </h3>
                <p className="text-sm text-stone-500">
                  {hotel.hotel_locations[0]?.city}
                </p>

                <div className="flex gap-2 mt-3 flex-wrap">
                  {hotel.hotel_facilities.slice(0, 3).map((fac, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-1 bg-stone-100 rounded-md text-stone-600 font-bold uppercase"
                    >
                      {fac.facility}
                    </span>
                  ))}
                </div>

                <div className="flex items-end justify-between pt-4 border-t border-stone-100 mt-4">
                  <div>
                    <p className="text-xs text-stone-400 line-through">
                      Rp {(hotel.price_per_night * 1.3).toLocaleString("id-ID")}
                    </p>
                    <p className="text-lg font-extrabold text-orange-500">
                      Rp {hotel.price_per_night.toLocaleString("id-ID")}
                    </p>
                    <p className="text-[10px] text-stone-400">/malam</p>
                  </div>
                  <button className="px-4 py-2 bg-stone-900 rounded-lg text-white text-xs font-bold hover:bg-orange-600 transition">
                    LIHAT
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DETAIL */}
      {selectedHotel && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedHotel(null)}
          ></div>

          <div className="relative bg-white max-w-3xl w-full rounded-3xl shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="relative h-72">
              <img
                src={selectedHotel.image_url}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedHotel(null)}
                className="absolute top-4 right-4 bg-white/30 text-white w-8 h-8 rounded-full"
              >
                ✕
              </button>
              <div className="absolute bottom-0 left-0 p-8 text-white bg-gradient-to-t from-black/80 w-full">
                <h2 className="text-3xl font-bold">{selectedHotel.name}</h2>
                <p>{selectedHotel.hotel_locations[0]?.city}</p>
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedHotel.hotel_facilities.map((f, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-stone-100 text-stone-700 rounded-lg text-xs font-bold"
                  >
                    {f.facility}
                  </span>
                ))}
              </div>

              <div className="bg-stone-50 p-6 rounded-xl border mb-8">
                <h4 className="font-bold text-sm mb-3">Ringkasan Pesanan</h4>
                <div className="flex justify-between text-sm text-stone-600 border-b pb-2 mb-2">
                  <span>Tanggal</span>
                  <span>
                    {new Date(checkIn).toLocaleDateString("id-ID")} —{" "}
                    {new Date(checkOut).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Durasi</span>
                  <span>{getDuration()} Malam</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-400 mb-1">
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
                  className="px-8 py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-orange-600 transition"
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
