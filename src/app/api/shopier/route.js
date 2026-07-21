// src/app/api/shopier/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { sepetUrunleri, userDetails } = await request.json();

    // 1. Toplam fiyatı hesapla
    const toplamTutar = sepetUrunleri.reduce((toplam, item) => toplam + (item.urunler.fiyat * item.adet), 0);

    const clientId = process.env.SHOPIER_CLIENT_ID;
    const clientSecret = process.env.SHOPIER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Shopier API kimlik bilgileri eksik!' }, { status: 500 });
    }

    // 2. Shopier API'den Token alma ve Ödeme başlatma adımı
    // (Shopier dokümantasyonundaki güncel OAuth / token endpoint adresine göre burası şekillenir)
    /*
    const tokenResponse = await fetch('https://www.shopier.com/api/v1/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret })
    });
    const tokenData = await tokenResponse.json();
    */

    // Şimdilik sistemin hatasız çalışıp seni test etmen için yönlendirme URL'ini veriyoruz.
    // Gerçek entegrasyon tamamlandığında Shopier'den dönen ödeme URL'ini buraya bağlayacağız.
    const shopierPaymentUrl = `https://www.shopier.com/ShowProduct/api_pay.php?id=${clientId}`;

    return NextResponse.json({ url: shopierPaymentUrl });

  } catch (error) {
    return NextResponse.json({ error: 'Ödeme başlatılırken bir hata oluştu.' }, { status: 500 });
  }
}
