import React from 'react';
import { Text, XStack } from 'tamagui';
import { useStreakCacheStore } from "@/stores/streakCacheStore";

export function StreakBadge() {
  const currentStreak = useStreakCacheStore((state) => state.currentStreak);
  const freezesAvailable = useStreakCacheStore((state) => state.freezesAvailable);

  if (currentStreak === 0) {
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
      <Text fontWeight="bold" color="$orange10">{currentStreak}</Text>
      {freezesAvailable > 0 && (
        <XStack alignItems="center" gap="$1">
          <Text fontSize="$3">❄️</Text>
          <Text fontSize="$2" fontWeight="bold" color="$color11">{freezesAvailable}</Text>
        </XStack>
      )}
    </XStack>
  );
}
