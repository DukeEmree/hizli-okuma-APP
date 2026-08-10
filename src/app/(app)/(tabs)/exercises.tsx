import React, { useState } from 'react';
import { HEADER_RIGHT_SPACING } from '@/constants/layout';

import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, H2, H4, Text, Button, Card, View, ScrollView, useTheme } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Dumbbell, Brain, Eye, Zap, Lock, BookOpen } from 'lucide-react-native';

import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { useStatisticsStore } from '@/stores/useStatisticsStore';

import { exerciseRegistry } from '@/features/exercises/registry';
// Egzersizler registry'den otomatik geliyor

import { ExerciseDefinition } from '@/types/exercise';

const CATEGORY_ICONS: Record<string, any> = {
  reading: BookOpen,
  focus: Eye,
  comprehension: Brain,
  vision: Eye,
  memory: Zap,
};

export default function ExercisesScreen() {
  const { t } = useTranslation('exercises');
  const router = useRouter();
  const { isPremium } = useRevenueCat();
  const allStats = useStatisticsStore(state => state.stats['all']);
  const theme = useTheme();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const allExercises = exerciseRegistry.getAll();
  
  const filteredExercises = activeCategory === 'all' 
    ? allExercises 
    : allExercises.filter(ex => ex.category === activeCategory);

  const categories = ['all', ...Array.from(new Set(allExercises.map(ex => ex.category)))];

  const handlePress = (exercise: ExerciseDefinition) => {
    if (exercise.isPremium && !isPremium) {
      router.push('/paywall');
      return;
    }
    router.push(`/exercise/${exercise.id}`);
  };

  const getExerciseStat = (type: string) => {
    if (!allStats) return null;
    return allStats.exerciseStats.find(s => s.type === type) || null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
      <ScrollView flex={1} backgroundColor="$background">
        <YStack padding="$4" gap="$4">
          
          <YStack gap="$2" paddingRight={HEADER_RIGHT_SPACING}>
            <H2>{t('title', 'Egzersizler')}</H2>
            <Text color="$color11">{t('subtitle', 'Okuma hızını, kavramanı ve odağını geliştiren egzersizler.')}</Text>
          </YStack>

          {/* Categories Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
            <XStack gap="$2">
              {categories.map(cat => (
                <Button 
                  key={cat}
                  size="$3"
                  theme={activeCategory === cat ? 'accent' : undefined}
                  variant={activeCategory === cat ? undefined : 'outlined'}
                  onPress={() => setActiveCategory(cat)}
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
              <H4>{t('labels.emptyState', 'Henüz kullanılabilir egzersiz yok.')}</H4>
            </YStack>
          ) : (
            <YStack gap="$4">
              {filteredExercises.map(exercise => {
                const IconComponent = CATEGORY_ICONS[exercise.category] || Dumbbell;
                const isLocked = exercise.isPremium && !isPremium;
                const stat = getExerciseStat(exercise.type);

                return (
                  <Card 
                    key={exercise.id} 
                    padding="$4" 
                    borderWidth={1} 
                    borderColor="$borderColor" 
                    backgroundColor="$backgroundHover" 
                    elevation={1}
                    onPress={() => handlePress(exercise)}
                    pressStyle={{ scale: 0.98 }}
                  >
                    <XStack gap="$3" alignItems="flex-start">
                      
                      {/* Icon Container */}
                      <View backgroundColor="$blue4" padding="$3" borderRadius="$3">
                        <IconComponent color={theme.accent10?.val} size={24} />
                      </View>

                      {/* Content Container */}
                      <YStack flex={1} gap="$1">
                        <XStack alignItems="center" gap="$2" flexWrap="wrap">
                          <H4 numberOfLines={1}>{t(exercise.nameKey, exercise.type)}</H4>
                          {exercise.isPremium && (
                            <View backgroundColor="$blue4" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$4">
                              <Text fontSize="$1" color="$blue11" fontWeight="bold">PRO</Text>
                            </View>
                          )}
                        </XStack>
                        <Text color="$color11" fontSize="$4" numberOfLines={2}>
                          {t(exercise.descriptionKey, '')}
                        </Text>
                        
                        {/* Stats / Info Row */}
                        <XStack gap="$3" marginTop="$2" flexWrap="wrap">
                          <Text fontSize="$2" color="$color11">
                            {t(`categories.${exercise.category}`, exercise.category)}
                          </Text>
                          {stat && stat.bestScore > 0 && (
                            <Text fontSize="$2" color="$green10" fontWeight="bold">
                              {t('labels.best', 'En İyi:')} {stat.bestScore}
                            </Text>
                          )}
                        </XStack>
                      </YStack>

                      {/* Action Icon */}
                      <View justifyContent="center" alignItems="center" paddingTop="$1">
                        {isLocked ? (
                          <Lock color={theme.color11?.val as string} size={20} />
                        ) : (
                          <Button size="$3" theme="accent" circular icon={Zap} onPress={() => handlePress(exercise)} />
                        )}
                      </View>
                      
                    </XStack>
                  </Card>
                );
              })}
            </YStack>
          )}

        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
