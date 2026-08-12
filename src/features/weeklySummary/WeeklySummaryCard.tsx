import { Card, H4, Text, XStack, YStack, Button } from 'tamagui';
import { useRouter, Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useWeeklySummary } from './useWeeklySummary';
import { Track } from '@/components/ui/track/Track';
import { buildTrackFromDailyTrends } from '@/components/ui/track/trackLayout';

const TRACK_DAYS = 14;

export function WeeklySummaryCard() {
  const router = useRouter();
  const { t } = useTranslation('weeklySummary');
  const { summary, dailyTrends, now, timeZone, isLoading } = useWeeklySummary();

  if (isLoading || !summary) return null;

  const handlePress = () => router.push('/(app)/weekly-summary' as Href);

  const trackData = buildTrackFromDailyTrends(dailyTrends ?? [], TRACK_DAYS, timeZone, now);
  const rangeStartLabel = new Date(now - (TRACK_DAYS - 1) * 86400000)
    .toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });

  const trackSection = (
    <YStack gap="$2">
      <XStack justifyContent="space-between" alignItems="baseline">
        <Text fontSize="$1" color="$color11" letterSpacing={0.6} textTransform="uppercase">
          Son {TRACK_DAYS} Gün
        </Text>
        <Text fontSize="$1" color="$color11">yükseklik: hız · dolgu: kavrama</Text>
      </XStack>
      <Track data={trackData} size="expanded" />
      <XStack justifyContent="space-between">
        <Text fontSize="$1" color="$color11">{rangeStartLabel}</Text>
        <Text fontSize="$1" color="$color">bugün</Text>
      </XStack>
    </YStack>
  );

  if (summary.isEmpty) {
    return (
      <Card padding="$4" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover" elevation="$1" onPress={handlePress}>
        <YStack gap="$4">
          {trackSection}
          <YStack gap="$2">
            <H4>{t('card.emptyTitle')}</H4>
            <Text color="$color11" fontSize="$2">{t('card.emptyBody')}</Text>
            <Button size="$3" theme="accent" onPress={handlePress}>{t('card.emptyCta')}</Button>
          </YStack>
        </YStack>
      </Card>
    );
  }

  return (
    <Card padding="$4" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover" elevation="$1" onPress={handlePress}>
      <YStack gap="$4">
        {trackSection}
        <YStack gap="$2">
          <H4>{t('card.title')}</H4>
          <Text fontSize="$5" fontWeight="bold">{t('card.minutes', { minutes: summary.totalMinutes })}</Text>
          {summary.wpmDeltaPercent !== null && (
            <Text color={summary.wpmDeltaPercent >= 0 ? '$green10' : '$color11'} fontSize="$3">
              {t(summary.wpmDeltaPercent >= 0 ? 'card.trendUp' : 'card.trendDown', {
                percent: Math.abs(summary.wpmDeltaPercent),
              })}
            </Text>
          )}
          {summary.streakDays > 0 && (
            <Text color="$color11" fontSize="$2">{t('card.streak', { days: summary.streakDays })}</Text>
          )}
        </YStack>
      </YStack>
    </Card>
  );
}
