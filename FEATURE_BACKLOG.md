# Feature Backlog

> Planlanan özellikler ve karar bekleyen teknik borç. Tamamlanan maddeler bu dosyadan çıkarılmıştır.

İlgili dokümanlar: `PROJECT_STATUS.md` (mimari, mevcut durum ve bulgular), `RELEASE_TODO.md` (yayın öncesi işler).

---

## Önce bilinmesi gereken: gamification şu an sadece premium çalışıyor

Bu, aşağıdaki özelliklerin bazılarını (ör. başarım sistemi) doğrudan etkiliyor:

- XP, level ve başarımlar **yalnızca** `convex/exerciseSessions.createSession` içinde, sunucuda hesaplanıyor. O mutation premium olmayan kullanıcı için hiçbir şey yazmadan erken dönüyor, ve `SyncProvider` zaten kuyruğu sadece premium kullanıcı için boşaltıyor.
- Guest ve ücretsiz kullanıcı **hiç XP kazanmıyor, hiç başarım açmıyor**, `AchievementPopupGlobal` onlar için hiç tetiklenmiyor.
- `useGamificationStore` persist edilmiyor (sadece bellekte), yani premium kullanıcıda bile uygulama kapanınca bekleyen popup kayboluyor (bkz. 7.3).

**Karar gereken:** gamification (XP/level/başarım/streak) ücretsiz kullanıcıda da çalışsın mı? Öneri: evet — hesaplamayı istemci tarafına da alıp (aynı saf fonksiyonlarla) yerel olarak çalıştırmak, cloud sync'i premium tutmaya devam etmek.

---

## 3. Ara Ekran Premium Teklifi (Interstitial Paywall)

**Kullanıcı problemi.** Şu an paywall'a yalnızca kullanıcı kendisi giderse (ayarlar, ana ekrandaki kart) veya günlük limite çarparsa ulaşıyor. Limit anı en kötü teklif anı: kullanıcı tam çalışmak isterken engelleniyor ve rahatsız oluyor.

**Çözüm.** Doğru anda, seyrek, kapatılabilir tam ekran teklif. Hosted `RevenueCatUI.Paywall` (`/paywall` route) kullanılır — ayrı bir custom paywall tasarımı yok.

**Durum.** İki tetikleyici uygulandı, ortak `paywallPromptStore` + `shouldShowInterstitialPaywall` (`src/utils/paywall.ts`, 4 günlük sessizlik kuralı) üzerinden:
- Günlük plan tamamlanma — `DailyPlanCompleteScreen`, premium olmayan kullanıcıda otomatik `/paywall`'a yönlendirir (`trigger=daily_plan_complete`). Var olan manuel giriş kartı bu sınırdan etkilenmeden ayrıca duruyor.
- Streak kilometre taşı (3/7/14/30/50/100/365 gün, `streakCacheStore.STREAK_MILESTONES`) — `ExerciseCompletionActions` (her egzersiz tamamlama ekranının kullandığı tek ortak nokta) `currentStreak` bir kilometre taşındaysa otomatik `/paywall`'a yönlendirir (`trigger=streak_milestone`).

**Kalan tetikleyici (henüz yok).** Kişisel rekor kırılınca — kod tabanında "kişisel rekor" kavramı henüz yok, önce WPM rekoru tespiti eklenmeli. Eklendiğinde aynı `paywallPromptStore`/`shouldShowInterstitialPaywall` çiftini kullanmalı.

**Açık sorular.** Play politikası açısından hosted ekrandaki kapat (×) butonunun görünürlüğü RevenueCat dashboard paywall ayarından kontrol ediliyor — orada net olduğundan emin olunmalı.

---

## 5. Başarım Sisteminin Geliştirilmesi + Konfeti

**Kullanıcı problemi.** Şu an 6 başarım var ve bunların ikisi (`first_exercise`, `exercise_10`) sadece ilk gün tetikleniyor. Sonrasında kullanıcı haftalarca hiçbir başarım görmüyor. Üstelik ücretsiz kullanıcı hiçbirini hiç görmüyor (bkz. en üstteki not). Kutlama da küçük bir popup — "kazandım" hissi vermiyor.

