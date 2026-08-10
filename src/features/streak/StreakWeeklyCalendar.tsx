import React from 'react';
import { Text, XStack, YStack, Circle } from 'tamagui';
import { useQuery } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { getLocalDateString } from "@/utils/streak";
import { useTranslation } from 'react-i18next';

export function StreakWeeklyCalendar() {
  const { t } = useTranslation();
  const stats = useQuery(api.statistics.getPerformanceStats, { timeRange: '7d' });
  
  if (!stats) return null;

  // Generate last 7 days strings
  const today = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const last7Days: { dateStr: string; label: string; isActive: boolean }[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = getLocalDateString(d.getTime(), timeZone);
    const label = d.toLocaleDateString('tr-TR', { weekday: 'short' }).charAt(0).toUpperCase(); // P, S, Ç vs.
    
    // Check if this date exists in stats.dailyTrends
    const isActive = stats.dailyTrends.some(trend => trend.date === dateStr);
    
    last7Days.push({ dateStr, label, isActive });
  }

  return (
    <YStack backgroundColor="$backgroundHover" padding="$4" borderRadius="$4" gap="$3">
      <Text fontWeight="bold">{t('streak.weekly_activity', 'Son 7 Günlük Aktivite')}</Text>
      <XStack justifyContent="space-between" paddingHorizontal="$2">
        {last7Days.map((day, index) => (
          <YStack key={index} alignItems="center" gap="$2">
            <Circle 
              size={32} 
              backgroundColor={day.isActive ? '$orange9' : '$gray5'} 
              borderWidth={2}
              borderColor={day.isActive ? '$orange10' : 'transparent'}
            >
              {day.isActive && <Text fontSize={16}>🔥</Text>}
            </Circle>
            <Text fontSize={12} color="$color11">{day.label}</Text>
          </YStack>
        ))}
      </XStack>
    </YStack>
  );
}
