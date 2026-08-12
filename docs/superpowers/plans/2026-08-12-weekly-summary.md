# Haftalık Özet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the weekly summary feature (spec: `docs/superpowers/specs/2026-08-12-weekly-summary-design.md`) — a home-screen card + full-screen recap showing this week's training minutes, WPM trend, and streak, delivered via a personalized server push for premium users and a generic locally-scheduled notification for free/guest users.

**Architecture:** One shared pure calculator (`src/utils/weeklySummary.ts`) computes the summary from a common `DailyStatInput[]` shape; the premium path (Convex hourly cron → `dailyStatistics` range read → server push) and the free/guest path (client `buildLocalStats` → on-device card, no server involvement) both feed that same function so the numbers are computed identically everywhere. Free/guest notification content is generic (no numbers) because it's scheduled natively and recurs weekly without the app re-computing it; premium's server push has real numbers because it's computed fresh every cron tick.

**Tech Stack:** React Native + Expo Router, Tamagui, Convex (`cronJobs`, `internalQuery`/`internalAction`), expo-notifications (native `WEEKLY` trigger), bun:test.

## Global Constraints

- Package manager: Bun only (`bun add`, `bun run`, `bun expo install`) — never npm/yarn/pnpm.
- Imports use the `@/` alias, never deep relative (`../../`).
- All user-facing text goes through i18n (`react-i18next`), Turkish only for now.
- No `any`, no unsafe casts, no unnecessary non-null assertions.
- Convex functions: always include argument validators; use `internalQuery`/`internalAction` for anything not part of the public API; use `.withIndex()` for range reads; only `crons.interval`/`crons.cron` for scheduling (never the `.weekly()`/`.daily()` helpers).
- Tests: `bun:test` (`/// <reference types="bun-types" />` + `describe`/`test`/`expect` from `"bun:test"`), mirroring `src/utils/__tests__/streak.test.ts` and `convex/__tests__/expoPush.test.ts`. This repo does not use `convex-test`/`vitest` — only pure, DB-free functions get unit tests; DB-touching Convex handlers are verified manually, matching the existing `sendPushToUser` precedent.
- Run `bun run typecheck`, `bun run lint`, and `bun test` after each task; do not move on if any fail.

---

### Task 1: Shared weekly-summary calculator

**Files:**
- Create: `src/utils/weeklySummary.ts`
- Test: `src/utils/__tests__/weeklySummary.test.ts`

**Interfaces:**
- Produces: `DailyStatInput { date: string; durationMs: number; avgWpm: number | null; sessionCount: number }`, `WeeklySummary { weekStartDate: string; weekEndDate: string; totalMinutes: number; sessionCount: number; avgWpmThisWeek: number | null; avgWpmLastWeek: number | null; wpmDeltaPercent: number | null; streakDays: number; isEmpty: boolean }`, `getWeekBounds(dateStr: string): { weekStart: string; weekEnd: string }`, `buildWeeklySummary(dailyStats: DailyStatInput[], todayDateStr: string, streakDays: number): WeeklySummary`.
- Consumes: nothing (pure, no imports from the rest of the app).

- [ ] **Step 1: Write the failing tests**

```typescript
/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test';
import { getWeekBounds, buildWeeklySummary, type DailyStatInput } from '@/utils/weeklySummary';

describe('getWeekBounds', () => {
  test('mid-week date resolves to its Monday-Sunday week', () => {
    expect(getWeekBounds('2026-08-12')).toEqual({ weekStart: '2026-08-10', weekEnd: '2026-08-16' });
  });

  test('Monday resolves to itself as weekStart', () => {
    expect(getWeekBounds('2026-08-10')).toEqual({ weekStart: '2026-08-10', weekEnd: '2026-08-16' });
  });

  test('Sunday resolves to the week it ends, not the next one', () => {
    expect(getWeekBounds('2026-08-16')).toEqual({ weekStart: '2026-08-10', weekEnd: '2026-08-16' });
  });
});

describe('buildWeeklySummary', () => {
  const dailyStats: DailyStatInput[] = [
    { date: '2026-08-05', durationMs: 400_000, avgWpm: 280, sessionCount: 1 }, // last week
    { date: '2026-08-10', durationMs: 600_000, avgWpm: 300, sessionCount: 2 }, // this week (Mon)
    { date: '2026-08-12', durationMs: 300_000, avgWpm: 320, sessionCount: 1 }, // this week (Wed)
    { date: '2026-08-20', durationMs: 999_999, avgWpm: 999, sessionCount: 5 }, // next week, excluded
  ];

  test('sums only this week\'s minutes and sessions', () => {
    const summary = buildWeeklySummary(dailyStats, '2026-08-12', 4);
    expect(summary.totalMinutes).toBe(15);
    expect(summary.sessionCount).toBe(3);
    expect(summary.isEmpty).toBe(false);
    expect(summary.streakDays).toBe(4);
  });

  test('averages WPM across each week\'s days and computes delta percent', () => {
    const summary = buildWeeklySummary(dailyStats, '2026-08-12', 0);
    expect(summary.avgWpmThisWeek).toBe(310); // (300 + 320) / 2
    expect(summary.avgWpmLastWeek).toBe(280);
    expect(summary.wpmDeltaPercent).toBe(11); // round(((310-280)/280)*100)
  });

  test('empty week has null WPM figures and isEmpty true', () => {
    const summary = buildWeeklySummary([], '2026-08-12', 2);
    expect(summary.isEmpty).toBe(true);
    expect(summary.totalMinutes).toBe(0);
    expect(summary.sessionCount).toBe(0);
    expect(summary.avgWpmThisWeek).toBeNull();
    expect(summary.wpmDeltaPercent).toBeNull();
  });

  test('no last-week data means delta is null, not a divide-by-zero result', () => {
    const thisWeekOnly: DailyStatInput[] = [
      { date: '2026-08-11', durationMs: 100_000, avgWpm: 250, sessionCount: 1 },
    ];
    const summary = buildWeeklySummary(thisWeekOnly, '2026-08-12', 1);
    expect(summary.avgWpmLastWeek).toBeNull();
    expect(summary.wpmDeltaPercent).toBeNull();
  });

  test('last week averaging to exactly 0 WPM guards the delta division', () => {
    const dataWithZero: DailyStatInput[] = [
      { date: '2026-08-05', durationMs: 100_000, avgWpm: 0, sessionCount: 1 },
      { date: '2026-08-11', durationMs: 100_000, avgWpm: 250, sessionCount: 1 },
    ];
    const summary = buildWeeklySummary(dataWithZero, '2026-08-12', 0);
    expect(summary.avgWpmLastWeek).toBe(0);
    expect(summary.wpmDeltaPercent).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun test src/utils/__tests__/weeklySummary.test.ts`
