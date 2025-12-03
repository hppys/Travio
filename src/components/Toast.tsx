import { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-100 animate-bounce-in">
      <div className="bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2">
        <span className="text-green-400 text-xl">✓</span>
        <span className="font-medium text-sm">{message}</span>
      </div>
    </div>
  );
}
