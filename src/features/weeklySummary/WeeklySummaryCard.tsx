import { H4, Text, YStack } from 'tamagui';
import { useRouter, Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useWeeklySummary } from './useWeeklySummary';
import { Track } from '@/components/ui/track/Track';
import { buildTrackFromDailyTrends } from '@/components/ui/track/trackLayout';
import { AppCard } from '@/components/ui/AppCard';

const TRACK_DAYS = 14;

export function WeeklySummaryCard() {
  const router = useRouter();
  const { t } = useTranslation('weeklySummary');
  const { summary, dailyTrends, now, timeZone, isLoading } = useWeeklySummary();

  if (isLoading || !summary) return null;

  const handlePress = () => router.push('/(app)/weekly-summary' as Href);

  const trackData = buildTrackFromDailyTrends(dailyTrends ?? [], TRACK_DAYS, timeZone, now);
  const latestWpm = trackData[trackData.length - 1]?.value ?? null;

  // The Track is the one thing on this card a screen reader cannot infer, and
  // the card is a single tap target, so its label carries the Track's meaning
  // rather than leaving the chart as an unlabelled node inside a button.
  const trackLabel =
    latestWpm === null
      ? t('a11y.trackEmpty', { days: TRACK_DAYS })
      : t('a11y.track', { days: TRACK_DAYS, wpm: latestWpm });

  // The Track carried four labels: a range heading, a legend, and a date at
  // each end. Three of those are an axis and a legend on a component the
  // design system says has neither - "a texture that rewards a two-second
  // glance", not a plotted chart. The heading names what you are looking at
  // and stays; the rest explained a two-tone bar that teaches itself, and the
  // spoken label below still carries all of it for a screen reader.
  const trackSection = (
    <YStack gap="$2">
      <Text fontSize="$1" color="$color11" letterSpacing={0.6} fontWeight="bold">
        {t('track.rangeLabel', { days: TRACK_DAYS })}
      </Text>
      {/* `live` so the bar for a session finished this minute grows into place
          instead of appearing between renders - the visible "today counted". */}
      <Track data={trackData} size="expanded" live />
    </YStack>
  );

  if (summary.isEmpty) {
    return (
      <AppCard
        onPress={handlePress}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${trackLabel} ${t('card.emptyTitle')}. ${t('a11y.openSummary')}`}
      >
        <YStack gap="$4">
          {trackSection}
          <YStack gap="$2">
            <H4>{t('card.emptyTitle')}</H4>
            <Text color="$color11" fontSize="$2">{t('card.emptyBody')}</Text>
          </YStack>
        </YStack>
      </AppCard>
    );
  }

  return (
    <AppCard
      onPress={handlePress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${trackLabel} ${t('card.title')}: ${t('card.minutes', { minutes: summary.totalMinutes })}. ${t('a11y.openSummary')}`}
    >
      <YStack gap="$4">
        {trackSection}
        {/* Minutes only. The streak is already in the badge at the top of this
            screen and the speed delta is already on the today line, so stating
            either again here was the same fact twice in one scroll. Both are
            one tap away, in full, on the weekly screen this card opens. */}
        <YStack gap="$2">
          <H4>{t('card.title')}</H4>
          <Text fontSize="$5" fontWeight="bold">{t('card.minutes', { minutes: summary.totalMinutes })}</Text>
        </YStack>
      </YStack>
    </AppCard>
  );
}
