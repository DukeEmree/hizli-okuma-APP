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

- ✅ **Daily Plan Akışı (Bug/UX):** `exercises/_layout.tsx`'e, o egzersiz segmentinden ayrılınca (X butonu, geri gesture'ı, her türlü navigasyon) `activeFlowType`'ı temizleyen bir cleanup effect'i eklendi (2026-08-20). Kök neden tek yerde kapatıldı: bu layout zaten tüm `/exercises/<type>` rotalarının tek ortak gate'iydi.

## Lokalizasyon (i18n)

- ✅ **Sabitlenmiş Metinler:** StatisticsDashboard ve 15 egzersizin tamamlanma ekranlarındaki hardcoded Türkçe stringler `progress`/`exercises`/`common` i18n namespace'lerine taşındı (2026-08-20). Ayrıca birkaç yerde `t('exercises.x.y', ...)` / `t('common.x', ...)` gibi, default namespace içinde yanlış anahtar yoluna bakan (hiç çözülmeyen, sessizce defaultValue'ya düşen) çağrılar düzeltildi. `StatisticsDashboard`'ın `currentStats: any` prop'u da `PerformanceStats` tipine geçirildi.
