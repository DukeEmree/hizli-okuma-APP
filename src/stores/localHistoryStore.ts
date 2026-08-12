import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { userScopedStorageAdapter } from "./storage";
import type { ExerciseMetrics } from "@/types/exercise";

/**
 * Local exercise history, kept on the device for every user.
 *
 * There is no backend and no cloud copy — this on-device, 6-month rolling
 * window is the only copy of a session's history that exists, for every
 * user regardless of subscription tier. It is what the statistics and
 * dashboard screens read.
 */

/** ~6 months. Sessions older than this are dropped on the next write. */
export const LOCAL_HISTORY_RETENTION_MS = 180 * 24 * 60 * 60 * 1000;

export type LocalSession = {
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
  synced: boolean;
};

/**
 * Drops sessions outside the retention window and keeps the list newest-last.
 * Pure so the retention rule can be tested without a store or MMKV.
 */
export function pruneSessions(
  sessions: LocalSession[],
  now: number,
  retentionMs: number = LOCAL_HISTORY_RETENTION_MS,
): LocalSession[] {
  const cutoff = now - retentionMs;
  return sessions
    .filter((s) => s.completedAt >= cutoff)
    .sort((a, b) => a.completedAt - b.completedAt);
}

interface LocalHistoryState {
  sessions: LocalSession[];
  addSession: (session: Omit<LocalSession, "synced">, synced?: boolean) => void;
  markSynced: (clientSessionId: string) => void;
  prune: () => void;
  clear: () => void;
}

export const useLocalHistoryStore = create<LocalHistoryState>()(
  persist(
    (set) => ({
      sessions: [],

      addSession: (session, synced = false) =>
        set((state) => {
          // Guard against a double-submit writing the same session twice.
          if (
            state.sessions.some(
              (s) => s.clientSessionId === session.clientSessionId,
            )
          ) {
            return state;
          }
          return {
            sessions: pruneSessions(
              [...state.sessions, { ...session, synced }],
              Date.now(),
            ),
          };
        }),

      markSynced: (clientSessionId) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.clientSessionId === clientSessionId ? { ...s, synced: true } : s,
          ),
        })),

      prune: () =>
        set((state) => ({ sessions: pruneSessions(state.sessions, Date.now()) })),

      clear: () => set({ sessions: [] }),
    }),
    {
      name: "local-history-store",
      storage: createJSONStorage(() => userScopedStorageAdapter),
      version: 1,
    },
  ),
);
