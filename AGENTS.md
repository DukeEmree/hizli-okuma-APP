# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# AGENTS.md

# Hızlı Okuma — AI Coding Agent Guidelines

Bu repository, React Native + Expo kullanılarak geliştirilen bir hızlı okuma ve okuma becerileri geliştirme uygulamasıdır.

Bu dosyadaki kurallar tüm coding agent işlemleri için geçerlidir.

---

# 1. Core Stack

Projede kullanılan ana teknolojiler:

- React Native
- Expo
- Expo Router
- TypeScript
- Tamagui
- Bun
- Zustand
- react-native-mmkv
- Clerk
- Convex
- RevenueCat
- Sentry
- Amplitude
- Victory Native
- i18next
- react-i18next
- expo-localization
- React Native Reanimated

Backend:

```text
Convex
```

Authentication:

```text
Clerk
```

Subscriptions:

```text
RevenueCat
```

Analytics:

```text
Amplitude
```

Error monitoring:

```text
Sentry
```

Local state:

```text
Zustand + MMKV
```

Charts:

```text
Victory Native
```

---

# 2. Package Manager

Projede **yalnızca Bun** kullanılmalıdır.

Kullan:

```bash
bun install
bun add <package>
bun remove <package>
bun run <script>
```

Expo dependency kurulumu gerektiğinde:

```bash
bun expo install <package>
```

Kullanma:

```text
npm
yarn
pnpm
```

Repository'de aşağıdaki lockfile'lar bulunmamalıdır:

```text
package-lock.json
yarn.lock
pnpm-lock.yaml
```

Ana lockfile:

```text
bun.lock
```

olmalıdır.

---

# 3. General Coding Principles

## Önce mevcut kodu incele

Herhangi bir değişiklik yapmadan önce ilgili:

- component
- hook
- store
- service
- route
- Convex function
- config

dosyalarını incele.

Mevcut çalışan sistemi anlamadan yeniden yazma.

---

## Gereksiz değişiklik yapma

Bir feature üzerinde çalışırken ilgisiz dosyaları değiştirme.

Özellikle:

- dependency'leri gereksiz güncelleme
- mimariyi sebepsiz değiştirme
- çalışan componentleri yeniden yazma
- büyük refactor yapma

---

## Küçük ve güvenli değişiklikler

Değişiklikleri mümkün olduğunca küçük ve test edilebilir tut.

Her feature:

```text
implement
→ verify
→ fix
→ continue
```

şeklinde ilerlemeli.

---

# 4. TypeScript

Strict TypeScript kullan.

`any` kullanımından kaçın.

Kullanıcı verileri, exercise sonuçları, API response'ları ve backend verileri için explicit type tanımla.

Tercih:

```ts
type ExerciseResult = {
  ...
}
```

veya uygun yerlerde:

```ts
interface ExerciseResult {
  ...
}
```

---

## Type assertions

Gereksiz:

```ts
value as SomeType;
```

kullanma.

Önce runtime validation gerekiyorsa validation yap.

---

## Nullability

`undefined` ve `null` durumlarını doğru ele al.

"Burada kesin değer var" varsayımıyla unsafe access yapma.

---

# 5. Project Architecture

Feature-based architecture kullan.

Temel yapı:

```text
src/
  app/

  components/
    ui/
    layout/

  features/
    exercises/
      engine/
      rsvp/
      chunking/
      pacer/
      schulte/
      scanning/
      comprehension/

    progress/
    streak/
    leaderboard/
    subscription/
    onboarding/

  stores/
  services/
  hooks/
  lib/
  utils/
  constants/
  types/
  i18n/
  assets/
```

---

# 6. Separation of Concerns

UI, business logic ve data access birbirine karıştırılmamalıdır.

Tercih edilen yapı:

```text
UI
 ↓
Hook / Controller
 ↓
Service / Engine
 ↓
Backend / Storage
```

Örneğin exercise componentinin içinde:

- scoring algoritması
- Convex mutation
- analytics implementation
- adaptive difficulty

gibi logicleri doğrudan yazma.

---

# 7. Exercise Architecture

Exercise sistemi uygulamanın en önemli mimari parçalarından biridir.

Yeni bir exercise eklemek mevcut exercise'leri bozmamalıdır.

Genel yapı:

