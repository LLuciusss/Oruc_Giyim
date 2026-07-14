// src/app/api/shopier/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { sepetUrunleri, userDetails } = await request.json();

  // Toplam fiyatı hesapla
  const toplamTutar = sepetUrunleri.reduce((toplam, item) => toplam + (item.urunler.fiyat * item.adet), 0);

  // Shopier API kimlik bilgileri (Env dosyasından alınmalı)
  const shopierApiKey = process.env.SHOPIER_API_KEY;
  const shopierApiSecret = process.env.SHOPIER_API_SECRET;

  // Shopier standartlarına göre form verilerini hazırlama ve imzalama işlemi burada yapılır.
  // Gerekli parametreler:
  const paymentParams = {
    id: userDetails.id,
    buyer_name: userDetails.name,
    buyer_surname: userDetails.surname,
    buyer_email: userDetails.email,
    buyer_phone: userDetails.phone,
    total_amount: toplamTutar,
    currency: 'TL',
    // ... Shopier signature algoritmaları
  };

  // Bu örnekte kullanıcıyı yönlendireceğimiz otomatik oluşturulan Shopier formunu veya linkini dönüyoruz.
  const shopierPaymentUrl = `https://www.shopier.com/ShowProduct/api_pay.php?id=XXXXXX`; // Hesap entegrasyonuna göre değişir

  return NextResponse.json({ url: shopierPaymentUrl });
}