# Release TODO — senin yapman gerekenler

Kalanların hepsi koddan yapılamıyor: ya bir dashboard yetkisi ya bir mağaza
formu gerektiriyor. Kod tarafı hazır: `bun run typecheck`, `bun run lint`,
`bun test`, `bun run i18n:check` temiz. Mimarinin güncel durumu ve geçmiş
(RevenueCat↔Play Store bağlantı sorununun kök nedeni dahil) için
`PROJECT_STATUS.md`.

**2026-08-21'de doğrulanıp tamamlanmış olanlar (tekrar yapmana gerek yok):**
- ✅ RevenueCat↔Google Play bağlantısı: service account yetkileri geçerli,
  gerçek Play Store app'inin (`app0fad1bdb19`) Monthly/Yearly ürünleri doğru
  `store_identifier` ile yeniden oluşturuldu ve canlı doğrulandı (detay:
  `PROJECT_STATUS.md`)
- ✅ EAS `production` ortamı: gerçek RevenueCat Android key, kendi Amplitude
  key'i, `SENTRY_AUTH_TOKEN` — hepsi `eas env:list` ile doğrulandı
- ✅ Production profiliyle bir Android build başarıyla tamamlandı (version
  code 3, build `ea81aaa4-95e4-421e-86b0-690924e210e5`) — signing
  credentials çalışıyor

---

## 1. Gerçek Play Store'da eksik olan Lifetime ürünü

Gerçek Play Store app'inde (`app0fad1bdb19`) Monthly/Yearly artık çalışıyor,
ama Lifetime (tek seferlik ürün) hâlâ sadece Test Store'da var
(`appcc3a1f3a7e`). Sadece paywall bir lifetime seçeneği sunuyorsa öncelikli —
sunmuyorsa bu madde beklenebilir.

