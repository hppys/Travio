import { useEffect, useState } from "react";
import type { Rental } from "../types";
import { rentalService } from "../services/rentalService";
import { useOrder } from "../context/OrderContext";
import Toast from "../components/Toast";
import { Rental_BG } from "../constants/images";

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

  if (!hasSearched) {
    return (
      <div className="relative w-full h-dvh flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="fixed inset-0 w-full h-full z-0">
          <img
            src={Rental_BG}
            alt="Rental Background"
            className="w-full h-full object-cover object-center scale-[1.02]"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/70 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 pt-20 pb-24 lg:py-0">
          <div className="text-white text-center lg:text-left max-w-xl animate-in slide-in-from-left-10 duration-700">
            <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-4 lg:mb-6 tracking-widest uppercase border border-white/30">
              DRIVE YOUR WAY
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 lg:mb-6 leading-tight drop-shadow-2xl">
              Sewa Mobil Aman <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-200 to-yellow-200">
                Tanpa Supir.
              </span>
            </h1>
          </div>

          <div className="w-full max-w-[480px] animate-in slide-in-from-bottom-10 duration-700 delay-200">
            <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/50">
              <div className="relative z-10">
                <h2 className="text-2xl font-extrabold text-stone-900 mb-6">
                  Mulai Sewa
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-stone-500 ml-1 uppercase tracking-wider">
                      Lokasi
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-bold text-stone-800 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer text-sm"
                    >
                      <option value="">Pilih Kota</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-500 ml-1 uppercase tracking-wider">
                        Mulai
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-bold text-stone-800 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-500 ml-1 uppercase tracking-wider">
                        Selesai
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-bold text-stone-800 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer text-sm"
                      />
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3 flex items-center justify-between text-orange-900 text-sm font-bold border border-orange-100">
                    <span>Durasi Sewa</span>
                    <span>⏱ {getDays()} Hari</span>
                  </div>
                  <button
                    onClick={handleSearch}
                    className="w-full bg-stone-900 text-white font-bold text-sm uppercase tracking-wide py-4 rounded-xl shadow-lg hover:bg-stone-800 transition-all mt-4"
                  >
                    Cari Mobil
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
    <div
      className={`max-w-7xl mx-auto p-4 sm:p-6 ${
        selectedRental
          ? "overflow-hidden h-screen"
          : "pb-24 bg-stone-50 min-h-screen relative z-10"
      }`}
    >
      {showToast && (
        <Toast
          message="Mobil berhasil disewa!"
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
                {location || "Semua Kota"}
              </div>
              <div className="text-xs text-stone-500 mt-0.5 font-medium">
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
      {!loading && filteredRentals.length === 0 && (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRentals.map((car) => (
            <div
              key={car.id}
              onClick={() => setSelectedRental(car)}
              className="bg-white p-4 rounded-3xl shadow-sm border border-stone-100 hover:shadow-lg hover:border-orange-200 transition-all group flex flex-col cursor-pointer"
            >
              <div className="h-48 bg-stone-100 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                <img
                  src={car.image_url}
                  alt={car.car_model}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 relative z-10"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://placehold.co/300x200?text=Car")
                  }
                />
              </div>
              <div className="flex-1 px-1">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-base text-stone-900 leading-tight">
                      {car.car_model}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 font-medium">
                      {car.company_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block text-lg font-extrabold text-orange-600">
                      Rp {car.price_per_day.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-stone-400 font-bold uppercase">
                      /hari
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] rounded-md font-bold border border-stone-100 uppercase tracking-wide">
                    4 Kursi
                  </span>
                  <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] rounded-md font-bold border border-stone-100 uppercase tracking-wide">
                    Manual
                  </span>
                </div>
              </div>
              <button className="w-full mt-5 bg-stone-900 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wide group-hover:bg-orange-600 transition-colors">
                Pilih Mobil
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedRental && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedRental(null)}
          ></div>
          <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 p-6 sm:p-8 no-scrollbar">
            <button
              onClick={() => setSelectedRental(null)}
              className="absolute top-5 right-5 bg-stone-100 text-stone-500 w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-200 transition z-20 font-bold"
            >
              ✕
            </button>
            <div className="text-center mb-8 pt-2">
              <div className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
                Rental Mobil
              </div>
              <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight mb-1">
                {selectedRental.car_model}
              </h2>
              <p className="text-stone-500 font-medium text-sm">
                {selectedRental.company_name}
              </p>
            </div>
            <div className="bg-stone-100 h-56 rounded-3xl flex items-center justify-center mb-8 relative overflow-hidden border border-stone-100">
              <img
                src={selectedRental.image_url}
                className="w-full h-full object-contain p-6 drop-shadow-xl z-10"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://placehold.co/300x200?text=Car")
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {["4 Kursi", "Manual", "AC Dingin"].map((fitur, i) => (
                <div
                  key={i}
                  className="bg-white border border-stone-200 p-3 rounded-xl text-center text-xs font-bold text-stone-600 shadow-sm uppercase tracking-wide"
                >
                  {fitur}
                </div>
              ))}
            </div>
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wide">
                  Syarat & Ketentuan
                </h3>
              </div>
              <div>
                <h4 className="font-bold text-xs text-stone-700 mb-1.5">
                  Dokumen
                </h4>
                <ul className="text-xs text-stone-500 list-disc pl-4 space-y-1 font-medium">
                  <li>Wajib e-KTP asli & SIM A aktif.</li>
                  <li>Usia 21 - 60 tahun.</li>
                </ul>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md pt-4 pb-2 border-t border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-wide mb-1">
                  Total ({getDays()} Hari)
                </p>
                <p className="text-2xl font-extrabold text-orange-600">
                  Rp{" "}
                  {(selectedRental.price_per_day * getDays()).toLocaleString(
                    "id-ID"
                  )}
                </p>
              </div>
              <button
                onClick={handleBooking}
                className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold text-xs hover:bg-orange-600 shadow-lg transition uppercase tracking-wide"
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