```text
ExerciseDefinition
        ↓
ExerciseEngine
        ↓
ExerciseSession
        ↓
ExerciseResult
        ↓
Scoring
        ↓
Adaptive Difficulty
        ↓
Progress
```

---

## Exercise Definition

Her exercise mümkün olduğunca aşağıdaki kavramları desteklemelidir:

```text
id
type
category
difficulty
config
start
pause
resume
complete
calculateResult
calculateScore
```

---

## Exercise UI ve engine ayrımı

Yanlış:

```text
ExerciseComponent
  ├── timer
  ├── scoring
  ├── Convex mutation
  ├── analytics
  └── adaptive algorithm
```

Tercih edilen:

```text
Exercise UI
    ↓
Exercise Controller
    ↓
Exercise Engine
    ↓
Result
    ↓
Scoring
    ↓
Persistence
```

---

# 8. Exercise Result

Ortak result yapısı kullanılmalıdır.

Örnek:

```text
exerciseId
exerciseType
startedAt
completedAt
durationMs
difficulty
score
accuracy
completionRate
errorRate
reactionTime
metrics
algorithmVersion
```

Reading exercise'leri gerektiğinde:

```text
wpm
comprehension
```

alanlarını kullanabilir.

---

# 9. Scoring

Scoring merkezi ve versioned olmalıdır.

Her exercise kendi scoring algoritmasına sahip olabilir ancak ortak interface kullanılmalıdır.

Her result:

```text
algorithmVersion
```

taşımalıdır.

Örneğin:

```text
algorithmVersion: 1
```

Scoring değiştiğinde eski sonuçların anlamı bozulmamalıdır.

---

# 10. Adaptive Difficulty

Difficulty kullanıcı performansına göre otomatik değişebilir.

Kullanılabilecek metrikler:

```text
WPM
accuracy
comprehension
reactionTime
errorRate
score
completionRate
consistency
```

Önemli:

Yalnızca hız üzerinden difficulty artırma.

Örneğin:

```text
500 WPM
50% comprehension
```

yüksek başarı olarak kabul edilmemelidir.

Reading exercises için hız ve comprehension birlikte değerlendirilmelidir.

Difficulty değişimleri aşırı agresif olmamalıdır.

---

# 11. Timer Rules

Timer kullanan exercise'lerde:

- timer component'ten bağımsız yönetilmeli
- pause desteklenmeli
- resume desteklenmeli
- cleanup yapılmalı
- unmount sonrası timer çalışmamalı
- memory leak oluşmamalı

Timer'ın her tick'inde React state update yaparak gereksiz render oluşturma.

Özellikle RSVP gibi yüksek frekanslı timing gerektiren exercise'lerde performansa dikkat et.

---

# 12. React Native Performance

Gereksiz renderlardan kaçın.

Özellikle:

- exercise ekranları
- timer
- animations
- charts
- leaderboard
- large lists

performans açısından dikkatle yazılmalıdır.

Gerektiğinde:

```text
useMemo
useCallback
React.memo
```

kullanılabilir.

Ancak bunları her yere gereksiz şekilde ekleme.

---

# 13. Lists

Uzun listelerde mümkün olduğunca:

```text
FlatList
FlashList
```

gibi uygun virtualization çözümlerini kullan.

Tüm büyük dataset'i aynı anda render etme.

---

# 14. Tamagui

UI için Tamagui kullan.

Yeni UI componentlerinde mümkün olduğunca Tamagui primitive'lerini tercih et.

Tema:

```text
light
dark
system
```

desteklemeli.

---

## Hardcoded colors

Mümkün olduğunca:

```tsx
color = "$color";
backgroundColor = "$background";
```

gibi theme/token kullan.

Component içine rastgele hex renkler gömme.

---

# 15. Dark Mode

Tüm ekranlar:

- light
- dark

modda çalışmalıdır.

Yeni component eklerken iki temayı da kontrol et.

Sadece light mode'da düzgün görünen UI kabul edilmez.

---

# 16. Accessibility

Interactive componentlerde:

- yeterli touch target
- accessibilityLabel
- accessibilityRole
- screen reader desteği

gerektiğinde kullanılmalıdır.

Renk tek başına bilgi taşımasın.

---

# 17. Internationalization

Uygulamanın aktif dili şu anda:

```text
tr
```

ancak mimari çoklu dile hazır olmalıdır.

Kullan:

