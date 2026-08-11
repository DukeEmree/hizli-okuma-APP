import React from 'react';
import { Text, XStack } from 'tamagui';
import { useQuery } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { analytics } from "@/lib/analytics";
import { useEffect, useRef } from 'react';
import { useStreakCacheStore } from "@/stores/streakCacheStore";
import { useRevenueCat } from "@/providers/RevenueCatProvider";

export function StreakBadge() {
  const { isPremium } = useRevenueCat();
  // Streak is tracked server-side and is premium-only - free/guest users
  // fall back to the last cached value (0 if they've never been premium).
  const streak = useQuery(api.streaks.getStreak, isPremium ? {} : "skip");
  const currentStreak = useStreakCacheStore((state) => state.currentStreak);
  const cachedFreezes = useStreakCacheStore((state) => state.freezesAvailable);
  const updateCache = useStreakCacheStore((state) => state.updateCache);
  const prevStreakRef = useRef<number | null>(null);

  useEffect(() => {
    if (streak && prevStreakRef.current !== null) {
      if (streak.currentStreak > prevStreakRef.current) {
        analytics.track('streak_achieved', { streak: streak.currentStreak });
      }
    }
    if (streak) {
      prevStreakRef.current = streak.currentStreak;
      updateCache({
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastActivityAt: streak.lastActivityAt,
        freezesAvailable: streak.freezesAvailable ?? 0,
      });
    }
  }, [streak, updateCache]);

  const displayStreak = streak ? streak.currentStreak : currentStreak;
  // Banked streak freezes. Showing them is what makes the safety net feel
  // real - an invisible freeze doesn't stop anyone from giving up.
  const displayFreezes = streak ? (streak.freezesAvailable ?? 0) : cachedFreezes;

  if (displayStreak === 0 && !streak) {
    return (
      <XStack alignItems="center" backgroundColor="$backgroundHover" paddingHorizontal="$3" paddingVertical="$2" borderRadius="$10" gap="$2">
        <Text fontSize="$5">🔥</Text>
        <Text fontWeight="bold">0</Text>
      </XStack>
    );
  }

  return (
    <XStack alignItems="center" backgroundColor="$orange3" paddingHorizontal="$3" paddingVertical="$2" borderRadius="$10" gap="$2">
      <Text fontSize="$5">🔥</Text>
      <Text fontWeight="bold" color="$orange10">{displayStreak}</Text>
      {displayFreezes > 0 && (
        <XStack alignItems="center" gap="$1">
          <Text fontSize="$3">❄️</Text>
          <Text fontSize="$2" fontWeight="bold" color="$color11">{displayFreezes}</Text>
        </XStack>
      )}
    </XStack>
  );
}
