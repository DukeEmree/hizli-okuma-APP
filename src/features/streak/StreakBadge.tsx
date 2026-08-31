import React from 'react';
import { Text, XStack, useTheme } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { Flame, Snowflake } from 'lucide-react-native';
import { useStreakCacheStore } from "@/stores/streakCacheStore";

export function StreakBadge() {
  const { t } = useTranslation('common');
  const currentStreak = useStreakCacheStore((state) => state.currentStreak);
  const freezesAvailable = useStreakCacheStore((state) => state.freezesAvailable);
  const theme = useTheme();

  // A streak of zero is grey; ember is earned. The icons are Lucide rather
  // than the 🔥/❄️ emoji they replace - emoji render in the platform's own
  // style and weight, which is the one thing on screen the design system
  // cannot control.
  const isEarned = currentStreak > 0;

  // Without a grouped label a screen reader reads this as a bare "1" - the
  // number is meaningless without the unit the flame icon carries visually.
  return (
    <XStack
      accessible
      accessibilityRole="text"
      accessibilityLabel={
        freezesAvailable > 0
          ? t('streakBadgeWithFreeze', { days: currentStreak, freezes: freezesAvailable })
          : t('streakBadge', { days: currentStreak })
      }
      alignItems="center"
      backgroundColor={isEarned ? '$orange3' : '$backgroundHover'}
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius="$10"
      gap="$2"
    >
      <Flame
        size={16}
        color={(isEarned ? theme.orange11?.val : theme.color11?.val) as string}
      />
      <Text fontWeight="bold" color={isEarned ? '$orange11' : '$color11'}>
        {currentStreak}
      </Text>
      {freezesAvailable > 0 && (
        <XStack alignItems="center" gap="$1">
          <Snowflake size={13} color={theme.color11?.val as string} />
          <Text fontSize="$2" fontWeight="bold" color="$color11">{freezesAvailable}</Text>
        </XStack>
      )}
    </XStack>
  );
}
