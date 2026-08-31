# 01 — Günlük planda tekrarlanan adım ve görünen React hatası

Status: done (2026-08-31)

## Çözüm

- `dailyPlanStore.ensureTodayPlan` artık kalıcı planda tekrar varsa
  (`new Set(x).size !== x.length`) planı atıp yeniden üretiyor — sahadaki bozuk
  MMKV durumları açılışta kendini iyileştiriyor.
- Tamamlanma tip bazlı değil **indeks** bazlı: `completedTypes: string[]` yerine
  `completedIndices: number[]`. `markStepCompleted(type)` çağrı imzası aynı
  kaldı (15 egzersiz rotası değişmedi), ama artık o tipin *ilk bekleyen*
  satırını işaretliyor. persist `version: 2` + eski `completedTypes`'ı indekse
  çeviren `migrate` ile gün ortasında yükseltme ilerlemeyi kaybetmiyor.
- `DailyPlanCard` ve `DailyPlanListScreen` satır anahtarı `${type}-${index}`,
  kilit/tamamlanma kontrolleri indeks üzerinden.
- `ExerciseCompletionActions` de indeks bazlı kontrole geçti.
- Testler: tekrarlı adımın tek tek tamamlanması, bozuk kalıcı planın
  yeniden üretilmesi, aynı günün planının korunması.
- Emülatörde doğrulandı: plan 4 farklı egzersiz, hata toast'ı yok.
Severity: P0
Blocked by: —

## Belirti

Emülatörde ana ekran, günlük plan kartında **"Görsel Yönlendirici"yi iki kez**
listeliyor ve her render'da kırmızı bir hata toast'ı basıyor:

> Encountered two children with the same key, `pacer`.

Toast `[26,2146][1054,2271]` alanını kaplıyor, kendisi `clickable` ve **tab bar'ın
hit alanının üstünde** oturuyor.

## Kök neden

Üç ayrı yerde, üçü de düzeltilmeli:

1. **Kalıcı veri iyileşmiyor.** `selectDailyPlan` 2026-08-30'da düzeltildi
   (`avoid` / `forbid` ayrımı, `src/utils/dailyPlan.ts`), ama
   `src/stores/dailyPlanStore.ts:44` yalnızca tarih değiştiğinde yeniden üretiyor:

   ```ts
   if (state.date === today && state.exerciseTypes.length > 0) return;
   ```

   Eski build'in MMKV'ye yazdığı bozuk plan olduğu gibi hayatta kalıyor. Jeneratör
   doğru, veri değil.

2. **Anahtar çakışması.** `src/features/dailyPlan/DailyPlanCard.tsx:49` satırları
   `key={type}` ile anahtarlıyor.

3. **Tamamlanma tip bazlı.** Aynı dosyada `:47` → `completedTypes.includes(type)`
   ve `dailyPlanStore.markStepCompleted(type)` tipe göre çalışıyor. Yani pacer'ı
   **bir kez** bitirmek iki kutucuğu birden işaretliyor; plan bitmemişken bitmiş
   görünüyor ve `isAllDone` erken tetikleniyor.

## Yapılacak

- `ensureTodayPlan` içinde okuma anında dedupe: kalıcı `exerciseTypes` içinde
  tekrar varsa (`new Set(x).size !== x.length`) planı at ve yeniden üret.
  Bu, sahadaki mevcut kurulumları da iyileştirir.
- `DailyPlanCard` satır anahtarını `` `${type}-${i}` `` yap.
- Adım tamamlanmasını indeks bazlı hale getir (`markStepCompleted(index)` veya
  `completedIndices`), ki meşru bir tekrar ileride mümkün olsun.
- `DailyPlanListScreen` aynı tip/indeks varsayımını paylaşıyorsa orada da düzelt.

## Kabul kriteri

- Bozuk plan taşıyan bir MMKV durumundan açılışta tekrar temizleniyor.
- Ana ekranda hata toast'ı yok.
- Aynı egzersiz iki kez listelenirse (ileride kasıtlı olursa) bir adımı bitirmek
  yalnızca o adımı işaretliyor.
- `dailyPlanStore` testleri kalıcı-bozuk-plan senaryosunu kapsıyor.
- Mevcut regresyon testi (`src/utils/__tests__/dailyPlan.test.ts`,
  "never repeats a main block…") geçmeye devam ediyor.