```text
i18next
react-i18next
expo-localization
```

---

## Hardcoded user-facing text yasak

Yanlış:

```tsx
<Text>Egzersizi Başlat</Text>
```

Doğru:

```tsx
<Text>{t("exercise.start")}</Text>
```

---

## Translation structure

Translation dosyalarını domain bazında ayır:

```text
common
navigation
home
auth
exercises
progress
leaderboard
subscription
settings
onboarding
errors
```

---

# 18. Exercise Content Localization

Exercise content ile UI translation birbirinden ayrılmalıdır.

Örneğin:

```text
content/
  tr/
  en/
  de/
```

gibi bir yapı kullanılabilir.

Exercise metinlerini component içine hardcode etme.

---

# 19. Zustand

Global client state için Zustand kullan.

Store'ları domain bazlı ayır.

Örneğin:

```text
useSettingsStore
useUserProgressStore
useExerciseProgressStore
useExerciseSessionStore
```

---

# 20. MMKV

Persist edilmesi gereken local state için:

```text
Zustand persist + MMKV
```

kullan.

Persist edilmeyecek state:

- aktif timer
- animation state
- geçici exercise state
- ephemeral UI state

gibi verilerdir.

---

# 21. Persistence Versioning

Persisted Zustand store'larında version kullan.

State schema değiştiğinde migration yaz.

Eski kullanıcıların local state'i yeni sürümde uygulamayı crash ettirmemeli.

---

# 22. User-scoped Local Data

Bir cihazda farklı kullanıcılar kullanılabilir.

Kullanıcı A'nın local progress'i kullanıcı B'ye gösterilmemeli.

Logout/login sırasında user-scoped state kontrol edilmeli.

---

# 23. Clerk

Authentication için Clerk kullan.

Convex Auth kullanma.

Destek:

```text
email/password
Google
session persistence
logout
```

---

## Authentication security

Client'tan gelen:

```text
userId
```

değerine güvenme.

Backend tarafında authenticated identity üzerinden kullanıcıyı belirle.

---

# 24. Convex

Backend olarak Convex kullan.

Temel domainler:

```text
users
exerciseSessions
exerciseProgress
streaks
leaderboard
subscriptions
```

gerektiğinde genişletilebilir.

---

## Convex security

Kullanıcı yalnızca yetkili olduğu verileri okuyabilmeli/değiştirebilmeli.

Client'ın gönderdiği:

```text
score
XP
streak
leaderboardScore
premium
```

gibi kritik değerlere doğrudan güvenme.

Server-side validation yap.

---

# 25. Backend Validation

Client validation UX içindir.

Server validation güvenlik içindir.

İkisini birbirine karıştırma.

Örneğin client:

```text
WPM = 500
```

gönderebilir.

Backend bunun mümkün olup olmadığını kontrol etmelidir.

---

# 26. Timestamps

Backend timestamp'leri UTC olarak sakla.

Kullanıcıya özel:

- günlük seri
- gün
- haftalık istatistik

hesaplarında user timezone kullan.

---

# 27. RevenueCat

Subscription için RevenueCat kullan.

Google Play hedef platformdur.

Ana entitlement:

```text
premium
```

---

## Subscription security

Client'ta:

```ts
isPremium = true;
```

gibi bir state subscription security değildir.

RevenueCat entitlement source of truth olarak kullanılmalıdır.

Gerektiğinde Convex ile subscription state synchronize edilebilir.

---

# 28. Google Play

Subscription implementasyonunda Google Play Billing gereksinimlerini dikkate al.

Gerçek satın alma testlerinde development build / appropriate testing track kullan.

Expo Go üzerinde native subscription davranışının çalıştığını varsayma.

---

# 29. Sentry

Sentry'yi error/crash monitoring için kullan.

Track edilebilecek kritik durumlar:

```text
crashes
exceptions
exercise engine errors
network failures
critical backend errors
```

Sensitive data'yı Sentry'ye gereksiz yere gönderme.

---

# 30. Amplitude

Analytics için merkezi abstraction kullan.

Componentlerde doğrudan SDK çağrıları yapma.

Tercih:

```ts
analytics.track(...)
```

---

## Event naming

Event isimleri:

```text
snake_case
```

veya projede belirlenen tek bir convention ile tutarlı olmalı.

Örnek:

