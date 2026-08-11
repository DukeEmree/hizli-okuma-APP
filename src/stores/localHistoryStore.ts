import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { userScopedStorageAdapter } from "./storage";
import type { PendingSession } from "./syncStore";

/**
 * Local exercise history, kept on the device for every user.
 *
 * This exists because `syncStore` used to serve two unrelated purposes: the
 * pending-upload queue AND the only history a non-premium user has. The
 * queue never drains for free users (the server refuses their writes), so it
 * grew without bound and was re-parsed in full on every launch.
 *
 * Now the split is explicit:
 * - `syncStore`  = strictly an upload queue; empties as sessions reach Convex.
 * - this store   = the last 6 months of sessions, on-device, for everyone.
 *
 * Premium users additionally get their sessions stored in Convex (the cloud
 * copy is the durable one and has no retention limit). Free users keep this
 * 6-month local window and nothing else, which is also what the statistics
 * and dashboard screens read for them.
 */

/** ~6 months. Sessions older than this are dropped on the next write. */
export const LOCAL_HISTORY_RETENTION_MS = 180 * 24 * 60 * 60 * 1000;

export type LocalSession = Omit<PendingSession, "retryCount" | "lastRetryAt"> & {
  /** True once Convex has accepted this session (premium users only). */
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
