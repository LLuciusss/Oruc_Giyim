'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabaseClient'; // Yolun doğruluğunu kontrol et
import Toast from '../../../components/Toast'; // Toast bileşeninin yolu

export default function AdminGiris() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ goster: false, mesaj: '', tip: 'success' });
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (error) {
      setToast({ goster: true, mesaj: "Giriş başarısız: " + error.message, tip: 'error' });
      setLoading(false);
    } else {
      if (data.user.email === 'orhuc@gmail.com') {
        router.push('/admin');
      } else {
        await supabase.auth.signOut();
        setToast({ goster: true, mesaj: "Bu panele erişim yetkiniz yok!", tip: 'error' });
        setLoading(false);
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Bildirim Balonu */}
      {toast.goster && (
        <Toast 
          mesaj={toast.mesaj} 
          tip={toast.tip} 
          onClose={() => setToast({ ...toast, goster: false })} 
        />
      )}

      <form onSubmit={handleLogin} className="p-8 border rounded-2xl w-96 shadow-lg bg-white">
        <h2 className="text-xl font-bold mb-4">Admin Girişi</h2>
        <input 
          className="w-full p-2 border mb-2 rounded" 
          placeholder="E-posta" 
          type="email"
          required
          onChange={e => setEmail(e.target.value)} 
        />
        <input 
          className="w-full p-2 border mb-4 rounded" 
          type="password" 
          placeholder="Şifre" 
          required
          onChange={e => setPassword(e.target.value)} 
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}