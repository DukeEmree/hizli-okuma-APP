# Bug Dokümantasyonu

Kullanıcı raporlarına göre taranan açık buglar. Kök neden + dosya:satır belirtildi.
⏳ = henüz açık (içerik yazımı veya ayrı tasarım kararı gerektiriyor).

## Schulte Tablosu

- ⏳ **Doğru/yanlış haptic "hissedilmiyor":** Kod zaten çağırıyor (`haptics.light`/`haptics.error`) — cihaz/algı sorunu olabilir, kullanıcı geri bildirimi gerekiyor.
- ⏳ **"Zorluk kaydedilmiyor" hissi:** Kod zaten kaydediyor (MMKV + `difficultyMapper.ts`) — neden fark edilmediği ayrı sorgulanmalı.

## Görsel Tarama (Scanning)

- ⏳ **Ekranın ortasına bakma sorusu:** Tasarım/UX kararı, kullanıcıya sorulmalı.

## Zorluk Kademeleri

- ⏳ **Diğer egzersizlerde ince adımlar:** `difficultyMapper.ts` sadece `rsvp/chunking/pacer/schulte/scanning`'i kapsıyor, kalanlar kendi engine'inde parametre üretiyor. Kontrol edildi: çoğunda zaten süreklilik var (`word-recognition` hedef gösterim süresi, `memory` kelime sayısı/gösterim süresi, `sentence-memory` kelime hızı, `visual-search`/`number-scan` grid boyutu hep seviyeyle birlikte değişiyor). `main-idea`/`keyword` sadece metin zorluğuna göre pasaj seçiyor (başka parametre yok) — bu, "hissedilmiyor" hissine yol açabilir ama tasarım gereği (metin havuzu 1-10 arası dengeli dağılmış, kod hatası değil); ek bir zorluk parametresi (örn. soru başına süre baskısı) eklemek istenirse ayrı bir özellik olarak planlanmalı.

## Günlük Plan (Daily Plan)

- ⏳ **Daily Plan Akışı (Bug/UX):** Herhangi bir egzersizden "X" butonuyla çıkıldığında `dailyPlanStore.activeFlowType` temizlenmiyor. Bu, özellikle premium olmayan kullanıcılarda uygulamanın yeniden başlatılana kadar o egzersizi sürekli tekrar etmesi gibi akış hatalarına yol açabilir.

## Lokalizasyon (i18n)

- ⏳ **Sabitlenmiş Metinler:** Uygulamanın çoğunluğu react-i18next yapısına taşınmış olsa da StatisticsDashboard ve egzersiz sonu (completion) ekranlarında İngilizce/Türkçe dil ayarlarını yoksayacak hardcoded Türkçe stringler hala mevcut.
