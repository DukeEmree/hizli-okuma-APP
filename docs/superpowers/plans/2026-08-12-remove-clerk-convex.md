# Remove Clerk + Convex Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Clerk (auth) and Convex (backend) entirely from the app; the local Zustand+MMKV stores become the sole source of truth, RevenueCat stays anonymous/device-based, and gamification (XP/level/achievements) — currently cloud-only — becomes a local feature available to everyone.

**Architecture:** Every screen/hook that currently branches on `isSignedIn`/`isPremium` to pick between a Convex query/mutation and a local Zustand store loses the Convex branch and keeps only the local one, which was already correct and already exercised by guest users. `useCreateSession.ts` becomes the single write path for a completed session: it writes local history, local adaptive-difficulty progress, local streak (via the already-existing pure `calculateStreakUpdate`), and now also a new local gamification port (`src/utils/gamification.ts`, mirroring the logic currently only in `convex/gamification.ts`). `convex/` and all Clerk/Convex provider wiring are then deleted.

**Tech Stack:** React Native, Expo Router, TypeScript, Zustand + react-native-mmkv, Bun test runner (`@testing-library/react-hooks`).

## Global Constraints

- Package manager: Bun only (`bun install`, `bun add`, `bun remove`, `bun run <script>`). Never npm/yarn/pnpm.
- Imports use the `@/` alias; no new deep relative imports.
- No `any`, no unsafe casts, no unnecessary non-null assertions.
- All user-facing text stays in Turkish via i18n `t()` calls with the existing default-string pattern already used in the touched files — do not introduce new hardcoded strings that bypass it.
- After every task: the file(s) touched in that task must pass `bun run typecheck`. Full `bun run typecheck && bun run lint && bun test` runs at the end (Task 20) and must be clean.
- No feature flags, no staged rollout — every task lands the final local-only behavior directly, no dead "if (false)" branches left behind.
- Preserve existing behavior/formulas exactly when porting logic from `convex/*.ts` (XP thresholds, streak freeze rules, achievement thresholds) — this is a platform migration, not a rebalance.

---

### Task 1: Local gamification engine (pure port of `convex/gamification.ts`)

**Files:**
- Create: `src/utils/gamification.ts`
- Test: `src/utils/__tests__/gamification.test.ts`

**Interfaces:**
- Consumes: `XP_SOURCES`, `getLevelFromXp` from `@/constants/gamification` (already exist, unchanged).
- Produces: `processGamification(input: GamificationInput): GamificationResult`, and the `GamificationInput`/`GamificationResult` types, for Task 2 (store) and Task 3 (`useCreateSession.ts`) to import.

This is a straight port of `convex/gamification.ts`'s `processGamification` (read at `convex/gamification.ts:8-108`) to a pure function with no database — the caller passes in the current xp/level/unlocked-ids and gets back the new state plus what was newly unlocked this call. Preserve the original's exact quirks: base XP is always awarded, the daily-goal bonus is additive, and the `xp_1000` achievement is checked *after* this session's XP is added (and awarding it adds a second `ACHIEVEMENT_UNLOCKED` bonus on top) — do not "fix" this, it's the existing behavior being migrated.

- [ ] **Step 1: Write the failing test**

```typescript
// src/utils/__tests__/gamification.test.ts
import { expect, test, describe } from "bun:test";
import { processGamification, type GamificationInput } from "../gamification";

const baseInput: GamificationInput = {
  xp: 0,
  level: 1,
  unlockedAchievementIds: [],
  sessionScore: 100,
  sessionWpm: undefined,
  sessionComp: undefined,
  sessionCount: 5,
  currentStreak: 1,
  isDailyGoalCompleted: false,
};

describe("processGamification", () => {
  test("awards base XP for a plain session", () => {
    const result = processGamification(baseInput);
    expect(result.xp).toBe(10); // XP_SOURCES.EXERCISE_COMPLETED
    expect(result.newlyUnlockedAchievementIds).toEqual([]);
    expect(result.levelUp).toBe(false);
  });

  test("adds the daily goal bonus", () => {
    const result = processGamification({ ...baseInput, isDailyGoalCompleted: true });
    expect(result.xp).toBe(60); // 10 + 50 (DAILY_GOAL_COMPLETED)
  });

  test("unlocks first_exercise exactly on sessionCount === 1", () => {
    const result = processGamification({ ...baseInput, sessionCount: 1 });
    expect(result.newlyUnlockedAchievementIds).toEqual(["first_exercise"]);
    expect(result.unlockedAchievementIds).toEqual(["first_exercise"]);
    expect(result.xp).toBe(110); // 10 base + 100 achievement bonus
  });

  test("does not re-award an already-unlocked achievement", () => {
    const result = processGamification({
      ...baseInput,
      sessionCount: 1,
      unlockedAchievementIds: ["first_exercise"],
    });
    expect(result.newlyUnlockedAchievementIds).toEqual([]);
    expect(result.xp).toBe(10);
  });

  test("unlocks streak_7 at currentStreak >= 7", () => {
    const result = processGamification({ ...baseInput, currentStreak: 7 });
    expect(result.newlyUnlockedAchievementIds).toContain("streak_7");
  });

  test("unlocks wpm_300 at sessionWpm >= 300", () => {
    const result = processGamification({ ...baseInput, sessionWpm: 300 });
    expect(result.newlyUnlockedAchievementIds).toContain("wpm_300");
  });

  test("unlocks comp_90 at sessionComp >= 0.9 (0-1 ratio, not percent)", () => {
    const result = processGamification({ ...baseInput, sessionComp: 0.9 });
    expect(result.newlyUnlockedAchievementIds).toContain("comp_90");
    const missed = processGamification({ ...baseInput, sessionComp: 90 });
    expect(missed.newlyUnlockedAchievementIds).not.toContain("comp_90");
  });

  test("unlocks xp_1000 and adds the extra achievement bonus once crossed", () => {
    const result = processGamification({ ...baseInput, xp: 995 });
    // 995 + 10 base = 1005 >= 1000 -> award xp_1000 (+100) -> 1105
    expect(result.newlyUnlockedAchievementIds).toContain("xp_1000");
    expect(result.xp).toBe(1105);
  });

  test("computes level and levelUp from the new xp total", () => {
    // Level 2 threshold is 100 xp (getXpThresholdForLevel(2) = 1*2*50 = 100)
    const result = processGamification({ ...baseInput, xp: 95 });
    expect(result.xp).toBe(105);
    expect(result.level).toBe(2);
    expect(result.levelUp).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/utils/__tests__/gamification.test.ts`
Expected: FAIL — `Cannot find module '../gamification'` (or similar), since the file doesn't exist yet.

- [ ] **Step 3: Write the implementation**

```typescript
// src/utils/gamification.ts
import { ACHIEVEMENTS, XP_SOURCES, getLevelFromXp } from "@/constants/gamification";

export interface GamificationInput {
  xp: number;
  level: number;
  unlockedAchievementIds: string[];
  sessionScore: number;
  sessionWpm?: number;
  /** 0-1 ratio, e.g. `metrics.comprehensionAccuracy` — not a percentage. */
  sessionComp?: number;
  /** Total completed sessions including this one. */
  sessionCount: number;
  currentStreak: number;
  isDailyGoalCompleted: boolean;
}

export interface GamificationResult {
  xp: number;
  level: number;
  unlockedAchievementIds: string[];
  newlyUnlockedAchievementIds: string[];
  levelUp: boolean;
}

/**
 * Pure client-side port of `convex/gamification.ts`'s `processGamification`.
 * Same thresholds, same order of checks, same xp_1000-awarded-after-adding-
 * this-session's-xp quirk — this is a platform migration, not a rebalance.
 */
export function processGamification(input: GamificationInput): GamificationResult {
  const unlocked = new Set(input.unlockedAchievementIds);
  const newlyUnlocked: string[] = [];
  let xpGained = XP_SOURCES.EXERCISE_COMPLETED;

  if (input.isDailyGoalCompleted) {
    xpGained += XP_SOURCES.DAILY_GOAL_COMPLETED;
  }

  const award = (id: string) => {
    if (!unlocked.has(id) && ACHIEVEMENTS[id]) {
      unlocked.add(id);
      newlyUnlocked.push(id);
      xpGained += XP_SOURCES.ACHIEVEMENT_UNLOCKED;
    }
  };

  if (input.sessionCount === 1) award("first_exercise");
  if (input.sessionCount === 10) award("exercise_10");
  if (input.currentStreak >= 7) award("streak_7");
  if (input.sessionWpm && input.sessionWpm >= 300) award("wpm_300");
  if (input.sessionComp !== undefined && input.sessionComp >= 0.9) award("comp_90");

  let xp = input.xp + xpGained;

  if (xp >= 1000 && !unlocked.has("xp_1000")) {
    award("xp_1000");
    xp += XP_SOURCES.ACHIEVEMENT_UNLOCKED;
  }

  const level = getLevelFromXp(xp);
  const levelUp = level > input.level;

  return {
    xp,
    level,
    unlockedAchievementIds: Array.from(unlocked),
    newlyUnlockedAchievementIds: newlyUnlocked,
    levelUp,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test src/utils/__tests__/gamification.test.ts`
Expected: PASS, all 9 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/utils/gamification.ts src/utils/__tests__/gamification.test.ts
git commit -m "feat: add local gamification engine (port of convex/gamification.ts)"
```

---

### Task 2: Persist xp/level/achievements in `gamificationStore`

**Files:**
- Modify: `src/stores/gamificationStore.ts`
- Test: `src/stores/__tests__/gamificationStore.test.ts` (new)

**Interfaces:**
- Consumes: `GamificationResult` from `@/utils/gamification` (Task 1), `userScopedStorageAdapter` from `@/stores/storage` (unchanged interface).
- Produces: `useGamificationStore` gains `xp: number`, `level: number`, `unlockedAchievementIds: string[]`, `applyResult: (result: GamificationResult) => void`, `resetProgress: () => void` — Task 3 (`useCreateSession.ts`) and Task 15 (`settings.tsx` reset-stats) depend on these exact names.

The store today (`src/stores/gamificationStore.ts:1-27`) only holds the achievement-popup queue and isn't persisted at all. Add persistence and the xp/level/achievement fields alongside the existing popup-queue fields, keeping `addAchievement`/`removeAchievement`/`clearAchievements` unchanged so `AchievementPopupGlobal` (`src/components/gamification/AchievementPopup.tsx`) doesn't need to change.

- [ ] **Step 1: Write the failing test**

```typescript
// src/stores/__tests__/gamificationStore.test.ts
import { expect, test, describe, beforeEach } from "bun:test";
import { useGamificationStore } from "../gamificationStore";

