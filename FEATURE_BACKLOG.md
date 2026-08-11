# Feature Backlog

> Planlanan özellikler ve karar bekleyen teknik borç. 1-5 ve 8. maddeler henüz koda girmedi — bu dosya onlar için kapsam, teknik plan ve açık soruları tutar; sıra geldikçe birlikte ekleyeceğiz. Tamamlananlar başlıklarında **UYGULANDI** olarak işaretli ve ne yapıldığı yazılı.

Son güncelleme: 2026-08-11 (6, 7.1 ve 7.2 uygulandı)
İlgili dokümanlar: `PRODUCTION_AUDIT.md` (mevcut durum ve bulgular), `PROJECT_STATUS.md` (mimari), `PRODUCTION_CHECKLIST.md` (yayın öncesi işler).

---

## Önce bilinmesi gereken: gamification şu an sadece premium çalışıyor

Bu, aşağıdaki özelliklerin çoğunu doğrudan etkiliyor, o yüzden başa yazıyorum.

XP, level ve başarımlar **yalnızca** `convex/exerciseSessions.createSession` içinde, sunucuda hesaplanıyor. O mutation premium olmayan kullanıcı için hiçbir şey yazmadan erken dönüyor, ve `SyncProvider` zaten kuyruğu sadece premium kullanıcı için boşaltıyor. Sonuç:

- Guest ve ücretsiz kullanıcı **hiç XP kazanmıyor, hiç başarım açmıyor**, `AchievementPopupGlobal` onlar için hiç tetiklenmiyor.
- `useGamificationStore` persist edilmiyor (sadece bellekte), yani premium kullanıcıda bile uygulama kapanınca bekleyen popup kayboluyor (bkz. 7.3).
- `XP_SOURCES.DAILY_GOAL_COMPLETED` (50 XP) ve `XP_SOURCES.STREAK_DAY` (20 XP) tanımlı ama hiçbir yerde verilmiyor; `processGamification` çağrısında `isDailyGoalCompleted` sabit `false` geçiliyor.

Yani "kullanıcıyı elde tutma" mekanizmasının tamamı, parayı zaten ödemiş olan kullanıcıya çalışıyor; ödemeyen kullanıcı hiç görmüyor. Aşağıdaki 1., 2. ve 5. maddeler bu karar netleşmeden tam anlamıyla yapılamaz.

**Karar gereken:** gamification (XP/level/başarım/streak) ücretsiz kullanıcıda da çalışsın mı? Öneri: evet — hesaplamayı istemci tarafına da alıp (aynı saf fonksiyonlarla) yerel olarak çalıştırmak, cloud sync'i premium tutmaya devam etmek. Aksi halde ücretsiz kullanıcı için uygulama "ilerleme hissi" vermiyor ve premium'a geçmek için de bir sebep oluşmuyor.

---

## 1. Günlük Plan

**Kullanıcı problemi.** Egzersizler sekmesinde 15 eşit seçenek var. Kullanıcı ne yapacağını, hangi sırayla yapacağını, bugün ne kadar yapması gerektiğini bilmiyor. Seçim yükü her açılışta tekrar ediyor ve "bugün neden açayım" sorusunun cevabı yok.

**Çözüm.** Ana ekranda tek bir kart: "Bugünün antrenmanı" — sırayla yapılacak 3-5 egzersiz, tahmini süre, tamamlanma halkası. Bittiğinde günlük hedef tamamlanmış sayılır ve `DAILY_GOAL_COMPLETED` XP'si verilir.

**UX akışı.**
1. Ana ekran → "Bugünün antrenmanı" kartı, adımlar liste halinde (tamamlananlar işaretli).
2. "Başla" → ilk egzersizin runner ekranı açılır (araya detay/ayar ekranı girmez).
3. Egzersiz biter → sonuç ekranında "Sıradaki: X" butonu → doğrudan sıradaki egzersize.
4. Son egzersiz biter → günlük plan tamamlandı ekranı: kazanılan XP, streak durumu, kısa özet.
5. Gün içinde uygulamayı kapatıp dönerse plan kaldığı yerden devam eder.

