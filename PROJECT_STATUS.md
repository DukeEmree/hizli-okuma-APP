# Project Status

> Living documentation of the current architecture and implementation status. Everything here was verified by reading the code in this working tree; anything that could only be confirmed in an external dashboard is marked **VERIFY**.

Last updated: 2026-08-13, after the pre-production audit pass (see `## Audit Findings` below) which followed the Clerk/Convex removal migration (see `docs/superpowers/plans/2026-08-12-remove-clerk-convex.md` and `docs/superpowers/specs/2026-08-12-remove-clerk-convex-design.md`) and its final-review fix pass. Planned but unbuilt work lives in `FEATURE_BACKLOG.md`.

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
- **Subscription** — RevenueCat hosted paywall and Customer Center. The free tier is **daily-plan-only**: a free user may run an exercise only as the current step of today's 4-step daily plan (`dailyPlanStore.activeFlowType`), enforced in both `app/(app)/exercises/_layout.tsx` and `app/(app)/exercise/[exerciseId].tsx`. Picking any exercise standalone from the Egzersizler tab is premium. There is no per-day count cap.
- **Notifications** — local daily/streak/inactivity reminders (`expo-notifications`); there is no server-sent push, since there is no server.
- **Weekly summary** — home card (below the "Daily Goal" card) plus a full `/(app)/weekly-summary` screen recapping the past week's minutes, WPM change and streak, from the shared `buildWeeklySummary` calculator, driven off local history for everyone. Delivered via a local recurring `WEEKLY` notification.
- **Legal** — Privacy Policy and Terms of Service, Turkish and English, hosted on Cloudflare Workers at `privacy.dukeemree.xyz` (source in `legal/`, see its README). Linked from Settings via `src/constants/legal.ts`.
- **Onboarding** — a reading test that seeds the daily-goal minutes, `bestWpm`/`bestComprehension` in `userProgressStore`, and the starting difficulty of the reading exercises (RSVP and Chunking, via `startingLevelFromWpm`; Pacer follows RSVP's progression).

## Completed

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
- Validation: typecheck clean, lint clean, tests passing, i18n check passing

## In Progress

Nothing is mid-implementation in the code. The open work is release configuration (see `PRODUCTION_CHECKLIST.md`, itself now superseded in its Clerk/Convex sections — see the note at its top) and the deferred design decisions below.

## Known Issues

| Issue | Severity | Notes |
|---|---|---|
| `.env.production` still holds a RevenueCat **Test Store** key (`test_…`) | HIGH | Any locally-produced release build would ship simulated purchases and earn nothing. EAS cloud builds are unaffected because they read the EAS-hosted `production` environment, not this gitignored file — but the value on EAS has not been verified from this tree |
| The EAS `production` environment uses the **development** Amplitude key | HIGH | `EXPO_PUBLIC_AMPLITUDE_API_KEY` is one shared variable attached to development, preview *and* production, set to `57f66…` — the `hizli-okuma-development` project's key. Production traffic would land in the dev project. `.env.production` names `5b42…` (the `hizli-okuma-production` project, id 851786) as the intended value. Splitting the variable was blocked by a permission classifier in this session; the commands are in the handover |
| `SENTRY_AUTH_TOKEN` is missing from the EAS `production` environment | HIGH | It exists only in `preview`, and being a secret it cannot be copied across without re-entering the value. Without it a production build cannot upload source maps, so every production crash report is an unsymbolicated minified stack. `SENTRY_ORG` and `SENTRY_PROJECT` were attached to production in this session |
| Statistics dashboard and a few completion screens still use hardcoded Turkish strings | LOW | Home, onboarding, settings, exercise detail and the exercise-screen accessibility labels were moved to i18n in this pass; `StatisticsDashboard.tsx` and some per-exercise result copy were not. Invisible while Turkish is the only locale. `settingsStore.LanguageType` declares `en`/`de`, but only `tr` resources exist and only `tr` is offered in the language sheet |
| `StatisticsDashboard` props are typed `any` | LOW | `currentStats: any` plus six `(d: any)` map callbacks; `PerformanceStats` from `utils/localStatistics.ts` is the type it should use |
| Leaving an exercise with the X button does not clear `dailyPlanStore.activeFlowType` | LOW | A free user can re-enter and repeat that one exercise until the app restarts. Clearing it on exit would break the legitimate "back out, then restart the step" flow, so it needs a real decision rather than a quick guard |
| No server-side anti-cheat | LOW | A modified client can inflate its own local numbers; no cross-user data exists (no leaderboard, no cloud sync) so the blast radius is limited to the user's own device |

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

**Release configuration: not ready.** Three of the blockers are values only the
account holder can supply — the RevenueCat production key (the `production`
environment still carries a Test Store `test_…` key), the Sentry auth token
(missing from `production`, so source maps cannot upload) and the Amplitude
key split (production currently reports into the development project). Those,
plus the keystore check, the Play Console forms and the device smoke test, are
written out step by step in **`RELEASE_TODO.md`**.

One thing worth knowing before touching any of it: EAS builds do **not** read
the gitignored `.env.production`. `eas-build.log` shows `NODE_ENV` unset and
"Proceeding without mode-specific .env", so the EAS-hosted environment values
are the only ones that ship. `.env.production` is a local-build convenience
only, and its RevenueCat key is a Test Store key.

## Remaining Work

- Run `npx expo prebuild --clean` and confirm the merged manifest has `POST_NOTIFICATIONS` and no `RECORD_AUDIO`
- Move the last hardcoded Turkish strings (`StatisticsDashboard`, per-exercise result copy) into i18n, and type `StatisticsDashboard`'s props with `PerformanceStats` instead of `any`
- Accessibility pass: touch-target sizes and large-font layout (icon-only buttons already carry labels)
- Clear `dailyPlanStore.activeFlowType` on exercise exit, once the "back out then restart the step" flow has a decided behaviour

## Handover

Everything left that cannot be done from the code — the RevenueCat production
key, the Sentry auth token, the Amplitude key split, the keystore check, the
Play Console forms, the legal site's first `wrangler deploy` and the device
smoke test — is in **`RELEASE_TODO.md`**, in order, with the exact commands
and where each value comes from.

Already done on EAS in the 2026-08-13 pass: the stale
`EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` and `EXPO_PUBLIC_CONVEX_URL` variables
were deleted from all three environments, and `SENTRY_ORG` / `SENTRY_PROJECT`
were attached to `production`.

## Recommended Next Steps

1. Work through `PRODUCTION_CHECKLIST.md` top to bottom — treat its Clerk/Convex-era items as superseded (see the note at its top) and focus on the RevenueCat, signing and store-listing items that still apply.
2. Produce a production build and smoke-test the full path on a physical device: onboarding → exercise → completion → statistics → paywall → sandbox purchase → settings.
3. Confirm Sentry and Amplitude traffic actually arrives from that build.
4. Planned features live in `FEATURE_BACKLOG.md` — daily plan, interstitial paywall, RevenueCat custom paywall, and the achievement overhaul with confetti (weekly summary already shipped, see `## Completed` above).
