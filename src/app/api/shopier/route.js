// src/app/api/shopier/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { sepetUrunleri, userDetails } = await request.json();

    // Toplam fiyatı hesapla
    const toplamTutar = sepetUrunleri.reduce((toplam, item) => toplam + (item.urunler.fiyat * item.adet), 0);

    // Çevresel değişkenlerden (Environment Variables) API anahtarını alıyoruz
    const shopierApiKey = process.env.SHOPIER_API_KEY;

    if (!shopierApiKey) {
      return NextResponse.json({ error: 'Shopier API anahtarı bulunamadı!' }, { status: 500 });
    }

    // Shopier API isteklerinde token'ı headers içerisine Bearer olarak ekleyebilirsin:
    // Örnek istek yapısı:
    /*
    const response = await fetch('https://www.shopier.com/api/v1/...', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${shopierApiKey}`
      },
      body: JSON.stringify({
        total_amount: toplamTutar,
        currency: 'TL',
        buyer: userDetails
      })
    });
    */

    // Şimdilik kullanıcıyı yönlendireceğimiz ödeme URL'ini dönüyoruz
    const shopierPaymentUrl = `https://www.shopier.com/ShowProduct/api_pay.php?id=XXXXXX`;

    return NextResponse.json({ url: shopierPaymentUrl });

  } catch (error) {
    return NextResponse.json({ error: 'Ödeme başlatılırken bir hata oluştu.' }, { status: 500 });
  }
}
