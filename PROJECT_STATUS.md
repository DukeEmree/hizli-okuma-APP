# Project Status

> Living documentation of the current architecture and implementation status. Everything here was verified by reading the code in this working tree; anything that could only be confirmed in an external dashboard is marked **VERIFY**.

Last updated: 2026-08-11, after the second production audit pass (`PRODUCTION_AUDIT.md`) and the local-history / streak-freeze / green-theme work that followed it. Planned but unbuilt work lives in `FEATURE_BACKLOG.md`.

## Overview

"Hızlı Okuma" is a Turkish speed-reading trainer built with React Native and Expo. It ships 15 exercises across five categories (reading, comprehension, vision, memory, focus), adaptive per-exercise difficulty, streaks, XP/levels and achievements, plus a premium subscription.

The app is guest-first: every exercise works fully offline with no account. The data model follows the subscription: **premium users are backed up in Convex with no retention limit; everyone else keeps the last 6 months on the device** (`localHistoryStore`), which is what their dashboard, daily limit and progress charts read. Upgrading is not a fresh start — `SyncProvider` backfills the unsynced part of that local window to Convex the moment a user becomes premium.

The competitive leaderboard was removed and does not exist in this tree.

## Current Stack

| Area | Choice |
|---|---|
| Runtime | React Native 0.86.2, React 19.2.3, Expo SDK ~57.0.11 |
| Language | TypeScript ~6.0.3, `strict: true` |
| Navigation | Expo Router ~57.0.11, typed routes + React Compiler enabled |
| UI | Tamagui ^2.7.4 (v5 config), Lucide icons, Victory Native charts |
| State | Zustand ^5.0.14 + react-native-mmkv ^4.3.2 |
| Backend | Convex ^1.43.0 |
| Auth | Clerk (@clerk/clerk-expo ^2.19.31) |
| Billing | RevenueCat ^10.7.0 (+ `react-native-purchases-ui`) |
| Observability | Sentry ~7.11.0, Amplitude ^1.6.8 |
| Device | expo-notifications, expo-audio, expo-secure-store, expo-localization |
| i18n | i18next + react-i18next, Turkish only |
| Package manager | Bun, exclusively |

No `babel.config.js` or `metro.config.js` exists; SDK 57's defaults are sufficient. This was previously flagged as an open question and is now resolved: `bunx expo export --platform android` completes successfully and produces a 15 MB Hermes bundle.

## Architecture

```text
convex/                    Backend: schema + 15 function modules + RevenueCat webhook
src/
  app/                     Expo Router routes and layouts
  components/              Shared UI (Screen, LoadingState, StatisticsDashboard, AchievementPopup)
  features/                Domain code — 15 exercises, onboarding, streak, subscription, comprehension
  hooks/                   useCreateSession, useExerciseLimits, useAdaptiveExerciseStart, useMetronome, …
  stores/                  Zustand + MMKV, split device-global vs per-user-prefixed
  providers/               RevenueCat, Notifications, Sync
  services/                Notification scheduling
  lib/                     Sentry and Amplitude initialisation
  utils/                   scoring, streak, adaptiveDifficulty, migration, reading
  i18n/                    i18next setup + tr locale JSON
```

The one-way data flow for a completed exercise:

```text
Exercise screen → use*Engine → ExerciseEngine.complete()
  → useCreateSession
      ├─ adaptive difficulty computed locally, written to exerciseProgressStore
      ├─ (premium) exerciseProgress.updateProgress mutation
      └─ session appended to syncStore (MMKV)
  → SyncProvider (premium only) flushes the queue
      → convex exerciseSessions.createSession
          ├─ server-side validation / anti-cheat
          ├─ dedup by (userId, clientSessionId)
          ├─ streak recalculation (user timezone)
          ├─ userStatistics / exerciseStatistics / dailyStatistics aggregation
          └─ processGamification → XP, level, achievements
```

## Authentication

Clerk, with email/password and Google SSO. Tokens live in `expo-secure-store` behind a soft-failing token cache. Auth state is read from Clerk's hooks everywhere and never mirrored into Zustand.

`RootNavigation` (`src/app/_layout.tsx`) is the single routing gate: it waits for `isLoaded` and for the Convex `getMe` query, then routes to `(onboarding)` or `(app)/(tabs)`. A signed-in user counts as onboarded if either the Convex row or the device's local flag says so, which removes the onboarding flash that used to occur in the window between sign-in and the `users.store` mutation creating the row.

`AuthSync` runs guest→user data migration, calls `users.store`, sets the MMKV user prefix, and binds the user id to Amplitude and Sentry.

**VERIFY:** all EAS environments currently reference a `pk_test_...` Clerk key. A production instance and production key are still required.

## Backend

Convex, 15 modules. Every public function resolves the caller from `ctx.auth.getUserIdentity()` and scopes access to that user's own rows; no function accepts a user id as an authorization argument.

