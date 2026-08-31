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

- ✅ **Aynı egzersiz planda iki kez çıkıyordu:** `selectDailyPlan`, "dünkü planı tekrarlama" tercihi ile "aynı planda aynı egzersiz iki kez olamaz" kuralını tek `exclude` parametresinde birleştirmişti. Dünkü plan `MAIN_POOL`'u (rsvp/pacer/chunking) tamamen kapladığında `candidates` boşalıyor, "hepsini kullan" fallback'i `main1`'in dışlanmasını da düşürüyor ve iki ana blok aynı egzersize düşüyordu (emülatörde "Görsel Yönlendirici" iki kez + React `pacer` duplicate key uyarısı). `pickWeakest` artık `avoid` (tercih, fallback'te düşer) ile `forbid` (katı kural, fallback'te de korunur) ayrımını yapıyor. Regresyon testi eklendi (2026-08-30).
- ✅ **Daily Plan Akışı (Bug/UX):** `exercises/_layout.tsx`'e, o egzersiz segmentinden ayrılınca (X butonu, geri gesture'ı, her türlü navigasyon) `activeFlowType`'ı temizleyen bir cleanup effect'i eklendi (2026-08-20). Kök neden tek yerde kapatıldı: bu layout zaten tüm `/exercises/<type>` rotalarının tek ortak gate'iydi.

## Ana Sayfa

`.scratch/home-screen/` altındaki beş ticket 2026-08-31'de kapatıldı. Kod
tarafında kalıcı iz bırakanlar:

- ✅ **Bozuk günlük plan kendini iyileştiriyor:** `selectDailyPlan` 2026-08-30'da
  düzeltilmişti ama `ensureTodayPlan` aynı gün içinde planı yeniden üretmediği
  için eski build'in MMKV'ye yazdığı tekrarlı plan hayatta kalıyordu (ana
  ekranda "Görsel Yönlendirici" iki kez + `Encountered two children with the
  same key, pacer` toast'ı). Artık kalıcı planda tekrar varsa plan atılıp
  yeniden üretiliyor.
- ✅ **Adım tamamlanması indeks bazlı:** `completedTypes` → `completedIndices`
  (persist `version: 2` + migrate). Tekrarlı bir adımı bir kez bitirmek artık
  iki kutucuğu birden işaretlemiyor, `isAllDone` erken tetiklenmiyor.
- ✅ **Plan süresi tahmini gerçek:** düz `ESTIMATED_MINUTES_PER_EXERCISE = 3`
  yerine kullanıcının kendi medyan egzersiz süreleri (`estimatePlanMinutes`).
- ✅ **Yuvarlak kutucuk kenarlığı:** `backgroundColor: 'transparent'` + 1px
  yuvarlak kenarlık Android'de yalnızca sol yayı çiziyordu; `$background`'a
  alındı.

## Lokalizasyon (i18n)

- ✅ **Sabitlenmiş Metinler:** StatisticsDashboard ve 15 egzersizin tamamlanma ekranlarındaki hardcoded Türkçe stringler `progress`/`exercises`/`common` i18n namespace'lerine taşındı (2026-08-20). Ayrıca birkaç yerde `t('exercises.x.y', ...)` / `t('common.x', ...)` gibi, default namespace içinde yanlış anahtar yoluna bakan (hiç çözülmeyen, sessizce defaultValue'ya düşen) çağrılar düzeltildi. `StatisticsDashboard`'ın `currentStats: any` prop'u da `PerformanceStats` tipine geçirildi.
