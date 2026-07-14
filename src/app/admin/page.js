'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';

export default function AdminPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [urunler, setUrunler] = useState([]);
  const [yeniUrun, setYeniUrun] = useState({ isim: '', fiyat: '', aciklama: '', resim_url: '' });
  
  // Düzenleme için state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      
      // 1. Giriş yapmış mı?
      if (!user) {
        router.push('/admin/giris');
      } 
      // 2. GÜVENLİK KONTROLÜ: E-posta senin e-posta adresin mi?
      else if (user.email !== 'orhuc@gmail.com') { 
        alert("Yetkisiz erişim! Bu panel sadece yönetici içindir.");
        router.push('/'); // Ana sayfaya at
      } 
      // 3. Her şey tamamsa paneli göster
      else {
        setLoading(false);
        fetchUrunler();
      }
    }
    checkUser();
  }, []);

  async function fetchUrunler() {
  const { data, error } = await supabase
    .from('urunler')
    .select('*');

  if (error) {
    console.error("Supabase'den veri çekilirken hata oluştu:", error);
  } else {
    console.log("Çekilen ürünler:", data); // F12 Konsolunda burayı kontrol et!
    setUrunler(data || []);
  }
}

  async function urunEkle() {
    await supabase.from('urunler').insert([yeniUrun]);
    setYeniUrun({ isim: '', fiyat: '', aciklama: '', resim_url: '' });
    fetchUrunler();
  }

  // Ürünü Güncelleme Fonksiyonu
  async function urunGuncelle(id) {
    console.log("Gönderilen ID:", id);
    console.log("Gönderilen Veri:", editForm);
    
    const { data, error } = await supabase
      .from('urunler')
      .update(editForm)
      .eq('id', id);

    if (error) {
      console.error("Güncelleme hatası:", error);
    } else {
      console.log("Başarıyla güncellendi!");
      setEditingId(null);
      fetchUrunler();
    }
  }

  async function urunSil(id) {
    await supabase.from('urunler').delete().eq('id', id);
    fetchUrunler();
  }

  if (loading) return <div className="p-10">Kontrol ediliyor...</div>;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Ürün Yönetim Paneli</h1>

      {/* Ekleme Formu */}
      <div className="bg-gray-50 p-6 rounded-2xl mb-10 border">
        <h2 className="font-bold mb-4">Yeni Ürün Ekle</h2>
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Ürün İsmi" className="p-2 border rounded" onChange={e => setYeniUrun({...yeniUrun, isim: e.target.value})} value={yeniUrun.isim} />
          <input placeholder="Fiyat" type="number" className="p-2 border rounded" onChange={e => setYeniUrun({...yeniUrun, fiyat: e.target.value})} value={yeniUrun.fiyat} />
          <input placeholder="Açıklama" className="p-2 border rounded col-span-2" onChange={e => setYeniUrun({...yeniUrun, aciklama: e.target.value})} value={yeniUrun.aciklama} />
          <input placeholder="Resim URL" className="p-2 border rounded col-span-2" onChange={e => setYeniUrun({...yeniUrun, resim_url: e.target.value})} value={yeniUrun.resim_url} />
          <button onClick={urunEkle} className="bg-green-600 text-white p-2 rounded col-span-2">Ürünü Ekle</button>
        </div>
      </div>

      {/* Ürün Listesi */}
      <div className="space-y-4">
        {urunler.map((urun) => (
          <div key={urun.id} className="p-4 border rounded-xl shadow-sm">
            {editingId === urun.id ? (
              <div className="grid gap-2">
                <input className="p-2 border rounded" defaultValue={urun.isim} onChange={e => setEditForm({...editForm, isim: e.target.value})} />
                <input className="p-2 border rounded" type="number" defaultValue={urun.fiyat} onChange={e => setEditForm({...editForm, fiyat: e.target.value})} />
                <input className="p-2 border rounded" defaultValue={urun.aciklama} onChange={e => setEditForm({...editForm, aciklama: e.target.value})} />
                <input className="p-2 border rounded" defaultValue={urun.resim_url} onChange={e => setEditForm({...editForm, resim_url: e.target.value})} />
                <div className="flex gap-2">
                  <button onClick={() => urunGuncelle(urun.id)} className="bg-blue-600 text-white px-4 py-2 rounded">Kaydet</button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{urun.isim}</p>
                  <p className="text-sm text-gray-500">{urun.fiyat} TL</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(urun.id); setEditForm(urun); }} className="bg-blue-500 text-white px-4 py-2 rounded text-sm">Düzenle</button>
                  <button onClick={() => urunSil(urun.id)} className="bg-red-500 text-white px-4 py-2 rounded text-sm">Sil</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}