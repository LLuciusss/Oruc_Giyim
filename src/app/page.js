'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import Link from 'next/link';

export default function Home() {
  // Başlangıç değerini boş bırakıyoruz, veriler Supabase'den gelecek
  const [urunler, setUrunler] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [toast, setToast] = useState({ goster: false, mesaj: '', tip: 'success' });

  // Verileri çekme fonksiyonu
 async function fetchUrunler() {
  const { data, error } = await supabase
    .from('urunler')
    .select('*')
    .order('id', { ascending: true }); // BURAYI EKLE

  if (error) {
    console.error("Supabase Hata:", error);
  } else {
    setUrunler(data || []);
  }
}

  useEffect(() => {
    async function init() {
      // 1. Kullanıcıyı yükle
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      setAuthLoading(false);
      
      // 2. Ürünleri yükle
      fetchUrunler();
    }
    init();
  }, []);

  const bildirimGoster = (mesaj, tip = 'success') => {
    setToast({ goster: true, mesaj, tip });
    setTimeout(() => { setToast(prev => ({ ...prev, goster: false })); }, 3000);
  };

  const sepeteEkle = async (urunId) => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      bildirimGoster("Sepete eklemek için lütfen giriş yapın.", "error");
      return;
    }

    const { data: mevcutSepet } = await supabase
      .from('sepet')
      .select('*')
      .eq('user_id', currentUser.id)
      .eq('urun_id', urunId)
      .single();

    if (mevcutSepet) {
      await supabase.from('sepet').update({ adet: mevcutSepet.adet + 1 }).eq('id', mevcutSepet.id);
      bildirimGoster("Ürün adedi artırıldı! 🛒");
    } else {
      await supabase.from('sepet').insert([{ user_id: currentUser.id, urun_id: urunId, adet: 1 }]);
      bildirimGoster("Ürün başarıyla sepete eklendi! 🛒");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="bg-white border-b sticky top-0 z-40 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto rounded-b-xl shadow-sm mt-2">
        <Link href="/" className="flex items-center gap-2">
          <img src="/orhuc.png" alt="ORHUÇ Logo" className="h-10 w-auto object-contain" />
          <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">ORHUÇ</span> <span>Tekstil ve Şapka</span>
        </Link>
        <div className="flex items-center gap-4">
          {authLoading ? <div className="h-9 w-24 bg-gray-100 animate-pulse rounded-xl"></div> : user ? (
            <>
              <span className="text-sm text-gray-600 hidden sm:inline font-medium">{user.email}</span>
              <Link href="/sepet" className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition shadow-sm">Sepetim 🛒</Link>
              <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login'; }} className="text-rose-600 text-xs font-bold hover:text-rose-700 transition">Çıkış Yap</button>
            </>
          ) : (
            <Link href="/login" className="bg-black text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition shadow-sm">Giriş Yap / Kayıt Ol</Link>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 relative">
        {toast.goster && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
            <span className="text-sm font-semibold">{toast.mesaj}</span>
          </div>
        )}

        <h1 className="text-3xl font-extrabold text-center mb-2 text-gray-800 mt-6">Özel Tasarım Şapkalarımız</h1>
        <p className="text-center text-gray-500 mb-10 text-sm">Tarzınızı tamamlayacak en kaliteli ürünler.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {urunler.map((urun) => (
            <div key={urun.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300 flex flex-col overflow-hidden">
              <div className="p-4 bg-gray-50/50 flex justify-center items-center h-64">
                <img src={urun.resim_url} alt={urun.isim} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-1">{urun.isim}</h3>
                <p className="text-gray-400 text-xs flex-1 mb-4">{urun.aciklama}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xl font-black text-emerald-600">{urun.fiyat} TL</span>
                  <button onClick={() => sepeteEkle(urun.id)} className="bg-gray-900 text-white text-xs px-4 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition-colors">
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer - Sayfanın en dışına taşındı */}
      <footer className="w-full bg-white border-t mt-20 py-20 px-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-black mb-4 tracking-tighter text-gray-900">🎩 ORHUÇ</h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Kaliteli tekstil ve özel tasarım şapka koleksiyonları. 2026'dan beri tarzınızı tamamlıyoruz.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-5">Kurumsal</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/sartlar" className="text-blue-900 hover:text-blue-700 hover:underline">Şartlar ve Koşullar</Link></li>
              <li><Link href="/gizlilik" className="text-blue-900 hover:text-blue-700 hover:underline">Gizlilik Politikası</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-5">İletişim</h3>
            <div className="space-y-3 text-sm text-gray-500">
              <p>destek@orhuctekstil.com</p>
              <p>Aydın, Türkiye</p>
           <a href='https://www.instagram.com/furkanows/'>Furkan Orhan</a> <b> 
           <a href='https://www.instagram.com/ucgun.ahmet0809/'>Ahmet Uçgun </a> 
            </div>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t text-left text-gray-400 text-xs">
          © 2026 ORHUÇ Tekstil & Şapka. Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  );
}
