import { Card, H4, Text, YStack, Button } from 'tamagui';
import { useRouter, Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useWeeklySummary } from './useWeeklySummary';

export function WeeklySummaryCard() {
  const router = useRouter();
  const { t } = useTranslation('weeklySummary');
  const { summary, isLoading } = useWeeklySummary();

  if (isLoading || !summary) return null;

  const handlePress = () => router.push('/(app)/weekly-summary' as Href);

  if (summary.isEmpty) {
    return (
      <Card padding="$4" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover" elevation="$1" onPress={handlePress}>
        <YStack gap="$2">
          <H4>{t('card.emptyTitle')}</H4>
          <Text color="$color11" fontSize="$2">{t('card.emptyBody')}</Text>
          <Button size="$3" theme="accent" onPress={handlePress}>{t('card.emptyCta')}</Button>
        </YStack>
      </Card>
    );
  }

  return (
    <Card padding="$4" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover" elevation="$1" onPress={handlePress}>
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
    </Card>
  );
}
