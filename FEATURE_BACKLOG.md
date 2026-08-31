# Feature Backlog

> Planlanan özellikler ve karar bekleyen teknik borç. Tamamlanan maddeler bu dosyadan çıkarılmıştır.

İlgili dokümanlar: `PROJECT_STATUS.md` (mimari, mevcut durum ve bulgular), `RELEASE_TODO.md` (yayın öncesi işler).

---

## 3. Ara Ekran Premium Teklifi (Interstitial Paywall)

**Durum: büyük ölçüde tamam.** İki tetikleyici çalışıyor, ortak `paywallPromptStore` +
`shouldShowInterstitialPaywall` (`src/utils/paywall.ts`) üzerinden, 4 günlük sessizlik
kuralıyla ve premium kullanıcıya hiç çıkmayacak şekilde:

- **Günlük plan tamamlanma** — `DailyPlanCompleteScreen` (`trigger=daily_plan_complete`)
- **Seri kilometre taşı** (3/7/14/30/50/100/365 gün) — `ExerciseCompletionActions`
  (`trigger=streak_milestone`)

İkisi de `INTERSTITIAL_DELAY_MS` kadar bekleyip açılıyor, böylece kutlama ekranı önce
görülüyor. Kullanıcı bu süre içinde ekrandan çıkarsa paywall hiç açılmıyor **ve**
sessizlik penceresi harcanmıyor — `markShown` navigasyonla aynı callback'in içinde.

**Kalan tek tetikleyici.** Kişisel rekor kırılınca. Kod tabanında "kişisel rekor"
kavramı hâlâ yok; önce WPM rekoru tespiti eklenmeli. Eklendiğinde aynı
`paywallPromptStore` / `shouldShowInterstitialPaywall` çiftini kullanmalı ve aynı
gecikmeye tabi olmalı.

---

## 5. Başarım Sisteminin Geliştirilmesi + Konfeti

**Kullanıcı problemi.** Şu an 6 başarım var ve bunların ikisi (`first_exercise`,
`exercise_10`) sadece ilk gün tetikleniyor. Sonrasında kullanıcı haftalarca hiçbir
başarım görmüyor. Kutlama da küçük bir popup — "kazandım" hissi vermiyor.

**Çözüm.** Kademeli ve süregelen bir başarım seti, görünür bir başarım ekranı, ve
açılış anında konfeti + haptik ile gerçek bir kutlama.

**Önerilen başarım kategorileri** (kademeli olmalı ki bitmesin):
- Hacim: 1 / 10 / 50 / 100 / 500 egzersiz
- Streak: 3 / 7 / 14 / 30 / 100 gün
- Hız: 300 / 400 / 500 / 700 WPM
- Anlama: %80 / %90 / %100 (hız düşürmeden)
- Çeşitlilik: 5 / 10 / 15 farklı egzersiz denenmiş
- Sadakat: hafta içi her gün, bir ayda 20 gün
- Zaman: toplam 60 / 300 / 1000 dakika antrenman
- Gizli/eğlenceli: gece yarısı seansı, sabah 06:00 öncesi seans, tek günde 10 egzersiz

**UX akışı.**
1. Başarım açıldığında tam genişlikte kutlama: konfeti + rozet + isim + XP + haptik.
2. Aynı anda birden fazla açılırsa sırayla, üst üste binmeden (kuyruk zaten var).
3. Yeni bir "Başarımlar" ekranı: açılanlar renkli, açılmayanlar kilitli ve ilerleme
   çubuğu ile ("100 egzersiz: 47/100").
4. Ana ekranda "bir sonraki başarıma ne kadar kaldı" mikro göstergesi.

**Teknik mimari.**
- Başarım tanımları `src/constants/gamification.ts`'te; koşullar
  `src/utils/gamification.ts`'te (`processGamification`) elle yazılmış `if`'ler —
  saf fonksiyon, tamamen yerel, her kullanıcı için çalışıyor. Yeni set için koşulları
  veriye çevirmek gerekir: her başarım `{ id, kategori, eşik, metrik }` tanımlar, tek
  bir değerlendirici çalıştırır. Böylece başarım eklemek veri eklemek olur.