Tables: `users`, `pushTokens`, `processedRevenueCatEvents`, `userAchievements`, `exerciseSessions`, `exerciseProgress`, `streaks`, `userStatistics`, `exerciseStatistics`, `dailyStatistics`.

Internal-only functions: `migrations`, `subscriptions.syncPremiumState`, `revenuecatEvents`, `expoPush`, and the internal half of `pushTokens`. Clients cannot reach any of them.

Notable properties:

- XP, level, streak and achievements are computed entirely server-side. The client only reports session results, which are bounds-checked.
- `createSession` is idempotent per `(userId, clientSessionId)` and returns the original run's unlocked achievements on a retry, so a redelivered session neither double-awards XP nor drops the achievement popup.
- The RevenueCat webhook verifies its secret in constant time and dedupes by event id inside one transaction; a push-delivery failure can never fail the webhook response.
- Daily statistics and the dashboard's "today" window bucket by the user's timezone, matching the streak calculation. `by_userId_and_completedAt` was added so the dashboard reads a bounded index range instead of scanning full history.

## State Management

| Store | Scope | Purpose |
|---|---|---|
| `settingsStore` | device-global | theme, language, reminders, metronome, daily goal, onboarding flag |
| `syncStore` | per-user | upload queue only; filled solely for signed-in premium users and emptied as sessions reach Convex |
| `localHistoryStore` | per-user | last 6 months of sessions on the device, for every user — the source for the dashboard, daily limit and exercise charts |
| `exerciseProgressStore` | per-user | adaptive difficulty and best-* per exercise |
| `userProgressStore` | per-user | legacy aggregate counters — **currently has no writers** |
| `streakCacheStore` | per-user | streak + banked freeze count, cached for instant UI |
| `gamificationStore` | in-memory only | achievement popup queue — not persisted, so a pending popup is lost on app close |
| `useExerciseSettingsStore` | per-user | per-exercise config overrides |
| `useStatisticsStore` | per-user | cached Convex statistics per time range |
| `useComprehensionStore` | per-user | in-flight comprehension quiz state |

All stores use selector subscriptions. Per-user stores go through `userScopedStorageAdapter`, which prefixes every MMKV key with the active user id, so two accounts on one device are physically separated.

## Local Storage

MMKV, single instance (`hizli-okuma`). Holds settings and exercise history only — no tokens or secrets. Clerk sessions live in `expo-secure-store`.

Guest→user migration (`utils/migration.ts`) dedupes the sync queue by `clientSessionId`, merges best-* values with `max()`, and clears the guest key before the one additive merge so an interrupted run can lose that run's unmigrated seconds but never double-count them.

## UI System

Tamagui v5 with a custom neutral grey palette and a green accent, plus `light`/`dark`/`system` themes driven by `settingsStore`. No hardcoded hex colours anywhere in `src/`. Safe-area edges are applied per screen; Victory Native renders the progress charts.

**Brand hue: green** (`#2DBE73`, taken from the app icon). The splash background, notification colour and Android adaptive-icon background all use it, and every `$blue*` token in the app was moved to its `$green*` equivalent, so the palette is now single-hue.

## Main Features

- **15 exercises** — rsvp, chunking, pacer, schulte, scanning, peripheral, word-recognition, memory, sentence-memory, main-idea, keyword, selective-attention, number-scan, visual-search, comprehension-speed. Each is a `use*Engine` hook over the shared `ExerciseEngine`/`ExerciseTimer`.
- **Adaptive difficulty** — single-step progression per session, enforced client-side and re-validated server-side.
- **Streaks** — timezone-aware, server-authoritative, with a local cache for instant display. A missed day no longer necessarily breaks the streak: one freeze is earned every 7 consecutive days (max 2) and one is spent per missed day, shown as ❄️ next to the streak badge.
- **Gamification** — 10 XP per exercise, 100 XP per achievement, six achievements, level derived from total XP.
- **Statistics** — daily WPM/comprehension/accuracy trends and per-exercise bests over 7d/30d/90d/all, from Convex for premium users and from the 6-month on-device history for everyone else (`buildLocalStats` returns the same shape, so the dashboard is identical).
- **Subscription** — RevenueCat hosted paywall and Customer Center; free tier capped at 6 exercises per day.
- **Notifications** — local daily/streak/inactivity reminders plus server-sent push on subscription events.
- **Weekly summary** — home card (below the "Daily Goal" card) plus a full `/(app)/weekly-summary` screen recapping the past week's minutes, WPM change and streak, from the shared `buildWeeklySummary` calculator. Premium users get it as a server push (hourly cron, sent at each user's own Sunday-20:00); free/guest users get an equivalent local recurring notification instead.
- **Onboarding** — a reading test that seeds initial WPM, comprehension and starting difficulty.