```text
app_opened
exercise_started
exercise_completed
exercise_abandoned
onboarding_completed
paywall_viewed
subscription_started
streak_achieved
```

---

# 31. Analytics Privacy

Analytics'e gereksiz PII gönderme.

Gönderme:

```text
password
email
tokens
secrets
```

Exercise analytics'te mümkün olduğunca anonim metric kullan.

---

# 32. Streak

Streak server-side hesaplanmalıdır.

Client'ın gönderdiği:

```text
currentStreak = 100
```

değerine güvenme.

Aynı gün birden fazla exercise streak'i birden fazla artırmamalı.

Timezone edge case'lerini dikkate al.

---

# 33. Leaderboard

Leaderboard server-side oluşturulmalıdır.

Client score'u doğrudan belirleyememeli.

Impossible resultleri reddet.

Örneğin:

```text
negative duration
negative score
future timestamp
impossible WPM
```

gibi değerleri validate et.

---

# 34. Offline

Uygulama mümkün olduğunca offline çalışabilmeli.

Özellikle:

```text
exercise
local progress
settings
```

internet olmadan kullanılabilmeli.

Completed sessions gerektiğinde sync queue'ya alınabilir.

---

# 35. Sync

Offline sync için:

```text
Local
 ↓
Pending Queue
 ↓
Convex
 ↓
Success
 ↓
Remove
```

mantığı kullanılabilir.

Her session unique:

```text
clientSessionId
```

taşımalıdır.

Duplicate submissions engellenmelidir.

---

# 36. Error Handling

Her önemli ekran en azından şu durumları düşünmelidir:

```text
loading
success
empty
error
```

Network hatalarında kullanıcıya anlaşılır feedback ver.

Ham backend errorlarını doğrudan UI'a gösterme.

---

# 37. Navigation

Expo Router kullan.

Navigation logic'i componentlere dağınık şekilde yazma.

Authentication ve protected routes merkezi olarak kontrol edilmeli.

---

# 38. Environment Variables

Secret bilgileri repository'ye commit etme.

`.env.example` oluştur ve gerekli değişkenleri dokümante et.

Public Expo variables ile server secrets arasındaki farkı koru.

---

# 39. Dependencies

Yeni dependency eklemeden önce:

1. Gerçekten gerekli mi?
2. Expo ile uyumlu mu?
3. React Native new architecture ile uyumlu mu?
4. Bundle size etkisi nedir?
5. Daha önce kullanılan bir dependency aynı işi yapıyor mu?

kontrol et.

Gereksiz dependency ekleme.

---

# 40. Expo Compatibility

Expo SDK ile uyumlu package version kullan.

Native dependency eklenirse:

- Expo config plugin gerekip gerekmediğini
- development build gerekip gerekmediğini
- Android/iOS native configuration gerekip gerekmediğini

kontrol et.

---

# 41. Bun + Native Packages

Native dependency'lerde Bun'un package installation davranışını kontrol et.

Sadece npm/yarn dokümantasyonundaki komutları körü körüne kullanma.

Expo ve Bun uyumluluğunu koru.

---

# 42. Testing

Kritik business logic test edilmelidir.

Özellikle:

```text
scoring
adaptive difficulty
streak
timer
exercise result
WPM calculation
comprehension
leaderboard ranking
subscription access
storage migration
offline sync
```

---

# 43. Date / Time Testing

Date/time logic testlerinde gerçek sistem saatine bağımlı testlerden kaçın.

Mümkünse injectable clock / mocked time kullan.

Timezone edge case'lerini test et.

---

# 44. Security Rules

Asla client'a güvenme.

Özellikle:

```text
score
XP
streak
premium
leaderboard rank
userId
```

gibi değerler backend tarafından doğrulanmalıdır.

---

# 45. Performance Rules

Özellikle RSVP exercise'inde yüksek frekanslı state update yapma.

Şunlara dikkat et:

```text
unnecessary renders
timers
animations
large lists
charts
navigation
memory
```

---

# 46. UI/UX Principles

Uygulama hızlı ve sade hissettirmeli.

Hızlı okuma egzersizlerinde kullanıcı dikkatini dağıtacak gereksiz UI kullanma.

Exercise sırasında:

- minimum chrome
- clear progress
- clear controls
- readable typography
- predictable interactions

kullan.

---

# 47. Do Not Overengineer

