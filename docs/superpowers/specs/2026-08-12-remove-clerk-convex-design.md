# Remove Clerk + Convex — Local-Only App

## Context

The app is pre-production (not released, no real users, no data to migrate). It already runs a fully local guest mode (Zustand + MMKV) alongside an authenticated cloud-sync mode (Clerk + Convex). The decision is to drop the authenticated/cloud mode entirely and make the local mode the only mode. RevenueCat stays as the subscription source of truth, but becomes purely anonymous/device-based (no more linking a RevenueCat identity to a Clerk user id). Server-triggered push notifications (Convex cron + Expo push) are dropped in favor of the local device-scheduled notifications the app already sends via `expo-notifications`.

## Goals

- No more `@clerk/clerk-expo`, `convex` runtime dependency, or `convex/` backend directory.
- Every feature that currently branches on "signed in + premium → cloud" vs. "guest → local" collapses to a single local path.
- No feature regresses for the (small) group of users who were previously signed in — in practice this means gamification (XP/level/achievements), which today only runs through the Convex sync path, must be ported to run locally for everyone.
- Settings screen loses its Account section (login/logout/delete account); "reset my data" becomes a local-only action.
- Full `bun run typecheck`, `bun run lint`, `bun test` clean at the end.

## Non-goals

- No feature-flag or staged rollout — this is a single clean removal.
- No local reimplementation of the RevenueCat webhook notification copy (purchase/cancellation/expiration/billing-issue pushes) — flagged as a possible future enhancement via `RevenueCatProvider`'s existing `addCustomerInfoUpdateListener`, not built now.
- No anti-cheat / session-input validation port (`convex/exerciseSessions.ts`'s `validateSessionInput`) — that was a server-trust boundary that no longer exists.

## Architecture

**Before:** `src/app/_layout.tsx` wraps the app in `ClerkProvider` → `ConvexProviderWithClerk` → `RevenueCatProvider`. `AuthSync.tsx` bridges Clerk session state into `activeUserId` (for MMKV key prefixing) and a Convex `users` row. Screens/hooks branch on `isSignedIn` (and often `isPremium`) to decide between a Convex `useQuery`/`useMutation` and a local Zustand store. `SyncProvider.tsx` batches completed sessions to a Convex mutation, which runs `processGamification` server-side and returns unlocked achievements.

**After:** `src/app/_layout.tsx` wraps the app in `RevenueCatProvider` only. There is one data path per feature: the local store. `useCreateSession.ts` becomes the single write path for a completed exercise session — it updates local history, local statistics, local exercise progress, local streak, and now also runs a local `processGamification` port, for every user, every time. No `activeUserId`/MMKV-prefix concept is needed since there is only ever one local user; `storage.ts` collapses to a single storage adapter.

## Components

### Delete outright
- `convex/` — entire directory (`schema.ts`, `auth.config.ts`, `statistics.ts`, `streaks.ts`, `subscriptions.ts`, `pushTokens.ts`, `notificationPolicy.ts`, `revenuecatEvents.ts`, `expoPush.ts`, `exerciseProgress.ts`, `migrations.ts`, `http.ts`, `home.ts`, `crons.ts`, `users.ts`, `weeklySummary.ts`, `gamification.ts`, `exerciseSessions.ts`, `_generated/`, `__tests__/`).
- `src/app/(auth)/` — `login.tsx`, `register.tsx`, `_layout.tsx`.
- `src/components/auth/AuthSync.tsx`, `src/components/auth/AuthPromptSheet.tsx`.
- `src/hooks/usePushNotificationToken.ts`, `src/hooks/useSyncTimezone.ts`, `src/hooks/useWarmUpBrowser.ts`.
- `src/components/ui/GoogleIcon.tsx`.
- `src/providers/SyncProvider.tsx`.
- `src/stores/syncStore.ts`.
- `@clerk/clerk-expo` and `convex` entries in `package.json`; matching env vars in `.env.example` (`EXPO_PUBLIC_CONVEX_URL`, `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CONVEX_DEPLOYMENT`, `CLERK_FRONTEND_API_URL`, `REVENUECAT_WEBHOOK_AUTH_HEADER`, `EXPO_ACCESS_TOKEN`).

### Rewrite (feature stays, Clerk/Convex branch removed, local path becomes unconditional)
- `src/app/_layout.tsx` — drop `ClerkProvider`/Convex client/token cache; onboarding gate becomes `hasCompletedOnboarding` from local settings only.
- `src/app/(app)/_layout.tsx` — drop the auth-loading gate.
- `src/app/(app)/(tabs)/index.tsx` — drop the Convex dashboard query branch; local computation (already present) is the only path.
- `src/app/(app)/(tabs)/settings.tsx` — drop Account section (login/logout, delete account, Clerk mutations); keep "reset my data" wired to local store resets only.
- `src/app/(app)/exercise/[exerciseId].tsx` — drop remote-history query branch.
- `src/hooks/useAdaptiveExerciseStart.ts`, `src/hooks/useExerciseLimits.ts`, `src/features/weeklySummary/useWeeklySummary.ts`, `src/features/dailyPlan/DailyPlanCard.tsx`, `src/features/streak/StreakBadge.tsx`, `src/features/streak/StreakWeeklyCalendar.tsx` — drop the Convex-query branch, local computation becomes unconditional. (`StreakWeeklyCalendar.tsx` currently returns `null` for non-premium users — this is a bugfix side-effect: it becomes visible for everyone.)
- `src/hooks/useCreateSession.ts` — drop `isSignedIn` gating and the Convex progress mutation; this is where the new local gamification port gets called after every session.
- `src/providers/RevenueCatProvider.tsx` — drop `Purchases.logIn(userId)`/`logOut()` Clerk-identity linking; stays anonymous.
- `src/features/subscription/PaywallScreen.tsx` — drop the `isSignedIn` gate and `AuthPromptSheet`; paywall renders directly.
- `src/features/onboarding/OnboardingScreen.tsx` — drop the Convex `completeOnboarding` mutation; persist onboarding results (`onboardingReason`, `trainingGoalMins`, `initialWpm`, `initialComprehension`, `startingDifficulty`) to a local store instead (currently only `hasCompletedOnboarding` survives for guests — this fixes a real data-loss gap).
- `src/stores/storage.ts` — collapse `userScopedStorageAdapter`/`activeUserId` to a single fixed-prefix (or plain) adapter.
- `src/stores/useStatisticsStore.ts`, `src/components/ui/StatisticsDashboard.tsx` — replace the `TimeRange` type import from `@/convex/statistics` with the equivalent already defined in `src/utils/localStatistics.ts`.

### New local module
- **Gamification port** (new, e.g. `src/utils/gamification.ts`): a pure function mirroring `convex/gamification.ts`'s `processGamification` — takes current local xp/level/unlocked-achievement-ids plus a completed session's stats (count, streak, wpm, comprehension) and returns the updated xp/level/newly-unlocked achievement ids. Backed by a new persisted store (or an extension of the existing `gamificationStore.ts`, which today only queues achievement popups) holding `xp`, `level`, `unlockedAchievementIds`. Wired into `useCreateSession.ts` so it runs for every completed session, not just synced ones — this is the one behavior change that makes a previously cloud-only feature available to everyone.

## Data flow: completing an exercise (after)

1. Exercise screen finishes → calls `useCreateSession`.
2. `useCreateSession` writes to `localHistoryStore` (raw session), updates `exerciseProgressStore` (adaptive difficulty) via `calculateNextProgression` (already local), updates `streakCacheStore` via `calculateStreakUpdate` (already local — this also already triggers local notification rescheduling and milestone notifications), and now also runs the new gamification port, persisting xp/level/achievements and pushing any newly unlocked achievements into `gamificationStore`'s popup queue.
3. Dashboard/weekly-summary/daily-plan/streak UI all read straight from these local stores — no query, no loading state, no premium/signed-in branch.

## Error handling

- Local store writes are synchronous MMKV, no network failure mode to handle — the retry/backoff logic in the deleted `syncStore.ts` has no replacement need.
- "Delete account" as a concept goes away (there is no account); "reset my data" in Settings clears the same local stores it already clears today, minus the Convex mutation call.

## Testing

- Remove the `mock.module('convex/react', ...)` and `mock.module('@clerk/clerk-expo', ...)` blocks in `test-setup.ts`.
- Update `src/hooks/__tests__/useAdaptiveExerciseStart.test.ts` and `useExerciseLimits.test.ts` (if present) to drop Clerk/Convex mocks and assert the always-local behavior.
- `src/features/exercises/*/__tests__/*.test.ts` (chunking, pacer, rsvp, scanning, schulte) import Clerk/Convex transitively through the hooks under test — re-run after the hook rewrites and fix any broken mocks/imports.
- Add a small test for the new gamification port (pure function — cheap to test: session count thresholds, streak thresholds, wpm/comp thresholds, xp/level rollover).
- Full validation gate at the end: `bun run typecheck && bun run lint && bun test`.

## Rollout

Single change, no staged flag. Given the scope (~40 files), implementation should proceed in dependency order: (1) new local gamification module + store, (2) rewrite `useCreateSession.ts` to call it, (3) rewrite remaining hooks/screens to drop their Convex branch, (4) delete `convex/`, Clerk/Convex providers, auth routes, and now-dead files, (5) config cleanup (`package.json`, `.env.example`), (6) test cleanup, (7) full validation run.