describe("useGamificationStore", () => {
  beforeEach(() => {
    useGamificationStore.setState({
      xp: 0,
      level: 1,
      unlockedAchievementIds: [],
      pendingAchievements: [],
    });
  });

  test("applyResult merges xp/level/unlockedAchievementIds", () => {
    useGamificationStore.getState().applyResult({
      xp: 110,
      level: 1,
      unlockedAchievementIds: ["first_exercise"],
      newlyUnlockedAchievementIds: ["first_exercise"],
      levelUp: false,
    });
    const state = useGamificationStore.getState();
    expect(state.xp).toBe(110);
    expect(state.unlockedAchievementIds).toEqual(["first_exercise"]);
  });

  test("resetProgress clears xp/level/achievements but not the popup queue helpers", () => {
    useGamificationStore.getState().applyResult({
      xp: 500,
      level: 3,
      unlockedAchievementIds: ["first_exercise", "streak_7"],
      newlyUnlockedAchievementIds: [],
      levelUp: false,
    });
    useGamificationStore.getState().resetProgress();
    const state = useGamificationStore.getState();
    expect(state.xp).toBe(0);
    expect(state.level).toBe(1);
    expect(state.unlockedAchievementIds).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/stores/__tests__/gamificationStore.test.ts`
Expected: FAIL — `applyResult is not a function`.

- [ ] **Step 3: Write the implementation**

```typescript
// src/stores/gamificationStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { userScopedStorageAdapter } from "./storage";
import type { GamificationResult } from "@/utils/gamification";

export type AchievementPopupData = {
  id: string;
  title: string;
  icon: string;
};

interface GamificationState {
  xp: number;
  level: number;
  unlockedAchievementIds: string[];
  pendingAchievements: AchievementPopupData[];
  applyResult: (result: GamificationResult) => void;
  addAchievement: (achievement: AchievementPopupData) => void;
  removeAchievement: (id: string) => void;
  clearAchievements: () => void;
  resetProgress: () => void;
}

const initialState = {
  xp: 0,
  level: 1,
  unlockedAchievementIds: [] as string[],
  pendingAchievements: [] as AchievementPopupData[],
};

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set) => ({
      ...initialState,
      applyResult: (result) =>
        set({
          xp: result.xp,
          level: result.level,
          unlockedAchievementIds: result.unlockedAchievementIds,
        }),
      addAchievement: (achievement) =>
        set((state) => ({
          pendingAchievements: [...state.pendingAchievements, achievement],
        })),
      removeAchievement: (id) =>
        set((state) => ({
          pendingAchievements: state.pendingAchievements.filter((a) => a.id !== id),
        })),
      clearAchievements: () => set({ pendingAchievements: [] }),
      resetProgress: () =>
        set({ xp: 0, level: 1, unlockedAchievementIds: [] }),
    }),
    {
      name: "gamification-store",
      storage: createJSONStorage(() => userScopedStorageAdapter),
      version: 1,
    },
  ),
);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test src/stores/__tests__/gamificationStore.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/stores/gamificationStore.ts src/stores/__tests__/gamificationStore.test.ts
git commit -m "feat: persist xp/level/achievements in gamificationStore"
```

---

### Task 3: Rewrite `useCreateSession.ts` — local streak + gamification for everyone

**Files:**
- Modify: `src/hooks/useCreateSession.ts`

**Interfaces:**
- Consumes: `calculateStreakUpdate`, `getLocalDateString` from `@/utils/streak` (unchanged); `processGamification` from `@/utils/gamification` (Task 1); `useGamificationStore` (Task 2); `useStreakCacheStore` (unchanged, `src/stores/streakCacheStore.ts`); `DAILY_PLAN_SIZE` from `@/utils/dailyPlan` (unchanged); `ACHIEVEMENTS` from `@/constants/gamification` (unchanged).
- Produces: same `CreateSessionArgs` type and same returned shape `{ sessionId: string, gamification: { unlockedAchievements: string[] } | null }` — exercise screens calling this hook (via the exercise engines) don't need to change.

This is the write path every exercise completion goes through. Today (`src/hooks/useCreateSession.ts:24-95`) it only runs adaptive-difficulty progression and local history for everyone, and gates the Convex progress mutation + streak/gamification (which currently only happens server-side) behind `isSignedIn && isPremium`. After this task streak and gamification run locally for every session, and there's an explicit idempotency guard so a duplicate call for the same `clientSessionId` (double-tap, retried effect) can't double-award XP — `localHistoryStore.addSession` already silently no-ops on a duplicate id, but this hook has no way to know that happened, so it must check first.

- [ ] **Step 1: Replace the hook implementation**

```typescript
// src/hooks/useCreateSession.ts
import { useLocalHistoryStore } from "@/stores/localHistoryStore";
import { useExerciseProgressStore } from "@/stores/exerciseProgressStore";
import { useStreakCacheStore } from "@/stores/streakCacheStore";
import { useGamificationStore } from "@/stores/gamificationStore";
import { calculateNextProgression } from "@/utils/adaptiveDifficulty";
import { calculateStreakUpdate, getLocalDateString } from "@/utils/streak";
import { processGamification } from "@/utils/gamification";
import { DAILY_PLAN_SIZE } from "@/utils/dailyPlan";
import { ACHIEVEMENTS } from "@/constants/gamification";
import { ProgressionState, ExerciseResult } from "@/types/exercise";

export interface CreateSessionArgs {
  clientSessionId: string;
  exerciseId: string;
  exerciseType: string;
  startedAt: number;
  completedAt: number;
  durationMs: number;
  difficulty: number;
  score: number;
  metrics?: Record<string, unknown>;
  algorithmVersion: number;
}

export function useCreateSession() {
  const addLocalSession = useLocalHistoryStore((state) => state.addSession);
  const getExerciseMetrics = useExerciseProgressStore((state) => state.getExerciseMetrics);
  const updateExerciseMetrics = useExerciseProgressStore((state) => state.updateExerciseMetrics);

  // `result` is the raw ExerciseResult the engine produced; `args` is its
  // flattened session shape. Adaptive progression needs the former
  // (result.score.accuracy etc.), so it must be passed explicitly rather
  // than inferred from `args` - args.score is a plain number.
  return async (args: CreateSessionArgs, result?: ExerciseResult) => {
    // Idempotency guard: addLocalSession silently no-ops on a duplicate
    // clientSessionId, but streak/gamification below have no way to know
    // that happened, so a double-tap or retried call must not double-run them.
    const alreadyRecorded = useLocalHistoryStore
      .getState()
      .sessions.some((s) => s.clientSessionId === args.clientSessionId);
    if (alreadyRecorded) {
      return { sessionId: "local", gamification: null };
    }

    if (result) {
      const currentMetrics = getExerciseMetrics(result.exerciseId);
      const currentProgression: ProgressionState = {
        currentLevel: currentMetrics.currentDifficulty,
        consecutiveSuccesses: currentMetrics.consecutiveSuccesses || 0,
        consecutiveFailures: currentMetrics.consecutiveFailures || 0,
        historicalBest: currentMetrics.historicalBestLevel || 1,
      };

      const newProgression = calculateNextProgression(result, currentProgression);

      updateExerciseMetrics(result.exerciseId, {
        currentDifficulty: newProgression.currentLevel,
        consecutiveSuccesses: newProgression.consecutiveSuccesses,
        consecutiveFailures: newProgression.consecutiveFailures,
        historicalBestLevel: newProgression.historicalBest,
        bestScore: result.score.finalScore,
        bestWpm: result.metrics?.wpm,
        bestAccuracy: result.score.accuracy,
        bestComprehension: result.metrics?.comprehensionAccuracy,
      });
    }

    // Every session is recorded in the on-device 6-month history - that is
    // what the dashboard, the daily limit and the per-exercise charts read.
    addLocalSession(args);

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    // Streak
    const streakState = useStreakCacheStore.getState();
    const newStreak = calculateStreakUpdate(
      {
        currentStreak: streakState.currentStreak,
        longestStreak: streakState.longestStreak,
        lastActivityAt: streakState.lastActivityAt,
        freezesAvailable: streakState.freezesAvailable,
      },
      args.completedAt,
      timeZone,
    );
    streakState.updateCache(newStreak);

    // Gamification - today's session count drives the daily-goal XP bonus;
    // total session count (capped by the 6-month local retention window,
    // same as the rest of the dashboard) drives the count-based achievements.
    const { sessions } = useLocalHistoryStore.getState();
    const todayStr = getLocalDateString(args.completedAt, timeZone);
    const todaysSessionCount = sessions.filter(
      (s) => getLocalDateString(s.completedAt, timeZone) === todayStr,
    ).length;
    const isDailyGoalCompleted = todaysSessionCount === DAILY_PLAN_SIZE;

    const gamificationState = useGamificationStore.getState();
    const gamificationResult = processGamification({
      xp: gamificationState.xp,
      level: gamificationState.level,
      unlockedAchievementIds: gamificationState.unlockedAchievementIds,
      sessionScore: args.score,
      sessionWpm: result?.metrics?.wpm,
      sessionComp: result?.metrics?.comprehensionAccuracy,
      sessionCount: sessions.length,
      currentStreak: newStreak.currentStreak,
      isDailyGoalCompleted,
    });
    gamificationState.applyResult(gamificationResult);
    gamificationResult.newlyUnlockedAchievementIds.forEach((id) => {
      const definition = ACHIEVEMENTS[id];
      if (definition) {
        gamificationState.addAchievement({
          id: definition.id,
          title: definition.title,
          icon: definition.icon,
        });
      }
    });

    return {
      sessionId: "local",
      gamification:
        gamificationResult.newlyUnlockedAchievementIds.length > 0
          ? { unlockedAchievements: gamificationResult.newlyUnlockedAchievementIds }
          : null,
    };
  };
}
```

- [ ] **Step 2: Typecheck**

Run: `bun run typecheck`
Expected: no new errors from `src/hooks/useCreateSession.ts` (errors from files not yet touched by later tasks — e.g. still-Convex-importing screens — are expected until Task 18 removes `convex/`; ignore those for now and confirm only that this file itself type-checks clean by eye — it no longer imports `convex/react` or `@clerk/clerk-expo`).

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useCreateSession.ts
git commit -m "feat: run streak and gamification locally for every session"
```

---

### Task 4: Onboarding — persist goal/initial-assessment locally for everyone

**Files:**
- Modify: `src/features/onboarding/OnboardingScreen.tsx`

**Interfaces:**
- Consumes: `useSettingsStore.setDailyGoalMinutes` (exists, `src/stores/settingsStore.ts:34`), `useUserProgressStore.updateBestWpm` / `updateBestComprehension` (exist, `src/stores/userProgressStore.ts:43-48`, currently never called from anywhere — this is the first real writer).

Today `OnboardingScreen.tsx:100-136` only calls the Convex `completeOnboarding` mutation `if (isSignedIn)`, so for a guest none of `trainingGoalMins`/`initialWpm`/`initialComprehension` survive onboarding — only `hasCompletedOnboarding` does. `trainingGoalMins` already has a local home: `useSettingsStore.dailyGoalMinutes`, read directly by `src/app/(app)/(tabs)/index.tsx:25,77`. `initialWpm`/`initialComprehension` already have a local home too: `useUserProgressStore.bestWpm`/`bestComprehension`, already read as the guest fallback in `index.tsx:81,83-85` — they're just never written. Wire both. (`startingDifficulty` and `onboardingReason` are dropped: neither is read anywhere in the app today, client or server — porting them would be new dead code, not a behavior fix. Note this explicitly so it isn't mistaken for an oversight.)