Expected: FAIL — `Cannot find module '@/utils/weeklySummary'`.

- [ ] **Step 3: Write the implementation**

```typescript
// src/utils/weeklySummary.ts

/**
 * One user-local calendar day's aggregate. Shape is deliberately the
 * intersection of what the server's `dailyStatistics` rows and the client's
 * `buildLocalStats` dailyTrends both carry, so `buildWeeklySummary` runs
 * identically for premium (server) and free/guest (local) users.
 */
export interface DailyStatInput {
  /** 'YYYY-MM-DD', already in the user's local timezone. */
  date: string;
  durationMs: number;
  avgWpm: number | null;
  sessionCount: number;
}

export interface WeeklySummary {
  weekStartDate: string;
  weekEndDate: string;
  totalMinutes: number;
  sessionCount: number;
  avgWpmThisWeek: number | null;
  avgWpmLastWeek: number | null;
  /** null when either week has no WPM data — never a divide-by-zero guess. */
  wpmDeltaPercent: number | null;
  streakDays: number;
  isEmpty: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return toDateStr(new Date(d.getTime() + days * DAY_MS));
}

/** Monday-anchored week (Mon..Sun) containing `dateStr`. */
export function getWeekBounds(dateStr: string): { weekStart: string; weekEnd: string } {
  const d = new Date(`${dateStr}T00:00:00Z`);
  const dayOfWeek = d.getUTCDay(); // 0 = Sunday .. 6 = Saturday
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = addDays(dateStr, -daysSinceMonday);
  const weekEnd = addDays(weekStart, 6);
  return { weekStart, weekEnd };
}

/** Unweighted mean of each day's own average — a simple week-level trend, not session-weighted. */
function averageWpm(days: DailyStatInput[]): number | null {
  const withWpm = days.filter((d): d is DailyStatInput & { avgWpm: number } => d.avgWpm !== null);
  if (withWpm.length === 0) return null;
  const sum = withWpm.reduce((acc, d) => acc + d.avgWpm, 0);
  return Math.round(sum / withWpm.length);
}

export function buildWeeklySummary(
  dailyStats: DailyStatInput[],
  todayDateStr: string,
  streakDays: number,
): WeeklySummary {
  const { weekStart, weekEnd } = getWeekBounds(todayDateStr);
  const lastWeekStart = addDays(weekStart, -7);
  const lastWeekEnd = addDays(weekStart, -1);

  const thisWeek = dailyStats.filter((d) => d.date >= weekStart && d.date <= weekEnd);
  const lastWeek = dailyStats.filter((d) => d.date >= lastWeekStart && d.date <= lastWeekEnd);

  const totalDurationMs = thisWeek.reduce((sum, d) => sum + d.durationMs, 0);
  const sessionCount = thisWeek.reduce((sum, d) => sum + d.sessionCount, 0);

  const avgWpmThisWeek = averageWpm(thisWeek);
  const avgWpmLastWeek = averageWpm(lastWeek);
  const wpmDeltaPercent =
    avgWpmThisWeek !== null && avgWpmLastWeek !== null && avgWpmLastWeek !== 0
      ? Math.round(((avgWpmThisWeek - avgWpmLastWeek) / avgWpmLastWeek) * 100)
      : null;

  return {
    weekStartDate: weekStart,
    weekEndDate: weekEnd,
    totalMinutes: Math.round(totalDurationMs / 60000),
    sessionCount,
    avgWpmThisWeek,
    avgWpmLastWeek,
    wpmDeltaPercent,
    streakDays,
    isEmpty: sessionCount === 0,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun test src/utils/__tests__/weeklySummary.test.ts`
Expected: PASS — 9 tests.

- [ ] **Step 5: Typecheck and commit**

```bash
bun run typecheck
git add src/utils/weeklySummary.ts src/utils/__tests__/weeklySummary.test.ts
git commit -m "feat: add shared weekly summary calculator"
```

---

### Task 2: Server-side pure notification logic

