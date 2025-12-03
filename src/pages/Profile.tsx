import { useState } from "react";
import { useOrder } from "../context/OrderContext";
import Toast from "../components/Toast";

export default function Profile() {
  const { user, orders, updateUserProfile } = useOrder();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user.name);

  // State untuk Notifikasi Placeholder
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const completedTrips = orders.filter((o) => o.status === "success").length;

  const handlePlaceholder = (featureName: string) => {
    setToastMsg(`Fitur "${featureName}" akan segera hadir!`);
    setShowToast(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {showToast && (
        <Toast message={toastMsg} onClose={() => setShowToast(false)} />
      )}

      {/* Header Background (Sama dengan tema navbar/footer stone-900) */}
      <div className="h-64 bg-stone-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
        {/* Acent Warm Light (Orange) */}
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-32 relative z-10">
        {/* MEMBER CARD (Glassmorphism White) */}
        <div className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-28 h-28 p-1 bg-orange-100 rounded-full shadow-lg">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full rounded-full border-4 border-white bg-white object-cover"
              />
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute bottom-0 right-0 bg-stone-900 text-white px-3 py-1 rounded-full shadow-md text-xs font-bold uppercase tracking-wide hover:bg-orange-600 transition"
            >
              Edit
            </button>
          </div>

          {/* Info User */}
          <div className="flex-1 w-full sm:w-auto">
            {isEditing ? (
              <div className="flex flex-col gap-3 animate-in fade-in items-center sm:items-start">
                <input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="text-2xl font-bold text-stone-900 bg-transparent border-b-2 border-orange-500 outline-none text-center sm:text-left w-full max-w-xs pb-1"
                  autoFocus
                />
                <button
                  onClick={() => {
                    updateUserProfile(tempName, user.email);
                    setIsEditing(false);
                  }}
                  className="text-xs bg-orange-600 text-white px-6 py-2 rounded-lg font-bold uppercase tracking-wide hover:bg-orange-700 transition"
                >
                  Simpan
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-extrabold text-stone-900">
                  {user.name}
                </h1>
                <p className="text-stone-500 font-medium text-sm mt-1">
                  {user.email}
                </p>
              </>
            )}

            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-6">
              <span className="bg-stone-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider shadow-sm">
                {user.memberLevel} Member
              </span>
              <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider border border-stone-200">
                {completedTrips}x Perjalanan
              </span>
            </div>
          </div>

          {/* BOX POIN SUDAH DIHAPUS DI SINI */}
        </div>

        {/* MENU SECTIONS */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section Akun */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
            <h3 className="font-bold text-stone-900 mb-4 text-sm uppercase tracking-wider border-b border-stone-100 pb-2">
              Akun
            </h3>
            <ul className="space-y-1">
              {[
                "Daftar Penumpang",
                "Metode Pembayaran",
                "Refund & Reschedule",
                "Notifikasi",
              ].map((menu) => (
                <li
                  key={menu}
                  onClick={() => handlePlaceholder(menu)}
                  className="flex justify-between items-center p-3 hover:bg-stone-50 rounded-xl cursor-pointer transition group"
                >
                  <span className="text-stone-600 font-bold text-sm group-hover:text-stone-900 transition">
                    {menu}
                  </span>
                  <span className="text-stone-300 text-lg group-hover:text-orange-400 transition">
                    ›
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Keamanan */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
            <h3 className="font-bold text-stone-900 mb-4 text-sm uppercase tracking-wider border-b border-stone-100 pb-2">
              Keamanan
            </h3>
            <ul className="space-y-1">
              {[
                "Ubah Kata Sandi",
                "Pusat Bantuan",
                "Syarat & Ketentuan",
                "Tentang Aplikasi",
              ].map((menu) => (
                <li
                  key={menu}
                  onClick={() => handlePlaceholder(menu)}
                  className="flex justify-between items-center p-3 hover:bg-stone-50 rounded-xl cursor-pointer transition group"
                >
                  <span className="text-stone-600 font-bold text-sm group-hover:text-stone-900 transition">
                    {menu}
                  </span>
                  <span className="text-stone-300 text-lg group-hover:text-orange-400 transition">
                    ›
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePlaceholder("Keluar Akun")}
              className="w-full mt-6 text-red-600 font-bold text-xs uppercase tracking-wide py-3 rounded-xl hover:bg-red-50 transition border border-red-100"
            >
              Keluar Akun
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
