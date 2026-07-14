import Link from 'next/link';

export default function Sartlar() {
  return (
    <div className="max-w-4xl mx-auto p-10 mt-10 bg-white shadow-sm rounded-2xl border border-gray-100">
      <h1 className="text-3xl font-black mb-6">Şartlar ve Koşullar</h1>
      <div className="space-y-6 text-gray-600 leading-relaxed text-sm">
        <section>
          <h2 className="font-bold text-gray-900 mb-2">1. Genel</h2>
          <p>Bu siteyi kullanarak, ORHUÇ Tekstil'in belirlediği tüm şartları kabul etmiş sayılırsınız.</p>
        </section>
        <section>
          <h2 className="font-bold text-gray-900 mb-2">2. Ürünler ve Satış</h2>
          <p>Sitede yer alan ürünlerin renk ve dokuları ekran ayarlarınıza göre farklılık gösterebilir. Siparişleriniz onaylandıktan sonra hazırlanıp kargoya verilir.</p>
        </section>
        <section>
          <h2 className="font-bold text-gray-900 mb-2">3. Fikri Mülkiyet</h2>
          <p>Bu sitedeki tüm içerik, tasarım ve görseller ORHUÇ Tekstil'e aittir. İzinsiz kopyalanamaz.</p>
        </section>
        <section>
          <h2 className="font-bold text-gray-900 mb-2">4. Sorumluluk Reddi</h2>
          <p>Oluşabilecek kargo gecikmeleri veya mücbir sebeplerden doğan aksaklıklardan şirketimiz sorumlu tutulamaz.</p>
        </section>
      </div>
    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition mb-6 group">
  <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
  <span className="text-sm font-medium">Ana sayfaya dön</span>
</Link>
    </div>
  );
}