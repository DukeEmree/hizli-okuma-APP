# Faz 1 düzeltmeleri — Login / Register

Kaynak: kullanıcının gönderdiği ekran görüntüleri + tasarım mockup karşılaştırması.
Kapsam: `src/app/(auth)/login.tsx`, `src/app/(auth)/register.tsx`.

## Yapılacaklar

(hepsi tamamlandı, aşağıya bak)

## Yapıldı

- [x] Heading ortalama kaldırıldı, üstte sola hizalı (`justifyContent="center"` kaldırıldı, `paddingTop="$8"`)
- [x] Heading `$heading` (Archivo) fontuna, sola hizalı, 30px/800 ağırlık
- [x] "Misafir olarak devam et" butonuna `borderWidth={1} borderColor="$borderColor"` eklendi
- [x] "Misafir olarak devam et" `marginTop="auto"` ile en alta sabitlendi (outer flex:1 YStack'in son çocuğu)
- [x] Giriş yap / Kayıt ol / Doğrula butonları `size="$5"` + `fontWeight="700"`
- [x] E-posta / Şifre / Şifre Tekrar üstüne mono uppercase `FieldLabel` eklendi (login.tsx + register.tsx)
- [x] `src/components/ui/GoogleIcon.tsx` oluşturuldu (4 renkli resmi G logosu, react-native-svg), login'deki Google butonuna `icon` prop ile eklendi
- [x] BUG düzeltildi: her iki ekranda guest butonu artık `router.replace('/(app)/(tabs)')` kullanıyor (register→login geçmişine dönme sorunu çözüldü)
- [x] `auth.json`'a `emailLabel`/`passwordLabel`/`passwordConfirmationLabel` eklendi
- [x] typecheck ✓ lint ✓ i18n:check ✓ bun test 159/159 ✓

## Font revert (kullanıcı talebi)

- [x] Archivo/IBM Plex Sans/IBM Plex Mono kaldırıldı, Tamagui'nin eski/varsayılan fontlarına (Inter yükleme + sistem fontu) dönüldü — `tamagui.config.ts`, `src/app/_layout.tsx`
- [x] `$mono` kullanan yerler (`login.tsx`, `register.tsx` FieldLabel/OrSeparator) `$body`'ye çevrildi
- [x] `@expo-google-fonts/*` paketleri kaldırıldı (`bun remove`)
- [x] typecheck ✓ lint ✓ test ✓
- Not: renk/token değişiklikleri (accent/ember/alert/bg/surface) DOKUNULMADI, sadece font geri alındı.

## Faz 2 — Dashboard (Ana Sayfa)

Kaynak: PLAN.md faz 2. Dosya: `src/app/(app)/(tabs)/index.tsx`.

### Yapılacaklar
- [ ] Header'ın hemen altına 14 günlük İz şeridi kart olarak ekle (premium/cloud: `api.statistics.getPerformanceStats({timeRange:'30d'})`'den son 14 gün, `dailyTrends` zaten var — yeni backend alanı gerekmiyor)
- [ ] Misafir/free (local) için: `localHistoryStore.sessions`'ı son 7 güne göre client-side bucket'la (misafir → kısa iz, tasarım notuyla uyumlu)
- [ ] Streak/baseline: o gün en az 1 seans varsa `streak: true`
- [ ] StreakBadge, DailyPlanCard, WeeklySummaryCard, premium upsell kartı — dokunma (zaten tasarımla uyumlu / ayrı elemanlar)
- [ ] typecheck/lint/test

### Yapıldı

- [x] `src/app/(app)/(tabs)/index.tsx`: header altına "SON N GÜN" İz kartı eklendi
- [x] Premium/cloud: `api.statistics.getPerformanceStats({timeRange:'30d'})` → son 14 gün dense track (`buildDailyTrack`)
- [x] Misafir/free: `localHistoryStore.sessions` client-side son 7 güne bucket'landı (aynı fonksiyon, farklı kaynak)
- [x] O gün seans varsa `streak:true` (İz taban çizgisi)
- [x] StreakBadge/DailyPlanCard/WeeklySummaryCard/premium upsell — değiştirilmedi (tasarımla zaten uyumlu, ayrı elemanlar)
- [x] typecheck ✓ lint ✓ bun test 159/159 ✓, `(app)/(tabs)` route web bundle'da hatasız (200)

