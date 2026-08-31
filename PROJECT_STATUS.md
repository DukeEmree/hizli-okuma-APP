# Project Status

> Living documentation of the current architecture and implementation status. Everything here was verified by reading the code in this working tree; anything that could only be confirmed in an external dashboard is marked **VERIFY**.

Last updated: 2026-08-31, after a full design pass (`/impeccable` audit → harden → polish → distill → colorize → adapt → clarify) and replacing the hosted paywall with a custom one.

The design pass found and fixed one systemic defect worth recording: **the custom `accent` ramp runs the opposite way to Radix.** Tamagui resolves a themed Button's background to step 2, so `accent2` had to be the solid mineral green and the scale climbs toward *lighter* — `accent9`/`accent10` are its palest end, not its solid. Six surfaces had reached for those steps out of Radix habit and were rendering at ~1.6:1 on a light card while glaring in dark: the Track's comprehension fill, both statistics charts, every settings toggle's on-state, an exercise glyph, and an onboarding heading. All moved to the Radix-ordered `green` scale (whose step 9 equals `accent2` exactly); the ramp definition in `src/config/tamagui/themes.ts` now carries a warning so the next edit does not repeat it. The Track's WPM bars had the same class of problem from the other direction — drawn in `$borderColor` at 1.27:1, so the signature component was only ever showing one of its two channels.

Also in that pass: predictive Back enabled (it was opted out with nothing depending on it), `useKeepAwake` added to the runner group and onboarding (timed reading exercises let the screen sleep mid-session), the 48dp floor reached across all four grid exercises via one shared `computeGridLayout` that constrains both axes (grids were sized from width alone and clipped their own bottom rows in a short window), and a Turkish copy pass that unified the `sen`/`siz` split running through onboarding and every exercise's instructions. Eleven exercises had been announcing "Süre doldu!" on successful completion; each already shipped a correct completion string that was never rendered. Ten unused dependencies removed (including the Clerk-era `expo-auth-session`) plus the never-fired Tamagui toast provider.

Before that: 2026-08-30, after deleting two stale RevenueCat webhook integrations (`hizli-okuma-webhook` production, `hizli-okuma-webhook-dev` sandbox) that still pointed at `*.convex.site/revenuecat-webhook` URLs — Convex was fully removed in the 2026-08-12 migration, so every delivery to those URLs had a 100% error rate (flagged by a RevenueCat integration-health email). No code consumed this webhook (confirmed via `docs/superpowers/specs/2026-08-12-remove-clerk-convex-design.md`, which explicitly deferred it as a future enhancement), so deletion was a pure RevenueCat dashboard cleanup with no code change. Before that: doc consolidation pass: `PRODUCTION_AUDIT.md` and `PRODUCTION_CHECKLIST.md` (both pre-migration, Clerk/Convex-era snapshots) were deleted — their still-relevant open items were folded into `## Remaining Work` below and `RELEASE_TODO.md`, and their historical findings are superseded by this file's own `## Audit Findings` section. Before that: 2026-08-21 (third pass, same day), after fixing the actual root cause of a user-reported RevenueCat error 23 (`ConfigurationError`) on a Google Play test install. The real bug: the real Play Store app's (`app0fad1bdb19`) RevenueCat products were created with a guessed `store_identifier` (`premium:monthly` / `premium:yearly`), but Play Console's actual base plan ids are `aylik-abonelik` and `yillik` — since RevenueCat's `store_identifier` format is `productId:basePlanId`, it was pointing at base plans that don't exist, so Google Play returned "not found" (dashboard: "Product not found — check the imported identifiers and the product configuration in the Play console") no matter how correct the service-account permissions or entitlement/offering wiring were. Fixed live via the RevenueCat API: archived the two wrong-id products, created `prodab0b6f0e29` (`premium:aylik-abonelik`) and `prodf4eb88c5d1` (`premium:yillik`) in their place, re-attached both to the `hizli-okuma Pro` entitlement and the `default` offering's Monthly/Yearly packages alongside the existing Test Store products. Verified live afterward: both now return `store_status: ok` with `ACTIVE` base plans and pricing across 174 territories. No code change was needed — this was purely a RevenueCat dashboard/catalog misconfiguration. Still open: the real Play Store app has no Lifetime (one-time) product at all (Test-Store-only), see `RELEASE_TODO.md` § 1b. Earlier that day: the service account's Play Console permissions (previously invalid) were confirmed valid, and before that the RC Android key, `SENTRY_AUTH_TOKEN` and the Amplitude key split were confirmed correctly set on the EAS `production` environment, and a `production`-profile build (version code 3) completed successfully. Before that: 2026-08-20, after a pre-release bug sweep (`BUGS.md`'s two open code items — the daily-plan flow-lock leak and the remaining hardcoded/i18n-broken strings — were fixed). Before that: 2026-08-13, after the pre-production audit pass (see `## Audit Findings` below) which followed the Clerk/Convex removal migration (see `docs/superpowers/plans/2026-08-12-remove-clerk-convex.md` and `docs/superpowers/specs/2026-08-12-remove-clerk-convex-design.md`) and its final-review fix pass. Planned but unbuilt work lives in `FEATURE_BACKLOG.md`.

