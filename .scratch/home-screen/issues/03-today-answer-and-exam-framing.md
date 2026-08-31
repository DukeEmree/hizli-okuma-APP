# 03 — Ekran "bugün sayıldı mı?" sorusuna cevap versin + sınav çerçevesi

Status: done (2026-08-31)

## Çözüm

- Üç tüm-zaman tile'ı **bugün satırıyla** değişti: bugünkü hız (+ 7 günlük
  ortalamaya göre delta), bugünkü anlama, bugün/hedef dakika. Hepsi `Bugün`
  başlığı altında. Tüm-zaman ortalamaları ekrandan kalktı (İstatistikler
  sekmesinde `buildLocalStats` zaten var).
- Selamlama artık `$2` boyutunda bir üst satır; en büyük tipografi bugünün
  durumu: "Bugün henüz başlamadın" / "Bugün 2/4 adım" / "Bugün sayıldı · X dk".
- `buildTodaySnapshot` (`src/utils/todayStats.ts`, testli) **hiçbir zaman**
  `bestWpm`'e düşmüyor — "Ort." etiketli alanın sessizce bir "en iyi" göstermesi
  sorunu kökten kapandı; bugün veri yoksa `–`.
- Sınav referansı her zaman ekranda: bugünkü hız varsa onunla, yoksa son
  günlerin ortalamasıyla (penceresi yazılı), hiç veri yoksa çerçeveyi anlatan
  hâliyle. 90 kelimelik paragraf = `EXAM_PARAGRAPH_WORDS`.
- `ESTIMATED_MINUTES_PER_EXERCISE = 3` sabiti gitti: `estimatePlanMinutes` +
  `medianDurationByType` kullanıcının kendi medyan sürelerinden hesaplıyor
  (emülatörde "yaklaşık 12 dk" → "yaklaşık 11 dk"). Testli.
- `isAllDone` artık küçülme değil: kart özet satırı + "Özeti gör" ile büyüyor ve
  tıklanabilir. Track `live` çizim moduna alındı (yazılmış ama hiç
  kullanılmayan primitif), yeni gün çubuğu animasyonla geliyor.
- Emoji temizlendi: `home.greeting`'deki 👋 ve `weeklySummary.card.trendUp`'taki 📈.
- Track'e eksen/legend/tooltip eklenmedi.
Severity: P1
Blocked by: 02

Bu ticket kritiğin en büyük bulgusu ve en büyük değişikliği. İki sorunu birlikte
çözüyor, çünkü ikisi de ekranın **neyi en büyük puntoyla söylediğiyle** ilgili.

## Sorun A — hiçbir sayı "bugün"ü göstermiyor

Ekrandaki her metrik ya tüm-zamanlar ya 14 gün:

- `stats.avgWpm` **kaydedilmiş her oturumu** ortalıyor — 15 egzersiz tipinin
  hepsini, okuma dışıkileri dahil (`index.tsx:23-34`).
- `totalDurationMs` tüm-zaman.
- Tile etiketleri ("Ort. Hız", "Kavrama", "Çalışma") hiçbir zaman penceresi
  taşımıyor.
- Track 14 gün, haftalık kart 7 gün.

PRODUCT.md İlke 4: *"İlerleme her seansta görünür olmalı; kullanıcı seansı
bitirdiğinde sayılıp sayılmadığından emin olmamalı."* Dört adımı bitiren öğrenci
ana ekrana dönüyor ve gördüğü: 1/200 oranında kımıldamış tüm-zaman ortalamaları,
bir sütun büyümüş Track, ve **küçülmüş bir plan kartı**.

Ayrıca `stats.avgWpm`, oturum yokken onboarding'in `bestWpm`'ine düşüyor — "Ort."
etiketli tile sessizce bir *en iyi* gösteriyor. Tek etiket, iki farklı istatistik.

## Sorun B — sınav çerçevesi uygulamanın içinde yok

**Karar verildi: girecek.** (PRODUCT.md'deki "açık karar" bu ticket'la kapanıyor.)

Bugünkü durum: selamlama `"Merhaba 👋"`, kart başlığı `"Bugünün antrenmanı"` —
spor salonu dili. PRODUCT.md kullanıcının gerçek referans çerçevesini sayıyor:
"paragraf", "deneme", "hız", "anlama". **Dördü de ekranda geçmiyor.** Geri sayım
yok, sınav-anlamlı hedef WPM yok, kıyas noktası yok.

Referans noktası olmayan ham bir sayı ölçüm değil, gürültü — üstelik bu bir
ölçüm-aleti tasarım sistemi ("İz").

## Yapılacak

- Üç tüm-zaman tile'ını **bugün satırıyla** değiştir: bugünün WPM'i + 7 günlük
  ortalamaya göre delta, bugünün kavraması, bugünün dakikası / günlük hedef.
- Tüm-zaman ortalamalarını İstatistikler sekmesine taşı (orada zaten
  `buildLocalStats` var).
- **Her pencereyi açıkça etiketle** ("Bugün" / "Son 7 gün"). Şu an üç farklı zaman
  ufku aynı görsel ağırlıkta, etiketsiz, üst üste duruyor.
- Selamlamayı ekranın en büyük tipografisi olmaktan çıkar. Yerine bugünün durumu.
- WPM'e sınav-anlamlı bir referans ver (hedef hız, ya da "bu hızda bir paragraf
  sorusu ≈ X saniye"). Rakamı bir şeye bağla.
- `isAllDone` anını **zirve** yap, küçülme değil: kart genişlesin, bugünün sayıları
  insin, Track'in yeni çubuğu çizilsin. `Track.tsx` içinde `live` çizim modu
  **zaten var ve hiç kullanılmıyor** — kutlama primitifi yazılmış, hiçbir yerde
  ateşlenmiyor.
- `ESTIMATED_MINUTES_PER_EXERCISE = 3` düz sabiti gerçek sürelerle değiştir
  (`localHistoryStore.durationMs`'ten hesaplanabilir). "yaklaşık 12 dk" ekranın
  karar açısından en önemli string'i ve şu an kurgu.

## Dikkat

- Track'e eksen/legend/tooltip **eklenmeyecek**. Onun yeri ve boyutu tartışmaya
  açık (kritik "62px'te, ikinci kartın içinde gömülü" diyor) ama kodlaması değil.
- Yeni metinlerin hepsi i18n'den geçmeli, Türkçe kanonik.
- Sınav dili eklerken emoji kullanma (`"Merhaba 👋"` ve `📈` zaten
  `StreakBadge`'in Lucide'a geçme gerekçesine aykırı — onları da temizle).

## Kabul kriteri

- Ana ekranda "bugün"e ait en az bir sayı var ve etiketi bunu söylüyor.
- Her metriğin zaman penceresi ekranda yazılı.
- Dört adımı bitirmek ekranda fark edilir bir değişiklik yaratıyor.
- "Ort." etiketli hiçbir alan bir "en iyi" değeri göstermiyor.
- Ekranda sınav bağlamına en az bir gerçek referans var.