## Faz 2 — 2. tur düzeltmeler (ekran görüntüsü geri bildirimi)

Kaynak: kullanıcının gönderdiği Dashboard ekran görüntüsü.

- [x] "Bugünkü Hedef" kartı gizlendi — JSX yorum satırı içine alındı, kod silinmedi (`index.tsx`)
- [x] Grafik/İz tamamen victory-native'e taşındı (`Track.tsx`): iki katmanlı `Bar` (alt: WPM-yüksekliğinde muted "track" bar, üst: WPM×kavrama accent "fill" bar) — eski elle-View bar'lar ve Reanimated animasyonu kaldırıldı, `live` artık victory-native'in kendi `animate` prop'unu kullanıyor
- [x] Renkler gözden geçirildi: fill=`$accent9`, track=`$borderColor`, streak taban çizgisi=`$orange9` (ember)
- [x] Boş günler için `EMPTY_FLOOR` (0.05) ile ince bir "veri yok" izi bırakıldı (tamamen görünmez olmasın diye)
- [x] Tarih aralığı etiketleri eklendi: sol "28 Tem" (gerçek tarih), sağ "bugün" — `WeeklySummaryCard` içinde
- [x] Sol üstteki etiket her zaman "SON 14 GÜN" — misafir/premium ayrımı (7 vs 14 gün) kaldırıldı, tek sabit `TRACK_DAYS=14`
- [x] Haftalık özetle entegre edildi: ayrı İz kartı kaldırıldı, İz artık `WeeklySummaryCard`'ın İÇİNDE üstte render ediliyor (tek kart) — `index.tsx`'teki kopya `getPerformanceStats` sorgusu ve el-yapımı local bucketing tamamen silindi
- [x] `useWeeklySummary` hook'u genişletildi: `dailyTrends`/`now`/`timeZone` de döndürüyor artık — Dashboard ve WeeklySummaryCard artık AYNI tek veri kaynağını kullanıyor (önceden `index.tsx` kendi ayrı sorgusunu atıyordu, iki taraf farklı sonuç verebilirdi)
- [x] `buildTrackFromDailyTrends` (`trackLayout.ts`) yeni paylaşılan yardımcı fonksiyon — 2 yeni test (`bun test`: 161/161)
- [x] typecheck ✓ lint ✓ (sadece 2 kasıtlı "unused" uyarısı — yorumlanan Bugünkü Hedef koduna ait) ✓ bun test 161/161 ✓
- [x] `(app)/(tabs)`, `(onboarding)`, `(app)/weekly-summary` route'ları web bundle'da hatasız (200)

## Faz 2 — 3. tur

- [x] "Bugünkü Antrenmana Başla" ana CTA butonu tamamen kaldırıldı (silindi, DailyPlanCard'ın kendi "Başla" butonuyla zaten çakışıyordu) — typecheck ✓ lint ✓ test 161/161 ✓

## Faz 1 — 2. tur düzeltmeler (ekran görüntüsü geri bildirimi)

- [x] `FieldLabel` büyütüldü: 11px/500 → 13px/600
- [x] Login: "Giriş yap" ile "Google ile devam et" arası `OrSeparator` ("VEYA", iki yanda çizgi) ile ayrıldı
- [x] "Hesabın yok mu? / Zaten hesabın var mı?" satırı en alta, "Misafir olarak devam et" butonunun hemen üstüne taşındı (login.tsx + register.tsx)
- [x] `auth.json`'a `or: "VEYA"` eklendi
- [x] typecheck ✓ lint ✓ i18n:check ✓ bun test 159/159 ✓
