'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function UrunKarti({ urun, user }) {
  const [isOpen, setIsOpen] = useState(false);

  // Supabase Storage üzerindeki resimlerin tam adresi
  // Not: Eğer resim ismin veritabanında 'sapka1.jpg' gibi tam isimle tutuluyorsa bu yapı çalışacaktır.
  const resimBaseUrl = "https://tqzarbqjjmojznngysrs.supabase.co/storage/v1/object/public/resimler/";
  const tamResimUrl = `${resimBaseUrl}${urun.resim_url}`;

  const sepeteEkle = async () => {
    if (!user) {
      alert('Lütfen önce giriş yapın!');
      return;
    }

    const { error } = await supabase.from('sepet').upsert(
      { user_id: user.id, urun_id: urun.id, adet: 1 },
      { onConflict: 'user_id,urun_id' }
    );

    if (error) alert('Sepete eklenirken hata oluştu.');
    else alert('Ürün sepete eklendi!');
  };

  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white">
      {/* Ürün Resmi */}
      <img
        src={tamResimUrl}
        alt={urun.isim}
        className="w-full h-80 object-contain rounded-lg cursor-pointer hover:scale-105 transition duration-300"
        onClick={() => setIsOpen(true)}
      />

      <h3 className="mt-4 font-semibold text-lg text-gray-800">{urun.isim}</h3>
      <p className="text-sm text-gray-500 line-clamp-2">{urun.aciklama}</p>
      
      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold text-xl text-emerald-600">{urun.fiyat} TL</span>
        <button
          onClick={sepeteEkle}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
        >
          Sepete Ekle
        </button>
      </div>

      {/* Büyütülmüş Resim Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img src={tamResimUrl} alt={urun.isim} className="rounded-lg max-h-[85vh] object-contain" />
            <button className="absolute top-2 right-2 bg-white text-black rounded-full p-2 font-bold">X</button>
          </div>
        </div>
      )}
    </div>
  );
}
