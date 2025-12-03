import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* --- 1. DESKTOP NAVBAR (Hanya muncul di layar md ke atas) --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-stone-200/60 transition-all duration-300 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* LOGO TEXT ONLY */}
            <Link to="/" className="flex flex-col justify-center group">
              <h1 className="text-2xl font-extrabold text-stone-900 tracking-tighter leading-none group-hover:text-orange-600 transition-colors">
                TRAVIO
              </h1>
              <span className="text-[10px] font-bold text-stone-400 tracking-[0.3em] uppercase mt-0.5">
                EXPLORE
              </span>
            </Link>

            {/* MENU DESKTOP */}
            <div className="flex items-center gap-1 bg-stone-100/50 p-1 rounded-lg border border-stone-200/50">
              <NavLink to="/" active={isActive("/")} label="Penerbangan" />
              <NavLink
                to="/hotels"
                active={isActive("/hotels")}
                label="Hotel"
              />
              <NavLink
                to="/rentals"
                active={isActive("/rentals")}
                label="Rental Mobil"
              />
            </div>

            {/* PROFILE DESKTOP */}
            <div className="flex items-center gap-6">
              <Link
                to="/orders"
                className={`text-sm font-bold transition-colors ${
                  isActive("/orders")
                    ? "text-orange-600"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Pesanan Saya
              </Link>
              <div className="w-px h-4 bg-stone-300"></div>
              <Link to="/profile" className="text-right group">
                <p className="text-sm font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                  Rizky Traveler
                </p>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                  Gold Member
                </p>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- 2. MOBILE HEADER (Logo Kiri, Profile Kanan) --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200 px-5 py-4 flex items-center justify-between shadow-sm transition-all">
        {/* KIRI: Logo Teks */}
        <Link to="/" className="flex flex-col">
          <span className="text-xl font-black text-stone-900 leading-none tracking-tighter">
            TRAVIO
          </span>
          <span className="text-[9px] font-bold text-stone-400 tracking-[0.3em] uppercase">
            EXPLORE
          </span>
        </Link>

        {/* KANAN: Foto Profile Kecil (Akses ke Halaman Profile) */}
        <Link
          to="/profile"
          className="relative block active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 rounded-full border border-stone-200 p-0.5 bg-white shadow-sm">
            <img
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=Rizky"
              alt="Profile"
              className="w-full h-full rounded-full object-cover bg-stone-100"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
        </Link>
      </div>

      {/* --- 3. MOBILE BOTTOM TAB BAR (TEXT ONLY - IMPROVED) --- */}
      <div className="md:hidden fixed bottom-0 left-0 z-50 w-full bg-white/95 backdrop-blur-xl border-t border-stone-200 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {/* Grid 4 Kolom (Profile dihapus) */}
        <div className="grid grid-cols-4 h-[72px]">
          <MobileTab to="/" active={isActive("/")} label="Flights" />
          <MobileTab to="/hotels" active={isActive("/hotels")} label="Hotels" />
          <MobileTab
            to="/rentals"
            active={isActive("/rentals")}
            label="Rentals"
          />
          <MobileTab to="/orders" active={isActive("/orders")} label="Orders" />
        </div>
      </div>
    </>
  );
}

// --- COMPONENTS ---

function NavLink({
  to,
  active,
  label,
}: {
  to: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      to={to}
      className={`px-6 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
        active
          ? "bg-white text-stone-900 shadow-sm"
          : "text-stone-500 hover:text-stone-700"
      }`}
    >
      {label}
    </Link>
  );
}

function MobileTab({
  to,
  active,
  label,
}: {
  to: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      to={to}
      className={`relative flex items-center justify-center w-full h-full transition-all duration-300 group ${
        active ? "bg-orange-50/30" : "hover:bg-stone-50"
      }`}
    >
      {/* Teks Utama */}
      <span
        className={`
        text-xs font-black tracking-wider uppercase transition-all duration-300
        ${
          active
            ? "text-orange-600 scale-110"
            : "text-stone-400 group-hover:text-stone-600"
        }
      `}
      >
        {label}
      </span>

      {/* Indikator Garis Atas (Hanya muncul jika aktif) */}
      {active && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-orange-600 rounded-b-full shadow-sm shadow-orange-200"></div>
      )}
    </Link>
  );
}
