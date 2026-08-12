# Production Audit

Date: 2026-08-11 (second pass)
Scope: full repository — `src/`, `convex/`, root configuration, `app.json`, `eas.json`, `.env.example`.
Method: direct code reading plus targeted greps, followed by `bun run typecheck`, `bun run lint` and `bun test` against the working tree. Nothing outside the repository (Convex, Clerk, RevenueCat, Sentry, Amplitude, EAS, Play Console dashboards) was reachable; anything that can only be confirmed there is marked **VERIFY**.

This audit tracks open findings and unverified items for production readiness. All previously resolved issues have been pruned from this document.

> **Superseded (2026-08-13):** Clerk and Convex were removed from this app in the 2026-08-12 migration (see `docs/superpowers/specs/2026-08-12-remove-clerk-convex-design.md`). This entire audit was written against the pre-migration architecture — the **Convex Audit** section, the Clerk/`convex/` findings in **Security Audit**, **Architecture**, **State Management Audit** and **Dependency / Configuration Audit**, and REM-2 (a Convex-only issue) no longer apply to this tree. Read `PROJECT_STATUS.md` for the current architecture; the RevenueCat, UI/UX, performance and general code-quality findings below are otherwise still a reasonable historical reference.

---

## Executive Summary

The backend authorization model is sound: every public Convex query and mutation resolves the caller from `ctx.auth.getUserIdentity()` and scopes reads/writes to that user's own rows, and no function trusts a client-supplied user id. Gamification, streaks and premium state are all computed or written server-side only. The offline sync queue, exercise engine lifecycle and RevenueCat identity handling are all better built than typical for an app at this stage.

**Remaining Open Issues:** 1 LOW issue in code/config (LOW-1), 5 open technical debt items (REM-2 through REM-6), plus 6 external VERIFY items.

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

**Privilege separation.** `subscriptions.syncPremiumState` — the only writer of `users.isPremium` — is an `internalMutation` reachable only from the webhook handler, so a client cannot self-grant premium. `migrations.migrateAllUserStatistics` is likewise `internalMutation`. `pushTokens.removeToken` verifies `existing.userId === user._id` before deleting, so a guessed token string cannot unregister another user's device.

**Server-side validation.** `createSession` bounds duration (≤ 4h), score (≤ 50000), WPM (≤ 5000), rejects future or inverted timestamps, and validates reaction-time arrays. `updateProgress` rejects out-of-range levels, negative counters and difficulty jumps larger than the one step the adaptive algorithm can produce. Both re-check `user.isPremium` server-side rather than trusting the client to skip the call. These are deliberately generous sanity ceilings, not a re-derivation of the scoring formula — a modified client can still inflate its own personal numbers within them. With no cross-user leaderboard in the product, the blast radius is the attacker's own statistics.

**Webhook.** `/revenuecat-webhook` compares the `Authorization` header against `REVENUECAT_WEBHOOK_AUTH_HEADER` in constant time (WebCrypto HMAC round-trip), returns 401 on mismatch and 500 when unconfigured, validates the payload shape before use, and dedupes by RevenueCat event id inside a single Convex transaction so a redelivery cannot double-send a push.

**Secrets.** No secret literals in `src/` or `convex/`. `.env*.local` and `.env` are gitignored and confirmed never committed. `android/` and `ios/` are untracked. `.env.local` still holds a `CLERK_SECRET_KEY` that no code reads — see LOW-1.

**Local storage.** MMKV holds exercise history and settings only; no tokens. Clerk sessions live in `expo-secure-store`. Per-user key prefixing (`storage.ts`) physically separates two accounts' persisted stores, so there is no read path from user B's session to user A's data.

---

## Bug Audit

### [LOW-1] Unused Clerk secret key in `.env.local`

- **Severity:** LOW · **Status:** OPEN (requires your action — it is your local file)
- **File:** `.env.local` (gitignored, never committed)
- **Description:** `CLERK_SECRET_KEY` is present but read by no code in `src/` or `convex/`.
- **Impact:** No leak today. A mobile client has no legitimate use for a Clerk secret key, and its presence is unnecessary exposure if that file is ever synced, backed up or shared.
- **Resolution:** Delete the line. Nothing depends on it.

---

## Performance Audit

