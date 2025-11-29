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

  // Fungsi helper untuk tombol yang belum ada fiturnya
  const handlePlaceholder = (featureName: string) => {
    setToastMsg(`Fitur "${featureName}" akan segera hadir! (Demo)`);
    setShowToast(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {showToast && (
        <Toast message={toastMsg} onClose={() => setShowToast(false)} />
      )}

      {/* PREMIUM HEADER BACKGROUND */}
      <div className="h-64 bg-linear-to-b from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-32 relative z-10">
        {/* MEMBER CARD */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[2rem] p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative group">
            <div className="w-28 h-28 p-1 bg-linear-to-tr from-yellow-400 to-orange-500 rounded-full shadow-lg">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full rounded-full border-4 border-white bg-white object-cover"
              />
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full shadow-md text-xs hover:scale-110 transition"
            >
              ✎
            </button>
          </div>

          <div className="flex-1">
            {isEditing ? (
              <div className="flex flex-col gap-2 animate-in fade-in">
                <input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="text-2xl font-bold text-slate-800 bg-transparent border-b-2 border-blue-500 outline-none text-center sm:text-left w-full max-w-xs"
                  autoFocus
                />
                <button
                  onClick={() => {
                    updateUserProfile(tempName, user.email);
                    setIsEditing(false);
                  }}
                  className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-full w-fit mx-auto sm:mx-0"
                >
                  Simpan
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-slate-800">
                  {user.name}
                </h1>
                <p className="text-slate-500 font-medium">{user.email}</p>
              </>
            )}

            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
              <span className="bg-linear-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm shadow-orange-200">
                {user.memberLevel} Member
              </span>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                {completedTrips}x Perjalanan
              </span>
            </div>
          </div>

          {/* Points Display */}
          <div
            className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[140px] cursor-pointer hover:bg-blue-50 transition"
            onClick={() => handlePlaceholder("Tukar Poin")}
          >
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wide">
              Travel Points
            </div>
            <div className="text-2xl font-bold text-blue-600">45.200</div>
            <div className="text-[10px] font-bold text-blue-500 mt-1 hover:underline">
              Tukar Poin →
            </div>
          </div>
        </div>

        {/* MENU SECTIONS */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: Pengaturan Akun */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              ⚙️ Pengaturan Akun
            </h3>
            <ul className="space-y-1">
              {[
                { label: "Daftar Penumpang Disimpan", icon: "👥" },
                { label: "Metode Pembayaran", icon: "💳" },
                { label: "Refund & Reschedule", icon: "cw" }, // Teks icon dummy
                { label: "Notifikasi", icon: "🔔" },
              ].map((menu) => (
                <li
                  key={menu.label}
                  onClick={() => handlePlaceholder(menu.label)}
                  className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition group"
                >
                  <span className="text-slate-600 font-medium text-sm group-hover:text-blue-600 transition flex items-center gap-3">
                    {/* Jika icon bukan emoji, bisa ganti logic ini */}
                    <span>{menu.label}</span>
                  </span>
                  <span className="text-slate-300 text-lg">›</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Keamanan */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              🛡️ Keamanan & Bantuan
            </h3>
            <ul className="space-y-1">
              {[
                { label: "Ubah Kata Sandi", icon: "🔑" },
                { label: "Pusat Bantuan", icon: "🎧" },
                { label: "Syarat & Ketentuan", icon: "📄" },
                { label: "Tentang Aplikasi", icon: "ℹ️" },
              ].map((menu) => (
                <li
                  key={menu.label}
                  onClick={() => handlePlaceholder(menu.label)}
                  className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition group"
                >
                  <span className="text-slate-600 font-medium text-sm group-hover:text-blue-600 transition">
                    {menu.label}
                  </span>
                  <span className="text-slate-300 text-lg">›</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePlaceholder("Keluar Akun")}
              className="w-full mt-4 text-red-500 font-bold text-sm py-3 rounded-xl hover:bg-red-50 transition border border-transparent hover:border-red-100"
            >
              Keluar Akun
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
