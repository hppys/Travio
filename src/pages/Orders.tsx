import { useOrder } from "../context/OrderContext";

export default function Orders() {
  const { orders, updateOrderStatus } = useOrder();

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 text-slate-400">
        <div className="text-6xl mb-4 opacity-50">🎫</div>
        <h3 className="text-lg font-bold text-slate-600">Belum ada pesanan</h3>
        <p className="text-sm">Pesan tiket pesawat atau hotel dulu, yuk!</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 sticky top-0 bg-slate-50 pt-4 pb-2 z-10">
        Pesanan Saya
      </h2>

      <div className="space-y-5">
        {orders.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
          >
            {/* Header Pesanan */}
            <div className="flex justify-between items-start mb-4 border-b border-slate-50 pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase">
                  {item.type}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {item.id}
                </span>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                  item.status === "success"
                    ? "bg-green-100 text-green-700"
                    : item.status === "cancelled"
                    ? "bg-red-50 text-red-600"
                    : "bg-orange-50 text-orange-600"
                }`}
              >
                {item.status === "pending"
                  ? "Menunggu"
                  : item.status === "success"
                  ? "E-Ticket Terbit"
                  : "Dibatalkan"}
              </span>
            </div>

            <div className="flex gap-4">
              <img
                src={item.image}
                className="w-20 h-20 rounded-2xl object-cover bg-slate-100"
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{item.subtitle}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-medium">
                    📅 {item.detailDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-dashed border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">
                  Total Bayar
                </p>
                <p className="text-xl font-bold text-blue-600">
                  Rp {item.totalPrice.toLocaleString("id-ID")}
                </p>
              </div>

              {item.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateOrderStatus(item.id, "cancelled")}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => updateOrderStatus(item.id, "success")}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-blue-600 transition shadow-lg shadow-slate-200"
                  >
                    Bayar
                  </button>
                </div>
              )}
              {item.status === "success" && (
                <button className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                  Lihat Tiket
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
