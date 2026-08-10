import React, { useEffect, useRef, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useSyncStore } from "@/stores/syncStore";
import { useMutation } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { useAuth } from '@clerk/clerk-expo';
import { useGamificationStore } from "@/stores/gamificationStore";
import { ACHIEVEMENTS } from "@/constants/gamification";
import { AppState, AppStateStatus } from 'react-native';
import { analytics } from '@/lib/analytics';

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const pendingSessionsLength = useSyncStore((state) => state.pendingSessions.length);
  const createSession = useMutation(api.exerciseSessions.createSession);
  const addAchievement = useGamificationStore((state) => state.addAchievement);
  const { isSignedIn } = useAuth();

  const isSyncingRef = useRef(false);

  const syncQueue = useCallback(async () => {
    const syncState = useSyncStore.getState();
    const pendingSessions = syncState.pendingSessions;
    
    if (isSyncingRef.current || pendingSessions.length === 0 || !isSignedIn) return;
    
    const state = await NetInfo.fetch();
    if (!state.isConnected) return;

    isSyncingRef.current = true;
    let syncSuccessCount = 0;
    let syncFailCount = 0;
    
    analytics.track('sync_started', { pendingCount: pendingSessions.length });

    for (const session of pendingSessions) {
      // Exponential backoff logic
      if (session.retryCount > 0 && session.lastRetryAt) {
        const backoffMs = Math.min(1000 * Math.pow(2, session.retryCount), 1000 * 60 * 60); // Max 1 hour delay
        if (Date.now() - session.lastRetryAt < backoffMs) {
          continue; // Skip this session for now, wait for backoff
        }
      }

      try {
        const result = await createSession({
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
        });

        // The mutation returns this sentinel (without writing anything)
        // when Convex doesn't see an authenticated identity yet - this can
        // happen right after sign-in while the Convex client is still
        // attaching its auth token. Treat it as a retryable failure instead
        // of removing the session, otherwise it's dropped from the queue
        // as if synced while nothing was ever written server-side.
        if (result?.sessionId === 'offline-pending') {
          syncState.incrementRetryCount(session.clientSessionId);
          syncFailCount++;
          continue;
        }

        if (result && typeof result === 'object' && 'gamification' in result && result.gamification) {
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
        syncSuccessCount++;
      } catch (error: unknown) {
        // Increment retry if network otherwise if it's a fatal error (like schema mismatch), we might want to drop it
        // But for safety, we just increment retry count. Convex usually throws for application errors.
        syncState.incrementRetryCount(session.clientSessionId);
        syncFailCount++;
        // Break out of the loop to try again later if the network went down
        const currentState = await NetInfo.fetch();
        if (!currentState.isConnected) {
          break;
        }
      }
    }

    if (syncSuccessCount > 0) {
      analytics.track('sync_completed', { successCount: syncSuccessCount, failCount: syncFailCount });
    } else if (syncFailCount > 0) {
      analytics.track('sync_failed', { failCount: syncFailCount });
    }

    isSyncingRef.current = false;
  }, [createSession, addAchievement, isSignedIn]);

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

  // Trigger sync if we have pending items or when login state changes
  useEffect(() => {
    if (pendingSessionsLength > 0 && isSignedIn) {
      syncQueue();
    }
  }, [pendingSessionsLength, isSignedIn, syncQueue]);

  // Periodic interval just in case
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSignedIn) syncQueue();
    }, 15000); // Check every 15 seconds
    
    return () => clearInterval(interval);
  }, [syncQueue, isSignedIn]);

  // Trigger sync when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && isSignedIn) {
        syncQueue();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [syncQueue, isSignedIn]);

  return <>{children}</>;
}