## Overview

"Hızlı Okuma" is a Turkish speed-reading trainer built with React Native and Expo. It ships 15 exercises across five categories (reading, comprehension, vision, memory, focus), adaptive per-exercise difficulty, streaks, XP/levels and achievements, plus a premium subscription.

The app is fully local-only: there is no authentication and no backend. Every user is effectively a guest, and every exercise works fully offline. All progress, statistics, streaks and gamification are computed on-device and persisted in Zustand + MMKV. `localHistoryStore` keeps the last 6 months of sessions on the device, which is what the dashboard, daily limit and progress charts read for everyone — premium and free alike. Premium status (from RevenueCat) currently only affects the daily exercise limit; it does not change where or how long data is stored.

The competitive leaderboard was removed and does not exist in this tree.

## Current Stack

| Area | Choice |
|---|---|
| Runtime | React Native 0.86.2, React 19.2.3, Expo SDK ~57.0.12 |
| Language | TypeScript ~6.0.3, `strict: true` |
| Navigation | Expo Router ~57.0.12, typed routes + React Compiler enabled |
| UI | Tamagui ^2.7.4 (v5 config), Lucide icons, Victory Native charts |
| State | Zustand ^5.0.14 + react-native-mmkv ^4.3.2 (local-only, no backend) |
| Billing | RevenueCat ^10.7.0 (+ `react-native-purchases-ui`), anonymous/device-based identity |
| Observability | Sentry ~7.11.0, Amplitude ^1.6.8 |
| Device | expo-notifications, expo-audio, expo-localization |
| i18n | i18next + react-i18next, Turkish only |
| Package manager | Bun, exclusively |

There is no Convex backend and no Clerk authentication in this tree — both were removed in the 2026-08-12 migration. `convex/` no longer exists.

No `babel.config.js` or `metro.config.js` exists; SDK 57's defaults are sufficient. This was previously flagged as an open question and is now resolved: `bunx expo export --platform android` completes successfully and produces a 15 MB Hermes bundle.

## Architecture

```text
src/
  app/                     Expo Router routes and layouts
  components/              Shared UI (Screen, LoadingState, StatisticsDashboard, AchievementPopup)
  features/                Domain code — 15 exercises, onboarding, streak, subscription, comprehension
  hooks/                   useCreateSession, useExerciseLimits, useAdaptiveExerciseStart, useMetronome, …
  stores/                  Zustand + MMKV, all local-only (no per-user prefixing — one local user)
  providers/               RevenueCat, Notifications
  services/                Notification scheduling
  lib/                     Sentry and Amplitude initialisation
  utils/                   scoring, streak, adaptiveDifficulty, gamification, reading
  i18n/                    i18next setup + tr locale JSON
```

The one-way data flow for a completed exercise:

```text
Exercise screen → use*Engine → ExerciseEngine.complete()
  → useCreateSession
      ├─ adaptive difficulty computed locally, written to exerciseProgressStore
      ├─ session appended to localHistoryStore (MMKV, 6-month retention)
      ├─ streak recalculated locally (utils/streak.ts), written to streakCacheStore
      └─ gamification processed locally (utils/gamification.ts), written to gamificationStore
```

Everything happens on-device; there is no server round trip and nothing is ever sent off the phone except analytics events (Amplitude) and error reports (Sentry).

## Authentication

None. There is no sign-in, no accounts, and no Clerk dependency anywhere in the tree. Every install is a single local user.

`RootNavigation` (`src/app/_layout.tsx`) routes straight to `(onboarding)` or `(app)/(tabs)` based on the device's local onboarding flag — no auth gate, no remote query to wait on.

## Backend

None. There is no Convex deployment, no `convex/` directory, and no network-backed data store. All the concerns a backend used to own — session validation, streak calculation, XP/level/achievements, statistics aggregation — are pure local functions under `src/utils/` (`streak.ts`, `gamification.ts`, `localStatistics.ts`), called directly from `useCreateSession` and written straight to the relevant Zustand/MMKV store. Anti-cheat bounds-checking that used to run server-side no longer exists — a modified client can inflate its own local numbers, but since there is no cross-user data (no leaderboard, no cloud sync), the blast radius is limited to the user's own device.

## State Management

| Store | Persistence | Purpose |
|---|---|---|
| `settingsStore` | persisted | theme, language, reminders, metronome, daily goal, onboarding flag |
| `localHistoryStore` | persisted | last 6 months of sessions on the device, for every user — the source for the dashboard, daily limit and exercise charts |
| `exerciseProgressStore` | persisted | adaptive difficulty and best-* per exercise |
| `userProgressStore` | persisted | the onboarding assessment's `bestWpm`/`bestComprehension`, read as the home screen's fallback before any session history exists. The unused aggregate counters it used to carry were removed. |
| `streakCacheStore` | persisted | streak + banked freeze count |
| `gamificationStore` | persisted (`xp`/`level`/`unlockedAchievementIds` only, via `partialize`) | XP, level, achievements, plus the in-memory achievement popup queue |
| `useExerciseSettingsStore` | persisted | per-exercise config overrides |
| `dailyPlanStore` | persisted | today's daily-plan selection and completion state |
| `useComprehensionStore` | in-memory only | in-flight comprehension quiz state |

All stores use selector subscriptions. There is only ever one local user, so there is no per-user key prefixing anymore: `userScopedStorageAdapter` (`src/stores/storage.ts`) is kept only as a call-site-compatible alias of the plain device-global MMKV adapter.

## Local Storage

MMKV, single instance (`hizli-okuma`). Holds settings and exercise history only — no tokens, secrets or account data, because there are none.

## UI System

Tamagui v5 with a custom neutral grey palette and a green accent, plus `light`/`dark`/`system` themes driven by `settingsStore`. No hardcoded hex colours anywhere in `src/`. Safe-area edges are applied per screen; Victory Native renders the progress charts.

**Brand hue: green** (`#2DBE73`, taken from the app icon). The splash background, notification colour and Android adaptive-icon background all use it, and every `$blue*` token in the app was moved to its `$green*` equivalent, so the palette is now single-hue.

## Main Features

