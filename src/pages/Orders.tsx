import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";

export default function Orders() {
  const { orders, updateOrderStatus } = useOrder();
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 text-stone-400">
        <div className="text-6xl mb-4 opacity-30 grayscale">🎫</div>
        <h3 className="text-xl font-extrabold text-stone-600">
          Belum ada pesanan
        </h3>
        <p className="text-sm mt-2 max-w-xs mx-auto">
          Mulai petualangan Anda dengan memesan tiket pesawat, hotel, atau
          rental mobil sekarang!
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2.5 bg-orange-600 text-white text-sm font-bold rounded-xl hover:bg-orange-700 transition shadow-lg shadow-orange-200"
        >
          Cari Tiket
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-28">
      {/* Header Sticky */}
      <div className="sticky top-0 bg-stone-50/95 backdrop-blur-sm pt-4 pb-4 z-20 border-b border-stone-200/50 mb-6">
        <h2 className="text-2xl font-black text-stone-900 tracking-tight">
          PESANAN SAYA
        </h2>
      </div>

      <div className="space-y-6">
        {orders.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
          >
            {/* Status Bar */}
            <div className="flex justify-between items-start mb-5 border-b border-dashed border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase">
                  {item.type}
                </span>
                <span className="text-[10px] text-stone-400 font-mono font-bold tracking-wider">
                  #{item.id}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wide shadow-sm ${
                  item.status === "success"
                    ? "bg-green-100 text-green-700"
                    : item.status === "cancelled"
                    ? "bg-red-50 text-red-600"
                    : "bg-orange-50 text-orange-600 animate-pulse"
                }`}
              >
                {item.status === "pending"
                  ? "Menunggu Bayar"
                  : item.status === "success"
                  ? "Selesai"
                  : "Dibatalkan"}
              </span>
            </div>

            {/* Konten Utama */}
            <div className="flex gap-5 items-start">
              <div className="w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-stone-100 border border-stone-100 shadow-inner">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://placehold.co/200x200?text=No+Image")
                  }
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-stone-900 text-lg leading-tight mb-1 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-2">
                  {item.subtitle}
                </p>

                <div className="inline-flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100">
                  <span className="text-xs text-stone-400">📅</span>
                  <span className="text-xs font-bold text-stone-700">
                    {item.dateRange}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-0.5">
                  Total Tagihan
                </p>
                <p className="text-xl font-black text-orange-600">
                  Rp {item.totalPrice.toLocaleString("id-ID")}
                </p>
              </div>

              {item.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateOrderStatus(item.id, "cancelled")}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-500 hover:bg-stone-100 hover:text-red-600 transition uppercase tracking-wide"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => updateOrderStatus(item.id, "success")}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 transition uppercase tracking-wide"
                  >
                    Bayar
                  </button>
                </div>
              )}

              {item.status === "success" && (
                <button
                  onClick={() => navigate(`/tickets/${item.id}`)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-stone-100 text-stone-900 hover:bg-orange-600 hover:text-white transition uppercase tracking-wide border border-stone-200 hover:border-orange-600"
                >
                  Lihat Tiket
                </button>
              )}
            </div>

            {/* Hiasan Blob (Optional) */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
