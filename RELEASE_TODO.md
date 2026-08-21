# Release TODO — senin yapman gerekenler

2026-08-21'de EAS ve RevenueCat'e karşı iki kez doğrulandı (gün içinde ikinci
kontrolde 1a geçti, 1b'nin gerçek kök nedeni ortaya çıktı: Play Store'da ürün
yok/aktif değil) — aşağıdakiler **gerçek**, önceki oturumların "yapıldı"
notlarına değil canlı duruma dayanıyor. Kalanların hepsi koddan yapılamıyor:
ya bir dashboard yetkisi ya bir mağaza formu gerektiriyor.

Kod tarafı hazır: `bun run typecheck`, `bun run lint`, `bun test`, `bun run
i18n:check` temiz. Mimarinin güncel durumu için `PROJECT_STATUS.md`.

**Zaten tamamlanmış olanlar (2026-08-21'de `eas env:list` ile doğrulandı,
tekrar yapmana gerek yok):**
- ✅ EAS `production`'daki `EXPO_PUBLIC_RC_ANDROID_KEY` artık gerçek bir
  `goog_kxKNiYQCufvVOlMqpLAbDrqgxXk` — Test Store `test_...` key'i değil
- ✅ `SENTRY_AUTH_TOKEN` `production`'da mevcut (secret, `preview`'da da var)
- ✅ `EXPO_PUBLIC_AMPLITUDE_API_KEY` doğru ayrıldı: `production` →
  `5b42863dd7a145753b9f1c02cf49ca51` (`hizli-okuma-production`),
  `development`/`preview` → `57f6623fdbc1a0bd2515483571b631b9` (dev projesi)
- ✅ Production profiliyle bir Android build başarıyla tamamlandı (version code
  3, build `ea81aaa4-95e4-421e-86b0-690924e210e5`, 2026-08-21) — yani signing
  credentials da çalışıyor, madde 4'ü ayrıca kontrol etmene gerek yok

Sıralama kasıtlı — 1 olmadan gerçek satın alma test edilemez.

---

## 1. RevenueCat ↔ Google Play bağlantısı — ÇÖZÜLDÜ (2026-08-21)

1a (service account yetkileri) ve 1b (gerçek ürünler) ikisi de çözüldü.

### 1a. Service account yetkileri — tamam

RevenueCat'in credential validator'ı (`validate-app-credentials`,
2026-08-21) gerçek Play Store uygulaması (`app0fad1bdb19`) için üç kontrolün
üçünü de **valid** döndürüyor: `subscriptions_api_permissions`,
`inapp_products_permissions`, `monetization_api_permissions`.

**Nasıl bağlanır (RevenueCat ↔ Google Play):**
1. Google Play Console → **Setup → API access** → RevenueCat'in kullandığı
   service account'u bul (veya RevenueCat dashboard → Project Settings →
   Apps → Hızlı Okuma (Play Store) → "Service Account" bölümünden hangi
   service account'un bağlı olduğunu gör; yoksa oradan yeni bir JSON key
   indirip Play Console'a service account olarak eklemen gerekir).
2. O service account'a Play Console'da **App access** altında bu uygulamayı
   (`com.dukeemree.hizliokuma`) ver, ve şu iznleri ata:
   - **View financial data, orders, and cancellation survey responses**
   - **Manage orders and subscriptions**
   - **View app information and download bulk reports (read-only)**