- **15 exercises** — rsvp, chunking, pacer, schulte, scanning, peripheral, word-recognition, memory, sentence-memory, main-idea, keyword, selective-attention, number-scan, visual-search, comprehension-speed. Each is a `use*Engine` hook over the shared `ExerciseEngine`/`ExerciseTimer`.
- **Adaptive difficulty** — single-step progression per session, computed and enforced entirely on-device (`utils/adaptiveDifficulty.ts`). There is no server to re-validate it.
- **Streaks** — timezone-aware and computed on-device (`utils/streak.ts`), cached in `streakCacheStore` for instant display. A missed day no longer necessarily breaks the streak: one freeze is earned every 7 consecutive days (max 2) and one is spent per missed day, shown as ❄️ next to the streak badge.
- **Gamification** — 10 XP per exercise, 100 XP per achievement, six achievements, level derived from total XP.
- **Statistics** — daily WPM/comprehension/accuracy trends and per-exercise bests over 7d/30d/90d/all, computed from the 6-month on-device history for everyone via `buildLocalStats`.
- **Subscription** — a custom in-app paywall (`src/features/subscription/`), not RevenueCat's hosted UI; `react-native-purchases-ui` remains only for Settings' Customer Center. The free tier is **daily-plan-only**: a free user may run an exercise only as the current step of today's 4-step daily plan (`dailyPlanStore.activeFlowType`), enforced in both `app/(app)/exercises/_layout.tsx` and `app/(app)/exercise/[exerciseId].tsx`. Picking any exercise standalone from the Egzersizler tab is premium. There is no per-day count cap.
- **Notifications** — local daily/streak/inactivity reminders (`expo-notifications`); there is no server-sent push, since there is no server.
- **Weekly summary** — home card (below the "Daily Goal" card) plus a full `/(app)/weekly-summary` screen recapping the past week's minutes, WPM change and streak, from the shared `buildWeeklySummary` calculator, driven off local history for everyone. Delivered via a local recurring `WEEKLY` notification.
- **Legal** — Privacy Policy and Terms of Service, Turkish and English, hosted on Cloudflare Workers (source in `legal/`, see its README). Live at both `hizliokuma.dukeemree.xyz` (primary, linked from the app since 2026-08-20) and `privacy.dukeemree.xyz` (kept live, no longer linked). Linked from Settings via `src/constants/legal.ts`.
- **Onboarding** — a reading test that seeds the daily-goal minutes, `bestWpm`/`bestComprehension` in `userProgressStore`, and the starting difficulty of the reading exercises (RSVP and Chunking, via `startingLevelFromWpm`; Pacer follows RSVP's progression).

## Completed

- Deleted the two RevenueCat webhook integrations (`hizli-okuma-webhook`, `hizli-okuma-webhook-dev`) left over from the removed Convex backend — they pointed at `*.convex.site/revenuecat-webhook` and had a 100% delivery error rate since nothing has served that endpoint since the 2026-08-12 migration; no code referenced them
- Clerk and Convex fully removed: no auth, no backend, no `convex/` directory, no network round trip for app data
- Streak, gamification (XP/level/achievements) and statistics all run locally for every user, from `src/utils/streak.ts`, `src/utils/gamification.ts` and `src/utils/localStatistics.ts` — no premium/free split in where or whether this logic runs
- `useCreateSession` writes directly to `localHistoryStore`, `streakCacheStore` and `gamificationStore`, with an idempotency guard keyed on `exerciseId` + `completedAt` (stable across a retried call, unlike the `clientSessionId`, which is regenerated per attempt)
- RevenueCat kept anonymous/device-based; no more identity linking to an auth provider
- Exercise engine lifecycle: double-completion guard, timer cleanup, auto-pause on backgrounding, abandonment tracking
- Observability: Sentry wired through the real failure paths; Amplitude now actually initialised
- Timezone-correct daily buckets across streaks and statistics
- Local 6-month exercise history (`localHistoryStore`) is the single source of truth for every user, with no separate cloud copy or backfill step
- Streak freezes (earn one per 7-day run, max 2, spent automatically on a missed day)
- Single green brand hue across the splash, notification colour, adaptive icon background and every screen token
- Weekly summary: shared `buildWeeklySummary` calculator, local `WEEKLY` recurring notification, home card and full-screen view
- `gamificationStore` persists `xp`/`level`/`unlockedAchievementIds` via `partialize`; the in-memory `pendingAchievements` popup queue is deliberately excluded so a stale popup can't replay (and re-fire its analytics event) after a killed app relaunches
- Daily-plan flow lock (`dailyPlanStore.activeFlowType`) is now released in `exercises/_layout.tsx` whenever the active step's route segment is left for any reason (exit button, back gesture, any other navigation), not only on a normal completion — closes the free-tier bypass where leaving early let a user keep re-entering that one exercise from the Egzersizler tab until the app restarted
- Every exercise screen's completion/result copy and `StatisticsDashboard` now resolve through real i18n keys (`progress`/`exercises`/`common` namespaces); this also fixed several `t('exercises.x.y', ...)` / `t('common.x', ...)` / `t('progress.x', ...)` calls that, called against the default `common` namespace without a matching key path, always silently fell back to their Turkish default value. `StatisticsDashboard`'s `currentStats` prop is now typed `PerformanceStats` instead of `any`
- Validation: typecheck clean, lint clean, tests passing, i18n check passing
- EAS `production` environment now carries a real RevenueCat Android SDK key (`goog_…`, not the Test Store `test_…` key), its own Amplitude key (the `hizli-okuma-production` project's, split from the shared dev/preview value), and `SENTRY_AUTH_TOKEN` — all verified directly via `eas env:list` on 2026-08-21
- A `production`-profile Android build (version code 3, build `ea81aaa4`) completed successfully on 2026-08-21
- RevenueCat's real Play Store products were pointing at wrong `store_identifier`s (`premium:monthly`/`premium:yearly`, guessed) instead of the real Play Console base plan ids (`aylik-abonelik`/`yillik`), which made Google Play return "not found" and caused the RevenueCat error 23 (`ConfigurationError`) seen on a Google Play test install. Fixed 2026-08-21 via the RevenueCat API: archived the wrong products, created `prodab0b6f0e29` (`premium:aylik-abonelik`) and `prodf4eb88c5d1` (`premium:yillik`), re-attached both to the `hizli-okuma Pro` entitlement and the `default` offering's Monthly/Yearly packages. Verified live against Play Store afterward (`store_status: ok`, base plans `ACTIVE`, priced across 174 territories)

- Custom paywall shipped, replacing `RevenueCatUI.Paywall`. `src/features/subscription/` now owns the offering fetch, package rendering, purchase, restore, cancel and error handling. Composition is "Split Horizon" (chosen through an `/impeccable` surface round, seed `417329c9`): cool paper above carrying the user's own Track and figures, one solid mineral field below carrying the offer and plans. This is the single screen DESIGN.md's Scarcity Rule exempts from the ~10% colour cap, and the lower field is what that exemption is for. Two upper-half variants — the Track for a user with history, the fifteen exercise names for one without. Direction contract is in the file's opening comment; strategy is in `.impeccable/surfaces/src-features-subscription-paywallscreen-tsx.md`
- Paywall copy no longer claims three things the product gives away free. "Sınırsız egzersiz ve detaylı analizler" plus "zayıf yönüne özel plan" were all already available to free users (there is no per-day cap, statistics are local for everyone, and `pickWeakest` has no premium check). Both surfaces now describe the one real benefit: any of the fifteen exercises, outside today's plan
- Price claims isolated in `src/features/subscription/pricing.ts` with 13 tests. `annualSavingPercent` returns `null` rather than a number on every branch it cannot prove — different currencies, missing or zero price, no saving, self-comparison — so "%0 tasarruf" cannot reach the screen. No price is ever hardcoded; everything comes from `product.priceString`
- 14-day free trial wired end to end (Play Console offer on the `aylik-abonelik` base plan, activated 2026-08-31). `trialOffer()` reads it from `defaultOption.freePhase`, which on Android **is** the eligibility answer: Google omits that phase once a user has spent their trial, so the screen cannot promise a trial the purchase would refuse. A discounted intro phase is deliberately not treated as a trial. The plan badge only renders while it discriminates between plans; when every plan carries the same trial the CTA alone says it
- Interstitial paywalls wait `INTERSTITIAL_DELAY_MS` behind the celebration instead of covering it on mount. `markShown` moved inside the timeout callback, so leaving early cancels the prompt *and* leaves the four-day silence window unspent — previously it was spent before the paywall had even opened

## In Progress

Nothing is mid-implementation in the code. The open work is release configuration (see `RELEASE_TODO.md`) and the non-blocking polish items below.

## Known Issues

| Issue | Severity | Notes |
|---|---|---|
| The real Play Store app has no Lifetime product in RevenueCat | LOW | `app0fad1bdb19` has real Monthly/Yearly products now (fixed 2026-08-21, see `## Completed`), but the one-time Lifetime product is still Test-Store-only (`appcc3a1f3a7e`) — the custom paywall renders whatever the offering returns, so a Lifetime package would appear automatically once one exists on the real app. See `RELEASE_TODO.md` § 1b |
| No server-side anti-cheat | LOW | A modified client can inflate its own local numbers; no cross-user data exists (no leaderboard, no cloud sync) so the blast radius is limited to the user's own device |
| Legal site's static-asset deploy hasn't happened yet | MEDIUM | Confirmed via the Cloudflare Workers API on 2026-08-21: the `hizli-okuma-legal` Worker was last modified 2026-08-13, the same day its content was pushed as an embedded script (before `legal/` existed in this repo). No `wrangler deploy` has run since, so editing `legal/public/` still does not change the live site — see `RELEASE_TODO.md` |
| Paket Bağımlılığı Güvenlik Açıkları (`bun audit`) | HIGH/MODERATE | `image-size` (Yüksek risk - DoS açık) ve `uuid` (Orta risk - buffer bounds check) paketlerinde açıklar raporlandı. Bu bağımlılıklar `expo`, `react-native`, `expo-splash-screen` vb. altında geliyor. `bun update` komutuyla uygun zamanda güncellenmesi önerilir. |

## Audit Findings

Fixed in the 2026-08-13 pre-production audit pass:

| Area | Problem | Fix |
|---|---|---|
| Build config | `app.json` listed the Sentry plugin twice — bare `"@sentry/react-native"` alongside `["@sentry/react-native/expo", {organization, project}]`. The bare entry has no org/project, which is the source of the `Missing config for organization, project` warning in `eas-build.log` | Removed the bare entry; only the Expo-specific plugin remains |
| Sentry | No `environment`, so development, preview and production events all landed in one bucket | `environment` now comes from `EXPO_PUBLIC_APP_VARIANT` (set per profile in `eas.json`); `sendDefaultPii: false` made explicit |
| Amplitude | The PII scrubber matched property keys by *substring*, so any future property containing `name` (e.g. `exerciseName`) would be silently dropped | Exact-key blocklist; `undefined` values are dropped instead of being sent as empty properties |
| Amplitude | `exercise_started` sent `difficulty: config.difficulty`, a field `ExerciseConfig` does not have — the property was always `undefined` | Reads `config.initialDifficulty` |
| Amplitude | The `EventName` union declared `sync_started`/`sync_completed`/`sync_failed`/`streak_achieved`/`subscription_cancelled`, none of which are emitted (the sync ones describe a backend that no longer exists), plus an unused `identify()` | Removed; the union now matches the nine events actually tracked |
| RevenueCat | A missing platform key fell back to the literal `'api_key_android_here'`, which `Purchases.configure()` accepts and every later call then rejects — leaving `isConfigured` stuck at `false` and the paywall/exercise gates spinning forever (iOS builds hit this today: `.env.production` sets no `EXPO_PUBLIC_RC_IOS_KEY`) | Keys default to `''`; an empty key skips `configure()`, reports to Sentry via the new `captureMessage`, and starts settled so the app fails open to the free tier |
| Notifications | The `reminders`/`progress` channels were created but **no** scheduled notification referenced them, so everything landed in Android's default channel; and `scheduleWeeklySummaryNotification()` ran in an effect ordered *before* channel setup | Every trigger now carries a `channelId`, and channel creation is a memoised promise awaited inside all three scheduling helpers |
| Notifications | `getLastNotificationResponseAsync()` was never cleared, so the OS replays the last tapped notification on every subsequent cold start — dropping the user on the weekly-summary screen days later | Response is cleared with `clearLastNotificationResponse()` once handled |
| Notifications | The deep-link target was pushed straight into the router as `screen as any` behind a `@ts-ignore` | Payload is matched against an explicit `DEEP_LINK_ROUTES` allowlist; no cast, no ignore |
| Exercise detail | The four config sliders used `defaultValue`, which is read once on mount. Adaptive difficulty is applied in an effect *after* mount, so the thumb kept showing the previous run's value while the number next to it showed the new one | Sliders are controlled via `value` |
| Dead code | `SUBSCRIPTION_CONSTANTS.FREE_TIER` / `PREMIUM_TIER` listed a tier split that no code reads | Deleted |
| Premium gate | `isConfigured` only means "we stopped waiting" - it is also set after the entitlement retry *fails*. `exercises/_layout.tsx` revoked access on `!isPremium` regardless, so a subscriber whose cold start errored twice was thrown out of an exercise they paid for | Added `isEntitlementKnown` (a real `CustomerInfo` was received) to the RevenueCat context; the two gates that revoke access now require it, while upsell surfaces still read `isPremium` directly |
| Crash handling | No React error boundary, and `Sentry.wrap()` was deliberately not applied - a render-time throw left a blank app and reached Sentry without component-tree context or touch breadcrumbs | Added `AppErrorBoundary` (RN primitives only, so it can't fail for the same reason the tree did) as the root layout's `ErrorBoundary` export, and wrapped the root layout with `Sentry.wrap` |
| Data loss | Every engine ended `createSession(...).catch(console.error)`, so a failed write - the session, streak and XP - vanished silently in release builds | `useCreateSession` reports to Sentry itself, so no future engine can forget to |
| Resource cleanup | Round-advance `setTimeout`s in nine `use*Engine` hooks kept running after unmount | New `useManagedTimeout` hook cancels anything still pending on unmount; all nine call sites use it |
| Daily goal | `isDailyGoalCompleted` was `todaysSessionCount === 4`, so four *arbitrary* exercises earned the plan bonus and three plan steps plus a repeat earned it too | `utils/dailyGoal.ts` counts distinct completed plan step types and fires only on the transition, with tests for each wrong case |
| Achievements | `first_exercise` / `exercise_10` used `sessionCount === 1 / === 10`, so crossing the threshold while retention pruning was active skipped the number permanently | Thresholds are `>=`; `award()` already prevented double-granting |
| Onboarding | The assessment measured WPM and then threw it away for difficulty purposes - every user started at level 1 (150 WPM) | `startingLevelFromWpm` inverts the reading exercises' level→WPM mapping and seeds RSVP and Chunking |
| Dead code | `useStatisticsStore` was never populated by anything, so the exercises-tab "En İyi" badge could not render | Store deleted; the tab computes `buildLocalStats(..., 'all')` from local history like the statistics tab does, and the badge works |
| Dead code | `userProgressStore` carried five counters (training seconds, completed exercises, cached streaks, last sync) with no writers | Trimmed to the two onboarding fields that are actually used |
| Analytics | The daily plan - the app's main retention loop - emitted no events at all | Added `daily_plan_started` (first step of the day only), `daily_plan_completed`, and `subscription_restored` |
| i18n | Home, onboarding, settings alerts, exercise detail and every exercise screen's accessibility labels were hardcoded Turkish | Moved into `home`, `onboarding`, `settings`, `exercises` and `common` namespaces |
| Dead UI | The home screen rendered `'Misafir'.split(' ')[0]` as a display name, and computed `todayTrainingMs`/`dailyGoalMinutes` that nothing rendered | Removed; the greeting is a plain translated string |

Checked and **not** changed, because the premise did not survive verification:

| Suspected problem | What the code actually does |
|---|---|
| "~284 KB of exercise content is evaluated at startup" | Expo Router calls `loadRoute()` lazily. The eager `validateRouteTreeExports` pass that would have pulled every route module in is guarded by `process.env.NODE_ENV !== 'development'`, so in a release build a route's module - and the content it imports - is only evaluated when the user first navigates to it. No startup cost, no refactor needed |
| "Only RSVP has accessibility labels on its icon-only buttons" | All fifteen exercise screens already had `accessibilityLabel` and `accessibilityRole` on both the exit and play/pause buttons. They were hardcoded Turkish, which is what got fixed |

## Production Readiness

**Code: ready.** `bun run typecheck`, `bun run lint` (0 warnings), `bun test` (158 tests / 25 files) and `bun run i18n:check` all succeed against this tree. The 2026-08-13 audit pass closed the observability, crash-reporting, notification-delivery, premium-gate and RevenueCat-misconfiguration defects listed under `## Audit Findings`; what remains open is either release configuration or non-blocking polish.

**Release configuration: RevenueCat↔Google Play is now fixed.** The EAS-side secrets (RevenueCat key, Sentry auth token, Amplitude key split) are set correctly, the service account has valid Play Console permissions, and the real Play Store app's Monthly/Yearly products are correctly wired end to end (verified live against Play Store, see `## Completed`). What's left: the real-store Lifetime product (LOW, only matters if it's offered in the paywall), the Play Console store-listing forms, the legal site's first `wrangler deploy`, and the device smoke test — including confirming a real sandbox purchase now succeeds. Written out step by step in **`RELEASE_TODO.md`**.

One thing worth knowing before touching any of it: EAS builds do **not** read
the gitignored `.env.production`. `eas-build.log` shows `NODE_ENV` unset and
"Proceeding without mode-specific .env", so the EAS-hosted environment values
are the only ones that ship. `.env.production` is a local-build convenience
only, and its RevenueCat key is a Test Store key.

## Remaining Work

- Run the legal site's first `wrangler deploy` so `legal/public/` becomes the live source — see `RELEASE_TODO.md` § 3
- Create the real Play Store Lifetime product and attach it to the `hizli-okuma Pro` entitlement (Monthly/Yearly are already live, see `## Known Issues`)
- Accessibility: the source-level work is done (contrast recomputed against real token values in both themes, 48dp targets across every grid exercise, labels and live regions on the Track, achievement popup, category chips and plan cards). What is still owed is **on-device verification** — nothing in this repo has been run on hardware or an emulator: light/dark capture, `font_scale 1.3`, and a TalkBack pass over the runner screens
- Reduce Motion is not honoured anywhere (`useReducedMotion` / `AccessibilityInfo` appear nowhere in `src/`). The achievement popup slides 160px and the Track animates in live mode. Blocks the confetti work in `FEATURE_BACKLOG.md` § 5
- Add a `test` script to `package.json` (`bun test` works without one, but `AGENTS.md` documents it)
- Decide on Android auto-backup: `allowBackup` defaults to true with no `dataExtractionRules` file, so MMKV progress data may be included in device backups — low risk with no auth/token data in scope, but still an open product decision

## Handover

Everything left that cannot be done from the code — the RevenueCat↔Play Console
permissions fix, creating and attaching the real products, the Play Console
store-listing forms, the legal site's first `wrangler deploy` and the device
smoke test on the existing production build — is in **`RELEASE_TODO.md`**, in
order, with the exact commands and where each value comes from.

Already done: the stale `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` and
`EXPO_PUBLIC_CONVEX_URL` variables were deleted from all three EAS
environments (2026-08-13 pass); `SENTRY_ORG`/`SENTRY_PROJECT` were attached to
`production` (2026-08-13); and as of 2026-08-21, `production` also carries the
real RevenueCat key, its own Amplitude key and `SENTRY_AUTH_TOKEN` — all
confirmed live via `eas env:list`, not just recorded as "should be done".

## Recommended Next Steps

1. Work through `RELEASE_TODO.md` top to bottom — it's the current, verified list of what's left before shipping.
2. Produce a production build and smoke-test the full path on a physical device: onboarding → exercise → completion → statistics → paywall → sandbox purchase → settings (full checklist in `RELEASE_TODO.md` § 5).
3. Confirm Sentry and Amplitude traffic actually arrives from that build.
4. Planned features live in `FEATURE_BACKLOG.md` — daily plan, interstitial paywall, RevenueCat custom paywall, and the achievement overhaul with confetti (weekly summary already shipped, see `## Completed` above).
