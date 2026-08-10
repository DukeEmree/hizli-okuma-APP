import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { userScopedStorageAdapter } from "./storage";

export interface UserProgressState {
  totalTrainingSeconds: number;
  completedExercises: number;
  bestWpm: number;
  bestComprehension: number;
  currentStreakCache: number;
  longestStreakCache: number;
  lastSyncAt: string | null;

  addTrainingSeconds: (seconds: number) => void;
  incrementCompletedExercises: () => void;
  updateBestWpm: (wpm: number) => void;
  updateBestComprehension: (comprehension: number) => void;
  setStreaks: (current: number, longest: number) => void;
  setLastSyncAt: (timestamp: string) => void;
  resetProgress: () => void;
}

const initialState = {
  totalTrainingSeconds: 0,
  completedExercises: 0,
  bestWpm: 0,
  bestComprehension: 0,
  currentStreakCache: 0,
  longestStreakCache: 0,
  lastSyncAt: null,
};

export const useUserProgressStore = create<UserProgressState>()(
  persist(
    (set) => ({
      ...initialState,
      addTrainingSeconds: (seconds) =>
        set((state) => ({
          totalTrainingSeconds: state.totalTrainingSeconds + seconds,
        })),
      incrementCompletedExercises: () =>
        set((state) => ({ completedExercises: state.completedExercises + 1 })),
      updateBestWpm: (wpm) =>
        set((state) => ({ bestWpm: Math.max(state.bestWpm, wpm) })),
      updateBestComprehension: (comprehension) =>
        set((state) => ({
          bestComprehension: Math.max(state.bestComprehension, comprehension),
        })),
      setStreaks: (current, longest) =>
        set({ currentStreakCache: current, longestStreakCache: longest }),
      setLastSyncAt: (timestamp) => set({ lastSyncAt: timestamp }),
      resetProgress: () => set(initialState),
    }),
    {
      name: "user-progress-store",
      storage: createJSONStorage(() => userScopedStorageAdapter),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        return persistedState as UserProgressState;
      },
    },
  ),
);