## Completed

- Convex authorization model, server-side validation and anti-cheat
- Idempotent session sync with exponential backoff, plus four independent flush triggers
- Guest-first architecture with per-user storage isolation and guest→user migration
- RevenueCat identity handling, race-guarded against rapid account switches
- Push token lifecycle (register, reassign on account switch, release on logout, prune on `DeviceNotRegistered`)
- Exercise engine lifecycle: double-completion guard, timer cleanup, auto-pause on backgrounding, abandonment tracking
- Account deletion and statistics reset, including the premium-subscription block and partial-failure handling
- Observability: Sentry wired through the real failure paths; Amplitude now actually initialised
- Timezone-correct daily buckets across streaks, statistics and the daily-goal ring
- Local 6-month exercise history separated from the upload queue, with backfill to Convex on upgrade
- Streak freezes (earn one per 7-day run, max 2, spent automatically on a missed day)
- Single green brand hue across the splash, notification colour, adaptive icon background and every screen token
- Weekly summary: shared `buildWeeklySummary` calculator, premium server push via hourly cron (`convex/crons.ts` + `convex/weeklySummary.ts`), local `WEEKLY` recurring notification for free/guest users, home card and full-screen view
- Validation: typecheck clean, lint clean, 150 tests passing, i18n check passing, production bundle export succeeds

## In Progress

Nothing is mid-implementation in the code. The open work is release configuration (see `PRODUCTION_CHECKLIST.md`) and the deferred design decisions below.

## Known Issues

| Issue | Severity | Notes |
|---|---|---|
| `resetMyStatistics` / `deleteMyAccount` collect every row in one transaction | MEDIUM | Latent Convex transaction-limit risk for a very heavy account; not reachable at current volumes |
| `persist.rehydrate()` not awaited on account switch | LOW | Brief flash of the previous user's in-memory state; storage isolation is unaffected |
| Dead code: `userProgressStore` best-* fields, `SUBSCRIPTION_CONSTANTS` tier lists, the exercises-tab "En İyi" badge | LOW | Removal means deleting fields/files — awaiting sign-off |
| Round-advance `setTimeout`s not cleared on unmount | LOW | 500 ms window, React 19 no longer warns, but it does not match the cleanup rule in AGENTS.md |
| Home and statistics screens use hardcoded Turkish strings | LOW | Invisible while Turkish is the only locale; blocking for a second language |
| Gamification (XP, levels, achievements) only runs for premium users | MEDIUM | `processGamification` runs inside `createSession`, which returns early for non-premium; free and guest users earn nothing. See the note at the top of `FEATURE_BACKLOG.md` |
| `gamificationStore` is not persisted | LOW | A pending achievement popup is lost if the app closes before it is shown |

## Production Readiness

**Code: ready.** No open CRITICAL or HIGH findings. `bun run typecheck`, `bun run lint` (0 warnings), `bun test` (150 pass) and `bunx expo export` all succeed against this tree.

**Release configuration: not ready.** Every remaining blocker is external:

1. Production Clerk instance and key (all environments currently use a test key)
2. Production RevenueCat key, products, entitlement linkage and webhook (all environments currently use a test key)
3. Android release keystore verified via `eas credentials`
4. `CLERK_FRONTEND_API_URL` and `REVENUECAT_WEBHOOK_AUTH_HEADER` set on the production Convex deployment
5. Privacy Policy and Terms hosted, linked in the Play listing and in Settings
6. Play Console Data Safety form completed

## Remaining Work

- Deploy the schema change (the new `by_userId_and_completedAt` index) with `npx convex deploy`
- Run `npx expo prebuild --clean` and confirm the merged manifest has `POST_NOTIFICATIONS` and no `RECORD_AUDIO`
- Add `environment`/`release` tags to `Sentry.init()`
- Accessibility pass: labels on icon-only buttons, touch-target sizes, large-font layout
- Manual device pass: background mid-exercise, double-tap completion, airplane-mode sync, account switch, account deletion

## Recommended Next Steps

1. Work through `PRODUCTION_CHECKLIST.md` top to bottom — the external configuration is the only thing between this tree and a release build.
2. Produce a production build and smoke-test the full path on a physical device: onboarding → exercise → completion → statistics → paywall → sandbox purchase → settings.
3. Confirm Sentry, Amplitude and Convex traffic actually arrives from that build. Amplitude in particular has never delivered a single event before this pass, so its dashboard is the fastest way to prove the fix.
4. Then decide the two deferred design questions: the free-tier history model, and one brand hue.
5. Planned features live in `FEATURE_BACKLOG.md` — daily plan, interstitial paywall, RevenueCat custom paywall, and the achievement overhaul with confetti (weekly summary already shipped, see `## Completed` above). Read the note at the top of that file first: gamification currently only runs for premium users, and that decision gates most of the list.
