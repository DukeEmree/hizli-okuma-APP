import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { userScopedStorageAdapter } from "./storage";

/** Days on which a streak is celebrated (notification + interstitial paywall). */
export const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100, 365];

interface StreakCacheState {
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: number;
  freezesAvailable: number;
  updateCache: (streak: {
    currentStreak: number;
    longestStreak: number;
    lastActivityAt: number;
    freezesAvailable?: number;
  }) => void;
  resetCache: () => void;
}

export const useStreakCacheStore = create<StreakCacheState>()(
  persist(
    (set) => ({
      currentStreak: 0,
      longestStreak: 0,
      lastActivityAt: 0,
      freezesAvailable: 0,
      updateCache: (streak) => {
        set({ ...streak, freezesAvailable: streak.freezesAvailable ?? 0 });
        // Async import to avoid circular dependency issues
        import("@/services/notifications").then((module) => {
          module.rescheduleAllReminders().catch(console.error);

          if (STREAK_MILESTONES.includes(streak.currentStreak)) {
            module
              .sendMilestoneNotification(streak.currentStreak)
              .catch(console.error);
          }
        });
      },
      resetCache: () =>
        set({
          currentStreak: 0,
          longestStreak: 0,
          lastActivityAt: 0,
          freezesAvailable: 0,
        }),
    }),
    {
      name: "streak-cache-store",
      storage: createJSONStorage(() => userScopedStorageAdapter),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        return persistedState as StreakCacheState;
      },
    },
  ),
);
