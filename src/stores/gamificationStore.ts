import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { userScopedStorageAdapter } from './storage';
import type { GamificationResult } from '@/utils/gamification';

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
      name: 'gamification-store',
      storage: createJSONStorage(() => userScopedStorageAdapter),
      version: 1,
    },
  ),
);
