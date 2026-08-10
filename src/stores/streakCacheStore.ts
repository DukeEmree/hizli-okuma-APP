import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { userScopedStorageAdapter } from './storage';

interface StreakCacheState {
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: number;
  updateCache: (streak: { currentStreak: number; longestStreak: number; lastActivityAt: number }) => void;
  resetCache: () => void;
}

export const useStreakCacheStore = create<StreakCacheState>()(
  persist(
    (set) => ({
      currentStreak: 0,
      longestStreak: 0,
      lastActivityAt: 0,
      updateCache: (streak) => set(streak),
      resetCache: () => set({ currentStreak: 0, longestStreak: 0, lastActivityAt: 0 }),
    }),
    {
      name: 'streak-cache-store',
      storage: createJSONStorage(() => userScopedStorageAdapter),
    }
  )
);
