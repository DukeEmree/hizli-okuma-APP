import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { userScopedStorageAdapter } from "./storage";

/**
 * The onboarding assessment's results.
 *
 * This used to be a general aggregate-counters store, but every counter it
 * carried (training seconds, completed exercises, cached streaks, last sync
 * time) is now derived from `localHistoryStore` / `streakCacheStore` and had
 * no writer left. What remains is the one thing nothing else records: the
 * WPM and comprehension measured before the user has any session history, so
 * the home screen has something to show on day one.
 */
export interface UserProgressState {
  bestWpm: number;
  bestComprehension: number;

  updateBestWpm: (wpm: number) => void;
  updateBestComprehension: (comprehension: number) => void;
  resetProgress: () => void;
}

const initialState = {
  bestWpm: 0,
  bestComprehension: 0,
};

export const useUserProgressStore = create<UserProgressState>()(
  persist(
    (set) => ({
      ...initialState,
      updateBestWpm: (wpm) =>
        set((state) => ({ bestWpm: Math.max(state.bestWpm, wpm) })),
      updateBestComprehension: (comprehension) =>
        set((state) => ({
          bestComprehension: Math.max(state.bestComprehension, comprehension),
        })),
      resetProgress: () => set(initialState),
    }),
    {
      name: "user-progress-store",
      storage: createJSONStorage(() => userScopedStorageAdapter),
      version: 1,
    },
  ),
);
