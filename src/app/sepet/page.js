'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import Link from 'next/link';

export default function Sepetim() {
  const [sepetUrunleri, setSepetUrunleri] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function sepetiGetir() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      
      if (currentUser) {
        // Sepet verilerini ve bağlı olduğu ürün detaylarını (join) çekiyoruz
        const { data, error } = await supabase
          .from('sepet')
          .select('*, urunler(*)') 
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: true });

        if (!error && data) {
          // Supabase'den gelen veriyi işliyoruz
          const formatliSepet = data.map(item => ({
            ...item,
            urunler: item.urunler // Burada veritabanındaki ürün bilgileri eşleşiyor
          }));
          setSepetUrunleri(formatliSepet);
        } else if (error) {
          console.error("Sepet çekilirken hata oluştu:", error);
        }
      }
      setLoading(false);
    }
    sepetiGetir();
  }, []);

  const adetGuncelle = async (itemId, mevcutAdet, degisim) => {
    const yeniAdet = mevcutAdet + degisim;
    if (yeniAdet < 1) {
      sepettenSil(itemId);
      return;
    }

    setSepetUrunleri(prev => 
      prev.map(item => item.id === itemId ? { ...item, adet: yeniAdet } : item)
    );
    await supabase.from('sepet').update({ adet: yeniAdet }).eq('id', itemId);
  };

  const sepettenSil = async (itemId) => {
    setSepetUrunleri(prev => prev.filter(item => item.id !== itemId));
    await supabase.from('sepet').delete().eq('id', itemId);
  };

  const toplamFiyat = sepetUrunleri.reduce((toplam, item) => {
    return toplam + ((item.urunler?.fiyat || 0) * item.adet);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-950"></div>
      </div>
    );
  }

  const satinAl = async () => {
    if (sepetUrunleri.length === 0) return;
    try {
      const res = await fetch('/api/shopier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sepetUrunleri, userDetails: { email: user?.email } })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Ödeme başlatılamadı.");
    } catch (error) {
      console.error("Ödeme hatası:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Alışveriş Sepetim</h1>
          <Link href="/" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">← Alışverişe Devam Et</Link>
        </div>

        {sepetUrunleri.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center shadow-sm">
            <p className="text-gray-500 mb-6 font-medium">Sepetinizde ürün bulunmuyor.</p>
            <Link href="/" className="bg-black text-white text-sm font-bold px-6 py-3 rounded-xl">Ürünleri İncele</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {sepetUrunleri.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border p-4 shadow-sm flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl p-2 flex items-center justify-center overflow-hidden">
                    <img src={item.urunler?.resim_url} alt={item.urunler?.isim} className="max-h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm">{item.urunler?.isim}</h3>
                    <p className="text-emerald-600 font-extrabold text-sm">{item.urunler?.fiyat} TL</p>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border">
                    <button onClick={() => adetGuncelle(item.id, item.adet, -1)} className="w-8 h-8 rounded-lg hover:bg-gray-200">-</button>
                    <span className="text-sm font-bold w-6 text-center">{item.adet}</span>
                    <button onClick={() => adetGuncelle(item.id, item.adet, 1)} className="w-8 h-8 rounded-lg hover:bg-gray-200">+</button>
                  </div>
                  <button onClick={() => sepettenSil(item.id)} className="p-2 text-gray-400 hover:text-rose-500">🗑️</button>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border p-6 shadow-sm h-fit space-y-6">
              <h3 className="font-bold text-lg border-b pb-3">Sipariş Özeti</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Toplam</span>
                <span className="text-xl font-black text-emerald-600">{toplamFiyat} TL</span>
              </div>
              <button onClick={satinAl} className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-sm">
  Ödemeye Geç
</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}