- Yeni koşulların ihtiyacı olan her şey `localHistoryStore`'daki son 6 aydan
  hesaplanabilir ("15 farklı egzersiz", "bir ayda 20 gün" dahil). Yeni depolama
  gerekmiyor.
- **Konfeti:** yeni bağımlılık eklemeden `react-native-reanimated` ile yazılabilir
  (30-60 parça, rastgele başlangıç hızı + yerçekimi + dönme; `AchievementPopupGlobal`
  zaten Reanimated kullanıyor). `react-native-confetti-cannon` bakımsız ve Reanimated
  4 uyumu belirsiz — önce kendi implementasyonumuz denenmeli. Düşük seviye cihazda
  kare düşürmemesi için parça sayısı ölçülmeli.
- **Reduce Motion:** konfeti eklenecekse `useReducedMotion()` ile birlikte gelmeli;
  uygulamada şu an hiçbir yerde Reduce Motion kontrolü yok (bkz. 7.5).
- Haptik: `expo-haptics` ve `src/lib/haptics.ts` sarmalayıcısı hazır. Başarım anındaki
  güçlü `Success` + konfeti kombinasyonu bu maddeyi bekliyor.

**Retention etkisi.** Orta-yüksek. Şu an ilerleme hissi veren tek şey streak.

**MVP zorluğu.** Orta. Konfeti ve popup kolay; asıl iş koşulları veri odaklı hale
getirmek.

**Açık sorular.** Geçmişe dönük başarımlar: yeni başarım eklendiğinde eski kullanıcı
hak ettiklerini toplu mu alacak (o zaman aynı anda 8 konfeti patlar — sessizce açıp
tek bir "8 yeni başarım" özeti göstermek daha iyi)? Başarımlar ekranı ayrı sekme mi,
istatistik sekmesi içinde mi?

---

## 6. Paywall'da deneme sonrası adımlar

Custom paywall ve 14 günlük Play denemesi çalışıyor (bkz. `PROJECT_STATUS.md`).
Bekleyen küçük işler:

- **Yıllık plana da deneme.** Şu an yalnızca aylık temel planda teklif var. Yıllığa da
  eklenirse rozet kendiliğinden gizlenir (her iki kartta aynı şeyi söyleyen etiket
  hiçbir şeyi ayırt etmez) ve yalnızca CTA konuşur. Kod değişikliği gerekmiyor.
- **İndirimli intro fazı.** `trialOffer()` bilerek yalnızca fiyatı sıfır olan fazı
  kabul ediyor. "İlk 3 ay yarı fiyat" gibi bir teklif istenirse ayrı bir okuma ve ayrı
  bir kopya gerekir; şu an böyle bir teklif sessizce görünmez.
- **Kazanım analitiği.** `paywall_viewed` `trigger` taşıyor ama satın almanın hangi
  tetikleyiciden geldiği izlenmiyor; `subscription_started`'a da `trigger` eklenirse
  hangi anın sattığı ölçülebilir.

---

## 7. Karar bekleyen teknik borç

**7.3 Bekleyen başarım popup'ları kalıcı değil.** `gamificationStore` artık persist
ediliyor, ama `partialize` yalnızca `xp` / `level` / `unlockedAchievementIds`'i
yazıyor; `pendingAchievements` **bilerek** dışarıda, yoksa öldürülmüş bir uygulama
açıldığında bayat bir kutlama (ve analitik olayı) tekrar oynardı. Sonuç: uygulama
kapanırsa gösterilmemiş kutlama kaybolur. 5. madde ile birlikte, kuyruğu kalıcı yapıp
"gösterildi" işaretini ayrıca tutarak çözülebilir.

**7.5 Reduce Motion hiçbir yerde kontrol edilmiyor.** `useReducedMotion` /
`AccessibilityInfo` kod tabanında hiç geçmiyor. Başarım popup'ı 160px kayıyor, Track
canlı modda animasyonlu. Sistem "animasyonları kaldır" ayarı yok sayılıyor. 5. madde
konfeti eklerse bu madde blocker olur.

**7.6 Android otomatik yedekleme kararı.** `allowBackup` varsayılan olarak açık ve
`dataExtractionRules` dosyası yok; MMKV ilerleme verisi cihaz yedeklerine girebilir.
Token/hesap verisi olmadığı için risk düşük, ama ürün kararı olarak açık.
