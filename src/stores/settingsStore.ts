import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { globalStorageAdapter } from "./storage";

export type ThemeType = "light" | "dark" | "system";
export type LanguageType = "tr" | "en" | "de";

export interface SettingsState {
  theme: ThemeType;
  language: LanguageType;
  notificationsEnabled: boolean;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  streakReminderEnabled: boolean;
  progressNotificationsEnabled: boolean;
  notifiedMilestones: number[];
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  dailyGoalMinutes: number;
  hasCompletedOnboarding: boolean;
  metronomeEnabled: boolean;

  setTheme: (theme: ThemeType) => void;
  setLanguage: (lang: LanguageType) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setDailyReminderEnabled: (enabled: boolean) => void;
  setDailyReminderTime: (time: string) => void;
  setStreakReminderEnabled: (enabled: boolean) => void;
  setProgressNotificationsEnabled: (enabled: boolean) => void;
  addNotifiedMilestone: (milestone: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setDailyGoalMinutes: (minutes: number) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  setMetronomeEnabled: (enabled: boolean) => void;
  resetSettings: () => void;
}

const initialState = {
  theme: "system" as ThemeType,
  language: "tr" as LanguageType,
  notificationsEnabled: true,
  dailyReminderEnabled: true,
  dailyReminderTime: "20:00",
  streakReminderEnabled: true,
  progressNotificationsEnabled: true,
  notifiedMilestones: [],
  soundEnabled: true,
  hapticsEnabled: true,
  dailyGoalMinutes: 15,
  hasCompletedOnboarding: false,
  metronomeEnabled: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setNotificationsEnabled: (notificationsEnabled) =>
        set({ notificationsEnabled }),
      setDailyReminderEnabled: (dailyReminderEnabled) =>
        set({ dailyReminderEnabled }),
      setDailyReminderTime: (dailyReminderTime) => set({ dailyReminderTime }),
      setStreakReminderEnabled: (streakReminderEnabled) =>
        set({ streakReminderEnabled }),
      setProgressNotificationsEnabled: (progressNotificationsEnabled) =>
        set({ progressNotificationsEnabled }),
      addNotifiedMilestone: (milestone) =>
        set((state) => ({
          notifiedMilestones: state.notifiedMilestones.includes(milestone)
            ? state.notifiedMilestones
            : [...state.notifiedMilestones, milestone],
        })),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      setDailyGoalMinutes: (dailyGoalMinutes) => set({ dailyGoalMinutes }),
      setHasCompletedOnboarding: (hasCompletedOnboarding) =>
        set({ hasCompletedOnboarding }),
      setMetronomeEnabled: (metronomeEnabled) => set({ metronomeEnabled }),
      resetSettings: () => set(initialState),
    }),
    {
      name: "settings-store", // Benzersiz key
      storage: createJSONStorage(() => globalStorageAdapter),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        return persistedState as SettingsState;
      },
    },
  ),
);
