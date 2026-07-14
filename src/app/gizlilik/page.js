import Link from 'next/link';
export default function Gizlilik() {
  return (
    <div className="max-w-4xl mx-auto p-10 mt-10 bg-white shadow-sm rounded-2xl border border-gray-100">
      <h1 className="text-3xl font-black mb-6">Gizlilik Politikası</h1>
      <div className="space-y-6 text-gray-600 leading-relaxed text-sm">
        <section>
          <h2 className="font-bold text-gray-900 mb-2">Veri Güvenliği</h2>
          <p>Kullanıcılarımızın kişisel bilgileri (e-posta, isim, kargo adresi) sadece sipariş işlemlerini tamamlamak ve sizi bilgilendirmek için kullanılır. Bilgileriniz 3. şahıslarla paylaşılmaz.</p>
        </section>
        <section>
          <h2 className="font-bold text-gray-900 mb-2">Çerezler (Cookies)</h2>
          <p>Sitemiz, kullanıcı deneyimini iyileştirmek ve sepetinizi hatırlamak için çerezler kullanmaktadır.</p>
        </section>
        <section>
          <h2 className="font-bold text-gray-900 mb-2">İletişim</h2>
          <p>Verilerinizle ilgili herhangi bir sorunuz veya silme talebiniz olursa <b>destek@orhuctekstil.com</b> adresinden bizimle iletişime geçebilirsiniz.</p>
        </section>
      </div>
    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition mb-6 group">
  <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
  <span className="text-sm font-medium">Ana sayfaya dön</span>
</Link>
    </div>
  );
}