| Area | Finding | Status |
|---|---|---|
| Exercise tick loop | `useExerciseEngine` throttles tick-driven React state to ~1/s while the timer itself runs at 16–100 ms | Good as-is |
| Lists | Exercise list is registry-driven (15 items), recent activity capped at 5, history charts capped at 15–100 points | No virtualisation needed |
| Zustand | Selector-based subscriptions throughout; no whole-store subscriptions found | Good as-is |
| Sync provider | 15 s interval always armed even with an empty queue | Open, negligible — the callback early-returns on a length check |
| Startup | `initSentry()`/`analytics.init()` at module scope, fonts gate the splash, no blocking network call before first paint | Good as-is |

No `useMemo`/`useCallback` was added or removed for its own sake. A render-profile pass on a real low-end Android device was not possible in a static audit and is listed as VERIFY.

---

## Convex Audit

- **Function typing:** all 15 modules use the object form with `args` validators. Public vs internal separation is correct — `migrations`, `subscriptions`, `revenuecatEvents`, `expoPush` and the internal half of `pushTokens` are all `internal*`.
- **Indexes:** every query in the codebase runs through an index; the only `.filter()` on an unindexed field was removed. `by_userId_and_completedAt` added.
- **Transactions:** the RevenueCat dedup ledger relies on Convex's OCC retry to make check-then-insert race-safe, which is correct for Convex specifically and documented in the code.
- **Unbounded reads:** `users.resetMyStatistics` and `users.deleteMyAccount` `collect()` every row across seven tables for the caller. Convex's per-transaction read limits (documents and bytes) would reject this for an extremely heavy account. Not reachable at current data volumes — see REM-2.
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
2. The exercises tab shows a "En İyi" badge from `useStatisticsStore.stats['all']`, but nothing ever fetches the `'all'` time range (the statistics screen defaults to `'7d'`), so the badge never appears.
3. Touch targets: `SettingsRow` rows are `paddingVertical="$2"` around a 20 px icon, which lands below the 48 dp Android minimum for the pressable rows. Bump to `$3`.
4. No "Restore Purchases" entry point outside RevenueCat's hosted Customer Center. Acceptable if the Customer Center has restore enabled — VERIFY.
5. No in-app Privacy Policy / Terms links (see the checklist).

**Micro-interaction proposals (not applied):** press-scale on the primary CTA (the exercise cards already do this via `pressStyle`); animate the daily-goal `Progress` value on mount instead of snapping; a brief success scale/fade on the exercise result card; a flame pulse on `StreakBadge` when the streak increments; haptic feedback on exercise completion (`hapticsEnabled` already exists in settings and currently has no consumer). All are Reanimated-only, no new dependencies.

---

## Dependency / Configuration Audit

- `bun run typecheck`: clean.
- `bun run lint`: 0 errors, 0 warnings.
- `bunx expo export --platform android`: succeeds, producing a 15 MB Hermes bundle. SDK 57's defaults are sufficient and the production bundle compiles.
- `bun run i18n:check`: passes.
- `bun test`: 134 pass, 0 fail, 20 files.
- `package.json` has no `test` script even though `AGENTS.md` documents `bun test`; the command works because Bun's runner needs no script. Harmless, worth adding for discoverability.
- `eslint` is pinned to major 8 while TypeScript is 6.x and React 19.2. Lint runs clean today; flagged for future compatibility only. No upgrade performed.
- `app.json`: `versionCode: 1`, `version: 1.0.0`, consistent bundle/package ids, `extra.eas.projectId` matches what `usePushNotificationToken` reads. `eas.json` uses `appVersionSource: remote` with `autoIncrement` on production.
- `.env.example`: all seven client variables plus the Convex-deployment variables (`CLERK_FRONTEND_API_URL`, `REVENUECAT_WEBHOOK_AUTH_HEADER`, `EXPO_ACCESS_TOKEN`) with placeholder values and comments on what each one breaks when missing. No real values.

---

## Critical Findings

| Finding | Outcome |
|---|---|
| Android release signed with the debug keystore | Reclassified: `android/` is gitignored and untracked, i.e. a local prebuild artifact, not the pipeline that produces the Play build. EAS-managed signing must still be VERIFIED (`eas credentials -p android`) |
| No `EXPO_PUBLIC_*` variables on the EAS production profile | External VERIFY — see `PRODUCTION_CHECKLIST.md` |

---

## Remaining Issues

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
