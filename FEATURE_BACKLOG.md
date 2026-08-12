# Feature Backlog

> Planlanan özellikler ve karar bekleyen teknik borç. Tamamlanan maddeler bu dosyadan çıkarılmıştır.

İlgili dokümanlar: `PRODUCTION_AUDIT.md` (mevcut durum ve bulgular), `PROJECT_STATUS.md` (mimari), `PRODUCTION_CHECKLIST.md` (yayın öncesi işler).

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

**Çözüm.** Doğru anda, seyrek, kapatılabilir tam ekran teklif. En iyi an: kullanıcının başarı hissi yaşadığı an — kişisel rekor kırınca, günlük planı bitirince, 3/7 günlük streak'e ulaşınca.

**UX akışı.**
1. Tetikleyici olay (rekor / plan tamamlandı / streak kilometre taşı).
2. Kutlama ekranından sonra tam ekran teklif: kullanıcının kendi verisiyle kişiselleştirilmiş ("Hızın 3 haftada 42 WPM arttı — premium ile detaylı analiz ve sınırsız egzersiz").
3. Belirgin kapat (×) butonu, "şimdi değil" seçeneği.
4. Frekans sınırı: en fazla 3-4 günde bir, art arda asla, kapatıldıktan sonra en az X gün sessizlik, satın alma sonrası tamamen kapalı.

**Teknik mimari.**
- Tetikleme ve frekans mantığı için `paywallPromptStore` (persist, user-scoped): `lastShownAt`, `dismissCount`, `lastTrigger`. Tamamen yerel — sunucuya gerek yok.
- Gösterim kararı tek bir saf fonksiyonda toplanmalı (`shouldShowInterstitial(state, trigger, now)`), böylece birim testi yazılabilir ve kural tek yerde durur.
- Ekranın kendisi 4. maddedeki custom paywall bileşenini kullanır; ayrı bir tasarım yapılmamalı.
- Analytics: `paywall_viewed` olayına `trigger` özelliği eklenmeli ki hangi tetikleyicinin dönüştüğü ölçülebilsin (şu an olay var ama kaynağı yok).

**Retention etkisi.** Dönüşüme etki eder, retention'a doğrudan etmez; yanlış ayarlanırsa retention'ı **düşürür**. Frekans sınırı bu özelliğin en önemli parçası, süsü değil.

**MVP zorluğu.** Düşük — 4. madde bittikten sonra.

**Açık sorular.** Hangi tetikleyiciler ilk sürümde açık olsun? Guest kullanıcıya gösterilecek mi (önce hesap açması mı istenmeli)? Play politikası açısından kapat butonunun görünürlüğü net olmalı.

---

## 4. RevenueCat Custom Paywall Entegrasyonu

**Kullanıcı problemi.** Şu an `RevenueCatUI.Paywall` (RevenueCat'in kendi hazır ekranı) kullanılıyor. Uygulamanın tipografisi, renk sistemi ve Türkçe dili ile tam uyuşmuyor, ürün mesajını (hangi özellik neden premium) anlatmıyor ve A/B denemesi yapmak zor.

**Çözüm.** Uygulamanın kendi tasarım diliyle yazılmış paywall ekranı; ürün/fiyat verisi yine RevenueCat SDK'sından (`getOfferings`), satın alma yine `purchasePackage` ile.

**UX akışı.**
1. Başlık + tek cümlelik değer önerisi.
2. Özellik listesi — ücretsiz vs premium karşılaştırması (sınırsız egzersiz, bulut yedekleme, detaylı analiz, tüm başarımlar).
3. Paket seçimi: aylık / yıllık, yıllıkta "%X tasarruf" rozeti, varsayılan seçili yıllık.
4. Tek birincil buton, altında küçük "Satın alımları geri yükle" ve şartlar/gizlilik linkleri.
5. Satın alma sonrası başarı durumu ve geldiği yere dönüş.

**Teknik mimari.**
- `react-native-purchases` zaten kurulu: `getOfferings()`, `purchasePackage()`, `restorePurchases()`. Yeni bağımlılık yok.
- `RevenueCatProvider` şu an `customerInfo` ve `isPremium` veriyor; `offerings` de aynı provider'a eklenmeli (tek yerden, ikinci bir listener açmadan).
- Fiyatlar **asla** koda yazılmamalı — `package.product.priceString` kullanılmalı (yerel para birimi ve biçim).
- Hata durumları: kullanıcı iptali (sessiz geç), ödeme hatası, ürün bulunamadı, offering boş → hepsi ayrı ayrı ele alınmalı; şu anki hosted ekran bunları kendi hallediyor, custom ekranda bizim işimiz.
- `react-native-purchases-ui` yalnızca Customer Center için kalabilir (abonelik yönetimi), paywall için gerekmez.
- Play politikası gereği abonelik şartları, süre ve otomatik yenileme bilgisi ekranda açıkça yazmalı.

**Retention etkisi.** Dolaylı — dönüşüm oranı ve mesaj kontrolü. Asıl kazanç ölçülebilirlik: hangi paket, hangi metin, hangi giriş noktası çalışıyor.

**MVP zorluğu.** Orta. Zor kısmı tasarım değil, satın alma hata durumlarının eksiksiz ele alınması ve sandbox'ta test edilmesi.

**Açık sorular.** Deneme süresi (trial) olacak mı? Tek seferlik "lifetime" paket düşünülüyor mu? A/B testi RevenueCat Experiments ile mi yürütülecek?

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
