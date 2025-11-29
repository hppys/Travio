import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* --- 1. DESKTOP NAVBAR (Hanya muncul di md ke atas) --- */}
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 transition-all duration-300 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-11 h-11 bg-linear-to-br from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform duration-300">
                ✈️
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                  TravelApp
                </h1>
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5">
                  Explore World
                </span>
              </div>
            </Link>

            {/* MENU DESKTOP */}
            <div className="flex items-center justify-center p-1.5 bg-slate-100/80 rounded-full border border-slate-200/50 backdrop-blur-sm">
              <NavLink
                to="/"
                active={isActive("/")}
                label="Flights"
                icon="🛫"
              />
              <NavLink
                to="/hotels"
                active={isActive("/hotels")}
                label="Hotels"
                icon="🏨"
              />
              <NavLink
                to="/rentals"
                active={isActive("/rentals")}
                label="Rentals"
                icon="🚗"
              />
            </div>

            {/* PROFILE DESKTOP */}
            <div className="flex items-center gap-6">
              <Link
                to="/orders"
                className={`flex flex-col items-end text-sm font-medium transition-colors ${
                  isActive("/orders")
                    ? "text-blue-600"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="leading-none font-bold">Pesanan</span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Riwayat
                </span>
              </Link>
              <div className="w-px h-8 bg-slate-200"></div>
              <Link
                to="/profile"
                className="flex items-center gap-3 group pl-1"
              >
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-700 leading-none group-hover:text-blue-600 transition-colors">
                    Rizky Traveler
                  </p>
                  <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wide mt-1">
                    Gold Member
                  </p>
                </div>
                <div
                  className={`relative w-10 h-10 rounded-full border-2 p-0.5 transition-all duration-300 ${
                    isActive("/profile")
                      ? "border-blue-600 scale-105 shadow-md shadow-blue-100"
                      : "border-white shadow-sm group-hover:border-slate-300"
                  }`}
                >
                  <img
                    src="https://api.dicebear.com/9.x/avataaars/svg?seed=Rizky"
                    alt="User"
                    className="w-full h-full rounded-full bg-slate-100 object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- 2. MOBILE HEADER (Logo Saja) --- */}
      <div className="md:hidden sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-lg shadow-md">
            ✈️
          </div>
          <span className="text-lg font-extrabold text-slate-800">
            TravelApp
          </span>
        </Link>
      </div>

      {/* --- 3. MOBILE BOTTOM TAB BAR (Menu Bawah) --- */}
      <div className="md:hidden fixed bottom-0 left-0 z-50 w-full bg-white border-t border-slate-200 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16 px-2">
          <MobileTab to="/" active={isActive("/")} label="Flights" icon="🛫" />
          <MobileTab
            to="/hotels"
            active={isActive("/hotels")}
            label="Hotels"
            icon="🏨"
          />
          <MobileTab
            to="/rentals"
            active={isActive("/rentals")}
            label="Rentals"
            icon="🚗"
          />
          <MobileTab
            to="/orders"
            active={isActive("/orders")}
            label="Orders"
            icon="📦"
          />
          <MobileTab
            to="/profile"
            active={isActive("/profile")}
            label="Profile"
            icon="👤"
          />
        </div>
      </div>
    </>
  );
}

// --- KOMPONEN PENDUKUNG ---

// 1. Link Desktop (Pill Shape)
function NavLink({
  to,
  active,
  label,
  icon,
}: {
  to: string;
  active: boolean;
  label: string;
  icon: string;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
        active
          ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200 scale-105"
          : "text-slate-500 hover:text-slate-900 hover:bg-white/60"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

// 2. Link Mobile (Bottom Tab Item)
function MobileTab({
  to,
  active,
  label,
  icon,
}: {
  to: string;
  active: boolean;
  label: string;
  icon: string;
}) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 active:scale-95 ${
        active ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
      }`}
    >
      <span
        className={`text-2xl transition-transform duration-300 ${
          active ? "-translate-y-1" : ""
        }`}
      >
        {icon}
      </span>
      <span className="text-[10px] font-bold tracking-wide">{label}</span>
      {/* Indikator Aktif (Titik Biru) */}
      {active && (
        <div className="w-1 h-1 bg-blue-600 rounded-full absolute bottom-1"></div>
      )}
    </Link>
  );
}
