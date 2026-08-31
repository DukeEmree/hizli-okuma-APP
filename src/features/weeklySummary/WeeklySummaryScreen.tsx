import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, Text, H2, H4, Button, Spinner, View } from 'tamagui';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useWeeklySummary } from './useWeeklySummary';
import { AppCard } from '@/components/ui/AppCard';
import { contentColumn } from '@/constants/layout';

export function WeeklySummaryScreen() {
  const router = useRouter();
  const { t } = useTranslation('weeklySummary');
  const { summary, isLoading } = useWeeklySummary();

  if (isLoading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" />
      </View>
    );
  }

  if (!summary) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
      <YStack flex={1} backgroundColor="$background" padding="$4" gap="$4" {...contentColumn}>
        <H2>{t('screen.title')}</H2>
        <Text color="$color11">{t('screen.range', { start: summary.weekStartDate, end: summary.weekEndDate })}</Text>

        {summary.isEmpty ? (
          <AppCard>
            <YStack gap="$2">
              <H4>{t('card.emptyTitle')}</H4>
              <Text color="$color11">{t('card.emptyBody')}</Text>
            </YStack>
          </AppCard>
        ) : (
          <YStack gap="$3">
            <AppCard>
              <Text color="$color11" fontSize="$2">{t('screen.minutesLabel')}</Text>
              <Text fontSize="$8" fontWeight="bold">{summary.totalMinutes}</Text>
            </AppCard>
            <AppCard>
              <Text color="$color11" fontSize="$2">{t('screen.wpmLabel')}</Text>
              <Text fontSize="$8" fontWeight="bold">{summary.avgWpmThisWeek ?? '-'}</Text>
              {summary.wpmDeltaPercent !== null ? (
                <Text color={summary.wpmDeltaPercent >= 0 ? '$green10' : '$color11'}>
                  {t(summary.wpmDeltaPercent >= 0 ? 'card.trendUp' : 'card.trendDown', {
                    percent: Math.abs(summary.wpmDeltaPercent),
                  })}
                </Text>
              ) : (
                <Text color="$color11" fontSize="$2">{t('screen.noComparison')}</Text>
              )}
            </AppCard>
            <AppCard>
              <Text color="$color11" fontSize="$2">{t('screen.streakLabel')}</Text>
              <Text fontSize="$8" fontWeight="bold">{summary.streakDays}</Text>
            </AppCard>
          </YStack>
        )}

        <Button size="$5" theme="accent" onPress={() => router.replace('/(app)/(tabs)')}>
          {t('screen.completeWeekCta')}
        </Button>
      </YStack>
    </SafeAreaView>
  );
}