**Çözüm.** Kademeli ve süregelen bir başarım seti, görünür bir başarım ekranı, ve açılış anında konfeti + haptik ile gerçek bir kutlama.

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
1. Başarım açıldığında tam genişlikte kutlama: konfeti + rozet + isim + XP miktarı + haptik.
2. Aynı anda birden fazla açılırsa sırayla, üst üste binmeden.
3. Yeni bir "Başarımlar" ekranı: açılanlar renkli, açılmayanlar kilitli ve ilerleme çubuğu ile ("100 egzersiz: 47/100").
4. Ana ekranda "bir sonraki başarıma ne kadar kaldı" mikro göstergesi.

**Teknik mimari.**
- Başarım tanımları `src/constants/gamification.ts`'te; koşullar `convex/gamification.ts`'te elle yazılmış `if`'ler. Yeni set için koşulları veriye çevirmek gerekir: her başarım `{ id, kategori, eşik, metrik }` tanımlar, tek bir değerlendirici fonksiyon çalıştırır. Böylece başarım eklemek veri eklemek olur, kod yazmak değil.
- Değerlendirici **saf fonksiyon** olmalı (`src/utils/` altında), hem Convex hem istemci aynı fonksiyonu çağırsın. `calculateStreakUpdate` bu şekilde zaten paylaşılıyor, aynı desen.
- Ücretsiz kullanıcı desteği bu sayede bedavaya gelir: aynı fonksiyon yerel veriyle çalışır, sonuç `gamificationStore`'a düşer. Cloud tarafı premium kullanıcıda ayrıca kalıcı yazar.
- `gamificationStore` **persist edilmeli** (şu an sadece bellekte, uygulama kapanınca bekleyen popup kayboluyor).
- Bazı yeni koşullar sunucuda ek veri ister: "15 farklı egzersiz" için `exerciseStatistics` zaten yeterli; "bir ayda 20 gün" için `dailyStatistics` yeterli. Ücretsiz kullanıcı tarafında aynı koşullar `localHistoryStore`'daki son 6 aydan hesaplanabilir. Yeni tablo gerekmiyor.
- **Konfeti:** yeni bağımlılık eklemeden `react-native-reanimated` ile yazılabilir (30-60 parça, her biri rastgele başlangıç hızı + yerçekimi + dönme; `AchievementPopupGlobal` zaten Reanimated kullanıyor). Hazır kütüphane (`react-native-confetti-cannon`) bakımsız ve Reanimated 4 ile uyumu belirsiz — önce kendi implementasyonumuzu deneyelim. Düşük seviye cihazda kare düşürmemesi için parça sayısı ölçülmeli.
- Haptik: `expo-haptics` ve `src/lib/haptics.ts` sarmalayıcısı kuruldu. Kişisel rekor/başarım anındaki güçlü `Success` + konfeti kombinasyonu bu maddeyi bekliyor.

**Retention etkisi.** Orta-yüksek, özellikle ücretsiz kullanıcıya açıldığında. Şu an ilerleme hissi veren tek şey streak.

**MVP zorluğu.** Orta. Konfeti ve popup kolay; asıl iş başarım koşullarını veri odaklı hale getirmek ve ücretsiz/premium ayrımını çözmek.

**Açık sorular.** Geçmişe dönük başarımlar: yeni başarım eklendiğinde eski kullanıcı hak ettiklerini toplu mu alacak (o zaman aynı anda 8 konfeti patlar — sessizce açıp tek bir "8 yeni başarım" özeti göstermek daha iyi)? Başarımlar ekranı ayrı sekme mi, istatistik sekmesi içinde mi?

---

## 7. Karar bekleyen teknik borç

**7.3 Bekleyen başarım popup'ları kalıcı değil.** `gamificationStore` persist edilmiyor; uygulama kapanırsa gösterilmemiş kutlama kaybolur. 5. madde ile birlikte çözülür.

**7.4 Sync kuyruğu batch değil.** `SyncProvider.syncQueue` bekleyen her session için ayrı `createSession` mutation çağırıyor. N bekleyen session = N call. Çözüm: `createSession`'ı array kabul edecek şekilde batch mutation'a çevirmek, queue tek call'da yollasın. Öncelik düşük.
