# Release TODO — senin yapman gerekenler

2026-08-13 production audit'inden kalan, **koddan yapılamayan** işler. Hepsi ya
bir sır (secret) ya bir dashboard yetkisi ya da bir mağaza formu gerektiriyor.

Kod tarafı hazır: `bun run typecheck`, `bun run lint`, `bun test` (158 test) ve
`bun run i18n:check` temiz. Mimarinin güncel durumu için `PROJECT_STATUS.md`.

Sıralama kasıtlı — 1 ve 2 olmadan production build'i almanın anlamı yok.

---

## 1. RevenueCat production key'i — P0, release blocker

**Durum:** EAS `production` ortamındaki `EXPO_PUBLIC_RC_ANDROID_KEY` değeri
`test_XONUKmQCbEgziGYQRBHkHLksasz`. Bu bir **Test Store** anahtarı: bu key'le
çıkan bir production build sahte satın alma yapar, hiç gelir gelmez.

**Nereden alınır:** RevenueCat dashboard → Project Settings → API Keys →
Android (Google Play) satırındaki `goog_...` public SDK key'i.

```sh
eas env:update --variable-name EXPO_PUBLIC_RC_ANDROID_KEY \
  --variable-environment production \
  --value goog_GERCEK_KEY --non-interactive
```

**Not:** Bu değişken şu an tek bir kayıt olarak development + preview +
production ortamlarının üçüne birden bağlı. Yukarıdaki komut üçünü de
değiştirir. Development ve preview'da test key'i kalsın istiyorsan Amplitude
için aşağıda anlatılan detach/create yöntemini buna da uygula.

**Ayrıca kontrol et:**
- Ürünler (products) ve `hizli-okuma Pro` entitlement'ı RevenueCat'te tanımlı mı
- Google Play Console'da abonelik ürünleri **aktif** mi
- RevenueCat ↔ Play Store service account bağlantısı çalışıyor mu

**Kod tarafı hazır:** Key hiç yoksa uygulama artık çökmüyor / sonsuz spinner'a
girmiyor — Sentry'ye rapor atıp ücretsiz katmana fail-open oluyor
(`src/providers/RevenueCatProvider.tsx`).

---

## 2. `SENTRY_AUTH_TOKEN` production ortamında yok — P1

**Durum:** Token sadece `preview` ortamında var. Secret olduğu için değeri
okunamıyor, dolayısıyla kopyalanamıyor. Bu token olmadan production build
**source map yükleyemez** → gelen her production crash raporu minified,
okunamaz bir stack trace olur.

**Nereden alınır:** Sentry → Settings → Auth Tokens → yeni org token,
`project:releases` ve `org:read` yetkileriyle.

```sh
eas env:create --name SENTRY_AUTH_TOKEN \
  --value SENTRY_TOKEN_BURAYA \
  --environment production --visibility secret --type string --non-interactive
```

`SENTRY_ORG` (`react-native-duke`) ve `SENTRY_PROJECT` (`hizli-okuma-app`)
production ortamına bu session'da eklendi, onları tekrar yapmana gerek yok.

---

## 3. Amplitude production key'i dev projesine gidiyor — P1

**Durum:** `EXPO_PUBLIC_AMPLITUDE_API_KEY` tek bir değişken olarak üç ortama
birden bağlı ve değeri `57f6623fdbc1a0bd2515483571b631b9` — yani
`hizli-okuma-development` (appId 513081) projesinin key'i. Production
kullanıcılarının verisi dev projesine akar, ikisi karışır.

Doğru değer `.env.production` dosyasında zaten yazılı:
`5b42863dd7a145753b9f1c02cf49ca51` → `hizli-okuma-production` (appId 851786).

Bu session'da denendi ama izin katmanı tarafından bloklandı; komutlar hazır:

```sh
# 1. paylaşımlı dev key'ini production'dan ayır (dev + preview'da kalsın)
eas env:update --variable-name EXPO_PUBLIC_AMPLITUDE_API_KEY \
  --variable-environment production \
  --environment development --environment preview --non-interactive

# 2. production'a özel yeni değişken oluştur
eas env:create --name EXPO_PUBLIC_AMPLITUDE_API_KEY \
  --value 5b42863dd7a145753b9f1c02cf49ca51 \
  --environment production --visibility plaintext --type string --non-interactive
```

Sonra doğrula:

```sh
eas env:list --environment production
eas env:list --environment development
```

---

## 4. Android release keystore

```sh
eas credentials
```

→ Android → production. Keystore'un var olduğunu, SHA-1 parmak izinin Play
Console'daki App Signing sayfasıyla eşleştiğini doğrula. Keystore'u
kaybedersen aynı paket adıyla bir daha güncelleme yayınlayamazsın — yedeğini
şifreli bir yerde sakla.

---

## 5. Play Console — mağaza listelemesi

### Gizlilik politikası URL'i

```
https://privacy.dukeemree.xyz/privacy
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
  `https://privacy.dukeemree.xyz/terms`

---

## 6. Yasal sitenin ilk `wrangler deploy`'u

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

## 7. Vercel'de kalan boş proje

`dukeofsoftwares-projects` altında `hizli-okuma-legal` adında yarım kalmış bir
proje var (sadece `index.html`, Deployment Protection arkasında). Yasal site
Cloudflare'e taşındığı için gereksiz — Vercel dashboard'dan sil.

---

## 8. Production build + cihaz turu

Yukarıdaki 1-3 bittikten **sonra**:

```sh
eas build --profile production --platform android
```

Build alındıktan sonra gerçek cihazda baştan sona geç:

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
göründüğünü kontrol et — görünmüyorsa madde 2 eksik demektir.

---

## Bloklayıcı olmayan, sonraki session için

`PROJECT_STATUS.md` → `## Known Issues` ve `## Remaining Work` bölümlerinde.
Özet: `StatisticsDashboard`'daki `any` tipleri ve kalan hardcoded Türkçe
metinler, egzersizden X ile çıkınca `activeFlowType`'ın temizlenmemesi
(ücretsiz kullanıcı o egzersizi tekrarlayabiliyor), erişilebilirlik için
dokunma hedefi boyutları ve büyük yazı tipi düzeni.
