# 04 — Font ölçeğinde kırpılma ve erişilebilirlik ağacındaki boşluk

Status: done (2026-08-31)

## Çözüm

- Stat değerleri `numberOfLines={1}` + `adjustsFontSizeToFit` +
  `minimumFontScale={0.6}`; birim inline `<Text fontSize="$2">` olarak kalıyor,
  hiçbir ölçekte alt satıra düşmüyor.
- Tile'lara `minHeight={84}` + dikey ortalama.
- ScrollView `contentContainerStyle={{ paddingBottom: 96 }}` — tab bar payı.
  (`@react-navigation/bottom-tabs` doğrudan bağımlılık olmadığı için sabit;
  kodda `ponytail:` notu var.)
- `StreakBadge`: `accessible` + `accessibilityRole` + seri/freeze içeren etiket
  (`common.streakBadge` / `common.streakBadgeWithFreeze`).
- Stat tile'ları tek `accessible` düğüm, etiket+değer+birim tek metin.
- Track'in anlamı, tek dokunma hedefi olan `WeeklySummaryCard`'ın
  `accessibilityLabel`'ına taşındı (`weeklySummary.a11y.track*`) — ayrı bir
  etiket eklemek yerine, çünkü kart zaten `accessible` bir buton ve iç düğümleri
  yutuyor.
- Günlük plan satırları `accessible` + "tamamlandı/bekliyor" etiketi taşıyor.
- Premium karttaki çift hedef teke indi (bkz. `02`).
- Yan bulgu (bu ekranda düzeltildi): plan satırlarındaki 20/24px dairenin
  `backgroundColor: 'transparent'` olması, Android'de yuvarlak 1px kenarlığın
  yalnızca sol yayının çizilmesine yol açıyordu; `$background`'a alındı.

## Doğrulama

Emülatörde `font_scale` 1.0 / 1.3 / 1.5 ve light/dark: hiçbir değer kırpılmadı,
hiçbir kart tab bar'ın altında kalmadı, birim iki temada da tek satırda.

## Kapsam dışı, hâlâ açık

Ayarlardaki tema bottom-sheet'i açıkken `uiautomator dump` hiç düğüm üretmiyor
(bu turda da doğrulandı) — ayrı ticket'a değer.
Severity: P1
Blocked by: 03

`03` stat tile'larını değiştiriyor; bu ticket onların son halini ölçeklenebilir ve
erişilebilir yapıyor. Sırayı ters çevirmek aynı işi iki kez yapmak olur.

## Ölçülen: font ölçeği

Emülatörde (1080×2400 @420dpi, ScrollView viewport `[0,136][1080,2208]`):

| `font_scale` | Ne oluyor |
|---|---|
| 1.0 | Sorun yok. `1737 WPM` → `[81,2018][318,2103]`, 90×32dp. |
| **1.3** | Üç stat tile'ının **değerleri fold'da kesiliyor**: `1737 WPM` alt kenarı tam `2208` (ScrollView clip'i), yükseklik 32dp → **19dp**. `75%` ve `5 dk` de aynı. |
| **1.5** | Tile'lar ağaçtan tamamen çıkıyor. `Bu hafta henüz başlamadın` 2 satıra sarıyor (30→59dp), `Egzersize başla` butonu `[94,2050][985,2176]` **tab bar'ın altında kalıyor** (tab bar üstü 2209). |

Ayrıca dark temada `1737 WPM` **font_scale 1.0'da bile** iki satıra sarıyor
(88×46dp), light'ta tek satır (90×32dp). Bu `DESIGN.md`'nin Unit Demotion
Rule'unu ihlal ediyor — birim inline kalmalı.

`android.md` sp ölçekleme ve font-scale geçişi şart koşuyor; bu ekranda yapılmamış.

## Ölçülen: erişilebilirlik ağacı

Ekranda **yalnızca altı** `clickable` düğüm var (2 buton + 4 tab). Şunların
hiçbiri rol, etiket veya tıklanabilirlik göstermiyor:

- streak rozeti — ekran okuyucuya çıplak `"1"` olarak duyuluyor
- dört günlük plan satırı
- "Son 14 Gün" Track kartı — signature component, ekran okuyucuya tamamen görünmez
- üç stat tile'ı — iki kopuk metin düğümü olarak duyuluyor
- beş "Son Aktiviteler" satırı

Ayrıca premium kart hem `AppCard`'da `onPress` hem içinde aynı handler'lı `Button`
taşıyor — ekran okuyucu aynı işi yapan iki bitişik hedef buluyor.

**Kapsam dışı ama kaydedildi:** ayarlardaki tema bottom-sheet'i açıkken
`uiautomator dump` **hiç düğüm üretmiyor** — tema seçimi ekran okuyucuya tamamen
görünmez. Ayrı ticket'a değer.

## Yapılacak

- Stat değerlerine `numberOfLines={1}` + `adjustsFontSizeToFit` (veya birim ile
  değeri tek satırda tutan bir düzen); birim asla alt satıra düşmemeli.
- Kartlara `minHeight` ver ki 1.3'te değer fold'un altına kaymasın.
- 1.5'te alt kartın tab bar altında kalmaması için scroll `contentContainerStyle`
  alt boşluğunu tab bar yüksekliği kadar artır.
- `StreakBadge`'e `accessibilityLabel` (seri gün sayısı + varsa freeze) ve
  `accessibilityRole`.
- Stat tile'larına gruplu `accessibilityLabel` (etiket + değer + birim tek metin).
- `Track`'e özet `accessibilityLabel` — ne ölçtüğü ve son değeri.
- Premium karttaki çift hedefi teke indir.

## Korunacak

Kritikte ölçülen ve **geçen** değerler; bunları bozma:

- Tüm dokunma hedefleri ≥48dp (en küçüğü tam 48.0dp).
- Tüm metin/zemin çiftleri iki temada da WCAG AA geçiyor
  (light 5.10–18.37:1, dark 5.94–15.03:1).

## Kabul kriteri

- `font_scale` 1.0 / 1.3 / 1.5'te hiçbir değer kırpılmıyor, hiçbir buton tab
  bar'ın altında kalmıyor.
- Dark temada birim alt satıra düşmüyor.
- Streak rozeti, stat tile'ları ve Track ekran okuyucuda anlamlı duyuluyor.
- Doğrulama: `adb shell settings put system font_scale 1.3` / `1.5`, ekran
  görüntüsü, sonra `1.0`'a geri al.
