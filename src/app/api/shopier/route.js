// src/app/api/shopier/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { sepetUrunleri, userDetails } = await request.json();

    // 1. Toplam fiyatı hesapla
    const toplamTutar = sepetUrunleri.reduce((toplam, item) => toplam + (item.urunler.fiyat * item.adet), 0);

    const apiKey = process.env.SHOPIER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API anahtarı eksik!' }, { status: 500 });
    }

    // 2. Shopier API'sine sepet verilerini gönderip ödeme linki alma isteği
    // (Shopier'in resmi dokümantasyonundaki API endpoint adresini buraya yazmalısın)
    /*
    const shopierResponse = await fetch('https://www.shopier.com/api/v1/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        total_order_value: toplamTutar,
        currency: 'TL',
        buyer: {
          name: userDetails.name,
          surname: userDetails.surname,
          email: userDetails.email,
          phone: userDetails.phone
        },
        items: sepetUrunleri
      })
    });
    const paymentData = await shopierResponse.json();
    */

    // Şimdilik test / yönlendirme yapabilmen için form yapısı:
    // Eğer doğrudan manuel form yönlendirmesi yapacaksan Shopier'in standart POST form adresini kullanmalısın.
    const shopierPaymentUrl = `https://www.shopier.com/ShowProduct/api_pay.php?id=BURAYA_MAGAZA_ID_YAZILACAK`;

    return NextResponse.json({ url: shopierPaymentUrl });

  } catch (error) {
    return NextResponse.json({ error: 'Ödeme başlatılamadı.' }, { status: 500 });
  }
}
