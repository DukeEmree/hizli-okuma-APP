import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { userScopedStorageAdapter } from './storage';
import { ExerciseConfig } from '@/types/exercise';

export interface ExerciseSettingsState {
  configs: Record<string, ExerciseConfig>;

  getExerciseConfig: (exerciseId: string, defaultConfig: ExerciseConfig) => ExerciseConfig;
  updateExerciseConfig: (exerciseId: string, config: Partial<ExerciseConfig>) => void;
  resetAll: () => void;
}

export const useExerciseSettingsStore = create<ExerciseSettingsState>()(
  persist(
    (set, get) => ({
      configs: {},

      getExerciseConfig: (exerciseId, defaultConfig) => {
        const storedConfig = get().configs[exerciseId];
        if (!storedConfig) return { ...defaultConfig };
        return { ...defaultConfig, ...storedConfig };
      },

      updateExerciseConfig: (exerciseId, config) =>
        set((state) => {
          const current = state.configs[exerciseId] || {};
          return {
            configs: {
              ...state.configs,
              [exerciseId]: {
                ...current,
                ...config,
              },
            },
          };
        }),

      resetAll: () => set({ configs: {} }),
    }),
    {
      name: 'exercise-settings-store',
      storage: createJSONStorage(() => userScopedStorageAdapter),
      version: 1,
    }
  )
);
