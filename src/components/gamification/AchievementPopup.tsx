import React, { useEffect, useState, useCallback } from 'react';
import { Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  runOnJS 
} from 'react-native-reanimated';
import { Card, XStack, YStack, Text, H4 } from 'tamagui';
import { useGamificationStore, AchievementPopupData } from "@/stores/gamificationStore";
import { analytics } from "@/lib/analytics";

const { width } = Dimensions.get('window');

export function AchievementPopupGlobal() {
  const pendingAchievements = useGamificationStore(state => state.pendingAchievements);
  const removeAchievement = useGamificationStore(state => state.removeAchievement);
  const [current, setCurrent] = useState<AchievementPopupData | null>(null);

  const translateY = useSharedValue(-100);
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

      // eslint-disable-next-line react-hooks/immutability
      opacity.value = withTiming(1, { duration: 300 });
      // eslint-disable-next-line react-hooks/immutability
      translateY.value = withTiming(50, { duration: 500 }, () => {
        // Animate out after delay
        translateY.value = withDelay(3000, withTiming(-100, { duration: 500 }, () => {
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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
      position: 'absolute',
      top: 0,
      left: 16,
      width: width - 32,
      zIndex: 9999,
    };
  });

  if (!current) return null;

  return (
    <Animated.View style={animatedStyle}>
      <Card padding="$4" borderWidth={1} borderColor="$green7" backgroundColor="$green3" elevation="$4">
        <XStack gap="$3" alignItems="center">
          <Text fontSize="$10">{current.icon}</Text>
          <YStack flex={1}>
            <Text color="$green11" fontSize="$2" fontWeight="bold">YENİ BAŞARIM KİLİDİ AÇILDI!</Text>
            <H4 color="$green11">{current.title}</H4>
          </YStack>
        </XStack>
      </Card>
    </Animated.View>
  );
}
