import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, H2, H4, Text, Button, View, ScrollView, useTheme } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Dumbbell, Brain, Eye, Zap, Lock, BookOpen } from 'lucide-react-native';

import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { buildLocalStats } from '@/utils/localStatistics';

import { exerciseRegistry } from '@/features/exercises/registry';
// Egzersizler registry'den otomatik geliyor

import { ExerciseDefinition } from '@/types/exercise';
import { AppCard } from '@/components/ui/AppCard';
import { contentColumn, TAB_BAR_INSET } from '@/constants/layout';


const CATEGORY_ICONS: Record<string, any> = {
  reading: BookOpen,
  focus: Eye,
  comprehension: Brain,
  vision: Eye,
  memory: Zap,
};

// Module-level so the offset survives this screen unmounting while an
// exercise is pushed on top of it, and is restored when the user comes back.
let savedExercisesScrollY = 0;

export default function ExercisesScreen() {
  const { t } = useTranslation('exercises');
  const router = useRouter();
  const { isPremium } = useRevenueCat();
  const theme = useTheme();

  // Computed straight from local history, the same way the statistics tab
  // does it. This used to read a `useStatisticsStore` cache that nothing ever
  // populated, so the per-exercise "En İyi" badge below never rendered.
  const localSessions = useLocalHistoryStore(state => state.sessions);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const allStats = useMemo(
    () => buildLocalStats(localSessions, 'all', undefined, timeZone),
    [localSessions, timeZone],
  );

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  useEffect(() => {
    if (savedExercisesScrollY <= 0) return;
    const id = requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: savedExercisesScrollY, animated: false });
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const allExercises = exerciseRegistry.getAll();
  
  const filteredExercises = activeCategory === 'all' 
    ? allExercises 
    : allExercises.filter(ex => ex.category === activeCategory);

  const categories = ['all', ...Array.from(new Set(allExercises.map(ex => ex.category)))];

  const handlePress = (exercise: ExerciseDefinition) => {
    // Free users can only run exercises through the daily-plan list, in
    // order - picking any exercise standalone from this tab is a premium
    // perk, regardless of that exercise's own isPremium flag.
    if (!isPremium) {
      router.push('/paywall');
      return;
    }
    router.push(`/exercise/${exercise.id}`);
  };

  const getExerciseStat = (type: string) =>
    allStats.exerciseStats.find(s => s.type === type) || null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
      <ScrollView
        ref={scrollRef}
        flex={1}
        backgroundColor="$background"
        contentContainerStyle={{ paddingBottom: TAB_BAR_INSET }}
        scrollEventThrottle={16}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => { savedExercisesScrollY = e.nativeEvent.contentOffset.y; }}
      >

        <YStack padding="$4" gap="$4" {...contentColumn}>
          
          <YStack gap="$2">
            <H2>{t('title')}</H2>
            <Text color="$color11">{t('subtitle')}</Text>
          </YStack>

          {/* Categories Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
            <XStack gap="$2">
              {categories.map(cat => (
                <Button
                  key={cat}
                  size="$4.5"
                  theme={activeCategory === cat ? 'accent' : undefined}
                  variant={activeCategory === cat ? undefined : 'outlined'}
                  onPress={() => setActiveCategory(cat)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: activeCategory === cat, checked: activeCategory === cat }}
                  accessibilityLabel={t('a11y.categoryFilter', { category: t(`categories.${cat}`, cat) })}
                >
                  {t(`categories.${cat}`, cat)}
                </Button>
              ))}
            </XStack>
          </ScrollView>

          {/* Exercises List */}
          {filteredExercises.length === 0 ? (
            <YStack padding="$6" alignItems="center" justifyContent="center" gap="$3">
              <Dumbbell size={48} color={theme.color11?.val as string} opacity={0.5} />
              <H4>{t('labels.emptyState')}</H4>
            </YStack>
          ) : (
            <YStack gap="$4">
              {filteredExercises.map(exercise => {
                const IconComponent = CATEGORY_ICONS[exercise.category] || Dumbbell;
                const isLocked = !isPremium;
                const stat = getExerciseStat(exercise.type);

                const name = t(exercise.nameKey, exercise.type);
                const categoryLabel = t(`categories.${exercise.category}`, exercise.category);
                const bestScore = stat && stat.bestScore > 0 ? stat.bestScore : null;

                return (
                  <AppCard
                    key={exercise.id}
                    onPress={() => handlePress(exercise)}
                    pressStyle={{ scale: 0.98 }}
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={
                      bestScore !== null
                        ? t('a11y.exerciseCardBest', { name, category: categoryLabel, score: bestScore })
                        : t('a11y.exerciseCard', { name, category: categoryLabel })
                    }
                    accessibilityHint={isLocked ? t('a11y.lockedHint') : t('a11y.openExercise')}
                  >
                    <XStack gap="$3" alignItems="flex-start">
                      
                      {/* Icon Container. Radix step 3 as the ground and step 11
                          as the glyph is the pairing the scale is built for -
                          the old accent10 glyph was a mid-lightness teal on a
                          pale mint tile, well under the 3:1 icons need. */}
                      <View backgroundColor="$green3" padding="$3" borderRadius="$3">
                        <IconComponent color={theme.green11?.val as string} size={24} />
                      </View>

                      {/* Content Container */}
                      <YStack flex={1} gap="$1">
                        <XStack alignItems="center" gap="$2" flexWrap="wrap">
                          <H4 numberOfLines={1}>{name}</H4>
                          {exercise.isPremium && (
                            <View backgroundColor="$green3" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$4">
                              <Text fontSize="$1" color="$green11" fontWeight="bold">PRO</Text>
                            </View>
                          )}
                        </XStack>
                        <Text color="$color11" fontSize="$4" numberOfLines={2}>
                          {t(exercise.descriptionKey, '')}
                        </Text>
                        
                        {/* Stats / Info Row */}
                        <XStack gap="$3" marginTop="$2" flexWrap="wrap">
                          <Text fontSize="$2" color="$color11">
                            {categoryLabel}
                          </Text>
                          {bestScore !== null && (
                            <Text fontSize="$2" color="$green10" fontWeight="bold">
                              {t('labels.best')} {bestScore}
                            </Text>
                          )}
                        </XStack>
                      </YStack>

                      {/* Action affordance, deliberately not a Button: the whole
                          card is already the touch target for the same action, and
                          a nested pressable made the row two stops in the TalkBack
                          traversal - the second of them unlabelled. */}
                      <View justifyContent="center" alignItems="center" paddingTop="$1">
                        {isLocked ? (
                          <Lock color={theme.color11?.val as string} size={20} />
                        ) : (
                          <View
                            width={48}
                            height={48}
                            borderRadius={24}
                            backgroundColor="$accent2"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Zap color={theme.accent11?.val as string} size={20} />
                          </View>
                        )}
                      </View>
                      
                    </XStack>
                  </AppCard>
                );
              })}
            </YStack>
          )}

        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
