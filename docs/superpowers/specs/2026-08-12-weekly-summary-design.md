# Haftalık Özet — Tasarım

Tarih: 2026-08-12
İlgili backlog maddesi: `FEATURE_BACKLOG.md` → 2. Haftalık Özet

## Problem

Okuma hızındaki gelişme gün gün görünmüyor, kullanıcı ilerlediğini hissetmiyor. İstatistik sekmesine kendi girip bakması gerekiyor — kimse yapmıyor.

## Kapsam (v1)

Dahil:
- Toplam çalışma dakikası (bu hafta)
- WPM değişimi (bu hafta ortalaması / geçen hafta ortalaması, %)
- Güncel streak durumu
- Ana ekranda özet kartı + tam ekran detay
- Premium: sunucudan push bildirimi (Pazar 20:00, kullanıcının kendi saat diliminde)
- Free/guest: cihazda yerel zamanlanmış bildirim (jenerik içerik) + aynı tam ekran, tamamen yerel veriden hesaplanmış

Dışında (bilinçli kesildi):
- Egzersiz bazlı "en çok gelişme gösterilen egzersiz" metriği — `dailyStatistics` tablosunda egzersiz türü kırılımı yok, eklemek yeni tablo ya da ham session taraması gerektirir. Kapsamı büyütmeye değmiyor.
- Paylaşılabilir görsel kart (Instagram story formatı) — ayrı bir iş, sonraki iterasyon.
- Kullanıcının bildirim gün/saatini seçebilmesi — sabit Pazar 20:00.

## Ortak hesaplama (saf fonksiyon)

`src/utils/weeklySummary.ts`:

```
buildWeeklySummary(dailyStats: { date, durationMs, avgWpm, sessionCount }[], now, streakDays)
  → { weekStart, weekEnd, totalMinutes, sessionCount, avgWpmThisWeek, avgWpmLastWeek,
      wpmDeltaPercent, streakDays, isEmpty }
```

