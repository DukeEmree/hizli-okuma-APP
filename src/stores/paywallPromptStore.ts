import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { userScopedStorageAdapter } from "./storage";

interface PaywallPromptStoreState {
  lastShownAt: number;
  lastTrigger: string | null;
  markShown: (trigger: string, now: number) => void;
  resetPrompts: () => void;
}

export const usePaywallPromptStore = create<PaywallPromptStoreState>()(
  persist(
    (set) => ({
      lastShownAt: 0,
      lastTrigger: null,
      markShown: (trigger, now) => set({ lastShownAt: now, lastTrigger: trigger }),
      resetPrompts: () => set({ lastShownAt: 0, lastTrigger: null }),
    }),
    {
      name: "paywall-prompt-store",
      storage: createJSONStorage(() => userScopedStorageAdapter),
      version: 1,
    },
  ),
);
