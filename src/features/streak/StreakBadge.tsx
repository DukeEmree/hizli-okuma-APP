import React from 'react';
import { View } from 'react-native';
import { Text, XStack } from 'tamagui';
import { useQuery } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { analytics } from "@/lib/analytics";
import { useEffect, useRef } from 'react';
import { useStreakCacheStore } from "@/stores/streakCacheStore";

export function StreakBadge() {
  const streak = useQuery(api.streaks.getStreak);
  const cachedStreak = useStreakCacheStore((state) => state);
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
      });
    }
  }, [streak, updateCache]);

  const displayStreak = streak ? streak.currentStreak : cachedStreak.currentStreak;

  if (displayStreak === 0 && !streak) {
    return (
      <XStack alignItems="center" backgroundColor="$backgroundHover" paddingHorizontal="$3" paddingVertical="$2" borderRadius="$10" gap="$2">
        <Text fontSize={16}>🔥</Text>
        <Text fontWeight="bold">0</Text>
      </XStack>
    );
  }

  return (
    <XStack alignItems="center" backgroundColor="$orange3" paddingHorizontal="$3" paddingVertical="$2" borderRadius="$10" gap="$2">
      <Text fontSize={16}>🔥</Text>
      <Text fontWeight="bold" color="$orange10">{displayStreak}</Text>
    </XStack>
  );
}