**Files:**
- Create: `convex/weeklySummary.ts` (pure exports only in this task — DB-touching functions land in Task 3, same file)
- Test: `convex/__tests__/weeklySummary.test.ts`

**Interfaces:**
- Consumes: `WeeklySummary` from `../src/utils/weeklySummary` (Task 1).
- Produces: `WEEKLY_SUMMARY_SCREEN: string`, `DEFAULT_TIMEZONE: string`, `decideWeeklySummaryNotification(summary: WeeklySummary): { title: string; body: string; data: { screen: string } } | null`, `isWeeklyDigestHour(nowUtc: number, timezone: string): boolean`.

- [ ] **Step 1: Write the failing tests**

```typescript
/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test';
import { decideWeeklySummaryNotification, isWeeklyDigestHour, WEEKLY_SUMMARY_SCREEN } from '../weeklySummary';
import type { WeeklySummary } from '../../src/utils/weeklySummary';

function summary(overrides: Partial<WeeklySummary> = {}): WeeklySummary {
  return {
    weekStartDate: '2026-08-10',
    weekEndDate: '2026-08-16',
    totalMinutes: 47,
    sessionCount: 6,
    avgWpmThisWeek: 320,
    avgWpmLastWeek: 300,
    wpmDeltaPercent: 7,
    streakDays: 4,
    isEmpty: false,
    ...overrides,
  };
}

describe('decideWeeklySummaryNotification', () => {
  test('empty week produces no notification (no nagging)', () => {
    expect(decideWeeklySummaryNotification(summary({ isEmpty: true, sessionCount: 0, totalMinutes: 0 }))).toBeNull();
  });

  test('positive trend mentions the increase and deep-links to the summary screen', () => {
    const result = decideWeeklySummaryNotification(summary({ wpmDeltaPercent: 7 }));
    expect(result).not.toBeNull();
    expect(result?.body).toContain('47 dakika');
    expect(result?.body).toContain('%7 arttı');
    expect(result?.data).toEqual({ screen: WEEKLY_SUMMARY_SCREEN });
  });

  test('negative trend mentions the decrease without a negative sign', () => {
    const result = decideWeeklySummaryNotification(summary({ wpmDeltaPercent: -12 }));
    expect(result?.body).toContain('%12 azaldı');
  });

  test('no comparison data omits the trend clause entirely', () => {
    const result = decideWeeklySummaryNotification(summary({ wpmDeltaPercent: null }));
    expect(result?.body).toBe('Bu hafta 47 dakika çalıştın.');
  });
});

describe('isWeeklyDigestHour', () => {
  test('matches Sunday 20:00 in the given timezone', () => {
    // 2026-08-16T17:00:00Z is 2026-08-16 20:00 in Europe/Istanbul (UTC+3), a Sunday.
    const nowUtc = Date.UTC(2026, 7, 16, 17, 0, 0);
    expect(isWeeklyDigestHour(nowUtc, 'Europe/Istanbul')).toBe(true);
  });

  test('does not match the same instant in a different timezone', () => {
    const nowUtc = Date.UTC(2026, 7, 16, 17, 0, 0);
    expect(isWeeklyDigestHour(nowUtc, 'America/New_York')).toBe(false);
  });

  test('does not match Sunday at a different hour', () => {
    const nowUtc = Date.UTC(2026, 7, 16, 10, 0, 0); // 13:00 in Istanbul
    expect(isWeeklyDigestHour(nowUtc, 'Europe/Istanbul')).toBe(false);
  });

  test('does not match Monday at 20:00', () => {
    const nowUtc = Date.UTC(2026, 7, 17, 17, 0, 0); // Monday 20:00 in Istanbul
    expect(isWeeklyDigestHour(nowUtc, 'Europe/Istanbul')).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun test convex/__tests__/weeklySummary.test.ts`
Expected: FAIL — `Cannot find module '../weeklySummary'`.

- [ ] **Step 3: Write the implementation**

```typescript
// convex/weeklySummary.ts (pure section — DB-touching exports added in Task 3)
import type { WeeklySummary } from "../src/utils/weeklySummary";

/** Every push/local notification for this feature deep-links here. */
export const WEEKLY_SUMMARY_SCREEN = "/(app)/weekly-summary";

/** Used when a user has no `timezone` set yet (matches the app's primary market). */
export const DEFAULT_TIMEZONE = "Europe/Istanbul";

export interface WeeklySummaryNotification {
  title: string;
  body: string;
  data: { screen: string };
}

/**
 * Null for an empty week — the digest must skip sending entirely rather than
 * nag a user who did nothing this week.
 */
export function decideWeeklySummaryNotification(summary: WeeklySummary): WeeklySummaryNotification | null {
  if (summary.isEmpty) {
    return null;
  }

  let trendClause = "";
  if (summary.wpmDeltaPercent !== null) {
    trendClause =
      summary.wpmDeltaPercent >= 0
        ? `, hızın %${summary.wpmDeltaPercent} arttı 📈`
        : `, hızın %${Math.abs(summary.wpmDeltaPercent)} azaldı`;
  }

  return {
    title: "Haftalık Özetin Hazır",
    body: `Bu hafta ${summary.totalMinutes} dakika çalıştın${trendClause}.`,
    data: { screen: WEEKLY_SUMMARY_SCREEN },
  };
}

/**
 * True at hour-granularity when it's currently Sunday 20:00 in `timezone`.
 * The cron ticks once an hour, so matching to the minute would miss every tick.
 */
export function isWeeklyDigestHour(nowUtc: number, timezone: string): boolean {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
      hour: "numeric",
      hourCycle: "h23",
    }).formatToParts(new Date(nowUtc));
    const weekday = parts.find((p) => p.type === "weekday")?.value;
    const hour = parts.find((p) => p.type === "hour")?.value;
    return weekday === "Sun" && hour === "20";
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun test convex/__tests__/weeklySummary.test.ts`
Expected: PASS — 8 tests.

