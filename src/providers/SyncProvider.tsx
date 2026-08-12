import React, { useEffect, useRef, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useSyncStore } from "@/stores/syncStore";
import { useLocalHistoryStore } from "@/stores/localHistoryStore";
import { useMutation } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { useAuth } from '@clerk/clerk-expo';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { useGamificationStore } from "@/stores/gamificationStore";
import { ACHIEVEMENTS } from "@/constants/gamification";
import { AppState, AppStateStatus } from 'react-native';
import { analytics } from '@/lib/analytics';
import { captureException } from '@/lib/sentry';

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const pendingSessionsLength = useSyncStore((state) => state.pendingSessions.length);
  const createSessions = useMutation(api.exerciseSessions.createSessions);
  const addAchievement = useGamificationStore((state) => state.addAchievement);
  const { isSignedIn } = useAuth();
  const { isPremium } = useRevenueCat();
  // Cloud sync is a premium feature - free/guest users keep sessions local only.
  const canSync = isSignedIn && isPremium;

  const isSyncingRef = useRef(false);

  const syncQueue = useCallback(async () => {
    const syncState = useSyncStore.getState();
    const pendingSessions = syncState.pendingSessions;

    if (isSyncingRef.current || pendingSessions.length === 0 || !canSync) return;
    
    const state = await NetInfo.fetch();
    if (!state.isConnected) return;

    isSyncingRef.current = true;
    let syncSuccessCount = 0;
    let syncFailCount = 0;
    
    // Exponential backoff logic - drop anything still cooling down before
    // it even goes into the batch call.
    const sessionsToSync = pendingSessions.filter((session) => {
      if (session.retryCount > 0 && session.lastRetryAt) {
        const backoffMs = Math.min(1000 * Math.pow(2, session.retryCount), 1000 * 60 * 60); // Max 1 hour delay
        if (Date.now() - session.lastRetryAt < backoffMs) {
          return false;
        }
      }
      return true;
    });

    if (sessionsToSync.length > 0) {
      analytics.track('sync_started', { pendingCount: sessionsToSync.length });

      try {
        const results = await createSessions({
          sessions: sessionsToSync.map((session) => ({
            clientSessionId: session.clientSessionId,
            exerciseId: session.exerciseId,
            exerciseType: session.exerciseType,
            startedAt: session.startedAt,
            completedAt: session.completedAt,
            durationMs: session.durationMs,
            difficulty: session.difficulty,
            score: session.score,
            metrics: session.metrics,
            algorithmVersion: session.algorithmVersion,
          })),
        });

        results.forEach((result, i) => {
          const session = sessionsToSync[i];

          if ('error' in result) {
            captureException(new Error(result.error), { context: 'SyncProvider.syncQueue', clientSessionId: session.clientSessionId, retryCount: session.retryCount });
            syncState.incrementRetryCount(session.clientSessionId);
            syncFailCount++;
            return;
          }

          // The mutation returns this sentinel (without writing anything)
          // when Convex doesn't see an authenticated identity yet - this can
          // happen right after sign-in while the Convex client is still
          // attaching its auth token. Treat it as a retryable failure instead
          // of removing the session, otherwise it's dropped from the queue
          // as if synced while nothing was ever written server-side.
          if (result.sessionId === 'offline-pending') {
            syncState.incrementRetryCount(session.clientSessionId);
            syncFailCount++;
            return;
          }

          if (result.gamification) {
            const { unlockedAchievements } = result.gamification;
            unlockedAchievements.forEach((achId: string) => {
              const achDef = ACHIEVEMENTS[achId];
              if (achDef) {
                addAchievement({
                  id: achDef.id,
                  title: achDef.title,
                  icon: achDef.icon,
                });
              }
            });
          }

          // Successfully synced
          syncState.removeSession(session.clientSessionId);
          useLocalHistoryStore.getState().markSynced(session.clientSessionId);
          syncSuccessCount++;
        });
      } catch (error: unknown) {
        // Whole batch call failed (e.g. network dropped mid-request) -
        // retry every session that was in it.
        captureException(error, { context: 'SyncProvider.syncQueue', pendingCount: sessionsToSync.length });
        sessionsToSync.forEach((session) => {
          syncState.incrementRetryCount(session.clientSessionId);
        });
        syncFailCount += sessionsToSync.length;
      }
    }

    if (syncSuccessCount > 0) {
      analytics.track('sync_completed', { successCount: syncSuccessCount, failCount: syncFailCount });
    } else if (syncFailCount > 0) {
      analytics.track('sync_failed', { failCount: syncFailCount });
    }

    isSyncingRef.current = false;
  }, [createSessions, addAchievement, canSync]);

  // Listen to network changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable !== false) {
        syncQueue();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [syncQueue]);

  // Backfill: a user who exercised while free (or signed out) has that
  // history only on the device. The moment they can sync, push whatever is
  // still unsynced inside the local retention window up to Convex, so
  // upgrading to premium doesn't start their cloud history from zero.
  useEffect(() => {
    if (!canSync) return;

    const { sessions } = useLocalHistoryStore.getState();
    const syncState = useSyncStore.getState();
    const queuedIds = new Set(
      syncState.pendingSessions.map((s) => s.clientSessionId),
    );

    for (const session of sessions) {
      if (session.synced || queuedIds.has(session.clientSessionId)) continue;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { synced, ...pending } = session;
      syncState.addSession(pending);
    }
  }, [canSync]);

  // Trigger sync if we have pending items or when login/premium state changes
  useEffect(() => {
    if (pendingSessionsLength > 0 && canSync) {
      syncQueue();
    }
  }, [pendingSessionsLength, canSync, syncQueue]);

  // Periodic interval just in case
  useEffect(() => {
    const interval = setInterval(() => {
      if (canSync) syncQueue();
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [syncQueue, canSync]);

  // Trigger sync when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && canSync) {
        syncQueue();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [syncQueue, canSync]);

  return <>{children}</>;
}