Adımlar (Monthly/Yearly'de izlenen yolun aynısı):
1. Play Console'da gerçek bir tek-seferlik ürün oluştur/aktifleştir, base
   plan/product id'sini Play Console'dan **kopyala** (tahmin etme —
   [[revenuecat_play_store_identifier]]).
2. RevenueCat'te aynı `productId:basePlanId` ile import et.
3. `hizli-okuma Pro` entitlement'ına ve `default` offering'in ilgili
   paketine ekle.
4. `get-product-store-state` ile `store_status: ok` olduğunu doğrula.

---

## 2. Play Console — mağaza listelemesi

### Gizlilik politikası URL'i

```
https://hizliokuma.dukeemree.xyz/privacy
```

Play Console → Policy → App content → Privacy policy alanına yapıştır.
Sayfa canlı, herkese açık, auth duvarı yok — kontrol edildi.

### Data Safety formu

Uygulamanın gerçekte ne topladığı (gizlilik politikasıyla birebir uyumlu):

| Soru | Cevap |
|---|---|
| Veri topluyor mu? | Evet |
| Ad, e-posta, telefon, adres | **Hayır** — hesap sistemi yok |
| Konum | **Hayır** — konum izni hiç istenmiyor |
| Kişi listesi, fotoğraf, dosya, takvim | **Hayır** |
| Mikrofon / kamera | **Hayır** — `RECORD_AUDIO` manifest'te engelli |
| Reklam kimliği | **Hayır** — reklam yok |
| Uygulama etkileşimleri (analytics) | **Evet** — Amplitude, analitik amaçlı, isimsiz cihaz kimliğiyle |
| Çökme günlükleri | **Evet** — Sentry, teşhis amaçlı |
| Tanılama (device model, OS, app sürümü) | **Evet** |
| Satın alma geçmişi | **Evet** — RevenueCat + Google Play Faturalandırma |
| Veriler şifreli aktarılıyor mu? | Evet (HTTPS) |
| Kullanıcı silinmesini talep edebilir mi? | Evet — uygulama içi *Ayarlar → Tehlikeli Bölge → İstatistikleri Sıfırla*, ayrıca e-posta |
| Veriler üçüncü taraflarla paylaşılıyor mu? | Hayır ("paylaşım" Play tanımıyla; Amplitude/Sentry/RevenueCat **işleyici**, satış/paylaşım değil) |

### Diğer mağaza alanları

- Uygulama kategorisi, kısa/uzun açıklama, ekran görüntüleri, feature graphic
- İçerik derecelendirme anketi
- Hedef kitle: 13 yaş üstü (gizlilik politikası bu şekilde yazıldı)
- Kullanım koşulları (isteğe bağlı ama önerilir):
  `https://hizliokuma.dukeemree.xyz/terms`

---

## 3. Yasal sitenin ilk `wrangler deploy`'u

Site şu an canlı ama içeriği bir Worker script'inin içine gömülü olarak
Cloudflare API üzerinden yüklendi — `legal/public/` dosyaları henüz canlı
sürümün kaynağı değil. İlk `wrangler deploy` bunu düzeltir ve o dosyalar tek
doğru kaynak olur:

```sh
cd legal
npx wrangler deploy
```

Bunu yapmadan `legal/public/` içindeki bir metni değiştirirsen canlı site
değişmez. Detay: `legal/README.md`.

---

## 4. Vercel'de kalan boş proje

`dukeofsoftwares-projects` altında `hizli-okuma-legal` adında yarım kalmış bir
proje var (sadece `index.html`, Deployment Protection arkasında). Yasal site
Cloudflare'e taşındığı için gereksiz — Vercel dashboard'dan sil.

---

## 5. Cihaz turu

Elde zaten bir production build var (version code 3, build
`ea81aaa4-95e4-421e-86b0-690924e210e5`) — Monthly/Yearly sandbox satın alma
artık bu build üzerinde test edilebilir. Yeni bir kod değişikliği yaptıysan
yeniden build al:

```sh
eas build --profile production --platform android
```

Gerçek cihazda baştan sona geç:

- [ ] Onboarding → okuma testi → ana ekrana düşüş
- [ ] Günlük plan → 4 adımı sırayla tamamla → plan-complete ekranı
- [ ] Ücretsiz kullanıcıyla Egzersizler sekmesinden egzersiz seç → paywall açılmalı
- [ ] Sandbox satın alma → premium açılmalı → egzersizler serbest seçilebilmeli
- [ ] Satın alımları geri yükle
- [ ] Ayarlar → Yasal → iki link de in-app tarayıcıda açılmalı
- [ ] Ayarlar → İstatistikleri Sıfırla → her şey sıfırlanmalı
- [ ] Egzersiz ortasında uygulamayı arka plana at → otomatik duraklamalı
- [ ] Egzersiz tamamlanınca "Bitir"e çift dokun → tek oturum kaydedilmeli
- [ ] Egzersiz ortasında uygulamayı öldür → yeniden açınca ilerleme tutarlı olmalı
- [ ] Bildirime dokunarak aç → doğru ekran → uygulamayı normal kapat/aç →
      aynı ekrana **tekrar atmamalı**
- [ ] Uçak modunda premium kullanıcı → egzersizlere erişebilmeli, paywall'a
      atılmamalı

Son olarak Sentry ve Amplitude dashboard'larında bu build'den gerçekten
trafik geldiğini doğrula. Sentry'de bir stack trace'in **symbolicate edilmiş**
göründüğünü kontrol et — `SENTRY_AUTH_TOKEN` production'da zaten var ama
gerçek bir build'den gelen crash ile teyit edilmedi.

---

## Bloklayıcı olmayan, sonraki session için

Güncel liste `PROJECT_STATUS.md` → `## Known Issues` ve `## Remaining Work`
bölümlerinde: erişilebilirlik (kontrast, büyük yazı tipi, ekran okuyucu
geçişi), `package.json`'a `test` script eklenmesi, Android auto-backup kararı,
ve `bun audit`'in raporladığı bağımlılık açıkları.
