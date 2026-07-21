// src/app/api/shopier/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { sepetUrunleri, userDetails } = await request.json();

    const toplamTutar = sepetUrunleri.reduce((toplam, item) => toplam + (item.urunler.fiyat * item.adet), 0);

    const clientId = process.env.SHOPIER_CLIENT_ID;
    const clientSecret = process.env.SHOPIER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Shopier API kimlik bilgileri eksik!' }, { status: 500 });
    }

    // Şimdilik hata almamak ve sistemin akışını görebilmek adına 
    // kullanıcıyı doğrudan Shopier ana sayfasına veya kendi panelindeki bir ürüne yönlendirebiliriz.
    // (İlerleyen aşamada Shopier OAuth token yanıtına göre burası dinamikleşecek)
    
    // Geçici test yönlendirmesi (Shopier ana sayfası veya dükkanın)
    const shopierPaymentUrl = `https://www.shopier.com/`;

    return NextResponse.json({ url: shopierPaymentUrl });

  } catch (error) {
    return NextResponse.json({ error: 'Ödeme başlatılırken bir hata oluştu.' }, { status: 500 });
  }
}