- Hafta: Pazartesi 00:00 → Pazar 23:59, yerel tarih.
- `wpmDeltaPercent`: her iki haftada da veri yoksa `null` (kıyaslama gösterilmez, sıfıra bölme yok).
- `isEmpty`: bu hafta hiç session yoksa `true`.
- Hem sunucu (premium, `dailyStatistics`'ten) hem istemci (free/guest, `buildLocalStats`'in `dailyTrends`'inden) aynı fonksiyonu çağırır — `calculateStreakUpdate` ile aynı desen (paylaşılan saf mantık, iki taraf da aynı sonucu üretir).

## Premium yolu (sunucu)

- `convex/crons.ts` (yeni dosya) — saatlik `internalAction`.
- Her tick: `users.timezone`'a göre yerel saati o an Pazar 20:00 olan kullanıcılar bulunur (timezone tanımlı değilse Europe/Istanbul varsayılan).
- `dailyStatistics`'ten `by_userId_and_timestamp` indeksiyle son 14 gün okunur — ham `exerciseSessions`'a dokunulmaz.
- `isEmpty === true` olan hafta için **push gönderilmez** — sessizce atlanır, suçlayıcı bildirim riski böyle ortadan kalkıyor.
- İçerik `convex/notificationPolicy.ts` deseninde yeni saf fonksiyon: `decideWeeklySummaryNotification(summary) → { title, body, data }`.
- Gönderim mevcut `internal.expoPush.sendPushToUser` ile, `data: { screen: '/weekly-summary' }`.
- Free/guest kullanıcılar bu akışa hiç girmiyor: onlar sunucuya hiç session senkronize etmiyor (bkz. backlog 7.2), yani `dailyStatistics`'te satırları yok — cron'un kullanıcı seçiminde doğal olarak elenirler, ayrı bir premium filtresi yazmaya gerek yok.

**Not (ileriye dönük):** Kullanıcı sunucu tarafındaki `dailyStatistics`/istatistik depolamasının ileride tamamen kaldırılabileceğini belirtti. Bu tasarım buna hazır: free/guest zaten tamamen yerel çalışıyor; premium yolu yalnızca `dailyStatistics` okuyan tek bir cron + tek bir saf fonksiyona bağlı, yarın sunucu istatistiği kalkarsa bu cron'un veri kaynağını değiştirmek yeterli olur, hesaplama mantığı (`weeklySummary.ts`) ve istemci tarafı hiç değişmez. Şimdilik kapsam dışı — mevcut mimari değiştirilmiyor.

## Free/guest yolu (istemci, tamamen yerel)

Sunucu bağımlılığı yok. Mevcut yerel bildirim altyapısı kullanılıyor (`src/services/notifications.ts` — streak hatırlatma ve milestone bildirimleri zaten bu şekilde çalışıyor, yeni bağımlılık gerekmiyor):

- Yeni `scheduleWeeklySummaryNotification()`: gelecek Pazar 20:00 için `Notifications.scheduleNotificationAsync` ile **sabit `identifier: 'weekly-summary'`** kullanarak kurulur — aynı identifier ile tekrar çağrılması üzerine yazar, çift bildirim oluşmaz.
- İçerik jenerik/statik: "Bu haftaki okuma özetin hazır 📊" — gerçek sayılar kurulum anında bilinemez (hafta bitmeden veri değişebilir). `data: { screen: '/weekly-summary' }`.
- Dokunulunca açılan ekran, o anki yerel veriden (`buildLocalStats` + `weeklySummary.ts`) gerçek zamanlı hesaplanmış gerçek sayıları gösterir — jenerik bildirim içeriği burada sorun yaratmıyor.
- Kurulma noktaları: `NotificationProvider` mount'ta ve `settings.tsx`'teki bildirim ayarı değiştiğinde — ikisi de React ağacında olduğu için `useRevenueCat()` ile `isPremium` erişilebilir; yalnızca `!isPremium` ise kurulur (premium zaten sunucudan push alıyor, çift bildirim önlenir).
- `streakCacheStore`'daki mevcut `rescheduleAllReminders()` çağrısına dokunulmuyor: hedef tarih (gelecek Pazar) her egzersizde değişmediği için her session sonrası yeniden kurmaya gerek yok.

## UI

- `src/features/weeklySummary/WeeklySummaryCard.tsx` — ana ekranda `DailyPlanCard`'ın hemen altında. Kendi içinde premium/local ayrımına bakar (`DailyPlanCard` ile aynı desen), gösterecek bir şey yoksa `null` döner.
  - Normal hafta: toplam dakika, WPM değişimi, streak günü.
  - Boş hafta: sayı yok, suçlamayan davet metni ("Bu hafta henüz başlamadın, ilk adımı at") + egzersize başlama CTA'sı.
- `src/app/(app)/weekly-summary.tsx` + `WeeklySummaryScreen` (`src/features/weeklySummary/`) — hem karttan hem bildirimden (`data.screen`) buraya gelinir. "Bu haftayı da tamamla" CTA'sı ana sekmeye (Daily Plan kartına) yönlendirir.
- Yeni i18n namespace `weeklySummary` (tr).

## Test

- `src/utils/weeklySummary.ts` için saf birim testler: hafta sınırı hesaplama, %değişim, her iki hafta da veri yoksa `null`, `isEmpty` tespiti.
- `convex/__tests__/weeklySummary.test.ts`: `decideWeeklySummaryNotification` (boş haftada `null` dönmesi dahil) ve kullanıcı-saat eşleştirme mantığı için saf fonksiyon testleri.

## Uygulama sonrası

Bu özellik tamamlandığında `PROJECT_STATUS.md` ve `FEATURE_BACKLOG.md` güncellenmeli — backlog'daki 2. madde mevcut "UYGULANDI" konvansiyonuyla (bkz. madde 6, 7.1, 7.2, 8) işaretlenip ne yapıldığı özetlenmeli.