İhtiyaç oluşmadan:

- generic framework
- complex abstraction
- unnecessary repository pattern
- excessive dependency injection
- microservice architecture

oluşturma.

Basit kod tercih edilir.

---

# 48. Do Not Duplicate Logic

Aynı logic birden fazla componentte tekrar ediyorsa uygun bir utility/service/hook oluştur.

Ancak iki benzer kodu sırf benziyor diye erken abstraction'a zorlamayın.

---

# 49. No Magic Numbers

Özellikle:

- WPM
- difficulty
- score
- XP
- subscription limits
- streak rules

gibi değerleri merkezi config/constants altında tut.

Örneğin:

```text
constants/
  exercise.ts
  scoring.ts
  gamification.ts
  subscription.ts
```

---

# 50. Logging

Production'da gereksiz `console.log` bırakma.

Debug logging gerekiyorsa merkezi logger abstraction kullan.

Sensitive information loglama.

---

# 51. Git Hygiene

Commit'ler mantıksal değişikliklere göre küçük tutulmalı.

Örneğin:

```text
feat: add RSVP exercise
fix: correct WPM calculation
feat: add streak calculation
```

gibi.

Generated files veya secret'lar commit edilmemeli.

---

# 52. Agent Workflow

Her görevde şu sırayı takip et:

```text
1. Repository'yi incele
2. İlgili dosyaları belirle
3. Mevcut architecture'ı anla
4. Küçük bir plan oluştur
5. Implement et
6. Typecheck
7. Lint
8. İlgili testleri çalıştır
9. Runtime sorunlarını kontrol et
10. Değişiklikleri özetle
```

---

# 53. Scope Discipline

Kullanıcı belirli bir fazı istediyse yalnızca o fazı uygula.

Örneğin kullanıcı:

```text
FAZ 5 — RSVP
```

istiyorsa:

- RevenueCat yapma
- leaderboard yapma
- streak yapma
- onboarding yapma
- sonraki faza geçme

---

# 54. Existing Code Preservation

Mevcut çalışan feature'ları gereksiz yere yeniden yazma.

Bir bug fix için tüm architecture'ı değiştirme.

Breaking change gerekiyorsa neden gerektiğini belirt.

---

# 55. Before Finishing

Kod yazmayı bitirdikten sonra mutlaka kontrol et:

```bash
bun run lint
bun run typecheck
```

Mevcut test command'leri varsa çalıştır.

Expo dependency problemi varsa:

```bash
bun expo install --check
```

ile kontrol et.

---

# 56. Final Response Format

Her görev sonunda şu formatı kullan:

## Implemented

Yapılan değişiklikleri listele.

## Files Changed

Değişen/oluşturulan dosyaları listele.

## Dependencies

Eklenen veya kaldırılan dependency'leri belirt.

## Verification

Çalıştırılan:

```text
lint
typecheck
tests
Expo checks
```

sonuçlarını belirt.

## Known Issues

Varsa açıkça belirt.

## Next Phase

Sadece önerilen bir sonraki fazı belirt.

Kullanıcı istemediyse bir sonraki fazı implement etme.

---

# 57. Golden Rules

En önemli kurallar:

1. **Bun kullan.**
2. **TypeScript strict kullan.**
3. **Mevcut kodu incelemeden değiştirme.**
4. **UI, business logic ve backend logic'i ayır.**
5. **Exercise Engine'i generic ve extensible tasarla.**
6. **Scoring'i versioned tut.**
7. **Adaptive difficulty'yi merkezi hale getir.**
8. **Client'a güvenme.**
9. **Critical değerleri Convex'te validate et.**
10. **Subscription için RevenueCat entitlement kullan.**
11. **User-facing textleri i18n üzerinden göster.**
12. **Light ve dark mode'u destekle.**
13. **Zustand + MMKV ile local state'i kontrollü persist et.**
14. **Timer ve animation performansına dikkat et.**
15. **PII'yi analytics/error tracking sistemlerine gereksiz gönderme.**
16. **Yeni dependency eklemeden önce gerekliliğini değerlendir.**
17. **Bir faz istendiğinde yalnızca o fazı tamamla.**
18. **Her değişiklikten sonra typecheck/lint/test çalıştır.**
19. **Gereksiz overengineering yapma.**
20. **Çalışan kodu sebepsiz yere yeniden yazma.**

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
