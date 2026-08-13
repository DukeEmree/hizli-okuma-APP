# Bug Dokümantasyonu

Kullanıcı raporlarına göre taranan buglar. Kök neden + dosya:satır belirtildi.
✅ = düzeltildi (typecheck/lint/test temiz). ⏳ = henüz açık (içerik yazımı veya ayrı tasarım kararı gerektiriyor).

## 1. Hızlı Kelime Akışı (RSVP)

- ✅ **Metronom senkron değil / 2 tık:** Metronom artık kendi bağımsız `setInterval`'ı yerine kelime ilerlemesiyle aynı olayda tetikleniyor (`RSVPExerciseScreen.tsx`, `useMetronome.ts`'e eklenen `playTick()`). İki bağımsız timer olmadığı için çift tık de ortadan kalkıyor.
- ✅ **Son kelime çok hızlı kayboluyor:** `useRSVPEngine.ts` — son kelime artık bir slot daha ekranda kalıyor, sonra tamamlanıyor (aynı düzeltme Pacer/Görsel Yönlendirici'de de yapıldı).
- ✅ **Sorular metinle alakasız:** Kod akışında kopukluk yoktu; sorun içerik verisindeydi. Tüm 15 metin yeniden yazıldı (331-370 kelime) ve her metne, metinden birebir doğrulanabilir 5 soru eklendi.

## 2. Görsel Yönlendirici (Pacer)

- ✅ Aynı metronom-senkron ve son-kelime düzeltmesi buraya da uygulandı (`PacerExerciseScreen.tsx`, `usePacerEngine.ts`).

## 3. Günlük Görev / Egzersiz Seçme

- ✅ **Son egzersizi tekil yapınca gün tamamlandı diyor / ortadaki egzersizi tekil başlatınca otomatik sıradakine geçiyor:** `dailyPlanStore.ts`'e `activeFlowType` eklendi — sadece DailyPlanCard'dan başlatılan akış bu alanı set ediyor. `ExerciseCompletionActions.tsx` artık "sıradaki egzersize geç" davranışını yalnızca `activeFlowType === exerciseType` iken gösteriyor; Egzersizler sekmesinden tekil başlatılan bir egzersiz hâlâ günlük listede işaretleniyor ama otomatik zincirlemiyor. "Sonraki" araması da artık listenin tamamını (sadece ileri değil) tarıyor.

## 4. Kelime Gruplama (Chunking)

- ✅ **Kelime grupları birbirleriyle alakasız:** Kök neden bulundu — `useChunkingEngine.ts` grupları sabit `chunkSize` kelimelik pencerelerle kayan (sliding window) mantıkla oluşturuyordu, cümle/madde sınırına bakmadan. Bu yüzden bir cümlenin sonu bir sonraki cümlenin başıyla aynı grup içinde birleşebiliyordu (örn. "...artırır." + "Gözleriniz her" tek grup oluyordu). İçeriğin kendisi zaten gerçek/tutarlı metindi (`COMPREHENSION_TEXTS`), sorun rastgele metin değil, gruplama algoritmasıydı. `splitIntoPhraseChunks` eklendi: metin önce noktalama işaretlerine (`, ; : . ! ? …`) göre cümle/madde parçalarına ayrılıyor, gruplar bu parçaların içinde kalıyor, hiçbir grup bir cümle/madde sınırını aşmıyor.

## 5. Schulte Tablosu

- ✅ **Merkez odak noktası yok:** Mavi nokta eklendi (`SchulteExerciseScreen.tsx`).
- ✅ **60sn sınırında "süre doldu" yanlış tetikleniyor:** Süre kontrolü artık throttle'lı `elapsedMs` yerine motorun ham (~100ms) tick'inden besleniyor (`useSchulteEngine.ts`), basış ile yarış penceresi ~1000ms'den ~100ms'ye indi.
- ✅ **Yanlış basışta yeni tablo gelmiyor:** Artık yanlış basışta grid yeniden karılıyor (ilerleme kaybolmadan).
- ⏳ **Doğru/yanlış haptic "hissedilmiyor":** Kod zaten çağırıyor (`haptics.light`/`haptics.error`) — cihaz/algı sorunu olabilir, kullanıcı geri bildirimi gerekiyor.
- ⏳ **"Zorluk kaydedilmiyor" hissi:** Kod zaten kaydediyor (MMKV + `difficultyMapper.ts`) — neden fark edilmediği ayrı sorgulanmalı.

## 6. Görsel Tarama (Scanning)

- ✅ **Tek round'da bitiyor:** Artık hedef sayıya ulaşınca yeni (biraz daha zor) bir round başlıyor, egzersiz süre dolana kadar devam ediyor (`useScanningEngine.ts`).
- ✅ **Harfler taşıyor / kutular küçük:** Hücre boyutu artık Schulte gibi `useWindowDimensions`e göre hesaplanıyor, `padding={0}` eklendi (`ScanningExerciseScreen.tsx`).
- ✅ **Egzersiz listesi scroll pozisyonu sıfırlanıyor:** `exercises.tsx`'e scroll offset kaydı/restore eklendi.
- ⏳ **Ekranın ortasına bakma sorusu:** Tasarım/UX kararı, kullanıcıya sorulmalı.

## 7. Periferal Görüş

- ✅ **Kelimeler görünmüyor:** `PeripheralExerciseScreen.tsx`'te mesafe artık ekran boyutuna göre clamp'leniyor, kelime viewport dışına taşmıyor.

## 8. Hızlı Kelime Tanıma / Kelime Hafızası / Cümle Hafızası / Ana Fikir / Anahtar Kelime Avı / Sayı Taraması / Kelime Arama

- ✅ **Doğru/yanlış haptic eksikti:** `word-recognition`, `memory`, `sentence-memory`, `number-scan` ekranlarında sadece egzersiz bitince `haptics.success()` vardı, seçim anında hiç haptic yoktu (main-idea/keyword/visual-search/schulte'de zaten vardı, buradan kopyalandı). Her 4 ekranda seçim `onPress`'ine doğruysa `haptics.light()`, yanlışsa `haptics.error()` eklendi. Aynı eksik `scanning`'de hücreye basışta da vardı, oraya da eklendi.
- ✅ **Sayı taramasında zorluk "hissedilmiyor":** Kök neden — `useNumberScanEngine.ts` sayı aralığını `currentDifficulty > 5` diye tek bir eşikte 2 basamaktan 3 basamağa **sıçratıyordu**; zorluk 1-5 arası ve 6-10 arası kendi içinde hiç değişmiyordu. Artık `maxVal` her seviyede kademeli büyüyor (`99 + (diff-1)*100`, üst sınır 999), her zorluk adımı gerçekten fark yaratıyor.
- ⏳ **Diğer egzersizlerde ince adımlar:** `difficultyMapper.ts` sadece `rsvp/chunking/pacer/schulte/scanning`'i kapsıyor, kalanlar kendi engine'inde parametre üretiyor. Kontrol edildi: çoğunda zaten süreklilik var (`word-recognition` hedef gösterim süresi, `memory` kelime sayısı/gösterim süresi, `sentence-memory` kelime hızı, `visual-search`/`number-scan` grid boyutu hep seviyeyle birlikte değişiyor). `main-idea`/`keyword` sadece metin zorluğuna göre pasaj seçiyor (başka parametre yok) — bu, "hissedilmiyor" hissine yol açabilir ama tasarım gereği (metin havuzu 1-10 arası dengeli dağılmış, kod hatası değil); ek bir zorluk parametresi (örn. soru başına süre baskısı) eklemek istenirse ayrı bir özellik olarak planlanmalı.
- ✅ **Kelime arama başlığı:** "Şu kelimeyi bul: X" → sadece "X" oldu (`VisualSearchExerciseScreen.tsx`).

## 9. Ana Ekran / Günlük Antrenman Başlatma

- ✅ **"Bugünün antrenmanı" direkt egzersiz ekranına atıyor, nasıl yapılacağı gösterilmiyor:** Talimat ekranı zaten vardı — `src/app/(app)/exercise/[exerciseId].tsx`, amaç/"Nasıl Çalışır?"/ayarlar/geçmiş performans içeren tam bir bilgi ekranı (i18n içerikleri `exercises.json`'da 15 egzersizin hepsi için dolu). Egzersizler sekmesi (`exercises.tsx:56`) zaten oraya yönlendiriyordu. Ama `DailyPlanCard.tsx:56` bu ekranı atlayıp direkt `/(app)/exercises/${type}` motor route'una gidiyordu. Düzeltme: `handlePress` artık `exerciseRegistry.getByType(type).id` ile aynı bilgi ekranına (`/exercise/${id}`) yönlendiriyor — kullanıcı "Başla"ya basınca oradan motor ekranına geçiyor, tıpkı tekil seçimde olduğu gibi.

## 10. Genel

- ✅ **Metin uzunluğu/zorluğu:** Tüm metin bankaları yeniden yazıldı ve her metin en az 300 kelimeye çıkarıldı:
  - `COMPREHENSION_TEXTS` (RSVP/okuduğunu anlama): 15 metin, 331-370 kelime, 5'er soru
  - `comprehensionSpeedItems`: 10 metin, 307-352 kelime, 5'er soru
  - `mainIdeaItems` (ana fikir): 18 metin, 303-347 kelime, 3'er soru
  - `keywordItems` (anahtar kelime avı): 18 metin, 300-327 kelime, 3'er soru
- ✅ **Ana fikir ve anahtar kelime avında arka arkaya birkaç soru:** Şema `question/options/correctIndex` yerine `questions[]` dizisine çevrildi; engine ve ekranlar aynı metin üzerinde soruları sırayla sorup ancak hepsi bitince yeni metin çekiyor. Ekranda "Soru 1 / 3" göstergesi ve doğru/yanlış haptic geri bildirimi eklendi.
- ✅ **Zorluk değişince sesli geri bildirim:** Kullanıcının eklediği `assets/audio/zorluk.wav` kullanılıyor. `src/lib/sounds.ts` (`haptics.ts` ile aynı desen — `soundEnabled` ayarına bakan, hook olmayan modül) eklendi. `useCreateSession.ts`'de yeni zorluk seviyesi (`newProgression.currentLevel`) bir önceki seviyeden farklıysa (yukarı ya da aşağı) çalınıyor. `expo-audio` importu fonksiyon içinde lazy `require` ile yapıldı — `useCreateSession` her egzersiz motoru testinde import edildiği için modül seviyesinde `expo-audio` importu tüm test suite'ini kırıyordu (native binding test ortamında yüklenemiyor); lazy require ile bu sorun çözüldü, testler asıl çalma anına kadar expo-audio'ya hiç dokunmuyor.
- ✅ **Egzersizler arası zorluk etkileşimi (cross-exercise difficulty):** Somut kök neden bulundu — **Pacer** (Görsel Yönlendirici) egzersizinin doğru/yanlış diye ölçülebilecek hiçbir cevabı yok, sadece kelimeyi vurgulayıp geçiyor. `calculateReadingScore` bu yüzden `accuracy`'yi her zaman `1` (comprehensionAccuracy da completionRate de yok) döndürüyordu; `calculateNextProgression` da accuracy≥0.8'i her zaman "başarı" sayıp Pacer'ı her 2 seansta bir otomatik olarak zorluk 10'a kadar tırmandırıyordu — kullanıcı o hızı takip edebiliyor mu diye hiç bakmadan. Aynı "WPM'de X hızında oku" becerisini RSVP zaten kavrama sorularıyla ölçüyor, o yüzden Pacer artık **kendi zorluğunu yazmıyor/okumuyor, RSVP'ninkini kullanıyor**: `difficultyMapper.ts`'e `CROSS_EXERCISE_METRICS_SOURCE = { pacer: RSVP_ID }` eklendi; `useAdaptiveExerciseStart.ts` başlangıç zorluğunu bu haritaya göre okuyor, `useCreateSession.ts` da bu tür egzersizler için kendi (anlamsız) progression yazımını atlıyor. Mekanizma genel: yeni bir egzersiz kendi doğruluğunu ölçemiyorsa haritaya bir satır eklemek yeterli. Regresyon testi eklendi (`useAdaptiveExerciseStart.test.ts`), typecheck/lint/test temiz (144/144).
