import React, { useEffect, useRef, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useSyncStore } from "@/stores/syncStore";
import { useMutation } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { useAuth } from '@clerk/clerk-expo';
import { useGamificationStore } from "@/stores/gamificationStore";
import { ACHIEVEMENTS } from "@/constants/gamification";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { pendingSessions, removeSession, incrementRetryCount } = useSyncStore();
  const createSession = useMutation(api.exerciseSessions.createSession);
  const addAchievement = useGamificationStore((state) => state.addAchievement);
  const { isSignedIn } = useAuth();

  const isSyncingRef = useRef(false);

  const syncQueue = useCallback(async () => {
    if (isSyncingRef.current || pendingSessions.length === 0 || !isSignedIn) return;
    
    const state = await NetInfo.fetch();
    if (!state.isConnected) return;

    isSyncingRef.current = true;

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
        removeSession(session.clientSessionId);
      } catch (error: any) {
        // Increment retry if network otherwise if it's a fatal error (like schema mismatch), we might want to drop it
        // But for safety, we just increment retry count. Convex usually throws for application errors.
        incrementRetryCount(session.clientSessionId);
        // Break out of the loop to try again later if the network went down
        const currentState = await NetInfo.fetch();
        if (!currentState.isConnected) {
          break;
        }
      }
    }

    isSyncingRef.current = false;
  }, [pendingSessions, createSession, removeSession, incrementRetryCount, addAchievement, isSignedIn]);

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
    if (pendingSessions.length > 0 && isSignedIn) {
      syncQueue();
    }
  }, [pendingSessions.length, isSignedIn, syncQueue]);

  // Periodic interval just in case
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSignedIn) syncQueue();
    }, 15000); // Check every 15 seconds
    
    return () => clearInterval(interval);
  }, [syncQueue, isSignedIn]);

  return <>{children}</>;
}
