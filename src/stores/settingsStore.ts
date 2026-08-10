import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { globalStorageAdapter } from './storage';

export type ThemeType = 'light' | 'dark' | 'system';
export type LanguageType = 'tr' | 'en' | 'de';

export interface SettingsState {
  theme: ThemeType;
  language: LanguageType;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  dailyGoalMinutes: number;
  hasCompletedOnboarding: boolean;

  setTheme: (theme: ThemeType) => void;
  setLanguage: (lang: LanguageType) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setDailyGoalMinutes: (minutes: number) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  resetSettings: () => void;
}

const initialState = {
  theme: 'system' as ThemeType,
  language: 'tr' as LanguageType,
  notificationsEnabled: true,
  soundEnabled: true,
  hapticsEnabled: true,
  dailyGoalMinutes: 15,
  hasCompletedOnboarding: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      setDailyGoalMinutes: (dailyGoalMinutes) => set({ dailyGoalMinutes }),
      setHasCompletedOnboarding: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),
      resetSettings: () => set(initialState),
    }),
    {
      name: 'settings-store', // Benzersiz key
      storage: createJSONStorage(() => globalStorageAdapter),
      version: 1, // Schema değiştiğinde migrate için
      // migrate: (persistedState, version) => ...
    }
  )
);
