import { mmkv } from '@/stores/storage';
import type { PendingSession } from '@/stores/syncStore';
import type { ExerciseMetrics } from '@/stores/exerciseProgressStore';

// Must match the `version` declared on each store's `persist()` config -
// zustand's persist middleware discards the entire persisted blob (falling
// back to defaults) if it sees a version mismatch and no `migrate()` is
// registered, so a stale hardcoded version here silently wipes the data
// this function is trying to preserve.
const SYNC_STORAGE_VERSION = 1;
const EXERCISE_PROGRESS_STORAGE_VERSION = 1;

export const migrateGuestDataToUser = (userId: string) => {
  try {
    // 1. Migrate Sync Queue (Pending Sessions)
    const guestSyncQueueStr = mmkv.getString('guest_sync-storage');

    if (guestSyncQueueStr) {
      const guestSyncData = JSON.parse(guestSyncQueueStr);
      const guestSessions: PendingSession[] = guestSyncData?.state?.pendingSessions || [];

      if (guestSessions.length > 0) {
        const userSyncQueueStr = mmkv.getString(`${userId}_sync-storage`);
        let userSessions: PendingSession[] = [];

        if (userSyncQueueStr) {
          const userSyncData = JSON.parse(userSyncQueueStr);
          userSessions = userSyncData?.state?.pendingSessions || [];
        }

        // Deduplicate based on clientSessionId
        const existingSessionIds = new Set(userSessions.map(s => s.clientSessionId));
        const sessionsToAdd = guestSessions.filter(s => !existingSessionIds.has(s.clientSessionId));

        const newSessions = [...userSessions, ...sessionsToAdd];

        // Write back to user's storage
        const newState = {
          state: {
            pendingSessions: newSessions
          },
          version: SYNC_STORAGE_VERSION
        };
        mmkv.set(`${userId}_sync-storage`, JSON.stringify(newState));
      }

      // Clear guest sync storage
      mmkv.remove('guest_sync-storage');
    }

    // 2. Migrate User Progress
    const guestProgressStr = mmkv.getString('guest_user-progress-store');
    if (guestProgressStr) {
      const guestProgressData = JSON.parse(guestProgressStr);
      const guestState = guestProgressData?.state;
      
      if (guestState && guestState.totalTrainingSeconds > 0) {
        const userProgressStr = mmkv.getString(`${userId}_user-progress-store`);
        let userState = {
          totalTrainingSeconds: 0,
          completedExercises: 0,
          bestWpm: 0,
          bestComprehension: 0,
          currentStreakCache: 0,
          longestStreakCache: 0,
          lastSyncAt: null as string | null,
        };
        let version = 1;
        
        if (userProgressStr) {
          const userProgressData = JSON.parse(userProgressStr);
          if (userProgressData?.state) {
            userState = { ...userState, ...userProgressData.state };
          }
          version = userProgressData?.version || 1;
        }

        // Merge logic
        userState.totalTrainingSeconds += (guestState.totalTrainingSeconds || 0);
        userState.completedExercises += (guestState.completedExercises || 0);
        userState.bestWpm = Math.max(userState.bestWpm, guestState.bestWpm || 0);
        userState.bestComprehension = Math.max(userState.bestComprehension, guestState.bestComprehension || 0);
        
        userState.currentStreakCache = Math.max(userState.currentStreakCache, guestState.currentStreakCache || 0);
        userState.longestStreakCache = Math.max(userState.longestStreakCache, guestState.longestStreakCache || 0);

        mmkv.set(`${userId}_user-progress-store`, JSON.stringify({ state: userState, version }));
      }
      
      // Clear guest progress storage
      mmkv.remove('guest_user-progress-store');
    }

    // 3. Migrate Streak Cache (this is only a local cache - the server
    // recalculates the authoritative streak from exerciseSessions on the
    // next sync - but merge it anyway so the UI doesn't regress to 0 while
    // waiting for that recalculation).
    const guestStreakStr = mmkv.getString('guest_streak-cache-store');
    if (guestStreakStr) {
      const guestStreakData = JSON.parse(guestStreakStr);
      const guestStreakState = guestStreakData?.state;

      if (guestStreakState && guestStreakState.currentStreak > 0) {
        const userStreakStr = mmkv.getString(`${userId}_streak-cache-store`);
        let userStreakState = { currentStreak: 0, longestStreak: 0, lastActivityAt: 0 };
        let version = 1;

        if (userStreakStr) {
          const userStreakData = JSON.parse(userStreakStr);
          if (userStreakData?.state) {
            userStreakState = { ...userStreakState, ...userStreakData.state };
          }
          version = userStreakData?.version ?? 1;
        }

        if (guestStreakState.lastActivityAt >= userStreakState.lastActivityAt) {
          userStreakState = {
            currentStreak: guestStreakState.currentStreak || 0,
            longestStreak: Math.max(userStreakState.longestStreak, guestStreakState.longestStreak || 0),
            lastActivityAt: guestStreakState.lastActivityAt,
          };
          mmkv.set(`${userId}_streak-cache-store`, JSON.stringify({ state: userStreakState, version }));
        }
      }

      mmkv.remove('guest_streak-cache-store');
    }

    // 4. Migrate per-exercise adaptive-difficulty progress
    const guestExerciseProgressStr = mmkv.getString('guest_exercise-progress-store');
    if (guestExerciseProgressStr) {
      const guestData = JSON.parse(guestExerciseProgressStr);
      const guestExercises: Record<string, ExerciseMetrics> = guestData?.state?.exercises || {};

      if (Object.keys(guestExercises).length > 0) {
        const userExerciseProgressStr = mmkv.getString(`${userId}_exercise-progress-store`);
        let userExercises: Record<string, ExerciseMetrics> = {};

        if (userExerciseProgressStr) {
          const userData = JSON.parse(userExerciseProgressStr);
          userExercises = userData?.state?.exercises || {};
        }

        const mergedExercises = { ...userExercises };
        for (const [exerciseId, guestMetrics] of Object.entries(guestExercises)) {
          const existing = mergedExercises[exerciseId];
          if (!existing) {
            mergedExercises[exerciseId] = guestMetrics;
          } else {
            // Keep the more advanced progression state as a whole (mixing
            // currentDifficulty/consecutiveSuccesses from two different
            // runs would produce a nonsensical progression), but merge the
            // best-* stats independently since those are just maxima.
            const moreAdvanced = guestMetrics.historicalBestLevel > existing.historicalBestLevel ? guestMetrics : existing;
            mergedExercises[exerciseId] = {
              ...moreAdvanced,
              bestScore: Math.max(existing.bestScore, guestMetrics.bestScore),
              bestWpm: Math.max(existing.bestWpm, guestMetrics.bestWpm),
              bestAccuracy: Math.max(existing.bestAccuracy, guestMetrics.bestAccuracy),
              bestComprehension: Math.max(existing.bestComprehension, guestMetrics.bestComprehension),
              attemptCount: existing.attemptCount + guestMetrics.attemptCount,
            };
          }
        }

        mmkv.set(
          `${userId}_exercise-progress-store`,
          JSON.stringify({ state: { exercises: mergedExercises }, version: EXERCISE_PROGRESS_STORAGE_VERSION }),
        );
      }

      mmkv.remove('guest_exercise-progress-store');
    }
  } catch (error) {
    console.error('Error during guest data migration:', error);
  }
};