- [ ] **Step 5: Typecheck and commit**

```bash
bun run typecheck
git add convex/weeklySummary.ts convex/__tests__/weeklySummary.test.ts
git commit -m "feat: add weekly digest notification decision logic"
```

---

### Task 3: Convex digest cron handlers (DB-touching)

**Files:**
- Modify: `convex/weeklySummary.ts` (append to the file from Task 2)
- Create: `convex/crons.ts`

**Interfaces:**
- Consumes: `buildWeeklySummary`, `DailyStatInput` from `../src/utils/weeklySummary` (Task 1); `decideWeeklySummaryNotification`, `isWeeklyDigestHour`, `DEFAULT_TIMEZONE` from this file (Task 2); `getLocalDateString` from `../src/utils/streak`; `internal.expoPush.sendPushToUser` (existing).
- Produces: `internal.weeklySummary.listUsersPage`, `internal.weeklySummary.getUserWeeklySummary`, `internal.weeklySummary.sendWeeklyDigest` (the cron entry point).

No new automated test for this task: it's DB-touching Convex code, and this repo has no `convex-test`/`vitest` setup — the existing `sendPushToUser` action (same pattern: reads/writes `ctx.db`, calls `fetch`) has no test either, only its pure helpers do (Task 2 covers all the pure logic here). Verify manually per Step 3 below.

- [ ] **Step 1: Append the DB-touching handlers to `convex/weeklySummary.ts`**

```typescript
// Append to convex/weeklySummary.ts
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { internalQuery, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { getLocalDateString } from "../src/utils/streak";
import { buildWeeklySummary, type DailyStatInput } from "../src/utils/weeklySummary";

const DAY_MS = 24 * 60 * 60 * 1000;
/** Read enough trailing history to cover this week and last week's comparison. */
const HISTORY_DAYS = 14;

export const listUsersPage = internalQuery({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db.query("users").paginate(args.paginationOpts);
  },
});

// Bounded to at most HISTORY_DAYS rows (one `dailyStatistics` row per user
// per calendar day), so `.collect()` on this indexed range is safe.
export const getUserWeeklySummary = internalQuery({
  args: { userId: v.id("users"), timezone: v.string(), now: v.number() },
  handler: async (ctx, args) => {
    const todayDateStr = getLocalDateString(args.now, args.timezone);
    const todayTimestamp = Date.parse(`${todayDateStr}T00:00:00Z`);
    const thresholdTimestamp = todayTimestamp - (HISTORY_DAYS - 1) * DAY_MS;

    const rows = await ctx.db
      .query("dailyStatistics")
      .withIndex("by_userId_and_timestamp", (q) =>
        q.eq("userId", args.userId).gte("timestamp", thresholdTimestamp),
      )
      .collect();

    const dailyStats: DailyStatInput[] = rows.map((row) => ({
      date: row.date,
      durationMs: row.durationMs,
      avgWpm: row.wpmCount > 0 ? Math.round(row.wpmSum / row.wpmCount) : null,
      sessionCount: row.scoreCount,
    }));

    const streak = await ctx.db
      .query("streaks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    return buildWeeklySummary(dailyStats, todayDateStr, streak?.currentStreak ?? 0);
  },
});

// Ticks hourly; for each tick, only users whose local time is currently
// Sunday 20:00 are candidates (see `isWeeklyDigestHour`). Free/guest users
// never appear here — they never sync `dailyStatistics` to the server, so
// `!user.isPremium` skips them before any per-user query runs.
export const sendWeeklyDigest = internalAction({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    let cursor: string | null = null;
    let isDone = false;

    while (!isDone) {
      const page = await ctx.runQuery(internal.weeklySummary.listUsersPage, {
        paginationOpts: { numItems: 200, cursor },
      });

      for (const user of page.page) {
        if (!user.isPremium || user.pushNotificationsEnabled === false) {
          continue;
        }

        const timezone = user.timezone || DEFAULT_TIMEZONE;
        if (!isWeeklyDigestHour(now, timezone)) {
          continue;
        }

        const summary = await ctx.runQuery(internal.weeklySummary.getUserWeeklySummary, {
          userId: user._id,
          timezone,
          now,
        });

        const notification = decideWeeklySummaryNotification(summary);
        if (!notification) {
          continue;
        }

        await ctx.runAction(internal.expoPush.sendPushToUser, {
          userId: user._id,
          title: notification.title,
          body: notification.body,
          data: notification.data,
        });
      }

      isDone = page.isDone;
      cursor = page.continueCursor;
    }

    return null;
  },
});
```

- [ ] **Step 2: Create `convex/crons.ts`**

```typescript
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Ticks every hour; `sendWeeklyDigest` itself filters to users whose local
// time is currently Sunday 20:00, so this is effectively "once a week per
// user, in their own timezone" without a per-timezone cron entry.
crons.interval("weekly summary digest", { hours: 1 }, internal.weeklySummary.sendWeeklyDigest, {});

export default crons;
```

