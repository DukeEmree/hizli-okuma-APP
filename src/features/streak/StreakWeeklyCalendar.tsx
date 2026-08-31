import React from 'react';
import { Text, XStack, YStack, Circle, useTheme } from 'tamagui';
import { Flame } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { getLocalDateString } from "@/utils/streak";
import { useLocalHistoryStore } from "@/stores/localHistoryStore";
import { buildLocalStats } from "@/utils/localStatistics";
import { useTodayMs } from "@/hooks/useTodayMs";
import { AppCard } from "@/components/ui/AppCard";

export function StreakWeeklyCalendar() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const localSessions = useLocalHistoryStore((s) => s.sessions);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const now = useTodayMs(timeZone);
  const stats = buildLocalStats(localSessions, '7d', now, timeZone);

  const last7Days: { dateStr: string; label: string; isActive: boolean }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000);
    const dateStr = getLocalDateString(d.getTime(), timeZone);
    // Locale-aware on both halves: the weekday name follows the active
    // language, and the initial is uppercased with that language's rules
    // rather than the platform default, which turns a Turkish `i` into `I`
    // where the language requires `İ`.
    const label = d
      .toLocaleDateString(i18n.language, { weekday: 'short' })
      .charAt(0)
      .toLocaleUpperCase(i18n.language);

    const isActive = stats.dailyTrends.some(trend => trend.date === dateStr);

    last7Days.push({ dateStr, label, isActive });
  }

  const activeCount = last7Days.filter((d) => d.isActive).length;

  return (
    <AppCard gap="$3">
      <Text fontWeight="bold">{t('streak.weeklyActivity')}</Text>
      {/* Seven one-letter labels read as "P S Ç P C C P" on their own, so the
          row is grouped behind a single spoken summary. */}
      <XStack
        justifyContent="space-between"
        paddingHorizontal="$2"
        accessible
        accessibilityRole="text"
        accessibilityLabel={t('streak.weeklyActivityA11y', { active: activeCount })}
      >
        {last7Days.map((day) => (
          <YStack key={day.dateStr} alignItems="center" gap="$2">
            {/* Ember only where the day was earned; an inactive day is the
                neutral ramp, matching StreakBadge's grey-until-earned rule.
                The glyph is Lucide, not the 🔥 emoji it replaces, so it takes
                the design system's weight instead of the platform's. */}
            <Circle
              size={32}
              backgroundColor={day.isActive ? '$orange9' : '$backgroundHover'}
              borderWidth={1}
              borderColor={day.isActive ? '$orange9' : '$borderColor'}
            >
              {day.isActive && <Flame size={16} color={theme.orange1?.val as string} />}
            </Circle>
            <Text fontSize="$2" color="$color11">{day.label}</Text>
          </YStack>
        ))}
      </XStack>
    </AppCard>
  );
}
