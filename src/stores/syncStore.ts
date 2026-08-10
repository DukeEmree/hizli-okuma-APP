import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { userScopedStorageAdapter } from './storage';
import { Id } from "@/convex/_generated/dataModel";
import { ExerciseMetrics } from "@/types/exercise";

export type PendingSession = {
  clientSessionId: string;
  exerciseId: string;
  exerciseType: string;
  startedAt: number;
  completedAt: number;
  durationMs: number;
  difficulty: number;
  score: number;
  metrics?: Partial<ExerciseMetrics>;
  algorithmVersion: number;
  retryCount: number;
  lastRetryAt?: number;
};

interface SyncState {
  pendingSessions: PendingSession[];
  addSession: (session: Omit<PendingSession, 'retryCount'>) => void;
  removeSession: (clientSessionId: string) => void;
  incrementRetryCount: (clientSessionId: string) => void;
  clearQueue: () => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      pendingSessions: [],
      addSession: (session) =>
        set((state) => ({
          pendingSessions: [
            ...state.pendingSessions,
            { ...session, retryCount: 0 },
          ],
        })),
      removeSession: (clientSessionId) =>
        set((state) => ({
          pendingSessions: state.pendingSessions.filter(
            (s) => s.clientSessionId !== clientSessionId
          ),
        })),
      incrementRetryCount: (clientSessionId) =>
        set((state) => ({
          pendingSessions: state.pendingSessions.map((s) =>
            s.clientSessionId === clientSessionId
              ? { ...s, retryCount: s.retryCount + 1, lastRetryAt: Date.now() }
              : s
          ),
        })),
      clearQueue: () => set({ pendingSessions: [] }),
    }),
    {
      name: 'sync-storage',
      storage: createJSONStorage(() => userScopedStorageAdapter),
    }
  )
);