- [ ] **Step 3: Typecheck, then verify manually**

```bash
bun run typecheck
```

Manual verification (no automated test, per this task's note above):
1. `bunx convex dev` against a dev deployment.
2. In the Convex dashboard, open Functions → `weeklySummary:sendWeeklyDigest` → Run, with a test user whose `isPremium: true`, `timezone` set to a zone where it's currently Sunday 20:00 (or temporarily patch `isWeeklyDigestHour`'s inputs by editing the test user's data / running at the right real time), and at least one `dailyStatistics` row this week.
3. Confirm no error is thrown and, in the Convex logs, that `expoPush.sendPushToUser` was invoked (or skipped with `no_tokens` if the test user has no registered device — that's an expected non-error outcome).
4. Confirm the Crons dashboard tab lists "weekly summary digest" as a registered interval job after deploy.

- [ ] **Step 4: Commit**

```bash
git add convex/weeklySummary.ts convex/crons.ts
git commit -m "feat: add weekly digest cron for premium push notifications"
```

---

### Task 4: Free/guest local notification scheduling

**Files:**
- Modify: `src/services/notifications.ts`
- Modify: `src/providers/NotificationProvider.tsx`
- Modify: `src/app/(app)/(tabs)/settings.tsx`
- Modify: `src/i18n/locales/tr/notifications.json`

**Interfaces:**
- Consumes: `useRevenueCat().isPremium` (existing), `useSettingsStore` (existing).
- Produces: `scheduleWeeklySummaryNotification(isPremium: boolean): Promise<void>` exported from `src/services/notifications.ts`.

No automated test: this function only calls `expo-notifications` scheduling APIs (mocked out entirely in the bun test preload per `test-setup.ts`), matching the untested `rescheduleAllReminders`/`sendMilestoneNotification` already in this file.

- [ ] **Step 1: Add the teaser copy to `notifications.json`**

Add this key to `src/i18n/locales/tr/notifications.json` (alongside the existing `milestone` key):

```json
  "weeklySummaryReady": {
    "title": "Haftalık Özetin Hazır 📊",
    "body": "Bu haftaki okuma özetini görmek için dokun."
  },
```

- [ ] **Step 2: Add `scheduleWeeklySummaryNotification` to `src/services/notifications.ts`**

```typescript
// Add near the bottom of src/services/notifications.ts, after sendMilestoneNotification

/** Stable ID so re-scheduling replaces the existing request instead of stacking a duplicate. */
const WEEKLY_SUMMARY_IDENTIFIER = 'weekly-summary';
const WEEKLY_SUMMARY_SCREEN = '/(app)/weekly-summary';

/**
 * Free/guest users have no server-side data, so there's no personalized
 * push to send - instead a generic native WEEKLY trigger recurs every
 * Sunday 20:00 on-device forever, with no per-week rescheduling needed.
 * Content is static (no numbers) because it's set once, days before the
 * real numbers exist; the summary screen it deep-links to computes those
 * from live local data when opened.
 *
 * Premium users get the personalized server push (see convex/weeklySummary.ts)
 * instead, so this cancels any stale local one rather than doubling up.
 */
export async function scheduleWeeklySummaryNotification(isPremium: boolean) {
  const settings = useSettingsStore.getState();

  if (isPremium || !settings.notificationsEnabled || !settings.progressNotificationsEnabled) {
    await Notifications.cancelScheduledNotificationAsync(WEEKLY_SUMMARY_IDENTIFIER).catch(() => {});
    return;
  }

  await Notifications.scheduleNotificationAsync({
    identifier: WEEKLY_SUMMARY_IDENTIFIER,
    content: {
      title: i18n.t('notifications:weeklySummaryReady.title', 'Haftalık Özetin Hazır 📊'),
      body: i18n.t('notifications:weeklySummaryReady.body', 'Bu haftaki okuma özetini görmek için dokun.'),
      data: { screen: WEEKLY_SUMMARY_SCREEN },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 1, // expo-notifications: 1 = Sunday
      hour: 20,
      minute: 0,
    },
  });
}
```

- [ ] **Step 3: Call it from `NotificationProvider` on mount**

In `src/providers/NotificationProvider.tsx`, import `useRevenueCat` and the new function, and call it once permissions/channels are set up:

```typescript
import {
  rescheduleAllReminders,
  scheduleWeeklySummaryNotification,
  setupNotificationChannels,
} from "@/services/notifications";
import { useRevenueCat } from "@/providers/RevenueCatProvider";
```

Inside `AppNotificationProvider`, add:

```typescript
  const { isPremium } = useRevenueCat();
```

And inside the existing `useEffect` (after `setupNotificationChannels();`):

```typescript
    scheduleWeeklySummaryNotification(isPremium).catch(console.error);
```

Add `isPremium` to the effect's dependency array alongside `router`.

- [ ] **Step 4: Call it from the settings notification toggles**

In `src/app/(app)/(tabs)/settings.tsx`, import `scheduleWeeklySummaryNotification` alongside the existing `rescheduleAllReminders` import, and call it wherever `progressNotificationsEnabled` or the master `notificationsEnabled` toggle changes — next to the existing `handleToggleNotifications` handler and the `progressNotifications` row's `onSwitchChange`:

```typescript
              <SettingsRow
                icon={<TrendingUp color={iconColor} size={20} />}
                title={t("notifications.progressNotifications", "İlerleme Bildirimleri")}
                isSwitch
                switchValue={progressNotificationsEnabled}
                onSwitchChange={(val) => {
                  setProgressNotificationsEnabled(val);
                  scheduleWeeklySummaryNotification(isPremium).catch(console.error);
                }}
              />
```

Also add the same `scheduleWeeklySummaryNotification(isPremium).catch(console.error);` call inside `handleToggleNotifications` (the master switch), right after its existing `rescheduleAllReminders()` call, so turning notifications off also cancels the weekly one.

- [ ] **Step 5: Typecheck and commit**

```bash
bun run typecheck
bun run lint
git add src/services/notifications.ts src/providers/NotificationProvider.tsx src/app/\(app\)/\(tabs\)/settings.tsx src/i18n/locales/tr/notifications.json
git commit -m "feat: schedule local weekly summary notification for free/guest users"
```

---

### Task 5: Weekly summary i18n namespace

**Files:**
- Create: `src/i18n/locales/tr/weeklySummary.json`
- Modify: `src/i18n/index.ts`

**Interfaces:**
- Produces: `weeklySummary` i18n namespace, consumed by Task 6 and Task 7's components via `useTranslation('weeklySummary')`.

- [ ] **Step 1: Create the locale file**

```json
{
  "card": {
    "title": "Bu Hafta",
    "minutes": "{{minutes}} dakika çalıştın",
    "trendUp": "Hızın %{{percent}} arttı 📈",
    "trendDown": "Hızın %{{percent}} azaldı",
    "streak": "{{days}} günlük seri",
    "emptyTitle": "Bu hafta henüz başlamadın",
    "emptyBody": "İlk adımı at, haftalık özetin burada görünsün.",
    "emptyCta": "Egzersize başla"
  },
  "screen": {
    "title": "Haftalık Özet",
    "range": "{{start}} - {{end}}",
    "minutesLabel": "Toplam Süre",
    "wpmLabel": "Ortalama Hız",
    "streakLabel": "Güncel Seri",
    "noComparison": "Kıyaslamak için geçen hafta veri yok",
    "completeWeekCta": "Bu haftayı da tamamla"
  }
}
```

- [ ] **Step 2: Register the namespace in `src/i18n/index.ts`**

```typescript
import weeklySummary from './locales/tr/weeklySummary.json';
```

Add `weeklySummary,` to both the import list ordering (alphabetical, next to `subscription`/`notifications` — place after `subscription` and before `notifications` to match existing alphabetical-ish grouping, or simply append after `notifications`) and the `resources.tr` object:

```typescript
export const resources = {
  tr: {
    auth,
    common,
    dailyPlan,
    errors,
    exercises,
    home,
    navigation,
    onboarding,
    progress,
    settings,
    subscription,
    notifications,
    weeklySummary,
  },
} as const;
```

- [ ] **Step 3: Typecheck, run i18n check, and commit**

```bash
bun run typecheck
bun run i18n:check
git add src/i18n/locales/tr/weeklySummary.json src/i18n/index.ts
git commit -m "feat: add weeklySummary i18n namespace"
```

---

### Task 6: Home screen card

**Files:**
- Create: `src/features/weeklySummary/WeeklySummaryCard.tsx`
- Modify: `src/app/(app)/(tabs)/index.tsx`

**Interfaces:**
- Consumes: `buildWeeklySummary`, `DailyStatInput` from `@/utils/weeklySummary` (Task 1); `buildLocalStats` from `@/utils/localStatistics` (existing); `getLocalDateString` from `@/utils/streak` (existing); `useLocalHistoryStore`, `useStreakCacheStore`, `useRevenueCat`, `api.statistics.getPerformanceStats` (existing, same pattern as `DailyPlanCard`).
- Produces: `WeeklySummaryCard` component, rendered on the home screen below `DailyPlanCard`. No props.

- [ ] **Step 1: Write the component**

```typescript
// src/features/weeklySummary/WeeklySummaryCard.tsx
import { useMemo, useState } from 'react';
import { Card, H4, Text, YStack, Button } from 'tamagui';
import { useRouter, Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'convex/react';
import { useAuth } from '@clerk/clerk-expo';
import { api } from '@/convex/_generated/api';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { useStreakCacheStore } from '@/stores/streakCacheStore';
import { getLocalDateString } from '@/utils/streak';
import { buildLocalStats } from '@/utils/localStatistics';
import { buildWeeklySummary, type DailyStatInput } from '@/utils/weeklySummary';

export function WeeklySummaryCard() {
  const router = useRouter();
  const { t } = useTranslation('weeklySummary');
  const { isPremium } = useRevenueCat();
  const { isLoaded, isSignedIn } = useAuth();
  const currentStreak = useStreakCacheStore((s) => s.currentStreak);
  const localSessions = useLocalHistoryStore((s) => s.sessions);

  const shouldFetch = isLoaded && isSignedIn && isPremium;
  const stats = useQuery(api.statistics.getPerformanceStats, shouldFetch ? { timeRange: '30d' } : 'skip');

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  // eslint-disable-next-line react-hooks/purity
  const [now] = useState(() => Date.now());
  const today = getLocalDateString(now, timeZone);

  const summary = useMemo(() => {
    const dailyTrends = shouldFetch
      ? stats?.dailyTrends
      : buildLocalStats(localSessions, '30d', now, timeZone).dailyTrends;

    if (!dailyTrends) return null;

    const dailyStats: DailyStatInput[] = dailyTrends.map((d) => ({
      date: d.date,
      durationMs: d.durationMs,
      avgWpm: d.avgWpm,
      sessionCount: d.sessionCount,
    }));

    return buildWeeklySummary(dailyStats, today, currentStreak);
  }, [shouldFetch, stats, localSessions, timeZone, now, today, currentStreak]);

  if (shouldFetch && stats === undefined) return null; // loading
  if (!summary) return null;

  const handlePress = () => router.push('/(app)/weekly-summary' as Href);

  if (summary.isEmpty) {
    return (
      <Card padding="$4" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover" elevation="$1" onPress={handlePress}>
        <YStack gap="$2">
          <H4>{t('card.emptyTitle')}</H4>
          <Text color="$color11" fontSize="$2">{t('card.emptyBody')}</Text>
          <Button size="$3" theme="accent" onPress={handlePress}>{t('card.emptyCta')}</Button>
        </YStack>
      </Card>
    );
  }

  return (
    <Card padding="$4" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover" elevation="$1" onPress={handlePress}>
      <YStack gap="$2">
        <H4>{t('card.title')}</H4>
        <Text fontSize="$5" fontWeight="bold">{t('card.minutes', { minutes: summary.totalMinutes })}</Text>
        {summary.wpmDeltaPercent !== null && (
          <Text color={summary.wpmDeltaPercent >= 0 ? '$green10' : '$color11'} fontSize="$3">
            {t(summary.wpmDeltaPercent >= 0 ? 'card.trendUp' : 'card.trendDown', {
              percent: Math.abs(summary.wpmDeltaPercent),
            })}
          </Text>
        )}
        {summary.streakDays > 0 && (
          <Text color="$color11" fontSize="$2">{t('card.streak', { days: summary.streakDays })}</Text>
        )}
      </YStack>
    </Card>
  );
}
```

- [ ] **Step 2: Wire it into the home screen**

In `src/app/(app)/(tabs)/index.tsx`, add the import:

```typescript
import { WeeklySummaryCard } from '@/features/weeklySummary/WeeklySummaryCard';
```

And render it directly below `<DailyPlanCard />` (`src/app/(app)/(tabs)/index.tsx:129`):

```typescript
          {/* Daily Plan */}
          <DailyPlanCard />

          {/* Weekly Summary */}
          <WeeklySummaryCard />
```

- [ ] **Step 3: Typecheck, lint, and commit**

```bash
bun run typecheck
bun run lint
git add src/features/weeklySummary/WeeklySummaryCard.tsx src/app/\(app\)/\(tabs\)/index.tsx
git commit -m "feat: add weekly summary card to home screen"
```

---

### Task 7: Full-screen weekly summary + route

**Files:**
- Create: `src/features/weeklySummary/WeeklySummaryScreen.tsx`
- Create: `src/app/(app)/weekly-summary.tsx`

**Interfaces:**
- Consumes: same data hooks as `WeeklySummaryCard` (Task 6) — this screen duplicates the same computation rather than accepting it as a prop, since it's also the direct target of a cold-start notification tap (no card render happens first in that case).
- Produces: route `/(app)/weekly-summary`, reachable from the card (Task 6), the premium server push (Task 3, `data.screen`), and the free/guest local notification (Task 4, `data.screen`).

- [ ] **Step 1: Write the screen**

```typescript
// src/features/weeklySummary/WeeklySummaryScreen.tsx
import { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, Text, H2, H4, Card, Button, Spinner, View } from 'tamagui';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'convex/react';
import { useAuth } from '@clerk/clerk-expo';
import { api } from '@/convex/_generated/api';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { useStreakCacheStore } from '@/stores/streakCacheStore';
import { getLocalDateString } from '@/utils/streak';
import { buildLocalStats } from '@/utils/localStatistics';
import { buildWeeklySummary, type DailyStatInput } from '@/utils/weeklySummary';

export function WeeklySummaryScreen() {
  const router = useRouter();
  const { t } = useTranslation('weeklySummary');
  const { isPremium } = useRevenueCat();
  const { isLoaded, isSignedIn } = useAuth();
  const currentStreak = useStreakCacheStore((s) => s.currentStreak);
  const localSessions = useLocalHistoryStore((s) => s.sessions);

  const shouldFetch = isLoaded && isSignedIn && isPremium;
  const stats = useQuery(api.statistics.getPerformanceStats, shouldFetch ? { timeRange: '30d' } : 'skip');

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  // eslint-disable-next-line react-hooks/purity
  const [now] = useState(() => Date.now());
  const today = getLocalDateString(now, timeZone);

  const summary = useMemo(() => {
    const dailyTrends = shouldFetch
      ? stats?.dailyTrends
      : buildLocalStats(localSessions, '30d', now, timeZone).dailyTrends;

    if (!dailyTrends) return null;

    const dailyStats: DailyStatInput[] = dailyTrends.map((d) => ({
      date: d.date,
      durationMs: d.durationMs,
      avgWpm: d.avgWpm,
      sessionCount: d.sessionCount,
    }));

    return buildWeeklySummary(dailyStats, today, currentStreak);
  }, [shouldFetch, stats, localSessions, timeZone, now, today, currentStreak]);

  if (shouldFetch && stats === undefined) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" />
      </View>
    );
  }

  if (!summary) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
      <YStack flex={1} backgroundColor="$background" padding="$4" gap="$4">
        <H2>{t('screen.title')}</H2>
        <Text color="$color11">{t('screen.range', { start: summary.weekStartDate, end: summary.weekEndDate })}</Text>

        {summary.isEmpty ? (
          <Card padding="$4" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover">
            <YStack gap="$2">
              <H4>{t('card.emptyTitle')}</H4>
              <Text color="$color11">{t('card.emptyBody')}</Text>
            </YStack>
          </Card>
        ) : (
          <YStack gap="$3">
            <Card padding="$4" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover">
              <Text color="$color11" fontSize="$2">{t('screen.minutesLabel')}</Text>
              <Text fontSize="$8" fontWeight="bold">{summary.totalMinutes}</Text>
            </Card>
            <Card padding="$4" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover">
              <Text color="$color11" fontSize="$2">{t('screen.wpmLabel')}</Text>
              <Text fontSize="$8" fontWeight="bold">{summary.avgWpmThisWeek ?? '-'}</Text>
              {summary.wpmDeltaPercent !== null ? (
                <Text color={summary.wpmDeltaPercent >= 0 ? '$green10' : '$color11'}>
                  {t(summary.wpmDeltaPercent >= 0 ? 'card.trendUp' : 'card.trendDown', {
                    percent: Math.abs(summary.wpmDeltaPercent),
                  })}
                </Text>
              ) : (
                <Text color="$color11" fontSize="$2">{t('screen.noComparison')}</Text>
              )}
            </Card>
            <Card padding="$4" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover">
              <Text color="$color11" fontSize="$2">{t('screen.streakLabel')}</Text>
              <Text fontSize="$8" fontWeight="bold">{summary.streakDays}</Text>
            </Card>
          </YStack>
        )}

        <Button size="$5" theme="accent" onPress={() => router.replace('/(app)/(tabs)')}>
          {t('screen.completeWeekCta')}
        </Button>
      </YStack>
    </SafeAreaView>
  );
}
```

- [ ] **Step 2: Create the route file**

```typescript
// src/app/(app)/weekly-summary.tsx
import { WeeklySummaryScreen } from '@/features/weeklySummary/WeeklySummaryScreen';

export default function WeeklySummaryRoute() {
  return <WeeklySummaryScreen />;
}
```

- [ ] **Step 3: Typecheck, lint, and commit**

```bash
bun run typecheck
bun run lint
git add src/features/weeklySummary/WeeklySummaryScreen.tsx src/app/\(app\)/weekly-summary.tsx
git commit -m "feat: add full-screen weekly summary route"
```

---

### Task 8: Manual verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full validation suite**

```bash
bun run typecheck
bun run lint
bun test
```

Expected: all green.

- [ ] **Step 2: Manual walkthrough in the running app**

Start the dev server (`bun start`) and, for both a free/guest session and a premium session:
1. Open the home screen — confirm the `WeeklySummaryCard` renders below the daily plan card (empty-state copy if no sessions this week, real numbers otherwise).
2. Tap the card — confirm it navigates to `/(app)/weekly-summary` and the numbers match the card.
3. Complete an exercise, then re-check the card/screen reflect the new session (free/guest: immediate, since it reads local history; premium: after the Convex mutation round-trip).
4. In Settings → Bildirimler, toggle "İlerleme Bildirimleri" off then on as a free/guest user, and confirm (via `Notifications.getAllScheduledNotificationsAsync()` in a debug log, or just trusting Step 3 of Task 4's implementation) the `weekly-summary` local notification is cancelled and re-scheduled without erroring.
5. As a premium user, confirm toggling the same setting does *not* schedule a local `weekly-summary` notification (since `scheduleWeeklySummaryNotification` short-circuits on `isPremium`).

- [ ] **Step 3: No commit for this task** — it's verification only. If any check fails, fix it in the relevant earlier task's files and re-run this task's Step 1.

---

### Task 9: Documentation updates

**Files:**
- Modify: `FEATURE_BACKLOG.md`
- Modify: `PROJECT_STATUS.md`

**Interfaces:** none — documentation only.

- [ ] **Step 1: Mark the backlog item as implemented**

In `FEATURE_BACKLOG.md`, change the "## 2. Haftalık Özet" heading to follow the existing "UYGULANDI" convention used by items 6, 7.1, 7.2, and 8 (see those sections for the exact phrasing pattern: `## N. Title — UYGULANDI (YYYY-MM-DD)` followed by a short paragraph on what shipped and where, plus an optional "Sonraki adım" note). Summarize: shared `src/utils/weeklySummary.ts` calculator, premium path (`convex/crons.ts` + `convex/weeklySummary.ts`, hourly cron gated by `isWeeklyDigestHour`), free/guest path (native `WEEKLY` local notification via `scheduleWeeklySummaryNotification`), UI (`WeeklySummaryCard` on home, `/(app)/weekly-summary` screen). Update the "Son güncelleme" line at the top of the file to today's date and mention item 2.

- [ ] **Step 2: Add the feature to `PROJECT_STATUS.md`**

Read the "## Main Features" and "## Completed" sections first to match their existing bullet style, then add a bullet for the weekly summary feature (home card + full screen + premium push + free/guest local notification) in both sections as appropriate, following whatever granularity the surrounding bullets already use.

- [ ] **Step 3: Commit**

```bash
git add FEATURE_BACKLOG.md PROJECT_STATUS.md
git commit -m "docs: mark weekly summary feature as implemented"
```
