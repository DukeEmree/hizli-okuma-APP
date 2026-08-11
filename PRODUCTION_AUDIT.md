# Production Audit

Date: 2026-08-11 (second pass)
Scope: full repository — `src/`, `convex/`, root configuration, `app.json`, `eas.json`, `.env.example`.
Method: direct code reading plus targeted greps, followed by `bun run typecheck`, `bun run lint` and `bun test` against the working tree. Nothing outside the repository (Convex, Clerk, RevenueCat, Sentry, Amplitude, EAS, Play Console dashboards) was reachable; anything that can only be confirmed there is marked **VERIFY**.

This pass supersedes the first audit of the same date. Findings from that pass that were fixed in the working tree are listed under [Resolved Issues](#resolved-issues); everything still open is listed under [Remaining Issues](#remaining-issues).

---

## Executive Summary

The backend authorization model is sound: every public Convex query and mutation resolves the caller from `ctx.auth.getUserIdentity()` and scopes reads/writes to that user's own rows, and no function trusts a client-supplied user id. Gamification, streaks and premium state are all computed or written server-side only. The offline sync queue, exercise engine lifecycle and RevenueCat identity handling are all better built than typical for an app at this stage.

This pass found no new security holes. What it did find was a cluster of **silent correctness bugs** — code that runs without error but produces wrong numbers or never fires at all:

- Amplitude was never initialised, so every analytics event was dropped in production.
- Comprehension percentages were rendered from a 0–1 ratio, so the dashboard showed `1%` instead of `85%`.
- The `comp_90` achievement compared that same 0–1 ratio against `90`, making it unreachable.
- Two comprehension exercises never emitted `comprehensionAccuracy` at all, so they were invisible to scoring, adaptive difficulty and statistics.
- Daily statistics and the daily-goal ring bucketed by UTC while streaks bucketed by the user's timezone, so for a UTC+3 user the two disagreed for three hours every night.

All of the above are fixed in this pass, along with a Sentry sampling-cost issue, an unnecessary microphone permission, and the remaining lint warnings.

**Findings this pass: 14.** CRITICAL 0 · HIGH 5 · MEDIUM 5 · LOW 4. **Fixed: 11. Open: 3** (plus 6 external VERIFY items).

**Production readiness: code is ready; release configuration is not yet verified.** The remaining blockers are all outside the repository — real production Clerk and RevenueCat keys, Android release signing, a Privacy Policy URL, and the Play Console Data Safety form. See `PRODUCTION_CHECKLIST.md`.

---

## Architecture

| Layer | Implementation |
|---|---|
| App shell | Expo SDK 57, Expo Router (typed routes, React Compiler enabled), React 19.2 / RN 0.86 |
| Navigation | `(onboarding)` → `(app)/(tabs)` → exercise detail → exercise runner, with `(auth)` as a side stack; the root gate lives in `src/app/_layout.tsx` |
| UI | Tamagui v5 config with a custom neutral palette and green accent; Lucide icons; Victory Native charts |
| Client state | Zustand + MMKV, split into device-global (`settings-store`) and per-user-prefixed stores (`storage.ts`) |
| Backend | Convex — 15 function modules, one HTTP action for the RevenueCat webhook |
| Auth | Clerk (`ConvexProviderWithClerk`), tokens in `expo-secure-store` |
| Billing | RevenueCat SDK client-side, entitlement mirrored into Convex via a signed webhook |
| Exercises | 15 registered exercises, each a `use*Engine` hook over a shared `ExerciseEngine` + `ExerciseTimer` |

Data flows one way: an exercise completes → `useCreateSession` writes local progress and appends to the MMKV sync queue → `SyncProvider` flushes that queue to Convex **only for signed-in premium users** → Convex recomputes streak, statistics and gamification server-side and returns unlocked achievements.

---

## Security Audit

**Authorization.** Every public function in `users.ts`, `exerciseSessions.ts`, `exerciseProgress.ts`, `streaks.ts`, `statistics.ts`, `home.ts` and `pushTokens.ts` follows the same shape: resolve identity → look up the caller's own `users` row by `by_clerkId` from the verified `identity.subject` → scope all access through `by_userId` indexes. No function accepts a `userId`/`clerkId` argument as an authorization input, so there is no IDOR surface.

**Privilege separation.** `subscriptions.syncPremiumState` — the only writer of `users.isPremium` — is an `internalMutation` reachable only from the webhook handler, so a client cannot self-grant premium. `migrations.migrateAllUserStatistics` is likewise `internalMutation` (this was the first pass's CRITICAL finding, now fixed). `pushTokens.removeToken` verifies `existing.userId === user._id` before deleting, so a guessed token string cannot unregister another user's device.

**Server-side validation.** `createSession` bounds duration (≤ 4h), score (≤ 50000), WPM (≤ 5000), rejects future or inverted timestamps, and validates reaction-time arrays. `updateProgress` rejects out-of-range levels, negative counters and difficulty jumps larger than the one step the adaptive algorithm can produce. Both re-check `user.isPremium` server-side rather than trusting the client to skip the call. These are deliberately generous sanity ceilings, not a re-derivation of the scoring formula — a modified client can still inflate its own personal numbers within them. With no cross-user leaderboard in the product, the blast radius is the attacker's own statistics.

**Webhook.** `/revenuecat-webhook` compares the `Authorization` header against `REVENUECAT_WEBHOOK_AUTH_HEADER` in constant time (WebCrypto HMAC round-trip), returns 401 on mismatch and 500 when unconfigured, validates the payload shape before use, and dedupes by RevenueCat event id inside a single Convex transaction so a redelivery cannot double-send a push.

**Secrets.** No secret literals in `src/` or `convex/`. `.env*.local` and `.env` are gitignored and confirmed never committed. `android/` and `ios/` are untracked. `.env.local` still holds a `CLERK_SECRET_KEY` that no code reads — see LOW-1.

**Local storage.** MMKV holds exercise history and settings only; no tokens. Clerk sessions live in `expo-secure-store`. Per-user key prefixing (`storage.ts`) physically separates two accounts' persisted stores, so there is no read path from user B's session to user A's data.

---

## Bug Audit

### [HIGH-1] Amplitude was never initialised — all production analytics dropped

- **Severity:** HIGH · **Status:** FIXED
- **File:** `src/lib/analytics.ts`, `src/app/_layout.tsx`
- **Description:** `analytics.init()` existed but had no caller anywhere in the codebase (`grep -rn "analytics.init"` returned only the definition). `analytics.track()` was called from the root layout, the exercise engine, the sync provider and onboarding, all of which invoked Amplitude's `track()` against an unconfigured SDK.
- **Impact:** Zero product analytics in production — no funnel, no retention data, no way to tell whether a release regressed engagement. Silent: nothing throws.
- **Resolution:** `analytics.init()` is now called at module scope in `src/app/_layout.tsx`, next to `initSentry()`, before the first `track()` call.

### [HIGH-2] Comprehension shown as `1%` — a 0–1 ratio rendered as a percentage

- **Severity:** HIGH · **Status:** FIXED
- **File:** `convex/home.ts`, `src/app/(app)/(tabs)/index.tsx`
- **Description:** `metrics.comprehensionAccuracy` is a 0–1 ratio (`src/types/exercise.ts:46`). `home.getDashboardData` averaged it and returned `Math.round(...)`, which is always 0 or 1, while its own fallback (`user.initialComprehension`, written by onboarding) is on a 0–100 scale. The home screen renders the result as `${avgComp}%`.
- **Impact:** The "Kavrama" stat on the main dashboard read `0%` or `1%` for every user with comprehension history — the headline metric of a speed-reading app.
- **Resolution:** Both the Convex branch and the local guest branch now scale to 0–100 at the point of return. `StatisticsDashboard` already did this correctly and was left alone.

### [HIGH-3] Local dashboard read a metric key that does not exist

- **Severity:** HIGH · **Status:** FIXED
- **File:** `src/app/(app)/(tabs)/index.tsx`
- **Description:** The guest/free branch summed `s.metrics?.comprehension`; the field is `comprehensionAccuracy`. `ExerciseMetrics` carries an index signature (`[key: string]: any`), so this typo was never a type error — it simply always read `undefined`.
- **Impact:** Guest and free users never saw a comprehension average at all; the code fell through to a store field that nothing ever writes, yielding `-`.
- **Resolution:** Reads the correct key and scales it.

### [HIGH-4] `comp_90` achievement was unreachable

- **Severity:** HIGH · **Status:** FIXED
- **File:** `convex/gamification.ts:66`
- **Description:** `if (sessionComp !== undefined && sessionComp >= 90)` — `sessionComp` is `metrics.comprehensionAccuracy`, a 0–1 ratio. The condition could never be true.
- **Impact:** One of five achievements could never unlock, and its 100 XP was never awarded.
- **Resolution:** Threshold changed to `>= 0.9`.

### [HIGH-5] Two comprehension exercises never reported comprehension

- **Severity:** HIGH · **Status:** FIXED
- **File:** `src/features/exercises/comprehension-speed/useComprehensionSpeedEngine.ts`, `src/features/exercises/main-idea/useMainIdeaEngine.ts`
- **Description:** Both exercises compute per-round accuracy. `comprehension-speed` sent it only as `comprehensionScore` (0–100), a field nothing consumes; `main-idea` did not send it at all. Scoring (`utils/scoring.ts`), adaptive difficulty (`utils/adaptiveDifficulty.ts`), the daily `compSum`/`compCount` aggregates and the `comp_90` achievement all key off `comprehensionAccuracy`.
- **Impact:** Both exercises scored as if the user answered everything correctly (`accuracy` defaults to 1 when the field is absent), their difficulty never adapted on comprehension, and they contributed nothing to the comprehension trend chart.
- **Resolution:** Both now emit `comprehensionAccuracy` alongside their existing metrics. Write-only `readingDurationMs`/`readingTimes`/`lastShowTime` state was removed at the same time (it was set on every round and never read, costing an extra render each time).

### [MEDIUM-1] Daily statistics and the daily-goal ring used UTC days

- **Severity:** MEDIUM · **Status:** FIXED
- **File:** `convex/exerciseSessions.ts`, `convex/home.ts`
- **Description:** Streaks bucket by the user's local date (`calculateStreakUpdate` with `user.timezone`), but `dailyStatistics` bucketed by `toISOString()` and the dashboard's "today" window started at UTC midnight.
- **Impact:** For a UTC+3 user, sessions completed between 00:00 and 03:00 local counted toward the previous day, while yesterday's 03:00–24:00 sessions counted as today. The daily-goal progress bar was wrong for the first three hours of every day, and it disagreed with the streak, which used the correct boundary.
- **Resolution:** Both now bucket with `getLocalDateString(..., user.timezone)`. `dailyStatistics.timestamp` remains the UTC instant of that local midnight, so existing `by_userId_and_timestamp` range queries are unaffected. Rows written before this change keep their old bucket; on a pre-launch deployment that is acceptable, and mixing is bounded to at most one day's boundary.

### [MEDIUM-2] Dashboard scanned every session the user had ever completed

- **Severity:** MEDIUM · **Status:** FIXED
- **File:** `convex/home.ts`, `convex/schema.ts`
- **Description:** "Today's training time" was computed with `.withIndex('by_userId').filter(q.gte('completedAt', todayStart))`. In Convex, `.filter()` is applied after the index scan, so this read the user's entire session history on every dashboard load — and it is a reactive query, so it re-ran on every write.
- **Impact:** Read cost and latency grew linearly with lifetime session count for the app's most-visited screen.
- **Resolution:** Added the `by_userId_and_completedAt` index (additive, no data migration) and replaced the scan with a bounded 48-hour range read, filtered in-process by local date. This is also DST-safe, which a fixed-offset calculation would not be.

### [MEDIUM-3] Sentry sampled 100% of traces and profiles in production

- **Severity:** MEDIUM · **Status:** FIXED
- **File:** `src/lib/sentry.ts`
- **Description:** `tracesSampleRate: 1.0` and `profilesSampleRate: 1.0`.
- **Impact:** Every transaction from every user is sent and billed; the free/team Sentry quota is exhausted quickly by a consumer app, at which point errors — the thing that actually matters — start being dropped. Profiling at 100% also adds measurable JS-thread overhead.
- **Resolution:** Both set to `0.2`. Error and crash capture is unaffected; only performance sampling changed.

### [MEDIUM-4] Onboarding flash for already-onboarded users right after sign-in

- **Severity:** MEDIUM · **Status:** FIXED
- **File:** `src/app/_layout.tsx`
- **Description:** The root gate treated a signed-in user as onboarded only if the Convex row said so. Immediately after sign-in, `getMe` resolves to `null` for the window before `AuthSync`'s `users.store` mutation creates that row, so the gate redirected to `(onboarding)` and then back out again once the row appeared.
- **Impact:** A visible flash of the onboarding flow on every fresh sign-in.
- **Resolution:** A signed-in user now counts as onboarded if either the cloud row or the device's local flag says so. `AuthSync` seeds the new row from that same local flag, so the two cannot disagree for long.

### [LOW-1] Unused Clerk secret key in `.env.local`

- **Severity:** LOW · **Status:** OPEN (requires your action — it is your local file)
- **File:** `.env.local` (gitignored, never committed)
- **Description:** `CLERK_SECRET_KEY` is present but read by no code in `src/` or `convex/`.
- **Impact:** No leak today. A mobile client has no legitimate use for a Clerk secret key, and its presence is unnecessary exposure if that file is ever synced, backed up or shared.
- **Resolution:** Delete the line. Nothing depends on it.

### [LOW-2] `RECORD_AUDIO` and foreground-service permissions declared but unused

- **Severity:** LOW · **Status:** FIXED
- **File:** `app.json`
- **Description:** The Android permission list declared `RECORD_AUDIO`, `FOREGROUND_SERVICE` and `FOREGROUND_SERVICE_MEDIA_PLAYBACK`. The app's only audio usage is `useAudioPlayer` playing a metronome tick (`src/hooks/useMetronome.ts`); nothing records, and the metronome stops when the app backgrounds, so no foreground service is needed. `expo-audio` injects these transitively.
- **Impact:** A microphone permission on the Play listing invites Data Safety scrutiny and scares users at install time, for a capability the app does not have.
- **Resolution:** Removed from `permissions` and added to `blockedPermissions` so the transitive injection is stripped from the merged manifest. Verify with `npx expo prebuild --clean` before release.

### [LOW-3] Lint warnings

- **Severity:** LOW · **Status:** FIXED
- **Description:** 20 warnings — unused imports (`View` ×4, `DifficultyLevel`, `router`, `isLoaded`, `reset` ×2, two unused test imports), write-only state (covered by HIGH-5), and `Array<T>` style violations ×5.
- **Resolution:** All cleared. `bun run lint` now reports zero errors and zero warnings.

### [LOW-4] Client-side errors that never reached Sentry

- **Severity:** LOW · **Status:** FIXED
- **File:** `src/app/(auth)/login.tsx`, `src/features/onboarding/OnboardingScreen.tsx`
- **Description:** Google SSO failures and onboarding-submit failures were `console.error`'d only.
- **Impact:** Two of the highest-value failure paths in the app — sign-in and onboarding completion — were invisible in production.
- **Resolution:** Both routed through `captureException` with context. The Clerk response-object dumps in `login.tsx`/`register.tsx` are already `__DEV__`-gated and were left as is.

---

## Performance Audit

| Area | Finding | Status |
|---|---|---|
| Convex dashboard query | Unindexed date filter scanning full session history (MEDIUM-2) | Fixed via new index + bounded range read |
| Exercise tick loop | `useExerciseEngine` throttles tick-driven React state to ~1/s while the timer itself runs at 16–100 ms | Good as-is |
| Render-time work | Dead write-only state in two engines caused a re-render per round (HIGH-5) | Fixed |
| Lists | Exercise list is registry-driven (15 items), recent activity capped at 5, history charts capped at 15–100 points | No virtualisation needed |
| Zustand | Selector-based subscriptions throughout; no whole-store subscriptions found | Good as-is |
| Sync provider | 15 s interval always armed even with an empty queue | Open, negligible — the callback early-returns on a length check |
| Local history | The MMKV sync queue doubles as free-tier history and is never pruned | Open, see REM-1 |
| Sentry | 100% trace/profile sampling (MEDIUM-3) | Fixed |
| Startup | `initSentry()`/`analytics.init()` at module scope, fonts gate the splash, no blocking network call before first paint | Good as-is |

No `useMemo`/`useCallback` was added or removed for its own sake. A render-profile pass on a real low-end Android device was not possible in a static audit and is listed as VERIFY.

---

## Convex Audit

- **Function typing:** all 15 modules use the object form with `args` validators. Public vs internal separation is correct — `migrations`, `subscriptions`, `revenuecatEvents`, `expoPush` and the internal half of `pushTokens` are all `internal*`.
- **Indexes:** every query in the codebase runs through an index; the only `.filter()` on an unindexed field was MEDIUM-2, now removed. `by_userId_and_completedAt` added this pass.
- **Transactions:** the RevenueCat dedup ledger relies on Convex's OCC retry to make check-then-insert race-safe, which is correct for Convex specifically and documented in the code.
- **Unbounded reads:** `users.resetMyStatistics` and `users.deleteMyAccount` `collect()` every row across seven tables for the caller. Convex's per-transaction read limits (documents and bytes) would reject this for a very heavy long-term user. Not reachable at current data volumes — see REM-2.
- **Cost shape:** `home.getDashboardData` still issues three reads per dashboard load (5 recent, 48 h window, 100 for rolling averages), two of which duplicate data already aggregated in `userStatistics`/`dailyStatistics`. Correct, and now bounded; consolidating it is an optimisation, not a fix.
- **Schema:** `metrics: v.any()` on `exerciseSessions` is deliberate (per-exercise shapes) and is bounds-checked in the mutation rather than by the validator.

---

## State Management Audit

- **Isolation.** `userScopedStorageAdapter` prefixes every key with the active user id (`guest` when signed out), so no cross-user read path exists. `settingsStore` is deliberately device-global (theme, language, reminders).
- **Rehydration.** `AuthSync` calls `persist.rehydrate()` on five stores after switching the prefix, without awaiting. Not a leak — storage is already isolated — but a brief flash of the previous user's in-memory state is possible on a rapid account switch. Open, LOW.
- **Guest → auth migration.** `migrateGuestDataToUser` dedupes the sync queue by `clientSessionId`, merges best-* values with `max()`, and — for the one additive merge (`totalTrainingSeconds`, `completedExercises`) — removes the guest key *before* writing the merge, so an interrupted run can lose that run's unmigrated seconds but can never double-count them on retry. Correct.
- **Persisted versions.** Each store declares `version: 1` with a pass-through `migrate`. `migration.ts` pins matching constants with a comment explaining why a drifted version silently wipes the blob it is trying to preserve. Correct, but note that the pass-through `migrate` functions will need real bodies the first time a store's shape changes.
- **Dead state.** `userProgressStore.bestWpm` / `bestComprehension` / `totalTrainingSeconds` have no writers anywhere in the app; the home screen's fallback to them is unreachable. Open, LOW — see REM-4.

---

## UI/UX Audit

**What works.** Consistent Tamagui token usage (no hardcoded hex anywhere in `src/`), safe-area edges applied per screen, loading and empty states present on the main flows, destructive actions behind confirmation sheets, and pressed-state feedback on cards and buttons.

**Colour system.** The palette is a neutral grey ramp (hue 0, 15% saturation) with a **green** accent (hue 120), but the app icon, splash background and notification colour are **blue** (`#208AEF`), and screens mix `$blue10`/`$blue4` (sliders, badges, secondary buttons, tab bar active tint) with `theme="accent"` (primary CTAs). The product therefore has two competing primaries.

**Decision (2026-08-11): green is the brand hue.** The icon, splash background and notification colour must move to green, and the `$blue*` usages must move onto accent tokens. Recommended mapping:

| Role | Token | Suggested value |
|---|---|---|
| Primary | `accent9` / `accent10` | existing green ramp — keep as is |
| Secondary | `$green4` / `$green11` | tinted surfaces and text on them, replacing today's `$blue4`/`$blue11` |
| Background | `$background` | existing neutral ramp step 1 |
| Surface | `$backgroundHover` | existing ramp step 2 — already used consistently for cards |
| Text | `$color12` | |
| Muted text | `$color11` / `$color10` | |
| Success | `$green10` | already used for scores |
| Warning | `$orange9` / `$yellow10` | already used for the limit-reached button |
| Error | `$red10` | already used for the danger zone |

This is a deliberate visual change (it also means regenerating the app icon and changing the splash colour), so it was **not applied** — it is tracked as item 7.1 in `FEATURE_BACKLOG.md`. Everything else below is also proposal-only.

**Open UI/UX items (not applied):**

1. The home and statistics screens are the only two with hardcoded Turkish strings ("Merhaba", "Bugünkü Hedef", "Misafir", …) while 25 other files use `useTranslation`. `home.json` exists but is nearly empty. With Turkish as the only shipped locale this changes nothing visually today; it becomes a blocker the moment a second language is added.
2. ~~Free and guest users see a completely empty statistics tab.~~ Resolved after the audit: the dashboard is now built from `localHistoryStore` (6 months on-device) for non-premium users, in the same shape the Convex query returns, so the component renders identically for both.
3. The exercises tab shows a "En İyi" badge from `useStatisticsStore.stats['all']`, but nothing ever fetches the `'all'` time range (the statistics screen defaults to `'7d'`), so the badge never appears.
4. Touch targets: `SettingsRow` rows are `paddingVertical="$2"` around a 20 px icon, which lands below the 48 dp Android minimum for the pressable rows. Bump to `$3`.
5. No "Restore Purchases" entry point outside RevenueCat's hosted Customer Center. Acceptable if the Customer Center has restore enabled — VERIFY.
6. No in-app Privacy Policy / Terms links (see the checklist).

**Micro-interaction proposals (not applied):** press-scale on the primary CTA (the exercise cards already do this via `pressStyle`); animate the daily-goal `Progress` value on mount instead of snapping; a brief success scale/fade on the exercise result card; a flame pulse on `StreakBadge` when the streak increments; haptic feedback on exercise completion (`hapticsEnabled` already exists in settings and currently has no consumer). All are Reanimated-only, no new dependencies.

---

## Dependency / Configuration Audit

- `bun run typecheck`: clean.
- `bun run lint`: 0 errors, 0 warnings (was 20 warnings).
- `bunx expo export --platform android`: succeeds, producing a 15 MB Hermes bundle. This also settles the previous pass's open question about the missing `babel.config.js`/`metro.config.js` — SDK 57's defaults are sufficient and the production bundle compiles.
- `bun run i18n:check`: passes.
- `bun test`: 134 pass, 0 fail, 20 files. `act(...)` and `react-test-renderer is deprecated` notices are React 19 test-environment noise, not failures.
- `package.json` has no `test` script even though `AGENTS.md` documents `bun test`; the command works because Bun's runner needs no script. Harmless, worth adding for discoverability.
- `eslint` is pinned to major 8 while TypeScript is 6.x and React 19.2. Lint runs clean today; flagged for future compatibility only. No upgrade performed.
- `app.json`: `versionCode: 1`, `version: 1.0.0`, consistent bundle/package ids, `extra.eas.projectId` matches what `usePushNotificationToken` reads. `eas.json` uses `appVersionSource: remote` with `autoIncrement` on production.
- `.env.example` was rewritten this pass: all seven client variables plus the Convex-deployment variables (`CLERK_FRONTEND_API_URL`, `REVENUECAT_WEBHOOK_AUTH_HEADER`, `EXPO_ACCESS_TOKEN`) with placeholder values and comments on what each one breaks when missing. No real values.
- Root housekeeping: `test-expo-router.js`, `test-export.ts`, `test-export2.ts` and `scratch/` were tracked in git but belonged to no lint, test or build path. Deleted with your approval; they remain recoverable from git history.

---

## Critical Findings

None open. The first pass's three CRITICAL findings are resolved or reclassified:

| Finding | Outcome |
|---|---|
| Public unauthenticated `migrateAllUserStatistics` mutation | FIXED — now `internalMutation` |
| Android release signed with the debug keystore | Reclassified: `android/` is gitignored and untracked, i.e. a local prebuild artifact, not the pipeline that produces the Play build. EAS-managed signing must still be VERIFIED (`eas credentials -p android`) |
| No `EXPO_PUBLIC_*` variables on the EAS production profile | External VERIFY — see `PRODUCTION_CHECKLIST.md` |

---

## Resolved Issues

Fixed in this pass: HIGH-1 (Amplitude init), HIGH-2 (comprehension scale, server), HIGH-3 (comprehension key, client), HIGH-4 (`comp_90` threshold), HIGH-5 (missing `comprehensionAccuracy` in two exercises), MEDIUM-1 (timezone day buckets), MEDIUM-2 (unindexed dashboard scan), MEDIUM-3 (Sentry sampling), MEDIUM-4 (onboarding flash), LOW-2 (`RECORD_AUDIO`), LOW-3 (lint), LOW-4 (unreported client errors).

Fixed in the previous pass and re-verified here: public migration mutation, missing `POST_NOTIFICATIONS`, `captureException` never called, orphaned push tokens on account deletion, partial account-deletion failure handling, guest-migration double-count window, unconditional RevenueCat `DEBUG` log level, missing AppState pause mid-exercise, `SYSTEM_ALERT_WINDOW` blocked.

---

## Remaining Issues

**REM-1 · RESOLVED after the audit.** The sync queue used to double as free-tier history and grew without bound. It is now split: `syncStore` is a pure upload queue, filled only for signed-in premium users; `localHistoryStore` keeps the last 6 months of sessions on-device for everyone and is what the dashboard, daily limit and exercise charts read. Existing installs are migrated once by `importLegacyQueueIntoHistory`, and unsynced local sessions are backfilled to Convex when a user becomes premium.

**REM-2 · `resetMyStatistics` / `deleteMyAccount` read every row in one transaction.** Seven `collect()` calls with no pagination. Convex's per-transaction limits would reject this for an extremely heavy account. The fix is batched deletion driven by the scheduler, which is a meaningful rewrite of both mutations. *Severity: MEDIUM (latent). Not reachable at current volumes.*

**REM-3 · Unawaited `persist.rehydrate()` on account switch.** `AuthSync` fires five rehydrates without awaiting them, allowing a brief flash of the previous user's in-memory state. Storage isolation is unaffected. *Severity: LOW.*

**REM-4 · Dead code paths.** `userProgressStore`'s `bestWpm`/`bestComprehension`/`totalTrainingSeconds` have no writers; `SUBSCRIPTION_CONSTANTS.FREE_TIER.ALLOWED_EXERCISES`/`HAS_ADVANCED_STATS` and `PREMIUM_TIER` are read nowhere (per-exercise gating uses `definition.isPremium` instead, and the two lists are stale — they name six exercises out of fifteen); the exercises tab's "En İyi" badge reads a statistics range nothing fetches. Removing these means deleting files/fields, which needs sign-off. *Severity: LOW.*

**REM-5 · Uncleaned `setTimeout` in round-advance handlers.** Several exercise engines schedule the next round with a bare `setTimeout(..., 500)` that is not cleared on unmount. React 19 no longer warns on the resulting post-unmount `setState`, and the window is half a second, so the practical impact is nil — but it does not match `AGENTS.md`'s cleanup rule and would need a ref-tracked timeout per engine. *Severity: LOW.*

**REM-6 · Turkish strings hardcoded on home/statistics.** See the UI/UX section. *Severity: LOW while Turkish is the only locale.*

---

## Risks

1. **Release configuration is unverified.** Test Clerk and RevenueCat keys are what the audit could see referenced; shipping with them means no real sign-in and no real purchases. This is the single largest release risk and is entirely outside the repository.
2. **The free-tier data model is a one-way door.** Free users' history lives only on their device, in a queue that the server refuses to accept. If the product later decides signed-in free users should have cloud backup, that history is not recoverable server-side and the local queue is the only copy — including across device loss and reinstall.
3. **Timezone bucket change is not retroactive.** `dailyStatistics` rows written before this pass keep their UTC buckets. On a pre-launch deployment this is noise; if there is meaningful production data already, expect a one-day seam in the charts.
4. **React Compiler and typed routes are both experimental** (`app.json` → `experiments`). Neither showed a problem in static reading, but neither can be validated without running a release build on a device.
5. **Anti-cheat bounds are generous by design.** Acceptable while statistics are private; revisit before any cross-user ranking feature ships.

---

## Recommendations

**Before release** — all external, all in `PRODUCTION_CHECKLIST.md`: production Clerk instance, production RevenueCat keys and product linkage, Android release keystore, `REVENUECAT_WEBHOOK_AUTH_HEADER` on the production Convex deployment, Privacy Policy URL, Play Console Data Safety form. Then run `npx expo prebuild --clean` and confirm the merged manifest has `POST_NOTIFICATIONS` and no `RECORD_AUDIO`.

**Shortly after release:** add `environment` and `release` tags to `Sentry.init()` so production events are separable; decide the REM-1 local-history model; unify the colour system on one brand hue.

**Retention features worth building.** These are now tracked with full scope, UX flow, technical plan and open questions in `FEATURE_BACKLOG.md`, together with the features you added (interstitial paywall, RevenueCat custom paywall, achievement overhaul with confetti). Summary:

1. **Daily plan / "Bugünün antrenmanı"** — three exercises picked from the user's weakest categories, presented as a single card on the home screen with a completion ring. Problem: the exercises tab shows fifteen equal choices and gives no reason to start today specifically. Convex: a `dailyPlans` table keyed `(userId, localDate)`, or derive it deterministically from `exerciseStatistics` with no new table. Local state: guests need the same plan derived from the local queue. Gamification: completing the plan is the natural daily-goal event that `isDailyGoalCompleted` in `processGamification` is already stubbed for and always passes as `false`. Retention impact: high — it converts an open-ended app into a daily ritual. MVP difficulty: medium.
2. **Streak freeze / repair** — one earned "freeze" that absorbs a missed day, spendable automatically. Problem: `calculateStreakUpdate` resets a 40-day streak to 1 the moment a day is missed, which is exactly when users churn. Convex: two fields on `streaks` (`freezesAvailable`, `freezeUsedAt`) plus the reset branch of `calculateStreakUpdate`; the function is already pure and unit-tested, so the change is testable in isolation. Retention impact: high, well evidenced across the category. MVP difficulty: low.
3. **Weekly progress recap** — a Sunday push plus an in-app card summarising WPM change, minutes trained and best exercise. Problem: improvement in reading speed is slow and invisible day to day. Convex: a cron over `dailyStatistics` (already aggregated per user, so the query is cheap) reusing the existing `expoPush` action and push-token table. Retention impact: medium-high; it is also the highest-value use of the push infrastructure that currently only fires for billing events. MVP difficulty: low-medium.
4. **Personal-best celebration** — detect a new best WPM or comprehension at session end and show a full-screen moment with the delta over the previous best. Problem: `AchievementPopupGlobal` only fires for six fixed achievements, so most sessions end with no feedback at all. Convex: `exerciseStatistics` already tracks `bestScore`/`bestWpm`, so the mutation can return "this beat your record" with no schema change. Retention impact: medium. MVP difficulty: low.

**External VERIFY list:** production Clerk instance and OAuth redirect URLs · production RevenueCat keys, products, entitlement and webhook · EAS production environment variables · Android release credentials · Play Console Data Safety and Privacy Policy URL · RevenueCat Customer Center restore setting.
