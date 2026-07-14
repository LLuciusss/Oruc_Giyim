'use client';
import { useEffect } from 'react';

export default function Toast({ mesaj, tip, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // 5 saniye sonra kapat
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-xl shadow-2xl border transition-all duration-300 animate-in slide-in-from-right-10
      ${tip === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
      <p className="font-semibold">{mesaj}</p>
    </div>
  );
}