3. Google Play Android Developer API'nin Google Cloud projede **enabled**
   olduğunu doğrula (RevenueCat'in kurulum dokümanı adım adım anlatıyor):
   https://www.revenuecat.com/docs/service-credentials/creating-play-service-credentials
4. Birkaç dakika bekle (Play Console yetki değişiklikleri gecikmeli
   yayılabiliyor), sonra RevenueCat dashboard → o app → "Google Play
   Service Account Credentials" kutusundaki **Validate/Test Credentials**
   butonuna bas. Üç kontrol de yeşile dönmeli.

### 1b. Gerçek ürünler Play Store'da bulunamıyordu — DÜZELTİLDİ

**Kök neden:** RevenueCat'in gerçek Play Store app'i (`app0fad1bdb19`)
altındaki ürünleri, tahmini `store_identifier` (`premium:monthly` /
`premium:yearly`) ile oluşturulmuştu. Ama Play Console'da gerçek base plan
id'leri farklıydı: `aylik-abonelik` ve `yillik` (subscription id yine
`premium`). `store_identifier` formatı `productId:basePlanId` olduğu için
RevenueCat, Play Store'da olmayan bir id arıyordu → dashboard'da **"Not
found — Please check the imported identifiers and the product
configuration in the Play console"**, ve kullanıcının Play Store test
uygulamasında gördüğü **RevenueCat error 23 (ConfigurationError)**'ün kök
nedeni buydu.

**Yapılan düzeltme (2026-08-21, RevenueCat API üzerinden):**
1. Yanlış id'li iki ürünü (`prod96487195f6` = `premium:monthly`,
   `prodc4883cb3ef` = `premium:yearly`) `hizli-okuma Pro` entitlement'ından
   ve `$rc_monthly`/`$rc_annual` paketlerinden çıkarıp arşivledik.
2. Doğru id'lerle iki yeni ürün oluşturduk: `prodab0b6f0e29` =
   `premium:aylik-abonelik` (Aylık), `prodf4eb88c5d1` = `premium:yillik`
   (Yıllık) — ikisini de aynı entitlement ve paketlere bağladık.
3. Canlı doğrulama (`get-product-store-state`): ikisi de artık
   `store_status: ok`, base plan `state: ACTIVE`, fiyatlandırma 174
   bölgede geliyor.

`default` offering'in Monthly/Yearly paketleri artık hem Test Store hem
gerçek Play Store ürününü aynı pakette taşıyor — kod tarafında hiçbir
değişiklik gerekmedi, RevenueCat dashboard konfigürasyonuydu.

**Hâlâ eksik:** Lifetime (tek seferlik ürün) gerçek Play Store app'inde
yok — sadece Test Store'da (`appcc3a1f3a7e`) var. Paywall'da
kullanılıyorsa aynı adımlarla (Play Console'da ürünü oluştur/aktifleştir →
RevenueCat'te doğru `store_identifier` ile import et → entitlement'a ekle)
tamamlanmalı.

**Kod tarafı zaten hazırdı:** Key hiç yoksa uygulama çökmüyor / sonsuz
spinner'a girmiyor — Sentry'ye rapor atıp ücretsiz katmana fail-open oluyor
(`src/providers/RevenueCatProvider.tsx`).

Eğer bu düzeltmeden sonra hâlâ error 23 görülürse, ikincil olası sebepler:
- Build'i Play Store'un test linki üzerinden değil `adb install` ile mi
  kurdun? Play Billing sadece Play Store'dan kurulan build'de çalışır.
- Test eden Google hesabı Play Console → Setup → License testing listesinde
  mi, ve tester daveti kabul edildi mi?
- Build, bu test track'e kayıtlı imzalama anahtarıyla mı imzalandı?

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

Madde 1 (RevenueCat↔Play bağlantısı) bitmeden sandbox satın alma adımını
gerçek anlamda test edemezsin. Elde zaten bir production build var (version
code 3, build `ea81aaa4-95e4-421e-86b0-690924e210e5`, 2026-08-21) — madde 1
biter bitmez onu indirip aşağıdaki turu o build üzerinde yap. Yeni bir kod
değişikliği yaptıysan tabii ki yeniden build al:

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
bölümlerinde. Not: daily-plan flow-lock sızıntısı ve hardcoded/i18n Türkçe
metin sorunları 2026-08-20'de zaten düzeltildi (bkz. `BUGS.md`) — burada
kalan sadece erişilebilirlik (dokunma hedefi boyutları, büyük yazı tipi
düzeni) ve `bun audit`'in raporladığı bağımlılık açıkları.
