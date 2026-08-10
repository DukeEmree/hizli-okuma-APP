import { create } from 'zustand';

export type AchievementPopupData = {
  id: string;
  title: string;
  icon: string;
};

interface GamificationState {
  pendingAchievements: AchievementPopupData[];
  addAchievement: (achievement: AchievementPopupData) => void;
  removeAchievement: (id: string) => void;
  clearAchievements: () => void;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  pendingAchievements: [],
  addAchievement: (achievement) =>
    set((state) => ({
      pendingAchievements: [...state.pendingAchievements, achievement],
    })),
  removeAchievement: (id) =>
    set((state) => ({
      pendingAchievements: state.pendingAchievements.filter((a) => a.id !== id),
    })),
  clearAchievements: () => set({ pendingAchievements: [] }),
}));