- [ ] **Step 1: Replace the Clerk/Convex onboarding-completion code**

Remove these imports:
```typescript
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useAuth } from "@clerk/clerk-expo";
```

Add:
```typescript
import { useUserProgressStore } from "@/stores/userProgressStore";
```

Replace this block:
```typescript
  const { isSignedIn } = useAuth();
  const setHasCompletedOnboarding = useSettingsStore(s => s.setHasCompletedOnboarding);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
```
with:
```typescript
  const setHasCompletedOnboarding = useSettingsStore(s => s.setHasCompletedOnboarding);
  const setDailyGoalMinutes = useSettingsStore(s => s.setDailyGoalMinutes);
  const updateBestWpm = useUserProgressStore(s => s.updateBestWpm);
  const updateBestComprehension = useUserProgressStore(s => s.updateBestComprehension);
```

Replace the body of `handleAnswer` from the `try { ... }` block onward:
```typescript
    try {
      setDailyGoalMinutes(goal || 10);
      updateBestWpm(initialWpm);
      updateBestComprehension(comprehension / 100);

      setHasCompletedOnboarding(true);
      analytics.track("onboarding_completed");
      router.replace("/(app)/(tabs)");
    } catch (e) {
      captureException(e, { context: 'OnboardingScreen.handleFinish' });
      setIsSubmitting(false);
    }
```
(`comprehension` is already 0-100 in this file per the existing `isCorrect ? 100 : 50` above it — `updateBestComprehension` expects a 0-1 ratio, matching `bestComprehension`'s other reader in `index.tsx:85` which multiplies by 100, so divide by 100 here.)

- [ ] **Step 2: Typecheck**

Run: `bun run typecheck`
Expected: `src/features/onboarding/OnboardingScreen.tsx` has no errors and no remaining `@clerk/clerk-expo` or `convex/react` imports (`grep -n "clerk\|convex" src/features/onboarding/OnboardingScreen.tsx` returns nothing).

- [ ] **Step 3: Commit**

```bash
git add src/features/onboarding/OnboardingScreen.tsx
git commit -m "feat: persist onboarding goal and initial assessment locally for all users"
```

---

### Task 5: `RevenueCatProvider` — drop Clerk identity linking

**Files:**
- Modify: `src/providers/RevenueCatProvider.tsx`

RevenueCat stays anonymous/device-based (per the design spec's decision that subscriptions are already device/store-account-bound, not app-account-bound). Remove the `useAuth`/`Purchases.logIn`/`Purchases.logOut` effect (`src/providers/RevenueCatProvider.tsx:69-109`) entirely — only the mount-time `Purchases.configure()` + `getCustomerInfo()` effect (`:27-67`) remains.

- [ ] **Step 1: Remove the Clerk import and the identity-sync effect**

Remove:
```typescript
import { useAuth } from '@clerk/clerk-expo';
```
and
```typescript
  const { isLoaded, isSignedIn, userId } = useAuth();
```
and the entire second `useEffect` (`:69-109`, the one containing `syncUser`).

- [ ] **Step 2: Typecheck**

Run: `bun run typecheck`
Expected: no errors in `src/providers/RevenueCatProvider.tsx`; `grep -n clerk src/providers/RevenueCatProvider.tsx` returns nothing.

- [ ] **Step 3: Commit**

```bash
git add src/providers/RevenueCatProvider.tsx
git commit -m "feat: keep RevenueCat anonymous, drop Clerk identity linking"
```

---

### Task 6: Paywall — remove the sign-in gate, delete `AuthPromptSheet`

**Files:**
- Modify: `src/features/subscription/PaywallScreen.tsx`
- Delete: `src/components/auth/AuthPromptSheet.tsx`

`PaywallScreen.tsx:12-58` only renders `RevenueCatUI.Paywall` `if (isSignedIn)`, otherwise it shows `AuthPromptSheet` asking the user to log in first. With no accounts, the paywall renders directly.

- [ ] **Step 1: Simplify `PaywallScreen.tsx`**

```typescript
// src/features/subscription/PaywallScreen.tsx
import React, { useEffect } from 'react';
import { View } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { useRouter } from 'expo-router';
import { analytics } from "@/lib/analytics";
import { useTheme } from 'tamagui';
import { SUBSCRIPTION_CONSTANTS } from '@/constants/subscription';

export default function PaywallScreen() {
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    analytics.track('paywall_viewed');
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background?.val }}>
      <RevenueCatUI.Paywall
        onPurchaseCompleted={({ customerInfo }) => {
          if (typeof customerInfo.entitlements.active[SUBSCRIPTION_CONSTANTS.ENTITLEMENT_ID] !== 'undefined') {
            analytics.track('subscription_started');
            router.back();
          }
        }}
        onRestoreCompleted={({ customerInfo }) => {
          if (typeof customerInfo.entitlements.active[SUBSCRIPTION_CONSTANTS.ENTITLEMENT_ID] !== 'undefined') {
            router.back();
          }
        }}
        onDismiss={() => {
          router.back();
        }}
      />
    </View>
  );
}
```

(Dropped the unused `useTranslation`/`t` import along with the deleted auth-prompt copy — nothing else in this file used `t`.)

- [ ] **Step 2: Delete `AuthPromptSheet.tsx`**

```bash
git rm src/components/auth/AuthPromptSheet.tsx
```

- [ ] **Step 3: Typecheck**

Run: `bun run typecheck`
Expected: no errors; `grep -rn "AuthPromptSheet" src` returns nothing.

- [ ] **Step 4: Commit**

```bash
git add src/features/subscription/PaywallScreen.tsx
git commit -m "feat: paywall renders directly, no sign-in gate"
```

---

### Task 7: `useAdaptiveExerciseStart` — drop the remote-progress branch

**Files:**
- Modify: `src/hooks/useAdaptiveExerciseStart.ts`
- Modify: `src/hooks/__tests__/useAdaptiveExerciseStart.test.ts`

`useAdaptiveExerciseStart.ts:1-68` picks between a Convex `getProgress` query and local `exerciseProgressStore` metrics based on `isSignedIn && isPremium`. Local becomes the only path.

- [ ] **Step 1: Rewrite the hook**

```typescript
// src/hooks/useAdaptiveExerciseStart.ts
import { getAdaptiveConfig } from "@/utils/difficultyMapper";
import { ExerciseDefinition, ProgressionState, DifficultyLevel } from "@/types/exercise";
import { useMemo } from 'react';
import { useExerciseProgressStore } from "@/stores/exerciseProgressStore";

export function useAdaptiveExerciseStart(definition: ExerciseDefinition | undefined) {
  const getExerciseMetrics = useExerciseProgressStore(state => state.getExerciseMetrics);
  const localMetrics = useMemo(() => definition ? getExerciseMetrics(definition.id) : null, [definition, getExerciseMetrics]);

  const finalProgress = useMemo(() => {
    if (!definition || !localMetrics) return undefined;
    return {
      currentLevel: localMetrics.currentDifficulty,
      consecutiveSuccesses: localMetrics.consecutiveSuccesses,
      consecutiveFailures: localMetrics.consecutiveFailures,
      historicalBest: localMetrics.historicalBestLevel,
    } as ProgressionState;
  }, [definition, localMetrics]);

  const config = useMemo(() => {
    if (finalProgress === undefined || !definition) return null;
    const adaptiveParams = getAdaptiveConfig(definition.type, finalProgress.currentLevel as DifficultyLevel);
    return {
      ...definition.defaultConfig,
      ...adaptiveParams,
      initialDifficulty: finalProgress.currentLevel,
    };
  }, [finalProgress, definition]);

  return {
    isReady: config !== null && definition !== undefined,
    config,
    progressionState: finalProgress,
  };
}
```

- [ ] **Step 2: Rewrite the test to match — drop the auth/premium/remote scenarios**

```typescript
// src/hooks/__tests__/useAdaptiveExerciseStart.test.ts
import { expect, test, describe, mock, beforeEach } from "bun:test";
import { renderHook } from '@testing-library/react-hooks';
import { useAdaptiveExerciseStart } from "../useAdaptiveExerciseStart";
import { ExerciseDefinition } from "@/types/exercise";

const mockGetExerciseMetrics = mock(() => ({
  currentDifficulty: 1,
  consecutiveSuccesses: 0,
  consecutiveFailures: 0,
  historicalBestLevel: 1,
}));

mock.module("@/stores/exerciseProgressStore", () => ({
  useExerciseProgressStore: mock((selector) => selector({ getExerciseMetrics: mockGetExerciseMetrics })),
}));

mock.module("@/utils/difficultyMapper", () => ({
  getAdaptiveConfig: mock((type, level) => {
    if (type === 'rsvp') return { wpm: 100 + (level * 50) };
    return {};
  }),
}));

describe("useAdaptiveExerciseStart", () => {
  const dummyDef: ExerciseDefinition = {
    id: "ex-1",
    type: "rsvp",
    category: "reading",
    nameKey: "rsvp.name",
    descriptionKey: "rsvp.description",
    defaultConfig: { wpm: 150 },
    isPremium: false,
  };

  beforeEach(() => {
    mockGetExerciseMetrics.mockClear();
    mockGetExerciseMetrics.mockReturnValue({
      currentDifficulty: 1,
      consecutiveSuccesses: 0,
      consecutiveFailures: 0,
      historicalBestLevel: 1,
    });
  });

  test("Returns not ready if definition is undefined", () => {
    const { result } = renderHook(() => useAdaptiveExerciseStart(undefined));
    expect(result.current.isReady).toBe(false);
    expect(result.current.config).toBeNull();
  });

  test("Uses local progression at the default level", () => {
    const { result } = renderHook(() => useAdaptiveExerciseStart(dummyDef));
    expect(result.current.isReady).toBe(true);
    expect(result.current.progressionState?.currentLevel).toBe(1);
    expect((result.current.config as any)?.wpm).toBe(150); // 100 + (1 * 50)
  });

  test("Uses local progression at a higher level", () => {
    mockGetExerciseMetrics.mockReturnValue({
      currentDifficulty: 3,
      consecutiveSuccesses: 1,
      consecutiveFailures: 0,
      historicalBestLevel: 3,
    });
    const { result } = renderHook(() => useAdaptiveExerciseStart(dummyDef));
    expect(result.current.isReady).toBe(true);
    expect(result.current.progressionState?.currentLevel).toBe(3);
    expect((result.current.config as any)?.wpm).toBe(250); // 100 + (3 * 50)
  });
});
```

- [ ] **Step 3: Run the test**

Run: `bun test src/hooks/__tests__/useAdaptiveExerciseStart.test.ts`
Expected: PASS, 3 tests green.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useAdaptiveExerciseStart.ts src/hooks/__tests__/useAdaptiveExerciseStart.test.ts
git commit -m "feat: useAdaptiveExerciseStart always uses local progress"
```

---

### Task 8: `useExerciseLimits` — drop the remote stats branch

**Files:**
- Modify: `src/hooks/useExerciseLimits.ts`
- Modify: `src/hooks/__tests__/useExerciseLimits.test.ts`

`useExerciseLimits.ts:1-79` queries `api.statistics.getPerformanceStats` only `if (isPremium)` purely to gate a loading state (the premium branch's own count is always `Infinity`, it never reads `stats`'s content) — since it's `Infinity` regardless, the query and its loading state are unnecessary once there's no server. Premium becomes an immediate `{ canStartExercise: true, remainingExercises: Infinity }`, free/guest keeps the exact same local-history-based counting it already has.

- [ ] **Step 1: Rewrite the hook**

```typescript
// src/hooks/useExerciseLimits.ts
import { SUBSCRIPTION_CONSTANTS } from "@/constants/subscription";
import { useRevenueCat } from "@/providers/RevenueCatProvider";
import { getLocalDateString } from "@/utils/streak";
import { useMemo, useState, useEffect } from "react";
import { useAppState } from "@/hooks/useAppState";
import { useLocalHistoryStore } from "@/stores/localHistoryStore";

export function useExerciseLimits() {
  const { isPremium, isConfigured } = useRevenueCat();
  const appState = useAppState();

  const [todayStr, setTodayStr] = useState(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    return getLocalDateString(Date.now(), timeZone);
  });

  useEffect(() => {
    if (appState === 'active') {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTodayStr(getLocalDateString(Date.now(), timeZone));
    }
  }, [appState]);

  const localSessions = useLocalHistoryStore(s => s.sessions);

  return useMemo(() => {
    if (!isConfigured) {
      return {
        canStartExercise: false,
        isLoading: true,
        remainingExercises: 0,
        isPremium,
      };
    }

    if (isPremium) {
      return {
        canStartExercise: true,
        isLoading: false,
        remainingExercises: Infinity,
        isPremium,
      };
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const sessionsToday = localSessions.filter(
      (s) => getLocalDateString(s.completedAt, timeZone) === todayStr
    ).length;

    const max = SUBSCRIPTION_CONSTANTS.FREE_TIER.MAX_DAILY_EXERCISES;
    const remaining = Math.max(0, max - sessionsToday);

    return {
      canStartExercise: remaining > 0,
      isLoading: false,
      remainingExercises: remaining,
      isPremium,
    };
  }, [isPremium, isConfigured, todayStr, localSessions]);
}
```

- [ ] **Step 2: Update the test — drop `convex/react` mocking and the "stats undefined -> loading" premium case**

In `src/hooks/__tests__/useExerciseLimits.test.ts`, remove the `mock.module("convex/react", ...)` block and the `mockUseQuery` variable entirely, and update:
- `"Returns loading state when not configured or stats are undefined"` — keep only the `isConfigured: false` case (drop the `mockUseQuery.mockReturnValue(undefined)` line, it no longer exists).
- `"Premium user can always start exercise, ignores limits"` — remove `mockUseQuery.mockReturnValue(...)`, keep the rest (`isPremium: true` alone should immediately yield `isLoading: false`, `remainingExercises: Infinity`).
- All other tests already exercise the free/guest local-history path and mock `useRevenueCat`/`useLocalHistoryStore`/`useAppState` — remove any leftover `mockUseQuery` references from them but keep their assertions as-is.

- [ ] **Step 3: Run the test**

Run: `bun test src/hooks/__tests__/useExerciseLimits.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useExerciseLimits.ts src/hooks/__tests__/useExerciseLimits.test.ts
git commit -m "feat: useExerciseLimits drops the unused remote stats query"
```

---

### Task 9: Weekly summary — local data for everyone, drop the server-push branch

**Files:**
- Modify: `src/features/weeklySummary/useWeeklySummary.ts`
- Modify: `src/services/notifications.ts`
- Modify: `src/app/(app)/(tabs)/settings.tsx` (call-site signature change only — see Task 15 for the rest of that file's rewrite; do the two `scheduleWeeklySummaryNotification(...)` call sites here so this task's diff type-checks standalone)

`useWeeklySummary.ts:1-58` picks between `api.statistics.getPerformanceStats` and `buildLocalStats` based on `isSignedIn && isPremium`; local becomes the only source. `notifications.ts`'s `scheduleWeeklySummaryNotification(isPremium: boolean)` (`:218-240`) cancels the local notification `if (isPremium)` because premium users used to get a personalized server push instead (`convex/weeklySummary.ts`, being deleted in Task 18) — with no server push left, the local notification is unconditional for everyone, so the parameter is dropped.

- [ ] **Step 1: Rewrite `useWeeklySummary.ts`**

```typescript
// src/features/weeklySummary/useWeeklySummary.ts
import { useMemo, useState } from 'react';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { useStreakCacheStore } from '@/stores/streakCacheStore';
import { getLocalDateString } from '@/utils/streak';
import { buildLocalStats, type PerformanceStats } from '@/utils/localStatistics';
import { buildWeeklySummary, type DailyStatInput, type WeeklySummary } from '@/utils/weeklySummary';

export function useWeeklySummary(): {
  summary: WeeklySummary | null;
  dailyTrends: PerformanceStats['dailyTrends'] | null;
  now: number;
  timeZone: string;
  isLoading: boolean;
} {
  const currentStreak = useStreakCacheStore((s) => s.currentStreak);
  const localSessions = useLocalHistoryStore((s) => s.sessions);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  // eslint-disable-next-line react-hooks/purity
  const [now] = useState(() => Date.now());
  const today = getLocalDateString(now, timeZone);

  const dailyTrends = useMemo<PerformanceStats['dailyTrends']>(
    () => buildLocalStats(localSessions, '30d', now, timeZone).dailyTrends,
    [localSessions, now, timeZone],
  );

  const summary = useMemo(() => {
    const dailyStats: DailyStatInput[] = dailyTrends.map((d) => ({
      date: d.date,
      durationMs: d.durationMs,
      avgWpm: d.avgWpm,
      sessionCount: d.sessionCount,
    }));

    return buildWeeklySummary(dailyStats, today, currentStreak);
  }, [dailyTrends, today, currentStreak]);

  return { summary, dailyTrends, now, timeZone, isLoading: false };
}
```

- [ ] **Step 2: Drop the `isPremium` parameter in `scheduleWeeklySummaryNotification`**

In `src/services/notifications.ts`, replace:
```typescript
export async function scheduleWeeklySummaryNotification(isPremium: boolean) {
  const settings = useSettingsStore.getState();

  if (isPremium || !settings.notificationsEnabled || !settings.progressNotificationsEnabled) {
```
with:
```typescript
export async function scheduleWeeklySummaryNotification() {
  const settings = useSettingsStore.getState();

  if (!settings.notificationsEnabled || !settings.progressNotificationsEnabled) {
```
and update the doc comment above it (`:207-217`) to drop the "Premium users get the personalized server push instead" paragraph, since that no longer exists.

- [ ] **Step 3: Update the two call sites in `settings.tsx`**

Change both:
```typescript
    scheduleWeeklySummaryNotification(isPremium).catch(console.error);
```
occurrences (in `handleToggleNotifications` and the progress-notifications switch handler) to:
```typescript
    scheduleWeeklySummaryNotification().catch(console.error);
```

- [ ] **Step 4: Typecheck**

Run: `bun run typecheck`
Expected: no errors in the three touched files (`settings.tsx` will still have other Convex/Clerk errors until Task 15 — confirm by eye that only the `scheduleWeeklySummaryNotification` call sites changed correctly, don't chase unrelated errors in this file yet).

- [ ] **Step 5: Commit**

```bash
git add src/features/weeklySummary/useWeeklySummary.ts src/services/notifications.ts src/app/\(app\)/\(tabs\)/settings.tsx
git commit -m "feat: weekly summary uses local data only, local notification for everyone"
```

---

### Task 10: `DailyPlanCard` — drop the remote stats branch

**Files:**
- Modify: `src/features/dailyPlan/DailyPlanCard.tsx`

Same pattern as Task 9: `DailyPlanCard.tsx:20-59` picks `api.statistics.getPerformanceStats` vs `buildLocalStats` on `isSignedIn && isPremium`; local becomes the only path, and `statsReady` collapses to always `true` (nothing async left to wait for).

- [ ] **Step 1: Rewrite the component**

```typescript
// src/features/dailyPlan/DailyPlanCard.tsx
import { useEffect, useMemo, useState } from 'react';
import { Card, H4, Text, YStack, XStack, Button } from 'tamagui';
import { Check } from 'lucide-react-native';
import { useRouter, Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';
import { selectDailyPlan, ExercisePerformance } from '@/utils/dailyPlan';
import { getLocalDateString } from '@/utils/streak';
import { buildLocalStats } from '@/utils/localStatistics';
import { exerciseRegistry } from '@/features/exercises/registry';

const ESTIMATED_MINUTES_PER_EXERCISE = 3;

export function DailyPlanCard() {
  const router = useRouter();
  const { t } = useTranslation('dailyPlan');
  const { t: tExercises } = useTranslation('exercises');

  const localSessions = useLocalHistoryStore((s) => s.sessions);
  const exerciseTypes = useDailyPlanStore((s) => s.exerciseTypes);
  const completedTypes = useDailyPlanStore((s) => s.completedTypes);
  const lastPlanTypes = useDailyPlanStore((s) => s.lastPlanTypes);
  const ensureTodayPlan = useDailyPlanStore((s) => s.ensureTodayPlan);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  // eslint-disable-next-line react-hooks/purity
  const [now] = useState(() => Date.now());
  const today = getLocalDateString(now, timeZone);

  const performanceByType = useMemo(() => {
    const exerciseStats = buildLocalStats(localSessions, '30d', now, timeZone).exerciseStats;

    const map: Record<string, ExercisePerformance> = {};
    for (const entry of exerciseStats) {
      map[entry.type] = { averageScore: entry.averageScore, attemptCount: entry.attemptCount };
    }
    return map;
  }, [localSessions, timeZone, now]);

  useEffect(() => {
    ensureTodayPlan(today, () => selectDailyPlan({ dateSeed: today, performanceByType, lastPlanTypes }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  if (exerciseTypes.length === 0) return null;

  const completedCount = completedTypes.length;
  const isAllDone = completedCount >= exerciseTypes.length;
  const firstPendingType = exerciseTypes.find((type) => !completedTypes.includes(type));

  const handlePress = () => {
    if (firstPendingType) {
      router.push(`/(app)/exercises/${firstPendingType}` as Href);
    }
  };

  return (
    <Card padding="$4" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover" elevation="$1">
      <YStack gap="$3">
        <YStack>
          <H4>{isAllDone ? t('card.completedTitle') : t('card.title')}</H4>
          {!isAllDone && (
            <Text color="$color11" fontSize="$2">
              {t('card.subtitle', {
                count: exerciseTypes.length,
                minutes: exerciseTypes.length * ESTIMATED_MINUTES_PER_EXERCISE,
              })}
            </Text>
          )}
        </YStack>

        <YStack gap="$2">
          {exerciseTypes.map((type) => {
            const definition = exerciseRegistry.getByType(type);
            const isDone = completedTypes.includes(type);
            return (
              <XStack key={type} alignItems="center" gap="$2">
                <YStack
                  width={20}
                  height={20}
                  borderRadius={10}
                  borderWidth={1}
                  borderColor={isDone ? '$green8' : '$borderColor'}
                  backgroundColor={isDone ? '$green8' : 'transparent'}
                  alignItems="center"
                  justifyContent="center"
                >
                  {isDone && <Check size={12} color="white" />}
                </YStack>
                <Text
                  textDecorationLine={isDone ? 'line-through' : 'none'}
                  color={isDone ? '$color11' : '$color'}
                >
                  {definition ? tExercises(definition.nameKey, type) : type}
                </Text>
              </XStack>
            );
          })}
        </YStack>

        {!isAllDone && (
          <Button size="$5" theme="accent" fontWeight="bold" onPress={handlePress}>
            {completedCount === 0 ? t('card.start') : t('card.continue')}
          </Button>
        )}
      </YStack>
    </Card>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `bun run typecheck`
Expected: no errors in `src/features/dailyPlan/DailyPlanCard.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/features/dailyPlan/DailyPlanCard.tsx
git commit -m "feat: daily plan uses local stats only"
```

---

### Task 11: Streak UI — drop remote branches (fixes the weekly calendar for free users)

**Files:**
- Modify: `src/features/streak/StreakBadge.tsx`
- Modify: `src/features/streak/StreakWeeklyCalendar.tsx`

`StreakBadge.tsx:1-63` queried `api.streaks.getStreak` only `if (isPremium)`, syncing the result into `streakCacheStore` — after Task 3, `streakCacheStore` is already the live, always-current source (every session updates it), so the query and the sync effect are both dead weight; the badge reads the cache directly. `StreakWeeklyCalendar.tsx:9-54` currently `return null` for every non-premium user (`stats` is always `undefined` since the query is skipped) — this has been effectively invisible for free/guest users; switching to `buildLocalStats` makes it render for everyone, which is a real (welcome) behavior change, not a side effect to hide.

- [ ] **Step 1: Rewrite `StreakBadge.tsx`**

```typescript
// src/features/streak/StreakBadge.tsx
import React from 'react';
import { Text, XStack } from 'tamagui';
import { useStreakCacheStore } from "@/stores/streakCacheStore";

export function StreakBadge() {
  const currentStreak = useStreakCacheStore((state) => state.currentStreak);
  const freezesAvailable = useStreakCacheStore((state) => state.freezesAvailable);

  if (currentStreak === 0) {
    return (
      <XStack alignItems="center" backgroundColor="$backgroundHover" paddingHorizontal="$3" paddingVertical="$2" borderRadius="$10" gap="$2">
        <Text fontSize="$5">🔥</Text>
        <Text fontWeight="bold">0</Text>
      </XStack>
    );
  }

  return (
    <XStack alignItems="center" backgroundColor="$orange3" paddingHorizontal="$3" paddingVertical="$2" borderRadius="$10" gap="$2">
      <Text fontSize="$5">🔥</Text>
      <Text fontWeight="bold" color="$orange10">{currentStreak}</Text>
      {freezesAvailable > 0 && (
        <XStack alignItems="center" gap="$1">
          <Text fontSize="$3">❄️</Text>
          <Text fontSize="$2" fontWeight="bold" color="$color11">{freezesAvailable}</Text>
        </XStack>
      )}
    </XStack>
  );
}
```

(Dropped the `analytics.track('streak_achieved', ...)` call along with the query — it fired from the query-driven `useEffect` that compared consecutive query results; re-adding an equivalent local-only version is out of scope for this migration and can be a separate follow-up if wanted.)

- [ ] **Step 2: Rewrite `StreakWeeklyCalendar.tsx`**

```typescript
// src/features/streak/StreakWeeklyCalendar.tsx
import React from 'react';
import { Text, XStack, YStack, Circle } from 'tamagui';
import { getLocalDateString } from "@/utils/streak";
import { useTranslation } from 'react-i18next';
import { useLocalHistoryStore } from "@/stores/localHistoryStore";
import { buildLocalStats } from "@/utils/localStatistics";

export function StreakWeeklyCalendar() {
  const { t } = useTranslation();
  const localSessions = useLocalHistoryStore((s) => s.sessions);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const stats = buildLocalStats(localSessions, '7d', Date.now(), timeZone);

  const today = new Date();
  const last7Days: { dateStr: string; label: string; isActive: boolean }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = getLocalDateString(d.getTime(), timeZone);
    const label = d.toLocaleDateString('tr-TR', { weekday: 'short' }).charAt(0).toUpperCase();

    const isActive = stats.dailyTrends.some(trend => trend.date === dateStr);

    last7Days.push({ dateStr, label, isActive });
  }

  return (
    <YStack backgroundColor="$backgroundHover" padding="$4" borderRadius="$4" gap="$3">
      <Text fontWeight="bold">{t('streak.weekly_activity', 'Son 7 Günlük Aktivite')}</Text>
      <XStack justifyContent="space-between" paddingHorizontal="$2">
        {last7Days.map((day, index) => (
          <YStack key={index} alignItems="center" gap="$2">
            <Circle
              size={32}
              backgroundColor={day.isActive ? '$orange9' : '$gray5'}
              borderWidth={2}
              borderColor={day.isActive ? '$orange10' : 'transparent'}
            >
              {day.isActive && <Text fontSize="$5">🔥</Text>}
            </Circle>
            <Text fontSize="$2" color="$color11">{day.label}</Text>
          </YStack>
        ))}
      </XStack>
    </YStack>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `bun run typecheck`
Expected: no errors in either file.

- [ ] **Step 4: Commit**

```bash
git add src/features/streak/StreakBadge.tsx src/features/streak/StreakWeeklyCalendar.tsx
git commit -m "feat: streak badge and weekly calendar read local data for everyone"
```

---

### Task 12: Home screen — drop the remote dashboard branch

**Files:**
- Modify: `src/app/(app)/(tabs)/index.tsx`

`index.tsx:17-93` builds `data` from `api.home.getDashboardData` when `isLoaded && isSignedIn && isPremium`, else from local sessions (`:44-93`, already correct and already the guest path). The local branch becomes unconditional; `user.displayName` stays the hardcoded `'Misafir'` string it already is for guests (there is no other display name source once accounts are gone).

- [ ] **Step 1: Rewrite the screen**

```typescript
// src/app/(app)/(tabs)/index.tsx
import React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, YStack, XStack, Card, H2, H4, Button, ScrollView } from 'tamagui';
import { useRouter } from 'expo-router';
import { StreakBadge } from "@/features/streak/StreakBadge";
import { useRevenueCat } from "@/providers/RevenueCatProvider";
import { useUserProgressStore } from '@/stores/userProgressStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { DailyPlanCard } from '@/features/dailyPlan/DailyPlanCard';
import { WeeklySummaryCard } from '@/features/weeklySummary/WeeklySummaryCard';

export default function HomeScreen() {
  const router = useRouter();
  const { isPremium } = useRevenueCat();

  const bestWpm = useUserProgressStore(state => state.bestWpm);
  const bestComprehension = useUserProgressStore(state => state.bestComprehension);
  const dailyGoalMinutes = useSettingsStore(state => state.dailyGoalMinutes);
  const localSessions = useLocalHistoryStore(state => state.sessions);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todaysSessions = localSessions.filter(s => s.completedAt >= todayStart.getTime());
  const todayTrainingMs = todaysSessions.reduce((sum, s) => sum + s.durationMs, 0);

  let totalWpm = 0, wpmCount = 0;
  let totalComp = 0, compCount = 0;
  for (const s of localSessions) {
    if (s.metrics?.wpm) {
      totalWpm += s.metrics.wpm;
      wpmCount++;
    }
    if (s.metrics?.comprehensionAccuracy !== undefined) {
      totalComp += s.metrics.comprehensionAccuracy;
      compCount++;
    }
  }

  const totalTrainingMs = localSessions.reduce((sum, s) => sum + s.durationMs, 0);

  const data = {
    user: {
      displayName: 'Misafir',
      trainingGoalMins: dailyGoalMinutes,
    },
    todayTrainingMs,
    stats: {
      avgWpm: wpmCount > 0 ? Math.round(totalWpm / wpmCount) : (bestWpm || null),
      avgComp: compCount > 0
        ? Math.round((totalComp / compCount) * 100)
        : (bestComprehension ? Math.round(bestComprehension * 100) : null),
      totalDurationMs: totalTrainingMs
    },
    recentSessions: localSessions.slice().sort((a, b) => b.completedAt - a.completedAt).slice(0, 5).map(s => ({
      _id: s.clientSessionId,
      ...s
    }))
  };

  const { user, stats, recentSessions } = data;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
      <ScrollView flex={1} backgroundColor="$background">
        <YStack padding="$4" gap="$5">

          <XStack justifyContent="space-between" alignItems="center">
            <YStack flex={1}>
              <H2>Merhaba {user.displayName ? user.displayName.split(' ')[0] : ''} 👋</H2>
              <Text color="$color11">Hoş geldin, hazır mısın?</Text>
            </YStack>
            <StreakBadge />
          </XStack>

          <DailyPlanCard />

          <WeeklySummaryCard />

          <XStack gap="$3" justifyContent="space-between">
            <Card flex={1} padding="$3" borderWidth={1} borderColor="$borderColor" alignItems="center">
              <Text color="$color11" fontSize="$2" marginBottom="$1">Ort. Hız</Text>
              <Text fontSize="$7" fontWeight="bold">{stats.avgWpm || '-'} <Text fontSize="$2">WPM</Text></Text>
            </Card>
            <Card flex={1} padding="$3" borderWidth={1} borderColor="$borderColor" alignItems="center">
              <Text color="$color11" fontSize="$2" marginBottom="$1">Kavrama</Text>
              <Text fontSize="$7" fontWeight="bold">{stats.avgComp ? `${stats.avgComp}%` : '-'}</Text>
            </Card>
            <Card flex={1} padding="$3" borderWidth={1} borderColor="$borderColor" alignItems="center">
              <Text color="$color11" fontSize="$2" marginBottom="$1">Çalışma</Text>
              <Text fontSize="$7" fontWeight="bold">{Math.floor((stats.totalDurationMs || 0) / 60000)}<Text fontSize="$2"> dk</Text></Text>
            </Card>
          </XStack>

          {!isPremium && (
            <Card padding="$4" borderWidth={1} backgroundColor="$green3" borderColor="$green7" onPress={() => router.push('/paywall')}>
              <XStack justifyContent="space-between" alignItems="center">
                <YStack flex={1}>
                  <H4 color="$green11">Premium'a Geç</H4>
                  <Text color="$green11" fontSize="$2">Sınırsız egzersiz ve detaylı analizler için hemen yükseltin.</Text>
                </YStack>
                <Button size="$3" theme="green" onPress={() => router.push('/paywall')}>İncele</Button>
              </XStack>
            </Card>
          )}

          <YStack gap="$3" marginTop="$2">
            <H4>Son Aktiviteler</H4>
            {recentSessions.length === 0 ? (
              <Text color="$color11">Henüz bir egzersiz yapmadınız.</Text>
            ) : (
              recentSessions.map((session) => {
                const dateObj = new Date(session.completedAt);
                return (
                  <Card key={session._id} padding="$3" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover">
                    <XStack justifyContent="space-between" alignItems="center">
                      <YStack>
                        <Text fontWeight="bold" textTransform="capitalize">{session.exerciseType}</Text>
                        <Text color="$color11" fontSize="$2">{dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                      </YStack>
                      <YStack alignItems="flex-end">
                        <Text fontWeight="bold" color="$green10">Skor: {session.score}</Text>
                        {session.metrics?.wpm && (
                          <Text fontSize="$2" color="$color11">{session.metrics.wpm} WPM</Text>
                        )}
                      </YStack>
                    </XStack>
                  </Card>
                )
              })
            )}
          </YStack>

        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
```

(Dropped the now-unused `Spinner`/`Progress` imports and the `progressPercent`/`goalMs` dead code that was already commented out above — this matches the pre-existing lint warnings noted earlier in this session for this exact file.)

- [ ] **Step 2: Typecheck**

Run: `bun run typecheck`
Expected: no errors in `src/app/(app)/(tabs)/index.tsx`.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(app)/(tabs)/index.tsx"
git commit -m "feat: home screen always uses local dashboard data"
```

---

### Task 13: Statistics screen — drop the remote branch, fix `TimeRange` import

**Files:**
- Modify: `src/app/(app)/(tabs)/statistics.tsx`
- Modify: `src/components/ui/StatisticsDashboard.tsx`
- Modify: `src/stores/useStatisticsStore.ts`

Three files import `TimeRange` from `@/convex/statistics` (a type-only import that still requires the file to exist). `src/utils/localStatistics.ts:4` already defines an identical `TimeRange` — repoint all three there. `statistics.tsx:1-56` then drops its `api.statistics.getPerformanceStats` query and `useStatisticsStore` caching (that store existed purely to cache the async query result — with a synchronous local computation there's nothing to cache), computing `buildLocalStats` unconditionally instead.

- [ ] **Step 1: Fix the `TimeRange` import in `useStatisticsStore.ts`**

Replace:
```typescript
import { TimeRange } from "@/convex/statistics";
```
with:
```typescript
import { TimeRange } from "@/utils/localStatistics";
```

- [ ] **Step 2: Fix the `TimeRange` import in `StatisticsDashboard.tsx`**

Replace:
```typescript
import { TimeRange } from "@/convex/statistics";
```
with:
```typescript
import { TimeRange } from "@/utils/localStatistics";
```
(No other change needed in this file — it already takes `currentStats`/`isLoading` as props and doesn't touch Convex directly.)

- [ ] **Step 3: Rewrite `statistics.tsx`**

```typescript
// src/app/(app)/(tabs)/statistics.tsx
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TimeRange } from "@/utils/localStatistics";
import { useLocalHistoryStore } from "@/stores/localHistoryStore";
import { buildLocalStats } from "@/utils/localStatistics";
import { StatisticsDashboard } from "@/components/ui/StatisticsDashboard";

export default function StatisticsTabScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const localSessions = useLocalHistoryStore(state => state.sessions);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const currentStats = buildLocalStats(localSessions, timeRange, undefined, timeZone);
  const hasData = currentStats.totalSessions > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
      <StatisticsDashboard
        isLoading={false}
        hasData={hasData}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        currentStats={currentStats}
      />
    </SafeAreaView>
  );
}
```

(`useStatisticsStore` itself is left in place with its now-fixed import — Task 15's `handleResetStats` still calls `useStatisticsStore.getState().invalidate()`, which is harmless as a no-op cache clear even though nothing populates the cache anymore. Removing the store entirely is unnecessary churn for this migration.)

- [ ] **Step 4: Typecheck**

Run: `bun run typecheck`
Expected: no errors in the three touched files; `grep -rn "@/convex/statistics" src` returns nothing.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(app)/(tabs)/statistics.tsx" src/components/ui/StatisticsDashboard.tsx src/stores/useStatisticsStore.ts
git commit -m "feat: statistics screen uses local data only, fix TimeRange import"
```

---

### Task 14: Exercise detail screen — drop the remote history branch

**Files:**
- Modify: `src/app/(app)/exercise/[exerciseId].tsx`

`[exerciseId].tsx:44-60` picks `api.exerciseSessions.getSessionsByExerciseType` vs local sessions for the progress chart based on `isSignedIn && isPremium`. Local becomes the only source.

- [ ] **Step 1: Remove the remote-history code**

Remove these imports:
```typescript
import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
```

Replace:
```typescript
  // Progress history for the chart - cloud history for premium, local queue otherwise.
  const { isSignedIn } = useAuth();
  const { isPremium } = useRevenueCat();
  const useRemoteHistory = isSignedIn && isPremium;
  const remoteSessions = useQuery(
    api.exerciseSessions.getSessionsByExerciseType,
    exercise && useRemoteHistory ? { exerciseType: exercise.type } : "skip",
  );
  const localSessions = useLocalHistoryStore(state => state.sessions);
  const chartData = useMemo(() => {
    if (!exercise) return [];
    const points = useRemoteHistory
      ? (remoteSessions ?? [])
      : localSessions
          .filter(s => s.exerciseId === exercise.id)
          .sort((a, b) => a.completedAt - b.completedAt);
    return points.map((s, i) => ({ x: i, y: s.score }));
  }, [exercise, useRemoteHistory, remoteSessions, localSessions]);
```
with:
```typescript
  const localSessions = useLocalHistoryStore(state => state.sessions);
  const chartData = useMemo(() => {
    if (!exercise) return [];
    const points = localSessions
      .filter(s => s.exerciseId === exercise.id)
      .sort((a, b) => a.completedAt - b.completedAt);
    return points.map((s, i) => ({ x: i, y: s.score }));
  }, [exercise, localSessions]);
```

`useRevenueCat` is still used elsewhere in this file? Check: it was only used for `isPremium` in the removed block. Run `grep -n "useRevenueCat\|isPremium" "src/app/(app)/exercise/[exerciseId].tsx"` after this edit — if no remaining usages, also remove the now-unused `import { useRevenueCat } from '@/providers/RevenueCatProvider';` import.

- [ ] **Step 2: Typecheck**

Run: `bun run typecheck`
Expected: no errors, no unused-import warnings in `src/app/(app)/exercise/[exerciseId].tsx`.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(app)/exercise/[exerciseId].tsx"
git commit -m "feat: exercise detail chart uses local history only"
```

---

### Task 15: Settings screen — drop Account section and all Convex mutations

**Files:**
- Modify: `src/app/(app)/(tabs)/settings.tsx`

This is the last screen with Clerk/Convex imports. Drop: `useAuth`/`useUser`, the three `useMutation` calls (`resetMyStatistics`, `deleteMyAccount`, `setProgressNotificationsEnabled`), the entire "Account" section (login/logout, or user name+logout), `handleDeleteAccount` and its confirmation sheet, and the `isSignedIn` gate on the upgrade row. `handleResetStats` keeps every local-store reset it already does, minus the `resetMyStatistics()` call, and now also resets `useGamificationStore` (Task 2's new persisted xp/level/achievements — reset-my-data should clear those too, matching the intent of "İstatistiklerini ve okuma geçmişini sil").

- [ ] **Step 1: Remove Clerk/Convex imports and the three mutations**

Remove:
```typescript
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
```
and
```typescript
import { api } from "@/convex/_generated/api";
```
and
```typescript
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
```
and
```typescript
  // Convex Mutations
  const resetMyStatistics = useMutation(api.users.resetMyStatistics);
  const deleteMyAccount = useMutation(api.users.deleteMyAccount);
  const syncProgressNotificationsEnabled = useMutation(api.users.setProgressNotificationsEnabled);
```

Add:
```typescript
import { useGamificationStore } from "@/stores/gamificationStore";
```

- [ ] **Step 2: Simplify `handleResetStats`, delete `handleDeleteAccount` and `handleLogout`**

Replace:
```typescript
  const handleResetStats = async () => {
    setIsProcessing(true);
    try {
      if (isSignedIn) {
        await resetMyStatistics();
      }
      // Reset local stores
      useExerciseProgressStore.getState().resetAll();
      useStatisticsStore.getState().invalidate();
      useUserProgressStore.getState().resetProgress();
      useStreakCacheStore.getState().resetCache();
      // Also clear the pending sync queue - otherwise SyncProvider's
      // background sync re-writes the just-reset sessions/progress to
      // Convex the next time it runs.
      useSyncStore.getState().clearQueue();
      useLocalHistoryStore.getState().clear();

      setResetStatsSheetOpen(false);
      Alert.alert(
        "Başarılı",
        t("dangerZone.successReset") || "İstatistiklerin sıfırlandı.",
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "İstatistikler sıfırlanamadı");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAccount = async () => {
    ... (entire function, ~60 lines) ...
  };

  const handleManageSubscription = async () => {
```
with:
```typescript
  const handleResetStats = () => {
    setIsProcessing(true);
    try {
      useExerciseProgressStore.getState().resetAll();
      useStatisticsStore.getState().invalidate();
      useUserProgressStore.getState().resetProgress();
      useStreakCacheStore.getState().resetCache();
      useGamificationStore.getState().resetProgress();
      useLocalHistoryStore.getState().clear();

      setResetStatsSheetOpen(false);
      Alert.alert(
        "Başarılı",
        t("dangerZone.successReset") || "İstatistiklerin sıfırlandı.",
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "İstatistikler sıfırlanamadı");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManageSubscription = async () => {
```
(dropped `useSyncStore` reset call and import — `syncStore` is deleted in Task 17; also drop the now-unused `[deleteAccountSheetOpen, setDeleteAccountSheetOpen]` state and the `toast`/`useToastController` import if nothing else in the file uses `toast` — check with `grep -n "toast\." "src/app/(app)/(tabs)/settings.tsx"` after this edit).

Also remove the whole `handleLogout` function — nothing calls it after the Account section is removed in Step 3.

- [ ] **Step 3: Remove the Account section, fix the upgrade row, remove the delete-account sheet and danger-zone entry**

Replace:
```typescript
        {/* Subscription Section */}
        <SettingsSection title={t("subscription.title")}>
          ...
              onPress={() => {
                if (!isSignedIn) {
                  router.push("/(auth)/login");
                } else {
                  router.push("/paywall");
                }
              }}
          ...
        </SettingsSection>

        {/* Account Section */}
        <SettingsSection title={t("account.title")}>
          {isSignedIn && user ? (
            ...
          ) : (
            ...
          )}
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection title={t("dangerZone.title")} titleColor="$red10">
          <SettingsRow
            icon={<RotateCcw color={dangerColor} size={20} />}
            ...
            onPress={() => setResetStatsSheetOpen(true)}
          />
          {isSignedIn && (
            <>
              ... delete account row ...
            </>
          )}
        </SettingsSection>
```
with:
```typescript
        {/* Subscription Section */}
        <SettingsSection title={t("subscription.title")}>
          ...
              onPress={() => router.push("/paywall")}
          ...
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection title={t("dangerZone.title")} titleColor="$red10">
          <SettingsRow
            icon={<RotateCcw color={dangerColor} size={20} />}
            title={
              t("dangerZone.resetStats") !== "dangerZone.resetStats"
                ? t("dangerZone.resetStats")
                : "İstatistikleri Sıfırla"
            }
            titleColor="$red10"
            subtitle={
              t("dangerZone.resetStatsDesc") !== "dangerZone.resetStatsDesc"
                ? t("dangerZone.resetStatsDesc")
                : "Okuma geçmişini ve performans verilerini sil."
            }
            onPress={() => setResetStatsSheetOpen(true)}
          />
        </SettingsSection>
```
(the `...` above the `onPress` change is the unchanged premium/free `SettingsRow` JSX already in the file — only the free-branch `onPress` body changes).

Then remove the whole "Delete Account Confirmation" `<ConfirmationSheet ... />` block near the bottom of the JSX (the second `ConfirmationSheet`, using `deleteAccountSheetOpen`).

Also remove these now-unused lucide-react-native icon imports if nothing else in the file references them: `LogIn`, `LogOut`, `Trash2`, `User` (`CreditCard`, `Crown`, `RotateCcw` etc. stay, they're still used).

- [ ] **Step 4: Typecheck**

Run: `bun run typecheck`
Expected: no errors, no unused-import/unused-variable warnings in `src/app/(app)/(tabs)/settings.tsx`; `grep -n "clerk\|convex\|Convex" "src/app/(app)/(tabs)/settings.tsx"` (case-insensitive) returns nothing except the comment-free code (re-check no stray `@/convex` import remains).

- [ ] **Step 5: Commit**

```bash
git add "src/app/(app)/(tabs)/settings.tsx"
git commit -m "feat: settings screen drops account section, resets local gamification too"
```

---

### Task 16: Collapse `storage.ts` to a single adapter

**Files:**
- Modify: `src/stores/storage.ts`

With no accounts, there's only ever one local user — `activeUserId`/`setActiveUserId` (used only by `AuthSync.tsx`, deleted in Task 17) becomes dead. Rather than touch every store that imports `userScopedStorageAdapter` (`localHistoryStore`, `exerciseProgressStore`, `userProgressStore`, `streakCacheStore`, `useExerciseSettingsStore`, `gamificationStore`), keep both exported names but make `userScopedStorageAdapter` a plain alias of `globalStorageAdapter` — zero call-site changes needed anywhere else.

- [ ] **Step 1: Rewrite `storage.ts`**

```typescript
// src/stores/storage.ts
import { createMMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

export const mmkv = createMMKV({ id: 'hizli-okuma' });

/**
 * Ana (cihaz seviyesi) depolama adaptörü.
 */
export const globalStorageAdapter: StateStorage = {
  setItem: (name, value) => {
    return mmkv.set(name, value);
  },
  getItem: (name) => {
    const value = mmkv.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    mmkv.remove(name);
  },
};

/**
 * Historically prefixed per-user storage; now just an alias of
 * `globalStorageAdapter` since the app has no accounts and therefore only
 * ever one local user. Kept as a separate export so the stores that use it
 * don't need call-site changes.
 */
export const userScopedStorageAdapter: StateStorage = globalStorageAdapter;
```

- [ ] **Step 2: Typecheck**

Run: `bun run typecheck`
Expected: no errors in `src/stores/storage.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/stores/storage.ts
git commit -m "feat: collapse per-user storage prefixing, no accounts left"
```

---

### Task 17: Root wiring — drop Clerk/Convex providers and auth routes

**Files:**
- Modify: `src/app/_layout.tsx`
- Modify: `src/app/(app)/_layout.tsx`
- Delete: `src/app/(auth)/login.tsx`, `src/app/(auth)/register.tsx`, `src/app/(auth)/_layout.tsx` (and the now-empty `src/app/(auth)/` directory)
- Delete: `src/components/auth/AuthSync.tsx`
- Delete: `src/providers/SyncProvider.tsx`
- Delete: `src/stores/syncStore.ts`
- Delete: `src/hooks/useSyncTimezone.ts`
- Delete: `src/hooks/usePushNotificationToken.ts`
- Delete: `src/hooks/useWarmUpBrowser.ts`
- Delete: `src/components/ui/GoogleIcon.tsx`
- Delete: `src/utils/migration.ts` (only importer was `AuthSync.tsx`)
- Delete: `src/stores/__tests__/localHistory.test.ts` — **check first**: if it tests `pruneSessions`/`useLocalHistoryStore` (unrelated to migration), keep it; only delete it if it specifically tests `importLegacyQueueIntoHistory` from `src/utils/migration.ts`. Run `grep -n "migration" src/stores/__tests__/localHistory.test.ts` to decide.

**Interfaces:**
- Consumes: `useSettingsStore.hasCompletedOnboarding` (unchanged).

`src/app/_layout.tsx:1-230` wraps the app in `ClerkProvider` → `ConvexProviderWithClerk` → `RevenueCatProvider`, renders `AuthSync` and wraps everything else in `SyncProvider`, and `RootNavigation`'s onboarding-gate effect branches on `isSignedIn`/`convexUser`. After this task the provider tree is just `RevenueCatProvider`, and the gate is `hasCompletedOnboarding` alone (already the fallback the effect used for guests — now the only path). `src/app/(app)/_layout.tsx:1-18` drops its `useAuth()`-loading gate, nothing to wait for anymore.

- [ ] **Step 1: Rewrite `src/app/_layout.tsx`**

Remove imports:
```typescript
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import * as SecureStore from "expo-secure-store";
import { AuthSync } from "@/components/auth/AuthSync";
import { api } from "@/convex/_generated/api";
import { useSyncTimezone } from "@/hooks/useSyncTimezone";
import { SyncProvider } from "@/providers/SyncProvider";
import { useQuery } from "convex/react";
```

Remove the `CLERK_PUBLISHABLE_KEY`/`CONVEX_URL` consts, the `convex` client instance, and the `tokenCache` object (`:33-56`).

Replace `RootNavigation` (`:58-123`) with:
```typescript
function RootNavigation() {
  const segments = useSegments();
  const router = useRouter();
  const hasCompletedOnboarding = useSettingsStore(
    (state) => state.hasCompletedOnboarding,
  );

  useEffect(() => {
    const inAppGroup = segments[0] === "(app)";
    const inOnboardingGroup = segments[0] === "(onboarding)";
    const inPaywall = segments[0] === "paywall";

    if (!hasCompletedOnboarding) {
      if (!inOnboardingGroup) router.replace("/(onboarding)");
    } else if (!inAppGroup && !inPaywall) {
      router.replace("/(app)/(tabs)");
    }
  }, [segments, hasCompletedOnboarding, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(onboarding)"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}
```

Replace the `RootLayout` return's provider tree:
```typescript
  return (
    <SafeAreaProvider>
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <RevenueCatProvider>
            <TamaguiProvider config={tamaguiConfig} defaultTheme={activeTheme}>
              <Theme name={activeTheme}>
                <ThemeProvider value={navigationTheme}>
                  <StatusBar
                    style={activeTheme === "dark" ? "light" : "dark"}
                    animated
                  />
                  <ToastProvider swipeDirection="horizontal" duration={3000}>
                    <AppNotificationProvider>
                      <SyncProvider>
                        <AuthSync />
                        <RootNavigation />
                        <AchievementPopupGlobal />
                      </SyncProvider>
                    </AppNotificationProvider>
                    <CurrentToast />
                    <AppToastViewport />
                  </ToastProvider>
                </ThemeProvider>
              </Theme>
            </TamaguiProvider>
          </RevenueCatProvider>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </SafeAreaProvider>
  );
```
with:
```typescript
  return (
    <SafeAreaProvider>
      <RevenueCatProvider>
        <TamaguiProvider config={tamaguiConfig} defaultTheme={activeTheme}>
          <Theme name={activeTheme}>
            <ThemeProvider value={navigationTheme}>
              <StatusBar
                style={activeTheme === "dark" ? "light" : "dark"}
                animated
              />
              <ToastProvider swipeDirection="horizontal" duration={3000}>
                <AppNotificationProvider>
                  <RootNavigation />
                  <AchievementPopupGlobal />
                </AppNotificationProvider>
                <CurrentToast />
                <AppToastViewport />
              </ToastProvider>
            </ThemeProvider>
          </Theme>
        </TamaguiProvider>
      </RevenueCatProvider>
    </SafeAreaProvider>
  );
```

- [ ] **Step 2: Rewrite `src/app/(app)/_layout.tsx`**

```typescript
// src/app/(app)/_layout.tsx
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="exercise/[exerciseId]" options={{ headerShown: false }} />
    </Stack>
  );
}
```

- [ ] **Step 3: Delete the auth route group and now-dead auth/sync files**

```bash
git rm -r "src/app/(auth)"
git rm src/components/auth/AuthSync.tsx
git rm src/providers/SyncProvider.tsx
git rm src/stores/syncStore.ts
git rm src/hooks/useSyncTimezone.ts
git rm src/hooks/usePushNotificationToken.ts
git rm src/hooks/useWarmUpBrowser.ts
git rm src/components/ui/GoogleIcon.tsx
git rm src/utils/migration.ts
```

- [ ] **Step 4: Check for a stray migration test**

Run: `grep -n "migration" src/stores/__tests__/localHistory.test.ts src/utils/__tests__/*.ts 2>/dev/null`
If any file imports from `@/utils/migration`, delete it (`git rm <path>`); a test file for `migration.ts` itself (e.g. `src/utils/__tests__/migration.test.ts`) should also be deleted if it exists.

- [ ] **Step 5: Typecheck**

Run: `bun run typecheck`
Expected: `src/app/_layout.tsx` and `src/app/(app)/_layout.tsx` have no errors. Other files will still error until Task 18 deletes `convex/` (the `@/convex/_generated/api` module itself still exists on disk until then) — confirm by eye that these two files no longer import anything from `@clerk/clerk-expo` or `convex/*`.

- [ ] **Step 6: Commit**

```bash
git add src/app/_layout.tsx "src/app/(app)/_layout.tsx"
git commit -m "feat: drop Clerk/Convex providers and auth routes from root wiring"
```

---

### Task 18: Delete `convex/`, remove dependencies, clean env config

**Files:**
- Delete: `convex/` (entire directory)
- Modify: `package.json`
- Modify: `.env.example`

At this point nothing under `src/` imports `@clerk/clerk-expo`, `convex/react`, `convex/react-clerk`, or `@/convex/_generated/api` — verify that before deleting, then remove the backend and the two packages.

- [ ] **Step 1: Verify no remaining imports**

Run: `grep -rln "@clerk/clerk-expo\|convex/react\|@/convex/_generated" src`
Expected: empty output. If anything prints, stop and go back to the task that should have covered that file — do not delete `convex/` until this is empty.

- [ ] **Step 2: Delete the backend**

```bash
git rm -r convex
```

- [ ] **Step 3: Remove the two dependencies from `package.json`**

Remove these two lines from `dependencies`:
```json
    "@clerk/clerk-expo": "^2.19.31",
```
```json
    "convex": "^1.43.0",
```

- [ ] **Step 4: Clean `.env.example`**

Remove:
```
# Convex deployment URL, e.g. https://your-deployment-123.convex.cloud
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk publishable key (pk_test_... in dev, pk_live_... in production)
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
```
and the entire trailing section:
```
# --- Convex CLI (local development only, not bundled) ---

# Written by `npx convex dev`; identifies the deployment this checkout targets.
CONVEX_DEPLOYMENT=dev:your-deployment-name

# --- Convex deployment environment variables ---
# These live on the Convex deployment (`npx convex env set NAME value`), NOT in
# the app bundle. Listed here only so the required set is documented.

# Clerk Frontend API URL (Clerk dashboard -> API keys -> Frontend API).
# Read by convex/auth.config.ts; without it no Convex request authenticates.
# CLERK_FRONTEND_API_URL=https://your-instance.clerk.accounts.dev

# Must equal the Authorization header value configured on the RevenueCat
# webhook. Without it /revenuecat-webhook returns 500 and premium state
# never syncs.
# REVENUECAT_WEBHOOK_AUTH_HEADER=your_shared_webhook_secret

# Optional: Expo push "enhanced security" access token.
# https://docs.expo.dev/push-notifications/sending-notifications/#security
# EXPO_ACCESS_TOKEN=your_expo_access_token
```
leaving just the "Client (bundled into the app)" section's RevenueCat/Amplitude/Sentry keys.

- [ ] **Step 5: Reinstall dependencies**

Run: `bun install`
Expected: lockfile updates, no errors, `@clerk/clerk-expo` and `convex` no longer appear in `bun.lock`.

- [ ] **Step 6: Commit**

```bash
git add convex package.json bun.lock .env.example
git commit -m "chore: remove Convex backend and Clerk/Convex dependencies"
```

---

### Task 19: Test cleanup — remove Clerk/Convex mocks, fix fallout

**Files:**
- Modify: `test-setup.ts`
- Verify/fix: `src/features/exercises/*/__tests__/*.test.ts` (chunking, pacer, rsvp, scanning, schulte)

`test-setup.ts:19-27` mocks `convex/react` and `@clerk/clerk-expo` so any test that transitively imports app code touching them doesn't crash bun's parser on react-native's untranspiled Flow source. With both packages gone, importing them would now fail outright (they're not installed) — the mocks must go, and everything that relied on `convex/react`/`@clerk/clerk-expo` being importable no longer needs it since no source file imports those specifiers anymore (verified in Task 18, Step 1).

- [ ] **Step 1: Remove the two mocks from `test-setup.ts`**

Remove:
```typescript
mock.module('convex/react', () => ({
  useMutation: () => () => Promise.resolve(),
  useQuery: () => undefined,
}));

mock.module('@clerk/clerk-expo', () => ({
  useAuth: () => ({ isSignedIn: false, userId: null }),
}));
```
and update the block comment above the mocks (`:14-18`) to drop the "convex/react, @clerk/clerk-expo, and..." sentence, keeping the react-native-mmkv/Amplitude rationale for the mocks that remain.

- [ ] **Step 2: Run the full test suite**

Run: `bun test`
Expected: some failures are possible in `src/features/exercises/*/__tests__/*.test.ts` if any of them (or a file they import) still references `convex/react` or `@clerk/clerk-expo` by string anywhere — but per this session's earlier research these five files only import their own exercise engine (`useRSVPEngine` etc.), which does not import `useCreateSession` or any Clerk/Convex module, so they should already pass once the mocks are gone. If any fails with a "Cannot find module" for `convex/react` or `@clerk/clerk-expo`, trace its import chain (`grep -n "^import" <failing file>`) back to the offending source file — every such file should already have been rewritten in Tasks 3–17; if one was missed, fix it now using the same pattern as its sibling tasks.

- [ ] **Step 3: Commit**

```bash
git add test-setup.ts
git commit -m "test: remove Clerk/Convex mocks, no longer needed"
```

(If Step 2 required fixing a missed file, stage and commit that fix separately with a message describing what was missed, before this commit.)

---

### Task 20: Full validation

**Files:** none (verification only)

- [ ] **Step 1: Typecheck**

Run: `bun run typecheck`
Expected: 0 errors.

- [ ] **Step 2: Lint**

Run: `bun run lint`
Expected: 0 errors (pre-existing unused-variable warnings in `src/app/(app)/(tabs)/index.tsx` for `Progress`/`progressPercent` are already resolved by Task 12's rewrite — confirm they're gone; no new warnings introduced by this migration).

- [ ] **Step 3: i18n check**

Run: `bun run i18n:check`
Expected: 0 errors — this migration didn't add new hardcoded strings or new `t()` keys, so coverage shouldn't change. If it flags now-orphaned keys under `account.*`/`dangerZone.deleteAccount*` (Task 15 removed their only usage), that's expected and fine to leave (removing translation keys is out of scope for this migration — a later i18n cleanup pass can do it).

- [ ] **Step 4: Full test suite**

Run: `bun test`
Expected: 0 failures.

- [ ] **Step 5: Grep sweep for anything missed**

Run: `grep -rln "@clerk/clerk-expo\|convex/react\|convex/react-clerk\|@/convex\|EXPO_PUBLIC_CONVEX_URL\|EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY" src convex 2>/dev/null`
Expected: empty (and `convex` as a path shouldn't even exist to search).

- [ ] **Step 6: Manual smoke check (documented, not automatable here)**

Note in the commit message or PR description that the following golden paths still need a manual pass in a running app before merge (per AGENTS.md: "For UI or frontend changes... test the feature in a browser/simulator before reporting complete" — this plan's tasks can't drive a simulator):
- Fresh install → onboarding → daily goal and initial WPM/comprehension show up on the home screen.
- Complete an exercise → streak increments, XP/level persist across app restart, first-exercise achievement popup fires once.
- Settings → reset data → history/streak/XP/achievements all clear.
- Paywall opens directly with no login prompt; purchase/restore still work against RevenueCat.

- [ ] **Step 7: Final commit (only if any fixups were needed in Steps 1-5)**

```bash
git add -A
git commit -m "fix: address remaining typecheck/lint/test fallout from Clerk+Convex removal"
```
