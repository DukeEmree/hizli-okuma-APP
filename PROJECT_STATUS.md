# Project Status

> Living documentation of the current architecture and implementation status. Everything here was verified by reading the code in this working tree; anything that could only be confirmed in an external dashboard is marked **VERIFY**.

Last updated: 2026-08-13, after the Clerk/Convex removal migration (see `docs/superpowers/plans/2026-08-12-remove-clerk-convex.md` and `docs/superpowers/specs/2026-08-12-remove-clerk-convex-design.md`) and its final-review fix pass. Planned but unbuilt work lives in `FEATURE_BACKLOG.md`.

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
| `userProgressStore` | persisted | legacy aggregate counters — **currently has no writers** |
| `streakCacheStore` | persisted | streak + banked freeze count |
| `gamificationStore` | persisted (`xp`/`level`/`unlockedAchievementIds` only, via `partialize`) | XP, level, achievements, plus the in-memory achievement popup queue |
| `useExerciseSettingsStore` | persisted | per-exercise config overrides |
| `dailyPlanStore` | persisted | today's daily-plan selection and completion state |
| `useStatisticsStore` | in-memory only | cached local statistics per time range |
| `useComprehensionStore` | in-memory only | in-flight comprehension quiz state |

All stores use selector subscriptions. There is only ever one local user, so there is no per-user key prefixing anymore: `userScopedStorageAdapter` (`src/stores/storage.ts`) is kept only as a call-site-compatible alias of the plain device-global MMKV adapter.

## Local Storage

MMKV, single instance (`hizli-okuma`). Holds settings and exercise history only — no tokens, secrets or account data, because there are none.

## UI System

Tamagui v5 with a custom neutral grey palette and a green accent, plus `light`/`dark`/`system` themes driven by `settingsStore`. No hardcoded hex colours anywhere in `src/`. Safe-area edges are applied per screen; Victory Native renders the progress charts.

**Brand hue: green** (`#2DBE73`, taken from the app icon). The splash background, notification colour and Android adaptive-icon background all use it, and every `$blue*` token in the app was moved to its `$green*` equivalent, so the palette is now single-hue.

## Main Features

- **15 exercises** — rsvp, chunking, pacer, schulte, scanning, peripheral, word-recognition, memory, sentence-memory, main-idea, keyword, selective-attention, number-scan, visual-search, comprehension-speed. Each is a `use*Engine` hook over the shared `ExerciseEngine`/`ExerciseTimer`.
- **Adaptive difficulty** — single-step progression per session, enforced client-side and re-validated server-side.
- **Streaks** — timezone-aware, server-authoritative, with a local cache for instant display. A missed day no longer necessarily breaks the streak: one freeze is earned every 7 consecutive days (max 2) and one is spent per missed day, shown as ❄️ next to the streak badge.
- **Gamification** — 10 XP per exercise, 100 XP per achievement, six achievements, level derived from total XP.
- **Statistics** — daily WPM/comprehension/accuracy trends and per-exercise bests over 7d/30d/90d/all, computed from the 6-month on-device history for everyone via `buildLocalStats`.
- **Subscription** — RevenueCat hosted paywall and Customer Center; free tier capped at 6 exercises per day.
- **Notifications** — local daily/streak/inactivity reminders (`expo-notifications`); there is no server-sent push, since there is no server.
- **Weekly summary** — home card (below the "Daily Goal" card) plus a full `/(app)/weekly-summary` screen recapping the past week's minutes, WPM change and streak, from the shared `buildWeeklySummary` calculator, driven off local history for everyone. Delivered via a local recurring `WEEKLY` notification.
- **Onboarding** — a reading test that seeds initial WPM, comprehension and starting difficulty.

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
| Dead code: `userProgressStore` best-* fields, `SUBSCRIPTION_CONSTANTS` tier lists, the exercises-tab "En İyi" badge | LOW | Removal means deleting fields/files — awaiting sign-off |
| Round-advance `setTimeout`s not cleared on unmount | LOW | 500 ms window, React 19 no longer warns, but it does not match the cleanup rule in AGENTS.md |
| Home and statistics screens use hardcoded Turkish strings | LOW | Invisible while Turkish is the only locale; blocking for a second language |
| No server-side anti-cheat | LOW | A modified client can inflate its own local numbers; no cross-user data exists (no leaderboard, no cloud sync) so the blast radius is limited to the user's own device |

## Production Readiness

**Code: ready.** No open CRITICAL or HIGH findings. `bun run typecheck`, `bun run lint` (0 warnings) and `bun test` all succeed against this tree.

**Release configuration: not ready.** The Clerk/Convex-specific blockers from the previous audit no longer apply (there is nothing to configure — no Clerk instance, no Convex deployment). Remaining blockers:

1. Production RevenueCat key, products, entitlement linkage
2. Android release keystore verified via `eas credentials`
3. Privacy Policy and Terms hosted, linked in the Play listing and in Settings
4. Play Console Data Safety form completed

## Remaining Work

- Run `npx expo prebuild --clean` and confirm the merged manifest has `POST_NOTIFICATIONS` and no `RECORD_AUDIO`
- Add `environment`/`release` tags to `Sentry.init()`
- Accessibility pass: labels on icon-only buttons, touch-target sizes, large-font layout
- Manual device pass: background mid-exercise, double-tap completion, app kill mid-session

## Recommended Next Steps

1. Work through `PRODUCTION_CHECKLIST.md` top to bottom — treat its Clerk/Convex-era items as superseded (see the note at its top) and focus on the RevenueCat, signing and store-listing items that still apply.
2. Produce a production build and smoke-test the full path on a physical device: onboarding → exercise → completion → statistics → paywall → sandbox purchase → settings.
3. Confirm Sentry and Amplitude traffic actually arrives from that build.
4. Planned features live in `FEATURE_BACKLOG.md` — daily plan, interstitial paywall, RevenueCat custom paywall, and the achievement overhaul with confetti (weekly summary already shipped, see `## Completed` above).