**Egzersiz sıralaması.** Uygulamadan önce araştırılacak — hızlı okuma antrenman literatüründe kabul gören bir ısınma/ana blok/soğuma yapısı var mı, kategori sırası (vision → focus → reading → comprehension → memory) gerçekten optimal mi, seans başına kaç egzersiz ideal. Şimdilik başlangıç hipotezi:
- 1 ısınma (göz kası / periferik: `peripheral`, `schulte`, `visual-search`)
- 1-2 ana blok (hız: `rsvp`, `pacer`, `chunking`)
- 1 anlama (`comprehension-speed`, `main-idea`, `keyword`)
- opsiyonel 1 hafıza/odak kapanış (`memory`, `selective-attention`)

Seçim, kullanıcının en zayıf kategorisine ağırlık vermeli ve arka arkaya aynı egzersizi vermemeli (aynı "son N tekrarı" mantığı `contentSelection.ts`'te zaten var, oradan ödünç alınabilir).

**Teknik mimari.**
- Plan **deterministik türetilebilir**: `(userId, yerel tarih)` tohumundan + `exerciseStatistics`'teki kategori bazlı ortalamalardan. Bu durumda yeni tabloya gerek yok, plan her iki tarafta da aynı şekilde hesaplanır. Tercih edilen yol bu.
- Alternatif: `dailyPlans` tablosu (`userId`, `date`, `exerciseIds[]`, `completedIds[]`). Sadece "planı sabitlemek" (kullanıcı gün içinde plan değişsin istemiyorsa) gerekiyorsa değer katar.
- Ücretsiz kullanıcı için aynı türetme istemcide, `localHistoryStore` + `exerciseProgressStore` verisiyle çalışmalı — yoksa özellik premium'a hapsolur (bkz. yukarıdaki karar).
- Tamamlanma durumu: yerelde `dailyPlanStore` (persist, user-scoped), sunucuda `dailyStatistics` zaten günlük süreyi tutuyor.
- `processGamification`'a `isDailyGoalCompleted` artık gerçek değerle geçilir → `DAILY_GOAL_COMPLETED` XP'si ilk kez fiilen dağıtılır.

**Gamification / retention etkisi.** Yüksek. Uygulamayı "ne istersen yap" havuzundan günlük ritüele çeviren tek özellik bu. Streak'in de anlamlı tetikleyicisi olur.

**MVP zorluğu.** Orta. Sıralama araştırması + zincirleme navigasyon (egzersizden egzersize geçiş) en çok iş çıkaran kısımlar. Runner ekranları şu an tek egzersiz için tasarlı, "sıradaki" akışı eklenmeli.

**Açık sorular.** Plan kaç egzersiz olmalı (kullanıcının `trainingGoalMins` hedefine göre değişken mi)? Kullanıcı plandaki bir egzersizi atlayabilmeli mi? Ücretsiz kullanıcının 6 egzersiz/gün limiti planla çakışırsa ne olur?

---

## 2. Haftalık Özet

**Kullanıcı problemi.** Okuma hızındaki gelişme yavaş ve gün gün görünmez. Kullanıcı ilerlediğini hissetmezse bırakır. Şu an istatistik sekmesine kendi girip grafiğe bakması gerekiyor — kimse yapmıyor.

**Çözüm.** Haftada bir (pazar akşamı) push bildirimi + uygulama içinde özet kartı: bu hafta kaç dakika çalıştın, WPM'in geçen haftaya göre ne değişti, en çok gelişme gösterdiğin egzersiz, streak durumu.

**UX akışı.**
1. Pazar 20:00'de push: "Bu hafta 47 dakika çalıştın, hızın %8 arttı 📈".
2. Dokunma → haftalık özet ekranı (tam sayfa, paylaşılabilir kart formatında).
3. Push kapalıysa özet ana ekranda bir hafta boyunca kart olarak durur.
4. Ekranın sonunda "Bu haftayı da tamamla" CTA'sı → günlük plan.

**Teknik mimari.**
- `convex/crons.ts` (henüz yok) — haftalık cron `internalAction`. `dailyStatistics` zaten kullanıcı başına günlük agregat tuttuğu için sorgu ucuz: 14 günlük aralık okuması yeter, ham session'lara dokunmaya gerek yok.
- Bildirim gönderimi için `internal.expoPush.sendPushToUser` hazır, `pushTokens` tablosu ve ölü token temizliği de hazır — yeni altyapı gerekmiyor.
- Kullanıcı tercihi: `settingsStore.progressNotificationsEnabled` ve sunucudaki `users.pushNotificationsEnabled` zaten var, ikisi de kontrol edilmeli.
- Zaman dilimi: `users.timezone` mevcut; cron UTC çalışır, kullanıcıya kendi saatinde ulaşması için ya saat başı çalışıp timezone'u eşleşenleri seçmeli ya da tek bir makul saatte gönderilmeli.
- Ücretsiz kullanıcıda sunucuda veri olmadığı için özet **yerelde** `localHistoryStore` üzerinden hesaplanmalı (son 6 ay orada) ve push yerine uygulama içi kart olarak gösterilmeli.

**Gamification / retention etkisi.** Orta-yüksek. Push altyapısının şu an sadece faturalama olaylarında kullanılıyor olması israf; bu onu ürün amaçlı kullanan ilk özellik.

**MVP zorluğu.** Düşük-orta. Cron + mevcut push action + tek ekran.

**Açık sorular.** Gün/saat sabit mi, kullanıcı seçebilir mi? Hiç çalışmadığı bir haftada ne yazacak (suçlayıcı olmayan bir ton gerekiyor)? Paylaşılabilir görsel kart (Instagram story formatı) ilk sürümde olsun mu?

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
- Haptik: `settingsStore.hapticsEnabled` zaten var ama hiçbir yerde kullanılmıyor; 8. madde ile birlikte ele alınmalı (`expo-haptics` gerekir — tek yeni bağımlılık, Expo destekli).

**Retention etkisi.** Orta-yüksek, özellikle ücretsiz kullanıcıya açıldığında. Şu an ilerleme hissi veren tek şey streak.

**MVP zorluğu.** Orta. Konfeti ve popup kolay; asıl iş başarım koşullarını veri odaklı hale getirmek ve ücretsiz/premium ayrımını çözmek.

**Açık sorular.** Geçmişe dönük başarımlar: yeni başarım eklendiğinde eski kullanıcı hak ettiklerini toplu mu alacak (o zaman aynı anda 8 konfeti patlar — sessizce açıp tek bir "8 yeni başarım" özeti göstermek daha iyi)? Başarımlar ekranı ayrı sekme mi, istatistik sekmesi içinde mi?

---

## 6. Streak Freeze — UYGULANDI (2026-08-11)

Duolingo'daki "seri dondurma" mantığı. Kullanıcı 7 ardışık günde bir "dondurma hakkı" kazanır (en fazla 2 birikir), bir gün kaçırdığında hak otomatik harcanır ve seri bozulmaz. Kaçırılan gün sayısı elde kalan haktan fazlaysa seri yine sıfırlanır; kazanılmış haklar sıfırlamada geri alınmaz.

Nerede: `src/utils/streak.ts` (saf fonksiyon, `FREEZE_EARN_INTERVAL_DAYS` ve `MAX_FREEZES` sabitleri), `convex/schema.ts` → `streaks.freezesAvailable` (opsiyonel alan, eski satırlar 0 sayılır), `streakCacheStore` ve `StreakBadge` (seri rozetinin yanında ❄️ + sayı). 8 yeni birim testi eklendi.

Sonraki adım (opsiyonel): dondurma harcandığında kullanıcıya "serini bir dondurma kurtardı" bildirimi/animasyonu göstermek. Şu an sessizce çalışıyor, yani kullanıcı hakkın işe yaradığını fark etmiyor.

## 7. Karar bekleyen teknik borç

Bunlar özellik değil ama yukarıdakilerin önünü kesiyor.

**7.1 Yeşil ana tema birleştirme — UYGULANDI (2026-08-11).** Ana tema rengi yeşil olarak kararlaştırıldı ve kod buna göre hizalandı: `app.json` içindeki splash arka planı ve bildirim rengi `#208AEF` → `#2DBE73` (uygulama ikonundaki yeşilin tam değeri), Android adaptive icon arka plan katmanı (mavi kalmış tek PNG) düz açık yeşile (`#E4F8EE`) yeniden üretildi, ve 18 dosyadaki 63 `$blue*` token'ı `$green*` karşılıklarına taşındı (`theme="blue"` → `theme="green"` dahil). Uygulama ikonunun kendisi zaten yeşildi, yeniden üretmeye gerek olmadı.

**7.2 Ücretsiz kullanıcı geçmiş modeli — UYGULANDI (2026-08-11).** Seçilen yol: kuyruk ile geçmiş ayrıldı. Yeni `src/stores/localHistoryStore.ts` her kullanıcı için **son 6 ayın** seansını cihazda tutuyor (`LOCAL_HISTORY_RETENTION_MS`, her yazmada budanıyor); `syncStore` artık yalnızca yükleme kuyruğu ve sadece premium + giriş yapmış kullanıcıda doluyor. Ana ekran, günlük limit sayacı ve egzersiz geçmiş grafiği artık yerel geçmişi okuyor. Premium kullanıcı ayrıca Convex'te sınırsız süre saklanıyor. Ücretsiz kullanıcı premium'a geçtiğinde `SyncProvider` yerel geçmişteki senkronize olmamış seansları kuyruğa alıp buluta yüklüyor, yani abonelik bulut geçmişini sıfırdan başlatmıyor. Mevcut kurulumlar için tek seferlik `importLegacyQueueIntoHistory` taşıması eklendi.

**7.3 Bekleyen başarım popup'ları kalıcı değil.** `gamificationStore` persist edilmiyor; uygulama kapanırsa gösterilmemiş kutlama kaybolur. 5. madde ile birlikte çözülür.

---

## 8. Egzersiz Sırasında Haptik Geri Bildirim

**Kullanıcı problemi.** Egzersizler tamamen görsel. Kullanıcı doğru mu yanlış mı yaptığını, ritmi tutturup tutturamadığını ancak ekrana bakarak anlıyor. Özellikle Schulte tablosu, tarama ve seçici dikkat gibi hızlı tepki gerektiren egzersizlerde ekrandaki renk değişimini fark etmek dikkati bölüyor. Ayrıca `settingsStore.hapticsEnabled` ayarı zaten var ama hiçbir yerde kullanılmıyor — kullanıcı açıp kapatıyor, hiçbir şey değişmiyor.

**Çözüm.** Hafif ve kısa titreşimlerle dokunsal geri bildirim. Kural: bilgi taşımayan titreşim yok. Her titreşim bir olaya karşılık gelmeli ve varsayılan olarak "hafif" seviyede olmalı.

**Nerede kullanılacak.**
- Doğru seçim / doğru hedef: `Haptics.ImpactFeedbackStyle.Light`
- Yanlış seçim / hata: `Haptics.NotificationFeedbackType.Error` (belirgin ama kısa)
- Metronom vuruşu (pacer/chunking): opsiyonel, ayrı bir alt ayar — sürekli titreşim pil tüketir ve rahatsız edicidir, bu yüzden varsayılan **kapalı**
- Egzersiz tamamlandı: `NotificationFeedbackType.Success`
- Kişisel rekor / başarım: 5. maddedeki konfeti ile birlikte tek bir güçlü `Success`
- Geri sayım son saniyesi: `Light`

**Teknik mimari.**
- `expo-haptics` eklenecek (tek yeni bağımlılık, Expo destekli, `bun expo install expo-haptics`).
- Doğrudan `Haptics.*` çağrısı yapılmamalı; `src/lib/haptics.ts` altında ince bir sarmalayıcı: `haptics.success()`, `haptics.error()`, `haptics.tick()`. Sarmalayıcı `settingsStore.hapticsEnabled`'ı kendisi kontrol eder, böylece her çağrı yerinde `if (hapticsEnabled)` yazmak gerekmez ve ayar tek yerde uygulanır.
- Android'de `Haptics` titreşim izni gerektirmez (expo-haptics `VIBRATE` iznini kendisi ekler) — `app.json` izin listesi buna göre kontrol edilmeli.
- iOS'ta sessiz moddayken haptik çalışır, Android'de cihaz ayarına bağlıdır; her iki durumda da sessizce başarısız olmalı, hata fırlatmamalı.
- Egzersiz motorlarında değil, **ekran** katmanında çağrılmalı — motor saf mantık kalmalı ki testleri cihaz API'sine bağlanmasın.

**Retention etkisi.** Düşük-orta, ama algılanan kalite üzerindeki etkisi yüksek: dokunsal geri bildirim uygulamayı "hazır" hissettiren en ucuz detaylardan biri.

**MVP zorluğu.** Düşük. Asıl iş nereye konulacağına karar vermek, kodun kendisi değil.

**Açık sorular.** Metronom titreşimi ayrı ayar olarak mı sunulacak yoksa hiç eklenmeyecek mi? Ayarlar ekranındaki mevcut `hapticsEnabled` anahtarı tek bir genel anahtar olarak mı kalsın?
