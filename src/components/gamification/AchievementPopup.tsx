import React, { useCallback, useEffect, useState } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { XStack, YStack, Text, H4 } from 'tamagui';
import { useGamificationStore, AchievementPopupData } from "@/stores/gamificationStore";
import { analytics } from "@/lib/analytics";
import { AppCard } from '@/components/ui/AppCard';

/** How far above its resting position the card sits while hidden. */
const OFFSCREEN_Y = -160;
const HOLD_MS = 3000;

export function AchievementPopupGlobal() {
  const { t } = useTranslation('progress');
  const insets = useSafeAreaInsets();
  const pendingAchievements = useGamificationStore(state => state.pendingAchievements);
  const removeAchievement = useGamificationStore(state => state.removeAchievement);
  const [current, setCurrent] = useState<AchievementPopupData | null>(null);

  const translateY = useSharedValue(OFFSCREEN_Y);
  const opacity = useSharedValue(0);

  const handleHide = useCallback((id: string) => {
    removeAchievement(id);
    setCurrent(null);
  }, [removeAchievement]);

  const showNext = useCallback(() => {
    if (pendingAchievements.length > 0 && !current) {
      const nextAch = pendingAchievements[0];
      setCurrent(nextAch);

      analytics.track('achievement_unlocked', { achievementId: nextAch.id });

      // Rests at 0 and the safe-area offset lives on the container instead, so
      // the card clears the status bar and any display cutout on every device
      // rather than the one the hardcoded 50px offset happened to suit.
      // eslint-disable-next-line react-hooks/immutability
      opacity.value = withTiming(1, { duration: 300 });
      // eslint-disable-next-line react-hooks/immutability
      translateY.value = withTiming(0, { duration: 500 }, () => {
        translateY.value = withDelay(HOLD_MS, withTiming(OFFSCREEN_Y, { duration: 500 }, () => {
          opacity.value = withTiming(0, { duration: 300 }, () => {
            runOnJS(handleHide)(nextAch.id);
          });
        }));
      });
    }
  }, [pendingAchievements, current, opacity, translateY, handleHide]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    showNext();
  }, [showNext]);

  useEffect(() => {
    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
    };
  }, [opacity, translateY]);


  // A celebration that only leaves on a timer is a celebration you cannot get
  // out of the way of. Tapping cancels the queued exit and runs a short one.
  const handleDismiss = useCallback(() => {
    if (!current) return;
    const id = current.id;
    cancelAnimation(translateY);
    cancelAnimation(opacity);
    // eslint-disable-next-line react-hooks/immutability
    translateY.value = withTiming(OFFSCREEN_Y, { duration: 200 });
    // eslint-disable-next-line react-hooks/immutability
    opacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(handleHide)(id);
    });
  }, [current, handleHide, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!current) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        {
          position: 'absolute',
          top: insets.top + 8,
          left: 16,
          right: 16,
          zIndex: 9999,
        },
        animatedStyle,
      ]}
    >
      {/* assertive, not polite: the popup self-dismisses in a few seconds, and
          a queued announcement would arrive after it is already gone. */}
      <AppCard
        lift="overlay"
        borderColor="$green7"
        backgroundColor="$green3"
        onPress={handleDismiss}
        pressStyle={{ scale: 0.98 }}
        accessible
        accessibilityRole="alert"
        accessibilityLiveRegion="assertive"
        accessibilityLabel={t('achievement.a11yAnnounce', { title: current.title })}
        accessibilityHint={t('achievement.dismiss')}
      >
        <XStack gap="$3" alignItems="center">
          <Text fontSize="$10">{current.icon}</Text>
          <YStack flex={1}>
            <Text color="$green11" fontSize="$2" fontWeight="bold">
              {t('achievement.unlocked')}
            </Text>
            <H4 color="$green11">{current.title}</H4>
          </YStack>
        </XStack>
      </AppCard>
    </Animated.View>
  );
}
