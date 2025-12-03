import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrder, type OrderItem } from "../context/OrderContext";

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, user } = useOrder();
  const [ticket, setTicket] = useState<OrderItem | null>(null);

  useEffect(() => {
    // Cari pesanan berdasarkan ID dari URL
    const found = orders.find((o) => o.id === id);
    if (found) {
      setTicket(found);
    } else {
      // Jika tidak ketemu (misal refresh), kembalikan ke list
      // navigate('/orders');
    }
  }, [id, orders, navigate]);

  if (!ticket)
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-500">
        Memuat tiket...
      </div>
    );

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blur Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-500/30 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>

      {/* Tombol Kembali */}
      <button
        onClick={() => navigate("/orders")}
        className="absolute top-6 left-6 text-white/80 hover:text-white flex items-center gap-2 z-20 font-bold text-sm"
      >
        ← Kembali
      </button>

      {/* KARTU TIKET UTAMA */}
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-in slide-in-from-bottom-10 duration-700">
        {/* 1. HEADER TIKET (Warna Beda Tiap Tipe) */}
        <div
          className={`p-6 text-white flex justify-between items-start relative overflow-hidden ${
            ticket.type === "FLIGHT"
              ? "bg-blue-600"
              : ticket.type === "HOTEL"
              ? "bg-teal-600"
              : "bg-orange-600"
          }`}
        >
          {/* Pattern Hiasan */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>

          <div className="relative z-10">
            <h1 className="font-black text-2xl tracking-tighter">TRAVIO</h1>
            <p className="text-[10px] font-bold tracking-[0.3em] opacity-80">
              E-TICKET
            </p>
          </div>
          <div className="text-right relative z-10">
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border border-white/30">
              Confirmed
            </div>
            <p className="text-xs mt-1 opacity-80 font-mono">{ticket.id}</p>
          </div>
        </div>

        {/* 2. KONTEN TIKET */}
        <div className="p-6 bg-white">
          {/* Detail Utama (Beda Tampilan per Tipe) */}
          <div className="mb-6">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              {ticket.type} TICKET
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900 leading-tight mt-1">
              {ticket.title}
            </h2>
            <p className="text-sm text-stone-500 mt-1 font-medium">
              {ticket.subtitle}
            </p>
          </div>

          {/* Grid Informasi */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-6">
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-bold">
                Nama Tamu
              </p>
              <p className="text-sm font-bold text-stone-800 truncate">
                {user.name}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-bold">
                Tanggal
              </p>
              <p className="text-sm font-bold text-stone-800">
                {ticket.dateRange}
              </p>
            </div>

            {/* Info Spesifik per Tipe */}
            {ticket.type === "FLIGHT" && (
              <>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase font-bold">
                    Gate
                  </p>
                  <p className="text-sm font-bold text-stone-800">B4</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase font-bold">
                    Seat
                  </p>
                  <p className="text-sm font-bold text-stone-800">12A</p>
                </div>
              </>
            )}

            {ticket.type === "HOTEL" && (
              <>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase font-bold">
                    Check-in
                  </p>
                  <p className="text-sm font-bold text-stone-800">14:00 WIB</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase font-bold">
                    Durasi
                  </p>
                  <p className="text-sm font-bold text-stone-800">
                    {ticket.durationInfo}
                  </p>
                </div>
              </>
            )}

            {ticket.type === "RENTAL" && (
              <>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase font-bold">
                    Layanan
                  </p>
                  <p className="text-sm font-bold text-stone-800">
                    Lepas Kunci
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase font-bold">
                    Durasi
                  </p>
                  <p className="text-sm font-bold text-stone-800">
                    {ticket.durationInfo}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Garis Putus-putus (Sobekan Tiket) */}
          <div className="relative flex items-center justify-between my-8">
            <div className="w-6 h-6 bg-stone-900 rounded-full -ml-9"></div>
            <div className="flex-1 border-t-2 border-dashed border-stone-200 mx-2"></div>
            <div className="w-6 h-6 bg-stone-900 rounded-full -mr-9"></div>
          </div>

          {/* 3. QR CODE & BARCODE AREA */}
          <div className="text-center">
            <p className="text-[10px] text-stone-400 mb-3 uppercase tracking-widest">
              Scan Kode ini saat Check-in
            </p>
            <div className="bg-stone-900 p-4 rounded-2xl inline-block shadow-lg mb-4">
              {/* Gambar QR Code Dummy */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.id}`}
                alt="QR Code"
                className="w-32 h-32 rounded-lg bg-white p-1"
              />
            </div>
            <p className="font-mono text-xs text-stone-500 tracking-[0.2em]">
              {ticket.id}
            </p>
          </div>
        </div>

        {/* 4. FOOTER ACTION */}
        <div className="bg-stone-50 p-4 border-t border-stone-100 flex gap-3">
          <button className="flex-1 py-3 rounded-xl font-bold text-xs bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 transition">
            Simpan Gambar
          </button>
          <button className="flex-1 py-3 rounded-xl font-bold text-xs bg-stone-900 text-white hover:bg-orange-600 transition shadow-lg">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
